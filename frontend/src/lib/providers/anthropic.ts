import { LLMProvider, LLMRequest, NormalizedLLMResponse } from './provider.interface';
import { MockProvider } from './mock';

export class AnthropicProvider implements LLMProvider {
  name = 'Anthropic' as const;

  async generate(request: LLMRequest): Promise<NormalizedLLMResponse> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey.startsWith('sk-ant-your') || process.env.CONTROLPLANE_DEMO_MODE === 'true') {
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
    if (!apiKey || apiKey.startsWith('your-google') || process.env.CONTROLPLANE_DEMO_MODE === 'true') {
      return new MockProvider().generate(request);
    }

    const start = Date.now();

    // Map request.model to Google API endpoint names
    let requestedApiName = 'gemini-3.6-flash';
    const reqModelLower = (request.model || '').toLowerCase();

    if (reqModelLower.includes('3.7')) {
      requestedApiName = 'gemini-3.7-flash';
    } else if (reqModelLower.includes('3.6')) {
      requestedApiName = 'gemini-3.6-flash';
    } else if (reqModelLower.includes('3.5')) {
      requestedApiName = 'gemini-3.5-flash';
    } else if (reqModelLower.includes('3.1') || reqModelLower.includes('pro')) {
      requestedApiName = 'gemini-3.1-pro-preview';
    } else if (reqModelLower.includes('2.0') || reqModelLower.includes('2.5')) {
      requestedApiName = 'gemini-2.5-flash';
    }

    // Build candidate list prioritizing the exact requested model
    const candidateModels = Array.from(
      new Set([
        requestedApiName,
        'gemini-3.6-flash',
        'gemini-3.5-flash',
        'gemini-3-flash-preview',
        'gemini-3.7-flash',
      ])
    );

    for (const modelName of candidateModels) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: request.prompt }] }],
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const latencyMs = Date.now() - start;
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const inputTokens = data.usageMetadata?.promptTokenCount || Math.round(request.prompt.length / 4);
          const outputTokens = data.usageMetadata?.candidatesTokenCount || Math.round(content.length / 4);
          const totalTokens = inputTokens + outputTokens;
          const estimatedCost = Number(((inputTokens * 0.0001 + outputTokens * 0.0004) / 1000).toFixed(6));

          return {
            provider: 'Google',
            model: request.model || `Google ${modelName}`,
            content,
            inputTokens,
            outputTokens,
            totalTokens,
            latencyMs,
            finishReason: 'stop',
            estimatedCost,
            isMock: false,
          };
        }
      } catch (err) {
        console.warn(`Gemini model ${modelName} call failed, trying fallback:`, err);
      }
    }

    // Fallback if all network calls fail
    console.warn('Gemini network call failed, falling back to mock provider');
    return new MockProvider().generate(request);
  }
}
