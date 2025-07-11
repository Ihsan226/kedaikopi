# 🚀 INSTALASI DATABASE KEDAI KOPI

Panduan lengkap untuk menginstall dan menjalankan database Kedai Kopi di XAMPP.

## 📋 Prerequisites

- XAMPP (PHP 7.4+ dan MySQL 5.7+)
- phpMyAdmin (sudah termasuk di XAMPP)
- Web browser (Chrome, Firefox, dll)

## 🗃️ File Database

```
database/
├── kedai_kopi.sql     # Schema database lengkap
├── test_data.sql      # Data sample untuk testing
├── setup.sql          # Setup otomatis database
├── backup.sql         # Script backup data
├── config.php         # Konfigurasi database PHP
└── README.md          # Dokumentasi
```

## 🛠️ Langkah Instalasi

### 1. Setup XAMPP

1. **Download dan Install XAMPP** dari https://www.apachefriends.org/
2. **Start Apache dan MySQL** dari XAMPP Control Panel
3. **Akses phpMyAdmin** di http://localhost/phpmyadmin

### 2. Import Database

#### Metode 1: Menggunakan phpMyAdmin (Recommended)

1. Buka http://localhost/phpmyadmin
2. Klik **"New"** untuk membuat database baru
3. Nama database: `kedai_kopi`
4. Collation: `utf8mb4_unicode_ci`
5. Klik **"Create"**
6. Pilih database `kedai_kopi`
7. Klik tab **"Import"**
8. **Choose File** → pilih `kedai_kopi.sql`
9. Klik **"Go"** untuk import
10. Tunggu sampai selesai (akan muncul pesan sukses)

#### Metode 2: Menggunakan Command Line

```bash
# Buka Command Prompt/Terminal
cd C:\xampp\mysql\bin

# Import database
mysql -u root -p < "C:\xampp\htdocs\kedaikopi\database\kedai_kopi.sql"

# Import data sample (opsional)
mysql -u root -p kedai_kopi < "C:\xampp\htdocs\kedaikopi\database\test_data.sql"
```

### 3. Import Data Sample

1. Di phpMyAdmin, pastikan database `kedai_kopi` terpilih
2. Klik tab **"Import"**
3. **Choose File** → pilih `test_data.sql`
4. Klik **"Go"**

### 4. Konfigurasi Database Connection

Edit file `database/config.php`:

```php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'kedai_kopi');
define('DB_USER', 'root');
define('DB_PASS', ''); // Kosong untuk XAMPP default

// Sesuaikan jika ada password MySQL
```

### 5. Test Koneksi

1. Buka browser
2. Akses: http://localhost/kedaikopi/api/
3. Jika muncul pesan "API is running", koneksi berhasil

## 🔧 Konfigurasi Lanjutan

### Update Base URL

Edit file `assets/js/db-migration.js`:

```javascript
class DatabaseMigration {
    constructor() {
        this.apiUrl = 'http://localhost/kedaikopi/api'; // Sesuaikan path
        // ...
    }
}
```

### Setting Permission (Jika diperlukan)

```bash
# Di Windows, biasanya tidak perlu setting permission
# Di Linux/Mac:
chmod -R 755 C:\xampp\htdocs\kedaikopi
chown -R daemon:daemon C:\xampp\htdocs\kedaikopi
```

## 📊 Verifikasi Database

### Cek Tabel

```sql
USE kedai_kopi;
SHOW TABLES;

-- Hasil yang diharapkan:
-- banners, categories, coupons, order_items, orders, 
-- payment_logs, product_images, product_variants, 
-- products, reviews, settings, shopping_cart, 
-- users, wishlist
```

### Cek Data Sample

```sql
-- Cek produk
SELECT COUNT(*) as total_products FROM products;
-- Expected: 9 produk

-- Cek kategori  
SELECT COUNT(*) as total_categories FROM categories;
-- Expected: 4 kategori

-- Cek user
SELECT COUNT(*) as total_users FROM users;
-- Expected: 4 user (3 customer + 1 admin)

-- Cek order
SELECT COUNT(*) as total_orders FROM orders;
-- Expected: 5 order
```

## 🏃‍♂️ Menjalankan Aplikasi

