import { useEffect } from "react";
import {
  bannerConfig,
  trackBannerView,
  trackBannerClick,
} from "../config/bannerConfig";

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
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header TotalPass */}
      <div className="bg-black py-4 px-6 flex justify-center">
        <div className="flex items-center gap-1">
          <span className="text-white text-xl font-light tracking-wider">
            TOTAL
          </span>
          <span className="text-emerald-400 text-xl font-bold tracking-wider">
            PASS
          </span>
        </div>
      </div>

      {/* Banner Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bannerConfig.image})`,
          }}
        />

        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6">
          {/* Title Section */}
          <div className="pt-8">
            <h1 className="text-white text-4xl font-black leading-tight drop-shadow-lg">
              {bannerConfig.title}
            </h1>
            <p className="text-amber-300 text-xl font-bold mt-4 drop-shadow-md">
              {bannerConfig.subtitle}
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />
        </div>
      </div>

      {/* Button Container */}
      <div className="bg-black px-6 py-8">
        <button
          onClick={handleContinue}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-full font-semibold text-lg transition-colors shadow-lg"
        >
          {bannerConfig.buttonText}
        </button>
      </div>
    </div>
  );
};

export default WelcomeBannerScreen;
