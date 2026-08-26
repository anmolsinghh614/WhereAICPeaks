'use client';

import React, { useState } from 'react';
import { Play, Sparkles, Shield, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

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
        setDemoSuccessMsg('Demo executed: 5 scenarios processed across ALLOW, MODIFY, BLOCK & ESCALATE');
        setTimeout(() => setDemoSuccessMsg(null), 5000);
      }
    } catch (error) {
      console.error('Demo execution error', error);
    } finally {
      setIsRunningDemo(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 select-none z-10">
      <div className="flex items-center gap-4">
        {title && (
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {title}
            </h1>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        )}

        {/* Concept Architecture Flow Badge */}
        <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-slate-100/90 rounded-md border border-slate-200 text-[11px] text-slate-600 font-medium font-mono">
          <span className="text-slate-800 font-semibold">AI APPS</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
            CONTROLPLANE.AI
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="text-indigo-600 font-semibold">POLICY ENGINE</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold">MODELS</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {demoSuccessMsg && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{demoSuccessMsg}</span>
          </div>
        )}

        {/* Global Demo Mode Simulation Button */}
        <button
          onClick={handleRunDemo}
          disabled={isRunningDemo}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all shadow-blue-500/20 disabled:opacity-50"
          title="Simulate realistic multi-tenant enterprise traffic across ALLOW, MODIFY, BLOCK, and ESCALATE"
        >
          {isRunningDemo ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          )}
          <span>{isRunningDemo ? 'Simulating Engine...' : 'Run Demo Simulation'}</span>
        </button>

        {/* Live SSE status indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-mono text-slate-700 font-medium">LIVE STREAM</span>
        </div>
      </div>
    </header>
  );
}
