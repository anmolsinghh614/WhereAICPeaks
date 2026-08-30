'use client';

import React from 'react';
import { VirtualModel, PolicyRule, GuardrailConfig, FoundationModel } from '@/types';
import { Layers, ShieldCheck, ShieldAlert, DollarSign, Plus, Cpu, SlidersHorizontal, Check, Zap } from 'lucide-react';

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
    <div className="w-full bg-[#0F172A]/90 backdrop-blur-md border border-slate-800 rounded-2xl p-5 flex flex-col gap-5 shrink-0 overflow-y-auto max-h-[calc(100vh-8rem)] select-none shadow-2xl">
      {/* 1. Virtual Endpoint Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            Virtual Endpoint
          </label>
          <button
            onClick={onOpenCreateModelModal}
            className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Plus className="w-3 h-3 stroke-3" />
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
          className="w-full text-xs font-semibold text-white bg-[#1E293B] border border-slate-700 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer shadow-inner hover:border-slate-600"
        >
          {virtualModels.map((vm) => (
            <option key={vm.id} value={vm.id} className="bg-slate-900 text-white">
              {vm.name} ({vm.provider})
            </option>
          ))}
        </select>
      </div>

      {/* 2. Interactive AI Model Selector Card */}
      <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/60 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            Select AI Model
          </label>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold tracking-wide">
            {underlyingModel?.provider}
          </span>
        </div>

        <select
          value={selectedModelId}
          onChange={(e) => onSelectModelId(e.target.value)}
          className="w-full text-xs font-bold text-white bg-[#1E293B] border border-indigo-700/70 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer shadow-inner"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id} className="bg-slate-900 text-white">
              {m.name} ({m.provider})
            </option>
          ))}
        </select>

        <div className="text-[10px] text-indigo-300/80 flex justify-between font-mono pt-1 border-t border-indigo-800/50">
          <span>In: ${underlyingModel?.inputTokenPrice}/1k</span>
          <span>Out: ${underlyingModel?.outputTokenPrice}/1k</span>
          <span>Ctx: {(underlyingModel?.contextWindow || 128000) / 1000}k</span>
        </div>
      </div>

      {/* 3. Interactive Active Policy Selector */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Active Policy
          </span>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
            {activePolicy?.id}
          </span>
        </div>

        <select
          value={selectedPolicyId}
          onChange={(e) => onSelectPolicyId(e.target.value)}
          className="w-full text-xs font-semibold text-white bg-[#1E293B] border border-slate-700 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer shadow-inner"
        >
          {policies.map((p) => (
            <option key={p.id} value={p.id} className="bg-slate-900 text-white">
              {p.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-slate-950/80 p-2 rounded-lg border border-slate-800">
          <div>
            <span className="text-slate-400 block">Block At</span>
            <span className="font-bold text-red-400">&gt;{activePolicy?.blockThreshold || activePolicy?.riskThresholdBlock || 60} Risk</span>
          </div>
          <div>
            <span className="text-slate-400 block">Escalate At</span>
            <span className="font-bold text-purple-400">&gt;{activePolicy?.escalationThreshold || activePolicy?.riskThresholdEscalate || 40} Risk</span>
          </div>
        </div>
      </div>

      {/* 4. Interactive Guardrail Toggles */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            Configured Guardrails
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
            {activeGuardrailCount} active
          </span>
        </div>

        <div className="space-y-1.5">
          {guardrails.map((gr) => {
            const isEnabled = (selectedGuardrailIds || []).includes(gr.id);
            return (
              <div
                key={gr.id}
                onClick={() => onToggleGuardrailId(gr.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all duration-200 ${
                  isEnabled
                    ? 'bg-blue-950/50 border-blue-500/40 text-white shadow-md'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-400 opacity-60 hover:opacity-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center text-white text-[10px] shrink-0 transition-all ${
                      isEnabled ? 'bg-blue-600 shadow-xs' : 'border border-slate-700 bg-slate-800'
                    }`}
                  >
                    {isEnabled && <Check className="w-3 h-3 stroke-3" />}
                  </div>
                  <div className="truncate">
                    <div className={`font-semibold truncate text-[11px] ${isEnabled ? 'text-white' : 'text-slate-400'}`}>
                      {gr.name}
                    </div>
                    <div className="text-[9px] text-slate-400 uppercase font-mono">{gr.category}</div>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded shrink-0 ${
                    gr.action === 'MODIFY'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : gr.action === 'BLOCK'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
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
      <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 shadow-md">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-200 font-mono">
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Daily Spend Cap
          </span>
          <span className="font-mono text-slate-300 text-[10px]">
            ${selectedVirtualModel?.spentToday.toFixed(2)} / ${selectedVirtualModel?.dailyBudget.toFixed(2)}
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetPct > 80 ? 'bg-red-500' : budgetPct > 50 ? 'bg-amber-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${budgetPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-slate-400 font-mono">
          <span>{budgetPct}% Used</span>
          <span>${Math.max(0, (selectedVirtualModel?.dailyBudget || 100) - (selectedVirtualModel?.spentToday || 0)).toFixed(2)} Remaining</span>
        </div>
      </div>

      {/* 6. Parameters */}
      <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3 shadow-md">
        <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-mono">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          Inference Parameters
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-slate-300 mb-1 font-mono">
            <span>Temperature</span>
            <span className="font-bold text-white px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">{temperature}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
        <div>
          <div className="flex justify-between text-[11px] text-slate-300 mb-1 font-mono">
            <span>Max Tokens</span>
            <span className="font-bold text-white px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">{maxTokens}</span>
          </div>
          <input
            type="range"
            min="256"
            max="4096"
            step="128"
            value={maxTokens}
            onChange={(e) => setMaxTokens(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
