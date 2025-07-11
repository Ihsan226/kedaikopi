-- ====== BACKUP SCRIPT KEDAI KOPI ======
-- Script untuk backup database kedai kopi
-- Jalankan script ini untuk membuat backup data

USE kedai_kopi;

-- Create backup info
SELECT 'KEDAI KOPI DATABASE BACKUP' as backup_info,
       NOW() as backup_date,
       VERSION() as mysql_version,
       DATABASE() as database_name;

-- Backup all data with INSERT statements
-- Categories backup
SELECT '-- Categories Backup --' as section;
SELECT CONCAT('INSERT INTO categories VALUES (', 
    IFNULL(id, 'NULL'), ', ',
    QUOTE(IFNULL(name, '')), ', ',
    QUOTE(IFNULL(slug, '')), ', ',
    QUOTE(IFNULL(description, '')), ', ',
    QUOTE(IFNULL(image_path, '')), ', ',
    IFNULL(parent_id, 'NULL'), ', ',
    IFNULL(sort_order, 0), ', ',
    QUOTE(IFNULL(status, 'active')), ', ',
    QUOTE(IFNULL(created_at, NOW())), ', ',
    QUOTE(IFNULL(updated_at, NOW())), ');'
) as backup_sql
FROM categories ORDER BY id;

-- Products backup  
SELECT '-- Products Backup --' as section;
SELECT CONCAT('INSERT INTO products VALUES (', 
    IFNULL(id, 'NULL'), ', ',
    IFNULL(category_id, 'NULL'), ', ',
    QUOTE(IFNULL(name, '')), ', ',
    QUOTE(IFNULL(slug, '')), ', ',
    QUOTE(IFNULL(description, '')), ', ',
    QUOTE(IFNULL(long_description, '')), ', ',
    IFNULL(price, 0), ', ',
    IFNULL(original_price, 'NULL'), ', ',
    IFNULL(discount_percentage, 0), ', ',
    QUOTE(IFNULL(sku, '')), ', ',
    IFNULL(stock, 0), ', ',
    IFNULL(weight, 0), ', ',
    QUOTE(IFNULL(dimensions, 'NULL')), ', ',
    QUOTE(IFNULL(status, 'active')), ', ',
    IFNULL(featured, FALSE), ', ',
    IFNULL(rating, 0), ', ',
    IFNULL(review_count, 0), ', ',
    IFNULL(view_count, 0), ', ',
    QUOTE(IFNULL(meta_title, '')), ', ',
    QUOTE(IFNULL(meta_description, '')), ', ',
    QUOTE(IFNULL(tags, 'NULL')), ', ',
    QUOTE(IFNULL(created_at, NOW())), ', ',
    QUOTE(IFNULL(updated_at, NOW())), ');'
) as backup_sql
FROM products ORDER BY id;

-- Users backup (without passwords for security)
SELECT '-- Users Backup (without passwords) --' as section;
SELECT CONCAT('INSERT INTO users (id, name, email, phone, address, city, province, postal_code, role, created_at, updated_at) VALUES (', 
    IFNULL(id, 'NULL'), ', ',
    QUOTE(IFNULL(name, '')), ', ',
    QUOTE(IFNULL(email, '')), ', ',
    QUOTE(IFNULL(phone, '')), ', ',
    QUOTE(IFNULL(address, '')), ', ',
    QUOTE(IFNULL(city, '')), ', ',
    QUOTE(IFNULL(province, '')), ', ',
    QUOTE(IFNULL(postal_code, '')), ', ',
    QUOTE(IFNULL(role, 'user')), ', ',
    QUOTE(IFNULL(created_at, NOW())), ', ',
    QUOTE(IFNULL(updated_at, NOW())), ');'
) as backup_sql
FROM users ORDER BY id;

-- Orders backup
SELECT '-- Orders Backup --' as section;
SELECT CONCAT('INSERT INTO orders VALUES (', 
    IFNULL(id, 'NULL'), ', ',
    QUOTE(IFNULL(order_number, '')), ', ',
    IFNULL(user_id, 'NULL'), ', ',
    QUOTE(IFNULL(status, 'pending')), ', ',
    QUOTE(IFNULL(payment_status, 'pending')), ', ',
    QUOTE(IFNULL(payment_method, '')), ', ',
    QUOTE(IFNULL(customer_name, '')), ', ',
    QUOTE(IFNULL(customer_email, '')), ', ',
    QUOTE(IFNULL(customer_phone, '')), ', ',
    QUOTE(IFNULL(shipping_address, '')), ', ',
    QUOTE(IFNULL(shipping_city, '')), ', ',
    QUOTE(IFNULL(shipping_province, '')), ', ',
    QUOTE(IFNULL(shipping_postal_code, '')), ', ',
    IFNULL(subtotal, 0), ', ',
    IFNULL(shipping_cost, 0), ', ',
    IFNULL(total_amount, 0), ', ',
    QUOTE(IFNULL(notes, '')), ', ',
    QUOTE(IFNULL(created_at, NOW())), ', ',
    QUOTE(IFNULL(updated_at, NOW())), ');'
) as backup_sql
FROM orders ORDER BY id;

-- Backup statistics
SELECT 'BACKUP STATISTICS' as info,
       (SELECT COUNT(*) FROM categories) as categories_count,
       (SELECT COUNT(*) FROM products) as products_count,
       (SELECT COUNT(*) FROM users) as users_count,
       (SELECT COUNT(*) FROM orders) as orders_count,
       (SELECT COUNT(*) FROM reviews) as reviews_count,
       (SELECT COUNT(*) FROM coupons) as coupons_count;

-- Backup validation queries
SELECT 'VALIDATION QUERIES' as info;
SELECT 'Active products:', COUNT(*) FROM products WHERE status = 'active';
SELECT 'Total revenue:', SUM(total_amount) FROM orders WHERE payment_status = 'paid';
SELECT 'Average rating:', AVG(rating) FROM products WHERE rating > 0;
