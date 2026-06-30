import { ChevronRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGallery } from "@/components/product-gallery"
import { ProductHeader } from "@/components/product-header"
import { BuyBox } from "@/components/buy-box"
import { ProductDetails } from "@/components/product-details"
import { ProductReviews } from "@/components/product-reviews"
import { ExitOfferPopup } from "@/components/exit-offer-popup"
import { SocialProof } from "@/components/social-proof"
import { product } from "@/lib/store-config"

export default function ProductPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-4 sm:py-6">
        <nav
          aria-label="Trilha de navegação"
          className="mb-4 flex items-center gap-1 overflow-x-auto whitespace-nowrap text-xs text-muted-foreground sm:mb-6 sm:text-sm"
        >
          <a href="#" className="shrink-0 hover:text-foreground">
            Início
          </a>
          <ChevronRight className="size-3.5 shrink-0 sm:size-4" />
          <a href="#" className="shrink-0 hover:text-foreground">
            Futebol
          </a>
          <ChevronRight className="size-3.5 shrink-0 sm:size-4" />
          <a href="#" className="shrink-0 hover:text-foreground">
            Camisas de Times
          </a>
          <ChevronRight className="size-3.5 shrink-0 sm:size-4" />
          <span className="shrink-0 text-foreground">{product.brand}</span>
        </nav>

        <ProductHeader />

        <div className="mt-5 grid min-w-0 gap-6 lg:grid-cols-2 lg:gap-12">
          <ProductGallery images={product.images} />
          <BuyBox />
        </div>

        <ProductDetails />
        <ProductReviews />
      </main>
      <SiteFooter />
      <ExitOfferPopup />
      <SocialProof />
    </div>
  )
}
