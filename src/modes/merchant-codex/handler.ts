import type {
  ModeContext,
  MerchantCodexModeHandler,
  MerchantCodexInput,
  MerchantCodexOutput,
} from '../types';
import type { PatternEngineClient } from '../../engine/client';
import { buildMerchantCodexPrompt } from './prompt';

export const merchantCodexModeHandler: MerchantCodexModeHandler = {
  async handle(
    ctx: ModeContext,
    input: MerchantCodexInput,
    engine: PatternEngineClient
  ): Promise<MerchantCodexOutput> {
    const { systemPrompt, userPrompt } = buildMerchantCodexPrompt(ctx.identity, input);
    const engineResponse = await engine.generate({ systemPrompt, userPrompt });
    const { reply, nextSteps } = postProcessMerchantCodexReply(engineResponse.content);
    return { reply, nextSteps };
  },
};

function postProcessMerchantCodexReply(content: string): { reply: string; nextSteps?: string[] } {
  const marker = /next steps?:/i;
  const match = content.match(marker);

  if (!match) {
    return { reply: content.trim() };
  }

  const index = match.index ?? 0;
  const body = content.slice(0, index).trim();
  const stepsRaw = content.slice(index + match[0].length).trim();

  const steps = stepsRaw
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•\d.)\s]+/, '').trim())
    .filter(Boolean);

  return { reply: body, nextSteps: steps.length ? steps : undefined };
}
