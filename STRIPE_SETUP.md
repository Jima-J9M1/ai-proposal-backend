# Stripe Payment Integration Setup

This guide explains how to set up Stripe payments for the AI Proposal Generator.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_BASIC_PRICE_ID=price_basic_plan_id
STRIPE_PREMIUM_PRICE_ID=price_premium_plan_id

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Stripe Setup Steps

1. **Create a Stripe Account**
   - Sign up at https://stripe.com
   - Get your API keys from the dashboard

2. **Create Products and Prices**
   - Go to Products in your Stripe dashboard
   - Create two products: "Basic Plan" and "Premium Plan"
   - Create recurring prices for each product
   - Note down the price IDs (e.g., `price_1ABC123DEF456`)

3. **Set up Webhooks**
   - Go to Webhooks in your Stripe dashboard
   - Add endpoint: `https://your-domain.com/payments/webhook`
   - Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
   - Copy the webhook signing secret

## Usage Limits

The system enforces the following limits:

### Free Plan
- **Profiles**: 2
- **Proposals**: 5

### Basic Plan
- **Profiles**: 5
- **Proposals**: 15

### Premium Plan
- **Profiles**: 10
- **Proposals**: 50

## API Endpoints

### Create Checkout Session
```
POST /payments/create-checkout-session
{
  "priceId": "price_basic_plan_id"
}
```

### Get Subscription Status
```
GET /payments/subscription-status
```

### Check Usage Limits
```
GET /payments/usage-limits/profile
GET /payments/usage-limits/proposal
```

### Webhook (Stripe)
```
POST /payments/webhook
```

## Frontend Integration

When a user reaches their limit, redirect them to the payment flow:

1. Call `POST /payments/create-checkout-session` with the desired price ID
2. Redirect the user to the returned URL
3. After successful payment, Stripe will call your webhook
4. The user's limits will be automatically updated

## Testing

Use Stripe's test mode for development:
- Test card: `4242 4242 4242 4242`
- Any future date for expiry
- Any 3-digit CVC 