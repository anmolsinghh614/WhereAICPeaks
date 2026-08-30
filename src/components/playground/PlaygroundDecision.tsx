'use client';

import React from 'react';
import { TraceRecord } from '@/types';
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
      <div className="w-full bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shrink-0 animate-pulse select-none shadow-2xl">
        <div className="h-4 bg-slate-800 rounded-full w-2/3"></div>
        <div className="h-28 bg-slate-900/80 rounded-2xl"></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-16 bg-slate-900/80 rounded-xl"></div>
          <div className="h-16 bg-slate-900/80 rounded-xl"></div>
          <div className="h-16 bg-slate-900/80 rounded-xl"></div>
          <div className="h-16 bg-slate-900/80 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!trace) {
    return (
      <div className="w-full bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 shrink-0 text-slate-400 select-none min-h-[380px] shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
          <Shield className="w-7 h-7" />
        </div>
        <div>
          <div className="font-extrabold text-sm text-white">Awaiting Pipeline Run</div>
          <p className="text-[11px] text-slate-400 max-w-[210px] leading-relaxed mt-1">
            Execute a prompt in the Playground to evaluate risk, enforce guardrails, and generate an immutable trace.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
          <Sparkles className="w-3 h-3" />
          <span>Real-Time Evaluation Engine</span>
        </div>
      </div>
    );
  }

  const decisionColor =
    trace.decision === 'ALLOW'
      ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300'
      : trace.decision === 'MODIFY'
      ? 'border-amber-500/50 bg-amber-950/30 text-amber-300'
      : trace.decision === 'BLOCK'
      ? 'border-red-500/50 bg-red-950/30 text-red-300'
      : 'border-purple-500/50 bg-purple-950/30 text-purple-300';

  const riskStrokeColor =
    trace.riskScore < 30 ? '#10b981' : trace.riskScore < 60 ? '#f59e0b' : trace.riskScore < 80 ? '#ea580c' : '#ef4444';

  return (
    <div className="w-full bg-[#0F172A]/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4.5 shrink-0 overflow-y-auto max-h-[calc(100vh-8rem)] select-none shadow-2xl">
      {/* 1. Decision State Hero Card */}
      <div className={`p-4.5 rounded-2xl border-2 shadow-lg relative overflow-hidden ${decisionColor}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-80 font-mono">
            ControlPlane Decision
          </span>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-current shadow-md">
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
      <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            Calculated Risk Score
          </span>
          <span
            className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
              trace.riskCategory === 'LOW'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : trace.riskCategory === 'MEDIUM'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {trace.riskCategory} RISK
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-3xl font-extrabold text-white">{trace.riskScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>

          <div className="w-12 h-12 relative flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="18" stroke="#1e293b" strokeWidth="4" fill="transparent" />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke={riskStrokeColor}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={113}
                strokeDashoffset={113 - (113 * trace.riskScore) / 100}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
            <Clock className="w-3 h-3 text-blue-400" />
            Total Latency
          </div>
          <div className="font-mono font-bold text-white mt-1 text-sm">{trace.latencyMs}ms</div>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
            <DollarSign className="w-3 h-3 text-emerald-400" />
            Estimated Cost
          </div>
          <div className="font-mono font-bold text-emerald-400 mt-1 text-sm">${(trace.costUsd || 0).toFixed(5)}</div>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
            <Zap className="w-3 h-3 text-purple-400" />
            Total Tokens
          </div>
          <div className="font-mono font-bold text-white mt-1 text-sm">{trace.totalTokens}</div>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
            <Activity className="w-3 h-3 text-indigo-400" />
            Perf Score
          </div>
          <div className="font-mono font-bold text-indigo-400 mt-1 text-sm">{trace.performanceScore}/100</div>
        </div>
      </div>

      {/* 4. Action Button for Trace Waterfalls */}
      <button
        onClick={handleOpen}
        className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:border-slate-600"
      >
        <span>Inspect OpenTelemetry Waterfall Spans</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
      </button>
    </div>
  );
}
