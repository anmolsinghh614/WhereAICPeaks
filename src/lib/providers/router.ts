import { LLMProvider, LLMRequest, NormalizedLLMResponse } from './provider.interface';
import { OpenAIProvider } from './openai';
import { AnthropicProvider, GeminiProvider } from './anthropic';
import { MockProvider } from './mock';

export class ModelRouter {
  private openaiProvider = new OpenAIProvider();
  private anthropicProvider = new AnthropicProvider();
  private geminiProvider = new GeminiProvider();
  private mockProvider = new MockProvider();

  getProvider(providerName: string): LLMProvider {
    switch (providerName.toLowerCase()) {
      case 'openai':
        return this.openaiProvider;
      case 'anthropic':
        return this.anthropicProvider;
      case 'google':
      case 'gemini':
        return this.geminiProvider;
      default:
        return this.mockProvider;
    }
  }

  async routeAndExecute(
    providerName: string,
    request: LLMRequest
  ): Promise<NormalizedLLMResponse> {
    const provider = this.getProvider(providerName);
    try {
      return await provider.generate(request);
    } catch (err) {
      console.warn(`Provider ${providerName} execution failed, engaging MockProvider fallback`, err);
      return await this.mockProvider.generate(request);
    }
  }
}

export const modelRouter = new ModelRouter();
