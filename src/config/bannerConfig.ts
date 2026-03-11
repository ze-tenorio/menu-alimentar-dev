import * as amplitude from "@amplitude/analytics-browser";

export interface BannerConfig {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
}

export const bannerConfig: BannerConfig = {
  id: "easter-2026",
  image: "/banners/easter-banner.png",
  title: "PÁSCOA COM EQUILÍBRIO!",
  subtitle: "CHOCOLATE SIM, MAS COM CONSCIÊNCIA",
  buttonText: "Continuar",
  active: true,
};

export const trackBannerView = (bannerId: string) => {
  amplitude.track("Welcome Banner Viewed", {
    banner_id: bannerId,
    screen: "WelcomeBannerScreen",
  });
};

export const trackBannerClick = (bannerId: string) => {
  amplitude.track("Welcome Banner Clicked", {
    banner_id: bannerId,
    screen: "WelcomeBannerScreen",
  });
};
