'use client';

import React, { useState } from 'react';
import { PolicyRule } from '@/types';
import { X, ShieldCheck, Plus } from 'lucide-react';

interface CreatePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newPolicy: PolicyRule) => void;
}

export function CreatePolicyModal({ isOpen, onClose, onCreated }: CreatePolicyModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [riskThreshold, setRiskThreshold] = useState(50);
  const [maxCostPerRequest, setMaxCostPerRequest] = useState(0.04);
  const [dailyBudget, setDailyBudget] = useState(100.0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a policy name.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          riskThreshold: Number(riskThreshold),
          maxCostPerRequest: Number(maxCostPerRequest),
          dailyBudget: Number(dailyBudget),
          allowedModels: ['openai-gpt-4-1', 'anthropic-claude-3-7-sonnet', 'google-gemini-2-flash', 'cp-demo-engine'],
          requiredGuardrails: ['gr-pii', 'gr-prompt-inj', 'gr-secrets'],
          defaultAction: 'ALLOW',
          escalationThreshold: 75,
          blockThreshold: 85,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create policy');

      onCreated(data);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Policy creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm">Create Enterprise Governance Policy</h2>
              <p className="text-[11px] text-slate-400">Configure risk boundaries and cost ceilings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Policy Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Healthcare & HIPAA Compliance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Strict rules for patient data sanitization and medical advisory disclaimers"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Risk Threshold (0-100)
              </label>
              <input
                type="number"
                min="10"
                max="95"
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(parseInt(e.target.value, 10))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Max Cost / Request ($)
              </label>
              <input
                type="number"
                min="0.005"
                max="0.5"
                step="0.005"
                value={maxCostPerRequest}
                onChange={(e) => setMaxCostPerRequest(parseFloat(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-mono"
              />
            </div>
          </div>

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
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Creating...' : 'Save Policy'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
