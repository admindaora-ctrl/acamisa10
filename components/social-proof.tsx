"use client"

import { useEffect, useRef, useState } from "react"
import { ShoppingBag, X, BadgeCheck } from "lucide-react"
import { product } from "@/lib/store-config"

const buyers = [
  { name: "Alex", city: "São Paulo, SP" },
  { name: "Mariana", city: "Rio de Janeiro, RJ" },
  { name: "João Pedro", city: "Belo Horizonte, MG" },
  { name: "Carla", city: "Curitiba, PR" },
  { name: "Rafael", city: "Porto Alegre, RS" },
  { name: "Beatriz", city: "Salvador, BA" },
  { name: "Lucas", city: "Fortaleza, CE" },
  { name: "Fernanda", city: "Recife, PE" },
  { name: "Gustavo", city: "Brasília, DF" },
  { name: "Patrícia", city: "Goiânia, GO" },
  { name: "Diego", city: "Manaus, AM" },
  { name: "Camila", city: "Florianópolis, SC" },
  { name: "Bruno", city: "Campinas, SP" },
  { name: "Larissa", city: "Belém, PA" },
  { name: "Thiago", city: "Vitória, ES" },
  { name: "Aline", city: "Natal, RN" },
  { name: "Marcelo", city: "São Luís, MA" },
  { name: "Vanessa", city: "Maceió, AL" },
  { name: "Eduardo", city: "Cuiabá, MT" },
  { name: "Priscila", city: "Uberlândia, MG" },
]

const timeAgo = ["há poucos segundos", "há 1 minuto", "há 2 minutos", "há 3 minutos", "há 5 minutos", "há 8 minutos"]

type Notice = {
  id: number
  name: string
  city: string
  when: string
}

const FIRST_DELAY = 5000
const VISIBLE_MS = 5500
const GAP_MS = 9000

export function SocialProof() {
  const [notice, setNotice] = useState<Notice | null>(null)
  const idxRef = useRef(0)
  const counterRef = useRef(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    function pick(): Notice {
      const buyer = buyers[idxRef.current % buyers.length]
      idxRef.current += 1
      counterRef.current += 1
      return {
        id: counterRef.current,
        name: buyer.name,
        city: buyer.city,
        when: timeAgo[Math.floor(Math.random() * timeAgo.length)],
      }
    }

    function show() {
      setNotice(pick())
      const hide = setTimeout(() => setNotice(null), VISIBLE_MS)
      const next = setTimeout(show, VISIBLE_MS + GAP_MS)
      timers.current.push(hide, next)
    }

    const start = setTimeout(show, FIRST_DELAY)
    timers.current.push(start)

    return () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [])

  if (!notice) return null

  return (
    <div
      key={notice.id}
      className="fixed bottom-4 left-4 z-50 max-w-[calc(100vw-2rem)] sm:max-w-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-300">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <ShoppingBag className="size-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {notice.name} acabou de adquirir o manto
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {product.name.split(" ").slice(0, 2).join(" ")} · {notice.city}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-primary">
            <BadgeCheck className="size-3" />
            Compra verificada · {notice.when}
          </p>
        </div>
        <button
          onClick={() => setNotice(null)}
          aria-label="Fechar notificação"
          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
