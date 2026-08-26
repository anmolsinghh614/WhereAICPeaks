import { modelRouter } from '../providers/router';
import { virtualModelManager } from '../models/virtual-models';
import { modelRegistry } from '../models/registry';
import { guardrailEngine } from '../guardrails/engine';
import { budgetEngine, costEngine, performanceEngine } from '../budget/engine';
import { responsibilityEngine } from '../responsibility/engine';
import { riskEngine } from '../risk/engine';
import { policyEngine, enforcementEngine } from '../policy/engine';
import { tracingEngine } from '../tracing/trace';
import { eventBus } from '../observability/events';
import { metricsEngine } from '../observability/metrics';
import { TraceRecord, TraceSpan } from '@/types';

export interface ExecuteControlPlaneParams {
  virtualModelId: string;
  prompt: string;
  modelId?: string;
  provider?: string;
  policyId?: string;
  guardrailIds?: string[];
  scenario?: string;
  customParameters?: {
    temperature?: number;
    maxTokens?: number;
  };
}

export interface ControlPlaneExecutionResult {
  requestId: string;
  traceId: string;
  response: string;
  originalResponse?: string;
  decision: 'ALLOW' | 'MODIFY' | 'BLOCK' | 'ESCALATE';
  decisionReason: string;
  riskScore: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  performanceScore: number;
  responsibilityScore: 'PASS' | 'WARNING' | 'VIOLATION';
  policyStatus: 'PASS' | 'MODIFIED' | 'VIOLATION' | 'ESCALATED';
  cost: number;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  latencyMs: number;
  guardrails: {
    violations: string[];
    triggeredRules: string[];
  };
  policy: {
    id: string;
    name: string;
  };
  spans: TraceSpan[];
  trace: TraceRecord;
}

