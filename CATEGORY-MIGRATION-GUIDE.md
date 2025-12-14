# Category Migration Guide

## Overview

This guide explains the changes made to improve how products are associated with categories in your Crystal Bowl application.

## What Changed?

### Before (Old Implementation)
- **Product Schema**: Stored category as a **String** (category name)
- **Problem**: 
  - If you renamed a category, products would still have the old name
  - No automatic updates when category changes
  - Risk of typos and inconsistencies
  - Extra database queries needed for filtering

### After (New Implementation)
- **Product Schema**: Stores category as an **ObjectId** (reference to Category document)
- **Benefits**:
  - ✅ Single source of truth - rename a category once, affects all products
  - ✅ Better performance with MongoDB `.populate()`
  - ✅ Data integrity and consistency
  - ✅ Proper database normalization
  - ✅ Easier maintenance

## Technical Changes Made

### 1. Product Model (`models/Product.ts`)
```typescript
// OLD
category: { 
  type: String, 
  required: false,
  ref: 'Category'  // This ref was incorrect for String type
}

// NEW
category: { 
  type: Schema.Types.ObjectId, 
  ref: 'Category',
  required: false
}
```

### 2. API Routes Updated
- ✅ `app/api/admin/products/route.ts` - Create products with category ID
- ✅ `app/api/admin/products/[id]/route.ts` - Update products with category ID
- ✅ `app/api/products/route.ts` - Filter by category ID, populate category data
- ✅ `app/api/products/[id]/route.ts` - Populate category when fetching single product

### 3. Frontend Components Updated
- ✅ `components/dashboard/ProductForm.tsx` - Now saves category ID instead of name
- ✅ `components/dashboard/ProductList.tsx` - Handles populated category objects
- ✅ `app/(user)/shop/page.tsx` - Works with populated category data

### 4. TypeScript Types Updated
- ✅ `types/index.ts` - Product interface now supports both string ID and populated Category object

## Migration Steps

### Step 1: Run the Migration Script

A migration script has been created to convert all existing products from category names to category IDs.

```bash
# Install tsx if you haven't already
npm install -D tsx

# Run the migration script
npx tsx scripts/migrate-product-categories.ts
```

### What the Script Does:
1. Connects to your database
2. Fetches all categories and products
3. For each product with a category name:
   - Finds the matching category by name (case-insensitive)
   - Updates the product to use the category's ObjectId
4. Prints a summary of updates, skips, and errors

### Step 2: Verify the Migration

After running the migration:

1. **Check the dashboard**: Go to your admin dashboard → Products
2. **Edit a product**: Click edit on any product
3. **Verify category dropdown**: The correct category should be selected
4. **Test updates**: Change the category and save - it should work correctly

### Step 3: Test Category Filtering

1. **Visit the shop page**: Go to `/shop`
2. **Click on a category**: From the navbar or homepage
3. **Verify filtering**: Products should be filtered correctly by category
4. **Check all categories**: Test each category link

## How Category Filtering Works Now

### User Flow:
1. User clicks category link: `/shop?category=7-chakras-set` (uses slug)
2. API receives slug parameter
3. API queries Categories collection to find category with matching slug
4. API queries Products collection for products with that category ObjectId
5. API populates category data (adds name, slug) to each product
6. Frontend receives products with full category information

### Code Flow:
```typescript
// In app/api/products/route.ts
const category = await Category.findOne({ slug: categoryParam });
if (category) {
  query.category = category._id; // Use ObjectId for query
}

// Populate category when fetching products
const products = await Product.find(query)
  .populate('category', 'name slug')
  .sort({ createdAt: -1 })
```

## Potential Issues & Solutions

### Issue 1: Products Show "No Category" After Migration
**Cause**: The product had a category name that doesn't match any existing category

**Solution**:
1. Go to admin dashboard → Products
2. Find products with missing categories
3. Manually assign the correct category from the dropdown
4. Save the product

### Issue 2: Category Filtering Not Working
**Cause**: Products may not have been migrated yet

**Solution**:
1. Run the migration script: `npx tsx scripts/migrate-product-categories.ts`
2. Clear browser cache and refresh
3. Check browser console for any errors

### Issue 3: Edit Product Shows Wrong Category
**Cause**: The populated category object is not being handled correctly

**Solution**: This should be fixed in the code. The form now checks:
```typescript
category: typeof initialData?.category === 'object' 
  ? initialData.category._id 
  : (initialData?.category || "")
```

## Rollback Plan (If Needed)

If you need to rollback to the old system:

1. **Revert Product Model**:
```typescript
category: { 
  type: String, 
  required: false,
  ref: 'Category'
}
```

2. **Revert API Routes**: Remove the `category` extraction and update code

3. **Revert Frontend**: Change dropdown value back to `cat.name`

4. **Update Database**: You'll need to manually convert ObjectIds back to names

## Best Practices Going Forward

### When Creating Products:
- Always select a category from the dropdown
- Categories are optional but recommended for better organization

### When Updating Categories:
- You can now rename categories freely
- All products will automatically show the new name
- The slug will be regenerated automatically

### When Deleting Categories:
- Products with that category will have `null` category
- Consider reassigning products before deleting categories
- Or create a "General" or "Uncategorized" category for orphaned products

## Testing Checklist

- [ ] Migration script runs without errors
- [ ] Dashboard products page loads correctly
- [ ] Can create new products with categories
- [ ] Can edit existing products and change categories
- [ ] Shop page filters products by category correctly
- [ ] Product detail page shows correct category
- [ ] Navbar category links work properly
- [ ] Homepage featured categories display correctly

## Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Check the server logs for API errors
3. Verify the migration script output
4. Ensure all files were updated correctly
5. Clear browser cache and restart the dev server

## Summary

This migration improves your database architecture by:
- Using proper MongoDB references (ObjectId)
- Enabling automatic updates when categories change
- Improving query performance
- Maintaining data consistency

The shop filtering will continue to work seamlessly because:
- URLs still use slugs: `/shop?category=7-chakras-set`
- API converts slugs to ObjectIds internally
- Products are populated with full category data
- Frontend receives complete category information

✅ **No breaking changes to the user experience!**

