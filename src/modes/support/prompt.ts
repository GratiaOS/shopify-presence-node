import type { IdentityLayer } from '../../identity/schema';
import type { SupportModeInput } from '../types';

export function buildSupportPrompt(identity: IdentityLayer, input: SupportModeInput) {
  const { tone, policies, limits, glossary } = identity;

  const glossaryText =
    glossary && glossary.length > 0 ? glossary.map((g) => `${g.term}: ${g.definition}`).join(' | ') : 'none';

  const restrictedTopics =
    limits.restricted_topics && limits.restricted_topics.length > 0 ? limits.restricted_topics.join(', ') : 'none';

  const noPromises =
    limits.no_promises && limits.no_promises.length > 0 ? limits.no_promises.join(', ') : 'none';

  const systemPrompt = `
You are running in Support-mode for a Shopify store.

- Tone style: ${tone.style}
- Formality: ${tone.formality}
- Length: ${tone.length}
- Use short paragraphs (1–3 sentences).
- Be clear and concrete. Do not be vague.
- Respect store policies. Refund policy: ${policies.refund || 'not specified'}. Shipping policy: ${policies.shipping || 'not specified'}.
- Never make promises beyond the configured policies. Forbidden promises: ${noPromises}.
- Avoid topics: ${restrictedTopics}.
- Store glossary: ${glossaryText}.

You respond on behalf of the store, but you do not pretend to be a human. You are a support assistant.
`;

  const userPrompt = `
Customer message (channel: ${input.channel}):

${input.customerMessage}

If required information is missing (e.g., order number, item details), ask at most ONE clarifying question instead of guessing.
`;

  return { systemPrompt: systemPrompt.trim(), userPrompt: userPrompt.trim() };
}
