export interface EngineRequest {
  systemPrompt: string;
  userPrompt: string;
}

export interface EngineResponse {
  content: string;
}

export interface PatternEngineClient {
  generate(request: EngineRequest): Promise<EngineResponse>;
}

export class OpenAIClient implements PatternEngineClient {
  constructor(private apiKey: string) {}

  async generate(request: EngineRequest): Promise<EngineResponse> {
    console.log('[PatternEngine] system prompt:\n', request.systemPrompt);
    console.log('[PatternEngine] user prompt:\n', request.userPrompt);
    if (!this.apiKey) {
      return { content: 'Engine key missing. This is a placeholder reply.' };
    }
    // TODO: wire to actual OpenAI API.
    return { content: 'TODO: engine output. Replace with real model call.' };
  }
}
