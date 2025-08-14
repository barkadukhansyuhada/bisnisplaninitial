import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import * as XLSX from "xlsx";
import {
  CheckCircle2,
  Circle,
  AlertTriangle,
  Upload,
  Download,
  Filter,
  Search,
  FileText,
  Layers3,
  MapPin,
  Factory,
  Pickaxe,
  Truck,
  Scale,
  BarChart3,
  Link as LinkIcon,
  List,
  Grid3X3,
  CalendarDays,
  UserCircle2,
  Paperclip,
  Sparkles,
  Star,
  Trash2,
  Bug,
  Check,
  X,
  Link2,
} from "lucide-react";

/**
 * INTERACTIVE DASHBOARD – Data Room & Readiness for Business Plan (Galian C)
 *
 * Fix: SyntaxError from unterminated string in exportCSV (join("\n")).
 * Added: Source Links panel to attach **Google Drive** URLs and auto‑apply to items.
 */

// Palet warna (soft-modern)
const COLORS = {
  primary: "#2563EB", // blue-600
  secondary: "#06B6D4", // cyan-500
  accent: "#8B5CF6", // violet-500
  success: "#10B981", // emerald-500
  warning: "#F59E0B", // amber-500
  muted: "#94A3B8", // slate-400
};

const DOMAIN_COLORS: Record<string, { dot: string; ring: string; fill?: string }> = {
  geology: { dot: "bg-sky-500", ring: "ring-sky-200", fill: "#0EA5E9" },
  qc: { dot: "bg-emerald-500", ring: "ring-emerald-200", fill: "#10B981" },
  mine: { dot: "bg-amber-500", ring: "ring-amber-200", fill: "#F59E0B" },
  plant: { dot: "bg-indigo-500", ring: "ring-indigo-200", fill: "#6366F1" },
  ops: { dot: "bg-slate-500", ring: "ring-slate-200", fill: "#64748B" },
  market: { dot: "bg-pink-500", ring: "ring-pink-200", fill: "#EC4899" },
  finance: { dot: "bg-violet-500", ring: "ring-violet-200", fill: "#8B5CF6" },
  permits: { dot: "bg-lime-600", ring: "ring-lime-200", fill: "#65A30D" },
  governance: { dot: "bg-cyan-500", ring: "ring-cyan-200", fill: "#06B6D4" },
};

const DOMAINS = [
  { id: "geology", label: "Geologi & Eksplorasi", icon: <Layers3 className="w-4 h-4" /> },
  { id: "qc", label: "QC & Lab", icon: <Scale className="w-4 h-4" /> },
  { id: "mine", label: "Desain Tambang & Peledakan", icon: <Pickaxe className="w-4 h-4" /> },
  { id: "plant", label: "Pabrik & Utilitas", icon: <Factory className="w-4 h-4" /> },
  { id: "ops", label: "Fleet & Operasi", icon: <Truck className="w-4 h-4" /> },
  { id: "market", label: "Pasar & Logistik", icon: <MapPin className="w-4 h-4" /> },
  { id: "finance", label: "Keuangan & Kontrak", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "permits", label: "Perizinan & Lingkungan", icon: <FileText className="w-4 h-4" /> },
  { id: "governance", label: "Jadwal & Governance", icon: <FileText className="w-4 h-4" /> },
] as const;

type DomainId = typeof DOMAINS[number]["id"];

// --- Types ---
type ItemStatus = "available" | "missing" | "na";
export type DataItem = {
  id: string;
  domain: DomainId | string;
  title: string;
  details?: string;
  unit?: string;
  status: ItemStatus;
  source?: string;
  link?: string;
  owner?: string;
  due?: string; // ISO date string
  priority?: "Low" | "Medium" | "High";
};

