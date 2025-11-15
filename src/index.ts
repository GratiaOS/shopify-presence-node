import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { respond } from './api/respond';
import { configureIdentity } from './api/configure/identity';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'shopify-presence-node' });
});

app.post('/api/respond', respond);
app.post('/api/configure/identity', configureIdentity);

const port = config.port;
app.listen(port, () => {
  console.log(`[shopify-presence-node] listening on port ${port}`);
});
