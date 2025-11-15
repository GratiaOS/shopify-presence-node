import type { IdentityLayer } from './schema';

export interface IdentityStore {
  getByShopId(shopId: string): Promise<IdentityLayer | null>;
  upsert(identity: IdentityLayer): Promise<void>;
}

export class InMemoryIdentityStore implements IdentityStore {
  private data = new Map<string, IdentityLayer>();

  async getByShopId(shopId: string): Promise<IdentityLayer | null> {
    return this.data.get(shopId) ?? null;
  }

  async upsert(identity: IdentityLayer): Promise<void> {
    this.data.set(identity.shopId, identity);
  }
}

export const identityStore = new InMemoryIdentityStore();
