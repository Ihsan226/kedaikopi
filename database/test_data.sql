-- ====== TEST DATA UNTUK KEDAI KOPI ======
-- File ini berisi data test untuk mengisi database dengan data sample

USE kedai_kopi;

-- Insert sample users
INSERT INTO users (name, email, password, phone, address, city, province, postal_code, role) VALUES
('John Doe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+62 812-1111-1111', 'Jl. Merdeka No. 123', 'Jakarta', 'DKI Jakarta', '12345', 'user'),
('Jane Smith', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+62 813-2222-2222', 'Jl. Sudirman No. 456', 'Jakarta', 'DKI Jakarta', '12346', 'user'),
('Bob Johnson', 'bob@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+62 814-3333-3333', 'Jl. Thamrin No. 789', 'Jakarta', 'DKI Jakarta', '12347', 'user'),
('Admin User', 'admin@kedaikopi.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+62 815-4444-4444', 'Kantor Kedai Kopi', 'Jakarta', 'DKI Jakarta', '12348', 'admin');

-- Insert more products
INSERT INTO products (category_id, name, slug, description, long_description, price, original_price, discount_percentage, sku, stock, weight, status, featured, rating, review_count) VALUES
(3, 'Kopi Instan Premium', 'kopi-instan-premium', 'Kopi instan dengan rasa premium yang praktis dan nikmat.', 'Kopi instan premium dengan blend khusus dari berbagai jenis kopi pilihan. Proses freeze-dried mempertahankan aroma dan rasa kopi yang autentik. Cocok untuk gaya hidup modern yang sibuk tanpa mengorbankan kualitas rasa.', 35000.00, 45000.00, 22, 'INST-PREM-100', 75, 0.1, 'active', TRUE, 4.3, 156),
(4, 'Pour Over Dripper', 'pour-over-dripper', 'Dripper V60 untuk manual brewing yang sempurna.', 'Pour over dripper V60 dengan desain spiral unik yang memungkinkan ekstraksi optimal. Terbuat dari keramik berkualitas tinggi yang tahan panas. Cocok untuk pecinta kopi yang ingin mengeksplorasi berbagai profil rasa.', 85000.00, NULL, 0, 'POD-V60-CER', 40, 0.3, 'active', FALSE, 4.4, 89),
(4, 'Coffee Grinder Manual', 'coffee-grinder-manual', 'Penggiling kopi manual dengan burr ceramic berkualitas tinggi.', 'Coffee grinder manual dengan burr keramik yang menghasilkan bubuk kopi dengan konsistensi yang uniform. Desain compact dan portable, perfect untuk traveling atau brewing di rumah. Adjustable grind size untuk berbagai metode seduh.', 125000.00, NULL, 0, 'CGM-BURR-CER', 20, 0.8, 'active', TRUE, 4.7, 67),
(1, 'Kopi Specialty Blend', 'kopi-specialty-blend', 'Blend spesial dari berbagai origin dengan karakteristik unik.', 'Specialty blend yang menggabungkan kopi Arabica dari 3 origin berbeda: Ethiopia untuk floral notes, Colombia untuk sweetness, dan Brazil untuk body. Roasted to medium profile untuk menghadirkan kompleksitas rasa yang seimbang.', 95000.00, NULL, 0, 'SPEC-BLEND-250', 35, 0.25, 'active', TRUE, 4.6, 78),
(2, 'Green Bean Sumatra', 'green-bean-sumatra', 'Biji kopi mentah Sumatra untuk home roasting enthusiast.', 'Green bean kopi Sumatra Mandheling dari ketinggian 1200-1500 mdpl. Grade 1 dengan defect minimal, cocok untuk home roasting. Karakteristik earthy, herbal dengan body yang full. Perfect untuk dark roast profile.', 75000.00, NULL, 0, 'GB-SUM-500', 15, 0.5, 'active', FALSE, 4.5, 34);

-- Insert more product images
INSERT INTO product_images (product_id, image_path, alt_text, is_primary, sort_order) VALUES
(5, 'assets/images/kopi-instan-premium.jpg', 'Kopi Instan Premium', TRUE, 1),
(5, 'assets/images/kopi-instan-premium-2.jpg', 'Kopi Instan Premium Detail', FALSE, 2),
(6, 'assets/images/pour-over-dripper.jpg', 'Pour Over Dripper V60', TRUE, 1),
(6, 'assets/images/pour-over-dripper-2.jpg', 'Pour Over Dripper Setup', FALSE, 2),
(7, 'assets/images/coffee-grinder-manual.jpg', 'Coffee Grinder Manual', TRUE, 1),
(8, 'assets/images/specialty-blend.jpg', 'Kopi Specialty Blend', TRUE, 1),
(9, 'assets/images/green-bean-sumatra.jpg', 'Green Bean Sumatra', TRUE, 1);

-- Insert product variants
INSERT INTO product_variants (product_id, name, value, price_modifier, stock_modifier) VALUES
(5, 'Berat', '100g', 0.00, 0),
(5, 'Berat', '200g', 25000.00, -25),
(6, 'Material', 'Keramik', 0.00, 0),
(6, 'Material', 'Plastik', -25000.00, 20),
(7, 'Kapasitas', '30g', 0.00, 0),
(7, 'Kapasitas', '50g', 35000.00, -8),
(8, 'Berat', '250g', 0.00, 0),
(8, 'Berat', '500g', 85000.00, -15),
(9, 'Berat', '500g', 0.00, 0),
(9, 'Berat', '1kg', 70000.00, -10);

-- Insert sample orders
INSERT INTO orders (order_number, user_id, status, payment_status, payment_method, customer_name, customer_email, customer_phone, shipping_address, shipping_city, shipping_province, shipping_postal_code, subtotal, shipping_cost, total_amount) VALUES
('KK20250001', 1, 'delivered', 'paid', 'bank_transfer', 'John Doe', 'john@example.com', '+62 812-1111-1111', 'Jl. Merdeka No. 123', 'Jakarta', 'DKI Jakarta', '12345', 170000.00, 15000.00, 185000.00),
('KK20250002', 2, 'shipped', 'paid', 'e_wallet', 'Jane Smith', 'jane@example.com', '+62 813-2222-2222', 'Jl. Sudirman No. 456', 'Jakarta', 'DKI Jakarta', '12346', 95000.00, 15000.00, 110000.00),
('KK20250003', 3, 'processing', 'paid', 'cod', 'Bob Johnson', 'bob@example.com', '+62 814-3333-3333', 'Jl. Thamrin No. 789', 'Jakarta', 'DKI Jakarta', '12347', 250000.00, 0.00, 250000.00),
('KK20250004', 1, 'pending', 'pending', 'bank_transfer', 'John Doe', 'john@example.com', '+62 812-1111-1111', 'Jl. Merdeka No. 123', 'Jakarta', 'DKI Jakarta', '12345', 125000.00, 15000.00, 140000.00),
('KK20250005', 2, 'delivered', 'paid', 'e_wallet', 'Jane Smith', 'jane@example.com', '+62 813-2222-2222', 'Jl. Sudirman No. 456', 'Jakarta', 'DKI Jakarta', '12346', 200000.00, 0.00, 200000.00);

-- Insert order items
INSERT INTO order_items (order_id, product_id, product_name, product_sku, variant_info, quantity, unit_price, total_price) VALUES
-- Order 1 items
(1, 1, 'Kopi Arabica Premium', 'ARB-PREM-250', '{"size": "250g"}', 2, 85000.00, 170000.00),
-- Order 2 items  
(2, 8, 'Kopi Specialty Blend', 'SPEC-BLEND-250', '{"size": "250g"}', 1, 95000.00, 95000.00),
-- Order 3 items
(3, 3, 'Biji Kopi Luwak', 'LUWAK-250', '{"size": "250g"}', 1, 250000.00, 250000.00),
-- Order 4 items
(4, 7, 'Coffee Grinder Manual', 'CGM-BURR-CER', '{"capacity": "30g"}', 1, 125000.00, 125000.00),
-- Order 5 items
(5, 1, 'Kopi Arabica Premium', 'ARB-PREM-250', '{"size": "500g"}', 1, 160000.00, 160000.00),
(5, 6, 'Pour Over Dripper', 'POD-V60-CER', '{"material": "Plastik"}', 1, 60000.00, 60000.00);

-- Insert reviews
INSERT INTO reviews (product_id, user_id, order_id, rating, title, comment, status) VALUES
(1, 1, 1, 5, 'Kopi terbaik yang pernah saya coba!', 'Aromanya sangat harum dan rasanya tidak terlalu pahit. Kemasan juga rapi dan pengiriman cepat. Pasti akan pesan lagi!', 'approved'),
(1, 2, 5, 4, 'Bagus tapi agak mahal', 'Kualitas kopinya memang bagus, tapi harganya sedikit mahal dibanding yang lain. Overall tetap puas dengan rasanya.', 'approved'),
(8, 2, 2, 5, 'Blend yang sempurna', 'Specialty blend ini benar-benar unik! Bisa merasakan berbagai karakteristik dari berbagai origin. Sangat recommended untuk pecinta kopi.', 'approved'),
(3, 3, 3, 5, 'Kopi luwak asli dan berkualitas', 'Ini kopi luwak terbaik yang pernah saya beli online. Rasanya sangat halus dan aromanya khas. Worth the price!', 'approved'),
(7, 1, 4, 5, 'Grinder manual terbaik', 'Build quality sangat solid, hasil grinding konsisten. Perfect untuk manual brewing. Highly recommended!', 'approved'),
(6, 2, 5, 4, 'Dripper yang praktis', 'V60 yang bagus untuk pemula. Hasil seduhan cukup baik, mudah digunakan. Cocok untuk daily brewing.', 'approved');

-- Insert wishlist items
INSERT INTO wishlist (user_id, product_id) VALUES
(1, 3), -- John likes Biji Kopi Luwak
(1, 4), -- John likes French Press
(2, 1), -- Jane likes Arabica Premium
(2, 7), -- Jane likes Coffee Grinder
(3, 5), -- Bob likes Kopi Instan Premium
(3, 6); -- Bob likes Pour Over Dripper

-- Insert shopping cart items (for testing)
INSERT INTO shopping_cart (user_id, product_id, variant_info, quantity) VALUES
(1, 5, '{"size": "100g"}', 2),
(1, 6, '{"material": "Keramik"}', 1),
(2, 2, '{"size": "250g"}', 1),
(3, 8, '{"size": "500g"}', 1);

-- Insert more coupons
INSERT INTO coupons (code, name, description, type, value, minimum_amount, usage_limit, used_count, valid_from, valid_until, status) VALUES
('WELCOME15', 'Welcome Discount', 'Diskon 15% untuk member baru', 'percentage', 15.00, 50000.00, 200, 45, NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), 'active'),
('FLASHSALE', 'Flash Sale 25%', 'Flash sale diskon 25% terbatas', 'percentage', 25.00, 100000.00, 50, 23, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'active'),
('LOYAL50K', 'Loyal Customer', 'Diskon Rp 50.000 untuk pelanggan setia', 'fixed', 50000.00, 300000.00, 100, 12, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'active'),
('WEEKEND10', 'Weekend Special', 'Diskon 10% khusus weekend', 'percentage', 10.00, 75000.00, 999, 234, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 'active');

