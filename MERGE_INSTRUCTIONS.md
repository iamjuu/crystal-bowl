# Merge Instructions: Nithin Logic + Main Design

## ✅ COMPLETED:
1. ✅ Checked out all API routes from nithin (pure logic)
2. ✅ Checked out all models from nithin (database schema)
3. ✅ Checked out types from nithin (TypeScript definitions)

## 📋 NEXT STEPS - Files to Keep from MAIN (UI/Design):

Since we're already on the main branch, these files are already the correct version:

### UI Components (Already correct - from main):
- `components/user/Footer.tsx` ✓
- `components/user/Navbar.tsx` ✓
- `app/(user)/home/page.tsx` ✓
- `app/(user)/home/components/about/AboutSection.tsx` ✓
- `app/(user)/home/components/collection/collectionSection.tsx` ✓

## ⚠️ MANUAL REVIEW NEEDED - Mixed Logic + UI Files:

These files may need manual merging. Check each one:

### User Pages:
1. `app/(user)/cart/page.tsx` - Verify: currency (SGD), price calculations, no shipping/GST
2. `app/(user)/login/page.tsx` - Check: auth logic from nithin vs UI from main
3. `app/(user)/signup/page.tsx` - Check: registration logic from nithin vs UI from main
4. `app/(user)/profile/page.tsx` - Check: profile tabs/orders logic from nithin vs UI from main
5. `app/(user)/orders/page.tsx` - Check: order display logic from nithin vs currency (SGD) from main
6. `app/(user)/shop/page.tsx` - Check: product listing + currency display
7. `app/(user)/shop/[id]/page.tsx` - Check: product detail + currency display
8. `app/(user)/services/page.tsx` - Check: session display logic
9. `app/(user)/privateappointment/page.tsx` - Check: booking logic from nithin
10. `app/(user)/discoveryappointment/page.tsx` - Check: booking logic from nithin

### Admin Dashboard:
1. `app/admin/dashboard/categories/page.tsx` - Check: category management with image/featured logic from nithin
2. `app/admin/dashboard/enquiries/page.tsx` - Check: enquiry handling
3. `app/admin/dashboard/orders/page.tsx` - Check: order management + currency
4. `app/admin/dashboard/sessions/page.tsx` - Check: session management logic
5. `app/admin/dashboard/page.tsx` - Check: dashboard stats + currency

### Admin Components:
1. `components/admin/DynamicMetricCard.tsx` - Check: currency formatting
2. `components/admin/OrdersPieChart.tsx` - Already fixed (removed labelStyle)
3. `components/admin/UsersPieChart.tsx` - Already fixed (removed labelStyle)
4. `components/dashboard/ProductForm.tsx` - Check: price input + currency label
5. `components/dashboard/ProductList.tsx` - Check: currency display

## 🗑️ Files to Delete:
- `app/(user)/faq/page.tsx` (deleted in nithin branch)

## 🚀 How to Proceed:

### Option 1: Keep Main's UI Files (Recommended)
Since we want design from main, we should keep main's version of all UI files. The logic from nithin is already copied. Just verify the pages work correctly.

### Option 2: Selective Merge
For each mixed file, manually review and merge:
- Keep UI/styling from main
- Keep business logic from nithin
- Ensure currency is SGD everywhere
- Ensure no shipping/GST in cart

## Current Status:
- ✅ Logic files copied from nithin
- ✅ Ready to commit logic changes
- ⏳ Need to verify UI files are correct (from main)
- ⏳ Need to delete faq page if it exists

