# Stripe Payment Integration Setup

This guide will help you set up Stripe payment integration for your Crystal Shop application.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Node.js and npm installed
3. MongoDB database configured

## Step 1: Get Your Stripe API Keys

1. Log in to your Stripe Dashboard: https://dashboard.stripe.com
2. Click on "Developers" in the left sidebar
3. Click on "API keys"
4. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` for test mode)
   - **Secret key** (starts with `sk_test_` for test mode)

## Step 2: Configure Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# App URL (important for redirect URLs)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MongoDB (if not already configured)
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (if not already configured)
JWT_SECRET=your_jwt_secret_key
```

**Important Notes:**
- Never commit your `.env.local` file to version control
- Use test keys (starting with `sk_test_` and `pk_test_`) for development
- Use live keys (starting with `sk_live_` and `pk_live_`) only in production

## Step 3: Install Dependencies

The Stripe package is already included in your `package.json`. If you need to reinstall:

```bash
npm install stripe
```

## Step 4: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to a product page: http://localhost:3000/shop/1

3. Click "Add to Cart"

4. Go to the cart page and click "Proceed to Checkout"

5. You'll be redirected to Stripe's checkout page

6. Use Stripe's test card numbers:
   - **Success:** 4242 4242 4242 4242
   - **Decline:** 4000 0000 0000 0002
   - Use any future expiry date (e.g., 12/34)
   - Use any 3-digit CVC (e.g., 123)
   - Use any ZIP code (e.g., 12345)

## Step 5: Verify Payment Flow

After successful payment:
1. You'll be redirected to `/cart/success`
2. An order will be created in your MongoDB database
3. The cart will be cleared automatically

## API Endpoints

### Create Checkout Session
- **Endpoint:** `POST /api/payment/create-checkout`
- **Auth Required:** Yes (Bearer token)
- **Body:**
  ```json
  {
    "items": [
      {
        "id": "1",
        "name": "Product Name",
        "price": 100000,
        "quantity": 1,
        "imageUrl": "https://..."
      }
    ],
    "amount": 100000,
    "currency": "INR"
  }
  ```

### Verify Checkout
- **Endpoint:** `POST /api/payment/verify-checkout`
- **Auth Required:** Yes (Bearer token)
- **Body:**
  ```json
  {
    "sessionId": "cs_test_..."
  }
  ```

## Currency Configuration

The application is configured to use INR (Indian Rupees) by default. Prices are stored in paise (smallest unit):
- ₹1000 = 100000 paise
- ₹2500 = 250000 paise

To change the currency:
1. Update the `currency` parameter in the checkout session creation
2. Update the currency display in the frontend components
3. Ensure Stripe supports your chosen currency

## Shipping Configuration

The cart page includes automatic shipping calculation:
- **Free shipping** for orders above ₹5000
- **₹200 shipping fee** for orders below ₹5000

Shipping addresses are collected during Stripe checkout for these countries:
- India (IN)
- United States (US)
- United Kingdom (GB)
- Canada (CA)
- Australia (AU)

To add more countries, update the `shipping_address_collection.allowed_countries` array in `/api/payment/create-checkout/route.ts`.

## Tax Configuration

The application includes 18% GST (Goods and Services Tax) calculation for Indian customers. This is calculated on the frontend before checkout.

## Production Deployment

Before deploying to production:

1. **Switch to Live Keys:**
   - Replace test keys with live keys in your production environment variables
   - Never commit live keys to version control

2. **Update App URL:**
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

3. **Enable Webhook (Optional but Recommended):**
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy the webhook signing secret and add to env:
     ```env
     STRIPE_WEBHOOK_SECRET=whsec_...
     ```

4. **Test in Production:**
   - Use real payment methods
   - Verify order creation
   - Check email notifications

## Troubleshooting

### "Invalid API Key" Error
- Verify your `STRIPE_SECRET_KEY` is correct
- Ensure no extra spaces in the environment variable
- Check you're using the correct key for your environment (test vs live)

### Checkout Session Not Creating
- Check server logs for detailed error messages
- Verify all required fields are present in the request
- Ensure user is authenticated (valid JWT token)

### Payment Not Completing
- Check Stripe Dashboard > Payments for the payment status
- Verify webhook is receiving events (if configured)
- Check MongoDB for order creation

### Cart Not Clearing After Payment
- Verify the success page is receiving the `session_id` parameter
- Check browser console for JavaScript errors
- Ensure localStorage is enabled in the browser

## Security Best Practices

1. **Never expose secret keys** in client-side code
2. **Always validate** amounts on the server side
3. **Use HTTPS** in production
4. **Implement rate limiting** on payment endpoints
5. **Log payment attempts** for audit purposes
6. **Verify webhook signatures** if using webhooks

## Support

For Stripe-specific issues:
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com

For application issues:
- Check the server logs
- Review the MongoDB collections
- Test with Stripe's test cards first

## Features Implemented

✅ Shopping cart with persistent storage (Zustand + localStorage)
✅ Add to cart functionality
✅ Cart page with quantity management
✅ Stripe checkout integration
✅ Payment verification
✅ Order creation in MongoDB
✅ Success page with order confirmation
✅ Automatic cart clearing after purchase
✅ Shipping cost calculation
✅ Tax (GST) calculation
✅ Mobile-responsive design
✅ User authentication check
✅ Amazon-style cart UI

## Next Steps (Optional Enhancements)

- [ ] Add webhook handler for payment events
- [ ] Implement order tracking page
- [ ] Add email notifications for orders
- [ ] Create admin panel for order management
- [ ] Add coupon/discount code functionality
- [ ] Implement saved addresses
- [ ] Add multiple payment methods
- [ ] Create invoice generation

