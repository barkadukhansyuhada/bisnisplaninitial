
import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { numberFmt } from "@/lib/utils";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
}

function useFinancialModel() {
  const [volume, setVolume] = useState(500_000);
  const [price, setPrice] = useState(120_000);
  const [fuelPerM3, setFuelPerM3] = useState(22464);
  const [energyKwhPerM3, setEnergyKwhPerM3] = useState(4);
  const [tariff, setTariff] = useState(1444);
  const [royalty, setRoyalty] = useState(3000);
  const [blasting, setBlasting] = useState(5000);
  const [spares, setSpares] = useState(8000);
  const [payroll, setPayroll] = useState(3_000_000_000);
  const [overhead, setOverhead] = useState(1_000_000_000);
  const [env, setEnv] = useState(500_000_000);
  const [sgaPct, setSgaPct] = useState(1);
  const [gensetAdmin, setGensetAdmin] = useState(32_400_000);
  const [capex, setCapex] = useState(37_350_000_000);
  const [deprYears, setDeprYears] = useState(5);

  const res = useMemo(() => {
    const revenue = volume * price;
    const energyPerM3 = energyKwhPerM3 * tariff;
    const varPerM3 = fuelPerM3 + energyPerM3 + royalty + blasting + spares;
    const varTotal = varPerM3 * volume;
    const sga = (sgaPct / 100) * revenue;
    const fixedTotal = payroll + overhead + env + gensetAdmin + sga;
    const opex = varTotal + fixedTotal;
    const ebitda = revenue - opex;
    const depr = capex / deprYears;
    const ebit = ebitda - depr;
    const ebitdaMargin = revenue ? ebitda / revenue : 0;
    return { revenue, energyPerM3, varPerM3, varTotal, fixedTotal, opex, ebitda, ebit, depr, ebitdaMargin };
  }, [volume, price, fuelPerM3, energyKwhPerM3, tariff, royalty, blasting, spares, payroll, overhead, env, sgaPct, gensetAdmin, capex, deprYears]);

  return { state: { volume, price, fuelPerM3, energyKwhPerM3, tariff, royalty, blasting, spares, payroll, overhead, env, sgaPct, gensetAdmin, capex, deprYears }, set: { setVolume, setPrice, setFuelPerM3, setEnergyKwhPerM3, setTariff, setRoyalty, setBlasting, setSpares, setPayroll, setOverhead, setEnv, setSgaPct, setGensetAdmin, setCapex, setDeprYears }, res };
}

function numberFmt(n: number) {
  return n.toLocaleString("id-ID");
}

export function FinancialPanel() {
  const { state, set, res } = useFinancialModel();
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Financial Quick Model</h3>
          <Badge variant="outline">Editable</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input type="text" value={numberFmt(state.volume)} onChange={(e) => set.setVolume(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Volume (m³)" />
          <Input type="text" value={numberFmt(state.price)} onChange={(e) => set.setPrice(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Harga (Rp/m³)" />
          <Input type="text" value={numberFmt(state.fuelPerM3)} onChange={(e) => set.setFuelPerM3(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Fuel (Rp/m³)" />
          <div className="grid grid-cols-2 gap-2">
            <Input type="text" value={numberFmt(state.energyKwhPerM3)} onChange={(e) => set.setEnergyKwhPerM3(parseFloat(e.target.value.replace(/\./g, '').replace(/,/g, '.') || "0"))} placeholder="Energi (kWh/m³)" />
            <Input type="text" value={numberFmt(state.tariff)} onChange={(e) => set.setTariff(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Tarif (Rp/kWh)" />
          </div>
          <Input type="text" value={numberFmt(state.royalty)} onChange={(e) => set.setRoyalty(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Royalti (Rp/m³)" />
          <Input type="text" value={numberFmt(state.blasting)} onChange={(e) => set.setBlasting(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Peledakan (Rp/m³)" />
          <Input type="text" value={numberFmt(state.spares)} onChange={(e) => set.setSpares(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Spare (Rp/m³)" />
          <Input type="text" value={numberFmt(state.payroll)} onChange={(e) => set.setPayroll(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Payroll (Rp/thn)" />
          <Input type="text" value={numberFmt(state.overhead)} onChange={(e) => set.setOverhead(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Overhead (Rp/thn)" />
          <Input type="text" value={numberFmt(state.env)} onChange={(e) => set.setEnv(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Lingkungan/CSR (Rp/thn)" />
          <div className="grid grid-cols-2 gap-2">
            <Input type="text" value={numberFmt(state.sgaPct)} onChange={(e) => set.setSgaPct(parseFloat(e.target.value.replace(/\./g, '').replace(/,/g, '.') || "0"))} placeholder="SG&A (%)" />
            <Input type="text" value={numberFmt(state.gensetAdmin)} onChange={(e) => set.setGensetAdmin(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Genset admin (Rp/thn)" />
          </div>
          <Input type="text" value={numberFmt(state.capex)} onChange={(e) => set.setCapex(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="CAPEX (Rp)" />
          <Input type="text" value={numberFmt(state.deprYears)} onChange={(e) => set.setDeprYears(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Depresiasi (tahun)" />
        </div>
        <Separator />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Revenue (Rp)" value={"Rp " + numberFmt(res.revenue)} />
          <Stat label="Variabel/m³ (Rp)" value={numberFmt(res.varPerM3)} />
          <Stat label="Opex Total (Rp)" value={"Rp " + numberFmt(res.opex)} />
          <Stat label="EBITDA (Rp)" value={"Rp " + numberFmt(res.ebitda)} />
          <Stat label="EBITDA Margin" value={(res.ebitdaMargin * 100).toFixed(1) + "%"} />
          <Stat label="Depresiasi (Rp)" value={"Rp " + numberFmt(res.depr)} />
          <Stat label="EBIT (Rp)" value={"Rp " + numberFmt(res.ebit)} />
        </div>
      </CardContent>
    </Card>
  );
}
