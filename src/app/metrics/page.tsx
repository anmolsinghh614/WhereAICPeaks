'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardMetrics, GuardrailMetric, ModelUsageMetric, TeamUsageMetric, UserUsageMetric } from '@/types';
import { KPICard } from '@/components/dashboard/KPICard';
import { DecisionDistributionChart } from '@/components/dashboard/DecisionDistributionChart';
import { SelectableAreaCharts } from '@/components/metrics/SelectableAreaCharts';
import { GroupedMetricsView } from '@/components/metrics/GroupedMetricsView';
import {
  BarChart3,
  Activity,
  DollarSign,
  Zap,
  Clock,
  ShieldAlert,
  XCircle,
  UserCheck,
  Cpu,
  ShieldCheck,
} from 'lucide-react';

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [modelUsage, setModelUsage] = useState<ModelUsageMetric[]>([]);
  const [guardrailViolations, setGuardrailViolations] = useState<GuardrailMetric[]>([]);
  const [teamUsage, setTeamUsage] = useState<TeamUsageMetric[]>([]);
  const [userUsage, setUserUsage] = useState<UserUsageMetric[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMetrics = () => {
    setLoading(true);
    fetch('/api/metrics')
      .then((r) => r.json())
      .then((data) => {
        setMetrics(data.metrics);
        setModelUsage(data.modelUsage || []);
        setGuardrailViolations(data.guardrailViolations || []);
        setTeamUsage(data.teamUsage || []);
        setUserUsage(data.userUsage || []);
      })
      .catch((err) => console.error('Failed to load metrics', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMetrics();
    const handleUserChange = () => loadMetrics();
    window.addEventListener('rbac-user-changed', handleUserChange);
    return () => window.removeEventListener('rbac-user-changed', handleUserChange);
  }, []);


  return (
    <AppLayout
      title="Observability & Telemetry Center"
      subtitle="Deep-dive telemetry into token consumption, failure rates, latency profiles, guardrail breaches, and foundation model economics"
    >
      <div className="space-y-6">
        {/* KPI Row */}
        {loading || !metrics ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 p-4"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <KPICard label="Requests" value={metrics.totalRequests.toLocaleString()} icon={Activity} color="blue" />
            <KPICard label="Spend ($)" value={`$${metrics.totalCost.toFixed(2)}`} icon={DollarSign} color="emerald" />
            <KPICard label="Tokens" value={`${(metrics.totalTokens / 1000000).toFixed(2)}M`} icon={Zap} color="purple" />
            <KPICard label="Avg Latency" value={`${metrics.avgLatencyMs}ms`} icon={Clock} color="blue" />
            <KPICard label="Risk Score" value={`${metrics.avgRiskScore}/100`} icon={ShieldAlert} color="amber" />
            <KPICard label="Blocked" value={metrics.blockedCount} icon={XCircle} color="red" />
            <KPICard label="Escalated" value={metrics.escalatedCount} icon={UserCheck} color="purple" />
          </div>
        )}

        {/* New Selectable Area Charts Suite */}
        <SelectableAreaCharts />

        {/* Charts & Breakdown Grid */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1">
              <DecisionDistributionChart distribution={metrics.decisionDistribution} />
            </div>

            {/* Guardrail Violation Metrics Table */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Guardrail Breaches & Redaction Breakdown
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">All Time</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Guardrail</th>
                      <th className="py-2.5 px-3">Total Violations</th>
                      <th className="py-2.5 px-3">Blocked</th>
                      <th className="py-2.5 px-3">Modified</th>
                      <th className="py-2.5 px-3">Last Triggered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {guardrailViolations.map((gr) => (
                      <tr key={gr.guardrailId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">
                          {gr.name}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {gr.violations.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-red-600 font-bold">
                          {gr.blockedCount}
                        </td>
                        <td className="py-2.5 px-3 text-amber-600 font-bold">
                          {gr.modifiedCount}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-[10px]">
                          {new Date(gr.lastTriggered).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Feature: View by Users / Teams Grouped Telemetry */}
        <GroupedMetricsView teamUsage={teamUsage} userUsage={userUsage} />

        {/* Foundation Model Usage Breakdown Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Foundation Model Resource & Token Consumption
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Aggregated Telemetry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Model</th>
                  <th className="py-2.5 px-3">Provider</th>
                  <th className="py-2.5 px-3">Total Requests</th>
                  <th className="py-2.5 px-3">Tokens Consumed</th>
                  <th className="py-2.5 px-3">Cumulative Cost</th>
                  <th className="py-2.5 px-3">Avg Latency</th>
                  <th className="py-2.5 px-3">Avg Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {modelUsage.map((m) => (
                  <tr key={m.modelId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-sans font-semibold text-slate-900">
                      {m.modelName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200">
                        {m.provider}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {m.requests.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {(m.tokens / 1000).toFixed(1)}k
                    </td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">
                      ${m.cost.toFixed(4)}
                    </td>
                    <td className="py-3 px-3 text-blue-700">
                      {m.avgLatencyMs} ms
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.avgRisk < 30
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.avgRisk < 60
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {m.avgRisk}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
