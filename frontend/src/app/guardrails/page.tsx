'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { GuardrailConfig } from '@/types';
import { ShieldAlert, ShieldCheck, Check, AlertTriangle, XCircle, Lock, Sliders } from 'lucide-react';

export default function GuardrailsPage() {
  const [guardrails, setGuardrails] = useState<GuardrailConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadGuardrails = () => {
    fetch('/api/guardrails')
      .then((r) => r.json())
      .then((data) => setGuardrails(data || []))
      .catch((err) => console.error('Failed to load guardrails', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGuardrails();
  }, []);

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      const res = await fetch('/api/guardrails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        setGuardrails((prev) => prev.map((g) => (g.id === id ? data : g)));
      }
    } catch (err) {
      console.error('Failed to toggle guardrail', err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <AppLayout
      title="Active AI Safety Guardrails"
      subtitle="Real-time heuristic & semantic guardrails intercepting prompt injections, PII leaks, secret exposures, and compliance breaches"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Total Guardrails: <strong>{guardrails.length}</strong> (
            {guardrails.filter((g) => g.enabled).length} Enabled)
          </span>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>REAL-TIME INTERCEPTION ACTIVE</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-48 bg-white rounded-xl border border-slate-200 p-5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {guardrails.map((gr) => {
              const severityColor =
                gr.severity === 'CRITICAL'
                  ? 'bg-red-100 text-red-800 border-red-200'
                  : gr.severity === 'HIGH'
                  ? 'bg-orange-100 text-orange-800 border-orange-200'
                  : 'bg-amber-100 text-amber-800 border-amber-200';

              const actionColor =
                gr.action === 'MODIFY'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : gr.action === 'BLOCK'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-purple-50 text-purple-700 border-purple-200';

              return (
                <div
                  key={gr.id}
                  className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                    gr.enabled ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                          <ShieldAlert className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xs text-slate-900 leading-snug">
                            {gr.name}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400 uppercase">
                            {gr.category}
                          </span>
                        </div>
                      </div>

                      {/* Custom Toggle Switch */}
                      <button
                        onClick={() => handleToggle(gr.id)}
                        disabled={togglingId === gr.id}
                        className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                          gr.enabled ? 'bg-blue-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                            gr.enabled ? 'translate-x-4.5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {gr.description}
                    </p>

                    {/* Metadata Badges */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${severityColor}`}>
                        {gr.severity}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${actionColor}`}>
                        ACTION: {gr.action}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Rules Pattern Count</span>
                    <span className="font-bold text-slate-700">{gr.rulesCount || 12} rules</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
