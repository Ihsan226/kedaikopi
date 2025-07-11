-- ====== SETUP DATABASE KEDAI KOPI ======
-- File setup untuk instalasi database secara otomatis
-- Jalankan file ini untuk membuat database, table, dan data awal

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS kedai_kopi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kedai_kopi;

-- Show current database
SELECT 'Creating Kedai Kopi Database...' as Status;

-- Enable event scheduler for automated tasks
SET GLOBAL event_scheduler = ON;

-- Set timezone
SET time_zone = '+07:00';

-- Create users table first (referenced by other tables)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    profile_image VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user',
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_path VARCHAR(255),
    parent_id INT,
    sort_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_parent (parent_id)
);

-- Insert default categories
INSERT IGNORE INTO categories (id, name, slug, description, image_path, sort_order, status) VALUES
(1, 'Kopi Siap Minum', 'kopi-siap-minum', 'Kopi yang sudah dipanggang dan siap untuk diseduh', 'assets/images/categories/kopi-siap-minum.jpg', 1, 'active'),
(2, 'Biji Kopi Mentah', 'biji-kopi-mentah', 'Green beans untuk home roasting', 'assets/images/categories/biji-kopi-mentah.jpg', 2, 'active'),
(3, 'Kopi Instan', 'kopi-instan', 'Kopi praktis yang mudah disajikan', 'assets/images/categories/kopi-instan.jpg', 3, 'active'),
(4, 'Peralatan Kopi', 'peralatan-kopi', 'Alat-alat untuk brewing kopi manual', 'assets/images/categories/peralatan-kopi.jpg', 4, 'active');

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    long_description LONGTEXT,
    price DECIMAL(12,2) NOT NULL,
    original_price DECIMAL(12,2),
    discount_percentage INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE NOT NULL,
    stock INT DEFAULT 0,
    weight DECIMAL(8,3) DEFAULT 0.000,
    dimensions JSON,
    status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
    featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_slug (slug),
    INDEX idx_sku (sku),
    INDEX idx_status (status),
    INDEX idx_featured (featured),
    INDEX idx_price (price),
    INDEX idx_rating (rating),
    FULLTEXT idx_search (name, description, tags)
);

-- Insert sample products
INSERT IGNORE INTO products (id, category_id, name, slug, description, long_description, price, original_price, discount_percentage, sku, stock, weight, status, featured, rating, review_count) VALUES
(1, 1, 'Kopi Arabica Premium', 'kopi-arabica-premium', 'Kopi arabica berkualitas tinggi dengan cita rasa yang halus dan aroma yang menawan.', 'Kopi Arabica Premium dari perkebunan terpilih di dataran tinggi. Diproses dengan metode natural untuk menghasilkan rasa yang kompleks dengan notes buah-buahan dan keasaman yang seimbang. Cocok untuk semua metode seduh.', 85000.00, NULL, 0, 'ARB-PREM-250', 50, 0.25, 'active', TRUE, 4.5, 124),
(2, 1, 'Kopi Robusta Strong', 'kopi-robusta-strong', 'Kopi robusta dengan rasa yang kuat dan kandungan kafein tinggi.', 'Robusta pilihan dari petani lokal dengan karakter bold dan body yang full. Tingkat keasaman rendah dengan rasa pahit yang pleasant. Ideal untuk espresso dan kopi susu. Cocok untuk yang menyukai kopi dengan kick yang kuat.', 65000.00, 75000.00, 13, 'ROB-STRG-250', 75, 0.25, 'active', FALSE, 4.2, 89),
(3, 1, 'Biji Kopi Luwak', 'biji-kopi-luwak', 'Kopi luwak asli dengan rasa yang unik dan eksklusif.', 'Kopi Luwak authentic dari Jawa Barat yang telah melalui proses fermentasi alami. Rasa yang sangat halus, tidak pahit, dengan aroma yang distinctive. Merupakan salah satu kopi termahal dan terunik di dunia.', 250000.00, NULL, 0, 'LUWAK-250', 10, 0.25, 'active', TRUE, 4.8, 45),
(4, 4, 'French Press 350ml', 'french-press-350ml', 'French press berkualitas tinggi untuk brewing kopi manual.', 'French Press dengan kapasitas 350ml, perfect untuk 2-3 cangkir kopi. Terbuat dari kaca borosilicate yang tahan panas dan frame stainless steel yang elegant. Dilengkapi dengan filter mesh yang halus untuk hasil seduhan yang bersih.', 150000.00, NULL, 0, 'FP-350-SS', 25, 0.5, 'active', TRUE, 4.6, 78);

-- Continue with other tables...
-- (Rest of tables creation will be loaded from kedai_kopi.sql)

-- Show installation progress
SELECT 'Database setup completed!' as Status, 
       (SELECT COUNT(*) FROM categories) as Categories,
       (SELECT COUNT(*) FROM products) as Products,
       (SELECT COUNT(*) FROM users) as Users;

-- Display next steps
SELECT 'Next Steps:' as Message
UNION ALL
SELECT '1. Run kedai_kopi.sql to create all tables'
UNION ALL  
SELECT '2. Run test_data.sql to insert sample data'
UNION ALL
SELECT '3. Configure database/config.php'
UNION ALL
SELECT '4. Start XAMPP and test the application';
