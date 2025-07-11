# Kedai Kopi - Website E-commerce

Website e-commerce modern untuk toko kopi dengan fitur lengkap dan desain yang responsif.

## 🚀 Fitur Utama

### Frontend
- **Halaman Beranda** - Hero section, katalog produk, kategori, dan informasi perusahaan
- **Sistem Autentikasi** - Login/Register untuk pengguna dan admin
- **Katalog Produk** - Grid produk dengan filter dan pencarian
- **Detail Produk** - Halaman detail dengan gambar, varian, ulasan, dan spesifikasi
- **Keranjang Belanja** - Manajemen item, quantity, dan promo code
- **Checkout** - Multi-step checkout dengan berbagai metode pembayaran
- **Akun Pengguna** - Dashboard, riwayat pesanan, dan profil
- **Konfirmasi Pesanan** - Halaman konfirmasi dengan tracking status

### Dashboard Admin
- **Dashboard** - Statistik penjualan dan overview
- **Manajemen Produk** - CRUD produk dengan kategori dan stok
- **Manajemen Pesanan** - Tracking dan update status pesanan
- **Manajemen Pelanggan** - Data dan riwayat pelanggan
- **Konfirmasi Pembayaran** - Verifikasi transfer dan pembayaran
- **Laporan** - Analisis penjualan dan performa
- **Pengaturan** - Konfigurasi toko dan sistem

### Desain & UX
- **Responsive Design** - Optimal di desktop, tablet, dan mobile
- **Modern UI** - Desain clean dengan tema kopi yang menarik
- **Smooth Animations** - Transisi halus dan interaksi yang menyenangkan
- **Loading States** - Feedback visual untuk pengalaman yang baik

## 📁 Struktur Proyek

```
kedaikopi/
├── index.html                 # Halaman utama
├── login.html                 # Halaman login pengguna
├── register.html              # Halaman registrasi
├── admin-login.html           # Login admin
├── cart.html                  # Keranjang belanja
├── checkout.html              # Proses checkout
├── account.html               # Dashboard pengguna
├── admin-dashboard.html       # Dashboard admin
├── product-detail.html        # Detail produk
├── order-confirmation.html    # Konfirmasi pesanan
├── assets/
│   ├── css/
│   │   └── style.css          # Stylesheet utama
│   ├── js/
│   │   ├── script.js          # JavaScript utama
│   │   ├── auth.js            # Sistem autentikasi
│   │   ├── cart.js            # Fungsi keranjang
│   │   ├── checkout.js        # Proses checkout
│   │   ├── account.js         # Dashboard pengguna
│   │   ├── admin.js           # Dashboard admin
│   │   └── product-detail.js  # Detail produk
│   └── images/
│       └── README.md          # Panduan gambar
└── README.md                  # Dokumentasi ini
```

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Struktur semantik dan modern
- **CSS3** - Styling dengan custom properties, flexbox, dan grid
- **Vanilla JavaScript** - Functionality tanpa framework eksternal
- **Font Awesome** - Icon library untuk UI yang menarik
- **LocalStorage** - Penyimpanan data lokal untuk keranjang dan session

## 🎨 Tema Desain

### Pallet Warna
- **Primary**: #8B4513 (Saddle Brown)
- **Secondary**: #D2691E (Chocolate)  
- **Accent**: #DEB887 (Burlywood)
- **Success**: #28a745 (Green)
- **Warning**: #ffc107 (Amber)
- **Danger**: #dc3545 (Red)
- **Info**: #17a2b8 (Cyan)

### Tipografi
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headings**: Font weight 600-700
- **Body Text**: Font weight 400
- **Accent Text**: Font weight 500

## 🚀 Cara Menjalankan

### 1. Setup Lokal
```bash
# Clone atau download project
# Tempatkan di folder web server (htdocs untuk XAMPP)
cp -r kedaikopi /xampp/htdocs/

# Akses melalui browser
http://localhost/kedaikopi
```

### 2. Live Server (VS Code)
```bash
# Install Live Server extension di VS Code
# Klik kanan pada index.html > Open with Live Server
```

### 3. Server Statis Lainnya
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

## 👥 Demo Akun

### Pengguna
- **Email**: user@example.com
- **Password**: password123

### Admin
- **Username**: admin
- **Password**: admin123

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Laptop**: 992px - 1199px
- **Tablet**: 768px - 991px
- **Mobile Large**: 576px - 767px
- **Mobile**: < 576px

## 🔧 Kustomisasi

### Mengubah Warna Tema
Edit variabel CSS di `assets/css/style.css`:
```css
:root {
    --primary-color: #8B4513;
    --secondary-color: #D2691E;
    --accent-color: #DEB887;
    /* ... */
}
```

### Menambah Produk
Edit array `products` di `assets/js/script.js`:
```javascript
const products = [
    {
        id: 1,
        name: 'Nama Produk',
        category: 'kategori',
        price: 50000,
        image: 'path/to/image.jpg',
        description: 'Deskripsi produk'
    }
    // ...
];
```

### Konfigurasi Toko
Edit pengaturan di `assets/js/admin.js` bagian `loadSettingsData()`.

## 📋 TODO / Pengembangan Selanjutnya

- [ ] Integrasi dengan payment gateway (Midtrans, etc.)
- [ ] Sistem notifikasi real-time
- [ ] Chat customer support
- [ ] Wishlist functionality
- [ ] Product comparison
- [ ] Multi-language support
- [ ] SEO optimization
- [ ] PWA features
- [ ] Advanced analytics
- [ ] Email notifications

## 🐛 Troubleshooting

### Gambar Tidak Muncul
- Pastikan path gambar sudah benar
- Gunakan placeholder: `assets/images/placeholder.jpg`
- Atau gunakan URL placeholder: `https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Kedai+Kopi`

### JavaScript Error
- Buka Developer Tools (F12)
- Periksa Console untuk error
- Pastikan semua file JS di-load dengan benar

### Responsive Issues
- Test di berbagai ukuran layar
- Gunakan Chrome DevTools untuk simulasi device
- Periksa media queries di CSS

## 📞 Support

Jika ada pertanyaan atau masalah:
- Email: support@kedaikopi.com
- WhatsApp: +62 812-3456-7890

## 📄 License

Copyright © 2025 Kedai Kopi. All rights reserved.

---

**Dibuat dengan ❤️ untuk pecinta kopi Indonesia**
