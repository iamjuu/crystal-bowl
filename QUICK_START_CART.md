# 🛒 Quick Start Guide - Shopping Cart & Stripe Payment

## ⚡ 5-Minute Setup

### Step 1: Get Stripe Keys (2 minutes)
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Copy your **Publishable key** (starts with `pk_test_`)

### Step 2: Configure Environment (1 minute)
Create `.env.local` in the `crystel` folder:

```env
STRIPE_SECRET_KEY=sk_test_paste_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_paste_your_publishable_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Start Server (1 minute)
```bash
cd crystel
npm run dev
```

### Step 4: Test Cart (1 minute)
1. Open http://localhost:3000/shop
2. Click any product
3. Click "Add to Cart"
4. Click "Proceed to Checkout"
5. Use test card: `4242 4242 4242 4242`
6. Expiry: `12/34`, CVC: `123`, ZIP: `12345`
7. Complete payment
8. See your order!

## 🎯 What You Get

### ✅ Cart Page (`/cart`)
- Amazon-style design
- Add/remove items
- Quantity controls
- Price calculations
- Shipping & tax
- Stripe checkout

### ✅ Success Page (`/cart/success`)
- Order confirmation
- Order details
- Email notification

### ✅ Orders Page (`/orders`)
- Order history
- Order status
- Order details

### ✅ Cart Icon
- Navbar cart icon
- Item count badge
- Real-time updates

## 🧪 Stripe Test Cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Declined |

**Always use:**
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

## 📁 Key Files

```
crystel/
├── app/(user)/
│   ├── cart/page.tsx          ← Main cart page
│   ├── cart/success/page.tsx  ← Payment success
│   ├── orders/page.tsx        ← Order history
│   └── shop/[id]/page.tsx     ← Product detail (updated)
├── app/api/payment/
│   ├── create-checkout/       ← Create Stripe session
│   └── verify-checkout/       ← Verify payment
├── components/user/
│   └── Navbar.tsx             ← Updated with cart icon
└── stores/
    └── useCart.ts             ← Cart state management
```

## 💡 Quick Tips

### Adding to Cart
```typescript
// Automatically happens when user clicks "Add to Cart"
// Redirects to /cart page
```

### Viewing Cart
```typescript
// Click cart icon in navbar
// Or navigate to /cart
```

### Checkout
```typescript
// Click "Proceed to Checkout" in cart
// Redirects to Stripe checkout page
```

### Viewing Orders
```typescript
// Navigate to /orders
// Or click "View Orders" on success page
```

## 🔧 Pricing

All prices in paise (smallest unit):
- ₹1,000 = 100,000 paise
- ₹2,500 = 250,000 paise

**Shipping:**
- FREE for orders ≥ ₹5,000
- ₹200 for orders < ₹5,000

**Tax:**
- 18% GST on subtotal

## 🚨 Troubleshooting

### "Add to Cart" not working?
→ Make sure you're logged in

### Cart empty after refresh?
→ Check if localStorage is enabled in browser

### Checkout not working?
→ Verify Stripe keys in `.env.local`

### Payment not completing?
→ Use test card `4242 4242 4242 4242`

## 📚 Full Documentation

For detailed information, see:
- `CART_IMPLEMENTATION_SUMMARY.md` - Complete overview
- `CART_SETUP.md` - Detailed setup guide
- `STRIPE_SETUP.md` - Stripe configuration guide

## 🎉 You're Ready!

Your cart is fully functional with:
- ✅ Persistent cart storage
- ✅ Stripe payment processing
- ✅ Order management
- ✅ Mobile responsive design
- ✅ Amazon-style UI

**Start testing at:** http://localhost:3000/shop

---

**Need help?** Check the full documentation files or review the code comments.

