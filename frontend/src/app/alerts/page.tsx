'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AlertItem } from '@/types';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/alerts')
      .then((r) => r.json())
      .then((data) => setAlerts(data || []))
      .catch((err) => console.error('Failed to load alerts', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout
      title="Security & Governance Alerts"
      subtitle="Critical threshold triggers, prompt injection detections, and budget overage notifications"
    >
      <div className="space-y-4 max-w-4xl">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 p-4"></div>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center text-xs text-slate-400 border border-slate-200">
            No active security or governance alerts.
          </div>
        ) : (
          alerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-4 rounded-xl border flex items-start gap-3.5 shadow-xs ${
                alt.severity === 'CRITICAL'
                  ? 'bg-red-50/70 border-red-200'
                  : 'bg-amber-50/70 border-amber-200'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  alt.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <ShieldAlert className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{alt.title}</h4>
                  <span className="text-[10px] font-mono text-slate-500">{alt.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-snug">{alt.description}</p>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-mono">
                  <span className="font-bold uppercase text-slate-700">{alt.virtualModelName}</span>
                  <span className="text-slate-300">•</span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded ${
                      alt.severity === 'CRITICAL' ? 'bg-red-200 text-red-900' : 'bg-amber-200 text-amber-900'
                    }`}
                  >
                    {alt.severity} SEVERITY
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  );
}
