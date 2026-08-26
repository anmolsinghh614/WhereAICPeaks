import { LLMProvider, LLMRequest, NormalizedLLMResponse } from './provider.interface';
import { MockProvider } from './mock';

export class AnthropicProvider implements LLMProvider {
  name = 'Anthropic' as const;

  async generate(request: LLMRequest): Promise<NormalizedLLMResponse> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || process.env.CONTROLPLANE_DEMO_MODE === 'true') {
      return new MockProvider().generate(request);
    }

    const start = Date.now();
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: request.maxTokens ?? 1024,
          messages: [{ role: 'user', content: request.prompt }],
          system: request.systemPrompt,
        }),
      });

      if (!res.ok) throw new Error(`Anthropic error: ${res.statusText}`);
      const data = await res.json();
      const latencyMs = Date.now() - start;
      const content = data.content?.[0]?.text || '';
      const inputTokens = data.usage?.input_tokens || Math.round(request.prompt.length / 4);
      const outputTokens = data.usage?.output_tokens || Math.round(content.length / 4);
      const totalTokens = inputTokens + outputTokens;
      const estimatedCost = Number(((inputTokens * 0.003 + outputTokens * 0.015) / 1000).toFixed(6));

      return {
        provider: 'Anthropic',
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
      console.warn('Anthropic fallback to mock:', err);
      return new MockProvider().generate(request);
    }
  }
}

export class GeminiProvider implements LLMProvider {
  name = 'Google' as const;

  async generate(request: LLMRequest): Promise<NormalizedLLMResponse> {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey || process.env.CONTROLPLANE_DEMO_MODE === 'true') {
      return new MockProvider().generate(request);
    }

    const start = Date.now();
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: request.prompt }] }],
          }),
        }
      );

      if (!res.ok) throw new Error(`Gemini error: ${res.statusText}`);
      const data = await res.json();
      const latencyMs = Date.now() - start;
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const inputTokens = Math.round(request.prompt.length / 4);
      const outputTokens = Math.round(content.length / 4);
      const totalTokens = inputTokens + outputTokens;
      const estimatedCost = Number(((inputTokens * 0.0001 + outputTokens * 0.0004) / 1000).toFixed(6));

      return {
        provider: 'Google',
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
      console.warn('Gemini fallback to mock:', err);
      return new MockProvider().generate(request);
    }
  }
}
