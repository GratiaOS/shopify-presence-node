import OpenAI from 'openai';

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
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model = process.env.OPENAI_MODEL || 'gpt-4.1-mini') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async generate(request: EngineRequest): Promise<EngineResponse> {
    const { systemPrompt, userPrompt } = request;
    console.log('[PatternEngine] system prompt:\n', systemPrompt);
    console.log('[PatternEngine] user prompt:\n', userPrompt);

    const completion = await this.client.responses.create({
      model: this.model,
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    let content = '';
    const firstOutput = completion.output?.[0];
    if (firstOutput && 'content' in firstOutput && Array.isArray(firstOutput.content)) {
      const textPart = firstOutput.content.find((part) =>
        part.type === 'output_text' || part.type === 'text'
      ) as { text?: string; content?: string } | undefined;
      if (textPart?.text) content = textPart.text;
      else if (textPart?.content) content = textPart.content;
    }

    if (!content) {
      content = 'Sorry, I could not generate a response.';
    }

    console.log('[PatternEngine] response content:\n', content);
    return { content };
  }
}
