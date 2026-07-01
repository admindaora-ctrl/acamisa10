"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Check, Copy, Loader2, QrCode, ShieldCheck, CheckCircle2, Truck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { product, store, formatBRL } from "@/lib/store-config"

type Charge = {
  id: string
  brCode: string
  qrCodeDataUrl: string
  amountCents: number
  expiresAt: string | null
}

type Status = "form" | "loading" | "pix" | "paid"
type Step = "summary" | "delivery" | "payment"

const STEPS: { id: Step; label: string }[] = [
  { id: "summary", label: "Resumo" },
  { id: "delivery", label: "Entrega" },
  { id: "payment", label: "Pagamento" },
]

export function CheckoutClient() {
  const searchParams = useSearchParams()
  const size = searchParams.get("size") ?? "M"
  const isPromo = searchParams.get("promo") === "1"
  const effectivePixCents = isPromo ? product.offerPriceCents : product.pixPriceCents

  const [step, setStep] = useState<Step>("summary")
  const [status, setStatus] = useState<Status>("form")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [docNumber, setDocNumber] = useState("")
  const [phone, setPhone] = useState("")
  const [cep, setCep] = useState("")
  const [street, setStreet] = useState("")
  const [number, setNumber] = useState("")
  const [complement, setComplement] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [city, setCity] = useState("")
  const [uf, setUf] = useState("")
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)
  const [addressFound, setAddressFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [charge, setCharge] = useState<Charge | null>(null)
  const [copied, setCopied] = useState(false)

  const installment = product.priceCents / product.maxInstallments
  const currentStepIndex = STEPS.findIndex((s) => s.id === step)

  async function lookupCep(rawCep: string) {
    const digits = rawCep.replace(/\D/g, "")
    setCepError(null)
    setAddressFound(false)
    if (digits.length !== 8) return
    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (data?.erro) {
        setCepError("CEP não encontrado. Verifique e tente novamente.")
        return
      }
      setStreet(data.logradouro ?? "")
      setNeighborhood(data.bairro ?? "")
      setCity(data.localidade ?? "")
      setUf(data.uf ?? "")
      setAddressFound(true)
    } catch {
      setCepError("Não foi possível buscar o CEP. Tente novamente.")
    } finally {
      setCepLoading(false)
    }
  }

  function formatCep(value: string) {
    const d = value.replace(/\D/g, "").slice(0, 8)
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
  }

  function formatCpf(value: string) {
    const d = value.replace(/\D/g, "").slice(0, 11)
    let out = d
    if (d.length > 9) out = `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
    else if (d.length > 6) out = `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
    else if (d.length > 3) out = `${d.slice(0, 3)}.${d.slice(3)}`
    return out
  }

  function formatPhone(value: string) {
    const d = value.replace(/\D/g, "").slice(0, 11)
    if (d.length <= 2) return d.length ? `(${d}` : ""
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  }

  function handleDeliverySubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep("payment")
  }

  async function handleGeneratePix() {
    setError(null)
    setStatus("loading")
    try {
      const res = await fetch("/api/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents: effectivePixCents,
          description: "Ebook emagrecimento",
          customer: { name: name.trim(), email, document: docNumber, phone },
          shipping: { cep, street, number, complement, neighborhood, city, uf },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? "Não foi possível gerar o PIX.")
      setCharge(data)
      setStatus("pix")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.")
      setStatus("form")
    }
  }

  // Rola a tela para o topo ao mudar de etapa ou ao gerar o PIX
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step, status])

  // Se o cliente já gerou o QR Code e depois aceitou o desconto (promo=1),
  // regenera automaticamente o PIX com o novo valor menor.
  useEffect(() => {
    if (status === "pix" && charge && charge.amountCents !== effectivePixCents) {
      handleGeneratePix()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectivePixCents])

  // Polling do status de pagamento
  useEffect(() => {
    if (status !== "pix" || !charge) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/pix/status?id=${encodeURIComponent(charge.id)}`)
        const data = await res.json()
        if (data?.status === "paid") {
          setStatus("paid")
          clearInterval(interval)
        }
      } catch {
        // ignora erros transitórios de polling
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [status, charge])

  async function copyCode() {
    if (!charge) return
    await navigator.clipboard.writeText(charge.brCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const orderSummary = (
    <div>
      <h2 className="text-base font-bold">Resumo do pedido</h2>
      <div className="mt-4 flex gap-4">
        <div className="size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
          <Image
            src={product.images[0].src || "/placeholder.svg"}
            alt={product.images[0].alt}
            width={80}
            height={80}
            className="size-full object-contain p-1"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-snug">{product.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">Tamanho: {size}</p>
          <p className="mt-1 text-xs text-muted-foreground">Qtd: 1</p>
        </div>
      </div>

      <dl className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{formatBRL(product.priceCents)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Desconto PIX</dt>
          <dd className="text-primary">- {formatBRL(product.priceCents - effectivePixCents)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Frete</dt>
          <dd className="font-medium text-primary">Grátis</dd>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Truck className="size-3.5 shrink-0 text-primary" />
          <span>Entrega em 3 a 7 dias úteis</span>
        </div>
      </dl>

      <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
        <span className="text-sm font-semibold">Total no PIX</span>
        <div className="text-right">
          <span className="block text-2xl font-extrabold text-primary">{formatBRL(effectivePixCents)}</span>
          {isPromo ? (
            <span className="text-xs font-medium text-accent">Oferta relâmpago aplicada</span>
          ) : (
            <span className="text-xs text-muted-foreground">
              ou {product.maxInstallments}x de {formatBRL(installment)}
            </span>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">{store.legalName}</p>
    </div>
  )

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_380px] lg:items-start">
      {/* Coluna principal */}
      <div className="flex flex-col gap-6">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar para o produto
        </Link>

        {/* Indicador de etapas */}
        {status !== "paid" && (
          <ol className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const isActive = i === currentStepIndex && status !== "pix"
              const isDone = i < currentStepIndex || status === "pix"
              return (
                <li key={s.id} className="flex flex-1 items-center gap-2">
                  <div
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isDone
                        ? "bg-primary text-primary-foreground"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? <Check className="size-4" /> : i + 1}
                  </div>
                  <span
                    className={`truncate text-xs font-medium ${
                      isActive || isDone ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                  {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
                </li>
              )
            })}
          </ol>
        )}

        {status === "paid" ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-10 text-center">
            <CheckCircle2 className="size-16 text-primary" />
            <h2 className="text-2xl font-bold">Pagamento confirmado!</h2>
            <p className="max-w-md text-muted-foreground">
              Recebemos seu pagamento. Em instantes você receberá a confirmação do pedido por e-mail e o envio será
              preparado.
            </p>
            <Button asChild className="mt-2">
              <Link href="/">Voltar à loja</Link>
            </Button>
          </div>
        ) : status === "pix" && charge ? (
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-primary">
              <QrCode className="size-5" />
              <h2 className="text-lg font-bold">Pague com PIX para finalizar</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Escaneie o QR Code abaixo no app do seu banco ou use o PIX copia e cola.
            </p>

            <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <div className="shrink-0 rounded-xl border border-border bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={charge.qrCodeDataUrl || "/placeholder.svg"}
                  alt="QR Code do pagamento PIX"
                  className="size-52"
                />
              </div>

              <div className="flex w-full min-w-0 flex-col gap-4">
                <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
                  <Loader2 className="size-5 shrink-0 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Aguardando confirmação do pagamento...</p>
                </div>

                <div className="w-full min-w-0">
                  <Label className="text-xs font-semibold text-foreground">PIX copia e cola</Label>
                  <code className="mt-1 block max-h-24 w-full min-w-0 overflow-y-auto break-all rounded-lg border border-border bg-muted px-3 py-2.5 text-sm leading-relaxed tracking-wide">
                    {charge.brCode}
                  </code>
                  <Button
                    type="button"
                    className="mt-2 h-11 w-full text-base font-bold"
                    onClick={copyCode}
                  >
                    {copied ? (
                      <>
                        <Check className="size-5" />
                        Código copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="size-5" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm text-muted-foreground">Valor a pagar</span>
                  <span className="text-xl font-extrabold text-primary">{formatBRL(charge.amountCents)}</span>
                </div>
              </div>
            </div>

            {/* Tutorial de pagamento */}
            <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4">
              <h3 className="text-sm font-bold">Como pagar pelo app do seu banco</h3>
              <ol className="mt-3 flex flex-col gap-3">
                {[
                  "Copie o código PIX clicando no botão \"Copiar\" acima.",
                  "Abra o app do seu banco e entre na área PIX.",
                  'Escolha a opção "PIX Copia e Cola" (ou "Pagar com código").',
                  "Cole o código copiado e confira o valor e o destinatário.",
                  "Confirme o pagamento. A aprovação é automática e aparece aqui na tela.",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : step === "summary" ? (
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-border bg-card p-6">{orderSummary}</div>
            <Button size="lg" className="h-12 w-full text-base font-bold" onClick={() => setStep("delivery")}>
              Continuar para entrega
              <ArrowRight className="size-5" />
            </Button>
          </div>
        ) : step === "delivery" ? (
          <form onSubmit={handleDeliverySubmit} className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Dados de entrega</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Informe seus dados e o endereço para enviarmos seu pedido.
            </p>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Nome e sobrenome"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="voce@email.com"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="document">CPF</Label>
                  <Input
                    id="document"
                    inputMode="numeric"
                    value={docNumber}
                    onChange={(e) => setDocNumber(formatCpf(e.target.value))}
                    required
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone (com DDD)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    required
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              {/* Endereço de entrega */}
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-bold">Endereço</h3>
                <div className="mt-3 grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cep">CEP</Label>
                    <div className="relative">
                      <Input
                        id="cep"
                        inputMode="numeric"
                        value={cep}
                        onChange={(e) => {
                          const formatted = formatCep(e.target.value)
                          setCep(formatted)
                          lookupCep(formatted)
                        }}
                        required
                        placeholder="00000-000"
                        aria-describedby="cep-help"
                      />
                      {cepLoading && (
                        <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-primary" />
                      )}
                    </div>
                    {cepError && <p className="text-xs text-destructive">{cepError}</p>}
                    {addressFound && (
                      <p id="cep-help" className="flex items-center gap-1.5 text-xs font-medium text-primary">
                        <Truck className="size-3.5" />
                        Entrega em 3 a 7 dias úteis · Frete grátis
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
                    <div className="grid gap-2">
                      <Label htmlFor="street">Endereço (rua/avenida)</Label>
                      <Input
                        id="street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        required
                        placeholder="Rua, avenida..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        inputMode="numeric"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        required
                        placeholder="Nº"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="complement">Complemento (opcional)</Label>
                    <Input
                      id="complement"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apto, bloco, referência..."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      required
                      placeholder="Seu bairro"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[1fr_100px]">
                    <div className="grid gap-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="Sua cidade"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="uf">UF</Label>
                      <Input
                        id="uf"
                        maxLength={2}
                        value={uf}
                        onChange={(e) => setUf(e.target.value.toUpperCase())}
                        required
                        placeholder="UF"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 bg-transparent sm:flex-1"
                onClick={() => setStep("summary")}
              >
                <ArrowLeft className="size-5" />
                Voltar
              </Button>
              <Button type="submit" size="lg" className="h-12 text-base font-bold sm:flex-[2]">
                Ir para o pagamento
                <ArrowRight className="size-5" />
              </Button>
            </div>
          </form>
        ) : (
          // step === "payment"
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-primary">
              <QrCode className="size-5" />
              <h2 className="text-lg font-bold">Pagamento via PIX</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Confira o valor e gere o QR Code PIX para finalizar com desconto.
            </p>

            <div className="mt-5 rounded-lg border border-border bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total a pagar no PIX</span>
                <span className="text-2xl font-extrabold text-primary">{formatBRL(effectivePixCents)}</span>
              </div>
              <div className="mt-3 border-t border-border pt-3 text-sm">
                <p className="font-medium">Entrega para:</p>
                <p className="mt-1 text-muted-foreground">
                  {street}, {number}
                  {complement ? ` - ${complement}` : ""} · {neighborhood} · {city}/{uf} · {cep}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-primary">
                  <Truck className="size-3.5" />
                  Entrega em 3 a 7 dias úteis · Frete grátis
                </p>
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 bg-transparent sm:flex-1"
                onClick={() => setStep("delivery")}
                disabled={status === "loading"}
              >
                <ArrowLeft className="size-5" />
                Voltar
              </Button>
              <Button
                type="button"
                size="lg"
                disabled={status === "loading"}
                className="h-12 text-base font-bold sm:flex-[2]"
                onClick={handleGeneratePix}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Gerando PIX...
                  </>
                ) : (
                  <>
                    <QrCode className="size-5" />
                    Gerar QR Code PIX
                  </>
                )}
              </Button>
            </div>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              Ambiente seguro. Seus dados são usados apenas para processar o pagamento.
            </p>
          </div>
        )}
      </div>

      {/* Resumo do pedido (fixo na lateral apenas em telas grandes) */}
      <aside className="hidden rounded-xl border border-border bg-card p-6 lg:sticky lg:top-6 lg:block">
        {orderSummary}
      </aside>
    </div>
  )
}
