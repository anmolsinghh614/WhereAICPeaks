'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { DecisionDistributionChart } from '@/components/dashboard/DecisionDistributionChart';
import { TimeSeriesCharts } from '@/components/dashboard/TimeSeriesCharts';
import { LiveActivityFeed } from '@/components/dashboard/LiveActivityFeed';
import { DashboardMetrics, LiveActivityEvent, VirtualModel } from '@/types';
import {
  Activity,
  DollarSign,
  Zap,
  Clock,
  ShieldAlert,
  XCircle,
  UserCheck,
  Play,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentEvents, setRecentEvents] = useState<LiveActivityEvent[]>([]);
  const [virtualModels, setVirtualModels] = useState<VirtualModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard').then((r) => r.json()),
      fetch('/api/virtual-models').then((r) => r.json()),
    ])
      .then(([dashData, vmData]) => {
        setMetrics(dashData.metrics);
        setRecentEvents(dashData.recentEvents || []);
        setVirtualModels(vmData || []);
      })
      .catch((err) => console.error('Dashboard load error', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout
      title="Enterprise AI Estate Observability & Governance"
      subtitle="Centralized control plane managing real-time risk, cost bounds, and safety policies"
    >
      <div className="space-y-6">
        {/* Quick Launch Hero Banner */}
        <div className="bg-gradient-to-r from-cp-navy-900 via-indigo-950 to-cp-navy-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                PROTOTYPE ACTIVE
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {virtualModels.length} Active Virtual Endpoints
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">
              Test Real-Time Governance in the Playground
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
              Every AI interaction is evaluated for PII redaction, prompt injections, credential leaks, and cost caps before reaching foundation models.
            </p>
          </div>

          <Link
            href="/playground"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all shrink-0 group self-start md:self-auto"
          >
            <Play className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>Launch Playground</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 7 Top KPI Cards */}
        {loading || !metrics ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 p-4"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <KPICard
              label="Total Requests"
              value={metrics.totalRequests.toLocaleString()}
              subtext="Processed"
              icon={Activity}
              trend="+14.2%"
              trendPositive
              color="blue"
            />
            <KPICard
              label="Total Spend"
              value={`$${metrics.totalCost.toFixed(2)}`}
              subtext="Budget: $500"
              icon={DollarSign}
              trend={`${metrics.budgetUtilizationPct}% used`}
              trendPositive
              color="emerald"
            />
            <KPICard
              label="Total Tokens"
              value={`${(metrics.totalTokens / 1000000).toFixed(2)}M`}
              subtext="In & Out"
              icon={Zap}
              color="purple"
            />
            <KPICard
              label="Avg Latency"
              value={`${metrics.avgLatencyMs}ms`}
              subtext="p95: 890ms"
              icon={Clock}
              color="blue"
            />
            <KPICard
              label="Average Risk"
              value={`${metrics.avgRiskScore}/100`}
              subtext="Baseline Low"
              icon={ShieldAlert}
              color="amber"
            />
            <KPICard
              label="Blocked"
              value={metrics.blockedCount}
              subtext="Attacks foiled"
              icon={XCircle}
              color="red"
            />
            <KPICard
              label="Escalated"
              value={metrics.escalatedCount}
              subtext="Human review"
              icon={UserCheck}
              color="purple"
            />
          </div>
        )}

        {/* Main Charts & Live Feed Row */}
        {metrics && (
          <>
            <TimeSeriesCharts
              requestsTrend={metrics.requestsTrend}
              costTrend={metrics.costTrend}
              riskTrend={metrics.riskTrend}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Decision Distribution Donut */}
              <div className="lg:col-span-1">
                <DecisionDistributionChart distribution={metrics.decisionDistribution} />
              </div>

              {/* Real-time Live Activity Panel */}
              <div className="lg:col-span-2">
                <LiveActivityFeed initialEvents={recentEvents} />
              </div>
            </div>
          </>
        )}

        {/* Active Virtual Models Summary Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Active Virtual Endpoints ({virtualModels.length})
              </h3>
            </div>
            <Link
              href="/virtual-models"
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline"
            >
              Manage All Endpoints
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Virtual Model</th>
                  <th className="py-2.5 px-3">Provider</th>
                  <th className="py-2.5 px-3">Policy Attached</th>
                  <th className="py-2.5 px-3">Daily Spend / Cap</th>
                  <th className="py-2.5 px-3">Total Requests</th>
                  <th className="py-2.5 px-3">Avg Risk</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {virtualModels.map((vm) => {
                  const spendPct = Math.min(100, Math.round((vm.spentToday / vm.dailyBudget) * 100));
                  return (
                    <tr key={vm.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-sans font-semibold text-slate-900">
                        {vm.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200">
                          {vm.provider}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-indigo-700 font-sans font-medium">
                        {vm.policyId.replace('pol-', '').replace('-', ' ')}
                      </td>
                      <td className="py-3 px-3 text-slate-800">
                        ${vm.spentToday.toFixed(2)} / ${vm.dailyBudget.toFixed(2)}
                        <span className="text-[10px] text-slate-400 ml-1.5">({spendPct}%)</span>
                      </td>
                      <td className="py-3 px-3 text-slate-800 font-bold">
                        {vm.totalRequests.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            vm.avgRisk < 30
                              ? 'bg-emerald-100 text-emerald-800'
                              : vm.avgRisk < 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {vm.avgRisk}/100
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ACTIVE
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
