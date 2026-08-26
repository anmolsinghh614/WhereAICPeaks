'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { FoundationModel } from '@/types';
import { Cpu, DollarSign, Clock, Zap, CheckCircle2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function ModelsPage() {
  const [models, setModels] = useState<FoundationModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/models')
      .then((r) => r.json())
      .then((data) => setModels(data || []))
      .catch((err) => console.error('Failed to load models', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout
      title="Foundation Model Catalog"
      subtitle="Connected multi-provider foundation model inventory managed and routed by ControlPlane"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Registered Engines: <strong>{models.length}</strong>
          </span>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <span>Zero Direct Client Calls • All Traffic Routed Through ControlPlane</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 bg-white rounded-xl border border-slate-200 p-5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {models.map((m) => (
              <div
                key={m.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                        <Cpu className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{m.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400">
                          Provider: {m.provider}
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {m.status}
                    </span>
                  </div>

                  {/* Pricing and Context Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200/80 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-sans font-bold block uppercase">
                        Input Price
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        ${m.inputTokenPrice} <span className="text-[10px] font-normal text-slate-400">/1k</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-sans font-bold block uppercase">
                        Output Price
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        ${m.outputTokenPrice} <span className="text-[10px] font-normal text-slate-400">/1k</span>
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 font-sans font-bold block uppercase">
                        Context
                      </span>
                      <span className="font-bold text-blue-700 text-sm">
                        {m.contextWindow >= 1000000 ? `${m.contextWindow / 1000000}M` : `${m.contextWindow / 1000}k`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Avg Latency: <strong>{m.avgLatencyMs} ms</strong></span>
                  </div>

                  <Link
                    href="/playground"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
                  >
                    <span>Test in Playground</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
