
export type ItemStatus = "available" | "missing" | "na";

export type DomainId = 'geology' | 'qc' | 'mine' | 'plant' | 'ops' | 'market' | 'finance' | 'permits' | 'governance';

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
  date?: string; // ISO date string for time-series data
};

export type SourceMap = { geo?: string; laa?: string; resume?: string };
