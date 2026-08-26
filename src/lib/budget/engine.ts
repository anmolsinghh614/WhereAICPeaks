export interface BudgetCheckResult {
  allowed: boolean;
  dailyBudget: number;
  spentToday: number;
  estimatedCost: number;
  projectedSpend: number;
  reason: string;
  action: 'ALLOW' | 'WARN' | 'BLOCK' | 'ESCALATE';
}

export class BudgetEngine {
  checkBudget(
    dailyBudget: number,
    spentToday: number,
    perRequestBudget: number,
    estimatedCost: number
  ): BudgetCheckResult {
    const projected = spentToday + estimatedCost;

    if (projected > dailyBudget) {
      return {
        allowed: false,
        dailyBudget,
        spentToday,
        estimatedCost,
        projectedSpend: projected,
        reason: `Daily budget ceiling of $${dailyBudget.toFixed(2)} exceeded (projected: $${projected.toFixed(2)}).`,
        action: 'BLOCK',
      };
    }

    if (estimatedCost > perRequestBudget * 1.5) {
      return {
        allowed: true,
        dailyBudget,
        spentToday,
        estimatedCost,
        projectedSpend: projected,
        reason: `Per-request budget threshold warning ($${estimatedCost.toFixed(4)} > $${perRequestBudget.toFixed(4)}).`,
        action: 'WARN',
      };
    }

    return {
      allowed: true,
      dailyBudget,
      spentToday,
      estimatedCost,
      projectedSpend: projected,
      reason: `Budget check verified. Within limits ($${spentToday.toFixed(2)} / $${dailyBudget.toFixed(2)}).`,
      action: 'ALLOW',
    };
  }
}

export class CostEngine {
  calculateCost(
    inputTokens: number,
    outputTokens: number,
    inputPricePer1k: number,
    outputPricePer1k: number
  ): {
    inputCost: number;
    outputCost: number;
    totalCost: number;
  } {
    const inputCost = (inputTokens / 1000) * inputPricePer1k;
    const outputCost = (outputTokens / 1000) * outputPricePer1k;
    const totalCost = Number((inputCost + outputCost).toFixed(6));

    return {
      inputCost: Number(inputCost.toFixed(6)),
      outputCost: Number(outputCost.toFixed(6)),
      totalCost,
    };
  }
}

export class PerformanceEngine {
  evaluate(
    responseContent: string,
    latencyMs: number,
    expectedLatencyMs: number = 700
  ): {
    performanceScore: number;
    signals: string[];
    reasons: string[];
  } {
    let score = 90;
    const signals: string[] = [];
    const reasons: string[] = [];

    // Latency scoring
    if (latencyMs < expectedLatencyMs) {
      score += 5;
      signals.push('OPTIMAL_LATENCY');
    } else if (latencyMs > expectedLatencyMs * 2) {
      score -= 15;
      signals.push('LATENCY_DEGRADATION');
      reasons.push(`Inference latency (${latencyMs}ms) exceeded nominal SLA target.`);
    }

    // Response presence & coherence signals
    if (!responseContent || responseContent.length < 10) {
      score -= 30;
      signals.push('TRUNCATED_OR_EMPTY');
      reasons.push('Output length is abnormally short.');
    } else {
      signals.push('SUFFICIENT_LENGTH');
    }

    // Repetition heuristic
    const words = responseContent.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    if (words.length > 30 && uniqueWords.size / words.length < 0.4) {
      score -= 20;
      signals.push('REPETITIVE_DEGENERATION');
      reasons.push('Elevated repetitive token frequency detected.');
    } else {
      signals.push('COHERENT_SYNTAX');
    }

    const finalScore = Math.min(100, Math.max(0, score));
    return {
      performanceScore: finalScore,
      signals,
      reasons,
    };
  }
}

export const budgetEngine = new BudgetEngine();
export const costEngine = new CostEngine();
export const performanceEngine = new PerformanceEngine();
