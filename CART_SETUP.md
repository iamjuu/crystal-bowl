# Shopping Cart & Stripe Payment Setup Guide

## Overview

This application now includes a fully functional Amazon-style shopping cart with Stripe payment integration. This guide will help you set up and test the cart functionality.

## Features Implemented

✅ **Shopping Cart**
- Add to cart functionality from product pages
- Persistent cart storage (survives page refreshes)
- Cart icon in navbar with item count badge
- Quantity management (increase/decrease)
- Remove items from cart
- Real-time subtotal calculation

✅ **Amazon-Style Cart Page**
- Clean, professional UI similar to Amazon
- Product thumbnails and details
- Quantity controls for each item
- Individual item subtotals
- Order summary sidebar with:
  - Items subtotal
  - Shipping cost (FREE over ₹5000)
  - Tax calculation (18% GST)
  - Total amount
  - Trust badges

✅ **Stripe Payment Integration**
- Secure checkout via Stripe
- Support for multiple payment methods
- Billing and shipping address collection
- Payment verification
- Order creation in database

✅ **Order Management**
- Order history page
- Order status tracking
- Order details view
- Payment provider information

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in the `crystel` directory with:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Stripe (Get from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
cd crystel
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test the Cart Flow

1. **Browse Products**: Go to http://localhost:3000/shop
2. **View Product**: Click on any product
3. **Add to Cart**: Click "Add to Cart" button
4. **View Cart**: You'll be redirected to the cart page
5. **Adjust Quantities**: Use +/- buttons to change quantities
6. **Proceed to Checkout**: Click "Proceed to Checkout"
7. **Complete Payment**: Use Stripe test card: `4242 4242 4242 4242`
8. **View Confirmation**: See order confirmation on success page
9. **Check Orders**: Visit http://localhost:3000/orders to see your order history

## Stripe Test Cards

Use these test card numbers during checkout:

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Card declined |
| 4000 0000 0000 9995 | Insufficient funds |

- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

## File Structure

```
crystel/
├── app/
│   ├── (user)/
│   │   ├── cart/
│   │   │   ├── page.tsx              # Main cart page
│   │   │   └── success/
│   │   │       └── page.tsx          # Payment success page
│   │   ├── orders/
│   │   │   └── page.tsx              # Order history page
│   │   └── shop/
│   │       └── [id]/
│   │           └── page.tsx          # Product detail (with Add to Cart)
│   └── api/
│       ├── orders/
│       │   └── route.ts              # Get/Create orders
│       └── payment/
│           ├── create-checkout/
│           │   └── route.ts          # Create Stripe session
│           └── verify-checkout/
│           │   └── route.ts          # Verify payment & create order
│           └── create-order/
│               └── route.ts          # Legacy order creation
├── components/
│   └── user/
│       └── Navbar.tsx                # Updated with cart icon
├── stores/
│   └── useCart.ts                    # Zustand cart store
└── STRIPE_SETUP.md                   # Detailed Stripe setup guide
```

## How It Works

### 1. Adding to Cart

When a user clicks "Add to Cart":
```typescript
// Product page
const handleAddToCart = () => {
  // Check authentication
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Please login to add items to cart");
    router.push("/login");
    return;
  }

  // Add item to cart (Zustand store)
  addItem({
    id: product.id.toString(),
    name: product.title,
    price: priceValue, // in paise
    imageUrl: product.image.src,
  });

  // Navigate to cart
  router.push("/cart");
};
```

### 2. Cart Storage

The cart uses Zustand with persistence:
```typescript
// stores/useCart.ts
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => { /* ... */ },
      removeItem: (id) => { /* ... */ },
      increment: (id) => { /* ... */ },
      decrement: (id) => { /* ... */ },
      // ...
    }),
    {
      name: "crystel-cart", // localStorage key
    }
  )
);
```

### 3. Checkout Flow

```
User clicks "Proceed to Checkout"
    ↓
POST /api/payment/create-checkout
    ↓
Stripe creates checkout session
    ↓
User redirected to Stripe checkout page
    ↓
User completes payment
    ↓
Stripe redirects to /cart/success?session_id=...
    ↓
POST /api/payment/verify-checkout
    ↓
Order created in MongoDB
    ↓
Cart cleared
    ↓
Success page displayed
```

### 4. Order Creation

After successful payment:
```typescript
// api/payment/verify-checkout/route.ts
const order = await Order.create({
  userId: user._id,
  items: items.map(item => ({
    productId: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  })),
  amount: session.amount_total,
  currency: session.currency?.toUpperCase() || "INR",
  status: "paid",
  paymentProvider: "stripe",
  paymentRef: sessionId,
});
```

## Pricing Format

All prices are stored in the smallest currency unit (paise for INR):
- Display: ₹1,000
- Stored: 100000 (paise)
- Stripe: 100000 (paise)

**Conversion:**
```typescript
// Display to storage
const priceInPaise = displayPrice * 100;

// Storage to display
const displayPrice = priceInPaise / 100;
```

## Shipping & Tax Calculation

### Shipping
```typescript
const shippingCost = itemsSubtotal > 0 
  ? (itemsSubtotal > 5000 ? 0 : 200) 
  : 0;
```
- **FREE** for orders ≥ ₹5,000
- **₹200** for orders < ₹5,000

### Tax (GST)
```typescript
const tax = Math.round(itemsSubtotal * 0.18); // 18%
```

### Total
```typescript
const totalAmount = itemsSubtotal + shippingCost + tax;
```

## Cart Icon in Navbar

The navbar displays a cart icon with item count:
```tsx
<Link href="/cart">
  <ShoppingCart size={24} />
  {cartCount > 0 && (
    <span className="badge">
      {cartCount}
    </span>
  )}
</Link>
```

## Authentication

All cart operations require authentication:
- Adding to cart checks for JWT token
- Checkout requires valid user session
- Orders are linked to user ID

## Error Handling

The application handles various error scenarios:

| Scenario | Behavior |
|----------|----------|
| User not logged in | Redirect to login page |
| Empty cart | Show empty cart message |
| Payment failed | Show error, keep cart intact |
| Network error | Show error toast |
| Invalid session | Redirect to cart |

## Mobile Responsiveness

The cart is fully responsive:
- **Desktop**: Side-by-side layout (items + summary)
- **Tablet**: Stacked layout
- **Mobile**: Optimized for small screens

## Customization

### Change Currency

1. Update cart page currency display
2. Update Stripe checkout session:
```typescript
currency: "usd", // Change from "inr"
```
3. Update order summary calculations

### Modify Shipping Rules

Edit `crystel/app/(user)/cart/page.tsx`:
```typescript
const shippingCost = itemsSubtotal > YOUR_THRESHOLD 
  ? 0 
  : YOUR_SHIPPING_COST;
```

### Adjust Tax Rate

Edit tax calculation:
```typescript
const tax = Math.round(itemsSubtotal * YOUR_TAX_RATE);
```

### Add Discount Codes

Extend the cart page with a discount input:
```typescript
const [discountCode, setDiscountCode] = useState("");
const [discount, setDiscount] = useState(0);

// Apply discount to total
const totalAmount = itemsSubtotal + shippingCost + tax - discount;
```

## Troubleshooting

### Cart not persisting
- Check browser localStorage is enabled
- Verify Zustand persist configuration
- Check browser console for errors

### "Add to Cart" not working
- Verify user is logged in
- Check JWT token in localStorage
- Review browser console for errors

### Checkout session not creating
- Verify Stripe API keys are correct
- Check server logs for detailed errors
- Ensure MongoDB connection is active

### Payment not completing
- Check Stripe Dashboard for payment status
- Verify webhook configuration (if using)
- Check order creation in MongoDB

### Cart icon not updating
- The count updates on cart state change
- Check Zustand store is properly connected
- Verify useEffect dependencies

## Production Checklist

Before deploying to production:

- [ ] Switch to Stripe live keys
- [ ] Update `NEXT_PUBLIC_APP_URL` to production URL
- [ ] Enable HTTPS
- [ ] Set up Stripe webhooks
- [ ] Configure proper error logging
- [ ] Test with real payment methods
- [ ] Set up email notifications
- [ ] Configure proper CORS settings
- [ ] Add rate limiting to payment endpoints
- [ ] Set up monitoring and alerts

## Support

For issues:
1. Check browser console for errors
2. Review server logs
3. Check Stripe Dashboard
4. Verify MongoDB collections
5. Test with Stripe test cards first

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [MongoDB Documentation](https://docs.mongodb.com/)

## Next Steps

Consider implementing:
- Email order confirmations
- Order tracking system
- Saved payment methods
- Multiple shipping addresses
- Wishlist functionality
- Product reviews
- Related products recommendations
- Abandoned cart recovery

