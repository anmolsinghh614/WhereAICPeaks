'use client';

import React from 'react';
import { VirtualModel, PolicyRule, GuardrailConfig, FoundationModel } from '@/types';
import { Layers, ShieldCheck, ShieldAlert, DollarSign, Plus, Cpu, SlidersHorizontal } from 'lucide-react';

interface PlaygroundConfigProps {
  virtualModels: VirtualModel[];
  selectedVirtualModel: VirtualModel | null;
  onSelectVirtualModel: (model: VirtualModel) => void;
  policies: PolicyRule[];
  guardrails: GuardrailConfig[];
  models: FoundationModel[];
  temperature: number;
  setTemperature: (val: number) => void;
  maxTokens: number;
  setMaxTokens: (val: number) => void;
  onOpenCreateModelModal: () => void;
}

export function PlaygroundConfig({
  virtualModels,
  selectedVirtualModel,
  onSelectVirtualModel,
  policies,
  guardrails,
  models,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  onOpenCreateModelModal,
}: PlaygroundConfigProps) {
  const activePolicy = policies.find((p) => p.id === selectedVirtualModel?.policyId);
  const underlyingModel = models.find((m) => m.id === selectedVirtualModel?.underlyingModelId);
  const activeGuardrails = guardrails.filter((g) => selectedVirtualModel?.guardrailIds.includes(g.id));

  const budgetPct = selectedVirtualModel
    ? Math.min(100, Math.round((selectedVirtualModel.spentToday / selectedVirtualModel.dailyBudget) * 100))
    : 0;

  return (
    <div className="w-80 bg-white border border-slate-200 rounded-xl p-4.5 shadow-sm flex flex-col gap-5 shrink-0 overflow-y-auto max-h-[calc(100vh-8rem)]">
      {/* Virtual Model Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Virtual Model
          </label>
          <button
            onClick={onOpenCreateModelModal}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3 h-3" />
            New
          </button>
        </div>

        <select
          value={selectedVirtualModel?.id || ''}
          onChange={(e) => {
            const found = virtualModels.find((vm) => vm.id === e.target.value);
            if (found) onSelectVirtualModel(found);
          }}
          className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer"
        >
          {virtualModels.map((vm) => (
            <option key={vm.id} value={vm.id}>
              {vm.name} ({vm.provider})
            </option>
          ))}
        </select>

        {selectedVirtualModel && (
          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
            {selectedVirtualModel.description}
          </p>
        )}
      </div>

      {/* Underlying Model Details */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
        <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-indigo-600" />
          Underlying Engine
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800">{underlyingModel?.name || selectedVirtualModel?.underlyingModelId}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-200">
            {selectedVirtualModel?.provider}
          </span>
        </div>
        <div className="mt-2 text-[10px] text-slate-500 flex justify-between font-mono">
          <span>In: ${underlyingModel?.inputTokenPrice}/1k</span>
          <span>Out: ${underlyingModel?.outputTokenPrice}/1k</span>
          <span>Ctx: {(underlyingModel?.contextWindow || 128000) / 1000}k</span>
        </div>
      </div>

      {/* Active Policy */}
      <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
        <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Active Policy
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold">
            {activePolicy?.name || 'General Enterprise'}
          </span>
        </div>
        <div className="text-[11px] text-slate-600 mb-2">
          {activePolicy?.description}
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-white p-2 rounded border border-indigo-100/80">
          <div>
            <span className="text-slate-500 block">Risk Threshold</span>
            <span className="font-bold text-slate-800">{activePolicy?.riskThreshold || 50} / 100</span>
          </div>
          <div>
            <span className="text-slate-500 block">Max Cost / Req</span>
            <span className="font-bold text-slate-800">${activePolicy?.maxCostPerRequest || 0.05}</span>
          </div>
        </div>
      </div>

      {/* Active Guardrails */}
      <div>
        <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            Enabled Guardrails ({activeGuardrails.length})
          </span>
        </div>
        <div className="space-y-1.5">
          {activeGuardrails.map((gr) => (
            <div
              key={gr.id}
              className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-200 text-xs"
            >
              <div className="truncate pr-2">
                <div className="font-semibold text-slate-800 truncate text-[11px]">{gr.name}</div>
                <div className="text-[9px] text-slate-500 uppercase">{gr.category}</div>
              </div>
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  gr.action === 'MODIFY'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : gr.action === 'BLOCK'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-purple-100 text-purple-800 border border-purple-200'
                }`}
              >
                {gr.action}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Budget & Spend Meter */}
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

      {/* Inference Parameters */}
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
        <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
          Model Parameters
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
