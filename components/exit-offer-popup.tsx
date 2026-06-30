"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { X, Zap, Clock, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { product, formatBRL } from "@/lib/store-config"

const OFFER_SECONDS = 10 * 60 // 10 minutos
const SESSION_KEY = "exitOfferShown"

export function ExitOfferPopup() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(OFFER_SECONDS)
  const triggeredRef = useRef(false)

  const trigger = useCallback(() => {
    if (triggeredRef.current) return
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY)) return
    triggeredRef.current = true
    sessionStorage.setItem(SESSION_KEY, "1")
    setOpen(true)
  }, [])

  // Detecção de tentativa de voltar (botão voltar / gesto) via histórico
  useEffect(() => {
    if (typeof window === "undefined") return

    // Empurra um estado extra para capturar o "voltar"
    history.pushState({ exitGuard: true }, "", window.location.href)

    const onPopState = () => {
      if (!triggeredRef.current) {
        // Reinsere o estado para manter o usuário na página e exibe a oferta
        history.pushState({ exitGuard: true }, "", window.location.href)
        trigger()
      }
    }

    // Detecção de saída pelo topo (desktop)
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger()
    }

    window.addEventListener("popstate", onPopState)
    document.addEventListener("mouseout", onMouseOut)
    return () => {
      window.removeEventListener("popstate", onPopState)
      document.removeEventListener("mouseout", onMouseOut)
    }
  }, [trigger])

  // Cronômetro regressivo
  useEffect(() => {
    if (!open) return
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [open])

  // Trava o scroll do body quando aberto
  useEffect(() => {
    if (typeof document === "undefined") return
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
  const seconds = String(secondsLeft % 60).padStart(2, "0")
  const discount = Math.round((1 - product.offerPriceCents / product.listPriceCents) * 100)

  function handleAccept() {
    const params = new URLSearchParams(window.location.search)
    const size = params.get("size") ?? "M"
    setOpen(false)
    router.push(`/checkout?size=${encodeURIComponent(size)}&promo=1`)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-offer-title"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-card shadow-xl">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Fechar oferta"
          className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-center justify-center gap-2 bg-accent px-4 py-2.5 text-accent-foreground">
          <Zap className="size-4 fill-current" />
          <span className="text-sm font-bold uppercase tracking-wide">Oferta relâmpago • só agora</span>
        </div>

        <div className="flex flex-col items-center px-5 pb-5 pt-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0].src || "/placeholder.svg"}
            alt={product.name}
            className="h-32 w-32 rounded-xl object-cover"
          />

          <h2 id="exit-offer-title" className="mt-3 text-balance text-lg font-bold leading-tight">
            Espere! Não perca essa condição única
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Leve a {product.name} com um desconto exclusivo de saída.
          </p>

          <div className="mt-4 flex items-end justify-center gap-2">
            <span className="text-sm text-muted-foreground line-through">{formatBRL(product.listPriceCents)}</span>
            <span className="text-4xl font-extrabold text-accent">{formatBRL(product.offerPriceCents)}</span>
          </div>
          <span className="mt-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">
            {discount}% OFF no PIX
          </span>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <Clock className="size-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Esta oferta expira em</span>
            <span className="font-mono text-lg font-bold tabular-nums text-accent">
              {minutes}:{seconds}
            </span>
          </div>

          <Button onClick={handleAccept} size="lg" className="mt-4 h-12 w-full text-base font-bold">
            Aproveitar oferta agora
          </Button>

          <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-primary">
            <Truck className="size-3.5" />
            Frete grátis • Entrega em 3 a 7 dias úteis
          </p>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 text-xs text-muted-foreground underline"
          >
            Não, prefiro pagar o preço cheio
          </button>
        </div>
      </div>
    </div>
  )
}
