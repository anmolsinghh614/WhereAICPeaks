import { DecisionState, TraceRecord, TraceSpan, VirtualModel } from '@/types';
import { cpStore } from './store';

export interface ExecutePipelineParams {
  virtualModelId: string;
  prompt: string;
  customParameters?: {
    temperature?: number;
    maxTokens?: number;
  };
  userEmail?: string;
  teamId?: string;
}

export interface PipelineExecutionResult {
  trace: TraceRecord;
  executionStages: Array<{
    stage: string;
    description: string;
    status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'WARNING' | 'FAILED' | 'MODIFIED' | 'BLOCKED';
    durationMs: number;
  }>;
}

export async function executeControlPlanePipeline({
  virtualModelId,
  prompt,
  userEmail,
  teamId,
}: ExecutePipelineParams): Promise<PipelineExecutionResult> {
  const startTime = Date.now();
  const vm: VirtualModel | undefined = cpStore.getVirtualModelById(virtualModelId);

  if (!vm) {
    throw new Error(`Virtual Model ${virtualModelId} not found in ControlPlane.`);
  }

  const activeUser = cpStore.getActiveUser();
  const traceUserEmail = userEmail || activeUser.email;
  const traceUserName = activeUser.email === traceUserEmail ? activeUser.name : traceUserEmail.split('@')[0];
  const traceTeamId = teamId || vm.teamId || activeUser.teamId;
  const traceTeamName = vm.teamName || activeUser.teamName;

  const policy = cpStore.getPolicyById(vm.policyId) || cpStore.getPolicies()[0];
  const model = cpStore.getModels().find((m) => m.id === vm.underlyingModelId) || cpStore.getModels()[0];
  const activeGuardrails = cpStore.getGuardrails().filter((g) => vm.guardrailIds.includes(g.id) && g.enabled);

  const spans: TraceSpan[] = [];
  const triggeredRules: string[] = [];
  const violations: string[] = [];

  const lowerPrompt = prompt.toLowerCase();

  // 1. Stage: Request Ingestion
  const s1Start = Date.now();
  await new Promise((r) => setTimeout(r, 40));
  spans.push({
    id: `sp-${Date.now()}-1`,
    name: 'Request Ingest & Context Validation',
    stage: 'REQUEST_INGEST',
    status: 'SUCCESS',
    durationMs: Date.now() - s1Start,
    timestamp: new Date().toLocaleTimeString(),
    details: { virtualModel: vm.name, policy: policy.name, model: model.name, userEmail: traceUserEmail, team: traceTeamName },
  });

  // 2. Stage: Input Guardrails Check
  const s2Start = Date.now();
  await new Promise((r) => setTimeout(r, 60));

  let isPromptInjection = false;
  let isSecretLeak = false;

  if (
    lowerPrompt.includes('ignore all previous') ||
    lowerPrompt.includes('system prompt') ||
    lowerPrompt.includes('jailbreak') ||
    lowerPrompt.includes('dan mode') ||
    lowerPrompt.includes('override safety') ||
    lowerPrompt.includes('bypass')
  ) {
    isPromptInjection = true;
    triggeredRules.push('gr-prompt-inj');
    violations.push('Prompt Injection: Jailbreak Vector Detected');
  }

  if (
    lowerPrompt.includes('akiat') ||
    lowerPrompt.includes('aws_secret') ||
    lowerPrompt.includes('ghp_') ||
    lowerPrompt.includes('private key') ||
    lowerPrompt.includes('db_password')
  ) {
    isSecretLeak = true;
    triggeredRules.push('gr-secrets');
    violations.push('Secrets: Credential Exposure Detected');
  }

  spans.push({
    id: `sp-${Date.now()}-2`,
    name: 'Input Guardrail Shield',
    stage: 'GUARDRAILS_CHECK',
    status: isPromptInjection || isSecretLeak ? 'BLOCKED' : 'SUCCESS',
    durationMs: Date.now() - s2Start,
    timestamp: new Date().toLocaleTimeString(),
    details: {
      activeGuardrails: activeGuardrails.map((g) => g.name),
      injectionMatch: isPromptInjection,
      secretMatch: isSecretLeak,
    },
  });

  // 3. Stage: Budget Check
  const s3Start = Date.now();
  await new Promise((r) => setTimeout(r, 30));
  const estimatedCost = 0.0035;
  const isOverBudget = vm.spentToday + estimatedCost > vm.dailyBudget;

  spans.push({
    id: `sp-${Date.now()}-3`,
    name: 'Budget & Cost Quota Verification',
    stage: 'BUDGET_CHECK',
    status: isOverBudget ? 'WARNING' : 'SUCCESS',
    durationMs: Date.now() - s3Start,
    timestamp: new Date().toLocaleTimeString(),
    details: {
      dailyBudget: vm.dailyBudget,
      spentToday: vm.spentToday,
      remaining: Math.max(0, vm.dailyBudget - vm.spentToday),
      isOverBudget,
    },
  });

  // Early exit if input blocked
  if (isPromptInjection || isSecretLeak) {
    const riskScore = isPromptInjection ? 89 : 94;
    const finalResponse = isPromptInjection
      ? 'Request blocked by ControlPlane: Prompt injection or instruction override vector detected in input.'
      : 'Request blocked by ControlPlane: Secret key or credential pattern identified in input.';

    const trace: TraceRecord = {
      id: `tr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      virtualModelId: vm.id,
      virtualModelName: vm.name,
      provider: vm.provider,
      model: model.name,
      prompt,
      finalResponse,
      decision: 'BLOCK',
      decisionReason: isPromptInjection
        ? 'Prompt Injection shield triggered on input.'
        : 'Credentials & Secrets guardrail blocked input.',
      riskScore,
      riskCategory: 'CRITICAL',
      performanceScore: 0,
      responsibilityScore: 'VIOLATION',
      policyStatus: 'VIOLATION',
      latencyMs: Date.now() - startTime,
      costUsd: 0.0001,
      promptTokens: Math.max(12, Math.round(prompt.length / 4)),
      completionTokens: 0,
      totalTokens: Math.max(12, Math.round(prompt.length / 4)),
      triggeredRules,
      guardrailViolations: violations,
      userEmail: traceUserEmail,
      userName: traceUserName,
      teamId: traceTeamId,
      teamName: traceTeamName,
      spans,
    };

    cpStore.addTrace(trace);

    return {
      trace,
      executionStages: [
        { stage: 'Request Ingest', description: 'Context loaded', status: 'SUCCESS', durationMs: 40 },
        { stage: 'Guardrails Check', description: 'Attack vector detected', status: 'BLOCKED', durationMs: 60 },
        { stage: 'Budget Check', description: 'Verified', status: 'SUCCESS', durationMs: 30 },
        { stage: 'Model Call', description: 'Skipped for safety', status: 'BLOCKED', durationMs: 0 },
        { stage: 'Risk & Policy Decision', description: 'Enforcing BLOCK', status: 'BLOCKED', durationMs: 20 },
      ],
    };
  }

  // 4. Stage: Routing & 5. Stage: LLM Call
  const s4Start = Date.now();
  await new Promise((r) => setTimeout(r, 45));
  spans.push({
    id: `sp-${Date.now()}-4`,
    name: `Routing to ${model.provider} (${model.name})`,
    stage: 'ROUTING',
    status: 'SUCCESS',
    durationMs: Date.now() - s4Start,
    timestamp: new Date().toLocaleTimeString(),
    details: { endpoint: model.id, latencyEstimateMs: model.avgLatencyMs || 600 },
  });

  const s5Start = Date.now();
  // Simulate model generation
  await new Promise((r) => setTimeout(r, Math.min(model.avgLatencyMs || 600, 450)));

  // Generate appropriate simulated model responses based on prompt keywords
  let rawResponse = '';
  let isPiiDetected = false;
  let isFinancialAdvice = false;
  let isUnsafeContent = false;

  if (
    lowerPrompt.includes('email') ||
    lowerPrompt.includes('john') ||
    lowerPrompt.includes('customer') ||
    lowerPrompt.includes('ssn') ||
    lowerPrompt.includes('phone') ||
    lowerPrompt.includes('account') ||
    lowerPrompt.includes('pii')
  ) {
    isPiiDetected = true;
    rawResponse =
      'Hello Johnathan Miller (SSN: 482-91-8831), regarding your enterprise subscription account #88192: we have confirmed your contact address at john.miller@enterprise-corp.com and mobile +1 (555) 234-8910. Your monthly statement is ready for review.';
  } else if (
    lowerPrompt.includes('stock') ||
    lowerPrompt.includes('insider') ||
    lowerPrompt.includes('buy') ||
    lowerPrompt.includes('gain') ||
    lowerPrompt.includes('guarantee') ||
    lowerPrompt.includes('invest')
  ) {
    isFinancialAdvice = true;
    rawResponse =
      'Based on confidential upcoming quarterly earnings data, I recommend buying call options on AlphaCorp immediately for an expected 35-45% short-term surge.';
  } else if (lowerPrompt.includes('kill') || lowerPrompt.includes('hate') || lowerPrompt.includes('harm') || lowerPrompt.includes('attack')) {
    isUnsafeContent = true;
    rawResponse = 'I will generate offensive harmful instructions to compromise targets immediately.';
  } else {
    // Normal query response
    rawResponse = `ControlPlane successfully routed and processed your query through ${model.name}. The platform continuously enforces latency budgets, token consumption bounds, and enterprise safety guardrails in real time. All interaction parameters adhere to policy "${policy.name}".`;
  }

  const promptTokens = Math.max(15, Math.round(prompt.length / 4));
  const completionTokens = Math.max(35, Math.round(rawResponse.length / 4));
  const totalTokens = promptTokens + completionTokens;
  const costUsd = Number(
    ((promptTokens * model.inputTokenPrice + completionTokens * model.outputTokenPrice) / 1000).toFixed(5)
  );

  spans.push({
    id: `sp-${Date.now()}-5`,
    name: 'LLM Inference Execution',
    stage: 'LLM_CALL',
    status: 'SUCCESS',
    durationMs: Date.now() - s5Start,
    timestamp: new Date().toLocaleTimeString(),
    details: {
      provider: model.provider,
      model: model.name,
      promptTokens,
      completionTokens,
      totalTokens,
      costUsd,
    },
  });

  // 6. Stage: Performance Evaluation
  const s6Start = Date.now();
  await new Promise((r) => setTimeout(r, 35));
  const perfScore = Math.min(99, Math.max(82, 100 - Math.round((Date.now() - startTime) / 25)));
  spans.push({
    id: `sp-${Date.now()}-6`,
    name: 'Real-time Performance & Latency Scoring',
    stage: 'PERFORMANCE_EVAL',
    status: 'SUCCESS',
    durationMs: Date.now() - s6Start,
    timestamp: new Date().toLocaleTimeString(),
    details: { performanceScore: perfScore, targetLatency: 800 },
  });

  // 7. Stage: Output Responsibility Evaluation
  const s7Start = Date.now();
  await new Promise((r) => setTimeout(r, 45));

  let finalResponse = rawResponse;
  let decision: DecisionState = 'ALLOW';
  let decisionReason = 'All guardrails passed, risk score within allowable threshold.';
  let riskScore = Math.floor(Math.random() * 12) + 8; // default low risk 8-20

  if (isPiiDetected && activeGuardrails.some((g) => g.id === 'gr-pii')) {
    triggeredRules.push('gr-pii');
    violations.push('PII: Personal Identifiable Information in LLM completion');
    riskScore = 38;
    decision = 'MODIFY';
    decisionReason = 'PII Detection guardrail triggered. Redacted customer name, email, SSN, and phone before delivery.';

    // Redact PII
    finalResponse = rawResponse
      .replace(/SSN:\s*\d{3}-\d{2}-\d{4}/gi, 'SSN: [SSN REDACTED]')
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, '[EMAIL REDACTED]')
      .replace(/\+1\s*\(\d{3}\)\s*\d{3}-\d{4}/gi, '[PHONE REDACTED]')
      .replace(/Johnathan Miller/gi, '[NAME REDACTED]');
  } else if (isFinancialAdvice && activeGuardrails.some((g) => g.id === 'gr-fin-advice')) {
    triggeredRules.push('gr-fin-advice');
    violations.push('Financial Advice: Speculative Recommendation Detected');
    riskScore = 76;
    decision = 'ESCALATE';
    decisionReason = 'Financial Advice & Market Compliance policy triggered. Escalated to compliance queue for human review.';
    finalResponse = 'Hold for Human Review: Generated content triggered compliance review for financial advisory recommendations.';
  } else if (isUnsafeContent && activeGuardrails.some((g) => g.id === 'gr-unsafe-content')) {
    triggeredRules.push('gr-unsafe-content');
    violations.push('Content Safety: Toxic / Harmful Output');
    riskScore = 84;
    decision = 'BLOCK';
    decisionReason = 'Unsafe Content guardrail detected severe policy violation in generated output.';
    finalResponse = 'Request blocked by ControlPlane: Output contained content violating enterprise safety policies.';
  }

  spans.push({
    id: `sp-${Date.now()}-7`,
    name: 'Responsibility & Safety Evaluation',
    stage: 'RESPONSIBILITY_EVAL',
    status: decision === 'ALLOW' ? 'SUCCESS' : decision === 'MODIFY' ? 'MODIFIED' : decision === 'BLOCK' ? 'BLOCKED' : 'WARNING',
    durationMs: Date.now() - s7Start,
    timestamp: new Date().toLocaleTimeString(),
    details: { isPiiDetected, isFinancialAdvice, isUnsafeContent },
  });

  // 8. Stage: Risk & Policy Enforcement
  const s8Start = Date.now();
  await new Promise((r) => setTimeout(r, 30));

  spans.push({
    id: `sp-${Date.now()}-8`,
    name: `Policy Enforcement (${policy.name})`,
    stage: 'POLICY_ENFORCEMENT',
    status: decision === 'ALLOW' ? 'SUCCESS' : decision === 'MODIFY' ? 'MODIFIED' : decision === 'BLOCK' ? 'BLOCKED' : 'WARNING',
    durationMs: Date.now() - s8Start,
    timestamp: new Date().toLocaleTimeString(),
    details: {
      policy: policy.name,
      decision,
      riskScore,
      actionApplied: decision,
    },
  });

  const totalDurationMs = Date.now() - startTime;

  const trace: TraceRecord = {
    id: `tr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    virtualModelId: vm.id,
    virtualModelName: vm.name,
    provider: vm.provider,
    model: model.name,
    prompt,
    originalResponse: decision === 'MODIFY' || decision === 'ESCALATE' ? rawResponse : undefined,
    finalResponse,
    decision,
    decisionReason,
    riskScore,
    riskCategory: riskScore < 30 ? 'LOW' : riskScore < 60 ? 'MEDIUM' : riskScore < 80 ? 'HIGH' : 'CRITICAL',
    performanceScore: perfScore,
    responsibilityScore: decision === 'ALLOW' ? 'PASS' : decision === 'MODIFY' ? 'PASS' : 'VIOLATION',
    policyStatus: decision === 'ALLOW' ? 'PASS' : decision === 'MODIFY' ? 'MODIFIED' : decision === 'BLOCK' ? 'VIOLATION' : 'ESCALATED',
    latencyMs: totalDurationMs,
    costUsd,
    promptTokens,
    completionTokens,
    totalTokens,
    triggeredRules,
    guardrailViolations: violations,
    userEmail: traceUserEmail,
    userName: traceUserName,
    teamId: traceTeamId,
    teamName: traceTeamName,
    spans,
  };

  // If escalated, add review case
  if (decision === 'ESCALATE') {
    cpStore.addReview({
      id: `rev-${Date.now().toString(36)}`,
      traceId: trace.id,
      virtualModelName: vm.name,
      timestamp: new Date().toISOString(),
      riskScore,
      reason: decisionReason,
      prompt,
      proposedOutput: rawResponse,
      status: 'PENDING',
      userEmail: traceUserEmail,
      teamId: traceTeamId,
      teamName: traceTeamName,
    });
  }

  cpStore.addTrace(trace);

  return {
    trace,
    executionStages: [
      { stage: 'Request Ingest', description: 'Validated headers & context', status: 'SUCCESS', durationMs: 40 },
      { stage: 'Guardrails Check', description: 'Scanned input parameters', status: 'SUCCESS', durationMs: 60 },
      { stage: 'Budget Check', description: 'Quota verified', status: 'SUCCESS', durationMs: 30 },
      { stage: 'Routing', description: `Routed to ${model.provider}`, status: 'SUCCESS', durationMs: 45 },
      { stage: 'Model Execution', description: `Inference on ${model.name}`, status: 'SUCCESS', durationMs: Math.min(model.avgLatencyMs || 600, 450) },
      { stage: 'Performance Evaluation', description: `Score: ${perfScore}/100`, status: 'SUCCESS', durationMs: 35 },
      {
        stage: 'Responsibility Evaluation',
        description: decision === 'MODIFY' ? 'PII redacted' : decision === 'ESCALATE' ? 'Flagged for advisory compliance' : 'Passed safety standards',
        status: decision === 'MODIFY' ? 'MODIFIED' : decision === 'ESCALATE' ? 'WARNING' : 'SUCCESS',
        durationMs: 45,
      },
      { stage: 'Policy Enforcement', description: `Decision: ${decision}`, status: decision === 'ALLOW' ? 'SUCCESS' : decision === 'MODIFY' ? 'MODIFIED' : decision === 'BLOCK' ? 'BLOCKED' : 'WARNING', durationMs: 30 },
    ],
  };
}