1. **Start XAMPP** (Apache + MySQL)
2. **Buka browser** ke: http://localhost/kedaikopi
3. **Test fitur**:
   - Browse produk
   - Add to cart
   - Register/login
   - Checkout

## 🧪 Testing API

### Test API Endpoints

```bash
# Test API utama
curl http://localhost/kedaikopi/api/

# Test produk
curl http://localhost/kedaikopi/api/products

# Test kategori
curl http://localhost/kedaikopi/api/categories

# Test dengan filter
curl "http://localhost/kedaikopi/api/products?category=1&search=arabica"
```

### Response Format

```json
{
  "success": true,
  "data": [...],
  "message": "Success",
  "pagination": {
    "page": 1,
    "per_page": 12,
    "total": 9,
    "total_pages": 1
  }
}
```

## 🐛 Troubleshooting

### 1. Database Connection Error

**Error**: `Connection failed: SQLSTATE[HY000] [1049] Unknown database`

**Solution**:
- Pastikan database `kedai_kopi` sudah dibuat
- Cek nama database di `config.php`
- Restart MySQL service

### 2. Import SQL Error

**Error**: `SQL syntax error`

**Solution**:
- Pastikan MySQL version 5.7+
- Set SQL mode: `SET sql_mode = '';`
- Import file satu per satu jika diperlukan

### 3. API 404 Error

**Error**: `Not Found`

**Solution**:
- Pastikan Apache running
- Cek file `.htaccess` ada
- Enable `mod_rewrite` di Apache

### 4. Permission Denied

**Error**: `Access denied for user 'root'@'localhost'`

**Solution**:
- Set password MySQL jika ada
- Update `config.php` dengan password yang benar
- Reset MySQL password jika lupa

### 5. CORS Error

**Error**: `Access to fetch blocked by CORS policy`

**Solution**:
- API sudah include CORS headers
- Pastikan domain match dengan config
- Test dengan tools seperti Postman

## 📁 Struktur Database

### Tables Overview

```
users               # Data pengguna
├── categories      # Kategori produk  
├── products        # Data produk
├── product_images  # Gambar produk
├── product_variants# Variasi produk
├── orders          # Data pesanan
├── order_items     # Item dalam pesanan
├── shopping_cart   # Keranjang belanja
├── wishlist        # Wishlist pengguna
├── reviews         # Review produk
├── coupons         # Kupon diskon
├── payment_logs    # Log pembayaran
├── banners         # Banner website
└── settings        # Pengaturan sistem
```

### Key Relationships

- `products` → `categories` (Many to One)
- `orders` → `users` (Many to One)  
- `order_items` → `orders` (Many to One)
- `reviews` → `products` & `users` (Many to One)
- `shopping_cart` → `users` & `products` (Many to One)

## 🔐 Default Login

### Admin Access
- **Email**: admin@kedaikopi.com
- **Password**: password (hash: `$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`)

### Customer Test Account
- **Email**: john@example.com
- **Password**: password

## 🔄 Backup & Restore

### Backup Database

```bash
# Backup structure + data
mysqldump -u root -p kedai_kopi > backup_kedai_kopi.sql

# Backup hanya data
mysqldump -u root -p --no-create-info kedai_kopi > data_only.sql
```

### Restore Database

```bash
# Restore complete
mysql -u root -p kedai_kopi < backup_kedai_kopi.sql

# Restore hanya data
mysql -u root -p kedai_kopi < data_only.sql
```

## 🚀 Production Deployment

### Security Checklist

- [ ] Change database password
- [ ] Update `config.php` dengan credentials production
- [ ] Enable HTTPS
- [ ] Set proper file permissions
- [ ] Enable error logging
- [ ] Disable debug mode
- [ ] Update API URLs di frontend

### Performance Optimization

- [ ] Enable MySQL query cache
- [ ] Add database indexes
- [ ] Optimize images
- [ ] Enable GZIP compression
- [ ] Setup CDN untuk static files

## 📞 Support

Jika ada masalah dalam instalasi:

1. Cek error log di `C:\xampp\apache\logs\error.log`
2. Cek MySQL error log di `C:\xampp\mysql\data\mysql_error.log`
3. Test koneksi database dengan tools external
4. Verify PHP extensions (PDO, MySQL) aktif

---

**Happy Coding! ☕**
