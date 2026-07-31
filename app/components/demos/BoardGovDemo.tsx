"use client";

import { useMemo, useState } from "react";
import {
  Info,
  Lock,
  LayoutDashboard,
  Calendar,
  Vote,
  BookOpen,
  Users,
  ShieldCheck,
  Building2,
  ShieldAlert,
  ToggleLeft,
  CheckCircle2,
  Clock,
  XCircle,
  PlayCircle,
  ChevronRight,
  FileText,
  MessageSquare,
  AlertTriangle,
  Bot,
  Award,
  ClipboardList,
  RefreshCw,
  ListChecks,
  BarChart3,
  History,
  Send,
  Database,
  UserCog,
  Fingerprint,
  Siren,
  Eye,
  Settings,
} from "lucide-react";

type Perspective = "president" | "admin";
type PresidentView =
  | "dashboard"
  | "reunioes"
  | "votacoes"
  | "actas"
  | "conselho"
  | "documentos"
  | "resolucoes"
  | "accoes"
  | "relatorios"
  | "mandatos"
  | "conflitos"
  | "mensagens"
  | "assistente"
  | "vdr"
  | "questionarios"
  | "registo"
  | "comites"
  | "declaracoes"
  | "auditoria"
  | "emergencia"
  | "auditores";
type AdminView = "dashboard" | "organizacoes" | "utilizadores" | "flags" | "auditoria" | "definicoes";

type MeetingStatus = "DRAFT" | "CONVENED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
type MinutesStatus = "DRAFT" | "UNDER_REVIEW" | "APPROVED";
type BoardRole = "Presidente" | "Secretário" | "Membro" | "Convidado";

interface AgendaItem {
  id: string;
  title: string;
  votable: boolean;
}

interface MeetingSeed {
  id: string;
  title: string;
  type: "Ordinária" | "Extraordinária";
  date: string;
  status: MeetingStatus;
  quorumPercent: number;
  agenda: AgendaItem[];
}

interface Member {
  id: string;
  name: string;
  role: BoardRole;
  mandate: string;
  initials: string;
}

const MEMBERS: Member[] = [
  { id: "m1", name: "Maria Fernandes", role: "Presidente", mandate: "jan 2024 – jan 2027", initials: "MF" },
  { id: "m2", name: "António Nunes", role: "Secretário", mandate: "jan 2024 – jan 2027", initials: "AN" },
  { id: "m3", name: "João Costa", role: "Membro", mandate: "jan 2024 – jan 2027", initials: "JC" },
  { id: "m4", name: "Miguel Rocha", role: "Membro", mandate: "jan 2024 – jan 2027", initials: "MR" },
  { id: "m5", name: "Helena Ferreira", role: "Convidado", mandate: "jan 2024 – jan 2027", initials: "HF" },
];

const MEETINGS_SEED: MeetingSeed[] = [
  {
    id: "r1",
    title: "Reunião Ordinária — Aprovação do Plano de Investimento 2027",
    type: "Ordinária",
    date: "14 ago 2026",
    status: "CONVENED",
    quorumPercent: 51,
    agenda: [
      { id: "a1", title: "Leitura e aprovação da acta anterior", votable: false },
      { id: "a2", title: "Cenário conservador do plano de investimento", votable: true },
      { id: "a3", title: "Revisão do contrato com o fornecedor X", votable: true },
    ],
  },
  {
    id: "r2",
    title: "Reunião Extraordinária — Alteração ao Regulamento Interno",
    type: "Extraordinária",
    date: "3 set 2026",
    status: "DRAFT",
    quorumPercent: 60,
    agenda: [
      { id: "a4", title: "Proposta de alteração ao regulamento interno", votable: true },
    ],
  },
  {
    id: "r3",
    title: "Reunião Ordinária — Relatório Trimestral",
    type: "Ordinária",
    date: "5 jul 2026",
    status: "COMPLETED",
    quorumPercent: 51,
    agenda: [
      { id: "a5", title: "Apresentação do relatório trimestral", votable: false },
      { id: "a6", title: "Envio da acta assinada à CMC", votable: false },
    ],
  },
];

function simpleHash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  return Math.abs(h).toString(16).padStart(8, "0");
}

const STATUS_LABEL: Record<MeetingStatus, { label: string; color: string }> = {
  DRAFT: { label: "Rascunho", color: "text-gray-400 bg-gray-500/10 border-gray-500/30" },
  CONVENED: { label: "Convocada", color: "text-blue-300 bg-blue-500/10 border-blue-500/30" },
  IN_PROGRESS: { label: "Em curso", color: "text-amber-300 bg-amber-500/10 border-amber-500/30" },
  COMPLETED: { label: "Concluída", color: "text-green-300 bg-green-500/10 border-green-500/30" },
  CANCELLED: { label: "Cancelada", color: "text-red-300 bg-red-500/10 border-red-500/30" },
};

const NEXT_STATUS: Partial<Record<MeetingStatus, MeetingStatus>> = {
  DRAFT: "CONVENED",
  CONVENED: "IN_PROGRESS",
};

const MINUTES_LABEL: Record<MinutesStatus, { label: string; color: string }> = {
  DRAFT: { label: "Rascunho", color: "text-gray-400 bg-gray-500/10 border-gray-500/30" },
  UNDER_REVIEW: { label: "Em revisão", color: "text-amber-300 bg-amber-500/10 border-amber-500/30" },
  APPROVED: { label: "Aprovada", color: "text-green-300 bg-green-500/10 border-green-500/30" },
};

const NEXT_MINUTES: Record<MinutesStatus, MinutesStatus> = {
  DRAFT: "UNDER_REVIEW",
  UNDER_REVIEW: "APPROVED",
  APPROVED: "APPROVED",
};

