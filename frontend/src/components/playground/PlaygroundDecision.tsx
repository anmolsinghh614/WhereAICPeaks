'use client';

import React from 'react';
import { TraceRecord, DecisionState } from '@/types';
import { Shield, ShieldAlert, Zap, DollarSign, Clock, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight, Activity } from 'lucide-react';

interface PlaygroundDecisionProps {
  trace: TraceRecord | null;
  onOpenTrace: (traceId: string) => void;
  isLoading: boolean;
}

export function PlaygroundDecision({ trace, onOpenTrace, isLoading }: PlaygroundDecisionProps) {
  if (isLoading) {
    return (
      <div className="w-80 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-4 shrink-0 animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/2"></div>
        <div className="h-24 bg-slate-100 rounded-xl"></div>
        <div className="space-y-3">
          <div className="h-12 bg-slate-100 rounded-lg"></div>
          <div className="h-12 bg-slate-100 rounded-lg"></div>
          <div className="h-12 bg-slate-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!trace) {
    return (
      <div className="w-80 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-3 shrink-0 text-slate-400">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Shield className="w-6 h-6" />
        </div>
        <div className="font-bold text-sm text-slate-700">Awaiting Pipeline Execution</div>
        <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
          Submit a prompt in the Playground to evaluate risk, enforce policies, and generate an immutable trace.
        </p>
      </div>
    );
  }

  const decisionColor =
    trace.decision === 'ALLOW'
      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
      : trace.decision === 'MODIFY'
      ? 'border-amber-500 bg-amber-50 text-amber-800'
      : trace.decision === 'BLOCK'
      ? 'border-red-500 bg-red-50 text-red-800'
      : 'border-purple-500 bg-purple-50 text-purple-800';

  const riskBarColor =
    trace.riskScore < 30 ? 'bg-emerald-500' : trace.riskScore < 60 ? 'bg-amber-500' : trace.riskScore < 80 ? 'bg-orange-600' : 'bg-red-600';

  return (
    <div className="w-80 bg-white border border-slate-200 rounded-xl p-4.5 shadow-sm flex flex-col gap-4 shrink-0 overflow-y-auto max-h-[calc(100vh-8rem)]">
      {/* Top Decision Header Card */}
      <div className={`p-4 rounded-xl border-2 shadow-sm ${decisionColor}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider uppercase">
            ControlPlane Decision
          </span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/90 shadow-xs">
            {trace.decision}
          </span>
        </div>
        <div className="text-xl font-extrabold tracking-tight mt-1 font-mono">
          {trace.decision}
        </div>
        <p className="text-xs mt-1.5 opacity-90 leading-snug">
          {trace.decisionReason}
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="space-y-3">
        {/* Risk Score */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
              Calculated Risk
            </span>
            <span className="text-xs font-mono font-bold text-slate-900">
              {trace.riskScore} / 100 ({trace.riskCategory})
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${riskBarColor}`}
              style={{ width: `${trace.riskScore}%` }}
            />
          </div>
        </div>

        {/* 2x2 Telemetry Cards */}
        <div className="grid grid-cols-2 gap-2">
          {/* Performance */}
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              Performance
            </span>
            <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
              {trace.performanceScore} <span className="text-[10px] text-slate-400 font-normal">/100</span>
            </div>
          </div>

          {/* Cost */}
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-500" />
              Cost (USD)
            </span>
            <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
              ${trace.costUsd.toFixed(4)}
            </div>
          </div>

          {/* Latency */}
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" />
              Latency
            </span>
            <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
              {trace.latencyMs} <span className="text-[10px] text-slate-400 font-normal">ms</span>
            </div>
          </div>

          {/* Tokens */}
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3 h-3 text-indigo-500" />
              Total Tokens
            </span>
            <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
              {trace.totalTokens}
            </div>
          </div>
        </div>

        {/* Governance & Responsibility Status */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Responsibility</span>
            <span
              className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded ${
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
              className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded ${
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

        {/* Triggered Rules if any */}
        {trace.guardrailViolations.length > 0 && (
          <div className="p-3 bg-red-50/70 rounded-lg border border-red-200">
            <div className="text-[11px] font-bold text-red-900 uppercase tracking-wider mb-1">
              Triggered Violations ({trace.guardrailViolations.length})
            </div>
            <ul className="space-y-1 text-xs text-red-700">
              {trace.guardrailViolations.map((v, i) => (
                <li key={i} className="flex items-start gap-1 text-[11px]">
                  <span className="text-red-500">•</span>
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Button to Open Live Trace Drawer */}
      <button
        onClick={() => onOpenTrace(trace.id)}
        className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm group"
      >
        <Activity className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
        <span>View Full Execution Trace</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
      </button>
    </div>
  );
}
