
import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HelpCircle } from "lucide-react";

// Helper function to format numbers, assuming it's defined elsewhere or here.
function numberFmt(n: number, decimals: number = 0) {
  return n.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

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

function SliderInput({ label, value, min, max, step, onChange, unit }: { label: string; value: number; min: number; max: number; step: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; unit: string; }) {
    return (
        <div className="flex flex-col space-y-1">
            <label htmlFor={label} className="text-sm font-medium text-neutral-700 flex justify-between">
                <span>{label}</span>
                <span className="font-bold">{value} {unit}</span>
            </label>
            <Input id={label} type="range" min={min} max={max} step={step} value={value} onChange={onChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
        </div>
    );
}


function useFinancialModel() {
  // Production inputs
  const [excavators, setExcavators] = useState(5);
  const [trucks, setTrucks] = useState(10);
  const [hoursPerDay, setHoursPerDay] = useState(8);

  // Financial inputs
  const [price, setPrice] = useState(120_000);
  const [fuelPrice, setFuelPrice] = useState(12_000); // Harga solar per liter
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
  const [corporateTaxRate, setCorporateTaxRate] = useState(22);

  const res = useMemo(() => {
    // Production & Fuel Calculations
    const DAYS_PER_YEAR = 300;
    const EXCAVATOR_PRODUCTIVITY = 83.31; // m³/jam
    const TRUCK_PRODUCTIVITY = 30; // m³/jam
    const EXCAVATOR_FUEL_CONSUMPTION = 20; // L/jam
    const TRUCK_FUEL_CONSUMPTION = 18.9; // L/jam

    const annualExcaVolume = excavators * EXCAVATOR_PRODUCTIVITY * hoursPerDay * DAYS_PER_YEAR;
    const annualTruckVolume = trucks * TRUCK_PRODUCTIVITY * hoursPerDay * DAYS_PER_YEAR;
    const achievableVolume = Math.min(annualExcaVolume, annualTruckVolume);

    const fuelExcavators = excavators * EXCAVATOR_FUEL_CONSUMPTION * hoursPerDay * DAYS_PER_YEAR;
    const fuelTrucks = trucks * TRUCK_FUEL_CONSUMPTION * hoursPerDay * DAYS_PER_YEAR;
    const totalFuelLiters = fuelExcavators + fuelTrucks;
    const totalFuelCost = totalFuelLiters * fuelPrice;
    
    // This is now a calculated cost, not a per-m3 input
    const fuelPerM3 = achievableVolume > 0 ? totalFuelCost / achievableVolume : 0;

    // Financial Calculations
    const volume = achievableVolume; // Use calculated volume
    const revenue = volume * price;
    const energyPerM3 = energyKwhPerM3 * tariff;
    // Variable cost now uses the calculated fuel cost
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

    return {
      // Production results
      annualExcaVolume, annualTruckVolume, achievableVolume,
      fuelExcavators, fuelTrucks, totalFuelLiters, totalFuelCost,
      // Financial results
      revenue, energyPerM3, varPerM3, varTotal, fixedTotal, opex, ebitda, ebit, depr, ebitdaMargin, pbt, tax, netProfit
    };
  }, [excavators, trucks, hoursPerDay, price, fuelPrice, energyKwhPerM3, tariff, royalty, blasting, spares, payroll, overhead, env, sgaPct, gensetAdmin, capex, deprYears, corporateTaxRate]);

  return {
    state: {
      excavators, trucks, hoursPerDay, price, fuelPrice, energyKwhPerM3, tariff, royalty, blasting, spares, payroll, overhead, env, sgaPct, gensetAdmin, capex, deprYears, corporateTaxRate,
      // Pass calculated volume to state for display
      volume: res.achievableVolume,
      fuelPerM3: res.fuelPerM3,
    },
    set: {
      setExcavators, setTrucks, setHoursPerDay, setPrice, setFuelPrice, setEnergyKwhPerM3, setTariff, setRoyalty, setBlasting, setSpares, setPayroll, setOverhead, setEnv, setSgaPct, setGensetAdmin, setCapex, setDeprYears, setCorporateTaxRate
    },
    res
  };
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
      <CardContent className="p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Financial & Production Model</h3>
          <Badge variant="outline">Interactive</Badge>
        </div>

        {/* Production Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <SliderInput label="Jumlah Excavator" value={state.excavators} min={1} max={20} step={1} onChange={(e) => set.setExcavators(parseInt(e.target.value))} unit="unit" />
            <SliderInput label="Jumlah Dump Truck" value={state.trucks} min={1} max={20} step={1} onChange={(e) => set.setTrucks(parseInt(e.target.value))} unit="unit" />
            <SliderInput label="Jam Operasi / Hari" value={state.hoursPerDay} min={4} max={24} step={1} onChange={(e) => set.setHoursPerDay(parseInt(e.target.value))} unit="jam" />
        </div>
        
        {/* Production & Fuel Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Kapasitas Excavator" value={`${numberFmt(res.annualExcaVolume)} m³/thn`} tooltipText="Kapasitas gali tahunan berdasarkan jumlah excavator." />
            <Stat label="Kapasitas Angkut" value={`${numberFmt(res.annualTruckVolume)} m³/thn`} tooltipText="Kapasitas angkut tahunan berdasarkan jumlah dump truck." />
            <Stat label="Total Solar" value={`${numberFmt(res.totalFuelLiters)} L/thn`} tooltipText="Total konsumsi solar untuk excavator dan dump truck per tahun." />
            <Stat label="Biaya Solar" value={`Rp ${numberFmt(res.totalFuelCost)}`} tooltipText="Total biaya solar per tahun." />
        </div>

        <Separator />

        {/* Financial Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <Input type="text" value={numberFmt(state.volume)} readOnly placeholder="Volume (m³)" className="bg-gray-100" />
            <Tooltip text="Total volume produksi per tahun (dihitung dari kapasitas minimum antara excavator dan truk).">
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
            <Input type="text" value={numberFmt(state.fuelPrice)} onChange={(e) => set.setFuelPrice(parseInt(e.target.value.replace(/\./g, '') || "0"))} placeholder="Harga Solar (Rp/L)" />
            <Tooltip text="Harga bahan bakar solar per liter dalam Rupiah (Rp).">
              <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Input type="text" value={numberFmt(state.energyKwhPerM3, 1)} onChange={(e) => set.setEnergyKwhPerM3(parseFloat(e.target.value.replace(/\./g, '').replace(/,/g, '.') || "0"))} placeholder="Energi (kWh/m³)" />
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
              <Input type="text" value={numberFmt(state.sgaPct, 1)} onChange={(e) => set.setSgaPct(parseFloat(e.target.value.replace(/\./g, '').replace(/,/g, '.') || "0"))} placeholder="SG&A (%)" />
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
        {/* Financial Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Revenue (Rp)" value={"Rp " + numberFmt(res.revenue)} tooltipText="Total pendapatan dari penjualan produk dalam Rupiah (Rp)." />
          <Stat label="Variabel/m³ (Rp)" value={numberFmt(res.varPerM3)} tooltipText="Biaya variabel per meter kubik produksi (termasuk biaya solar yang dihitung otomatis)." />
          <Stat label="Opex Total (Rp)" value={"Rp " + numberFmt(res.opex)} tooltipText="Total biaya operasional (variabel + tetap) dalam Rupiah (Rp)." />
          <Stat label="EBITDA (Rp)" value={"Rp " + numberFmt(res.ebitda)} tooltipText="Laba sebelum bunga, pajak, depresiasi, dan amortisasi dalam Rupiah (Rp)." />
          <Stat label="EBITDA Margin" value={numberFmt(res.ebitdaMargin * 100, 1) + "%"} tooltipText="Persentase EBITDA terhadap pendapatan." />
          <Stat label="Depresiasi (Rp)" value={"Rp " + numberFmt(res.depr)} tooltipText="Penyusutan nilai aset per tahun dalam Rupiah (Rp)." />
          <Stat label="EBIT (Rp)" value={"Rp " + numberFmt(res.ebit)} tooltipText="Laba sebelum bunga dan pajak dalam Rupiah (Rp)." />
          <Stat label="Laba Bersih (Rp)" value={"Rp " + numberFmt(res.netProfit)} tooltipText="Laba setelah dikurangi pajak dalam Rupiah (Rp)." />
        </div>
      </CardContent>
    </Card>
  );
}
