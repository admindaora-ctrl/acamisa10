import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { product } from "@/lib/store-config"

export function ProductHeader() {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-accent px-2.5 py-1 text-xs font-bold uppercase text-accent-foreground">
          Oferta especial
        </span>
        <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-bold uppercase text-primary-foreground">
          Somente hoje
        </span>
      </div>
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</p>
      <h1 className="mt-1 text-pretty text-2xl font-bold leading-tight sm:text-3xl">{product.name}</h1>
      <div className="mt-3 flex items-center gap-1.5">
        <div className="flex items-center" aria-label={`Avaliação ${product.rating} de 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-4",
                i < Math.round(product.rating) ? "fill-accent text-accent" : "fill-muted text-muted",
              )}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {product.rating.toFixed(1)} · {product.reviews.toLocaleString("pt-BR")} avaliações
        </span>
      </div>
    </div>
  )
}
