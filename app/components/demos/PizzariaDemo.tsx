"use client";

import { useMemo, useState } from "react";
import {
  Info,
  Lock,
  Pizza,
  ChefHat,
  Users as UsersIcon,
  Table2,
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Trash2,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle2,
  Send,
  Wallet,
  X,
  Search,
  AlertTriangle,
  Crown,
  RefreshCcw,
  Utensils,
} from "lucide-react";

type Role = "cliente" | "cozinha" | "mesas" | "admin";
type AdminView = "overview" | "orders" | "users" | "menu" | "reports" | "cleanup";
type OrderStatus = "rascunho" | "preparando" | "pronto" | "entregue" | "finalizado";

interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: "Pizzas" | "Bebidas" | "Sobremesas";
  available: boolean;
  emoji: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

interface Order {
  id: string;
  table: number;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
}

const PRODUCTS_SEED: Product[] = [
  { id: "p1", name: "6 Estações", desc: "Pizza com carne, frango, cogumelos, chouriço", price: 10000, category: "Pizzas", available: true, emoji: "🍕" },
  { id: "p2", name: "Margherita", desc: "Molho de tomate, mozzarella e manjericão fresco", price: 8000, category: "Pizzas", available: true, emoji: "🍕" },
  { id: "p3", name: "Pepperoni", desc: "Mozzarella e generosas fatias de pepperoni", price: 9500, category: "Pizzas", available: true, emoji: "🍕" },
  { id: "p4", name: "Frango Piri-Piri", desc: "Frango grelhado, piri-piri e pimentos", price: 9000, category: "Pizzas", available: false, emoji: "🍕" },
  { id: "p5", name: "Coca-Cola", desc: "Lata 330ml gelada", price: 1000, category: "Bebidas", available: true, emoji: "🥤" },
  { id: "p6", name: "Sumo de Maracujá", desc: "Natural, sem açúcar adicionado", price: 1200, category: "Bebidas", available: true, emoji: "🧃" },
  { id: "p7", name: "Água", desc: "Garrafa 500ml", price: 500, category: "Bebidas", available: true, emoji: "💧" },
  { id: "p8", name: "Mousse de Chocolate", desc: "Feita na casa, cobertura crocante", price: 2500, category: "Sobremesas", available: true, emoji: "🍫" },
  { id: "p9", name: "Gelado", desc: "Bola dupla, sabor à escolha", price: 2000, category: "Sobremesas", available: true, emoji: "🍨" },
];

const TABLES = [1, 2, 3, 5, 6, 7, 9, 10];

const SEED_ORDERS: Order[] = [
  {
    id: "ORD-7f2a1",
    table: 7,
    items: [
      { productId: "p5", name: "Coca-Cola", price: 1000, qty: 5 },
      { productId: "p1", name: "6 Estações", price: 10000, qty: 2 },
    ],
    status: "preparando",
    createdAt: "18:04",
  },
  {
    id: "ORD-9c41b",
    table: 3,
    items: [{ productId: "p1", name: "6 Estações", price: 10000, qty: 2 }],
    status: "entregue",
    createdAt: "14:12",
  },
];

const USERS_SEED = [
  { name: "Administrador", email: "admin@pizzaexpress.com", role: "Admin", since: "02/10/2025" },
  { name: "Eduardo Oliveira", email: "eduardo@example.com", role: "Cozinha", since: "02/10/2025" },
  { name: "Nataniel", email: "nataniel@example.com", role: "Garçom", since: "21/09/2025" },
];

function kz(n: number) {
  return `${n.toLocaleString("pt-PT")} Kz`;
}

