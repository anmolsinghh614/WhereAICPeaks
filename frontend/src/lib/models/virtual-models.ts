import { VirtualModel } from '@/types';

export const SEEDED_VIRTUAL_MODELS: VirtualModel[] = [
  {
    id: 'vm-finance-assistant',
    name: 'Finance Assistant',
    description: 'Enterprise financial copilot enforcing strict PII redaction and SEC market advisory guardrails.',
    underlyingModelId: 'mod-gpt4o',
    provider: 'OpenAI',
    systemPrompt: 'You are an enterprise financial analysis assistant. Adhere strictly to compliance regulations and never disclose unvetted investment advice or private customer records.',
    temperature: 0.2,
    maxTokens: 2048,
    policyId: 'pol-finance-strict',
    guardrailIds: ['gr-pii', 'gr-prompt-inj', 'gr-fin-advice'],
    dailyBudget: 150.0,
    perRequestBudget: 0.05,
    spentToday: 42.85,
    totalRequests: 1240,
    avgRisk: 22,
    enabled: true,
  },
  {
    id: 'vm-customer-support',
    name: 'Customer Support Bot',
    description: 'Tier-1 customer service agent with PII masking and tone guardrails.',
    underlyingModelId: 'mod-claude37',
    provider: 'Anthropic',
    systemPrompt: 'You are a helpful customer support agent for Enterprise Cloud Services.',
    temperature: 0.5,
    maxTokens: 1024,
    policyId: 'pol-support-standard',
    guardrailIds: ['gr-pii', 'gr-prompt-inj', 'gr-unsafe'],
    dailyBudget: 75.0,
    perRequestBudget: 0.02,
    spentToday: 18.2,
    totalRequests: 2180,
    avgRisk: 14,
    enabled: true,
  },
  {
    id: 'vm-engineering-copilot',
    name: 'Engineering Copilot',
    description: 'Internal developer assistant guarding against API token leakage and prompt injection.',
    underlyingModelId: 'mod-claude37',
    provider: 'Anthropic',
    systemPrompt: 'You are an engineering coding assistant. Never output confidential private keys, passwords, or production DB strings.',
    temperature: 0.2,
    maxTokens: 4096,
    policyId: 'pol-engineering',
    guardrailIds: ['gr-secrets', 'gr-prompt-inj'],
    dailyBudget: 200.0,
    perRequestBudget: 0.1,
    spentToday: 84.1,
    totalRequests: 980,
    avgRisk: 28,
    enabled: true,
  },
  {
    id: 'vm-demo-guard',
    name: 'ControlPlane Demo Endpoint',
    description: 'Interactive sandbox endpoint for demonstrating real-time governance, PII redactions, and safety decisions.',
    underlyingModelId: 'mod-cp-mock',
    provider: 'ControlPlane',
    systemPrompt: 'ControlPlane Demonstration Endpoint.',
    temperature: 0.7,
    maxTokens: 1024,
    policyId: 'pol-general-enterprise',
    guardrailIds: ['gr-pii', 'gr-prompt-inj', 'gr-secrets', 'gr-fin-advice'],
    dailyBudget: 100.0,
    perRequestBudget: 0.05,
    spentToday: 3.52,
    totalRequests: 136,
    avgRisk: 18,
    enabled: true,
  },
];

export class VirtualModelManager {
  private virtualModels: Map<string, VirtualModel> = new Map();

  constructor() {
    SEEDED_VIRTUAL_MODELS.forEach((vm) => this.virtualModels.set(vm.id, vm));
  }

  getAll(): VirtualModel[] {
    return Array.from(this.virtualModels.values());
  }

  getById(id: string): VirtualModel | undefined {
    return this.virtualModels.get(id);
  }

  create(vm: VirtualModel): VirtualModel {
    this.virtualModels.set(vm.id, vm);
    return vm;
  }

  update(id: string, updates: Partial<VirtualModel>): VirtualModel | null {
    const existing = this.virtualModels.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.virtualModels.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.virtualModels.delete(id);
  }

  recordSpend(id: string, cost: number, riskScore: number): void {
    const vm = this.virtualModels.get(id);
    if (vm) {
      vm.spentToday = Number((vm.spentToday + cost).toFixed(4));
      vm.totalRequests += 1;
      vm.avgRisk = Math.round((vm.avgRisk * (vm.totalRequests - 1) + riskScore) / vm.totalRequests);
    }
  }
}

export const virtualModelManager = new VirtualModelManager();
