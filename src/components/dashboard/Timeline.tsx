
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TIMELINE = [
  { id: "t1", name: "Pemboran inti + lab + model 3D", start: new Date(2025, 8, 1), end: new Date(2025, 10, 30), critical: false },
  { id: "t2", name: "AMDAL/UKL-UPL → Persetujuan Lingkungan", start: new Date(2025, 9, 1), end: new Date(2026, 0, 31), critical: true },
  { id: "t3", name: "SIPB (batuan)", start: new Date(2026, 0, 1), end: new Date(2026, 2, 31), critical: true },
  { id: "t4", name: "RKAB & persetujuan", start: new Date(2026, 3, 1), end: new Date(2026, 4, 31), critical: true },
  { id: "t5", name: "SMKP & organisasi KTT", start: new Date(2026, 3, 1), end: new Date(2026, 4, 31), critical: false },
  { id: "t6", name: "Engineering & pengadaan plant", start: new Date(2026, 5, 1), end: new Date(2026, 7, 31), critical: false },
  { id: "t7", name: "Pengadaan genset admin 60 kVA", start: new Date(2026, 5, 15), end: new Date(2026, 6, 15), critical: false },
  { id: "t8", name: "Konstruksi & instalasi", start: new Date(2026, 6, 1), end: new Date(2026, 7, 31), critical: false },
  { id: "t9", name: "Commissioning plant + SOP", start: new Date(2026, 8, 1), end: new Date(2026, 8, 30), critical: true },
];

export function Timeline() {
  const [tasks, setTasks] = useState(TIMELINE);
  const start0 = tasks[0].start.getTime();
  const endLast = tasks[tasks.length - 1].end.getTime();
  const total = endLast - start0;
  const toggleCritical = (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, critical: !t.critical } : t)));
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Timeline 18 Bulan</h3>
          <Badge className="bg-rose-100 text-rose-700">Klik bar untuk toggle Critical</Badge>
        </div>
        <div className="space-y-3">
          {tasks.map((t) => {
            const left = ((t.start.getTime() - start0) / total) * 100;
            const width = ((t.end.getTime() - t.start.getTime()) / total) * 100;
            return (
              <div key={t.id} className="">
                <div className="text-sm text-neutral-700 mb-1 flex items-center gap-2">
                  {t.critical && <span className="text-rose-600">⚡</span>}
                  {t.name}
                </div>
                <div className="h-3 bg-neutral-100 rounded-full relative overflow-hidden">
                  <button
                    className={`h-3 rounded-full absolute ${t.critical ? "bg-rose-500" : "bg-neutral-800/70"} hover:opacity-90`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    onClick={() => toggleCritical(t.id)}
                    aria-label="toggle critical"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
