"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type ProductImage = { src: string; alt: string }

export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex min-w-0 flex-col-reverse gap-4 md:flex-row">
      <div
        className="flex gap-3 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0"
        role="tablist"
        aria-label="Miniaturas do produto"
      >
        {images.map((img, i) => (
          <button
            key={img.src}
            role="tab"
            aria-selected={active === i}
            aria-label={`Ver imagem ${i + 1}`}
            onClick={() => setActive(i)}
            className={cn(
              "relative size-16 shrink-0 overflow-hidden rounded-lg border bg-white md:size-20",
              active === i ? "border-primary ring-1 ring-primary" : "border-border hover:border-foreground/30",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src || "/placeholder.svg"} alt={img.alt} className="size-full object-contain p-1" />
          </button>
        ))}
      </div>

      <div className="relative flex-1 overflow-hidden rounded-2xl border border-border bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active].src || "/placeholder.svg"}
          alt={images[active].alt}
          className="aspect-square w-full object-contain p-2"
        />
      </div>
    </div>
  )
}
