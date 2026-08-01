"use client";

import { useMemo, useState } from "react";
import {
  Info,
  Store,
  Package,
  ShoppingCart,
  LayoutDashboard,
  Users,
  Receipt,
  UserCog,
  Link2,
  Search,
  Heart,
  Star,
  MapPin,
  Check,
  Trash2,
  CreditCard,
  QrCode,
  FileText,
  Copy,
  TrendingUp,
  Truck,
  Ticket,
  Wine,
  Sandwich,
  Shirt,
  Gem,
  Eye,
  EyeOff,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tipos                                                                */
/* ------------------------------------------------------------------ */

type TopRole = "loja" | "produtor" | "afiliado" | "admin";
type LojaView = "produtos" | "carrinho" | "checkout";
type ProdutorView = "geral" | "produtos" | "vendas" | "perfil";
type AfiliadoView = "geral" | "links" | "vendas";
type AdminView = "geral" | "usuarios" | "produtores" | "vendas";
type Category = "wine" | "food" | "crafts" | "leather";
type PaymentMethod = "credit_card" | "pix" | "boleto";
type SaleStatus = "pending" | "confirmed" | "paid" | "cancelled";
type AffiliateTier = "bronze" | "prata" | "ouro";

interface Producer {
  id: string;
  companyName: string;
  productType: string;
  location: string;
  plan: "iniciante" | "profissional" | "enterprise";
  rating: number;
  reviewsCount: number;
}

interface Product {
  id: string;
  producerId: string;
  name: string;
  category: Category;
  price: number;
  description: string;
  rating: number;
  reviewsCount: number;
  stock: number;
}

interface AffiliateAcc {
  id: string;
  name: string;
  referralCode: string;
  tier: AffiliateTier;
  monthlySales: number;
  totalSales: number;
  totalEarnings: number;
}

interface Sale {
  id: string;
  productId: string;
  producerId: string;
  affiliateId: string | null;
  buyerName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: SaleStatus;
  time: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

/* ------------------------------------------------------------------ */
/* Regras de negócio reais (espelham o backend Node/Express/MongoDB)   */
/* ------------------------------------------------------------------ */

const TIER_RULES: Record<AffiliateTier, { commissionRate: number; minMonthlySales: number; label: string }> = {
  bronze: { commissionRate: 0.05, minMonthlySales: 0, label: "Bronze" },
  prata: { commissionRate: 0.1, minMonthlySales: 10, label: "Prata" },
  ouro: { commissionRate: 0.15, minMonthlySales: 50, label: "Ouro" },
};

function calculateTier(monthlySales: number): AffiliateTier {
  if (monthlySales >= TIER_RULES.ouro.minMonthlySales) return "ouro";
  if (monthlySales >= TIER_RULES.prata.minMonthlySales) return "prata";
  return "bronze";
}

const FREE_SHIPPING_THRESHOLD = 300;
const FLAT_SHIPPING_FEE = 24.9;

/* ------------------------------------------------------------------ */
/* Dados fixos — espelham exatamente o script de seed do backend real  */
/* ------------------------------------------------------------------ */

const PRODUCERS: Producer[] = [
  { id: "p1", companyName: "Vinicola Mendoza", productType: "Vinhos", location: "Mendoza, Argentina", plan: "profissional", rating: 4.9, reviewsCount: 124 },
  { id: "p2", companyName: "Dulces Tradición", productType: "Doces Artesanais", location: "Córdoba, Argentina", plan: "iniciante", rating: 4.7, reviewsCount: 89 },
  { id: "p3", companyName: "Artesanos Andinos", productType: "Artesanato", location: "Jujuy, Argentina", plan: "iniciante", rating: 4.8, reviewsCount: 67 },
  { id: "p4", companyName: "Carnes Patagónicas", productType: "Carnes Especiais", location: "Patagônia, Argentina", plan: "enterprise", rating: 4.6, reviewsCount: 156 },
  { id: "p5", companyName: "Curtume Buenos Aires", productType: "Couro", location: "Buenos Aires, Argentina", plan: "profissional", rating: 4.7, reviewsCount: 102 },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: "prod1", producerId: "p1", name: "Malbec Reserva 2019", category: "wine", price: 89.9, description: "Vinho tinto encorpado com notas de frutas vermelhas e carvalho", rating: 4.9, reviewsCount: 124, stock: 50 },
  { id: "prod2", producerId: "p1", name: "Malbec Clássico 2021", category: "wine", price: 59.9, description: "Vinho tinto jovem e frutado, ótimo custo-benefício", rating: 4.6, reviewsCount: 58, stock: 80 },
  { id: "prod3", producerId: "p1", name: "Torrontés Blanco 2022", category: "wine", price: 49.9, description: "Vinho branco aromático, floral e leve", rating: 4.5, reviewsCount: 31, stock: 60 },
  { id: "prod4", producerId: "p2", name: "Doce de Leite Tradicional", category: "food", price: 24.9, description: "Doce de leite cremoso feito artesanalmente", rating: 4.8, reviewsCount: 89, stock: 200 },
  { id: "prod5", producerId: "p2", name: "Alfajores de Maicena (caixa c/ 12)", category: "food", price: 32.9, description: "Alfajores tradicionais recheados com doce de leite", rating: 4.7, reviewsCount: 54, stock: 150 },
  { id: "prod6", producerId: "p3", name: "Mate Tradicional Argentino", category: "crafts", price: 45.9, description: "Mate tradicional feito de porongo natural", rating: 4.6, reviewsCount: 156, stock: 40 },
  { id: "prod7", producerId: "p3", name: "Poncho Andino Tecido à Mão", category: "crafts", price: 189.9, description: "Poncho de lã tecido artesanalmente por artesãos andinos", rating: 4.9, reviewsCount: 22, stock: 15 },
  { id: "prod8", producerId: "p4", name: "Charque Patagônico Premium", category: "food", price: 79.9, description: "Corte especial de carne curada ao estilo patagônico", rating: 4.6, reviewsCount: 41, stock: 30 },
  { id: "prod9", producerId: "p5", name: "Cinto de Couro Legítimo", category: "leather", price: 129.9, description: "Cinto de couro legítimo com fivela prateada", rating: 4.7, reviewsCount: 67, stock: 45 },
  { id: "prod10", producerId: "p5", name: "Bolsa de Couro Artesanal", category: "leather", price: 249.9, description: "Bolsa de couro trabalhada à mão, acabamento premium", rating: 4.8, reviewsCount: 29, stock: 20 },
];

const INITIAL_AFFILIATES: AffiliateAcc[] = [
  { id: "a1", name: "Maria Silva", referralCode: "MARI7F2A", tier: "bronze", monthlySales: 3, totalSales: 18, totalEarnings: 145.5 },
  { id: "a2", name: "João Santos", referralCode: "JOAO4B91", tier: "prata", monthlySales: 15, totalSales: 92, totalEarnings: 812.4 },
  { id: "a3", name: "Ana Costa", referralCode: "ANAC7213", tier: "ouro", monthlySales: 62, totalSales: 310, totalEarnings: 6975.0 },
];

const INITIAL_SALES: Sale[] = [
  { id: "s1", productId: "prod8", producerId: "p4", affiliateId: null, buyerName: "Renato Ferreira", quantity: 2, unitPrice: 79.9, totalAmount: 159.8, commissionRate: 0, commissionAmount: 0, status: "confirmed", time: "há 3 horas" },
  { id: "s2", productId: "prod1", producerId: "p1", affiliateId: "a3", buyerName: "Cláudia Nunes", quantity: 1, unitPrice: 89.9, totalAmount: 89.9, commissionRate: 0.15, commissionAmount: 13.49, status: "paid", time: "ontem" },
  { id: "s3", productId: "prod2", producerId: "p1", affiliateId: "a2", buyerName: "Pedro Salgado", quantity: 2, unitPrice: 59.9, totalAmount: 119.8, commissionRate: 0.1, commissionAmount: 11.98, status: "confirmed", time: "há 2 dias" },
  { id: "s4", productId: "prod3", producerId: "p1", affiliateId: null, buyerName: "Sara Kiala", quantity: 1, unitPrice: 49.9, totalAmount: 49.9, commissionRate: 0, commissionAmount: 0, status: "pending", time: "há 5 horas" },
];

const CATEGORY_META: Record<Category, { label: string; icon: React.ReactNode }> = {
  wine: { label: "Vinhos", icon: <Wine size={13} /> },
  food: { label: "Alimentos", icon: <Sandwich size={13} /> },
  crafts: { label: "Artesanato", icon: <Gem size={13} /> },
  leather: { label: "Couro", icon: <Shirt size={13} /> },
};

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; description: string; icon: React.ReactNode }[] = [
  { id: "credit_card", label: "Cartão de crédito", description: "Em até 12x", icon: <CreditCard size={16} /> },
  { id: "pix", label: "Pix", description: "Aprovação imediata", icon: <QrCode size={16} /> },
  { id: "boleto", label: "Boleto bancário", description: "Vencimento em 3 dias úteis", icon: <FileText size={16} /> },
];

