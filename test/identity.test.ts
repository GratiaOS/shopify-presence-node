import { describe, expect, it } from 'vitest';
import { InMemoryIdentityStore } from '../src/identity/store';

describe('Identity store', () => {
  it('stores and retrieves identity layers', async () => {
    const store = new InMemoryIdentityStore();
    await store.upsert({
      shopId: 'shop-123',
      tone: { style: 'friendly', formality: 'medium', length: 'medium' },
      glossary: [],
      rituals: {},
      templates: {},
      policies: {},
      limits: {},
      updatedAt: new Date().toISOString(),
    });

    const retrieved = await store.getByShopId('shop-123');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.shopId).toBe('shop-123');
  });
});
