'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PolicyRule } from '@/types';
import { CreatePolicyModal } from '@/components/modals/CreatePolicyModal';
import { ShieldCheck, Plus, AlertTriangle, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<PolicyRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadPolicies = () => {
    fetch('/api/policies')
      .then((r) => r.json())
      .then((data) => setPolicies(data || []))
      .catch((err) => console.error('Failed to load policies', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  return (
    <AppLayout
      title="Enterprise Policy Rules"
      subtitle="Define deterministic risk thresholds, model whitelist matrix, PII redaction mandates, and budget ceilings"
    >
      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">
              Active Policies: <strong>{policies.length}</strong>
            </span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Policy</span>
          </button>
        </div>

        {/* Policies Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-xl border border-slate-200 p-5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {policies.map((pol) => {
              const guardrails = pol.requiredGuardrails || (pol.enforcePiiRedaction ? ['gr-pii', 'gr-prompt-inj'] : ['gr-prompt-inj']);
              const allowedModels = pol.allowedModels || pol.allowedProviders || ['OpenAI', 'Anthropic'];
              const dailyBudget = pol.dailyBudget || pol.dailyBudgetLimit || 100;
              const blockThresh = pol.blockThreshold || pol.riskThresholdBlock || 60;
              const escThresh = pol.escalationThreshold || pol.riskThresholdEscalate || 40;

              return (
                <div
                  key={pol.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{pol.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400">{pol.id}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ACTIVE
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                      {pol.description}
                    </p>

                    {/* Policy Matrix */}
                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center font-mono">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
                          Block @
                        </span>
                        <span className="font-bold text-red-600 text-sm">
                          &gt;{blockThresh}
                        </span>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
                          Escalate @
                        </span>
                        <span className="font-bold text-purple-600 text-sm">
                          &gt;{escThresh}
                        </span>
                      </div>

                      <div className="p-2 bg-slate-50 rounded-lg">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
                          Daily Cap
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
                          ${dailyBudget}
                        </span>
                      </div>
                    </div>

                    {/* Guardrails Requirements */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-amber-500" />
                        Required Guardrails
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {guardrails.map((grId) => (
                          <span
                            key={grId}
                            className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 text-[10px] font-semibold border border-amber-200"
                          >
                            {grId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Allowed Providers: {allowedModels.length}</span>
                    <span className="font-mono text-[10px] text-indigo-600 font-bold">
                      Escalates @ &gt;{escThresh} Risk
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreatePolicyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={loadPolicies}
      />
    </AppLayout>
  );
}
