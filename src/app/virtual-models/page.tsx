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
  Zap,
  Power,
  RefreshCw,
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

  const toggleKillSwitch = (vmId: string) => {
    setVirtualModels((prev) =>
      prev.map((vm) => {
        if (vm.id === vmId) {
          const newStatus = vm.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
          return { ...vm, status: newStatus };
        }
        return vm;
      })
    );
  };

  return (
    <AppLayout>
      <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                AI Orchestration Proxies
              </span>
              <span className="text-xs text-slate-500">• Auto-Fallback & Kill-Switch Enabled</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-7 h-7 text-blue-400" />
              Enterprise Virtual Models & Circuit Breakers
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Logical AI endpoints governed by ControlPlane policies, cost caps, and emergency kill-switches.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Virtual Model
            </button>
          </div>
        </div>

        {/* Virtual Models Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-slate-900/60 rounded-2xl border border-slate-800 p-5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {virtualModels.map((vm) => {
              const policy = policies.find((p) => p.id === vm.policyId);
              const underlyingModel = models.find((m) => m.id === vm.underlyingModelId);
              const activeGuardrails = guardrails.filter((g) => vm.guardrailIds.includes(g.id));
              const budgetPct = Math.min(100, Math.round((vm.spentToday / vm.dailyBudget) * 100));

              return (
                <div
                  key={vm.id}
                  className={`bg-slate-900/60 border ${
                    vm.status === 'PAUSED' ? 'border-red-800/80 bg-red-950/10' : 'border-slate-800'
                  } rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group relative overflow-hidden`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {vm.provider}
                        </span>
                        <h3 className="text-base font-bold text-white mt-2 group-hover:text-blue-400 transition-colors">
                          {vm.name}
                        </h3>
                      </div>

                      <button
                        onClick={() => toggleKillSwitch(vm.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          vm.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-red-500/20 hover:text-red-400'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-emerald-500/20 hover:text-emerald-400'
                        }`}
                        title="Emergency Kill-Switch Control"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{vm.status === 'ACTIVE' ? 'Kill-Switch Ready' : 'BLOCKED'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {vm.description || 'Enterprise virtual model endpoint.'}
                    </p>

                    {/* Auto Fallback Indicator */}
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-slate-300 font-semibold">Auto-Fallback Target</span>
                      </div>
                      <span className="font-mono text-amber-400 font-bold text-[11px]">
                        {vm.provider === 'OpenAI' ? 'GPT-4o-mini' : 'Claude 3.5 Haiku'}
                      </span>
                    </div>

                    {/* Underlying Model & Policy Badges */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-slate-500" />
                          Primary LLM
                        </span>
                        <span className="font-semibold text-slate-200 font-mono text-[11px]">
                          {underlyingModel?.name || vm.underlyingModelId}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                          Policy Set
                        </span>
                        <span className="font-semibold text-indigo-400 text-[11px]">
                          {policy?.name || 'General'}
                        </span>
                      </div>
                    </div>

                    {/* Budget Progress Meter */}
                    <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-200">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          Daily Budget Quota
                        </span>
                        <span className="font-mono text-slate-400">
                          ${vm.spentToday.toFixed(2)} / ${vm.dailyBudget.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            budgetPct > 80 ? 'bg-red-500' : budgetPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${budgetPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats & Playground Action */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                      <span><strong>{vm.totalRequests}</strong> reqs</span>
                      <span>•</span>
                      <span>Risk: <strong>{vm.avgRisk}/100</strong></span>
                    </div>

                    <Link
                      href="/playground"
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Test Endpoint</span>
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
