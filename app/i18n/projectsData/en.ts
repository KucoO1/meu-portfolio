import type { ProjectTranslationDict } from "./types";

const en: ProjectTranslationDict = {
  ecommerce: {
    title: "E-commerce",
    tagline: "Full e-commerce platform, from catalog to checkout",
    overview:
      "A complete online store built to simulate the real operation of a small/medium merchant: a product catalog organized by category, a persistent cart, checkout with an order summary, and a foundation designed from day one to support an admin panel for managing products and orders. The goal was to build the same backbone that powers stores like Shopify or WooCommerce, but built by hand to understand exactly what happens behind every \"Add to cart\" click.",
    problem:
      "Merchants who want to sell online face two extremes: expensive, inflexible SaaS solutions (Shopify, Nuvemshop) or fully custom solutions that are expensive to maintain. The challenge was to build a lightweight, platform-independent open-source e-commerce foundation that any business could clone and adapt to its catalog, with full control over the data model, the payment flow, and the shopping experience.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Context API / Zustand for the cart"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT for authentication", "Multer / Cloudinary for images"] },
      { label: "Database", items: ["MongoDB", "Mongoose (ODM)"] },
      { label: "Infrastructure", items: ["Vercel (frontend)", "Render / Railway (API)", "Stripe / Multicaixa Express (payments)"] },
    ],
    architecture: [
      {
        title: "Next.js as the presentation layer, a separate API as the source of truth",
        content:
          "I chose to fully decouple the frontend from the backend instead of just using Next.js API Routes. The catalog and product pages use Server Components with build-time/revalidate fetching (ISR) to serve ready-made HTML to search engines — essential for an e-commerce site, where SEO is the main source of organic traffic — while the cart, checkout, and account area use Client Components that talk directly to the Node/Express API via REST. This separation also means the same API could power a mobile app in the future without any changes.",
      },
      {
        title: "Domain-driven data modeling",
        content:
          "Instead of a single generic \"Product\" document, the schema separates Product, Category, and Variant (size/color with their own stock and price), allowing a product to have multiple variants without duplicating marketing information (description, images, SEO). Orders store a snapshot of the product's price and name at the moment of purchase — a critical e-commerce architecture decision, since an order's history must never change if the merchant later updates a product's price.",
      },
      {
        title: "Persistent cart and state hydration",
        content:
          "The cart is stored in localStorage for anonymous users and synced with the account as soon as the user logs in, merging the two carts instead of overwriting one with the other. This avoids the classic problem of poorly built e-commerce sites: the customer adds products, logs in, and the cart \"disappears.\"",
      },
    ],
    backend: [
      {
        title: "REST API in Node.js + Express",
        content:
          "The API exposes predictable, versioned resources: /api/products, /api/categories, /api/cart, /api/orders, /api/auth, /api/admin/*. Each route goes through a chain of middlewares: payload validation (Zod/Joi), JWT authentication when required, role verification (customer vs admin), and a central error handler that translates Mongoose errors into consistent HTTP responses (400, 401, 403, 404, 409, 500) instead of exposing stack traces to the client.",
      },
      {
        title: "Order state machine",
        content:
          "An order moves through well-defined states — pending → paid → processing → shipped → delivered / cancelled — and each transition is validated on the server, never trusting the value sent by the client. Payment confirmation arrives via a payment gateway webhook (signature verified with the provider's secret), which avoids the common mistake of marking an order as paid just because the customer's browser redirected to a success page.",
      },
      {
        title: "Stock consistency under concurrency",
        content:
          "When two people try to buy the last unit of a product at the same time, a simple \"read stock, subtract, save\" creates a race condition. Stock reservation uses a single atomic MongoDB findOneAndUpdate with the condition stock ≥ requested quantity — if the condition fails, the operation is rejected immediately and the customer gets \"out of stock,\" guaranteeing stock never goes negative even under concurrent traffic.",
      },
    ],
    features: [
      "Catalog with categories, search, and filters",
      "Product page with variants (size/color) and image gallery",
      "Cart persisted across sessions",
      "Checkout with order summary and shipping calculation",
      "Customer authentication and a \"My orders\" area",
      "Admin panel for product/category CRUD and order management",
    ],
    challenges: [
      {
        title: "Avoiding overselling limited-stock products",
        content:
          "Solved with atomic operations in MongoDB (conditional findOneAndUpdate) instead of a two-step check-then-write pattern, eliminating the window where two requests could \"see\" the same available stock.",
      },
      {
        title: "Keeping order history faithful to the moment of purchase",
        content:
          "Solved by storing an immutable snapshot of the product data on each order line, instead of just a reference (ID) to the product — so future price or name changes never corrupt past orders.",
      },
    ],
    learnings: [
      "Clearly separating what should be a Server Component (SEO, public data) from what should be a Client Component (interactivity, user state)",
      "The importance of never trusting the price/state sent by the client — the server is always the source of truth",
    ],
  },

  orbital: {
    title: "Orbita Project",
    tagline: "Online tech store with its own visual identity",
    overview:
      "Orbita is the second e-commerce platform in the portfolio, built on the same stack as the previous project (Next.js, Node.js, MongoDB) but with a different purpose: instead of reusing the design, this project was used to explore a distinct visual identity and browsing experience — a tech store with a dark theme, bolder typography, and a strong emphasis on product imagery — validating that the same backend foundation can power stores with completely different \"brands.\"",
    problem:
      "After building a generic e-commerce site, the goal was to answer a very common real-world agency question: how do you reuse an already-tested API and business logic to launch a second store with its own visual identity, without duplicating backend work? Orbita was born as that exercise in frontend reuse and specialization.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion for micro-interactions"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT", "Service architecture shared with the E-commerce project"] },
      { label: "Database", items: ["MongoDB", "Mongoose"] },
      { label: "Infrastructure", items: ["Vercel", "Render / Railway"] },
    ],
    architecture: [
      {
        title: "Backend as a reusable service, frontend as a \"theme\"",
        content:
          "The domain layer (products, cart, orders, authentication) was designed as a service independent from presentation. Orbita's frontend consumes the same API contracts as the E-commerce project, but with completely different UI components, color palette, and copy — proving in practice that frontend/backend separation isn't just theory, it's what makes it possible to launch a second store in far less time than the first.",
      },
      {
        title: "A dedicated design system on top of the same technical foundation",
        content:
          "A new layer of visual components (product cards, featured hero, navigation) was built using Tailwind with its own color and spacing tokens, while keeping the same data hooks (useProducts, useCart) from the previous project — which drastically reduced development time for the functional part and allowed effort to focus on the visual experience.",
      },
    ],
    backend: [
      {
        title: "Same API principles as the E-commerce project",
        content:
          "Orbita follows the same REST API philosophy in Node.js/Express with MongoDB: versioned routes, JWT authentication, and the same order state machine (pending → paid → shipped → delivered). Where this project differs is in its multi-tenant configuration: the product schema includes a storeId field, allowing the same database to serve multiple stores with isolated catalogs — the foundation for eventually turning this into an \"e-commerce as a service\" platform.",
      },
      {
        title: "Built for multiple stores on the same infrastructure",
        content:
          "Every API request receives the storeId via a header or subdomain, and all read/write filters in Mongoose automatically include that condition through a query middleware — preventing one store from accidentally seeing or modifying another store's data.",
      },
    ],
    features: [
      "Tech product catalog with strong visual emphasis",
      "Cart and checkout sharing the E-commerce project's logic",
      "Own visual identity and navigation",
      "Architecture ready for multi-store (storeId per catalog)",
    ],
    challenges: [
      {
        title: "Reusing logic without visually coupling the two projects",
        content:
          "Solved by isolating all data logic in hooks and services independent of styling, allowing the same useCart hook to power two completely different interfaces without duplicating business rules.",
      },
    ],
    learnings: [
      "How to design an API to be \"reusable\" from the first project, instead of refactoring later",
      "The difference between visual coupling and data coupling in a fullstack system",
    ],
  },

  "gestao-financeira": {
    title: "Personal Finance Management System",
    tagline: "Personal finance tracking with visual reports",
    overview:
      "A personal finance tracking application with a dashboard summarizing balance, income, and expenses for the month, a list of categorized transactions, and charts that make it visible where money is going. The goal was to go beyond a spreadsheet: to give the user an instant read on their financial health, with the same data discipline a real accounting system requires.",
    problem:
      "Most people don't lack financial data — they lack visibility into it. This project solves the \"where is my money going\" problem by aggregating scattered entries (income, expenses, categories) into a single dashboard, with reports that answer concrete questions: how much did I spend on food this month? Is my balance growing or shrinking?",
    stack: [
      { label: "Frontend", items: ["React", "React Router", "Context API / Redux for global state", "Chart.js / Recharts for charts"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT for authentication", "Validation with Zod/Joi"] },
      { label: "Database", items: ["PostgreSQL", "Sequelize / Prisma (ORM)"] },
      { label: "Infrastructure", items: ["Vercel (frontend)", "Render (API + database)"] },
    ],
    architecture: [
      {
        title: "Relational database for financial integrity",
        content:
          "Unlike a product catalog, financial data requires strong consistency: a transaction can never \"disappear\" or end up in an intermediate state. That's why a relational database (PostgreSQL) was chosen over NoSQL — the schema has normalized tables for Users, Categories, and Transactions, with foreign keys and SQL transactions (BEGIN/COMMIT/ROLLBACK) ensuring a compound operation (e.g., creating a transaction and updating the aggregated balance) is never left partially applied.",
      },
      {
        title: "Separation between raw data and aggregated data",
        content:
          "The dashboard doesn't recompute everything on the frontend on every render. Monthly aggregations (total income, total expenses, balance, distribution by category) are calculated on the backend via aggregation SQL queries (GROUP BY month/category), returning to the frontend only numbers already ready for the charts — drastically reducing the volume of data transferred and processing done in the browser.",
      },
      {
        title: "Categorization as a first-class entity",
        content:
          "Expense/income categories are managed by the user themselves (not a fixed enum), with a default \"Other\" category. This was a deliberate decision: a personal finance system is only useful if it adapts to the life of the person using it, not to what the developer thought made sense.",
      },
    ],
    backend: [
      {
        title: "Reports-oriented Node.js + Express API",
        content:
          "Besides the usual CRUD endpoints (/api/transactions, /api/categories), the API exposes dedicated report endpoints like /api/reports/monthly and /api/reports/by-category, which run aggregations directly in the database instead of returning all transactions for the client to sum up — an important performance principle: aggregations belong in the database, not the frontend.",
      },
      {
        title: "Authentication and per-user data isolation",
        content:
          "Each transaction belongs to exactly one user, and every backend query mandatorily filters by the userId extracted from the JWT token — never from the request body — preventing a user from accidentally accessing another person's transactions, even via a frontend mistake.",
      },
      {
        title: "Strict validation of monetary values",
        content:
          "Monetary values are validated and stored as integers (cents) instead of floating-point numbers, avoiding the classic JavaScript money rounding errors (0.1 + 0.2 !== 0.3), converting to decimal format only at the presentation layer.",
      },
    ],
    features: [
      "Dashboard with monthly balance, income, and expenses",
      "Transaction logging with customizable categories",
      "Monthly evolution charts and category distribution",
      "Filters by period and by category",
      "Authentication and per-user isolated data",
    ],
    challenges: [
      {
        title: "Avoiding rounding errors on monetary values",
        content:
          "Solved by storing all values as integer cents in the database, and only converting to decimal format (e.g., 1050 → 10.50 Kz) when presenting to the user.",
      },
      {
        title: "Fast dashboard even with many transactions",
        content:
          "Solved by moving aggregations (sums, averages, groupings) to backend SQL queries instead of calculating them in JavaScript on the frontend for every loaded transaction.",
      },
    ],
    learnings: [
      "When to choose a relational database over NoSQL — integrity and transactions matter more than schema flexibility",
      "Treat money as integers, never as floats",
    ],
  },

  "gestao-stock": {
    title: "Stock Management",
    tagline: "Inventory control with an auditable movement history",
    overview:
      "A complete stock/inventory management system, designed for small and medium businesses that need to know, at any moment, how much of each product they have, who moved it, and why. It covers the entire cycle: incoming goods, sales outflows, inventory adjustments, suppliers, and low-stock alerts.",
    problem:
      "Many SMBs still track stock in shared Excel sheets, where it's easy to lose the history of \"who changed what\" and discrepancies between \"paper\" stock and actual warehouse stock are common. The goal was to build a system where every stock change is recorded as an auditable movement, never as a silent update to a plain number.",
    stack: [
      { label: "Frontend", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "TanStack Table for listings"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT + roles (admin/operator)", "Validation with Zod"] },
      { label: "Database", items: ["MySQL", "Sequelize / Prisma (ORM)", "SQL transactions for movements"] },
      { label: "Infrastructure", items: ["Vercel (frontend)", "Railway / VPS (API + MySQL)"] },
    ],
    architecture: [
      {
        title: "Kardex: stock as the result of movements, never an editable number",
        content:
          "The most important architectural decision in this project: a product's \"current stock\" field is never edited directly. Instead, there's a stock_movements table (in, out, adjustment, return), and current stock is always the sum of all movements for that product — the same principle used in accounting systems (ledger / kardex). This means you can always answer \"why does this product have 12 units\" with a complete, chronological list of events, never an unexplained number.",
      },
      {
        title: "MySQL and ACID transactions for inventory consistency",
        content:
          "MySQL was chosen over a NoSQL database precisely because of the need for ACID transactions: recording a stock outflow requires, in the same transaction, inserting the movement and verifying the resulting stock isn't negative — and if any step fails, the entire transaction is rolled back, never leaving inventory in an inconsistent state.",
      },
      {
        title: "Differentiated roles: operator vs administrator",
        content:
          "Warehouse operators can log inflows/outflows but cannot delete history or change cost prices; only administrators have access to financial reports and supplier management — reflecting the separation of responsibilities that exists in a real company.",
      },
    ],
    backend: [
      {
        title: "Node.js + Express API structured by domain",
        content:
          "Endpoints organized by business resource: /api/products, /api/suppliers, /api/movements, /api/reports/low-stock. Every write route to movements runs inside an explicit MySQL transaction, and the minimum-stock threshold per product triggers an alert queryable via /api/reports/low-stock, used by the frontend to highlight products to restock.",
      },
      {
        title: "Inventory value reports",
        content:
          "The backend calculates the total inventory value (quantity × weighted average cost) through aggregated SQL queries, not JavaScript — a choice made for both performance and correctness, since the weighted average cost needs to be recalculated on every stock inflow with a different price than the previous one.",
      },
    ],
    features: [
      "Logging of stock inflows, outflows, and adjustments",
      "Complete, auditable history per product (kardex)",
      "Supplier and cost management",
      "Low-stock alerts",
      "Inventory value reports",
      "Access roles: operator and administrator",
    ],
    challenges: [
      {
        title: "Guaranteeing stock never goes negative under concurrent operations",
        content:
          "Solved with explicit SQL transactions: checking available stock and inserting the outflow movement happen within the same BEGIN/COMMIT, with row locking (SELECT ... FOR UPDATE) on the product during the operation.",
      },
      {
        title: "Explaining inventory discrepancies",
        content:
          "Solved by making stock a value derived from the movement history instead of a directly editable field — any discrepancy is always traceable to a specific movement, with a user and timestamp.",
      },
    ],
    learnings: [
      "The kardex/ledger pattern applies far beyond accounting — any \"quantity that changes over time\" system benefits from it",
      "When to use row locking to protect concurrent operations in a relational database",
    ],
  },

  "landing-page": {
    title: "Landing Page",
    tagline: "High-performance conversion page, no backend",
    overview:
      "A conversion landing page in the style of digital product sales funnels (e.g., Hotmart): a strong headline above the fold, benefit blocks, social proof, and a call to action repeated strategically throughout the page. This project was deliberately built with no backend of its own — the focus was 100% on loading performance and conversion-oriented copywriting, not server logic.",
    problem:
      "A sales landing page lives or dies by loading speed and message clarity in the first few seconds. The goal was to build a page that loaded almost instantly (Core Web Vitals in the green) and visually guided the visitor, without distractions, all the way to the buy button — with no server dependency that could introduce latency.",
    stack: [
      { label: "Frontend", items: ["React", "Vite", "CSS Modules / Tailwind CSS", "Framer Motion for scroll reveals"] },
      { label: "Integrations", items: ["Form connected to an external webhook (Hotmart / checkout platform)", "Google Analytics / Meta Pixel for conversion tracking"] },
      { label: "Infrastructure", items: ["Vercel (static hosting)"] },
    ],
    architecture: [
      {
        title: "An entirely static page, with no server of its own — by choice, not limitation",
        content:
          "Unlike the other projects in this portfolio, this page doesn't have (or need) a backend: it's served as static HTML/CSS/JS through Vercel's CDN, meaning near-instant response times anywhere in the world. The entire purchase process is delegated to an external checkout platform (the real standard in the digital products market), and the page simply guides the visitor there.",
      },
      {
        title: "Section structure designed as a funnel, not a site",
        content:
          "Each section of the page has a single persuasive goal — capture attention, build desire, remove objections, create urgency — in the classic order of a sales funnel (AIDA). The React components are deliberately \"dumb\" (no business logic), because the real engineering work here is in performance and copywriting, not data architecture.",
      },
    ],
    backend: [],
    features: [
      "Hero with a clear value proposition above the fold",
      "Benefit and social proof sections",
      "Strategically repeated calls to action (CTAs)",
      "Scroll-triggered entrance animations",
      "Optimized for Core Web Vitals (LCP, CLS, INP)",
    ],
    challenges: [
      {
        title: "Maximizing loading speed without sacrificing animation",
        content:
          "Solved by using optimized images and lazy loading outside the initial fold, and limiting heavy animations (Framer Motion) to elements entering the viewport, avoiding rendering cost before they're seen.",
      },
    ],
    learnings: [
      "Not every project needs a backend — sometimes the best architecture is the simplest one that solves the problem",
      "Perceived performance on a sales landing page directly impacts conversion rate",
    ],
  },
  argpack: {
    title: "ArgPack",
    tagline: "Marketplace connecting Argentine producers to affiliates who sell their products in Brazil",
    overview:
      "A micro-export marketplace connecting small Argentine producers (wine, food, crafts, leather) to Brazilian affiliates who promote and sell those products through their own referral link, earning a commission on every confirmed sale. The platform has three profiles: the producer, who manages their catalog and sales; the affiliate, who generates product links and tracks earnings and commission tier; and the admin, who oversees the whole operation.",
    problem:
      "A small Argentine producer rarely has a sales team or their own digital marketing to reach the Brazilian market, and an affiliate who wants to promote niche physical products has no simple way to generate trackable links and get paid transparently for it. ArgPack solves both sides at once: it gives the producer a catalog and storefront, and gives the affiliate a referral system with automatic commission.",
    stack: [
      { label: "Frontend", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Context API (cart, wishlist, authentication)"] },
      { label: "Backend", items: ["Node.js + Express + TypeScript", "JWT (jsonwebtoken) for authentication", "Zod for payload validation", "Helmet + CORS + Morgan"] },
      { label: "Database", items: ["MongoDB + Mongoose", "Models: User, Producer, Affiliate, Product, Sale, Order"] },
      { label: "Infrastructure", items: ["Vercel (frontend)", "Separate REST API (Node backend)"] },
    ],
    architecture: [
      {
        title: "Three roles, one single user model",
        content:
          "There's a single User collection with a userType field (affiliate | producer | admin), and each role then has its own profile document (Producer or Affiliate) linked by userId. This avoids duplicating authentication logic for each account type and keeps the JWT generic — the authorization middleware decides what each role can see from a single field.",
      },
      {
        title: "Affiliate commission calculated server-side, never trusted from the client",
        content:
          "Each affiliate has a unique referralCode and a tier (Bronze 5%, Silver 10% with 10+ sales/month, Gold 15% with 50+ sales/month). When a sale is logged with a referral code, the backend resolves the affiliate who owns the code, calculates the commission from the tier table (never from a value sent by the client), and recalculates the affiliate's tier on every confirmed sale.",
      },
      {
        title: "Sale as a per-product-line record, Order as the full order",
        content:
          "A checkout can include several products from several different producers. Instead of storing everything inside the Order, each product line generates its own Sale document (with the producerId, assigned affiliate, and commission already calculated), while the Order stores the order data itself — shipping address, payment method, applied coupon. This lets each producer see only their own sales without exposing another producer's full order.",
      },
    ],
    backend: [
      {
        title: "Data model: producers, products, affiliates, and sales",
        content:
          "Producer stores company data (name, product type, location, plan). Product belongs to a Producer and has a category (wine, food, crafts, leather), price, and stock. Affiliate stores the referral code, current tier, and totals of sales and earnings. Sale links a Product to a Producer and, optionally, to an Affiliate, storing the total value, applied commission rate, and status (pending → confirmed → paid, or cancelled).",
      },
      {
        title: "Checkout flow with affiliate attribution",
        content:
          "The frontend stores the referral code captured from the URL (?ref=CODE) in localStorage with a 30-day validity, similar to an attribution cookie. At checkout, that code travels with the order; the backend resolves the affiliate, generates a Sale for each cart item with the commission already calculated, deducts product stock, and returns an order number (e.g., ARG-8F42A1). Free shipping above R$300, an optional discount coupon, and three simulated payment methods (card, Pix, boleto).",
      },
    ],
    features: [
      "Product catalog filterable by category (wine, food, crafts, leather)",
      "Affiliate system with a unique referral link and 3 automatic commission tiers",
      "Cart and checkout with discount coupon and free shipping above a minimum value",
      "Producer dashboard with sales, products, and confirmed revenue",
      "Affiliate dashboard with progress toward the next tier and commission history",
      "Admin dashboard with a platform overview and user management",
    ],
    challenges: [
      {
        title: "Correctly attributing a sale to the right affiliate, even in carts with multiple products",
        content:
          "Solved by treating each cart line as an independent Sale instead of splitting the commission of a single order record — each line inherits the same referralCode from the moment of checkout, which makes it trivial for a producer to see only their sales and an affiliate to see only the sales they generated, with no cross-calculations.",
      },
      {
        title: "Preventing the client from manipulating the commission rate",
        content:
          "The commission rate never comes from the frontend — it's always read from the TIER_RULES table on the backend based on the affiliate's current tier stored in the database, closing the door on a buyer (or affiliate) trying to manually send a higher rate.",
      },
    ],
    learnings: [
      "Modeling sales per product line (not per full order) greatly simplifies \"my sales\" queries when multiple producers and affiliates are in the same checkout",
      "Storing business rules (like commission tiers) in a single source of truth on the backend avoids duplicating the same logic across multiple controllers",
    ],
  },

  "games-hub": {
    title: "Games Hub",
    tagline: "Casual mini-game hub, 100% in the browser",
    overview:
      "A hub with several casual mini-games (memory game and others), all running entirely in the browser with no server dependency whatsoever. The focus of this project was frontend architecture: how to structure multiple independent games sharing common components (timer, scoreboard, scoring system) without one game's logic \"leaking\" into another.",
    problem:
      "Building several games in a single application easily results in coupled code, where changing one game's rules risks breaking another. The challenge was to design an architecture where each game is an isolated, replaceable unit, with a common \"engine\" (game state, timer, high score) reused by all of them.",
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Context API + useReducer per game", "CSS Modules"] },
      { label: "Local persistence", items: ["localStorage for high scores and progress (no backend)"] },
      { label: "Infrastructure", items: ["Vercel (static hosting)"] },
    ],
    architecture: [
      {
        title: "Each game as an isolated module with a common interface",
        content:
          "Every game implements the same conceptual \"interface\": an initial state, a reducer function (useReducer) that processes moves, and a scoreboard component. This means the Scoreboard component, the Timer, and the \"best score\" system are generic and reused by any new game — adding a game to the hub doesn't require touching any code from existing games.",
      },
      {
        title: "TypeScript as a safety net between games",
        content:
          "Generic types (Game<State, Action>) guarantee, at compile time, that each game correctly implements the contract expected by the hub — avoiding the common mistake in JavaScript game hubs where a badly implemented game silently breaks the overall scoreboard.",
      },
    ],
    backend: [],
    features: [
      "Memory game with difficulty levels",
      "Scoring system and personal high scores (localStorage)",
      "Timer reusable across games",
      "Modular architecture ready for new games",
    ],
    challenges: [
      {
        title: "Adding new games without duplicating scoreboard/timer logic",
        content:
          "Solved by extracting a generic game \"engine\" (useGameTimer, useScoreboard hooks) independent of any specific game, used via composition in every new game added to the hub.",
      },
    ],
    learnings: [
      "How to design generic TypeScript interfaces (Game<State, Action>) to enforce consistency between independent modules",
      "Local persistence (localStorage) is sufficient and appropriate when there's no real need to share data across devices",
    ],
  },

  primeflix: {
    title: "PrimeFlix",
    tagline: "Trending movie discovery, consuming a public API",
    overview:
      "An application for discovering trending movies and viewing their details (synopsis, rating, cast, release date), consuming a public movie API (TMDB). The focus of the project was the external API integration layer: how to structure HTTP calls, handle errors and rate limits, and keep the interface responsive even with data arriving asynchronously.",
    problem:
      "Robustly consuming a third-party public API is harder than it looks: API keys can't be carelessly exposed, requests can fail or be rate-limited, and the user experience can't \"freeze\" while waiting for a response. The goal was to build that integration layer cleanly and reusably.",
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Axios (configured instance + interceptors)", "React Query for request caching"] },
      { label: "External integration", items: ["The Movie Database (TMDB) public API", "Environment variables for the API key"] },
      { label: "Infrastructure", items: ["Vercel (static hosting)"] },
    ],
    architecture: [
      {
        title: "Dedicated Axios instance with interceptors",
        content:
          "Instead of calling axios.get directly in every component, there's a single Axios instance (api.ts) with a pre-configured baseURL and API key, and response interceptors that centrally handle 401/429 errors (rate limit exceeded) and format friendly error messages — avoiding duplicated error handling in every call.",
      },
      {
        title: "Dedicated hooks per data type (useTrendingMovies, useMovieDetails)",
        content:
          "Every data need has its own hook, responsible for calling the API, managing loading/error states, and (with React Query) caching results — avoiding repeated requests to the public API for the same search filters, which also helps not exhaust TMDB's free request limit.",
      },
      {
        title: "Debounced search to reduce unnecessary calls",
        content:
          "Movie search only fires an API request 400ms after the user stops typing, instead of on every keystroke — a simple but essential optimization when consuming an external API with usage limits.",
      },
    ],
    backend: [],
    features: [
      "Trending and category movie listings",
      "Debounced movie search",
      "Detail page with synopsis, rating, and cast",
      "Loading and error states handled consistently",
    ],
    challenges: [
      {
        title: "Avoiding exhausting the public API's request limit",
        content:
          "Solved by combining search debounce with React Query result caching, drastically reducing the number of repeated calls to TMDB for the same searches.",
      },
      {
        title: "Keeping the interface responsive during async requests",
        content:
          "Solved with dedicated loading states per page section (skeleton loaders), instead of blocking the entire page while waiting for a single response.",
      },
    ],
    learnings: [
      "Centralizing HTTP client (Axios) configuration in a single instance avoids duplication and inconsistency in error handling",
      "Client-side caching (React Query) is just as important as server-side caching when relying on rate-limited third-party APIs",
    ],
  },
  barbearia: {
    title: "Barbershop",
    tagline: "Online booking with admin dashboard and payments",
    overview:
      "A booking platform for a barbershop, with service, barber, and available time-slot selection, an admin dashboard for the barber to manage the schedule, and payment integration to confirm the booking with an upfront deposit. Built as a fullstack Next.js application, using Next.js itself (App Router + Route Handlers) as the backend layer instead of a separate Express server.",
    problem:
      "Bookings made via WhatsApp or phone are easy to lose track of and don't prevent no-shows (clients who book and don't show up). The goal was to digitize the booking process end-to-end: show only truly available time slots, prevent duplicate bookings for the same barber/time, and reduce no-shows by requiring a small deposit at booking time.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "React Hook Form + Zod for validation"] },
      { label: "Backend", items: ["Next.js Route Handlers (integrated API, no separate Express server)", "NextAuth for admin panel authentication"] },
      { label: "Database", items: ["PostgreSQL", "Prisma ORM"] },
      { label: "Payments", items: ["Payment gateway integration (Multicaixa Express / Stripe) for the booking deposit"] },
      { label: "Infrastructure", items: ["Vercel (frontend + Route Handlers)", "Supabase / Railway (PostgreSQL)"] },
    ],
    architecture: [
      {
        title: "Fullstack Next.js: Route Handlers as the backend, no separate server",
        content:
          "Unlike the e-commerce projects (where the backend is an independent Node/Express service), here the choice was to keep everything inside Next.js itself via Route Handlers (app/api/.../route.ts). For a domain of this size — bookings, services, barbers — the operational complexity of maintaining two separate deployments (frontend and backend) wasn't justified; fullstack Next.js delivers the same product with half the infrastructure to manage.",
      },
      {
        title: "Availability modeling: derived slots, not a giant schedule table",
        content:
          "Instead of pre-generating a database row for every possible time slot of every day (which grows indefinitely), available slots are calculated dynamically: the backend cross-references the barber's working hours with existing bookings for that day, returning only the intervals still free. This keeps the database small and always correct, with no need for periodic cleanup tasks.",
      },
      {
        title: "Slot reservation with a transaction to prevent double booking",
        content:
          "When a client confirms a time slot, creating the booking runs inside a Prisma transaction that first checks, with a lock, that the barber is still free in that interval — if two clients try to book the same slot simultaneously, only the first to complete the transaction gets the booking; the second immediately gets a \"slot already taken\" error.",
      },
    ],
    backend: [
      {
        title: "Route Handlers organized by business domain",
        content:
          "/api/services (services and prices), /api/professionals (barbers and working hours), /api/availability (free slot calculation), /api/bookings (booking creation and management), and /api/payments/webhook (async confirmation of the paid deposit). Admin Route Handlers require a valid NextAuth session with an \"admin\" role, while public booking ones are accessible to any visitor, but with strict input validation via Zod.",
      },
      {
        title: "Payment deposit as commitment confirmation",
        content:
          "A booking only moves from pending_payment to confirmed when the payment gateway successfully notifies the webhook — never just because the client was redirected back to the site. Bookings that stay in pending_payment without confirmation for more than X minutes are automatically released, returning the slot to general availability.",
      },
      {
        title: "Admin dashboard with the day's schedule",
        content:
          "The authenticated barber sees the day's schedule grouped by professional, can manually book clients who call by phone, and cancel/reschedule slots — every operation goes through the same availability validation layer used by the end client, guaranteeing there's never two different (and potentially inconsistent) paths for creating a booking.",
      },
    ],
    features: [
      "Service, professional, and available time-slot selection",
      "Dynamic availability calculation (no ghost slots)",
      "Payment deposit to confirm the booking",
      "Admin dashboard with the day's schedule per professional",
      "Prevention of duplicate bookings for the same slot",
    ],
    challenges: [
      {
        title: "Preventing two clients from booking the same slot",
        content:
          "Solved with a database transaction that atomically checks and reserves the slot, instead of two separate operations (check availability, then create the booking) which would leave a vulnerable time window.",
      },
      {
        title: "Reducing no-shows without driving clients away with a heavy payment process",
        content:
          "Solved by requiring only a partial deposit (not the full service value) at booking time, balancing client commitment with friction in the booking process.",
      },
    ],
    learnings: [
      "When to opt for a Next.js-integrated backend (Route Handlers) instead of a separate Express service — it depends on the actual size of the domain, not personal preference",
      "Schedule availability should always be calculated, never stored as a fixed list of slots",
    ],
  },

  neoxia: {
    title: "Neoxia",
    tagline: "Institutional website for a digital marketing agency",
    overview:
      "An institutional website for Neoxia, a digital marketing agency, presenting its services, case studies, and a direct way for potential clients to get in touch. Unlike the e-commerce or SaaS projects in this portfolio, the goal here wasn't a system with lots of dynamic data, but a fast, credible digital presence oriented toward generating business leads.",
    problem:
      "A digital marketing agency is, itself, the first test of its own credibility: if the institutional website is slow, generic, or fails to generate qualified leads, that undermines the agency's own sales pitch. The challenge was to build a site that reflected technical professionalism and converted visitors into real contact requests.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion for section transitions"] },
      { label: "Backend", items: ["Dedicated Next.js Route Handler for the contact form", "Resend (transactional email delivery)"] },
      { label: "Infrastructure", items: ["Vercel (frontend + Route Handler)", "Static rendering (SSG) for all content pages"] },
    ],
    architecture: [
      {
        title: "An almost entirely static site, with a single dynamic island",
        content:
          "The vast majority of pages (services, about, case studies) are statically generated (SSG) at build time, guaranteeing minimal load times and excellent SEO — essential for an agency that depends on organic search traffic. The only truly \"dynamic\" part of the site is the contact form, isolated as the one feature that genuinely needs to run on the server.",
      },
      {
        title: "Contact form as a Route Handler + transactional email service",
        content:
          "The form submits to a Route Handler (app/api/contact/route.ts) that validates the data server-side (never trusting only client-side validation), applies a simple per-IP rate limit to mitigate spam, and uses Resend to send the contact request email directly to the agency's inbox — with no need to maintain a database just to store contact messages.",
      },
      {
        title: "Content as the project's real product",
        content:
          "For an institutional site, the code architecture is deliberately simple; the engineering effort was invested in performance (Core Web Vitals), accessibility, and copy clarity — because that's what determines whether a marketing agency itself looks well-positioned in marketing.",
      },
    ],
    backend: [
      {
        title: "No database — direct delivery via transactional email",
        content:
          "Instead of storing contact submissions in a database to be reviewed manually later, the Route Handler sends the request directly by email via Resend as soon as it's submitted — reducing operational complexity to zero (no database to maintain) at the cost of not having a searchable history, an acceptable trade-off for the expected volume of an institutional site.",
      },
      {
        title: "Basic protection against spam and abusive submissions",
        content:
          "The Route Handler applies strict schema validation (Zod) and a submission limit per IP within a short time window, preventing the form from being used to send mass spam through the agency's email infrastructure.",
      },
    ],
    features: [
      "Digital marketing services showcase",
      "Agency case studies/portfolio section",
      "Contact form with direct email delivery",
      "Fully static site optimized for SEO",
    ],
    challenges: [
      {
        title: "Generating business leads without the complexity of a database",
        content:
          "Solved by opting for direct transactional email delivery (Resend) from a single Route Handler, instead of building a lead storage and management system that would be disproportionate to the project's scale.",
      },
    ],
    learnings: [
      "Not every contact form needs a database — sometimes transactional email is the simplest and most correct solution",
      "For institutional sites, SEO and loading performance are, in practice, business features",
    ],
  },
  qrcodepay: {
    title: "QrCodePay",
    tagline: "QR Code payment platform for merchants, with invite-based onboarding and a full admin dashboard",
    overview:
      "QrCodePay is a QR Code payment platform designed for merchants who want to accept digital payments without depending on a single bank or mobile wallet. Each merchant has a fixed QR Code for their store (for generic payments) and can generate dynamic, per-transaction QR Codes with an amount, unique reference, and expiration — the same pattern used by instant QR payment systems in several emerging markets. Beyond the merchant experience, the project includes a full admin dashboard, with merchant management, users, access invites, transactions, and a system audit log.",
    problem:
      "Small and medium merchants who want to accept fast digital payments face a fragmented experience: every bank or mobile wallet has its own app, its own QR, and its own confirmation flow. The project's goal was to build a QR Code payment layer of its own — with the same rigor as a real financial product: well-defined transaction states, async confirmation never trusted to the client's browser, automatic expiration of unpaid payments, and a complete audit log of everything that happens in the system.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "TanStack Query for server data caching and sync"] },
      { label: "Backend", items: ["Node.js", "Express", "TypeScript", "JWT for authentication", "Background job for payment expiration"] },
      { label: "Database", items: ["MongoDB", "Mongoose (ODM)"] },
      { label: "Infrastructure", items: ["Docker + Docker Compose (frontend, backend, database, and proxy)", "Nginx as reverse proxy", "Separate configuration for development and production"] },
    ],
    architecture: [
      {
        title: "Closed invite-based onboarding, not public registration",
        content:
          "There's no public \"create account\" page: an administrator generates an invite tied to an email, the system sends a unique registration link with a validity period, and only whoever has that link can create the merchant account. On a platform that moves money, this is a deliberate security decision — it completely eliminates the attack surface of automatic registrations or fraudulent accounts, at the cost of more onboarding friction, an acceptable trade-off for this kind of product.",
      },
      {
        title: "Two QR Code types for two different use cases",
        content:
          "The merchant's static QR Code exists once, never expires, and serves generic payments in a physical store (the customer scans and enters the amount). The dynamic QR Code, on the other hand, is generated per transaction, already comes with the amount set, has a unique reference, and a short validity — designed for situations where the amount is known ahead of time (e.g., checkout, invoice). This distinction is reflected throughout the rest of the architecture, including how each QR type is validated on the backend.",
      },
      {
        title: "Three usage profiles on the same API",
        content:
          "The frontend application is split into three zones with their own layouts and permissions: the public payment page (for the end customer scanning the QR), the merchant dashboard (dashboard, payment creation, transactions, profile), and the admin dashboard (merchants, invites, users, global transactions, system logs). All three zones consume the same REST API, but every backend route validates the authenticated user's role before exposing any data.",
      },
      {
        title: "Containerized infrastructure from day one",
        content:
          "The project never ran \"just on the local machine\": frontend, backend, and database are defined in Docker Compose from the start, with Nginx in front acting as a reverse proxy. This forced early thinking about environment variables, internal networks between containers, and startup scripts for development and production from the very first version, instead of leaving that complexity for the end.",
      },
    ],
    backend: [
      {
        title: "Payment request state machine",
        content:
          "A payment moves through well-defined states — created → pending → confirmed / failed — and each transition is explicitly validated on the server before being applied; a transition that doesn't make sense (e.g., trying to confirm an already-failed payment) is rejected. This prevents a malformed request or a race between requests from leaving a transaction in an inconsistent state.",
      },
      {
        title: "Automatic expiration of unpaid payments",
        content:
          "A background process runs periodically and looks for payment requests that have passed their validity period without confirmation, marking them as expired and logging the reason in the transaction history. This means a forgotten dynamic QR Code doesn't stay \"pending\" forever on the merchant dashboard — the system self-cleans without needing manual intervention.",
      },
      {
        title: "Payment confirmation never trusted to the client",
        content:
          "Just like in this portfolio's e-commerce project, a payment is only marked as confirmed through an asynchronous, server-validated notification — never just because the client's browser was redirected to a \"success\" page. This is a rule that repeats in every well-built payment system, and it was replicated here on purpose.",
      },
      {
        title: "Audit log for the entire system",
        content:
          "Every relevant event — invite creation, a payment's state change, an admin action — generates a log record with the actor, event type, and relevant metadata, queryable in the admin's \"System logs\" panel. On a financial platform, knowing exactly what happened and when is not optional.",
      },
      {
        title: "Rate limiting on sensitive routes",
        content:
          "Critical endpoints like login and invite creation have request rate limiting, reducing the attack surface for brute force or automated abuse without affecting normal usage.",
      },
    ],
    features: [
      "Closed merchant onboarding, invite-only with an expiration period",
      "Permanent static QR Code per merchant",
      "Dynamic per-transaction QR Code, with amount, reference, and automatic expiration",
      "Merchant dashboard with revenue, recent transactions, and quick actions",
      "Admin dashboard with a global view of merchants, users, and transactions",
      "System health status visible on the admin dashboard",
      "Transaction history with filters and search",
      "System event audit log",
      "Password recovery and JWT-based authentication flow",
      "Fully containerized infrastructure with Docker Compose",
    ],
    challenges: [
      {
        title: "Preventing a payment from being confirmed by mistake",
        content:
          "Solved with explicit state transition validation on the server — every state change is checked against a list of allowed transitions before being saved, instead of blindly accepting any update.",
      },
      {
        title: "Preventing forgotten payments from cluttering the merchant dashboard",
        content:
          "Solved with a background process that automatically expires unpaid payment requests that have passed their deadline, without relying on the merchant or customer doing anything.",
      },
      {
        title: "Balancing security and speed in onboarding new merchants",
        content:
          "Solved with an invite flow: slower than instant public registration, but completely eliminates fraudulent or test accounts on a platform that handles money — a deliberate trade-off in favor of security.",
      },
    ],
    learnings: [
      "Designing an explicit state machine, even in a personal project, forces you to think through every possible path of a transaction — not just the happy path",
      "A simple background process (check and expire) solves a data integrity problem that would otherwise require complex logic scattered across multiple points in the application",
      "Having Docker Compose from the start, not just at the end, forces you to solve service configuration issues early that would otherwise only show up in production",
      "Closed invite-based onboarding is, in many financial products, a security feature as important as authentication itself",
    ],
  },
  crfdesk: {
    title: "CRFDesk",
    tagline: "Screening and compliance platform for crypto assets, with explainable risk scoring and regulator-ready reports",
    overview:
      "CRFDesk is a screening and compliance platform for crypto assets, built for teams who need to assess the risk of a wallet, transaction, or contract before accepting or processing an operation. Instead of returning just \"high risk\" or \"low risk,\" the system produces a quantified score, explained factor by factor, with history and versioning per entity, and can generate both analysis reports and formal Suspicious Activity Reports (SARs), with an approval flow by a supervisor before any submission. It also includes a multi-user admin dashboard, API key management for external integrations, and a usage dashboard per plan.",
    problem:
      "Compliance teams at crypto exchanges and fintechs can't justify a \"high risk\" decision to a regulator or auditor with a black box — they need to know exactly which factors contributed to the score, with what weight, and with what confidence level. The challenge of this project was to build a risk engine designed to be explainable from the ground up, not just an isolated number: every screening result has to be able to stand on its own as documentary evidence, with version history and a complete audit trail.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion", "TanStack Query"] },
      { label: "Backend", items: ["Node.js", "Express", "TypeScript", "Background job queue", "PDF report generation"] },
      { label: "Database", items: ["MongoDB", "Mongoose (ODM)", "Dedicated models for screenings, reports, SARs, and audit logs"] },
      { label: "Infrastructure", items: ["Docker + Docker Compose", "Nginx as reverse proxy", "API key authentication for external integrations", "Configurable webhooks"] },
    ],
    architecture: [
      {
        title: "A single orchestrator for the entire screening flow",
        content:
          "Every screening request mandatorily goes through a single orchestrator service, which chains request validation, risk calculation, score detail generation, versioning, entity timeline update, report generation, audit logging, notifications, and plan usage accounting. API controllers never call internal services in isolation — this guarantees that no screening can \"skip\" a mandatory step in the flow, which is essential for a product whose output can end up as evidence for a regulator.",
      },
      {
        title: "Score built from explainable risk factors, not a magic number",
        content:
          "Instead of a single unexplained value, every screening produces a list of risk factors (\"reason codes\"), each with a category, description, assigned points, percentage weight, evidence source, and confidence level (high/medium/low). The final score is the explainable sum of these factors, grouped by category with their respective severity — designed so a compliance team can justify every point of the result to an auditor.",
      },
      {
        title: "Versioning and risk timeline per entity",
        content:
          "Every new screening on the same address or wallet generates a new version of the score, instead of replacing the previous one. This allows reconstructing how an entity's risk evolved over time — important because an assessment made today may depend on information that only existed in a more recent version, and the platform has to be able to show that difference in an auditable way.",
      },
      {
        title: "Heavy processing isolated in a job queue, outside the HTTP request",
        content:
          "Multi-chain analyses and extensive PDF report generation don't block the response to the user: they're placed on a queue and processed in the background by a dedicated set of workers, with the user notified when the result becomes available. This keeps the interface responsive even when an analysis takes several seconds to complete.",
      },
      {
        title: "Integrity seal on already-issued reports",
        content:
          "Once generated, a report goes through an integrity service that prevents silent changes to its content — a necessary guarantee when the document may end up being used as formal evidence before an authority.",
      },
    ],
    backend: [
      {
        title: "Suspicious Activity Report (SAR) flow with hierarchical approval",
        content:
          "An analyst can generate a SAR draft from a high or critical risk screening, filling in a justification; the report only moves from draft to approved (and then submitted) with the explicit, logged approval of a supervisor. There's no automatic submission path — the human decision is always a mandatory, auditable step in the flow.",
      },
      {
        title: "Plan quota enforcement before any expensive operation",
        content:
          "Every organization has a screening and report limit defined by its plan, checked before starting any operation with meaningful computational cost — avoiding processing a heavy request that would end up being rejected for exceeding the limit anyway.",
      },
      {
        title: "API keys with their own scope, independent of user login",
        content:
          "External integrations (for example, a system that needs to automatically screen every fund withdrawal) authenticate with dedicated API keys, generated and revocable at any time from the dashboard — without sharing user credentials or requiring an interactive session.",
      },
      {
        title: "Country risk factor as an isolated, replaceable component",
        content:
          "The jurisdiction associated with an operation enters the risk engine through a dedicated adapter, separate from the core scoring logic — allowing the list of high-risk countries or regions to be updated without touching the rest of the engine.",
      },
      {
        title: "Asynchronous webhook notifications",
        content:
          "External systems can subscribe to events (e.g., \"report completed\" or \"SAR approved\") through configurable webhooks, instead of having to poll the API repeatedly waiting for a state change.",
      },
    ],
    features: [
      "Screening of addresses, transactions, and contracts across multiple blockchains",
      "Quantified risk score with factor-by-factor detail",
      "Risk history and timeline per entity",
      "PDF analysis report generation with integrity seal",
      "Suspicious Activity Report (SAR) flow with supervisor approval",
      "Multi-user admin dashboard",
      "API key management for external integrations",
      "Configurable webhooks for event notifications",
      "Usage dashboard and contracted plan limits",
      "Complete audit log of all actions",
    ],
    challenges: [
      {
        title: "Making the score fully explainable, without it being a black box",
        content:
          "Solved with a categorized risk factor (\"reason codes\") engine, each with its own weight and confidence level, instead of a single unjustified number — every result can be broken down and presented to an auditor.",
      },
      {
        title: "Guaranteeing an already-issued report can't be altered afterward",
        content:
          "Solved with a dedicated integrity service that validates the report's content after issuance, protecting documents that may end up used as formal evidence.",
      },
      {
        title: "Processing heavy analyses without blocking the user experience",
        content:
          "Solved by isolating heavy work (multi-chain analysis, PDF generation) in a background job queue, keeping the original HTTP request fast and the interface responsive.",
      },
    ],
    learnings: [
      "A risk engine designed to be explainable from the start completely changes the data design — it stops being \"calculate a number\" and becomes \"build a justifiable case\"",
      "Separating user authentication from API key authentication is essential as soon as a product needs to support automated external integrations",
      "A single-orchestrator pattern, through which everything must pass, is an effective way to guarantee regulatory flows never end up incomplete by accident",
      "Enforcing plan limits before expensive operations, not after, saves resources and avoids user frustration",
    ],
  },
  "boardgov-ao": {
    title: "BoardGov AO",
    tagline: "Multi-tenant corporate governance platform for Angolan boards of directors, with meetings, voting, and legally defensible minutes",
    overview:
      "BoardGov AO is a multi-tenant corporate governance platform built for boards of directors of Angolan organizations — banks, insurers, brokerages, and public companies subject to supervision by the BNA, the CMC, or other regulators. It digitizes the entire lifecycle of a board: meeting convocation with automatic quorum calculation, real-time voting and asynchronous circular resolutions, drafting and approval of minutes following the legal structure of Law 1/04, a confidential data room with dynamic watermarking, annual conflict-of-interest declarations, a conflicts registry, specialized committees, a searchable precedent library, audited emergency access, a temporary portal for external auditors, and an AI assistant that drafts minutes and summarizes documents. There's also a separate super-admin dashboard for managing all client organizations on the platform, users, per-module feature flags, and system health.",
    problem:
      "In Angola, board governance still happens mostly on paper and in loose files: notices sent by email with no formal record, minutes written after the meeting in Word, votes that no one can prove happened exactly as described, and conflict-of-interest declarations filed in a folder that's rarely reviewed. When a BNA inspection or an external audit arrives, reconstructing that history is slow and fragile. The challenge of this project was to build a platform where every act of governance — a vote, an approved minute, access to a confidential document — is recorded in a way that withstands scrutiny, without making the board's day-to-day more bureaucratic than it already is.",
    stack: [
      { label: "Frontend", items: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS 4", "Radix UI (dialog, tabs, tooltip, select)"] },
      { label: "Backend", items: ["NestJS 11", "TypeScript", "Passport + JWT (access/refresh)", "Speakeasy (2FA / TOTP)", "PDFKit for reports", "Winston (structured logging)", "@anthropic-ai/sdk (AI assistant)"] },
      { label: "Database", items: ["PostgreSQL", "Prisma ORM", "Native Postgres Row-Level Security for multi-tenant isolation", "Versioned migrations"] },
      { label: "Infrastructure", items: ["Docker + workspaces (api / web / database / shared)", "AWS S3 (documents)", "AWS SES (emails)", "Redis / ioredis (token blacklist, queues)", "Scheduler (@nestjs/schedule) for daily tasks"] },
    ],
    architecture: [
      {
        title: "Multi-tenant isolation reinforced at the database level, not just in the application",
        content:
          "Beyond the usual organizationId filter in the services, Postgres has Row-Level Security enabled on every sensitive table: at the start of each transaction the application sets SET LOCAL app.current_organisation_id, and an RLS policy automatically filters any SELECT, INSERT, or UPDATE based on that value — transparently to Prisma. This means that even if an application-layer bug forgets to filter by organization, the database still prevents cross-tenant access. There's an explicit bypass (app.bypass_rls) reserved only for migrations and seeds.",
      },
      {
        title: "An explicit state machine for a meeting's lifecycle",
        content:
          "A meeting can only transition between states (DRAFT → CONVENED → IN_PROGRESS → COMPLETED, or CANCELLED from DRAFT/CONVENED) through a map of valid transitions checked before any state change — any attempt to jump directly from draft to completed meeting is rejected. Quorum is calculated automatically the moment the meeting starts (achievedPercent against the quorumPercent defined by the organization or the meeting itself), and that percentage is recorded in the start event, not recalculated afterward.",
      },
      {
        title: "Votes with an integrity hash, immutable by design",
        content:
          "Every vote (ballot) generates a SHA-256 hash over the vote id, the member, the value voted, and the exact instant of the vote. Once submitted, a ballot cannot be altered or deleted, and a unique constraint in the database prevents the same member from voting twice on the same ballot. Once closed, a vote no longer accepts new ballots. Conflict-of-interest abstentions (CONFLICT_ABSTENTION) are recorded but excluded from the majority calculation — the result is always a simple comparison between votes for and against from members without a conflict.",
      },
      {
        title: "Minutes with a legal flow, and reused architecture for circular resolutions",
        content:
          "Minutes follow DRAFT → UNDER_REVIEW → APPROVED: in draft the Secretary edits freely, in review only they can make corrections while members read, and once approved at the next meeting the minute becomes immutable. The initial content is auto-generated with the structure required by Law 1/04 (attendance, agenda, resolutions). Circular resolutions — asynchronous votes outside an in-person meeting — don't have a separate module: they reuse the same Votes architecture with mode=ASYNC and a virtual meeting of type CIRCULAR_RESOLUTION, avoiding duplicating all the already-validated immutability logic.",
      },
      {
        title: "Two independent RBAC layers: role in the organization and role on the platform",
        content:
          "A user has a role within the board (PRESIDENT, BOARD_MEMBER, SECRETARY, GUEST, defined in BoardMemberRole) completely separate from their potential role as a platform administrator (AdminRole, used only in the multi-organization super-admin dashboard). Mixing these two dimensions was identified early as a source of authorization bugs — so they never share the same enum or the same guard, even when the same person holds both roles.",
      },
    ],
    backend: [
      {
        title: "Dynamic watermarking without touching the original file",
        content:
          "When viewing a confidential PDF, the backend downloads the file from the private S3 bucket, applies a watermark with the member's name and the exact date/time using pdf-lib, uploads the result to a temporary bucket, and returns a presigned URL valid for 15 minutes. The original document is never modified — every viewing generates its own watermarked copy, traceable to whoever requested it.",
      },
      {
        title: "Virtual Data Room (VDR) with granular permissions and an immutable log",
        content:
          "Especially confidential documents can live in an isolated VdrRoom, with permissions defined member by member (view / download / print) and automatic expiration. Every access — viewing, download, or print — is logged in a record that can't be edited, which turns the data room into a central piece of any subsequent audit.",
      },
      {
        title: "\"Never block in an emergency, always audit\"",
        content:
          "Emergency access is the only flow on the platform designed to have zero friction: only the President and Secretary can request it, but when they do, access is granted immediately, for a maximum of 8 hours. In exchange, every other President and Secretary is notified at that moment, and every action taken during that access — IP, user agent, documents opened — is recorded immutably, and can be flagged for investigation afterward.",
      },
      {
        title: "External auditor portal with a temporary session and immediate revocation",
        content:
          "The Secretary generates access for an external auditor (BNA, CMC, external reviewer), who receives a unique token (UUID v4 + HMAC) by email. On access, the auditor gets a JWT session valid for 4 hours, browses a read-only interface with automatic watermarking on any PDF, and every query is logged. The Secretary can revoke access at any time — the token is immediately invalidated through a Redis blacklist, without waiting for natural expiration.",
      },
      {
        title: "Compliance reports generated from the same governance data",
        content:
          "Instead of maintaining a separate export format per regulator, reports for BNA, CMC, ARSEG, or MINFIN share the same underlying data (board composition, meeting activity, resolutions, conflicts, audit log) and only differ in final formatting — which allows adding a new regulator without replicating business logic.",
      },
      {
        title: "AI assistant as a thin layer over the organization's real data",
        content:
          "The AI module integrates the Anthropic API for four concrete tasks — drafting minutes from the meeting's agenda and decisions, summarizing a document, detecting legal/financial risks in a document, and suggesting agenda items based on the organization's history. Every call logs the tokens consumed, for per-organization cost control.",
      },
    ],
    features: [
      "Meeting convocation with automatic quorum calculation",
      "Real-time voting and asynchronous circular resolutions",
      "Minutes with a legal draft/review/approval flow (Law 1/04)",
      "Virtual Data Room (VDR) with dynamic watermarking and access log",
      "Board of Directors: members, terms, roles, and specialized committees",
      "Annual conflict-of-interest declarations and a conflicts registry, aligned with BNA",
      "Precedent library with automatic indexing from approved minutes",
      "Audited emergency access for President and Secretary",
      "Temporary, revocable portal for external auditors",
      "Secure encrypted messaging between board members",
      "AI assistant for minutes, summaries, risk detection, and agenda suggestions",
      "Report export (PDF, CSV, JSON), including a BNA/Ministry report",
      "Multi-organization super-admin dashboard, with per-module feature flags",
      "Two-factor authentication (TOTP) and a complete audit log",
    ],
    challenges: [
      {
        title: "Guaranteeing isolation between organizations even in the face of a programming error",
        content:
          "Solved with Row-Level Security directly in Postgres, as a second line of defense after the application-level filter — the database never returns another organization's data, regardless of a service forgetting to filter by organizationId.",
      },
      {
        title: "Making sure a vote or approved minute can never be questioned as tampered with",
        content:
          "Solved with a per-vote integrity hash, a uniqueness constraint against duplicate votes, closed ballots that reject new votes, and minutes that become immutable as soon as they're approved — every piece designed to hold up as evidence before a regulator.",
      },
      {
        title: "Supporting emergency access without opening a security hole or stalling a real crisis",
        content:
          "Solved by inverting the usual logic: instead of blocking and requiring approval, access is granted immediately to restricted roles (President/Secretary), with a short time limit, instant notification to all responsible parties, and an immutable record of everything accessed during the emergency window.",
      },
    ],
    learnings: [
      "Database-level Row-Level Security is a safety net that survives future bugs in the application layer — it's worth it even when the application-level filter already exists",
      "Reusing an already-validated architecture (Votes) for a new use case (circular resolutions) is safer than building a parallel module with its own immutability logic",
      "Fully separating someone's role in the organization from their role on the platform avoids an entire class of authorization bugs that only appear when the same person holds both",
      "Designing for regulatory compliance from the start (Law 1/04, BNA reports) saves significant rework when it's time to generate those reports, because the data is already born in the right shape",
    ],
  },
  pizzaria: {
    title: "PizzaExpress",
    tagline: "Order management system for a pizzeria, from the table to the kitchen to checkout",
    overview:
      "A management system for pizzerias and restaurants covering the full order lifecycle: the customer builds an order at a table, the kitchen receives it on a real-time panel organized by preparation status, and the admin tracks tables, users, products, and revenue from a dedicated dashboard. It was built to replace a small restaurant's paper order pad with a digital flow, without losing the simplicity a busy kitchen needs.",
    problem:
      "In a small restaurant, the biggest risk isn't a lack of technology — it's an order that gets lost between the table and the kitchen, or a bill closed with the wrong amount. The challenge was to build a system where an order is never \"orphaned\": it's born as a draft tied to a table, moves through well-defined states until it's delivered, and only counts toward the day's revenue once it's finalized — with an admin dashboard that gives the owner full visibility over active tables, orders in progress, and billing, without relying on paper.",
    stack: [
      { label: "Frontend", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Polling-based updates for the kitchen panel"] },
      { label: "Backend", items: ["Node.js + Express + TypeScript", "JWT (jsonwebtoken) for authentication", "bcrypt for password hashing", "Multer for product image uploads"] },
      { label: "Database", items: ["MongoDB + Mongoose", "Models: User, Table, Product, Category, Order"] },
      { label: "Infrastructure", items: ["Separate REST API (Node backend)", "Frontend and backend in separate repositories"] },
    ],
    architecture: [
      {
        title: "An order is born as a draft, never as a done deal",
        content:
          "Every Order has a draft flag and a status (draft → preparing → ready → delivered → finalized). While it's a draft, the order belongs only to the customer building it and can be freely edited; as soon as it leaves draft state, a Mongoose pre-save hook automatically advances the status to \"preparing\", closing the door on an order that's marked as sent to the kitchen but is still editable.",
      },
      {
        title: "The order total is always calculated server-side, never trusted from the client",
        content:
          "Each item's price comes from the Product at the moment the order is created, and a Mongoose middleware recalculates each line's subtotal and the order total every time the document is saved — the frontend never sends a total, only quantities and products. This eliminates an entire class of bugs (and tampering attempts) where the amount shown to the customer diverges from what's actually charged.",
      },
      {
        title: "A table as an order aggregator, not a single order",
        content:
          "A Table stores a list of references to Order documents instead of a single order, because in practice a table rarely places just one order — a drink first, then food, then dessert. The \"Bill\" screen sums all of that table's active orders in real time, and only once payment is confirmed do those orders move to finalized and the table is freed up.",
      },
    ],
    backend: [
      {
        title: "REST API in Node.js + Express",
        content:
          "The API exposes routes per resource — /api/products, /api/categories, /api/orders, /api/tables, /api/users, /api/admin/* — each protected by JWT authentication middleware and role checks (user vs admin) where needed. Admin routes live isolated from regular order routes, so an authorization failure in one panel can never expose sensitive operations in the other.",
      },
      {
        title: "Admin dashboard: revenue, users, and history cleanup",
        content:
          "The AdminController calculates revenue only from orders with a finalized status, grouped by product category and by period (daily/monthly), never from orders still in progress. The cleanup operation only deletes finalized orders — active, in-preparation, or draft orders are always left untouched — and returns an exact count of what was removed before the action is confirmed.",
      },
      {
        title: "Table management and the order lifecycle",
        content:
          "The TableController ensures a table number is unique across the system and keeps the list of active orders tied to each table. An order's status flow (draft → preparing → ready → delivered → finalized) is validated at every transition in the orderController, so the kitchen can never mark as \"ready\" an order that's still a draft on the customer's side.",
      },
    ],
    features: [
      "Menu organized by category with real-time product availability",
      "Per-table ordering with an editable draft before sending to the kitchen",
      "Kitchen panel with orders organized by status (in preparation / ready for delivery)",
      "Table management with a consolidated bill and payment close-out",
      "Admin dashboard with users, products, orders, and tables",
      "Sales reports by period and category, with average ticket size",
      "Controlled history cleanup, restricted to already-finalized orders",
    ],
    challenges: [
      {
        title: "Preventing an order from \"disappearing\" between the table and the kitchen",
        content:
          "Solved by modeling the order as an explicit state machine instead of a simple \"sent/not sent\" boolean — every transition is recorded on the document itself, and both the kitchen panel and the customer panel always read the same status from the same source of truth.",
      },
      {
        title: "Making sure closing a table's bill never loses or duplicates an order",
        content:
          "Solved by making the Table hold only references to orders, never a copy of their values — the bill is always recalculated from the real orders at the moment it's requested, instead of keeping a \"cached\" total on the table itself that could drift from reality.",
      },
    ],
    learnings: [
      "Modeling the order as a state machine from the start avoids having to \"patch\" transition rules later, once real data already exists in production",
      "Never trust any monetary value coming from the client — always recalculate server-side, even for simple internal operations like a table order",
    ],
  },
};

export default en;
