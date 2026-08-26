import { PolicyRule } from '@/types';
import { GuardrailCheckResult } from '../guardrails/pii';
import { RiskAnalysis } from '../risk/engine';

export const SEEDED_POLICIES: PolicyRule[] = [
  {
    id: 'pol-finance-strict',
    name: 'Finance Strict Policy',
    description: 'Enforces Zero-PII leak and mandatory compliance escalation for stock recommendations.',
    riskThresholdBlock: 60,
    riskThresholdEscalate: 40,
    dailyBudgetLimit: 150.0,
    allowedProviders: ['OpenAI', 'Anthropic', 'ControlPlane'],
    enforcePiiRedaction: true,
    blockPromptInjections: true,
    escalateHighRisk: true,
    enabled: true,
  },
  {
    id: 'pol-support-standard',
    name: 'Customer Support Policy',
    description: 'Standard customer care policy with PII masking and tone monitoring.',
    riskThresholdBlock: 75,
    riskThresholdEscalate: 50,
    dailyBudgetLimit: 75.0,
    allowedProviders: ['Anthropic', 'Google', 'ControlPlane'],
    enforcePiiRedaction: true,
    blockPromptInjections: true,
    escalateHighRisk: false,
    enabled: true,
  },
  {
    id: 'pol-engineering',
    name: 'Engineering Copilot Policy',
    description: 'Guards against API key / credential exfiltration and unauthorized code generation.',
    riskThresholdBlock: 80,
    riskThresholdEscalate: 60,
    dailyBudgetLimit: 200.0,
    allowedProviders: ['Anthropic', 'OpenAI', 'ControlPlane'],
    enforcePiiRedaction: false,
    blockPromptInjections: true,
    escalateHighRisk: true,
    enabled: true,
  },
  {
    id: 'pol-general-enterprise',
    name: 'General Enterprise Baseline',
    description: 'Standard enterprise governance policy for cross-department AI applications.',
    riskThresholdBlock: 70,
    riskThresholdEscalate: 45,
    dailyBudgetLimit: 100.0,
    allowedProviders: ['OpenAI', 'Anthropic', 'Google', 'ControlPlane'],
    enforcePiiRedaction: true,
    blockPromptInjections: true,
    escalateHighRisk: true,
    enabled: true,
  },
];

export interface PolicyEvaluation {
  policyStatus: 'PASS' | 'MODIFIED' | 'VIOLATION' | 'ESCALATED';
  decision: 'ALLOW' | 'MODIFY' | 'BLOCK' | 'ESCALATE';
  reason: string;
  triggeredRules: string[];
  overridesApplied: boolean;
}

export class PolicyEngine {
  private policies: Map<string, PolicyRule> = new Map();

  constructor() {
    SEEDED_POLICIES.forEach((p) => this.policies.set(p.id, p));
  }

  getAll(): PolicyRule[] {
    return Array.from(this.policies.values());
  }

  getById(id: string): PolicyRule | undefined {
    return this.policies.get(id);
  }

