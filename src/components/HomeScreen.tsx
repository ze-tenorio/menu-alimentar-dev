import React, { useRef, useState, useEffect } from "react";
import { ChevronRight, Calendar, LogOut, ClipboardList, TrendingDown, Dumbbell, Scale } from "lucide-react";
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
  onOpenRoadmap: () => void;
  onViewMenus: () => void;
  onViewMenu: (menuId: string) => void;
  onLogout: () => void;
  recentMenus: RecentMenu[];
  embedded?: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onGenerateMenu,
  onOpenRoadmap,
  onViewMenus,
  onViewMenu,
  onLogout,
  recentMenus,
  embedded = false,
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
    const iconClass = "w-5 h-5 text-primary";
    switch (type) {
      case "weight_loss":
        return <TrendingDown className={iconClass} strokeWidth={2} />;
      case "muscle_gain":
        return <Dumbbell className={iconClass} strokeWidth={2} />;
      default:
        return <Scale className={iconClass} strokeWidth={2} />;
    }
  };

  return (
    <div className={`${embedded ? "h-full" : "fixed inset-0 z-50"} bg-background flex flex-col relative`}>
      <div className="flex-1 min-h-0 overflow-y-auto pb-20 max-w-lg mx-auto w-full">
        <div className="px-4 pt-6 pb-2">
          <p className="app-muted-label mb-1">Início</p>
          <h1 className="app-screen-title">Olá!</h1>
          <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
            Você está na jornada do menu. Crie e acesse seus planos alimentares aqui.
          </p>
        </div>

        {/* Banner de acesso ao roadmap */}
        <div className="px-4 mb-6">
          <div className="rounded-lg overflow-hidden border border-border bg-primary/5 flex flex-row min-h-[132px]">
            <div className="w-[38%] min-w-[120px] flex-shrink-0 relative self-stretch">
              <img
                src="/banners/roadmap-banner.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-left"
              />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
              <h2 className="text-foreground text-base font-semibold leading-snug mb-1">Acompanhe sua jornada</h2>
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                Veja os próximos passos para atingir seu objetivo.
              </p>
              <button
                type="button"
                onClick={onOpenRoadmap}
                className="self-start bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium text-sm hover:opacity-95 transition-opacity"
              >
                Ver jornada
              </button>
            </div>
          </div>
        </div>

        <section className="mb-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-foreground font-semibold text-sm tracking-tight">Últimos menus</h2>
            <button
              type="button"
              onClick={onViewMenus}
              className="text-primary font-medium text-sm flex items-center gap-0.5"
            >
              Ver mais
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
          <div className="overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-3 px-4">
              {recentMenus.length === 0 ? (
                <div className="app-card flex-shrink-0 w-40 p-4 flex flex-col items-center justify-center text-center min-h-[100px]">
                  <ClipboardList className="w-8 h-8 text-muted-foreground mb-2" strokeWidth={1.75} />
                  <p className="text-muted-foreground text-xs">Nenhum menu ainda</p>
                  <button type="button" onClick={onGenerateMenu} className="mt-2 text-primary text-xs font-medium">
                    Gerar primeiro
                  </button>
                </div>
              ) : (
                recentMenus.slice(0, 10).map((menu) => (
                  <button
                    key={menu.id}
                    type="button"
                    onClick={() => onViewMenu(menu.id)}
                    className="app-card flex-shrink-0 w-36 p-3 text-left transition-colors hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      {getObjectiveIcon(menu.type)}
                    </div>
                    <p className="text-foreground font-medium text-sm truncate">{menu.title}</p>
                    <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                      <Calendar size={12} strokeWidth={2} />
                      {menu.date}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </section>

        <div className="px-4 mb-6">
          <button
            type="button"
            onClick={onGenerateMenu}
            className="w-full rounded-lg border border-border bg-background text-foreground font-medium py-3 text-sm hover:bg-muted/40 transition-colors"
          >
            Gerar novo menu
          </button>
        </div>

        <section className="mb-8">
          <h2 className="text-foreground font-semibold text-sm px-4 mb-3 tracking-tight">O que podemos oferecer</h2>
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-3 px-4 pb-2 scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {offersCarouselItems.map((item) => (
              <div
                key={item.id}
                className="app-card flex-shrink-0 w-[85%] max-w-sm overflow-hidden snap-center shadow-none"
                style={{ scrollSnapAlign: "start" }}
              >
                <div className={`flex flex-row min-h-[160px] ${item.backgroundClass || "bg-muted/40"}`}>
                  {item.imageUrl ? (
                    <div className="w-[40%] min-w-[100px] flex-shrink-0 relative self-stretch">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-left"
                      />
                    </div>
                  ) : (
                    <div className="w-[40%] min-w-[100px] flex-shrink-0 self-stretch bg-muted/50" />
                  )}
                  <div className="flex-1 p-4 flex flex-col justify-between min-w-0 bg-card">
                    <div>
                      <span className="inline-block text-[10px] font-medium uppercase tracking-wide text-muted-foreground bg-muted px-2 py-0.5 rounded-md mb-2">
                        Em breve
                      </span>
                      <h3 className="text-foreground font-semibold text-sm leading-snug">{item.title}</h3>
                      <p className="text-muted-foreground text-xs mt-1 line-clamp-2 leading-relaxed">{item.subtitle}</p>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="mt-3 w-full sm:w-auto px-4 py-2 rounded-lg font-medium text-sm opacity-50 cursor-not-allowed border border-border bg-muted text-muted-foreground"
                    >
                      Em breve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-1.5 mt-3">
            {offersCarouselItems.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToCarouselSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === carouselIndex ? "bg-primary w-6" : "bg-muted-foreground/25 w-1.5"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        <div className="px-4 pb-6 pt-2">
          <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
            <img src="/logo-totalpass-new.png" alt="TotalPass" className="h-7 object-contain opacity-90" />
            <span className="text-muted-foreground text-xs">
              powered by <img src="/logo-starbem.png" alt="Starbem" className="h-3 inline align-middle opacity-90" />
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="absolute bottom-3 right-4 z-10 flex items-center gap-2 bg-card/95 backdrop-blur-sm text-foreground font-medium text-sm py-2.5 px-4 rounded-full border border-border shadow-sm hover:bg-card transition-colors"
      >
        Sair
        <LogOut size={18} className="text-muted-foreground" strokeWidth={2} />
      </button>
    </div>
  );
};

export default HomeScreen;
