import type { TranslationShape } from "../types";

const en: TranslationShape = {
  meta: {
    title: "Nataniel Oliveira - Fullstack Developer",
    description:
      "Portfolio of Nataniel Oliveira, a Fullstack developer specialized in innovative digital solutions.",
  },
  header: {
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      skills: "Skills",
      contact: "Contact",
    },
    toggleTheme: "Toggle light/dark mode",
    openMenu: "Open menu",
    language: "Language",
  },
  hero: {
    greeting: "Hi, I'm",
    name: "Nataniel Oliveira,",
    roles: ["Programmer", "Fullstack Developer", "Creative"],
    subtitle: "Fullstack",
    subtitleHighlight: "Developer",
    description:
      "passionate about building modern, impactful digital solutions.",
    specialization:
      "I specialize in building performant, scalable web and mobile applications with a strong focus on user experience.",
    ctaProjects: "View Projects",
    ctaContact: "Get in Touch",
    imageAlt: "Profile photo of Nataniel Oliveira",
  },
  about: {
    title: "About Me",
    name: "Nataniel Oliveira",
    paragraph1:
      "I'm a Fullstack developer passionate about technology and innovation. With over 5 years of experience, I've dedicated my career to building digital solutions that make a real difference in people's lives.",
    paragraph2:
      "My expertise ranges from front-end development with React and Next.js to back-end work with Node.js and various databases. I believe technology should be not only functional, but also intuitive and enjoyable to use.",
    stats: {
      experience: "Years of Experience",
      projects: "Completed Projects",
      clients: "Satisfied Clients",
      dedication: "Dedicated",
    },
  },
  skills: {
    title: "My Skills",
    subtitle: "Technologies and tools I use to turn ideas into reality",
    andMore: "And Much More +",
  },
  projectsSection: {
    title: "My Projects",
    subtitle: "Check out some of my most recent and representative work",
    featured: "Featured",
    viewProject: "View project",
    code: "Code",
    technicalDetails: "Technical project details",
  },
  contact: {
    title: "Let's Talk?",
    subtitle: "I'm available for new projects and opportunities. Get in touch!",
    infoTitle: "Contact Information",
    email: "Email",
    phone: "Phone",
    location: "Location",
    locationValue: "Luanda, Angola",
    followMe: "Follow me",
    formTitle: "Send a Message",
    formName: "Name",
    formNamePlaceholder: "Your name",
    formEmail: "Email",
    formEmailPlaceholder: "your@email.com",
    formSubject: "Subject",
    formSubjectPlaceholder: "Message subject",
    formMessage: "Message",
    formMessagePlaceholder: "Your message...",
    formSubmit: "Send Message",
  },
  footer: {
    title: "Let's work together?",
    subtitle: "I'm always open to discussing new projects and opportunities.",
    cta: "Get in Touch",
    rights: "All rights reserved.",
  },
  projectDetail: {
    backToProjects: "Back to projects",
    viewLiveDemo: "View interactive demo",
    viewLiveProject: "View live project",
    viewSourceCode: "View source code",
    interactiveDemo: "Interactive demo",
    overview: "Overview",
    problem: "The problem / goal",
    stack: "Tech stack",
    architecture: "Architecture & technical decisions",
    backend: "How the backend was designed",
    backendNotice:
      "This project's backend is not publicly hosted (that's why the technology tags below the title show the stack used).",
    backendNoticeDemo:
      "Try the interactive demo at the top of this page to see the main flow in action — the simulation runs entirely in the browser.",
    features: "Key features",
    challenges: "Challenges & solutions",
    learnings: "Key takeaways",
    gallery: "Gallery",
    galleryAlt: "screenshot",
    ctaTitle: "Want to see the project up close?",
    ctaDescriptionDemo: "Explore the interactive demo above or the full source code on GitHub.",
    ctaDescription: "Explore the live demo or the full source code on GitHub.",
    viewProject: "View project",
    code: "Code",
    otherProjects: "Other projects",
  },
  projects: {
    "boardgov-ao": {
      title: "BoardGov AO",
      description:
        "Multi-tenant corporate governance platform for Angolan boards of directors: meetings, quorum, voting, minutes, and BNA compliance. Backend not publicly deployed — includes an interactive demo.",
    },
    crfdesk: {
      title: "CRFDesk",
      description:
        "Screening and compliance platform for crypto assets, with explainable risk scoring and regulator-ready reports. Backend not publicly deployed — includes an interactive demo.",
    },
    argpack: {
      title: "ArgPack",
      description: "Platform to facilitate product exports from Argentina.",
    },
    qrcodepay: {
      title: "QrCodePay",
      description:
        "QR Code payment platform for merchants, with invite-based onboarding and a full admin dashboard. Backend not publicly deployed — includes an interactive demo.",
    },
    ecommerce: {
      title: "E-commerce",
      description: "Full e-commerce platform with an admin dashboard.",
    },
    barbearia: {
      title: "Barbershop",
      description:
        "Booking platform for a barbershop, with an admin dashboard and payment integration.",
    },
    "gestao-financeira": {
      title: "Personal Finance Management System",
      description: "System for tracking personal finances with reports.",
    },
    orbital: {
      title: "Orbita Project",
      description:
        "Full e-commerce platform with an admin dashboard and payment integration.",
    },
    neoxia: {
      title: "Neoxia",
      description:
        "Digital Marketing agency, aimed at providing innovative and effective solutions for companies looking to grow their online presence and reach their business goals.",
    },
    "gestao-stock": {
      title: "Stock Management",
      description: "Full inventory/stock management system.",
    },
    "landing-page": {
      title: "Landing Page",
      description: "Highly persuasive conversion page.",
    },
    "games-hub": {
      title: "Games Hub",
      description: "Mini game platform.",
    },
    primeflix: {
      title: "PrimeFlix",
      description:
        "Platform to browse trending movies and their details using a public API.",
    },
    pizzaria: {
      title: "PizzaExpress",
      description:
        "Order management system for a pizzeria: tables, kitchen, and admin panel. Backend not published — includes an interactive demo.",
    },
  },
};

export default en;
