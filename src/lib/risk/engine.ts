export interface RiskWeights {
  performance: number; // default 0.35
  cost: number;        // default 0.25
  responsibility: number; // default 0.40
}

export interface RiskAnalysis {
  overallRisk: number;
  performanceRisk: number;
  costRisk: number;
  responsibilityRisk: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasons: string[];
}

export class RiskEngine {
  calculateRisk(
    performanceScore: number,
    costUsd: number,
    perRequestBudget: number,
    responsibilityScoreValue: number,
    violations: string[] = [],
    weights: RiskWeights = { performance: 0.35, cost: 0.25, responsibility: 0.40 }
  ): RiskAnalysis {
    const reasons: string[] = [];

    // 1. Performance risk (inverse of score)
    const performanceRisk = Math.max(0, 100 - performanceScore);
    if (performanceRisk > 40) {
      reasons.push(`Elevated performance risk (${performanceRisk}/100) due to latency/coherence signals.`);
    }

    // 2. Cost risk (based on budget utilization)
    const costRatio = Math.min(2.0, costUsd / Math.max(0.001, perRequestBudget));
    const costRisk = Math.min(100, Math.round(costRatio * 35));
    if (costRisk > 50) {
      reasons.push(`High cost expenditure ratio (${costRisk}/100) relative to per-request threshold.`);
    }

    // 3. Responsibility risk
    let responsibilityRisk = Math.max(0, 100 - responsibilityScoreValue);
    if (violations.some((v) => v.includes('PROMPT_INJECTION') || v.includes('SECRETS'))) {
      responsibilityRisk = Math.max(88, responsibilityRisk);
      reasons.push('Critical security risk: Jailbreak or credential leak pattern detected.');
    } else if (violations.some((v) => v.includes('FINANCIAL_ADVICE'))) {
      responsibilityRisk = Math.max(75, responsibilityRisk);
      reasons.push('High compliance risk: Speculative financial advice or market guidance detected.');
    } else if (violations.some((v) => v.includes('PII'))) {
      responsibilityRisk = Math.max(38, responsibilityRisk);
      reasons.push('Moderate data privacy risk: Personal identifiable information detected.');
    }

    // 4. Overall Weighted Risk
    const overallRisk = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          performanceRisk * weights.performance +
          costRisk * weights.cost +
          responsibilityRisk * weights.responsibility
        )
      )
    );

    let riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (overallRisk >= 80) riskCategory = 'CRITICAL';
    else if (overallRisk >= 60) riskCategory = 'HIGH';
    else if (overallRisk >= 30) riskCategory = 'MEDIUM';

    return {
      overallRisk,
      performanceRisk,
      costRisk,
      responsibilityRisk,
      riskCategory,
      reasons,
    };
  }
}

export const riskEngine = new RiskEngine();