// ---- Seed items (prefill) ----
const seedItems: DataItem[] = [
  // Geology — prefilled
  {
    id: "gl_resistivity",
    domain: "geology",
    title: "Geolistrik & korelasi litologi (resistivitas)",
    details:
      "Andesit 261–278 Ω·m; lapuk 14–67,3; lempung 2,23–7,29. Penampang A–B/C–D/E–F; zonasi andesit menebal di pusat.",
    unit: "—",
    status: "available",
    source: "Laporan Geolistrik Hanjuang",
    owner: "Geologist",
    priority: "Medium",
  },
  {
    id: "gl_coords",
    domain: "geology",
    title: "Koordinat GL.1–GL.9 (UTM, elevasi)",
    details: "Lampiran II berisi Easting/Northing & elevasi.",
    unit: "Shapefile/CSV",
    status: "available",
    source: "Laporan Geolistrik Hanjuang",
    owner: "Surveyor",
    priority: "Low",
  },
  {
    id: "core_program",
    domain: "geology",
    title: "Program bor inti (full coring)",
    details: "Kisi awal 50×50 m pada dome tengah (GL.3–GL.4–GL.9).",
    unit: "Plan",
    status: "missing",
    source: "Rekomendasi geolistrik",
    owner: "Exploration Lead",
    priority: "High",
  },
  // QC
  {
    id: "laa_238",
    domain: "qc",
    title: "Los Angeles Abrasion (LAA) 23,8% (Split 1–2)",
    details: "A=5000 g; tertahan No.12=3810 g; 11 bola.",
    unit: "%",
    status: "available",
    source: "Lampiran uji LAA",
    owner: "QC Lab",
    priority: "Low",
  },
  {
    id: "resume_lab",
    domain: "qc",
    title: "Resume lab (BJ 2,37–2,49; penyerapan ~2%)",
    details: "LAA 20,6–23,8 (≤30 lulus).",
    unit: "—",
    status: "available",
    source: "Resume Pengujian",
    owner: "QC Lab",
    priority: "Low",
  },
  { id: "sieve", domain: "qc", title: "Sieve analysis per fraksi", details: "Gradasi 1–2; 2–3; 3–5; screening; abu.", unit: "XLSX", status: "missing", source: "QC rencana", owner: "QC Lab", priority: "High" },
  { id: "asr", domain: "qc", title: "Potensi ASR/Soundness/Flakiness", details: "SNI relevan untuk proyek jalan & beton.", unit: "PDF", status: "missing", source: "QC lanjutan", owner: "QC Lab", priority: "Medium" },
  // Mine design
  { id: "pit_design", domain: "mine", title: "Desain pit & jenjang", details: "Bench 5–10 m; ramp; berm; FoS geotek.", unit: "DXF/DWG", status: "missing", source: "Geotek & design", owner: "Mine Eng", priority: "High" },
  { id: "drainage", domain: "mine", title: "Drainase & settling pond", details: "Parit perimeter; kolam bertingkat; spillway.", unit: "Layout", status: "missing", source: "Hidrologi", owner: "Mine Eng", priority: "Medium" },
  // Plant & utilities
  { id: "flowsheet", domain: "plant", title: "Flowsheet pabrik 250 tph", details: "Jaw → Secondary → Screen; OEE target; dust control.", unit: "PFD", status: "missing", source: "Vendor", owner: "Process Eng", priority: "High" },
  { id: "genset_admin", domain: "plant", title: "Genset admin 60 kVA (ATS)", details: "Jam cadangan ±1.000/tahun; ~0,27 L/kWh.", unit: "Spec", status: "available", source: "Asumsi proyek", owner: "Facility", priority: "Low" },
  // Ops
  { id: "fleet_list", domain: "ops", title: "Fleet inti (2×PC200; 7×DT idx 25; 1×Loader)", details: "Jam/avail/util; BBM/jam.", unit: "XLSX", status: "available", source: "Input pemilik", owner: "Operations", priority: "Low" },
  { id: "cycle_time", domain: "ops", title: "Siklus & jarak angkut", details: "Loading → hauling → dumping; rute satu arah.", unit: "Study", status: "missing", source: "Time & motion", owner: "Operations", priority: "High" },
  // Market & logistics
  { id: "customers", domain: "market", title: "Daftar pelanggan & LOI", details: "Ready‑mix; jalan; precast; volume bulanan.", unit: "XLSX", status: "missing", source: "Sales", owner: "Sales", priority: "Medium" },
  { id: "pricing", domain: "market", title: "Harga per fraksi & matriks jarak ≤50 km", details: "Ex‑plant Rp120k/m³ (mix); delivered by radius.", unit: "XLSX", status: "missing", source: "Komersial", owner: "Sales", priority: "High" },
  // Finance
  { id: "capex_quotes", domain: "finance", title: "Kutipan CAPEX vendor", details: "Crusher, timbangan, genset, workshop, jalan.", unit: "PDF", status: "missing", source: "Vendor", owner: "Finance", priority: "High" },
  { id: "opex_detail", domain: "finance", title: "Detail OPEX (BBM, listrik, peledak, spare)", details: "BBM Rp10.000/L; grid Rp1.444/kWh.", unit: "XLSX", status: "available", source: "Model v3", owner: "Finance", priority: "Low" },
  // Permits & environment
  { id: "permits_plan", domain: "permits", title: "Roadmap Perizinan (AMDAL, SIPB, RKAB, SMKP)", details: "Target izin 2026; urutan & prasyarat.", unit: "Checklist", status: "available", source: "Rencana proyek", owner: "Permitting", priority: "High" },
  { id: "baseline_env", domain: "permits", title: "Baseline lingkungan (air, TSP/PM10, noise, getaran)", details: "Lokasi & frekuensi monitoring.", unit: "CSV/PDF", status: "missing", source: "Konsultan AMDAL", owner: "Enviro", priority: "High" },
  // Governance
  { id: "gantt", domain: "governance", title: "Gantt 18 bulan & critical path", details: "Pemboran→Lingkungan→SIPB→RKAB→Konstruksi.", unit: "PNG/MPP", status: "available", source: "Rencana proyek", owner: "PMO", priority: "High" },
  { id: "sop", domain: "governance", title: "SOP kritikal & ERP", details: "Peledakan, muat‑angkut, crusher, izin kerja, tanggap darurat.", unit: "DOCX/PDF", status: "missing", source: "SMKP", owner: "HSE", priority: "High" },
];

// --- Pure helpers so we can test them ---
function buildCSV(items: DataItem[]) {
  const header = ["domain", "title", "details", "unit", "status", "owner", "due", "priority", "link"];
  const rows = items.map((i) => [i.domain, i.title, i.details ?? "", i.unit ?? "", i.status, i.owner ?? "", i.due ?? "", i.priority ?? "", i.link ?? ""]);
  const csv = [header, ...rows]
    .map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  return csv;
}

function filterItems(items: DataItem[], domain: DomainId | "all", q: string) {
  return items.filter(
    (it) => (domain === "all" || it.domain === domain) && (it.title.toLowerCase().includes(q.toLowerCase()) || (it.details ?? "").toLowerCase().includes(q.toLowerCase()))
  );
}

