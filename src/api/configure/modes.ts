import type { Request, Response } from 'express';

export async function configureModes(_req: Request, res: Response) {
  return res.json({ ok: true, message: 'Mode toggles not implemented yet.' });
}
