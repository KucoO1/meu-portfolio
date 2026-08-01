"use client";

import { useMemo, useState } from "react";
import {
  Scissors,
  Calendar,
  Clock,
  Users,
  LayoutDashboard,
  Settings,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Info,
  Lock,
  Sparkles,
  Building2,
  ShieldCheck,
  Mail,
  Copy,
  Check,
  Eye,
  EyeOff,
  Store,
  Crown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tipos — espelham types/index.ts do projeto real (multi-tenant SaaS) */
/* ------------------------------------------------------------------ */

type TopRole = "site" | "admin" | "superadmin";
type SiteView = "inicio" | "servicos" | "sobre" | "agendar" | "meus-agendamentos";
type AdminView = "dashboard" | "configuracoes";
type SuperAdminView = "geral" | "barbearias" | "convites";
type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
type Plan = "free" | "basic" | "premium";
type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
type WizardStep = "servico" | "horario" | "dados" | "confirmado";

interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

interface TenantService {
  id: string;
  name: string;
  price: number;
  duration: number;
  active: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: "owner" | "staff";
}

interface Tenant {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  city: string;
  primaryColor: string;
  secondaryColor: string;
  plan: Plan;
  isActive: boolean;
  maxUsers: number;
  services: TenantService[];
  businessHours: Record<DayKey, DayHours>;
  team: TeamMember[];
}

interface Booking {
  id: string;
  tenantId: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string;
  status: BookingStatus;
}

/* ------------------------------------------------------------------ */
/* Dados fixos — 3 barbearias de exemplo no mesmo produto (multi-tenant)*/
/* ------------------------------------------------------------------ */

const DAY_ORDER: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABEL: Record<DayKey, string> = {
  monday: "Segunda",
  tuesday: "Terça",
  wednesday: "Quarta",
  thursday: "Quinta",
  friday: "Sexta",
  saturday: "Sábado",
  sunday: "Domingo",
};

function hours(open: string, close: string, closed = false): DayHours {
  return { open, close, closed };
}

const TENANTS: Tenant[] = [
  {
    id: "t1",
    slug: "barbearia-real",
    name: "Barbearia Real",
    tagline: "Estilo e tradição em cada corte",
    city: "Luanda",
    primaryColor: "#d4af37",
    secondaryColor: "#b8860b",
    plan: "premium",
    isActive: true,
    maxUsers: 10,
    services: [
      { id: "corte", name: "Corte de Cabelo", price: 2500, duration: 30, active: true },
      { id: "barba", name: "Barba", price: 1500, duration: 20, active: true },
      { id: "combo", name: "Corte + Barba", price: 3500, duration: 45, active: true },
      { id: "sobrancelha", name: "Sobrancelha", price: 500, duration: 10, active: true },
    ],
    businessHours: {
      monday: hours("08:00", "19:00"),
      tuesday: hours("08:00", "19:00"),
      wednesday: hours("08:00", "19:00"),
      thursday: hours("08:00", "19:00"),
      friday: hours("08:00", "19:00"),
      saturday: hours("08:00", "17:00"),
      sunday: hours("09:00", "13:00", true),
    },
    team: [
      { id: "b1", name: "Carlos Alberto", role: "owner" },
      { id: "b2", name: "Ricardo Santos", role: "staff" },
    ],
  },
  {
    id: "t2",
    slug: "corte-estilo",
    name: "Corte & Estilo",
    tagline: "O seu visual, a sua régua",
    city: "Benguela",
    primaryColor: "#2563eb",
    secondaryColor: "#1e3a8a",
    plan: "basic",
    isActive: true,
    maxUsers: 4,
    services: [
      { id: "corte", name: "Corte Clássico", price: 2000, duration: 30, active: true },
      { id: "barba", name: "Barba Desenhada", price: 1200, duration: 20, active: true },
      { id: "combo", name: "Corte + Barba", price: 2900, duration: 45, active: true },
    ],
    businessHours: {
      monday: hours("09:00", "18:00"),
      tuesday: hours("09:00", "18:00"),
      wednesday: hours("09:00", "18:00"),
      thursday: hours("09:00", "18:00"),
      friday: hours("09:00", "18:00"),
      saturday: hours("09:00", "15:00"),
      sunday: hours("00:00", "00:00", true),
    },
    team: [{ id: "b3", name: "Domingos Bento", role: "owner" }],
  },
  {
    id: "t3",
    slug: "navalha-nova",
    name: "Navalha Nova",
    tagline: "Barbearia de bairro, atendimento de gente grande",
    city: "Huambo",
    primaryColor: "#16a34a",
    secondaryColor: "#166534",
    plan: "free",
    isActive: false,
    maxUsers: 2,
    services: [
      { id: "corte", name: "Corte Simples", price: 1500, duration: 30, active: true },
      { id: "barba", name: "Barba", price: 1000, duration: 20, active: true },
    ],
    businessHours: {
      monday: hours("00:00", "00:00", true),
      tuesday: hours("10:00", "18:00"),
      wednesday: hours("10:00", "18:00"),
      thursday: hours("10:00", "18:00"),
      friday: hours("10:00", "18:00"),
      saturday: hours("10:00", "16:00"),
      sunday: hours("00:00", "00:00", true),
    },
    team: [{ id: "b4", name: "Eduardo Costa", role: "owner" }],
  },
];

function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return () => {
    h = (Math.imul(h ^ (h >>> 15), 1 | h) + Math.imul(h ^ (h >>> 7), 61 | h)) ^ h;
    h = h >>> 0;
    return (h % 1000) / 1000;
  };
}

