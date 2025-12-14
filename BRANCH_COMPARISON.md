# Branch Comparison: Main vs Nithin

## 📊 SUMMARY
- **Main Branch**: Contains the latest design/UI
- **Nithin Branch**: Contains updated business logic and features

## ✅ KEEP FROM NITHIN (Logic/Business Logic)

### 1. API Routes (All Business Logic)
✅ `app/api/admin/categories/[id]/route.ts` - Category CRUD logic with image/featured
✅ `app/api/admin/categories/route.ts` - Category listing with image/featured
✅ `app/api/admin/products/[id]/route.ts` - Product update logic
✅ `app/api/admin/products/route.ts` - Product creation logic
✅ `app/api/admin/sessions/route.ts` - Session management logic
✅ `app/api/auth/login/route.ts` - Login authentication logic
✅ `app/api/auth/register/route.ts` - Registration logic
✅ `app/api/auth/send-otp/route.ts` - OTP sending logic
✅ `app/api/auth/verify-otp/route.ts` - OTP verification logic
✅ `app/api/bookings/route.ts` - Booking logic
✅ `app/api/enquiries/route.ts` - Enquiry handling logic
✅ `app/api/orders/instant/route.ts` - Instant order logic
✅ `app/api/orders/route.ts` - Order creation logic
✅ `app/api/payment/create-checkout/route.ts` - Payment checkout logic
✅ `app/api/payment/create-order/route.ts` - Order creation from payment
✅ `app/api/payment/instant-buy/route.ts` - Instant buy logic
✅ `app/api/payment/verify-checkout/route.ts` - Payment verification
✅ `app/api/payment/verify-private-checkout/route.ts` - Private session payment verification
✅ `app/api/sessions/[id]/route.ts` - Session detail logic
✅ `app/api/sessions/route.ts` - Session listing logic
✅ `app/api/slots/route.ts` - Slot availability logic

### 2. Database Models (Schema)
✅ `models/Booking.ts` - Booking schema
✅ `models/Category.ts` - Category schema with imageUrl and isFeatured
✅ `models/DiscoverySession.ts` - Discovery session schema (NEW)
✅ `models/Order.ts` - Order schema with USD currency
✅ `models/PrivateSession.ts` - Private session schema (NEW)
✅ `models/SessionEnquiry.ts` - Session enquiry schema

### 3. TypeScript Types
✅ `types/index.ts` - Type definitions

## ✅ KEEP FROM MAIN (Design/UI)

### 1. UI Components
✅ `components/user/Footer.tsx` - Footer design
✅ `components/user/Navbar.tsx` - Navigation bar design
✅ `app/(user)/home/page.tsx` - Home page design
✅ `app/(user)/home/components/about/AboutSection.tsx` - About section design
✅ `app/(user)/home/components/collection/collectionSection.tsx` - Collection section design
✅ `app/(user)/faq/page.tsx` - FAQ page (keep from main)

### 2. Admin Dashboard UI
✅ `app/admin/dashboard/page.tsx` - Dashboard design (but check currency logic)
✅ `components/admin/DynamicMetricCard.tsx` - Metric card design (but check currency)
✅ `components/admin/OrdersPieChart.tsx` - Chart design (already fixed)
✅ `components/admin/UsersPieChart.tsx` - Chart design (already fixed)

## ⚠️ NEEDS MANUAL MERGE (Both Logic + UI)

### User Pages - Check Each:

#### Cart Page (`app/(user)/cart/page.tsx`)
- ✅ FROM NITHIN: Currency conversion to SGD, remove shipping/GST
- ✅ FROM MAIN: UI/Design
- ⚠️ ACTION: Merge - keep main's UI but use nithin's logic (SGD, no shipping/GST)

#### Login Page (`app/(user)/login/page.tsx`)
- ✅ FROM NITHIN: Authentication logic, OTP logic
- ✅ FROM MAIN: UI/Design
- ⚠️ ACTION: Keep main's UI, verify nithin's auth logic is integrated

#### Signup Page (`app/(user)/signup/page.tsx`)
- ✅ FROM NITHIN: Registration logic, OTP logic
- ✅ FROM MAIN: UI/Design
- ⚠️ ACTION: Keep main's UI, verify nithin's registration logic is integrated

