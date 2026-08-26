'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TraceDrawer } from '@/components/playground/TraceDrawer';
import { TraceRecord, VirtualModel } from '@/types';
import {
  Activity,
  Search,
  Filter,
  ArrowUpRight,
  ShieldAlert,
  RotateCcw,
  Clock,
  DollarSign,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Lock,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

export default function TracesPage() {
  const [traces, setTraces] = useState<TraceRecord[]>([]);
  const [virtualModels, setVirtualModels] = useState<VirtualModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVm, setSelectedVm] = useState<string>('all');
  const [selectedDecision, setSelectedDecision] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedRiskTier, setSelectedRiskTier] = useState<string>('all');
  const [selectedViolationFilter, setSelectedViolationFilter] = useState<string>('all');
  const [selectedLatencyFilter, setSelectedLatencyFilter] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Drawer State
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);

  const fetchTraces = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedVm !== 'all') params.set('virtualModelId', selectedVm);
    if (selectedDecision !== 'all') params.set('decision', selectedDecision);
    if (selectedProvider !== 'all') params.set('provider', selectedProvider);

    fetch(`/api/traces?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setTraces(data || []))
      .catch((err) => console.error('Failed to load traces', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch('/api/virtual-models')
      .then((r) => r.json())
      .then((vms) => setVirtualModels(vms || []));
  }, []);

  useEffect(() => {
    fetchTraces();
  }, [selectedVm, selectedDecision, selectedProvider]);

  // Client-side filtering & sorting
  const filteredAndSortedTraces = useMemo(() => {
    const now = Date.now();

    return traces
      .filter((t) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            t.id.toLowerCase().includes(q) ||
            t.prompt.toLowerCase().includes(q) ||
            t.virtualModelName.toLowerCase().includes(q) ||
            t.model.toLowerCase().includes(q) ||
            t.decisionReason.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Risk tier filter
        if (selectedRiskTier === 'low' && t.riskScore >= 30) return false;
        if (selectedRiskTier === 'medium' && (t.riskScore < 30 || t.riskScore >= 60)) return false;
        if (selectedRiskTier === 'high' && (t.riskScore < 60 || t.riskScore >= 80)) return false;
        if (selectedRiskTier === 'critical' && t.riskScore < 80) return false;

        // Violation filter
        if (selectedViolationFilter === 'violations_only' && t.guardrailViolations.length === 0) return false;
        if (selectedViolationFilter === 'clean_only' && t.guardrailViolations.length > 0) return false;
        if (selectedViolationFilter === 'pii' && !t.triggeredRules.includes('gr-pii')) return false;
        if (selectedViolationFilter === 'prompt_inj' && !t.triggeredRules.includes('gr-prompt-inj')) return false;
        if (selectedViolationFilter === 'secrets' && !t.triggeredRules.includes('gr-secrets')) return false;
        if (selectedViolationFilter === 'fin_advice' && !t.triggeredRules.includes('gr-fin-advice')) return false;

        // Latency filter
        if (selectedLatencyFilter === 'fast' && t.latencyMs >= 300) return false;
        if (selectedLatencyFilter === 'medium' && (t.latencyMs < 300 || t.latencyMs > 800)) return false;
        if (selectedLatencyFilter === 'slow' && t.latencyMs <= 800) return false;

        // Time range filter
        if (selectedTimeRange !== 'all') {
          const traceTime = new Date(t.timestamp).getTime();
          const diffMinutes = (now - traceTime) / (1000 * 60);
          if (selectedTimeRange === '15m' && diffMinutes > 15) return false;
          if (selectedTimeRange === '1h' && diffMinutes > 60) return false;
          if (selectedTimeRange === '24h' && diffMinutes > 1440) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        if (sortBy === 'oldest') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        if (sortBy === 'highest_risk') return b.riskScore - a.riskScore;
        if (sortBy === 'lowest_risk') return a.riskScore - b.riskScore;
        if (sortBy === 'highest_cost') return b.costUsd - a.costUsd;
        if (sortBy === 'highest_latency') return b.latencyMs - a.latencyMs;
        return 0;
      });
  }, [
    traces,
    searchQuery,
    selectedRiskTier,
    selectedViolationFilter,
    selectedLatencyFilter,
    selectedTimeRange,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedVm !== 'all' ||
    selectedDecision !== 'all' ||
    selectedProvider !== 'all' ||
    selectedRiskTier !== 'all' ||
    selectedViolationFilter !== 'all' ||
    selectedLatencyFilter !== 'all' ||
    selectedTimeRange !== 'all' ||
    sortBy !== 'newest';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedVm('all');
    setSelectedDecision('all');
    setSelectedProvider('all');
    setSelectedRiskTier('all');
    setSelectedViolationFilter('all');
    setSelectedLatencyFilter('all');
    setSelectedTimeRange('all');
    setSortBy('newest');
  };

  return (
    <AppLayout
      title="Audit Traces & Execution Logs"
      subtitle="Complete cryptographic ledger of all AI requests, governance pipeline steps, safety decisions, and token economics"
    >
      <div className="space-y-5">
        {/* Quick Filter Pill Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => {
              setSelectedDecision('all');
              setSelectedRiskTier('all');
              setSelectedViolationFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all border ${
              selectedDecision === 'all' && selectedRiskTier === 'all' && selectedViolationFilter === 'all'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Traces
          </button>

          <button
            onClick={() => {
              setSelectedDecision('BLOCK');
              setSelectedRiskTier('all');
              setSelectedViolationFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all border flex items-center gap-1.5 ${
              selectedDecision === 'BLOCK'
                ? 'bg-red-600 text-white border-red-600 shadow-xs'
                : 'bg-white text-red-700 border-red-200 hover:bg-red-50'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Blocked Attacks Only</span>
          </button>

          <button
            onClick={() => {
              setSelectedDecision('MODIFY');
              setSelectedRiskTier('all');
              setSelectedViolationFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all border flex items-center gap-1.5 ${
              selectedDecision === 'MODIFY'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Modified (PII Redacted)</span>
          </button>

          <button
            onClick={() => {
              setSelectedDecision('ESCALATE');
              setSelectedRiskTier('all');
              setSelectedViolationFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all border flex items-center gap-1.5 ${
              selectedDecision === 'ESCALATE'
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-white text-purple-800 border-purple-200 hover:bg-purple-50'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Escalated to Review</span>
          </button>

          <button
            onClick={() => {
              setSelectedRiskTier('high');
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all border flex items-center gap-1.5 ${
              selectedRiskTier === 'high' || selectedRiskTier === 'critical'
                ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                : 'bg-white text-orange-800 border-orange-200 hover:bg-orange-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>High Risk (&gt;60)</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="ml-auto text-xs text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Comprehensive Multi-Dimensional Filter Toolbar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          {/* Top Row: Search + Core Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ID, prompt, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Virtual Model Filter */}
            <select
              value={selectedVm}
              onChange={(e) => setSelectedVm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">Endpoint: All Virtual Models</option>
              {virtualModels.map((vm) => (
                <option key={vm.id} value={vm.id}>
                  {vm.name}
                </option>
              ))}
            </select>

            {/* Decision Filter */}
            <select
              value={selectedDecision}
              onChange={(e) => setSelectedDecision(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">Decision: All Outcomes</option>
              <option value="ALLOW">ALLOW (Dispatched)</option>
              <option value="MODIFY">MODIFY (Sanitized)</option>
              <option value="BLOCK">BLOCK (Intercepted)</option>
              <option value="ESCALATE">ESCALATE (Held)</option>
            </select>

            {/* Provider Filter */}
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">Provider: All Providers</option>
              <option value="OpenAI">OpenAI</option>
              <option value="Anthropic">Anthropic</option>
              <option value="Google">Google</option>
              <option value="ControlPlane">ControlPlane</option>
            </select>
          </div>

          {/* Bottom Row: Granular Dimensional Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100 text-xs">
            {/* Risk Tier */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Risk Score Tier
              </label>
              <select
                value={selectedRiskTier}
                onChange={(e) => setSelectedRiskTier(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low (&lt; 30)</option>
                <option value="medium">Medium (30 - 60)</option>
                <option value="high">High (60 - 80)</option>
                <option value="critical">Critical (&gt; 80)</option>
              </select>
            </div>

            {/* Violation Type */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Guardrail Vector
              </label>
              <select
                value={selectedViolationFilter}
                onChange={(e) => setSelectedViolationFilter(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
              >
                <option value="all">All Vectors</option>
                <option value="violations_only">With Breaches Only</option>
                <option value="clean_only">Clean Only</option>
                <option value="pii">PII Redaction Triggered</option>
                <option value="prompt_inj">Prompt Injection Shield</option>
                <option value="secrets">Secret Leak Blocked</option>
                <option value="fin_advice">Financial Compliance</option>
              </select>
            </div>

            {/* Latency Range */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Latency Threshold
              </label>
              <select
                value={selectedLatencyFilter}
                onChange={(e) => setSelectedLatencyFilter(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
              >
                <option value="all">All Latencies</option>
                <option value="fast">Fast (&lt; 300ms)</option>
                <option value="medium">Standard (300 - 800ms)</option>
                <option value="slow">High Latency (&gt; 800ms)</option>
              </select>
            </div>

            {/* Time Window */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Time Window
              </label>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none"
              >
                <option value="all">All Time</option>
                <option value="15m">Last 15 Minutes</option>
                <option value="1h">Last 1 Hour</option>
                <option value="24h">Last 24 Hours</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Sort Order
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="highest_risk">Highest Risk</option>
                <option value="highest_cost">Highest Cost ($)</option>
                <option value="highest_latency">Highest Latency</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Traces Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Filtered Audit Ledger ({filteredAndSortedTraces.length} records)
              </span>
            </div>

            <span className="text-[11px] font-mono text-slate-500">
              Sorted by: <strong>{sortBy.replace('_', ' ')}</strong>
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
              Loading execution traces...
            </div>
          ) : filteredAndSortedTraces.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 space-y-2">
              <p>No matching execution traces found for active filter criteria.</p>
              <button
                onClick={resetAllFilters}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Trace ID</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Virtual Model</th>
                    <th className="py-3 px-4">Underlying Model</th>
                    <th className="py-3 px-4">Prompt Preview</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4">Cost</th>
                    <th className="py-3 px-4">Risk</th>
                    <th className="py-3 px-4">Decision</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredAndSortedTraces.map((trace) => (
                    <tr
                      key={trace.id}
                      onClick={() => setSelectedTraceId(trace.id)}
                      className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-bold text-blue-600">
                        {trace.id}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(trace.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                        {trace.virtualModelName}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {trace.model}
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-600 max-w-[200px] truncate text-[11px]">
                        {trace.prompt}
                      </td>
                      <td className="py-3 px-4 text-slate-800">
                        {trace.latencyMs}ms
                      </td>
                      <td className="py-3 px-4 text-emerald-700 font-bold">
                        ${trace.costUsd.toFixed(4)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            trace.riskScore < 30
                              ? 'bg-emerald-100 text-emerald-800'
                              : trace.riskScore < 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {trace.riskScore}/100
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            trace.decision === 'ALLOW'
                              ? 'bg-emerald-100 text-emerald-800'
                              : trace.decision === 'MODIFY'
                              ? 'bg-amber-100 text-amber-800'
                              : trace.decision === 'BLOCK'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {trace.decision}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/traces/${trace.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-800 inline-flex items-center transition-colors"
                          title="Open Full Detail Page"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Drawer */}
      <TraceDrawer
        traceId={selectedTraceId}
        onClose={() => setSelectedTraceId(null)}
      />
    </AppLayout>
  );
}
