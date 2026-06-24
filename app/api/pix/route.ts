import { type NextRequest, NextResponse } from "next/server"
import { createPixCharge } from "@/lib/pix"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amountCents, description, customer } = body ?? {}

    if (!amountCents || typeof amountCents !== "number") {
      return NextResponse.json({ error: "Valor inválido." }, { status: 400 })
    }
    if (!customer?.name || !customer?.email || !customer?.document || !customer?.phone) {
      return NextResponse.json(
        { error: "Dados do cliente incompletos (nome, e-mail, CPF e telefone são obrigatórios)." },
        { status: 400 },
      )
    }

    const charge = await createPixCharge({
      amountCents,
      description: description ?? "Pedido Camisa10",
      customer: {
        name: String(customer.name),
        email: String(customer.email),
        document: String(customer.document).replace(/\D/g, ""),
        phone: String(customer.phone).replace(/\D/g, ""),
      },
    })

    return NextResponse.json(charge)
  } catch (err) {
    console.error("[v0] Erro ao criar cobrança PIX:", err)
    return NextResponse.json({ error: "Não foi possível gerar o PIX. Tente novamente." }, { status: 500 })
  }
}
