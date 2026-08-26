export interface LLMRequest {
  model: string;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  scenario?: string;
}

export interface NormalizedLLMResponse {
  provider: 'OpenAI' | 'Anthropic' | 'Google' | 'ControlPlane';
  model: string;
  content: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latencyMs: number;
  finishReason: 'stop' | 'length' | 'content_filter' | 'error';
  estimatedCost: number;
  isMock: boolean;
}

export interface LLMProvider {
  name: 'OpenAI' | 'Anthropic' | 'Google' | 'ControlPlane';
  generate(request: LLMRequest): Promise<NormalizedLLMResponse>;
}
