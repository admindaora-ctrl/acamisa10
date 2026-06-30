import QRCode from "qrcode"

// =============================================================
// INTEGRAÇÃO DE PAGAMENTO PIX — paradisepags
//
// Configure no ambiente (Vars do v0 / Environment Variables da Vercel):
//   - PARADISEPAGS_SECRET_KEY -> sua Chave Secreta (sk_...) do painel
//
// Sem essa variável, o sistema cai em modo DEMONSTRAÇÃO (gera um QR
// apenas visual, sem cobrança real) para você testar o fluxo no preview.
//
// Docs: https://multi.paradisepags.com/documentation
// =============================================================

const API_BASE = "https://multi.paradisepags.com/api/v1"
const SECRET_KEY = process.env.PARADISEPAGS_SECRET_KEY

export type PixChargeStatus = "pending" | "paid" | "expired" | "canceled"

export type PixCharge = {
  id: string // transaction_id interno da Paradise (usado para consultar status)
  reference: string // sua referência única
  amountCents: number
  brCode: string // código copia-e-cola (qr_code)
  qrCodeDataUrl: string // imagem do QR em data URL
  expiresAt: string
  status: PixChargeStatus
}

export type CreatePixInput = {
  amountCents: number
  description: string
  customer: {
    name: string
    email: string
    document: string // CPF (apenas números)
    phone: string // DDD + número (apenas números)
  }
}

function isConfigured() {
  return Boolean(SECRET_KEY)
}

export async function createPixCharge(input: CreatePixInput): Promise<PixCharge> {
  if (isConfigured()) {
    return createRealPixCharge(input)
  }
  return createDemoPixCharge(input)
}

export async function getPixStatus(id: string): Promise<PixChargeStatus> {
  if (isConfigured()) {
    return getRealPixStatus(id)
  }
  return "pending"
}

// -------------------------------------------------------------
// Integração real com a Paradise
// -------------------------------------------------------------
async function createRealPixCharge(input: CreatePixInput): Promise<PixCharge> {
  const reference = `CAMISA10-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const res = await fetch(`${API_BASE}/transaction.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": SECRET_KEY as string,
    },
    body: JSON.stringify({
      amount: input.amountCents, // valor em centavos
      description: input.description,
      reference,
      // "api_externa" dispensa o cadastro de produtos (productHash) na plataforma
      source: "api_externa",
      customer: {
        name: input.customer.name,
        email: input.customer.email,
        document: input.customer.document,
        phone: input.customer.phone,
      },
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => "")
    throw new Error(`Falha ao criar cobrança PIX (${res.status}): ${detail}`)
  }

  const data = await res.json()

  if (data.status && data.status !== "success") {
    throw new Error(data.message ?? "Gateway recusou a criação da cobrança.")
  }

  const id = String(data.transaction_id ?? data.id ?? reference)
  const brCode: string = data.qr_code ?? data.pix_code ?? ""
  const base64: string | undefined = data.qr_code_base64
  const expiresAt: string = data.expires_at ?? new Date(Date.now() + 30 * 60_000).toISOString()

  const qrCodeDataUrl = base64
    ? base64.startsWith("data:")
      ? base64
      : `data:image/png;base64,${base64}`
    : await QRCode.toDataURL(brCode || id, { width: 320, margin: 1 })

  return {
    id,
    reference,
    amountCents: input.amountCents,
    brCode,
    qrCodeDataUrl,
    expiresAt,
    status: "pending",
  }
}

async function getRealPixStatus(id: string): Promise<PixChargeStatus> {
  const res = await fetch(`${API_BASE}/query.php?action=get_transaction&id=${encodeURIComponent(id)}`, {
    headers: { "X-API-Key": SECRET_KEY as string },
    cache: "no-store",
  })
  if (!res.ok) return "pending"
  const data = await res.json()
  return normalizeStatus(String(data.status ?? ""))
}

function normalizeStatus(status: string): PixChargeStatus {
  const s = status.toLowerCase()
  if (["approved", "paid", "completed", "succeeded"].includes(s)) return "paid"
  if (["expired"].includes(s)) return "expired"
  if (["canceled", "cancelled", "refused", "failed", "chargeback", "refunded"].includes(s)) return "canceled"
  return "pending"
}

// -------------------------------------------------------------
// Modo DEMONSTRAÇÃO (sem PARADISEPAGS_SECRET_KEY configurada)
// -------------------------------------------------------------
async function createDemoPixCharge(input: CreatePixInput): Promise<PixCharge> {
  const id = `demo_${Math.random().toString(36).slice(2, 10)}`
  const brCode = buildDemoBrCode(input.amountCents, id)
  const qrCodeDataUrl = await QRCode.toDataURL(brCode, { width: 320, margin: 1 })
  return {
    id,
    reference: id,
    amountCents: input.amountCents,
    brCode,
    qrCodeDataUrl,
    expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
    status: "pending",
  }
}

// Gera um payload no formato BR Code (EMV) apenas para visualização.
// NÃO é uma cobrança válida para pagamento real.
function buildDemoBrCode(amountCents: number, id: string) {
  const amount = (amountCents / 100).toFixed(2)
  const payload = [
    "00020126",
    "0014BR.GOV.BCB.PIX",
    "0136demo-chave-pix@camisa10.example",
    "52040000",
    "5303986",
    `54${String(amount.length).padStart(2, "0")}${amount}`,
    "5802BR",
    "5909CAMISA10",
    "6009SAO PAULO",
    `62${String(id.length + 4).padStart(2, "0")}05${String(id.length).padStart(2, "0")}${id}`,
    "6304",
  ].join("")
  return payload
}
