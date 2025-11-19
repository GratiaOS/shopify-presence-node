import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config/env';
import { respond } from './api/respond';
import { configureIdentity } from './api/configure/identity';
import { getIdentity } from './api/identity';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'shopify-presence-node' });
});

app.get('/api/identity', getIdentity);
app.post('/api/respond', respond);
app.post('/api/configure/identity', configureIdentity);

const adminDistPath = path.resolve(__dirname, '../admin/dist');
app.use('/admin', express.static(adminDistPath));
app.get('/', (_req, res) => {
  res.sendFile(path.join(adminDistPath, 'index.html'));
});

const port = config.port;
app.listen(port, () => {
  console.log(`[shopify-presence-node] listening on port ${port}`);
});
