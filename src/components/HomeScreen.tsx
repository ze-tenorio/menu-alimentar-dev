import React, { useRef, useState, useEffect } from "react";
import { ChevronRight, Calendar } from "lucide-react";
import { offersCarouselItems } from "../config/offersCarousel";

export interface RecentMenu {
  id: string;
  title: string;
  objective: string;
  date: string;
  type: "maintenance" | "weight_loss" | "muscle_gain";
  daily_energy_kcal?: number;
  current_weight?: number;
  age?: number;
}

interface HomeScreenProps {
  onGenerateMenu: () => void;
  onViewMenus: () => void;
  onViewMenu: (menuId: string) => void;
  recentMenus: RecentMenu[];
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onGenerateMenu,
  onViewMenus,
  onViewMenu,
  recentMenus,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const scrollToCarouselSlide = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const width = el.offsetWidth;
    el.scrollTo({ left: width * index, behavior: "smooth" });
    setCarouselIndex(index);
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => {
      const width = el.offsetWidth;
      const index = Math.round(el.scrollLeft / width);
      setCarouselIndex(index);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const getObjectiveIcon = (type: string) => {
    switch (type) {
      case "weight_loss":
        return "📉";
      case "muscle_gain":
        return "💪";
      default:
        return "⚖️";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Header com logo */}
        <div className="px-4 pt-6 pb-2">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/logo-totalpass-new.png"
              alt="TotalPass"
              className="h-8 object-contain"
            />
            <span className="text-gray-500 text-xs ml-2 opacity-70">
              powered by <img src="/logo-starbem.png" alt="Starbem" className="h-3 inline" />
            </span>
          </div>
          <h1 className="text-gray-900 text-xl font-bold">Olá!</h1>
          <p className="text-gray-600 text-sm mt-0.5">
            Você está na jornada do menu. Crie e acesse seus planos alimentares aqui.
          </p>
        </div>

        {/* Banner Gerar menu: imagem à esquerda (altura total), texto + botão à direita */}
        <div className="px-4 mb-6">
          <div className="rounded-2xl overflow-hidden bg-[#d4edda] border border-green-200/80 shadow-sm flex flex-row min-h-[140px]">
            <div className="w-[38%] min-w-[120px] flex-shrink-0 relative self-stretch">
              <img
                src="/banners/gerar-menu-banner.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-left"
              />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
              <h2 className="text-gray-800 text-base font-bold leading-snug mb-0.5">
                Receba um plano alimentar
              </h2>
              <p className="text-gray-700 text-sm mb-3">
                detalhado e ajustado para você
              </p>
              <button
                onClick={onGenerateMenu}
                className="self-start bg-[#0d6b2e] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#0a5524] transition-colors"
              >
                Gerar menu
              </button>
            </div>
          </div>
        </div>

        {/* Últimos menus (estilo Últimas lojas) */}
        <section className="mb-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-gray-900 font-bold text-base">Últimos menus</h2>
            <button
              onClick={onViewMenus}
              className="text-primary font-semibold text-sm flex items-center gap-0.5"
            >
              Ver mais
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-3 px-4">
              {recentMenus.length === 0 ? (
                <div className="flex-shrink-0 w-40 rounded-xl border border-gray-200 bg-gray-50 p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
                  <span className="text-2xl mb-2">📋</span>
                  <p className="text-gray-500 text-xs">Nenhum menu ainda</p>
                  <button
                    onClick={onGenerateMenu}
                    className="mt-2 text-primary text-xs font-medium"
                  >
                    Gerar primeiro
                  </button>
                </div>
              ) : (
                recentMenus.slice(0, 10).map((menu) => (
                  <button
                    key={menu.id}
                    onClick={() => onViewMenu(menu.id)}
                    className="flex-shrink-0 w-36 rounded-xl border border-gray-200 bg-white p-3 text-left shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg mb-2">
                      {getObjectiveIcon(menu.type)}
                    </div>
                    <p className="text-gray-800 font-semibold text-sm truncate">
                      {menu.title}
                    </p>
                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                      <Calendar size={10} />
                      {menu.date}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Carrossel de ofertas (estilo imagem 1 destaque + imagem 3) */}
        <section className="mb-8">
          <h2 className="text-gray-900 font-bold text-base px-4 mb-3">O que podemos oferecer</h2>
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-2 scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {offersCarouselItems.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[85%] max-w-sm rounded-2xl overflow-hidden shadow-md snap-center"
                style={{ scrollSnapAlign: "start" }}
              >
                <div
                  className={`flex flex-row min-h-[160px] ${item.backgroundClass || "bg-gray-100"}`}
                >
                  {/* Imagem à esquerda: ocupa toda a altura do banner */}
                  {item.imageUrl ? (
                    <div className="w-[40%] min-w-[100px] flex-shrink-0 relative self-stretch">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-left"
                      />
                    </div>
                  ) : (
                    <div className="w-[40%] min-w-[100px] flex-shrink-0 self-stretch bg-gray-200/50" />
                  )}
                  {/* Texto e botão à direita */}
                  <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="text-gray-900 font-bold text-base leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-700 text-sm mt-1 line-clamp-2">
                        {item.subtitle}
                      </p>
                    </div>
                    <button
                      onClick={item.onCtaClick}
                      className={`mt-3 w-full sm:w-auto px-4 py-2 rounded-xl font-semibold text-sm ${item.ctaButtonClass || "bg-primary text-primary-foreground"}`}
                    >
                      {item.ctaText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Dots do carrossel */}
          <div className="flex justify-center gap-1.5 mt-3">
            {offersCarouselItems.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToCarouselSlide(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === carouselIndex ? "bg-primary w-5" : "bg-gray-300"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeScreen;
