import { FoundationModel } from '@/types';

export const SEEDED_MODELS: FoundationModel[] = [
  {
    id: 'mod-gemini-3-7',
    provider: 'Google',
    name: 'Gemini 3.7 Flash',
    modelName: 'gemini-3.7-flash',
    inputTokenPrice: 0.0001,
    outputTokenPrice: 0.0004,
    contextWindow: 1000000,
    latencyAvgMs: 290,
    capabilities: ['Next-Gen Reasoning', 'Multimodal', 'Ultra Low Latency'],
    enabled: true,
  },
  {
    id: 'mod-gemini-3-6',
    provider: 'Google',
    name: 'Gemini 3.6 Flash',
    modelName: 'gemini-3.6-flash',
    inputTokenPrice: 0.00008,
    outputTokenPrice: 0.0003,
    contextWindow: 1000000,
    latencyAvgMs: 270,
    capabilities: ['High Speed', 'Low Latency', 'Multimodal'],
    enabled: true,
  },
  {
    id: 'mod-gemini-3-5',
    provider: 'Google',
    name: 'Gemini 3.5 Flash',
    modelName: 'gemini-3.5-flash',
    inputTokenPrice: 0.00007,
    outputTokenPrice: 0.0003,
    contextWindow: 1000000,
    latencyAvgMs: 250,
    capabilities: ['Fast Inference', 'Massive Context', 'Cost Efficient'],
    enabled: true,
  },
  {
    id: 'mod-gemini-3-1-pro',
    provider: 'Google',
    name: 'Gemini 3.1 Pro',
    modelName: 'gemini-3.1-pro-preview',
    inputTokenPrice: 0.00125,
    outputTokenPrice: 0.005,
    contextWindow: 2000000,
    latencyAvgMs: 650,
    capabilities: ['Complex Reasoning', 'Deep Analysis', '2M Context'],
    enabled: true,
  },
  {
    id: 'mod-gemini2',
    provider: 'Google',
    name: 'Gemini 2.0 Flash',
    modelName: 'gemini-2.0-flash',
    inputTokenPrice: 0.0001,
    outputTokenPrice: 0.0004,
    contextWindow: 1000000,
    latencyAvgMs: 320,
    capabilities: ['High Speed', 'Multimodal', 'Massive Context'],
    enabled: true,
  },
  {
    id: 'mod-gpt4o',
    provider: 'OpenAI',
    name: 'GPT-4.1 Enterprise',
    modelName: 'gpt-4.1-turbo',
    inputTokenPrice: 0.005,
    outputTokenPrice: 0.015,
    contextWindow: 128000,
    latencyAvgMs: 680,
    capabilities: ['Reasoning', 'Code', 'Financial Analysis', 'Tool Use'],
    enabled: true,
  },
  {
    id: 'mod-claude37',
    provider: 'Anthropic',
    name: 'Claude 3.7 Sonnet',
    modelName: 'claude-3-7-sonnet',
    inputTokenPrice: 0.003,
    outputTokenPrice: 0.015,
    contextWindow: 200000,
    latencyAvgMs: 740,
    capabilities: ['Deep Analysis', 'Code Refactoring', 'Policy Auditing'],
    enabled: true,
  },
  {
    id: 'mod-cp-mock',
    provider: 'ControlPlane',
    name: 'ControlPlane Guarded LLM',
    modelName: 'controlplane-runtime-v1',
    inputTokenPrice: 0.001,
    outputTokenPrice: 0.002,
    contextWindow: 64000,
    latencyAvgMs: 450,
    capabilities: ['Real-time Evaluation', 'Zero-Egress Compliance', 'Deterministic Guardrails'],
    enabled: true,
  },
];

export class ModelRegistry {
  private models: Map<string, FoundationModel> = new Map();

  constructor() {
    SEEDED_MODELS.forEach((m) => this.models.set(m.id, m));
  }

  getAll(): FoundationModel[] {
    return Array.from(this.models.values());
  }

  getById(id: string): FoundationModel | undefined {
    return (
      this.models.get(id) ||
      Array.from(this.models.values()).find(
        (m) => m.id === id || m.name === id || m.modelName === id
      )
    );
  }

  register(model: FoundationModel): void {
    this.models.set(model.id, model);
  }
}

export const modelRegistry = new ModelRegistry();
