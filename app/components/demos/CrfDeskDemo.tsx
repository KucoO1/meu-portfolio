"use client";

import { useState } from "react";
import {
  Search,
  ShieldCheck,
  Info,
  FileText,
  Loader2,
  LayoutDashboard,
  History,
  Key,
  Users,
  Settings,
  Shield,
  Sparkles,
  BarChart3,
  Lock,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

type MainView = "dashboard" | "screening" | "reports" | "history" | "apikeys" | "usage";
type AdminView = "admin" | "users" | "settings";
type View = MainView | AdminView;
type Step = "form" | "loading" | "result";

const NETWORKS = ["Ethereum", "Bitcoin", "Polygon", "BSC"];

interface ReasonCode {
  category: string;
  code: string;
  description: string;
  points: number;
  confidence: "ALTA" | "MÉDIA" | "BAIXA";
}

const REASON_POOL: ReasonCode[] = [
  { category: "Behavior", code: "FAST_FUNDS_MOVEMENT", description: "Movimentação rápida entre múltiplas carteiras", points: 18, confidence: "MÉDIA" },
  { category: "Exposure", code: "MIXER_INTERACTION", description: "Interação indireta com serviço de mistura de fundos", points: 34, confidence: "ALTA" },
  { category: "Geography", code: "HIGH_RISK_JURISDICTION", description: "Fundos associados a jurisdição de risco elevado", points: 22, confidence: "MÉDIA" },
  { category: "Counterparty", code: "SANCTIONED_LIST_PROXIMITY", description: "Proximidade a endereço com correspondência em lista de sanções", points: 41, confidence: "ALTA" },
  { category: "Behavior", code: "NEW_WALLET_HIGH_VALUE", description: "Carteira recente com movimentação de valor elevado", points: 12, confidence: "BAIXA" },
  { category: "Exposure", code: "DARKNET_MARKET_LINK", description: "Ligação histórica a mercado da darknet", points: 46, confidence: "ALTA" },
];

const HISTORY_ITEMS = [
  { case: "CRF-1785334200822-l3t5ny98u", address: "0x742d35Cc6634C0532925a3b844B…", network: "ethereum", score: 18, level: "MINIMAL", date: "29/07/2026, 15:10" },
  { case: "CRF-1785334051621-7b1psazhh", address: "0x742d35Cc6634C0532925a3b844B…", network: "ethereum", score: 18, level: "MINIMAL", date: "29/07/2026, 15:07" },
  { case: "CRF-1766087640313-p4wyip2jp", address: "0x9f8C8A3b5E4F1d26c4B7a27d3b62…", network: "ethereum", score: 6, level: "MINIMAL", date: "18/12/2025, 19:54" },
  { case: "CRF-1764221093410-9kdmz1qta", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p…", network: "bitcoin", score: 52, level: "MÉDIO", date: "27/11/2025, 08:32" },
];

const REPORTS = [
  { case: "CRF-1785334200822-l3t5ny98u", risk: "Risco Mínimo", score: 18, views: 1, downloads: 0, date: "29/07/2026", tags: 4 },
  { case: "CRF-1785334051621-7b1psazhh", risk: "Risco Mínimo", score: 18, views: 1, downloads: 2, date: "29/07/2026", tags: 4 },
];

const ADMIN_USERS = [
  { name: "Teste API", email: "teste.api@crfdesk.com", role: "Analyst", plan: "Enterprise", status: "Ativo" },
  { name: "Administrador do CRF Desk", email: "admin@crfdesk.com", role: "Administrator", plan: "Enterprise", status: "Ativo", isYou: true },
  { name: "Usuário de Teste", email: "teste.admin@crfdesk.com", role: "Analyst", plan: "Free", status: "Ativo" },
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

function levelFromScore(score: number) {
  if (score < 25) return { label: "MÍNIMO", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30", action: "ACCEPT" };
  if (score < 50) return { label: "BAIXO", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", action: "ACCEPT" };
  if (score < 75) return { label: "MÉDIO", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30", action: "REVIEW" };
  return { label: "ALTO", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", action: "BLOCK" };
}

const MAIN_NAV: { key: MainView; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { key: "screening", label: "Screening", icon: <Search size={16} /> },
  { key: "reports", label: "Relatórios", icon: <FileText size={16} /> },
  { key: "history", label: "Histórico", icon: <History size={16} /> },
  { key: "apikeys", label: "API Keys", icon: <Key size={16} /> },
  { key: "usage", label: "Uso", icon: <BarChart3 size={16} /> },
];

const ADMIN_NAV: { key: AdminView; label: string; icon: React.ReactNode }[] = [
  { key: "admin", label: "Admin Panel", icon: <Shield size={16} /> },
  { key: "users", label: "Usuários", icon: <Users size={16} /> },
  { key: "settings", label: "Configurações", icon: <Settings size={16} /> },
];

export default function CrfDeskDemo() {
  const [view, setView] = useState<View>("dashboard");
  const [address, setAddress] = useState("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb");
  const [network, setNetwork] = useState("Ethereum");
  const [step, setStep] = useState<Step>("form");
  const [reasons, setReasons] = useState<ReasonCode[]>([]);
  const [score, setScore] = useState(0);
  const [caseNumber, setCaseNumber] = useState("");
  const [reportGenerated, setReportGenerated] = useState(false);
  const [sarStatus, setSarStatus] = useState<"none" | "draft" | "pending" | "approved">("none");

  function handleRun() {
    if (!address.trim()) return;
    setStep("loading");
    setReportGenerated(false);
    setSarStatus("none");

    setTimeout(() => {
      const rand = seededRandom(address + network);
      const count = 1 + Math.floor(rand() * 3);
      const shuffled = [...REASON_POOL].sort(() => rand() - 0.5).slice(0, count);
      const total = shuffled.reduce((sum, r) => sum + r.points, 0);
      const finalScore = Math.min(100, total);

      setReasons(shuffled);
      setScore(finalScore);
      setCaseNumber(`CRF-${Date.now().toString().slice(-10)}-${Math.random().toString(36).slice(2, 8)}`);
      setStep("result");
    }, 1500);
  }

  const level = levelFromScore(score);
  const currentPath = view === "admin" || view === "users" || view === "settings"
    ? `app.crfdesk.com/dashboard/${view}`
    : `app.crfdesk.com/dashboard/${view === "dashboard" ? "" : view}`;

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden">
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border-b border-blue-500/20">
        <Info size={18} className="text-blue-400 mt-0.5 shrink-0" />
        <p className="text-blue-200 text-sm leading-relaxed">
          Simulação a correr apenas no seu browser — os resultados são gerados localmente, sem
          qualquer ligação a blockchains reais ou listas de sanções. Esta demo reconstrói o painel
          completo do CRF Desk tal como existe no site real, para navegar como lá.
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
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CRF Desk
            </span>
          </div>
          {MAIN_NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                view === item.key
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300"
                  : "text-gray-400 hover:text-white hover:bg-gray-900/60"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <div className="hidden md:flex items-center gap-1.5 px-3 pt-4 mt-2 border-t border-gray-800">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Administração</span>
          </div>
          {ADMIN_NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                view === item.key
                  ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-pink-300"
                  : "text-gray-400 hover:text-white hover:bg-gray-900/60"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* main content */}
        <div className="p-5 sm:p-6 min-h-[460px]">
          {view === "dashboard" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">Painel de segurança blockchain</h4>
                  <p className="text-sm text-gray-500">Visão geral do sistema e métricas de desempenho</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-green-500/15 text-green-300">
                  <Sparkles size={12} />
                  Sistema Ativo
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard label="Usuários" value="3" trend="+0%" color="text-blue-400" />
                <StatCard label="Análises" value="71" trend="+1" color="text-purple-400" />
                <StatCard label="Relatórios" value="48" trend="+1" color="text-amber-400" />
                <StatCard label="Receita mensal" value="€0" color="text-green-400" />
                <StatCard label="Score médio" value="25" sub="Risco médio" color="text-red-400" />
                <StatCard label="Total histórico" value="28" color="text-cyan-400" />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Atividade recente</h5>
                <div className="space-y-2">
                  {HISTORY_ITEMS.slice(0, 3).map((h) => (
                    <div key={h.case} className="flex items-center justify-between p-3 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
                      <div>
                        <p className="font-mono text-xs text-gray-400">{h.case}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{h.network} · {h.date}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-300">{h.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "screening" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Análise de Risco</h4>
                <p className="text-sm text-gray-500">Analise endereços, transações e contratos em múltiplas blockchains</p>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-gray-950/60 border border-gray-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide">Endereço da carteira / hash</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2.5 text-white font-mono text-sm focus:border-blue-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide">Blockchain</label>
                    <select
                      value={network}
                      onChange={(e) => setNetwork(e.target.value)}
                      className="mt-1 w-full sm:w-40 rounded-lg bg-gray-900 border border-gray-700 px-3 py-2.5 text-white focus:border-blue-400 outline-none"
                    >
                      {NETWORKS.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleRun}
                  disabled={step === "loading" || !address.trim()}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {step === "loading" ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                  {step === "loading" ? "A analisar…" : "Executar Screening"}
                </button>
              </div>

              {step === "result" && (
                <div className="space-y-5">
                  <div className={`flex items-center justify-between p-4 rounded-xl border ${level.bg}`}>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Score de risco</p>
                      <p className={`text-3xl font-bold ${level.color}`}>{score}/100</p>
                      <p className={`text-sm font-semibold ${level.color}`}>Risco {level.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Ação recomendada</p>
                      <p className={`text-lg font-bold ${level.color}`}>{level.action}</p>
                      <p className="text-xs text-gray-500 font-mono mt-1">{caseNumber}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-gray-300 mb-3">Fatores de risco identificados</h5>
                    <div className="space-y-2">
                      {reasons.map((r) => (
                        <div
                          key={r.code}
                          className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-950/60 border border-gray-800 text-sm"
                        >
                          <div>
                            <p className="font-mono text-xs text-blue-400">{r.code}</p>
                            <p className="text-gray-300">{r.description}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {r.category} · confiança {r.confidence}
                            </p>
                          </div>
                          <span className="text-amber-400 font-semibold shrink-0">+{r.points}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setReportGenerated(true)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-700 hover:border-blue-400 hover:text-blue-400 transition-colors font-semibold text-sm"
                    >
                      <FileText size={16} />
                      Gerar relatório PDF
                    </button>
                    {(level.label === "MÉDIO" || level.label === "ALTO") && (
                      <button
                        onClick={() => setSarStatus("draft")}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-red-500/40 text-red-300 hover:border-red-400 transition-colors font-semibold text-sm"
                      >
                        <AlertTriangle size={16} />
                        Abrir rascunho de SAR
                      </button>
                    )}
                  </div>

                  {reportGenerated && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
                      <ShieldCheck size={18} />
                      Relatório {caseNumber} gerado e assinado com selo de integridade (simulação)
                    </div>
                  )}

                  {sarStatus !== "none" && (
                    <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-3">
                      <h5 className="text-sm font-semibold text-gray-300">Relatório de Atividade Suspeita (SAR)</h5>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">Estado:</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            sarStatus === "draft"
                              ? "bg-amber-500/15 text-amber-300"
                              : sarStatus === "pending"
                              ? "bg-blue-500/15 text-blue-300"
                              : "bg-green-500/15 text-green-300"
                          }`}
                        >
                          {sarStatus === "draft" ? "Rascunho" : sarStatus === "pending" ? "Aguarda aprovação" : "Aprovado"}
                        </span>
                      </div>
                      {sarStatus === "draft" && (
                        <button
                          onClick={() => setSarStatus("pending")}
                          className="px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 text-sm font-semibold hover:bg-amber-500/30 transition-colors"
                        >
                          Submeter para aprovação de supervisor
                        </button>
                      )}
                      {sarStatus === "pending" && (
                        <button
                          onClick={() => setSarStatus("approved")}
                          className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold hover:bg-blue-500/30 transition-colors"
                        >
                          Aprovar como supervisor (simulado)
                        </button>
                      )}
                      {sarStatus === "approved" && (
                        <p className="text-xs text-gray-500">
                          Aprovado por um supervisor — pronto para submissão formal à autoridade competente.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {view === "reports" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">Relatórios</h4>
                <p className="text-sm text-gray-500">Visualize e gerencie seus relatórios de análise</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {REPORTS.map((r) => (
                  <div key={r.case} className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center shrink-0">
                          <FileText size={14} className="text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Relatório de Screening</p>
                          <p className="text-xs text-gray-500 font-mono">{r.case}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 shrink-0">Finalizado</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                        <p className="text-gray-500">Risco</p>
                        <p className="text-green-400 font-semibold">{r.risk}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                        <p className="text-gray-500">Score</p>
                        <p className="font-semibold">{r.score}/100</p>
                      </div>
                      <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                        <p className="text-gray-500">Visualizações</p>
                        <p className="font-semibold">{r.views}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                        <p className="text-gray-500">Downloads</p>
                        <p className="font-semibold">{r.downloads}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/15 text-blue-300 text-xs font-semibold hover:bg-blue-500/25 transition-colors">
                        <Eye size={13} />
                        Visualizar
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-700 text-xs font-semibold hover:border-blue-400 transition-colors">
                        <Download size={13} />
                        PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "history" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="font-semibold text-lg">Histórico de Screenings</h4>
                  <p className="text-sm text-gray-500">28 screenings realizados</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Total" value="28" color="text-blue-400" />
                <StatCard label="Score médio" value="11.6" color="text-purple-400" />
                <StatCard label="Alto risco" value="0" color="text-red-400" />
                <StatCard label="Baixo risco" value="27" color="text-green-400" />
              </div>
              <div className="space-y-2">
                {HISTORY_ITEMS.map((h) => (
                  <div key={h.case} className="flex items-center justify-between p-3 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
                    <div>
                      <p className="font-mono text-xs text-gray-400">{h.case}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{h.address}</p>
                      <p className="text-gray-600 text-xs">{h.network} · {h.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-300">{h.level}</span>
                      <p className="text-xs text-gray-500 mt-1">Score: {h.score}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "apikeys" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">API Keys</h4>
                  <p className="text-sm text-gray-500">Gerencie suas chaves de API para integração REST</p>
                </div>
                <button className="px-4 py-2 rounded-full border border-red-500/40 text-red-300 text-xs font-semibold hover:border-red-400 transition-colors">
                  Revogar Chave Atual
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-4">
                <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key size={14} className="text-blue-400" />
                      <span className="font-semibold text-sm">mhbnmbm</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-300">Ativa</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Uso mensal</span>
                      <span>0%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "0%" }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                      <p className="text-gray-500">Plano</p>
                      <p className="font-semibold">Enterprise</p>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                      <p className="text-gray-500">Limite</p>
                      <p className="font-semibold">Ilimitado</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <p className="text-xs text-blue-300">Limite mensal</p>
                    <p className="font-semibold text-sm">Ilimitado</p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                    <p className="text-xs text-green-300">Plano atual</p>
                    <p className="font-semibold text-sm">Enterprise</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "usage" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">Uso da Conta</h4>
                <p className="text-sm text-gray-500">Plano Enterprise · Role admin</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Uso da API" value="0%" sub="0 de ∞ requisições" color="text-blue-400" />
                <StatCard label="Uso do painel" value="0%" sub="4 de ∞ screenings" color="text-green-400" />
                <StatCard label="Total histórico" value="28" sub="screenings realizados" color="text-purple-400" />
                <StatCard label="Limite batch" value="200" sub="endereços por lote" color="text-amber-400" />
              </div>
              <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800">
                <h5 className="text-sm font-semibold text-gray-300 mb-3">Comparativo de uso mensal</h5>
                <div className="flex items-end gap-6 h-24">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 bg-gray-800 rounded-t" style={{ height: "6px" }} />
                    <span className="text-[10px] text-gray-500">API</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 bg-blue-500 rounded-t" style={{ height: "60px" }} />
                    <span className="text-[10px] text-gray-500">Painel</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "admin" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-lg">Painel Administrativo</h4>
                  <p className="text-sm text-gray-500">Visão geral do sistema e métricas de desempenho</p>
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full bg-red-500/15 text-red-300 font-semibold">ADMIN</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard label="Usuários" value="3" color="text-blue-400" />
                <StatCard label="Ativos" value="3" sub="100%" color="text-green-400" />
                <StatCard label="Análises" value="71" color="text-purple-400" />
                <StatCard label="Relatórios" value="48" color="text-amber-400" />
                <StatCard label="Receita mensal" value="€0" color="text-green-400" />
                <StatCard label="Score médio" value="25" sub="Risco médio" color="text-red-400" />
              </div>
            </div>
          )}

          {view === "users" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">Usuários ({ADMIN_USERS.length})</h4>
                <p className="text-sm text-gray-500">Encontre usuários por nome, email ou filtros</p>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-800">
                <table className="w-full text-sm">
                  <thead className="bg-gray-950/60 text-gray-400 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="text-left font-medium px-3 py-2">Usuário</th>
                      <th className="text-left font-medium px-3 py-2">Role</th>
                      <th className="text-left font-medium px-3 py-2">Plano</th>
                      <th className="text-left font-medium px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ADMIN_USERS.map((u) => (
                      <tr key={u.email} className="border-t border-gray-800">
                        <td className="px-3 py-2.5">
                          <p className="font-medium">
                            {u.name} {u.isYou && <span className="text-xs text-blue-400">Você</span>}
                          </p>
                          <p className="font-mono text-xs text-gray-500">{u.email}</p>
                        </td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              u.role === "Administrator" ? "bg-red-500/15 text-red-300" : "bg-blue-500/15 text-blue-300"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-gray-400">{u.plan}</td>
                        <td className="px-3 py-2.5">
                          <span className="flex items-center gap-1 text-xs text-green-300">
                            <CheckCircle2 size={12} />
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === "settings" && (
            <div className="space-y-4 max-w-md">
              <h4 className="font-semibold text-lg">Configurações</h4>
              <SettingRow label="Modelo de risco" value="crf-risk-engine-v1.3.2" />
              <SettingRow label="Política de scoring" value="EU_MiCA_2025" />
              <SettingRow label="Metodologia" value="CRF-RISK-MODEL-1.0" />
              <div className="p-3 rounded-lg bg-gray-950/60 border border-gray-800">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Frameworks de compliance</p>
                <div className="flex flex-wrap gap-2">
                  {["MiCA", "AMLD5", "AMLD6", "FATF"].map((f) => (
                    <span key={f} className="text-xs px-2 py-1 rounded-full bg-purple-500/15 text-purple-300">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, sub, color }: { label: string; value: string; trend?: string; sub?: string; color?: string }) {
  return (
    <div className="p-3 sm:p-4 rounded-xl bg-gray-950/60 border border-gray-800">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      </div>
      <p className={`text-lg sm:text-xl font-bold ${color ?? "text-white"}`}>{value}</p>
      {(trend || sub) && <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{trend ?? sub}</p>}
    </div>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-gray-950/60 border border-gray-800">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="font-mono text-sm text-gray-200 mt-0.5">{value}</p>
    </div>
  );
}
