import { WhatsAppIcon } from "@/components/whatsapp-icon"

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/558597627379"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#1ebe5b]"
    >
      <WhatsAppIcon className="size-8" />
    </a>
  )
}
