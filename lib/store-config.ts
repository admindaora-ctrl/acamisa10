// =============================================================
// CONFIGURAÇÃO DA LOJA
// Altere os valores abaixo para personalizar nome, produto e preços.
// =============================================================

export const store = {
  name: "Camisa10",
  tagline: "Loja Esportiva",
  // Usado no rodapé / dados do recebedor do PIX
  legalName: "Camisa10 Comércio de Artigos Esportivos LTDA",
}

export type ProductSize = {
  label: string
  available: boolean
}

export const product = {
  id: "camisa-torcedor-amarela-2026",
  brand: "Camisa Torcedor Amarela",
  name: "Camisa Torcedor Amarela 2026/27 unissex",
  rating: 4.9,
  reviews: 1342,
  // Preços em centavos
  listPriceCents: 26990, // preço "de" = R$ 269,90
  priceCents: 6990, // preço parcelado
  pixPriceCents: 5990, // preço no PIX (com desconto) = R$ 59,90
  offerPriceCents: 2990, // preço da oferta relâmpago (pop-up de saída) = R$ 29,90
  maxInstallments: 10,
  description:
    "A Camisa Torcedor Amarela 2026/27 traz o amarelo clássico cheio de energia que combina com a torcida. Com modelagem confortável, a linha Torcedor une um visual esportivo a uma tecnologia antissuor para o look perfeito na arquibancada ou no dia a dia. O tecido com gerenciamento de umidade absorve o suor para uma evaporação mais rápida, mantendo o corpo seco e confortável durante todo o jogo.",
  specs: [
    { label: "Cor", value: "Amarelo" },
    { label: "Material", value: "100% Poliéster" },
    { label: "Tecnologia", value: "Antissuor — gerenciamento de umidade" },
    { label: "Design", value: "Inspirado na camisa do time" },
    { label: "Cuidados", value: "Lavagem à máquina" },
    { label: "Origem", value: "Produto importado" },
    { label: "Garantia", value: "90 dias contra defeitos de fabricação" },
  ],
  images: [
    { src: "/images/00.avif", alt: "Camisa torcedor amarela - frente" },
    { src: "/images/1.avif", alt: "Camisa torcedor amarela - costas" },
    { src: "/images/2.avif", alt: "Camisa torcedor amarela - detalhe da gola" },
    { src: "/images/3.avif", alt: "Camisa torcedor amarela vestida por modelo" },
    { src: "/images/4.avif", alt: "Camisa torcedor amarela - detalhe no modelo" },
    { src: "/images/5.avif", alt: "Camisa torcedor amarela - detalhe da manga" },
    { src: "/images/6.avif", alt: "Camisa torcedor amarela - dobrada" },
    { src: "/images/7.avif", alt: "Camisa torcedor amarela - vista lateral no modelo" },
    { src: "/images/8.avif", alt: "Camisa torcedor amarela - detalhe da barra" },
    { src: "/images/9.avif", alt: "Camisa torcedor amarela - no cabide" },
  ],
  sizes: [
    { label: "P", available: true },
    { label: "M", available: true },
    { label: "G", available: true },
    { label: "GG", available: true },
    { label: "XGG", available: false },
  ] as ProductSize[],
}

export type Review = {
  name: string
  date: string
  rating: number
  title: string
  body: string
  verified: boolean
}

