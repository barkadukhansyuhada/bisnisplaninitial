
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COLORS } from '@/lib/constants';
import { DOMAINS } from '@/lib/domains';

export function DomainBar({ perDomain, selectedDomain, onDomainChange }: { perDomain: { domain: string; available: number; missing: number; na: number }[]; selectedDomain: string; onDomainChange: (domain: string) => void }) {
  return (
    <div className="h-56 w-full">
      <div className="flex justify-end mb-4">
        <Select value={selectedDomain} onValueChange={onDomainChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Domains</SelectItem>
            {DOMAINS.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
