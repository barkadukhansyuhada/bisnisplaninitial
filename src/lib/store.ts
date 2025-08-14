
import { create } from 'zustand';
import { DataItem, DomainId, ItemStatus, SourceMap } from './types';
import { buildCSV, filterItems, mapSourceLinks } from './utils';
import * as XLSX from 'xlsx';

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

interface AppState {
  items: DataItem[];
  q: string;
  domain: DomainId | 'all';
  view: 'cards' | 'table';
  setItems: (items: DataItem[]) => void;
  setQ: (q: string) => void;
  setDomain: (domain: DomainId | 'all') => void;
  setView: (view: 'cards' | 'table') => void;
  setStatus: (id: string, status: ItemStatus) => void;
  setDetails: (id: string, details: string) => void;
  setUnit: (id: string, unit: string) => void;
  setLink: (id: string, link: string) => void;
  setOwner: (id: string, owner: string) => void;
  setDue: (id: string, due: string) => void;
  setPriority: (id: string, priority: "Low" | "Medium" | "High") => void;
  addItem: (partial: Partial<DataItem>) => void;
  importJSON: (text: string) => void;
  exportCSV: () => void;
  exportXLSX: () => void;
  bulkApplySourceLinks: (src: SourceMap) => void;
}

export const useStore = create<AppState>((set, get) => ({
  items: seedItems,
  q: '',
  domain: 'all',
  view: 'cards',
  setItems: (items) => set({ items }),
  setQ: (q) => set({ q }),
  setDomain: (domain) => set({ domain }),
  setView: (view) => set({ view }),
  setStatus: (id, status) =>
    set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, status } : i))})),
  setDetails: (id, details) =>
    set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, details } : i))})),
  setUnit: (id, unit) =>
    set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, unit } : i))})),
  setLink: (id, link) =>
    set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, link } : i))})),
  setOwner: (id, owner) =>
    set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, owner } : i))})),
  setDue: (id, due) =>
    set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, due } : i))})),
  setPriority: (id, priority) =>
    set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, priority } : i))})),
  addItem: (partial) =>
    set((state) => ({
      items: [
        {
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
        },
        ...state.items,
      ],
    })),
  importJSON: (text) => {
    try {
      const arr = JSON.parse(text);
      if (Array.isArray(arr)) set({ items: arr });
    } catch (e) {
      alert("File/teks JSON tidak valid");
    }
  },
  exportCSV: () => {
    const items = get().items;
    const csv = buildCSV(items);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-room-galian-c.csv";
    a.click();
    URL.revokeObjectURL(url);
  },
  exportXLSX: () => {
    const items = get().items;
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
  },
  bulkApplySourceLinks: (src) =>
    set((state) => ({ items: mapSourceLinks(state.items, src) })),
}));
