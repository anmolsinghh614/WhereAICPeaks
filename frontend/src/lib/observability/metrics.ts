import { DashboardMetrics, GuardrailMetric, ModelUsageMetric, TraceRecord } from '@/types';
import { tracingEngine } from '../tracing/trace';

export class MetricsEngine {
  private baseRequests = 4540;
  private baseCost = 148.68;
  private baseTokens = 1428000;
  private allowedCount = 3850;
  private modifiedCount = 394;
  private blockedCount = 218;
  private escalatedCount = 78;

  recordExecution(trace: TraceRecord): void {
    this.baseRequests += 1;
    this.baseCost += trace.costUsd;
    this.baseTokens += trace.totalTokens;

    if (trace.decision === 'ALLOW') this.allowedCount += 1;
    else if (trace.decision === 'MODIFY') this.modifiedCount += 1;
    else if (trace.decision === 'BLOCK') this.blockedCount += 1;
    else if (trace.decision === 'ESCALATE') this.escalatedCount += 1;
  }

  getDashboardMetrics(): DashboardMetrics {
    const traces = tracingEngine.getAll();
    const recentLatency = traces.slice(0, 10).map((t) => t.latencyMs);
    const avgLatency = recentLatency.length
      ? Math.round(recentLatency.reduce((a, b) => a + b, 0) / recentLatency.length)
      : 640;

    const recentRisk = traces.slice(0, 10).map((t) => t.riskScore);
    const avgRisk = recentRisk.length
      ? Math.round(recentRisk.reduce((a, b) => a + b, 0) / recentRisk.length)
      : 24;

    return {
      totalRequests: this.baseRequests,
      totalCost: Number(this.baseCost.toFixed(4)),
      totalTokens: this.baseTokens,
      avgLatencyMs: avgLatency,
      avgRiskScore: avgRisk,
      blockedCount: this.blockedCount,
      escalatedCount: this.escalatedCount,
      modifiedCount: this.modifiedCount,
      allowedCount: this.allowedCount,
      budgetUtilizationPct: Math.min(100, Math.round((this.baseCost / 500) * 100)),
      requestsTrend: [280, 310, 295, 340, 420, 380, 490, 530, 480, 560, 610, 650],
      costTrend: [8.5, 9.8, 9.1, 10.4, 12.2, 11.5, 14.8, 16.2, 14.9, 17.5, 18.2, 19.8],
      riskTrend: [21, 24, 22, 28, 25, 29, 23, 27, 24, 22, 25, avgRisk],
      decisionDistribution: {
        allow: this.allowedCount,
        modify: this.modifiedCount,
        block: this.blockedCount,
        escalate: this.escalatedCount,
      },
    };
  }

  getModelUsage(): ModelUsageMetric[] {
    return [
      {
        modelId: 'mod-gpt4o',
        modelName: 'GPT-4.1 Enterprise',
        provider: 'OpenAI',
        requests: 2180,
        tokens: 684000,
        cost: 88.42,
        avgLatencyMs: 680,
        avgRisk: 22,
      },
      {
        modelId: 'mod-claude37',
        modelName: 'Claude 3.7 Sonnet',
        provider: 'Anthropic',
        requests: 1840,
        tokens: 580000,
        cost: 54.18,
        avgLatencyMs: 740,
        avgRisk: 16,
      },
      {
        modelId: 'mod-gemini2',
        modelName: 'Gemini 2.0 Flash',
        provider: 'Google',
        requests: 420,
        tokens: 142000,
        cost: 4.82,
        avgLatencyMs: 320,
        avgRisk: 28,
      },
      {
        modelId: 'mod-cp-mock',
        modelName: 'ControlPlane Guarded LLM',
        provider: 'ControlPlane',
        requests: 100,
        tokens: 22000,
        cost: 1.26,
        avgLatencyMs: 450,
        avgRisk: 14,
      },
    ];
  }

  getGuardrailViolations(): GuardrailMetric[] {
    return [
      {
        guardrailId: 'gr-pii',
        name: 'PII Detection & Masking',
        violations: this.modifiedCount,
        blockedCount: 0,
        modifiedCount: this.modifiedCount,
        lastTriggered: new Date().toISOString(),
      },
      {
        guardrailId: 'gr-prompt-inj',
        name: 'Prompt Injection & Jailbreak Shield',
        violations: this.blockedCount,
        blockedCount: this.blockedCount,
        modifiedCount: 0,
        lastTriggered: new Date().toISOString(),
      },
      {
        guardrailId: 'gr-secrets',
        name: 'Secrets & API Key Exposure',
        violations: 42,
        blockedCount: 42,
        modifiedCount: 0,
        lastTriggered: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        guardrailId: 'gr-fin-advice',
        name: 'Financial Advisory Compliance',
        violations: this.escalatedCount,
        blockedCount: 0,
        modifiedCount: 0,
        lastTriggered: new Date().toISOString(),
      },
    ];
  }
}

export const metricsEngine = new MetricsEngine();
