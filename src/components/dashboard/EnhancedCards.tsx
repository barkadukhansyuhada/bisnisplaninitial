import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock, TrendingUp, Star } from 'lucide-react';
import { DataItem } from '@/lib/types';
import { DOMAINS } from '@/lib/domains';

interface EnhancedCardsProps {
  items: DataItem[];
  stats: {
    total: number;
    available: number;
    missing: number;
    na: number;
    pct: number;
    perDomain: Array<{
      domain: string;
      available: number;
      missing: number;
      na: number;
      total: number;
      pct: number;
    }>;
  };
}

export function EnhancedCards({ items, stats }: EnhancedCardsProps) {
  // Get recent changes (items modified in last 24h - simulated with random)
  const recentChanges = React.useMemo(() => {
    return items
      .filter(item => item.status === 'available') // Simulate recent updates
      .slice(0, 3);
  }, [items]);

  // Get urgent items (due within 7 days)
  const urgentItems = React.useMemo(() => {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return items.filter(item => {
      if (!item.due) return false;
      const dueDate = new Date(item.due);
      return dueDate <= in7Days && dueDate >= now && item.status !== 'available';
    }).slice(0, 3);
  }, [items]);

  // Get top priority missing items
  const topPriorityMissing = React.useMemo(() => {
    return items
      .filter(item => item.status === 'missing' && item.priority === 'High')
      .slice(0, 3);
  }, [items]);

  const MiniProgressBar = ({ domain }: { domain: any }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium">{domain.domain}</span>
        <span>{domain.pct}%</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${domain.pct}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
      {/* Domain Progress Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="rounded-2xl h-full">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-lg">Progress per Domain</h3>
            </div>
            <div className="space-y-3">
              {stats.perDomain.slice(0, 5).map((domain, index) => (
                <MiniProgressBar key={index} domain={domain} />
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200">
              <div className="text-sm text-neutral-600">
                <span className="font-semibold text-green-600">{stats.available}</span> completed,{' '}
                <span className="font-semibold text-orange-600">{stats.missing}</span> pending
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Changes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="rounded-2xl h-full">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-lg">Recent Updates</h3>
            </div>
            <div className="space-y-3">
              {recentChanges.length > 0 ? (
                recentChanges.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg bg-green-50 border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-green-800 leading-tight">
                        {item.friendlyTitle || item.title}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Marked as available
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-neutral-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent updates</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Urgent Items */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="rounded-2xl h-full">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-lg">Urgent Items</h3>
            </div>
            <div className="space-y-3">
              {urgentItems.length > 0 ? (
                urgentItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg bg-orange-50 border border-orange-200">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-orange-800 leading-tight">
                        {item.friendlyTitle || item.title}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        Due: {item.due ? new Date(item.due).toLocaleDateString() : 'No date'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-neutral-500">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No urgent items</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Priority Missing */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="rounded-2xl h-full">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-lg">High Priority Missing</h3>
            </div>
            <div className="space-y-3">
              {topPriorityMissing.length > 0 ? (
                topPriorityMissing.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg bg-red-50 border border-red-200">
                    <Star className="w-4 h-4 text-red-500 fill-red-500 mt-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-red-800 leading-tight">
                        {item.friendlyTitle || item.title}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Owner: {item.owner || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-neutral-500">
                  <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No high priority missing items</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}