
import React from 'react';
import { CheckCircle2, AlertTriangle, Circle } from 'lucide-react';
import { ItemStatus } from '@/lib/types';

export const StatusPill = ({ status }: { status: ItemStatus }) => {
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