export const reviews: Review[] = [
  {
    name: "Rafael M.",
    date: "12/06/2026",
    rating: 5,
    title: "Camisa excelente, chegou rápido",
    body: "Material muito bom, costura caprichada e o amarelo é vibrante igual aparece na foto. Paguei no PIX e veio o desconto certinho. Recomendo!",
    verified: true,
  },
  {
    name: "Juliana S.",
    date: "08/06/2026",
    rating: 5,
    title: "Tecido leve e confortável",
    body: "Comprei pro meu marido e ele amou. Tecido bem leve, ótimo pra usar nos jogos. Tamanho M serviu perfeitamente.",
    verified: true,
  },
  {
    name: "Carlos E.",
    date: "01/06/2026",
    rating: 4,
    title: "Boa, mas a modelagem é justa",
    body: "A qualidade é ótima e o acabamento também. Só achei a modelagem um pouco justa, recomendo pegar um tamanho acima se gostar mais folgado.",
    verified: true,
  },
  {
    name: "Ana P.",
    date: "27/05/2026",
    rating: 5,
    title: "Valeu muito a pena",
    body: "Por esse preço não esperava tanta qualidade. Entrega dentro do prazo e produto idêntico ao anunciado. Já é minha segunda compra na loja.",
    verified: true,
  },
  {
    name: "Bruno A.",
    date: "25/05/2026",
    rating: 5,
    title: "Superou as expectativas",
    body: "Achei que ia ser uma camisa simples, mas o acabamento é de primeira. Vesti pro jogo e todo mundo perguntou onde comprei.",
    verified: true,
  },
  {
    name: "Marina L.",
    date: "22/05/2026",
    rating: 5,
    title: "Chegou antes do prazo",
    body: "Pedi na sexta e chegou na terça. Embalagem caprichada e a camisa veio dobradinha certinho. Amei!",
    verified: true,
  },
  {
    name: "Diego F.",
    date: "20/05/2026",
    rating: 4,
    title: "Muito boa pelo preço",
    body: "Custo-benefício excelente. O tecido é confortável e não esquenta. Tirei uma estrela só porque queria que tivesse mais opções de cor.",
    verified: true,
  },
  {
    name: "Patrícia R.",
    date: "18/05/2026",
    rating: 5,
    title: "Recomendo demais",
    body: "Já é a terceira que compro aqui. Qualidade sempre constante e o atendimento no chat foi super rápido pra tirar minhas dúvidas.",
    verified: true,
  },
  {
    name: "Lucas T.",
    date: "15/05/2026",
    rating: 5,
    title: "Igualzinha à foto",
    body: "Tava com receio de comprar online, mas veio exatamente como mostrado. Cor vibrante e costura firme. Voltarei a comprar.",
    verified: true,
  },
  {
    name: "Fernanda C.",
    date: "13/05/2026",
    rating: 5,
    title: "Presente perfeito",
    body: "Comprei pro meu pai no aniversário e ele adorou. Serviu certinho no tamanho G e o caimento ficou ótimo.",
    verified: true,
  },
  {
    name: "Gustavo H.",
    date: "10/05/2026",
    rating: 4,
    title: "Gostei bastante",
    body: "Camisa de qualidade, entrega rápida. Só senti que o tamanho veio levemente menor, mas nada que atrapalhe o uso.",
    verified: true,
  },
  {
    name: "Camila V.",
    date: "08/05/2026",
    rating: 5,
    title: "Atendimento nota 10",
    body: "Tive uma dúvida sobre o tamanho e me responderam na hora. A camisa chegou rápido e é linda pessoalmente.",
    verified: true,
  },
  {
    name: "Rodrigo S.",
    date: "05/05/2026",
    rating: 5,
    title: "Vale cada centavo",
    body: "Paguei no PIX com desconto e ainda veio com frete grátis. Produto de qualidade, recomendo sem medo.",
    verified: true,
  },
  {
    name: "Beatriz N.",
    date: "03/05/2026",
    rating: 5,
    title: "Tecido respirável",
    body: "Uso pra correr e jogar bola, não fica pesada nem encharcada de suor. Lava bem e não desbota.",
    verified: true,
  },
  {
    name: "Thiago P.",
    date: "01/05/2026",
    rating: 4,
    title: "Boa compra",
    body: "Camisa bonita e confortável. A entrega demorou 6 dias mas chegou dentro do prazo informado.",
    verified: true,
  },
  {
    name: "Larissa M.",
    date: "28/04/2026",
    rating: 5,
    title: "Encantada com o produto",
    body: "Qualidade impecável, parece bem mais cara do que custou. Já indiquei pra todas as amigas.",
    verified: true,
  },
  {
    name: "Felipe D.",
    date: "26/04/2026",
    rating: 5,
    title: "Comprei e não me arrependi",
    body: "Estava procurando uma camisa boa e barata. Achei aqui e superou. Caimento perfeito no tamanho M.",
    verified: true,
  },
  {
    name: "Aline G.",
    date: "24/04/2026",
    rating: 5,
    title: "Maravilhosa",
    body: "A cor é exatamente como na foto, o tecido é macio e fresquinho. Recomendo pra quem quer torcer com estilo.",
    verified: true,
  },
  {
    name: "Marcelo B.",
    date: "21/04/2026",
    rating: 4,
    title: "Satisfeito",
    body: "Produto bom e entrega tranquila. Só acho que poderiam ter mais tamanhos disponíveis, o XGG estava esgotado.",
    verified: true,
  },
  {
    name: "Vanessa O.",
    date: "19/04/2026",
    rating: 5,
    title: "Melhor compra do ano",
    body: "Atendimento excelente, produto de qualidade e preço justo. Não tenho do que reclamar, virei cliente fiel.",
    verified: true,
  },
  {
    name: "Eduardo L.",
    date: "16/04/2026",
    rating: 5,
    title: "Chegou rapidinho",
    body: "Mais rápido do que eu esperava. A camisa é leve e o amarelo é bem fechado, não é aquele desbotado.",
    verified: true,
  },
  {
    name: "Priscila A.",
    date: "14/04/2026",
    rating: 5,
    title: "Produto top",
    body: "Comprei duas, uma pra mim e outra pro meu filho. Ambas vieram perfeitas e bem embaladas.",
    verified: true,
  },
  {
    name: "Henrique R.",
    date: "11/04/2026",
    rating: 4,
    title: "Recomendo",
    body: "Camisa de boa qualidade, vale o preço. A modelagem é um pouco justa no peito, fora isso perfeita.",
    verified: true,
  },
  {
    name: "Tatiane S.",
    date: "09/04/2026",
    rating: 5,
    title: "Amei de paixão",
    body: "Tecido ótimo, costura reforçada e cor linda. Usei o cupom do PIX e economizei bastante. Recomendo!",
    verified: true,
  },
  {
    name: "Vinícius C.",
    date: "06/04/2026",
    rating: 5,
    title: "Qualidade surpreendente",
    body: "Não esperava tanto por esse valor. Lavei várias vezes e continua igual nova. Excelente.",
    verified: true,
  },
  {
    name: "Débora F.",
    date: "04/04/2026",
    rating: 5,
    title: "Tudo certo com o pedido",
    body: "Pedido rápido e sem complicação. A camisa é confortável e o caimento é perfeito no tamanho P.",
    verified: true,
  },
  {
    name: "Anderson M.",
    date: "01/04/2026",
    rating: 4,
    title: "Boa camisa",
    body: "Gostei bastante do material. Entrega ok e produto conforme anunciado. Compraria de novo.",
    verified: true,
  },
  {
    name: "Sabrina T.",
    date: "29/03/2026",
    rating: 5,
    title: "Perfeita pra torcer",
    body: "Usei na final do campeonato e arrasei. Tecido leve, não esquenta e a cor chama atenção. Adorei.",
    verified: true,
  },
  {
    name: "Leonardo P.",
    date: "27/03/2026",
    rating: 5,
    title: "Entrega impecável",
    body: "Tudo certo do pedido à entrega. Camisa bem feita, com acabamento de qualidade. Nota 10.",
    verified: true,
  },
  {
    name: "Renata B.",
    date: "24/03/2026",
    rating: 5,
    title: "Voltarei a comprar",
    body: "Primeira compra na loja e fiquei muito satisfeita. Produto excelente e atendimento atencioso.",
    verified: true,
  },
  {
    name: "Caio D.",
    date: "22/03/2026",
    rating: 4,
    title: "Muito boa",
    body: "Camisa confortável e bonita. Só achei o prazo um pouco longo, mas o produto compensou a espera.",
    verified: true,
  },
  {
    name: "Mariana L.",
    date: "19/03/2026",
    rating: 5,
    title: "Simplesmente perfeita",
    body: "Material de primeira, cor vibrante e caimento ótimo. Recomendo de olhos fechados, vale muito a pena.",
    verified: true,
  },
  {
    name: "Paulo H.",
    date: "17/03/2026",
    rating: 5,
    title: "Ótimo custo-benefício",
    body: "Difícil achar uma camisa tão boa por esse preço. Comprei no PIX e a economia foi grande. Aprovado!",
    verified: true,
  },
]

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