function formatBRL(v: number) {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}

function producerOf(id: string) {
  return PRODUCERS.find((p) => p.id === id)!;
}

function productOf(id: string, products: Product[]) {
  return products.find((p) => p.id === id)!;
}

function statusLabel(status: SaleStatus) {
  return { pending: "Pendente", confirmed: "Confirmada", paid: "Paga", cancelled: "Cancelada" }[status];
}

function statusBadge(status: SaleStatus) {
  if (status === "paid") return "bg-green-100 text-green-700";
  if (status === "confirmed") return "bg-blue-100 text-blue-700";
  if (status === "pending") return "bg-amber-100 text-amber-700";
  return "bg-gray-200 text-gray-600";
}

/* ------------------------------------------------------------------ */
/* Componente                                                           */
/* ------------------------------------------------------------------ */

const TOP_NAV: { key: TopRole; label: string; icon: React.ReactNode }[] = [
  { key: "loja", label: "Loja (visitante)", icon: <Store size={15} /> },
  { key: "produtor", label: "Painel do Produtor", icon: <LayoutDashboard size={15} /> },
  { key: "afiliado", label: "Painel do Afiliado", icon: <Link2 size={15} /> },
  { key: "admin", label: "Administração", icon: <Users size={15} /> },
];

export default function ArgPackDemo() {
  const [role, setRole] = useState<TopRole>("loja");
  const [lojaView, setLojaView] = useState<LojaView>("produtos");
  const [produtorView, setProdutorView] = useState<ProdutorView>("geral");
  const [afiliadoView, setAfiliadoView] = useState<AfiliadoView>("geral");
  const [adminView, setAdminView] = useState<AdminView>("geral");

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [affiliates, setAffiliates] = useState<AffiliateAcc[]>(INITIAL_AFFILIATES);
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES);

  // loja
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeRef, setActiveRef] = useState<string>(""); // simula ?ref= capturado na URL
  const [addedId, setAddedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // checkout
  const [buyerName, setBuyerName] = useState("Renato Ferreira");
  const [buyerEmail, setBuyerEmail] = useState("renato.ferreira@email.com");
  const [payment, setPayment] = useState<PaymentMethod>("pix");
  const [coupon, setCoupon] = useState("");
  const [orderDone, setOrderDone] = useState<{ orderNumber: string; total: number } | null>(null);

  // produtor / afiliado — "sessão simulada"
  const [producerId, setProducerId] = useState("p1");
  const [affiliateId, setAffiliateId] = useState("a3");

  // admin
  const [usersActive, setUsersActive] = useState<Record<string, boolean>>({});

  const activeProducer = producerOf(producerId);
  const activeAffiliate = affiliates.find((a) => a.id === affiliateId)!;

  const categories: { id: Category | "all"; label: string; count: number }[] = [
    { id: "all", label: "Todos", count: products.length },
    { id: "wine", label: "Vinhos", count: products.filter((p) => p.category === "wine").length },
    { id: "food", label: "Alimentos", count: products.filter((p) => p.category === "food").length },
    { id: "crafts", label: "Artesanato", count: products.filter((p) => p.category === "crafts").length },
    { id: "leather", label: "Couro", count: products.filter((p) => p.category === "leather").length },
  ];

  const filteredProducts = products.filter(
    (p) =>
      (activeCategory === "all" || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const cartWithProducts = cart.map((c) => ({ ...c, product: productOf(c.productId, products) }));
  const subtotal = cartWithProducts.reduce((s, c) => s + c.product.price * c.quantity, 0);
  const discount = coupon.trim().toUpperCase() === "ARGPACK10" && subtotal > 0 ? Number((subtotal * 0.1).toFixed(2)) : 0;
  const shippingFee = subtotal > 0 && subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : subtotal > 0 ? FLAT_SHIPPING_FEE : 0;
  const total = Number((subtotal - discount + shippingFee).toFixed(2));

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id);
      if (existing) {
        return prev.map((c) => (c.productId === product.id ? { ...c, quantity: Math.min(c.quantity + 1, product.stock) } : c));
      }
      return [...prev, { productId: product.id, quantity: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  }

  function toggleWishlist(id: string) {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
  }

  function copyAffiliateLink(product: Product) {
    setCopiedId(product.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function finalizeOrder() {
    const affiliate = activeRef ? affiliates.find((a) => a.referralCode === activeRef) ?? null : null;
    const commissionRate = affiliate ? TIER_RULES[affiliate.tier].commissionRate : 0;

    const newSales: Sale[] = cartWithProducts.map((c, i) => {
      const lineTotal = Number((c.product.price * c.quantity).toFixed(2));
      const commissionAmount = Number((lineTotal * commissionRate).toFixed(2));
      return {
        id: `s-new-${Date.now()}-${i}`,
        productId: c.product.id,
        producerId: c.product.producerId,
        affiliateId: affiliate?.id ?? null,
        buyerName,
        quantity: c.quantity,
        unitPrice: c.product.price,
        totalAmount: lineTotal,
        commissionRate,
        commissionAmount,
        status: "pending",
        time: "agora mesmo",
      };
    });

    setSales((prev) => [...newSales, ...prev]);
    setProducts((prev) =>
      prev.map((p) => {
        const line = cartWithProducts.find((c) => c.product.id === p.id);
        return line ? { ...p, stock: p.stock - line.quantity } : p;
      })
    );

    if (affiliate) {
      const totalCommission = newSales.reduce((s, sale) => s + sale.commissionAmount, 0);
      setAffiliates((prev) =>
        prev.map((a) => {
          if (a.id !== affiliate.id) return a;
          const monthlySales = a.monthlySales + newSales.length;
          return {
            ...a,
            monthlySales,
            totalSales: a.totalSales + newSales.length,
            totalEarnings: Number((a.totalEarnings + totalCommission).toFixed(2)),
            tier: calculateTier(monthlySales),
          };
        })
      );
    }

    const orderNumber = `ARG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setOrderDone({ orderNumber, total });
    setCart([]);
    setCoupon("");
  }

  function advanceSaleStatus(saleId: string) {
    setSales((prev) =>
      prev.map((s) => {
        if (s.id !== saleId) return s;
        const next: Record<SaleStatus, SaleStatus> = { pending: "confirmed", confirmed: "paid", paid: "paid", cancelled: "cancelled" };
        return { ...s, status: next[s.status] };
      })
    );
  }

  function cancelSale(saleId: string) {
    setSales((prev) => prev.map((s) => (s.id === saleId ? { ...s, status: "cancelled" } : s)));
  }

  // agregados por papel
  const producerSales = sales.filter((s) => s.producerId === producerId);
  const producerRevenue = producerSales.filter((s) => s.status === "confirmed" || s.status === "paid").reduce((s, x) => s + x.totalAmount, 0);
  const producerPending = producerSales.filter((s) => s.status === "pending").length;
  const producerProducts = products.filter((p) => p.producerId === producerId);

  const affiliateSales = sales.filter((s) => s.affiliateId === affiliateId);
  const affiliateSalesThisMonth = activeAffiliate.monthlySales;

  const totalRevenue = sales.filter((s) => s.status === "confirmed" || s.status === "paid").reduce((s, x) => s + x.totalAmount, 0);
  const totalCommissions = sales.filter((s) => s.status === "confirmed" || s.status === "paid").reduce((s, x) => s + x.commissionAmount, 0);
  const salesByStatus: Record<SaleStatus, number> = {
    pending: sales.filter((s) => s.status === "pending").length,
    confirmed: sales.filter((s) => s.status === "confirmed").length,
    paid: sales.filter((s) => s.status === "paid").length,
    cancelled: sales.filter((s) => s.status === "cancelled").length,
  };

  const DEMO_USERS = useMemo(
    () => [
      ...PRODUCERS.map((p) => ({ id: p.id, name: p.companyName.split(" ")[0] === "Vinicola" ? "Carlos Mendoza" : p.companyName, email: `${p.companyName.toLowerCase().replace(/[^a-z]/g, ".")}@argpack.com`, type: "Produtor" })),
      ...affiliates.map((a) => ({ id: a.id, name: a.name, email: `${a.name.toLowerCase().replace(" ", ".")}@argpack.com`, type: "Afiliado" })),
      { id: "admin", name: "Admin ArgPack", email: "admin@argpack.com", type: "Admin" },
    ],
    [affiliates]
  );

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden">
      <div className="flex items-start gap-3 p-4 bg-amber-500/10 border-b border-amber-500/20">
        <Info size={18} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-amber-200 text-sm leading-relaxed">
          Simulação a correr apenas no seu browser — não existe backend real nem base de dados. Esta demo
          reconstrói fielmente a loja, o checkout e os três painéis do ArgPack (produtor, afiliado, admin),
          incluindo o cálculo real de comissões por tier (Bronze 5% · Prata 10% com 10+ vendas/mês · Ouro 15%
          com 50+ vendas/mês). Compre um produto com um link de afiliado ativo e veja a comissão aparecer nos
          painéis de produtor, afiliado e admin.
        </p>
      </div>

      {/* fake browser chrome */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-950 border-b border-gray-800">
        <div className="flex gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 px-3 py-1 rounded-md bg-gray-900 text-xs text-gray-500 font-mono truncate">
          argpack.vercel.app{role === "loja" ? "" : `/dashboard/${role}`}
        </div>
      </div>

      {/* top role tabs */}
      <div className="flex gap-1 px-3 pt-3 overflow-x-auto bg-gray-950 border-b border-gray-800">
        {TOP_NAV.map((n) => (
          <button
            key={n.key}
            onClick={() => setRole(n.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              role === n.key ? "bg-gray-50 text-gray-900" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {n.icon}
            {n.label}
          </button>
        ))}
      </div>

      {/* content — light panel, matching the real app's light dashboards */}
      <div className="bg-gray-50 text-gray-900 min-h-[560px]">
        {/* ---------------------------- LOJA ---------------------------- */}
        {role === "loja" && (
          <div>
            <div className="flex flex-wrap items-center gap-2 px-4 sm:px-6 py-3 border-b border-gray-200 bg-white">
              {(["produtos", "carrinho", "checkout"] as LojaView[]).map((v) => {
                if (v === "checkout" && cart.length === 0 && !orderDone) return null;
                const labels: Record<LojaView, string> = { produtos: "Produtos", carrinho: `Carrinho (${cart.length})`, checkout: "Checkout" };
                return (
                  <button
                    key={v}
                    onClick={() => {
                      setLojaView(v);
                      if (v !== "checkout") setOrderDone(null);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                      lojaView === v ? "bg-[#2c549c] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {labels[v]}
                  </button>
                );
              })}

              <div className="ml-auto flex items-center gap-2 text-xs">
                <span className="text-gray-400">Simular chegada via link de:</span>
                <select
                  value={activeRef}
                  onChange={(e) => setActiveRef(e.target.value)}
                  className="rounded-lg border border-gray-300 px-2 py-1.5 bg-white text-gray-700"
                >
                  <option value="">Nenhum afiliado</option>
                  {affiliates.map((a) => (
                    <option key={a.id} value={a.referralCode}>
                      {a.name} ({a.referralCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeRef && (
              <div className="mx-4 sm:mx-6 mt-3 flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-[#2c549c]">
                <Link2 size={13} />
                Código de referência ativo: <span className="font-mono font-semibold">{activeRef}</span> — a venda
                será atribuída a este afiliado, como acontece via <code className="font-mono">?ref=</code> no site real.
              </div>
            )}

            {lojaView === "produtos" && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-300 bg-white">
                    <Search size={16} className="text-gray-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar produtos..."
                      className="flex-1 outline-none text-sm bg-transparent"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveCategory(c.id)}
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                        activeCategory === c.id ? "bg-[#2c549c] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {c.label} ({c.count})
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => {
                    const producer = producerOf(product.producerId);
                    const saved = wishlist.includes(product.id);
                    return (
                      <div key={product.id} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                        <div className="relative h-32 bg-gradient-to-br from-[#2c549c] to-[#4c5cbc] flex items-center justify-center text-white/70">
                          {CATEGORY_META[product.category].icon}
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/25 backdrop-blur flex items-center justify-center"
                          >
                            <Heart size={14} className={saved ? "fill-red-400 text-red-400" : "text-white"} />
                          </button>
                        </div>
                        <div className="p-4 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-sm leading-snug">{product.name}</h4>
                            <span className="flex items-center gap-0.5 text-xs text-amber-500 shrink-0">
                              <Star size={11} className="fill-amber-400" /> {product.rating}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin size={11} /> {producer.companyName}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="font-bold text-[#2c549c]">{formatBRL(product.price)}</span>
                            <button
                              onClick={() => addToCart(product)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2c549c] text-white text-xs font-semibold hover:opacity-90"
                            >
                              {addedId === product.id ? <Check size={13} /> : <ShoppingCart size={13} />}
                              {addedId === product.id ? "Adicionado" : "Adicionar"}
                            </button>
                          </div>
                          {activeRef && (
                            <button
                              onClick={() => copyAffiliateLink(product)}
                              className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 text-xs hover:border-[#2c549c] hover:text-[#2c549c]"
                            >
                              {copiedId === product.id ? <Check size={12} /> : <Copy size={12} />}
                              {copiedId === product.id ? "Link copiado!" : "Gerar link de afiliado"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {lojaView === "carrinho" && (
              <div className="p-4 sm:p-6 space-y-4 max-w-2xl">
                {cartWithProducts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-12">O seu carrinho está vazio.</p>
                ) : (
                  <>
                    {cartWithProducts.map((c) => (
                      <div key={c.productId} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2c549c] to-[#4c5cbc] flex items-center justify-center text-white/80 shrink-0">
                          {CATEGORY_META[c.product.category].icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{c.product.name}</p>
                          <p className="text-xs text-gray-400">{formatBRL(c.product.price)} · qtd {c.quantity}</p>
                        </div>
                        <span className="font-semibold text-sm text-[#2c549c]">{formatBRL(c.product.price * c.quantity)}</span>
                        <button
                          onClick={() => setCart((prev) => prev.filter((i) => i.productId !== c.productId))}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-sm text-gray-500">Subtotal</span>
                      <span className="font-bold">{formatBRL(subtotal)}</span>
                    </div>
                    <button
                      onClick={() => setLojaView("checkout")}
                      className="w-full py-2.5 rounded-full bg-[#2c549c] text-white font-semibold text-sm hover:opacity-90"
                    >
                      Continuar para o checkout
                    </button>
                  </>
                )}
              </div>
            )}

            {lojaView === "checkout" && (
              <div className="p-4 sm:p-6 max-w-3xl">
                {orderDone ? (
                  <div className="flex flex-col items-center text-center gap-3 py-14">
                    <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Check size={26} />
                    </div>
                    <h4 className="text-lg font-bold">Pedido confirmado!</h4>
                    <p className="text-sm text-gray-500">
                      Número do pedido <span className="font-mono font-semibold">{orderDone.orderNumber}</span> · Total {formatBRL(orderDone.total)}
                    </p>
                    <p className="text-xs text-gray-400 max-w-sm">
                      {activeRef
                        ? "A comissão já foi creditada ao afiliado e a venda apareceu no painel do produtor — veja nos separadores acima."
                        : "Consulte o separador do produtor para ver esta venda a aparecer no painel dele."}
                    </p>
                    <button
                      onClick={() => setLojaView("produtos")}
                      className="mt-2 px-5 py-2 rounded-full border border-gray-300 text-sm font-medium hover:border-[#2c549c] hover:text-[#2c549c]"
                    >
                      Continuar a comprar
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500 font-medium">Nome completo</label>
                        <input
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2c549c]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium">Email</label>
                        <input
                          value={buyerEmail}
                          onChange={(e) => setBuyerEmail(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2c549c]"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium mb-2 block">Forma de pagamento</label>
                        <div className="space-y-2">
                          {PAYMENT_OPTIONS.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => setPayment(opt.id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                                payment === opt.id ? "border-[#2c549c] bg-blue-50" : "border-gray-200 bg-white"
                              }`}
                            >
                              <span className={payment === opt.id ? "text-[#2c549c]" : "text-gray-400"}>{opt.icon}</span>
                              <span className="flex-1">
                                <span className="block text-sm font-medium">{opt.label}</span>
                                <span className="block text-xs text-gray-400">{opt.description}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <Ticket size={12} /> Cupão de desconto
                        </label>
                        <input
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          placeholder="Experimente ARGPACK10"
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#2c549c] font-mono"
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 h-fit space-y-3">
                      <h4 className="font-semibold text-sm mb-2">Resumo do pedido</h4>
                      {cartWithProducts.map((c) => (
                        <div key={c.productId} className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            {c.product.name} × {c.quantity}
                          </span>
                          <span>{formatBRL(c.product.price * c.quantity)}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-gray-100 space-y-1.5 text-sm">
                        <div className="flex justify-between text-gray-500">
                          <span>Subtotal</span>
                          <span>{formatBRL(subtotal)}</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Desconto (ARGPACK10)</span>
                            <span>-{formatBRL(discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-500 items-center gap-1">
                          <span className="flex items-center gap-1">
                            <Truck size={12} /> Frete
                          </span>
                          <span>{shippingFee === 0 ? "Grátis" : formatBRL(shippingFee)}</span>
                        </div>
                        {subtotal > 0 && subtotal - discount < FREE_SHIPPING_THRESHOLD && (
                          <p className="text-[11px] text-gray-400">
                            Faltam {formatBRL(FREE_SHIPPING_THRESHOLD - (subtotal - discount))} para frete grátis.
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-100 font-bold">
                        <span>Total</span>
                        <span className="text-[#2c549c]">{formatBRL(total)}</span>
                      </div>
                      <button
                        onClick={finalizeOrder}
                        disabled={cartWithProducts.length === 0}
                        className="w-full py-2.5 rounded-full bg-[#2c549c] text-white font-semibold text-sm hover:opacity-90 disabled:opacity-40"
                      >
                        Finalizar pedido
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------- PRODUTOR ---------------------------- */}
        {role === "produtor" && (
          <DashboardShell
            roleLabel="Painel do Produtor"
            name={activeProducer.companyName}
            nav={[
              { key: "geral", label: "Visão geral", icon: <LayoutDashboard size={16} /> },
              { key: "produtos", label: "Meus produtos", icon: <Package size={16} /> },
              { key: "vendas", label: "Vendas", icon: <Receipt size={16} /> },
              { key: "perfil", label: "Perfil", icon: <UserCog size={16} /> },
            ]}
            active={produtorView}
            onChange={(k) => setProdutorView(k as ProdutorView)}
            extra={
              <select
                value={producerId}
                onChange={(e) => setProducerId(e.target.value)}
                className="text-xs rounded-lg border border-gray-300 px-2 py-1.5 bg-white"
              >
                {PRODUCERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.companyName}
                  </option>
                ))}
              </select>
            }
          >
            {produtorView === "geral" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Receita confirmada" value={formatBRL(producerRevenue)} color="green" sub="Vendas confirmadas ou pagas" />
                  <StatCard label="Total de vendas" value={String(producerSales.length)} color="blue" />
                  <StatCard label="Pendentes" value={String(producerPending)} color="amber" sub="Aguardando confirmação" />
                  <StatCard label="Produtos ativos" value={String(producerProducts.length)} color="purple" />
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Produtos mais vendidos</h4>
                  <div className="space-y-2">
                    {producerProducts
                      .map((p) => ({ p, units: sales.filter((s) => s.productId === p.id).reduce((a, s) => a + s.quantity, 0) }))
                      .sort((a, b) => b.units - a.units)
                      .map(({ p, units }) => (
                        <div key={p.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 font-medium">{p.name}</span>
                          <span className="text-gray-500">
                            {units} un. · {formatBRL(units * p.price)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {produtorView === "produtos" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {producerProducts.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                    <div className="h-24 bg-gradient-to-br from-[#2c549c] to-[#4c5cbc] flex items-center justify-center text-white/70">
                      {CATEGORY_META[p.category].icon}
                    </div>
                    <div className="p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{p.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Ativo</span>
                      </div>
                      <p className="text-xs text-gray-400">{CATEGORY_META[p.category].label}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-bold text-[#2c549c]">{formatBRL(p.price)}</span>
                        <span className="text-xs text-gray-400">{p.stock} em estoque</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {produtorView === "vendas" && (
              <SalesTable
                sales={producerSales}
                products={products}
                affiliates={affiliates}
                onAdvance={advanceSaleStatus}
                onCancel={cancelSale}
                showProducer={false}
              />
            )}

            {produtorView === "perfil" && (
              <div className="max-w-lg bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
                <ProfileRow label="Empresa" value={activeProducer.companyName} />
                <ProfileRow label="Tipo de produto" value={activeProducer.productType} />
                <ProfileRow label="Localização" value={activeProducer.location} />
                <ProfileRow label="Plano" value={activeProducer.plan} badge="bg-blue-100 text-[#2c549c] capitalize" />
                <ProfileRow label="Avaliação" value={`${activeProducer.rating} ★ (${activeProducer.reviewsCount})`} />
              </div>
            )}
          </DashboardShell>
        )}

        {/* ---------------------------- AFILIADO ---------------------------- */}
        {role === "afiliado" && (
          <DashboardShell
            roleLabel="Painel do Afiliado"
            name={activeAffiliate.name}
            nav={[
              { key: "geral", label: "Visão geral", icon: <LayoutDashboard size={16} /> },
              { key: "links", label: "Gerar links", icon: <Link2 size={16} /> },
              { key: "vendas", label: "Minhas vendas", icon: <Receipt size={16} /> },
            ]}
            active={afiliadoView}
            onChange={(k) => setAfiliadoView(k as AfiliadoView)}
            extra={
              <select
                value={affiliateId}
                onChange={(e) => setAffiliateId(e.target.value)}
                className="text-xs rounded-lg border border-gray-300 px-2 py-1.5 bg-white"
              >
                {affiliates.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            }
          >
            {afiliadoView === "geral" && (
              <div className="space-y-6">
                <div className="rounded-2xl p-6 text-white bg-gradient-to-r from-[#2c549c] to-[#4c5cbc]">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-sm text-white/80">Seu código de referência</p>
                      <p className="text-2xl font-bold tracking-wide">{activeAffiliate.referralCode}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-white/20 font-semibold uppercase">
                      {TIER_RULES[activeAffiliate.tier].label}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 mt-4">
                    Taxa de comissão atual: <span className="font-semibold">{TIER_RULES[activeAffiliate.tier].commissionRate * 100}%</span>
                  </p>
                  {activeAffiliate.tier !== "ouro" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-white/80 mb-1">
                        <span>Vendas este mês: {affiliateSalesThisMonth}</span>
                        <span>
                          Próximo tier em {(activeAffiliate.tier === "bronze" ? TIER_RULES.prata.minMonthlySales : TIER_RULES.ouro.minMonthlySales) - affiliateSalesThisMonth} vendas
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (affiliateSalesThisMonth / (activeAffiliate.tier === "bronze" ? TIER_RULES.prata.minMonthlySales : TIER_RULES.ouro.minMonthlySales)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard label="Ganhos totais" value={formatBRL(activeAffiliate.totalEarnings)} color="green" />
                  <StatCard label="Vendas este mês" value={String(activeAffiliate.monthlySales)} color="amber" />
                  <StatCard label="Vendas totais" value={String(activeAffiliate.totalSales)} color="blue" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["bronze", "prata", "ouro"] as AffiliateTier[]).map((t) => (
                    <div key={t} className={`rounded-xl border p-4 text-sm ${activeAffiliate.tier === t ? "border-[#2c549c] bg-blue-50" : "border-gray-200 bg-white"}`}>
                      <p className="font-semibold capitalize">{TIER_RULES[t].label}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {TIER_RULES[t].minMonthlySales === 0 ? "Sem requisitos" : `${TIER_RULES[t].minMonthlySales}+ vendas/mês`}
                      </p>
                      <p className="text-[#2c549c] font-bold mt-2">{TIER_RULES[t].commissionRate * 100}% de comissão</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {afiliadoView === "links" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 mb-2">Copie o link de afiliado de qualquer produto do catálogo para promover e ganhar comissão.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.slice(0, 8).map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 bg-white">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-gray-400 font-mono truncate">argpack.app/products/{p.id}?ref={activeAffiliate.referralCode}</p>
                      </div>
                      <button
                        onClick={() => copyAffiliateLink(p)}
                        className="shrink-0 p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#2c549c]"
                      >
                        {copiedId === p.id ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {afiliadoView === "vendas" && (
              <SalesTable
                sales={affiliateSales}
                products={products}
                affiliates={affiliates}
                showProducer
                showCommission
              />
            )}
          </DashboardShell>
        )}

        {/* ---------------------------- ADMIN ---------------------------- */}
        {role === "admin" && (
          <DashboardShell
            roleLabel="Painel de Administração"
            name="Admin ArgPack"
            nav={[
              { key: "geral", label: "Visão geral", icon: <LayoutDashboard size={16} /> },
              { key: "usuarios", label: "Usuários", icon: <Users size={16} /> },
              { key: "produtores", label: "Produtores", icon: <Store size={16} /> },
              { key: "vendas", label: "Vendas", icon: <Receipt size={16} /> },
            ]}
            active={adminView}
            onChange={(k) => setAdminView(k as AdminView)}
          >
            {adminView === "geral" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Receita líquida" value={formatBRL(totalRevenue - totalCommissions)} color="green" sub={`${formatBRL(totalCommissions)} em comissões pagas`} />
                  <StatCard label="Produtores" value={String(PRODUCERS.length)} color="blue" />
                  <StatCard label="Afiliados" value={String(affiliates.length)} color="purple" />
                  <StatCard label="Produtos ativos" value={String(products.length)} color="amber" sub={`${products.length} no total`} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Usuários</h4>
                    <p className="text-3xl font-bold text-gray-900">{DEMO_USERS.length}</p>
                    <p className="text-sm text-gray-500 mt-1">contas no total</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Vendas por status</h4>
                    <div className="space-y-2">
                      {(Object.keys(salesByStatus) as SaleStatus[]).map((st) => (
                        <div key={st} className="flex items-center justify-between text-sm">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(st)}`}>{statusLabel(st)}</span>
                          <span className="font-semibold text-gray-700">{salesByStatus[st]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h4 className="text-lg font-bold text-gray-900">Vendas recentes</h4>
                  </div>
                  <SalesTable sales={sales.slice(0, 6)} products={products} affiliates={affiliates} showProducer bare />
                </div>
              </div>
            )}

            {adminView === "usuarios" && (
              <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-100 text-left text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Nome</th>
                      <th className="px-5 py-3 font-medium">Email</th>
                      <th className="px-5 py-3 font-medium">Tipo</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_USERS.map((u) => {
                      const active = usersActive[u.id] !== false;
                      return (
                        <tr key={u.id} className="border-b border-gray-50 last:border-0">
                          <td className="px-5 py-3 font-medium text-gray-900">{u.name}</td>
                          <td className="px-5 py-3 text-gray-500 font-mono text-xs">{u.email}</td>
                          <td className="px-5 py-3 text-gray-500">{u.type}</td>
                          <td className="px-5 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                              {active ? "Ativo" : "Desativado"}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => setUsersActive((prev) => ({ ...prev, [u.id]: !active }))}
                              disabled={u.type === "Admin"}
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#2c549c] hover:underline disabled:text-gray-300 disabled:no-underline"
                            >
                              {active ? <EyeOff size={12} /> : <Eye size={12} />}
                              {active ? "Desativar" : "Reativar"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {adminView === "produtores" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRODUCERS.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold">{p.companyName}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-[#2c549c] capitalize">{p.plan}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {p.productType} · {p.location}
                    </p>
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <span className="text-gray-500">{products.filter((pr) => pr.producerId === p.id).length} produtos</span>
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star size={12} className="fill-amber-400" /> {p.rating} ({p.reviewsCount})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {adminView === "vendas" && (
              <SalesTable sales={sales} products={products} affiliates={affiliates} showProducer onAdvance={advanceSaleStatus} onCancel={cancelSale} />
            )}
          </DashboardShell>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponentes                                                       */
/* ------------------------------------------------------------------ */

function DashboardShell({
  roleLabel,
  name,
  nav,
  active,
  onChange,
  extra,
  children,
}: {
  roleLabel: string;
  name: string;
  nav: { key: string; label: string; icon: React.ReactNode }[];
  active: string;
  onChange: (key: string) => void;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row">
      <aside className="lg:w-60 shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-gray-200">
        <div className="p-5">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{roleLabel}</p>
          <p className="text-base font-bold text-gray-900 mt-0.5 truncate">{name}</p>
          {extra && <div className="mt-3">{extra}</div>}
        </div>
        <nav className="px-3 pb-5 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {nav.map((item) => (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                active === item.key ? "bg-[#2c549c] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0 p-4 sm:p-6">{children}</main>
    </div>
  );
}

function StatCard({ label, value, color, sub }: { label: string; value: string; color: "green" | "blue" | "amber" | "purple"; sub?: string }) {
  const colorMap = {
    green: "text-green-600 bg-green-50",
    blue: "text-blue-600 bg-blue-50",
    amber: "text-amber-600 bg-amber-50",
    purple: "text-purple-600 bg-purple-50",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <TrendingUp size={14} />
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function ProfileRow({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      {badge ? <span className={`text-xs px-2 py-0.5 rounded-full ${badge}`}>{value}</span> : <span className="text-sm text-gray-700">{value}</span>}
    </div>
  );
}

function SalesTable({
  sales,
  products,
  affiliates,
  showProducer,
  showCommission,
  onAdvance,
  onCancel,
  bare,
}: {
  sales: Sale[];
  products: Product[];
  affiliates: AffiliateAcc[];
  showProducer?: boolean;
  showCommission?: boolean;
  onAdvance?: (id: string) => void;
  onCancel?: (id: string) => void;
  bare?: boolean;
}) {
  if (sales.length === 0) {
    return <p className="text-sm text-gray-500 p-6 text-center">Ainda não há vendas para mostrar.</p>;
  }

  const table = (
    <table className="w-full text-sm">
      <thead className="border-b border-gray-100 text-left text-gray-500">
        <tr>
          <th className="px-5 py-3 font-medium">Produto</th>
          {showProducer && <th className="px-5 py-3 font-medium">Produtor</th>}
          <th className="px-5 py-3 font-medium">Comprador</th>
          <th className="px-5 py-3 font-medium">Total</th>
          {showCommission && <th className="px-5 py-3 font-medium">Comissão</th>}
          <th className="px-5 py-3 font-medium">Status</th>
          {(onAdvance || onCancel) && <th className="px-5 py-3 font-medium text-right">Ação</th>}
        </tr>
      </thead>
      <tbody>
        {sales.map((s) => {
          const product = productOf(s.productId, products);
          const affiliate = affiliates.find((a) => a.id === s.affiliateId);
          return (
            <tr key={s.id} className="border-b border-gray-50 last:border-0">
              <td className="px-5 py-3 font-medium text-gray-900">
                {product.name} <span className="text-gray-400 font-normal">× {s.quantity}</span>
              </td>
              {showProducer && <td className="px-5 py-3 text-gray-500">{producerOf(s.producerId).companyName}</td>}
              <td className="px-5 py-3 text-gray-500">{s.buyerName}</td>
              <td className="px-5 py-3 font-semibold text-[#2c549c]">{formatBRL(s.totalAmount)}</td>
              {showCommission && (
                <td className="px-5 py-3 text-gray-500">{affiliate ? formatBRL(s.commissionAmount) : "—"}</td>
              )}
              <td className="px-5 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusBadge(s.status)}`}>{statusLabel(s.status)}</span>
              </td>
              {(onAdvance || onCancel) && (
                <td className="px-5 py-3 text-right space-x-2 whitespace-nowrap">
                  {onAdvance && s.status !== "paid" && s.status !== "cancelled" && (
                    <button onClick={() => onAdvance(s.id)} className="text-xs font-medium text-[#2c549c] hover:underline">
                      {s.status === "pending" ? "Confirmar" : "Marcar paga"}
                    </button>
                  )}
                  {onCancel && s.status !== "paid" && s.status !== "cancelled" && (
                    <button onClick={() => onCancel(s.id)} className="text-xs font-medium text-red-500 hover:underline">
                      Cancelar
                    </button>
                  )}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  if (bare) return <div className="overflow-x-auto">{table}</div>;
  return <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">{table}</div>;
}