type SourceMap = { geo?: string; laa?: string; resume?: string };
function mapSourceLinks(items: DataItem[], src: SourceMap) {
  const bind: Record<keyof SourceMap, string[]> = {
    geo: ["gl_resistivity", "gl_coords"],
    laa: ["laa_238"],
    resume: ["resume_lab"],
  } as const;
  let next = items.map((x) => ({ ...x }));
  (Object.keys(bind) as (keyof SourceMap)[]).forEach((k) => {
    const url = src[k];
    if (!url) return;
    bind[k].forEach((id) => {
      const idx = next.findIndex((i) => i.id === id);
      if (idx >= 0) next[idx].link = url;
    });
  });
  return next;
}

function useChecklistState() {
  const [items, setItems] = useState<DataItem[]>(() => {
    const fromLS = typeof window !== "undefined" ? localStorage.getItem("galianc_items") : null;
    return fromLS ? JSON.parse(fromLS) : seedItems;
  });
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState<DomainId | "all">("all");
  const [view, setView] = useState<"cards" | "table">("cards");

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("galianc_items", JSON.stringify(items));
    }
  }, [items]);

  const filtered = useMemo(() => filterItems(items, domain, q), [items, q, domain]);

  const stats = useMemo(() => {
    const total = items.length;
    const available = items.filter((i) => i.status === "available").length;
    const missing = items.filter((i) => i.status === "missing").length;
    const na = items.filter((i) => i.status === "na").length;
    const pct = Math.round((available / Math.max(total, 1)) * 100);
    const perDomain = DOMAINS.map((d) => {
      const list = items.filter((i) => i.domain === d.id);
      const a = list.filter((i) => i.status === "available").length;
      const m = list.filter((i) => i.status === "missing").length;
      const n = list.filter((i) => i.status === "na").length;
      return { domain: d.label, available: a, missing: m, na: n, total: list.length, pct: list.length ? Math.round((a / list.length) * 100) : 0 };
    });
    return { total, available, missing, na, pct, perDomain };
  }, [items]);

  const setStatus = (id: string, status: ItemStatus) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  const setDetails = (id: string, details: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, details } : i)));
  const setUnit = (id: string, unit: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, unit } : i)));
  const setLink = (id: string, link: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, link } : i)));
  const setOwner = (id: string, owner: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, owner } : i)));
  const setDue = (id: string, due: string) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, due } : i)));
  const setPriority = (id: string, priority: "Low" | "Medium" | "High") => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, priority } : i)));
  const bulkApplySourceLinks = (src: SourceMap) => setItems((prev) => mapSourceLinks(prev, src));

  const addItem = (partial: Partial<DataItem>) => {
    const newItem: DataItem = {
      id: Math.random().toString(36).slice(2),
      domain: (partial.domain as DomainId) || "geology",
      title: partial.title || "Item baru",
      details: partial.details || "",
      unit: partial.unit || "—",
      status: partial.status || "missing",
      source: partial.source || "",
      link: partial.link || "",
      owner: partial.owner || "",
      due: partial.due || "",
      priority: partial.priority || "Medium",
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const exportCSV = () => {
    const csv = buildCSV(items);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-room-galian-c.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Checklist");
    const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-room-galian-c.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (text: string) => {
    try {
      const arr = JSON.parse(text);
      if (Array.isArray(arr)) setItems(arr);
    } catch (e) {
      alert("File/teks JSON tidak valid");
    }
  };

  return {
    items,
    setItems,
    filtered,
    q,
    setQ,
    domain,
    setDomain,
    stats,
    setStatus,
    setDetails,
    setUnit,
    setLink,
    setOwner,
    setDue,
    setPriority,
    addItem,
    importJSON,
    exportCSV,
    exportXLSX,
    view,
    setView,
    bulkApplySourceLinks,
  };
}

const StatusPill = ({ status }: { status: ItemStatus }) => {
  const map: Record<ItemStatus, { color: string; icon: React.ReactNode; label: string }> = {
    available: { color: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: "Ada" },
    missing: { color: "bg-amber-100 text-amber-700", icon: <AlertTriangle className="w-3.5 h-3.5" />, label: "Kurang" },
    na: { color: "bg-neutral-100 text-neutral-600", icon: <Circle className="w-3.5 h-3.5" />, label: "N/A" },
  };
  const m = map[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${m.color}`}>
      {m.icon}
      {m.label}
    </span>
  );
};

const DomainBadge = ({ domain }: { domain: string }) => {
  const d = DOMAINS.find((x) => x.id === domain);
  const c = DOMAIN_COLORS[domain] || { dot: "bg-neutral-400", ring: "ring-neutral-200" };
  return (
    <Badge variant="secondary" className={`gap-2 whitespace-nowrap ring ${c.ring}`}>
      <span className={`inline-block w-2.5 h-2.5 rounded-full ${c.dot}`} />
      {d?.label}
    </Badge>
  );
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
}

function SummaryDonut({ stats }: { stats: { available: number; missing: number; na: number } }) {
  const data = [
    { name: "Ada", value: stats.available, fill: COLORS.success },
    { name: "Kurang", value: stats.missing, fill: COLORS.warning },
    { name: "N/A", value: stats.na, fill: COLORS.muted },
  ];
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie dataKey="value" data={data} innerRadius={48} outerRadius={72}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.fill as string} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={24} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function DomainBar({ perDomain }: { perDomain: { domain: string; available: number; missing: number; na: number }[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <BarChart data={perDomain} margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="domain" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="available" stackId="a" name="Ada" fill={COLORS.success} />
          <Bar dataKey="missing" stackId="a" name="Kurang" fill={COLORS.warning} />
          <Bar dataKey="na" stackId="a" name="N/A" fill={COLORS.muted} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Toolbar({ q, setQ, domain, setDomain, onExportCSV, onExportXLSX, onImport, view, setView }: any) {
  const [importText, setImportText] = useState("");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <div className="flex items-center gap-2 w-full md:w-96 bg-white rounded-xl px-3 py-2 ring-1 ring-neutral-200">
          <Search className="w-4 h-4 text-neutral-500" />
          <Input className="border-none focus-visible:ring-0" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari item / detail…" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-500" />
          <Select value={domain} onValueChange={setDomain}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Semua domain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua domain</SelectItem>
              {DOMAINS.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={onExportCSV}>
            <Download className="w-4 h-4" /> CSV
          </Button>
          <Button variant="outline" className="gap-2" onClick={onExportXLSX}>
            <Download className="w-4 h-4" /> Excel
          </Button>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-white">
            <List className="w-4 h-4" />
            <Switch checked={view === "table"} onCheckedChange={(v) => setView(v ? "table" : "cards")} />
            <Grid3X3 className="w-4 h-4" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-2">
        <Input value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Tempel JSON untuk import checklist (opsional)…" />
        <Button variant="secondary" onClick={() => onImport(importText)}>Import JSON</Button>
      </div>
    </div>
  );
}

function ItemCard({
  item,
  onStatus,
  onDetails,
  onUnit,
  onLink,
  onOwner,
  onDue,
  onPriority,
  onRemove,
}: {
  item: DataItem;
  onStatus: (s: ItemStatus) => void;
  onDetails: (v: string) => void;
  onUnit: (v: string) => void;
  onLink: (v: string) => void;
  onOwner: (v: string) => void;
  onDue: (v: string) => void;
  onPriority: (v: "Low" | "Medium" | "High") => void;
  onRemove: () => void;
}) {
  const color = DOMAIN_COLORS[item.domain] ?? { ring: "ring-neutral-200" };
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={`rounded-2xl shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-200 ring-1 ${color.ring}`}>
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <DomainBadge domain={item.domain} />
                <StatusPill status={item.status} />
              </div>
              <h3 className="mt-1 font-semibold text-neutral-900 leading-tight flex items-center gap-1">
                {item.title}
                {item.priority === "High" && <Star className="w-4 h-4 text-amber-500" />}
              </h3>
              <Input className="mt-2" value={item.details || ""} onChange={(e) => onDetails(e.target.value)} placeholder="Detail (opsional)" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <Input value={item.unit || ""} onChange={(e) => onUnit(e.target.value)} placeholder="Format/Satuan" />
                <div className="flex items-center gap-2">
                  <Input value={item.link || ""} onChange={(e) => onLink(e.target.value)} placeholder="URL lampiran (opsional)" />
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline flex items-center gap-1">
                      <LinkIcon className="w-3.5 h-3.5" /> Buka
                    </a>
                  ) : null}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <UserCircle2 className="w-4 h-4 text-neutral-500" />
                  <Input value={item.owner || ""} onChange={(e) => onOwner(e.target.value)} placeholder="PIC/Owner" />
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-neutral-500" />
                  <Input type="date" value={item.due || ""} onChange={(e) => onDue(e.target.value)} placeholder="Jatuh tempo" />
                </div>
                <Select value={item.priority || "Medium"} onValueChange={(v: "Low" | "Medium" | "High") => onPriority(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {item.source && <p className="text-xs text-neutral-400 mt-1">Sumber: {item.source}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Select value={item.status} onValueChange={(v: ItemStatus) => onStatus(v)}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Ada</SelectItem>
                  <SelectItem value="missing">Kurang</SelectItem>
                  <SelectItem value="na">N/A</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={onRemove}>
                <Trash2 className="w-4 h-4 text-neutral-500" />
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5" /> Format/Satuan: {item.unit || "—"}
            </span>
            <span className="italic">Klik URL untuk buka lampiran</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AddItem({ onAdd }: { onAdd: (p: Partial<DataItem>) => void }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [domain, setDomain] = useState<DomainId>("geology");
  const [unit, setUnit] = useState("—");
  return (
    <Card className="rounded-2xl border-dashed">
      <CardContent className="p-4 flex flex-col gap-3">
        <h4 className="font-medium">Tambah item kustom</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul item" />
          <Input value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Detail (opsional)" />
          <Select value={domain} onValueChange={(v: DomainId) => setDomain(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              {DOMAINS.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Format/Satuan" />
        </div>
        <div className="flex justify-end">
          <Button
            className="rounded-2xl"
            onClick={() => {
              if (!title.trim()) return;
              onAdd({ title, details, domain, unit });
              setTitle("");
              setDetails("");
              setDomain("geology");
              setUnit("—");
            }}
          >
            Tambah
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TableView({ items, setStatus, setDetails, setUnit, setLink, setOwner, setDue, setPriority, setItems }: any) {
  return (
    <div className="overflow-auto rounded-2xl border">
      <table className="min-w-[1200px] w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <th className="p-3 text-left">Domain</th>
            <th className="p-3 text-left">Judul</th>
            <th className="p-3 text-left">Detail</th>
            <th className="p-3 text-left">Format/Satuan</th>
            <th className="p-3 text-left">URL</th>
            <th className="p-3 text-left">PIC</th>
            <th className="p-3 text-left">Due</th>
            <th className="p-3 text-left">Prioritas</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it: DataItem) => (
            <tr key={it.id} className="border-t hover:bg-neutral-50/60">
              <td className="p-3 whitespace-nowrap">
                <DomainBadge domain={it.domain} />
              </td>
              <td className="p-3 min-w-[220px]">{it.title}</td>
              <td className="p-3 min-w-[280px]">
                <Input value={it.details || ""} onChange={(e) => setDetails(it.id, e.target.value)} />
              </td>
              <td className="p-3 w-40">
                <Input value={it.unit || ""} onChange={(e) => setUnit(it.id, e.target.value)} />
              </td>
              <td className="p-3 w-64">
                <div className="flex items-center gap-2">
                  <Input value={it.link || ""} onChange={(e) => setLink(it.id, e.target.value)} />
                  {it.link ? (
                    <a href={it.link} target="_blank" rel="noreferrer" className="text-blue-600 underline text-xs">
                      Buka
                    </a>
                  ) : null}
                </div>
              </td>
              <td className="p-3 w-48">
                <Input value={it.owner || ""} onChange={(e) => setOwner(it.id, e.target.value)} placeholder="PIC" />
              </td>
              <td className="p-3 w-48">
                <Input type="date" value={it.due || ""} onChange={(e) => setDue(it.id, e.target.value)} />
              </td>
              <td className="p-3 w-40">
                <Select value={it.priority || "Medium"} onValueChange={(v: "Low" | "Medium" | "High") => setPriority(it.id, v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="p-3 w-40">
                <Select value={it.status} onValueChange={(v: ItemStatus) => setStatus(it.id, v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Ada</SelectItem>
                    <SelectItem value="missing">Kurang</SelectItem>
                    <SelectItem value="na">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="p-3">
                <Button variant="ghost" size="icon" onClick={() => confirm("Hapus item ini?") && setItems((prev: DataItem[]) => prev.filter((x) => x.id !== it.id))}>
                  <Trash2 className="w-4 h-4 text-neutral-500" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Upload Center (drag & drop)
function useUploads(items: DataItem[], setLink: (id: string, url: string) => void) {
  type UploadFile = { id: string; name: string; size: number; type: string; url: string; attachedTo?: string };
  const [files, setFiles] = useState<UploadFile[]>([]);

  const addFiles = (list: FileList | File[]) => {
    const arr = Array.from(list).map((f) => ({ id: Math.random().toString(36).slice(2), name: f.name, size: f.size, type: f.type, url: URL.createObjectURL(f) }));
    setFiles((prev) => [...arr, ...prev]);
  };
  const remove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));
  const attach = (fileId: string, itemId: string) => {
    const f = files.find((x) => x.id === fileId);
    if (!f) return;
    setFiles((prev) => prev.map((x) => (x.id === fileId ? { ...x, attachedTo: itemId } : x)));
    setLink(itemId, f.url);
  };

  return { files, addFiles, remove, attach };
}

function UploadCenter({ items, addFiles, files, remove, attach }: any) {
  const [hover, setHover] = useState(false);
  const [targetItem, setTargetItem] = useState<string>("");
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-neutral-600" />
            <h3 className="font-semibold text-lg">Upload Center</h3>
          </div>
          <Badge variant="outline" className="gap-1">
            <Sparkles className="w-3.5 h-3.5" /> drag & drop
          </Badge>
        </div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setHover(true);
          }}
          onDragLeave={() => setHover(false)}
          onDrop={(e) => {
            e.preventDefault();
            setHover(false);
            if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
          }}
          className={`h-36 rounded-2xl border-2 border-dashed flex items-center justify-center text-neutral-500 ${hover ? "border-blue-400 bg-blue-50" : "border-neutral-300"}`}
        >
          Drop files here atau klik tombol di bawah
        </div>
        <div className="flex items-center gap-2">
          <input id="fileInput" type="file" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
          <Button onClick={() => document.getElementById("fileInput")?.click()}>Browse Files</Button>
          <Select value={targetItem} onValueChange={setTargetItem}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Pilih item untuk attach" />
            </SelectTrigger>
            <SelectContent>
              {items.map((i: DataItem) => (
                <SelectItem value={i.id} key={i.id}>
                  {i.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          {files.length === 0 ? (
            <div className="text-sm text-neutral-500">Belum ada file diupload.</div>
          ) : (
            files.map((f: any) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-xl border bg-white">
                <div className="flex items-center gap-3">
                  <Paperclip className="w-4 h-4 text-neutral-500" />
                  <div>
                    <div className="font-medium text-sm">{f.name}</div>
                    <div className="text-xs text-neutral-500">
                      {(f.size / 1024).toFixed(1)} KB • {f.type || "unknown"} {f.attachedTo ? `• attached to ${items.find((x: DataItem) => x.id === f.attachedTo)?.title}` : ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={f.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                    Open
                  </a>
                  <Button variant="outline" size="sm" onClick={() => targetItem && attach(f.id, targetItem)}>
                    Attach to selected
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(f.id)}>
                    <Trash2 className="w-4 h-4 text-neutral-500" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Source Links — paste Google Drive URLs and auto-apply to items
function SourceLinksPanel({ onApply }: { onApply: (src: SourceMap) => void }) {
  const [src, setSrc] = useState<SourceMap>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem("galianc_sources") || "{}");
    } catch {
      return {};
    }
  });
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("galianc_sources", JSON.stringify(src));
  }, [src]);
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-neutral-600" />
            <h3 className="font-semibold text-lg">Source Links (Google Drive)</h3>
          </div>
          <Badge variant="outline">Auto-attach</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="text-xs text-neutral-500">Laporan Geolistrik Hanjuang</div>
            <Input value={src.geo || ""} onChange={(e) => setSrc((s) => ({ ...s, geo: e.target.value }))} placeholder="Tempel URL Google Drive / viewer" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-neutral-500">Form Nilai Abrasi (Split 1–2)</div>
            <Input value={src.laa || ""} onChange={(e) => setSrc((s) => ({ ...s, laa: e.target.value }))} placeholder="Tempel URL Google Drive / viewer" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-neutral-500">Resume Hasil Pengujian</div>
            <Input value={src.resume || ""} onChange={(e) => setSrc((s) => ({ ...s, resume: e.target.value }))} placeholder="Tempel URL Google Drive / viewer" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setSrc({})}>Reset</Button>
          <Button onClick={() => onApply(src)}>Apply to checklist</Button>
        </div>
        <p className="text-xs text-neutral-500">
          Tip: Setelah apply, setiap item terkait akan menampilkan tombol <span className="underline">Buka</span> untuk membuka dokumen.
        </p>
      </CardContent>
    </Card>
  );
}

// Financial quick model (editable inputs → KPIs)
function useFinancialModel() {
  const [volume, setVolume] = useState(500_000);
  const [price, setPrice] = useState(120_000);
  const [fuelPerM3, setFuelPerM3] = useState(22464);
  const [energyKwhPerM3, setEnergyKwhPerM3] = useState(4);
  const [tariff, setTariff] = useState(1444);
  const [royalty, setRoyalty] = useState(3000);
  const [blasting, setBlasting] = useState(5000);
  const [spares, setSpares] = useState(8000);
  const [payroll, setPayroll] = useState(3_000_000_000);
  const [overhead, setOverhead] = useState(1_000_000_000);
  const [env, setEnv] = useState(500_000_000);
  const [sgaPct, setSgaPct] = useState(1);
  const [gensetAdmin, setGensetAdmin] = useState(32_400_000);
  const [capex, setCapex] = useState(37_350_000_000);
  const [deprYears, setDeprYears] = useState(5);

  const res = useMemo(() => {
    const revenue = volume * price;
    const energyPerM3 = energyKwhPerM3 * tariff;
    const varPerM3 = fuelPerM3 + energyPerM3 + royalty + blasting + spares;
    const varTotal = varPerM3 * volume;
    const sga = (sgaPct / 100) * revenue;
    const fixedTotal = payroll + overhead + env + gensetAdmin + sga;
    const opex = varTotal + fixedTotal;
    const ebitda = revenue - opex;
    const depr = capex / deprYears;
    const ebit = ebitda - depr;
    const ebitdaMargin = revenue ? ebitda / revenue : 0;
    return { revenue, energyPerM3, varPerM3, varTotal, fixedTotal, opex, ebitda, ebit, depr, ebitdaMargin };
  }, [volume, price, fuelPerM3, energyKwhPerM3, tariff, royalty, blasting, spares, payroll, overhead, env, sgaPct, gensetAdmin, capex, deprYears]);

  return { state: { volume, price, fuelPerM3, energyKwhPerM3, tariff, royalty, blasting, spares, payroll, overhead, env, sgaPct, gensetAdmin, capex, deprYears }, set: { setVolume, setPrice, setFuelPerM3, setEnergyKwhPerM3, setTariff, setRoyalty, setBlasting, setSpares, setPayroll, setOverhead, setEnv, setSgaPct, setGensetAdmin, setCapex, setDeprYears }, res };
}

function numberFmt(n: number) {
  return n.toLocaleString("id-ID");
}

function FinancialPanel() {
  const { state, set, res } = useFinancialModel();
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Financial Quick Model</h3>
          <Badge variant="outline">Editable</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input type="number" value={state.volume} onChange={(e) => set.setVolume(parseInt(e.target.value || "0"))} placeholder="Volume (m³)" />
          <Input type="number" value={state.price} onChange={(e) => set.setPrice(parseInt(e.target.value || "0"))} placeholder="Harga (Rp/m³)" />
          <Input type="number" value={state.fuelPerM3} onChange={(e) => set.setFuelPerM3(parseInt(e.target.value || "0"))} placeholder="Fuel (Rp/m³)" />
          <div className="grid grid-cols-2 gap-2">
            <Input type="number" value={state.energyKwhPerM3} onChange={(e) => set.setEnergyKwhPerM3(parseFloat(e.target.value || "0"))} placeholder="Energi (kWh/m³)" />
            <Input type="number" value={state.tariff} onChange={(e) => set.setTariff(parseInt(e.target.value || "0"))} placeholder="Tarif (Rp/kWh)" />
          </div>
          <Input type="number" value={state.royalty} onChange={(e) => set.setRoyalty(parseInt(e.target.value || "0"))} placeholder="Royalti (Rp/m³)" />
          <Input type="number" value={state.blasting} onChange={(e) => set.setBlasting(parseInt(e.target.value || "0"))} placeholder="Peledakan (Rp/m³)" />
          <Input type="number" value={state.spares} onChange={(e) => set.setSpares(parseInt(e.target.value || "0"))} placeholder="Spare (Rp/m³)" />
          <Input type="number" value={state.payroll} onChange={(e) => set.setPayroll(parseInt(e.target.value || "0"))} placeholder="Payroll (Rp/thn)" />
          <Input type="number" value={state.overhead} onChange={(e) => set.setOverhead(parseInt(e.target.value || "0"))} placeholder="Overhead (Rp/thn)" />
          <Input type="number" value={state.env} onChange={(e) => set.setEnv(parseInt(e.target.value || "0"))} placeholder="Lingkungan/CSR (Rp/thn)" />
          <div className="grid grid-cols-2 gap-2">
            <Input type="number" value={state.sgaPct} onChange={(e) => set.setSgaPct(parseFloat(e.target.value || "0"))} placeholder="SG&A (%)" />
            <Input type="number" value={state.gensetAdmin} onChange={(e) => set.setGensetAdmin(parseInt(e.target.value || "0"))} placeholder="Genset admin (Rp/thn)" />
          </div>
          <Input type="number" value={state.capex} onChange={(e) => set.setCapex(parseInt(e.target.value || "0"))} placeholder="CAPEX (Rp)" />
          <Input type="number" value={state.deprYears} onChange={(e) => set.setDeprYears(parseInt(e.target.value || "0"))} placeholder="Depresiasi (tahun)" />
        </div>
        <Separator />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Revenue (Rp)" value={"Rp " + numberFmt(res.revenue)} />
          <Stat label="Variabel/m³ (Rp)" value={numberFmt(res.varPerM3)} />
          <Stat label="Opex Total (Rp)" value={"Rp " + numberFmt(res.opex)} />
          <Stat label="EBITDA (Rp)" value={"Rp " + numberFmt(res.ebitda)} />
          <Stat label="EBITDA Margin" value={(res.ebitdaMargin * 100).toFixed(1) + "%"} />
          <Stat label="Depresiasi (Rp)" value={"Rp " + numberFmt(res.depr)} />
          <Stat label="EBIT (Rp)" value={"Rp " + numberFmt(res.ebit)} />
        </div>
      </CardContent>
    </Card>
  );
}

// Timeline + Critical Path toggle
const TIMELINE = [
  { id: "t1", name: "Pemboran inti + lab + model 3D", start: new Date(2025, 8, 1), end: new Date(2025, 10, 30), critical: false },
  { id: "t2", name: "AMDAL/UKL-UPL → Persetujuan Lingkungan", start: new Date(2025, 9, 1), end: new Date(2026, 0, 31), critical: true },
  { id: "t3", name: "SIPB (batuan)", start: new Date(2026, 0, 1), end: new Date(2026, 2, 31), critical: true },
  { id: "t4", name: "RKAB & persetujuan", start: new Date(2026, 3, 1), end: new Date(2026, 4, 31), critical: true },
  { id: "t5", name: "SMKP & organisasi KTT", start: new Date(2026, 3, 1), end: new Date(2026, 4, 31), critical: false },
  { id: "t6", name: "Engineering & pengadaan plant", start: new Date(2026, 5, 1), end: new Date(2026, 7, 31), critical: false },
  { id: "t7", name: "Pengadaan genset admin 60 kVA", start: new Date(2026, 5, 15), end: new Date(2026, 6, 15), critical: false },
  { id: "t8", name: "Konstruksi & instalasi", start: new Date(2026, 6, 1), end: new Date(2026, 7, 31), critical: false },
  { id: "t9", name: "Commissioning plant + SOP", start: new Date(2026, 8, 1), end: new Date(2026, 8, 30), critical: true },
];

function Timeline() {
  const [tasks, setTasks] = useState(TIMELINE);
  const start0 = tasks[0].start.getTime();
  const endLast = tasks[tasks.length - 1].end.getTime();
  const total = endLast - start0;
  const toggleCritical = (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, critical: !t.critical } : t)));
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Timeline 18 Bulan</h3>
          <Badge className="bg-rose-100 text-rose-700">Klik bar untuk toggle Critical</Badge>
        </div>
        <div className="space-y-3">
          {tasks.map((t) => {
            const left = ((t.start.getTime() - start0) / total) * 100;
            const width = ((t.end.getTime() - t.start.getTime()) / total) * 100;
            return (
              <div key={t.id} className="">
                <div className="text-sm text-neutral-700 mb-1 flex items-center gap-2">
                  {t.critical && <span className="text-rose-600">⚡</span>}
                  {t.name}
                </div>
                <div className="h-3 bg-neutral-100 rounded-full relative overflow-hidden">
                  <button
                    className={`h-3 rounded-full absolute ${t.critical ? "bg-rose-500" : "bg-neutral-800/70"} hover:opacity-90`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    onClick={() => toggleCritical(t.id)}
                    aria-label="toggle critical"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Lightweight self-test runner (renders in UI)
function TestPanel() {
  type Result = { name: string; pass: boolean; message?: string };
  const tests: Result[] = [];

  // Test 1: CSV quoting & newline join
  const sample: DataItem[] = [
    { id: "t1", domain: "geology", title: 'A "quote",comma', details: "", unit: "—", status: "available", owner: "", due: "", priority: "Medium", link: "" },
  ];
  const csv1 = buildCSV(sample);
  const expected1 = '"domain","title","details","unit","status","owner","due","priority","link"\n"geology","A ""quote"",comma","","—","available","","","Medium",""';
  tests.push({ name: "CSV escaping + newline", pass: csv1 === expected1, message: csv1 });

  // Test 2: filter by domain
  const items: DataItem[] = [
    { id: "a", domain: "geology", title: "Rock sample", status: "available", unit: "—" },
    { id: "b", domain: "qc", title: "Sand sieve", status: "missing", unit: "—" },
  ];
  const f1 = filterItems(items, "geology", "");
  tests.push({ name: "Filter domain", pass: f1.length === 1 });

  // Test 3: search case-insensitive
  const f2 = filterItems(items, "all", "SAND");
  tests.push({ name: "Search insensitive", pass: f2.length === 1 && f2[0].id === "b" });

  // Test 4: number format id-ID
  tests.push({ name: "numberFmt locale", pass: numberFmt(1234567) === "1.234.567" });

  // Test 5: map source links
  const srcApplied = mapSourceLinks([{ id: "gl_resistivity", domain: "geology", title: "t", status: "available" } as DataItem], { geo: "https://drive" });
  tests.push({ name: "Map source → link", pass: srcApplied[0].link === "https://drive" });

  const allPass = tests.every((t) => t.pass);
  const [open, setOpen] = useState(false);

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4" />
            <span className="font-semibold">Dev Tests</span>
            <Badge className={allPass ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>{allPass ? "All pass" : "Check failures"}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Hide" : "Show"}
          </Button>
        </div>
        {open && (
          <div className="mt-3 space-y-2">
            {tests.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg border bg-white">
                <div className="flex items-center gap-2">
                  {t.pass ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                  <span>{t.name}</span>
                </div>
                {!t.pass && t.message ? <code className="text-xs text-rose-700 break-all">{t.message}</code> : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const {
    items,
    setItems,
    filtered,
    q,
    setQ,
    domain,
    setDomain,
    stats,
    setStatus,
    setDetails,
    setUnit,
    setLink,
    setOwner,
    setDue,
    setPriority,
    addItem,
    importJSON,
    exportCSV,
    exportXLSX,
    view,
    setView,
    bulkApplySourceLinks,
  } = useChecklistState();

  const uploads = useUploads(items, setLink);

  return (
    <div className="min-h-screen text-neutral-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-cyan-50">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
              Dashboard – Data Room & Readiness
            </h1>
            <p className="text-neutral-600 max-w-2xl">
              Kelola kelengkapan data, pantau progres per-domain, attach Google Drive, dan simulasi finansial cepat untuk business plan Quarry Andesit.
            </p>
          </div>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="grid grid-cols-2 gap-4">
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <div className="text-sm text-neutral-500">Progress keseluruhan</div>
                <div className="text-2xl font-semibold">{stats.pct}%</div>
                <div className="text-xs text-neutral-400">
                  {stats.available}/{stats.total} item tersedia
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <SummaryDonut stats={stats} />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Toolbar */}
        <div className="mt-6">
          <Toolbar q={q} setQ={setQ} domain={domain} setDomain={setDomain} onExportCSV={exportCSV} onExportXLSX={exportXLSX} onImport={importJSON} view={view} setView={setView} />
        </div>

        {/* Domain bars */}
        <div className="mt-6">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">Progres per domain</h3>
              <DomainBar perDomain={stats.perDomain} />
            </CardContent>
          </Card>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <Stat label="Total item" value={String(stats.total)} />
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <Stat label="Ada" value={String(stats.available)} />
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <Stat label="Kurang" value={String(stats.missing)} />
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <Stat label="N/A" value={String(stats.na)} />
            </CardContent>
          </Card>
        </div>

        {/* Financials */}
        <div className="mt-8">
          <FinancialPanel />
        </div>

        {/* Add item */}
        <div className="mt-8">
          <AddItem onAdd={addItem} />
        </div>

        {/* Items – switchable view */}
        <div className="mt-6">
          {view === "table" ? (
            <TableView items={filtered} setStatus={setStatus} setDetails={setDetails} setUnit={setUnit} setLink={setLink} setOwner={setOwner} setDue={setDue} setPriority={setPriority} setItems={setItems} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((it) => (
                <ItemCard
                  key={it.id}
                  item={it}
                  onStatus={(s) => setStatus(it.id, s)}
                  onDetails={(v) => setDetails(it.id, v)}
                  onUnit={(v) => setUnit(it.id, v)}
                  onLink={(v) => setLink(it.id, v)}
                  onOwner={(v) => setOwner(it.id, v)}
                  onDue={(v) => setDue(it.id, v)}
                  onPriority={(v) => setPriority(it.id, v)}
                  onRemove={() => {
                    // soft remove
                    const confirmed = confirm("Hapus item ini?");
                    if (!confirmed) return;
                    setItems(items.filter((x) => x.id !== it.id));
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Source Links */}
        <div className="mt-8">
          <SourceLinksPanel onApply={(src) => bulkApplySourceLinks(src)} />
        </div>

        {/* Upload Center */}
        <div className="mt-8">
          <UploadCenter items={items} addFiles={uploads.addFiles} files={uploads.files} remove={uploads.remove} attach={uploads.attach} />
        </div>

        {/* Timeline */}
        <div className="mt-8">
          <Timeline />
        </div>

        {/* Tests */}
        <div className="mt-8">
          <TestPanel />
        </div>

        <div className="text-xs text-neutral-400 mt-10 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Tip: tempel URL Google Drive di panel "Source Links" untuk auto‑attach ke item terkait (geolistrik, LAA, resume uji).
        </div>
      </div>
    </div>
  );
}
