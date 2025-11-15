import type { Request, Response } from 'express';

export async function analyze(_req: Request, res: Response) {
  return res.json({ ok: true, message: 'Analyze endpoint placeholder.' });
}
