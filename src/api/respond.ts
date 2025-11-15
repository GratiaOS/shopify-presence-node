import type { Request, Response } from 'express';
import { identityStore } from '../identity/store';
import { OpenAIClient } from '../engine/client';
import { supportModeHandler } from '../modes/support/handler';
import { merchantCodexModeHandler } from '../modes/merchant-codex/handler';
import type {
  ModeContext,
  SupportModeInput,
  MerchantCodexInput,
} from '../modes/types';
import { config } from '../config/env';

const engine = new OpenAIClient(config.openAiApiKey);

type ModeName = 'support' | 'merchant-codex';

type RespondBody = {
  shopId: string;
  mode: ModeName;
  payload: any;
};

export async function respond(req: Request, res: Response) {
  try {
    const { shopId, mode, payload } = req.body as RespondBody;

    if (!shopId) {
      return res.status(400).json({ error: 'Missing shopId' });
    }
    if (!mode) {
      return res.status(400).json({ error: 'Missing mode' });
    }

    const identity = await identityStore.getByShopId(shopId);
    if (!identity) {
      return res.status(400).json({ error: 'Identity not configured for this shop' });
    }

    const ctx: ModeContext = { shopId, identity };

    if (mode === 'support') {
      const supportInput: SupportModeInput = {
        customerMessage: payload.customerMessage,
        channel: payload.channel || 'chat',
        orderContext: payload.orderContext,
      };
      const output = await supportModeHandler.handle(ctx, supportInput, engine);
      return res.json(output);
    }

    if (mode === 'merchant-codex') {
      const merchantInput: MerchantCodexInput = {
        prompt: payload.prompt,
        existingContent: payload.existingContent,
        productId: payload.productId,
      };
      const output = await merchantCodexModeHandler.handle(ctx, merchantInput, engine);
      return res.json(output);
    }

    return res.status(400).json({ error: `Unsupported mode: ${mode}` });
  } catch (err) {
    console.error('[respond] error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
