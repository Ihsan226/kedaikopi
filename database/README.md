# Database Documentation - Kedai Kopi

Dokumentasi lengkap untuk database MySQL website e-commerce Kedai Kopi.

## 📋 Daftar Isi

- [Setup Database](#setup-database)
- [Struktur Tabel](#struktur-tabel)
- [API Endpoints](#api-endpoints)
- [Konfigurasi](#konfigurasi)
- [Query Examples](#query-examples)

## 🚀 Setup Database

### 1. Membuat Database

```sql
-- Buka MySQL/phpMyAdmin
-- Import file: kedai_kopi.sql
-- Atau jalankan script berikut:

CREATE DATABASE kedai_kopi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kedai_kopi;

-- Kemudian copy-paste seluruh isi file kedai_kopi.sql
```

### 2. Konfigurasi Koneksi

Edit file `database/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'kedai_kopi');
define('DB_USER', 'root');        // Sesuaikan dengan username MySQL Anda
define('DB_PASS', '');            // Sesuaikan dengan password MySQL Anda
```

### 3. Testing Koneksi

```php
<?php
require_once 'database/config.php';

$db = DB::getInstance();
$products = $db->fetchAll("SELECT * FROM products LIMIT 5");
print_r($products);
?>
```

## 📊 Struktur Tabel

### Tabel Utama

| Tabel | Deskripsi | Jumlah Field |
|-------|-----------|--------------|
| `users` | Data pengguna dan admin | 12 |
| `categories` | Kategori produk | 7 |
| `products` | Data produk | 17 |
| `product_images` | Gambar produk | 7 |
| `product_variants` | Varian produk (ukuran, dll) | 7 |
| `orders` | Data pesanan | 23 |
| `order_items` | Item dalam pesanan | 9 |
| `shopping_cart` | Keranjang belanja | 7 |
| `coupons` | Kupon diskon | 12 |
| `reviews` | Ulasan produk | 10 |
| `wishlist` | Daftar keinginan | 4 |
| `settings` | Pengaturan sistem | 6 |
| `payment_logs` | Log pembayaran | 8 |
| `banners` | Banner/slider | 12 |

### Relasi Antar Tabel

```
users (1) -----> (N) orders
users (1) -----> (N) reviews
users (1) -----> (N) wishlist
users (1) -----> (N) shopping_cart

categories (1) -----> (N) products

products (1) -----> (N) product_images
products (1) -----> (N) product_variants
products (1) -----> (N) order_items
products (1) -----> (N) reviews
products (1) -----> (N) wishlist
products (1) -----> (N) shopping_cart

orders (1) -----> (N) order_items
orders (1) -----> (N) payment_logs
```

### Field Penting

**Users Table:**
- `role`: 'user' atau 'admin'
- `email`: unique, untuk login
- `password`: hashed dengan password_hash()

**Products Table:**
- `status`: 'active', 'inactive', 'out_of_stock'
- `featured`: untuk produk unggulan
- `rating`: rata-rata rating (auto-calculated)

**Orders Table:**
- `status`: 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'
- `payment_status`: 'pending', 'paid', 'failed', 'refunded'
- `order_number`: format KK + tahun + 4 digit (contoh: KK20250001)

## 🔌 API Endpoints

Base URL: `http://localhost/kedaikopi/api/`

### Products

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/products` | Ambil semua produk |
| GET | `/products?category=kopi-bubuk` | Filter by kategori |
| GET | `/products?search=arabica` | Cari produk |
| GET | `/products/{id}` | Ambil detail produk |
| POST | `/products` | Tambah produk baru (admin) |
| PUT | `/products/{id}` | Update produk (admin) |
| DELETE | `/products/{id}` | Hapus produk (admin) |

### Orders

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/orders?user_id=123` | Ambil pesanan user |
| GET | `/orders/{id}` | Detail pesanan |
| POST | `/orders` | Buat pesanan baru |
| PUT | `/orders/{id}` | Update status pesanan |

### Authentication

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/login` | Login user |
| POST | `/auth/register` | Registrasi user |
| POST | `/auth/logout` | Logout |

### Cart

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/cart` | Ambil item keranjang |
| POST | `/cart` | Tambah ke keranjang |
| PUT | `/cart` | Update item keranjang |
| DELETE | `/cart/{id}` | Hapus dari keranjang |

### Categories

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/categories` | Ambil semua kategori |

## ⚙️ Konfigurasi

### Environment Variables

Buat file `.env` (opsional):

```
DB_HOST=localhost
DB_NAME=kedai_kopi
DB_USER=root
DB_PASS=your_password
```

### PHP Settings

Pastikan pengaturan PHP mendukung:

```ini
; php.ini
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 300
memory_limit = 512M
```

## 📝 Query Examples

### Produk Terlaris

```sql
SELECT p.name, SUM(oi.quantity) as total_sold
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('paid', 'delivered')
GROUP BY p.id
ORDER BY total_sold DESC
LIMIT 10;
```

### Revenue Harian

```sql
SELECT DATE(created_at) as date, 
       COUNT(*) as total_orders,
       SUM(total_amount) as revenue
FROM orders 
WHERE status IN ('paid', 'delivered')
  AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Stok Produk Menipis

```sql
SELECT name, stock, min_stock
FROM products 
WHERE stock <= min_stock 
  AND status = 'active'
ORDER BY stock ASC;
```

### Customer Insights

```sql
SELECT u.name, u.email,
       COUNT(o.id) as total_orders,
       SUM(o.total_amount) as total_spent,
       AVG(o.total_amount) as avg_order
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status IN ('paid', 'delivered')
GROUP BY u.id
ORDER BY total_spent DESC
LIMIT 50;
```

## 🔧 Maintenance

### Backup Database

```bash
mysqldump -u root -p kedai_kopi > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
mysql -u root -p kedai_kopi < backup_20250111.sql
```

### Optimize Tables

```sql
OPTIMIZE TABLE products, orders, order_items, users;
```

### Update Product Ratings

```sql
CALL UpdateProductRating(1); -- Update rating untuk product ID 1
```

## 🚨 Troubleshooting

### Connection Error

```
SQLSTATE[HY000] [1045] Access denied
```

**Solusi:** Periksa username/password di `config.php`

### Table Not Found

```
Table 'kedai_kopi.products' doesn't exist
```

**Solusi:** Pastikan sudah import file `kedai_kopi.sql`

### Permission Denied

```
SQLSTATE[42000]: Access denied for user
```

**Solusi:** Grant privileges:

```sql
GRANT ALL PRIVILEGES ON kedai_kopi.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

## 📚 Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PDO Documentation](https://www.php.net/manual/en/book.pdo.php)
- [PHP Best Practices](https://phptherightway.com/)

## 🔒 Security Notes

1. **Password Hashing**: Gunakan `password_hash()` dan `password_verify()`
2. **SQL Injection**: Gunakan prepared statements
3. **Input Validation**: Validasi semua input dari user
4. **HTTPS**: Gunakan SSL untuk production
5. **Environment Variables**: Jangan hardcode credentials

---

**Developed with ❤️ for Kedai Kopi**
