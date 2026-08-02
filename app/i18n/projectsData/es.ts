import type { ProjectTranslationDict } from "./types";

const es: ProjectTranslationDict = {
  ecommerce: {
    title: "E-commerce",
    tagline: "Plataforma de e-commerce completa, del catálogo al pago",
    overview:
      "Una tienda online completa construida para simular la operación real de un comerciante pequeño/mediano: un catálogo de productos organizado por categoría, un carrito persistente, checkout con resumen del pedido, y una base pensada desde el primer día para soportar un panel de administración de productos y pedidos. El objetivo era construir la misma columna vertebral que impulsa tiendas como Shopify o WooCommerce, pero hecha a mano para entender exactamente qué ocurre detrás de cada clic en «Añadir al carrito».",
    problem:
      "Los comerciantes que quieren vender online se enfrentan a dos extremos: soluciones SaaS caras y poco flexibles (Shopify, Nuvemshop) o soluciones totalmente a medida, costosas de mantener. El desafío era construir una base de e-commerce open-source ligera e independiente de cualquier plataforma, que cualquier negocio pudiera clonar y adaptar a su catálogo, con control total sobre el modelo de datos, el flujo de pago y la experiencia de compra.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Context API / Zustand para el carrito"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT para autenticación", "Multer / Cloudinary para imágenes"] },
      { label: "Base de datos", items: ["MongoDB", "Mongoose (ODM)"] },
      { label: "Infraestructura", items: ["Vercel (frontend)", "Render / Railway (API)", "Stripe / Multicaixa Express (pagos)"] },
    ],
    architecture: [
      {
        title: "Next.js como capa de presentación, una API separada como fuente de verdad",
        content:
          "Opté por desacoplar completamente el frontend del backend en lugar de usar solo las API Routes de Next.js. Las páginas de catálogo y producto usan Server Components con obtención en build/revalidate (ISR) para servir HTML listo a los motores de búsqueda — esencial en un e-commerce, donde el SEO es la principal fuente de tráfico orgánico — mientras que el carrito, el checkout y el área de cuenta usan Client Components que hablan directamente con la API Node/Express vía REST. Esta separación también significa que la misma API podría alimentar una app móvil en el futuro sin ningún cambio.",
      },
      {
        title: "Modelado de datos orientado al dominio",
        content:
          "En lugar de un único documento genérico «Producto», el esquema separa Product, Category y Variant (talla/color con su propio stock y precio), permitiendo que un producto tenga múltiples variantes sin duplicar la información de marketing (descripción, imágenes, SEO). Los pedidos almacenan una instantánea del precio y nombre del producto en el momento de la compra — una decisión de arquitectura de e-commerce crítica, ya que el historial de un pedido nunca debe cambiar si el comerciante actualiza después el precio de un producto.",
      },
      {
        title: "Carrito persistente e hidratación del estado",
        content:
          "El carrito se guarda en localStorage para usuarios anónimos y se sincroniza con la cuenta en cuanto el usuario inicia sesión, fusionando ambos carritos en lugar de sobrescribir uno con otro. Esto evita el problema clásico de los e-commerce mal construidos: el cliente añade productos, inicia sesión, y el carrito «desaparece».",
      },
    ],
    backend: [
      {
        title: "API REST en Node.js + Express",
        content:
          "La API expone recursos predecibles y versionados: /api/products, /api/categories, /api/cart, /api/orders, /api/auth, /api/admin/*. Cada ruta pasa por una cadena de middlewares: validación del payload (Zod/Joi), autenticación JWT cuando corresponde, verificación de rol (cliente vs admin), y un manejador de errores central que traduce los errores de Mongoose en respuestas HTTP consistentes (400, 401, 403, 404, 409, 500) en vez de exponer stack traces al cliente.",
      },
      {
        title: "Máquina de estados del pedido",
        content:
          "Un pedido pasa por estados bien definidos — pending → paid → processing → shipped → delivered / cancelled — y cada transición se valida en el servidor, sin confiar nunca en el valor enviado por el cliente. La confirmación de pago llega vía webhook de la pasarela de pago (firma verificada con el secreto del proveedor), lo que evita el error común de marcar un pedido como pagado solo porque el navegador del cliente fue redirigido a una página de éxito.",
      },
      {
        title: "Consistencia del stock bajo concurrencia",
        content:
          "Cuando dos personas intentan comprar la última unidad de un producto al mismo tiempo, un simple «leer stock, restar, guardar» crea una condición de carrera. La reserva de stock usa un único findOneAndUpdate atómico de MongoDB con la condición stock ≥ cantidad solicitada — si la condición falla, la operación se rechaza inmediatamente y el cliente recibe «sin stock», garantizando que el stock nunca sea negativo ni siquiera bajo tráfico concurrente.",
      },
    ],
    features: [
      "Catálogo con categorías, búsqueda y filtros",
      "Página de producto con variantes (talla/color) y galería de imágenes",
      "Carrito persistente entre sesiones",
      "Checkout con resumen del pedido y cálculo de envío",
      "Autenticación de clientes y área «Mis pedidos»",
      "Panel de administración para CRUD de productos/categorías y gestión de pedidos",
    ],
    challenges: [
      {
        title: "Evitar la sobreventa de productos con stock limitado",
        content:
          "Resuelto con operaciones atómicas en MongoDB (findOneAndUpdate condicional) en lugar de un patrón de verificar-y-luego-escribir en dos pasos, eliminando la ventana en la que dos solicitudes podrían «ver» el mismo stock disponible.",
      },
      {
        title: "Mantener el historial de pedidos fiel al momento de la compra",
        content:
          "Resuelto almacenando una instantánea inmutable de los datos del producto en cada línea de pedido, en lugar de solo una referencia (ID) al producto — así los cambios futuros de precio o nombre nunca corrompen pedidos pasados.",
      },
    ],
    learnings: [
      "Separar claramente lo que debe ser un Server Component (SEO, datos públicos) de lo que debe ser un Client Component (interactividad, estado del usuario)",
      "La importancia de nunca confiar en el precio/estado enviado por el cliente — el servidor es siempre la fuente de verdad",
    ],
  },

  orbital: {
    title: "Proyecto Órbita",
    tagline: "Tienda online de tecnología con identidad visual propia",
    overview:
      "Órbita es la segunda plataforma de e-commerce del portafolio, construida sobre el mismo stack que el proyecto anterior (Next.js, Node.js, MongoDB) pero con un propósito distinto: en lugar de reutilizar el diseño, este proyecto sirvió para explorar una identidad visual y una experiencia de navegación diferentes — una tienda tech con tema oscuro, tipografía más audaz y fuerte énfasis en las imágenes de producto — validando que la misma base backend puede impulsar tiendas con «marcas» completamente distintas.",
    problem:
      "Después de construir un e-commerce genérico, el objetivo era responder a una pregunta muy común en el mundo real de las agencias: ¿cómo reutilizar una API y una lógica de negocio ya probadas para lanzar una segunda tienda, con su propia identidad visual, sin duplicar el trabajo de backend? Órbita nació como ese ejercicio de reutilización y especialización del frontend.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion para microinteracciones"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT", "Arquitectura de servicios compartida con el proyecto E-commerce"] },
      { label: "Base de datos", items: ["MongoDB", "Mongoose"] },
      { label: "Infraestructura", items: ["Vercel", "Render / Railway"] },
    ],
    architecture: [
      {
        title: "Backend como servicio reutilizable, frontend como «tema»",
        content:
          "La capa de dominio (productos, carrito, pedidos, autenticación) se diseñó como un servicio independiente de la presentación. El frontend de Órbita consume los mismos contratos de API que el proyecto E-commerce, pero con componentes de interfaz, paleta de colores y copy completamente diferentes — demostrando en la práctica que la separación frontend/backend no es solo teoría, es lo que permite lanzar una segunda tienda en mucho menos tiempo que la primera.",
      },
      {
        title: "Un design system propio sobre la misma base técnica",
        content:
          "Se construyó una nueva capa de componentes visuales (tarjetas de producto, hero destacado, navegación) usando Tailwind con sus propios tokens de color y espaciado, manteniendo los mismos hooks de datos (useProducts, useCart) del proyecto anterior — lo que redujo drásticamente el tiempo de desarrollo de la parte funcional y permitió centrar el esfuerzo en la experiencia visual.",
      },
    ],
    backend: [
      {
        title: "Mismos principios de API que el proyecto E-commerce",
        content:
          "Órbita sigue la misma filosofía de API REST en Node.js/Express con MongoDB: rutas versionadas, autenticación JWT, y la misma máquina de estados de pedido (pending → paid → shipped → delivered). Este proyecto se diferencia por su configuración multi-tenant: el esquema de producto incluye un campo storeId, permitiendo que la misma base de datos sirva a varias tiendas con catálogos aislados — la base para, eventualmente, convertir esto en una plataforma de «e-commerce as a service».",
      },
      {
        title: "Preparado para varias tiendas en la misma infraestructura",
        content:
          "Cada solicitud a la API recibe el storeId vía cabecera o subdominio, y todos los filtros de lectura/escritura en Mongoose incluyen automáticamente esa condición mediante un middleware de consulta — evitando que una tienda vea o modifique accidentalmente los datos de otra.",
      },
    ],
    features: [
      "Catálogo de productos tecnológicos con fuerte énfasis visual",
      "Carrito y checkout que comparten la lógica del proyecto E-commerce",
      "Identidad visual y navegación propias",
      "Arquitectura lista para multi-tienda (storeId por catálogo)",
    ],
    challenges: [
      {
        title: "Reutilizar la lógica sin acoplar visualmente los dos proyectos",
        content:
          "Resuelto aislando toda la lógica de datos en hooks y servicios independientes del estilo, permitiendo que el mismo hook useCart impulse dos interfaces completamente distintas sin duplicar reglas de negocio.",
      },
    ],
    learnings: [
      "Cómo diseñar una API para ser «reutilizable» desde el primer proyecto, en lugar de refactorizarla después",
      "La diferencia entre el acoplamiento visual y el acoplamiento de datos en un sistema fullstack",
    ],
  },

  "gestao-financeira": {
    title: "Sistema de Gestión Financiera Personal",
    tagline: "Seguimiento de finanzas personales con informes visuales",
    overview:
      "Una aplicación de seguimiento de finanzas personales con un panel que resume el saldo, los ingresos y los gastos del mes, un listado de transacciones categorizadas, y gráficos que muestran claramente hacia dónde va el dinero. El objetivo era ir más allá de una hoja de cálculo: dar al usuario una lectura instantánea de su salud financiera, con la misma disciplina de datos que exige un sistema contable real.",
    problem:
      "La mayoría de las personas no carecen de datos financieros — carecen de visibilidad sobre ellos. Este proyecto resuelve el problema de «a dónde va mi dinero» agregando entradas dispersas (ingresos, gastos, categorías) en un único panel, con informes que responden preguntas concretas: ¿cuánto gasté en comida este mes? ¿mi saldo está creciendo o disminuyendo?",
    stack: [
      { label: "Frontend", items: ["React", "React Router", "Context API / Redux para el estado global", "Chart.js / Recharts para los gráficos"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT para autenticación", "Validación con Zod/Joi"] },
      { label: "Base de datos", items: ["PostgreSQL", "Sequelize / Prisma (ORM)"] },
      { label: "Infraestructura", items: ["Vercel (frontend)", "Render (API + base de datos)"] },
    ],
    architecture: [
      {
        title: "Base de datos relacional para la integridad financiera",
        content:
          "A diferencia de un catálogo de productos, los datos financieros exigen fuerte consistencia: una transacción nunca puede «desaparecer» ni quedar en un estado intermedio. Por eso se eligió una base de datos relacional (PostgreSQL) en lugar de NoSQL — el esquema tiene tablas normalizadas para Users, Categories y Transactions, con claves foráneas y transacciones SQL (BEGIN/COMMIT/ROLLBACK) que garantizan que una operación compuesta (p. ej., crear una transacción y actualizar el saldo agregado) nunca quede aplicada parcialmente.",
      },
      {
        title: "Separación entre datos crudos y datos agregados",
        content:
          "El panel no recalcula todo en el frontend en cada render. Las agregaciones mensuales (ingresos totales, gastos totales, saldo, distribución por categoría) se calculan en el backend mediante consultas SQL de agregación (GROUP BY mes/categoría), devolviendo al frontend solo números ya listos para los gráficos — reduciendo drásticamente el volumen de datos transferidos y el procesamiento realizado en el navegador.",
      },
      {
        title: "La categorización como entidad de primera clase",
        content:
          "Las categorías de gasto/ingreso las gestiona el propio usuario (no un enum fijo), con una categoría «Otros» por defecto. Fue una decisión deliberada: un sistema de finanzas personales solo es útil si se adapta a la vida de quien lo usa, no a lo que el desarrollador pensó que tenía sentido.",
      },
    ],
    backend: [
      {
        title: "API Node.js + Express orientada a informes",
        content:
          "Además de los endpoints CRUD habituales (/api/transactions, /api/categories), la API expone endpoints de informes dedicados como /api/reports/monthly y /api/reports/by-category, que ejecutan las agregaciones directamente en la base de datos en vez de devolver todas las transacciones para que el cliente las sume — un principio de rendimiento importante: las agregaciones pertenecen a la base de datos, no al frontend.",
      },
      {
        title: "Autenticación y aislamiento de datos por usuario",
        content:
          "Cada transacción pertenece exactamente a un usuario, y todas las consultas del backend filtran obligatoriamente por el userId extraído del token JWT — nunca del cuerpo de la solicitud — impidiendo que un usuario acceda accidentalmente a las transacciones de otra persona, incluso por un error del frontend.",
      },
      {
        title: "Validación estricta de los valores monetarios",
        content:
          "Los valores monetarios se validan y almacenan como enteros (céntimos) en lugar de números de punto flotante, evitando los clásicos errores de redondeo del dinero en JavaScript (0.1 + 0.2 !== 0.3), convirtiendo a formato decimal solo en la capa de presentación.",
      },
    ],
    features: [
      "Panel con saldo, ingresos y gastos del mes",
      "Registro de transacciones con categorías personalizables",
      "Gráficos de evolución mensual y distribución por categoría",
      "Filtros por período y por categoría",
      "Autenticación y datos aislados por usuario",
    ],
    challenges: [
      {
        title: "Evitar errores de redondeo en los valores monetarios",
        content:
          "Resuelto almacenando todos los valores como céntimos enteros en la base de datos, y convirtiendo a formato decimal (ej.: 1050 → 10,50 Kz) solo al presentarlos al usuario.",
      },
      {
        title: "Panel rápido incluso con muchas transacciones",
        content:
          "Resuelto trasladando las agregaciones (sumas, promedios, agrupaciones) a consultas SQL del backend en lugar de calcularlas en JavaScript en el frontend por cada transacción cargada.",
      },
    ],
    learnings: [
      "Cuándo elegir una base de datos relacional en vez de NoSQL — la integridad y las transacciones importan más que la flexibilidad del esquema",
      "Tratar el dinero como enteros, nunca como flotantes",
    ],
  },

  "gestao-stock": {
    title: "Gestión de Stock",
    tagline: "Control de inventario con historial de movimientos auditable",
    overview:
      "Un sistema completo de gestión de stock/inventario, pensado para pequeñas y medianas empresas que necesitan saber, en cualquier momento, cuánto tienen de cada producto, quién lo movió y por qué. Cubre todo el ciclo: entradas de mercancía, salidas por venta, ajustes de inventario, proveedores y alertas de stock mínimo.",
    problem:
      "Muchas pymes todavía controlan el stock en hojas de Excel compartidas, donde es fácil perder el historial de «quién cambió qué» y son comunes las discrepancias entre el stock «en papel» y el stock real en almacén. El objetivo era construir un sistema donde cada cambio de stock se registre como un movimiento auditable, nunca como una actualización silenciosa de un número plano.",
    stack: [
      { label: "Frontend", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "TanStack Table para los listados"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT + roles (admin/operador)", "Validación con Zod"] },
      { label: "Base de datos", items: ["MySQL", "Sequelize / Prisma (ORM)", "Transacciones SQL para los movimientos"] },
      { label: "Infraestructura", items: ["Vercel (frontend)", "Railway / VPS (API + MySQL)"] },
    ],
    architecture: [
      {
        title: "Kardex: el stock como resultado de movimientos, nunca un número editable",
        content:
          "La decisión arquitectónica más importante de este proyecto: el campo «stock actual» de un producto nunca se edita directamente. En su lugar existe una tabla stock_movements (entrada, salida, ajuste, devolución), y el stock actual siempre es la suma de todos los movimientos de ese producto — el mismo principio usado en los sistemas contables (libro mayor / kardex). Esto significa que siempre se puede responder «por qué este producto tiene 12 unidades» con una lista completa y cronológica de eventos, nunca con un número sin explicación.",
      },
      {
        title: "MySQL y transacciones ACID para la consistencia del inventario",
        content:
          "MySQL se eligió frente a una base de datos NoSQL precisamente por la necesidad de transacciones ACID: registrar una salida de stock requiere, en la misma transacción, insertar el movimiento y verificar que el stock resultante no sea negativo — y si algún paso falla, toda la transacción se revierte (ROLLBACK), sin dejar nunca el inventario en un estado inconsistente.",
      },
      {
        title: "Roles diferenciados: operador vs administrador",
        content:
          "Los operadores de almacén pueden registrar entradas/salidas pero no pueden eliminar el historial ni cambiar los precios de coste; solo los administradores tienen acceso a los informes financieros y a la gestión de proveedores — reflejando la separación de responsabilidades que existe en una empresa real.",
      },
    ],
    backend: [
      {
        title: "API Node.js + Express estructurada por dominio",
        content:
          "Endpoints organizados por recurso de negocio: /api/products, /api/suppliers, /api/movements, /api/reports/low-stock. Cada ruta de escritura sobre movements se ejecuta dentro de una transacción MySQL explícita, y el umbral de stock mínimo por producto activa una alerta consultable vía /api/reports/low-stock, usada por el frontend para resaltar los productos a reponer.",
      },
      {
        title: "Informes de valor del inventario",
        content:
          "El backend calcula el valor total del inventario (cantidad × coste medio ponderado) mediante consultas SQL agregadas, no en JavaScript — una elección tanto de rendimiento como de corrección, ya que el coste medio ponderado debe recalcularse en cada entrada de stock con un precio diferente al anterior.",
      },
    ],
    features: [
      "Registro de entradas, salidas y ajustes de stock",
      "Historial completo y auditable por producto (kardex)",
      "Gestión de proveedores y costes",
      "Alertas de stock mínimo",
      "Informes de valor del inventario",
      "Roles de acceso: operador y administrador",
    ],
    challenges: [
      {
        title: "Garantizar que el stock nunca sea negativo bajo operaciones concurrentes",
        content:
          "Resuelto con transacciones SQL explícitas: la verificación del stock disponible y la inserción del movimiento de salida ocurren dentro del mismo BEGIN/COMMIT, con bloqueo de fila (SELECT ... FOR UPDATE) sobre el producto durante la operación.",
      },
      {
        title: "Explicar las discrepancias de inventario",
        content:
          "Resuelto haciendo que el stock sea un valor derivado del historial de movimientos en lugar de un campo directamente editable — cualquier discrepancia siempre se puede rastrear hasta un movimiento específico, con un usuario y una marca de tiempo.",
      },
    ],
    learnings: [
      "El patrón kardex/libro mayor se aplica mucho más allá de la contabilidad — cualquier sistema de «cantidad que cambia con el tiempo» se beneficia de él",
      "Cuándo usar el bloqueo de filas para proteger operaciones concurrentes en una base de datos relacional",
    ],
  },

  "landing-page": {
    title: "Landing Page",
    tagline: "Página de conversión de alto rendimiento, sin backend",
    overview:
      "Una landing page de conversión al estilo de los embudos de venta de productos digitales (p. ej., Hotmart): un titular potente sobre el pliegue, bloques de beneficios, prueba social y una llamada a la acción repetida estratégicamente a lo largo de la página. Este proyecto se construyó deliberadamente sin backend propio — el foco estaba 100% en el rendimiento de carga y el copywriting orientado a conversión, no en la lógica del servidor.",
    problem:
      "Una landing page de venta vive o muere según la velocidad de carga y la claridad del mensaje en los primeros segundos. El objetivo era construir una página que cargara casi instantáneamente (Core Web Vitals en verde) y guiara visualmente al visitante, sin distracciones, hasta el botón de compra — sin ninguna dependencia de servidor que pudiera introducir latencia.",
    stack: [
      { label: "Frontend", items: ["React", "Vite", "CSS Modules / Tailwind CSS", "Framer Motion para revelados al hacer scroll"] },
      { label: "Integraciones", items: ["Formulario conectado a un webhook externo (Hotmart / plataforma de checkout)", "Google Analytics / Meta Pixel para seguimiento de conversión"] },
      { label: "Infraestructura", items: ["Vercel (hosting estático)"] },
    ],
    architecture: [
      {
        title: "Una página totalmente estática, sin servidor propio — por elección, no por limitación",
        content:
          "A diferencia de los demás proyectos de este portafolio, esta página no tiene (ni necesita) backend: se sirve como HTML/CSS/JS estático a través de la CDN de Vercel, lo que implica tiempos de respuesta casi instantáneos en cualquier parte del mundo. Todo el proceso de compra se delega a una plataforma de checkout externa (el estándar real del mercado de infoproductos), y la página simplemente guía al visitante hacia allí.",
      },
      {
        title: "Estructura de secciones pensada como un embudo, no como un sitio",
        content:
          "Cada sección de la página tiene un único objetivo persuasivo — captar atención, generar deseo, eliminar objeciones, crear urgencia — siguiendo el orden clásico de un embudo de ventas (AIDA). Los componentes de React son deliberadamente «tontos» (sin lógica de negocio), porque el verdadero trabajo de ingeniería aquí está en el rendimiento y el copywriting, no en la arquitectura de datos.",
      },
    ],
    backend: [],
    features: [
      "Hero con propuesta de valor clara sobre el pliegue",
      "Secciones de beneficios y prueba social",
      "Llamadas a la acción (CTA) repetidas estratégicamente",
      "Animaciones de entrada al hacer scroll",
      "Optimizada para Core Web Vitals (LCP, CLS, INP)",
    ],
    challenges: [
      {
        title: "Maximizar la velocidad de carga sin sacrificar la animación",
        content:
          "Resuelto usando imágenes optimizadas y lazy loading fuera del pliegue inicial, y limitando las animaciones pesadas (Framer Motion) a los elementos que entran en el viewport, evitando un coste de renderizado antes de que sean vistos.",
      },
    ],
    learnings: [
      "No todos los proyectos necesitan un backend — a veces la mejor arquitectura es la más simple que resuelve el problema",
      "El rendimiento percibido en una landing page de venta impacta directamente en la tasa de conversión",
    ],
  },
  argpack: {
    title: "ArgPack",
    tagline: "Marketplace que conecta a productores argentinos con afiliados que venden sus productos en Brasil",
    overview:
      "Un marketplace de micro-exportación que conecta a pequeños productores argentinos (vino, alimentos, artesanía, cuero) con afiliados brasileños que promocionan y venden esos productos a través de su propio enlace de referido, ganando una comisión por cada venta confirmada. La plataforma tiene tres perfiles: el productor, que gestiona su catálogo y ventas; el afiliado, que genera enlaces de producto y hace seguimiento de sus ganancias y nivel de comisión; y el administrador, que supervisa toda la operación.",
    problem:
      "Un pequeño productor argentino rara vez tiene un equipo de ventas o marketing digital propio para llegar al mercado brasileño, y un afiliado que quiere promocionar productos físicos de nicho no tiene una forma sencilla de generar enlaces rastreables y cobrar de forma transparente por ello. ArgPack resuelve ambos lados a la vez: le da al productor un catálogo y escaparate, y al afiliado un sistema de referidos con comisión automática.",
    stack: [
      { label: "Frontend", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Context API (carrito, lista de deseos, autenticación)"] },
      { label: "Backend", items: ["Node.js + Express + TypeScript", "JWT (jsonwebtoken) para autenticación", "Zod para validación de payloads", "Helmet + CORS + Morgan"] },
      { label: "Base de datos", items: ["MongoDB + Mongoose", "Modelos: User, Producer, Affiliate, Product, Sale, Order"] },
      { label: "Infraestructura", items: ["Vercel (frontend)", "API REST separada (backend Node)"] },
    ],
    architecture: [
      {
        title: "Tres roles, un único modelo de usuario",
        content:
          "Existe una única colección User con un campo userType (affiliate | producer | admin), y cada rol tiene luego su propio documento de perfil (Producer o Affiliate) enlazado por userId. Esto evita duplicar la lógica de autenticación para cada tipo de cuenta y mantiene el JWT genérico — el middleware de autorización decide qué puede ver cada rol a partir de un único campo.",
      },
      {
        title: "Comisión del afiliado calculada en el servidor, nunca confiada al cliente",
        content:
          "Cada afiliado tiene un referralCode único y un nivel (Bronce 5%, Plata 10% con 10+ ventas/mes, Oro 15% con 50+ ventas/mes). Cuando se registra una venta con un código de referido, el backend resuelve el afiliado propietario del código, calcula la comisión a partir de la tabla de niveles (nunca de un valor enviado por el cliente) y recalcula el nivel del afiliado en cada venta confirmada.",
      },
      {
        title: "Sale como registro por línea de producto, Order como el pedido completo",
        content:
          "Un checkout puede incluir varios productos de varios productores diferentes. En lugar de almacenar todo dentro de Order, cada línea de producto genera su propio documento Sale (con el producerId, el afiliado asignado y la comisión ya calculada), mientras que Order almacena los datos del pedido en sí — dirección de envío, método de pago, cupón aplicado. Esto permite que cada productor vea solo sus propias ventas sin exponer el pedido completo de otro productor.",
      },
    ],
    backend: [
      {
        title: "Modelo de datos: productores, productos, afiliados y ventas",
        content:
          "Producer almacena los datos de la empresa (nombre, tipo de producto, ubicación, plan). Product pertenece a un Producer y tiene una categoría (vino, alimentos, artesanía, cuero), precio y stock. Affiliate almacena el código de referido, el nivel actual y los totales de ventas y ganancias. Sale relaciona un Product con un Producer y, opcionalmente, con un Affiliate, almacenando el valor total, la tasa de comisión aplicada y el estado (pending → confirmed → paid, o cancelled).",
      },
      {
        title: "Flujo de checkout con atribución de afiliado",
        content:
          "El frontend guarda el código de referido capturado desde la URL (?ref=CODE) en localStorage con una validez de 30 días, de forma similar a una cookie de atribución. En el checkout, ese código viaja con el pedido; el backend resuelve el afiliado, genera una Sale por cada artículo del carrito con la comisión ya calculada, descuenta el stock del producto y devuelve un número de pedido (p. ej., ARG-8F42A1). Envío gratis por encima de R$300, cupón de descuento opcional, y tres métodos de pago simulados (tarjeta, Pix, boleto).",
      },
    ],
    features: [
      "Catálogo de productos filtrable por categoría (vino, alimentos, artesanía, cuero)",
      "Sistema de afiliados con enlace de referido único y 3 niveles de comisión automáticos",
      "Carrito y checkout con cupón de descuento y envío gratis a partir de un valor mínimo",
      "Panel del productor con ventas, productos e ingresos confirmados",
      "Panel del afiliado con progreso hacia el siguiente nivel e historial de comisiones",
      "Panel de administración con visión general de la plataforma y gestión de usuarios",
    ],
    challenges: [
      {
        title: "Atribuir correctamente una venta al afiliado correcto, incluso en carritos con varios productos",
        content:
          "Resuelto tratando cada línea del carrito como una Sale independiente en lugar de dividir la comisión de un único registro de pedido — cada línea hereda el mismo referralCode del momento del checkout, lo que hace trivial que un productor vea solo sus ventas y un afiliado solo las ventas que generó, sin cálculos cruzados.",
      },
      {
        title: "Evitar que el cliente manipule la tasa de comisión",
        content:
          "La tasa de comisión nunca viene del frontend — siempre se lee de la tabla TIER_RULES del backend según el nivel actual del afiliado almacenado en la base de datos, cerrando la puerta a que un comprador (o afiliado) intente enviar manualmente una tasa más alta.",
      },
    ],
    learnings: [
      "Modelar las ventas por línea de producto (no por pedido completo) simplifica mucho las consultas de «mis ventas» cuando hay varios productores y afiliados en el mismo checkout",
      "Almacenar las reglas de negocio (como los niveles de comisión) en una única fuente de verdad en el backend evita duplicar la misma lógica en varios controladores",
    ],
  },

  "games-hub": {
    title: "Games Hub",
    tagline: "Hub de minijuegos casuales, 100% en el navegador",
    overview:
      "Un hub con varios minijuegos casuales (juego de memoria y otros), funcionando enteramente en el navegador sin ninguna dependencia de servidor. El foco de este proyecto fue la arquitectura frontend: cómo estructurar varios juegos independientes que comparten componentes comunes (temporizador, marcador, sistema de puntuación) sin que la lógica de un juego «se filtre» hacia otro.",
    problem:
      "Construir varios juegos en una sola aplicación fácilmente resulta en código acoplado, donde cambiar las reglas de un juego arriesga romper otro. El desafío era diseñar una arquitectura donde cada juego sea una unidad aislada y reemplazable, con un «motor» común (estado del juego, temporizador, mejor puntuación) reutilizado por todos.",
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Context API + useReducer por juego", "CSS Modules"] },
      { label: "Persistencia local", items: ["localStorage para récords y progreso (sin backend)"] },
      { label: "Infraestructura", items: ["Vercel (hosting estático)"] },
    ],
    architecture: [
      {
        title: "Cada juego como un módulo aislado con una interfaz común",
        content:
          "Todos los juegos implementan la misma «interfaz» conceptual: un estado inicial, una función reducer (useReducer) que procesa los movimientos, y un componente de marcador. Esto significa que el componente Scoreboard, el Timer y el sistema de «mejor puntuación» son genéricos y se reutilizan en cualquier juego nuevo — añadir un juego al hub no requiere tocar código de los juegos existentes.",
      },
      {
        title: "TypeScript como red de seguridad entre juegos",
        content:
          "Tipos genéricos (Game<State, Action>) garantizan, en tiempo de compilación, que cada juego implemente correctamente el contrato esperado por el hub — evitando el error común en los hubs de juegos en JavaScript donde un juego mal implementado rompe silenciosamente el marcador general.",
      },
    ],
    backend: [],
    features: [
      "Juego de memoria con niveles de dificultad",
      "Sistema de puntuación y récords personales (localStorage)",
      "Temporizador reutilizable entre juegos",
      "Arquitectura modular lista para nuevos juegos",
    ],
    challenges: [
      {
        title: "Añadir nuevos juegos sin duplicar la lógica de marcador/temporizador",
        content:
          "Resuelto extrayendo un «motor» de juego genérico (hooks useGameTimer, useScoreboard) independiente de cualquier juego específico, usado mediante composición en cada nuevo juego añadido al hub.",
      },
    ],
    learnings: [
      "Cómo diseñar interfaces genéricas en TypeScript (Game<State, Action>) para forzar la consistencia entre módulos independientes",
      "La persistencia local (localStorage) es suficiente y apropiada cuando no hay una necesidad real de compartir datos entre dispositivos",
    ],
  },

  primeflix: {
    title: "PrimeFlix",
    tagline: "Descubrimiento de películas en tendencia, consumiendo una API pública",
    overview:
      "Una aplicación para descubrir películas en tendencia y ver sus detalles (sinopsis, calificación, reparto, fecha de estreno), consumiendo una API pública de películas (TMDB). El foco del proyecto fue la capa de integración con una API externa: cómo estructurar las llamadas HTTP, manejar errores y límites de tasa, y mantener la interfaz responsiva incluso con datos llegando de forma asíncrona.",
    problem:
      "Consumir de forma robusta una API pública de terceros es más difícil de lo que parece: las claves de API no pueden exponerse descuidadamente, las solicitudes pueden fallar o quedar limitadas (rate limiting), y la experiencia de usuario no puede «congelarse» esperando la respuesta. El objetivo era construir esa capa de integración de forma limpia y reutilizable.",
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Axios (instancia configurada + interceptores)", "React Query para el caché de solicitudes"] },
      { label: "Integración externa", items: ["API pública de The Movie Database (TMDB)", "Variables de entorno para la clave de API"] },
      { label: "Infraestructura", items: ["Vercel (hosting estático)"] },
    ],
    architecture: [
      {
        title: "Instancia de Axios dedicada con interceptores",
        content:
          "En lugar de llamar a axios.get directamente en cada componente, existe una única instancia de Axios (api.ts) con una baseURL y clave de API preconfiguradas, e interceptores de respuesta que manejan de forma centralizada los errores 401/429 (límite de solicitudes superado) y formatean mensajes de error amigables — evitando duplicar el manejo de errores en cada llamada.",
      },
      {
        title: "Hooks dedicados por tipo de dato (useTrendingMovies, useMovieDetails)",
        content:
          "Cada necesidad de datos tiene su propio hook, responsable de llamar a la API, gestionar los estados de carga/error y (con React Query) cachear los resultados — evitando solicitudes repetidas a la API pública para los mismos filtros de búsqueda, lo que también ayuda a no agotar el límite gratuito de solicitudes de TMDB.",
      },
      {
        title: "Búsqueda con debounce para reducir llamadas innecesarias",
        content:
          "La búsqueda de películas solo dispara una solicitud a la API 400ms después de que el usuario deja de escribir, en lugar de en cada pulsación de tecla — una optimización simple pero esencial al consumir una API externa con límites de uso.",
      },
    ],
    backend: [],
    features: [
      "Listados de películas en tendencia y por categoría",
      "Búsqueda de películas con debounce",
      "Página de detalle con sinopsis, calificación y reparto",
      "Estados de carga y error manejados de forma consistente",
    ],
    challenges: [
      {
        title: "Evitar agotar el límite de solicitudes de la API pública",
        content:
          "Resuelto combinando el debounce de búsqueda con el caché de resultados de React Query, reduciendo drásticamente el número de llamadas repetidas a TMDB para las mismas búsquedas.",
      },
      {
        title: "Mantener la interfaz responsiva durante solicitudes asíncronas",
        content:
          "Resuelto con estados de carga dedicados por sección de la página (skeleton loaders), en lugar de bloquear toda la página esperando una sola respuesta.",
      },
    ],
    learnings: [
      "Centralizar la configuración del cliente HTTP (Axios) en una única instancia evita la duplicación e inconsistencia en el manejo de errores",
      "El caché del lado del cliente (React Query) es tan importante como el caché del lado del servidor cuando se depende de APIs de terceros con límites de uso",
    ],
  },
  barbearia: {
    title: "Barbería",
    tagline: "Reservas online con panel de administración y pagos",
    overview:
      "Una plataforma de reservas para una barbería, con selección de servicio, barbero y horario disponible, un panel de administración para que el barbero gestione su agenda, e integración de pago para confirmar la reserva con un depósito por adelantado. Construida como una aplicación Next.js fullstack, usando el propio Next.js (App Router + Route Handlers) como capa de backend en lugar de un servidor Express separado.",
    problem:
      "Las reservas hechas por WhatsApp o teléfono son fáciles de perder de vista y no evitan los «no-shows» (clientes que reservan y no se presentan). El objetivo era digitalizar el proceso de reserva de principio a fin: mostrar solo los horarios realmente disponibles, evitar reservas duplicadas para el mismo barbero/horario, y reducir las ausencias exigiendo un pequeño depósito al momento de reservar.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "React Hook Form + Zod para la validación"] },
      { label: "Backend", items: ["Next.js Route Handlers (API integrada, sin servidor Express separado)", "NextAuth para la autenticación del panel de administración"] },
      { label: "Base de datos", items: ["PostgreSQL", "Prisma ORM"] },
      { label: "Pagos", items: ["Integración con pasarela de pago (Multicaixa Express / Stripe) para el depósito de la reserva"] },
      { label: "Infraestructura", items: ["Vercel (frontend + Route Handlers)", "Supabase / Railway (PostgreSQL)"] },
    ],
    architecture: [
      {
        title: "Next.js fullstack: Route Handlers como backend, sin servidor separado",
        content:
          "A diferencia de los proyectos de e-commerce (donde el backend es un servicio Node/Express independiente), aquí se optó por mantener todo dentro del propio Next.js mediante Route Handlers (app/api/.../route.ts). Para un dominio de este tamaño — reservas, servicios, barberos — la complejidad operativa de mantener dos despliegues separados (frontend y backend) no estaba justificada; Next.js fullstack entrega el mismo producto con la mitad de la infraestructura a gestionar.",
      },
      {
        title: "Modelado de disponibilidad: horarios derivados, no una tabla gigante de agenda",
        content:
          "En lugar de pregenerar una fila en la base de datos para cada horario posible de cada día (lo que crece indefinidamente), los horarios disponibles se calculan dinámicamente: el backend cruza el horario laboral del barbero con las reservas ya existentes ese día, devolviendo solo los intervalos que siguen libres. Esto mantiene la base de datos pequeña y siempre correcta, sin necesidad de tareas periódicas de limpieza.",
      },
      {
        title: "Reserva de horario con transacción para evitar doble reserva",
        content:
          "Cuando un cliente confirma un horario, la creación de la reserva se ejecuta dentro de una transacción de Prisma que primero verifica, con un bloqueo, que ese barbero sigue libre en ese intervalo — si dos clientes intentan reservar el mismo horario simultáneamente, solo el primero en completar la transacción obtiene la reserva; el segundo recibe inmediatamente un error de «horario ya ocupado».",
      },
    ],
    backend: [
      {
        title: "Route Handlers organizados por dominio de negocio",
        content:
          "/api/services (servicios y precios), /api/professionals (barberos y horarios laborales), /api/availability (cálculo de horarios libres), /api/bookings (creación y gestión de reservas) y /api/payments/webhook (confirmación asíncrona del depósito pagado). Los Route Handlers de administración exigen una sesión válida vía NextAuth con rol «admin», mientras que los de reserva pública son accesibles a cualquier visitante, pero con validación estricta de entrada vía Zod.",
      },
      {
        title: "Depósito de pago como confirmación de compromiso",
        content:
          "Una reserva solo pasa de pending_payment a confirmed cuando la pasarela de pago notifica exitosamente al webhook — nunca solo porque el cliente fue redirigido de vuelta al sitio. Las reservas que permanecen más de X minutos en pending_payment sin confirmación se liberan automáticamente, devolviendo el horario a la disponibilidad general.",
      },
      {
        title: "Panel de administración con la agenda del día",
        content:
          "El barbero autenticado ve la agenda del día agrupada por profesional, puede reservar manualmente a clientes que llaman por teléfono, y cancelar/reprogramar horarios — todas las operaciones pasan por la misma capa de validación de disponibilidad usada por el cliente final, garantizando que nunca hay dos caminos distintos (y potencialmente inconsistentes) para crear una reserva.",
      },
    ],
    features: [
      "Selección de servicio, profesional y horario disponible",
      "Cálculo dinámico de disponibilidad (sin horarios fantasma)",
      "Depósito de pago para confirmar la reserva",
      "Panel de administración con la agenda del día por profesional",
      "Prevención de reservas duplicadas para el mismo horario",
    ],
    challenges: [
      {
        title: "Evitar que dos clientes reserven el mismo horario",
        content:
          "Resuelto con una transacción de base de datos que verifica y reserva el horario de forma atómica, en lugar de dos operaciones separadas (verificar disponibilidad, luego crear la reserva) que dejarían una ventana de tiempo vulnerable.",
      },
      {
        title: "Reducir las ausencias sin ahuyentar a los clientes con un proceso de pago pesado",
        content:
          "Resuelto exigiendo solo un depósito parcial (no el valor total del servicio) al momento de reservar, equilibrando el compromiso del cliente con la fricción del proceso de reserva.",
      },
    ],
    learnings: [
      "Cuándo optar por un backend integrado en Next.js (Route Handlers) en lugar de un servicio Express separado — depende del tamaño real del dominio, no de una preferencia personal",
      "La disponibilidad de la agenda siempre debe calcularse, nunca almacenarse como una lista fija de horarios",
    ],
  },

  neoxia: {
    title: "Neoxia",
    tagline: "Sitio institucional para una agencia de marketing digital",
    overview:
      "Un sitio institucional para Neoxia, una agencia de marketing digital, presentando sus servicios, casos de éxito y una vía directa de contacto para clientes potenciales. A diferencia de los proyectos de e-commerce o SaaS de este portafolio, el objetivo aquí no era un sistema con muchos datos dinámicos, sino una presencia digital rápida, creíble y orientada a generar contactos comerciales (leads).",
    problem:
      "Una agencia de marketing digital es, en sí misma, la primera prueba de su propia credibilidad: si el sitio institucional es lento, genérico o no genera leads cualificados, eso socava el propio argumento de venta de la agencia. El desafío era construir un sitio que reflejara profesionalismo técnico y convirtiera a los visitantes en solicitudes de contacto reales.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion para transiciones de sección"] },
      { label: "Backend", items: ["Route Handler dedicado de Next.js para el formulario de contacto", "Resend (envío de email transaccional)"] },
      { label: "Infraestructura", items: ["Vercel (frontend + Route Handler)", "Renderizado estático (SSG) para todas las páginas de contenido"] },
    ],
    architecture: [
      {
        title: "Un sitio casi totalmente estático, con una única isla dinámica",
        content:
          "La gran mayoría de las páginas (servicios, sobre nosotros, casos de éxito) se generan estáticamente (SSG) en el momento del build, garantizando tiempos de carga mínimos y un SEO excelente — esencial para una agencia que depende del tráfico de búsqueda orgánica. La única parte verdaderamente «dinámica» del sitio es el formulario de contacto, aislado como la única funcionalidad que realmente necesita ejecutarse en el servidor.",
      },
      {
        title: "Formulario de contacto como Route Handler + servicio de email transaccional",
        content:
          "El formulario envía a un Route Handler (app/api/contact/route.ts) que valida los datos del lado del servidor (sin confiar nunca solo en la validación del cliente), aplica un límite simple de solicitudes por IP para mitigar el spam, y usa Resend para enviar el email de la solicitud de contacto directamente a la bandeja de entrada de la agencia — sin necesidad de mantener una base de datos solo para almacenar mensajes de contacto.",
      },
      {
        title: "El contenido como el verdadero producto del proyecto",
        content:
          "Para un sitio institucional, la arquitectura del código es deliberadamente simple; el esfuerzo de ingeniería se invirtió en rendimiento (Core Web Vitals), accesibilidad y claridad del copy — porque eso es lo que determina si una agencia de marketing luce ella misma bien posicionada en marketing.",
      },
    ],
    backend: [
      {
        title: "Sin base de datos — envío directo por email transaccional",
        content:
          "En lugar de almacenar las solicitudes de contacto en una base de datos para revisarlas manualmente más tarde, el Route Handler envía la solicitud directamente por email vía Resend en cuanto se envía — reduciendo la complejidad operativa a cero (sin base de datos que mantener) al costo de no tener un historial consultable, un trade-off aceptable para el volumen esperado de un sitio institucional.",
      },
      {
        title: "Protección básica contra spam y envíos abusivos",
        content:
          "El Route Handler aplica validación estricta de esquema (Zod) y un límite de envíos por IP en una ventana de tiempo corta, evitando que el formulario se use para enviar spam masivo a través de la infraestructura de email de la agencia.",
      },
    ],
    features: [
      "Presentación de servicios de marketing digital",
      "Sección de casos de éxito/portafolio de la agencia",
      "Formulario de contacto con envío directo por email",
      "Sitio totalmente estático y optimizado para SEO",
    ],
    challenges: [
      {
        title: "Generar contactos comerciales sin la complejidad de una base de datos",
        content:
          "Resuelto optando por el envío directo de email transaccional (Resend) desde un único Route Handler, en lugar de construir un sistema de almacenamiento y gestión de leads desproporcionado para la escala del proyecto.",
      },
    ],
    learnings: [
      "No todos los formularios de contacto necesitan una base de datos — a veces el email transaccional es la solución más simple y correcta",
      "Para sitios institucionales, el SEO y el rendimiento de carga son, en la práctica, funcionalidades de negocio",
    ],
  },
  qrcodepay: {
    title: "QrCodePay",
    tagline: "Plataforma de pagos por código QR para comercios, con incorporación por invitación y panel administrativo completo",
    overview:
      "QrCodePay es una plataforma de pagos por código QR diseñada para comercios que quieren aceptar pagos digitales sin depender de un único banco o billetera móvil. Cada comercio tiene un código QR fijo para su tienda (para pagos genéricos) y puede generar códigos QR dinámicos por transacción, con un monto, referencia única y expiración — el mismo patrón usado por los sistemas de pago instantáneo por QR en varios mercados emergentes. Más allá de la experiencia del comercio, el proyecto incluye un panel de administración completo, con gestión de comercios, usuarios, invitaciones de acceso, transacciones y un registro de auditoría del sistema.",
    problem:
      "Los comercios pequeños y medianos que quieren aceptar pagos digitales rápidos enfrentan una experiencia fragmentada: cada banco o billetera móvil tiene su propia app, su propio QR y su propio flujo de confirmación. El objetivo del proyecto era construir una capa de pagos por código QR propia — con el mismo rigor que un producto financiero real: estados de transacción bien definidos, confirmación asíncrona nunca confiada al navegador del cliente, expiración automática de pagos no cobrados, y un registro de auditoría completo de todo lo que ocurre en el sistema.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "TanStack Query para el caché y sincronización de datos del servidor"] },
      { label: "Backend", items: ["Node.js", "Express", "TypeScript", "JWT para autenticación", "Job en segundo plano para la expiración de pagos"] },
      { label: "Base de datos", items: ["MongoDB", "Mongoose (ODM)"] },
      { label: "Infraestructura", items: ["Docker + Docker Compose (frontend, backend, base de datos y proxy)", "Nginx como reverse proxy", "Configuración separada para desarrollo y producción"] },
    ],
    architecture: [
      {
        title: "Incorporación cerrada por invitación, no registro público",
        content:
          "No existe una página pública de «crear cuenta»: un administrador genera una invitación ligada a un email, el sistema envía un enlace de registro único con un período de validez, y solo quien tiene ese enlace puede crear la cuenta de comercio. En una plataforma que mueve dinero, esta es una decisión de seguridad deliberada — elimina por completo la superficie de ataque de registros automáticos o cuentas fraudulentas, al costo de más fricción en la incorporación, un trade-off aceptable para este tipo de producto.",
      },
      {
        title: "Dos tipos de código QR para dos casos de uso distintos",
        content:
          "El código QR estático del comercio existe una sola vez, nunca expira, y sirve para pagos genéricos en una tienda física (el cliente escanea e introduce el monto). El código QR dinámico, en cambio, se genera por transacción, ya viene con el monto definido, tiene una referencia única y una validez corta — pensado para situaciones donde el monto se conoce de antemano (p. ej., checkout, factura). Esta distinción se refleja en el resto de la arquitectura, incluyendo cómo se valida cada tipo de QR en el backend.",
      },
      {
        title: "Tres perfiles de uso sobre la misma API",
        content:
          "La aplicación frontend se divide en tres zonas con sus propios layouts y permisos: la página pública de pago (para el cliente final que escanea el QR), el panel del comercio (dashboard, creación de pagos, transacciones, perfil) y el panel de administración (comercios, invitaciones, usuarios, transacciones globales, registros del sistema). Las tres zonas consumen la misma API REST, pero cada ruta del backend valida el rol del usuario autenticado antes de exponer cualquier dato.",
      },
      {
        title: "Infraestructura containerizada desde el primer día",
        content:
          "El proyecto nunca funcionó «solo en la máquina local»: frontend, backend y base de datos están definidos en Docker Compose desde el inicio, con Nginx delante actuando como reverse proxy. Esto obligó a pensar temprano en variables de entorno, redes internas entre contenedores y scripts de arranque para desarrollo y producción desde la primera versión, en lugar de dejar esa complejidad para el final.",
      },
    ],
    backend: [
      {
        title: "Máquina de estados de la solicitud de pago",
        content:
          "Un pago pasa por estados bien definidos — created → pending → confirmed / failed — y cada transición se valida explícitamente en el servidor antes de aplicarse; una transición que no tiene sentido (p. ej., intentar confirmar un pago ya fallido) se rechaza. Esto evita que una solicitud malformada o una carrera entre solicitudes deje una transacción en un estado inconsistente.",
      },
      {
        title: "Expiración automática de pagos no cobrados",
        content:
          "Un proceso en segundo plano se ejecuta periódicamente y busca solicitudes de pago que hayan superado su período de validez sin confirmación, marcándolas como expiradas y registrando el motivo en el historial de la transacción. Esto significa que un código QR dinámico olvidado no queda «pendiente» para siempre en el panel del comercio — el sistema se autolimpia sin necesidad de intervención manual.",
      },
      {
        title: "Confirmación de pago nunca confiada al cliente",
        content:
          "Igual que en el proyecto de e-commerce de este portafolio, un pago solo se marca como confirmado mediante una notificación asíncrona validada en el servidor — nunca solo porque el navegador del cliente fue redirigido a una página de «éxito». Esta es una regla que se repite en todo sistema de pagos bien construido, y se replicó aquí a propósito.",
      },
      {
        title: "Registro de auditoría para todo el sistema",
        content:
          "Cada evento relevante — creación de invitación, cambio de estado de un pago, acción de un administrador — genera un registro de auditoría con el actor, el tipo de evento y los metadatos relevantes, consultable en el panel de «Registros del sistema» del administrador. En una plataforma financiera, saber exactamente qué ocurrió y cuándo no es opcional.",
      },
      {
        title: "Limitación de tasa en rutas sensibles",
        content:
          "Los endpoints críticos como el login y la creación de invitaciones tienen limitación de tasa de solicitudes, reduciendo la superficie de ataque de fuerza bruta o abuso automatizado sin afectar el uso normal.",
      },
    ],
    features: [
      "Incorporación de comercios cerrada, solo por invitación con un período de validez",
      "Código QR estático permanente por comercio",
      "Código QR dinámico por transacción, con monto, referencia y expiración automática",
      "Panel del comercio con ingresos, transacciones recientes y acciones rápidas",
      "Panel de administración con visión global de comercios, usuarios y transacciones",
      "Estado de salud del sistema visible en el panel de administración",
      "Historial de transacciones con filtros y búsqueda",
      "Registro de auditoría de eventos del sistema",
      "Recuperación de contraseña y flujo de autenticación basado en JWT",
      "Infraestructura totalmente containerizada con Docker Compose",
    ],
    challenges: [
      {
        title: "Evitar que un pago se confirme por error",
        content:
          "Resuelto con validación explícita de transiciones de estado en el servidor — cada cambio de estado se verifica contra una lista de transiciones permitidas antes de guardarse, en lugar de aceptar ciegamente cualquier actualización.",
      },
      {
        title: "Evitar que los pagos olvidados saturen el panel del comercio",
        content:
          "Resuelto con un proceso en segundo plano que expira automáticamente las solicitudes de pago no cobradas que superan su plazo, sin depender de que el comercio o el cliente hagan algo.",
      },
      {
        title: "Equilibrar seguridad y rapidez en la incorporación de nuevos comercios",
        content:
          "Resuelto con un flujo de invitación: más lento que un registro público instantáneo, pero elimina por completo las cuentas fraudulentas o de prueba en una plataforma que maneja dinero — un trade-off deliberado a favor de la seguridad.",
      },
    ],
    learnings: [
      "Diseñar una máquina de estados explícita, incluso en un proyecto personal, obliga a pensar en todos los caminos posibles de una transacción — no solo en el camino feliz",
      "Un proceso en segundo plano simple (verificar y expirar) resuelve un problema de integridad de datos que de otro modo requeriría lógica compleja dispersa en varios puntos de la aplicación",
      "Tener Docker Compose desde el principio, no solo al final, obliga a resolver temprano problemas de configuración entre servicios que de otro modo solo aparecerían en producción",
      "La incorporación cerrada por invitación es, en muchos productos financieros, una funcionalidad de seguridad tan importante como la propia autenticación",
    ],
  },
  crfdesk: {
    title: "CRFDesk",
    tagline: "Plataforma de screening y cumplimiento para activos cripto, con scoring de riesgo explicable e informes listos para reguladores",
    overview:
      "CRFDesk es una plataforma de screening y cumplimiento para activos cripto, construida para equipos que necesitan evaluar el riesgo de una wallet, transacción o contrato antes de aceptar o procesar una operación. En lugar de devolver solo «riesgo alto» o «riesgo bajo», el sistema produce una puntuación cuantificada, explicada factor por factor, con historial y versionado por entidad, y puede generar tanto informes de análisis como Reportes de Actividad Sospechosa (SAR) formales, con un flujo de aprobación por un supervisor antes de cualquier envío. También incluye un panel de administración multiusuario, gestión de claves de API para integraciones externas, y un panel de uso por plan.",
    problem:
      "Los equipos de cumplimiento de exchanges y fintechs de cripto no pueden justificar una decisión de «riesgo alto» ante un regulador o auditor con una caja negra — necesitan saber exactamente qué factores contribuyeron a la puntuación, con qué peso y con qué nivel de confianza. El desafío de este proyecto fue construir un motor de riesgo diseñado para ser explicable desde su raíz, no solo un número aislado: cada resultado de screening tiene que poder sostenerse por sí solo como evidencia documental, con historial de versiones y un rastro de auditoría completo.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion", "TanStack Query"] },
      { label: "Backend", items: ["Node.js", "Express", "TypeScript", "Cola de jobs en segundo plano", "Generación de informes PDF"] },
      { label: "Base de datos", items: ["MongoDB", "Mongoose (ODM)", "Modelos dedicados para screenings, informes, SAR y registros de auditoría"] },
      { label: "Infraestructura", items: ["Docker + Docker Compose", "Nginx como reverse proxy", "Autenticación por clave de API para integraciones externas", "Webhooks configurables"] },
    ],
    architecture: [
      {
        title: "Un único orquestador para todo el flujo de screening",
        content:
          "Toda solicitud de screening pasa obligatoriamente por un único servicio orquestador, que encadena validación de la solicitud, cálculo de riesgo, generación del detalle de la puntuación, versionado, actualización de la línea de tiempo de la entidad, generación de informe, registro de auditoría, notificaciones y contabilización del uso del plan. Los controladores de la API nunca llaman a los servicios internos de forma aislada — esto garantiza que ningún screening pueda «saltarse» un paso obligatorio del flujo, algo esencial para un producto cuya salida puede terminar como evidencia ante un regulador.",
      },
      {
        title: "Puntuación construida a partir de factores de riesgo explicables, no un número mágico",
        content:
          "En lugar de un único valor sin explicación, cada screening produce una lista de factores de riesgo («reason codes»), cada uno con una categoría, descripción, puntos asignados, peso porcentual, fuente de evidencia y nivel de confianza (alto/medio/bajo). La puntuación final es la suma explicable de estos factores, agrupados por categoría con su respectiva severidad — diseñada para que un equipo de cumplimiento pueda justificar cada punto del resultado ante un auditor.",
      },
      {
        title: "Versionado y línea de tiempo de riesgo por entidad",
        content:
          "Cada nuevo screening sobre la misma dirección o wallet genera una nueva versión de la puntuación, en lugar de reemplazar la anterior. Esto permite reconstruir cómo evolucionó el riesgo de una entidad a lo largo del tiempo — importante porque una evaluación hecha hoy puede depender de información que solo existía en una versión más reciente, y la plataforma debe poder mostrar esa diferencia de forma auditable.",
      },
      {
        title: "Procesamiento pesado aislado en una cola de jobs, fuera de la solicitud HTTP",
        content:
          "Los análisis multi-cadena y la generación extensa de informes PDF no bloquean la respuesta al usuario: se colocan en una cola y se procesan en segundo plano por un conjunto dedicado de workers, notificando al usuario cuando el resultado está disponible. Esto mantiene la interfaz responsiva incluso cuando un análisis tarda varios segundos en completarse.",
      },
      {
        title: "Sello de integridad en informes ya emitidos",
        content:
          "Una vez generado, un informe pasa por un servicio de integridad que impide cambios silenciosos en su contenido — una garantía necesaria cuando el documento puede terminar siendo usado como evidencia formal ante una autoridad.",
      },
    ],
    backend: [
      {
        title: "Flujo de Reporte de Actividad Sospechosa (SAR) con aprobación jerárquica",
        content:
          "Un analista puede generar un borrador de SAR a partir de un screening de riesgo alto o crítico, completando una justificación; el informe solo pasa de borrador a aprobado (y luego enviado) con la aprobación explícita y registrada de un supervisor. No existe ningún camino de envío automático — la decisión humana es siempre un paso obligatorio y auditable del flujo.",
      },
      {
        title: "Aplicación del cupo del plan antes de cualquier operación costosa",
        content:
          "Cada organización tiene un límite de screenings e informes definido por su plan, verificado antes de iniciar cualquier operación con un coste computacional significativo — evitando procesar una solicitud pesada que de todos modos sería rechazada después por exceder el límite.",
      },
      {
        title: "Claves de API con su propio alcance, independientes del login de usuario",
        content:
          "Las integraciones externas (por ejemplo, un sistema que necesita hacer screening automático de cada retiro de fondos) se autentican con claves de API dedicadas, generadas y revocables en cualquier momento desde el panel — sin compartir credenciales de usuario ni requerir una sesión interactiva.",
      },
      {
        title: "Factor de riesgo país como componente aislado y reemplazable",
        content:
          "La jurisdicción asociada a una operación entra en el motor de riesgo a través de un adaptador dedicado, separado de la lógica central de scoring — permitiendo actualizar la lista de países o regiones de alto riesgo sin tocar el resto del motor.",
      },
      {
        title: "Notificaciones asíncronas por webhook",
        content:
          "Los sistemas externos pueden suscribirse a eventos (p. ej., «informe completado» o «SAR aprobado») mediante webhooks configurables, en lugar de tener que consultar la API repetidamente esperando un cambio de estado.",
      },
    ],
    features: [
      "Screening de direcciones, transacciones y contratos en múltiples blockchains",
      "Puntuación de riesgo cuantificada con detalle factor por factor",
      "Historial y línea de tiempo de riesgo por entidad",
      "Generación de informes de análisis en PDF con sello de integridad",
      "Flujo de Reporte de Actividad Sospechosa (SAR) con aprobación del supervisor",
      "Panel de administración multiusuario",
      "Gestión de claves de API para integraciones externas",
      "Webhooks configurables para notificación de eventos",
      "Panel de uso y límites del plan contratado",
      "Registro de auditoría completo de todas las acciones",
    ],
    challenges: [
      {
        title: "Hacer que la puntuación sea completamente explicable, sin que sea una caja negra",
        content:
          "Resuelto con un motor de factores de riesgo («reason codes») categorizados, cada uno con su propio peso y nivel de confianza, en lugar de un único número sin justificación — cada resultado se puede desglosar y presentar a un auditor.",
      },
      {
        title: "Garantizar que un informe ya emitido no pueda alterarse después",
        content:
          "Resuelto con un servicio de integridad dedicado que valida el contenido del informe tras su emisión, protegiendo documentos que puedan terminar usados como evidencia formal.",
      },
      {
        title: "Procesar análisis pesados sin bloquear la experiencia del usuario",
        content:
          "Resuelto aislando el trabajo pesado (análisis multi-cadena, generación de PDF) en una cola de jobs en segundo plano, manteniendo la solicitud HTTP original rápida y la interfaz responsiva.",
      },
    ],
    learnings: [
      "Un motor de riesgo pensado para ser explicable desde el inicio cambia completamente el diseño de los datos — deja de ser «calcular un número» y pasa a ser «construir un caso justificable»",
      "Separar la autenticación de usuario de la autenticación por clave de API es esencial en cuanto un producto necesita soportar integraciones externas automatizadas",
      "Un patrón de orquestador único, por el que todo debe pasar, es una forma efectiva de garantizar que los flujos regulatorios nunca queden incompletos por accidente",
      "Aplicar los límites del plan antes de las operaciones costosas, y no después, ahorra recursos y evita la frustración del usuario",
    ],
  },
  "boardgov-ao": {
    title: "BoardGov AO",
    tagline: "Plataforma multi-tenant de gobierno corporativo para consejos de administración angoleños, con reuniones, votaciones y actas legalmente defendibles",
    overview:
      "BoardGov AO es una plataforma de gobierno corporativo multi-tenant construida para consejos de administración de organizaciones angoleñas — bancos, aseguradoras, corredoras y empresas públicas sujetas a la supervisión del BNA, la CMC u otros reguladores. Digitaliza todo el ciclo de vida de un consejo: convocatoria de reuniones con cálculo automático de quórum, votación en tiempo real y resoluciones circulares asíncronas, redacción y aprobación de actas siguiendo la estructura legal de la Ley 1/04, una sala de datos confidencial con marca de agua dinámica, declaraciones anuales de conflicto de interés, un registro de conflictos, comités especializados, una biblioteca de precedentes consultable, acceso de emergencia auditado, un portal temporal para auditores externos, y un asistente de IA que redacta borradores de actas y resume documentos. También hay un panel de super-administración separado para gestionar todas las organizaciones cliente de la plataforma, usuarios, feature flags por módulo y salud del sistema.",
    problem:
      "En Angola, el gobierno de los consejos de administración todavía ocurre en gran medida en papel y en archivos sueltos: convocatorias enviadas por email sin registro formal, actas escritas después de la reunión en Word, votos que nadie puede probar que ocurrieron exactamente como se describe, y declaraciones de conflicto de interés archivadas en una carpeta rara vez revisada. Cuando llega una inspección del BNA o una auditoría externa, reconstruir ese historial es lento y frágil. El desafío de este proyecto fue construir una plataforma donde cada acto de gobierno — un voto, un acta aprobada, el acceso a un documento confidencial — quede registrado de una forma que resista el escrutinio, sin volver el día a día del consejo más burocrático de lo que ya es.",
    stack: [
      { label: "Frontend", items: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS 4", "Radix UI (dialog, tabs, tooltip, select)"] },
      { label: "Backend", items: ["NestJS 11", "TypeScript", "Passport + JWT (access/refresh)", "Speakeasy (2FA / TOTP)", "PDFKit para informes", "Winston (registro estructurado)", "@anthropic-ai/sdk (asistente de IA)"] },
      { label: "Base de datos", items: ["PostgreSQL", "Prisma ORM", "Row-Level Security nativa de Postgres para el aislamiento multi-tenant", "Migraciones versionadas"] },
      { label: "Infraestructura", items: ["Docker + workspaces (api / web / database / shared)", "AWS S3 (documentos)", "AWS SES (emails)", "Redis / ioredis (lista negra de tokens, colas)", "Scheduler (@nestjs/schedule) para tareas diarias"] },
    ],
    architecture: [
      {
        title: "Aislamiento multi-tenant reforzado a nivel de base de datos, no solo en la aplicación",
        content:
          "Más allá del filtro habitual por organizationId en los servicios, Postgres tiene Row-Level Security activado en todas las tablas sensibles: al inicio de cada transacción la aplicación establece SET LOCAL app.current_organisation_id, y una política RLS filtra automáticamente cualquier SELECT, INSERT o UPDATE en base a ese valor — de forma transparente para Prisma. Esto significa que incluso si un error de la capa de aplicación olvida filtrar por organización, la base de datos sigue impidiendo el acceso cruzado entre clientes. Existe un bypass explícito (app.bypass_rls) reservado solo para migraciones y seeds.",
      },
      {
        title: "Una máquina de estados explícita para el ciclo de vida de una reunión",
        content:
          "Una reunión solo puede transitar entre estados (DRAFT → CONVENED → IN_PROGRESS → COMPLETED, o CANCELLED desde DRAFT/CONVENED) a través de un mapa de transiciones válidas verificado antes de cualquier cambio de estado — cualquier intento de saltar directamente de borrador a reunión completada se rechaza. El quórum se calcula automáticamente en el momento en que la reunión comienza (achievedPercent frente al quorumPercent definido por la organización o por la propia reunión), y ese porcentaje se registra en el evento de inicio, nunca se recalcula después.",
      },
      {
        title: "Votos con hash de integridad, inmutables por diseño",
        content:
          "Cada voto (ballot) genera un hash SHA-256 sobre el id del voto, el miembro, el valor votado y el instante exacto del voto. Una vez enviado, un ballot no puede alterarse ni eliminarse, y una restricción de unicidad en la base de datos impide que el mismo miembro vote dos veces en la misma votación. Una vez cerrada, una votación ya no acepta nuevos ballots. Las abstenciones por conflicto de interés (CONFLICT_ABSTENTION) se registran pero se excluyen del cálculo de mayoría — el resultado es siempre una simple comparación entre los votos a favor y en contra de los miembros sin conflicto.",
      },
      {
        title: "Actas con flujo legal, y arquitectura reutilizada para resoluciones circulares",
        content:
          "Las actas siguen DRAFT → UNDER_REVIEW → APPROVED: en borrador el Secretario edita libremente, en revisión solo él puede hacer correcciones mientras los miembros leen, y una vez aprobada en la siguiente reunión el acta se vuelve inmutable. El contenido inicial se autogenera con la estructura exigida por la Ley 1/04 (asistencia, orden del día, resoluciones). Las resoluciones circulares — votaciones asíncronas fuera de una reunión presencial — no tienen un módulo separado: reutilizan la misma arquitectura de Votos con mode=ASYNC y una reunión virtual de tipo CIRCULAR_RESOLUTION, evitando duplicar toda la lógica de inmutabilidad ya validada.",
      },
      {
        title: "RBAC en dos capas independientes: rol en la organización y rol en la plataforma",
        content:
          "Un usuario tiene un rol dentro del consejo (PRESIDENT, BOARD_MEMBER, SECRETARY, GUEST, definido en BoardMemberRole) completamente separado de su posible rol como administrador de la plataforma (AdminRole, usado solo en el panel de super-administración multi-organización). Mezclar estas dos dimensiones se identificó temprano como una fuente de errores de autorización — por eso nunca comparten el mismo enum ni el mismo guard, incluso cuando la misma persona ocupa ambos roles.",
      },
    ],
    backend: [
      {
        title: "Marca de agua dinámica sin tocar el archivo original",
        content:
          "Al visualizar un PDF confidencial, el backend descarga el archivo del bucket privado de S3, aplica una marca de agua con el nombre del miembro y la fecha/hora exacta usando pdf-lib, sube el resultado a un bucket temporal y devuelve una URL prefirmada válida por 15 minutos. El documento original nunca se modifica — cada visualización genera su propia copia con marca de agua, rastreable hasta quien la solicitó.",
      },
      {
        title: "Sala de Datos Virtual (VDR) con permisos granulares y registro inmutable",
        content:
          "Los documentos especialmente confidenciales pueden vivir en una VdrRoom aislada, con permisos definidos miembro por miembro (ver / descargar / imprimir) y expiración automática. Cada acceso — visualización, descarga o impresión — se registra en un log que no puede editarse, lo que convierte la sala de datos en una pieza central de cualquier auditoría posterior.",
      },
      {
        title: "«Nunca bloquear en una emergencia, siempre auditar»",
        content:
          "El acceso de emergencia es el único flujo de la plataforma diseñado para tener cero fricción: solo el Presidente y el Secretario pueden solicitarlo, pero cuando lo hacen, el acceso se concede de inmediato, por un máximo de 8 horas. A cambio, todos los demás Presidentes y Secretarios reciben una notificación en ese momento, y cada acción realizada durante ese acceso — IP, user agent, documentos abiertos — se registra de forma inmutable, pudiendo ser marcada para investigación posterior.",
      },
      {
        title: "Portal de auditores externos con sesión temporal y revocación inmediata",
        content:
          "El Secretario genera acceso para un auditor externo (BNA, CMC, revisor externo), quien recibe un token único (UUID v4 + HMAC) por email. Al acceder, el auditor obtiene una sesión JWT válida por 4 horas, navega por una interfaz de solo lectura con marca de agua automática en cualquier PDF, y cada consulta queda registrada. El Secretario puede revocar el acceso en cualquier momento — el token se invalida de inmediato mediante una lista negra en Redis, sin esperar la expiración natural.",
      },
      {
        title: "Informes de cumplimiento generados a partir de los mismos datos de gobierno",
        content:
          "En lugar de mantener un formato de exportación separado por regulador, los informes para el BNA, la CMC, la ARSEG o el MINFIN comparten la misma base de datos subyacente (composición del consejo, actividad de reuniones, resoluciones, conflictos, registro de auditoría) y solo difieren en el formato final — lo que permite añadir un nuevo regulador sin replicar lógica de negocio.",
      },
      {
        title: "Asistente de IA como una capa fina sobre los datos reales de la organización",
        content:
          "El módulo de IA integra la API de Anthropic para cuatro tareas concretas — redactar el borrador de un acta a partir del orden del día y las decisiones de la reunión, resumir un documento, detectar riesgos legales/financieros en un documento, y sugerir puntos del orden del día basándose en el historial de la organización. Cada llamada registra los tokens consumidos, para el control de costes por organización.",
      },
    ],
    features: [
      "Convocatoria de reuniones con cálculo automático de quórum",
      "Votación en tiempo real y resoluciones circulares asíncronas",
      "Actas con flujo legal de borrador, revisión y aprobación (Ley 1/04)",
      "Sala de Datos Virtual (VDR) con marca de agua dinámica y registro de accesos",
      "Consejo de administración: miembros, mandatos, roles y comités especializados",
      "Declaraciones anuales de conflicto de interés y registro de conflictos, alineados con el BNA",
      "Biblioteca de precedentes con indexación automática a partir de actas aprobadas",
      "Acceso de emergencia auditado para el Presidente y el Secretario",
      "Portal temporal y revocable para auditores externos",
      "Mensajería segura cifrada entre miembros del consejo",
      "Asistente de IA para actas, resúmenes, detección de riesgos y sugerencia de orden del día",
      "Exportación de informes (PDF, CSV, JSON), incluyendo un informe BNA/Ministerio",
      "Panel de super-administración multi-organización, con feature flags por módulo",
      "Autenticación de dos factores (TOTP) y registro de auditoría completo",
    ],
    challenges: [
      {
        title: "Garantizar el aislamiento entre organizaciones incluso ante un error de programación",
        content:
          "Resuelto con Row-Level Security directamente en Postgres, como segunda línea de defensa tras el filtro de la aplicación — la base de datos nunca devuelve datos de otra organización, sin importar que un servicio olvide filtrar por organizationId.",
      },
      {
        title: "Asegurar que un voto o un acta aprobada nunca pueda cuestionarse como manipulado",
        content:
          "Resuelto con un hash de integridad por voto, una restricción de unicidad contra votos duplicados, votaciones cerradas que rechazan nuevos votos, y actas que se vuelven inmutables en cuanto se aprueban — cada pieza pensada para sostenerse como evidencia ante un regulador.",
      },
      {
        title: "Soportar el acceso de emergencia sin abrir un agujero de seguridad ni frenar una crisis real",
        content:
          "Resuelto invirtiendo la lógica habitual: en lugar de bloquear y exigir aprobación, el acceso se concede de inmediato a roles restringidos (Presidente/Secretario), con un límite de tiempo corto, notificación instantánea a todos los responsables, y un registro inmutable de todo lo consultado durante la ventana de emergencia.",
      },
    ],
    learnings: [
      "La Row-Level Security a nivel de base de datos es una red de seguridad que sobrevive a futuros errores en la capa de aplicación — vale la pena incluso cuando el filtro de la aplicación ya existe",
      "Reutilizar una arquitectura ya validada (Votos) para un nuevo caso de uso (resoluciones circulares) es más seguro que construir un módulo paralelo con su propia lógica de inmutabilidad",
      "Separar completamente el rol de alguien en la organización de su rol en la plataforma evita toda una clase de errores de autorización que solo aparecen cuando la misma persona ocupa ambos",
      "Diseñar desde el inicio para el cumplimiento regulatorio (Ley 1/04, informes del BNA) ahorra un retrabajo significativo cuando llega el momento de generar esos informes, porque los datos ya nacen con la forma correcta",
    ],
  },
};

export default es;
