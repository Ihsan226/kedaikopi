-- ====== KEDAI KOPI DATABASE STRUCTURE ======
-- Database untuk website e-commerce Kedai Kopi
-- Compatible dengan MySQL/MariaDB

-- Membuat database
CREATE DATABASE IF NOT EXISTS kedai_kopi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kedai_kopi;

-- ====== TABEL USERS (Pengguna) ======
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    province VARCHAR(50),
    postal_code VARCHAR(10),
    role ENUM('user', 'admin') DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====== TABEL CATEGORIES (Kategori Produk) ======
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====== TABEL PRODUCTS (Produk) ======
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    long_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount_percentage INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    stock INT DEFAULT 0,
    min_stock INT DEFAULT 5,
    weight DECIMAL(8,2),
    dimensions VARCHAR(100),
    status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
    featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    meta_title VARCHAR(200),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ====== TABEL PRODUCT_IMAGES (Gambar Produk) ======
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    alt_text VARCHAR(200),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ====== TABEL PRODUCT_VARIANTS (Varian Produk) ======
CREATE TABLE product_variants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL,
    price_modifier DECIMAL(10,2) DEFAULT 0,
    stock_modifier INT DEFAULT 0,
    sku_suffix VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ====== TABEL ORDERS (Pesanan) ======
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method ENUM('bank_transfer', 'e_wallet', 'cod', 'credit_card') NOT NULL,
    
    -- Customer Info
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    
    -- Shipping Address
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(50) NOT NULL,
    shipping_province VARCHAR(50) NOT NULL,
    shipping_postal_code VARCHAR(10) NOT NULL,
    
    -- Billing Address
    billing_address TEXT,
    billing_city VARCHAR(50),
    billing_province VARCHAR(50),
    billing_postal_code VARCHAR(10),
    
    -- Pricing
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Additional Info
    notes TEXT,
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ====== TABEL ORDER_ITEMS (Item Pesanan) ======
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT,
    product_name VARCHAR(200) NOT NULL,
    product_sku VARCHAR(100),
    variant_info JSON,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ====== TABEL SHOPPING_CART (Keranjang Belanja) ======
CREATE TABLE shopping_cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    session_id VARCHAR(100),
    product_id INT NOT NULL,
    variant_info JSON,
    quantity INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ====== TABEL COUPONS (Kupon Diskon) ======
CREATE TABLE coupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type ENUM('percentage', 'fixed') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    minimum_amount DECIMAL(10,2) DEFAULT 0,
    maximum_discount DECIMAL(10,2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====== TABEL REVIEWS (Ulasan Produk) ======
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT,
    order_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- ====== TABEL WISHLIST (Daftar Keinginan) ======
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist (user_id, product_id)
);

-- ====== TABEL SETTINGS (Pengaturan Sistem) ======
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====== TABEL PAYMENT_LOGS (Log Pembayaran) ======
CREATE TABLE payment_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'success', 'failed', 'cancelled') NOT NULL,
    gateway_response JSON,
    notes TEXT,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ====== TABEL BANNERS (Banner/Slider) ======
CREATE TABLE banners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(200),
    description TEXT,
    image_path VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    button_text VARCHAR(50),
    position ENUM('hero', 'sidebar', 'footer') DEFAULT 'hero',
    sort_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====== INSERT DATA AWAL ======

-- Insert Categories
INSERT INTO categories (name, slug, description, status) VALUES
('Kopi Bubuk', 'kopi-bubuk', 'Kopi bubuk segar siap seduh', 'active'),
('Kopi Biji', 'kopi-biji', 'Biji kopi pilihan untuk para pecinta', 'active'),
('Kopi Instan', 'kopi-instan', 'Kopi praktis untuk kehidupan modern', 'active'),
('Alat Seduh', 'alat-seduh', 'Peralatan seduh kopi profesional', 'active');

