import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  priceIds: {
    basic: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic',
    premium: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium',
  },
})); 