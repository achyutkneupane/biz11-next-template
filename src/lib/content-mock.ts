export type SectionContent = {
  label: string;
  title: string;
  subtitle: string;
};

export type LandingContent = {
  hero: {
    eyebrow: string;
    headline: string;
    highlight: string;
    subtitle: string;
  };
  sections: {
    latest: SectionContent & { cta: string };
    popular: SectionContent & { cta: string };
    cta: {
      eyebrow: string;
      title: string;
      subtitle: string;
      buttonLabel: string;
    };
  };
};

const landing: LandingContent = {
  hero: {
    eyebrow: "Multi-tenant e-commerce platform",
    headline: "Discover products that",
    highlight: "elevate your everyday",
    subtitle:
      "Biz11 connects you with curated products from trusted brands worldwide. Shop smarter, live better.",
  },
  sections: {
    latest: {
      label: "Latest",
      title: "New Arrivals",
      subtitle: "Fresh from our catalog",
      cta: "View all",
    },
    popular: {
      label: "Popular",
      title: "Most Wanted",
      subtitle: "Trending products right now",
      cta: "View all",
    },
    cta: {
      eyebrow: "Ready to explore?",
      title: "Everything you need, all in one place",
      subtitle: "Browse our full catalog of curated products from trusted brands.",
      buttonLabel: "Browse All Products",
    },
  },
};

export function getLandingContent(): LandingContent {
  return landing;
}

export function getNavLinks() {
  return [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
  ];
}
