import type { Request, Response } from 'express';
import { identityStore } from '../identity/store';
import { buildDefaultIdentity } from '../identity/defaults';
import { config } from '../config/env';

export async function getIdentity(req: Request, res: Response) {
  try {
    const queryShop = (req.query.shopId as string | undefined)?.trim();
    const shopId = queryShop && queryShop.length > 0 ? queryShop : config.devShopId;

    if (!shopId) {
      return res.status(400).json({ error: 'Missing shopId' });
    }

    const identity = await identityStore.getByShopId(shopId);

    if (!identity) {
      return res.json({
        identity: buildDefaultIdentity(shopId),
        isNew: true,
      });
    }

    return res.json({
      identity,
      isNew: false,
    });
  } catch (err) {
    console.error('[getIdentity] error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