#### Profile Page (`app/(user)/profile/page.tsx`)
- ✅ FROM NITHIN: Tab structure (Profile/Orders/Bookings), logic for fetching orders/bookings
- ✅ FROM MAIN: UI/Design (if different)
- ⚠️ ACTION: Keep nithin's tab structure, keep main's design

#### Shop Pages (`app/(user)/shop/page.tsx`, `app/(user)/shop/[id]/page.tsx`)
- ✅ FROM NITHIN: Currency conversion to SGD, price display logic
- ✅ FROM MAIN: UI/Design
- ⚠️ ACTION: Keep main's UI, use nithin's currency logic

#### Orders Page (`app/(user)/orders/page.tsx`)
- ✅ FROM NITHIN: Currency conversion to SGD
- ✅ FROM MAIN: UI/Design
- ⚠️ ACTION: Keep main's UI, use nithin's currency logic

#### Services Page (`app/(user)/services/page.tsx`)
- ✅ FROM NITHIN: Session listing logic
- ✅ FROM MAIN: UI/Design
- ⚠️ ACTION: Keep main's UI, verify nithin's logic

#### Appointment Pages (`app/(user)/privateappointment/page.tsx`, `app/(user)/discoveryappointment/page.tsx`)
- ✅ FROM NITHIN: Booking logic, payment logic
- ✅ FROM MAIN: UI/Design
- ⚠️ ACTION: Keep main's UI, use nithin's booking logic

### Admin Dashboard Pages - ✅ KEEP ALL FROM NITHIN (UI + Logic):

#### Categories Page (`app/admin/dashboard/categories/page.tsx`)
- ✅ FROM NITHIN: Image upload, featured category logic, remove description, UI
- ✅ KEPT: Complete file from nithin

#### Sessions Page (`app/admin/dashboard/sessions/page.tsx`)
- ✅ FROM NITHIN: Session management logic, UI
- ✅ KEPT: Complete file from nithin

#### Orders Page (`app/admin/dashboard/orders/page.tsx`)
- ✅ FROM NITHIN: Currency conversion to SGD, error handling, UI
- ✅ KEPT: Complete file from nithin

#### Enquiries Page (`app/admin/dashboard/enquiries/page.tsx`)
- ✅ FROM NITHIN: Removed slot/show slot functionality, UI changes
- ✅ KEPT: Complete file from nithin

#### Dashboard Main Page (`app/admin/dashboard/page.tsx`)
- ✅ FROM NITHIN: Dashboard UI and logic
- ✅ KEPT: Complete file from nithin

#### Product Components (`components/dashboard/ProductForm.tsx`, `components/dashboard/ProductList.tsx`)
- ✅ FROM NITHIN: Price handling, currency labels, UI
- ✅ KEPT: Complete files from nithin

#### Admin Components (`components/admin/DynamicMetricCard.tsx`, `components/admin/OrdersPieChart.tsx`, `components/admin/UsersPieChart.tsx`)
- ✅ FROM NITHIN: Chart components with fixes
- ✅ KEPT: Complete files from nithin

## 🗑️ DO NOT KEEP

- ❌ Nothing from nithin that removes features from main (like FAQ page)
- ❌ Any currency symbols or formatting from nithin if it's still ₹ or INR (should be $ and SGD)

## 📋 CURRENT STATUS

✅ **COMPLETED:**
1. Copied all API routes from nithin
2. Copied all models from nithin  
3. Copied types from nithin
4. Restored FAQ page from main

⏳ **PENDING:**
1. Review and merge UI files (keep main's design, integrate nithin's logic where needed)
2. Verify currency is SGD everywhere
3. Ensure no shipping/GST in cart
4. Test all functionality

## 🎯 RECOMMENDATION

Since we're already on main branch with main's UI:
1. ✅ Logic files are already copied from nithin
2. ⚠️ For UI files - most should stay as-is from main
3. ⚠️ Only need to verify that currency logic from nithin is applied (SGD instead of INR)
4. ⚠️ Verify cart has no shipping/GST (from nithin logic)

