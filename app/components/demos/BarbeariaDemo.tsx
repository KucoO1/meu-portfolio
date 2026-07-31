"use client";

import { useMemo, useState } from "react";
import {
  Scissors,
  Calendar,
  Clock,
  Users,
  LayoutDashboard,
  BarChart3,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Star,
  Info,
  Lock,
  Sparkles,
  DollarSign,
  CalendarCheck,
  Percent,
  LogIn,
  X,
  ListChecks,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

type Role = "cliente" | "admin";
type ClienteView = "inicio" | "servicos" | "sobre" | "agendar" | "meus-agendamentos";
type AdminView = "dashboard" | "agendamentos" | "barbeiros" | "servicos" | "relatorios";
type WizardStep = "servico" | "barbeiro" | "horario" | "confirmado";
type Status = "Confirmado" | "Pendente" | "Cancelado";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  desc: string;
}

interface Barber {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  years: number;
}

interface Booking {
  id: string;
  client: string;
  serviceId: string;
  barberId: string;
  date: string;
  time: string;
  status: Status;
}

/* ------------------------------------------------------------------ */
/* Dados fixos                                                         */
/* ------------------------------------------------------------------ */

const SERVICES: Service[] = [
  { id: "corte", name: "Corte de Cabelo", price: 2500, duration: 30, desc: "Corte tradicional ou moderno, adaptado ao seu estilo" },
  { id: "barba", name: "Barba", price: 1500, duration: 20, desc: "Aparar e desenhar a barba com toalha quente" },
  { id: "combo", name: "Corte + Barba", price: 3500, duration: 45, desc: "O pacote completo para um visual impecável" },
  { id: "sobrancelha", name: "Sobrancelha", price: 500, duration: 10, desc: "Alinhamento e definição da sobrancelha" },
];

const BARBERS: Barber[] = [
  { id: "carlos", name: "Carlos Alberto", specialty: "Especialista em cortes clássicos e modernos", rating: 4.9, years: 8 },
  { id: "ricardo", name: "Ricardo Santos", specialty: "Especialista em barba e degradê", rating: 4.8, years: 5 },
];

const CLIENT_NAMES = [
  "Miguel Sami", "Ana Paula", "João Neto", "Teresa Kiala",
  "Domingos Bento", "Sofia Manuel", "Eduardo Costa", "Beatriz Fernandes",
];

/* ------------------------------------------------------------------ */
/* Utilitários                                                         */
/* ------------------------------------------------------------------ */

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

function serviceOf(id: string) {
  return SERVICES.find((s) => s.id === id)!;
}

function barberOf(id: string) {
  return BARBERS.find((b) => b.id === id)!;
}

function statusBadge(status: Status) {
  if (status === "Confirmado") return "bg-green-500/15 text-green-300";
  if (status === "Pendente") return "bg-amber-500/15 text-amber-300";
  return "bg-red-500/15 text-red-300";
}

function buildDays() {
  const labels = ["Hoje", "Amanhã", "Depois de amanhã"];
  const out: { key: string; label: string; sub: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 3; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      key: d.toISOString().slice(0, 10),
      label: labels[i],
      sub: d.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" }),
    });
  }
  return out;
}

function buildSlots(barberId: string, dayKey: string) {
  const rand = seededRandom(`${barberId}-${dayKey}`);
  const slots: { time: string; available: boolean }[] = [];
  for (let h = 9; h <= 18; h++) {
    for (const m of [0, 30]) {
      if (h === 18 && m === 30) continue;
      const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      slots.push({ time, available: rand() > 0.32 });
    }
  }
  return slots;
}