  evaluatePolicy(
    policyId: string,
    risk: RiskAnalysis,
    violations: GuardrailCheckResult[],
    costUsd: number
  ): PolicyEvaluation {
    const policy = this.getById(policyId) || SEEDED_POLICIES[3];
    const triggeredRules: string[] = [];

    // 1. Explicit Rule Checks (Strict Priority Override)
    const injectionViolation = violations.find((v) => v.type === 'PROMPT_INJECTION');
    if (injectionViolation && policy.blockPromptInjections) {
      triggeredRules.push('gr-prompt-inj');
      return {
        policyStatus: 'VIOLATION',
        decision: 'BLOCK',
        reason: 'Prompt Injection shield triggered: Malicious injection or bypass vector intercepted.',
        triggeredRules,
        overridesApplied: true,
      };
    }

    const secretsViolation = violations.find((v) => v.type === 'SECRETS');
    if (secretsViolation) {
      triggeredRules.push('gr-secrets');
      return {
        policyStatus: 'VIOLATION',
        decision: 'BLOCK',
        reason: 'Secrets Exposure shield triggered: Credential or private key leak prevented.',
        triggeredRules,
        overridesApplied: true,
      };
    }

    const financialViolation = violations.find((v) => v.type === 'FINANCIAL_ADVICE');
    if (financialViolation) {
      triggeredRules.push('gr-fin-advice');
      return {
        policyStatus: 'ESCALATED',
        decision: 'ESCALATE',
        reason: 'Financial Advice & Market Compliance policy triggered. Escalated to compliance queue for human review.',
        triggeredRules,
        overridesApplied: true,
      };
    }

    const piiViolation = violations.find((v) => v.type === 'PII');
    if (piiViolation) {
      triggeredRules.push('gr-pii');
      if (policy.enforcePiiRedaction) {
        return {
          policyStatus: 'MODIFIED',
          decision: 'MODIFY',
          reason: 'PII Detection guardrail triggered. Redacted customer name, email, SSN, and phone before delivery.',
          triggeredRules,
          overridesApplied: true,
        };
      }
    }

    // 2. Generic Risk Threshold Evaluation
    const blockThreshold = policy.blockThreshold ?? policy.riskThresholdBlock ?? 60;
    const escalateThreshold = policy.escalationThreshold ?? policy.riskThresholdEscalate ?? 40;

    if (risk.overallRisk >= blockThreshold) {
      triggeredRules.push('risk-threshold-block');
      return {
        policyStatus: 'VIOLATION',
        decision: 'BLOCK',
        reason: `Overall Risk Score (${risk.overallRisk}/100) exceeded Policy Block Threshold (${blockThreshold}/100).`,
        triggeredRules,
        overridesApplied: false,
      };
    }

    if (policy.escalateHighRisk !== false && risk.overallRisk >= escalateThreshold) {
      triggeredRules.push('risk-threshold-escalate');
      return {
        policyStatus: 'ESCALATED',
        decision: 'ESCALATE',
        reason: `Risk Score (${risk.overallRisk}/100) exceeded Escalation Threshold (${escalateThreshold}/100). Held for compliance review.`,
        triggeredRules,
        overridesApplied: false,
      };
    }

    return {
      policyStatus: 'PASS',
      decision: 'ALLOW',
      reason: 'All guardrails passed, risk score within allowable threshold.',
      triggeredRules,
      overridesApplied: false,
    };
  }
}

export class EnforcementEngine {
  enforce(
    decision: 'ALLOW' | 'MODIFY' | 'BLOCK' | 'ESCALATE',
    rawResponse: string,
    sanitizedResponse?: string,
    reason?: string
  ): {
    finalResponse: string;
    originalResponse?: string;
    isModified: boolean;
    isBlocked: boolean;
    isEscalated: boolean;
  } {
    switch (decision) {
      case 'MODIFY':
        return {
          finalResponse: sanitizedResponse || rawResponse,
          originalResponse: rawResponse,
          isModified: true,
          isBlocked: false,
          isEscalated: false,
        };
      case 'BLOCK':
        return {
          finalResponse: `Request blocked by ControlPlane: ${reason || 'Safety policy violation prevented.'}`,
          originalResponse: rawResponse,
          isModified: false,
          isBlocked: true,
          isEscalated: false,
        };
      case 'ESCALATE':
        return {
          finalResponse: 'Hold for Human Review: Generated content triggered compliance review for financial advisory recommendations.',
          originalResponse: rawResponse,
          isModified: false,
          isBlocked: false,
          isEscalated: true,
        };
      case 'ALLOW':
      default:
        return {
          finalResponse: rawResponse,
          isModified: false,
          isBlocked: false,
          isEscalated: false,
        };
    }
  }
}

export const policyEngine = new PolicyEngine();
export const enforcementEngine = new EnforcementEngine();
