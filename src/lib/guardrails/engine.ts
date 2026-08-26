import { GuardrailCheckResult, piiEngine } from './pii';
import { promptInjectionEngine, secretsEngine, contentSafetyEngine } from './injection';

export interface GuardrailEvaluation {
  passed: boolean;
  results: GuardrailCheckResult[];
  violations: GuardrailCheckResult[];
  primaryAction: 'ALLOW' | 'MODIFY' | 'BLOCK' | 'ESCALATE';
  sanitizedText?: string;
}

export class GuardrailEngine {
  evaluateInput(text: string, enabledGuardrailIds: string[] = []): GuardrailEvaluation {
    const results: GuardrailCheckResult[] = [];

    // Always inspect input for prompt injections & secrets
    const injectionResult = promptInjectionEngine.inspect(text);
    results.push(injectionResult);

    const secretsResult = secretsEngine.inspect(text);
    results.push(secretsResult);

    // Financial advice check on input queries
    const contentResult = contentSafetyEngine.inspect(text);
    results.push(contentResult);

    const violations = results.filter((r) => r.detected);
    const hasBlock = violations.some((v) => v.action === 'BLOCK');
    const hasEscalate = violations.some((v) => v.action === 'ESCALATE');

    let primaryAction: 'ALLOW' | 'MODIFY' | 'BLOCK' | 'ESCALATE' = 'ALLOW';
    if (hasBlock) primaryAction = 'BLOCK';
    else if (hasEscalate) primaryAction = 'ESCALATE';

    return {
      passed: violations.length === 0,
      results,
      violations,
      primaryAction,
    };
  }

  evaluateOutput(
    text: string,
    enabledGuardrailIds: string[] = []
  ): GuardrailEvaluation {
    const results: GuardrailCheckResult[] = [];
    let currentText = text;

    // Output PII evaluation
    const piiResult = piiEngine.inspect(currentText);
    results.push(piiResult);
    if (piiResult.detected && piiResult.sanitizedText) {
      currentText = piiResult.sanitizedText;
    }

    // Financial advice check on output
    const contentResult = contentSafetyEngine.inspect(text);
    results.push(contentResult);

    // Output secrets leak check
    const secretsResult = secretsEngine.inspect(text);
    results.push(secretsResult);

    const violations = results.filter((r) => r.detected);
    const hasBlock = violations.some((v) => v.action === 'BLOCK');
    const hasEscalate = violations.some((v) => v.action === 'ESCALATE');
    const hasModify = violations.some((v) => v.action === 'MODIFY');

    let primaryAction: 'ALLOW' | 'MODIFY' | 'BLOCK' | 'ESCALATE' = 'ALLOW';
    if (hasBlock) primaryAction = 'BLOCK';
    else if (hasEscalate) primaryAction = 'ESCALATE';
    else if (hasModify) primaryAction = 'MODIFY';

    return {
      passed: violations.length === 0,
      results,
      violations,
      primaryAction,
      sanitizedText: currentText,
    };
  }
}

export const guardrailEngine = new GuardrailEngine();
