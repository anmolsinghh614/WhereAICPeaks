'use client';

import React from 'react';
import { TraceRecord, DecisionState } from '@/types';
import { Shield, ShieldAlert, Zap, DollarSign, Clock, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight, Activity, Sparkles } from 'lucide-react';

interface PlaygroundDecisionProps {
  trace: TraceRecord | null;
  onOpenTrace?: (traceId: string) => void;
  onOpenTraceDrawer?: () => void;
  isLoading?: boolean;
  isExecuting?: boolean;
}

export function PlaygroundDecision({
  trace,
  onOpenTrace,
  onOpenTraceDrawer,
  isLoading,
  isExecuting,
}: PlaygroundDecisionProps) {
  const loading = isLoading || isExecuting;
  const handleOpen = () => {
    if (onOpenTraceDrawer) onOpenTraceDrawer();
    else if (onOpenTrace && trace) onOpenTrace(trace.id);
  };

  if (loading) {
    return (
      <div className="w-full glass-panel rounded-2xl p-5 flex flex-col gap-4 shrink-0 animate-pulse select-none">
        <div className="h-4 bg-slate-200 rounded-full w-2/3"></div>
        <div className="h-28 bg-slate-100 rounded-2xl"></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-16 bg-slate-100 rounded-xl"></div>
          <div className="h-16 bg-slate-100 rounded-xl"></div>
          <div className="h-16 bg-slate-100 rounded-xl"></div>
          <div className="h-16 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!trace) {
    return (
      <div className="w-full glass-panel rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 shrink-0 text-slate-400 select-none min-h-[380px]">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
          <Shield className="w-7 h-7" />
        </div>
        <div>
          <div className="font-extrabold text-sm text-slate-800">Awaiting Pipeline Run</div>
          <p className="text-[11px] text-slate-500 max-w-[210px] leading-relaxed mt-1">
            Execute a prompt in the Playground to evaluate risk, enforce guardrails, and generate an immutable trace.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-full border border-blue-100">
          <Sparkles className="w-3 h-3" />
          <span>Real-Time Evaluation Engine</span>
        </div>
      </div>
    );
  }

  const decisionColor =
    trace.decision === 'ALLOW'
      ? 'border-emerald-300/80 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 text-emerald-950 shadow-emerald-500/5'
      : trace.decision === 'MODIFY'
      ? 'border-amber-300/80 bg-gradient-to-br from-amber-500/10 to-orange-500/5 text-amber-950 shadow-amber-500/5'
      : trace.decision === 'BLOCK'
      ? 'border-red-300/80 bg-gradient-to-br from-red-500/10 to-rose-500/5 text-red-950 shadow-red-500/5'
      : 'border-purple-300/80 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 text-purple-950 shadow-purple-500/5';

  const riskStrokeColor =
    trace.riskScore < 30 ? '#10b981' : trace.riskScore < 60 ? '#f59e0b' : trace.riskScore < 80 ? '#ea580c' : '#ef4444';

  return (
    <div className="w-full glass-panel rounded-2xl p-5 flex flex-col gap-4.5 shrink-0 overflow-y-auto max-h-[calc(100vh-8rem)] select-none">
      {/* 1. Decision State Hero Card */}
      <div className={`p-4.5 rounded-2xl border-2 shadow-sm relative overflow-hidden ${decisionColor}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-80">
            ControlPlane Decision
          </span>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white shadow-2xs border border-current">
            {trace.decision}
          </span>
        </div>

        <div className="text-2xl font-extrabold tracking-tight mt-1 font-mono">
          {trace.decision}
        </div>

        <p className="text-xs mt-1.5 leading-relaxed opacity-90 font-sans">
          {trace.decisionReason}
        </p>
      </div>

      {/* 2. Circular / Gauge Risk Card */}
      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
            Calculated Risk
          </span>
          <span className="text-xs font-mono font-bold text-slate-900">
            {trace.riskScore} / 100 ({trace.riskCategory})
          </span>
        </div>

        <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(4, trace.riskScore)}%`,
              backgroundColor: riskStrokeColor,
            }}
          />
        </div>
      </div>

      {/* 3. Primary Telemetry 2x2 Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Performance */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            Performance
          </span>
          <div className="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
            {trace.performanceScore} <span className="text-[10px] text-slate-400 font-normal">/100</span>
          </div>
        </div>

        {/* Cost */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-500" />
            Cost (USD)
          </span>
          <div className="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
            ${trace.costUsd.toFixed(4)}
          </div>
        </div>

        {/* Latency */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-500" />
            Latency
          </span>
          <div className="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
            {trace.latencyMs} <span className="text-[10px] text-slate-400 font-normal">ms</span>
          </div>
        </div>

        {/* Total Tokens */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-indigo-500" />
            Total Tokens
          </span>
          <div className="text-lg font-extrabold text-slate-900 font-mono mt-0.5">
            {trace.totalTokens}
          </div>
        </div>
      </div>

      {/* 4. Governance & Policy Ledger */}
      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/90 space-y-2 text-xs shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-medium">Responsibility</span>
          <span
            className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded-full ${
              trace.responsibilityScore === 'PASS'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {trace.responsibilityScore}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-medium">Policy Status</span>
          <span
            className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded-full ${
              trace.policyStatus === 'PASS'
                ? 'bg-emerald-100 text-emerald-800'
                : trace.policyStatus === 'MODIFIED'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {trace.policyStatus}
          </span>
        </div>
      </div>

      {/* 5. Triggered Violations if any */}
      {trace.guardrailViolations.length > 0 && (
        <div className="p-3.5 bg-red-50/80 rounded-xl border border-red-200 shadow-2xs">
          <div className="text-[11px] font-bold text-red-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Triggered Violations ({trace.guardrailViolations.length})
          </div>
          <ul className="space-y-1 text-xs text-red-800">
            {trace.guardrailViolations.map((v, i) => (
              <li key={i} className="flex items-start gap-1 text-[11px]">
                <span className="text-red-500 font-bold">•</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. View Full Waterfall Button */}
      <button
        onClick={handleOpen}
        className="w-full py-3 px-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-950/15 group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
      >
        <Activity className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform" />
        <span>View Full Execution Trace</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
}
