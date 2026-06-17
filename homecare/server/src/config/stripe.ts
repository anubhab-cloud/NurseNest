import { config } from './env';

// Platform fee percentage (15%)
export const PLATFORM_FEE_PERCENT = 15;
export const CURRENCY = 'usd';

// Only initialize Stripe if real key is provided
let stripe: any = null;

if (config.stripe.secretKey && config.stripe.secretKey.startsWith('sk_')) {
  try {
    const Stripe = require('stripe');
    stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2024-04-10',
      typescript: true,
    });
    console.log('[Stripe] Initialized');
  } catch (err) {
    console.warn('[Stripe] Failed to initialize - payments in mock mode');
  }
} else {
  console.warn('[Stripe] No valid key - running in mock mode');
}

export { stripe };
