'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DecisionDistributionProps {
  distribution: {
    allow: number;
    modify: number;
    block: number;
    escalate: number;
  };
}

export function DecisionDistributionChart({ distribution }: DecisionDistributionProps) {
  const data = [
    { name: 'ALLOW', value: distribution.allow, color: '#10B981' },
    { name: 'MODIFY', value: distribution.modify, color: '#F59E0B' },
    { name: 'BLOCK', value: distribution.block, color: '#EF4444' },
    { name: 'ESCALATE', value: distribution.escalate, color: '#8B5CF6' },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Decision Distribution
        </h3>
        <span className="text-[10px] font-mono text-slate-400">Total: {total.toLocaleString()}</span>
      </div>

      <div className="h-44 w-full relative my-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={48}
              outerRadius={68}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                borderColor: '#1E293B',
                color: '#F8FAFC',
                borderRadius: '8px',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs font-bold text-slate-400 uppercase">Passed</span>
          <span className="text-base font-extrabold text-slate-900 font-mono">
            {Math.round(((distribution.allow + distribution.modify) / (total || 1)) * 100)}%
          </span>
        </div>
      </div>

      {/* Legend & Breakdown */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between p-1.5 rounded bg-slate-50">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[11px] font-semibold text-slate-700">{item.name}</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-slate-900">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
