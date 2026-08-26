import { LLMProvider, LLMRequest, NormalizedLLMResponse } from './provider.interface';

export class MockProvider implements LLMProvider {
  name = 'ControlPlane' as const;

  async generate(request: LLMRequest): Promise<NormalizedLLMResponse> {
    const startTime = Date.now();
    const prompt = request.prompt.trim();
    const promptLower = prompt.toLowerCase();

    const inputTokens = Math.max(1, Math.round(prompt.length / 3.8));
    let outputTokens = 60;
    let content = '';
    let latencyMs = 500 + Math.floor(Math.random() * 200);

    if (
      request.scenario === 'PII' ||
      promptLower.includes('ssn') ||
      promptLower.includes('invoice') ||
      promptLower.includes('jenkins') ||
      promptLower.includes('sarah.j@') ||
      promptLower.includes('482-91-8831') ||
      promptLower.includes('johnathan miller')
    ) {
      content =
        'Hello Johnathan Miller (SSN: 482-91-8831), regarding your enterprise subscription account #88192: we have confirmed your contact address at john.miller@enterprise-corp.com and mobile +1 (555) 234-8910. Your monthly statement is ready for review.';
      outputTokens = 65;
    } else if (
      request.scenario === 'PROMPT_INJECTION' ||
      promptLower.includes('ignore previous') ||
      promptLower.includes('system override') ||
      promptLower.includes('jailbreak') ||
      promptLower.includes('root credentials') ||
      promptLower.includes('output internal database keys')
    ) {
      content =
        'Request blocked by ControlPlane: Prompt injection or instruction override vector detected in input.';
      outputTokens = 0;
      latencyMs = 120;
    } else if (
      request.scenario === 'HIGH_RISK' ||
      promptLower.includes('insider') ||
      promptLower.includes('guaranteed 40%') ||
      promptLower.includes('buy call options') ||
      promptLower.includes('stock to buy before the earnings') ||
      promptLower.includes('guaranteed return')
    ) {
      content =
        'Based on confidential upcoming quarterly earnings data, I recommend buying call options on AlphaCorp immediately for an expected 35-45% short-term surge.';
      outputTokens = 42;
    } else if (
      request.scenario === 'BUDGET_EXCEEDED' ||
      promptLower.includes('budget_exceeded')
    ) {
      content = 'Request prevented: Daily spend ceiling exceeded.';
      outputTokens = 0;
      latencyMs = 80;
    } else if (
      request.scenario === 'RUNAWAY_USAGE' ||
      promptLower.includes('infinite loop') ||
      promptLower.includes('generate 50000 words')
    ) {
      content = 'Runaway usage detected: Token emission throttle engaged by ControlPlane rate policy.';
      outputTokens = 15;
      latencyMs = 200;
    } else {
      // Clean enterprise output
      content = `ControlPlane successfully routed and processed your query through ${request.model}. The platform continuously enforces latency budgets, token consumption bounds, and enterprise safety guardrails in real time. All interaction parameters adhere to policy rules.`;
      outputTokens = Math.max(20, Math.round(content.length / 3.8));
    }

    const totalTokens = inputTokens + outputTokens;
    const estimatedCost = Number(
      ((inputTokens * 0.005 + outputTokens * 0.015) / 1000).toFixed(6)
    );

    const actualElapsed = Date.now() - startTime;
    if (actualElapsed < latencyMs) {
      await new Promise((resolve) => setTimeout(resolve, Math.min(latencyMs - actualElapsed, 300)));
    }

    return {
      provider: request.model.toLowerCase().includes('claude')
        ? 'Anthropic'
        : request.model.toLowerCase().includes('gemini')
        ? 'Google'
        : request.model.toLowerCase().includes('gpt')
        ? 'OpenAI'
        : 'ControlPlane',
      model: request.model,
      content,
      inputTokens,
      outputTokens,
      totalTokens,
      latencyMs,
      finishReason: outputTokens === 0 ? 'content_filter' : 'stop',
      estimatedCost,
      isMock: true,
    };
  }
}
