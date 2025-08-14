
import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { numberFmt } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

function Stat({ label, value, tooltipText }: { label: string; value: string; tooltipText?: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-xl font-semibold flex items-center gap-1">
        {value}
        {tooltipText && (
          <Tooltip text={tooltipText}>
            <HelpCircle className="w-4 h-4 text-neutral-400 cursor-help" />
          </Tooltip>
        )}
      </span>
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
  const [corporateTaxRate, setCorporateTaxRate] = useState(22); // Example: 22% for Indonesia

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
    const pbt = ebit; // Profit Before Tax
    const tax = pbt > 0 ? (pbt * corporateTaxRate) / 100 : 0;
    const netProfit = pbt - tax;

    return { revenue, energyPerM3, varPerM3, varTotal, fixedTotal, opex, ebitda, ebit, depr, ebitdaMargin, pbt, tax, netProfit };
  }, [volume, price, fuelPerM3, energyKwhPerM3, tariff, royalty, blasting, spares, payroll, overhead, env, sgaPct, gensetAdmin, capex, deprYears, corporateTaxRate]);

  return { state: { volume, price, fuelPerM3, energyKwhPerM3, tariff, royalty, blasting, spares, payroll, overhead, env, sgaPct, gensetAdmin, capex, deprYears, corporateTaxRate }, set: { setVolume, setPrice, setFuelPerM3, setEnergyKwhPerM3, setTariff, setRoyalty, setBlasting, setSpares, setPayroll, setOverhead, setEnv, setSgaPct, setGensetAdmin, setCapex, setDeprYears, setCorporateTaxRate }, res };
}

function numberFmt(n: number) {
  return n.toLocaleString("id-ID");
}

function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <span className="relative group">
      {children}
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {text}
      </span>
    </span>
  );
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
          <div className="flex items-center gap-2">
            <Input type="text" value={numberFmt(state.volume)} onChange={(e) => set.setVolume(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Volume (m³)" />
            <Tooltip text="Total volume produksi per tahun dalam meter kubik (m³).">
              <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Input type="text" value={numberFmt(state.price)} onChange={(e) => set.setPrice(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Harga (Rp/m³)" />
            <Tooltip text="Harga jual rata-rata per meter kubik dalam Rupiah (Rp).">
              <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Input type="text" value={numberFmt(state.fuelPerM3)} onChange={(e) => set.setFuelPerM3(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Fuel (Rp/m³)" />
            <Tooltip text="Biaya bahan bakar per meter kubik produksi dalam Rupiah (Rp).">
              <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Input type="text" value={numberFmt(state.energyKwhPerM3)} onChange={(e) => set.setEnergyKwhPerM3(parseFloat(e.target.value.replace(/\./g, '').replace(/,/g, '.') || "0"))} placeholder="Energi (kWh/m³)" />
              <Tooltip text="Konsumsi energi listrik per meter kubik produksi dalam kilowatt-jam (kWh).">
                <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <Input type="text" value={numberFmt(state.tariff)} onChange={(e) => set.setTariff(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Tarif (Rp/kWh)" />
              <Tooltip text="Tarif listrik per kilowatt-jam dalam Rupiah (Rp).">
                <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input type="text" value={numberFmt(state.royalty)} onChange={(e) => set.setRoyalty(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Royalti (Rp/m³)" />
            <Tooltip text="Biaya royalti per meter kubik produksi dalam Rupiah (Rp).">
              <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Input type="text" value={numberFmt(state.blasting)} onChange={(e) => set.setBlasting(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Peledakan (Rp/m³)" />
            <Tooltip text="Biaya peledakan per meter kubik produksi dalam Rupiah (Rp).">
              <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Input type="text" value={numberFmt(state.spares)} onChange={(e) => set.setSpares(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Spare (Rp/m³)" />
            <Tooltip text="Biaya suku cadang per meter kubik produksi dalam Rupiah (Rp).">
              <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Input type="text" value={numberFmt(state.payroll)} onChange={(e) => set.setPayroll(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Payroll (Rp/thn)" />
            <Tooltip text="Total biaya gaji karyawan per tahun dalam Rupiah (Rp).">
              <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Input type="text" value={numberFmt(state.overhead)} onChange={(e) => set.setOverhead(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Overhead (Rp/thn)" />
            <Tooltip text="Total biaya overhead operasional per tahun dalam Rupiah (Rp).">
              <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Input type="text" value={numberFmt(state.env)} onChange={(e) => set.setEnv(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Lingkungan/CSR (Rp/thn)" />
            <Tooltip text="Biaya lingkungan dan CSR per tahun dalam Rupiah (Rp).">
              <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Input type="text" value={numberFmt(state.sgaPct)} onChange={(e) => set.setSgaPct(parseFloat(e.target.value.replace(/\./g, '').replace(/,/g, '.') || "0"))} placeholder="SG&A (%)" />
              <Tooltip text="Persentase biaya penjualan, umum, dan administrasi (SG&A) dari pendapatan.">
                <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <Input type="text" value={numberFmt(state.gensetAdmin)} onChange={(e) => set.setGensetAdmin(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Genset admin (Rp/thn)" />
              <Tooltip text="Biaya operasional genset untuk administrasi per tahun dalam Rupiah (Rp).">
                <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
              </Tooltip>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input type="text" value={numberFmt(state.capex)} onChange={(e) => set.setCapex(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="CAPEX (Rp)" />
            <Tooltip text="Total pengeluaran modal (Capital Expenditure) dalam Rupiah (Rp).">
              <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Input type="text" value={numberFmt(state.deprYears)} onChange={(e) => set.setDeprYears(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Depresiasi (tahun)" />
            <Tooltip text="Jumlah tahun untuk depresiasi aset.">
              <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Input type="text" value={numberFmt(state.corporateTaxRate)} onChange={(e) => set.setCorporateTaxRate(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Pajak Korporasi (%)" />
            <Tooltip text="Tarif pajak korporasi dalam persen (%).">
              <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
            </Tooltip>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Revenue (Rp)" value={"Rp " + numberFmt(res.revenue)} tooltipText="Total pendapatan dari penjualan produk dalam Rupiah (Rp)." />
          <Stat label="Variabel/m³ (Rp)" value={numberFmt(res.varPerM3)} tooltipText="Biaya variabel per meter kubik produksi dalam Rupiah (Rp)." />
          <Stat label="Opex Total (Rp)" value={"Rp " + numberFmt(res.opex)} tooltipText="Total biaya operasional (variabel + tetap) dalam Rupiah (Rp)." />
          <Stat label="EBITDA (Rp)" value={"Rp " + numberFmt(res.ebitda)} tooltipText="Laba sebelum bunga, pajak, depresiasi, dan amortisasi dalam Rupiah (Rp)." />
          <Stat label="EBITDA Margin" value={(res.ebitdaMargin * 100).toFixed(1) + "%"} tooltipText="Persentase EBITDA terhadap pendapatan." />
          <Stat label="Depresiasi (Rp)" value={"Rp " + numberFmt(res.depr)} tooltipText="Penyusutan nilai aset per tahun dalam Rupiah (Rp)." />
          <Stat label="EBIT (Rp)" value={"Rp " + numberFmt(res.ebit)} tooltipText="Laba sebelum bunga dan pajak dalam Rupiah (Rp)." />
          <Stat label="Laba Bersih (Rp)" value={"Rp " + numberFmt(res.netProfit)} tooltipText="Laba setelah dikurangi pajak dalam Rupiah (Rp)." />
        </div>
      </CardContent>
    </Card>
  );
}