-- Update coupon usage
UPDATE coupons SET used_count = 15 WHERE code = 'NEWUSER10';
UPDATE coupons SET used_count = 67 WHERE code = 'FREESHIP';
UPDATE coupons SET used_count = 8 WHERE code = 'COFFEE20';

-- Insert payment logs
INSERT INTO payment_logs (order_id, payment_method, transaction_id, amount, status, gateway_response, notes) VALUES
(1, 'bank_transfer', 'TXN20250001', 185000.00, 'success', '{"bank": "BCA", "reference": "REF123456789"}', 'Transfer berhasil dikonfirmasi'),
(2, 'e_wallet', 'TXN20250002', 110000.00, 'success', '{"provider": "GoPay", "reference": "GP987654321"}', 'Pembayaran GoPay berhasil'),
(3, 'cod', 'TXN20250003', 250000.00, 'success', '{"delivery_id": "COD123456"}', 'COD - Pembayaran diterima kurir'),
(5, 'e_wallet', 'TXN20250005', 200000.00, 'success', '{"provider": "OVO", "reference": "OVO555666777"}', 'Pembayaran OVO berhasil');

-- Insert system settings
INSERT INTO settings (key_name, value, description, type) VALUES
('maintenance_mode', 'false', 'Mode maintenance website', 'boolean'),
('max_cart_items', '10', 'Maksimal item dalam keranjang', 'number'),
('order_timeout', '24', 'Timeout pembayaran dalam jam', 'number'),
('featured_products_limit', '8', 'Jumlah produk unggulan di homepage', 'number'),
('review_auto_approve', 'false', 'Auto approve review tanpa moderasi', 'boolean'),
('social_media', '{"facebook": "kedaikopi.id", "instagram": "@kedaikopi", "twitter": "@kedaikopi"}', 'Akun media sosial', 'json'),
('payment_methods', '["bank_transfer", "e_wallet", "cod"]', 'Metode pembayaran aktif', 'json'),
('shipping_zones', '{"jakarta": 15000, "jabodetabek": 20000, "jawa": 25000, "luar_jawa": 35000}', 'Zona pengiriman dan ongkir', 'json');

