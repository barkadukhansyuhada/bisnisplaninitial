
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { AddItem } from './AddItem';
import { DomainBar } from './DomainBar';
import { FinancialPanel } from './FinancialPanel';
import { ItemCard } from './ItemCard';
import { SourceLinksPanel } from './SourceLinksPanel';
import { SummaryDonut, Stat } from './SummaryDonut';
import { TableView } from './TableView';
import { TestPanel } from './TestPanel';
import { Timeline } from './Timeline';
import { Toolbar } from './Toolbar';
import { UploadCenter } from './UploadCenter';

import { DOMAINS } from '@/lib/domains';
import { useStore } from '@/lib/store';
import { filterItems } from '@/lib/utils';


import { Sparkles } from 'lucide-react';

export function Dashboard() {
  const {
    items,
    setItems,
    q,
    setQ,
    domain,
    setDomain,
    view,
    setView,
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
    bulkApplySourceLinks,
  } = useStore();

  const filtered = React.useMemo(() => filterItems(items, domain, q), [items, domain, q]);

  const stats = React.useMemo(() => {
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
    }).filter((d) => domain === "all" || d.domain === DOMAINS.find((x) => x.id === domain)?.label);
    return { total, available, missing, na, pct, perDomain };
  }, [items]);

  

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
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <DomainBar perDomain={stats.perDomain} selectedDomain={domain} onDomainChange={setDomain} />
            </CardContent>
          </Card>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
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
          {view === 'table' ? (
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
                    const confirmed = confirm('Hapus item ini?');
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
          <UploadCenter items={items} addFiles={() => {}} files={[]} remove={() => {}} attach={() => {}} />
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
