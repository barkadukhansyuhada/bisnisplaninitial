
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Sparkles, Paperclip, Trash2 } from 'lucide-react';
import { DataItem } from '@/lib/types';

export function UploadCenter({ items, addFiles, files, remove, attach }: any) {
  const [hover, setHover] = useState(false);
  const [targetItem, setTargetItem] = useState<string>("");
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-neutral-600" />
            <h3 className="font-semibold text-lg">Upload Center</h3>
          </div>
          <Badge variant="outline" className="gap-1">
            <Sparkles className="w-3.5 h-3.5" /> drag & drop
          </Badge>
        </div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setHover(true);
          }}
          onDragLeave={() => setHover(false)}
          onDrop={(e) => {
            e.preventDefault();
            setHover(false);
            if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
          }}
          className={`h-36 rounded-2xl border-2 border-dashed flex items-center justify-center text-neutral-500 ${hover ? "border-blue-400 bg-blue-50" : "border-neutral-300"}`}
        >
          Drop files here atau klik tombol di bawah
        </div>
        <div className="flex items-center gap-2">
          <input id="fileInput" type="file" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
          <Button onClick={() => document.getElementById("fileInput")?.click()}>Browse Files</Button>
          <Select value={targetItem} onValueChange={setTargetItem}>
            <SelectTrigger className="w-80">
              <SelectValue placeholder="Pilih item untuk attach" />
            </SelectTrigger>
            <SelectContent>
              {items.map((i: DataItem) => (
                <SelectItem value={i.id} key={i.id}>
                  {i.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          {files.length === 0 ? (
            <div className="text-sm text-neutral-500">Belum ada file diupload.</div>
          ) : (
            files.map((f: any) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-xl border bg-white">
                <div className="flex items-center gap-3">
                  <Paperclip className="w-4 h-4 text-neutral-500" />
                  <div>
                    <div className="font-medium text-sm">{f.name}</div>
                    <div className="text-xs text-neutral-500">
                      {(f.size / 1024).toFixed(1)} KB • {f.type || "unknown"} {f.attachedTo ? `• attached to ${items.find((x: DataItem) => x.id === f.attachedTo)?.title}` : ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={f.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                    Open
                  </a>
                  <Button variant="outline" size="sm" onClick={() => targetItem && attach(f.id, targetItem)}>
                    Attach to selected
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(f.id)}>
                    <Trash2 className="w-4 h-4 text-neutral-500" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
