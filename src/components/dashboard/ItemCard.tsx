
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Link as LinkIcon, Paperclip, Star, Trash2, UserCircle2 } from 'lucide-react';
import { DataItem, ItemStatus } from '@/lib/types';
import { DomainBadge } from './DomainBadge';
import { StatusPill } from './StatusPill';
import { DOMAIN_COLORS } from '@/lib/constants';
import { DOMAINS } from '@/lib/domains';

export function ItemCard({
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
                {DOMAINS.find((d) => d.id === item.domain)?.icon} {item.title}
                {item.priority === "High" && <Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
                {item.priority === "Medium" && <Star className="w-5 h-5 text-neutral-400" />}
                {item.priority === "Low" && <Star className="w-5 h-5 text-neutral-200" />}
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