function seedAdminBookings(): Booking[] {
  const rand = seededRandom("barbearia-admin-seed");
  const statuses: Status[] = ["Confirmado", "Confirmado", "Confirmado", "Pendente", "Cancelado"];
  const times = ["09:00", "09:30", "10:30", "11:00", "13:00", "14:30", "15:00", "16:30"];
  return CLIENT_NAMES.map((name, i) => ({
    id: `AG-${1000 + i}`,
    client: name,
    serviceId: SERVICES[Math.floor(rand() * SERVICES.length)].id,
    barberId: BARBERS[Math.floor(rand() * BARBERS.length)].id,
    date: "Hoje",
    time: times[i % times.length],
    status: statuses[Math.floor(rand() * statuses.length)],
  }));
}

/* ------------------------------------------------------------------ */
/* Componente principal                                                */
/* ------------------------------------------------------------------ */

export default function BarbeariaDemo() {
  const [role, setRole] = useState<Role>("cliente");
  const [clienteView, setClienteView] = useState<ClienteView>("inicio");
  const [adminView, setAdminView] = useState<AdminView>("dashboard");

  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [name, setName] = useState("");

  const [wizardStep, setWizardStep] = useState<WizardStep>("servico");
  const [chosenService, setChosenService] = useState<string | null>(null);
  const [chosenBarber, setChosenBarber] = useState<string | null>(null);
  const [chosenDay, setChosenDay] = useState(buildDays()[0].key);
  const [chosenTime, setChosenTime] = useState<string | null>(null);

  const [myBookings, setMyBookings] = useState<Booking[]>([
    { id: "AG-0042", client: "Você", serviceId: "corte", barberId: "carlos", date: "Amanhã", time: "10:30", status: "Confirmado" },
  ]);

  const [adminBookings, setAdminBookings] = useState<Booking[]>(seedAdminBookings);

  const days = useMemo(buildDays, []);
  const slots = useMemo(() => buildSlots(chosenBarber ?? "carlos", chosenDay), [chosenBarber, chosenDay]);
  const dayLabel = days.find((d) => d.key === chosenDay)?.label ?? "Hoje";

  const currentPath =
    role === "cliente"
      ? `barbearia.com/${clienteView === "inicio" ? "" : clienteView}`
      : `barbearia.com/admin/${adminView}`;

  function startBooking() {
    setWizardStep("servico");
    setChosenService(null);
    setChosenBarber(null);
    setChosenTime(null);
    setClienteView("agendar");
  }

  function confirmBooking() {
    if (!chosenService || !chosenBarber || !chosenTime) return;
    const booking: Booking = {
      id: `AG-${Math.floor(1000 + Math.random() * 8999)}`,
      client: name.trim() || "Você",
      serviceId: chosenService,
      barberId: chosenBarber,
      date: dayLabel,
      time: chosenTime,
      status: "Confirmado",
    };
    setMyBookings((b) => [booking, ...b]);
    setWizardStep("confirmado");
  }

  function cancelMyBooking(id: string) {
    setMyBookings((list) => list.map((b) => (b.id === id ? { ...b, status: "Cancelado" } : b)));
  }

  function setAdminStatus(id: string, status: Status) {
    setAdminBookings((list) => list.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  const todayBookings = adminBookings.filter((b) => b.date === "Hoje");
  const revenueToday = todayBookings
    .filter((b) => b.status === "Confirmado")
    .reduce((sum, b) => sum + serviceOf(b.serviceId).price, 0);
  const activeClients = new Set(todayBookings.map((b) => b.client)).size;
  const occupiedSlots = todayBookings.filter((b) => b.status !== "Cancelado").length;
  const occupancy = Math.min(100, Math.round((occupiedSlots / 16) * 100));

  const CLIENTE_NAV: { key: ClienteView; label: string }[] = [
    { key: "inicio", label: "Início" },
    { key: "servicos", label: "Serviços" },
    { key: "sobre", label: "Sobre Nós" },
    { key: "meus-agendamentos", label: "Meus Agendamentos" },
  ];

  const ADMIN_NAV: { key: AdminView; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { key: "agendamentos", label: "Agendamentos", icon: <Calendar size={16} /> },
    { key: "barbeiros", label: "Barbeiros", icon: <Users size={16} /> },
    { key: "servicos", label: "Serviços", icon: <Scissors size={16} /> },
    { key: "relatorios", label: "Relatórios", icon: <BarChart3 size={16} /> },
  ];

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden">
      {/* aviso de simulação */}
      <div className="flex items-start gap-3 p-4 bg-amber-500/10 border-b border-amber-500/20">
        <Info size={18} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-amber-200 text-sm leading-relaxed">
          Simulação a correr apenas no seu browser — não existe backend real nem base de dados.
          Esta demo reconstrói o site público de agendamentos e o painel administrativo da Barbearia
          tal como existem no produto real, para navegar como lá.
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
          {currentPath}
        </div>
        <div className="hidden sm:flex items-center gap-1 shrink-0 bg-gray-900 border border-gray-800 rounded-full p-0.5">
          <button
            onClick={() => setRole("cliente")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              role === "cliente" ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Cliente
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              role === "admin" ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Administração
          </button>
        </div>
      </div>
      <div className="flex sm:hidden items-center gap-1 px-4 py-2 bg-gray-950 border-b border-gray-800">
        <button
          onClick={() => setRole("cliente")}
          className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            role === "cliente" ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black" : "text-gray-400 border border-gray-800"
          }`}
        >
          Cliente
        </button>
        <button
          onClick={() => setRole("admin")}
          className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            role === "admin" ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black" : "text-gray-400 border border-gray-800"
          }`}
        >
          Administração
        </button>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* CLIENTE                                                     */}
      {/* ---------------------------------------------------------- */}
      {role === "cliente" && (
        <div>
          {/* nav do site */}
          <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-3 border-b border-gray-800 bg-gray-950/40 overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-700 flex items-center justify-center shrink-0">
                <Scissors size={14} className="text-black" />
              </div>
              <span className="font-black text-sm bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent whitespace-nowrap">
                BarberShop
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {CLIENTE_NAV.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setClienteView(item.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    clienteView === item.key ? "bg-gray-800 text-amber-400" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => (loggedIn ? undefined : setShowLogin(true))}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-400 border border-gray-800 hover:text-white hover:border-gray-700 transition-colors"
              >
                <LogIn size={13} />
                {loggedIn ? (name.trim() || "Você") : "Entrar"}
              </button>
              <button
                onClick={startBooking}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-600 text-black hover:opacity-90 transition-opacity"
              >
                <Calendar size={13} />
                Fazer Agendamento
              </button>
            </div>
          </div>

          {/* nav mobile */}
          <div className="flex md:hidden items-center gap-1 px-4 py-2 border-b border-gray-800 bg-gray-950/40 overflow-x-auto">
            {CLIENTE_NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => setClienteView(item.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  clienteView === item.key ? "bg-gray-800 text-amber-400" : "text-gray-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-6 min-h-[440px]">
            {clienteView === "inicio" && (
              <div className="text-center py-6 sm:py-10 space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                  <Sparkles size={12} />
                  Desde 2018 · Luanda
                </div>
                <h3 className="text-2xl sm:text-3xl font-black">
                  Estilo e tradição <span className="text-amber-400">em cada corte</span>
                </h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto">
                  Marque o seu horário em menos de um minuto e garanta o seu lugar com os melhores
                  barbeiros da cidade — sem filas, sem WhatsApp perdido.
                </p>
                <button
                  onClick={startBooking}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold hover:opacity-90 transition-opacity"
                >
                  <Calendar size={16} />
                  Marcar horário agora
                </button>
                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto pt-4">
                  {[
                    { label: "Clientes/mês", value: "300+" },
                    { label: "Avaliação", value: "4.9★" },
                    { label: "Barbeiros", value: "2" },
                  ].map((s) => (
                    <div key={s.label} className="p-3 rounded-lg bg-gray-950/60 border border-gray-800">
                      <p className="text-lg font-bold text-amber-400">{s.value}</p>
                      <p className="text-[11px] text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {clienteView === "servicos" && (
              <div className="space-y-4">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Scissors size={18} className="text-amber-400" />
                  Os nossos serviços
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm">{s.name}</p>
                        <span className="text-amber-400 font-bold text-sm whitespace-nowrap">{formatKz(s.price)}</span>
                      </div>
                      <p className="text-xs text-gray-500">{s.desc}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1 text-[11px] text-gray-500">
                          <Clock size={11} />
                          {s.duration} min
                        </span>
                        <button
                          onClick={() => {
                            setChosenService(s.id);
                            setWizardStep("barbeiro");
                            setClienteView("agendar");
                          }}
                          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
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

            {clienteView === "sobre" && (
              <div className="space-y-4 max-w-xl">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Info size={18} className="text-amber-400" />
                  Sobre nós
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  A BarberShop nasceu do gosto por fazer bem feito: cortes precisos, barba desenhada
                  com cuidado e um ambiente onde o cliente se sente em casa. Ao longo dos anos,
                  construímos uma equipa pequena e especializada em vez de crescer sem controlo —
                  preferimos dois barbeiros excelentes a dez medianos.
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Hoje, a maior parte das nossas marcações acontece online, o que nos permite planear
                  o dia com antecedência e reduzir o tempo de espera de cada cliente.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {BARBERS.map((b) => (
                    <span key={b.id} className="text-xs px-3 py-1 rounded-full bg-gray-950/60 border border-gray-800 text-gray-300">
                      {b.name} · {b.years} anos de experiência
                    </span>
                  ))}
                </div>
              </div>
            )}

            {clienteView === "meus-agendamentos" && (
              <div className="space-y-3">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <ListChecks size={18} className="text-amber-400" />
                  Meus agendamentos
                </h4>
                {myBookings.length === 0 && (
                  <p className="text-sm text-gray-500">Ainda não tem nenhuma marcação.</p>
                )}
                {myBookings.map((b) => {
                  const svc = serviceOf(b.serviceId);
                  const brb = barberOf(b.barberId);
                  return (
                    <div key={b.id} className="p-3.5 rounded-lg bg-gray-950/60 border border-gray-800 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm truncate">{svc.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${statusBadge(b.status)}`}>{b.status}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {brb.name} · {b.date}, {b.time}
                        </p>
                      </div>
                      {b.status === "Confirmado" && (
                        <button
                          onClick={() => cancelMyBooking(b.id)}
                          className="text-xs font-semibold text-red-400 hover:text-red-300 shrink-0"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {clienteView === "agendar" && (
              <BookingWizard
                step={wizardStep}
                setStep={setWizardStep}
                chosenService={chosenService}
                setChosenService={setChosenService}
                chosenBarber={chosenBarber}
                setChosenBarber={setChosenBarber}
                chosenDay={chosenDay}
                setChosenDay={setChosenDay}
                chosenTime={chosenTime}
                setChosenTime={setChosenTime}
                days={days}
                slots={slots}
                dayLabel={dayLabel}
                onConfirm={confirmBooking}
                onFinish={() => setClienteView("meus-agendamentos")}
              />
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------- */}
      {/* ADMIN                                                       */}
      {/* ---------------------------------------------------------- */}
      {role === "admin" && (
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
          <div className="border-b md:border-b-0 md:border-r border-gray-800 bg-gray-950/40 p-3 flex md:flex-col gap-1 overflow-x-auto">
            <div className="hidden md:flex items-center gap-2 px-2 pb-3 mb-2 border-b border-gray-800">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-700 flex items-center justify-center shrink-0">
                <Scissors size={14} className="text-black" />
              </div>
              <span className="font-black text-sm bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
                BarberShop Admin
              </span>
            </div>
            {ADMIN_NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => setAdminView(item.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  adminView === item.key
                    ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black"
                    : "text-gray-400 hover:text-white hover:bg-gray-900/60"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-6 min-h-[440px]">
            {adminView === "dashboard" && (
              <div className="space-y-5">
                <h4 className="font-semibold text-lg">Visão geral de hoje</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <StatCard icon={<CalendarCheck size={14} className="text-amber-400" />} label="Agendamentos Hoje" value={String(todayBookings.length)} />
                  <StatCard icon={<DollarSign size={14} className="text-amber-400" />} label="Receita do Dia" value={formatKz(revenueToday)} />
                  <StatCard icon={<Users size={14} className="text-amber-400" />} label="Clientes Ativos" value={String(activeClients)} />
                  <StatCard icon={<Percent size={14} className="text-amber-400" />} label="Taxa de Ocupação" value={`${occupancy}%`} />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Agendamentos de hoje</p>
                  <BookingTable
                    rows={todayBookings}
                    onConfirm={(id) => setAdminStatus(id, "Confirmado")}
                    onCancel={(id) => setAdminStatus(id, "Cancelado")}
                  />
                </div>
              </div>
            )}

            {adminView === "agendamentos" && (
              <div className="space-y-3">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Calendar size={18} className="text-amber-400" />
                  Todos os agendamentos
                </h4>
                <BookingTable
                  rows={adminBookings}
                  onConfirm={(id) => setAdminStatus(id, "Confirmado")}
                  onCancel={(id) => setAdminStatus(id, "Cancelado")}
                />
              </div>
            )}

            {adminView === "barbeiros" && (
              <div className="space-y-3">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Users size={18} className="text-amber-400" />
                  Equipa
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BARBERS.map((b) => {
                    const count = adminBookings.filter((bk) => bk.barberId === b.id && bk.status !== "Cancelado").length;
                    return (
                      <div key={b.id} className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-700 flex items-center justify-center font-bold text-black shrink-0">
                            {b.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{b.name}</p>
                            <p className="text-xs text-gray-500 truncate">{b.specialty}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-800">
                          <span className="flex items-center gap-1 text-amber-300">
                            <Star size={11} className="fill-amber-300" />
                            {b.rating}
                          </span>
                          <span className="text-gray-500">{count} agendamentos hoje</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {adminView === "servicos" && (
              <div className="space-y-3">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Scissors size={18} className="text-amber-400" />
                  Serviços e preços
                </h4>
                <div className="space-y-2">
                  {SERVICES.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
                      <div>
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.duration} min</p>
                      </div>
                      <span className="font-semibold text-amber-400">{formatKz(s.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {adminView === "relatorios" && (
              <ReportsView adminBookings={adminBookings} />
            )}
          </div>
        </div>
      )}

      {/* modal de login */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowLogin(false)}>
          <div
            className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-base">Entrar na sua conta</h4>
              <button onClick={() => setShowLogin(false)} className="text-gray-500 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Nome</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="O seu nome"
                  className="mt-1 w-full rounded-lg bg-gray-950 border border-gray-700 px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  placeholder="voce@email.com"
                  className="mt-1 w-full rounded-lg bg-gray-950 border border-gray-700 px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg bg-gray-950 border border-gray-700 px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
                />
              </div>
            </div>
            <button
              onClick={() => {
                setLoggedIn(true);
                setShowLogin(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold hover:opacity-90 transition-opacity"
            >
              <LogIn size={16} />
              Entrar (demo)
            </button>
            <p className="text-[11px] text-gray-500 text-center">Simulação — nenhuma credencial é validada.</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Wizard de agendamento                                               */
/* ------------------------------------------------------------------ */

function BookingWizard({
  step,
  setStep,
  chosenService,
  setChosenService,
  chosenBarber,
  setChosenBarber,
  chosenDay,
  setChosenDay,
  chosenTime,
  setChosenTime,
  days,
  slots,
  dayLabel,
  onConfirm,
  onFinish,
}: {
  step: WizardStep;
  setStep: (s: WizardStep) => void;
  chosenService: string | null;
  setChosenService: (s: string) => void;
  chosenBarber: string | null;
  setChosenBarber: (b: string) => void;
  chosenDay: string;
  setChosenDay: (d: string) => void;
  chosenTime: string | null;
  setChosenTime: (t: string) => void;
  days: { key: string; label: string; sub: string }[];
  slots: { time: string; available: boolean }[];
  dayLabel: string;
  onConfirm: () => void;
  onFinish: () => void;
}) {
  const steps: { key: WizardStep; label: string }[] = [
    { key: "servico", label: "Serviço" },
    { key: "barbeiro", label: "Barbeiro" },
    { key: "horario", label: "Horário" },
    { key: "confirmado", label: "Confirmação" },
  ];
  const currentIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="space-y-5">
      {step !== "confirmado" && (
        <div className="flex items-center gap-1.5">
          {steps.slice(0, 3).map((s, i) => (
            <div key={s.key} className="flex items-center gap-1.5 flex-1">
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  i <= currentIndex ? "bg-gradient-to-r from-amber-500 to-yellow-600" : "bg-gray-800"
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {step === "servico" && (
        <div className="space-y-3">
          <h4 className="font-semibold text-lg">1. Escolha o serviço</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setChosenService(s.id);
                  setStep("barbeiro");
                }}
                className={`text-left p-4 rounded-xl border transition-colors ${
                  chosenService === s.id
                    ? "border-amber-400 bg-amber-500/10"
                    : "border-gray-800 bg-gray-950/60 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{s.name}</p>
                  <span className="text-amber-400 font-bold text-sm">{formatKz(s.price)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-2">
                  <Clock size={11} />
                  {s.duration} min
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "barbeiro" && (
        <div className="space-y-3">
          <button onClick={() => setStep("servico")} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white">
            <ChevronLeft size={13} />
            Voltar
          </button>
          <h4 className="font-semibold text-lg">2. Escolha o barbeiro</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BARBERS.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setChosenBarber(b.id);
                  setStep("horario");
                }}
                className={`text-left p-4 rounded-xl border transition-colors ${
                  chosenBarber === b.id
                    ? "border-amber-400 bg-amber-500/10"
                    : "border-gray-800 bg-gray-950/60 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-700 flex items-center justify-center font-bold text-black shrink-0">
                    {b.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.specialty}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-amber-300 mt-2">
                  <Star size={11} className="fill-amber-300" />
                  {b.rating} · {b.years} anos de experiência
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "horario" && (
        <div className="space-y-3">
          <button onClick={() => setStep("barbeiro")} className="flex items-center gap-1 text-xs text-gray-500 hover:text-white">
            <ChevronLeft size={13} />
            Voltar
          </button>
          <h4 className="font-semibold text-lg">3. Escolha o dia e a hora</h4>
          <div className="flex gap-2">
            {days.map((d) => (
              <button
                key={d.key}
                onClick={() => {
                  setChosenDay(d.key);
                  setChosenTime("");
                }}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                  chosenDay === d.key
                    ? "border-amber-400 bg-amber-500/10 text-amber-300"
                    : "border-gray-800 text-gray-400 hover:border-gray-700"
                }`}
              >
                {d.label}
                <br />
                <span className="font-normal text-[10px] text-gray-500">{d.sub}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Clock size={12} />
            Horários de {dayLabel.toLowerCase()} com {chosenBarber ? BARBERS.find((b) => b.id === chosenBarber)?.name : "o barbeiro"}
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {slots.map((s) => (
              <button
                key={s.time}
                disabled={!s.available}
                onClick={() => setChosenTime(s.time)}
                className={`px-2 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                  !s.available
                    ? "border-gray-900 bg-gray-950 text-gray-700 cursor-not-allowed line-through"
                    : chosenTime === s.time
                    ? "border-amber-400 bg-amber-500/10 text-amber-300"
                    : "border-gray-800 text-gray-300 hover:border-gray-700"
                }`}
              >
                {s.time}
              </button>
            ))}
          </div>
          <button
            onClick={onConfirm}
            disabled={!chosenTime}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            <CheckCircle2 size={16} />
            Confirmar agendamento
          </button>
        </div>
      )}

      {step === "confirmado" && chosenService && chosenBarber && chosenTime && (
        <div className="max-w-sm mx-auto text-center py-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} className="text-green-400" />
          </div>
          <h4 className="font-semibold text-lg">Agendamento confirmado!</h4>
          <div className="text-left space-y-2 p-4 rounded-xl bg-gray-950/60 border border-gray-800">
            <Row label="Serviço" value={serviceOf(chosenService).name} />
            <Row label="Barbeiro" value={barberOf(chosenBarber).name} />
            <Row label="Data" value={dayLabel} />
            <Row label="Hora" value={chosenTime} />
            <Row label="Valor" value={formatKz(serviceOf(chosenService).price)} highlight />
          </div>
          <button
            onClick={onFinish}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-semibold hover:opacity-90 transition-opacity"
          >
            Ver meus agendamentos
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Peças reutilizáveis                                                 */
/* ------------------------------------------------------------------ */

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={highlight ? "font-semibold text-amber-400" : "text-gray-200"}>{value}</span>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-gray-950/60 border border-gray-800">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <p className="text-[11px] text-gray-400 uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function BookingTable({
  rows,
  onConfirm,
  onCancel,
}: {
  rows: Booking[];
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-gray-500">Nenhum agendamento encontrado.</p>;
  }
  return (
    <div className="space-y-2">
      {rows.map((b) => {
        const svc = serviceOf(b.serviceId);
        const brb = barberOf(b.barberId);
        return (
          <div key={b.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
            <div className="min-w-0">
              <p className="font-semibold truncate">{b.client}</p>
              <p className="text-xs text-gray-500 truncate">
                {svc.name} · {brb.name} · {b.date}, {b.time}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadge(b.status)}`}>{b.status}</span>
              {b.status === "Pendente" && (
                <button onClick={() => onConfirm(b.id)} className="text-green-400 hover:text-green-300" title="Confirmar">
                  <CheckCircle2 size={16} />
                </button>
              )}
              {b.status !== "Cancelado" && (
                <button onClick={() => onCancel(b.id)} className="text-red-400 hover:text-red-300" title="Cancelar">
                  <XCircle size={16} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReportsView({ adminBookings }: { adminBookings: Booking[] }) {
  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const rand = seededRandom("barbearia-relatorios");
  const revenue = weekDays.map((d) => ({ day: d, value: Math.round(8000 + rand() * 22000) }));
  const maxRevenue = Math.max(...revenue.map((r) => r.value));

  const byService = SERVICES.map((s) => {
    const count = adminBookings.filter((b) => b.serviceId === s.id && b.status !== "Cancelado").length;
    return { ...s, count };
  });
  const totalCount = byService.reduce((sum, s) => sum + s.count, 0) || 1;

  return (
    <div className="space-y-6">
      <h4 className="font-semibold text-lg flex items-center gap-2">
        <BarChart3 size={18} className="text-amber-400" />
        Relatórios da semana
      </h4>

      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Receita por dia</p>
        <div className="flex items-end gap-2 h-32 p-3 rounded-xl bg-gray-950/60 border border-gray-800">
          {revenue.map((r) => (
            <div key={r.day} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-amber-600 to-yellow-400"
                style={{ height: `${Math.max(8, (r.value / maxRevenue) * 88)}px` }}
                title={formatKz(r.value)}
              />
              <span className="text-[10px] text-gray-500">{r.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Serviços mais procurados (hoje)</p>
        <div className="space-y-2">
          {byService.map((s) => {
            const pct = Math.round((s.count / totalCount) * 100);
            return (
              <div key={s.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">{s.name}</span>
                  <span className="text-gray-500">{s.count} marcações</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-600" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
