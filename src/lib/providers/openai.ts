import { LLMProvider, LLMRequest, NormalizedLLMResponse } from './provider.interface';
import { MockProvider } from './mock';

export class OpenAIProvider implements LLMProvider {
  name = 'OpenAI' as const;

  async generate(request: LLMRequest): Promise<NormalizedLLMResponse> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || process.env.CONTROLPLANE_DEMO_MODE === 'true') {
      return new MockProvider().generate(request);
    }

    const start = Date.now();
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: request.model.includes('gpt') ? request.model : 'gpt-4o',
          messages: [
            ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
            { role: 'user', content: request.prompt },
          ],
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 1024,
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenAI API error: ${res.statusText}`);
      }

      const data = await res.json();
      const latencyMs = Date.now() - start;
      const content = data.choices?.[0]?.message?.content || '';
      const inputTokens = data.usage?.prompt_tokens || Math.round(request.prompt.length / 4);
      const outputTokens = data.usage?.completion_tokens || Math.round(content.length / 4);
      const totalTokens = inputTokens + outputTokens;
      const estimatedCost = Number(((inputTokens * 0.005 + outputTokens * 0.015) / 1000).toFixed(6));

      return {
        provider: 'OpenAI',
        model: request.model,
        content,
        inputTokens,
        outputTokens,
        totalTokens,
        latencyMs,
        finishReason: 'stop',
        estimatedCost,
        isMock: false,
      };
    } catch (err) {
      console.warn('OpenAI fallback to mock provider:', err);
      return new MockProvider().generate(request);
    }
  }
}
