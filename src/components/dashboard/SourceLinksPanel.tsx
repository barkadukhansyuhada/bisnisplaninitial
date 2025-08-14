
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2 } from "lucide-react";
import { SourceMap } from "@/lib/types";

export function SourceLinksPanel({ onApply }: { onApply: (src: SourceMap) => void }) {
  const [src, setSrc] = useState<SourceMap>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem("galianc_sources") || "{}");
    } catch {
      return {};
    }
  });
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("galianc_sources", JSON.stringify(src));
  }, [src]);
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-neutral-600" />
            <h3 className="font-semibold text-lg">Source Links (Google Drive)</h3>
          </div>
          <Badge variant="outline">Auto-attach</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="text-xs text-neutral-500">Laporan Geolistrik Hanjuang</div>
            <Input value={src.geo || ""} onChange={(e) => setSrc((s) => ({ ...s, geo: e.target.value }))} placeholder="Tempel URL Google Drive / viewer" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-neutral-500">Form Nilai Abrasi (Split 1–2)</div>
            <Input value={src.laa || ""} onChange={(e) => setSrc((s) => ({ ...s, laa: e.target.value }))} placeholder="Tempel URL Google Drive / viewer" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-neutral-500">Resume Hasil Pengujian</div>
            <Input value={src.resume || ""} onChange={(e) => setSrc((s) => ({ ...s, resume: e.target.value }))} placeholder="Tempel URL Google Drive / viewer" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setSrc({})}>Reset</Button>
          <Button onClick={() => onApply(src)}>Apply to checklist</Button>
        </div>
        <p className="text-xs text-neutral-500">
          Tip: Setelah apply, setiap item terkait akan menampilkan tombol <span className="underline">Buka</span> untuk membuka dokumen.
        </p>
      </CardContent>
    </Card>
  );
}
