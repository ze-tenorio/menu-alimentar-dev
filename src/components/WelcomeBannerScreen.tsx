import { useEffect } from "react";
import { bannerConfig, trackBannerView, trackBannerClick } from "../config/bannerConfig";

interface WelcomeBannerScreenProps {
  onContinue: () => void;
}

const WelcomeBannerScreen = ({ onContinue }: WelcomeBannerScreenProps) => {
  useEffect(() => {
    trackBannerView(bannerConfig.id);
  }, []);

  const handleContinue = () => {
    trackBannerClick(bannerConfig.id);
    onContinue();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[hsl(var(--foreground))] text-[hsl(var(--background))]">
      <div className="py-4 px-6 flex justify-center border-b border-white/10">
        <div className="flex items-baseline gap-0.5">
          <span className="text-lg font-medium tracking-wide opacity-90">TOTAL</span>
          <span className="text-lg font-semibold tracking-wide text-primary">PASS</span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden min-h-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bannerConfig.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/65" />

        <div className="relative h-full flex flex-col justify-between p-6">
          <div className="pt-6 max-w-md">
            <h1 className="text-[hsl(var(--background))] text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">
              {bannerConfig.title}
            </h1>
            <p className="text-primary text-base sm:text-lg font-medium mt-4 leading-snug opacity-95">
              {bannerConfig.subtitle}
            </p>
          </div>
          <div className="flex-1 min-h-8" />
        </div>
      </div>

      <div className="px-6 py-6 border-t border-white/10 bg-[hsl(var(--foreground))]">
        <button
          type="button"
          onClick={handleContinue}
          className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-medium text-base transition-opacity hover:opacity-95"
        >
          {bannerConfig.buttonText}
        </button>
      </div>
    </div>
  );
};

export default WelcomeBannerScreen;
