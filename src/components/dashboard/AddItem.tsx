
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataItem, DomainId } from '@/lib/types';
import { DOMAINS } from '@/lib/domains';

export function AddItem({ onAdd }: { onAdd: (p: Partial<DataItem>) => void }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [domain, setDomain] = useState<DomainId>("geology");
  const [unit, setUnit] = useState("—");
  return (
    <Card className="rounded-2xl border-dashed">
      <CardContent className="p-4 flex flex-col gap-3">
        <h4 className="font-medium">Tambah item kustom</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul item" />
          <Input value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Detail (opsional)" />
          <Select value={domain} onValueChange={(v: DomainId) => setDomain(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Domain" />
            </SelectTrigger>
            <SelectContent>
              {DOMAINS.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Format/Satuan" />
        </div>
        <div className="flex justify-end">
          <Button
            className="rounded-2xl"
            onClick={() => {
              if (!title.trim()) return;
              onAdd({ title, details, domain, unit });
              setTitle("");
              setDetails("");
              setDomain("geology");
              setUnit("—");
            }}
          >
            Tambah
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
