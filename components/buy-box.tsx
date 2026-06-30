"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Truck, ShieldCheck, RefreshCw, MapPin, Loader2 } from "lucide-react"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { product, formatBRL } from "@/lib/store-config"

export function BuyBox() {
  const router = useRouter()
  const [size, setSize] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [cep, setCep] = useState("")
  const [shipping, setShipping] = useState<{
    street: string
    neighborhood: string
    city: string
    uf: string
  } | null>(null)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)

  const discount = Math.round((1 - product.pixPriceCents / product.listPriceCents) * 100)

  function handleBuy() {
    if (!size) {
      setError(true)
      return
    }
    setError(false)
    router.push(`/checkout?size=${encodeURIComponent(size)}`)
  }

  function formatCep(value: string) {
    const d = value.replace(/\D/g, "").slice(0, 8)
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
  }

  async function calcShipping() {
    const digits = cep.replace(/\D/g, "")
    setCepError(null)
    setShipping(null)
    if (digits.length !== 8) {
      setCepError("Digite um CEP válido com 8 dígitos.")
      return
    }
    setShippingLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (data?.erro) {
        setCepError("CEP não encontrado. Verifique e tente novamente.")
        return
      }
      setShipping({
        street: data.logradouro ?? "",
        neighborhood: data.bairro ?? "",
        city: data.localidade ?? "",
        uf: data.uf ?? "",
      })
    } catch {
      setCepError("Não foi possível calcular o frete. Tente novamente.")
    } finally {
      setShippingLoading(false)
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground line-through">{formatBRL(product.listPriceCents)}</span>
          <Badge className="bg-primary text-primary-foreground hover:bg-primary">-{discount}% no PIX</Badge>
        </div>
        <div className="mt-1 flex items-end gap-2">
          <span className="text-3xl font-extrabold text-primary md:text-4xl">{formatBRL(product.pixPriceCents)}</span>
          <span className="pb-1 text-sm font-medium text-muted-foreground">no PIX</span>
        </div>
        <p className="mt-1 text-sm font-medium text-accent">Oferta aplicada somente no PIX</p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">Tamanho</span>
          <a href="#" className="text-sm font-medium text-primary hover:underline">
            Guia de medidas
          </a>
        </div>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Selecione o tamanho">
          {product.sizes.map((s) => (
            <button
              key={s.label}
              role="radio"
              aria-checked={size === s.label}
              disabled={!s.available}
              onClick={() => {
                setSize(s.label)
                setError(false)
              }}
              className={cn(
                "flex h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors",
                !s.available && "cursor-not-allowed border-dashed border-border text-muted-foreground/40 line-through",
                s.available && size === s.label && "border-primary bg-primary text-primary-foreground",
                s.available && size !== s.label && "border-border hover:border-foreground/40",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        {error && <p className="mt-2 text-sm text-destructive">Selecione um tamanho para continuar.</p>}
      </div>

      <div className="flex flex-col gap-3">
        <Button size="lg" className="h-12 w-full text-base font-bold" onClick={handleBuy}>
          Comprar Agora
        </Button>
        <a
          href="https://wa.me/558597627379"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#25D366] text-base font-bold text-white transition-colors hover:bg-[#1ebe5b]"
        >
          Comprar pelo WhatsApp
          <WhatsAppIcon className="size-5" />
        </a>
      </div>

      {/* Calcular frete */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-primary" />
          <span className="text-sm font-semibold">Calcular frete e prazo</span>
        </div>
        <div className="mt-3 flex gap-2">
          <input
            inputMode="numeric"
            value={cep}
            onChange={(e) => {
              const formatted = formatCep(e.target.value)
              setCep(formatted)
              if (formatted.replace(/\D/g, "").length < 8) {
                setShipping(null)
                setCepError(null)
              }
            }}
            placeholder="Digite seu CEP"
            aria-label="CEP para cálculo de frete"
            className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          />
          <Button
            type="button"
            variant="outline"
            className="h-11 shrink-0 bg-transparent font-semibold"
            onClick={calcShipping}
            disabled={shippingLoading}
          >
            {shippingLoading ? <Loader2 className="size-4 animate-spin" /> : "Calcular"}
          </Button>
        </div>

        {cepError && <p className="mt-2 text-sm text-destructive">{cepError}</p>}

        {shipping && (
          <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
            <p className="font-medium text-foreground">
              {shipping.street ? `${shipping.street}, ` : ""}
              {shipping.neighborhood ? `${shipping.neighborhood} - ` : ""}
              {shipping.city}/{shipping.uf}
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Truck className="size-4 text-primary" />
                Entrega em 3 a 7 dias úteis
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-muted-foreground line-through">R$ 15,00</span>
                <span className="font-bold text-primary">Grátis</span>
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-accent">Frete grátis na primeira compra</p>
          </div>
        )}
      </div>

      <ul className="grid gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm">
        <li className="flex items-center gap-3">
          <Truck className="size-5 text-primary" />
          <span>Frete grátis na primeira compra para todo o país</span>
        </li>
        <li className="flex items-center gap-3">
          <RefreshCw className="size-5 text-primary" />
          <span>30 dias para troca ou devolução sem complicação</span>
        </li>
        <li className="flex items-center gap-3">
          <ShieldCheck className="size-5 text-primary" />
          <span>Pagamento 100% seguro · Compra protegida</span>
        </li>
        </ul>
    </div>
  )
}
