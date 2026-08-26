'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CreateVirtualModelModal } from '@/components/modals/CreateVirtualModelModal';
import { FoundationModel, GuardrailConfig, PolicyRule, VirtualModel } from '@/types';
import {
  Layers,
  Plus,
  Play,
  ShieldCheck,
  ShieldAlert,
  DollarSign,
  Cpu,
  Activity,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function VirtualModelsPage() {
  const [virtualModels, setVirtualModels] = useState<VirtualModel[]>([]);
  const [policies, setPolicies] = useState<PolicyRule[]>([]);
  const [guardrails, setGuardrails] = useState<GuardrailConfig[]>([]);
  const [models, setModels] = useState<FoundationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadData = () => {
    Promise.all([
      fetch('/api/virtual-models').then((r) => r.json()),
      fetch('/api/policies').then((r) => r.json()),
      fetch('/api/guardrails').then((r) => r.json()),
      fetch('/api/models').then((r) => r.json()),
    ])
      .then(([vms, pols, grs, mdls]) => {
        setVirtualModels(vms || []);
        setPolicies(pols || []);
        setGuardrails(grs || []);
        setModels(mdls || []);
      })
      .catch((err) => console.error('Failed to load virtual models data', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AppLayout
      title="Enterprise Virtual Models"
      subtitle="Logical AI endpoints governed by ControlPlane policies, spending bounds, and safety guardrails"
    >
      <div className="space-y-6">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-500">
              Active Endpoints: <strong>{virtualModels.length}</strong>
            </span>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Virtual Model</span>
          </button>
        </div>

        {/* Virtual Models Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-xl border border-slate-200 p-5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {virtualModels.map((vm) => {
              const policy = policies.find((p) => p.id === vm.policyId);
              const underlyingModel = models.find((m) => m.id === vm.underlyingModelId);
              const activeGuardrails = guardrails.filter((g) => vm.guardrailIds.includes(g.id));
              const budgetPct = Math.min(100, Math.round((vm.spentToday / vm.dailyBudget) * 100));

              return (
                <div
                  key={vm.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {vm.provider}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1.5 group-hover:text-blue-600 transition-colors">
                          {vm.name}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        {vm.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {vm.description || 'Enterprise virtual model endpoint.'}
                    </p>

                    {/* Underlying Model & Policy Badges */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5 text-slate-400" />
                          Underlying Model
                        </span>
                        <span className="font-semibold text-slate-800 font-mono text-[11px]">
                          {underlyingModel?.name || vm.underlyingModelId}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                          Policy Rule Set
                        </span>
                        <span className="font-semibold text-indigo-700 text-[11px]">
                          {policy?.name || 'General'}
                        </span>
                      </div>
                    </div>

                    {/* Guardrails Pills */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Active Guardrails ({activeGuardrails.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {activeGuardrails.map((gr) => (
                          <span
                            key={gr.id}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                          >
                            {gr.name.split(' ')[0]}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Budget Progress Meter */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-emerald-600" />
                          Daily Spend Cap
                        </span>
                        <span className="font-mono text-slate-600">
                          ${vm.spentToday.toFixed(2)} / ${vm.dailyBudget.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            budgetPct > 80 ? 'bg-red-500' : budgetPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${budgetPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats & Playground Action */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                      <span><strong>{vm.totalRequests}</strong> reqs</span>
                      <span>•</span>
                      <span>Risk: <strong>{vm.avgRisk}/100</strong></span>
                    </div>

                    <Link
                      href="/playground"
                      className="px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      <span>Test in Playground</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Creating Virtual Model */}
      <CreateVirtualModelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(newModel) => {
          setVirtualModels((prev) => [newModel, ...prev]);
        }}
        policies={policies}
        guardrails={guardrails}
        models={models}
      />
    </AppLayout>
  );
}