-- Insert Admin User
INSERT INTO users (name, email, password, role) VALUES
('Administrator', 'admin@kedaikopi.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert Sample Products
INSERT INTO products (category_id, name, slug, description, long_description, price, original_price, discount_percentage, sku, stock, weight, status, featured, rating, review_count) VALUES
(1, 'Kopi Arabica Premium', 'kopi-arabica-premium', 'Kopi arabica premium dengan cita rasa yang halus dan aroma yang khas.', 'Kopi Arabica Premium kami dipetik dari kebun kopi terbaik di dataran tinggi Jawa Barat pada ketinggian 1200-1500 mdpl. Dengan proses pengolahan semi-washed yang sempurna, menghasilkan biji kopi dengan kualitas premium yang memiliki karakteristik rasa yang unik.', 85000.00, 100000.00, 15, 'ARB-PREM-250', 50, 0.25, 'active', TRUE, 4.5, 127),
(1, 'Kopi Robusta Asli', 'kopi-robusta-asli', 'Kopi robusta dengan karakteristik rasa yang kuat dan kandungan kafein tinggi.', 'Kopi Robusta asli dari Lampung dengan proses pengolahan tradisional yang menghasilkan cita rasa khas dan aroma yang kuat. Cocok untuk Anda yang menyukai kopi dengan karakter bold dan caffeine tinggi.', 65000.00, NULL, 0, 'ROB-ASLI-250', 30, 0.25, 'active', FALSE, 4.2, 89),
(2, 'Biji Kopi Luwak', 'biji-kopi-luwak', 'Biji kopi luwak asli dengan proses fermentasi alami yang unik.', 'Biji kopi luwak premium yang telah melalui proses fermentasi alami di dalam perut musang luwak. Menghasilkan cita rasa yang sangat unik, halus, dan tidak pahit dengan aroma yang khas dan mewah.', 250000.00, NULL, 0, 'LUWAK-250', 10, 0.25, 'active', TRUE, 4.8, 45),
(4, 'French Press Premium', 'french-press-premium', 'Alat seduh French Press berkualitas tinggi untuk kopi yang sempurna.', 'French Press dengan material stainless steel berkualitas tinggi dan filter mesh yang halus. Kapasitas 350ml cocok untuk 2-3 cangkir kopi. Dilengkapi dengan handle yang ergonomis dan tahan panas.', 150000.00, NULL, 0, 'FP-PREM-350', 25, 0.5, 'active', FALSE, 4.6, 67);

-- Insert Sample Product Images
INSERT INTO product_images (product_id, image_path, alt_text, is_primary, sort_order) VALUES
(1, 'assets/images/arabica-premium.jpg', 'Kopi Arabica Premium', TRUE, 1),
(1, 'assets/images/arabica-premium-2.jpg', 'Kopi Arabica Premium Detail', FALSE, 2),
(1, 'assets/images/arabica-premium-3.jpg', 'Kopi Arabica Premium Kemasan', FALSE, 3),
(2, 'assets/images/robusta-asli.jpg', 'Kopi Robusta Asli', TRUE, 1),
(2, 'assets/images/robusta-asli-2.jpg', 'Kopi Robusta Asli Detail', FALSE, 2),
(3, 'assets/images/kopi-luwak.jpg', 'Biji Kopi Luwak', TRUE, 1),
(4, 'assets/images/french-press.jpg', 'French Press Premium', TRUE, 1);

-- Insert Product Variants
INSERT INTO product_variants (product_id, name, value, price_modifier, stock_modifier) VALUES
(1, 'Berat', '250g', 0.00, 0),
(1, 'Berat', '500g', 75000.00, -20),
(1, 'Berat', '1kg', 215000.00, -40),
(2, 'Berat', '250g', 0.00, 0),
(2, 'Berat', '500g', 55000.00, -15),
(3, 'Berat', '250g', 0.00, 0),
(4, 'Kapasitas', '350ml', 0.00, 0),
(4, 'Kapasitas', '600ml', 50000.00, -10);

-- Insert Sample Coupons
INSERT INTO coupons (code, name, description, type, value, minimum_amount, usage_limit, valid_from, valid_until, status) VALUES
('NEWUSER10', 'Diskon Member Baru', 'Diskon 10% untuk member baru', 'percentage', 10.00, 100000.00, 100, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'active'),
('FREESHIP', 'Gratis Ongkir', 'Gratis ongkos kirim untuk pembelian di atas 200rb', 'fixed', 15000.00, 200000.00, 500, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 'active'),
('COFFEE20', 'Diskon Kopi 20%', 'Diskon 20% khusus produk kopi', 'percentage', 20.00, 150000.00, 50, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), 'active');

