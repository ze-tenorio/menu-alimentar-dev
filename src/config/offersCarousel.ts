/**
 * Itens do carrossel de ofertas na tela principal.
 * Adicione novos itens para exibir mais ofertas no app.
 */
export interface OfferCarouselItem {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  /** URL da imagem (lado esquerdo do banner). Use "" para banner só com texto/cor. */
  imageUrl?: string;
  /** Classe CSS para fundo quando não há imagem (ex: gradiente). */
  backgroundClass?: string;
  /** Cor do botão CTA (Tailwind). */
  ctaButtonClass?: string;
  /** Ação ao clicar no CTA (link externo, deep link, etc.). */
  onCtaClick?: () => void;
}

export const offersCarouselItems: OfferCarouselItem[] = [
  {
    id: "nutricionista",
    title: "Precisa de um Nutricionista?",
    subtitle: "Marque seu atendimento online com nosso profissional.",
    ctaText: "Agendar consulta",
    imageUrl: "/banners/nutricionista-banner.png",
    backgroundClass: "bg-gradient-to-r from-rose-200/90 to-purple-200/90",
    ctaButtonClass: "bg-violet-200 text-gray-900 hover:bg-violet-300",
  },
  {
    id: "caneta-emagrecedora",
    title: "Encomende sua caneta emagrecedora",
    subtitle: "Entrega rápida e acompanhamento especializado.",
    ctaText: "Encomendar",
    imageUrl: "/banners/caneta-emagrecedora-banner.png",
    backgroundClass: "bg-gradient-to-r from-emerald-100 to-teal-100",
    ctaButtonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
];
