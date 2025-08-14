


export const COLORS = {
  primary: "#2563EB", // blue-600
  secondary: "#06B6D4", // cyan-500
  accent: "#8B5CF6", // violet-500
  success: "#10B981", // emerald-500
  warning: "#F59E0B", // amber-500
  muted: "#94A3B8", // slate-400
};

export const DOMAIN_COLORS: Record<string, { dot: string; ring: string; fill?: string }> = {
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