const PRESIDENT_NAV: { key: PresidentView; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { key: "reunioes", label: "Reuniões", icon: <Calendar size={16} /> },
  { key: "votacoes", label: "Votações", icon: <Vote size={16} /> },
  { key: "resolucoes", label: "Resoluções Circulares", icon: <RefreshCw size={16} /> },
  { key: "actas", label: "Actas", icon: <BookOpen size={16} /> },
  { key: "documentos", label: "Documentos", icon: <FileText size={16} /> },
  { key: "accoes", label: "Acções & Seguimentos", icon: <ListChecks size={16} /> },
  { key: "conselho", label: "Conselho", icon: <Users size={16} /> },
  { key: "mandatos", label: "Mandatos", icon: <Award size={16} /> },
  { key: "comites", label: "Comités", icon: <UserCog size={16} /> },
  { key: "conflitos", label: "Conflitos de Interesse", icon: <AlertTriangle size={16} /> },
  { key: "declaracoes", label: "Declarações", icon: <ClipboardList size={16} /> },
  { key: "questionarios", label: "Questionários", icon: <ClipboardList size={16} /> },
  { key: "vdr", label: "Sala de Dados", icon: <Database size={16} /> },
  { key: "registo", label: "Registo & Verificação", icon: <Fingerprint size={16} /> },
  { key: "auditoria", label: "Auditoria", icon: <History size={16} /> },
  { key: "relatorios", label: "Relatórios", icon: <BarChart3 size={16} /> },
  { key: "mensagens", label: "Mensagens", icon: <MessageSquare size={16} /> },
  { key: "assistente", label: "Assistente IA", icon: <Bot size={16} /> },
  { key: "emergencia", label: "Acesso de Emergência", icon: <Siren size={16} /> },
  { key: "auditores", label: "Portal de Auditores", icon: <Eye size={16} /> },
];

const ADMIN_NAV: { key: AdminView; label: string; icon: React.ReactNode }[] = [
  { key: "dashboard", label: "Dashboard Global", icon: <LayoutDashboard size={16} /> },
  { key: "organizacoes", label: "Organizações", icon: <Building2 size={16} /> },
  { key: "utilizadores", label: "Utilizadores", icon: <Users size={16} /> },
  { key: "flags", label: "Feature Flags", icon: <ToggleLeft size={16} /> },
  { key: "auditoria", label: "Auditoria da Plataforma", icon: <History size={16} /> },
  { key: "definicoes", label: "Definições", icon: <Settings size={16} /> },
];

const ORGANIZATIONS = [
  { name: "QA Full Coverage, S.A.", sector: "Seguros", plan: "Professional", users: 8, members: 5, status: "Activo" },
  { name: "Banco Kianda, S.A.", sector: "Banca", plan: "Enterprise", users: 22, members: 7, status: "Activo" },
  { name: "Corretora Sul Atlântico", sector: "Mercado de Capitais", plan: "Trial", users: 4, members: 5, status: "Activo" },
];

const PLATFORM_USERS = [
  { name: "Isabel Pereira", email: "isabel.pereira@qa-full.ao", status: "Activo", org: "QA Full Coverage, S.A." },
  { name: "Miguel Rocha", email: "miguel.rocha@qa-full.ao", status: "Pendente", org: "QA Full Coverage, S.A." },
  { name: "Rita Sousa", email: "rita.sousa@qa-full.ao", status: "Suspenso", org: "QA Full Coverage, S.A." },
  { name: "Carlos Mendes", email: "carlos.mendes@bancokianda.ao", status: "Activo", org: "Banco Kianda, S.A." },
];

const FLAGS = [
  { key: "ai_enabled", name: "Assistente IA", desc: "Geração de rascunhos de actas e resumos de documentos.", on: true },
  { key: "vdr_enabled", name: "Sala de Dados (VDR)", desc: "Repositório confidencial com marca de água dinâmica.", on: true },
  { key: "circular_resolutions", name: "Resoluções Circulares", desc: "Votações assíncronas sem reunião presencial.", on: true },
  { key: "emergency_access", name: "Acesso de Emergência", desc: "Protocolo de crise para Presidente e Secretário.", on: true },
  { key: "auditor_portal", name: "Portal de Auditores", desc: "Acesso temporário para auditores externos.", on: false },
];

interface DocumentItem {
  id: string;
  name: string;
  folder: string;
  version: string;
  size: string;
  updatedAt: string;
}

const DOCUMENTS: DocumentItem[] = [
  { id: "d1", name: "Plano de Investimento 2027.pdf", folder: "Reunião Ordinária #14", version: "v3", size: "2.4 MB", updatedAt: "28 jul 2026" },
  { id: "d2", name: "Contrato Fornecedor X (draft).docx", folder: "Reunião Ordinária #14", version: "v1", size: "340 KB", updatedAt: "27 jul 2026" },
  { id: "d3", name: "Regulamento Interno — proposta.pdf", folder: "Reunião Extraordinária", version: "v2", size: "1.1 MB", updatedAt: "20 jul 2026" },
  { id: "d4", name: "Relatório Trimestral Q2.xlsx", folder: "Comité de Auditoria", version: "v1", size: "890 KB", updatedAt: "12 jul 2026" },
  { id: "d5", name: "Política de Conflitos de Interesse.pdf", folder: "Governança", version: "v4", size: "512 KB", updatedAt: "3 jun 2026" },
];

interface CircularResolution {
  id: string;
  title: string;
  deadline: string;
  status: "ABERTA" | "APROVADA" | "REJEITADA";
}

const CIRCULAR_RESOLUTIONS_SEED: CircularResolution[] = [
  { id: "cr1", title: "Aprovação de abertura de conta bancária adicional", deadline: "5 ago 2026", status: "ABERTA" },
  { id: "cr2", title: "Nomeação de novo membro do Comité de Auditoria", deadline: "18 jul 2026", status: "APROVADA" },
];

interface ActionItem {
  id: string;
  title: string;
  owner: string;
  due: string;
  status: "PENDENTE" | "EM_CURSO" | "CONCLUIDA";
}

const ACTION_ITEMS_SEED: ActionItem[] = [
  { id: "ac1", title: "Rever orçamento do Q2 com a Direcção Financeira", owner: "António Nunes", due: "3 dias", status: "EM_CURSO" },
  { id: "ac2", title: "Assinar acta nº 47", owner: "Maria Fernandes", due: "Hoje", status: "PENDENTE" },
  { id: "ac3", title: "Renovar mandato do Comité de Riscos", owner: "João Costa", due: "Atrasado", status: "PENDENTE" },
  { id: "ac4", title: "Enviar acta assinada à CMC", owner: "António Nunes", due: "concluído", status: "CONCLUIDA" },
];

const REPORTS = [
  { id: "rp1", title: "Relatório de Governança — 2º Trimestre 2026", format: "PDF", generatedAt: "1 jul 2026" },
  { id: "rp2", title: "Mapa de Presenças e Quórum — Ano 2026", format: "XLSX", generatedAt: "15 jun 2026" },
  { id: "rp3", title: "Relatório Regulatório BNA — Semestral", format: "PDF", generatedAt: "30 jun 2026" },
];

