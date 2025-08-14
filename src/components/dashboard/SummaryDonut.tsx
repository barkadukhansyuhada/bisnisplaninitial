
import React from 'react';
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';
import { COLORS } from '@/lib/constants';

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
}

export function SummaryDonut({ stats }: { stats: { available: number; missing: number; na: number } }) {
  const data = [
    { name: "Ada", value: stats.available, fill: COLORS.success },
    { name: "Kurang", value: stats.missing, fill: COLORS.warning },
    { name: "N/A", value: stats.na, fill: COLORS.muted },
  ];
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie dataKey="value" data={data} innerRadius={48} outerRadius={72}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.fill as string} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={24} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


