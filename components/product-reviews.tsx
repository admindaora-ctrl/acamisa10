"use client"

import { useState } from "react"
import { Star, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { product, reviews } from "@/lib/store-config"

const PAGE_SIZE = 6

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex items-center", className)} aria-label={`Avaliação ${rating} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("size-4", i < Math.round(rating) ? "fill-accent text-accent" : "fill-muted text-muted")}
        />
      ))}
    </div>
  )
}

export function ProductReviews() {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const shown = reviews.slice(0, visible)
  const hasMore = visible < reviews.length

  return (
    <section className="mt-12 border-t border-border pt-10" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="text-xl font-bold md:text-2xl">
        Avaliações dos clientes
      </h2>

      <div className="mt-4 flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:gap-8">
        <div className="flex flex-col items-center justify-center sm:border-r sm:border-border sm:pr-8">
          <span className="text-4xl font-extrabold text-primary">{product.rating.toFixed(1)}</span>
          <Stars rating={product.rating} className="mt-1" />
          <span className="mt-1 text-xs text-muted-foreground">
            {product.reviews.toLocaleString("pt-BR")} avaliações
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {Math.round((product.rating / 5) * 100)}% dos clientes recomendam este produto. Veja abaixo o que quem já
          comprou está dizendo.
        </p>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {shown.map((review, i) => (
          <li key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <Stars rating={review.rating} />
              <span className="text-xs text-muted-foreground">{review.date}</span>
            </div>
            <h3 className="mt-2 text-sm font-bold">{review.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
              <span>{review.name}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-primary">
                  <BadgeCheck className="size-3.5" />
                  Compra verificada
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="font-semibold bg-transparent"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Carregar mais avaliações
          </Button>
          <span className="text-xs text-muted-foreground">
            Mostrando {shown.length} de {reviews.length} avaliações
          </span>
        </div>
      )}
    </section>
  )
}
