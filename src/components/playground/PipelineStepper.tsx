'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldCheck, Loader2, Cpu, Zap, ArrowRight } from 'lucide-react';
import { DecisionState } from '@/types';

export interface PipelineStep {
  id: string;
  label: string;
  sublabel?: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'WARNING' | 'FAILED' | 'MODIFIED' | 'BLOCKED';
}

interface PipelineStepperProps {
  steps: PipelineStep[];
  currentDecision?: DecisionState | null;
  isExecuting?: boolean;
}

export function PipelineStepper({ steps, currentDecision, isExecuting }: PipelineStepperProps) {
  return (
    <div className="bg-[#0B0F19] text-slate-100 rounded-2xl p-4.5 border border-slate-800/90 shadow-xl shadow-slate-950/40 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3.5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-200 block">
              ControlPlane Processing Pipeline
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              8-Stage Deterministic Governance & Routing Sequence
            </span>
          </div>
        </div>

        {currentDecision ? (
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-mono font-extrabold tracking-wide uppercase transition-all shadow-sm ${
              currentDecision === 'ALLOW'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-emerald-500/10'
                : currentDecision === 'MODIFY'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-amber-500/10'
                : currentDecision === 'BLOCK'
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-red-500/10'
                : 'bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-purple-500/10'
            }`}
          >
            DECISION: {currentDecision}
          </span>
        ) : isExecuting ? (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>PIPELINE ACTIVE</span>
          </div>
        ) : (
          <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/50">
            IDLE / READY
          </span>
        )}
      </div>

      {/* Stepper Grid with Connected Visual Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 relative z-10">
        {steps.map((step, idx) => {
          let Icon = Clock;
          let iconColor = 'text-slate-500';
          let borderStyle = 'border-slate-800/80 bg-slate-900/60 text-slate-400 hover:border-slate-700';

          if (step.status === 'RUNNING') {
            Icon = Loader2;
            iconColor = 'text-blue-400 animate-spin';
            borderStyle = 'border-blue-500/60 bg-blue-950/40 text-blue-100 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10';
          } else if (step.status === 'SUCCESS') {
            Icon = CheckCircle2;
            iconColor = 'text-emerald-400';
            borderStyle = 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300';
          } else if (step.status === 'MODIFIED' || step.status === 'WARNING') {
            Icon = AlertTriangle;
            iconColor = 'text-amber-400';
            borderStyle = 'border-amber-500/30 bg-amber-950/20 text-amber-300';
          } else if (step.status === 'BLOCKED' || step.status === 'FAILED') {
            Icon = XCircle;
            iconColor = 'text-red-400';
            borderStyle = 'border-red-500/30 bg-red-950/20 text-red-300';
          }

          return (
            <div
              key={step.id}
              className={`flex flex-col justify-between p-2.5 rounded-xl border text-xs transition-all duration-200 ${borderStyle}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[9px] font-bold px-1 rounded bg-white/5 text-slate-400">
                  0{idx + 1}
                </span>
                <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
              </div>

              <div>
                <div className="font-semibold text-[11px] leading-tight truncate">
                  {step.label}
                </div>
                <div className="text-[9px] text-slate-400 font-mono truncate mt-0.5">
                  {step.sublabel || 'Ready'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
