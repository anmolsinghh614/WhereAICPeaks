import { GuardrailCheckResult } from './pii';

export class PromptInjectionEngine {
  private injectionPatterns = [
    /ignore (all )?previous instructions/i,
    /ignore (all )?system (prompts|rules)/i,
    /system override/i,
    /reveal (internal|system) (prompt|instructions)/i,
    /show (hidden|secret) instructions/i,
    /bypass safety/i,
    /disable (policy|guardrail)/i,
    /jailbreak/i,
    /you are now in (DAN|developer) mode/i,
    /output internal (database|db) keys/i,
    /exfiltrate credentials/i,
  ];

  inspect(text: string): GuardrailCheckResult {
    for (const pattern of this.injectionPatterns) {
      if (pattern.test(text)) {
        return {
          detected: true,
          severity: 'CRITICAL',
          type: 'PROMPT_INJECTION',
          reason: `Prompt injection attack vector or instruction override detected matching '${pattern.source}'.`,
          action: 'BLOCK',
        };
      }
    }

    return {
      detected: false,
      severity: 'LOW',
      type: 'PROMPT_INJECTION',
      reason: 'No prompt injection vectors detected.',
      action: 'WARN',
    };
  }
}

export class SecretsEngine {
  private secretsPatterns = [
    { name: 'AWS_ACCESS_KEY', regex: /\bAKIA[0-9A-Z]{16}\b/ },
    { name: 'AWS_SECRET_KEY', regex: /\b[0-9a-zA-Z/+]{40}\b/ },
    { name: 'PRIVATE_KEY', regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/i },
    { name: 'OPENAI_API_KEY', regex: /\bsk-[a-zA-Z0-9]{32,}\b/ },
    { name: 'GITHUB_TOKEN', regex: /\bgh[pousr]_[a-zA-Z0-9]{36,}\b/ },
    { name: 'DB_CONNECTION_STRING', regex: /postgres(ql)?:\/\/[^:]+:[^@]+@[^/]+\/.+/i },
  ];

  inspect(text: string): GuardrailCheckResult {
    const detected: string[] = [];
    for (const { name, regex } of this.secretsPatterns) {
      if (regex.test(text)) {
        detected.push(name);
      }
    }

    if (detected.length > 0) {
      return {
        detected: true,
        severity: 'CRITICAL',
        type: 'SECRETS',
        reason: `Exposed credentials / private keys detected (${detected.join(', ')}).`,
        action: 'BLOCK',
      };
    }

    return {
      detected: false,
      severity: 'LOW',
      type: 'SECRETS',
      reason: 'No credential or API key exposures detected.',
      action: 'WARN',
    };
  }
}

export class ContentSafetyEngine {
  private financialAdvicePatterns = [
    /guaranteed (\d+%)? (gain|return|profit)/i,
    /buy call options immediately/i,
    /insider (information|tips|quarterly earnings)/i,
    /which stock to buy before the earnings/i,
  ];

  private unsafePatterns = [
    /how to build a (bomb|weapon|explosive)/i,
    /bypass security systems/i,
    /malware script/i,
  ];

  inspect(text: string): GuardrailCheckResult {
    for (const p of this.financialAdvicePatterns) {
      if (p.test(text)) {
        return {
          detected: true,
          severity: 'HIGH',
          type: 'FINANCIAL_ADVICE',
          reason: 'Generated or requested content violates SEC compliance regulations regarding speculative investment advisory.',
          action: 'ESCALATE',
        };
      }
    }

    for (const p of this.unsafePatterns) {
      if (p.test(text)) {
        return {
          detected: true,
          severity: 'CRITICAL',
          type: 'UNSAFE_CONTENT',
          reason: 'Harmful or illegal content generation request prevented.',
          action: 'BLOCK',
        };
      }
    }

    return {
      detected: false,
      severity: 'LOW',
      type: 'CONTENT_SAFETY',
      reason: 'Content passes enterprise safety compliance filters.',
      action: 'WARN',
    };
  }
}

export const promptInjectionEngine = new PromptInjectionEngine();
export const secretsEngine = new SecretsEngine();
export const contentSafetyEngine = new ContentSafetyEngine();
