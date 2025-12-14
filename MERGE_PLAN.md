# Merge Plan: Logic from Nithin + Design from Main

## Files to take from NITHIN (Logic/Business Logic):
### API Routes (Pure Logic)
- `app/api/admin/categories/[id]/route.ts`
- `app/api/admin/categories/route.ts`
- `app/api/admin/products/[id]/route.ts`
- `app/api/admin/products/route.ts`
- `app/api/admin/sessions/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/register/route.ts`
- `app/api/auth/send-otp/route.ts`
- `app/api/auth/verify-otp/route.ts`
- `app/api/bookings/route.ts`
- `app/api/enquiries/route.ts`
- `app/api/orders/instant/route.ts`
- `app/api/orders/route.ts`
- `app/api/payment/create-checkout/route.ts`
- `app/api/payment/create-order/route.ts`
- `app/api/payment/instant-buy/route.ts`
- `app/api/payment/verify-checkout/route.ts`
- `app/api/payment/verify-private-checkout/route.ts`
- `app/api/sessions/[id]/route.ts`
- `app/api/sessions/route.ts`
- `app/api/slots/route.ts`

### Models (Database Schema)
- `models/Booking.ts`
- `models/Category.ts`
- `models/DiscoverySession.ts` (NEW - from nithin)
- `models/Order.ts`
- `models/PrivateSession.ts` (NEW - from nithin)
- `models/SessionEnquiry.ts`

### Types
- `types/index.ts`

## Files to keep from MAIN (Design/UI):
### UI Components
- `components/user/Footer.tsx`
- `components/user/Navbar.tsx`
- `app/(user)/home/page.tsx`
- `app/(user)/home/components/about/AboutSection.tsx`
- `app/(user)/home/components/collection/collectionSection.tsx`

## Files that need CAREFUL MERGE (Both Logic + Design):
### User Pages (May have both UI and logic)
- `app/(user)/cart/page.tsx` - Check: logic for calculations, keep main's UI
- `app/(user)/login/page.tsx` - Check: authentication logic from nithin, UI from main
- `app/(user)/signup/page.tsx` - Check: registration logic from nithin, UI from main
- `app/(user)/profile/page.tsx` - Check: profile logic from nithin, UI from main
- `app/(user)/orders/page.tsx` - Check: order display logic from nithin, UI from main
- `app/(user)/shop/page.tsx` - Check: product listing logic from nithin, UI from main
- `app/(user)/shop/[id]/page.tsx` - Check: product detail logic from nithin, UI from main
- `app/(user)/services/page.tsx` - Check: session logic from nithin, UI from main
- `app/(user)/privateappointment/page.tsx` - Check: booking logic from nithin, UI from main
- `app/(user)/discoveryappointment/page.tsx` - Check: booking logic from nithin, UI from main

### Admin Dashboard (May have both)
- `app/admin/dashboard/categories/page.tsx` - Check: category CRUD logic from nithin, UI from main
- `app/admin/dashboard/enquiries/page.tsx` - Check: enquiry handling logic from nithin, UI from main
- `app/admin/dashboard/orders/page.tsx` - Check: order management logic from nithin, UI from main
- `app/admin/dashboard/sessions/page.tsx` - Check: session management logic from nithin, UI from main
- `app/admin/dashboard/page.tsx` - Check: dashboard stats logic from nithin, UI from main

### Admin Components
- `components/admin/DynamicMetricCard.tsx`
- `components/admin/OrdersPieChart.tsx`
- `components/admin/UsersPieChart.tsx`
- `components/dashboard/ProductForm.tsx`
- `components/dashboard/ProductList.tsx`

## Files to DELETE (if removed in nithin):
- `app/(user)/faq/page.tsx` (D - deleted in nithin)

## Strategy:
1. Checkout main branch
2. Create a merge branch
3. Copy pure logic files from nithin (API routes, models, types)
4. Manually merge UI files (keep main's design, integrate nithin's logic)
5. Test thoroughly
6. Push to main

