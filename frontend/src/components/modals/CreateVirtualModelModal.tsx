'use client';

import React, { useState } from 'react';
import { FoundationModel, GuardrailConfig, PolicyRule, VirtualModel } from '@/types';
import { X, Layers, Plus, ShieldCheck, DollarSign } from 'lucide-react';

interface CreateVirtualModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newModel: VirtualModel) => void;
  policies: PolicyRule[];
  guardrails: GuardrailConfig[];
  models: FoundationModel[];
}

export function CreateVirtualModelModal({
  isOpen,
  onClose,
  onCreated,
  policies,
  guardrails,
  models,
}: CreateVirtualModelModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [underlyingModelId, setUnderlyingModelId] = useState(models[0]?.id || 'openai-gpt-4-1');
  const [systemPrompt, setSystemPrompt] = useState('You are an enterprise AI assistant compliant with ControlPlane policies.');
  const [temperature, setTemperature] = useState(0.5);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [policyId, setPolicyId] = useState(policies[0]?.id || 'pol-general-enterprise');
  const [selectedGuardrails, setSelectedGuardrails] = useState<string[]>(['gr-pii', 'gr-prompt-inj', 'gr-secrets']);
  const [dailyBudget, setDailyBudget] = useState(100.0);
  const [perRequestBudget, setPerRequestBudget] = useState(0.05);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedModelObj = models.find((m) => m.id === underlyingModelId);

  const toggleGuardrail = (id: string) => {
    setSelectedGuardrails((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a Virtual Model name.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/virtual-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          underlyingModelId,
          provider: selectedModelObj?.provider || 'OpenAI',
          systemPrompt,
          temperature,
          maxTokens,
          policyId,
          guardrailIds: selectedGuardrails,
          dailyBudget: Number(dailyBudget),
          perRequestBudget: Number(perRequestBudget),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create virtual model');
      }

      onCreated(data);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm">Create Enterprise Virtual Model</h2>
              <p className="text-[11px] text-slate-400">
                Define a logical AI endpoint with attached policies & guardrails
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Virtual Model Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Risk Analytics Copilot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="Internal compliance and fraud detection assistant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Underlying Foundation Model *
              </label>
              <select
                value={underlyingModelId}
                onChange={(e) => setUnderlyingModelId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.provider})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Policy Rule Set *
              </label>
              <select
                value={policyId}
                onChange={(e) => setPolicyId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {policies.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Max: ${p.maxCostPerRequest}/req)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              System Instruction Prompt
            </label>
            <textarea
              rows={2}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
            />
          </div>

          {/* Active Guardrails Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Enabled Guardrails
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {guardrails.map((gr) => {
                const isSelected = selectedGuardrails.includes(gr.id);
                return (
                  <div
                    key={gr.id}
                    onClick={() => toggleGuardrail(gr.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2 select-none ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 text-blue-950 font-semibold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-blue-600 focus:ring-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] truncate">{gr.name}</div>
                      <div className="text-[9px] text-slate-500 uppercase font-mono font-normal">
                        {gr.action} • {gr.severity}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget Limits */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Daily Budget ($ USD)
              </label>
              <input
                type="number"
                min="5"
                max="10000"
                step="5"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(parseFloat(e.target.value))}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Per Request Cap ($ USD)
              </label>
              <input
                type="number"
                min="0.001"
                max="1.0"
                step="0.005"
                value={perRequestBudget}
                onChange={(e) => setPerRequestBudget(parseFloat(e.target.value))}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Creating...' : 'Deploy Virtual Model'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
