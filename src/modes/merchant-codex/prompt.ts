import type { IdentityLayer } from '../../identity/schema';
import type { MerchantCodexInput } from '../types';

export function buildMerchantCodexPrompt(identity: IdentityLayer, input: MerchantCodexInput) {
  const { tone, glossary, templates } = identity;

  const glossaryText =
    glossary && glossary.length > 0 ? glossary.map((g) => `${g.term}: ${g.definition}`).join(' | ') : 'none';

  const announcementTemplate = templates.announcement || '';

  const systemPrompt = `
You are running in Merchant-Codex-mode for a Shopify store.

- You help the merchant think, write, and decide about their store.
- Tone style: ${tone.style}, formality: ${tone.formality}, length: ${tone.length}.
- Be clear, structured, and practical. Avoid hype and vague marketing.
- Prefer headings and bullet points when helpful.
- Use the store's terminology consistently. Glossary: ${glossaryText}.
- If the merchant is unclear, you may propose 2–3 concrete options instead of forcing one answer.
- You do not make revenue promises or guarantees.
- You are an assistant/tool, not a human colleague.

If the merchant is asking for an announcement and a template exists, follow this template loosely:
${announcementTemplate || '[no specific template configured]' }.
`;

  const userPromptLines: string[] = [];
  userPromptLines.push('Merchant request:');
  userPromptLines.push(input.prompt.trim());

  if (input.existingContent) {
    userPromptLines.push('\nExisting content to rewrite or improve:');
    userPromptLines.push(input.existingContent.trim());
  }

  if (input.productId) {
    userPromptLines.push(`\nProduct context: productId=${input.productId}`);
  }

  userPromptLines.push('\nIf appropriate, suggest 2–3 concrete next steps at the end.');

  const userPrompt = userPromptLines.join('\n');

  return {
    systemPrompt: systemPrompt.trim(),
    userPrompt: userPrompt.trim(),
  };
}
