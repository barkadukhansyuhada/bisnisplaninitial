
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DOMAINS } from '@/lib/domains';
import { DOMAIN_COLORS } from '@/lib/constants';

export const DomainBadge = ({ domain }: { domain: string }) => {
  const d = DOMAINS.find((x) => x.id === domain);
  const c = DOMAIN_COLORS[domain] || { dot: "bg-neutral-400", ring: "ring-neutral-200" };
  return (
    <Badge variant="secondary" className={`gap-2 whitespace-nowrap ring ${c.ring}`}>
      <span className={`inline-block w-2.5 h-2.5 rounded-full ${c.dot}`} />
      {d?.label}
    </Badge>
  );
};