-- Insert System Settings
INSERT INTO settings (key_name, value, description, type) VALUES
('site_name', 'Kedai Kopi', 'Nama website', 'string'),
('site_description', 'Kopi berkualitas premium untuk Anda', 'Deskripsi website', 'string'),
('site_email', 'info@kedaikopi.com', 'Email kontak utama', 'string'),
('site_phone', '+62 812-3456-7890', 'Nomor telepon kontak', 'string'),
('site_address', 'Jl. Kopi Nusantara No. 123, Jakarta', 'Alamat toko', 'string'),
('shipping_cost', '15000', 'Ongkos kirim default', 'number'),
('free_shipping_minimum', '200000', 'Minimal pembelian gratis ongkir', 'number'),
('tax_rate', '0', 'Persentase pajak', 'number'),
('currency', 'IDR', 'Mata uang', 'string'),
('timezone', 'Asia/Jakarta', 'Zona waktu', 'string');

-- Insert Sample Banners
INSERT INTO banners (title, subtitle, description, image_path, link_url, button_text, position, sort_order, status) VALUES
('Selamat Datang di Kedai Kopi', 'Kopi Premium Terbaik', 'Nikmati kopi berkualitas premium dengan cita rasa terbaik dari berbagai nusantara', 'assets/images/hero-banner.jpg', '#products', 'Jelajahi Produk', 'hero', 1, 'active'),
('Promo Spesial Hari Ini', 'Diskon hingga 25%', 'Dapatkan diskon menarik untuk semua produk kopi pilihan', 'assets/images/promo-banner.jpg', '#products', 'Belanja Sekarang', 'hero', 2, 'active');

-- ====== INDEXES UNTUK PERFORMANCE ======
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_cart_user ON shopping_cart(user_id);
CREATE INDEX idx_cart_session ON shopping_cart(session_id);

-- ====== VIEWS UNTUK LAPORAN ======

-- View untuk statistik produk
CREATE VIEW product_stats AS
SELECT 
    p.id,
    p.name,
    p.price,
    p.stock,
    p.rating,
    p.review_count,
    c.name as category_name,
    COUNT(oi.id) as total_sold,
    SUM(oi.total_price) as total_revenue
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN orders o ON oi.order_id = o.id AND o.status IN ('paid', 'delivered')
GROUP BY p.id;

-- View untuk laporan penjualan
CREATE VIEW sales_report AS
SELECT 
    DATE(o.created_at) as sale_date,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as total_revenue,
    AVG(o.total_amount) as average_order_value,
    COUNT(DISTINCT o.user_id) as unique_customers
FROM orders o
WHERE o.status IN ('paid', 'delivered')
GROUP BY DATE(o.created_at)
ORDER BY sale_date DESC;

-- View untuk customer insights
CREATE VIEW customer_insights AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.created_at as join_date,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as total_spent,
    AVG(o.total_amount) as average_order_value,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id AND o.status IN ('paid', 'delivered')
WHERE u.role = 'user'
GROUP BY u.id;

-- ====== STORED PROCEDURES ======

-- Procedure untuk update rating produk
DELIMITER //
CREATE PROCEDURE UpdateProductRating(IN product_id INT)
BEGIN
    DECLARE avg_rating DECIMAL(3,2);
    DECLARE review_count INT;
    
    SELECT AVG(rating), COUNT(*) 
    INTO avg_rating, review_count
    FROM reviews 
    WHERE product_id = product_id AND status = 'approved';
    
    UPDATE products 
    SET rating = COALESCE(avg_rating, 0), 
        review_count = review_count 
    WHERE id = product_id;
END //
DELIMITER ;

-- Procedure untuk generate order number
DELIMITER //
CREATE PROCEDURE GenerateOrderNumber(OUT order_number VARCHAR(50))
BEGIN
    DECLARE next_id INT;
    DECLARE current_year CHAR(4);
    
    SET current_year = YEAR(NOW());
    SET next_id = (SELECT COALESCE(MAX(id), 0) + 1 FROM orders);
    SET order_number = CONCAT('KK', current_year, LPAD(next_id, 4, '0'));
END //
DELIMITER ;

-- ====== TRIGGERS ======

-- Trigger untuk update stock setelah order
DELIMITER //
CREATE TRIGGER after_order_item_insert
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products 
    SET stock = stock - NEW.quantity 
    WHERE id = NEW.product_id;
END //
DELIMITER ;

-- Trigger untuk update rating setelah review
DELIMITER //
CREATE TRIGGER after_review_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        CALL UpdateProductRating(NEW.product_id);
    END IF;
END //
DELIMITER ;

-- ====== BACKUP COMMAND ======
-- mysqldump -u username -p kedai_kopi > kedai_kopi_backup.sql

-- ====== RESTORE COMMAND ======
-- mysql -u username -p kedai_kopi < kedai_kopi_backup.sql
