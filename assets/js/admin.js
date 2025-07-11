// ====== ADMIN DASHBOARD FUNCTIONALITY ======

// Global variables
let currentAdminSection = 'dashboard';
let products = [];
let orders = [];
let customers = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

// ====== INITIALIZATION ======
function initializeAdmin() {
    // Check if admin is logged in
    const savedAdmin = localStorage.getItem('kedaikopi_admin');
    if (!savedAdmin) {
        alert('Akses tidak sah! Silakan login sebagai admin.');
        window.location.href = 'admin-login.html';
        return;
    }
    
    loadAdminData();
    setupAdminEventListeners();
    loadDashboardStats();
    loadSampleData();
}

// ====== EVENT LISTENERS ======
function setupAdminEventListeners() {
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
    
    // Search functionality
    setupSearchFilters();
}

function setupSearchFilters() {
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const section = this.closest('.admin-section').id;
            filterData(section, this.value);
        });
    });
    
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            const section = this.closest('.admin-section').id;
            filterDataByCategory(section, this.value);
        });
    });
}

// ====== LOAD ADMIN DATA ======
function loadAdminData() {
    const savedAdmin = localStorage.getItem('kedaikopi_admin');
    if (!savedAdmin) return;
    
    const admin = JSON.parse(savedAdmin);
    
    // Update admin info in navbar
    const adminNameElements = document.querySelectorAll('.admin-profile span');
    adminNameElements.forEach(element => {
        if (!element.classList.contains('notification-count')) {
            element.textContent = admin.name || 'Administrator';
        }
    });
}

// ====== LOAD SAMPLE DATA ======
function loadSampleData() {
    // Sample products
    products = [
        {
            id: 1,
            name: 'Kopi Arabica Premium',
            category: 'kopi-bubuk',
            price: 85000,
            stock: 50,
            status: 'active',
            image: 'assets/images/arabica-premium.jpg',
            description: 'Kopi arabica premium dengan cita rasa yang halus.'
        },
        {
            id: 2,
            name: 'Kopi Robusta Asli',
            category: 'kopi-bubuk',
            price: 65000,
            stock: 30,
            status: 'active',
            image: 'assets/images/robusta-asli.jpg',
            description: 'Kopi robusta dengan karakteristik rasa yang kuat.'
        },
        {
            id: 3,
            name: 'Biji Kopi Luwak',
            category: 'kopi-biji',
            price: 250000,
            stock: 10,
            status: 'active',
            image: 'assets/images/kopi-luwak.jpg',
            description: 'Biji kopi luwak asli dengan proses fermentasi alami.'
        },
        {
            id: 4,
            name: 'French Press',
            category: 'alat-seduh',
            price: 150000,
            stock: 25,
            status: 'active',
            image: 'assets/images/french-press.jpg',
            description: 'Alat seduh French Press berkualitas tinggi.'
        }
    ];
    
    // Sample orders
    orders = [
        {
            id: 'KK20250001',
            customer: 'John Doe',
            email: 'john@example.com',
            date: '2025-01-10',
            total: 185000,
            status: 'pending',
            payment: 'bank-transfer'
        },
        {
            id: 'KK20250002',
            customer: 'Jane Smith',
            email: 'jane@example.com',
            date: '2025-01-09',
            total: 95000,
            status: 'processing',
            payment: 'e-wallet'
        },
        {
            id: 'KK20250003',
            customer: 'Bob Johnson',
            email: 'bob@example.com',
            date: '2025-01-08',
            total: 275000,
            status: 'shipped',
            payment: 'cod'
        }
    ];
    
    // Sample customers
    customers = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+62 812-3456-7890',
            joinDate: '2024-12-15',
            totalOrders: 5,
            totalSpent: 485000
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+62 813-4567-8901',
            joinDate: '2024-11-20',
            totalOrders: 3,
            totalSpent: 275000
        }
    ];
}