function formatKz(v: number) {
  return `${v.toLocaleString("pt-PT")} Kz`;
}

function buildNextDays(n: number) {
  const out: { key: string; label: string; dayKey: DayKey }[] = [];
  const now = new Date();
  const dayKeys: DayKey[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      key: d.toISOString().slice(0, 10),
      label: i === 0 ? "Hoje" : i === 1 ? "Amanhã" : d.toLocaleDateString("pt-PT", { weekday: "short", day: "2-digit", month: "short" }),
      dayKey: dayKeys[d.getDay()],
    });
  }
  return out;
}

// Espelha app/t/[slug]/components/booking/hooks.ts do projeto real: os
// horários disponíveis nascem do businessHours do tenant para o dia da
// semana escolhido — não existe escolha de barbeiro no fluxo de marcação.
function buildSlots(tenant: Tenant, dayKey: DayKey, dateKey: string) {
  const schedule = tenant.businessHours[dayKey];
  if (schedule.closed) return [];
  const rand = seededRandom(`${tenant.id}-${dateKey}`);
  const [openH, openM] = schedule.open.split(":").map(Number);
  const [closeH, closeM] = schedule.close.split(":").map(Number);
  const slots: { time: string; available: boolean }[] = [];
  for (let m = openH * 60 + openM; m < closeH * 60 + closeM; m += 30) {
    const time = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    slots.push({ time, available: rand() > 0.32 });
  }
  return slots;
}

function seedBookings(): Booking[] {
  const rand = seededRandom("barbearia-multi-seed");
  const statuses: BookingStatus[] = ["confirmed", "confirmed", "pending", "completed", "cancelled", "confirmed", "pending", "completed"];
  const names = ["Miguel Sami", "Ana Paula", "João Neto", "Teresa Kiala", "Sofia Manuel", "Beatriz Fernandes", "Adão Mateus", "Isabel Cruz"];
  const out: Booking[] = [];
  let n = 0;
  for (const tenant of TENANTS) {
    for (let i = 0; i < 5; i++) {
      const service = tenant.services[Math.floor(rand() * tenant.services.length)];
      out.push({
        id: `AG-${1000 + n}`,
        tenantId: tenant.id,
        clientName: names[n % names.length],
        clientPhone: `9${Math.floor(10000000 + rand() * 89999999)}`,
        serviceId: service.id,
        date: new Date().toISOString().slice(0, 10),
        time: ["09:00", "10:30", "11:00", "14:00", "15:30", "16:00", "17:00", "12:00"][n % 8],
        status: statuses[n % statuses.length],
      });
      n++;
    }
  }
  return out;
}

function statusLabel(status: BookingStatus) {
  return { pending: "Pendente", confirmed: "Confirmado", cancelled: "Cancelado", completed: "Concluído" }[status];
}

function statusBadge(status: BookingStatus) {
  if (status === "confirmed") return "bg-green-500/15 text-green-300 border-green-500/30";
  if (status === "pending") return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
  if (status === "completed") return "bg-blue-500/15 text-blue-300 border-blue-500/30";
  return "bg-red-500/15 text-red-300 border-red-500/30";
}

const PLAN_LABEL: Record<Plan, string> = { free: "Free", basic: "Basic", premium: "Premium" };

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