export async function executeControlPlane(
  params: ExecuteControlPlaneParams
): Promise<ControlPlaneExecutionResult> {
  const startTime = Date.now();
  const traceId = `tr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const requestId = `req-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  // 1. Resolve Virtual Model, Selected Foundation Model, Policy & Guardrails
  const virtualModel =
    virtualModelManager.getById(params.virtualModelId) ||
    virtualModelManager.getAll()[0];

  const underlyingModel =
    (params.modelId ? modelRegistry.getById(params.modelId) : null) ||
    modelRegistry.getById(virtualModel.underlyingModelId) ||
    modelRegistry.getAll()[0];

  const activeProvider =
    params.provider || underlyingModel.provider || virtualModel.provider;

  const policy =
    (params.policyId ? policyEngine.getById(params.policyId) : null) ||
    policyEngine.getById(virtualModel.policyId) ||
    policyEngine.getAll()[0];

  const activeGuardrailIds =
    params.guardrailIds && params.guardrailIds.length > 0
      ? params.guardrailIds
      : virtualModel.guardrailIds;

  // 2. STAGE 1: INPUT GUARDRAILS CHECK
  const inputGuardrails = guardrailEngine.evaluateInput(
    params.prompt,
    activeGuardrailIds
  );

  // 3. STAGE 2: BUDGET CHECK
  const estimatedInputTokens = Math.max(1, Math.round(params.prompt.length / 4));
  const estimatedCost = (estimatedInputTokens / 1000) * underlyingModel.inputTokenPrice;
  const budgetResult = budgetEngine.checkBudget(
    virtualModel.dailyBudget,
    virtualModel.spentToday,
    virtualModel.perRequestBudget,
    estimatedCost
  );

  // Early Exit if Input Blocked or Budget Exceeded
  if (inputGuardrails.primaryAction === 'BLOCK' || !budgetResult.allowed) {
    const isBudgetBlock = !budgetResult.allowed;
    const reason = isBudgetBlock
      ? budgetResult.reason
      : inputGuardrails.violations[0]?.reason || 'Prompt injection vector detected on input.';
    const decision = 'BLOCK';
    const latencyMs = Date.now() - startTime;
    const cost = 0.0001;

    const trace: TraceRecord = {
      id: traceId,
      timestamp: new Date().toISOString(),
      virtualModelId: virtualModel.id,
      virtualModelName: virtualModel.name,
      provider: activeProvider,
      model: underlyingModel.name,
      prompt: params.prompt,
      finalResponse: `Request blocked by ControlPlane: ${reason}`,
      decision,
      decisionReason: reason,
      riskScore: isBudgetBlock ? 55 : 89,
      riskCategory: isBudgetBlock ? 'MEDIUM' : 'CRITICAL',
      performanceScore: 0,
      responsibilityScore: 'VIOLATION',
      policyStatus: 'VIOLATION',
      latencyMs,
      costUsd: cost,
      promptTokens: estimatedInputTokens,
      completionTokens: 0,
      totalTokens: estimatedInputTokens,
      triggeredRules: isBudgetBlock ? ['budget-ceiling-exceeded'] : ['gr-prompt-inj'],
      guardrailViolations: isBudgetBlock
        ? ['Budget: Daily spend limit reached']
        : inputGuardrails.violations.map((v) => `${v.type}: ${v.reason}`),
      spans: tracingEngine.generateDefaultSpans(traceId, latencyMs, decision),
    };

    tracingEngine.recordTrace(trace);
    metricsEngine.recordExecution(trace);
    virtualModelManager.recordSpend(virtualModel.id, cost, trace.riskScore);

    eventBus.emit({
      id: `ev-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      virtualModelName: virtualModel.name,
      model: underlyingModel.name,
      stage: 'Request Blocked',
      message: reason,
      decision: 'BLOCK',
      riskScore: trace.riskScore,
      type: 'DANGER',
    });

    return {
      requestId,
      traceId,
      response: trace.finalResponse,
      decision: 'BLOCK',
      decisionReason: reason,
      riskScore: trace.riskScore,
      riskCategory: trace.riskCategory,
      performanceScore: 0,
      responsibilityScore: 'VIOLATION',
      policyStatus: 'VIOLATION',
      cost,
      tokens: { prompt: estimatedInputTokens, completion: 0, total: estimatedInputTokens },
      latencyMs,
      guardrails: {
        violations: trace.guardrailViolations,
        triggeredRules: trace.triggeredRules,
      },
      policy: { id: policy.id, name: policy.name },
      spans: trace.spans,
      trace,
    };
  }

  // 4. STAGE 3 & 4: MODEL ROUTING & LLM EXECUTION
  const llmResponse = await modelRouter.routeAndExecute(activeProvider, {
    model: underlyingModel.name,
    prompt: params.prompt,
    systemPrompt: virtualModel.systemPrompt,
    temperature: params.customParameters?.temperature ?? virtualModel.temperature,
    maxTokens: params.customParameters?.maxTokens ?? virtualModel.maxTokens,
    scenario: params.scenario,
  });

  // 5. STAGE 5: OUTPUT GUARDRAILS CHECK
  const outputGuardrails = guardrailEngine.evaluateOutput(
    llmResponse.content,
    activeGuardrailIds
  );

  // 6. STAGE 6: PERFORMANCE EVALUATION
  const performance = performanceEngine.evaluate(
    llmResponse.content,
    llmResponse.latencyMs,
    underlyingModel.latencyAvgMs || 700
  );

  // 7. STAGE 7: COST CALCULATION
  const costCalculation = costEngine.calculateCost(
    llmResponse.inputTokens,
    llmResponse.outputTokens,
    underlyingModel.inputTokenPrice,
    underlyingModel.outputTokenPrice
  );

  // 8. STAGE 8: RESPONSIBILITY EVALUATION
  const allGuardrailResults = [...inputGuardrails.results, ...outputGuardrails.results];
  const allViolations = [...inputGuardrails.violations, ...outputGuardrails.violations];
  const responsibility = responsibilityEngine.evaluate(allGuardrailResults);

  // 9. STAGE 9: RISK ENGINE
  const risk = riskEngine.calculateRisk(
    performance.performanceScore,
    costCalculation.totalCost,
    virtualModel.perRequestBudget,
    responsibility.scoreValue,
    responsibility.violations
  );

  // 10. STAGE 10: POLICY ENGINE
  const policyResult = policyEngine.evaluatePolicy(
    policy.id,
    risk,
    allViolations,
    costCalculation.totalCost
  );

  // 11. STAGE 11: ENFORCEMENT ENGINE
  const enforcement = enforcementEngine.enforce(
    policyResult.decision,
    llmResponse.content,
    outputGuardrails.sanitizedText,
    policyResult.reason
  );

  // 12. STAGE 12 & 13: TRACE & METRICS RECORDING
  const totalLatencyMs = Date.now() - startTime;
  const trace: TraceRecord = {
    id: traceId,
    timestamp: new Date().toISOString(),
    virtualModelId: virtualModel.id,
    virtualModelName: virtualModel.name,
    provider: activeProvider,
    model: underlyingModel.name,
    prompt: params.prompt,
    originalResponse: enforcement.originalResponse,
    finalResponse: enforcement.finalResponse,
    decision: policyResult.decision,
    decisionReason: policyResult.reason,
    riskScore: risk.overallRisk,
    riskCategory: risk.riskCategory,
    performanceScore: performance.performanceScore,
    responsibilityScore: responsibility.responsibilityScore,
    policyStatus: policyResult.policyStatus,
    latencyMs: totalLatencyMs,
    costUsd: costCalculation.totalCost,
    promptTokens: llmResponse.inputTokens,
    completionTokens: llmResponse.outputTokens,
    totalTokens: llmResponse.totalTokens,
    triggeredRules: policyResult.triggeredRules,
    guardrailViolations: allViolations.map((v) => `${v.type}: ${v.reason}`),
    spans: tracingEngine.generateDefaultSpans(traceId, totalLatencyMs, policyResult.decision),
  };

  tracingEngine.recordTrace(trace);
  metricsEngine.recordExecution(trace);
  virtualModelManager.recordSpend(virtualModel.id, costCalculation.totalCost, risk.overallRisk);

  // Emit Real-Time SSE Activity Event
  eventBus.emit({
    id: `ev-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    virtualModelName: virtualModel.name,
    model: underlyingModel.name,
    stage:
      policyResult.decision === 'MODIFY'
        ? 'Output Redacted'
        : policyResult.decision === 'ESCALATE'
        ? 'Escalated to Review'
        : policyResult.decision === 'BLOCK'
        ? 'Request Blocked'
        : 'Response Dispatched',
    message: policyResult.reason,
    decision: policyResult.decision,
    riskScore: risk.overallRisk,
    type:
      policyResult.decision === 'ALLOW'
        ? 'SUCCESS'
        : policyResult.decision === 'MODIFY'
        ? 'WARNING'
        : policyResult.decision === 'ESCALATE'
        ? 'ALERT'
        : 'DANGER',
  });

  return {
    requestId,
    traceId,
    response: enforcement.finalResponse,
    originalResponse: enforcement.originalResponse,
    decision: policyResult.decision,
    decisionReason: policyResult.reason,
    riskScore: risk.overallRisk,
    riskCategory: risk.riskCategory,
    performanceScore: performance.performanceScore,
    responsibilityScore: responsibility.responsibilityScore,
    policyStatus: policyResult.policyStatus,
    cost: costCalculation.totalCost,
    tokens: {
      prompt: llmResponse.inputTokens,
      completion: llmResponse.outputTokens,
      total: llmResponse.totalTokens,
    },
    latencyMs: totalLatencyMs,
    guardrails: {
      violations: trace.guardrailViolations,
      triggeredRules: policyResult.triggeredRules,
    },
    policy: { id: policy.id, name: policy.name },
    spans: trace.spans,
    trace,
  };
}
