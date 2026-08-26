'use client';

import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  XCircle,
  Clock,
  DollarSign,
  Zap,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export type ChartType = 'rpm' | 'failures' | 'failure_rate' | 'tokens_cost' | 'latency';
export type TimeRange = '15m' | '1h' | '24h' | '7d';

export function SelectableAreaCharts() {
  const [activeChart, setActiveChart] = useState<ChartType>('rpm');
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');

  // Generate realistic data based on time range
  const getTimelineData = () => {
    if (timeRange === '15m') {
      const timestamps = ['10:45', '10:46', '10:47', '10:48', '10:49', '10:50', '10:51', '10:52', '10:53', '10:54', '10:55', '10:56', '10:57', '10:58', '10:59'];
      return timestamps.map((t, idx) => ({
        time: t,
        totalRpm: 120 + Math.round(Math.sin(idx) * 30) + idx * 3,
        allowRpm: 105 + Math.round(Math.sin(idx) * 25) + idx * 2,
        blockedRpm: 8 + (idx % 3 === 0 ? 9 : 2),
        modifyRpm: 6 + (idx % 2 === 0 ? 4 : 1),
        escalateRpm: 1 + (idx % 4 === 0 ? 3 : 0),
        injectionFailures: 3 + (idx % 3 === 0 ? 5 : 1),
        piiRedactions: 5 + (idx % 2 === 0 ? 4 : 2),
        secretsBlocked: 2 + (idx % 4 === 0 ? 3 : 0),
        financialEscalations: 1 + (idx % 5 === 0 ? 2 : 0),
        tokens: 42000 + idx * 1800,
        cost: 0.28 + idx * 0.02,
        p50Latency: 380 + Math.round(Math.sin(idx) * 40),
        p95Latency: 720 + Math.round(Math.cos(idx) * 80),
        p99Latency: 950 + Math.round(Math.sin(idx) * 120),
      }));
    }

    if (timeRange === '1h') {
      const timestamps = ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30', '10:35', '10:40', '10:45', '10:50', '10:55'];
      return timestamps.map((t, idx) => ({
        time: t,
        totalRpm: 240 + Math.round(Math.sin(idx * 0.8) * 60) + idx * 5,
        allowRpm: 205 + Math.round(Math.sin(idx * 0.8) * 50) + idx * 4,
        blockedRpm: 18 + (idx % 3 === 0 ? 14 : 4),
        modifyRpm: 12 + (idx % 2 === 0 ? 8 : 3),
        escalateRpm: 5 + (idx % 4 === 0 ? 6 : 1),
        injectionFailures: 8 + (idx % 3 === 0 ? 9 : 2),
        piiRedactions: 12 + (idx % 2 === 0 ? 7 : 3),
        secretsBlocked: 4 + (idx % 4 === 0 ? 5 : 1),
        financialEscalations: 3 + (idx % 5 === 0 ? 4 : 1),
        tokens: 88000 + idx * 4500,
        cost: 0.85 + idx * 0.08,
        p50Latency: 410 + Math.round(Math.sin(idx) * 50),
        p95Latency: 780 + Math.round(Math.cos(idx) * 90),
        p99Latency: 1050 + Math.round(Math.sin(idx) * 140),
      }));
    }

    if (timeRange === '24h') {
      const timestamps = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
      return timestamps.map((t, idx) => ({
        time: t,
        totalRpm: 320 + Math.round(Math.sin(idx * 0.5) * 120),
        allowRpm: 275 + Math.round(Math.sin(idx * 0.5) * 100),
        blockedRpm: 24 + (idx % 3 === 0 ? 18 : 6),
        modifyRpm: 16 + (idx % 2 === 0 ? 11 : 4),
        escalateRpm: 5 + (idx % 4 === 0 ? 7 : 2),
        injectionFailures: 14 + (idx % 3 === 0 ? 12 : 3),
        piiRedactions: 18 + (idx % 2 === 0 ? 10 : 4),
        secretsBlocked: 6 + (idx % 4 === 0 ? 8 : 2),
        financialEscalations: 4 + (idx % 5 === 0 ? 5 : 1),
        tokens: 145000 + idx * 8000,
        cost: 1.65 + idx * 0.18,
        p50Latency: 390 + Math.round(Math.sin(idx) * 30),
        p95Latency: 740 + Math.round(Math.cos(idx) * 70),
        p99Latency: 980 + Math.round(Math.sin(idx) * 100),
      }));
    }

    // 7d
    const timestamps = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return timestamps.map((t, idx) => ({
      time: t,
      totalRpm: 450 + Math.round(Math.sin(idx) * 180),
      allowRpm: 390 + Math.round(Math.sin(idx) * 150),
      blockedRpm: 35 + (idx % 2 === 0 ? 25 : 10),
      modifyRpm: 20 + (idx % 3 === 0 ? 15 : 5),
      escalateRpm: 8 + (idx % 2 === 0 ? 9 : 3),
      injectionFailures: 22 + (idx % 2 === 0 ? 16 : 5),
      piiRedactions: 28 + (idx % 3 === 0 ? 14 : 7),
      secretsBlocked: 9 + (idx % 2 === 0 ? 11 : 3),
      financialEscalations: 6 + (idx % 4 === 0 ? 8 : 2),
      tokens: 480000 + idx * 32000,
      cost: 5.4 + idx * 0.75,
      p50Latency: 420 + Math.round(Math.sin(idx) * 40),
      p95Latency: 790 + Math.round(Math.cos(idx) * 80),
      p99Latency: 1080 + Math.round(Math.sin(idx) * 130),
    }));
  };

  const data = getTimelineData();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
      {/* Top Header & Chart View Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              ControlPlane Telemetry & Area Observability
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select metrics and time windows to analyze throughput, failure vectors, and latency profiles
          </p>
        </div>

        {/* Time Window Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono font-semibold self-start md:self-auto">
          {(['15m', '1h', '24h', '7d'] as TimeRange[]).map((tr) => (
            <button
              key={tr}
              onClick={() => setTimeRange(tr)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === tr
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tr.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Selectable Chart Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setActiveChart('rpm')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 border ${
            activeChart === 'rpm'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Requests Per Minute (RPM)</span>
        </button>

        <button
          onClick={() => setActiveChart('failures')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 border ${
            activeChart === 'failures'
              ? 'bg-red-600 text-white border-red-600 shadow-sm shadow-red-500/20'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Total Failures & Interceptions</span>
        </button>

        <button
          onClick={() => setActiveChart('failure_rate')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 border ${
            activeChart === 'failure_rate'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-500/20'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Request Failure & Success Breakdown</span>
        </button>

        <button
          onClick={() => setActiveChart('tokens_cost')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 border ${
            activeChart === 'tokens_cost'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/20'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Token Velocity & Spend ($)</span>
        </button>

        <button
          onClick={() => setActiveChart('latency')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 border ${
            activeChart === 'latency'
              ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-500/20'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Latency Percentiles (p50 / p95 / p99)</span>
        </button>
      </div>

      {/* Main Area Chart Container */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5">
        {/* Dynamic Context Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
              {activeChart === 'rpm' && 'Live Request Rate (RPM Throughput)'}
              {activeChart === 'failures' && 'Interception Breakdown by Attack / Policy Vector'}
              {activeChart === 'failure_rate' && 'Decision Volume: Allowed vs Modified vs Blocked vs Escalated'}
              {activeChart === 'tokens_cost' && 'Token Consumption & Cumulative Compute Cost'}
              {activeChart === 'latency' && 'Latency SLA Distribution (Milliseconds)'}
            </span>
            <div className="text-[11px] text-slate-500">
              Granularity: {timeRange === '15m' ? '1-minute intervals' : timeRange === '1h' ? '5-minute intervals' : 'Hourly aggregation'}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {activeChart === 'rpm' && (
              <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Peak: {Math.max(...data.map((d) => d.totalRpm))} RPM
              </span>
            )}
            {activeChart === 'failures' && (
              <span className="text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Total Blocked: {data.reduce((sum, d) => sum + d.blockedRpm, 0)} Attacks
              </span>
            )}
            {activeChart === 'latency' && (
              <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                p95 Target: &lt;800ms
              </span>
            )}
          </div>
        </div>

        {/* 1. REQUESTS PER MINUTE (RPM) AREA CHART */}
        {activeChart === 'rpm' && (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTotalRpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAllowRpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorBlockedRpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="totalRpm"
                  name="Total Ingested RPM"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotalRpm)"
                />
                <Area
                  type="monotone"
                  dataKey="allowRpm"
                  name="Clean Dispatched RPM"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAllowRpm)"
                />
                <Area
                  type="monotone"
                  dataKey="blockedRpm"
                  name="Blocked Attacks RPM"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBlockedRpm)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 2. TOTAL FAILURES & INTERCEPTIONS AREA CHART */}
        {activeChart === 'failures' && (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorInjection" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPii" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorSecrets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="injectionFailures"
                  name="Prompt Injections & Jailbreaks Blocked"
                  stroke="#DC2626"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorInjection)"
                />
                <Area
                  type="monotone"
                  dataKey="piiRedactions"
                  name="PII Detections & Redactions (Modify)"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPii)"
                />
                <Area
                  type="monotone"
                  dataKey="secretsBlocked"
                  name="Credential & API Key Leaks Blocked"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSecrets)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 3. REQUEST FAILURE RATE VS SUCCESS AREA CHART */}
        {activeChart === 'failure_rate' && (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorDecAllow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDecModify" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDecBlock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDecEscalate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="allowRpm"
                  name="ALLOW Requests"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDecAllow)"
                />
                <Area
                  type="monotone"
                  dataKey="modifyRpm"
                  name="MODIFY (Sanitized)"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDecModify)"
                />
                <Area
                  type="monotone"
                  dataKey="blockedRpm"
                  name="BLOCK (Prevented)"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDecBlock)"
                />
                <Area
                  type="monotone"
                  dataKey="escalateRpm"
                  name="ESCALATE (Held)"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorDecEscalate)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 4. TOKEN CONSUMPTION & COST AREA CHART */}
        {activeChart === 'tokens_cost' && (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="tokens"
                  name="Tokens Processed"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTokens)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="cost"
                  name="Cumulative Cost ($ USD)"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCost)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 5. LATENCY PERCENTILES AREA CHART */}
        {activeChart === 'latency' && (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorP99" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorP95" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorP50" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#CBD5E1" unit="ms" />
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
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="p99Latency"
                  name="p99 Tail Latency (ms)"
                  stroke="#DC2626"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorP99)"
                />
                <Area
                  type="monotone"
                  dataKey="p95Latency"
                  name="p95 Latency (ms)"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorP95)"
                />
                <Area
                  type="monotone"
                  dataKey="p50Latency"
                  name="p50 Median Latency (ms)"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorP50)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