export default function BarbeariaDemo() {
  const [role, setRole] = useState<TopRole>("site");
  const [tenantId, setTenantId] = useState("t1");
  const [siteView, setSiteView] = useState<SiteView>("inicio");
  const [adminView, setAdminView] = useState<AdminView>("dashboard");
  const [superView, setSuperView] = useState<SuperAdminView>("geral");

  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [tenants, setTenants] = useState<Tenant[]>(TENANTS);

  const [wizardStep, setWizardStep] = useState<WizardStep>("servico");
  const [chosenService, setChosenService] = useState<string | null>(null);
  const days = useMemo(() => buildNextDays(4), []);
  const [chosenDay, setChosenDay] = useState(days[0].key);
  const [chosenTime, setChosenTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const [adminFilter, setAdminFilter] = useState<"all" | BookingStatus>("all");
  const [inviteMode, setInviteMode] = useState<"nova-barbearia" | "novo-usuario">("nova-barbearia");
  const [generatedInvite, setGeneratedInvite] = useState<{ token: string; expiresAt: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const tenant = tenants.find((t) => t.id === tenantId)!;
  const dayInfo = days.find((d) => d.key === chosenDay)!;
  const slots = useMemo(() => buildSlots(tenant, dayInfo.dayKey, chosenDay), [tenant, dayInfo, chosenDay]);
  const isClosedDay = tenant.businessHours[dayInfo.dayKey].closed;

  const tenantBookings = bookings.filter((b) => b.tenantId === tenantId);
  const filteredAdminBookings = tenantBookings.filter((b) => adminFilter === "all" || b.status === adminFilter);

  function serviceOf(id: string) {
    return tenant.services.find((s) => s.id === id) ?? tenant.services[0];
  }

  function startBooking() {
    setWizardStep("servico");
    setChosenService(null);
    setChosenTime(null);
    setSiteView("agendar");
  }

  function confirmBooking() {
    if (!chosenService || !chosenTime || !clientName.trim() || !clientPhone.trim()) return;
    const booking: Booking = {
      id: `AG-${Math.floor(1000 + Math.random() * 8999)}`,
      tenantId: tenant.id,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      serviceId: chosenService,
      date: chosenDay,
      time: chosenTime,
      status: "pending",
    };
    setBookings((prev) => [booking, ...prev]);
    setWizardStep("confirmado");
  }

  function updateBookingStatus(id: string, status: BookingStatus) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  function toggleTenantActive(id: string) {
    setTenants((prev) => prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t)));
  }

  function toggleServiceActive(serviceId: string) {
    setTenants((prev) =>
      prev.map((t) => (t.id !== tenant.id ? t : { ...t, services: t.services.map((s) => (s.id === serviceId ? { ...s, active: !s.active } : s)) }))
    );
  }

  function toggleDayClosed(dayKey: DayKey) {
    setTenants((prev) =>
      prev.map((t) =>
        t.id !== tenant.id ? t : { ...t, businessHours: { ...t.businessHours, [dayKey]: { ...t.businessHours[dayKey], closed: !t.businessHours[dayKey].closed } } }
      )
    );
  }

  function generateInvite() {
    const token = Array.from({ length: 12 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    setGeneratedInvite({ token, expiresAt: expires.toLocaleDateString("pt-PT") });
  }

  // agregados globais (superadmin)
  const totalUsers = tenants.reduce((s, t) => s + t.team.length, 0);
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const activeTenants = tenants.filter((t) => t.isActive).length;

  const SITE_NAV: { key: SiteView; label: string }[] = [
    { key: "inicio", label: "Início" },
    { key: "servicos", label: "Serviços" },
    { key: "sobre", label: "Sobre Nós" },
    { key: "meus-agendamentos", label: "Meus Agendamentos" },
  ];

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden">
      <div className="flex items-start gap-3 p-4 bg-amber-500/10 border-b border-amber-500/20">
        <Info size={18} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-amber-200 text-sm leading-relaxed">
          Simulação a correr apenas no seu browser — não existe backend real nem base de dados. O produto real é
          um SaaS multi-tenant: cada barbearia é um &quot;tenant&quot; com a sua própria marca, cores, serviços e horário de
          funcionamento no mesmo código. Troque de barbearia abaixo para ver o white-label em ação, e explore o
          painel de administração de cada uma e o super-admin que gere todas as barbearias da plataforma.
        </p>
      </div>

      {/* chrome falso do browser */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-950 border-b border-gray-800">
        <div className="flex gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-900 border border-gray-800 text-xs text-gray-500 font-mono truncate">
          <Lock size={10} className="text-green-500 shrink-0" />
          barbearia.app/{role === "site" ? `t/${tenant.slug}` : role === "admin" ? `t/${tenant.slug}/admin` : "superadmin"}
        </div>
      </div>

      {/* seletor de papel */}
      <div className="flex items-center gap-1 px-4 py-2 bg-gray-950 border-b border-gray-800 overflow-x-auto">
        {(
          [
            { key: "site", label: "Site do cliente", icon: <Scissors size={13} /> },
            { key: "admin", label: "Admin da barbearia", icon: <LayoutDashboard size={13} /> },
            { key: "superadmin", label: "Super-admin (SaaS)", icon: <ShieldCheck size={13} /> },
          ] as { key: TopRole; label: string; icon: React.ReactNode }[]
        ).map((r) => (
          <button
            key={r.key}
            onClick={() => setRole(r.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              role === r.key ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black" : "text-gray-400 border border-gray-800 hover:text-white"
            }`}
          >
            {r.icon}
            {r.label}
          </button>
        ))}
      </div>

      {/* seletor de tenant (só faz sentido fora do super-admin) */}
      {role !== "superadmin" && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-950/60 border-b border-gray-800 overflow-x-auto">
          <span className="text-[11px] text-gray-500 uppercase tracking-wide shrink-0">Barbearia:</span>
          {tenants.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTenantId(t.id);
                setSiteView("inicio");
                setAdminView("dashboard");
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors"
              style={
                tenantId === t.id
                  ? { backgroundColor: t.primaryColor, borderColor: t.primaryColor, color: "#0a0a0a" }
                  : { borderColor: "#374151", color: "#9ca3af" }
              }
            >
              <Store size={12} />
              {t.name}
              <span className="opacity-70">· {PLAN_LABEL[t.plan]}</span>
            </button>
          ))}
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* SITE DO CLIENTE (por tenant)                                */}
      {/* ---------------------------------------------------------- */}
      {role === "site" && (
        <div>
          <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3 border-b border-gray-800 bg-gray-950/40 overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: tenant.primaryColor }}>
                <Scissors size={14} className="text-black" />
              </div>
              <span className="font-black text-sm whitespace-nowrap" style={{ color: tenant.primaryColor }}>
                {tenant.name}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {SITE_NAV.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setSiteView(item.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    siteView === item.key ? "bg-gray-800" : "text-gray-400 hover:text-white"
                  }`}
                  style={siteView === item.key ? { color: tenant.primaryColor } : undefined}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              onClick={startBooking}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-black hover:opacity-90 transition-opacity shrink-0"
              style={{ backgroundColor: tenant.primaryColor }}
            >
              <Calendar size={13} />
              Agendar
            </button>
          </div>
          <div className="flex md:hidden items-center gap-1 px-4 py-2 border-b border-gray-800 bg-gray-950/40 overflow-x-auto">
            {SITE_NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => setSiteView(item.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  siteView === item.key ? "bg-gray-800" : "text-gray-400"
                }`}
                style={siteView === item.key ? { color: tenant.primaryColor } : undefined}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-6 min-h-[440px]">
            {siteView === "inicio" && (
              <div className="text-center py-6 sm:py-10 space-y-5">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold"
                  style={{ backgroundColor: `${tenant.primaryColor}1a`, borderColor: `${tenant.primaryColor}40`, color: tenant.primaryColor }}
                >
                  <Sparkles size={12} />
                  {tenant.city}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black">
                  {tenant.tagline.split(" ").slice(0, -2).join(" ")}{" "}
                  <span style={{ color: tenant.primaryColor }}>{tenant.tagline.split(" ").slice(-2).join(" ")}</span>
                </h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  Marque o seu horário em menos de um minuto e garanta o seu lugar — sem filas, sem WhatsApp perdido.
                </p>
                <button
                  onClick={startBooking}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-black font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: tenant.primaryColor }}
                >
                  <Calendar size={16} />
                  Marcar horário agora
                </button>
                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto pt-4">
                  {[
                    { label: "Plano", value: PLAN_LABEL[tenant.plan] },
                    { label: "Equipa", value: String(tenant.team.length) },
                    { label: "Serviços", value: String(tenant.services.filter((s) => s.active).length) },
                  ].map((s) => (
                    <div key={s.label} className="p-3 rounded-lg bg-gray-950/60 border border-gray-800">
                      <p className="text-lg font-bold" style={{ color: tenant.primaryColor }}>
                        {s.value}
                      </p>
                      <p className="text-[11px] text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {siteView === "servicos" && (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Scissors size={18} style={{ color: tenant.primaryColor }} />
                  Os nossos serviços
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tenant.services
                    .filter((s) => s.active)
                    .map((s) => (
                      <div key={s.id} className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm">{s.name}</p>
                          <span className="font-bold text-sm whitespace-nowrap" style={{ color: tenant.primaryColor }}>
                            {formatKz(s.price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="flex items-center gap-1 text-[11px] text-gray-500">
                            <Clock size={11} />
                            {s.duration} min
                          </span>
                          <button
                            onClick={() => {
                              setChosenService(s.id);
                              setWizardStep("horario");
                              setSiteView("agendar");
                            }}
                            className="text-xs font-semibold flex items-center gap-1"
                            style={{ color: tenant.primaryColor }}
                          >
                            Agendar
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {siteView === "sobre" && (
              <div className="space-y-4 max-w-xl">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Info size={18} style={{ color: tenant.primaryColor }} />
                  Sobre nós
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  A {tenant.name} faz parte de uma rede de barbearias que partilham a mesma plataforma de
                  agendamento — cada uma com a sua marca, os seus preços e o seu horário, geridos de forma
                  totalmente independente pelo respetivo dono.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {tenant.team.map((b) => (
                    <span key={b.id} className="text-xs px-3 py-1 rounded-full bg-gray-950/60 border border-gray-800 text-gray-300">
                      {b.name} · {b.role === "owner" ? "Proprietário" : "Barbeiro"}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {siteView === "meus-agendamentos" && (
              <div className="space-y-3">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Calendar size={18} style={{ color: tenant.primaryColor }} />
                  Meus agendamentos
                </h4>
                {tenantBookings.filter((b) => b.clientName === (clientName.trim() || "Você")).length === 0 && (
                  <p className="text-sm text-gray-500">
                    Ainda não fez nenhuma marcação nesta barbearia. Faça uma em &quot;Agendar&quot; e ela aparece aqui.
                  </p>
                )}
                {tenantBookings
                  .filter((b) => b.clientName === (clientName.trim() || "Você"))
                  .map((b) => (
                    <div key={b.id} className="p-3.5 rounded-lg bg-gray-950/60 border border-gray-800 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm truncate">{serviceOf(b.serviceId).name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${statusBadge(b.status)}`}>{statusLabel(b.status)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {b.date}, {b.time}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {siteView === "agendar" && (
              <div className="max-w-lg mx-auto space-y-5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {(["servico", "horario", "dados", "confirmado"] as WizardStep[]).map((s, i) => (
                    <span key={s} className="flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={
                          wizardStep === s || (["horario", "dados", "confirmado"].indexOf(wizardStep) >= i && wizardStep !== "servico")
                            ? { backgroundColor: tenant.primaryColor, color: "#0a0a0a" }
                            : { backgroundColor: "#1f2937", color: "#6b7280" }
                        }
                      >
                        {i + 1}
                      </span>
                      {i < 3 && <span className="w-4 h-px bg-gray-700" />}
                    </span>
                  ))}
                </div>

                {wizardStep === "servico" && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base mb-2">Escolha o serviço</h4>
                    {tenant.services
                      .filter((s) => s.active)
                      .map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setChosenService(s.id);
                            setWizardStep("horario");
                          }}
                          className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 hover:border-gray-700 text-left"
                        >
                          <span>
                            <span className="block text-sm font-medium">{s.name}</span>
                            <span className="block text-xs text-gray-500">{s.duration} min</span>
                          </span>
                          <span className="font-bold text-sm" style={{ color: tenant.primaryColor }}>
                            {formatKz(s.price)}
                          </span>
                        </button>
                      ))}
                  </div>
                )}

                {wizardStep === "horario" && (
                  <div className="space-y-4">
                    <button onClick={() => setWizardStep("servico")} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white">
                      <ChevronLeft size={13} /> Voltar
                    </button>
                    <h4 className="font-semibold text-base">Escolha o dia e o horário</h4>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {days.map((d) => (
                        <button
                          key={d.key}
                          onClick={() => {
                            setChosenDay(d.key);
                            setChosenTime(null);
                          }}
                          className="px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border"
                          style={
                            chosenDay === d.key
                              ? { backgroundColor: tenant.primaryColor, borderColor: tenant.primaryColor, color: "#0a0a0a" }
                              : { borderColor: "#374151", color: "#9ca3af" }
                          }
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                    {isClosedDay ? (
                      <p className="text-sm text-gray-500 py-6 text-center">
                        A {tenant.name} está fechada neste dia. Escolha outra data acima.
                      </p>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {slots.map((slot) => (
                          <button
                            key={slot.time}
                            disabled={!slot.available}
                            onClick={() => setChosenTime(slot.time)}
                            className={`px-2 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                              !slot.available ? "opacity-30 cursor-not-allowed border-gray-800 text-gray-600" : ""
                            }`}
                            style={
                              slot.available && chosenTime === slot.time
                                ? { backgroundColor: tenant.primaryColor, borderColor: tenant.primaryColor, color: "#0a0a0a" }
                                : slot.available
                                ? { borderColor: "#374151", color: "#e5e7eb" }
                                : undefined
                            }
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => chosenTime && setWizardStep("dados")}
                      disabled={!chosenTime}
                      className="w-full py-2.5 rounded-full font-semibold text-sm text-black disabled:opacity-30"
                      style={{ backgroundColor: tenant.primaryColor }}
                    >
                      Continuar
                    </button>
                  </div>
                )}

                {wizardStep === "dados" && (
                  <div className="space-y-4">
                    <button onClick={() => setWizardStep("horario")} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white">
                      <ChevronLeft size={13} /> Voltar
                    </button>
                    <h4 className="font-semibold text-base">Os seus dados</h4>
                    <div className="space-y-3">
                      <input
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Nome completo"
                        className="w-full rounded-xl bg-gray-950/60 border border-gray-800 px-3.5 py-2.5 text-sm outline-none focus:border-gray-600"
                      />
                      <input
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="923 145 778"
                        className="w-full rounded-xl bg-gray-950/60 border border-gray-800 px-3.5 py-2.5 text-sm outline-none focus:border-gray-600"
                      />
                    </div>
                    <div className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 text-xs text-gray-400 space-y-1">
                      <p>
                        <span className="text-gray-500">Serviço:</span> {chosenService ? serviceOf(chosenService).name : "—"}
                      </p>
                      <p>
                        <span className="text-gray-500">Data:</span> {dayInfo.label} às {chosenTime}
                      </p>
                    </div>
                    <button
                      onClick={confirmBooking}
                      disabled={!clientName.trim() || !clientPhone.trim()}
                      className="w-full py-2.5 rounded-full font-semibold text-sm text-black disabled:opacity-30"
                      style={{ backgroundColor: tenant.primaryColor }}
                    >
                      Confirmar agendamento
                    </button>
                  </div>
                )}

                {wizardStep === "confirmado" && (
                  <div className="flex flex-col items-center text-center gap-3 py-10">
                    <div className="w-14 h-14 rounded-full bg-green-500/15 text-green-400 flex items-center justify-center">
                      <CheckCircle2 size={26} />
                    </div>
                    <h4 className="text-lg font-bold">Marcação enviada!</h4>
                    <p className="text-sm text-gray-400 max-w-xs">
                      O seu agendamento em <span className="text-white font-medium">{tenant.name}</span> ficou com estado{" "}
                      <span className="text-yellow-300 font-medium">Pendente</span> até o barbeiro confirmar — veja isso a
                      acontecer no separador &quot;Admin da barbearia&quot;.
                    </p>
                    <button
                      onClick={() => setSiteView("meus-agendamentos")}
                      className="mt-1 px-5 py-2 rounded-full border border-gray-700 text-sm font-medium hover:border-gray-500"
                    >
                      Ver os meus agendamentos
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* ADMIN DA BARBEARIA (por tenant)                             */}
      {/* ---------------------------------------------------------- */}
      {role === "admin" && (
        <div className="p-4 sm:p-6 space-y-6 min-h-[440px]">
          <div className="flex items-center gap-1 bg-gray-950/60 border border-gray-800 rounded-full p-1 w-fit">
            {(
              [
                { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={13} /> },
                { key: "configuracoes", label: "Configurações", icon: <Settings size={13} /> },
              ] as { key: AdminView; label: string; icon: React.ReactNode }[]
            ).map((v) => (
              <button
                key={v.key}
                onClick={() => setAdminView(v.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  adminView === v.key ? "text-black" : "text-gray-400"
                }`}
                style={adminView === v.key ? { backgroundColor: tenant.primaryColor } : undefined}
              >
                {v.icon}
                {v.label}
              </button>
            ))}
          </div>

          {adminView === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AdminStat icon={<Calendar size={18} />} label="Total de Agendamentos" value={tenantBookings.length} color={tenant.primaryColor} />
                <AdminStat icon={<Clock size={18} />} label="Pendentes" value={tenantBookings.filter((b) => b.status === "pending").length} color="#eab308" />
                <AdminStat icon={<CheckCircle2 size={18} />} label="Confirmados" value={tenantBookings.filter((b) => b.status === "confirmed").length} color="#22c55e" />
                <AdminStat icon={<ChevronRight size={18} />} label="Concluídos" value={tenantBookings.filter((b) => b.status === "completed").length} color="#3b82f6" />
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: "all", label: "Todos" },
                    { value: "pending", label: "Pendentes" },
                    { value: "confirmed", label: "Confirmados" },
                    { value: "cancelled", label: "Cancelados" },
                    { value: "completed", label: "Concluídos" },
                  ] as { value: "all" | BookingStatus; label: string }[]
                ).map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setAdminFilter(f.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      adminFilter === f.value ? "text-black border-transparent" : "text-gray-400 border-gray-800"
                    }`}
                    style={adminFilter === f.value ? { backgroundColor: tenant.primaryColor } : undefined}
                  >
                    {f.label} (
                    {f.value === "all" ? tenantBookings.length : tenantBookings.filter((b) => b.status === f.value).length})
                  </button>
                ))}
              </div>

              <div className="space-y-2.5">
                {filteredAdminBookings.length === 0 && <p className="text-sm text-gray-500 py-6 text-center">Sem agendamentos neste filtro.</p>}
                {filteredAdminBookings.map((b) => (
                  <div key={b.id} className="p-3.5 rounded-xl bg-gray-950/60 border border-gray-800 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{b.clientName}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusBadge(b.status)}`}>{statusLabel(b.status)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {serviceOf(b.serviceId).name} · {b.time} · {b.clientPhone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {b.status === "pending" && (
                        <>
                          <button onClick={() => updateBookingStatus(b.id, "confirmed")} className="text-xs font-semibold text-green-400 hover:text-green-300">
                            Confirmar
                          </button>
                          <button onClick={() => updateBookingStatus(b.id, "cancelled")} className="text-xs font-semibold text-red-400 hover:text-red-300">
                            Cancelar
                          </button>
                        </>
                      )}
                      {b.status === "confirmed" && (
                        <>
                          <button onClick={() => updateBookingStatus(b.id, "completed")} className="text-xs font-semibold text-blue-400 hover:text-blue-300">
                            Concluir
                          </button>
                          <button onClick={() => updateBookingStatus(b.id, "cancelled")} className="text-xs font-semibold text-red-400 hover:text-red-300">
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminView === "configuracoes" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h4 className="font-semibold text-base mb-3">Identidade da barbearia</h4>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-950/60 border border-gray-800">
                  <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: tenant.primaryColor }} />
                  <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: tenant.secondaryColor }} />
                  <div className="text-xs text-gray-400">
                    <p>Cor primária: {tenant.primaryColor}</p>
                    <p>Cor secundária: {tenant.secondaryColor}</p>
                  </div>
                  <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 flex items-center gap-1">
                    <Crown size={11} /> Plano {PLAN_LABEL[tenant.plan]}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-base mb-3">Horário de funcionamento</h4>
                <div className="space-y-1.5">
                  {DAY_ORDER.map((d) => {
                    const dh = tenant.businessHours[d];
                    return (
                      <div key={d} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
                        <span className="text-gray-300">{DAY_LABEL[d]}</span>
                        <div className="flex items-center gap-3">
                          <span className={dh.closed ? "text-gray-600" : "text-gray-400"}>
                            {dh.closed ? "Fechado" : `${dh.open} – ${dh.close}`}
                          </span>
                          <button onClick={() => toggleDayClosed(d)} className="text-xs font-medium" style={{ color: tenant.primaryColor }}>
                            {dh.closed ? "Reabrir" : "Fechar"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-base mb-3">Serviços</h4>
                <div className="space-y-1.5">
                  {tenant.services.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
                      <span>
                        {s.name} <span className="text-gray-500">· {formatKz(s.price)}</span>
                      </span>
                      <button
                        onClick={() => toggleServiceActive(s.id)}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.active ? "bg-green-500/15 text-green-300" : "bg-gray-800 text-gray-500"}`}
                      >
                        {s.active ? "Ativo" : "Inativo"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* SUPER-ADMIN DA PLATAFORMA                                   */}
      {/* ---------------------------------------------------------- */}
      {role === "superadmin" && (
        <div className="p-4 sm:p-6 space-y-6 min-h-[440px]">
          <div className="flex items-center gap-1 bg-gray-950/60 border border-gray-800 rounded-full p-1 w-fit overflow-x-auto">
            {(
              [
                { key: "geral", label: "Visão geral", icon: <LayoutDashboard size={13} /> },
                { key: "barbearias", label: `Barbearias (${tenants.length})`, icon: <Building2 size={13} /> },
                { key: "convites", label: "Convites", icon: <Mail size={13} /> },
              ] as { key: SuperAdminView; label: string; icon: React.ReactNode }[]
            ).map((v) => (
              <button
                key={v.key}
                onClick={() => setSuperView(v.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  superView === v.key ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black" : "text-gray-400"
                }`}
              >
                {v.icon}
                {v.label}
              </button>
            ))}
          </div>

          {superView === "geral" && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <SuperStat icon={<Building2 size={20} />} label="Total Barbearias" value={tenants.length} color="#d4af37" />
              <SuperStat icon={<Sparkles size={20} />} label="Ativas" value={activeTenants} color="#22c55e" />
              <SuperStat icon={<Users size={20} />} label="Usuários" value={totalUsers} color="#3b82f6" />
              <SuperStat icon={<Calendar size={20} />} label="Agendamentos" value={totalBookings} color="#a855f7" />
              <SuperStat icon={<Clock size={20} />} label="Pendentes" value={pendingBookings} color="#eab308" />
            </div>
          )}

          {superView === "barbearias" && (
            <div className="space-y-3">
              {tenants.map((t) => (
                <div key={t.id} className="bg-gray-950/60 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="text-lg font-bold">{t.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${t.isActive ? "bg-green-500/15 text-green-400 border-green-500/40" : "bg-red-500/15 text-red-400 border-red-500/40"}`}>
                          {t.isActive ? "Ativa" : "Inativa"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <p className="text-gray-500">Slug</p>
                          <p className="font-mono" style={{ color: t.primaryColor }}>
                            {t.slug}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Usuários</p>
                          <p className="text-white font-bold">
                            {t.team.length} / {t.maxUsers}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Agendamentos</p>
                          <p className="text-white font-bold">{bookings.filter((b) => b.tenantId === t.id).length}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Plano</p>
                          <p className="text-white font-bold uppercase">{t.plan}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleTenantActive(t.id)}
                      className={`p-2.5 rounded-lg self-start sm:self-center transition-colors ${
                        t.isActive ? "bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-400" : "bg-green-500/15 hover:bg-green-500/25 text-green-400"
                      }`}
                    >
                      {t.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {superView === "convites" && (
            <div className="max-w-lg space-y-4">
              <p className="text-sm text-gray-400">
                O onboarding de novas barbearias e de novos utilizadores dentro de uma barbearia existente acontece
                por token de convite — sem isso, ninguém consegue criar uma conta na plataforma.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setInviteMode("nova-barbearia")}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${inviteMode === "nova-barbearia" ? "border-amber-500 bg-amber-500/10 text-amber-300" : "border-gray-800 text-gray-400"}`}
                >
                  Nova barbearia
                </button>
                <button
                  onClick={() => setInviteMode("novo-usuario")}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${inviteMode === "novo-usuario" ? "border-amber-500 bg-amber-500/10 text-amber-300" : "border-gray-800 text-gray-400"}`}
                >
                  Novo utilizador numa barbearia existente
                </button>
              </div>
              <button
                onClick={generateInvite}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold text-sm hover:opacity-90"
              >
                Gerar convite
              </button>
              {generatedInvite && (
                <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-2">
                  <div className="flex items-center gap-2 bg-gray-900 rounded-lg p-3">
                    <span className="flex-1 text-sm font-mono break-all text-amber-300">{generatedInvite.token}</span>
                    <button
                      onClick={() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Expira em: {generatedInvite.expiresAt} · uso único</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponentes                                                       */
/* ------------------------------------------------------------------ */

function AdminStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ backgroundColor: `${color}20`, borderColor: `${color}40`, color }}>
          {icon}
        </div>
        <span className="text-xl font-black" style={{ color }}>
          {value}
        </span>
      </div>
      <p className="text-white/70 text-sm font-semibold">{label}</p>
    </div>
  );
}

function SuperStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3" style={{ color }}>
        {icon}
        <span className="text-2xl sm:text-3xl font-black">{value}</span>
      </div>
      <p className="text-white/70 text-sm font-semibold">{label}</p>
    </div>
  );
}
