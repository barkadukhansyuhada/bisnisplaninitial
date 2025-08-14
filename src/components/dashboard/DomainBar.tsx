
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COLORS } from '@/lib/constants';

export function DomainBar({ perDomain }: { perDomain: { domain: string; available: number; missing: number; na: number }[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <BarChart data={perDomain} margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="domain" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="available" stackId="a" name="Ada" fill={COLORS.success} />
          <Bar dataKey="missing" stackId="a" name="Kurang" fill={COLORS.warning} />
          <Bar dataKey="na" stackId="a" name="N/A" fill={COLORS.muted} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
