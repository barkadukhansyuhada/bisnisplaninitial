
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Bug } from "lucide-react";
import { buildCSV, filterItems, mapSourceLinks, numberFmt } from "@/lib/utils";
import { DataItem } from "@/lib/types";

export function TestPanel() {
  type Result = { name: string; pass: boolean; message?: string };
  const tests: Result[] = [];

  // Test 1: CSV quoting & newline join
  const sample: DataItem[] = [
    { id: "t1", domain: "geology", title: 'A "quote",comma', details: "", unit: "—", status: "available", owner: "", due: "", priority: "Medium", link: "" },
  ];
  const csv1 = buildCSV(sample);
  const expected1 = '"domain","title","details","unit","status","owner","due","priority","link"\n"geology","A ""quote"",comma","","—","available","","","Medium",""';
  tests.push({ name: "CSV escaping + newline", pass: csv1 === expected1, message: csv1 });

  // Test 2: filter by domain
  const items: DataItem[] = [
    { id: "a", domain: "geology", title: "Rock sample", status: "available", unit: "—" },
    { id: "b", domain: "qc", title: "Sand sieve", status: "missing", unit: "—" },
  ];
  const f1 = filterItems(items, "geology", "");
  tests.push({ name: "Filter domain", pass: f1.length === 1 });

  // Test 3: search case-insensitive
  const f2 = filterItems(items, "all", "SAND");
  tests.push({ name: "Search insensitive", pass: f2.length === 1 && f2[0].id === "b" });

  // Test 4: number format id-ID
  tests.push({ name: "numberFmt locale", pass: numberFmt(1234567) === "1.234.567" });

  // Test 5: map source links
  const srcApplied = mapSourceLinks([{ id: "gl_resistivity", domain: "geology", title: "t", status: "available" } as DataItem], { geo: "https://drive" });
  tests.push({ name: "Map source → link", pass: srcApplied[0].link === "https://drive" });

  const allPass = tests.every((t) => t.pass);
  const [open, setOpen] = useState(false);

  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4" />
            <span className="font-semibold">Dev Tests</span>
            <Badge className={allPass ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}>{allPass ? "All pass" : "Check failures"}</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Hide" : "Show"}
          </Button>
        </div>
        {open && (
          <div className="mt-3 space-y-2">
            {tests.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg border bg-white">
                <div className="flex items-center gap-2">
                  {t.pass ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                  <span>{t.name}</span>
                </div>
                {!t.pass && t.message ? <code className="text-xs text-rose-700 break-all">{t.message}</code> : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
