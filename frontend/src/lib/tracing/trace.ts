import { TraceRecord, TraceSpan } from '@/types';

export class TracingEngine {
  private traces: Map<string, TraceRecord> = new Map();

  constructor() {
    // Initialize with seed traces
    const initialTraces: TraceRecord[] = [
      {
        id: 'tr-seed-101',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        virtualModelId: 'vm-finance-assistant',
        virtualModelName: 'Finance Assistant',
        provider: 'OpenAI',
        model: 'GPT-4.1 Enterprise',
        prompt: 'Calculate compound revenue growth and summarize Q3 audit statements for enterprise accounts.',
        finalResponse: 'ControlPlane successfully routed and processed your query through GPT-4.1 Enterprise.',
        decision: 'ALLOW',
        decisionReason: 'All guardrails passed, risk score within allowable threshold.',
        riskScore: 12,
        riskCategory: 'LOW',
        performanceScore: 94,
        responsibilityScore: 'PASS',
        policyStatus: 'PASS',
        latencyMs: 640,
        costUsd: 0.0014,
        promptTokens: 28,
        completionTokens: 64,
        totalTokens: 92,
        triggeredRules: [],
        guardrailViolations: [],
        spans: this.generateDefaultSpans('tr-seed-101', 640, 'ALLOW'),
      },
    ];

    initialTraces.forEach((t) => this.traces.set(t.id, t));
  }

  generateDefaultSpans(traceId: string, totalLatencyMs: number, decision: string): TraceSpan[] {
    const start = Date.now() - totalLatencyMs;
    const spanTypes = [
      { type: 'REQUEST_RECEIVED', name: 'Ingest Request Payload', ratio: 0.02 },
      { type: 'GUARDRAIL_CHECK', name: 'Input Guardrails (Injection & Secrets Scan)', ratio: 0.08 },
      { type: 'BUDGET_CHECK', name: 'Verify Endpoint & Department Budget Caps', ratio: 0.03 },
      { type: 'ROUTING', name: 'Foundation Model Resolution & Fallback Routing', ratio: 0.04 },
      { type: 'LLM_REQUEST', name: 'Dispatch Upstream Model Inference Request', ratio: 0.02 },
      { type: 'LLM_RESPONSE', name: 'Model Completion & Token Stream Ingestion', ratio: 0.60 },
      { type: 'PERFORMANCE_EVALUATION', name: 'Response Coherence & Latency Scoring', ratio: 0.03 },
      { type: 'COST_EVALUATION', name: 'Token Pricing Engine & Spend Ledger Update', ratio: 0.02 },
      { type: 'RESPONSIBILITY_EVALUATION', name: 'Output Guardrails & PII Inspection', ratio: 0.06 },
      { type: 'RISK_SCORING', name: 'Weighted Multi-Vector Risk Calculation', ratio: 0.03 },
      { type: 'POLICY_EVALUATION', name: 'Enterprise Policy Rule Enforcement Matrix', ratio: 0.03 },
      { type: 'ENFORCEMENT', name: `Apply Decision Action (${decision})`, ratio: 0.02 },
      { type: 'RESPONSE_RETURNED', name: 'Dispatch Final Sanitized Payload to Client', ratio: 0.02 },
    ];

    let currentOffset = 0;
    return spanTypes.map((st, i) => {
      const duration = Math.max(2, Math.round(totalLatencyMs * st.ratio));
      const spanStart = start + currentOffset;
      const spanEnd = spanStart + duration;
      currentOffset += duration;

      return {
        id: `sp-${traceId}-${i + 1}`,
        name: st.name,
        type: st.type as any,
        status: st.type === 'ENFORCEMENT' && decision === 'BLOCK' ? 'VIOLATION' : 'SUCCESS',
        durationMs: duration,
        startTime: spanStart,
        endTime: spanEnd,
        metadata: { stepIndex: i + 1, spanCategory: st.type },
      };
    });
  }

  recordTrace(trace: TraceRecord): void {
    this.traces.set(trace.id, trace);
  }

  getAll(): TraceRecord[] {
    return Array.from(this.traces.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getById(id: string): TraceRecord | undefined {
    return this.traces.get(id);
  }
}

export const tracingEngine = new TracingEngine();