-- Insert banners
INSERT INTO banners (title, subtitle, description, image_path, link_url, button_text, position, sort_order, status, start_date, end_date) VALUES
('Flash Sale 25% Off!', 'Semua Produk Kopi', 'Dapatkan diskon hingga 25% untuk semua produk kopi. Terbatas sampai akhir minggu!', 'assets/images/flash-sale-banner.jpg', '#products', 'Belanja Sekarang', 'hero', 1, 'active', NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY)),
('New Arrival: Specialty Blend', 'Rasa Istimewa dari 3 Origin', 'Coba blend terbaru kami yang menggabungkan karakteristik unik dari Ethiopia, Colombia, dan Brazil', 'assets/images/specialty-blend-banner.jpg', 'product-detail.html?id=8', 'Lihat Produk', 'hero', 2, 'active', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('Gratis Ongkir Se-Indonesia', 'Min. Pembelian 200rb', 'Nikmati gratis ongkos kirim ke seluruh Indonesia untuk pembelian minimal Rp 200.000', 'assets/images/free-shipping-banner.jpg', '#products', 'Mulai Belanja', 'sidebar', 1, 'active', NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY));

-- Update product ratings (trigger UpdateProductRating for each product)
CALL UpdateProductRating(1);
CALL UpdateProductRating(2);
CALL UpdateProductRating(3);
CALL UpdateProductRating(4);
CALL UpdateProductRating(5);
CALL UpdateProductRating(6);
CALL UpdateProductRating(7);
CALL UpdateProductRating(8);
CALL UpdateProductRating(9);

-- Test queries to verify data
SELECT 'Products Count' as Info, COUNT(*) as Count FROM products WHERE status = 'active'
UNION ALL
SELECT 'Orders Count', COUNT(*) FROM orders
UNION ALL  
SELECT 'Users Count', COUNT(*) FROM users WHERE role = 'user'
UNION ALL
SELECT 'Reviews Count', COUNT(*) FROM reviews WHERE status = 'approved'
UNION ALL
SELECT 'Active Coupons', COUNT(*) FROM coupons WHERE status = 'active';

-- Show recent orders with customer info
SELECT o.order_number, o.customer_name, o.total_amount, o.status, o.created_at
FROM orders o
ORDER BY o.created_at DESC
LIMIT 5;

-- Show top selling products
SELECT p.name, SUM(oi.quantity) as total_sold, SUM(oi.total_price) as revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('paid', 'delivered')
GROUP BY p.id
ORDER BY total_sold DESC;

-- Show customer stats
SELECT u.name, COUNT(o.id) as total_orders, SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id AND o.status IN ('paid', 'delivered')
WHERE u.role = 'user'
GROUP BY u.id
ORDER BY total_spent DESC;
