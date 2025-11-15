import type { IdentityLayer } from '../identity/schema';
import type { PatternEngineClient } from '../engine/client';

export interface ModeContext {
  shopId: string;
  identity: IdentityLayer;
}

export interface SupportModeInput {
  customerMessage: string;
  channel: 'chat' | 'email' | 'contact_form';
  orderContext?: {
    orderId?: string;
    email?: string;
  };
}

export interface SupportModeOutput {
  reply: string;
}

export interface SupportModeHandler {
  handle(
    ctx: ModeContext,
    input: SupportModeInput,
    engine: PatternEngineClient
  ): Promise<SupportModeOutput>;
}

export interface MerchantCodexInput {
  prompt: string;
  existingContent?: string;
  productId?: string;
}

export interface MerchantCodexOutput {
  reply: string;
  nextSteps?: string[];
}

export interface MerchantCodexModeHandler {
  handle(
    ctx: ModeContext,
    input: MerchantCodexInput,
    engine: PatternEngineClient
  ): Promise<MerchantCodexOutput>;
}
