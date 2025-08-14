
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Download, Filter, Search, List, Grid3X3 } from 'lucide-react';
import { DOMAINS } from '@/lib/domains';

export function Toolbar({ q, setQ, domain, setDomain, onExportCSV, onExportXLSX, onImport, view, setView }: any) {
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
