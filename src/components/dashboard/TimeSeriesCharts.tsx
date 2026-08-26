'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TimeSeriesProps {
  requestsTrend: number[];
  costTrend: number[];
  riskTrend: number[];
}

export function TimeSeriesCharts({ requestsTrend, costTrend, riskTrend }: TimeSeriesProps) {
  const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

  const chartData = hours.map((time, idx) => ({
    time,
    requests: requestsTrend[idx] || 350,
    cost: costTrend[idx] || 12.5,
    risk: riskTrend[idx] || 25,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Requests Volume Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Request Throughput Over Time
            </h3>
            <p className="text-[11px] text-slate-400">Total requests processed across all endpoints</p>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            24h Window
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} stroke="#E2E8F0" />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} stroke="#E2E8F0" />
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
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#2563EB"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRequests)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost & Risk Trend Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Spend ($ USD) & Average Risk Score
            </h3>
            <p className="text-[11px] text-slate-400">Token economics and governance telemetry</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Cost ($)
            </span>
            <span className="flex items-center gap-1 text-purple-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Risk Score
            </span>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} stroke="#E2E8F0" />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#94A3B8' }} stroke="#E2E8F0" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#94A3B8' }} stroke="#E2E8F0" />
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
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="cost"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="risk"
                stroke="#8B5CF6"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
