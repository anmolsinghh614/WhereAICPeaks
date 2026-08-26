'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldCheck, Loader2 } from 'lucide-react';
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
}

export function PipelineStepper({ steps, currentDecision }: PipelineStepperProps) {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-800 shadow-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            ControlPlane Processing Pipeline
          </span>
        </div>
        {currentDecision && (
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
              currentDecision === 'ALLOW'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : currentDecision === 'MODIFY'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : currentDecision === 'BLOCK'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
            }`}
          >
            DECISION: {currentDecision}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {steps.map((step, idx) => {
          let Icon = Clock;
          let iconColor = 'text-slate-500';
          let borderStyle = 'border-slate-800 bg-slate-950/40 text-slate-400';

          if (step.status === 'RUNNING') {
            Icon = Loader2;
            iconColor = 'text-blue-400 animate-spin';
            borderStyle = 'border-blue-500/50 bg-blue-950/30 text-blue-200 ring-1 ring-blue-500/20';
          } else if (step.status === 'SUCCESS') {
            Icon = CheckCircle2;
            iconColor = 'text-emerald-400';
            borderStyle = 'border-emerald-900/40 bg-emerald-950/20 text-emerald-300';
          } else if (step.status === 'MODIFIED' || step.status === 'WARNING') {
            Icon = AlertTriangle;
            iconColor = 'text-amber-400';
            borderStyle = 'border-amber-900/40 bg-amber-950/20 text-amber-300';
          } else if (step.status === 'BLOCKED' || step.status === 'FAILED') {
            Icon = XCircle;
            iconColor = 'text-red-400';
            borderStyle = 'border-red-900/40 bg-red-950/20 text-red-300';
          }

          return (
            <div
              key={step.id}
              className={`flex items-start gap-2 p-2 rounded-lg border text-xs transition-all ${borderStyle}`}
            >
              <div className="pt-0.5">
                <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-[11px] truncate flex items-center justify-between">
                  <span>{step.label}</span>
                  <span className="text-[9px] font-mono text-slate-500">#{idx + 1}</span>
                </div>
                {step.sublabel && (
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {step.sublabel}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
