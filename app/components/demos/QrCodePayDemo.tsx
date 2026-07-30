"use client";

import { useEffect, useRef, useState } from "react";
import {
  QrCode,
  Clock,
  CheckCircle2,
  RotateCcw,
  Bell,
  Info,
  LayoutDashboard,
  Store,
  UserCircle,
  Mail,
  Users,
  CreditCard,
  Sparkles,
  Search,
  Plus,
  TrendingUp,
  X,
  Lock,
  Shield,
} from "lucide-react";
import FakeQRCode from "./FakeQRCode";

type Role = "merchant" | "admin";
type MerchantView = "create-payment" | "dashboard" | "profile";
type AdminView = "dashboard" | "merchants" | "transactions" | "users" | "invites";
type Step = "form" | "qr" | "confirming" | "confirmed";

interface Transaction {
  reference: string;
  amount: number;
  status: "Confirmado" | "Pendente" | "Expirado";
  time: string;
  merchant?: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { reference: "yh9QdxIkxKwy", amount: 13000, status: "Pendente", time: "há 2 horas", merchant: "Padaria Central" },
  { reference: "PPRuUFtodvEZ", amount: 200000, status: "Confirmado", time: "há 5 horas", merchant: "Padaria Central" },
  { reference: "kLm3TzVqAoRp", amount: 45500, status: "Confirmado", time: "há 8 horas", merchant: "Padaria Central" },
  { reference: "wZ8fBnUeCyXd", amount: 9000, status: "Expirado", time: "ontem", merchant: "Padaria Central" },
];

const GLOBAL_TRANSACTIONS: Transaction[] = [
  ...INITIAL_TRANSACTIONS,
  { reference: "aT4vNpQzKm2s", amount: 78000, status: "Confirmado", time: "há 1 hora", merchant: "Farmácia Bem-Estar" },
  { reference: "bR9wLxCkYt5f", amount: 15200, status: "Pendente", time: "há 3 horas", merchant: "Auto Peças Nunes" },
  { reference: "cV2jHmSoWq8d", amount: 320000, status: "Confirmado", time: "há 6 horas", merchant: "Farmácia Bem-Estar" },
  { reference: "dX7uEiTgAz3k", amount: 6800, status: "Expirado", time: "há 1 dia", merchant: "Mercearia Kianda" },
];

const MERCHANTS = [
  { name: "Padaria Central", category: "Varejo", status: "Ativo", city: "Luanda, Luanda", phone: "923 145 778" },
  { name: "Farmácia Bem-Estar", category: "Saúde", status: "Ativo", city: "Benguela, Benguela", phone: "912 774 320" },
  { name: "Auto Peças Nunes", category: "Automóvel", status: "Ativo", city: "Huambo, Huambo", phone: "934 208 661" },
  { name: "Mercearia Kianda", category: "Varejo", status: "Pendente", city: "Luanda, Luanda", phone: "941 663 902" },
];

const INVITES = [
  { email: "geral@farmaciabemestar.ao", status: "Aceite", sentAt: "12 Mar 2025" },
  { email: "contas@autopecasnunes.ao", status: "Aceite", sentAt: "03 Mai 2025" },
  { email: "loja@merceariakianda.ao", status: "Pendente", sentAt: "22 Jul 2025" },
  { email: "info@nova-oportunidade.ao", status: "Expirado", sentAt: "02 Jun 2025" },
];

const ADMIN_USERS = [
  { name: "Nataniel Oliveira", email: "nataniel@crfaccept.ao", role: "Administrador", lastLogin: "há 10 min" },
  { name: "Suporte CRF Accept", email: "suporte@crfaccept.ao", role: "Suporte", lastLogin: "há 3 horas" },
];

function formatKz(value: number) {
  return new Intl.NumberFormat("pt-AO", { minimumFractionDigits: 2 }).format(value) + " Kz";
}