// ====== SHOW ADMIN SECTION ======
function showAdminSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all menu items
    document.querySelectorAll('.admin-menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Add active class to selected menu item
    const selectedMenuItem = document.querySelector(`[onclick="showAdminSection('${sectionId}')"]`);
    if (selectedMenuItem) {
        selectedMenuItem.classList.add('active');
    }
    
    currentAdminSection = sectionId;
    
    // Load section-specific data
    switch (sectionId) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'products':
            loadProductsTable();
            break;
        case 'orders':
            loadOrdersTable();
            break;
        case 'customers':
            loadCustomersTable();
            break;
        case 'payments':
            loadPaymentsData();
            break;
        case 'reports':
            loadReportsData();
            break;
        case 'content':
            loadContentData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// ====== LOAD DASHBOARD STATS ======
function loadDashboardStats() {
    // Calculate stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalProducts = products.length;
    const totalCustomers = customers.length;
    
    // Update stat cards
    updateStatCard(0, totalOrders, '+12% dari bulan lalu', 'positive');
    updateStatCard(1, `Rp ${formatPrice(totalRevenue)}`, '+8% dari bulan lalu', 'positive');
    updateStatCard(2, totalProducts, 'Tidak ada perubahan', 'neutral');
    updateStatCard(3, totalCustomers, '+15% dari bulan lalu', 'positive');
    
    // Load recent orders
    loadRecentOrdersAdmin();
}

function updateStatCard(index, value, change, changeType) {
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[index]) {
        const valueElement = statCards[index].querySelector('h3');
        const changeElement = statCards[index].querySelector('.stat-change');
        
        if (valueElement) valueElement.textContent = value;
        if (changeElement) {
            changeElement.textContent = change;
            changeElement.className = `stat-change ${changeType}`;
        }
    }
}

function loadRecentOrdersAdmin() {
    const recentOrdersContainer = document.querySelector('.recent-orders');
    if (!recentOrdersContainer) return;
    
    const recentOrders = orders.slice(0, 5);
    
    recentOrdersContainer.innerHTML = `
        <h4>Pesanan Terbaru</h4>
        <div class="recent-orders-list">
            ${recentOrders.map(order => `
                <div class="recent-order-item">
                    <div class="order-info">
                        <strong>#${order.id}</strong>
                        <span>${order.customer}</span>
                    </div>
                    <div class="order-amount">Rp ${formatPrice(order.total)}</div>
                    <div class="order-status ${getStatusClass(order.status)}">${getStatusText(order.status)}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// ====== LOAD PRODUCTS TABLE ======
function loadProductsTable() {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="product-image-cell">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
                </div>
            </td>
            <td>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
            </td>
            <td>${getCategoryName(product.category)}</td>
            <td>Rp ${formatPrice(product.price)}</td>
            <td>${product.stock}</td>
            <td>
                <span class="status-badge ${product.status === 'active' ? 'status-active' : 'status-inactive'}">
                    ${product.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id})" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ====== LOAD ORDERS TABLE ======
function loadOrdersTable() {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>#${order.id}</strong></td>
            <td>
                <div class="customer-info">
                    <div class="customer-name">${order.customer}</div>
                    <div class="customer-email">${order.email}</div>
                </div>
            </td>
            <td>${new Date(order.date).toLocaleDateString('id-ID')}</td>
            <td>Rp ${formatPrice(order.total)}</td>
            <td>
                <span class="status-badge ${getStatusClass(order.status)}">
                    ${getStatusText(order.status)}
                </span>
            </td>
            <td>${getPaymentMethodName(order.payment)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-view" onclick="viewOrder('${order.id}')" title="Lihat">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon btn-edit" onclick="updateOrderStatus('${order.id}')" title="Update Status">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// ====== LOAD CUSTOMERS TABLE ======
function loadCustomersTable() {
    const customersSection = document.getElementById('customers');
    if (!customersSection) return;
    
    customersSection.innerHTML = `
        <div class="admin-header">
            <h1>Manajemen Pelanggan</h1>
            <div class="header-actions">
                <button class="btn btn-outline" onclick="exportCustomers()">
                    <i class="fas fa-download"></i> Export
                </button>
            </div>
        </div>
        
        <div class="customers-filters">
            <input type="text" placeholder="Cari pelanggan..." class="search-input">
            <select class="filter-select">
                <option value="">Semua Pelanggan</option>
                <option value="new">Pelanggan Baru</option>
                <option value="regular">Pelanggan Reguler</option>
                <option value="vip">Pelanggan VIP</option>
            </select>
        </div>
        
        <div class="admin-table-container">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Telepon</th>
                        <th>Bergabung</th>
                        <th>Total Pesanan</th>
                        <th>Total Pengeluaran</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    ${customers.map(customer => `
                        <tr>
                            <td>${customer.id}</td>
                            <td>${customer.name}</td>
                            <td>${customer.email}</td>
                            <td>${customer.phone}</td>
                            <td>${new Date(customer.joinDate).toLocaleDateString('id-ID')}</td>
                            <td>${customer.totalOrders}</td>
                            <td>Rp ${formatPrice(customer.totalSpent)}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-icon btn-view" onclick="viewCustomer(${customer.id})" title="Lihat">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn-icon btn-edit" onclick="editCustomer(${customer.id})" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ====== PRODUCT MODAL FUNCTIONS ======
function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('productModalTitle');
    const form = document.getElementById('productForm');
    
    if (!modal || !form) return;
    
    if (productId) {
        // Edit mode
        const product = products.find(p => p.id === productId);
        if (product) {
            modalTitle.textContent = 'Edit Produk';
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productStatus').value = product.status;
            
            form.setAttribute('data-edit-id', productId);
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Tambah Produk';
        form.reset();
        form.removeAttribute('data-edit-id');
    }
    
    modal.classList.add('active');
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const editId = e.target.getAttribute('data-edit-id');
    
    const productData = {
        id: editId ? parseInt(editId) : Date.now(),
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseInt(formData.get('price')),
        description: formData.get('description'),
        stock: parseInt(formData.get('stock')),
        status: formData.get('status'),
        image: 'assets/images/placeholder.jpg' // In real app, handle file upload
    };
    
    if (editId) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(editId));
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            showNotification('Produk berhasil diperbarui!', 'success');
        }
    } else {
        // Add new product
        products.push(productData);
        showNotification('Produk berhasil ditambahkan!', 'success');
    }
    
    closeProductModal();
    loadProductsTable();
}

// ====== PRODUCT ACTIONS ======
function editProduct(productId) {
    openProductModal(productId);
}

function deleteProduct(productId) {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
            showNotification('Produk berhasil dihapus!', 'info');
            loadProductsTable();
        }
    }
}

