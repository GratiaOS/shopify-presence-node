import type { Request, Response } from 'express';
import type { IdentityLayer } from '../../identity/schema';
import { identityStore } from '../../identity/store';

export async function configureIdentity(req: Request, res: Response) {
  try {
    const identity = req.body as IdentityLayer;

    if (!identity.shopId) {
      return res.status(400).json({ error: 'Missing shopId in identity layer' });
    }

    identity.updatedAt = new Date().toISOString();

    await identityStore.upsert(identity);
    return res.json({ ok: true });
  } catch (err) {
    console.error('[configureIdentity] error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
