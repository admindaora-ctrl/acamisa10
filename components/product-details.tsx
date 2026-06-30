import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { product } from "@/lib/store-config"

const DEFAULT_OPEN = ["specs"]

export function ProductDetails() {
  return (
    <section className="mt-12 border-t border-border pt-8" aria-label="Detalhes do produto">
      <h2 className="text-xl font-bold">Detalhes do produto</h2>
      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-pretty leading-relaxed text-muted-foreground">{product.description}</p>
        </div>
        <div>
          <Accordion defaultValue={DEFAULT_OPEN}>
            <AccordionItem value="specs">
              <AccordionTrigger className="text-base font-semibold">Especificações</AccordionTrigger>
              <AccordionContent>
                <dl className="divide-y divide-border">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-4 py-2.5 text-sm">
                      <dt className="text-muted-foreground">{spec.label}</dt>
                      <dd className="text-right font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="delivery">
              <AccordionTrigger className="text-base font-semibold">Entrega e devolução</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Enviamos para todo o país. Frete grátis na primeira compra. Você tem até 30 dias para
                  solicitar troca ou devolução após o recebimento.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger className="text-base font-semibold">Cuidados</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Lavar à mão ou na máquina em ciclo delicado com água fria. Não usar alvejante. Secar à sombra. Não
                  passar sobre a estampa.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