// ====== ORDER ACTIONS ======
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        alert(`Detail Pesanan ${orderId}:\nPelanggan: ${order.customer}\nTotal: Rp ${formatPrice(order.total)}\nStatus: ${getStatusText(order.status)}`);
    }
}

function updateOrderStatus(orderId) {
    const newStatus = prompt('Masukkan status baru (pending/processing/shipped/delivered/cancelled):');
    if (newStatus && ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            showNotification('Status pesanan berhasil diperbarui!', 'success');
            loadOrdersTable();
        }
    } else if (newStatus) {
        showNotification('Status tidak valid!', 'error');
    }
}

// ====== CUSTOMER ACTIONS ======
function viewCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
        alert(`Detail Pelanggan:\nNama: ${customer.name}\nEmail: ${customer.email}\nTotal Pesanan: ${customer.totalOrders}\nTotal Pengeluaran: Rp ${formatPrice(customer.totalSpent)}`);
    }
}

function editCustomer(customerId) {
    showNotification('Fitur edit pelanggan akan segera tersedia!', 'info');
}

// ====== FILTER FUNCTIONS ======
function filterData(section, query) {
    // Implement search functionality
    console.log(`Searching in ${section} for: ${query}`);
}

function filterDataByCategory(section, category) {
    // Implement filter functionality
    console.log(`Filtering ${section} by category: ${category}`);
}

// ====== EXPORT FUNCTIONS ======
function exportOrders() {
    showNotification('Export pesanan akan segera tersedia!', 'info');
}

function exportCustomers() {
    showNotification('Export pelanggan akan segera tersedia!', 'info');
}