interface ConflictDeclaration {
  id: string;
  member: string;
  context: string;
  status: "PENDENTE" | "REGISTADO" | "RESOLVIDO";
}

const CONFLICTS_SEED: ConflictDeclaration[] = [
  { id: "cf1", member: "João Costa", context: "Participação accionista no fornecedor X em discussão no ponto 3 da OT", status: "PENDENTE" },
  { id: "cf2", member: "Helena Ferreira", context: "Relação familiar com candidato a novo membro do Comité de Riscos", status: "REGISTADO" },
];

const MESSAGE_THREADS = [
  { id: "t1", with: "António Nunes (Secretário)", preview: "Já convoquei a reunião extraordinária, falta só confirmares a ordem de trabalhos.", unread: true, time: "09:14" },
  { id: "t2", with: "Comité de Auditoria", preview: "O relatório trimestral está pronto para revisão final.", unread: true, time: "ontem" },
  { id: "t3", with: "Helena Ferreira", preview: "Obrigada pelo acesso à sala de dados, já revi os documentos.", unread: false, time: "seg" },
];

const AI_PROMPTS = [
  { q: "Resume os pontos por decidir da próxima reunião", a: "Há 2 pontos votáveis pendentes: o cenário conservador do plano de investimento 2027 e a revisão do contrato com o fornecedor X. Ambos exigem maioria simples e o quórum actual (60%) já é suficiente para deliberar." },
  { q: "Rascunha a acta da Reunião Ordinária #14", a: "Rascunho gerado: \"Aos 14 dias do mês de agosto de 2026, reuniu-se o Conselho de Administração, com quórum verificado de 60%, tendo deliberado sobre o cenário conservador do plano de investimento 2027...\" — rascunho completo disponível em Actas." },
  { q: "Há algum conflito de interesse por resolver?", a: "Sim — a declaração de João Costa relativa à sua participação accionista no fornecedor X ainda está pendente de registo formal antes da próxima votação sobre esse ponto." },
];

interface VdrDoc {
  id: string;
  name: string;
  room: string;
  confidentiality: "Restrito" | "Confidencial" | "Altamente Confidencial";
  views: number;
}

const VDR_DOCS: VdrDoc[] = [
  { id: "v1", name: "Due Diligence — Aquisição Sul Atlântico.pdf", room: "Projecto Atlântico", confidentiality: "Altamente Confidencial", views: 6 },
  { id: "v2", name: "Demonstrações Financeiras Auditadas 2025.pdf", room: "Auditoria Externa", confidentiality: "Confidencial", views: 14 },
  { id: "v3", name: "Actas do Conselho — Arquivo Histórico", room: "Governança", confidentiality: "Restrito", views: 22 },
];

const QUESTIONNAIRES = [
  { id: "q1", title: "Questionário Anual de Independência dos Administradores", target: "Todos os membros", due: "10 ago 2026", status: "POR_RESPONDER" as const },
  { id: "q2", title: "Auto-avaliação do Conselho 2026", target: "Todos os membros", due: "1 set 2026", status: "POR_RESPONDER" as const },
  { id: "q3", title: "Declaração de Conflitos — Ciclo Semestral", target: "Presidente, Secretário", due: "concluído", status: "RESPONDIDO" as const },
];

const REGISTRY_LOG = [
  { id: "rg1", actor: "Maria Fernandes", action: "Assinou a acta nº 47", time: "31 jul 2026, 09:02" },
  { id: "rg2", actor: "António Nunes", action: "Convocou a Reunião Extraordinária", time: "29 jul 2026, 16:40" },
  { id: "rg3", actor: "Sistema", action: "Verificação de integridade das votações — sem anomalias", time: "28 jul 2026, 23:00" },
  { id: "rg4", actor: "Helena Ferreira", action: "Acedeu à Sala de Dados — Projecto Atlântico", time: "28 jul 2026, 11:15" },
];

const COMMITTEES = [
  { id: "c1", name: "Comité de Auditoria", chair: "António Nunes", members: 3, nextMeeting: "12 ago 2026" },
  { id: "c2", name: "Comité de Riscos", chair: "João Costa", members: 4, nextMeeting: "20 ago 2026" },
  { id: "c3", name: "Comité de Nomeações e Remunerações", chair: "Maria Fernandes", members: 3, nextMeeting: "por agendar" },
];

const DECLARATIONS = [
  { id: "dc1", title: "Declaração Anual de Independência", member: "Maria Fernandes", status: "Submetida", date: "15 jan 2026" },
  { id: "dc2", title: "Declaração Anual de Independência", member: "Miguel Rocha", status: "Pendente", date: "—" },
  { id: "dc3", title: "Declaração de Conflitos de Interesse", member: "João Costa", status: "Submetida", date: "3 mar 2026" },
];

const AUDITORS_PORTAL = [
  { id: "au1", name: "PKF Angola — Auditoria Externa", access: "Demonstrações financeiras, actas 2025-2026", expires: "31 dez 2026" },
  { id: "au2", name: "BNA — Inspecção de Conformidade", access: "Registo de votações, declarações de conflito", expires: "acesso pontual" },
];

const PLATFORM_AUDIT_LOG = [
  { id: "pa1", actor: "SuperAdmin", action: "Activou o feature flag ai_enabled para QA Full Coverage, S.A.", time: "30 jul 2026, 18:22" },
  { id: "pa2", actor: "Sistema", action: "Backup encriptado da base de dados concluído", time: "31 jul 2026, 03:00" },
  { id: "pa3", actor: "SuperAdmin", action: "Suspendeu utilizador rita.sousa@qa-full.ao por inactividade", time: "26 jul 2026, 10:05" },
];

