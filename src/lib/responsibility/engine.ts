import { GuardrailCheckResult } from '../guardrails/pii';

export interface ResponsibilityEvaluation {
  responsibilityScore: 'PASS' | 'WARNING' | 'VIOLATION';
  scoreValue: number; // 0 - 100
  violations: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export class ResponsibilityEngine {
  evaluate(guardrailResults: GuardrailCheckResult[]): ResponsibilityEvaluation {
    const violations: string[] = [];
    let score = 95;
    let maxSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

    for (const res of guardrailResults) {
      if (res.detected) {
        violations.push(`${res.type}: ${res.reason}`);
        if (res.severity === 'CRITICAL') {
          score -= 60;
          maxSeverity = 'CRITICAL';
        } else if (res.severity === 'HIGH') {
          score -= 35;
          if (maxSeverity !== 'CRITICAL') maxSeverity = 'HIGH';
        } else if (res.severity === 'MEDIUM') {
          score -= 20;
          if (maxSeverity === 'LOW') maxSeverity = 'MEDIUM';
        }
      }
    }

    const finalScore = Math.max(0, Math.min(100, score));
    const status: 'PASS' | 'WARNING' | 'VIOLATION' =
      finalScore < 50 ? 'VIOLATION' : finalScore < 80 ? 'WARNING' : 'PASS';

    return {
      responsibilityScore: status,
      scoreValue: finalScore,
      violations,
      severity: maxSeverity,
    };
  }
}

export const responsibilityEngine = new ResponsibilityEngine();
