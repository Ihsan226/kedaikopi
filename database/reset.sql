-- ====== RESET DATABASE KEDAI KOPI ======
-- Script untuk reset/clean database
-- HATI-HATI: Script ini akan menghapus SEMUA data!

USE kedai_kopi;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Show warning
SELECT '⚠️  WARNING: This will DELETE ALL DATA!' as warning_message,
       'Press Ctrl+C to cancel or continue to proceed' as instruction,
       '3 seconds to cancel...' as countdown;

-- Wait (you need to manually wait before executing next commands)

-- Drop all tables in correct order (reverse of creation)
DROP TABLE IF EXISTS payment_logs;
DROP TABLE IF EXISTS banners;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS wishlist;
DROP TABLE IF EXISTS shopping_cart;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Show completion message
SELECT 'Database reset completed!' as status,
       'All tables have been dropped.' as message,
       'Run kedai_kopi.sql to recreate tables' as next_step;

-- Optional: Drop and recreate database completely
-- UNCOMMENT ONLY IF YOU WANT TO RESET EVERYTHING INCLUDING DATABASE
/*
DROP DATABASE IF EXISTS kedai_kopi;
CREATE DATABASE kedai_kopi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SELECT 'Database recreated completely!' as final_status;
*/
