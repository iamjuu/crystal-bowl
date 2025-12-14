/**
 * Migration Script: Convert Product Categories from Names to ObjectIds
 * 
 * This script updates all existing products to use category ObjectIds instead of category names.
 * It matches products with categories by name and updates the product's category field.
 * 
 * Run this script once after deploying the new schema changes.
 * 
 * Usage:
 *   npx tsx scripts/migrate-product-categories.ts
 */

import mongoose from 'mongoose';
import Product from '../models/Product';
import Category from '../models/Category';
import connectDB from '../lib/mongodb';

async function migrateProductCategories() {
  try {
    console.log('🔄 Starting category migration...\n');
    
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database\n');

    // Get all categories
    const categories = await Category.find({}).lean();
    console.log(`📂 Found ${categories.length} categories\n`);

    // Get all products
    const products = await Product.find({}).lean();
    console.log(`📦 Found ${products.length} products to check\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Process each product
    for (const product of products) {
      try {
        // Skip if category is already an ObjectId
        if (product.category && mongoose.Types.ObjectId.isValid(product.category as string)) {
          const categoryExists = await Category.findById(product.category);
          if (categoryExists) {
            console.log(`⏭️  Skipping "${product.name}" - already has valid ObjectId category`);
            skippedCount++;
            continue;
          }
        }

        // Skip if no category
        if (!product.category) {
          console.log(`⏭️  Skipping "${product.name}" - no category set`);
          skippedCount++;
          continue;
        }

        // Find matching category by name (case-insensitive)
        const categoryName = String(product.category).trim();
        const matchingCategory = categories.find(
          cat => cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (matchingCategory) {
          // Update product with category ObjectId
          await Product.findByIdAndUpdate(product._id, {
            category: matchingCategory._id
          });
          console.log(`✅ Updated "${product.name}" - "${categoryName}" → ObjectId(${matchingCategory._id})`);
          updatedCount++;
        } else {
          console.log(`⚠️  Warning: No matching category found for "${product.name}" with category "${categoryName}"`);
          errorCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating product "${product.name}":`, error);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Successfully updated: ${updatedCount} products`);
    console.log(`⏭️  Skipped: ${skippedCount} products`);
    console.log(`❌ Errors: ${errorCount} products`);
    console.log('='.repeat(60) + '\n');

    if (errorCount > 0) {
      console.log('⚠️  Some products had errors. Please check the logs above.');
      console.log('   You may need to manually assign categories to these products in the dashboard.\n');
    } else {
      console.log('🎉 Migration completed successfully!\n');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
}

// Run migration
migrateProductCategories();

