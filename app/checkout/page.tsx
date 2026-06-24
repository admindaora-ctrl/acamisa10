import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckoutClient } from "@/components/checkout-client"
import { ExitOfferPopup } from "@/components/exit-offer-popup"
import { SocialProof } from "@/components/social-proof"

export const metadata = {
  title: "Checkout PIX | Camisa10",
}

export default function CheckoutPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          }
        >
          <CheckoutClient />
        </Suspense>
      </main>
      <SiteFooter />
      <ExitOfferPopup />
      <SocialProof />
    </div>
  )
}
