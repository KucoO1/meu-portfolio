import type { ProjectTranslationDict } from "./types";

const fr: ProjectTranslationDict = {
  ecommerce: {
    title: "E-commerce",
    tagline: "Plateforme e-commerce complète, du catalogue au paiement",
    overview:
      "Une boutique en ligne complète construite pour simuler le fonctionnement réel d'un commerçant petit/moyen : un catalogue de produits organisé par catégorie, un panier persistant, un paiement avec récapitulatif de commande, et une base pensée dès le départ pour supporter un panneau d'administration de gestion des produits et des commandes. L'objectif était de construire la même colonne vertébrale que des plateformes comme Shopify ou WooCommerce, mais bâtie à la main pour comprendre exactement ce qui se passe derrière chaque clic sur « Ajouter au panier ».",
    problem:
      "Les commerçants qui veulent vendre en ligne font face à deux extrêmes : des solutions SaaS coûteuses et peu flexibles (Shopify, Nuvemshop) ou des solutions entièrement sur mesure, coûteuses à maintenir. Le défi était de construire une base e-commerce open-source légère et indépendante de toute plateforme, que n'importe quelle entreprise pourrait cloner et adapter à son catalogue, avec un contrôle total sur le modèle de données, le flux de paiement et l'expérience d'achat.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Context API / Zustand pour le panier"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT pour l'authentification", "Multer / Cloudinary pour les images"] },
      { label: "Base de données", items: ["MongoDB", "Mongoose (ODM)"] },
      { label: "Infrastructure", items: ["Vercel (frontend)", "Render / Railway (API)", "Stripe / Multicaixa Express (paiements)"] },
    ],
    architecture: [
      {
        title: "Next.js comme couche de présentation, une API séparée comme source de vérité",
        content:
          "J'ai choisi de découpler complètement le frontend du backend plutôt que d'utiliser uniquement les API Routes de Next.js. Les pages catalogue et produit utilisent des Server Components avec récupération au build/revalidate (ISR) pour servir du HTML prêt aux moteurs de recherche — essentiel pour un site e-commerce, où le SEO est la principale source de trafic organique — tandis que le panier, le paiement et l'espace compte utilisent des Client Components qui communiquent directement avec l'API Node/Express via REST. Cette séparation signifie aussi que la même API pourrait alimenter une application mobile à l'avenir sans aucune modification.",
      },
      {
        title: "Modélisation des données orientée domaine",
        content:
          "Au lieu d'un unique document « Produit » générique, le schéma sépare Product, Category et Variant (taille/couleur avec leur propre stock et prix), permettant à un produit d'avoir plusieurs variantes sans dupliquer les informations marketing (description, images, SEO). Les commandes stockent un instantané du prix et du nom du produit au moment de l'achat — une décision d'architecture e-commerce critique, car l'historique d'une commande ne doit jamais changer si le commerçant met à jour le prix d'un produit plus tard.",
      },
      {
        title: "Panier persistant et hydratation de l'état",
        content:
          "Le panier est stocké dans le localStorage pour les utilisateurs anonymes et synchronisé avec le compte dès que l'utilisateur se connecte, en fusionnant les deux paniers au lieu d'écraser l'un par l'autre. Cela évite le problème classique des sites e-commerce mal conçus : le client ajoute des produits, se connecte, et le panier « disparaît ».",
      },
    ],
    backend: [
      {
        title: "API REST en Node.js + Express",
        content:
          "L'API expose des ressources prévisibles et versionnées : /api/products, /api/categories, /api/cart, /api/orders, /api/auth, /api/admin/*. Chaque route passe par une chaîne de middlewares : validation du payload (Zod/Joi), authentification JWT si nécessaire, vérification du rôle (client vs admin), et un gestionnaire d'erreurs central qui traduit les erreurs Mongoose en réponses HTTP cohérentes (400, 401, 403, 404, 409, 500) au lieu d'exposer les stack traces au client.",
      },
      {
        title: "Machine à états de la commande",
        content:
          "Une commande traverse des états bien définis — pending → paid → processing → shipped → delivered / cancelled — et chaque transition est validée côté serveur, sans jamais faire confiance à la valeur envoyée par le client. La confirmation de paiement arrive via un webhook de la passerelle de paiement (signature vérifiée avec le secret du fournisseur), ce qui évite l'erreur courante de marquer une commande comme payée simplement parce que le navigateur du client a été redirigé vers une page de succès.",
      },
      {
        title: "Cohérence du stock sous concurrence",
        content:
          "Quand deux personnes essaient d'acheter la dernière unité d'un produit en même temps, un simple « lire le stock, soustraire, sauvegarder » crée une condition de course. La réservation de stock utilise un unique findOneAndUpdate atomique de MongoDB avec la condition stock ≥ quantité demandée — si la condition échoue, l'opération est rejetée immédiatement et le client reçoit « rupture de stock », garantissant que le stock ne devient jamais négatif même sous trafic concurrent.",
      },
    ],
    features: [
      "Catalogue avec catégories, recherche et filtres",
      "Page produit avec variantes (taille/couleur) et galerie d'images",
      "Panier persistant entre les sessions",
      "Paiement avec récapitulatif de commande et calcul de livraison",
      "Authentification client et espace « Mes commandes »",
      "Panneau d'administration pour le CRUD produits/catégories et la gestion des commandes",
    ],
    challenges: [
      {
        title: "Éviter la survente de produits à stock limité",
        content:
          "Résolu avec des opérations atomiques dans MongoDB (findOneAndUpdate conditionnel) plutôt qu'un modèle vérifier-puis-écrire en deux étapes, éliminant la fenêtre où deux requêtes pourraient « voir » le même stock disponible.",
      },
      {
        title: "Garder l'historique des commandes fidèle au moment de l'achat",
        content:
          "Résolu en stockant un instantané immuable des données du produit sur chaque ligne de commande, au lieu d'une simple référence (ID) au produit — pour que les changements futurs de prix ou de nom ne corrompent jamais les commandes passées.",
      },
    ],
    learnings: [
      "Séparer clairement ce qui doit être un Server Component (SEO, données publiques) de ce qui doit être un Client Component (interactivité, état utilisateur)",
      "L'importance de ne jamais faire confiance au prix/état envoyé par le client — le serveur est toujours la source de vérité",
    ],
  },

  orbital: {
    title: "Projet Orbita",
    tagline: "Boutique en ligne de technologie avec sa propre identité visuelle",
    overview:
      "Orbita est la deuxième plateforme e-commerce du portfolio, construite sur la même stack que le projet précédent (Next.js, Node.js, MongoDB) mais avec un objectif différent : au lieu de réutiliser le design, ce projet a servi à explorer une identité visuelle et une expérience de navigation distinctes — une boutique tech avec un thème sombre, une typographie plus audacieuse et une forte emphase sur les images produit — validant que la même base backend peut alimenter des boutiques avec des « marques » complètement différentes.",
    problem:
      "Après avoir construit un e-commerce générique, l'objectif était de répondre à une question très courante dans le monde réel des agences : comment réutiliser une API et une logique métier déjà testées pour lancer une deuxième boutique, avec sa propre identité visuelle, sans dupliquer le travail backend ? Orbita est né comme cet exercice de réutilisation et de spécialisation du frontend.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion pour les micro-interactions"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT", "Architecture de services partagée avec le projet E-commerce"] },
      { label: "Base de données", items: ["MongoDB", "Mongoose"] },
      { label: "Infrastructure", items: ["Vercel", "Render / Railway"] },
    ],
    architecture: [
      {
        title: "Backend comme service réutilisable, frontend comme « thème »",
        content:
          "La couche de domaine (produits, panier, commandes, authentification) a été pensée comme un service indépendant de la présentation. Le frontend d'Orbita consomme les mêmes contrats d'API que le projet E-commerce, mais avec des composants d'UI, une palette de couleurs et un copy complètement différents — prouvant en pratique que la séparation frontend/backend n'est pas que théorique, c'est ce qui permet de lancer une deuxième boutique en beaucoup moins de temps que la première.",
      },
      {
        title: "Un design system propre sur la même fondation technique",
        content:
          "Une nouvelle couche de composants visuels (cartes produit, hero en vedette, navigation) a été construite avec Tailwind et ses propres tokens de couleur et d'espacement, tout en conservant les mêmes hooks de données (useProducts, useCart) du projet précédent — ce qui a drastiquement réduit le temps de développement de la partie fonctionnelle et permis de concentrer l'effort sur l'expérience visuelle.",
      },
    ],
    backend: [
      {
        title: "Mêmes principes d'API que le projet E-commerce",
        content:
          "Orbita suit la même philosophie d'API REST en Node.js/Express avec MongoDB : routes versionnées, authentification JWT, et la même machine à états de commande (pending → paid → shipped → delivered). Ce projet se différencie par sa configuration multi-tenant : le schéma produit inclut un champ storeId, permettant à la même base de données de servir plusieurs boutiques avec des catalogues isolés — la base pour, à l'avenir, transformer cela en une plateforme « e-commerce as a service ».",
      },
      {
        title: "Préparé pour plusieurs boutiques sur la même infrastructure",
        content:
          "Chaque requête à l'API reçoit le storeId via un en-tête ou un sous-domaine, et tous les filtres de lecture/écriture dans Mongoose incluent automatiquement cette condition via un middleware de requête — évitant qu'une boutique voie ou modifie accidentellement les données d'une autre.",
      },
    ],
    features: [
      "Catalogue de produits technologiques avec forte emphase visuelle",
      "Panier et paiement partageant la logique du projet E-commerce",
      "Identité visuelle et navigation propres",
      "Architecture prête pour le multi-boutique (storeId par catalogue)",
    ],
    challenges: [
      {
        title: "Réutiliser la logique sans coupler visuellement les deux projets",
        content:
          "Résolu en isolant toute la logique de données dans des hooks et services indépendants du style, permettant au même hook useCart d'alimenter deux interfaces complètement différentes sans dupliquer les règles métier.",
      },
    ],
    learnings: [
      "Comment concevoir une API pour être « réutilisable » dès le premier projet, plutôt que de la refactoriser plus tard",
      "La différence entre le couplage visuel et le couplage de données dans un système fullstack",
    ],
  },

  "gestao-financeira": {
    title: "Système de Gestion Financière Personnelle",
    tagline: "Suivi des finances personnelles avec rapports visuels",
    overview:
      "Une application de suivi des finances personnelles avec un tableau de bord résumant le solde, les revenus et les dépenses du mois, une liste de transactions catégorisées, et des graphiques qui rendent visible où va l'argent. L'objectif était d'aller au-delà d'une feuille de calcul : donner à l'utilisateur une lecture instantanée de sa santé financière, avec la même discipline de données qu'exige un vrai système comptable.",
    problem:
      "La plupart des gens ne manquent pas de données financières — ils manquent de visibilité sur celles-ci. Ce projet résout le problème « où va mon argent » en agrégeant des entrées dispersées (revenus, dépenses, catégories) dans un tableau de bord unique, avec des rapports qui répondent à des questions concrètes : combien ai-je dépensé en alimentation ce mois-ci ? mon solde augmente-t-il ou diminue-t-il ?",
    stack: [
      { label: "Frontend", items: ["React", "React Router", "Context API / Redux pour l'état global", "Chart.js / Recharts pour les graphiques"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT pour l'authentification", "Validation avec Zod/Joi"] },
      { label: "Base de données", items: ["PostgreSQL", "Sequelize / Prisma (ORM)"] },
      { label: "Infrastructure", items: ["Vercel (frontend)", "Render (API + base de données)"] },
    ],
    architecture: [
      {
        title: "Base de données relationnelle pour l'intégrité financière",
        content:
          "Contrairement à un catalogue de produits, les données financières exigent une forte cohérence : une transaction ne peut jamais « disparaître » ou rester dans un état intermédiaire. C'est pourquoi le choix s'est porté sur une base de données relationnelle (PostgreSQL) plutôt que NoSQL — le schéma comprend des tables normalisées pour Users, Categories et Transactions, avec des clés étrangères et des transactions SQL (BEGIN/COMMIT/ROLLBACK) garantissant qu'une opération composée (ex. : créer une transaction et mettre à jour le solde agrégé) n'est jamais appliquée partiellement.",
      },
      {
        title: "Séparation entre données brutes et données agrégées",
        content:
          "Le tableau de bord ne recalcule pas tout côté frontend à chaque rendu. Les agrégations mensuelles (total des revenus, total des dépenses, solde, répartition par catégorie) sont calculées côté backend via des requêtes SQL d'agrégation (GROUP BY mois/catégorie), ne renvoyant au frontend que des chiffres déjà prêts pour les graphiques — réduisant drastiquement le volume de données transférées et le traitement effectué dans le navigateur.",
      },
      {
        title: "La catégorisation comme entité de première classe",
        content:
          "Les catégories de dépense/revenu sont gérées par l'utilisateur lui-même (pas un enum fixe), avec une catégorie « Autres » par défaut. Ce fut une décision délibérée : un système de finances personnelles n'est utile que s'il s'adapte à la vie de celui qui l'utilise, pas à ce que le développeur pensait sensé.",
      },
    ],
    backend: [
      {
        title: "API Node.js + Express orientée rapports",
        content:
          "Au-delà des endpoints CRUD classiques (/api/transactions, /api/categories), l'API expose des endpoints de rapport dédiés comme /api/reports/monthly et /api/reports/by-category, qui exécutent les agrégations directement en base de données au lieu de renvoyer toutes les transactions pour que le client les additionne — un principe de performance important : les agrégations appartiennent à la base de données, pas au frontend.",
      },
      {
        title: "Authentification et isolation des données par utilisateur",
        content:
          "Chaque transaction appartient à exactement un utilisateur, et toutes les requêtes du backend filtrent obligatoirement par le userId extrait du token JWT — jamais du corps de la requête — empêchant un utilisateur d'accéder accidentellement aux transactions d'une autre personne, même par erreur côté frontend.",
      },
      {
        title: "Validation stricte des valeurs monétaires",
        content:
          "Les valeurs monétaires sont validées et stockées comme des entiers (centimes) plutôt que des nombres à virgule flottante, évitant les classiques erreurs d'arrondi de l'argent en JavaScript (0.1 + 0.2 !== 0.3), avec conversion au format décimal uniquement à la couche de présentation.",
      },
    ],
    features: [
      "Tableau de bord avec solde, revenus et dépenses du mois",
      "Enregistrement des transactions avec catégories personnalisables",
      "Graphiques d'évolution mensuelle et de répartition par catégorie",
      "Filtres par période et par catégorie",
      "Authentification et données isolées par utilisateur",
    ],
    challenges: [
      {
        title: "Éviter les erreurs d'arrondi sur les valeurs monétaires",
        content:
          "Résolu en stockant toutes les valeurs comme des centimes entiers en base de données, et en ne convertissant au format décimal (ex. : 1050 → 10,50 Kz) qu'au moment de la présentation à l'utilisateur.",
      },
      {
        title: "Tableau de bord rapide même avec beaucoup de transactions",
        content:
          "Résolu en déplaçant les agrégations (sommes, moyennes, regroupements) vers des requêtes SQL côté backend plutôt que de les calculer en JavaScript côté frontend pour chaque transaction chargée.",
      },
    ],
    learnings: [
      "Quand choisir une base de données relationnelle plutôt que NoSQL — l'intégrité et les transactions comptent plus que la flexibilité du schéma",
      "Traiter l'argent comme des entiers, jamais comme des flottants",
    ],
  },

  "gestao-stock": {
    title: "Gestion de Stock",
    tagline: "Contrôle d'inventaire avec un historique de mouvements auditable",
    overview:
      "Un système complet de gestion de stock/inventaire, pensé pour les petites et moyennes entreprises qui ont besoin de savoir, à tout moment, combien elles ont de chaque produit, qui l'a déplacé et pourquoi. Il couvre tout le cycle : entrées de marchandises, sorties par vente, ajustements d'inventaire, fournisseurs et alertes de stock minimum.",
    problem:
      "De nombreuses PME contrôlent encore leur stock dans des feuilles Excel partagées, où il est facile de perdre l'historique de « qui a changé quoi » et où les écarts entre le stock « sur le papier » et le stock réel en entrepôt sont fréquents. L'objectif était de construire un système où chaque changement de stock est enregistré comme un mouvement auditable, jamais comme une simple mise à jour silencieuse d'un nombre.",
    stack: [
      { label: "Frontend", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "TanStack Table pour les listes"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT + rôles (admin/opérateur)", "Validation avec Zod"] },
      { label: "Base de données", items: ["MySQL", "Sequelize / Prisma (ORM)", "Transactions SQL pour les mouvements"] },
      { label: "Infrastructure", items: ["Vercel (frontend)", "Railway / VPS (API + MySQL)"] },
    ],
    architecture: [
      {
        title: "Kardex : le stock comme résultat de mouvements, jamais un nombre modifiable",
        content:
          "La décision architecturale la plus importante de ce projet : le champ « stock actuel » d'un produit n'est jamais modifié directement. Il existe à la place une table stock_movements (entrée, sortie, ajustement, retour), et le stock actuel est toujours la somme de tous les mouvements de ce produit — le même principe utilisé dans les systèmes comptables (grand livre / kardex). Cela signifie qu'on peut toujours répondre à « pourquoi ce produit a-t-il 12 unités » avec une liste complète et chronologique d'événements, jamais un nombre sans explication.",
      },
      {
        title: "MySQL et transactions ACID pour la cohérence de l'inventaire",
        content:
          "MySQL a été choisi plutôt qu'une base NoSQL précisément pour le besoin de transactions ACID : enregistrer une sortie de stock implique, dans la même transaction, d'insérer le mouvement et de vérifier que le stock résultant n'est pas négatif — et si une étape échoue, toute la transaction est annulée (ROLLBACK), sans jamais laisser l'inventaire dans un état incohérent.",
      },
      {
        title: "Rôles différenciés : opérateur vs administrateur",
        content:
          "Les opérateurs d'entrepôt peuvent enregistrer des entrées/sorties mais ne peuvent ni supprimer l'historique ni modifier les prix de revient ; seuls les administrateurs ont accès aux rapports financiers et à la gestion des fournisseurs — reflétant la séparation des responsabilités qui existe dans une véritable entreprise.",
      },
    ],
    backend: [
      {
        title: "API Node.js + Express structurée par domaine",
        content:
          "Endpoints organisés par ressource métier : /api/products, /api/suppliers, /api/movements, /api/reports/low-stock. Chaque route d'écriture sur movements s'exécute dans une transaction MySQL explicite, et le seuil de stock minimum par produit déclenche une alerte consultable via /api/reports/low-stock, utilisée par le frontend pour mettre en évidence les produits à réapprovisionner.",
      },
      {
        title: "Rapports de valeur d'inventaire",
        content:
          "Le backend calcule la valeur totale de l'inventaire (quantité × coût moyen pondéré) via des requêtes SQL agrégées, pas en JavaScript — un choix de performance et de justesse, car le coût moyen pondéré doit être recalculé à chaque entrée de stock avec un prix différent du précédent.",
      },
    ],
    features: [
      "Enregistrement des entrées, sorties et ajustements de stock",
      "Historique complet et auditable par produit (kardex)",
      "Gestion des fournisseurs et des coûts",
      "Alertes de stock minimum",
      "Rapports de valeur d'inventaire",
      "Rôles d'accès : opérateur et administrateur",
    ],
    challenges: [
      {
        title: "Garantir que le stock ne devient jamais négatif sous des opérations concurrentes",
        content:
          "Résolu avec des transactions SQL explicites : la vérification du stock disponible et l'insertion du mouvement de sortie se font dans le même BEGIN/COMMIT, avec un verrouillage de ligne (SELECT ... FOR UPDATE) sur le produit pendant l'opération.",
      },
      {
        title: "Expliquer les écarts d'inventaire",
        content:
          "Résolu en faisant du stock une valeur dérivée de l'historique des mouvements plutôt qu'un champ directement modifiable — tout écart est toujours traçable jusqu'à un mouvement spécifique, avec un utilisateur et un horodatage.",
      },
    ],
    learnings: [
      "Le modèle kardex/grand livre s'applique bien au-delà de la comptabilité — tout système de « quantité qui change dans le temps » en bénéficie",
      "Quand utiliser le verrouillage de ligne pour protéger des opérations concurrentes dans une base de données relationnelle",
    ],
  },

  "landing-page": {
    title: "Landing Page",
    tagline: "Page de conversion haute performance, sans backend",
    overview:
      "Une landing page de conversion dans le style des tunnels de vente de produits numériques (ex. : Hotmart) : un titre fort au-dessus de la ligne de flottaison, des blocs de bénéfices, une preuve sociale et un appel à l'action répété stratégiquement tout au long de la page. Ce projet a été délibérément construit sans backend propre — l'objectif était 100 % axé sur la performance de chargement et le copywriting orienté conversion, pas la logique serveur.",
    problem:
      "Une landing page de vente vit ou meurt selon la vitesse de chargement et la clarté du message dans les premières secondes. L'objectif était de construire une page se chargeant presque instantanément (Core Web Vitals au vert) et guidant visuellement le visiteur, sans distractions, jusqu'au bouton d'achat — sans aucune dépendance serveur pouvant introduire de la latence.",
    stack: [
      { label: "Frontend", items: ["React", "Vite", "CSS Modules / Tailwind CSS", "Framer Motion pour les révélations au scroll"] },
      { label: "Intégrations", items: ["Formulaire relié à un webhook externe (Hotmart / plateforme de paiement)", "Google Analytics / Meta Pixel pour le suivi de conversion"] },
      { label: "Infrastructure", items: ["Vercel (hébergement statique)"] },
    ],
    architecture: [
      {
        title: "Une page entièrement statique, sans serveur propre — par choix, pas par limitation",
        content:
          "Contrairement aux autres projets de ce portfolio, cette page n'a pas (et n'a pas besoin) de backend : elle est servie en HTML/CSS/JS statique via le CDN de Vercel, ce qui signifie des temps de réponse quasi instantanés partout dans le monde. Tout le processus d'achat est délégué à une plateforme de paiement externe (le standard réel du marché des infoproduits), et la page se contente d'y conduire le visiteur.",
      },
      {
        title: "Structure de sections pensée comme un tunnel, pas comme un site",
        content:
          "Chaque section de la page a un unique objectif persuasif — capter l'attention, créer le désir, lever les objections, générer l'urgence — dans l'ordre classique d'un tunnel de vente (AIDA). Les composants React sont délibérément « bêtes » (sans logique métier), car le vrai travail d'ingénierie ici réside dans la performance et le copywriting, pas dans l'architecture des données.",
      },
    ],
    backend: [],
    features: [
      "Hero avec proposition de valeur claire au-dessus de la ligne de flottaison",
      "Sections de bénéfices et preuve sociale",
      "Appels à l'action (CTA) répétés stratégiquement",
      "Animations d'entrée au scroll",
      "Optimisée pour les Core Web Vitals (LCP, CLS, INP)",
    ],
    challenges: [
      {
        title: "Maximiser la vitesse de chargement sans sacrifier l'animation",
        content:
          "Résolu en utilisant des images optimisées et le lazy loading en dehors de la ligne de flottaison initiale, et en limitant les animations lourdes (Framer Motion) aux éléments entrant dans le viewport, évitant un coût de rendu avant qu'ils ne soient vus.",
      },
    ],
    learnings: [
      "Tous les projets n'ont pas besoin d'un backend — parfois la meilleure architecture est la plus simple qui résout le problème",
      "La performance perçue d'une landing page de vente impacte directement le taux de conversion",
    ],
  },
  argpack: {
    title: "ArgPack",
    tagline: "Marketplace reliant des producteurs argentins à des affiliés qui vendent leurs produits au Brésil",
    overview:
      "Un marketplace de micro-exportation reliant de petits producteurs argentins (vins, aliments, artisanat, cuir) à des affiliés brésiliens qui font la promotion et vendent ces produits via leur propre lien de parrainage, gagnant une commission sur chaque vente confirmée. La plateforme compte trois profils : le producteur, qui gère son catalogue et ses ventes ; l'affilié, qui génère des liens produits et suit ses gains et son palier de commission ; et l'administrateur, qui supervise toute l'opération.",
    problem:
      "Un petit producteur argentin a rarement une équipe de vente ou de marketing digital propre pour atteindre le marché brésilien, et un affilié qui veut promouvoir des produits physiques de niche n'a pas de moyen simple de générer des liens traçables et d'être payé de façon transparente. ArgPack résout les deux côtés à la fois : il donne un catalogue et une vitrine au producteur, et un système de parrainage avec commission automatique à l'affilié.",
    stack: [
      { label: "Frontend", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Context API (panier, liste de souhaits, authentification)"] },
      { label: "Backend", items: ["Node.js + Express + TypeScript", "JWT (jsonwebtoken) pour l'authentification", "Zod pour la validation des payloads", "Helmet + CORS + Morgan"] },
      { label: "Base de données", items: ["MongoDB + Mongoose", "Modèles : User, Producer, Affiliate, Product, Sale, Order"] },
      { label: "Infrastructure", items: ["Vercel (frontend)", "API REST séparée (backend Node)"] },
    ],
    architecture: [
      {
        title: "Trois rôles, un seul modèle d'utilisateur",
        content:
          "Il existe une unique collection User avec un champ userType (affiliate | producer | admin), et chaque rôle possède ensuite son propre document de profil (Producer ou Affiliate) lié par userId. Cela évite de dupliquer la logique d'authentification pour chaque type de compte et garde le JWT générique — le middleware d'autorisation décide de ce que chaque rôle peut voir à partir d'un seul champ.",
      },
      {
        title: "Commission d'affilié calculée côté serveur, jamais confiée au client",
        content:
          "Chaque affilié a un referralCode unique et un palier (Bronze 5 %, Argent 10 % avec 10+ ventes/mois, Or 15 % avec 50+ ventes/mois). Quand une vente est enregistrée avec un code de parrainage, le backend résout l'affilié propriétaire du code, calcule la commission à partir de la table des paliers (jamais à partir d'une valeur envoyée par le client) et recalcule le palier de l'affilié à chaque vente confirmée.",
      },
      {
        title: "Sale comme enregistrement par ligne de produit, Order comme commande complète",
        content:
          "Un paiement peut inclure plusieurs produits de plusieurs producteurs différents. Au lieu de tout stocker dans Order, chaque ligne de produit génère son propre document Sale (avec le producerId, l'affilié attribué et la commission déjà calculée), tandis qu'Order stocke les données de la commande elle-même — adresse de livraison, mode de paiement, coupon appliqué. Cela permet à chaque producteur de ne voir que ses propres ventes sans exposer la commande complète d'un autre producteur.",
      },
    ],
    backend: [
      {
        title: "Modèle de données : producteurs, produits, affiliés et ventes",
        content:
          "Producer stocke les données de l'entreprise (nom, type de produit, localisation, plan). Product appartient à un Producer et a une catégorie (vin, aliments, artisanat, cuir), un prix et un stock. Affiliate stocke le code de parrainage, le palier actuel et les totaux de ventes et de gains. Sale relie un Product à un Producer et, éventuellement, à un Affiliate, en stockant la valeur totale, le taux de commission appliqué et le statut (pending → confirmed → paid, ou cancelled).",
      },
      {
        title: "Flux de paiement avec attribution d'affilié",
        content:
          "Le frontend stocke le code de parrainage capturé depuis l'URL (?ref=CODE) dans le localStorage avec une validité de 30 jours, à la manière d'un cookie d'attribution. Au paiement, ce code voyage avec la commande ; le backend résout l'affilié, génère une Sale pour chaque article du panier avec la commission déjà calculée, décompte le stock du produit et renvoie un numéro de commande (ex. : ARG-8F42A1). Livraison gratuite au-delà de 300 R$, coupon de réduction optionnel, et trois modes de paiement simulés (carte, Pix, boleto).",
      },
    ],
    features: [
      "Catalogue de produits filtrable par catégorie (vins, aliments, artisanat, cuir)",
      "Système d'affiliation avec lien de parrainage unique et 3 paliers de commission automatiques",
      "Panier et paiement avec coupon de réduction et livraison gratuite à partir d'un montant minimum",
      "Tableau de bord producteur avec ventes, produits et revenus confirmés",
      "Tableau de bord affilié avec progression vers le prochain palier et historique des commissions",
      "Tableau de bord d'administration avec vue d'ensemble de la plateforme et gestion des utilisateurs",
    ],
    challenges: [
      {
        title: "Attribuer correctement une vente au bon affilié, même dans des paniers avec plusieurs produits",
        content:
          "Résolu en traitant chaque ligne du panier comme une Sale indépendante plutôt qu'en divisant la commission d'un seul enregistrement de commande — chaque ligne hérite du même referralCode au moment du paiement, ce qui rend trivial pour un producteur de ne voir que ses ventes et pour un affilié de ne voir que les ventes qu'il a générées, sans calculs croisés.",
      },
      {
        title: "Empêcher le client de manipuler le taux de commission",
        content:
          "Le taux de commission ne vient jamais du frontend — il est toujours lu depuis la table TIER_RULES du backend en fonction du palier actuel de l'affilié stocké en base de données, ce qui ferme la porte à un acheteur (ou affilié) essayant d'envoyer manuellement un taux plus élevé.",
      },
    ],
    learnings: [
      "Modéliser les ventes par ligne de produit (pas par commande complète) simplifie beaucoup les requêtes « mes ventes » quand plusieurs producteurs et affiliés sont dans le même paiement",
      "Stocker les règles métier (comme les paliers de commission) dans une seule source de vérité côté backend évite de dupliquer la même logique dans plusieurs contrôleurs",
    ],
  },

  "games-hub": {
    title: "Games Hub",
    tagline: "Hub de mini-jeux occasionnels, 100 % dans le navigateur",
    overview:
      "Un hub avec plusieurs mini-jeux occasionnels (jeu de mémoire et autres), fonctionnant entièrement dans le navigateur, sans aucune dépendance serveur. L'objectif de ce projet était l'architecture frontend : comment structurer plusieurs jeux indépendants partageant des composants communs (minuteur, tableau des scores, système de points) sans que la logique d'un jeu ne « fuite » vers un autre.",
    problem:
      "Construire plusieurs jeux dans une seule application aboutit facilement à un code couplé, où modifier les règles d'un jeu risque d'en casser un autre. Le défi était de concevoir une architecture où chaque jeu est une unité isolée et remplaçable, avec un « moteur » commun (état du jeu, minuteur, record) réutilisé par tous.",
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Context API + useReducer par jeu", "CSS Modules"] },
      { label: "Persistance locale", items: ["localStorage pour les records et la progression (sans backend)"] },
      { label: "Infrastructure", items: ["Vercel (hébergement statique)"] },
    ],
    architecture: [
      {
        title: "Chaque jeu comme un module isolé avec une interface commune",
        content:
          "Tous les jeux implémentent la même « interface » conceptuelle : un état initial, une fonction reducer (useReducer) qui traite les coups, et un composant tableau des scores. Cela signifie que le composant Scoreboard, le Timer et le système de « meilleur score » sont génériques et réutilisés par tout nouveau jeu — ajouter un jeu au hub n'implique de toucher aucun code des jeux existants.",
      },
      {
        title: "TypeScript comme filet de sécurité entre les jeux",
        content:
          "Des types génériques (Game<State, Action>) garantissent, à la compilation, que chaque jeu implémente correctement le contrat attendu par le hub — évitant l'erreur courante dans les hubs de jeux JavaScript où un jeu mal implémenté casse silencieusement le tableau des scores général.",
      },
    ],
    backend: [],
    features: [
      "Jeu de mémoire avec niveaux de difficulté",
      "Système de points et records personnels (localStorage)",
      "Minuteur réutilisable entre les jeux",
      "Architecture modulaire prête pour de nouveaux jeux",
    ],
    challenges: [
      {
        title: "Ajouter de nouveaux jeux sans dupliquer la logique de tableau des scores/minuteur",
        content:
          "Résolu en extrayant un « moteur » de jeu générique (hooks useGameTimer, useScoreboard) indépendant de tout jeu spécifique, utilisé par composition dans chaque nouveau jeu ajouté au hub.",
      },
    ],
    learnings: [
      "Comment concevoir des interfaces génériques en TypeScript (Game<State, Action>) pour forcer la cohérence entre modules indépendants",
      "La persistance locale (localStorage) est suffisante et appropriée quand il n'y a pas de besoin réel de partager des données entre appareils",
    ],
  },

  primeflix: {
    title: "PrimeFlix",
    tagline: "Découverte de films tendance, en consommant une API publique",
    overview:
      "Une application pour découvrir les films tendance et consulter leurs détails (synopsis, note, casting, date de sortie), en consommant une API publique de films (TMDB). L'objectif du projet était la couche d'intégration avec une API externe : comment structurer les appels HTTP, gérer les erreurs et les limites de taux, et garder l'interface réactive même avec des données arrivant de façon asynchrone.",
    problem:
      "Consommer de façon robuste une API publique tierce est plus difficile qu'il n'y paraît : les clés d'API ne peuvent pas être exposées négligemment, les requêtes peuvent échouer ou être limitées (rate limiting), et l'expérience utilisateur ne peut pas « geler » en attendant la réponse. L'objectif était de construire cette couche d'intégration de façon propre et réutilisable.",
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Axios (instance configurée + intercepteurs)", "React Query pour le cache des requêtes"] },
      { label: "Intégration externe", items: ["API publique The Movie Database (TMDB)", "Variables d'environnement pour la clé d'API"] },
      { label: "Infrastructure", items: ["Vercel (hébergement statique)"] },
    ],
    architecture: [
      {
        title: "Instance Axios dédiée avec intercepteurs",
        content:
          "Au lieu d'appeler axios.get directement dans chaque composant, il existe une instance Axios unique (api.ts) avec une baseURL et une clé d'API préconfigurées, et des intercepteurs de réponse qui traitent de façon centralisée les erreurs 401/429 (limite de requêtes dépassée) et formatent des messages d'erreur conviviaux — évitant de dupliquer la gestion des erreurs dans chaque appel.",
      },
      {
        title: "Hooks dédiés par type de donnée (useTrendingMovies, useMovieDetails)",
        content:
          "Chaque besoin de données a son propre hook, responsable d'appeler l'API, de gérer les états de chargement/erreur et (avec React Query) de mettre en cache les résultats — évitant des requêtes répétées à l'API publique pour les mêmes filtres de recherche, ce qui aide aussi à ne pas épuiser la limite de requêtes gratuite de TMDB.",
      },
      {
        title: "Debounce sur la recherche pour réduire les appels inutiles",
        content:
          "La recherche de films ne déclenche une requête à l'API que 400 ms après que l'utilisateur arrête d'écrire, plutôt qu'à chaque touche pressée — une optimisation simple mais essentielle lors de la consommation d'une API externe avec des limites d'utilisation.",
      },
    ],
    backend: [],
    features: [
      "Listes de films tendance et par catégorie",
      "Recherche de films avec debounce",
      "Page de détail avec synopsis, note et casting",
      "États de chargement et d'erreur gérés de façon cohérente",
    ],
    challenges: [
      {
        title: "Éviter d'épuiser la limite de requêtes de l'API publique",
        content:
          "Résolu en combinant le debounce de recherche avec la mise en cache des résultats via React Query, réduisant drastiquement le nombre d'appels répétés à TMDB pour les mêmes recherches.",
      },
      {
        title: "Garder l'interface réactive pendant les requêtes asynchrones",
        content:
          "Résolu avec des états de chargement dédiés par section de la page (skeleton loaders), plutôt que de bloquer toute la page en attendant une seule réponse.",
      },
    ],
    learnings: [
      "Centraliser la configuration d'un client HTTP (Axios) dans une seule instance évite la duplication et l'incohérence dans la gestion des erreurs",
      "Le cache côté client (React Query) est aussi important que le cache côté serveur quand on dépend d'API tierces avec des limites d'usage",
    ],
  },
  barbearia: {
    title: "Salon de coiffure",
    tagline: "Prise de rendez-vous en ligne avec tableau de bord administrateur et paiements",
    overview:
      "Une plateforme de prise de rendez-vous pour un salon de coiffure, avec choix du service, du coiffeur et du créneau disponible, un tableau de bord administrateur pour que le coiffeur gère son agenda, et une intégration de paiement pour confirmer le rendez-vous avec un acompte anticipé. Construite comme une application Next.js fullstack, utilisant Next.js lui-même (App Router + Route Handlers) comme couche backend plutôt qu'un serveur Express séparé.",
    problem:
      "Les rendez-vous pris par WhatsApp ou téléphone sont faciles à perdre et n'empêchent pas les « no-shows » (clients qui prennent rendez-vous et ne se présentent pas). L'objectif était de numériser le processus de prise de rendez-vous de bout en bout : n'afficher que les créneaux réellement disponibles, éviter les doubles réservations pour le même coiffeur/créneau, et réduire les absences en exigeant un petit acompte au moment de la réservation.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "React Hook Form + Zod pour la validation"] },
      { label: "Backend", items: ["Next.js Route Handlers (API intégrée, sans serveur Express séparé)", "NextAuth pour l'authentification du tableau de bord administrateur"] },
      { label: "Base de données", items: ["PostgreSQL", "Prisma ORM"] },
      { label: "Paiements", items: ["Intégration avec une passerelle de paiement (Multicaixa Express / Stripe) pour l'acompte de la réservation"] },
      { label: "Infrastructure", items: ["Vercel (frontend + Route Handlers)", "Supabase / Railway (PostgreSQL)"] },
    ],
    architecture: [
      {
        title: "Next.js fullstack : Route Handlers comme backend, sans serveur séparé",
        content:
          "Contrairement aux projets e-commerce (où le backend est un service Node/Express indépendant), ici le choix a été de tout garder dans Next.js lui-même via les Route Handlers (app/api/.../route.ts). Pour un domaine de cette taille — rendez-vous, services, coiffeurs — la complexité opérationnelle de maintenir deux déploiements séparés (frontend et backend) n'était pas justifiée ; le Next.js fullstack permet de livrer le même produit avec deux fois moins d'infrastructure à gérer.",
      },
      {
        title: "Modélisation de la disponibilité : créneaux dérivés, pas une table géante d'horaires",
        content:
          "Au lieu de pré-générer une ligne en base de données pour chaque créneau possible de chaque jour (ce qui croît indéfiniment), les créneaux disponibles sont calculés dynamiquement : le backend croise les horaires de travail du coiffeur avec les réservations existantes ce jour-là, ne renvoyant que les intervalles encore libres. Cela garde la base de données petite et toujours correcte, sans nécessiter de tâches périodiques de nettoyage.",
      },
      {
        title: "Réservation de créneau avec transaction pour éviter les doubles réservations",
        content:
          "Quand un client confirme un créneau, la création de la réservation s'exécute dans une transaction Prisma qui vérifie d'abord, avec un verrou, que ce coiffeur est toujours libre à cet intervalle — si deux clients essaient de réserver le même créneau simultanément, seul le premier à terminer la transaction obtient la réservation ; le second reçoit immédiatement une erreur « créneau déjà occupé ».",
      },
    ],
    backend: [
      {
        title: "Route Handlers organisés par domaine métier",
        content:
          "/api/services (services et prix), /api/professionals (coiffeurs et horaires de travail), /api/availability (calcul des créneaux libres), /api/bookings (création et gestion des réservations) et /api/payments/webhook (confirmation asynchrone de l'acompte payé). Les Route Handlers administratifs exigent une session valide via NextAuth avec un rôle « admin », tandis que ceux de réservation publique sont accessibles à tout visiteur, mais avec une validation stricte des entrées via Zod.",
      },
      {
        title: "Acompte de paiement comme confirmation d'engagement",
        content:
          "Une réservation ne passe de pending_payment à confirmed que lorsque la passerelle de paiement notifie le webhook avec succès — jamais simplement parce que le client a été redirigé vers le site. Les réservations restant plus de X minutes en pending_payment sans confirmation sont automatiquement libérées, rendant le créneau à la disponibilité générale.",
      },
      {
        title: "Tableau de bord administrateur avec l'agenda du jour",
        content:
          "Le coiffeur authentifié voit l'agenda du jour groupé par professionnel, peut réserver manuellement des clients qui appellent par téléphone, et annuler/reprogrammer des créneaux — toutes les opérations passent par la même couche de validation de disponibilité utilisée par le client final, garantissant qu'il n'y a jamais deux chemins différents (et potentiellement incohérents) pour créer une réservation.",
      },
    ],
    features: [
      "Choix du service, du professionnel et du créneau disponible",
      "Calcul dynamique de la disponibilité (pas de créneaux fantômes)",
      "Acompte de paiement pour confirmer la réservation",
      "Tableau de bord administrateur avec l'agenda du jour par professionnel",
      "Prévention des doubles réservations pour le même créneau",
    ],
    challenges: [
      {
        title: "Empêcher deux clients de réserver le même créneau",
        content:
          "Résolu avec une transaction de base de données qui vérifie et réserve le créneau de façon atomique, plutôt que deux opérations séparées (vérifier la disponibilité, puis créer la réservation) qui laisseraient une fenêtre de temps vulnérable.",
      },
      {
        title: "Réduire les absences sans repousser les clients avec un processus de paiement lourd",
        content:
          "Résolu en n'exigeant qu'un acompte partiel (pas la valeur totale du service) au moment de la réservation, équilibrant l'engagement du client avec la friction du processus de réservation.",
      },
    ],
    learnings: [
      "Quand opter pour un backend intégré à Next.js (Route Handlers) plutôt qu'un service Express séparé — cela dépend de la taille réelle du domaine, pas d'une préférence personnelle",
      "La disponibilité de l'agenda doit toujours être calculée, jamais stockée comme une liste fixe de créneaux",
    ],
  },

  neoxia: {
    title: "Neoxia",
    tagline: "Site institutionnel pour une agence de marketing digital",
    overview:
      "Un site institutionnel pour Neoxia, une agence de marketing digital, présentant ses services, ses cas clients et un moyen direct de contact pour les clients potentiels. Contrairement aux projets e-commerce ou SaaS de ce portfolio, l'objectif ici n'était pas un système avec beaucoup de données dynamiques, mais une présence numérique rapide, crédible et orientée vers la génération de contacts commerciaux (leads).",
    problem:
      "Une agence de marketing digital est, elle-même, le premier test de sa propre crédibilité : si le site institutionnel est lent, générique ou ne génère pas de contacts qualifiés, cela mine l'argument de vente de l'agence elle-même. Le défi était de construire un site reflétant le professionnalisme technique et convertissant les visiteurs en véritables demandes de contact.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion pour les transitions de section"] },
      { label: "Backend", items: ["Route Handler Next.js dédié pour le formulaire de contact", "Resend (envoi d'email transactionnel)"] },
      { label: "Infrastructure", items: ["Vercel (frontend + Route Handler)", "Rendu statique (SSG) pour toutes les pages de contenu"] },
    ],
    architecture: [
      {
        title: "Site presque entièrement statique, avec une seule île dynamique",
        content:
          "La grande majorité des pages (services, à propos, cas clients) sont générées statiquement (SSG) au moment du build, garantissant des temps de chargement minimaux et un excellent SEO — essentiel pour une agence qui dépend du trafic de recherche organique. La seule partie vraiment « dynamique » du site est le formulaire de contact, isolé comme la seule fonctionnalité qui doit réellement s'exécuter côté serveur.",
      },
      {
        title: "Formulaire de contact comme Route Handler + service d'email transactionnel",
        content:
          "Le formulaire soumet vers un Route Handler (app/api/contact/route.ts) qui valide les données côté serveur (sans jamais faire confiance uniquement à la validation côté client), applique une limite simple de requêtes par IP pour atténuer le spam, et utilise Resend pour envoyer l'email de la demande de contact directement dans la boîte de réception de l'agence — sans besoin de maintenir une base de données juste pour stocker les messages de contact.",
      },
      {
        title: "Le contenu comme véritable produit du projet",
        content:
          "Pour un site institutionnel, l'architecture du code est délibérément simple ; l'effort d'ingénierie a été investi dans la performance (Core Web Vitals), l'accessibilité et la clarté du copy — car c'est ce qui détermine si une agence de marketing paraît elle-même bien positionnée en marketing.",
      },
    ],
    backend: [
      {
        title: "Pas de base de données — envoi direct par email transactionnel",
        content:
          "Au lieu de stocker les soumissions de contact dans une base de données pour être consultées manuellement plus tard, le Route Handler envoie la demande directement par email via Resend dès qu'elle est soumise — réduisant la complexité opérationnelle à zéro (aucune base de données à maintenir) au prix de ne pas avoir d'historique consultable, un compromis acceptable pour le volume attendu d'un site institutionnel.",
      },
      {
        title: "Protection basique contre le spam et les soumissions abusives",
        content:
          "Le Route Handler applique une validation stricte du schéma (Zod) et une limite de soumissions par IP dans un court intervalle de temps, évitant que le formulaire ne soit utilisé pour envoyer du spam en masse via l'infrastructure email de l'agence.",
      },
    ],
    features: [
      "Présentation des services de marketing digital",
      "Section cas clients/portfolio de l'agence",
      "Formulaire de contact avec envoi direct par email",
      "Site entièrement statique et optimisé pour le SEO",
    ],
    challenges: [
      {
        title: "Générer des contacts commerciaux sans la complexité d'une base de données",
        content:
          "Résolu en optant pour l'envoi direct d'email transactionnel (Resend) depuis un unique Route Handler, plutôt que de construire un système de stockage et de gestion de leads disproportionné par rapport à l'échelle du projet.",
      },
    ],
    learnings: [
      "Tous les formulaires de contact n'ont pas besoin d'une base de données — parfois l'email transactionnel est la solution la plus simple et la plus correcte",
      "Pour les sites institutionnels, le SEO et la performance de chargement sont, en pratique, des fonctionnalités métier",
    ],
  },
  qrcodepay: {
    title: "QrCodePay",
    tagline: "Plateforme de paiement par QR Code pour commerçants, avec onboarding sur invitation et tableau de bord administrateur complet",
    overview:
      "QrCodePay est une plateforme de paiement par QR Code conçue pour les commerçants qui veulent recevoir des paiements numériques sans dépendre d'une seule banque ou d'un seul portefeuille mobile. Chaque commerçant a un QR Code fixe pour sa boutique (pour les paiements génériques) et peut générer des QR Codes dynamiques par transaction, avec un montant, une référence unique et un délai d'expiration — le même modèle utilisé par les systèmes de paiement instantané par QR sur plusieurs marchés émergents. Au-delà de l'expérience commerçant, le projet inclut un tableau de bord administrateur complet, avec gestion des commerçants, des utilisateurs, des invitations d'accès, des transactions et un journal d'audit du système.",
    problem:
      "Les petits et moyens commerçants qui veulent accepter des paiements numériques rapides font face à une expérience fragmentée : chaque banque ou portefeuille mobile a sa propre application, son propre QR et son propre flux de confirmation. L'objectif du projet était de construire une couche de paiement par QR Code propre — avec la même rigueur qu'un véritable produit financier : des états de transaction bien définis, une confirmation asynchrone jamais confiée au navigateur du client, une expiration automatique des paiements en attente et un journal d'audit complet de tout ce qui se passe dans le système.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "TanStack Query pour le cache et la synchronisation des données serveur"] },
      { label: "Backend", items: ["Node.js", "Express", "TypeScript", "JWT pour l'authentification", "Job en arrière-plan pour l'expiration des paiements"] },
      { label: "Base de données", items: ["MongoDB", "Mongoose (ODM)"] },
      { label: "Infrastructure", items: ["Docker + Docker Compose (frontend, backend, base de données et proxy)", "Nginx comme reverse proxy", "Configuration séparée pour les environnements de développement et de production"] },
    ],
    architecture: [
      {
        title: "Onboarding fermé sur invitation, pas par inscription publique",
        content:
          "Il n'existe pas de page publique « créer un compte » : un administrateur génère une invitation associée à un email, le système envoie un lien d'inscription unique avec une durée de validité, et seul celui qui a ce lien peut créer le compte commerçant. Sur une plateforme qui déplace de l'argent, c'est une décision de sécurité délibérée — elle élimine complètement la surface d'attaque des inscriptions automatiques ou des comptes frauduleux, au prix d'une friction d'onboarding supplémentaire, un compromis acceptable pour ce type de produit.",
      },
      {
        title: "Deux types de QR Code pour deux cas d'usage différents",
        content:
          "Le QR Code statique du commerçant existe une seule fois, n'expire jamais et sert aux paiements génériques dans une boutique physique (le client scanne et saisit le montant). Le QR Code dynamique, lui, est généré par transaction, arrive déjà avec le montant défini, a une référence unique et une courte validité — pensé pour les situations où le montant est connu à l'avance (ex. checkout, facture). Cette distinction se reflète dans le reste de l'architecture, y compris dans la façon dont chaque type de QR est validé côté backend.",
      },
      {
        title: "Trois profils d'utilisation sur la même API",
        content:
          "L'application frontend est divisée en trois zones avec leurs propres layouts et permissions : la page publique de paiement (pour le client final qui scanne le QR), le tableau de bord commerçant (tableau de bord, création de paiements, transactions, profil) et le tableau de bord d'administration (commerçants, invitations, utilisateurs, transactions globales, journaux du système). Les trois zones consomment la même API REST, mais chaque route du backend valide le rôle de l'utilisateur authentifié avant d'exposer la moindre donnée.",
      },
      {
        title: "Infrastructure conteneurisée dès le premier jour",
        content:
          "Le projet n'a jamais fonctionné « juste sur la machine locale » : frontend, backend et base de données sont définis dans Docker Compose dès le début, avec Nginx devant en reverse proxy. Cela a obligé à penser aux variables d'environnement, aux réseaux internes entre conteneurs et aux scripts de démarrage pour le développement et la production dès la première version, plutôt que de laisser cette complexité pour la fin.",
      },
    ],
    backend: [
      {
        title: "Machine à états de la demande de paiement",
        content:
          "Un paiement traverse des états bien définis — created → pending → confirmed / failed — et chaque transition est explicitement validée côté serveur avant d'être appliquée ; une transition qui n'a pas de sens (par exemple, essayer de confirmer un paiement déjà échoué) est rejetée. Cela évite qu'une requête malformée ou une course entre requêtes ne laisse une transaction dans un état incohérent.",
      },
      {
        title: "Expiration automatique des paiements non réglés",
        content:
          "Un processus en arrière-plan s'exécute périodiquement et recherche les demandes de paiement ayant dépassé leur délai de validité sans confirmation, les marquant comme expirées et enregistrant la raison dans l'historique de la transaction. Cela signifie qu'un QR Code dynamique oublié ne reste pas « en attente » indéfiniment sur le tableau de bord du commerçant — le système s'autonettoie sans intervention manuelle.",
      },
      {
        title: "Confirmation de paiement jamais confiée au client",
        content:
          "Comme dans le projet e-commerce de ce portfolio, un paiement n'est marqué comme confirmé que via une notification asynchrone validée côté serveur — jamais simplement parce que le navigateur du client a été redirigé vers une page de « succès ». C'est une règle qui se répète dans tout système de paiement bien construit, et elle a été reproduite ici délibérément.",
      },
      {
        title: "Journal d'audit pour l'ensemble du système",
        content:
          "Chaque événement pertinent — création d'invitation, changement d'état d'un paiement, action d'un administrateur — génère un enregistrement de journal avec l'acteur, le type d'événement et les métadonnées pertinentes, consultable dans le panneau « Journaux système » de l'administration. Sur une plateforme financière, savoir exactement ce qui s'est passé et quand n'est pas optionnel.",
      },
      {
        title: "Limitation des requêtes sur les routes sensibles",
        content:
          "Les endpoints critiques comme la connexion et la création d'invitations ont une limitation du taux de requêtes, réduisant la surface d'attaque par force brute ou abus automatisé sans affecter l'usage normal.",
      },
    ],
    features: [
      "Onboarding commerçant fermé, uniquement sur invitation avec une durée de validité",
      "QR Code statique permanent par commerçant",
      "QR Code dynamique par transaction, avec montant, référence et expiration automatique",
      "Tableau de bord commerçant avec revenus, transactions récentes et actions rapides",
      "Tableau de bord d'administration avec vue globale des commerçants, utilisateurs et transactions",
      "État de santé du système visible sur le tableau de bord d'administration",
      "Historique des transactions avec filtres et recherche",
      "Journal d'audit des événements du système",
      "Récupération de mot de passe et flux d'authentification avec JWT",
      "Infrastructure entièrement conteneurisée avec Docker Compose",
    ],
    challenges: [
      {
        title: "Éviter qu'un paiement soit confirmé par erreur",
        content:
          "Résolu avec une validation explicite des transitions d'état côté serveur — chaque changement d'état est vérifié par rapport à une liste de transitions autorisées avant d'être enregistré, plutôt que d'accepter aveuglément n'importe quelle mise à jour.",
      },
      {
        title: "Empêcher les paiements oubliés d'encombrer le tableau de bord du commerçant",
        content:
          "Résolu avec un processus en arrière-plan qui expire automatiquement les demandes de paiement non réglées ayant dépassé leur délai, sans dépendre d'une action du commerçant ou du client.",
      },
      {
        title: "Équilibrer sécurité et rapidité dans l'onboarding de nouveaux commerçants",
        content:
          "Résolu avec un flux d'invitation : plus lent qu'une inscription publique instantanée, mais élimine complètement les comptes frauduleux ou de test sur une plateforme qui gère de l'argent — un compromis délibéré en faveur de la sécurité.",
      },
    ],
    learnings: [
      "Concevoir une machine à états explicite, même dans un projet personnel, oblige à penser à tous les chemins possibles d'une transaction — pas seulement au chemin nominal",
      "Un processus en arrière-plan simple (vérifier et expirer) résout un problème d'intégrité des données qui exigerait autrement une logique complexe éparpillée dans plusieurs points de l'application",
      "Avoir Docker Compose dès le début, pas seulement à la fin, oblige à résoudre tôt des problèmes de configuration entre services qui n'apparaîtraient autrement qu'en production",
      "L'onboarding fermé sur invitation est, dans de nombreux produits financiers, une fonctionnalité de sécurité aussi importante que l'authentification elle-même",
    ],
  },
  crfdesk: {
    title: "CRFDesk",
    tagline: "Plateforme de screening et de conformité pour actifs crypto, avec scoring de risque explicable et rapports prêts pour les régulateurs",
    overview:
      "CRFDesk est une plateforme de screening et de conformité pour actifs crypto, construite pour les équipes qui ont besoin d'évaluer le risque d'un portefeuille, d'une transaction ou d'un contrat avant d'accepter ou de traiter une opération. Plutôt que de renvoyer seulement « risque élevé » ou « risque faible », le système produit un score quantifié, expliqué facteur par facteur, avec historique et versionnement par entité, et permet de générer aussi bien des rapports d'analyse que des Rapports d'Activité Suspecte (SAR) formels, avec un flux d'approbation par un responsable avant toute soumission. Il inclut aussi un tableau de bord d'administration multi-utilisateur, une gestion des clés d'API pour les intégrations externes et un tableau de bord de consommation par plan.",
    problem:
      "Les équipes de conformité des exchanges et fintechs crypto ne peuvent pas justifier une décision de « risque élevé » à un régulateur ou un auditeur avec une boîte noire — elles doivent savoir exactement quels facteurs ont contribué au score, avec quel poids, et avec quel niveau de confiance. Le défi de ce projet était de construire un moteur de risque conçu pour être explicable dès sa racine, pas un simple nombre isolé : chaque résultat de screening doit pouvoir se suffire à lui-même comme preuve documentaire, avec un historique de versions et un chemin d'audit complet.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion", "TanStack Query"] },
      { label: "Backend", items: ["Node.js", "Express", "TypeScript", "File de jobs en arrière-plan", "Génération de rapports PDF"] },
      { label: "Base de données", items: ["MongoDB", "Mongoose (ODM)", "Modèles dédiés pour les screenings, rapports, SAR et journaux d'audit"] },
      { label: "Infrastructure", items: ["Docker + Docker Compose", "Nginx comme reverse proxy", "Authentification par clé d'API pour les intégrations externes", "Webhooks configurables"] },
    ],
    architecture: [
      {
        title: "Un unique orchestrateur pour tout le flux de screening",
        content:
          "Toutes les demandes de screening passent obligatoirement par un unique service orchestrateur, qui enchaîne validation de la demande, calcul du risque, génération du détail du score, versionnement, mise à jour de la chronologie de l'entité, génération du rapport, journalisation d'audit, notifications et comptabilisation de la consommation du plan. Les contrôleurs de l'API n'appellent jamais les services internes isolément — cela garantit qu'aucun screening ne peut « sauter » une étape obligatoire du flux, ce qui est essentiel pour un produit dont la sortie peut finir comme preuve pour un régulateur.",
      },
      {
        title: "Score composé de facteurs de risque explicables, pas un nombre magique",
        content:
          "Plutôt qu'une seule valeur sans explication, chaque screening produit une liste de facteurs de risque (« reason codes »), chacun avec une catégorie, une description, des points attribués, un poids en pourcentage, une source de preuve et un niveau de confiance (élevé/moyen/faible). Le score final est la somme explicable de ces facteurs, regroupés par catégorie avec leur sévérité respective — conçu pour qu'une équipe de conformité puisse justifier chaque point du résultat devant un auditeur.",
      },
      {
        title: "Versionnement et chronologie de risque par entité",
        content:
          "Chaque nouveau screening sur la même adresse ou le même portefeuille génère une nouvelle version du score, plutôt que de remplacer la précédente. Cela permet de reconstituer comment le risque d'une entité a évolué dans le temps — important car une évaluation faite aujourd'hui peut dépendre d'informations qui n'existaient que dans une version plus récente, et la plateforme doit pouvoir montrer cette différence de façon auditable.",
      },
      {
        title: "Traitement lourd isolé dans une file de jobs, hors de la requête HTTP",
        content:
          "Les analyses multi-chaînes et la génération de rapports PDF volumineux ne bloquent pas la réponse à l'utilisateur : elles sont placées dans une file et traitées en arrière-plan par un ensemble dédié de workers, l'utilisateur étant notifié quand le résultat devient disponible. Cela garde l'interface réactive même quand une analyse prend plusieurs secondes.",
      },
      {
        title: "Sceau d'intégrité sur les rapports déjà émis",
        content:
          "Une fois généré, un rapport passe par un service d'intégrité qui empêche des modifications silencieuses de son contenu — une garantie nécessaire quand le document peut finir par être utilisé comme preuve formelle devant une autorité.",
      },
    ],
    backend: [
      {
        title: "Flux de Rapport d'Activité Suspecte (SAR) avec approbation hiérarchique",
        content:
          "Un analyste peut générer un brouillon de SAR à partir d'un screening à risque élevé ou critique, en remplissant une justification ; le rapport ne passe de brouillon à approuvé (puis soumis) qu'avec l'approbation explicite et enregistrée d'un superviseur. Il n'existe aucun chemin automatique de soumission — la décision humaine est toujours une étape obligatoire et auditable du flux.",
      },
      {
        title: "Application du quota de plan avant toute opération coûteuse",
        content:
          "Chaque organisation a une limite de screenings et de rapports définie par son plan, vérifiée avant de lancer toute opération avec un coût computationnel significatif — évitant de traiter une requête lourde qui serait de toute façon rejetée ensuite pour dépassement de limite.",
      },
      {
        title: "Clés d'API avec leur propre portée, indépendantes de la connexion utilisateur",
        content:
          "Les intégrations externes (par exemple, un système qui doit screener automatiquement chaque retrait de fonds) s'authentifient avec des clés d'API dédiées, générées et révocables à tout moment depuis le tableau de bord — sans partager les identifiants utilisateur ni exiger de session interactive.",
      },
      {
        title: "Facteur de risque pays comme composant isolé et remplaçable",
        content:
          "La juridiction associée à une opération entre dans le moteur de risque via un adaptateur dédié, séparé de la logique principale de scoring — permettant de mettre à jour la liste des pays ou régions à risque élevé sans modifier le reste du moteur.",
      },
      {
        title: "Notifications asynchrones par webhook",
        content:
          "Les systèmes externes peuvent s'abonner à des événements (par exemple, « rapport terminé » ou « SAR approuvé ») via des webhooks configurables, plutôt que de devoir interroger l'API de façon répétée en attendant un changement d'état.",
      },
    ],
    features: [
      "Screening d'adresses, transactions et contrats sur plusieurs blockchains",
      "Score de risque quantifié avec détail facteur par facteur",
      "Historique et chronologie de risque par entité",
      "Génération de rapports d'analyse en PDF avec sceau d'intégrité",
      "Flux de Rapport d'Activité Suspecte (SAR) avec approbation par superviseur",
      "Tableau de bord d'administration multi-utilisateur",
      "Gestion des clés d'API pour les intégrations externes",
      "Webhooks configurables pour la notification d'événements",
      "Tableau de bord de consommation et limites du plan contracté",
      "Journal d'audit complet de toutes les actions",
    ],
    challenges: [
      {
        title: "Rendre le score entièrement explicable, sans être une boîte noire",
        content:
          "Résolu avec un moteur de facteurs de risque (« reason codes ») catégorisés, avec leur propre poids et niveau de confiance, plutôt qu'un unique nombre sans justification — chaque résultat peut être décomposé et présenté à un auditeur.",
      },
      {
        title: "Garantir qu'un rapport déjà émis ne peut plus être modifié",
        content:
          "Résolu avec un service d'intégrité dédié qui valide le contenu du rapport après son émission, protégeant les documents pouvant être utilisés comme preuve formelle.",
      },
      {
        title: "Traiter des analyses lourdes sans bloquer l'expérience utilisateur",
        content:
          "Résolu en isolant le travail lourd (analyse multi-chaîne, génération de PDF) dans une file de jobs en arrière-plan, gardant la requête HTTP originale rapide et l'interface réactive.",
      },
    ],
    learnings: [
      "Un moteur de risque pensé pour être explicable dès le début change complètement la conception des données — il ne s'agit plus de « calculer un nombre » mais de « construire un dossier justifiable »",
      "Séparer l'authentification utilisateur de l'authentification par clé d'API est essentiel dès qu'un produit doit supporter des intégrations externes automatisées",
      "Un pattern d'orchestrateur unique, par lequel tout doit passer, est un moyen efficace de garantir que les flux réglementaires ne restent jamais incomplets par erreur",
      "Appliquer les limites de plan avant les opérations coûteuses, et non après, économise des ressources et évite la frustration de l'utilisateur",
    ],
  },
  "boardgov-ao": {
    title: "BoardGov AO",
    tagline: "Plateforme multi-tenant de gouvernance d'entreprise pour les conseils d'administration angolais, avec réunions, votes et procès-verbaux juridiquement défendables",
    overview:
      "BoardGov AO est une plateforme de gouvernance d'entreprise multi-tenant construite pour les conseils d'administration d'organisations angolaises — banques, assureurs, courtiers et entreprises publiques soumises à la supervision de la BNA, de la CMC ou d'autres tutelles. Elle numérise tout le cycle de vie d'un conseil : convocation de réunions avec calcul automatique du quorum, vote en temps réel et résolutions circulaires asynchrones, rédaction et approbation des procès-verbaux selon la structure légale de la Loi 1/04, une salle de données confidentielle avec filigrane dynamique, des déclarations annuelles d'intérêts, un registre des conflits, des comités spécialisés, une bibliothèque de précédents consultable, un accès d'urgence audité, un portail temporaire pour les auditeurs externes et un assistant IA qui génère des brouillons de procès-verbaux et résume des documents. Il existe aussi un tableau de bord de super-administration séparé, pour gérer toutes les organisations clientes de la plateforme, les utilisateurs, les feature flags par module et la santé du système.",
    problem:
      "En Angola, la gouvernance d'un conseil d'administration se déroule encore majoritairement sur papier et dans des fichiers épars : convocations par email sans enregistrement formel, procès-verbaux rédigés après la réunion dans Word, votes que personne ne peut prouver s'être déroulés exactement comme décrit, et déclarations de conflit d'intérêts archivées dans un dossier rarement consulté. Quand arrive une inspection de la BNA ou un audit externe, reconstituer cet historique est lent et fragile. Le défi de ce projet était de construire une plateforme où chaque acte de gouvernance — un vote, un procès-verbal approuvé, un accès à un document confidentiel — est enregistré d'une façon qui résiste à l'examen, sans rendre le quotidien du conseil plus bureaucratique qu'il ne l'est déjà.",
    stack: [
      { label: "Frontend", items: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS 4", "Radix UI (dialog, tabs, tooltip, select)"] },
      { label: "Backend", items: ["NestJS 11", "TypeScript", "Passport + JWT (access/refresh)", "Speakeasy (2FA / TOTP)", "PDFKit pour les rapports", "Winston (journalisation structurée)", "@anthropic-ai/sdk (assistant IA)"] },
      { label: "Base de données", items: ["PostgreSQL", "Prisma ORM", "Row-Level Security native de Postgres pour l'isolation multi-tenant", "Migrations versionnées"] },
      { label: "Infrastructure", items: ["Docker + workspaces (api / web / database / shared)", "AWS S3 (documents)", "AWS SES (emails)", "Redis / ioredis (liste noire de tokens, files d'attente)", "Scheduler (@nestjs/schedule) pour les tâches quotidiennes"] },
    ],
    architecture: [
      {
        title: "Isolation multi-tenant renforcée au niveau de la base de données, pas seulement dans l'application",
        content:
          "Au-delà du filtre habituel par organizationId dans les services, Postgres a la Row-Level Security activée sur toutes les tables sensibles : au début de chaque transaction, l'application définit SET LOCAL app.current_organisation_id, et une politique RLS filtre automatiquement tout SELECT, INSERT ou UPDATE en fonction de cette valeur — de façon transparente pour Prisma. Cela signifie que même si un bug dans la couche applicative oublie de filtrer par organisation, la base de données continue d'empêcher l'accès croisé entre clients. Il existe un contournement explicite (app.bypass_rls) réservé uniquement aux migrations et aux seeds.",
      },
      {
        title: "Machine à états explicite pour le cycle de vie d'une réunion",
        content:
          "Une réunion ne peut transiter entre états (DRAFT → CONVENED → IN_PROGRESS → COMPLETED, ou CANCELLED depuis DRAFT/CONVENED) que via une carte de transitions valides vérifiée avant tout changement d'état — toute tentative de sauter directement de brouillon à réunion terminée est rejetée. Le quorum est calculé automatiquement au moment où la réunion démarre (achievedPercent par rapport au quorumPercent défini par l'organisation ou par la réunion elle-même), et ce pourcentage est enregistré dans l'événement de démarrage, jamais recalculé après coup.",
      },
      {
        title: "Votes avec hash d'intégrité, immuables par conception",
        content:
          "Chaque vote (ballot) génère un hash SHA-256 sur l'id du vote, le membre, la valeur votée et l'instant exact du vote. Une fois soumis, un ballot ne peut être modifié ni supprimé, et une contrainte d'unicité en base de données empêche le même membre de voter deux fois sur le même vote. Une fois clôturé, un vote n'accepte plus de nouveaux ballots. Les abstentions pour conflit d'intérêts (CONFLICT_ABSTENTION) sont enregistrées mais exclues du calcul de majorité — le résultat est toujours une simple comparaison entre les votes pour et contre des membres sans conflit.",
      },
      {
        title: "Procès-verbaux avec flux légal et réutilisation d'architecture pour les résolutions circulaires",
        content:
          "Les procès-verbaux suivent DRAFT → UNDER_REVIEW → APPROVED : en brouillon le Secrétaire édite librement, en révision seul lui peut faire des corrections pendant que les membres lisent, et une fois approuvé à la réunion suivante le procès-verbal devient immuable. Le contenu initial est généré automatiquement avec la structure exigée par la Loi 1/04 (présences, ordre du jour, délibérations). Les résolutions circulaires — votes asynchrones en dehors d'une réunion en présentiel — n'ont pas de module séparé : elles réutilisent la même architecture de Votes avec mode=ASYNC et une réunion virtuelle de type CIRCULAR_RESOLUTION, évitant de dupliquer toute la logique d'immuabilité déjà validée.",
      },
      {
        title: "RBAC à deux couches indépendantes : rôle dans l'organisation et rôle sur la plateforme",
        content:
          "Un utilisateur a un rôle au sein du conseil (PRESIDENT, BOARD_MEMBER, SECRETARY, GUEST, défini dans BoardMemberRole) complètement séparé de son éventuel rôle d'administrateur de la plateforme (AdminRole, utilisé uniquement dans le tableau de bord de super-administration multi-organisation). Mélanger ces deux dimensions a été identifié tôt comme une source de bugs d'autorisation — c'est pourquoi elles ne partagent jamais le même enum ni le même guard, même quand la même personne cumule les deux rôles.",
      },
    ],
    backend: [
      {
        title: "Filigrane dynamique sans toucher au fichier original",
        content:
          "Lors de la visualisation d'un PDF confidentiel, le backend télécharge le fichier depuis le bucket privé S3, applique un filigrane avec le nom du membre et la date/heure exacte via pdf-lib, téléverse le résultat vers un bucket temporaire et renvoie une URL présignée valide 15 minutes. Le document original n'est jamais modifié — chaque visualisation génère sa propre copie filigranée, traçable jusqu'à celui qui l'a demandée.",
      },
      {
        title: "Salle de Données Virtuelle (VDR) avec permissions granulaires et journal immuable",
        content:
          "Les documents particulièrement confidentiels peuvent vivre dans une VdrRoom isolée, avec des permissions définies membre par membre (voir / télécharger / imprimer) et une expiration automatique. Chaque accès — visualisation, téléchargement ou impression — est enregistré dans un journal qui ne peut pas être modifié, ce qui transforme la salle de données en pièce centrale de tout audit ultérieur.",
      },
      {
        title: "« Ne jamais bloquer en cas d'urgence, toujours auditer »",
        content:
          "L'accès d'urgence est le seul flux de la plateforme conçu pour n'avoir aucune friction : seuls le Président et le Secrétaire peuvent le demander, mais quand ils le font, l'accès est accordé immédiatement, pour un maximum de 8 heures. En échange, tous les autres Présidents et Secrétaires sont notifiés à cet instant, et chaque action réalisée durant cet accès — IP, user-agent, documents ouverts — est enregistrée de façon immuable, pouvant être signalée pour investigation ultérieure.",
      },
      {
        title: "Portail d'auditeurs externes avec session temporaire et révocation immédiate",
        content:
          "Le Secrétaire génère un accès pour un auditeur externe (BNA, CMC, réviseur de comptes), qui reçoit un token unique (UUID v4 + HMAC) par email. En accédant, l'auditeur obtient une session JWT valide 4 heures, navigue dans une interface en lecture seule avec filigrane automatique sur tout PDF, et chaque consultation est enregistrée. Le Secrétaire peut révoquer l'accès à tout moment — le token est immédiatement invalidé via une liste noire Redis, sans attendre l'expiration naturelle.",
      },
      {
        title: "Rapports de conformité générés à partir des mêmes données de gouvernance",
        content:
          "Plutôt que de maintenir un format d'export par tutelle, les rapports pour la BNA, la CMC, l'ARSEG ou le MINFIN partagent la même base de données (composition du conseil, activité des réunions, délibérations, conflits, journal d'audit) et ne diffèrent que par le formatage final — ce qui permet d'ajouter une nouvelle tutelle sans répliquer la logique métier.",
      },
      {
        title: "Assistant IA comme couche fine sur des données réelles de l'organisation",
        content:
          "Le module IA intègre l'API d'Anthropic pour quatre tâches concrètes — brouillon de procès-verbal à partir de l'ordre du jour et des décisions de la réunion, résumé d'un document, détection de risques juridiques/financiers dans un document et suggestion de points d'ordre du jour basée sur l'historique de l'organisation. Chaque appel enregistre les tokens consommés, pour le contrôle des coûts par organisation.",
      },
    ],
    features: [
      "Convocation de réunions avec calcul automatique du quorum",
      "Vote en temps réel et résolutions circulaires asynchrones",
      "Procès-verbaux avec flux légal de brouillon, révision et approbation (Loi 1/04)",
      "Salle de Données Virtuelle (VDR) avec filigrane dynamique et journal des accès",
      "Conseil d'administration : membres, mandats, rôles et comités spécialisés",
      "Déclarations annuelles d'intérêts et registre des conflits, alignés avec la BNA",
      "Bibliothèque de précédents avec indexation automatique à partir des procès-verbaux approuvés",
      "Accès d'urgence audité pour le Président et le Secrétaire",
      "Portail temporaire et révocable pour les auditeurs externes",
      "Messagerie sécurisée chiffrée entre membres du conseil",
      "Assistant IA pour procès-verbaux, résumés, risques et suggestion d'ordre du jour",
      "Export de rapports (PDF, CSV, JSON), incluant un rapport BNA/Ministère",
      "Tableau de bord de super-administration multi-organisation, avec feature flags par module",
      "Authentification à deux facteurs (TOTP) et journal d'audit complet",
    ],
    challenges: [
      {
        title: "Garantir l'isolation entre organisations même face à une erreur de programmation",
        content:
          "Résolu avec Row-Level Security directement dans Postgres, comme seconde ligne de défense après le filtre applicatif — la base de données ne renvoie jamais les données d'une autre organisation, indépendamment du fait qu'un service oublie de filtrer par organizationId.",
      },
      {
        title: "Faire en sorte qu'un vote ou un procès-verbal approuvé ne puisse jamais être remis en question comme falsifié",
        content:
          "Résolu avec un hash d'intégrité par vote, une contrainte d'unicité contre les votes en double, des votes clôturés qui refusent de nouveaux ballots, et des procès-verbaux qui deviennent immuables dès leur approbation — chaque élément pensé pour tenir comme preuve devant un régulateur.",
      },
      {
        title: "Supporter un accès d'urgence sans ouvrir de brèche de sécurité ni bloquer une crise réelle",
        content:
          "Résolu en inversant la logique habituelle : plutôt que de bloquer et demander une approbation, l'accès est accordé immédiatement à des rôles restreints (Président/Secrétaire), avec une limite de temps courte, une notification instantanée à tous les responsables et un enregistrement immuable de tout ce qui a été consulté pendant la fenêtre d'urgence.",
      },
    ],
    learnings: [
      "La Row-Level Security au niveau de la base de données est un filet de sécurité qui survit aux futurs bugs de la couche applicative — cela vaut la peine même quand le filtre applicatif existe déjà",
      "Réutiliser une architecture déjà validée (Votes) pour un nouveau cas d'usage (résolutions circulaires) est plus sûr que de construire un module parallèle avec sa propre logique d'immuabilité",
      "Séparer complètement le rôle de quelqu'un dans l'organisation de son rôle sur la plateforme évite toute une classe de bugs d'autorisation qui n'apparaissent que lorsque la même personne cumule les deux",
      "Concevoir dès le départ pour la conformité réglementaire (Loi 1/04, rapports BNA) économise un travail de refonte important quand vient le moment de générer ces rapports, car les données naissent déjà sous la bonne forme",
    ],
  },
};

export default fr;
