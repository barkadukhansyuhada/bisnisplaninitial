
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { AddItem } from './AddItem';
import { BulkActionsToolbar } from './BulkActionsToolbar';
import { DomainBar } from './DomainBar';
import { EnhancedCards } from './EnhancedCards';
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
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ShortcutHelpModal } from './ShortcutHelpModal';

import { Sparkles } from 'lucide-react';

export function Dashboard() {
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [showHelpModal, setShowHelpModal] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  const {
    items,
    setItems,
    q,
    setQ,
    domain,
    setDomain,
    view,
    setView,
    selectedItems,
    toggleItemSelection,
    selectAllItems,
    clearSelection,
    bulkUpdateStatus,
    bulkUpdatePriority,
    bulkUpdateOwner,
    bulkDelete,
    setStatus,
    setDetails,
    setUnit,
    setLink,
    setOwner,
    setDue,
    setPriority,
    setFriendlyTitle,
    addItem,
    importJSON,
    exportCSV,
    exportXLSX,
    bulkApplySourceLinks,
    saveToStorage,
    stats,
  } = useStore();

  const filtered = React.useMemo(() => filterItems(items, domain, q), [items, domain, q]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Call the save function
      await saveToStorage();
      
      // Show success feedback
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFocusSearch = () => {
    // Focus the search input in Toolbar
    const searchInput = document.querySelector('input[placeholder*="Cari"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  };

  const handleToggleView = () => {
    setView(view === 'cards' ? 'table' : 'cards');
  };

  const handleEscape = () => {
    if (selectedItems.length > 0) {
      clearSelection();
    } else {
      // Clear search
      setQ('');
      // Remove focus from any input
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filtered.length) {
      clearSelection();
    } else {
      selectAllItems(filtered.map(item => item.id));
    }
  };

  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    onSave: handleSave,
    onSearch: handleFocusSearch,
    onToggleView: handleToggleView,
    onEscape: handleEscape,
    onSelectAll: handleSelectAll,
    onHelp: () => setShowHelpModal(true),
  });

  

  return (
    <div className="min-h-screen text-neutral-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-cyan-50">
      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selectedItems.length}
        onClearSelection={clearSelection}
        onBulkUpdateStatus={bulkUpdateStatus}
        onBulkUpdatePriority={bulkUpdatePriority}
        onBulkUpdateOwner={bulkUpdateOwner}
        onBulkDelete={bulkDelete}
      />
      
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

        {/* Enhanced Dashboard Cards */}
        <EnhancedCards items={items} stats={stats} />

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
            <TableView items={filtered} setStatus={setStatus} setDetails={setDetails} setUnit={setUnit} setLink={setLink} setOwner={setOwner} setDue={setDue} setPriority={setPriority} setFriendlyTitle={setFriendlyTitle} setItems={setItems} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((it) => (
                <ItemCard
                  key={it.id}
                  item={it}
                  isSelected={selectedItems.includes(it.id)}
                  onSelect={() => toggleItemSelection(it.id)}
                  onStatus={(s) => setStatus(it.id, s)}
                  onDetails={(v) => setDetails(it.id, v)}
                  onUnit={(v) => setUnit(it.id, v)}
                  onLink={(v) => setLink(it.id, v)}
                  onOwner={(v) => setOwner(it.id, v)}
                  onDue={(v) => setDue(it.id, v)}
                  onPriority={(v) => setPriority(it.id, v)}
                  onFriendlyTitle={(v) => setFriendlyTitle(it.id, v)}
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

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-6"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <h3 className="font-semibold text-lg text-neutral-800">Simpan Perubahan</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  Klik tombol ini untuk menyimpan semua perubahan checklist secara permanen
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 flex items-center gap-2 ${
                    isSaving 
                      ? 'bg-neutral-400 cursor-not-allowed' 
                      : saveSuccess 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </>
                  ) : saveSuccess ? (
                    <>
                      ✅ Tersimpan!
                    </>
                  ) : (
                    <>
                      💾 Simpan Perubahan
                    </>
                  )}
                </button>
                
                {saveSuccess && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-green-600 font-medium text-sm"
                  >
                    Data berhasil disimpan! Persentase diperbarui secara otomatis.
                  </motion.div>
                )}
              </div>
              
              <div className="text-xs text-neutral-500 text-center">
                Progress: <span className="font-semibold text-blue-600">{stats.pct}%</span> ({stats.available}/{stats.total} item tersedia)
              </div>
            </div>
          </motion.div>
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
      
      {/* Keyboard Shortcuts Help Modal */}
      <ShortcutHelpModal 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
      />
    </div>
  );
}