export default function BoardGovDemo() {
  const [perspective, setPerspective] = useState<Perspective>("president");
  const [presView, setPresView] = useState<PresidentView>("dashboard");
  const [adminView, setAdminView] = useState<AdminView>("dashboard");

  const [meetings, setMeetings] = useState<MeetingSeed[]>(MEETINGS_SEED);
  const [selectedMeetingId, setSelectedMeetingId] = useState(MEETINGS_SEED[0].id);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({
    m1: true,
    m2: true,
    m3: true,
    m4: false,
    m5: false,
  });

  const [minutes, setMinutes] = useState<Record<string, MinutesStatus>>({
    r1: "DRAFT",
    r2: "DRAFT",
    r3: "UNDER_REVIEW",
  });

  const [selectedAgendaId, setSelectedAgendaId] = useState<string | null>(null);
  const [ballots, setBallots] = useState<Record<string, "A_FAVOR" | "CONTRA" | "ABSTENCAO">>({});
  const [voteClosed, setVoteClosed] = useState(false);

  const [flags, setFlags] = useState(FLAGS);

  const [circularResolutions, setCircularResolutions] = useState<CircularResolution[]>(CIRCULAR_RESOLUTIONS_SEED);
  const [circularVote, setCircularVote] = useState<Record<string, "A_FAVOR" | "CONTRA">>({ cr2: "A_FAVOR" });

  const [actionItems, setActionItems] = useState<ActionItem[]>(ACTION_ITEMS_SEED);

  const [conflicts, setConflicts] = useState<ConflictDeclaration[]>(CONFLICTS_SEED);

  const [selectedThreadId, setSelectedThreadId] = useState(MESSAGE_THREADS[0].id);

  const [aiHistory, setAiHistory] = useState<{ q: string; a: string }[]>([]);

  const [questionnaires, setQuestionnaires] = useState(QUESTIONNAIRES);

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId) ?? meetings[0];

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const quorumAchievedPercent = Math.round((presentCount / MEMBERS.length) * 100);
  const quorumOk = quorumAchievedPercent >= selectedMeeting.quorumPercent;

  const selectedAgendaItem = useMemo(
    () => selectedMeeting.agenda.find((a) => a.id === selectedAgendaId) ?? null,
    [selectedMeeting, selectedAgendaId]
  );

  function startMeeting(id: string) {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id && NEXT_STATUS[m.status] ? { ...m, status: NEXT_STATUS[m.status]! } : m))
    );
  }

  function castBallot(memberId: string, value: "A_FAVOR" | "CONTRA" | "ABSTENCAO") {
    if (voteClosed) return;
    setBallots((prev) => ({ ...prev, [memberId]: value }));
  }

  function closeVote() {
    setVoteClosed(true);
  }

  function resetVote() {
    setBallots({});
    setVoteClosed(false);
  }

  function selectAgenda(id: string) {
    setSelectedAgendaId(id);
    setBallots({});
    setVoteClosed(false);
  }

  function advanceMinutes(id: string) {
    setMinutes((prev) => ({ ...prev, [id]: NEXT_MINUTES[prev[id]] }));
  }

  function toggleFlag(key: string) {
    setFlags((prev) => prev.map((f) => (f.key === key ? { ...f, on: !f.on } : f)));
  }

  function castCircularVote(id: string, value: "A_FAVOR" | "CONTRA") {
    setCircularVote((prev) => ({ ...prev, [id]: value }));
  }

  function closeCircularResolution(id: string) {
    setCircularResolutions((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: circularVote[id] === "CONTRA" ? "REJEITADA" : "APROVADA" } : r))
    );
  }

  function cycleActionStatus(id: string) {
    const order: ActionItem["status"][] = ["PENDENTE", "EM_CURSO", "CONCLUIDA"];
    setActionItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: order[(order.indexOf(a.status) + 1) % order.length] } : a))
    );
  }

  function resolveConflict(id: string) {
    setConflicts((prev) => prev.map((c) => (c.id === id ? { ...c, status: "RESOLVIDO" } : c)));
  }

  function askAssistant(prompt: { q: string; a: string }) {
    setAiHistory((prev) => [...prev, prompt]);
  }

  function answerQuestionnaire(id: string) {
    setQuestionnaires((prev) => prev.map((q) => (q.id === id ? { ...q, status: "RESPONDIDO" } : q)));
  }

  const favor = Object.values(ballots).filter((v) => v === "A_FAVOR").length;
  const contra = Object.values(ballots).filter((v) => v === "CONTRA").length;
  const abst = Object.values(ballots).filter((v) => v === "ABSTENCAO").length;
  const resultPassed = favor > contra;

  const currentPath =
    perspective === "president"
      ? `app.boardgov.ao/${presView === "dashboard" ? "" : presView}`
      : `admin.boardgov.ao/${adminView === "dashboard" ? "" : adminView}`;

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 overflow-hidden">
      <div className="flex items-start gap-3 p-4 bg-blue-500/10 border-b border-blue-500/20">
        <Info size={18} className="text-blue-400 mt-0.5 shrink-0" />
        <p className="text-blue-200 text-sm leading-relaxed">
          Simulação a correr apenas no seu browser — os membros, reuniões e votos são fictícios e o
          estado vive só nesta página. Esta demo reconstrói os dois painéis reais do BoardGov AO: a
          área de trabalho do Presidente/Secretário e o painel de super administração da plataforma.
        </p>
      </div>

      {/* perspective switch */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-950 border-b border-gray-800">
        <button
          onClick={() => setPerspective("president")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
            perspective === "president"
              ? "bg-gradient-to-r from-yellow-400 to-amber-600 text-gray-950"
              : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
          }`}
        >
          <ShieldCheck size={14} className="inline mr-1 -mt-0.5" />
          Vista Presidente
        </button>
        <button
          onClick={() => setPerspective("admin")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
            perspective === "admin"
              ? "bg-gradient-to-r from-yellow-400 to-amber-600 text-gray-950"
              : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
          }`}
        >
          <ShieldAlert size={14} className="inline mr-1 -mt-0.5" />
          Vista Super Admin
        </button>
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
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shrink-0 text-gray-950 font-bold text-xs">
              BG
            </div>
            <span className="font-bold text-sm text-white">BoardGov</span>
          </div>
          {(perspective === "president" ? PRESIDENT_NAV : ADMIN_NAV).map((item) => (
            <button
              key={item.key}
              onClick={() =>
                perspective === "president"
                  ? setPresView(item.key as PresidentView)
                  : setAdminView(item.key as AdminView)
              }
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                (perspective === "president" ? presView : adminView) === item.key
                  ? "bg-gradient-to-r from-yellow-400/20 to-amber-600/20 text-yellow-300"
                  : "text-gray-400 hover:text-white hover:bg-gray-900/60"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* main content */}
        <div className="p-5 sm:p-6 min-h-[520px]">
          {perspective === "president" && presView === "dashboard" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Visão geral da governança</h4>
                <p className="text-sm text-gray-500">Angola · Plataforma de Governança Corporativa</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard label="Reuniões realizadas" value="2/7" color="text-yellow-400" />
                <StatCard label="Taxa de presença" value="30%" trend="+3%" color="text-green-400" />
                <StatCard label="Deliberações pendentes" value="2" color="text-amber-400" />
                <StatCard label="Votações em aberto" value="1" color="text-blue-400" />
                <StatCard label="Actas por aprovar" value={String(Object.values(minutes).filter((s) => s !== "APPROVED").length)} color="text-purple-400" />
                <StatCard label="Quórum atingido" value={`${quorumAchievedPercent}%`} sub={quorumOk ? "acima do exigido" : "abaixo do exigido"} color={quorumOk ? "text-green-400" : "text-red-400"} />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Reuniões recentes</h5>
                <div className="space-y-2">
                  {meetings.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMeetingId(m.id);
                        setPresView("reunioes");
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-950/60 border border-gray-800 text-sm hover:border-yellow-400/40 transition-colors text-left"
                    >
                      <div>
                        <p className="text-gray-200">{m.title}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{m.type} · {m.date}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_LABEL[m.status].color}`}>
                        {STATUS_LABEL[m.status].label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {perspective === "president" && presView === "reunioes" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Reuniões</h4>
                <p className="text-sm text-gray-500">Convocatória, quórum e ordem de trabalhos</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {meetings.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMeetingId(m.id)}
                    className={`px-3 py-2 rounded-lg text-xs sm:text-sm text-left border transition-colors ${
                      selectedMeetingId === m.id
                        ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-200"
                        : "border-gray-800 bg-gray-950/40 text-gray-400 hover:text-white"
                    }`}
                  >
                    {m.title.length > 34 ? m.title.slice(0, 34) + "…" : m.title}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-gray-950/60 border border-gray-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{selectedMeeting.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedMeeting.type} · {selectedMeeting.date} · quórum exigido {selectedMeeting.quorumPercent}%</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border shrink-0 ${STATUS_LABEL[selectedMeeting.status].color}`}>
                    {STATUS_LABEL[selectedMeeting.status].label}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Presenças (simular quórum)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {MEMBERS.map((mem) => (
                      <label
                        key={mem.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-800 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={attendance[mem.id]}
                          onChange={() => setAttendance((p) => ({ ...p, [mem.id]: !p[mem.id] }))}
                          className="accent-yellow-400"
                        />
                        <span className="text-gray-300">{mem.name}</span>
                        <span className="text-gray-500 text-xs ml-auto">{mem.role}</span>
                      </label>
                    ))}
                  </div>
                  <p className={`text-xs mt-2 ${quorumOk ? "text-green-400" : "text-amber-400"}`}>
                    {presentCount}/{MEMBERS.length} presentes · {quorumAchievedPercent}% {quorumOk ? "— quórum atingido" : "— quórum ainda não atingido"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Ordem de trabalhos</p>
                  <div className="space-y-1.5">
                    {selectedMeeting.agenda.map((a) => (
                      <div key={a.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-800 text-sm">
                        <span className="text-gray-300">{a.title}</span>
                        {a.votable && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-300 border border-yellow-400/30">votável</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {NEXT_STATUS[selectedMeeting.status] && (
                  <button
                    onClick={() => startMeeting(selectedMeeting.id)}
                    disabled={selectedMeeting.status === "CONVENED" && !quorumOk}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-600 text-gray-950 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <PlayCircle size={16} />
                    {selectedMeeting.status === "DRAFT" ? "Convocar reunião" : "Iniciar reunião"}
                  </button>
                )}
                {selectedMeeting.status === "CONVENED" && !quorumOk && (
                  <p className="text-xs text-amber-400">Marque presenças suficientes para atingir o quórum exigido antes de iniciar.</p>
                )}
              </div>
            </div>
          )}

          {perspective === "president" && presView === "votacoes" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Votações</h4>
                <p className="text-sm text-gray-500">Votação em tempo real com hash de integridade por voto</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Escolha um ponto votável de &quot;{selectedMeeting.title.slice(0, 40)}…&quot;</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMeeting.agenda.filter((a) => a.votable).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => selectAgenda(a.id)}
                      className={`px-3 py-2 rounded-lg text-xs sm:text-sm border transition-colors ${
                        selectedAgendaId === a.id
                          ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-200"
                          : "border-gray-800 bg-gray-950/40 text-gray-400 hover:text-white"
                      }`}
                    >
                      {a.title}
                    </button>
                  ))}
                  {selectedMeeting.agenda.filter((a) => a.votable).length === 0 && (
                    <p className="text-sm text-gray-500">Esta reunião não tem pontos votáveis. Escolha outra em &quot;Reuniões&quot;.</p>
                  )}
                </div>
              </div>

              {selectedAgendaItem && (
                <div className="p-4 sm:p-5 rounded-xl bg-gray-950/60 border border-gray-800 space-y-4">
                  <p className="font-semibold text-sm">{selectedAgendaItem.title}</p>

                  <div className="space-y-2">
                    {MEMBERS.map((mem) => {
                      const value = ballots[mem.id];
                      return (
                        <div key={mem.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-900/60 border border-gray-800 text-sm">
                          <span className="text-gray-300">{mem.name}</span>
                          <div className="flex gap-1.5">
                            {(["A_FAVOR", "CONTRA", "ABSTENCAO"] as const).map((v) => (
                              <button
                                key={v}
                                onClick={() => castBallot(mem.id, v)}
                                disabled={voteClosed}
                                className={`text-[11px] px-2 py-1 rounded-md border transition-colors disabled:opacity-40 ${
                                  value === v
                                    ? v === "A_FAVOR"
                                      ? "bg-green-500/20 border-green-500/40 text-green-300"
                                      : v === "CONTRA"
                                      ? "bg-red-500/20 border-red-500/40 text-red-300"
                                      : "bg-gray-500/20 border-gray-500/40 text-gray-300"
                                    : "border-gray-700 text-gray-500 hover:text-white"
                                }`}
                              >
                                {v === "A_FAVOR" ? "A favor" : v === "CONTRA" ? "Contra" : "Abstenção"}
                              </button>
                            ))}
                          </div>
                          {value && voteClosed && (
                            <span className="text-[10px] font-mono text-gray-600 w-full sm:w-auto">
                              hash {simpleHash(selectedAgendaItem.id + mem.id + value)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {!voteClosed ? (
                      <button
                        onClick={closeVote}
                        disabled={Object.keys(ballots).length === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-600 text-gray-950 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Vote size={16} />
                        Fechar votação
                      </button>
                    ) : (
                      <>
                        <span className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full border ${resultPassed ? "text-green-300 bg-green-500/10 border-green-500/30" : "text-red-300 bg-red-500/10 border-red-500/30"}`}>
                          {resultPassed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                          {resultPassed ? "Deliberação aprovada" : "Deliberação rejeitada"}
                        </span>
                        <span className="text-xs text-gray-500">{favor} a favor · {contra} contra · {abst} abstenção(ões) — votação fechada e imutável</span>
                        <button onClick={resetVote} className="text-xs text-gray-500 hover:text-white underline underline-offset-2">
                          reiniciar simulação
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {perspective === "president" && presView === "actas" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Actas</h4>
                <p className="text-sm text-gray-500">Redacção, revisão e aprovação — Lei 1/04</p>
              </div>
              <div className="space-y-2">
                {meetings.map((m) => (
                  <div key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800">
                    <div>
                      <p className="text-sm text-gray-200">Acta — {m.title.slice(0, 46)}{m.title.length > 46 ? "…" : ""}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{m.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${MINUTES_LABEL[minutes[m.id]].color}`}>
                        {MINUTES_LABEL[minutes[m.id]].label}
                      </span>
                      {minutes[m.id] !== "APPROVED" && (
                        <button
                          onClick={() => advanceMinutes(m.id)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-400/20"
                        >
                          {minutes[m.id] === "DRAFT" ? "Submeter para revisão" : "Aprovar acta"}
                          <ChevronRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600">Uma acta aprovada torna-se imutável — deixa de poder ser editada nesta simulação, tal como na plataforma real.</p>
            </div>
          )}

          {perspective === "president" && presView === "conselho" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Conselho de Administração</h4>
                <p className="text-sm text-gray-500">Membros, mandatos e papéis</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MEMBERS.map((mem) => (
                  <div key={mem.id} className="p-4 rounded-xl bg-gray-950/60 border border-gray-800">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-xs font-semibold text-gray-300 shrink-0">
                        {mem.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-200">{mem.name}</p>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-300 border border-yellow-400/30">{mem.role}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Mandato: {mem.mandate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "president" && presView === "documentos" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Documentos</h4>
                <p className="text-sm text-gray-500">Repositório versionado, organizado por reunião e tema</p>
              </div>
              <div className="space-y-2">
                {DOCUMENTS.map((d) => (
                  <div key={d.id} className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={16} className="text-gray-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-200 truncate">{d.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{d.folder} · {d.size} · actualizado {d.updatedAt}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 shrink-0">{d.version}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "president" && presView === "resolucoes" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Resoluções Circulares</h4>
                <p className="text-sm text-gray-500">Deliberações assíncronas, sem reunião presencial</p>
              </div>
              <div className="space-y-3">
                {circularResolutions.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-200">{r.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
                        r.status === "APROVADA" ? "text-green-300 bg-green-500/10 border-green-500/30" :
                        r.status === "REJEITADA" ? "text-red-300 bg-red-500/10 border-red-500/30" :
                        "text-blue-300 bg-blue-500/10 border-blue-500/30"
                      }`}>
                        {r.status === "ABERTA" ? `Aberta até ${r.deadline}` : r.status === "APROVADA" ? "Aprovada" : "Rejeitada"}
                      </span>
                    </div>
                    {r.status === "ABERTA" && (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => castCircularVote(r.id, "A_FAVOR")}
                          className={`text-xs px-3 py-1.5 rounded-md border ${circularVote[r.id] === "A_FAVOR" ? "bg-green-500/20 border-green-500/40 text-green-300" : "border-gray-700 text-gray-400 hover:text-white"}`}
                        >
                          A favor
                        </button>
                        <button
                          onClick={() => castCircularVote(r.id, "CONTRA")}
                          className={`text-xs px-3 py-1.5 rounded-md border ${circularVote[r.id] === "CONTRA" ? "bg-red-500/20 border-red-500/40 text-red-300" : "border-gray-700 text-gray-400 hover:text-white"}`}
                        >
                          Contra
                        </button>
                        <button
                          onClick={() => closeCircularResolution(r.id)}
                          disabled={!circularVote[r.id]}
                          className="text-xs px-3 py-1.5 rounded-md bg-gradient-to-r from-yellow-400 to-amber-600 text-gray-950 font-semibold disabled:opacity-40"
                        >
                          Fechar deliberação
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "president" && presView === "accoes" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Acções & Seguimentos</h4>
                <p className="text-sm text-gray-500">Tarefas resultantes de deliberações do Conselho</p>
              </div>
              <div className="space-y-2">
                {actionItems.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => cycleActionStatus(a.id)}
                    className="w-full flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800 text-left hover:border-yellow-400/30 transition-colors"
                  >
                    <div>
                      <p className="text-sm text-gray-200">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.owner} · prazo: {a.due}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
                      a.status === "CONCLUIDA" ? "text-green-300 bg-green-500/10 border-green-500/30" :
                      a.status === "EM_CURSO" ? "text-amber-300 bg-amber-500/10 border-amber-500/30" :
                      "text-gray-400 bg-gray-500/10 border-gray-500/30"
                    }`}>
                      {a.status === "CONCLUIDA" ? "Concluída" : a.status === "EM_CURSO" ? "Em curso" : "Pendente"}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-600">Clique numa tarefa para avançar o estado — Pendente → Em curso → Concluída.</p>
            </div>
          )}

          {perspective === "president" && presView === "mandatos" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Mandatos</h4>
                <p className="text-sm text-gray-500">Vigência, renovação e alertas de expiração</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MEMBERS.map((mem) => (
                  <div key={mem.id} className="p-4 rounded-xl bg-gray-950/60 border border-gray-800">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-200">{mem.name}</p>
                      <Award size={14} className="text-yellow-400 shrink-0" />
                    </div>
                    <p className="text-xs text-gray-500">{mem.role} · {mem.mandate}</p>
                    <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/30">Activo</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "president" && presView === "comites" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Comités</h4>
                <p className="text-sm text-gray-500">Comités especializados do Conselho</p>
              </div>
              <div className="space-y-2">
                {COMMITTEES.map((c) => (
                  <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800">
                    <div>
                      <p className="text-sm text-gray-200">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Presidido por {c.chair} · {c.members} membros · próxima reunião: {c.nextMeeting}</p>
                    </div>
                    <UserCog size={16} className="text-gray-600 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "president" && presView === "conflitos" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Conflitos de Interesse</h4>
                <p className="text-sm text-gray-500">Registo e resolução de declarações de conflito</p>
              </div>
              <div className="space-y-2">
                {conflicts.map((c) => (
                  <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-200">{c.member}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{c.context}</p>
                      </div>
                    </div>
                    {c.status !== "RESOLVIDO" ? (
                      <button
                        onClick={() => resolveConflict(c.id)}
                        className="text-xs px-2.5 py-1 rounded-md bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-400/20 shrink-0"
                      >
                        Marcar como resolvido
                      </button>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/30 shrink-0">Resolvido</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "president" && presView === "declaracoes" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Declarações</h4>
                <p className="text-sm text-gray-500">Declarações anuais de independência e conflitos</p>
              </div>
              <div className="space-y-2">
                {DECLARATIONS.map((d) => (
                  <div key={d.id} className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800">
                    <div>
                      <p className="text-sm text-gray-200">{d.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{d.member} · {d.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${d.status === "Submetida" ? "text-green-300 bg-green-500/10 border-green-500/30" : "text-amber-300 bg-amber-500/10 border-amber-500/30"}`}>
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "president" && presView === "questionarios" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Questionários</h4>
                <p className="text-sm text-gray-500">Inquéritos de conformidade dirigidos aos membros</p>
              </div>
              <div className="space-y-2">
                {questionnaires.map((q) => (
                  <div key={q.id} className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800">
                    <div>
                      <p className="text-sm text-gray-200">{q.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{q.target} · prazo: {q.due}</p>
                    </div>
                    {q.status === "POR_RESPONDER" ? (
                      <button
                        onClick={() => answerQuestionnaire(q.id)}
                        className="text-xs px-2.5 py-1 rounded-md bg-yellow-400/10 text-yellow-300 border border-yellow-400/30 hover:bg-yellow-400/20 shrink-0"
                      >
                        Responder
                      </button>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/30 shrink-0">Respondido</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "president" && presView === "vdr" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Sala de Dados Virtual</h4>
                <p className="text-sm text-gray-500">Repositório confidencial com marca de água dinâmica por utilizador</p>
              </div>
              <div className="space-y-2">
                {VDR_DOCS.map((v) => (
                  <div key={v.id} className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800">
                    <div className="flex items-center gap-3">
                      <Database size={16} className="text-gray-500 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-200">{v.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Sala: {v.room} · {v.views} visualizações registadas</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
                      v.confidentiality === "Altamente Confidencial" ? "text-red-300 bg-red-500/10 border-red-500/30" :
                      v.confidentiality === "Confidencial" ? "text-amber-300 bg-amber-500/10 border-amber-500/30" :
                      "text-gray-400 bg-gray-500/10 border-gray-500/30"
                    }`}>
                      {v.confidentiality}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600">Cada visualização e download fica marcado com o nome e a hora do utilizador, sobreposto ao documento.</p>
            </div>
          )}

          {perspective === "president" && presView === "registo" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Registo & Verificação</h4>
                <p className="text-sm text-gray-500">Trilho imutável de todas as acções relevantes</p>
              </div>
              <div className="space-y-2">
                {REGISTRY_LOG.map((r) => (
                  <div key={r.id} className="flex items-start gap-3 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800">
                    <Fingerprint size={16} className="text-gray-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-200">{r.actor} — {r.action}</p>
                      <p className="text-xs text-gray-600 mt-0.5 font-mono">{r.time} · hash {simpleHash(r.id + r.action)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "president" && presView === "auditoria" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Auditoria</h4>
                <p className="text-sm text-gray-500">Histórico completo de eventos para efeitos de conformidade</p>
              </div>
              <div className="space-y-2">
                {[...REGISTRY_LOG].reverse().map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
                    <span className="text-gray-300">{r.actor}: {r.action}</span>
                    <span className="text-xs text-gray-600 shrink-0">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "president" && presView === "relatorios" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Relatórios</h4>
                <p className="text-sm text-gray-500">Relatórios de governança e regulatórios, prontos a exportar</p>
              </div>
              <div className="space-y-2">
                {REPORTS.map((r) => (
                  <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800">
                    <div className="flex items-center gap-3">
                      <BarChart3 size={16} className="text-gray-500 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-200">{r.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Gerado em {r.generatedAt}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 shrink-0">{r.format}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "president" && presView === "mensagens" && (
            <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-4">
              <div className="space-y-1.5">
                {MESSAGE_THREADS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedThreadId(t.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedThreadId === t.id ? "border-yellow-400/40 bg-yellow-400/10" : "border-gray-800 bg-gray-950/60 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-gray-200 truncate">{t.with}</p>
                      {t.unread && <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{t.preview}</p>
                  </button>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-gray-950/60 border border-gray-800 min-h-[200px] flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-200 mb-2">
                    {MESSAGE_THREADS.find((t) => t.id === selectedThreadId)?.with}
                  </p>
                  <div className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 text-sm text-gray-300">
                    {MESSAGE_THREADS.find((t) => t.id === selectedThreadId)?.preview}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm text-gray-600">Escrever mensagem…</div>
                  <button className="p-2 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-600 text-gray-950 shrink-0">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {perspective === "president" && presView === "assistente" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Assistente IA</h4>
                <p className="text-sm text-gray-500">Rascunhos de actas, resumos e respostas sobre o Conselho</p>
              </div>
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                {aiHistory.length === 0 && (
                  <p className="text-sm text-gray-600">Escolha uma pergunta abaixo para ver o Assistente IA em acção.</p>
                )}
                {aiHistory.map((h, i) => (
                  <div key={i} className="space-y-2">
                    <div className="ml-auto max-w-[85%] p-2.5 rounded-lg bg-yellow-400/10 border border-yellow-400/30 text-sm text-yellow-100">{h.q}</div>
                    <div className="flex items-start gap-2 max-w-[90%]">
                      <Bot size={16} className="text-gray-500 shrink-0 mt-1" />
                      <div className="p-2.5 rounded-lg bg-gray-900/60 border border-gray-800 text-sm text-gray-300">{h.a}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {AI_PROMPTS.map((p) => (
                  <button
                    key={p.q}
                    onClick={() => askAssistant(p)}
                    className="text-xs px-3 py-2 rounded-lg border border-gray-800 bg-gray-950/40 text-gray-400 hover:text-white hover:border-yellow-400/30 transition-colors"
                  >
                    {p.q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {perspective === "president" && presView === "emergencia" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Acesso de Emergência</h4>
                <p className="text-sm text-gray-500">Protocolo de crise para Presidente e Secretário</p>
              </div>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                <Siren size={18} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">
                  Em caso de indisponibilidade dos administradores para verificação normal (2FA), este protocolo permite
                  ao Presidente e ao Secretário obter acesso de emergência com registo obrigatório na auditoria e
                  notificação automática a todos os membros do Conselho.
                </p>
              </div>
              <button className="text-xs px-4 py-2 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10">
                Iniciar protocolo de emergência (simulação)
              </button>
            </div>
          )}

          {perspective === "president" && presView === "auditores" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Portal de Auditores</h4>
                <p className="text-sm text-gray-500">Acesso temporário e limitado para auditores externos</p>
              </div>
              <div className="space-y-2">
                {AUDITORS_PORTAL.map((a) => (
                  <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800">
                    <div>
                      <p className="text-sm text-gray-200">{a.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Acesso a: {a.access}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 shrink-0">expira {a.expires}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "admin" && adminView === "dashboard" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Dashboard Global</h4>
                <p className="text-sm text-gray-500">Visão em tempo real de toda a plataforma</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard label="Organizações" value={String(ORGANIZATIONS.length)} sub="100% activas" color="text-yellow-400" />
                <StatCard label="Utilizadores" value={String(PLATFORM_USERS.length)} sub="da plataforma" color="text-blue-400" />
                <StatCard label="Reuniões (mês)" value={String(meetings.length)} color="text-purple-400" />
                <StatCard label="Erros não resolvidos" value="0" color="text-green-400" />
                <StatCard label="Admins activos" value="4" color="text-cyan-400" />
                <StatCard label="Fila de webhooks" value="activa" color="text-amber-400" />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Organizações por sector</h5>
                <div className="space-y-2">
                  {ORGANIZATIONS.map((o) => (
                    <div key={o.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
                      <div>
                        <p className="text-gray-200">{o.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{o.sector} · plano {o.plan}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-300">{o.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {perspective === "admin" && adminView === "organizacoes" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Organizações</h4>
                <p className="text-sm text-gray-500">Gestão multi-tenant de organizações</p>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-800">
                <table className="w-full text-sm">
                  <thead className="bg-gray-950/60 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-medium">Organização</th>
                      <th className="text-left px-4 py-2.5 font-medium">Sector</th>
                      <th className="text-left px-4 py-2.5 font-medium">Plano</th>
                      <th className="text-left px-4 py-2.5 font-medium">Utilizadores</th>
                      <th className="text-left px-4 py-2.5 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ORGANIZATIONS.map((o) => (
                      <tr key={o.name} className="border-t border-gray-800">
                        <td className="px-4 py-3 text-gray-200">{o.name}</td>
                        <td className="px-4 py-3 text-gray-400">{o.sector}</td>
                        <td className="px-4 py-3 text-gray-400">{o.plan}</td>
                        <td className="px-4 py-3 text-gray-400">{o.users}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-300">{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {perspective === "admin" && adminView === "utilizadores" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Utilizadores</h4>
                <p className="text-sm text-gray-500">Gestão de utilizadores da plataforma</p>
              </div>
              <div className="space-y-2">
                {PLATFORM_USERS.map((u) => (
                  <div key={u.email} className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
                    <div>
                      <p className="text-gray-200">{u.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{u.email} · {u.org}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        u.status === "Activo"
                          ? "text-green-300 bg-green-500/10 border-green-500/30"
                          : u.status === "Pendente"
                          ? "text-amber-300 bg-amber-500/10 border-amber-500/30"
                          : "text-red-300 bg-red-500/10 border-red-500/30"
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "admin" && adminView === "flags" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Feature Flags</h4>
                <p className="text-sm text-gray-500">Activar ou desactivar módulos globalmente</p>
              </div>
              <div className="space-y-2">
                {flags.map((f) => (
                  <div key={f.key} className="flex items-center justify-between gap-3 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-200 flex items-center gap-2">
                        {f.name}
                        <span className="text-[10px] font-mono text-gray-600">{f.key}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleFlag(f.key)}
                      className={`shrink-0 flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                        f.on
                          ? "bg-green-500/15 text-green-300 border-green-500/30"
                          : "bg-gray-800 text-gray-400 border-gray-700"
                      }`}
                    >
                      <Clock size={12} className={f.on ? "hidden" : "inline"} />
                      {f.on ? "Activo" : "Inactivo"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {perspective === "admin" && adminView === "auditoria" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Auditoria da Plataforma</h4>
                <p className="text-sm text-gray-500">Eventos globais, cross-tenant, para efeitos de segurança</p>
              </div>
              <div className="space-y-2">
                {PLATFORM_AUDIT_LOG.map((p) => (
                  <div key={p.id} className="flex items-start gap-3 p-3.5 rounded-lg bg-gray-950/60 border border-gray-800">
                    <History size={16} className="text-gray-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-200">{p.actor}: {p.action}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{p.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {perspective === "admin" && adminView === "definicoes" && (
            <div className="space-y-5">
              <div>
                <h4 className="font-semibold text-lg">Definições</h4>
                <p className="text-sm text-gray-500">Configuração global da plataforma</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3.5 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
                  <span className="text-gray-300">Autenticação obrigatória com 2FA</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-300">Activa</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
                  <span className="text-gray-300">Expiração automática de sessão</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-300">30 minutos</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
                  <span className="text-gray-300">Idioma por omissão</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">Português</span>
                </div>
                <div className="flex items-center justify-between p-3.5 rounded-lg bg-gray-950/60 border border-gray-800 text-sm">
                  <span className="text-gray-300">Sincronização com calendário externo</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-300">Activa</span>
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