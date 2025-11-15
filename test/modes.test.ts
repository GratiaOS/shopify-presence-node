import { describe, expect, it } from 'vitest';
import { supportModeHandler } from '../src/modes/support/handler';
import { merchantCodexModeHandler } from '../src/modes/merchant-codex/handler';
import type { ModeContext } from '../src/modes/types';
import type { PatternEngineClient, EngineResponse, EngineRequest } from '../src/engine/client';

const mockEngine: PatternEngineClient = {
  async generate(request: EngineRequest): Promise<EngineResponse> {
    return { content: `mock reply based on ${request.userPrompt.slice(0, 20)}...` };
  },
};

const baseContext: ModeContext = {
  shopId: 'test-shop',
  identity: {
    shopId: 'test-shop',
    tone: { style: 'friendly', formality: 'medium', length: 'medium' },
    glossary: [],
    rituals: {},
    templates: {},
    policies: {},
    limits: {},
    updatedAt: new Date().toISOString(),
  },
};

describe('Support-mode handler', () => {
  it('produces a reply string', async () => {
    const result = await supportModeHandler.handle(
      baseContext,
      { customerMessage: 'hello?', channel: 'chat' },
      mockEngine
    );
    expect(result.reply).toContain('mock reply');
  });
});

describe('Merchant-Codex-mode handler', () => {
  it('returns reply and optional next steps', async () => {
    const result = await merchantCodexModeHandler.handle(
      baseContext,
      { prompt: 'Write a short announcement', existingContent: undefined },
      mockEngine
    );
    expect(result.reply.length).toBeGreaterThan(0);
  });
});
