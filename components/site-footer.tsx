import { store } from "@/lib/store-config"

const columns = [
  { title: "Institucional", links: ["Sobre a loja", "Trabalhe conosco", "Política de privacidade", "Termos de uso"] },
  { title: "Ajuda", links: ["Central de atendimento", "Trocas e devoluções", "Status do pedido", "Frete e prazos"] },
  { title: "Categorias", links: ["Camisas de Times", "Futebol", "Masculino", "Feminino", "Infantil"] },
]

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/40">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Sobre a loja</h2>
          <div className="mt-3 grid gap-4 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
            <p>
              A {store.name} é uma loja virtual especializada em artigos esportivos e camisas de futebol. Nosso
              objetivo é oferecer produtos de qualidade com o melhor preço, atendimento ágil e uma experiência de
              compra simples e segura do início ao fim.
            </p>
            <p>
              Trabalhamos com pagamento via PIX para garantir aprovação instantânea e descontos exclusivos. Todos os
              pedidos contam com nota fiscal, garantia contra defeitos de fabricação e suporte dedicado em caso de
              dúvidas, trocas ou devoluções.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold">{store.name}</span>
            <span className="text-sm font-medium text-primary">{store.tagline}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Sua loja de artigos esportivos com pagamento via PIX rápido e seguro.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {store.legalName}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
