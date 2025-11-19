import type { IdentityLayer } from './schema';

export function buildDefaultIdentity(shopId: string): IdentityLayer {
  return {
    shopId,
    tone: {
      style: 'friendly',
      formality: 'medium',
      length: 'medium',
    },
    glossary: [],
    rituals: {
      greeting: 'Hola 👋',
      closing: 'Si tienes más preguntas, estoy aici să te ajut.',
      fallback:
        'Nu pot răspunde acum cu siguranță. Te rog contactează suportul magazinului.',
    },
    templates: {
      announcement: 'We are excited to announce {{event}} happening on {{date}}.',
      shipping_update: '',
      return_policy: '',
      product_question: '',
    },
    policies: {
      refund: '30-day refund for unused items with receipt.',
      shipping: 'We ship worldwide within 3–7 business days.',
      customer_support_hours: 'Mon–Fri, 9:00–17:00 CET.',
    },
    limits: {
      no_promises: ['guaranteed delivery dates', 'exact revenue increases'],
      restricted_topics: ['medical advice', 'legal contracts'],
    },
    updatedAt: new Date().toISOString(),
  };
}
