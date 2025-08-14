
import { DataItem, DomainId, SourceMap } from "./types";

export function buildCSV(items: DataItem[]) {
  const header = ["domain", "title", "details", "unit", "status", "owner", "due", "priority", "link"];
  const rows = items.map((i) => [i.domain, i.title, i.details ?? "", i.unit ?? "", i.status, i.owner ?? "", i.due ?? "", i.priority ?? "", i.link ?? ""]);
  const csv = [header, ...rows]
    .map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  return csv;
}

export function filterItems(items: DataItem[], domain: DomainId | "all", q: string) {
  return items.filter(
    (it) => (domain === "all" || it.domain === domain) && (it.title.toLowerCase().includes(q.toLowerCase()) || (it.details ?? "").toLowerCase().includes(q.toLowerCase()))
  );
}

export function mapSourceLinks(items: DataItem[], src: SourceMap) {
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

export function numberFmt(n: number) {
  return n.toLocaleString("id-ID");
}

