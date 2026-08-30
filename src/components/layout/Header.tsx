'use client';

import React, { useState } from 'react';
import { Play, Sparkles, Shield, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight, Activity, Zap } from 'lucide-react';
import { UserRoleSwitcher } from '../rbac/UserRoleSwitcher';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [demoSuccessMsg, setDemoSuccessMsg] = useState<string | null>(null);

  const handleRunDemo = async () => {
    setIsRunningDemo(true);
    setDemoSuccessMsg(null);
    try {
      const res = await fetch('/api/demo/run', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setDemoSuccessMsg('5 scenarios evaluated across ALLOW, MODIFY, BLOCK & ESCALATE');
        setTimeout(() => setDemoSuccessMsg(null), 5000);
      }
    } catch (error) {
      console.error('Demo execution error', error);
    } finally {
      setIsRunningDemo(false);
    }
  };

  return (
    <header className="h-16 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-6 lg:px-8 flex items-center justify-between shrink-0 select-none z-20 sticky top-0">
      <div className="flex items-center gap-5">
        {title && (
          <div>
            <h1 className="text-sm lg:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              {title}
            </h1>
            {subtitle && <p className="text-[11px] text-slate-400 font-normal leading-none mt-0.5">{subtitle}</p>}
          </div>
        )}

        {/* Enterprise Architecture Flow Breadcrumb */}
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 rounded-full border border-slate-800 text-[10px] text-slate-300 font-mono">
          <span className="text-slate-300 font-semibold">APP INGEST</span>
          <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
          <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
            <Shield className="w-2.5 h-2.5" />
            CONTROLPLANE
          </span>
          <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
          <span className="text-indigo-400 font-semibold">GOVERNANCE</span>
          <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
          <span className="text-slate-300 font-semibold">MODELS</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* RBAC Persona Switcher */}
        <UserRoleSwitcher />

        {demoSuccessMsg && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-medium animate-fade-in shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{demoSuccessMsg}</span>
          </div>
        )}

        {/* Global Demo Simulation Action */}
        <button
          onClick={handleRunDemo}
          disabled={isRunningDemo}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {isRunningDemo ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          )}
          <span>{isRunningDemo ? 'Executing Simulation...' : 'Run Demo Simulation'}</span>
        </button>

        {/* Live SSE Telemetry Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px]">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="font-mono text-slate-300 font-semibold text-[10px]">LIVE STREAM</span>
        </div>
      </div>
    </header>
  );
}
