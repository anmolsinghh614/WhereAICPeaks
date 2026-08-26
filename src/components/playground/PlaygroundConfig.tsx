'use client';

import React from 'react';
import { VirtualModel, PolicyRule, GuardrailConfig, FoundationModel } from '@/types';
import { Layers, ShieldCheck, ShieldAlert, DollarSign, Plus, Cpu, SlidersHorizontal, Check } from 'lucide-react';

interface PlaygroundConfigProps {
  virtualModels: VirtualModel[];
  selectedVirtualModel: VirtualModel | null;
  onSelectVirtualModel: (model: VirtualModel) => void;
  policies: PolicyRule[];
  selectedPolicyId: string;
  onSelectPolicyId: (policyId: string) => void;
  guardrails: GuardrailConfig[];
  selectedGuardrailIds: string[];
  onToggleGuardrailId: (guardrailId: string) => void;
  models: FoundationModel[];
  selectedModelId: string;
  onSelectModelId: (modelId: string) => void;
  temperature: number;
  setTemperature: (val: number) => void;
  maxTokens: number;
  setMaxTokens: (val: number) => void;
  onOpenCreateModelModal: () => void;
}

export function PlaygroundConfig({
  virtualModels = [],
  selectedVirtualModel,
  onSelectVirtualModel,
  policies = [],
  selectedPolicyId,
  onSelectPolicyId,
  guardrails = [],
  selectedGuardrailIds = [],
  onToggleGuardrailId,
  models = [],
  selectedModelId,
  onSelectModelId,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  onOpenCreateModelModal,
}: PlaygroundConfigProps) {
  const activePolicy = policies.find((p) => p.id === selectedPolicyId) || policies[0];
  const underlyingModel = models.find((m) => m.id === selectedModelId) || models[0];

  const budgetPct = selectedVirtualModel
    ? Math.min(100, Math.round((selectedVirtualModel.spentToday / selectedVirtualModel.dailyBudget) * 100))
    : 0;

  const activeGuardrailCount = (selectedGuardrailIds || []).length;

  return (
    <div className="w-80 bg-white border border-slate-200 rounded-xl p-4.5 shadow-sm flex flex-col gap-5 shrink-0 overflow-y-auto max-h-[calc(100vh-8rem)]">
      {/* 1. Virtual Model / Endpoint Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Virtual Endpoint
          </label>
          <button
            onClick={onOpenCreateModelModal}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            New
          </button>
        </div>

        <select
          value={selectedVirtualModel?.id || ''}
          onChange={(e) => {
            const found = virtualModels.find((vm) => vm.id === e.target.value);
            if (found) {
              onSelectVirtualModel(found);
            }
          }}
          className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer"
        >
          {virtualModels.map((vm) => (
            <option key={vm.id} value={vm.id}>
              {vm.name} ({vm.provider})
            </option>
          ))}
        </select>
      </div>

      {/* 2. Interactive Underlying Engine / Model Selector */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            Select AI Model
          </label>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
            {underlyingModel?.provider}
          </span>
        </div>

        <select
          value={selectedModelId}
          onChange={(e) => onSelectModelId(e.target.value)}
          className="w-full text-xs font-bold text-indigo-900 bg-white border border-indigo-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.provider})
            </option>
          ))}
        </select>

        <div className="text-[10px] text-slate-500 flex justify-between font-mono pt-1">
          <span>In: ${underlyingModel?.inputTokenPrice}/1k</span>
          <span>Out: ${underlyingModel?.outputTokenPrice}/1k</span>
          <span>Ctx: {(underlyingModel?.contextWindow || 128000) / 1000}k</span>
        </div>
      </div>

      {/* 3. Interactive Active Policy Selector */}
      <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 space-y-2">
        <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Active Policy
          </span>
        </div>

        <select
          value={selectedPolicyId}
          onChange={(e) => onSelectPolicyId(e.target.value)}
          className="w-full text-xs font-semibold text-slate-800 bg-white border border-indigo-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
        >
          {policies.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-white p-2 rounded border border-indigo-100/80">
          <div>
            <span className="text-slate-500 block">Block @</span>
            <span className="font-bold text-red-600">&gt;{activePolicy?.blockThreshold || activePolicy?.riskThresholdBlock || 60} Risk</span>
          </div>
          <div>
            <span className="text-slate-500 block">Escalate @</span>
            <span className="font-bold text-purple-600">&gt;{activePolicy?.escalationThreshold || activePolicy?.riskThresholdEscalate || 40} Risk</span>
          </div>
        </div>
      </div>

      {/* 4. Interactive Guardrail Toggles / Checkboxes */}
      <div>
        <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            Configure Guardrails ({activeGuardrailCount} active)
          </span>
        </div>

        <div className="space-y-1.5">
          {guardrails.map((gr) => {
            const isEnabled = (selectedGuardrailIds || []).includes(gr.id);
            return (
              <div
                key={gr.id}
                onClick={() => onToggleGuardrailId(gr.id)}
                className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all select-none ${
                  isEnabled
                    ? 'bg-blue-50/70 border-blue-200 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center text-white text-[10px] shrink-0 ${
                      isEnabled ? 'bg-blue-600' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isEnabled && <Check className="w-3 h-3 stroke-3" />}
                  </div>
                  <div className="truncate">
                    <div className={`font-semibold truncate text-[11px] ${isEnabled ? 'text-slate-900' : 'text-slate-500'}`}>
                      {gr.name}
                    </div>
                    <div className="text-[9px] text-slate-400 uppercase">{gr.category}</div>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    gr.action === 'MODIFY'
                      ? 'bg-amber-100 text-amber-800'
                      : gr.action === 'BLOCK'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {gr.action}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Budget & Spend Meter */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1.5">
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            Daily Spend Cap
          </span>
          <span className="font-mono text-slate-600">
            ${selectedVirtualModel?.spentToday.toFixed(2)} / ${selectedVirtualModel?.dailyBudget.toFixed(2)}
          </span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              budgetPct > 80 ? 'bg-red-500' : budgetPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${budgetPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono">
          <span>{budgetPct}% Used</span>
          <span>${Math.max(0, (selectedVirtualModel?.dailyBudget || 100) - (selectedVirtualModel?.spentToday || 0)).toFixed(2)} Remaining</span>
        </div>
      </div>

      {/* 6. Inference Parameters */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
        <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
          Parameters
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-mono">
            <span>Temperature</span>
            <span className="font-bold">{temperature}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-mono">
            <span>Max Tokens</span>
            <span className="font-bold">{maxTokens}</span>
          </div>
          <input
            type="range"
            min="256"
            max="4096"
            step="128"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>
    </div>
  );
}
