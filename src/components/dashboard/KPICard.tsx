'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  color?: 'blue' | 'emerald' | 'amber' | 'red' | 'purple';
}

export function KPICard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive,
  color = 'blue',
}: KPICardProps) {
  const iconColor =
    color === 'emerald'
      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
      : color === 'amber'
      ? 'bg-amber-50 text-amber-600 border-amber-100'
      : color === 'red'
      ? 'bg-red-50 text-red-600 border-red-100'
      : color === 'purple'
      ? 'bg-purple-50 text-purple-600 border-purple-100'
      : 'bg-blue-50 text-blue-600 border-blue-100';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${iconColor}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="mt-2">
        <div className="text-2xl font-black tracking-tight text-slate-900 font-mono">
          {value}
        </div>
        {(subtext || trend) && (
          <div className="flex items-center gap-1.5 mt-1 text-[11px]">
            {trend && (
              <span
                className={`font-semibold font-mono ${
                  trendPositive ? 'text-emerald-600' : 'text-slate-500'
                }`}
              >
                {trend}
              </span>
            )}
            {subtext && <span className="text-slate-400">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