function statusMeta(status: OrderStatus) {
  switch (status) {
    case "rascunho":
      return { label: "Rascunho", color: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/30" };
    case "preparando":
      return { label: "Preparando", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" };
    case "pronto":
      return { label: "Pronto", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" };
    case "entregue":
      return { label: "Entregue", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" };
    case "finalizado":
      return { label: "Finalizado", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" };
  }
}

function orderTotal(order: Order) {
  return order.items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

let orderSeq = 1;

export default function PizzariaDemo() {
  const [role, setRole] = useState<Role>("cliente");
  const [adminView, setAdminView] = useState<AdminView>("overview");

  const [products, setProducts] = useState<Product[]>(PRODUCTS_SEED);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [users] = useState(USERS_SEED);

  const [selectedTable, setSelectedTable] = useState<number>(1);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [billTable, setBillTable] = useState<number | null>(null);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState<"todos" | OrderStatus>("todos");
  const [cleaned, setCleaned] = useState(false);

  const activeStatuses: OrderStatus[] = ["preparando", "pronto", "entregue"];

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function addToCart(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  }
  function decFromCart(id: string) {
    setCart((c) => {
      const next = { ...c };
      if (!next[id]) return next;
      next[id] -= 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }

  const cartItems: OrderItem[] = useMemo(
    () =>
      Object.entries(cart).map(([id, qty]) => {
        const p = products.find((pr) => pr.id === id)!;
        return { productId: id, name: p.name, price: p.price, qty };
      }),
    [cart, products]
  );
  const cartTotal = cartItems.reduce((s, it) => s + it.price * it.qty, 0);

  function submitOrder() {
    if (cartItems.length === 0) return;
    const id = `ORD-${(orderSeq++).toString(16).padStart(5, "0")}`;
    const now = new Date();
    const newOrder: Order = {
      id,
      table: selectedTable,
      items: cartItems,
      status: "preparando", // o pre-save do Mongoose faz o rascunho avançar automaticamente
      createdAt: `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`,
    };
    setOrders((o) => [newOrder, ...o]);
    setCart({});
    flash(`Pedido enviado à cozinha — Mesa ${selectedTable}`);
  }

  function markReady(id: string) {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: "pronto" } : o)));
  }
  function markDelivered(id: string) {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: "entregue" } : o)));
  }

  function tableOrders(table: number) {
    return orders.filter((o) => o.table === table && activeStatuses.includes(o.status));
  }
  function tableBill(table: number) {
    return tableOrders(table).reduce((s, o) => s + orderTotal(o), 0);
  }
  function finalizeTable(table: number) {
    setOrders((os) => os.map((o) => (o.table === table && activeStatuses.includes(o.status) ? { ...o, status: "finalizado" } : o)));
    setBillTable(null);
    flash(`Pagamento finalizado — Mesa ${table} está livre`);
  }

  function toggleAvailable(id: string) {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, available: !p.available } : p)));
  }

  const revenueOrders = orders.filter((o) => o.status === "finalizado");
  const revenueTotal = revenueOrders.reduce((s, o) => s + orderTotal(o), 0);
  const revenueByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    revenueOrders.forEach((o) =>
      o.items.forEach((it) => {
        const cat = products.find((p) => p.id === it.productId)?.category ?? "Outros";
        map[cat] = (map[cat] ?? 0) + it.price * it.qty;
      })
    );
    return map;
  }, [revenueOrders, products]);

  const preparando = orders.filter((o) => o.status === "preparando");
  const pronto = orders.filter((o) => o.status === "pronto");
  const finalizadoCount = orders.filter((o) => o.status === "finalizado").length;

  const filteredAdminOrders = orders.filter((o) => {
    const matchesStatus = orderFilter === "todos" || o.status === orderFilter;
    const matchesSearch = orderSearch.trim() === "" || `mesa ${o.table}`.includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const occupiedTables = TABLES.filter((t) => tableOrders(t).length > 0).length;

  const currentPath =
    role === "cliente"
      ? `pizzaexpress.app/mesa/${selectedTable}`
      : role === "cozinha"
      ? "pizzaexpress.app/dashboard"
      : role === "mesas"
      ? "pizzaexpress.app/dashboard/mesas"
      : `pizzaexpress.app/dashboard/admin${adminView === "overview" ? "" : "/" + adminView}`;

  const ROLE_NAV: { key: Role; label: string; icon: React.ReactNode }[] = [
    { key: "cliente", label: "Cardápio (Mesa)", icon: <Utensils size={16} /> },
    { key: "cozinha", label: "Painel da Cozinha", icon: <ChefHat size={16} /> },
    { key: "mesas", label: "Gestão de Mesas", icon: <Table2 size={16} /> },
    { key: "admin", label: "Painel Admin", icon: <Crown size={16} /> },
  ];

  const ADMIN_NAV: { key: AdminView; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Visão Geral", icon: <LayoutDashboard size={16} /> },
    { key: "orders", label: "Pedidos", icon: <ClipboardList size={16} /> },
    { key: "users", label: "Usuários", icon: <UsersIcon size={16} /> },
    { key: "menu", label: "Cardápio", icon: <Pizza size={16} /> },
    { key: "reports", label: "Relatórios", icon: <BarChart3 size={16} /> },
    { key: "cleanup", label: "Limpar Histórico", icon: <Trash2 size={16} /> },
  ];

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden">
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border-b border-blue-500/20">
        <Info size={18} className="text-blue-400 mt-0.5 shrink-0" />
        <p className="text-blue-200 text-sm leading-relaxed">
          Simulação a correr apenas no seu browser — os pedidos, mesas e receita são gerados
          localmente, sem qualquer backend real por trás. Esta demo reconstrói o fluxo completo do
          PizzaExpress: monte um pedido numa mesa, acompanhe-o na cozinha e feche a conta no painel
          administrativo.
        </p>
      </div>

      {/* fake browser chrome */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-950 border-b border-gray-800">
        <div className="flex gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-900 border border-gray-800 text-xs text-gray-500 font-mono truncate">
          <Lock size={10} className="text-green-500 shrink-0" />
          {currentPath}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[210px_1fr]">
        {/* sidebar */}
        <div className="border-b md:border-b-0 md:border-r border-gray-800 bg-gray-950/40 p-3 flex md:flex-col gap-1 overflow-x-auto">
          <div className="hidden md:flex items-center gap-2 px-2 pb-3 mb-2 border-b border-gray-800">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shrink-0">
              <Pizza size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm">
              Pizza<span className="text-red-400">Express</span>
            </span>
          </div>
          {ROLE_NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setRole(item.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                role === item.key
                  ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-orange-300"
                  : "text-gray-400 hover:text-white hover:bg-gray-900/60"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          {role === "admin" && (
            <>
              <div className="hidden md:flex items-center gap-1.5 px-3 pt-4 mt-2 border-t border-gray-800">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Administração</span>
              </div>
              {ADMIN_NAV.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setAdminView(item.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    adminView === item.key
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300"
                      : "text-gray-400 hover:text-white hover:bg-gray-900/60"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </>
          )}
        </div>

        {/* main content */}
        <div className="p-4 sm:p-6 min-h-[560px] relative">
          {toast && (
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/15 border border-green-500/30 text-green-300 text-xs font-medium">
              <CheckCircle2 size={14} />
              {toast}
            </div>
          )}

          {role === "cliente" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-lg">Cardápio</h4>
                  <p className="text-sm text-gray-500">Escolha os itens e envie o pedido para a cozinha</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Mesa</span>
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(Number(e.target.value))}
                    className="rounded-lg bg-gray-950 border border-gray-700 px-2.5 py-1.5 text-white font-semibold outline-none focus:border-orange-400"
                  >
                    {TABLES.map((t) => (
                      <option key={t} value={t}>
                        Mesa {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {(["Pizzas", "Bebidas", "Sobremesas"] as const).map((cat) => (
                <div key={cat}>
                  <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">{cat}</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {products
                      .filter((p) => p.category === cat)
                      .map((p) => (
                        <div
                          key={p.id}
                          className={`flex items-center gap-3 p-3 rounded-xl bg-gray-950/60 border ${
                            p.available ? "border-gray-800" : "border-gray-800 opacity-50"
                          }`}
                        >
                          <div className="w-11 h-11 rounded-lg bg-gray-900 flex items-center justify-center text-xl shrink-0">
                            {p.emoji}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{p.name}</p>
                            <p className="text-xs text-gray-500 truncate">{p.desc}</p>
                            <p className="text-sm font-semibold text-orange-300 mt-0.5">{kz(p.price)}</p>
                          </div>
                          {p.available ? (
                            cart[p.id] ? (
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => decFromCart(p.id)}
                                  className="w-6 h-6 rounded-md bg-gray-800 hover:bg-gray-700 flex items-center justify-center"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-4 text-center text-sm font-semibold">{cart[p.id]}</span>
                                <button
                                  onClick={() => addToCart(p.id)}
                                  className="w-6 h-6 rounded-md bg-orange-500 hover:bg-orange-400 flex items-center justify-center"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(p.id)}
                                className="shrink-0 px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-orange-500 hover:text-white text-xs font-semibold transition-colors"
                              >
                                Adicionar
                              </button>
                            )
                          ) : (
                            <span className="shrink-0 text-[10px] px-2 py-1 rounded-full bg-red-500/15 text-red-300">Indisponível</span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}

              {cartItems.length > 0 && (
                <div className="sticky bottom-0 p-4 rounded-xl bg-gray-950 border border-orange-500/30">
                  <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-orange-300">
                    <ShoppingCart size={14} />
                    Pedido (rascunho) — Mesa {selectedTable}
                  </div>
                  <div className="space-y-1 mb-3">
                    {cartItems.map((it) => (
                      <div key={it.productId} className="flex justify-between text-xs text-gray-400">
                        <span>
                          {it.qty}x {it.name}
                        </span>
                        <span>{kz(it.price * it.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-lg font-bold text-white">{kz(cartTotal)}</p>
                    </div>
                    <button
                      onClick={submitOrder}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold hover:opacity-90"
                    >
                      <Send size={14} />
                      Enviar à Cozinha
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {role === "cozinha" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <ChefHat size={18} className="text-orange-400" />
                    Painel da Cozinha
                  </h4>
                  <p className="text-sm text-gray-500">Gerencie pedidos em tempo real com eficiência</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <StatCard label="Total de Pedidos" value={String(preparando.length + pronto.length)} color="text-orange-300" />
                <StatCard label="Em Preparação" value={String(preparando.length)} color="text-amber-400" />
                <StatCard label="Prontos" value={String(pronto.length)} color="text-green-400" />
              </div>

              <div>
                <h5 className="text-sm font-semibold text-amber-400 uppercase tracking-wide mb-2">Em Preparação</h5>
                {preparando.length === 0 && <EmptyRow text="Nenhum pedido em preparação" />}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {preparando.map((o) => (
                    <div key={o.id} className="p-4 rounded-xl bg-gray-950/60 border border-amber-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">Mesa {o.table}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300">Preparando</span>
                      </div>
                      {o.items.map((it) => (
                        <div key={it.productId} className="flex justify-between text-xs text-gray-400 py-0.5">
                          <span>{it.name}</span>
                          <span>{it.qty}x</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
                        <span className="text-xs text-gray-500">Total</span>
                        <span className="text-sm font-bold">{kz(orderTotal(o))}</span>
                      </div>
                      <button
                        onClick={() => markReady(o.id)}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-sm font-semibold"
                      >
                        <CheckCircle2 size={14} />
                        Marcar como Pronto
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-2">Prontos para Entrega</h5>
                {pronto.length === 0 && <EmptyRow text="Nenhum pedido pronto" />}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pronto.map((o) => (
                    <div key={o.id} className="p-4 rounded-xl bg-gray-950/60 border border-green-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">Mesa {o.table}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-300">Pronto</span>
                      </div>
                      {o.items.map((it) => (
                        <div key={it.productId} className="flex justify-between text-xs text-gray-400 py-0.5">
                          <span>{it.name}</span>
                          <span>{it.qty}x</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
                        <span className="text-xs text-gray-500">Total</span>
                        <span className="text-sm font-bold">{kz(orderTotal(o))}</span>
                      </div>
                      <button
                        onClick={() => markDelivered(o.id)}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-sm font-semibold"
                      >
                        <Send size={14} />
                        Levar para Mesa
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {role === "mesas" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">Gestão de Mesas</h4>
                  <p className="text-sm text-gray-500">Visualize e gerencie o status de todas as mesas ativas</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Mesas Ativas" value={String(occupiedTables)} color="text-blue-400" />
                <StatCard label="Receita (mesas abertas)" value={kz(TABLES.reduce((s, t) => s + tableBill(t), 0))} color="text-green-400" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TABLES.map((t) => {
                  const active = tableOrders(t);
                  const occupied = active.length > 0;
                  return (
                    <div
                      key={t}
                      className={`p-4 rounded-xl border text-center ${
                        occupied ? "bg-red-950/30 border-red-500/30" : "bg-gray-950/60 border-gray-800"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 mx-auto mb-2 rounded-full flex items-center justify-center font-bold text-sm ${
                          occupied ? "bg-red-500/20 text-red-300" : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {t}
                      </div>
                      <p className="font-semibold text-sm">Mesa {t}</p>
                      <p className={`text-xs mb-1 ${occupied ? "text-red-300" : "text-gray-500"}`}>
                        {occupied ? "Ocupada" : "Livre"}
                      </p>
                      {occupied && (
                        <>
                          <p className="text-[11px] text-gray-500 mb-2">
                            {active.length} pedido(s) · {kz(tableBill(t))}
                          </p>
                          <button
                            onClick={() => setBillTable(t)}
                            className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold"
                          >
                            Conta
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {role === "admin" && adminView === "overview" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Crown size={18} className="text-blue-400" />
                <h4 className="font-semibold text-lg">Painel Administrativo</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300">Modo Admin</span>
              </div>
              <p className="text-sm text-gray-500 -mt-3">Controlo total do sistema — usuários, pedidos, relatórios e configurações</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Usuários" value={String(users.length)} color="text-blue-400" />
                <StatCard label="Ativos" value={String(preparando.length + pronto.length)} sub="Em preparação" color="text-amber-400" />
                <StatCard label="Concluídos hoje" value={String(finalizadoCount)} color="text-green-400" />
                <StatCard label="Receita Total" value={kz(revenueTotal)} color="text-purple-300" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <AdminCard icon={<UsersIcon size={16} />} title="Gerenciar Usuários" desc="Controlo completo de usuários e permissões" onClick={() => setAdminView("users")} color="from-blue-500/20 to-indigo-500/10" />
                <AdminCard icon={<BarChart3 size={16} />} title="Relatórios de Vendas" desc="Receita, ticket médio e desempenho por período" onClick={() => setAdminView("reports")} color="from-green-500/20 to-emerald-500/10" />
                <AdminCard icon={<ClipboardList size={16} />} title="Gerenciar Pedidos" desc="Visualize e controle todos os pedidos do sistema" onClick={() => setAdminView("orders")} color="from-purple-500/20 to-fuchsia-500/10" />
                <AdminCard icon={<Trash2 size={16} />} title="Limpar Histórico" desc="Remova pedidos finalizados do sistema" onClick={() => setAdminView("cleanup")} color="from-red-500/20 to-rose-500/10" />
                <AdminCard icon={<Pizza size={16} />} title="Cardápio" desc="Gerencie produtos, preços e disponibilidade" onClick={() => setAdminView("menu")} color="from-amber-500/20 to-orange-500/10" />
              </div>
            </div>
          )}

          {role === "admin" && adminView === "orders" && (
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Gerenciar Pedidos</h4>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-950/60 border border-gray-800">
                <Search size={14} className="text-gray-500" />
                <input
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Buscar por mesa..."
                  className="bg-transparent outline-none text-sm flex-1"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(["todos", "preparando", "pronto", "entregue", "finalizado"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setOrderFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                      orderFilter === s ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {filteredAdminOrders.length === 0 && <EmptyRow text="Nenhum pedido encontrado" />}
                {filteredAdminOrders.map((o) => {
                  const meta = statusMeta(o.status);
                  return (
                    <div key={o.id} className={`p-3 rounded-lg bg-gray-950/60 border ${meta.bg} flex items-center justify-between gap-3`}>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">
                          Mesa {o.table} <span className="text-gray-500 font-normal">· {o.id}</span>
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {o.items.map((it) => `${it.qty}x ${it.name}`).join(", ")}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-[10px] px-2 py-0.5 rounded-full inline-block ${meta.bg} ${meta.color}`}>{meta.label}</p>
                        <p className="text-sm font-bold mt-1">{kz(orderTotal(o))}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {role === "admin" && adminView === "users" && (
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <UsersIcon size={18} />
                Gerenciar Usuários
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <StatCard label="Total" value={String(users.length)} color="text-blue-400" />
                <StatCard label="Administradores" value={String(users.filter((u) => u.role === "Admin").length)} color="text-amber-400" />
                <StatCard label="Equipa" value={String(users.filter((u) => u.role !== "Admin").length)} color="text-green-400" />
              </div>
              <div className="rounded-xl border border-gray-800 overflow-hidden">
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-2 bg-gray-950/80 text-[10px] uppercase tracking-wide text-gray-500">
                  <span>Usuário</span>
                  <span>Cargo</span>
                  <span>Desde</span>
                </div>
                {users.map((u) => (
                  <div key={u.email} className="grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-3 border-t border-gray-800 items-center">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0">
                        {u.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full h-fit ${
                        u.role === "Admin" ? "bg-amber-500/15 text-amber-300" : "bg-blue-500/15 text-blue-300"
                      }`}
                    >
                      {u.role}
                    </span>
                    <span className="text-xs text-gray-500">{u.since}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {role === "admin" && adminView === "menu" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">Gerenciar Produtos</h4>
                <span className="text-xs text-gray-500">{products.filter((p) => p.available).length} de {products.length} disponíveis</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-950/60 border border-gray-800">
                    <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-lg shrink-0">{p.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.category} · {kz(p.price)}</p>
                    </div>
                    <button
                      onClick={() => toggleAvailable(p.id)}
                      className={`shrink-0 text-[10px] px-2.5 py-1.5 rounded-full font-semibold ${
                        p.available ? "bg-green-500/15 text-green-300 hover:bg-red-500/15 hover:text-red-300" : "bg-red-500/15 text-red-300 hover:bg-green-500/15 hover:text-green-300"
                      }`}
                    >
                      {p.available ? "Disponível" : "Indisponível"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {role === "admin" && adminView === "reports" && (
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <BarChart3 size={18} />
                Relatórios de Vendas
              </h4>
              <p className="text-sm text-gray-500 -mt-2">Calculado apenas a partir de pedidos com status &quot;finalizado&quot;</p>
              <div className="grid grid-cols-3 gap-3">
                <StatCard label="Receita Total" value={kz(revenueTotal)} color="text-green-400" />
                <StatCard label="Pedidos Finalizados" value={String(revenueOrders.length)} color="text-blue-400" />
                <StatCard
                  label="Ticket Médio"
                  value={revenueOrders.length ? kz(Math.round(revenueTotal / revenueOrders.length)) : kz(0)}
                  color="text-purple-300"
                />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Receita por Categoria</h5>
                {Object.keys(revenueByCategory).length === 0 ? (
                  <EmptyRow text="Ainda sem pedidos finalizados neste período" />
                ) : (
                  <div className="space-y-2">
                    {Object.entries(revenueByCategory).map(([cat, val]) => (
                      <div key={cat} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
                        <span>{cat}</span>
                        <span className="font-semibold text-green-300">{kz(val)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {role === "admin" && adminView === "cleanup" && (
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Limpar Histórico</h4>
              <p className="text-sm text-gray-500 -mt-2">Remova pedidos finalizados do sistema</p>
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                <div className="text-sm text-red-200">
                  <p className="font-semibold mb-1">Atenção: ação irreversível</p>
                  <p className="text-red-300/80">
                    Esta ação apaga permanentemente todos os pedidos com status <strong>finalizado</strong>. Pedidos
                    ativos, em preparação ou rascunhos nunca são afetados.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 text-sm">
                <p className="text-gray-400">
                  Serão removidos <strong className="text-white">{finalizadoCount}</strong> pedido(s) finalizado(s).
                </p>
              </div>
              <button
                disabled={finalizadoCount === 0}
                onClick={() => {
                  setOrders((os) => os.filter((o) => o.status !== "finalizado"));
                  setCleaned(true);
                  flash("Histórico de pedidos finalizados removido");
                  setTimeout(() => setCleaned(false), 2000);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-semibold"
              >
                <Trash2 size={14} />
                Limpar Pedidos Finalizados
              </button>
              {cleaned && <p className="text-xs text-green-400 flex items-center gap-1.5"><CheckCircle2 size={12} /> Histórico limpo com sucesso</p>}
            </div>
          )}
        </div>
      </div>

      {billTable !== null && (
        <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black/60" onClick={() => setBillTable(null)}>
          <div
            className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div>
                <p className="font-bold">Conta — Mesa {billTable}</p>
                <p className="text-xs text-gray-500">{tableOrders(billTable).length} pedido(s)</p>
              </div>
              <button onClick={() => setBillTable(null)} className="text-gray-500 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {tableOrders(billTable).map((o) =>
                o.items.map((it) => (
                  <div key={o.id + it.productId} className="flex justify-between text-sm">
                    <div>
                      <p>{it.name}</p>
                      <p className="text-xs text-gray-500">
                        {it.qty}x {kz(it.price)}
                      </p>
                    </div>
                    <p className="font-semibold">{kz(it.price * it.qty)}</p>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-green-400">{kz(tableBill(billTable))}</span>
              </div>
              <button
                onClick={() => finalizeTable(billTable)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-sm font-semibold"
              >
                <Wallet size={14} />
                Finalizar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="p-3 sm:p-4 rounded-xl bg-gray-950/60 border border-gray-800">
      <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-lg sm:text-xl font-bold ${color ?? "text-white"}`}>{value}</p>
      {sub && <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function AdminCard({
  icon,
  title,
  desc,
  onClick,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl bg-gradient-to-br ${color} border border-gray-800 hover:border-gray-700 transition-colors`}
    >
      <div className="w-8 h-8 rounded-lg bg-gray-900/60 flex items-center justify-center mb-3">{icon}</div>
      <p className="font-semibold text-sm mb-1">{title}</p>
      <p className="text-xs text-gray-400">{desc}</p>
    </button>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-950/40 border border-dashed border-gray-800 text-xs text-gray-500">
      <RefreshCcw size={12} />
      {text}
    </div>
  );
}
