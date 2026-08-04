import type { ProjectTranslationDict } from "./types";

const de: ProjectTranslationDict = {
  ecommerce: {
    title: "E-Commerce",
    tagline: "Vollständige E-Commerce-Plattform, vom Katalog bis zur Kasse",
    overview:
      "Ein kompletter Online-Shop, gebaut, um den realen Betrieb eines kleinen/mittleren Händlers zu simulieren: ein nach Kategorien organisierter Produktkatalog, ein persistenter Warenkorb, ein Checkout mit Bestellübersicht und eine von Anfang an für ein Admin-Panel zur Verwaltung von Produkten und Bestellungen ausgelegte Grundlage. Ziel war es, dasselbe Rückgrat zu bauen, das Shops wie Shopify oder WooCommerce antreibt, aber von Hand gebaut, um genau zu verstehen, was hinter jedem Klick auf „In den Warenkorb“ passiert.",
    problem:
      "Händler, die online verkaufen wollen, stehen vor zwei Extremen: teure, unflexible SaaS-Lösungen (Shopify, Nuvemshop) oder vollständig maßgeschneiderte Lösungen, die teuer zu warten sind. Die Herausforderung bestand darin, eine leichtgewichtige, plattformunabhängige Open-Source-E-Commerce-Grundlage zu bauen, die jedes Unternehmen klonen und an seinen Katalog anpassen könnte, mit voller Kontrolle über das Datenmodell, den Zahlungsfluss und das Einkaufserlebnis.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Context API / Zustand für den Warenkorb"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT zur Authentifizierung", "Multer / Cloudinary für Bilder"] },
      { label: "Datenbank", items: ["MongoDB", "Mongoose (ODM)"] },
      { label: "Infrastruktur", items: ["Vercel (Frontend)", "Render / Railway (API)", "Stripe / Multicaixa Express (Zahlungen)"] },
    ],
    architecture: [
      {
        title: "Next.js als Präsentationsschicht, eine separate API als Quelle der Wahrheit",
        content:
          "Ich habe mich entschieden, das Frontend vollständig vom Backend zu entkoppeln, statt nur Next.js API Routes zu nutzen. Die Katalog- und Produktseiten verwenden Server Components mit Build-Zeit-/Revalidate-Abruf (ISR), um fertiges HTML an Suchmaschinen auszuliefern — essenziell für einen E-Commerce-Shop, bei dem SEO die wichtigste Quelle für organischen Traffic ist —, während Warenkorb, Checkout und Kontobereich Client Components verwenden, die direkt über REST mit der Node/Express-API kommunizieren. Diese Trennung bedeutet auch, dass dieselbe API künftig ohne Änderungen eine mobile App antreiben könnte.",
      },
      {
        title: "Domänengetriebene Datenmodellierung",
        content:
          "Statt eines einzigen generischen „Produkt“-Dokuments trennt das Schema Product, Category und Variant (Größe/Farbe mit eigenem Lagerbestand und Preis), sodass ein Produkt mehrere Varianten haben kann, ohne Marketinginformationen (Beschreibung, Bilder, SEO) zu duplizieren. Bestellungen speichern einen Schnappschuss von Preis und Name des Produkts zum Kaufzeitpunkt — eine kritische E-Commerce-Architekturentscheidung, denn der Verlauf einer Bestellung darf sich nie ändern, wenn der Händler später den Preis eines Produkts aktualisiert.",
      },
      {
        title: "Persistenter Warenkorb und State-Hydration",
        content:
          "Der Warenkorb wird für anonyme Nutzer im localStorage gespeichert und mit dem Konto synchronisiert, sobald sich der Nutzer anmeldet, wobei beide Warenkörbe zusammengeführt statt einer vom anderen überschrieben werden. Das vermeidet das klassische Problem schlecht gebauter E-Commerce-Shops: Der Kunde fügt Produkte hinzu, meldet sich an, und der Warenkorb „verschwindet“.",
      },
    ],
    backend: [
      {
        title: "REST-API in Node.js + Express",
        content:
          "Die API stellt vorhersehbare, versionierte Ressourcen bereit: /api/products, /api/categories, /api/cart, /api/orders, /api/auth, /api/admin/*. Jede Route durchläuft eine Middleware-Kette: Payload-Validierung (Zod/Joi), JWT-Authentifizierung bei Bedarf, Rollenprüfung (Kunde vs. Admin) und einen zentralen Error-Handler, der Mongoose-Fehler in konsistente HTTP-Antworten (400, 401, 403, 404, 409, 500) übersetzt, statt Stack Traces an den Client weiterzugeben.",
      },
      {
        title: "Zustandsautomat der Bestellung",
        content:
          "Eine Bestellung durchläuft klar definierte Zustände — pending → paid → processing → shipped → delivered / cancelled —, und jeder Übergang wird serverseitig validiert, ohne jemals dem vom Client gesendeten Wert zu vertrauen. Die Zahlungsbestätigung kommt über ein Webhook des Zahlungsanbieters (Signatur mit dem Secret des Anbieters geprüft), was den häufigen Fehler vermeidet, eine Bestellung als bezahlt zu markieren, nur weil der Browser des Kunden auf eine Erfolgsseite umgeleitet wurde.",
      },
      {
        title: "Bestandskonsistenz bei Nebenläufigkeit",
        content:
          "Wenn zwei Personen gleichzeitig versuchen, die letzte Einheit eines Produkts zu kaufen, erzeugt ein einfaches „Bestand lesen, abziehen, speichern“ eine Race Condition. Die Bestandsreservierung nutzt ein einziges atomares findOneAndUpdate von MongoDB mit der Bedingung Bestand ≥ angefragte Menge — schlägt die Bedingung fehl, wird die Operation sofort abgelehnt und der Kunde erhält „nicht vorrätig“, was garantiert, dass der Bestand selbst bei gleichzeitigem Traffic nie negativ wird.",
      },
    ],
    features: [
      "Katalog mit Kategorien, Suche und Filtern",
      "Produktseite mit Varianten (Größe/Farbe) und Bildergalerie",
      "Über Sitzungen hinweg persistenter Warenkorb",
      "Checkout mit Bestellübersicht und Versandberechnung",
      "Kundenauthentifizierung und Bereich „Meine Bestellungen“",
      "Admin-Panel für Produkt-/Kategorie-CRUD und Bestellverwaltung",
    ],
    challenges: [
      {
        title: "Überverkauf von Produkten mit begrenztem Bestand vermeiden",
        content:
          "Gelöst mit atomaren Operationen in MongoDB (bedingtes findOneAndUpdate) statt eines zweistufigen Prüfen-dann-Schreiben-Musters, wodurch das Zeitfenster eliminiert wird, in dem zwei Anfragen denselben verfügbaren Bestand „sehen“ könnten.",
      },
      {
        title: "Bestellverlauf treu zum Kaufzeitpunkt halten",
        content:
          "Gelöst durch Speicherung eines unveränderlichen Schnappschusses der Produktdaten auf jeder Bestellzeile, statt nur einer Referenz (ID) zum Produkt — sodass zukünftige Preis- oder Namensänderungen vergangene Bestellungen nie verfälschen.",
      },
    ],
    learnings: [
      "Klar trennen, was eine Server Component sein sollte (SEO, öffentliche Daten) und was eine Client Component (Interaktivität, Nutzerzustand)",
      "Die Bedeutung, dem vom Client gesendeten Preis/Zustand nie zu vertrauen — der Server ist immer die Quelle der Wahrheit",
    ],
  },

  orbital: {
    title: "Projekt Orbita",
    tagline: "Online-Technikshop mit eigener visueller Identität",
    overview:
      "Orbita ist die zweite E-Commerce-Plattform im Portfolio, gebaut auf demselben Stack wie das vorherige Projekt (Next.js, Node.js, MongoDB), aber mit einem anderen Zweck: Statt das Design wiederzuverwenden, diente dieses Projekt dazu, eine eigenständige visuelle Identität und ein eigenes Navigationserlebnis zu erkunden — ein Technikshop mit dunklem Theme, mutigerer Typografie und starker Betonung der Produktbilder — und zu validieren, dass dieselbe Backend-Grundlage Shops mit völlig unterschiedlichen „Marken“ antreiben kann.",
    problem:
      "Nach dem Bau eines generischen E-Commerce-Shops ging es darum, eine sehr häufige Frage aus der realen Agenturwelt zu beantworten: Wie nutzt man eine bereits getestete API und Geschäftslogik wieder, um einen zweiten Shop mit eigener visueller Identität zu starten, ohne die Backend-Arbeit zu duplizieren? Orbita entstand als diese Übung in Frontend-Wiederverwendung und -Spezialisierung.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion für Mikro-Interaktionen"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT", "Mit dem E-Commerce-Projekt geteilte Service-Architektur"] },
      { label: "Datenbank", items: ["MongoDB", "Mongoose"] },
      { label: "Infrastruktur", items: ["Vercel", "Render / Railway"] },
    ],
    architecture: [
      {
        title: "Backend als wiederverwendbarer Service, Frontend als „Theme“",
        content:
          "Die Domänenschicht (Produkte, Warenkorb, Bestellungen, Authentifizierung) wurde als von der Präsentation unabhängiger Service konzipiert. Orbitas Frontend konsumiert dieselben API-Verträge wie das E-Commerce-Projekt, jedoch mit völlig anderen UI-Komponenten, Farbpalette und Texten — was in der Praxis beweist, dass die Frontend/Backend-Trennung keine reine Theorie ist, sondern das ist, was es ermöglicht, einen zweiten Shop in deutlich kürzerer Zeit als den ersten zu starten.",
      },
      {
        title: "Ein eigenes Design-System auf derselben technischen Grundlage",
        content:
          "Eine neue Schicht visueller Komponenten (Produktkarten, Hero-Bereich, Navigation) wurde mit Tailwind und eigenen Farb- und Abstands-Tokens gebaut, während dieselben Daten-Hooks (useProducts, useCart) aus dem vorherigen Projekt beibehalten wurden — was die Entwicklungszeit für den funktionalen Teil drastisch reduzierte und es ermöglichte, den Aufwand auf das visuelle Erlebnis zu konzentrieren.",
      },
    ],
    backend: [
      {
        title: "Gleiche API-Prinzipien wie im E-Commerce-Projekt",
        content:
          "Orbita folgt derselben REST-API-Philosophie in Node.js/Express mit MongoDB: versionierte Routen, JWT-Authentifizierung und derselbe Bestell-Zustandsautomat (pending → paid → shipped → delivered). Dieses Projekt unterscheidet sich durch seine Multi-Tenant-Konfiguration: Das Produktschema enthält ein Feld storeId, wodurch dieselbe Datenbank mehreren Shops mit isolierten Katalogen dienen kann — die Grundlage, um dies eventuell in eine „E-Commerce-as-a-Service“-Plattform zu verwandeln.",
      },
      {
        title: "Vorbereitet für mehrere Shops auf derselben Infrastruktur",
        content:
          "Jede API-Anfrage erhält die storeId über einen Header oder eine Subdomain, und alle Lese-/Schreibfilter in Mongoose enthalten diese Bedingung automatisch über eine Query-Middleware — wodurch verhindert wird, dass ein Shop versehentlich die Daten eines anderen sieht oder ändert.",
      },
    ],
    features: [
      "Technikprodukt-Katalog mit starker visueller Betonung",
      "Warenkorb und Checkout mit gemeinsamer Logik zum E-Commerce-Projekt",
      "Eigene visuelle Identität und Navigation",
      "Für Multi-Shop vorbereitete Architektur (storeId pro Katalog)",
    ],
    challenges: [
      {
        title: "Logik wiederverwenden, ohne die beiden Projekte visuell zu koppeln",
        content:
          "Gelöst durch Isolierung der gesamten Datenlogik in Hooks und Services unabhängig vom Styling, sodass derselbe useCart-Hook zwei völlig unterschiedliche Oberflächen antreiben kann, ohne Geschäftsregeln zu duplizieren.",
      },
    ],
    learnings: [
      "Wie man eine API von Anfang an „wiederverwendbar“ gestaltet, statt sie später zu refaktorieren",
      "Der Unterschied zwischen visueller Kopplung und Datenkopplung in einem Fullstack-System",
    ],
  },

  "gestao-financeira": {
    title: "System zur persönlichen Finanzverwaltung",
    tagline: "Verfolgung persönlicher Finanzen mit visuellen Berichten",
    overview:
      "Eine Anwendung zur Verfolgung persönlicher Finanzen mit einem Dashboard, das Saldo, Einnahmen und Ausgaben des Monats zusammenfasst, einer Liste kategorisierter Transaktionen und Diagrammen, die sichtbar machen, wohin das Geld fließt. Ziel war es, über eine Tabellenkalkulation hinauszugehen: dem Nutzer eine sofortige Übersicht über seine finanzielle Gesundheit zu geben, mit derselben Datendisziplin, die ein echtes Buchhaltungssystem erfordert.",
    problem:
      "Den meisten Menschen fehlen nicht die Finanzdaten — ihnen fehlt die Übersicht darüber. Dieses Projekt löst das Problem „wohin geht mein Geld“, indem es verstreute Einträge (Einnahmen, Ausgaben, Kategorien) in einem einzigen Dashboard aggregiert, mit Berichten, die konkrete Fragen beantworten: Wie viel habe ich diesen Monat für Essen ausgegeben? Wächst oder schrumpft mein Saldo?",
    stack: [
      { label: "Frontend", items: ["React", "React Router", "Context API / Redux für den globalen Zustand", "Chart.js / Recharts für Diagramme"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT zur Authentifizierung", "Validierung mit Zod/Joi"] },
      { label: "Datenbank", items: ["PostgreSQL", "Sequelize / Prisma (ORM)"] },
      { label: "Infrastruktur", items: ["Vercel (Frontend)", "Render (API + Datenbank)"] },
    ],
    architecture: [
      {
        title: "Relationale Datenbank für finanzielle Integrität",
        content:
          "Anders als bei einem Produktkatalog erfordern Finanzdaten starke Konsistenz: Eine Transaktion darf nie „verschwinden“ oder in einem Zwischenzustand landen. Deshalb wurde eine relationale Datenbank (PostgreSQL) statt NoSQL gewählt — das Schema hat normalisierte Tabellen für Users, Categories und Transactions, mit Fremdschlüsseln und SQL-Transaktionen (BEGIN/COMMIT/ROLLBACK), die garantieren, dass eine zusammengesetzte Operation (z. B. das Erstellen einer Transaktion und die Aktualisierung des aggregierten Saldos) nie teilweise angewendet bleibt.",
      },
      {
        title: "Trennung zwischen Rohdaten und aggregierten Daten",
        content:
          "Das Dashboard berechnet nicht bei jedem Render alles im Frontend neu. Monatliche Aggregationen (Gesamteinnahmen, Gesamtausgaben, Saldo, Verteilung nach Kategorie) werden im Backend über aggregierende SQL-Abfragen (GROUP BY Monat/Kategorie) berechnet und liefern dem Frontend nur bereits diagrammfertige Zahlen — was das übertragene Datenvolumen und die im Browser durchgeführte Verarbeitung drastisch reduziert.",
      },
      {
        title: "Kategorisierung als eigenständige Entität",
        content:
          "Ausgaben-/Einnahmenkategorien werden vom Nutzer selbst verwaltet (kein festes Enum), mit einer Standardkategorie „Sonstiges“. Das war eine bewusste Entscheidung: Ein System für persönliche Finanzen ist nur nützlich, wenn es sich an das Leben desjenigen anpasst, der es benutzt, nicht an das, was der Entwickler für sinnvoll hielt.",
      },
    ],
    backend: [
      {
        title: "Berichtsorientierte Node.js + Express API",
        content:
          "Neben den üblichen CRUD-Endpunkten (/api/transactions, /api/categories) stellt die API dedizierte Berichts-Endpunkte wie /api/reports/monthly und /api/reports/by-category bereit, die Aggregationen direkt in der Datenbank ausführen, statt alle Transaktionen zurückzugeben, damit der Client sie summiert — ein wichtiges Performance-Prinzip: Aggregationen gehören in die Datenbank, nicht ins Frontend.",
      },
      {
        title: "Authentifizierung und Datenisolierung pro Nutzer",
        content:
          "Jede Transaktion gehört genau einem Nutzer, und jede Backend-Abfrage filtert zwingend nach der aus dem JWT-Token extrahierten userId — niemals aus dem Request-Body —, wodurch verhindert wird, dass ein Nutzer versehentlich auf die Transaktionen einer anderen Person zugreift, selbst durch einen Frontend-Fehler.",
      },
      {
        title: "Strenge Validierung von Geldbeträgen",
        content:
          "Geldbeträge werden als Ganzzahlen (Cent) statt als Fließkommazahlen validiert und gespeichert, wodurch die klassischen Rundungsfehler bei Geld in JavaScript (0.1 + 0.2 !== 0.3) vermieden werden; die Umrechnung ins Dezimalformat erfolgt erst in der Präsentationsschicht.",
      },
    ],
    features: [
      "Dashboard mit monatlichem Saldo, Einnahmen und Ausgaben",
      "Transaktionserfassung mit anpassbaren Kategorien",
      "Diagramme zur monatlichen Entwicklung und Kategorieverteilung",
      "Filter nach Zeitraum und Kategorie",
      "Authentifizierung und pro Nutzer isolierte Daten",
    ],
    challenges: [
      {
        title: "Rundungsfehler bei Geldbeträgen vermeiden",
        content:
          "Gelöst durch Speicherung aller Werte als ganzzahlige Cent-Beträge in der Datenbank und Umrechnung ins Dezimalformat (z. B. 1050 → 10,50 Kz) erst bei der Präsentation an den Nutzer.",
      },
      {
        title: "Schnelles Dashboard auch bei vielen Transaktionen",
        content:
          "Gelöst durch Verlagerung der Aggregationen (Summen, Durchschnitte, Gruppierungen) in Backend-SQL-Abfragen, statt sie für jede geladene Transaktion in JavaScript im Frontend zu berechnen.",
      },
    ],
    learnings: [
      "Wann man eine relationale Datenbank statt NoSQL wählt — Integrität und Transaktionen zählen mehr als Schema-Flexibilität",
      "Geld als Ganzzahlen behandeln, niemals als Fließkommazahlen",
    ],
  },

  "gestao-stock": {
    title: "Bestandsverwaltung",
    tagline: "Lagerkontrolle mit auditierbarem Bewegungsverlauf",
    overview:
      "Ein vollständiges Lager-/Bestandsverwaltungssystem, konzipiert für kleine und mittlere Unternehmen, die jederzeit wissen müssen, wie viel sie von jedem Produkt haben, wer es bewegt hat und warum. Es deckt den gesamten Zyklus ab: Wareneingänge, Verkaufsausgänge, Bestandsanpassungen, Lieferanten und Mindestbestandswarnungen.",
    problem:
      "Viele KMU kontrollieren ihren Bestand noch immer in gemeinsam genutzten Excel-Tabellen, wo der Verlauf von „wer hat was geändert“ leicht verloren geht und Diskrepanzen zwischen „Papier“-Bestand und tatsächlichem Lagerbestand häufig sind. Ziel war es, ein System zu bauen, in dem jede Bestandsänderung als auditierbare Bewegung erfasst wird, nie als stille Aktualisierung einer einfachen Zahl.",
    stack: [
      { label: "Frontend", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "TanStack Table für Listen"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT + Rollen (Admin/Operator)", "Validierung mit Zod"] },
      { label: "Datenbank", items: ["MySQL", "Sequelize / Prisma (ORM)", "SQL-Transaktionen für Bewegungen"] },
      { label: "Infrastruktur", items: ["Vercel (Frontend)", "Railway / VPS (API + MySQL)"] },
    ],
    architecture: [
      {
        title: "Kardex: Bestand als Ergebnis von Bewegungen, nie eine editierbare Zahl",
        content:
          "Die wichtigste architektonische Entscheidung dieses Projekts: Das Feld „aktueller Bestand“ eines Produkts wird nie direkt bearbeitet. Stattdessen gibt es eine Tabelle stock_movements (Eingang, Ausgang, Anpassung, Rückgabe), und der aktuelle Bestand ist immer die Summe aller Bewegungen dieses Produkts — dasselbe Prinzip, das in Buchhaltungssystemen (Kontenbuch / Kardex) verwendet wird. Das bedeutet, man kann immer „warum hat dieses Produkt 12 Einheiten“ mit einer vollständigen, chronologischen Liste von Ereignissen beantworten, nie mit einer unerklärten Zahl.",
      },
      {
        title: "MySQL und ACID-Transaktionen für die Konsistenz des Inventars",
        content:
          "MySQL wurde einer NoSQL-Datenbank vorgezogen, gerade wegen des Bedarfs an ACID-Transaktionen: Das Erfassen eines Bestandsausgangs erfordert in derselben Transaktion das Einfügen der Bewegung und die Überprüfung, dass der resultierende Bestand nicht negativ ist — und wenn ein Schritt fehlschlägt, wird die gesamte Transaktion zurückgerollt, ohne das Inventar jemals in einem inkonsistenten Zustand zu belassen.",
      },
      {
        title: "Differenzierte Rollen: Operator vs. Administrator",
        content:
          "Lageroperatoren können Ein-/Ausgänge erfassen, aber weder den Verlauf löschen noch Selbstkostenpreise ändern; nur Administratoren haben Zugang zu Finanzberichten und Lieferantenverwaltung — was die Verantwortungstrennung widerspiegelt, die in einem echten Unternehmen existiert.",
      },
    ],
    backend: [
      {
        title: "Nach Domäne strukturierte Node.js + Express API",
        content:
          "Endpunkte organisiert nach Geschäftsressource: /api/products, /api/suppliers, /api/movements, /api/reports/low-stock. Jede Schreibroute für movements läuft innerhalb einer expliziten MySQL-Transaktion, und der Mindestbestandsschwellenwert pro Produkt löst eine über /api/reports/low-stock abfragbare Warnung aus, die vom Frontend genutzt wird, um nachzubestellende Produkte hervorzuheben.",
      },
      {
        title: "Berichte zum Inventarwert",
        content:
          "Das Backend berechnet den Gesamtwert des Inventars (Menge × gewichteter Durchschnittskostenpreis) über aggregierte SQL-Abfragen, nicht in JavaScript — eine Entscheidung sowohl für Performance als auch Korrektheit, da der gewichtete Durchschnittskostenpreis bei jedem Bestandseingang mit einem anderen Preis als dem vorherigen neu berechnet werden muss.",
      },
    ],
    features: [
      "Erfassung von Bestandseingängen, -ausgängen und -anpassungen",
      "Vollständiger, auditierbarer Verlauf pro Produkt (Kardex)",
      "Lieferanten- und Kostenverwaltung",
      "Mindestbestandswarnungen",
      "Berichte zum Inventarwert",
      "Zugriffsrollen: Operator und Administrator",
    ],
    challenges: [
      {
        title: "Garantieren, dass der Bestand bei nebenläufigen Operationen nie negativ wird",
        content:
          "Gelöst mit expliziten SQL-Transaktionen: Die Prüfung des verfügbaren Bestands und das Einfügen der Ausgangsbewegung erfolgen innerhalb desselben BEGIN/COMMIT, mit Zeilensperrung (SELECT ... FOR UPDATE) auf dem Produkt während der Operation.",
      },
      {
        title: "Bestandsabweichungen erklären",
        content:
          "Gelöst, indem der Bestand ein aus dem Bewegungsverlauf abgeleiteter Wert ist, statt eines direkt editierbaren Feldes — jede Abweichung ist immer bis zu einer bestimmten Bewegung mit Nutzer und Zeitstempel nachverfolgbar.",
      },
    ],
    learnings: [
      "Das Kardex-/Kontenbuch-Muster gilt weit über die Buchhaltung hinaus — jedes System einer „sich über die Zeit ändernden Menge“ profitiert davon",
      "Wann man Zeilensperrung nutzt, um nebenläufige Operationen in einer relationalen Datenbank zu schützen",
    ],
  },

  "landing-page": {
    title: "Landing Page",
    tagline: "Hochperformante Conversion-Seite, ohne Backend",
    overview:
      "Eine Conversion-Landingpage im Stil von Verkaufstrichtern für digitale Produkte (z. B. Hotmart): eine starke Überschrift above the fold, Nutzenblöcke, Social Proof und ein strategisch über die ganze Seite wiederholter Call-to-Action. Dieses Projekt wurde bewusst ohne eigenes Backend gebaut — der Fokus lag zu 100 % auf Ladeperformance und konversionsorientiertem Copywriting, nicht auf Serverlogik.",
    problem:
      "Eine Verkaufs-Landingpage lebt oder stirbt mit der Ladegeschwindigkeit und der Klarheit der Botschaft in den ersten Sekunden. Ziel war es, eine Seite zu bauen, die fast sofort lädt (Core Web Vitals im grünen Bereich) und den Besucher visuell, ohne Ablenkungen, bis zum Kaufbutton führt — ohne jede Serverabhängigkeit, die Latenz einführen könnte.",
    stack: [
      { label: "Frontend", items: ["React", "Vite", "CSS Modules / Tailwind CSS", "Framer Motion für Scroll-Reveals"] },
      { label: "Integrationen", items: ["Formular verbunden mit einem externen Webhook (Hotmart / Checkout-Plattform)", "Google Analytics / Meta Pixel für Conversion-Tracking"] },
      { label: "Infrastruktur", items: ["Vercel (statisches Hosting)"] },
    ],
    architecture: [
      {
        title: "Eine vollständig statische Seite, ohne eigenen Server — aus Wahl, nicht aus Einschränkung",
        content:
          "Anders als die übrigen Projekte in diesem Portfolio hat diese Seite kein (und braucht kein) Backend: Sie wird als statisches HTML/CSS/JS über das CDN von Vercel ausgeliefert, was nahezu sofortige Antwortzeiten überall auf der Welt bedeutet. Der gesamte Kaufprozess wird an eine externe Checkout-Plattform delegiert (der reale Standard im Markt für digitale Produkte), und die Seite führt den Besucher einfach dorthin.",
      },
      {
        title: "Sektionsstruktur, gedacht als Trichter, nicht als Website",
        content:
          "Jede Sektion der Seite hat ein einziges überzeugendes Ziel — Aufmerksamkeit erregen, Verlangen wecken, Einwände beseitigen, Dringlichkeit erzeugen — in der klassischen Reihenfolge eines Verkaufstrichters (AIDA). Die React-Komponenten sind bewusst „dumm“ (ohne Geschäftslogik), denn die eigentliche Ingenieursarbeit liegt hier in Performance und Copywriting, nicht in der Datenarchitektur.",
      },
    ],
    backend: [],
    features: [
      "Hero mit klarem Wertversprechen above the fold",
      "Nutzen- und Social-Proof-Sektionen",
      "Strategisch wiederholte Calls-to-Action (CTAs)",
      "Scroll-getriggerte Eingangsanimationen",
      "Optimiert für Core Web Vitals (LCP, CLS, INP)",
    ],
    challenges: [
      {
        title: "Ladegeschwindigkeit maximieren, ohne Animation zu opfern",
        content:
          "Gelöst durch optimierte Bilder und Lazy Loading außerhalb des initialen Folds, sowie Beschränkung schwerer Animationen (Framer Motion) auf Elemente, die in den Viewport eintreten, wodurch Rendering-Kosten vermieden werden, bevor sie gesehen werden.",
      },
    ],
    learnings: [
      "Nicht jedes Projekt braucht ein Backend — manchmal ist die beste Architektur die einfachste, die das Problem löst",
      "Die wahrgenommene Performance einer Verkaufs-Landingpage wirkt sich direkt auf die Conversion-Rate aus",
    ],
  },
  argpack: {
    title: "ArgPack",
    tagline: "Marktplatz, der argentinische Produzenten mit Affiliates verbindet, die ihre Produkte in Brasilien verkaufen",
    overview:
      "Ein Mikro-Export-Marktplatz, der kleine argentinische Produzenten (Wein, Lebensmittel, Kunsthandwerk, Leder) mit brasilianischen Affiliates verbindet, die diese Produkte über ihren eigenen Empfehlungslink bewerben und verkaufen und dabei eine Provision auf jeden bestätigten Verkauf verdienen. Die Plattform hat drei Profile: den Produzenten, der seinen Katalog und Verkäufe verwaltet; den Affiliate, der Produktlinks generiert und seine Einnahmen und Provisionsstufe verfolgt; und den Administrator, der den gesamten Betrieb überwacht.",
    problem:
      "Ein kleiner argentinischer Produzent hat selten ein eigenes Vertriebsteam oder eigenes digitales Marketing, um den brasilianischen Markt zu erreichen, und ein Affiliate, der physische Nischenprodukte bewerben möchte, hat keine einfache Möglichkeit, nachverfolgbare Links zu generieren und transparent dafür bezahlt zu werden. ArgPack löst beide Seiten gleichzeitig: Es gibt dem Produzenten einen Katalog und ein Schaufenster und dem Affiliate ein Empfehlungssystem mit automatischer Provision.",
    stack: [
      { label: "Frontend", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Context API (Warenkorb, Wunschliste, Authentifizierung)"] },
      { label: "Backend", items: ["Node.js + Express + TypeScript", "JWT (jsonwebtoken) zur Authentifizierung", "Zod zur Payload-Validierung", "Helmet + CORS + Morgan"] },
      { label: "Datenbank", items: ["MongoDB + Mongoose", "Modelle: User, Producer, Affiliate, Product, Sale, Order"] },
      { label: "Infrastruktur", items: ["Vercel (Frontend)", "Separate REST-API (Node-Backend)"] },
    ],
    architecture: [
      {
        title: "Drei Rollen, ein einziges Nutzermodell",
        content:
          "Es gibt eine einzige User-Collection mit einem Feld userType (affiliate | producer | admin), und jede Rolle hat dann ihr eigenes Profildokument (Producer oder Affiliate), verknüpft über userId. Das vermeidet die Duplizierung der Authentifizierungslogik für jeden Kontotyp und hält das JWT generisch — die Autorisierungs-Middleware entscheidet aus einem einzigen Feld, was jede Rolle sehen darf.",
      },
      {
        title: "Affiliate-Provision serverseitig berechnet, nie dem Client anvertraut",
        content:
          "Jeder Affiliate hat einen eindeutigen referralCode und eine Stufe (Bronze 5 %, Silber 10 % ab 10+ Verkäufen/Monat, Gold 15 % ab 50+ Verkäufen/Monat). Wenn ein Verkauf mit einem Empfehlungscode erfasst wird, ermittelt das Backend den Affiliate, dem der Code gehört, berechnet die Provision aus der Stufentabelle (nie aus einem vom Client gesendeten Wert) und berechnet die Stufe des Affiliates bei jedem bestätigten Verkauf neu.",
      },
      {
        title: "Sale als Datensatz pro Produktzeile, Order als vollständige Bestellung",
        content:
          "Ein Checkout kann mehrere Produkte von mehreren verschiedenen Produzenten enthalten. Statt alles in Order zu speichern, erzeugt jede Produktzeile ihr eigenes Sale-Dokument (mit der producerId, dem zugewiesenen Affiliate und der bereits berechneten Provision), während Order die Bestelldaten selbst speichert — Lieferadresse, Zahlungsmethode, angewendeter Gutschein. So sieht jeder Produzent nur seine eigenen Verkäufe, ohne die vollständige Bestellung eines anderen Produzenten offenzulegen.",
      },
    ],
    backend: [
      {
        title: "Datenmodell: Produzenten, Produkte, Affiliates und Verkäufe",
        content:
          "Producer speichert Unternehmensdaten (Name, Produktart, Standort, Plan). Product gehört zu einem Producer und hat eine Kategorie (Wein, Lebensmittel, Kunsthandwerk, Leder), Preis und Bestand. Affiliate speichert den Empfehlungscode, die aktuelle Stufe und die Summen von Verkäufen und Einnahmen. Sale verknüpft ein Product mit einem Producer und optional mit einem Affiliate, wobei Gesamtwert, angewendeter Provisionssatz und Status (pending → confirmed → paid, oder cancelled) gespeichert werden.",
      },
      {
        title: "Checkout-Ablauf mit Affiliate-Zuordnung",
        content:
          "Das Frontend speichert den aus der URL erfassten Empfehlungscode (?ref=CODE) im localStorage mit 30 Tagen Gültigkeit, ähnlich einem Attribution-Cookie. Beim Checkout reist dieser Code mit der Bestellung; das Backend ermittelt den Affiliate, erzeugt für jeden Warenkorbartikel eine Sale mit bereits berechneter Provision, zieht den Produktbestand ab und gibt eine Bestellnummer zurück (z. B. ARG-8F42A1). Kostenloser Versand ab R$300, optionaler Rabattgutschein und drei simulierte Zahlungsmethoden (Karte, Pix, Boleto).",
      },
    ],
    features: [
      "Nach Kategorie filterbarer Produktkatalog (Wein, Lebensmittel, Kunsthandwerk, Leder)",
      "Affiliate-System mit eindeutigem Empfehlungslink und 3 automatischen Provisionsstufen",
      "Warenkorb und Checkout mit Rabattgutschein und kostenlosem Versand ab einem Mindestwert",
      "Produzenten-Dashboard mit Verkäufen, Produkten und bestätigten Einnahmen",
      "Affiliate-Dashboard mit Fortschritt zur nächsten Stufe und Provisionsverlauf",
      "Admin-Dashboard mit Plattformübersicht und Nutzerverwaltung",
    ],
    challenges: [
      {
        title: "Einen Verkauf korrekt dem richtigen Affiliate zuordnen, auch bei Warenkörben mit mehreren Produkten",
        content:
          "Gelöst, indem jede Warenkorbzeile als unabhängige Sale behandelt wird, statt die Provision eines einzigen Bestelldatensatzes aufzuteilen — jede Zeile erbt denselben referralCode vom Checkout-Zeitpunkt, wodurch es trivial wird, dass ein Produzent nur seine Verkäufe und ein Affiliate nur die von ihm generierten Verkäufe sieht, ohne Kreuzberechnungen.",
      },
      {
        title: "Verhindern, dass der Client den Provisionssatz manipuliert",
        content:
          "Der Provisionssatz kommt nie vom Frontend — er wird immer aus der TIER_RULES-Tabelle des Backends basierend auf der aktuellen, in der Datenbank gespeicherten Stufe des Affiliates gelesen, was es einem Käufer (oder Affiliate) unmöglich macht, manuell einen höheren Satz zu senden.",
      },
    ],
    learnings: [
      "Verkäufe pro Produktzeile (nicht pro vollständiger Bestellung) zu modellieren, vereinfacht „meine Verkäufe“-Abfragen erheblich, wenn mehrere Produzenten und Affiliates im selben Checkout sind",
      "Geschäftsregeln (wie Provisionsstufen) in einer einzigen Quelle der Wahrheit im Backend zu speichern, vermeidet die Duplizierung derselben Logik über mehrere Controller",
    ],
  },

  "games-hub": {
    title: "Games Hub",
    tagline: "Hub für Gelegenheitsspiele, 100 % im Browser",
    overview:
      "Ein Hub mit mehreren Gelegenheitsspielen (Memory und andere), die vollständig im Browser laufen, ganz ohne Serverabhängigkeit. Der Fokus dieses Projekts lag auf der Frontend-Architektur: Wie strukturiert man mehrere unabhängige Spiele, die gemeinsame Komponenten (Timer, Punktetafel, Punktesystem) teilen, ohne dass die Logik eines Spiels in ein anderes „durchsickert“?",
    problem:
      "Mehrere Spiele in einer einzigen Anwendung zu bauen führt leicht zu gekoppeltem Code, bei dem das Ändern der Regeln eines Spiels riskiert, ein anderes zu brechen. Die Herausforderung bestand darin, eine Architektur zu entwerfen, bei der jedes Spiel eine isolierte, austauschbare Einheit ist, mit einer gemeinsamen „Engine“ (Spielzustand, Timer, Highscore), die von allen wiederverwendet wird.",
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Context API + useReducer pro Spiel", "CSS Modules"] },
      { label: "Lokale Persistenz", items: ["localStorage für Highscores und Fortschritt (kein Backend)"] },
      { label: "Infrastruktur", items: ["Vercel (statisches Hosting)"] },
    ],
    architecture: [
      {
        title: "Jedes Spiel als isoliertes Modul mit gemeinsamer Schnittstelle",
        content:
          "Jedes Spiel implementiert dieselbe konzeptionelle „Schnittstelle“: einen Anfangszustand, eine Reducer-Funktion (useReducer), die Züge verarbeitet, und eine Punktetafel-Komponente. Das bedeutet, dass die Scoreboard-Komponente, der Timer und das „Highscore“-System generisch sind und von jedem neuen Spiel wiederverwendet werden — ein Spiel zum Hub hinzuzufügen erfordert kein Anfassen des Codes bestehender Spiele.",
      },
      {
        title: "TypeScript als Sicherheitsnetz zwischen Spielen",
        content:
          "Generische Typen (Game<State, Action>) garantieren zur Kompilierzeit, dass jedes Spiel den vom Hub erwarteten Vertrag korrekt implementiert — was den in JavaScript-Spielehubs häufigen Fehler vermeidet, dass ein schlecht implementiertes Spiel die allgemeine Punktetafel stillschweigend zerstört.",
      },
    ],
    backend: [],
    features: [
      "Memory-Spiel mit Schwierigkeitsstufen",
      "Punktesystem und persönliche Highscores (localStorage)",
      "Zwischen Spielen wiederverwendbarer Timer",
      "Modulare, für neue Spiele bereite Architektur",
    ],
    challenges: [
      {
        title: "Neue Spiele hinzufügen, ohne Punktetafel-/Timer-Logik zu duplizieren",
        content:
          "Gelöst durch Extraktion einer generischen Spiel-„Engine“ (Hooks useGameTimer, useScoreboard) unabhängig von einem bestimmten Spiel, verwendet durch Komposition bei jedem neuen zum Hub hinzugefügten Spiel.",
      },
    ],
    learnings: [
      "Wie man generische TypeScript-Schnittstellen (Game<State, Action>) entwirft, um Konsistenz zwischen unabhängigen Modulen zu erzwingen",
      "Lokale Persistenz (localStorage) ist ausreichend und angemessen, wenn kein echter Bedarf besteht, Daten geräteübergreifend zu teilen",
    ],
  },

  primeflix: {
    title: "PrimeFlix",
    tagline: "Entdeckung angesagter Filme, mit Konsum einer öffentlichen API",
    overview:
      "Eine Anwendung zum Entdecken angesagter Filme und zum Ansehen ihrer Details (Inhaltsangabe, Bewertung, Besetzung, Erscheinungsdatum), unter Nutzung einer öffentlichen Film-API (TMDB). Der Fokus des Projekts lag auf der Integrationsschicht mit einer externen API: Wie strukturiert man HTTP-Aufrufe, behandelt Fehler und Rate Limits und hält die Oberfläche reaktionsschnell, auch wenn Daten asynchron eintreffen?",
    problem:
      "Eine öffentliche Drittanbieter-API robust zu konsumieren ist schwieriger, als es scheint: API-Schlüssel dürfen nicht sorglos offengelegt werden, Anfragen können fehlschlagen oder ratenbegrenzt werden, und die Nutzererfahrung darf nicht „einfrieren“, während auf eine Antwort gewartet wird. Ziel war es, diese Integrationsschicht sauber und wiederverwendbar zu bauen.",
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Axios (konfigurierte Instanz + Interceptors)", "React Query für das Caching von Anfragen"] },
      { label: "Externe Integration", items: ["Öffentliche API von The Movie Database (TMDB)", "Umgebungsvariablen für den API-Schlüssel"] },
      { label: "Infrastruktur", items: ["Vercel (statisches Hosting)"] },
    ],
    architecture: [
      {
        title: "Dedizierte Axios-Instanz mit Interceptors",
        content:
          "Statt axios.get direkt in jeder Komponente aufzurufen, gibt es eine einzige Axios-Instanz (api.ts) mit vorkonfigurierter baseURL und API-Schlüssel, sowie Response-Interceptors, die 401/429-Fehler (Rate Limit überschritten) zentral behandeln und benutzerfreundliche Fehlermeldungen formatieren — wodurch doppelte Fehlerbehandlung in jedem Aufruf vermieden wird.",
      },
      {
        title: "Dedizierte Hooks pro Datentyp (useTrendingMovies, useMovieDetails)",
        content:
          "Jeder Datenbedarf hat seinen eigenen Hook, verantwortlich für den API-Aufruf, die Verwaltung von Lade-/Fehlerzuständen und (mit React Query) das Caching von Ergebnissen — wodurch wiederholte Anfragen an die öffentliche API für dieselben Suchfilter vermieden werden, was auch hilft, das kostenlose Anfragelimit von TMDB nicht auszuschöpfen.",
      },
      {
        title: "Debounced Suche zur Reduzierung unnötiger Aufrufe",
        content:
          "Die Filmsuche löst eine API-Anfrage erst 400 ms aus, nachdem der Nutzer aufgehört hat zu tippen, statt bei jedem Tastendruck — eine einfache, aber essenzielle Optimierung beim Konsum einer externen API mit Nutzungslimits.",
      },
    ],
    backend: [],
    features: [
      "Listen angesagter und nach Kategorie sortierter Filme",
      "Filmsuche mit Debounce",
      "Detailseite mit Inhaltsangabe, Bewertung und Besetzung",
      "Konsistent behandelte Lade- und Fehlerzustände",
    ],
    challenges: [
      {
        title: "Vermeiden, das Anfragelimit der öffentlichen API auszuschöpfen",
        content:
          "Gelöst durch Kombination von Such-Debounce mit Ergebnis-Caching via React Query, was die Anzahl wiederholter Aufrufe an TMDB für dieselben Suchen drastisch reduziert.",
      },
      {
        title: "Die Oberfläche während asynchroner Anfragen reaktionsschnell halten",
        content:
          "Gelöst mit dedizierten Ladezuständen pro Seitenabschnitt (Skeleton Loader), statt die ganze Seite blockierend auf eine einzige Antwort warten zu lassen.",
      },
    ],
    learnings: [
      "Die Zentralisierung der HTTP-Client-Konfiguration (Axios) in einer einzigen Instanz vermeidet Duplizierung und Inkonsistenz bei der Fehlerbehandlung",
      "Client-seitiges Caching (React Query) ist genauso wichtig wie server-seitiges Caching, wenn man auf ratenbegrenzte APIs Dritter angewiesen ist",
    ],
  },
  barbearia: {
    title: "Barbershop",
    tagline: "Online-Terminbuchung mit Admin-Dashboard und Zahlungen",
    overview:
      "Eine Buchungsplattform für einen Friseursalon, mit Auswahl von Service, Friseur und verfügbarem Termin, einem Admin-Dashboard, damit der Friseur seinen Terminkalender verwaltet, und einer Zahlungsintegration, um die Buchung mit einer Vorauszahlung zu bestätigen. Gebaut als Fullstack-Next.js-Anwendung, wobei Next.js selbst (App Router + Route Handlers) als Backend-Schicht statt eines separaten Express-Servers dient.",
    problem:
      "Über WhatsApp oder Telefon getätigte Buchungen gehen leicht verloren und verhindern keine „No-Shows“ (Kunden, die buchen und nicht erscheinen). Ziel war es, den Buchungsprozess durchgängig zu digitalisieren: nur wirklich verfügbare Termine anzeigen, Doppelbuchungen für denselben Friseur/Termin vermeiden und No-Shows durch eine kleine Anzahlung bei der Buchung reduzieren.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "React Hook Form + Zod zur Validierung"] },
      { label: "Backend", items: ["Next.js Route Handlers (integrierte API, kein separater Express-Server)", "NextAuth zur Authentifizierung des Admin-Panels"] },
      { label: "Datenbank", items: ["PostgreSQL", "Prisma ORM"] },
      { label: "Zahlungen", items: ["Integration eines Zahlungsanbieters (Multicaixa Express / Stripe) für die Buchungsanzahlung"] },
      { label: "Infrastruktur", items: ["Vercel (Frontend + Route Handlers)", "Supabase / Railway (PostgreSQL)"] },
    ],
    architecture: [
      {
        title: "Fullstack-Next.js: Route Handlers als Backend, kein separater Server",
        content:
          "Anders als bei den E-Commerce-Projekten (wo das Backend ein unabhängiger Node/Express-Service ist), wurde hier entschieden, alles innerhalb von Next.js selbst über Route Handlers (app/api/.../route.ts) zu belassen. Für eine Domäne dieser Größe — Buchungen, Services, Friseure — war die operative Komplexität, zwei separate Deployments (Frontend und Backend) zu pflegen, nicht gerechtfertigt; Fullstack-Next.js liefert dasselbe Produkt mit halb so viel zu verwaltender Infrastruktur.",
      },
      {
        title: "Verfügbarkeitsmodellierung: abgeleitete Zeitfenster, keine riesige Terminplantabelle",
        content:
          "Statt für jeden möglichen Zeitpunkt jedes Tages eine Datenbankzeile vorzugenerieren (was unbegrenzt wächst), werden verfügbare Zeitfenster dynamisch berechnet: Das Backend gleicht die Arbeitszeiten des Friseurs mit den bestehenden Buchungen an diesem Tag ab und gibt nur die noch freien Intervalle zurück. Das hält die Datenbank klein und stets korrekt, ohne periodische Bereinigungsaufgaben zu benötigen.",
      },
      {
        title: "Terminreservierung mit Transaktion zur Vermeidung von Doppelbuchungen",
        content:
          "Wenn ein Kunde einen Termin bestätigt, läuft die Erstellung der Buchung innerhalb einer Prisma-Transaktion ab, die zunächst mit einer Sperre prüft, ob der Friseur in diesem Intervall noch frei ist — wenn zwei Kunden versuchen, gleichzeitig denselben Termin zu buchen, erhält nur der Erste, der die Transaktion abschließt, die Buchung; der Zweite erhält sofort den Fehler „Termin bereits vergeben“.",
      },
    ],
    backend: [
      {
        title: "Nach Geschäftsdomäne organisierte Route Handlers",
        content:
          "/api/services (Services und Preise), /api/professionals (Friseure und Arbeitszeiten), /api/availability (Berechnung freier Termine), /api/bookings (Erstellung und Verwaltung von Buchungen) und /api/payments/webhook (asynchrone Bestätigung der bezahlten Anzahlung). Administrative Route Handlers erfordern eine gültige NextAuth-Sitzung mit einer „admin“-Rolle, während die öffentlichen Buchungs-Handlers für jeden Besucher zugänglich sind, jedoch mit strenger Eingabevalidierung via Zod.",
      },
      {
        title: "Zahlungsanzahlung als Verpflichtungsbestätigung",
        content:
          "Eine Buchung wechselt nur dann von pending_payment zu confirmed, wenn der Zahlungsanbieter den Webhook erfolgreich benachrichtigt — nie nur, weil der Kunde zurück auf die Website umgeleitet wurde. Buchungen, die länger als X Minuten ohne Bestätigung in pending_payment bleiben, werden automatisch freigegeben, wodurch der Termin wieder allgemein verfügbar wird.",
      },
      {
        title: "Admin-Dashboard mit dem Terminplan des Tages",
        content:
          "Der authentifizierte Friseur sieht den nach Fachkraft gruppierten Terminplan des Tages, kann telefonisch anrufende Kunden manuell buchen und Termine stornieren/verschieben — alle Operationen laufen über dieselbe Verfügbarkeitsvalidierungsschicht, die vom Endkunden verwendet wird, wodurch garantiert wird, dass es nie zwei unterschiedliche (und potenziell inkonsistente) Wege zur Erstellung einer Buchung gibt.",
      },
    ],
    features: [
      "Auswahl von Service, Fachkraft und verfügbarem Termin",
      "Dynamische Verfügbarkeitsberechnung (keine Geisterslots)",
      "Zahlungsanzahlung zur Bestätigung der Buchung",
      "Admin-Dashboard mit dem Terminplan des Tages pro Fachkraft",
      "Vermeidung doppelter Buchungen für denselben Termin",
    ],
    challenges: [
      {
        title: "Verhindern, dass zwei Kunden denselben Termin buchen",
        content:
          "Gelöst mit einer Datenbanktransaktion, die den Termin atomar prüft und reserviert, statt zweier separater Operationen (Verfügbarkeit prüfen, dann Buchung erstellen), die ein anfälliges Zeitfenster hinterlassen würden.",
      },
      {
        title: "No-Shows reduzieren, ohne Kunden mit einem schwerfälligen Zahlungsprozess abzuschrecken",
        content:
          "Gelöst, indem bei der Buchung nur eine Teilanzahlung (nicht der volle Servicewert) verlangt wird, was das Engagement des Kunden mit der Reibung des Buchungsprozesses ausbalanciert.",
      },
    ],
    learnings: [
      "Wann man sich für ein in Next.js integriertes Backend (Route Handlers) statt eines separaten Express-Service entscheidet — es hängt von der tatsächlichen Größe der Domäne ab, nicht von persönlicher Vorliebe",
      "Die Terminverfügbarkeit sollte immer berechnet werden, nie als feste Liste von Zeitfenstern gespeichert werden",
    ],
  },

  neoxia: {
    title: "Neoxia",
    tagline: "Unternehmenswebsite für eine Digitalmarketing-Agentur",
    overview:
      "Eine Unternehmenswebsite für Neoxia, eine Digitalmarketing-Agentur, die ihre Dienstleistungen, Fallstudien und einen direkten Kontaktweg für potenzielle Kunden präsentiert. Anders als die E-Commerce- oder SaaS-Projekte in diesem Portfolio war das Ziel hier kein System mit vielen dynamischen Daten, sondern eine schnelle, glaubwürdige digitale Präsenz, die auf die Generierung von Geschäftskontakten (Leads) ausgerichtet ist.",
    problem:
      "Eine Digitalmarketing-Agentur ist selbst der erste Test ihrer eigenen Glaubwürdigkeit: Wenn die Unternehmenswebsite langsam, generisch ist oder keine qualifizierten Leads generiert, untergräbt das das eigene Verkaufsargument der Agentur. Die Herausforderung bestand darin, eine Website zu bauen, die technische Professionalität widerspiegelt und Besucher in echte Kontaktanfragen umwandelt.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion für Sektionsübergänge"] },
      { label: "Backend", items: ["Dedizierter Next.js Route Handler für das Kontaktformular", "Resend (transaktionaler E-Mail-Versand)"] },
      { label: "Infrastruktur", items: ["Vercel (Frontend + Route Handler)", "Statisches Rendering (SSG) für alle Inhaltsseiten"] },
    ],
    architecture: [
      {
        title: "Eine fast vollständig statische Website mit einer einzigen dynamischen Insel",
        content:
          "Die überwiegende Mehrheit der Seiten (Services, Über uns, Fallstudien) wird zur Build-Zeit statisch generiert (SSG), was minimale Ladezeiten und exzellentes SEO garantiert — essenziell für eine Agentur, die von organischem Suchtraffic abhängt. Der einzige wirklich „dynamische“ Teil der Website ist das Kontaktformular, isoliert als die einzige Funktionalität, die tatsächlich serverseitig laufen muss.",
      },
      {
        title: "Kontaktformular als Route Handler + transaktionaler E-Mail-Dienst",
        content:
          "Das Formular sendet an einen Route Handler (app/api/contact/route.ts), der die Daten serverseitig validiert (ohne sich jemals nur auf die clientseitige Validierung zu verlassen), eine einfache Rate-Limitierung pro IP anwendet, um Spam zu mindern, und Resend nutzt, um die Kontaktanfrage-E-Mail direkt in den Posteingang der Agentur zu senden — ohne dass eine Datenbank nur zum Speichern von Kontaktnachrichten gepflegt werden muss.",
      },
      {
        title: "Inhalt als das eigentliche Produkt des Projekts",
        content:
          "Bei einer Unternehmenswebsite ist die Code-Architektur bewusst einfach gehalten; der Ingenieuraufwand wurde in Performance (Core Web Vitals), Barrierefreiheit und Klarheit der Texte investiert — denn das bestimmt, ob eine Marketingagentur selbst gut im Marketing positioniert wirkt.",
      },
    ],
    backend: [
      {
        title: "Keine Datenbank — direkte Zustellung per transaktionaler E-Mail",
        content:
          "Statt Kontaktanfragen in einer Datenbank zu speichern, um sie später manuell zu prüfen, sendet der Route Handler die Anfrage direkt per E-Mail via Resend, sobald sie abgeschickt wird — was die operative Komplexität auf null reduziert (keine zu pflegende Datenbank), auf Kosten eines nicht durchsuchbaren Verlaufs, ein akzeptabler Kompromiss für das erwartete Volumen einer Unternehmenswebsite.",
      },
      {
        title: "Grundlegender Schutz vor Spam und missbräuchlichen Einsendungen",
        content:
          "Der Route Handler wendet strenge Schema-Validierung (Zod) und ein Limit für Einsendungen pro IP innerhalb eines kurzen Zeitfensters an, wodurch verhindert wird, dass das Formular zum Versenden von Massen-Spam über die E-Mail-Infrastruktur der Agentur genutzt wird.",
      },
    ],
    features: [
      "Präsentation der Digitalmarketing-Dienstleistungen",
      "Fallstudien-/Portfolio-Bereich der Agentur",
      "Kontaktformular mit direkter E-Mail-Zustellung",
      "Vollständig statische, für SEO optimierte Website",
    ],
    challenges: [
      {
        title: "Geschäftskontakte generieren ohne die Komplexität einer Datenbank",
        content:
          "Gelöst durch direkte transaktionale E-Mail-Zustellung (Resend) von einem einzigen Route Handler, statt ein Lead-Speicher- und Verwaltungssystem zu bauen, das im Verhältnis zum Umfang des Projekts unverhältnismäßig wäre.",
      },
    ],
    learnings: [
      "Nicht jedes Kontaktformular braucht eine Datenbank — manchmal ist transaktionale E-Mail die einfachste und korrekteste Lösung",
      "Bei Unternehmenswebsites sind SEO und Ladeperformance in der Praxis Geschäftsfunktionen",
    ],
  },
  qrcodepay: {
    title: "QrCodePay",
    tagline: "QR-Code-Zahlungsplattform für Händler, mit einladungsbasiertem Onboarding und vollständigem Admin-Dashboard",
    overview:
      "QrCodePay ist eine QR-Code-Zahlungsplattform, konzipiert für Händler, die digitale Zahlungen akzeptieren möchten, ohne von einer einzigen Bank oder mobilen Wallet abhängig zu sein. Jeder Händler hat einen festen QR-Code für sein Geschäft (für generische Zahlungen) und kann dynamische QR-Codes pro Transaktion generieren, mit Betrag, eindeutiger Referenz und Ablaufzeit — dasselbe Muster, das in mehreren Schwellenmärkten von Instant-QR-Zahlungssystemen verwendet wird. Über die Händlererfahrung hinaus umfasst das Projekt ein vollständiges Admin-Dashboard mit Händler-, Nutzer- und Zugriffseinladungsverwaltung, Transaktionen und einem System-Audit-Log.",
    problem:
      "Kleine und mittlere Händler, die schnelle digitale Zahlungen akzeptieren möchten, stehen vor einer fragmentierten Erfahrung: Jede Bank oder mobile Wallet hat ihre eigene App, ihren eigenen QR-Code und ihren eigenen Bestätigungsablauf. Das Ziel des Projekts war es, eine eigene QR-Code-Zahlungsschicht zu bauen — mit derselben Strenge wie ein echtes Finanzprodukt: klar definierte Transaktionszustände, asynchrone Bestätigung, die niemals dem Browser des Kunden anvertraut wird, automatischer Ablauf unbezahlter Zahlungen und ein vollständiges Audit-Log all dessen, was im System geschieht.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "TanStack Query für Caching und Synchronisierung von Serverdaten"] },
      { label: "Backend", items: ["Node.js", "Express", "TypeScript", "JWT zur Authentifizierung", "Hintergrund-Job für den Zahlungsablauf"] },
      { label: "Datenbank", items: ["MongoDB", "Mongoose (ODM)"] },
      { label: "Infrastruktur", items: ["Docker + Docker Compose (Frontend, Backend, Datenbank und Proxy)", "Nginx als Reverse Proxy", "Getrennte Konfiguration für Entwicklung und Produktion"] },
    ],
    architecture: [
      {
        title: "Geschlossenes einladungsbasiertes Onboarding, keine öffentliche Registrierung",
        content:
          "Es gibt keine öffentliche „Konto erstellen“-Seite: Ein Administrator generiert eine an eine E-Mail gebundene Einladung, das System sendet einen eindeutigen Registrierungslink mit begrenzter Gültigkeit, und nur wer diesen Link hat, kann das Händlerkonto erstellen. Auf einer Plattform, die Geld bewegt, ist dies eine bewusste Sicherheitsentscheidung — sie eliminiert die Angriffsfläche automatischer Registrierungen oder betrügerischer Konten vollständig, auf Kosten von mehr Onboarding-Reibung, ein akzeptabler Kompromiss für diese Art von Produkt.",
      },
      {
        title: "Zwei QR-Code-Typen für zwei unterschiedliche Anwendungsfälle",
        content:
          "Der statische QR-Code des Händlers existiert nur einmal, läuft nie ab und dient generischen Zahlungen in einem physischen Geschäft (der Kunde scannt und gibt den Betrag ein). Der dynamische QR-Code hingegen wird pro Transaktion generiert, kommt bereits mit festgelegtem Betrag, hat eine eindeutige Referenz und eine kurze Gültigkeit — gedacht für Situationen, in denen der Betrag im Voraus bekannt ist (z. B. Checkout, Rechnung). Diese Unterscheidung spiegelt sich im Rest der Architektur wider, einschließlich der Art, wie jeder QR-Typ backendseitig validiert wird.",
      },
      {
        title: "Drei Nutzungsprofile über dieselbe API",
        content:
          "Die Frontend-Anwendung ist in drei Zonen mit eigenen Layouts und Berechtigungen unterteilt: die öffentliche Zahlungsseite (für den Endkunden, der den QR-Code scannt), das Händler-Dashboard (Dashboard, Zahlungserstellung, Transaktionen, Profil) und das Admin-Dashboard (Händler, Einladungen, Nutzer, globale Transaktionen, Systemprotokolle). Alle drei Zonen konsumieren dieselbe REST-API, aber jede Backend-Route validiert die Rolle des authentifizierten Nutzers, bevor irgendwelche Daten offengelegt werden.",
      },
      {
        title: "Containerisierte Infrastruktur von Tag eins an",
        content:
          "Das Projekt lief nie „nur auf der lokalen Maschine“: Frontend, Backend und Datenbank sind von Anfang an in Docker Compose definiert, mit Nginx davor als Reverse Proxy. Das erzwang frühes Nachdenken über Umgebungsvariablen, interne Netzwerke zwischen Containern und Startskripte für Entwicklung und Produktion bereits ab der ersten Version, statt diese Komplexität ans Ende zu verschieben.",
      },
    ],
    backend: [
      {
        title: "Zustandsautomat der Zahlungsanfrage",
        content:
          "Eine Zahlung durchläuft klar definierte Zustände — created → pending → confirmed / failed —, und jeder Übergang wird vor der Anwendung explizit serverseitig validiert; ein Übergang, der keinen Sinn ergibt (z. B. der Versuch, eine bereits fehlgeschlagene Zahlung zu bestätigen), wird abgelehnt. Das verhindert, dass eine fehlerhafte Anfrage oder ein Wettlauf zwischen Anfragen eine Transaktion in einem inkonsistenten Zustand hinterlässt.",
      },
      {
        title: "Automatischer Ablauf unbezahlter Zahlungen",
        content:
          "Ein Hintergrundprozess läuft periodisch und sucht nach Zahlungsanfragen, deren Gültigkeitszeitraum ohne Bestätigung abgelaufen ist, markiert sie als abgelaufen und protokolliert den Grund im Transaktionsverlauf. Das bedeutet, ein vergessener dynamischer QR-Code bleibt nicht für immer „ausstehend“ im Händler-Dashboard — das System bereinigt sich selbst, ohne manuellen Eingriff.",
      },
      {
        title: "Zahlungsbestätigung nie dem Client anvertraut",
        content:
          "Genau wie im E-Commerce-Projekt dieses Portfolios wird eine Zahlung nur durch eine asynchrone, serverseitig validierte Benachrichtigung als bestätigt markiert — nie nur, weil der Browser des Kunden auf eine „Erfolgs“-Seite umgeleitet wurde. Das ist eine Regel, die sich in jedem gut gebauten Zahlungssystem wiederholt, und sie wurde hier absichtlich repliziert.",
      },
      {
        title: "Audit-Log für das gesamte System",
        content:
          "Jedes relevante Ereignis — Erstellung einer Einladung, Zustandsänderung einer Zahlung, Aktion eines Administrators — erzeugt einen Protokolleintrag mit dem Akteur, dem Ereignistyp und relevanten Metadaten, abfragbar im „Systemprotokolle“-Panel des Admins. Auf einer Finanzplattform ist es nicht optional zu wissen, was genau wann passiert ist.",
      },
      {
        title: "Rate Limiting auf sensiblen Routen",
        content:
          "Kritische Endpunkte wie Login und Einladungserstellung haben eine Begrenzung der Anfragerate, was die Angriffsfläche für Brute Force oder automatisierten Missbrauch reduziert, ohne die normale Nutzung zu beeinträchtigen.",
      },
    ],
    features: [
      "Geschlossenes Händler-Onboarding, nur per Einladung mit begrenzter Gültigkeit",
      "Permanenter statischer QR-Code pro Händler",
      "Dynamischer QR-Code pro Transaktion, mit Betrag, Referenz und automatischem Ablauf",
      "Händler-Dashboard mit Umsatz, aktuellen Transaktionen und Schnellaktionen",
      "Admin-Dashboard mit globaler Übersicht über Händler, Nutzer und Transaktionen",
      "Systemzustand sichtbar im Admin-Dashboard",
      "Transaktionsverlauf mit Filtern und Suche",
      "Audit-Log der Systemereignisse",
      "Passwort-Wiederherstellung und JWT-basierter Authentifizierungsablauf",
      "Vollständig containerisierte Infrastruktur mit Docker Compose",
    ],
    challenges: [
      {
        title: "Verhindern, dass eine Zahlung fälschlich bestätigt wird",
        content:
          "Gelöst mit expliziter serverseitiger Validierung von Zustandsübergängen — jede Zustandsänderung wird gegen eine Liste erlaubter Übergänge geprüft, bevor sie gespeichert wird, statt blind jedes Update zu akzeptieren.",
      },
      {
        title: "Verhindern, dass vergessene Zahlungen das Händler-Dashboard überladen",
        content:
          "Gelöst mit einem Hintergrundprozess, der unbezahlte Zahlungsanfragen, deren Frist abgelaufen ist, automatisch verfallen lässt, ohne darauf angewiesen zu sein, dass der Händler oder Kunde etwas unternimmt.",
      },
      {
        title: "Sicherheit und Geschwindigkeit beim Onboarding neuer Händler ausbalancieren",
        content:
          "Gelöst mit einem Einladungsablauf: langsamer als eine sofortige öffentliche Registrierung, eliminiert aber betrügerische oder Testkonten auf einer geldbewegenden Plattform vollständig — ein bewusster Kompromiss zugunsten der Sicherheit.",
      },
    ],
    learnings: [
      "Einen expliziten Zustandsautomaten zu entwerfen, selbst in einem persönlichen Projekt, zwingt dazu, jeden möglichen Pfad einer Transaktion durchzudenken — nicht nur den Idealfall",
      "Ein einfacher Hintergrundprozess (prüfen und verfallen lassen) löst ein Datenintegritätsproblem, das andernfalls komplexe, über mehrere Stellen der Anwendung verteilte Logik erfordern würde",
      "Docker Compose von Anfang an zu haben, nicht erst am Ende, zwingt dazu, Konfigurationsprobleme zwischen Services früh zu lösen, die sonst erst in der Produktion auftauchen würden",
      "Geschlossenes einladungsbasiertes Onboarding ist bei vielen Finanzprodukten eine ebenso wichtige Sicherheitsfunktion wie die Authentifizierung selbst",
    ],
  },
  crfdesk: {
    title: "CRFDesk",
    tagline: "Screening- und Compliance-Plattform für Krypto-Assets, mit erklärbarem Risiko-Scoring und regulatorisch einsatzbereiten Berichten",
    overview:
      "CRFDesk ist eine Screening- und Compliance-Plattform für Krypto-Assets, gebaut für Teams, die das Risiko einer Wallet, Transaktion oder eines Vertrags bewerten müssen, bevor sie eine Operation akzeptieren oder verarbeiten. Statt nur „hohes Risiko“ oder „niedriges Risiko“ zurückzugeben, erzeugt das System einen quantifizierten Score, Faktor für Faktor erklärt, mit Historie und Versionierung pro Entität, und kann sowohl Analyseberichte als auch formelle Verdachtsmeldungen (SARs) generieren, mit einem Genehmigungsablauf durch einen Vorgesetzten vor jeder Einreichung. Es umfasst außerdem ein Multi-User-Admin-Dashboard, API-Schlüsselverwaltung für externe Integrationen und ein Nutzungs-Dashboard pro Plan.",
    problem:
      "Compliance-Teams bei Krypto-Börsen und Fintechs können eine „hohes Risiko“-Entscheidung gegenüber einem Regulator oder Prüfer nicht mit einer Black Box rechtfertigen — sie müssen genau wissen, welche Faktoren mit welchem Gewicht und welchem Vertrauensniveau zum Score beigetragen haben. Die Herausforderung dieses Projekts bestand darin, eine Risiko-Engine zu bauen, die von Grund auf erklärbar konzipiert ist, nicht nur eine isolierte Zahl: Jedes Screening-Ergebnis muss für sich allein als dokumentarischer Beweis bestehen können, mit Versionshistorie und vollständigem Audit-Trail.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion", "TanStack Query"] },
      { label: "Backend", items: ["Node.js", "Express", "TypeScript", "Hintergrund-Job-Warteschlange", "PDF-Berichtsgenerierung"] },
      { label: "Datenbank", items: ["MongoDB", "Mongoose (ODM)", "Dedizierte Modelle für Screenings, Berichte, SARs und Audit-Logs"] },
      { label: "Infrastruktur", items: ["Docker + Docker Compose", "Nginx als Reverse Proxy", "API-Schlüssel-Authentifizierung für externe Integrationen", "Konfigurierbare Webhooks"] },
    ],
    architecture: [
      {
        title: "Ein einziger Orchestrator für den gesamten Screening-Ablauf",
        content:
          "Jede Screening-Anfrage durchläuft zwingend einen einzigen Orchestrator-Service, der Anfragevalidierung, Risikoberechnung, Erzeugung des Score-Details, Versionierung, Aktualisierung der Entitäts-Zeitleiste, Berichtsgenerierung, Audit-Protokollierung, Benachrichtigungen und Verrechnung der Plannutzung verkettet. API-Controller rufen interne Services niemals isoliert auf — das garantiert, dass kein Screening einen obligatorischen Schritt des Ablaufs „überspringen“ kann, was für ein Produkt essenziell ist, dessen Ausgabe als Beweis vor einem Regulator enden kann.",
      },
      {
        title: "Score aus erklärbaren Risikofaktoren aufgebaut, keine magische Zahl",
        content:
          "Statt eines einzigen unerklärten Werts erzeugt jedes Screening eine Liste von Risikofaktoren („Reason Codes“), jeder mit einer Kategorie, Beschreibung, zugewiesenen Punkten, prozentualem Gewicht, Beweisquelle und Vertrauensniveau (hoch/mittel/niedrig). Der Endscore ist die erklärbare Summe dieser Faktoren, gruppiert nach Kategorie mit jeweiligem Schweregrad — konzipiert, damit ein Compliance-Team jeden Punkt des Ergebnisses gegenüber einem Prüfer rechtfertigen kann.",
      },
      {
        title: "Versionierung und Risiko-Zeitleiste pro Entität",
        content:
          "Jedes neue Screening derselben Adresse oder Wallet erzeugt eine neue Version des Scores, statt die vorherige zu ersetzen. Das erlaubt zu rekonstruieren, wie sich das Risiko einer Entität über die Zeit entwickelt hat — wichtig, weil eine heute durchgeführte Bewertung von Informationen abhängen kann, die nur in einer neueren Version existierten, und die Plattform diesen Unterschied auf auditierbare Weise zeigen können muss.",
      },
      {
        title: "Schwere Verarbeitung in einer Job-Warteschlange isoliert, außerhalb der HTTP-Anfrage",
        content:
          "Multi-Chain-Analysen und umfangreiche PDF-Berichtsgenerierung blockieren nicht die Antwort an den Nutzer: Sie werden in eine Warteschlange gestellt und im Hintergrund von einem dedizierten Satz von Workern verarbeitet, wobei der Nutzer benachrichtigt wird, sobald das Ergebnis verfügbar ist. Das hält die Oberfläche reaktionsschnell, auch wenn eine Analyse mehrere Sekunden dauert.",
      },
      {
        title: "Integritätssiegel auf bereits ausgestellten Berichten",
        content:
          "Nach der Erstellung durchläuft ein Bericht einen Integritätsdienst, der stille Änderungen an seinem Inhalt verhindert — eine notwendige Garantie, wenn das Dokument als formeller Beweis vor einer Behörde verwendet werden könnte.",
      },
    ],
    backend: [
      {
        title: "SAR-Ablauf (Verdachtsmeldung) mit hierarchischer Genehmigung",
        content:
          "Ein Analyst kann aus einem hohen oder kritischen Risiko-Screening einen SAR-Entwurf erstellen und eine Begründung ausfüllen; der Bericht wechselt nur mit der expliziten, protokollierten Genehmigung eines Vorgesetzten vom Entwurf zum genehmigten (und dann eingereichten) Zustand. Es gibt keinen automatischen Einreichungspfad — die menschliche Entscheidung ist immer ein obligatorischer, auditierbarer Schritt im Ablauf.",
      },
      {
        title: "Durchsetzung des Plan-Kontingents vor jeder kostspieligen Operation",
        content:
          "Jede Organisation hat ein durch ihren Plan definiertes Screening- und Berichtslimit, das vor dem Start jeder Operation mit signifikanten Rechenkosten geprüft wird — wodurch vermieden wird, eine schwere Anfrage zu verarbeiten, die ohnehin wegen Überschreitung des Limits abgelehnt würde.",
      },
      {
        title: "API-Schlüssel mit eigenem Geltungsbereich, unabhängig vom Nutzer-Login",
        content:
          "Externe Integrationen (zum Beispiel ein System, das jede Geldabhebung automatisch screenen muss) authentifizieren sich mit dedizierten API-Schlüsseln, die jederzeit über das Dashboard generiert und widerrufen werden können — ohne Nutzeranmeldedaten zu teilen oder eine interaktive Sitzung zu benötigen.",
      },
      {
        title: "Länderrisikofaktor als isolierte, austauschbare Komponente",
        content:
          "Die mit einer Operation verbundene Jurisdiktion fließt über einen dedizierten Adapter in die Risiko-Engine ein, getrennt von der zentralen Scoring-Logik — was es erlaubt, die Liste der Hochrisikoländer oder -regionen zu aktualisieren, ohne den Rest der Engine anzufassen.",
      },
      {
        title: "Asynchrone Webhook-Benachrichtigungen",
        content:
          "Externe Systeme können Ereignisse (z. B. „Bericht abgeschlossen“ oder „SAR genehmigt“) über konfigurierbare Webhooks abonnieren, statt die API wiederholt abfragen zu müssen, während sie auf eine Zustandsänderung warten.",
      },
    ],
    features: [
      "Screening von Adressen, Transaktionen und Verträgen über mehrere Blockchains",
      "Quantifizierter Risiko-Score mit Faktor-für-Faktor-Detail",
      "Risiko-Historie und Zeitleiste pro Entität",
      "PDF-Analyseberichtsgenerierung mit Integritätssiegel",
      "SAR-Ablauf (Verdachtsmeldung) mit Genehmigung durch Vorgesetzten",
      "Multi-User-Admin-Dashboard",
      "API-Schlüsselverwaltung für externe Integrationen",
      "Konfigurierbare Webhooks für Ereignisbenachrichtigungen",
      "Nutzungs-Dashboard und Limits des gebuchten Plans",
      "Vollständiges Audit-Log aller Aktionen",
    ],
    challenges: [
      {
        title: "Den Score vollständig erklärbar machen, ohne dass er eine Black Box ist",
        content:
          "Gelöst mit einer Engine kategorisierter Risikofaktoren („Reason Codes“), jeder mit eigenem Gewicht und Vertrauensniveau, statt einer einzigen unbegründeten Zahl — jedes Ergebnis kann aufgeschlüsselt und einem Prüfer präsentiert werden.",
      },
      {
        title: "Garantieren, dass ein bereits ausgestellter Bericht nachträglich nicht verändert werden kann",
        content:
          "Gelöst mit einem dedizierten Integritätsdienst, der den Berichtsinhalt nach der Ausstellung validiert und Dokumente schützt, die als formeller Beweis verwendet werden könnten.",
      },
      {
        title: "Schwere Analysen verarbeiten, ohne die Nutzererfahrung zu blockieren",
        content:
          "Gelöst durch Isolierung der schweren Arbeit (Multi-Chain-Analyse, PDF-Generierung) in einer Hintergrund-Job-Warteschlange, wodurch die ursprüngliche HTTP-Anfrage schnell und die Oberfläche reaktionsschnell bleibt.",
      },
    ],
    learnings: [
      "Eine von Anfang an auf Erklärbarkeit ausgelegte Risiko-Engine verändert das Datendesign vollständig — es geht nicht mehr um „eine Zahl berechnen“, sondern um „einen begründbaren Fall aufbauen“",
      "Die Trennung von Nutzerauthentifizierung und API-Schlüssel-Authentifizierung ist essenziell, sobald ein Produkt automatisierte externe Integrationen unterstützen muss",
      "Ein Muster mit einem einzigen Orchestrator, durch den alles laufen muss, ist ein effektiver Weg zu garantieren, dass regulatorische Abläufe nie versehentlich unvollständig bleiben",
      "Plan-Limits vor kostspieligen Operationen durchzusetzen, statt danach, spart Ressourcen und vermeidet Nutzerfrustration",
    ],
  },
  "boardgov-ao": {
    title: "BoardGov AO",
    tagline: "Multi-Tenant-Plattform für Corporate Governance angolanischer Verwaltungsräte, mit Sitzungen, Abstimmungen und rechtlich haltbaren Protokollen",
    overview:
      "BoardGov AO ist eine Multi-Tenant-Plattform für Corporate Governance, gebaut für Verwaltungsräte angolanischer Organisationen — Banken, Versicherer, Makler und öffentliche Unternehmen, die der Aufsicht der BNA, der CMC oder anderer Regulatoren unterliegen. Sie digitalisiert den gesamten Lebenszyklus eines Verwaltungsrats: Einberufung von Sitzungen mit automatischer Quorumsberechnung, Echtzeit-Abstimmung und asynchrone Umlaufbeschlüsse, Erstellung und Genehmigung von Protokollen nach der rechtlichen Struktur des Gesetzes 1/04, ein vertraulicher Datenraum mit dynamischem Wasserzeichen, jährliche Interessenkonflikterklärungen, ein Konfliktregister, Fachausschüsse, eine durchsuchbare Präzedenzfall-Bibliothek, auditierter Notfallzugriff, ein temporäres Portal für externe Prüfer und ein KI-Assistent, der Protokollentwürfe erstellt und Dokumente zusammenfasst. Es gibt außerdem ein separates Super-Admin-Dashboard zur Verwaltung aller Kundenorganisationen der Plattform, Nutzer, Feature Flags pro Modul und Systemzustand.",
    problem:
      "In Angola findet die Governance von Verwaltungsräten noch größtenteils auf Papier und in verstreuten Dateien statt: Einberufungen per E-Mail ohne formelle Aufzeichnung, Protokolle, die nach der Sitzung in Word geschrieben werden, Abstimmungen, die niemand als exakt so abgelaufen beweisen kann, wie beschrieben, und Interessenkonflikterklärungen, die in einem selten überprüften Ordner abgelegt werden. Wenn eine BNA-Inspektion oder eine externe Prüfung ansteht, ist die Rekonstruktion dieser Historie langsam und fragil. Die Herausforderung dieses Projekts bestand darin, eine Plattform zu bauen, in der jeder Governance-Akt — eine Abstimmung, ein genehmigtes Protokoll, der Zugriff auf ein vertrauliches Dokument — auf eine Weise erfasst wird, die einer Prüfung standhält, ohne den Alltag des Verwaltungsrats bürokratischer zu machen, als er ohnehin schon ist.",
    stack: [
      { label: "Frontend", items: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS 4", "Radix UI (dialog, tabs, tooltip, select)"] },
      { label: "Backend", items: ["NestJS 11", "TypeScript", "Passport + JWT (access/refresh)", "Speakeasy (2FA / TOTP)", "PDFKit für Berichte", "Winston (strukturiertes Logging)", "@anthropic-ai/sdk (KI-Assistent)"] },
      { label: "Datenbank", items: ["PostgreSQL", "Prisma ORM", "Native Postgres Row-Level Security für Multi-Tenant-Isolierung", "Versionierte Migrationen"] },
      { label: "Infrastruktur", items: ["Docker + Workspaces (api / web / database / shared)", "AWS S3 (Dokumente)", "AWS SES (E-Mails)", "Redis / ioredis (Token-Blacklist, Warteschlangen)", "Scheduler (@nestjs/schedule) für tägliche Aufgaben"] },
    ],
    architecture: [
      {
        title: "Multi-Tenant-Isolierung, verstärkt auf Datenbankebene, nicht nur in der Anwendung",
        content:
          "Über den üblichen organizationId-Filter in den Services hinaus hat Postgres Row-Level Security auf allen sensiblen Tabellen aktiviert: Zu Beginn jeder Transaktion setzt die Anwendung SET LOCAL app.current_organisation_id, und eine RLS-Policy filtert automatisch jedes SELECT, INSERT oder UPDATE basierend auf diesem Wert — transparent für Prisma. Das bedeutet, dass selbst wenn ein Fehler in der Anwendungsschicht das Filtern nach Organisation vergisst, die Datenbank weiterhin den organisationsübergreifenden Zugriff verhindert. Es gibt einen expliziten Bypass (app.bypass_rls), der ausschließlich für Migrationen und Seeds reserviert ist.",
      },
      {
        title: "Ein expliziter Zustandsautomat für den Lebenszyklus einer Sitzung",
        content:
          "Eine Sitzung kann nur über eine Karte gültiger Übergänge, die vor jeder Zustandsänderung geprüft wird, zwischen Zuständen wechseln (DRAFT → CONVENED → IN_PROGRESS → COMPLETED, oder CANCELLED von DRAFT/CONVENED) — jeder Versuch, direkt von Entwurf zu abgeschlossener Sitzung zu springen, wird abgelehnt. Das Quorum wird automatisch in dem Moment berechnet, in dem die Sitzung beginnt (achievedPercent gegenüber dem von der Organisation oder der Sitzung selbst definierten quorumPercent), und dieser Prozentsatz wird im Startereignis festgehalten, nie nachträglich neu berechnet.",
      },
      {
        title: "Abstimmungen mit Integritäts-Hash, unveränderlich per Design",
        content:
          "Jede Stimme (Ballot) erzeugt einen SHA-256-Hash über die Abstimmungs-ID, das Mitglied, den abgestimmten Wert und den exakten Zeitpunkt der Stimmabgabe. Einmal eingereicht, kann ein Ballot nicht mehr geändert oder gelöscht werden, und eine Eindeutigkeitsbeschränkung in der Datenbank verhindert, dass dasselbe Mitglied zweimal bei derselben Abstimmung stimmt. Nach Abschluss akzeptiert eine Abstimmung keine neuen Ballots mehr. Enthaltungen wegen Interessenkonflikt (CONFLICT_ABSTENTION) werden erfasst, aber von der Mehrheitsberechnung ausgeschlossen — das Ergebnis ist immer ein einfacher Vergleich zwischen Ja- und Nein-Stimmen der Mitglieder ohne Konflikt.",
      },
      {
        title: "Protokolle mit rechtlichem Ablauf und wiederverwendeter Architektur für Umlaufbeschlüsse",
        content:
          "Protokolle folgen DRAFT → UNDER_REVIEW → APPROVED: im Entwurf bearbeitet der Sekretär frei, in der Überprüfung kann nur er Korrekturen vornehmen, während Mitglieder lesen, und sobald es in der nächsten Sitzung genehmigt wird, wird das Protokoll unveränderlich. Der Anfangsinhalt wird automatisch mit der vom Gesetz 1/04 geforderten Struktur erzeugt (Anwesenheit, Tagesordnung, Beschlüsse). Umlaufbeschlüsse — asynchrone Abstimmungen außerhalb einer Präsenzsitzung — haben kein separates Modul: Sie nutzen dieselbe Votes-Architektur mit mode=ASYNC und einer virtuellen Sitzung vom Typ CIRCULAR_RESOLUTION wieder, wodurch die Duplizierung der gesamten bereits validierten Unveränderlichkeitslogik vermieden wird.",
      },
      {
        title: "Zwei unabhängige RBAC-Schichten: Rolle in der Organisation und Rolle auf der Plattform",
        content:
          "Ein Nutzer hat eine Rolle innerhalb des Verwaltungsrats (PRESIDENT, BOARD_MEMBER, SECRETARY, GUEST, definiert in BoardMemberRole), die vollständig von seiner möglichen Rolle als Plattform-Administrator getrennt ist (AdminRole, nur im organisationsübergreifenden Super-Admin-Dashboard verwendet). Das Vermischen dieser beiden Dimensionen wurde früh als Quelle von Autorisierungsfehlern identifiziert — deshalb teilen sie nie dasselbe Enum oder denselben Guard, selbst wenn dieselbe Person beide Rollen innehat.",
      },
    ],
    backend: [
      {
        title: "Dynamisches Wasserzeichen, ohne die Originaldatei zu berühren",
        content:
          "Beim Anzeigen eines vertraulichen PDFs lädt das Backend die Datei aus dem privaten S3-Bucket herunter, wendet mit pdf-lib ein Wasserzeichen mit dem Namen des Mitglieds und dem exakten Datum/Uhrzeit an, lädt das Ergebnis in einen temporären Bucket hoch und gibt eine 15 Minuten gültige, vorsignierte URL zurück. Das Originaldokument wird nie verändert — jede Anzeige erzeugt ihre eigene, mit Wasserzeichen versehene Kopie, rückverfolgbar zu demjenigen, der sie angefordert hat.",
      },
      {
        title: "Virtueller Datenraum (VDR) mit granularen Berechtigungen und unveränderlichem Log",
        content:
          "Besonders vertrauliche Dokumente können in einem isolierten VdrRoom liegen, mit Berechtigungen, die Mitglied für Mitglied definiert sind (ansehen / herunterladen / drucken) und automatischem Ablauf. Jeder Zugriff — Ansicht, Download oder Druck — wird in einem Log erfasst, das nicht bearbeitet werden kann, was den Datenraum zu einem zentralen Bestandteil jeder späteren Prüfung macht.",
      },
      {
        title: "„Im Notfall nie blockieren, immer auditieren“",
        content:
          "Der Notfallzugriff ist der einzige Ablauf der Plattform, der auf null Reibung ausgelegt ist: Nur der Präsident und der Sekretär können ihn beantragen, aber wenn sie es tun, wird der Zugriff sofort für maximal 8 Stunden gewährt. Im Gegenzug werden alle anderen Präsidenten und Sekretäre in diesem Moment benachrichtigt, und jede während dieses Zugriffs durchgeführte Aktion — IP, User Agent, geöffnete Dokumente — wird unveränderlich erfasst und kann nachträglich zur Untersuchung markiert werden.",
      },
      {
        title: "Portal für externe Prüfer mit temporärer Sitzung und sofortigem Widerruf",
        content:
          "Der Sekretär generiert Zugriff für einen externen Prüfer (BNA, CMC, externer Gutachter), der ein eindeutiges Token (UUID v4 + HMAC) per E-Mail erhält. Beim Zugriff erhält der Prüfer eine 4 Stunden gültige JWT-Sitzung, navigiert durch eine schreibgeschützte Oberfläche mit automatischem Wasserzeichen auf jedem PDF, und jede Abfrage wird protokolliert. Der Sekretär kann den Zugriff jederzeit widerrufen — das Token wird sofort über eine Redis-Blacklist ungültig gemacht, ohne auf den natürlichen Ablauf zu warten.",
      },
      {
        title: "Compliance-Berichte, generiert aus denselben Governance-Daten",
        content:
          "Statt für jeden Regulator ein separates Exportformat zu pflegen, teilen sich Berichte für BNA, CMC, ARSEG oder MINFIN dieselbe zugrunde liegende Datenbasis (Zusammensetzung des Verwaltungsrats, Sitzungsaktivität, Beschlüsse, Konflikte, Audit-Log) und unterscheiden sich nur in der endgültigen Formatierung — was das Hinzufügen eines neuen Regulators ermöglicht, ohne Geschäftslogik zu replizieren.",
      },
      {
        title: "KI-Assistent als dünne Schicht über echten Daten der Organisation",
        content:
          "Das KI-Modul integriert die Anthropic-API für vier konkrete Aufgaben — Entwurf eines Protokolls aus der Tagesordnung und den Entscheidungen der Sitzung, Zusammenfassung eines Dokuments, Erkennung rechtlicher/finanzieller Risiken in einem Dokument und Vorschlag von Tagesordnungspunkten basierend auf der Historie der Organisation. Jeder Aufruf protokolliert die verbrauchten Tokens zur Kostenkontrolle pro Organisation.",
      },
    ],
    features: [
      "Sitzungseinberufung mit automatischer Quorumsberechnung",
      "Echtzeit-Abstimmung und asynchrone Umlaufbeschlüsse",
      "Protokolle mit rechtlichem Entwurfs-, Überprüfungs- und Genehmigungsablauf (Gesetz 1/04)",
      "Virtueller Datenraum (VDR) mit dynamischem Wasserzeichen und Zugriffsprotokoll",
      "Verwaltungsrat: Mitglieder, Amtszeiten, Rollen und Fachausschüsse",
      "Jährliche Interessenkonflikterklärungen und Konfliktregister, abgestimmt mit der BNA",
      "Präzedenzfall-Bibliothek mit automatischer Indexierung genehmigter Protokolle",
      "Auditierter Notfallzugriff für Präsident und Sekretär",
      "Temporäres, widerrufbares Portal für externe Prüfer",
      "Sichere verschlüsselte Nachrichten zwischen Verwaltungsratsmitgliedern",
      "KI-Assistent für Protokolle, Zusammenfassungen, Risikoerkennung und Tagesordnungsvorschläge",
      "Berichtsexport (PDF, CSV, JSON), einschließlich eines BNA/Ministeriumsberichts",
      "Organisationsübergreifendes Super-Admin-Dashboard, mit Feature Flags pro Modul",
      "Zwei-Faktor-Authentifizierung (TOTP) und vollständiges Audit-Log",
    ],
    challenges: [
      {
        title: "Die Isolierung zwischen Organisationen garantieren, selbst bei einem Programmierfehler",
        content:
          "Gelöst mit Row-Level Security direkt in Postgres als zweite Verteidigungslinie nach dem Anwendungsfilter — die Datenbank gibt nie Daten einer anderen Organisation zurück, unabhängig davon, ob ein Service vergisst, nach organizationId zu filtern.",
      },
      {
        title: "Sicherstellen, dass eine Abstimmung oder ein genehmigtes Protokoll nie als manipuliert infrage gestellt werden kann",
        content:
          "Gelöst mit einem Integritäts-Hash pro Abstimmung, einer Eindeutigkeitsbeschränkung gegen doppelte Stimmen, abgeschlossenen Abstimmungen, die neue Ballots ablehnen, und Protokollen, die sofort nach Genehmigung unveränderlich werden — jedes Element darauf ausgelegt, vor einem Regulator als Beweis standzuhalten.",
      },
      {
        title: "Notfallzugriff unterstützen, ohne eine Sicherheitslücke zu öffnen oder eine echte Krise zu verlangsamen",
        content:
          "Gelöst durch Umkehrung der üblichen Logik: Statt zu blockieren und eine Genehmigung zu verlangen, wird eingeschränkten Rollen (Präsident/Sekretär) sofort Zugriff gewährt, mit einer kurzen Zeitgrenze, sofortiger Benachrichtigung aller Verantwortlichen und einer unveränderlichen Aufzeichnung von allem, was während des Notfallfensters eingesehen wurde.",
      },
    ],
    learnings: [
      "Row-Level Security auf Datenbankebene ist ein Sicherheitsnetz, das zukünftige Fehler in der Anwendungsschicht überlebt — es lohnt sich, selbst wenn der Anwendungsfilter bereits existiert",
      "Die Wiederverwendung einer bereits validierten Architektur (Votes) für einen neuen Anwendungsfall (Umlaufbeschlüsse) ist sicherer als der Bau eines parallelen Moduls mit eigener Unveränderlichkeitslogik",
      "Die vollständige Trennung der Rolle einer Person in der Organisation von ihrer Rolle auf der Plattform vermeidet eine ganze Klasse von Autorisierungsfehlern, die nur auftreten, wenn dieselbe Person beide Rollen innehat",
      "Von Anfang an für regulatorische Compliance zu entwerfen (Gesetz 1/04, BNA-Berichte) erspart erheblichen Nacharbeitsaufwand, wenn es Zeit ist, diese Berichte zu generieren, weil die Daten bereits in der richtigen Form entstehen",
    ],
  },
  pizzaria: {
    title: "PizzaExpress",
    tagline: "Bestellverwaltungssystem für eine Pizzeria, vom Tisch über die Küche bis zur Kasse",
    overview:
      "Ein Verwaltungssystem für Pizzerien und Restaurants, das den gesamten Bestellzyklus abdeckt: Der Kunde stellt seine Bestellung an einem Tisch zusammen, die Küche empfängt sie auf einem Echtzeit-Panel nach Zubereitungsstatus organisiert, und die Verwaltung behält Tische, Nutzer, Produkte und Umsatz über ein eigenes Dashboard im Blick. Entstanden, um den Papierblock eines kleinen Restaurants durch einen digitalen Ablauf zu ersetzen, ohne die Einfachheit zu verlieren, die eine hektische Küche braucht.",
    problem:
      "In einem kleinen Restaurant ist das größte Risiko nicht fehlende Technologie — es ist eine Bestellung, die zwischen Tisch und Küche verloren geht, oder eine Rechnung, die mit dem falschen Betrag geschlossen wird. Die Herausforderung bestand darin, ein System zu bauen, in dem eine Bestellung nie \"verwaist\": Sie entsteht als Entwurf, der an einen Tisch gebunden ist, durchläuft klar definierte Zustände bis zur Auslieferung und zählt erst nach ihrem Abschluss zum Tagesumsatz — mit einem Admin-Dashboard, das dem Inhaber volle Transparenz über aktive Tische, laufende Bestellungen und Abrechnung gibt, ganz ohne Papier.",
    stack: [
      { label: "Frontend", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Polling-basierte Aktualisierung des Küchen-Panels"] },
      { label: "Backend", items: ["Node.js + Express + TypeScript", "JWT (jsonwebtoken) zur Authentifizierung", "bcrypt für Passwort-Hashing", "Multer für den Upload von Produktbildern"] },
      { label: "Datenbank", items: ["MongoDB + Mongoose", "Modelle: User, Table, Product, Category, Order"] },
      { label: "Infrastruktur", items: ["Eigenständige REST-API (Node-Backend)", "Frontend und Backend in getrennten Repositories"] },
    ],
    architecture: [
      {
        title: "Eine Bestellung entsteht als Entwurf, nie als vollendete Tatsache",
        content:
          "Jede Order hat ein draft-Flag und einen Status (Entwurf → in Zubereitung → fertig → ausgeliefert → abgeschlossen). Solange sie ein Entwurf ist, gehört die Bestellung nur dem Kunden, der sie zusammenstellt, und kann frei bearbeitet werden; sobald sie den Entwurfsstatus verlässt, sorgt ein Mongoose-pre-save-Hook automatisch dafür, dass der Status auf \"in Zubereitung\" vorrückt — so kann eine Bestellung nie als an die Küche gesendet markiert sein und trotzdem noch bearbeitbar bleiben.",
      },
      {
        title: "Der Bestellbetrag wird immer serverseitig berechnet, nie dem Client vertraut",
        content:
          "Der Preis jedes Artikels stammt zum Zeitpunkt der Bestellerstellung aus dem Product-Dokument, und eine Mongoose-Middleware berechnet Zwischensumme jeder Zeile und Gesamtbetrag der Bestellung bei jedem Speichern neu — das Frontend sendet nie einen Gesamtbetrag, nur Mengen und Produkte. Das eliminiert eine ganze Klasse von Fehlern (und Manipulationsversuchen), bei denen der dem Kunden angezeigte Betrag vom tatsächlich berechneten abweicht.",
      },
      {
        title: "Ein Tisch als Sammelpunkt für Bestellungen, nicht als einzelne Bestellung",
        content:
          "Eine Table speichert eine Liste von Referenzen auf Order-Dokumente statt einer einzigen Bestellung, weil ein Tisch in der Praxis selten nur eine Bestellung aufgibt — erst ein Getränk, dann das Essen, dann ein Dessert. Der \"Rechnung\"-Bildschirm summiert in Echtzeit alle aktiven Bestellungen dieses Tisches, und erst nach bestätigter Zahlung wechseln diese Bestellungen zu abgeschlossen und der Tisch wird wieder frei.",
      },
    ],
    backend: [
      {
        title: "REST-API in Node.js + Express",
        content:
          "Die API stellt Routen pro Ressource bereit — /api/products, /api/categories, /api/orders, /api/tables, /api/users, /api/admin/* — jede abgesichert durch JWT-Authentifizierungs-Middleware und, wo nötig, Rollenprüfung (user vs. admin). Admin-Routen sind von den normalen Bestellrouten isoliert, damit ein Autorisierungsfehler in einem Panel niemals sensible Vorgänge im anderen offenlegt.",
      },
      {
        title: "Admin-Dashboard: Umsatz, Nutzer und Verlaufsbereinigung",
        content:
          "Der AdminController berechnet den Umsatz ausschließlich aus Bestellungen mit Status abgeschlossen, gruppiert nach Produktkategorie und Zeitraum (täglich/monatlich), nie aus noch laufenden Bestellungen. Die Bereinigungsfunktion löscht ausschließlich abgeschlossene Bestellungen — aktive, in Zubereitung befindliche oder Entwurfsbestellungen bleiben stets unangetastet — und liefert dem Administrator vor Bestätigung der Aktion eine genaue Anzahl der zu entfernenden Einträge.",
      },
      {
        title: "Tischverwaltung und der Lebenszyklus einer Bestellung",
        content:
          "Der TableController stellt sicher, dass eine Tischnummer im gesamten System eindeutig ist, und pflegt die Liste der aktiven Bestellungen je Tisch. Der Statusfluss einer Bestellung (Entwurf → in Zubereitung → fertig → ausgeliefert → abgeschlossen) wird bei jedem Übergang im orderController validiert, damit die Küche niemals eine Bestellung als \"fertig\" markieren kann, die auf Kundenseite noch ein Entwurf ist.",
      },
    ],
    features: [
      "Speisekarte nach Kategorien mit Produktverfügbarkeit in Echtzeit",
      "Bestellung pro Tisch mit bearbeitbarem Entwurf vor dem Versand an die Küche",
      "Küchen-Panel mit Bestellungen nach Status organisiert (in Zubereitung / lieferbereit)",
      "Tischverwaltung mit konsolidierter Rechnung und Zahlungsabschluss",
      "Admin-Dashboard mit Nutzern, Produkten, Bestellungen und Tischen",
      "Umsatzberichte nach Zeitraum und Kategorie, mit durchschnittlichem Bestellwert",
      "Kontrollierte Verlaufsbereinigung, beschränkt auf bereits abgeschlossene Bestellungen",
    ],
    challenges: [
      {
        title: "Verhindern, dass eine Bestellung zwischen Tisch und Küche \"verschwindet\"",
        content:
          "Gelöst durch die Modellierung der Bestellung als explizite Zustandsmaschine statt eines einfachen \"gesendet/nicht gesendet\"-Booleans — jeder Übergang wird im Dokument selbst festgehalten, und sowohl das Küchen- als auch das Kunden-Panel lesen stets denselben Status aus derselben Quelle der Wahrheit.",
      },
      {
        title: "Sicherstellen, dass das Schließen einer Tischrechnung nie eine Bestellung verliert oder dupliziert",
        content:
          "Gelöst, indem die Table ausschließlich Referenzen auf Bestellungen speichert, nie eine Kopie ihrer Werte — die Rechnung wird stets im Moment der Anfrage aus den realen Bestellungen neu berechnet, statt einen \"zwischengespeicherten\" Betrag am Tisch selbst zu führen, der von der Realität abweichen könnte.",
      },
    ],
    learnings: [
      "Die Bestellung von Anfang an als Zustandsmaschine zu modellieren erspart es, Übergangsregeln später zu \"flicken\", wenn bereits reale Daten in Produktion existieren",
      "Niemals einem vom Client kommenden Geldbetrag vertrauen — immer serverseitig neu berechnen, selbst bei einfachen internen Vorgängen wie einer Tischbestellung",
    ],
  },
};

export default de;
