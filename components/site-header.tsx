import { Search, ShoppingBag, Menu, Truck } from "lucide-react"
import { store } from "@/lib/store-config"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background">
      {/* Linha principal: menu, logo, ações */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4">
        <button className="shrink-0 lg:hidden" aria-label="Abrir menu">
          <Menu className="size-6 text-foreground" />
        </button>

        <a href="/" className="flex shrink-0 items-center gap-2" aria-label={`${store.name} início`}>
          <span className="font-display text-xl font-black tracking-tight text-[#009b3a] sm:text-2xl">
            {store.name}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/emblema-camisa10.png"
            alt="Emblema Camisa10"
            className="size-8 shrink-0 object-contain sm:size-9"
          />
        </a>

        {/* Busca - só em telas médias+ */}
        <div className="ml-2 hidden flex-1 items-center md:flex">
          <div className="flex w-full items-center gap-2 rounded-full border border-border bg-muted px-4 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar por produtos, marcas e modalidades"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Buscar produtos"
            />
          </div>
        </div>

        <nav className="ml-auto flex shrink-0 items-center gap-5" aria-label="Ações">
          <button aria-label="Buscar" className="md:hidden">
            <Search className="size-5 text-foreground" />
          </button>
          <button aria-label="Carrinho" className="relative">
            <ShoppingBag className="size-5 text-foreground" />
            <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              1
            </span>
          </button>
        </nav>
      </div>

      {/* Faixa de frete grátis */}
      <div className="w-full bg-[#009b3a]">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-[#ffcc29] sm:px-4 sm:text-sm">
          <Truck className="size-4 shrink-0" />
          <span>Frete grátis na primeira compra</span>
        </div>
      </div>
    </header>
  )
}
