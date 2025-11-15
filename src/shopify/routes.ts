import type { Express } from 'express';
import { respond } from '../api/respond';
import { configureIdentity } from '../api/configure/identity';

export function registerRoutes(app: Express) {
  app.post('/api/respond', respond);
  app.post('/api/configure/identity', configureIdentity);
}
