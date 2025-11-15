import type { ModeContext, SupportModeHandler, SupportModeInput, SupportModeOutput } from '../types';
import type { PatternEngineClient } from '../../engine/client';
import { buildSupportPrompt } from './prompt';

export const supportModeHandler: SupportModeHandler = {
  async handle(ctx: ModeContext, input: SupportModeInput, engine: PatternEngineClient): Promise<SupportModeOutput> {
    const { identity } = ctx;
    const { systemPrompt, userPrompt } = buildSupportPrompt(identity, input);

    const engineResponse = await engine.generate({ systemPrompt, userPrompt });

    const reply = postProcessSupportReply(identity, engineResponse.content);

    return { reply };
  },
};

function postProcessSupportReply(identity: ModeContext['identity'], content: string): string {
  const { rituals } = identity;
  const parts: string[] = [];

  if (rituals.greeting) parts.push(rituals.greeting);
  parts.push(content.trim());
  if (rituals.closing) parts.push(rituals.closing);

  return parts.join('\n\n');
}
