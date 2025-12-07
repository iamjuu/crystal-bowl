# Stripe Payment Integration Setup

## 1. Install Required Packages

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js stripe
```

## 2. Environment Variables

Create a `.env.local` file in your project root and add:

```env
# Stripe Configuration
# Get these from: https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
```

## 3. Get Your Stripe Keys

1. Go to https://dashboard.stripe.com/register
2. Create an account or login
3. Navigate to Developers → API keys
4. Copy your **Publishable key** and **Secret key**
5. Paste them in your `.env.local` file

## 4. Test Mode

For testing, use the test keys (starting with `pk_test_` and `sk_test_`)

### Test Card Numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Require Authentication**: 4000 0025 0000 3155

Use any future date for expiry, any 3 digits for CVC, and any ZIP code.

## 5. Features Implemented

✅ Stripe Card Payment
✅ Payment Intent API
✅ Secure Payment Processing
✅ Google Pay (UI ready, needs implementation)
✅ PayPal (UI ready, needs implementation)
✅ Bank Transfer option

## 6. Price Configuration

Update the session price in `privateappointment/page.tsx`:

```typescript
const [bookingAmount] = useState(100) // Change this to your price
```

## 7. Production

When ready for production:
1. Switch to live API keys (starting with `pk_live_` and `sk_live_`)
2. Activate your Stripe account
3. Set up webhooks for payment confirmation

## Support

For issues, refer to: https://stripe.com/docs