// ====== PLACEHOLDER DATA LOADERS ======
function loadPaymentsData() {
    const paymentsSection = document.getElementById('payments');
    if (paymentsSection) {
        paymentsSection.innerHTML = `
            <div class="admin-header">
                <h1>Konfirmasi Pembayaran</h1>
            </div>
            <div class="payments-pending">
                <h3>Pembayaran Menunggu Konfirmasi</h3>
                <div class="payment-list">
                    <div class="payment-item">
                        <div class="payment-info">
                            <strong>Pesanan #KK20250001</strong>
                            <p>John Doe - Rp 185.000</p>
                            <p>Transfer Bank BCA</p>
                        </div>
                        <div class="payment-actions">
                            <button class="btn btn-success" onclick="approvePayment('KK20250001')">Setujui</button>
                            <button class="btn btn-danger" onclick="rejectPayment('KK20250001')">Tolak</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

function loadReportsData() {
    const reportsSection = document.getElementById('reports');
    if (reportsSection) {
        reportsSection.innerHTML = `
            <div class="admin-header">
                <h1>Laporan Penjualan</h1>
                <div class="header-actions">
                    <select class="filter-select">
                        <option value="daily">Harian</option>
                        <option value="weekly">Mingguan</option>
                        <option value="monthly" selected>Bulanan</option>
                        <option value="yearly">Tahunan</option>
                    </select>
                </div>
            </div>
            <div class="reports-grid">
                <div class="report-card">
                    <h3>Penjualan Bulan Ini</h3>
                    <div class="report-value">Rp 15.250.000</div>
                    <div class="report-change positive">+12% dari bulan lalu</div>
                </div>
                <div class="report-card">
                    <h3>Produk Terlaris</h3>
                    <div class="report-value">Kopi Arabica Premium</div>
                    <div class="report-change">42 terjual</div>
                </div>
                <div class="report-card">
                    <h3>Pelanggan Baru</h3>
                    <div class="report-value">156</div>
                    <div class="report-change positive">+25% dari bulan lalu</div>
                </div>
            </div>
        `;
    }
}

function loadContentData() {
    const contentSection = document.getElementById('content');
    if (contentSection) {
        contentSection.innerHTML = `
            <div class="admin-header">
                <h1>Manajemen Konten</h1>
                <button class="btn btn-primary" onclick="addBanner()">Tambah Banner</button>
            </div>
            <div class="content-tabs">
                <button class="tab-btn active" onclick="showContentTab('banners')">Banner</button>
                <button class="tab-btn" onclick="showContentTab('promos')">Promo</button>
                <button class="tab-btn" onclick="showContentTab('pages')">Halaman</button>
            </div>
            <div class="content-tab-content">
                <div id="banners" class="tab-content active">
                    <p>Kelola banner dan slider di halaman utama</p>
                </div>
                <div id="promos" class="tab-content">
                    <p>Kelola promo dan penawaran khusus</p>
                </div>
                <div id="pages" class="tab-content">
                    <p>Kelola konten halaman statis</p>
                </div>
            </div>
        `;
    }
}

function loadSettingsData() {
    const settingsSection = document.getElementById('settings');
    if (settingsSection) {
        settingsSection.innerHTML = `
            <div class="admin-header">
                <h1>Pengaturan Sistem</h1>
            </div>
            <div class="settings-grid">
                <div class="setting-group">
                    <h3>Pengaturan Toko</h3>
                    <div class="setting-item">
                        <label>Nama Toko</label>
                        <input type="text" value="Kedai Kopi" class="form-control">
                    </div>
                    <div class="setting-item">
                        <label>Email Toko</label>
                        <input type="email" value="info@kedaikopi.com" class="form-control">
                    </div>
                    <div class="setting-item">
                        <label>Telepon Toko</label>
                        <input type="tel" value="+62 812-3456-7890" class="form-control">
                    </div>
                </div>
                <div class="setting-group">
                    <h3>Pengaturan Pengiriman</h3>
                    <div class="setting-item">
                        <label>Ongkir Default</label>
                        <input type="number" value="15000" class="form-control">
                    </div>
                    <div class="setting-item">
                        <label>Minimal Gratis Ongkir</label>
                        <input type="number" value="200000" class="form-control">
                    </div>
                </div>
            </div>
            <button class="btn btn-primary" onclick="saveSettings()">Simpan Pengaturan</button>
        `;
    }
}

// ====== UTILITY FUNCTIONS ======
function getCategoryName(category) {
    const categories = {
        'kopi-bubuk': 'Kopi Bubuk',
        'kopi-biji': 'Kopi Biji',
        'kopi-instan': 'Kopi Instan',
        'alat-seduh': 'Alat Seduh'
    };
    return categories[category] || category;
}

function getStatusClass(status) {
    const statusClasses = {
        'pending': 'status-pending',
        'processing': 'status-processing',
        'shipped': 'status-shipped',
        'delivered': 'status-delivered',
        'cancelled': 'status-cancelled'
    };
    return statusClasses[status] || 'status-pending';
}

function getStatusText(status) {
    const statusTexts = {
        'pending': 'Menunggu',
        'processing': 'Diproses',
        'shipped': 'Dikirim',
        'delivered': 'Selesai',
        'cancelled': 'Dibatalkan'
    };
    return statusTexts[status] || 'Tidak Diketahui';
}

function getPaymentMethodName(method) {
    const methods = {
        'bank-transfer': 'Transfer Bank',
        'e-wallet': 'E-Wallet',
        'cod': 'COD'
    };
    return methods[method] || method;
}

function formatPrice(price) {
    return price.toLocaleString('id-ID');
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border-left: 4px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'info'}-color);
        z-index: 1000;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function adminLogout() {
    if (confirm('Apakah Anda yakin ingin keluar dari dashboard admin?')) {
        localStorage.removeItem('kedaikopi_admin');
        window.location.href = 'admin-login.html';
    }
}

// ====== EXPORT FUNCTIONS ======
window.showAdminSection = showAdminSection;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.viewOrder = viewOrder;
window.updateOrderStatus = updateOrderStatus;
window.viewCustomer = viewCustomer;
window.editCustomer = editCustomer;
window.exportOrders = exportOrders;
window.exportCustomers = exportCustomers;
window.adminLogout = adminLogout;
