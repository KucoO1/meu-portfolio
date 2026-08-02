import type { TranslationShape } from "../types";

const fr: TranslationShape = {
  meta: {
    title: "Nataniel Oliveira - Développeur Fullstack",
    description:
      "Portfolio de Nataniel Oliveira, développeur Fullstack spécialisé dans des solutions numériques innovantes.",
  },
  header: {
    nav: {
      home: "Accueil",
      about: "À propos",
      projects: "Projets",
      skills: "Compétences",
      contact: "Contact",
    },
    toggleTheme: "Basculer mode clair/sombre",
    openMenu: "Ouvrir le menu",
    language: "Langue",
  },
  hero: {
    greeting: "Bonjour, je suis",
    name: "Nataniel Oliveira,",
    roles: ["Programmeur", "Développeur Fullstack", "Créatif"],
    subtitle: "Développeur",
    subtitleHighlight: "Fullstack",
    description:
      "passionné par la création de solutions numériques modernes et percutantes.",
    specialization:
      "Je me spécialise dans la création d'applications web et mobiles performantes et évolutives, avec un fort accent sur l'expérience utilisateur.",
    ctaProjects: "Voir les projets",
    ctaContact: "Me contacter",
    imageAlt: "Photo de profil de Nataniel Oliveira",
  },
  about: {
    title: "À propos de moi",
    name: "Nataniel Oliveira",
    paragraph1:
      "Je suis un développeur Fullstack passionné par la technologie et l'innovation. Avec plus de 5 ans d'expérience, j'ai consacré ma carrière à créer des solutions numériques qui font la différence dans la vie des gens.",
    paragraph2:
      "Mon expertise va du développement front-end avec React et Next.js au back-end avec Node.js et diverses bases de données. Je crois que la technologie doit être non seulement fonctionnelle, mais aussi intuitive et agréable à utiliser.",
    stats: {
      experience: "Années d'expérience",
      projects: "Projets réalisés",
      clients: "Clients satisfaits",
      dedication: "Dévoué",
    },
  },
  skills: {
    title: "Mes compétences",
    subtitle: "Technologies et outils que j'utilise pour transformer des idées en réalité",
    andMore: "Et bien plus encore +",
  },
  projectsSection: {
    title: "Mes projets",
    subtitle: "Découvrez quelques-uns de mes travaux les plus récents et représentatifs",
    featured: "En vedette",
    viewProject: "Voir le projet",
    code: "Code",
    technicalDetails: "Détails techniques du projet",
  },
  contact: {
    title: "On discute ?",
    subtitle: "Je suis disponible pour de nouveaux projets et opportunités. Contactez-moi !",
    infoTitle: "Informations de contact",
    email: "Email",
    phone: "Téléphone",
    location: "Localisation",
    locationValue: "Luanda, Angola",
    followMe: "Suivez-moi",
    formTitle: "Envoyer un message",
    formName: "Nom",
    formNamePlaceholder: "Votre nom",
    formEmail: "Email",
    formEmailPlaceholder: "votre@email.com",
    formSubject: "Sujet",
    formSubjectPlaceholder: "Sujet du message",
    formMessage: "Message",
    formMessagePlaceholder: "Votre message...",
    formSubmit: "Envoyer le message",
  },
  footer: {
    title: "On travaille ensemble ?",
    subtitle: "Je suis toujours ouvert à discuter de nouveaux projets et opportunités.",
    cta: "Me contacter",
    rights: "Tous droits réservés.",
  },
  projectDetail: {
    backToProjects: "Retour aux projets",
    viewLiveDemo: "Voir la démo interactive",
    viewLiveProject: "Voir le projet en ligne",
    viewSourceCode: "Voir le code source",
    interactiveDemo: "Démo interactive",
    overview: "Vue d'ensemble",
    problem: "Le problème / objectif",
    stack: "Stack technique",
    architecture: "Architecture et décisions techniques",
    backend: "Comment le backend a été conçu",
    backendNotice:
      "Le backend de ce projet n'est pas hébergé publiquement (c'est pourquoi les étiquettes technologiques sous le titre indiquent la stack utilisée).",
    backendNoticeDemo:
      "Essayez la démo interactive en haut de cette page pour voir le flux principal en action — la simulation s'exécute entièrement dans le navigateur.",
    features: "Fonctionnalités principales",
    challenges: "Défis et solutions",
    learnings: "Principaux enseignements",
    gallery: "Galerie",
    galleryAlt: "capture",
    ctaTitle: "Vous voulez voir le projet de plus près ?",
    ctaDescriptionDemo: "Explorez la démo interactive ci-dessus ou le code source complet sur GitHub.",
    ctaDescription: "Explorez la démo en ligne ou le code source complet sur GitHub.",
    viewProject: "Voir le projet",
    code: "Code",
    otherProjects: "Autres projets",
  },
  projects: {
    "boardgov-ao": {
      title: "BoardGov AO",
      description:
        "Plateforme multi-tenant de gouvernance d'entreprise pour les conseils d'administration angolais : réunions, quorum, votes, procès-verbaux et conformité BNA. Backend non publié — inclut une démo interactive.",
    },
    crfdesk: {
      title: "CRFDesk",
      description:
        "Plateforme de screening et de conformité pour actifs crypto, avec scoring de risque explicable et rapports prêts pour les régulateurs. Backend non publié — inclut une démo interactive.",
    },
    argpack: {
      title: "ArgPack",
      description: "Plateforme facilitant l'exportation de produits depuis l'Argentine.",
    },
    qrcodepay: {
      title: "QrCodePay",
      description:
        "Plateforme de paiement par QR Code pour commerçants, avec onboarding sur invitation et tableau de bord administrateur complet. Backend non publié — inclut une démo interactive.",
    },
    ecommerce: {
      title: "E-commerce",
      description: "Plateforme e-commerce complète avec tableau de bord administrateur.",
    },
    barbearia: {
      title: "Salon de coiffure",
      description:
        "Plateforme de prise de rendez-vous pour un salon de coiffure, avec tableau de bord administrateur et intégration de paiement.",
    },
    "gestao-financeira": {
      title: "Système de gestion financière personnelle",
      description: "Système de suivi des finances personnelles avec rapports.",
    },
    orbital: {
      title: "Projet Orbita",
      description:
        "Plateforme e-commerce complète avec tableau de bord administrateur et intégration de paiement.",
    },
    neoxia: {
      title: "Neoxia",
      description:
        "Agence de marketing digital, visant à fournir des solutions innovantes et efficaces aux entreprises souhaitant développer leur présence en ligne et atteindre leurs objectifs commerciaux.",
    },
    "gestao-stock": {
      title: "Gestion de stock",
      description: "Système complet de gestion de stock.",
    },
    "landing-page": {
      title: "Landing Page",
      description: "Page de conversion hautement persuasive.",
    },
    "games-hub": {
      title: "Games Hub",
      description: "Mini plateforme de jeux.",
    },
    primeflix: {
      title: "PrimeFlix",
      description:
        "Plateforme pour découvrir les films tendances et leurs détails via une API publique.",
    },
  },
};

export default fr;
