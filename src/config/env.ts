import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  openAiApiKey: process.env.OPENAI_API_KEY ?? '',
  devShopId: process.env.DEV_SHOP_ID ?? 'test-shop',
};

if (!config.openAiApiKey) {
  console.warn('[config] OPENAI_API_KEY is not set. Engine calls will return placeholders.');
}
