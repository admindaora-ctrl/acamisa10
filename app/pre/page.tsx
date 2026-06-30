import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { product, formatBRL } from "@/lib/store-config"
import { BadgePercent, Truck, CreditCard, RefreshCcw, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Queima de Estoque — Camisa Torcedor Amarela | Camisa10",
  description:
    "Queima de estoque da Camisa Torcedor Amarela 2026/27 com preço especial. Desconto no PIX, frete grátis na primeira compra e 30 dias para troca.",
}

const benefits = [
  { icon: Truck, text: "Frete grátis na 1ª compra" },
  { icon: CreditCard, text: "Desconto no PIX" },
  { icon: RefreshCcw, text: "30 dias para troca" },
  { icon: BadgePercent, text: "Últimas unidades" },
]

export default function PreSellPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-16 pt-4 text-center md:pb-20 md:pt-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#009b3a]/10 px-4 py-1.5 text-sm font-semibold text-[#009b3a]">
            <BadgePercent className="size-4" />
            Queima de estoque
          </span>

          <h1 className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {product.name} com preço especial
          </h1>

          <p className="mt-3 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            Renovamos a coleção e liberamos as últimas unidades por um valor promocional. Mesma qualidade, agora bem mais
            acessível.
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-sm text-muted-foreground line-through">{formatBRL(product.listPriceCents)}</span>
            <span className="text-4xl font-extrabold text-[#009b3a]">{formatBRL(product.pixPriceCents)}</span>
            <span className="text-sm font-medium text-muted-foreground">no PIX</span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-[#ffcc29] text-[#ffcc29]" />
              ))}
            </div>
            <span>
              {product.rating} de 5 — {product.reviews.toLocaleString("pt-BR")} avaliações
            </span>
          </div>

          <Button
            asChild
            size="lg"
            className="mt-7 h-14 rounded-full bg-[#009b3a] px-8 text-base font-bold text-white hover:bg-[#008132]"
          >
            <a href="/">Aproveitar oferta</a>
          </Button>

          <ul className="mt-10 grid w-full max-w-md grid-cols-2 gap-x-6 gap-y-4 text-left">
            {benefits.map((b) => (
              <li key={b.text} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                <b.icon className="size-5 shrink-0 text-[#009b3a]" />
                {b.text}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-xs text-muted-foreground">
            Compra 100% segura • Pagamento via PIX • Garantia de 90 dias contra defeitos
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
