
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { DataItem, ItemStatus } from '@/lib/types';
import { DomainBadge } from './DomainBadge';

export function TableView({ items, setStatus, setDetails, setUnit, setLink, setOwner, setDue, setPriority, setFriendlyTitle, setItems }: any) {
  return (
    <div className="overflow-auto rounded-2xl border">
      <table className="min-w-[1200px] w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <th className="p-3 text-left">Domain</th>
            <th className="p-3 text-left">Judul Mudah Dipahami</th>
            <th className="p-3 text-left">Judul Teknis</th>
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
              <td className="p-3 min-w-[280px]">
                <Input 
                  className="font-semibold bg-blue-50 border-blue-200" 
                  value={it.friendlyTitle || ""} 
                  onChange={(e) => setFriendlyTitle(it.id, e.target.value)} 
                  placeholder="Judul yang mudah dipahami"
                />
              </td>
              <td className="p-3 min-w-[220px] text-xs text-neutral-600">{it.title}</td>
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
