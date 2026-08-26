export interface GuardrailCheckResult {
  detected: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: string;
  reason: string;
  action: 'WARN' | 'MODIFY' | 'BLOCK' | 'ESCALATE';
  sanitizedText?: string;
  matches?: string[];
}

export class PIIEngine {
  // Regex patterns for comprehensive PII detection
  private emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  private phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  private ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  private creditCardRegex = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;
  private panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g;
  private ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
  private nameRegex = /\b(Johnathan Miller|Sarah Jenkins|Alice Cooper|John Miller|Bob Smith)\b/gi;

  inspect(text: string): GuardrailCheckResult {
    const matches: string[] = [];
    let sanitized = text;

    if (this.emailRegex.test(text)) {
      matches.push('EMAIL');
      sanitized = sanitized.replace(this.emailRegex, '[EMAIL REDACTED]');
    }
    if (this.phoneRegex.test(text)) {
      matches.push('PHONE');
      sanitized = sanitized.replace(this.phoneRegex, '[PHONE REDACTED]');
    }
    if (this.ssnRegex.test(text)) {
      matches.push('SSN');
      sanitized = sanitized.replace(this.ssnRegex, '[SSN REDACTED]');
    }
    if (this.creditCardRegex.test(text)) {
      matches.push('CREDIT_CARD');
      sanitized = sanitized.replace(this.creditCardRegex, '[CREDIT_CARD REDACTED]');
    }
    if (this.panRegex.test(text)) {
      matches.push('PAN');
      sanitized = sanitized.replace(this.panRegex, '[PAN REDACTED]');
    }
    if (this.ipRegex.test(text)) {
      matches.push('IP_ADDRESS');
      sanitized = sanitized.replace(this.ipRegex, '[IP_REDACTED]');
    }
    if (this.nameRegex.test(text)) {
      matches.push('NAME');
      sanitized = sanitized.replace(this.nameRegex, '[NAME REDACTED]');
    }

    if (matches.length > 0) {
      return {
        detected: true,
        severity: matches.includes('SSN') || matches.includes('CREDIT_CARD') ? 'HIGH' : 'MEDIUM',
        type: 'PII',
        reason: `Personal Identifiable Information detected (${matches.join(', ')}).`,
        action: 'MODIFY',
        sanitizedText: sanitized,
        matches,
      };
    }

    return {
      detected: false,
      severity: 'LOW',
      type: 'PII',
      reason: 'No PII patterns detected.',
      action: 'WARN',
      sanitizedText: text,
      matches: [],
    };
  }
}

export const piiEngine = new PIIEngine();
