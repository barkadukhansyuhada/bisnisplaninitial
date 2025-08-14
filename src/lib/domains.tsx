
import React from 'react';
import { Layers3, Scale, Pickaxe, Factory, Truck, MapPin, BarChart3, FileText } from 'lucide-react';

export const DOMAINS = [
  { id: "geology", label: "Geologi & Eksplorasi", icon: <Layers3 className="w-4 h-4" /> },
  { id: "qc", label: "QC & Lab", icon: <Scale className="w-4 h-4" /> },
  { id: "mine", label: "Desain Tambang & Peledakan", icon: <Pickaxe className="w-4 h-4" /> },
  { id: "plant", label: "Pabrik & Utilitas", icon: <Factory className="w-4 h-4" /> },
  { id: "ops", label: "Fleet & Operasi", icon: <Truck className="w-4 h-4" /> },
  { id: "market", label: "Pasar & Logistik", icon: <MapPin className="w-4 h-4" /> },
  { id: "finance", label: "Keuangan & Kontrak", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "permits", label: "Perizinan & Lingkungan", icon: <FileText className="w-4 h-4" /> },
  { id: "governance", label: "Jadwal & Governance", icon: <FileText className="w-4 h-4" /> },
] as const;
