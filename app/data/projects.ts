export interface StackGroup {
  label: string;
  items: string[];
}

export interface ContentBlock {
  title: string;
  content: string;
}

export interface ProjectData {
  slug: string;
  title: string;
  tagline: string;
  technologies: string[];
  image: string;
  gallery: string[];
  link: string;
  github: string;
  hasLiveBackend: boolean;
  overview: string;
  problem: string;
  stack: StackGroup[];
  architecture: ContentBlock[];
  backend: ContentBlock[];
  features: string[];
  challenges: ContentBlock[];
  learnings: string[];
}

export const projects: ProjectData[] = [
  // 1. E-COMMERCE
  {
    slug: "ecommerce",
    title: "E-commerce",
    tagline: "Plataforma de e-commerce completa, do catálogo ao checkout",
    technologies: ["Next.js", "Node.js", "MongoDB"],
    image: "/images/ecommerce.jpg",
    gallery: [
      "/images/projetos/ecommerce/ecommerce-1.png",
      "/images/projetos/ecommerce/ecommerce-2.png",
      "/images/projetos/ecommerce/ecommerce-3.png",
      "/images/projetos/ecommerce/ecommerce-4.png",
      "/images/projetos/ecommerce/ecommerce-6.png",
      "/images/projetos/ecommerce/ecommerce-7.png",
      "/images/projetos/ecommerce/ecommerce-8.png",
      "/images/projetos/ecommerce/ecommerce-9.png",
    ],
    link: "https://ecommerce-five-lime-36.vercel.app/",
    github: "https://github.com/KucoO1/ecommerce",
    hasLiveBackend: false,
    overview:
      "Loja online completa construída para simular a operação real de um pequeno/médio comerciante: catálogo de produtos organizado por categorias, carrinho persistente, checkout com resumo de encomenda e uma base pensada desde o início para suportar um painel administrativo de gestão de produtos e encomendas. O objetivo era construir a mesma espinha dorsal que suporta lojas como a Shopify ou a WooCommerce, mas feita à mão para perceber exatamente o que acontece por trás de cada clique em \"Adicionar ao carrinho\".",
    problem:
      "Comerciantes que querem vender online enfrentam duas opções extremas: soluções SaaS caras e pouco flexíveis (Shopify, Nuvemshop) ou soluções totalmente customizadas e caras de manter. O desafio proposto foi construir uma base de e-commerce open-source, leve e sem dependências de plataforma, que qualquer negócio pudesse clonar e adaptar ao seu catálogo, com total controlo sobre o modelo de dados, o fluxo de pagamento e a experiência de compra.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Context API / Zustand para o carrinho"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT para autenticação", "Multer / Cloudinary para imagens"] },
      { label: "Base de dados", items: ["MongoDB", "Mongoose (ODM)"] },
      { label: "Infraestrutura", items: ["Vercel (frontend)", "Render / Railway (API)", "Stripe / Multicaixa Express (pagamentos)"] },
    ],
    architecture: [
      {
        title: "Next.js como camada de apresentação, API separada como fonte da verdade",
        content:
          "Optei por desacoplar completamente o frontend do backend em vez de usar apenas API Routes do Next.js. As páginas de catálogo e produto usam Server Components com fetch em build/revalidate (ISR) para servirem HTML já pronto aos motores de busca — essencial num e-commerce, onde SEO é a principal fonte de tráfego orgânico — enquanto o carrinho, o checkout e a área de conta usam Client Components que conversam diretamente com a API Node/Express via REST. Esta separação também significa que a mesma API pode alimentar, no futuro, uma app mobile sem qualquer alteração.",
      },
      {
        title: "Modelação de dados orientada ao domínio",
        content:
          "Em vez de um único documento \"Product\" genérico, o schema separa Product, Category e Variant (tamanho/cor com stock e preço próprios), permitindo que um produto tenha várias variantes sem duplicar informação de marketing (descrição, imagens, SEO). As encomendas guardam uma cópia (\"snapshot\") do preço e do nome do produto no momento da compra — decisão crítica de arquitetura de e-commerce, porque o histórico de uma encomenda nunca pode mudar se o lojista atualizar o preço de um produto mais tarde.",
      },
      {
        title: "Carrinho persistente e hidratação de estado",
        content:
          "O carrinho é guardado no localStorage para utilizadores anónimos e sincronizado com a conta assim que o utilizador inicia sessão, fazendo merge dos dois carrinhos em vez de sobrepor um ao outro. Isto evita o problema clássico de e-commerces mal feitos: o cliente adiciona produtos, faz login, e o carrinho \"desaparece\".",
      },
    ],
    backend: [
      {
        title: "API REST em Node.js + Express",
        content:
          "A API expõe recursos previsíveis e versionados: /api/products, /api/categories, /api/cart, /api/orders, /api/auth, /api/admin/*. Cada rota passa por uma cadeia de middlewares: validação de payload (Zod/Joi), autenticação JWT quando necessário, verificação de papel (customer vs admin) e um error handler central que traduz erros do Mongoose em respostas HTTP consistentes (400, 401, 403, 404, 409, 500) em vez de expor stack traces ao cliente.",
      },
      {
        title: "Máquina de estados da encomenda",
        content:
          "Uma encomenda percorre estados bem definidos — pending → paid → processing → shipped → delivered / cancelled — e cada transição é validada no servidor, nunca confiando no valor enviado pelo cliente. A confirmação de pagamento chega por webhook do gateway de pagamento (assinatura verificada com o segredo do provedor), o que evita o erro comum de marcar uma encomenda como paga apenas porque o browser do cliente redirecionou para a página de sucesso.",
      },
      {
        title: "Consistência de stock sob concorrência",
        content:
          "Quando duas pessoas tentam comprar a última unidade de um produto ao mesmo tempo, um simples \"ler stock, subtrair, guardar\" cria uma condição de corrida. A reserva de stock usa um único findOneAndUpdate atómico do MongoDB com a condição stock ≥ quantidade pedida — se a condição falhar, a operação é rejeitada de imediato e o cliente recebe \"produto esgotado\", garantindo que o stock nunca fica negativo mesmo sob tráfego simultâneo.",
      },
    ],
    features: [
      "Catálogo com categorias, pesquisa e filtros",
      "Página de produto com variantes (tamanho/cor) e galeria de imagens",
      "Carrinho persistente entre sessões",
      "Checkout com resumo de encomenda e cálculo de portes",
      "Autenticação de cliente e área \"As minhas encomendas\"",
      "Painel administrativo para CRUD de produtos, categorias e gestão de encomendas",
    ],
    challenges: [
      {
        title: "Evitar overselling de produtos com stock limitado",
        content:
          "Resolvido com operações atómicas no MongoDB (findOneAndUpdate condicional) em vez de lógica de verificação e escrita em dois passos, eliminando a janela de tempo onde duas requisições poderiam \"ver\" o mesmo stock disponível.",
      },
      {
        title: "Manter o histórico de encomendas fiel ao momento da compra",
        content:
          "Resolvido guardando uma cópia imutável (snapshot) dos dados do produto em cada linha da encomenda, em vez de apenas uma referência (ID) ao produto — assim alterações futuras de preço ou nome não corrompem encomendas antigas.",
      },
    ],
    learnings: [
      "Separar claramente o que deve ser Server Component (SEO, dados públicos) do que deve ser Client Component (interatividade, estado do utilizador)",
      "A importância de nunca confiar no preço/estado enviado pelo cliente — o servidor é sempre a fonte da verdade",
    ],
  },

  // 2. ÓRBITA
  {
    slug: "orbital",
    title: "Projeto Órbita",
    tagline: "Loja online de tecnologia com uma identidade visual própria",
    technologies: ["Next.js", "Node.js", "MongoDB"],
    image: "/images/orbita.jpg",
    gallery: [
      "/images/projetos/orbital/orbital-1.png",
      "/images/projetos/orbital/orbital-2.png",
      "/images/projetos/orbital/orbital-3.png",
      "/images/projetos/orbital/orbital-6.png",
      "/images/projetos/orbital/orbital-7.png",
      "/images/projetos/orbital/orbital-9.png",
      "/images/projetos/orbital/orbital-11.png",
      "/images/projetos/orbital/orbital-13.png",
    ],
    link: "https://orbita-mocha-nine.vercel.app/",
    github: "https://github.com/KucoO1/orbita",
    hasLiveBackend: false,
    overview:
      "A Órbita é a segunda plataforma de e-commerce do portefólio, construída sobre a mesma stack do projeto anterior (Next.js, Node.js, MongoDB) mas com um propósito diferente: em vez de reaproveitar o design, este projeto serviu para explorar uma identidade visual e uma experiência de navegação distintas — uma loja de tecnologia com um tema escuro, tipografia mais bold e ênfase forte em imagens de produto — validando que a mesma base de backend pode alimentar lojas com \"marcas\" completamente diferentes.",
    problem:
      "Depois de construir um e-commerce genérico, o objetivo era responder a uma pergunta muito comum no mundo real das agências: como reaproveitar uma API e uma lógica de negócio já testadas para lançar uma segunda loja, com identidade visual própria, sem duplicar o trabalho de backend? A Órbita nasceu como esse exercício de reutilização e especialização de frontend.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion para micro-interações"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT", "Arquitetura de serviços partilhada com o projeto E-commerce"] },
      { label: "Base de dados", items: ["MongoDB", "Mongoose"] },
      { label: "Infraestrutura", items: ["Vercel", "Render / Railway"] },
    ],
    architecture: [
      {
        title: "Backend como serviço reutilizável, frontend como \"tema\"",
        content:
          "A camada de domínio (produtos, carrinho, encomendas, autenticação) foi pensada como um serviço independente da apresentação. O frontend da Órbita consome os mesmos contratos de API do projeto E-commerce, mas com componentes de UI, paleta de cores e copy completamente diferentes — provando na prática que a separação frontend/backend não é só teoria, é o que permite lançar uma segunda loja em muito menos tempo do que a primeira.",
      },
      {
        title: "Design system próprio sobre a mesma fundação técnica",
        content:
          "Foi construída uma nova camada de componentes visuais (cartões de produto, hero de destaque, navegação) usando Tailwind com tokens de cor e espaçamento próprios, mantendo os mesmos hooks de dados (useProducts, useCart) do projeto anterior — o que reduziu drasticamente o tempo de desenvolvimento da parte funcional e permitiu focar o esforço na experiência visual.",
      },
    ],
    backend: [
      {
        title: "Mesmos princípios de API do projeto E-commerce",
        content:
          "A Órbita segue a mesma filosofia de API REST em Node.js/Express com MongoDB: rotas versionadas, autenticação JWT, e a mesma máquina de estados de encomenda (pending → paid → shipped → delivered). Onde este projeto se diferencia é na configuração multi-tenant: o schema de produto inclui um campo storeId, permitindo que a mesma base de dados sirva múltiplas lojas com catálogos isolados — a base para, no futuro, transformar isto numa plataforma \"e-commerce as a service\".",
      },
      {
        title: "Preparado para múltiplas lojas na mesma infraestrutura",
        content:
          "Cada pedido à API recebe o storeId através de um cabeçalho ou subdomínio, e todos os filtros de leitura/escrita no Mongoose incluem essa condição automaticamente através de um middleware de query — evitando que uma loja veja ou altere acidentalmente dados de outra.",
      },
    ],
    features: [
      "Catálogo de produtos tecnológicos com destaque visual forte",
      "Carrinho e checkout partilhando a lógica do projeto E-commerce",
      "Identidade visual e navegação próprias",
      "Arquitetura preparada para multi-loja (storeId por catálogo)",
    ],
    challenges: [
      {
        title: "Reutilizar lógica sem acoplar visualmente os dois projetos",
        content:
          "Resolvido isolando toda a lógica de dados em hooks e serviços independentes de estilo, permitindo que o mesmo hook useCart alimente duas interfaces completamente diferentes sem duplicar regras de negócio.",
      },
    ],
    learnings: [
      "Como desenhar uma API para ser \"reutilizável\" desde o primeiro projeto, em vez de refatorar depois",
      "A diferença entre acoplamento visual e acoplamento de dados num sistema fullstack",
    ],
  },

  // 3. GESTÃO FINANCEIRA
  {
    slug: "gestao-financeira",
    title: "Sistema de Gestão Financeira",
    tagline: "Controlo de finanças pessoais com relatórios visuais",
    technologies: ["React", "Node.js + Express"],
    image: "/images/gestao-financeira.jpg",
    gallery: [
      "/images/projetos/gestao-financeira/gestao-financeira-1.png",
      "/images/projetos/gestao-financeira/gestao-financeira-2.png",
      "/images/projetos/gestao-financeira/gestao-financeira-3.png",
      "/images/projetos/gestao-financeira/gestao-financeira-4.png",
      "/images/projetos/gestao-financeira/gestao-financeira-5.png",
      "/images/projetos/gestao-financeira/gestao-financeira-6.png",
      "/images/projetos/gestao-financeira/gestao-financeira-7.png",
      "/images/projetos/gestao-financeira/gestao-financeira-8.png",
    ],
    link: "https://financas-pessoais-frontend.vercel.app/",
    github: "https://github.com/KucoO1/financas-pessoais-frontend",
    hasLiveBackend: false,
    overview:
      "Aplicação de controlo de finanças pessoais com um dashboard que resume saldo, receitas e despesas do mês, uma listagem de transações categorizadas e gráficos que tornam visível para onde o dinheiro está a ir. O objetivo era ir além de uma folha de cálculo: dar ao utilizador uma leitura instantânea da sua saúde financeira, com a mesma disciplina de dados que um sistema contabilístico real exige.",
    problem:
      "A maioria das pessoas não tem falta de dados financeiros — tem falta de visibilidade sobre eles. Este projeto resolve o problema de \"para onde vai o meu dinheiro\" agregando lançamentos dispersos (receitas, despesas, categorias) num dashboard único, com relatórios que respondem a perguntas concretas: quanto gastei em alimentação este mês? o meu saldo está a crescer ou a encolher?",
    stack: [
      { label: "Frontend", items: ["React", "React Router", "Context API / Redux para estado global", "Chart.js / Recharts para gráficos"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT para autenticação", "Validação com Zod/Joi"] },
      { label: "Base de dados", items: ["PostgreSQL", "Sequelize / Prisma (ORM)"] },
      { label: "Infraestrutura", items: ["Vercel (frontend)", "Render (API + base de dados)"] },
    ],
    architecture: [
      {
        title: "Base de dados relacional por causa da integridade financeira",
        content:
          "Ao contrário de um catálogo de produtos, dados financeiros exigem consistência forte: uma transação nunca pode \"desaparecer\" ou ficar em estado intermédio. Por isso a escolha foi por uma base de dados relacional (PostgreSQL) em vez de uma NoSQL — o esquema tem tabelas normalizadas para Users, Categories e Transactions, com chaves estrangeiras e transações SQL (BEGIN/COMMIT/ROLLBACK) a garantir que uma operação composta (ex.: criar uma transação e atualizar o saldo agregado) nunca fica parcialmente aplicada.",
      },
      {
        title: "Separação entre dados brutos e dados agregados",
        content:
          "O dashboard não recalcula tudo no frontend a cada render. As agregações mensais (total de receitas, total de despesas, saldo, distribuição por categoria) são calculadas no backend através de queries SQL de agregação (GROUP BY mês/categoria), devolvendo ao frontend apenas os números já prontos para os gráficos — reduzindo drasticamente o volume de dados transferidos e o processamento no browser.",
      },
      {
        title: "Categorização como entidade de primeira classe",
        content:
          "As categorias de despesa/receita são geridas pelo próprio utilizador (não são um enum fixo), com uma categoria \"Outros\" por omissão. Isto foi uma decisão deliberada: um sistema financeiro pessoal só é útil se se adaptar à vida de quem o usa, não ao que o programador achou que fazia sentido.",
      },
    ],
    backend: [
      {
        title: "API Node.js + Express orientada a relatórios",
        content:
          "Além dos endpoints CRUD convencionais (/api/transactions, /api/categories), a API expõe endpoints de relatório dedicados como /api/reports/monthly e /api/reports/by-category, que executam agregações diretamente na base de dados em vez de devolver todas as transações para o cliente somar — um princípio importante de performance: agregações pertencem à base de dados, não ao frontend.",
      },
      {
        title: "Autenticação e isolamento de dados por utilizador",
        content:
          "Cada transação pertence a exatamente um utilizador, e todas as queries no backend filtram obrigatoriamente por userId extraído do token JWT — nunca do corpo da requisição — evitando que um utilizador possa, mesmo por engano no frontend, aceder às transações de outra pessoa.",
      },
      {
        title: "Validação estrita de valores monetários",
        content:
          "Valores monetários são validados e armazenados como inteiros (cêntimos) em vez de números de vírgula flutuante, evitando os clássicos erros de arredondamento de dinheiro em JavaScript (0.1 + 0.2 !== 0.3), com conversão para o formato decimal apenas na camada de apresentação.",
      },
    ],
    features: [
      "Dashboard com saldo, receitas e despesas do mês",
      "Registo de transações com categorias personalizáveis",
      "Gráficos de evolução mensal e distribuição por categoria",
      "Filtros por período e por categoria",
      "Autenticação e dados isolados por utilizador",
    ],
    challenges: [
      {
        title: "Evitar erros de arredondamento em valores monetários",
        content:
          "Resolvido armazenando todos os valores como inteiros em cêntimos na base de dados, e só convertendo para formato decimal (ex.: 1050 → 10,50 Kz) no momento de apresentar ao utilizador.",
      },
      {
        title: "Dashboard rápido mesmo com muitas transações",
        content:
          "Resolvido movendo as agregações (somas, médias, agrupamentos) para queries SQL no backend em vez de as calcular em JavaScript no frontend a cada transação carregada.",
      },
    ],
    learnings: [
      "Quando escolher uma base de dados relacional em vez de NoSQL — integridade e transações importam mais do que flexibilidade de schema",
      "Tratar dinheiro como inteiros, nunca como float",
    ],
  },

  // 4. GESTÃO DE STOCK
  {
    slug: "gestao-stock",
    title: "Gestão de Stock",
    tagline: "Controlo de inventário com histórico auditável de movimentos",
    technologies: ["Node.js + Express", "Next.js", "MySQL"],
    image: "/images/gestao-stock.jpg",
    gallery: [
      "/images/projetos/gestao-stock/gestao-stock-1.png",
      "/images/projetos/gestao-stock/gestao-stock-2.png",
      "/images/projetos/gestao-stock/gestao-stock-3.png",
      "/images/projetos/gestao-stock/gestao-stock-4.png",
      "/images/projetos/gestao-stock/gestao-stock-5.png",
      "/images/projetos/gestao-stock/gestao-stock-6.png",
      "/images/projetos/gestao-stock/gestao-stock-7.png",
      "/images/projetos/gestao-stock/gestao-stock-8.png",
    ],
    link: "https://gestao-frontend-zeta.vercel.app/",
    github: "https://github.com/KucoO1/gestao-de-stock",
    hasLiveBackend: true,
    overview:
      "Sistema completo de gestão de stock/inventário, pensado para pequenas e médias empresas que precisam de saber, a qualquer momento, quanto têm de cada produto, quem o moveu e porquê. Cobre o ciclo inteiro: entradas de mercadoria, saídas por venda, ajustes de inventário, fornecedores e alertas de stock mínimo.",
    problem:
      "Muitas PMEs ainda controlam stock em folhas Excel partilhadas, onde é fácil perder o histórico de \"quem alterou o quê\" e é comum haver discrepâncias entre o stock \"no papel\" e o stock real no armazém. O objetivo era construir um sistema onde cada alteração de stock fica registada como um movimento auditável, nunca como uma simples atualização silenciosa de um número.",
    stack: [
      { label: "Frontend", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "TanStack Table para listagens"] },
      { label: "Backend", items: ["Node.js", "Express", "JWT + papéis (admin/operador)", "Validação com Zod"] },
      { label: "Base de dados", items: ["MySQL", "Sequelize / Prisma (ORM)", "Transações SQL para movimentos"] },
      { label: "Infraestrutura", items: ["Vercel (frontend)", "Railway / VPS (API + MySQL)"] },
    ],
    architecture: [
      {
        title: "Kardex: stock como resultado de movimentos, nunca um número editável",
        content:
          "A decisão arquitetural mais importante deste projeto: o campo \"stock atual\" de um produto nunca é editado diretamente. Em vez disso, existe uma tabela stock_movements (entrada, saída, ajuste, devolução), e o stock atual é sempre a soma de todos os movimentos desse produto — o mesmo princípio usado em sistemas contabilísticos (livro-razão / kardex). Isto significa que é sempre possível responder \"porque é que este produto tem 12 unidades\" com uma lista completa e cronológica de eventos, nunca um número sem explicação.",
      },
      {
        title: "MySQL e transações ACID para consistência de inventário",
        content:
          "Optou-se por MySQL em vez de uma base NoSQL precisamente pela necessidade de transações ACID: registar uma saída de stock implica, na mesma transação, inserir o movimento e verificar que o stock resultante não fica negativo — e se qualquer passo falhar, a transação inteira é revertida (ROLLBACK), nunca deixando o inventário num estado inconsistente.",
      },
      {
        title: "Papéis diferenciados: operador vs administrador",
        content:
          "Operadores de armazém podem registar entradas/saídas mas não podem apagar histórico nem alterar preços de custo; apenas administradores têm acesso a relatórios financeiros e à gestão de fornecedores — refletindo a separação de responsabilidades que existe numa empresa real.",
      },
    ],
    backend: [
      {
        title: "API Node.js + Express estruturada por domínio",
        content:
          "Endpoints organizados por recurso de negócio: /api/products, /api/suppliers, /api/movements, /api/reports/low-stock. Cada rota de escrita em movements corre dentro de uma transação MySQL explícita, e o valor de stock mínimo por produto dispara um alerta consultável via /api/reports/low-stock, usado pelo frontend para destacar produtos a repor.",
      },
      {
        title: "Relatórios de valor de inventário",
        content:
          "O backend calcula o valor total do inventário (quantidade × custo médio ponderado) através de queries agregadas em SQL, e não em JavaScript — uma escolha de performance e de correção, já que o custo médio ponderado precisa de ser recalculado a cada entrada de stock com preço diferente do anterior.",
      },
    ],
    features: [
      "Registo de entradas, saídas e ajustes de stock",
      "Histórico completo e auditável por produto (kardex)",
      "Gestão de fornecedores e custos",
      "Alertas de stock mínimo",
      "Relatórios de valor de inventário",
      "Papéis de acesso: operador e administrador",
    ],
    challenges: [
      {
        title: "Garantir que o stock nunca fica negativo sob operações concorrentes",
        content:
          "Resolvido com transações SQL explícitas: a verificação de stock disponível e a inserção do movimento de saída acontecem dentro do mesmo BEGIN/COMMIT, com bloqueio de linha (SELECT ... FOR UPDATE) sobre o produto durante a operação.",
      },
      {
        title: "Explicar discrepâncias de inventário",
        content:
          "Resolvido ao tornar o stock um valor derivado do histórico de movimentos em vez de um campo editável diretamente — qualquer discrepância é sempre rastreável a um movimento específico, com utilizador e timestamp.",
      },
    ],
    learnings: [
      "O padrão kardex/livro-razão aplica-se muito além de contabilidade — qualquer sistema de \"quantidade que muda ao longo do tempo\" beneficia dele",
      "Quando usar bloqueios de linha (row locking) para proteger operações concorrentes numa base de dados relacional",
    ],
  },

  // 5. LANDING PAGE
  {
    slug: "landing-page",
    title: "Landing Page",
    tagline: "Página de conversão de alta performance, sem backend",
    technologies: ["React"],
    image: "/images/landin-page.jpg",
    gallery: ["/images/projetos/landing-page/landing-page-1.png"],
    link: "https://landing-page-hotmart-nine.vercel.app/",
    github: "https://github.com/KucoO1/landing-page-hotmart",
    hasLiveBackend: true,
    overview:
      "Landing page de conversão no estilo dos funis de vendas de infoprodutos (ex.: Hotmart): headline forte acima da dobra, blocos de benefícios, prova social e uma chamada para ação repetida estrategicamente ao longo da página. Este projeto foi propositadamente construído sem backend próprio — o foco era 100% em performance de carregamento e em copywriting orientado a conversão, não em lógica de servidor.",
    problem:
      "Uma landing page de vendas vive ou morre pela velocidade de carregamento e pela clareza da mensagem nos primeiros segundos. O objetivo era construir uma página que carregasse quase instantaneamente (Core Web Vitals no verde) e guiasse visualmente o visitante, sem distrações, até ao botão de compra — sem nenhuma dependência de servidor que pudesse introduzir latência.",
    stack: [
      { label: "Frontend", items: ["React", "Vite", "CSS Modules / Tailwind CSS", "Framer Motion para reveals no scroll"] },
      { label: "Integrações", items: ["Formulário ligado a webhook externo (Hotmart / plataforma de checkout)", "Google Analytics / Meta Pixel para tracking de conversão"] },
      { label: "Infraestrutura", items: ["Vercel (hospedagem estática)"] },
    ],
    architecture: [
      {
        title: "Página inteiramente estática, sem servidor próprio — por escolha, não por limitação",
        content:
          "Ao contrário dos restantes projetos deste portefólio, esta página não tem (nem precisa de) backend: é servida como HTML/CSS/JS estático através da CDN da Vercel, o que significa tempos de resposta praticamente instantâneos em qualquer parte do mundo. Todo o processo de compra é delegado a uma plataforma de checkout externa (o padrão real do mercado de infoprodutos), e a página apenas conduz o visitante até lá.",
      },
      {
        title: "Estrutura de secções pensada como um funil, não como um site",
        content:
          "Cada secção da página tem um único objetivo persuasivo — captar atenção, criar desejo, remover objeções, gerar urgência — na ordem clássica de um funil de vendas (AIDA). Os componentes React são propositadamente \"burros\" (sem lógica de negócio), porque o verdadeiro trabalho de engenharia aqui está na performance e no copywriting, não na arquitetura de dados.",
      },
    ],
    backend: [],
    features: [
      "Hero com proposta de valor clara acima da dobra",
      "Secções de benefícios e prova social",
      "Chamadas para ação (CTA) repetidas estrategicamente",
      "Animações de entrada ao scroll",
      "Otimizada para Core Web Vitals (LCP, CLS, INP)",
    ],
    challenges: [
      {
        title: "Maximizar velocidade de carregamento sem sacrificar animação",
        content:
          "Resolvido usando imagens otimizadas e lazy loading fora da dobra inicial, e limitando animações pesadas (Framer Motion) apenas a elementos que entram na viewport, evitando custo de renderização antes de serem vistos.",
      },
    ],
    learnings: [
      "Nem todo o projeto precisa de backend — às vezes a melhor arquitetura é a mais simples que resolve o problema",
      "Performance percebida numa landing page de vendas impacta diretamente a taxa de conversão",
    ],
  },

  // 6. ARGPACK
  {
    slug: "argpack",
    title: "ArgPack",
    tagline: "Marketplace que liga produtores argentinos a afiliados que vendem os seus produtos no Brasil",
    technologies: ["Next.js", "Node.js", "Express", "MongoDB"],
    image: "/images/argpack.jpg",
    gallery: [],
    link: "/projetos/argpack#demo",
    github: "https://github.com/KucoO1/argpack-frontend",
    hasLiveBackend: false,
    overview:
      "Marketplace de microexportação que liga pequenos produtores argentinos (vinhos, alimentos, artesanato, couro) a afiliados brasileiros que promovem e vendem esses produtos através de um link de referência próprio, ganhando comissão por cada venda confirmada. A plataforma tem três perfis: o produtor, que gere o seu catálogo e as suas vendas; o afiliado, que gera links de produtos e acompanha ganhos e tier de comissão; e o admin, que supervisiona toda a operação.",
    problem:
      "Um pequeno produtor argentino raramente tem equipa de vendas ou marketing digital próprio para chegar ao mercado brasileiro, e um afiliado que quer promover produtos físicos de nicho não tem uma forma simples de gerar links rastreáveis e ser pago de forma transparente por isso. O ArgPack resolve os dois lados ao mesmo tempo: dá catálogo e vitrine ao produtor, e dá um sistema de referência com comissão automática ao afiliado.",
    stack: [
      { label: "Frontend", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Context API (carrinho, wishlist, autenticação)"] },
      { label: "Backend", items: ["Node.js + Express + TypeScript", "JWT (jsonwebtoken) para autenticação", "Zod para validação de payloads", "Helmet + CORS + Morgan"] },
      { label: "Base de dados", items: ["MongoDB + Mongoose", "Modelos: User, Producer, Affiliate, Product, Sale, Order"] },
      { label: "Infraestrutura", items: ["Vercel (frontend)", "API REST separada (backend Node)"] },
    ],
    architecture: [
      {
        title: "Três papéis, um único modelo de utilizador",
        content:
          "Existe uma coleção User única com um campo userType (affiliate | producer | admin), e cada papel tem depois um documento de perfil próprio (Producer ou Affiliate) ligado por userId. Isto evita duplicar lógica de autenticação para cada tipo de conta e mantém o JWT genérico — o middleware de autorização decide o que cada papel pode ver a partir de um único campo.",
      },
      {
        title: "Comissão por afiliado calculada no servidor, nunca confiada ao cliente",
        content:
          "Cada afiliado tem um referralCode único e um tier (Bronze 5%, Prata 10% com 10+ vendas no mês, Ouro 15% com 50+ vendas no mês). Quando uma venda é registada com um código de referência, o backend resolve o afiliado dono do código, calcula a comissão a partir da tabela de tiers (nunca a partir de um valor enviado pelo cliente) e recalcula o tier do afiliado a cada venda confirmada.",
      },
      {
        title: "Sale como registo por linha de produto, Order como o pedido completo",
        content:
          "Um checkout pode ter vários produtos de vários produtores diferentes. Em vez de guardar tudo dentro do Order, cada linha de produto gera o seu próprio documento Sale (com o producerId, o afiliado atribuído e a comissão já calculada), enquanto o Order guarda os dados do pedido em si — morada de entrega, forma de pagamento, cupão aplicado. Isto permite que cada produtor veja apenas as suas próprias vendas sem expor o pedido completo de outro produtor.",
      },
    ],
    backend: [
      {
        title: "Modelo de dados: produtores, produtos, afiliados e vendas",
        content:
          "Producer guarda os dados da empresa (nome, tipo de produto, localização, plano). Product pertence a um Producer e tem categoria (vinho, alimentos, artesanato, couro), preço e stock. Affiliate guarda o código de referência, o tier atual e os totais de vendas e ganhos. Sale liga um Product a um Producer e, opcionalmente, a um Affiliate, guardando o valor total, a taxa de comissão aplicada e o estado (pending → confirmed → paid, ou cancelled).",
      },
      {
        title: "Fluxo de checkout com atribuição de afiliado",
        content:
          "O frontend guarda o código de referência capturado da URL (?ref=CODIGO) em localStorage com validade de 30 dias, à semelhança de um cookie de atribuição. No checkout, esse código viaja no pedido; o backend resolve o afiliado, gera uma Sale por cada item do carrinho com a comissão já calculada, desconta o stock do produto e devolve um número de pedido (ex: ARG-8F42A1). Frete grátis acima de R$300, cupão de desconto opcional, e três formas de pagamento simuladas (cartão, Pix, boleto).",
      },
    ],
    features: [
      "Catálogo de produtos filtrável por categoria (vinhos, alimentos, artesanato, couro)",
      "Sistema de afiliados com link de referência único e 3 tiers de comissão automáticos",
      "Carrinho e checkout com cupão de desconto e frete grátis a partir de um valor mínimo",
      "Painel do produtor com vendas, produtos e receita confirmada",
      "Painel do afiliado com progresso até ao próximo tier e histórico de comissões",
      "Painel de administração com visão geral da plataforma e gestão de utilizadores",
    ],
    challenges: [
      {
        title: "Atribuir corretamente uma venda ao afiliado certo, mesmo em carrinhos com vários produtos",
        content:
          "Resolvido tratando cada linha do carrinho como uma Sale independente em vez de dividir a comissão de um único registo de pedido — cada linha herda o mesmo referralCode do momento do checkout, o que torna trivial um produtor ver só as suas vendas e um afiliado ver só as vendas que gerou, sem cálculos cruzados.",
      },
      {
        title: "Evitar que o cliente manipule a taxa de comissão",
        content:
          "A taxa de comissão nunca chega do frontend — é sempre lida da tabela TIER_RULES no backend a partir do tier atual do afiliado guardado na base de dados, o que fecha a porta a um comprador (ou afiliado) tentar enviar uma taxa mais alta manualmente.",
      },
    ],
    learnings: [
      "Modelar vendas por linha de produto (não por pedido completo) simplifica muito consultas de \"as minhas vendas\" quando há múltiplos produtores e afiliados no mesmo checkout",
      "Guardar regras de negócio (como os tiers de comissão) numa única fonte de verdade no backend evita duplicar a mesma lógica em vários controllers",
    ],
  },

  // 7. GAMES HUB
  {
    slug: "games-hub",
    title: "Games Hub",
    tagline: "Mini plataforma de jogos casuais, 100% no browser",
    technologies: ["React", "TypeScript"],
    image: "/images/gameshub.jpg",
    gallery: [],
    link: "https://jogo-memoria-e-mais.vercel.app/",
    github: "https://github.com/KucoO1/jogo-memoria-e-mais",
    hasLiveBackend: true,
    overview:
      "Hub com vários mini-jogos casuais (jogo da memória e outros), todos a correr inteiramente no browser, sem qualquer dependência de servidor. O foco deste projeto foi arquitetura de frontend: como estruturar múltiplos jogos independentes partilhando componentes comuns (temporizador, placar, sistema de pontuação) sem que a lógica de um jogo \"vaze\" para outro.",
    problem:
      "Construir vários jogos numa única aplicação facilmente resulta em código acoplado, onde alterar as regras de um jogo arrisca partir outro. O desafio era desenhar uma arquitetura onde cada jogo é uma unidade isolada e substituível, com um \"motor\" comum (estado de jogo, temporizador, recorde) reutilizado por todos.",
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Context API + useReducer por jogo", "CSS Modules"] },
      { label: "Persistência local", items: ["localStorage para recordes e progresso (sem backend)"] },
      { label: "Infraestrutura", items: ["Vercel (hospedagem estática)"] },
    ],
    architecture: [
      {
        title: "Cada jogo como um módulo isolado com uma interface comum",
        content:
          "Todos os jogos implementam a mesma \"interface\" conceptual: um estado inicial, uma função de reducer (useReducer) que processa jogadas, e um componente de placar. Isto significa que o componente Scoreboard, o Timer e o sistema de \"melhor pontuação\" são genéricos e reutilizados por qualquer jogo novo — adicionar um jogo ao hub não implica tocar em nenhum código dos jogos existentes.",
      },
      {
        title: "TypeScript como rede de segurança entre jogos",
        content:
          "Tipos genéricos (Game<State, Action>) garantem, em tempo de compilação, que cada jogo implementa corretamente o contrato esperado pelo hub — evitando o erro comum em hubs de jogos JavaScript onde um jogo mal implementado quebra silenciosamente o placar geral.",
      },
    ],
    backend: [],
    features: [
      "Jogo da memória com níveis de dificuldade",
      "Sistema de pontuação e recordes pessoais (localStorage)",
      "Temporizador reutilizável entre jogos",
      "Arquitetura modular preparada para novos jogos",
    ],
    challenges: [
      {
        title: "Adicionar novos jogos sem duplicar lógica de placar/temporizador",
        content:
          "Resolvido extraindo um \"motor\" de jogo genérico (hooks useGameTimer, useScoreboard) independente de qualquer jogo específico, usado por composição em cada novo jogo adicionado ao hub.",
      },
    ],
    learnings: [
      "Como desenhar interfaces genéricas em TypeScript (Game<State, Action>) para forçar consistência entre módulos independentes",
      "Persistência local (localStorage) é suficiente e apropriada quando não há necessidade real de partilhar dados entre dispositivos",
    ],
  },

  // 8. PRIMEFLIX
  {
    slug: "primeflix",
    title: "PrimeFlix",
    tagline: "Descoberta de filmes em alta, consumindo uma API pública",
    technologies: ["React", "Axios"],
    image: "/images/primeFlix.jpg",
    gallery: [
      "/images/projetos/primeflix/primeFlix-1.png",
      "/images/projetos/primeflix/primeFlix-2.png",
      "/images/projetos/primeflix/primeFlix-3.png",
    ],
    link: "https://primeflix-one-chi.vercel.app/",
    github: "https://github.com/KucoO1/primeFlix",
    hasLiveBackend: true,
    overview:
      "Aplicação para descobrir filmes em alta e consultar os seus detalhes (sinopse, avaliação, elenco, data de lançamento), consumindo uma API pública de filmes (TMDB). O foco do projeto foi a camada de integração com uma API externa: como estruturar chamadas HTTP, tratar erros e limites de taxa, e manter a interface responsiva mesmo com dados a chegar de forma assíncrona.",
    problem:
      "Consumir uma API pública de terceiros de forma robusta é mais difícil do que parece: chaves de API não podem ficar expostas de forma descuidada, os pedidos podem falhar ou ser limitados (rate limiting), e a experiência do utilizador não pode \"congelar\" à espera da resposta. O objetivo era construir essa camada de integração de forma limpa e reutilizável.",
    stack: [
      { label: "Frontend", items: ["React", "TypeScript", "Axios (instância configurada + interceptors)", "React Query para cache de pedidos"] },
      { label: "Integração externa", items: ["The Movie Database (TMDB) API pública", "Variáveis de ambiente para a chave de API"] },
      { label: "Infraestrutura", items: ["Vercel (hospedagem estática)"] },
    ],
    architecture: [
      {
        title: "Instância Axios dedicada com interceptors",
        content:
          "Em vez de chamar axios.get diretamente em cada componente, existe uma instância única do Axios (api.ts) com baseURL e chave de API pré-configuradas, e interceptors de resposta que tratam de forma centralizada erros 401/429 (limite de pedidos excedido) e formatam mensagens de erro amigáveis — evitando duplicar tratamento de erros em cada chamada.",
      },
      {
        title: "Hooks dedicados por tipo de dado (useTrendingMovies, useMovieDetails)",
        content:
          "Cada necessidade de dados tem o seu próprio hook, responsável por chamar a API, gerir estados de carregamento/erro e (com React Query) fazer cache dos resultados — evitando pedidos repetidos à API pública para os mesmos filtros de pesquisa, o que também ajuda a não esgotar o limite de pedidos gratuito da TMDB.",
      },
      {
        title: "Debounce na pesquisa para reduzir chamadas desnecessárias",
        content:
          "A pesquisa de filmes só dispara um pedido à API 400ms depois do utilizador parar de escrever, em vez de a cada tecla premida — uma otimização simples mas essencial ao consumir uma API externa com limites de utilização.",
      },
    ],
    backend: [],
    features: [
      "Listagem de filmes em alta (trending) e por categoria",
      "Pesquisa de filmes com debounce",
      "Página de detalhe com sinopse, avaliação e elenco",
      "Estados de carregamento e erro tratados de forma consistente",
    ],
    challenges: [
      {
        title: "Evitar esgotar o limite de pedidos da API pública",
        content:
          "Resolvido combinando debounce na pesquisa com cache de resultados via React Query, reduzindo drasticamente o número de chamadas repetidas à TMDB para as mesmas pesquisas.",
      },
      {
        title: "Manter a interface responsiva durante pedidos assíncronos",
        content:
          "Resolvido com estados de loading dedicados por secção da página (skeleton loaders), em vez de bloquear a página inteira à espera de uma única resposta.",
      },
    ],
    learnings: [
      "Centralizar a configuração de um cliente HTTP (Axios) numa única instância evita duplicação e inconsistência no tratamento de erros",
      "Cache no cliente (React Query) é tão importante quanto cache no servidor quando se depende de APIs de terceiros com limites de uso",
    ],
  },

  // 9. BARBEARIA
  {
    slug: "barbearia",
    title: "Barbearia",
    tagline: "Agendamentos online com painel administrativo e pagamentos",
    technologies: ["TypeScript", "Next.js"],
    image: "/images/barbearia.jpg",
    gallery: [],
    link: "https://barbearia-sepia-eight.vercel.app/",
    github: "https://github.com/KucoO1/barbearia",
    hasLiveBackend: false,
    overview:
      "Plataforma de agendamentos para uma barbearia, com escolha de serviço, profissional e horário disponível, painel administrativo para o barbeiro gerir a agenda, e integração de pagamento para confirmar a marcação com um sinal antecipado. Construída como uma aplicação Next.js full-stack, usando o próprio Next.js (App Router + Route Handlers) como camada de backend em vez de um servidor Express separado.",
    problem:
      "Marcações feitas por WhatsApp ou telefone são fáceis de perder e não impedem \"no-shows\" (clientes que marcam e não aparecem). O objetivo era digitalizar o processo de agendamento de ponta a ponta: mostrar apenas horários realmente disponíveis, evitar marcações duplicadas para o mesmo profissional/horário, e reduzir faltas exigindo um pequeno sinal pago no momento da marcação.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "React Hook Form + Zod para validação"] },
      { label: "Backend", items: ["Next.js Route Handlers (API integrada, sem servidor Express separado)", "NextAuth para autenticação do painel administrativo"] },
      { label: "Base de dados", items: ["PostgreSQL", "Prisma ORM"] },
      { label: "Pagamentos", items: ["Integração com gateway de pagamento (Multicaixa Express / Stripe) para o sinal da marcação"] },
      { label: "Infraestrutura", items: ["Vercel (frontend + Route Handlers)", "Supabase / Railway (PostgreSQL)"] },
    ],
    architecture: [
      {
        title: "Next.js full-stack: Route Handlers como backend, sem servidor separado",
        content:
          "Diferente dos projetos de e-commerce (onde o backend é um serviço Node/Express independente), aqui a escolha foi manter tudo dentro do próprio Next.js através de Route Handlers (app/api/.../route.ts). Para um domínio deste tamanho — marcações, serviços, profissionais — não se justificava a complexidade operacional de manter dois deployments (frontend e backend) separados; o Next.js full-stack permite entregar o mesmo produto com metade da infraestrutura para gerir.",
      },
      {
        title: "Modelação de disponibilidade: slots derivados, não uma tabela gigante de horários",
        content:
          "Em vez de pré-gerar uma linha na base de dados para cada horário possível de cada dia (o que cresce indefinidamente), os horários disponíveis são calculados dinamicamente: o backend cruza o horário de expediente do profissional com as marcações (bookings) já existentes nesse dia, devolvendo apenas os intervalos ainda livres. Isto mantém a base de dados pequena e sempre correta, sem necessidade de tarefas periódicas de limpeza.",
      },
      {
        title: "Reserva de horário com transação para evitar duplo agendamento",
        content:
          "Quando um cliente confirma um horário, a criação da marcação corre dentro de uma transação Prisma que primeiro verifica, com um bloqueio, que aquele profissional continua livre naquele intervalo — se dois clientes tentarem reservar o mesmo horário em simultâneo, apenas o primeiro a completar a transação consegue a marcação; o segundo recebe imediatamente um erro de \"horário já ocupado\".",
      },
    ],
    backend: [
      {
        title: "Route Handlers organizados por domínio de negócio",
        content:
          "/api/services (serviços e preços), /api/professionals (profissionais e horários de expediente), /api/availability (cálculo de horários livres), /api/bookings (criação e gestão de marcações) e /api/payments/webhook (confirmação assíncrona do sinal pago). Os Route Handlers administrativos exigem sessão válida via NextAuth com papel \"admin\", enquanto os de marcação pública são acessíveis a qualquer visitante, mas com validação estrita de input via Zod.",
      },
      {
        title: "Sinal de pagamento como confirmação de compromisso",
        content:
          "A marcação só passa do estado pending_payment para confirmed quando o gateway de pagamento notifica o webhook com sucesso — nunca apenas porque o cliente foi redirecionado de volta ao site. Marcações que ficam mais de X minutos em pending_payment sem confirmação são libertadas automaticamente, devolvendo o horário à disponibilidade geral.",
      },
      {
        title: "Painel administrativo com agenda do dia",
        content:
          "O barbeiro autenticado vê a agenda do dia agrupada por profissional, pode marcar manualmente clientes que ligam por telefone, e cancelar/remarcar horários — todas as operações passam pela mesma camada de validação de disponibilidade usada pelo cliente final, garantindo que nunca há dois caminhos diferentes (e potencialmente inconsistentes) para criar uma marcação.",
      },
    ],
    features: [
      "Escolha de serviço, profissional e horário disponível",
      "Cálculo dinâmico de disponibilidade (sem horários fantasma)",
      "Sinal de pagamento para confirmar a marcação",
      "Painel administrativo com agenda do dia por profissional",
      "Prevenção de marcações duplicadas para o mesmo horário",
    ],
    challenges: [
      {
        title: "Evitar que dois clientes reservem o mesmo horário",
        content:
          "Resolvido com uma transação de base de dados que verifica e reserva o horário de forma atómica, em vez de duas operações separadas (verificar disponibilidade, depois criar a marcação) que deixariam uma janela de tempo vulnerável.",
      },
      {
        title: "Reduzir faltas sem afastar clientes com um processo de pagamento pesado",
        content:
          "Resolvido exigindo apenas um sinal parcial (não o valor total do serviço) no momento da marcação, equilibrando compromisso do cliente com fricção no processo de reserva.",
      },
    ],
    learnings: [
      "Quando optar por um backend integrado no Next.js (Route Handlers) em vez de um serviço Express separado — depende do tamanho real do domínio, não de preferência pessoal",
      "Disponibilidade de agenda deve ser sempre calculada, nunca armazenada como lista fixa de horários",
    ],
  },

  // 10. NEOXIA
  {
    slug: "neoxia",
    title: "Neoxia",
    tagline: "Site institucional para uma agência de marketing digital",
    technologies: ["TypeScript", "Next.js"],
    image: "/images/Neoxia.jpg",
    gallery: ["/images/projetos/neoxia/neoxia-1.png"],
    link: "https://neoxia.vercel.app/",
    github: "https://github.com/KucoO1/Neoxia",
    hasLiveBackend: false,
    overview:
      "Site institucional para a Neoxia, uma agência de marketing digital, apresentando os seus serviços, cases e uma forma direta de contacto para potenciais clientes. Ao contrário dos projetos de e-commerce ou SaaS deste portefólio, o objetivo aqui não era um sistema com muitos dados dinâmicos, mas sim uma presença digital rápida, credível e orientada a gerar contactos comerciais (leads).",
    problem:
      "Uma agência de marketing digital é, ela própria, o primeiro teste da sua credibilidade: se o site institucional for lento, genérico ou não gerar contactos qualificados, isso mina o argumento de venda da própria agência. O desafio era construir um site que refletisse profissionalismo técnico e convertesse visitantes em pedidos de contacto reais.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion para transições de secção"] },
      { label: "Backend", items: ["Next.js Route Handler dedicado para o formulário de contacto", "Resend (envio de email transacional)"] },
      { label: "Infraestrutura", items: ["Vercel (frontend + Route Handler)", "Renderização estática (SSG) para todas as páginas de conteúdo"] },
    ],
    architecture: [
      {
        title: "Site quase inteiramente estático, com uma única ilha dinâmica",
        content:
          "A grande maioria das páginas (serviços, sobre, cases) é gerada estaticamente (SSG) em build-time, o que garante tempos de carregamento mínimos e excelente SEO — essencial para uma agência que depende de tráfego orgânico de pesquisa. A única parte verdadeiramente \"dinâmica\" do site é o formulário de contacto, isolado como a única funcionalidade que realmente precisa de correr no servidor.",
      },
      {
        title: "Formulário de contacto como Route Handler + serviço de email transacional",
        content:
          "O formulário submete para um Route Handler (app/api/contact/route.ts) que valida os dados no servidor (nunca confiando apenas na validação do lado do cliente), aplica um limite simples de pedidos por IP para mitigar spam, e usa a Resend para enviar o email com o pedido de contacto diretamente para a caixa de entrada da agência — sem necessidade de manter uma base de dados só para armazenar mensagens de contacto.",
      },
      {
        title: "Conteúdo como o verdadeiro produto do projeto",
        content:
          "Para um site institucional, a arquitetura de código é propositadamente simples; o esforço de engenharia foi investido em performance (Core Web Vitals), acessibilidade e clareza de copy — porque é isso que determina se uma agência de marketing parece, ela própria, bem posicionada em marketing.",
      },
    ],
    backend: [
      {
        title: "Sem base de dados — envio direto por email transacional",
        content:
          "Em vez de guardar submissões de contacto numa base de dados para depois serem consultadas manualmente, o Route Handler envia o pedido diretamente por email através da Resend assim que é submetido — reduzindo a complexidade operacional a zero (não há base de dados para manter) ao custo de não ter um histórico pesquisável, uma troca aceitável para o volume esperado de um site institucional.",
      },
      {
        title: "Proteção básica contra spam e submissões abusivas",
        content:
          "O Route Handler aplica validação estrita de schema (Zod) e um limite de submissões por IP num intervalo curto de tempo, evitando que o formulário seja usado para enviar spam em massa através da infraestrutura de email da agência.",
      },
    ],
    features: [
      "Apresentação de serviços de marketing digital",
      "Secção de cases/portefólio da agência",
      "Formulário de contacto com envio direto por email",
      "Site totalmente estático e otimizado para SEO",
    ],
    challenges: [
      {
        title: "Gerar contactos comerciais sem a complexidade de uma base de dados",
        content:
          "Resolvido optando por envio direto de email transacional (Resend) a partir de um único Route Handler, em vez de construir um sistema de armazenamento e gestão de leads que seria desproporcional à escala do projeto.",
      },
    ],
    learnings: [
      "Nem todo o formulário de contacto precisa de uma base de dados — às vezes o email transacional é a solução mais simples e correta",
      "Para sites institucionais, SEO e performance de carregamento são, na prática, funcionalidades de negócio",
    ],
  },

  // 11. QRCODEPAY
  {
    slug: "qrcodepay",
    title: "QrCodePay",
    tagline: "Plataforma de pagamentos por QR Code para comerciantes, com onboarding por convite e painel administrativo completo",
    technologies: ["Next.js", "Node.js", "MongoDB", "Docker"],
    image: "/images/qrcodepay.png",
    gallery: [
      "/images/projetos/qrcodepay/qrcodepay-1.png",
      "/images/projetos/qrcodepay/qrcodepay-2.png",
      "/images/projetos/qrcodepay/qrcodepay-3.png",
      "/images/projetos/qrcodepay/qrcodepay-4.png",
      "/images/projetos/qrcodepay/qrcodepay-5.png",
      "/images/projetos/qrcodepay/qrcodepay-6.png",
      "/images/projetos/qrcodepay/qrcodepay-7.png",
      "/images/projetos/qrcodepay/qrcodepay-8.png",
      "/images/projetos/qrcodepay/qrcodepay-9.png",
    ],
    link: "/projetos/qrcodepay#demo",
    github: "",
    hasLiveBackend: false,
    overview:
      "QrCodePay é uma plataforma de pagamentos por QR Code pensada para comerciantes que querem receber pagamentos digitais sem depender de um único banco ou carteira móvel. Cada comerciante tem um QR Code fixo para a sua loja (para pagamentos genéricos) e pode gerar QR Codes dinâmicos por transação, com valor, referência única e prazo de expiração — o mesmo padrão usado por sistemas de pagamento instantâneo por QR em vários mercados emergentes. Além da experiência do comerciante, o projeto inclui um painel de administração completo, com gestão de comerciantes, utilizadores, convites de acesso, transações e registo de auditoria do sistema.",
    problem:
      "Pequenos e médios comerciantes que querem aceitar pagamentos digitais rápidos enfrentam uma experiência fragmentada: cada banco ou carteira móvel tem a sua própria app, o seu próprio QR e o seu próprio fluxo de confirmação. O objetivo do projeto foi construir uma camada de pagamento por QR Code própria — com o mesmo rigor de um produto financeiro real: estados de transação bem definidos, confirmação assíncrona nunca confiada ao browser do cliente, expiração automática de pagamentos por cobrar e um registo de auditoria completo de tudo o que acontece no sistema.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "TanStack Query para cache e sincronização de dados do servidor"] },
      { label: "Backend", items: ["Node.js", "Express", "TypeScript", "JWT para autenticação", "Job em background para expiração de pagamentos"] },
      { label: "Base de dados", items: ["MongoDB", "Mongoose (ODM)"] },
      { label: "Infraestrutura", items: ["Docker + Docker Compose (frontend, backend, base de dados e proxy)", "Nginx como reverse proxy", "Configuração separada para ambiente de desenvolvimento e produção"] },
    ],
    architecture: [
      {
        title: "Onboarding fechado por convite, não por registo público",
        content:
          "Não existe uma página pública de \"criar conta\": um administrador gera um convite associado a um email, o sistema envia um link de registo único com prazo de validade, e só quem tem esse link pode criar a conta de comerciante. Numa plataforma que movimenta dinheiro, esta é uma decisão de segurança deliberada — elimina por completo a superfície de ataque de registos automáticos ou contas fraudulentas, ao custo de mais fricção de onboarding, uma troca aceitável para este tipo de produto.",
      },
      {
        title: "Dois tipos de QR Code para dois casos de uso diferentes",
        content:
          "O QR Code estático do comerciante existe uma vez, nunca expira e serve para pagamentos genéricos numa loja física (o cliente aponta a câmara e introduz o valor). Já o QR Code dinâmico é gerado por transação, já vem com o valor definido, tem uma referência única e uma validade curta — pensado para situações em que o valor é conhecido antecipadamente (ex. checkout, fatura). Esta distinção reflete-se em todo o resto da arquitetura, incluindo em como cada tipo de QR é validado no backend.",
      },
      {
        title: "Três perfis de utilização sobre a mesma API",
        content:
          "A aplicação frontend está dividida em três zonas com layouts e permissões próprias: a página pública de pagamento (para o cliente final que escaneia o QR), o painel do comerciante (dashboard, criação de pagamentos, transações, perfil) e o painel de administração (comerciantes, convites, utilizadores, transações globais, logs do sistema). As três zonas consomem a mesma API REST, mas cada rota do backend valida o papel do utilizador autenticado antes de expor qualquer dado.",
      },
      {
        title: "Infraestrutura containerizada desde o primeiro dia",
        content:
          "O projeto nunca correu \"só na máquina local\": frontend, backend e base de dados estão definidos em Docker Compose desde o início, com um Nginx à frente a fazer de reverse proxy. Isto obrigou a pensar em variáveis de ambiente, redes internas entre contentores e scripts de arranque para desenvolvimento e produção desde a primeira versão, em vez de deixar essa complexidade para o fim.",
      },
    ],
    backend: [
      {
        title: "Máquina de estados do pedido de pagamento",
        content:
          "Um pagamento percorre estados bem definidos — criado → pendente → confirmado / falhado — e cada transição é validada explicitamente no servidor antes de ser aplicada; uma transição que não faça sentido (por exemplo, tentar confirmar um pagamento já falhado) é rejeitada. Isto evita que um pedido malformado ou uma corrida entre pedidos deixe uma transação num estado inconsistente.",
      },
      {
        title: "Expiração automática de pagamentos por cobrar",
        content:
          "Um processo em background corre periodicamente e procura pedidos de pagamento que ultrapassaram o prazo de validade sem confirmação, marcando-os como expirados e registando o motivo no histórico da transação. Isto significa que um QR Code dinâmico esquecido não fica \"pendente\" para sempre no painel do comerciante — o sistema autolimpa-se sem necessidade de intervenção manual.",
      },
      {
        title: "Confirmação de pagamento nunca confiada ao cliente",
        content:
          "Tal como no projeto de e-commerce deste portefólio, um pagamento só é marcado como confirmado através de uma notificação assíncrona validada no servidor — nunca apenas porque o browser do cliente foi redirecionado para uma página de \"sucesso\". Esta é uma regra que se repete em qualquer sistema de pagamento bem construído, e foi replicada aqui de propósito.",
      },
      {
        title: "Registo de auditoria para todo o sistema",
        content:
          "Cada evento relevante — criação de convite, mudança de estado de um pagamento, ação de um administrador — gera um registo de log com o ator, o tipo de evento e metadados relevantes, consultável no painel \"Logs do sistema\" da administração. Numa plataforma financeira, saber exatamente o que aconteceu e quando não é opcional.",
      },
      {
        title: "Limitação de pedidos em rotas sensíveis",
        content:
          "Endpoints críticos como o login e a criação de convites têm limitação de taxa de pedidos, reduzindo a superfície para ataques de força bruta ou abuso automatizado sem afetar a experiência normal de uso.",
      },
    ],
    features: [
      "Onboarding de comerciantes fechado, apenas por convite com prazo de validade",
      "QR Code estático permanente por comerciante",
      "QR Code dinâmico por transação, com valor, referência e expiração automática",
      "Painel do comerciante com receita, transações recentes e ações rápidas",
      "Painel de administração com visão global de comerciantes, utilizadores e transações",
      "Estado de saúde do sistema visível no painel de administração",
      "Histórico de transações com filtros e pesquisa",
      "Registo de auditoria de eventos do sistema",
      "Recuperação de password e fluxo de autenticação com JWT",
      "Infraestrutura totalmente containerizada com Docker Compose",
    ],
    challenges: [
      {
        title: "Evitar que um pagamento fique confirmado por engano",
        content:
          "Resolvido com validação explícita de transições de estado no servidor — cada mudança de estado é verificada contra uma lista de transições permitidas antes de ser gravada, em vez de aceitar cegamente qualquer atualização.",
      },
      {
        title: "Impedir que pagamentos esquecidos poluam o painel do comerciante",
        content:
          "Resolvido com um processo em background que expira automaticamente pedidos de pagamento por cobrar que ultrapassaram o prazo, sem depender de o comerciante ou o cliente fazerem nada.",
      },
      {
        title: "Equilibrar segurança e velocidade no onboarding de novos comerciantes",
        content:
          "Resolvido com um fluxo de convite: mais lento do que um registo público instantâneo, mas elimina por completo contas fraudulentas ou de teste numa plataforma que lida com dinheiro — uma troca deliberada em favor da segurança.",
      },
    ],
    learnings: [
      "Desenhar uma máquina de estados explícita, mesmo num projeto pessoal, obriga a pensar em todos os caminhos possíveis de uma transação — não só no caminho feliz",
      "Um processo em background simples (verificar e expirar) resolve um problema de integridade de dados que, de outra forma, exigiria lógica complexa espalhada por vários pontos da aplicação",
      "Ter Docker Compose desde o início, e não só no fim, obriga a resolver cedo problemas de configuração entre serviços que de outra forma só apareceriam em produção",
      "Onboarding fechado por convite é, em muitos produtos financeiros, uma funcionalidade de segurança tão importante quanto a autenticação em si",
    ],
  },

  // 12. CRFDESK
  {
    slug: "crfdesk",
    title: "CRFDesk",
    tagline: "Plataforma de screening e compliance para ativos cripto, com scoring de risco explicável e relatórios prontos para reguladores",
    technologies: ["Next.js", "Node.js", "MongoDB", "Docker"],
    image: "/images/crfdesk.png",
    gallery: [
      "/images/projetos/crfdesk/crfdesk-1.png",
      "/images/projetos/crfdesk/crfdesk-2.png",
      "/images/projetos/crfdesk/crfdesk-3.png",
      "/images/projetos/crfdesk/crfdesk-4.png",
      "/images/projetos/crfdesk/crfdesk-5.png",
      "/images/projetos/crfdesk/crfdesk-6.png",
      "/images/projetos/crfdesk/crfdesk-7.png",
      "/images/projetos/crfdesk/crfdesk-8.png",
      "/images/projetos/crfdesk/crfdesk-9.png",
      "/images/projetos/crfdesk/crfdesk-10.png",
      "/images/projetos/crfdesk/crfdesk-11.png",
      "/images/projetos/crfdesk/crfdesk-12.png",
      "/images/projetos/crfdesk/crfdesk-13.png",
      "/images/projetos/crfdesk/crfdesk-14.png",
    ],
    link: "/projetos/crfdesk#demo",
    github: "",
    hasLiveBackend: false,
    overview:
      "CRFDesk é uma plataforma de screening e compliance para ativos cripto, construída para equipas que precisam de avaliar o risco de uma carteira, transação ou contrato antes de aceitar ou processar uma operação. Em vez de devolver apenas \"alto risco\" ou \"baixo risco\", o sistema produz um score quantificado, explicado fator a fator, com histórico e versionamento por entidade, e permite gerar tanto relatórios de análise como Relatórios de Atividade Suspeita (SAR) formais, com um fluxo de aprovação por um responsável antes de qualquer submissão. Inclui ainda painel de administração multi-utilizador, gestão de chaves de API para integrações externas e um dashboard de consumo por plano.",
    problem:
      "Equipas de compliance em exchanges e fintechs cripto não podem justificar uma decisão de \"risco alto\" a um regulador ou auditor com uma caixa preta — precisam de saber exatamente que fatores contribuíram para o score, com que peso, e com que grau de confiança. O desafio deste projeto foi construir um motor de risco desenhado para ser explicável desde a raiz, não um número isolado: cada resultado de screening tem de conseguir sustentar-se sozinho como prova documental, com histórico de versões e um caminho de auditoria completo.",
    stack: [
      { label: "Frontend", items: ["Next.js 15 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion", "TanStack Query"] },
      { label: "Backend", items: ["Node.js", "Express", "TypeScript", "Fila de jobs em background", "Geração de relatórios PDF"] },
      { label: "Base de dados", items: ["MongoDB", "Mongoose (ODM)", "Modelos dedicados para screenings, relatórios, SARs e logs de auditoria"] },
      { label: "Infraestrutura", items: ["Docker + Docker Compose", "Nginx como reverse proxy", "Autenticação por chave de API para integrações externas", "Webhooks configuráveis"] },
    ],
    architecture: [
      {
        title: "Um único orquestrador para todo o fluxo de screening",
        content:
          "Todos os pedidos de screening passam obrigatoriamente por um único serviço orquestrador, que encadeia validação do pedido, cálculo de risco, geração do detalhe do score, versionamento, atualização da linha temporal da entidade, geração de relatório, registo de auditoria, notificações e contabilização de consumo do plano. Os controladores da API nunca chamam os serviços internos isoladamente — isto garante que nenhum screening consegue \"saltar\" uma etapa obrigatória do fluxo, o que é essencial num produto cujo output pode acabar como prova para um regulador.",
      },
      {
        title: "Score composto por fatores de risco explicáveis, não um número mágico",
        content:
          "Em vez de um único valor sem explicação, cada screening produz uma lista de fatores de risco (\"reason codes\"), cada um com categoria, descrição, pontos atribuídos, peso percentual, fonte da evidência e nível de confiança (alto/médio/baixo). O score final é a soma explicável destes fatores, agrupados por categoria com a respetiva severidade — desenhado para que uma equipa de compliance consiga justificar cada ponto do resultado perante um auditor.",
      },
      {
        title: "Versionamento e linha temporal de risco por entidade",
        content:
          "Cada novo screening sobre o mesmo endereço ou carteira gera uma nova versão do score, em vez de substituir a anterior. Isto permite reconstruir como o risco de uma entidade evoluiu ao longo do tempo — importante porque uma avaliação feita hoje pode depender de informação que só existia numa versão mais recente, e a plataforma tem de conseguir mostrar essa diferença de forma auditável.",
      },
      {
        title: "Processamento pesado isolado em fila de jobs, fora do pedido HTTP",
        content:
          "Análises multi-chain e a geração de relatórios extensos em PDF não bloqueiam a resposta ao utilizador: são colocadas numa fila e processadas em background por um conjunto dedicado de workers, com o utilizador a ser notificado quando o resultado fica disponível. Isto mantém a interface responsiva mesmo quando uma análise demora vários segundos a completar.",
      },
      {
        title: "Selo de integridade sobre relatórios já emitidos",
        content:
          "Depois de gerado, um relatório passa por um serviço de integridade que impede alterações silenciosas ao seu conteúdo — uma garantia necessária quando o documento pode acabar por ser usado como prova formal perante uma autoridade.",
      },
    ],
    backend: [
      {
        title: "Fluxo de Relatório de Atividade Suspeita (SAR) com aprovação hierárquica",
        content:
          "Um analista pode gerar um rascunho de SAR a partir de um screening de risco alto ou crítico, preenchendo uma justificação; o relatório só avança de rascunho para aprovado (e depois submetido) com a aprovação explícita e registada de um supervisor. Não existe caminho automático de submissão — a decisão humana é sempre um passo obrigatório e auditável do fluxo.",
      },
      {
        title: "Aplicação de quota por plano antes de qualquer operação cara",
        content:
          "Cada organização tem um limite de screenings e relatórios definido pelo seu plano, verificado antes de iniciar qualquer operação com custo computacional relevante — evitando processar um pedido pesado que, de qualquer forma, seria depois rejeitado por limite excedido.",
      },
      {
        title: "Chaves de API com âmbito próprio, independentes do login de utilizador",
        content:
          "Integrações externas (por exemplo, um sistema que precisa de screenar automaticamente cada levantamento de fundos) autenticam-se com chaves de API dedicadas, geradas e revogáveis a qualquer momento a partir do painel — sem partilhar credenciais de utilizador nem exigir sessão interativa.",
      },
      {
        title: "Fator de risco de país como componente isolado e substituível",
        content:
          "A jurisdição associada a uma operação entra no motor de risco através de um adaptador dedicado, separado da lógica principal de scoring — permitindo atualizar a lista de países ou regiões de risco elevado sem alterar o resto do motor.",
      },
      {
        title: "Notificações assíncronas por webhook",
        content:
          "Sistemas externos podem subscrever eventos (por exemplo, \"relatório concluído\" ou \"SAR aprovado\") através de webhooks configuráveis, em vez de terem de consultar a API repetidamente à espera de uma mudança de estado.",
      },
    ],
    features: [
      "Screening de endereços, transações e contratos em múltiplas blockchains",
      "Score de risco quantificado com detalhe fator a fator",
      "Histórico e linha temporal de risco por entidade",
      "Geração de relatórios de análise em PDF com selo de integridade",
      "Fluxo de Relatório de Atividade Suspeita (SAR) com aprovação por supervisor",
      "Painel administrativo multi-utilizador",
      "Gestão de chaves de API para integrações externas",
      "Webhooks configuráveis para notificação de eventos",
      "Dashboard de consumo e limites do plano contratado",
      "Registo de auditoria completo de todas as ações",
    ],
    challenges: [
      {
        title: "Tornar o score totalmente explicável, sem ser uma caixa preta",
        content:
          "Resolvido com um motor de fatores de risco (\"reason codes\") categorizados, com peso e nível de confiança próprios, em vez de um único número sem justificação — cada resultado consegue ser decomposto e apresentado a um auditor.",
      },
      {
        title: "Garantir que um relatório já emitido não pode ser alterado depois",
        content:
          "Resolvido com um serviço de integridade dedicado que valida o conteúdo do relatório após a emissão, protegendo documentos que podem vir a ser usados como prova formal.",
      },
      {
        title: "Processar análises pesadas sem bloquear a experiência do utilizador",
        content:
          "Resolvido isolando o trabalho pesado (análise multi-chain, geração de PDF) numa fila de jobs em background, mantendo o pedido HTTP original rápido e a interface responsiva.",
      },
    ],
    learnings: [
      "Um motor de risco pensado para ser explicável desde o início muda completamente o desenho dos dados — deixa de ser \"calcular um número\" e passa a ser \"construir um caso justificável\"",
      "Separar autenticação de utilizador de autenticação por chave de API é essencial assim que um produto precisa de suportar integrações externas automatizadas",
      "Um padrão de orquestrador único, por onde tudo tem de passar, é uma forma eficaz de garantir que fluxos regulatórios nunca ficam incompletos por engano",
      "Aplicar limites de plano antes de operações caras, e não depois, poupa recursos e evita frustração do utilizador",
    ],
  },

  // 13. BOARDGOV AO
  {
    slug: "boardgov-ao",
    title: "BoardGov AO",
    tagline: "Plataforma multi-tenant de governança corporativa para conselhos de administração angolanos, com reuniões, votações e actas juridicamente defensáveis",
    technologies: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Docker"],
    image: "/images/boardgov.jpg",
    gallery: [
      "/images/projetos/boardgov/boardgov-1.jpg",
      "/images/projetos/boardgov/boardgov-2.jpg",
      "/images/projetos/boardgov/boardgov-3.jpg",
      "/images/projetos/boardgov/boardgov-4.jpg",
      "/images/projetos/boardgov/boardgov-5.jpg",
      "/images/projetos/boardgov/boardgov-6.jpg",
      "/images/projetos/boardgov/boardgov-7.jpg",
      "/images/projetos/boardgov/boardgov-8.jpg",
      "/images/projetos/boardgov/boardgov-9.jpg",
      "/images/projetos/boardgov/boardgov-10.jpg",
      "/images/projetos/boardgov/boardgov-11.jpg",
      "/images/projetos/boardgov/boardgov-12.jpg",
      "/images/projetos/boardgov/boardgov-13.jpg",
      "/images/projetos/boardgov/boardgov-14.jpg",
      "/images/projetos/boardgov/boardgov-15.jpg",
      "/images/projetos/boardgov/boardgov-16.jpg",
      "/images/projetos/boardgov/boardgov-17.jpg",
      "/images/projetos/boardgov/boardgov-18.jpg",
      "/images/projetos/boardgov/boardgov-19.jpg",
      "/images/projetos/boardgov/boardgov-20.jpg",
      "/images/projetos/boardgov/boardgov-21.jpg",
      "/images/projetos/boardgov/boardgov-22.jpg",
      "/images/projetos/boardgov/boardgov-23.jpg",
      "/images/projetos/boardgov/boardgov-24.jpg",
      "/images/projetos/boardgov/boardgov-25.jpg",
      "/images/projetos/boardgov/boardgov-26.jpg",
      "/images/projetos/boardgov/boardgov-27.jpg",
      "/images/projetos/boardgov/boardgov-28.jpg",
      "/images/projetos/boardgov/boardgov-29.jpg",
      "/images/projetos/boardgov/boardgov-30.jpg",
    ],
    link: "/projetos/boardgov-ao#demo",
    github: "",
    hasLiveBackend: false,
    overview:
      "BoardGov AO é uma plataforma de governança corporativa multi-tenant construída para conselhos de administração de organizações angolanas — bancos, seguradoras, correctoras e empresas públicas sujeitas a supervisão do BNA, da CMC ou de outras tutelas. Digitaliza todo o ciclo de vida de um conselho: convocatória de reuniões com cálculo automático de quórum, votação em tempo real e resoluções circulares assíncronas, redacção e aprovação de actas segundo a estrutura legal da Lei 1/04, sala de dados confidencial com marca de água dinâmica, declarações anuais de interesses, registo de conflitos, comités especializados, biblioteca pesquisável de precedentes, acesso de emergência auditado, portal temporário para auditores externos e um assistente de IA que gera rascunhos de actas e resume documentos. Existe ainda um painel de super administração separado, para gerir todas as organizações-cliente da plataforma, utilizadores, feature flags por módulo e saúde do sistema.",
    problem:
      "Em Angola, a governação de um conselho de administração ainda acontece maioritariamente em papel e em ficheiros soltos: convocatórias por email sem registo formal, actas escritas depois da reunião em Word, votações que ninguém consegue provar que aconteceram exactamente como descrito, e declarações de conflito de interesse arquivadas numa pasta que raramente alguém revê. Quando chega uma inspecção do BNA ou uma auditoria externa, reconstruir esse histórico é lento e frágil. O desafio deste projecto foi construir uma plataforma onde cada acto de governança — um voto, uma acta aprovada, um acesso a um documento confidencial — fica registado de uma forma que resiste a escrutínio, sem tornar o dia a dia do conselho mais burocrático do que já é.",
    stack: [
      { label: "Frontend", items: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS 4", "Radix UI (dialog, tabs, tooltip, select)"] },
      { label: "Backend", items: ["NestJS 11", "TypeScript", "Passport + JWT (access/refresh)", "Speakeasy (2FA / TOTP)", "PDFKit para relatórios", "Winston (logging estruturado)", "@anthropic-ai/sdk (assistente de IA)"] },
      { label: "Base de dados", items: ["PostgreSQL", "Prisma ORM", "Row-Level Security nativa do Postgres para isolamento multi-tenant", "Migrations versionadas"] },
      { label: "Infraestrutura", items: ["Docker + workspaces (api / web / database / shared)", "AWS S3 (documentos)", "AWS SES (emails)", "Redis / ioredis (blacklist de tokens, filas)", "Scheduler (@nestjs/schedule) para tarefas diárias"] },
    ],
    architecture: [
      {
        title: "Isolamento multi-tenant reforçado ao nível da base de dados, não só na aplicação",
        content:
          "Além do filtro habitual por organizationId nos services, o Postgres tem Row-Level Security activada em todas as tabelas sensíveis: no início de cada transacção a aplicação define SET LOCAL app.current_organisation_id, e uma política RLS filtra automaticamente qualquer SELECT, INSERT ou UPDATE com base nesse valor — de forma transparente para o Prisma. Isto significa que, mesmo que um bug na camada de aplicação se esqueça de filtrar por organização, a base de dados continua a impedir o acesso cruzado entre clientes. Existe um bypass explícito (app.bypass_rls) apenas para migrations e seeds.",
      },
      {
        title: "Máquina de estados explícita para o ciclo de vida de uma reunião",
        content:
          "Uma reunião só pode transitar entre estados (DRAFT → CONVENED → IN_PROGRESS → COMPLETED, ou CANCELLED a partir de DRAFT/CONVENED) através de um mapa de transições válidas verificado antes de qualquer mudança de estado — qualquer tentativa de saltar directamente de rascunho para reunião concluída é rejeitada. O quórum é calculado automaticamente no momento em que a reunião arranca (achievedPercent face ao quorumPercent definido pela organização ou pela própria reunião), e essa percentagem fica registada no evento de início, não recalculada a posteriori.",
      },
      {
        title: "Votos com hash de integridade, imutáveis por desenho",
        content:
          "Cada voto (ballot) gera um hash SHA-256 sobre o id da votação, o membro, o valor votado e o instante exacto do voto. Depois de submetido, um ballot não pode ser alterado nem apagado, e uma constraint única na base de dados impede que o mesmo membro vote duas vezes na mesma votação. Depois de fechada, uma votação deixa de aceitar novos ballots. Abstenções por conflito de interesse (CONFLICT_ABSTENTION) são registadas mas excluídas do cálculo de maioria — o resultado é sempre uma comparação simples entre votos a favor e contra dos membros sem conflito.",
      },
      {
        title: "Actas com fluxo legal e reaproveitamento de arquitectura para resoluções circulares",
        content:
          "As actas seguem DRAFT → UNDER_REVIEW → APPROVED: em rascunho o Secretário edita livremente, em revisão só ele pode fazer correcções enquanto os membros leem, e uma vez aprovada na reunião seguinte a acta torna-se imutável. O conteúdo inicial é gerado automaticamente com a estrutura exigida pela Lei 1/04 (presenças, ordem do dia, deliberações). As resoluções circulares — votações assíncronas fora de uma reunião presencial — não têm um módulo à parte: reaproveitam a mesma arquitectura de Votes com mode=ASYNC e uma reunião virtual do tipo CIRCULAR_RESOLUTION, evitando duplicar toda a lógica de imutabilidade já validada.",
      },
      {
        title: "RBAC em duas camadas independentes: papel na organização e papel na plataforma",
        content:
          "Um utilizador tem um papel dentro do conselho (PRESIDENT, BOARD_MEMBER, SECRETARY, GUEST, definido em BoardMemberRole) completamente separado do seu eventual papel como administrador da plataforma (AdminRole, usado só no painel de super administração multi-organização). Misturar estas duas dimensões foi identificado cedo como fonte de bugs de autorização — por isso nunca partilham o mesmo enum nem o mesmo guard, mesmo quando a mesma pessoa acumula os dois papéis.",
      },
    ],
    backend: [
      {
        title: "Marca de água dinâmica sem tocar no ficheiro original",
        content:
          "Ao visualizar um PDF confidencial, o backend descarrega o ficheiro do bucket privado no S3, aplica uma marca de água com o nome do membro e a data/hora exacta usando pdf-lib, faz upload do resultado para um bucket temporário e devolve um presigned URL válido por 15 minutos. O documento original nunca é alterado — cada visualização gera a sua própria cópia marcada, rastreável a quem a pediu.",
      },
      {
        title: "Sala de Dados Virtual (VDR) com permissões granulares e log imutável",
        content:
          "Documentos especialmente confidenciais podem viver numa VdrRoom isolada, com permissões definidas membro a membro (ver / descarregar / imprimir) e expiração automática. Cada acesso — visualização, download ou impressão — fica registado num log que não pode ser editado, o que transforma a sala de dados numa peça central de qualquer auditoria posterior.",
      },
      {
        title: "\"Nunca bloquear numa emergência, sempre auditar\"",
        content:
          "O acesso de emergência é o único fluxo da plataforma desenhado para não ter fricção: apenas Presidente e Secretário o podem solicitar, mas quando o fazem o acesso é concedido de imediato, por no máximo 8 horas. Em troca, todos os outros Presidentes e Secretários são notificados no momento, e cada acção realizada durante esse acesso — IP, user-agent, documentos abertos — fica gravada de forma imutável, podendo ser sinalizada para investigação depois.",
      },
      {
        title: "Portal de auditores externos com sessão temporária e revogação imediata",
        content:
          "O Secretário gera um acesso para um auditor externo (BNA, CMC, revisor de contas), que recebe um token único (UUID v4 + HMAC) por email. Ao aceder, o auditor obtém uma sessão JWT válida por 4 horas, navega numa interface só de leitura com watermark automático em qualquer PDF, e cada consulta fica registada. O Secretário pode revogar o acesso a qualquer momento — o token é invalidado de imediato através de uma blacklist em Redis, sem esperar pela expiração natural.",
      },
      {
        title: "Relatórios de conformidade gerados a partir dos mesmos dados de governança",
        content:
          "Em vez de manter um formato de exportação por tutela, os relatórios para BNA, CMC, ARSEG ou MINFIN partilham a mesma base de dados (composição do conselho, actividade de reuniões, deliberações, conflitos, audit log) e só divergem na formatação final — o que permite adicionar uma nova tutela sem replicar lógica de negócio.",
      },
      {
        title: "Assistente de IA como camada fina sobre dados reais da organização",
        content:
          "O módulo de IA integra a API da Anthropic para quatro tarefas concretas — rascunho de acta a partir da agenda e decisões da reunião, resumo de um documento, deteção de riscos legais/financeiros num documento e sugestão de pontos de agenda com base no histórico da organização. Cada chamada regista os tokens consumidos, para controlo de custo por organização.",
      },
    ],
    features: [
      "Convocatória de reuniões com cálculo automático de quórum",
      "Votação em tempo real e resoluções circulares assíncronas",
      "Actas com fluxo legal de rascunho, revisão e aprovação (Lei 1/04)",
      "Sala de Dados Virtual (VDR) com marca de água dinâmica e log de acessos",
      "Conselho de Administração: membros, mandatos, papéis e comités especializados",
      "Declarações anuais de interesses e registo de conflitos, alinhados com o BNA",
      "Biblioteca de precedentes com indexação automática a partir de actas aprovadas",
      "Acesso de emergência auditado para Presidente e Secretário",
      "Portal temporário e revogável para auditores externos",
      "Mensagens seguras encriptadas entre membros do conselho",
      "Assistente de IA para actas, resumos, riscos e sugestão de agenda",
      "Exportação de relatórios (PDF, CSV, JSON), incluindo relatório BNA/Ministério",
      "Painel de super administração multi-organização, com feature flags por módulo",
      "Autenticação de dois factores (TOTP) e audit log completo",
    ],
    challenges: [
      {
        title: "Garantir isolamento entre organizações mesmo perante um erro de programação",
        content:
          "Resolvido com Row-Level Security directamente no Postgres, como segunda linha de defesa depois do filtro aplicacional — a base de dados nunca devolve dados de outra organização, independentemente de um service se esquecer de filtrar por organizationId.",
      },
      {
        title: "Fazer com que um voto ou uma acta aprovada nunca possam ser questionados como adulterados",
        content:
          "Resolvido com hash de integridade por voto, constraint de unicidade contra voto duplicado, votações fechadas que recusam novos ballots, e actas que passam a ser imutáveis assim que aprovadas — cada peça pensada para sustentar-se como prova perante um regulador.",
      },
      {
        title: "Suportar um acesso de emergência sem abrir uma brecha de segurança nem travar uma crise real",
        content:
          "Resolvido invertendo a lógica habitual: em vez de bloquear e pedir aprovação, o acesso é concedido de imediato a papéis restritos (Presidente/Secretário), com limite de tempo curto, notificação instantânea a todos os responsáveis e um registo imutável de tudo o que foi acedido durante a janela de emergência.",
      },
    ],
    learnings: [
      "Row-Level Security ao nível da base de dados é uma rede de segurança que sobrevive a bugs futuros na camada de aplicação — vale a pena mesmo quando o filtro aplicacional já existe",
      "Reaproveitar uma arquitectura já validada (Votes) para um caso de uso novo (resoluções circulares) é mais seguro do que construir um módulo paralelo com a sua própria lógica de imutabilidade",
      "Separar por completo o papel de alguém na organização do seu papel na plataforma evita uma classe inteira de bugs de autorização que só aparecem quando a mesma pessoa acumula os dois",
      "Desenhar desde o início para conformidade regulatória (Lei 1/04, relatórios BNA) poupa retrabalho grande quando chega a altura de gerar esses relatórios, porque os dados já nascem na forma certa",
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export function mergeProjectTranslation(
  project: ProjectData,
  translation:
    | {
        title: string;
        tagline: string;
        overview: string;
        problem: string;
        stack: StackGroup[];
        architecture: ContentBlock[];
        backend: ContentBlock[];
        features: string[];
        challenges: ContentBlock[];
        learnings: string[];
      }
    | undefined
): ProjectData {
  if (!translation) return project;
  return {
    ...project,
    title: translation.title,
    tagline: translation.tagline,
    overview: translation.overview,
    problem: translation.problem,
    stack: translation.stack,
    architecture: translation.architecture,
    backend: translation.backend,
    features: translation.features,
    challenges: translation.challenges,
    learnings: translation.learnings,
  };
}
