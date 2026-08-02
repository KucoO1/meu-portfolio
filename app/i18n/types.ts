export type Locale = "pt" | "en" | "fr" | "es" | "de";

export const LOCALES: Locale[] = ["pt", "en", "fr", "es", "de"];

export const LOCALE_LABELS: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  fr: "Français",
  es: "Español",
  de: "Deutsch",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  pt: "🇵🇹",
  en: "🇬🇧",
  fr: "🇫🇷",
  es: "🇪🇸",
  de: "🇩🇪",
};

export interface TranslationShape {
  meta: {
    title: string;
    description: string;
  };
  header: {
    nav: {
      home: string;
      about: string;
      projects: string;
      skills: string;
      contact: string;
    };
    toggleTheme: string;
    openMenu: string;
    language: string;
  };
  hero: {
    greeting: string;
    name: string;
    roles: string[];
    subtitle: string;
    subtitleHighlight: string;
    description: string;
    specialization: string;
    ctaProjects: string;
    ctaContact: string;
    imageAlt: string;
  };
  about: {
    title: string;
    name: string;
    paragraph1: string;
    paragraph2: string;
    stats: {
      experience: string;
      projects: string;
      clients: string;
      dedication: string;
    };
  };
  skills: {
    title: string;
    subtitle: string;
    andMore: string;
  };
  projectsSection: {
    title: string;
    subtitle: string;
    featured: string;
    viewProject: string;
    code: string;
    technicalDetails: string;
  };
  contact: {
    title: string;
    subtitle: string;
    infoTitle: string;
    email: string;
    phone: string;
    location: string;
    locationValue: string;
    followMe: string;
    formTitle: string;
    formName: string;
    formNamePlaceholder: string;
    formEmail: string;
    formEmailPlaceholder: string;
    formSubject: string;
    formSubjectPlaceholder: string;
    formMessage: string;
    formMessagePlaceholder: string;
    formSubmit: string;
  };
  footer: {
    title: string;
    subtitle: string;
    cta: string;
    rights: string;
  };
  projectDetail: {
    backToProjects: string;
    viewLiveDemo: string;
    viewLiveProject: string;
    viewSourceCode: string;
    interactiveDemo: string;
    overview: string;
    problem: string;
    stack: string;
    architecture: string;
    backend: string;
    backendNotice: string;
    backendNoticeDemo: string;
    features: string;
    challenges: string;
    learnings: string;
    gallery: string;
    galleryAlt: string;
    ctaTitle: string;
    ctaDescriptionDemo: string;
    ctaDescription: string;
    viewProject: string;
    code: string;
    otherProjects: string;
  };
  projects: Record<
    string,
    {
      title: string;
      description: string;
    }
  >;
}