function randomReference() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function statusBadge(status: Transaction["status"]) {
  if (status === "Confirmado") return "bg-green-500/15 text-green-300";
  if (status === "Pendente") return "bg-amber-500/15 text-amber-300";
  return "bg-gray-500/15 text-gray-400";
}

const MERCHANT_NAV: { key: MerchantView; label: string; icon: React.ReactNode; highlight?: boolean }[] = [
  { key: "create-payment", label: "Gerar QR Code", icon: <QrCode size={16} />, highlight: true },
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { key: "profile", label: "Perfil", icon: <UserCircle size={16} /> },
];

const ADMIN_NAV: { key: AdminView; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { key: "merchants", label: "Comerciantes", icon: <Store size={16} /> },
  { key: "transactions", label: "Transações", icon: <CreditCard size={16} /> },
  { key: "users", label: "Usuários", icon: <Users size={16} /> },
  { key: "invites", label: "Convites", icon: <Mail size={16} /> },
];

export default function QrCodePayDemo() {
  const [role, setRole] = useState<Role>("merchant");
  const [merchantView, setMerchantView] = useState<MerchantView>("create-payment");
  const [adminView, setAdminView] = useState<AdminView>("dashboard");

  const [step, setStep] = useState<Step>("form");
  const [amount, setAmount] = useState(20000);
  const [reference, setReference] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function handleGenerate() {
    const ref = randomReference();
    setReference(ref);
    setSecondsLeft(15 * 60);
    setStep("qr");
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function handleSimulateCustomerPayment() {
    setStep("confirming");
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setStep("confirmed");
      setTransactions((prev) => [
        { reference, amount, status: "Confirmado", time: "agora mesmo", merchant: "Padaria Central" },
        ...prev,
      ]);
    }, 1600);
  }

  function handleReset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStep("form");
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const currentPath =
    role === "merchant" ? `app.crfaccept.ao/merchant/${merchantView}` : `app.crfaccept.ao/admin/${adminView}`;

  const confirmedCount = transactions.filter((t) => t.status === "Confirmado").length;
  const totalRevenue = transactions.filter((t) => t.status === "Confirmado").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden">
      <div className="flex items-start gap-3 p-4 bg-amber-500/10 border-b border-amber-500/20">
        <Info size={18} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="text-amber-200 text-sm leading-relaxed">
          Simulação a correr apenas no seu browser — não existe backend real nem ligação a bancos.
          Esta demo reconstrói o painel do comerciante e o painel de administração do CRF Accept
          (o produto QrCodePay) tal como existem no site real, para navegar como lá.
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
        <div className="hidden sm:flex items-center gap-1 shrink-0 bg-gray-900 border border-gray-800 rounded-full p-0.5">
          <button
            onClick={() => setRole("merchant")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              role === "merchant" ? "bg-gradient-to-r from-red-500 to-yellow-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Comerciante
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              role === "admin" ? "bg-gradient-to-r from-red-500 to-yellow-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Administração
          </button>
        </div>
      </div>
      <div className="flex sm:hidden items-center gap-1 px-4 py-2 bg-gray-950 border-b border-gray-800">
        <button
          onClick={() => setRole("merchant")}
          className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            role === "merchant" ? "bg-gradient-to-r from-red-500 to-yellow-500 text-white" : "text-gray-400 border border-gray-800"
          }`}
        >
          Comerciante
        </button>
        <button
          onClick={() => setRole("admin")}
          className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            role === "admin" ? "bg-gradient-to-r from-red-500 to-yellow-500 text-white" : "text-gray-400 border border-gray-800"
          }`}
        >
          Administração
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[210px_1fr]">
        {/* sidebar */}
        <div className="border-b md:border-b-0 md:border-r border-gray-800 bg-gray-950/40 p-3 flex md:flex-col gap-1 overflow-x-auto">
          <div className="hidden md:flex items-center gap-2 px-2 pb-3 mb-2 border-b border-gray-800">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-600 via-red-700 to-yellow-500 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-black text-sm bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
              CRF Accept
            </span>
          </div>
          {(role === "merchant" ? MERCHANT_NAV : ADMIN_NAV).map((item) => {
            const active = role === "merchant" ? merchantView === item.key : adminView === item.key;
            return (
              <button
                key={item.key}
                onClick={() =>
                  role === "merchant" ? setMerchantView(item.key as MerchantView) : setAdminView(item.key as AdminView)
                }
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-gradient-to-r from-red-500/20 to-yellow-500/20 text-yellow-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-900/60"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* main content */}
        <div className="p-5 sm:p-6 min-h-[440px]">
          {role === "merchant" && merchantView === "create-payment" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {step === "form" && (
                  <>
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <QrCode size={18} className="text-yellow-400" />
                      Gerar Pagamento
                    </h4>
                    <p className="text-sm text-gray-500">Crie um QR Code para receber pagamentos</p>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Valor (Kz)</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                        className="mt-1 w-full rounded-lg bg-gray-950 border border-gray-700 px-3 py-2.5 text-white focus:border-yellow-400 outline-none"
                      />
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={amount <= 0}
                      className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      <QrCode size={18} />
                      Gerar QR Code
                    </button>
                  </>
                )}

                {(step === "qr" || step === "confirming" || step === "confirmed") && (
                  <>
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">QR Code Gerado</h4>
                      {step !== "confirmed" && (
                        <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300">
                          <Clock size={12} />
                          {mm}:{ss}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 -mt-2">Cliente deve escanear este código</p>
                    <div className="flex justify-center py-2">
                      <FakeQRCode seed={reference || "demo"} size={170} />
                    </div>
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Valor</span>
                      <span className="font-semibold text-yellow-400">{formatKz(amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Referência</span>
                      <span className="font-mono">{reference}</span>
                    </div>

                    {step === "qr" && (
                      <>
                        <div className="p-3 rounded-lg bg-gray-950/60 border border-gray-800 text-center text-sm text-gray-400">
                          A aguardar leitura do QR Code pelo cliente…
                        </div>
                        <button
                          onClick={handleSimulateCustomerPayment}
                          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-700 hover:border-yellow-400 hover:text-yellow-400 transition-colors font-semibold"
                        >
                          <Bell size={16} />
                          Simular leitura do cliente
                        </button>
                      </>
                    )}

                    {step === "confirming" && (
                      <div className="p-3 rounded-lg bg-gray-950/60 border border-gray-800 text-center text-sm text-gray-300 animate-pulse">
                        A processar confirmação bancária…
                      </div>
                    )}

                    {step === "confirmed" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
                          <CheckCircle2 size={18} />
                          Pagamento confirmado
                        </div>
                        <p className="text-xs text-gray-500 font-mono">
                          webhook recebido — transação {reference} confirmada pela instituição financeira
                        </p>
                        <button
                          onClick={handleReset}
                          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold hover:opacity-90 transition-opacity"
                        >
                          <RotateCcw size={16} />
                          Novo pagamento
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* right: simulated customer phone screen */}
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-950/60 border border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={14} className="text-green-400" />
                  <span className="text-xs font-semibold text-green-300">Secure Payment</span>
                </div>
                <p className="text-xs text-gray-500 text-center mb-4">
                  Ecrã que o cliente vê depois de escanear o QR Code no telemóvel dele
                </p>
                <div className="w-full max-w-[220px] rounded-2xl border border-gray-800 bg-gray-900 p-4 space-y-3">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Comerciante</p>
                    <p className="text-sm font-semibold">Padaria Central</p>
                  </div>
                  <div className="text-center py-2 border-y border-gray-800">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">Valor</p>
                    <p className="text-xl font-bold text-yellow-400">{formatKz(amount)}</p>
                  </div>
                  <div className="w-full text-center px-3 py-2 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white text-xs font-semibold">
                    Proceed to Payment →
                  </div>
                  <p className="text-[10px] text-gray-600 text-center">
                    Redirecionado para a instituição bancária que processa o pagamento
                  </p>
                </div>
              </div>
            </div>
          )}

          {role === "merchant" && merchantView === "dashboard" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Meu Painel</h4>
                <p className="text-sm text-gray-500">Acompanhe suas transações e vendas</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StatCard label="Total de transações" value={String(transactions.length)} />
                <StatCard label="Pagamentos confirmados" value={String(confirmedCount)} />
                <StatCard label="Valor total" value={formatKz(totalRevenue)} />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Transações recentes</h5>
                <TransactionTable rows={transactions} />
              </div>
            </div>
          )}

          {role === "merchant" && merchantView === "profile" && (
            <div className="space-y-4 max-w-md">
              <h4 className="font-semibold text-lg">Perfil do comerciante</h4>
              <ProfileRow label="Nome da loja" value="Padaria Central" />
              <ProfileRow label="Email" value="geral@padariacentral.ao" />
              <ProfileRow label="Categoria" value="Varejo" />
              <ProfileRow label="Estado da conta" value="Ativo" badge="bg-green-500/15 text-green-300" />
              <button className="px-5 py-2.5 rounded-full border border-gray-700 hover:border-yellow-400 hover:text-yellow-400 transition-colors font-semibold text-sm">
                Repor password (simulado)
              </button>
            </div>
          )}

          {role === "admin" && adminView === "dashboard" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">Dashboard</h4>
                  <p className="text-sm text-gray-500">Visão geral do sistema em tempo real</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-green-500/15 text-green-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Sistema Online
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard label="Total de comerciantes" value={String(MERCHANTS.length)} trend="+12%" />
                <StatCard label="Total de transações" value={String(GLOBAL_TRANSACTIONS.length)} trend="+8.5%" />
                <StatCard
                  label="Pagamentos confirmados"
                  value={String(GLOBAL_TRANSACTIONS.filter((t) => t.status === "Confirmado").length)}
                  trend="+15.3%"
                />
                <StatCard
                  label="Valor total"
                  value={formatKz(GLOBAL_TRANSACTIONS.filter((t) => t.status === "Confirmado").reduce((s, t) => s + t.amount, 0))}
                />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Transações recentes</h5>
                <TransactionTable rows={GLOBAL_TRANSACTIONS.slice(0, 4)} showMerchant />
              </div>
            </div>
          )}

          {role === "admin" && adminView === "merchants" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-lg">Comerciantes</h4>
                  <p className="text-sm text-gray-500">Gerencie todos os comerciantes do sistema</p>
                </div>
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
                  <Plus size={15} />
                  Adicionar Comerciante
                </button>
              </div>
              <SearchBox placeholder="Buscar por nome, email ou telefone…" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MERCHANTS.map((m) => (
                  <div key={m.name} className="p-4 rounded-xl bg-gray-950/60 border border-gray-800">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-yellow-500 flex items-center justify-center shrink-0">
                          <Store size={14} className="text-white" />
                        </div>
                        <p className="font-semibold text-sm">{m.name}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${m.status === "Ativo" ? "bg-green-500/15 text-green-300" : "bg-amber-500/15 text-amber-300"}`}>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{m.category}</p>
                    <p className="text-xs text-gray-500 mt-1">{m.city}</p>
                    <p className="text-xs text-gray-500">{m.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {role === "admin" && adminView === "transactions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">Transações</h4>
                  <p className="text-sm text-gray-500">Histórico completo de todas as transações</p>
                </div>
                <SearchBox placeholder="Procurar referência…" />
              </div>
              <TransactionTable rows={GLOBAL_TRANSACTIONS} showMerchant />
            </div>
          )}

          {role === "admin" && adminView === "users" && (
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Usuários</h4>
              <div className="overflow-x-auto rounded-lg border border-gray-800">
                <table className="w-full text-sm">
                  <thead className="bg-gray-950/60 text-gray-400 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="text-left font-medium px-3 py-2">Nome</th>
                      <th className="text-left font-medium px-3 py-2">Email</th>
                      <th className="text-left font-medium px-3 py-2">Papel</th>
                      <th className="text-left font-medium px-3 py-2">Último login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ADMIN_USERS.map((u) => (
                      <tr key={u.email} className="border-t border-gray-800">
                        <td className="px-3 py-2.5 font-medium">{u.name}</td>
                        <td className="px-3 py-2.5 font-mono text-xs text-gray-400">{u.email}</td>
                        <td className="px-3 py-2.5 text-gray-400">{u.role}</td>
                        <td className="px-3 py-2.5 text-gray-400">{u.lastLogin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {role === "admin" && adminView === "invites" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">Convites</h4>
                <button
                  onClick={() => {
                    setShowInviteModal(true);
                    setInviteSent(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <Plus size={15} />
                  Novo convite
                </button>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-800">
                <table className="w-full text-sm">
                  <thead className="bg-gray-950/60 text-gray-400 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="text-left font-medium px-3 py-2">Email</th>
                      <th className="text-left font-medium px-3 py-2">Enviado em</th>
                      <th className="text-left font-medium px-3 py-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INVITES.map((inv) => (
                      <tr key={inv.email} className="border-t border-gray-800">
                        <td className="px-3 py-2.5 font-mono text-xs">{inv.email}</td>
                        <td className="px-3 py-2.5 text-gray-400">{inv.sentAt}</td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              inv.status === "Aceite"
                                ? "bg-green-500/15 text-green-300"
                                : inv.status === "Pendente"
                                ? "bg-amber-500/15 text-amber-300"
                                : "bg-gray-500/15 text-gray-400"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                  <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold">Enviar novo convite</h5>
                      <button onClick={() => setShowInviteModal(false)} className="text-gray-500 hover:text-white">
                        <X size={18} />
                      </button>
                    </div>
                    {!inviteSent ? (
                      <>
                        <div>
                          <label className="text-xs text-gray-400 uppercase tracking-wide">Email do comerciante</label>
                          <input
                            type="email"
                            placeholder="loja@exemplo.ao"
                            className="mt-1 w-full rounded-lg bg-gray-950 border border-gray-700 px-3 py-2.5 text-white text-sm focus:border-yellow-400 outline-none"
                          />
                        </div>
                        <button
                          onClick={() => setInviteSent(true)}
                          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                        >
                          <Mail size={15} />
                          Enviar convite
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
                        <CheckCircle2 size={18} />
                        Convite enviado com link de registo válido por 7 dias
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend }: { label: string; value: string; trend?: string }) {
  return (
    <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        {trend && (
          <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-300">
            <TrendingUp size={10} />
            {trend}
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}

function TransactionTable({ rows, showMerchant }: { rows: Transaction[]; showMerchant?: boolean }) {
  return (
    <div className="space-y-2">
      {rows.map((t, i) => (
        <div
          key={`${t.reference}-${i}`}
          className="flex items-center justify-between p-3 rounded-lg bg-gray-900/60 border border-gray-800 text-sm"
        >
          <div>
            <p className="font-mono text-xs text-gray-400">{t.reference}</p>
            <p className="text-gray-500 text-xs">
              {showMerchant && t.merchant ? `${t.merchant} · ` : ""}
              {t.time}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-yellow-400">{formatKz(t.amount)}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(t.status)}`}>{t.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileRow({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-950/60 border border-gray-800">
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      {badge ? (
        <span className={`text-xs px-2 py-0.5 rounded-full ${badge}`}>{value}</span>
      ) : (
        <span className="text-sm text-gray-200">{value}</span>
      )}
    </div>
  );
}

function SearchBox({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-950 border border-gray-800 text-sm text-gray-500">
      <Search size={14} />
      <span>{placeholder}</span>
    </div>
  );
}
