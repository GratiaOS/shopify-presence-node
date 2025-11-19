export type ToneStyle = 'friendly' | 'minimal' | 'premium' | 'playful' | 'technical';
export type ToneFormality = 'low' | 'medium' | 'high';
export type ToneLength = 'short' | 'medium' | 'long';

export interface GlossaryEntry {
  term: string;
  definition: string;
  synonyms?: string[];
}

export interface IdentityRituals {
  greeting?: string;
  closing?: string;
  fallback?: string;
}

export interface IdentityTemplates {
  shipping_update?: string;
  return_policy?: string;
  product_question?: string;
  announcement?: string;
}

export interface IdentityPolicies {
  refund?: string;
  shipping?: string;
  customer_support_hours?: string;
}

export interface IdentityLimits {
  no_promises?: string[];
  restricted_topics?: string[];
}

export interface IdentityLayer {
  shopId: string;
  tone: {
    style: ToneStyle;
    formality: ToneFormality;
    length: ToneLength;
  };
  glossary: GlossaryEntry[];
  rituals: IdentityRituals;
  templates: IdentityTemplates;
  policies: IdentityPolicies;
  limits: IdentityLimits;
  updatedAt: string;
}
