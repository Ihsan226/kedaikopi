// ====== ACCOUNT PAGE FUNCTIONALITY ======

// Global variables
let currentSection = 'dashboard';
let userOrders = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAccount();
});

// ====== INITIALIZATION ======
function initializeAccount() {
    // Check if user is logged in
    const savedUser = localStorage.getItem('kedaikopi_user');
    if (!savedUser) {
        alert('Anda harus login terlebih dahulu!');
        window.location.href = 'login.html';
        return;
    }
    
    loadUserData();
    loadUserOrders();
    setupAccountEventListeners();
    loadDashboardData();
}

// ====== EVENT LISTENERS ======
function setupAccountEventListeners() {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Avatar upload
    const editAvatarButton = document.querySelector('.edit-avatar');
    if (editAvatarButton) {
        editAvatarButton.addEventListener('click', handleAvatarUpload);
    }
}

// ====== LOAD USER DATA ======
function loadUserData() {
    const savedUser = localStorage.getItem('kedaikopi_user');
    if (!savedUser) return;
    
    const user = JSON.parse(savedUser);
    
    // Update user info in sidebar
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (userNameElement) {
        userNameElement.textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'User';
    }
    
    if (userEmailElement) {
        userEmailElement.textContent = user.email || '';
    }
    
    // Prefill profile form
    prefillProfileForm(user);
}

// ====== PREFILL PROFILE FORM ======
function prefillProfileForm(user) {
    const fields = {
        'profileFirstName': user.firstName || user.name?.split(' ')[0] || '',
        'profileLastName': user.lastName || user.name?.split(' ')[1] || '',
        'profileEmail': user.email || '',
        'profilePhone': user.phone || '',
        'profileBirth': user.birthDate || '',
        'profileGender': user.gender || 'male'
    };
    
    Object.keys(fields).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = fields[fieldId];
        }
    });
}

// ====== LOAD USER ORDERS ======
function loadUserOrders() {
    const savedOrders = localStorage.getItem('user_orders');
    userOrders = savedOrders ? JSON.parse(savedOrders) : [];
    
    // Sort by date (newest first)
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// ====== SHOW SECTION ======
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Add active class to selected menu item
    const selectedMenuItem = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if (selectedMenuItem) {
        selectedMenuItem.classList.add('active');
    }
    
    currentSection = sectionId;
    
    // Load section-specific data
    switch (sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'orders':
            loadOrdersData();
            break;
        case 'profile':
            // Profile data already loaded
            break;
        case 'addresses':
            loadAddressesData();
            break;
        case 'payments':
            loadPaymentsData();
            break;
        case 'wishlist':
            loadWishlistData();
            break;
        case 'settings':
            loadSettingsData();
            break;
    }
}

// ====== LOAD DASHBOARD DATA ======
function loadDashboardData() {
    // Update stats
    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((sum, order) => sum + (order.payment?.total || 0), 0);
    const favoriteProducts = 8; // Placeholder
    const averageRating = 4.8; // Placeholder
    
    // Update stat cards
    updateStatCard(0, totalOrders);
    updateStatCard(1, `Rp ${formatPrice(totalSpent)}`);
    updateStatCard(2, favoriteProducts);
    updateStatCard(3, averageRating);
    
    // Load recent orders
    loadRecentOrders();
}

function updateStatCard(index, value) {
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[index]) {
        const valueElement = statCards[index].querySelector('h3');
        if (valueElement) {
            valueElement.textContent = value;
        }
    }
}

function loadRecentOrders() {
    const recentOrdersContainer = document.querySelector('.recent-orders .orders-list');
    if (!recentOrdersContainer) return;
    
    const recentOrders = userOrders.slice(0, 3);
    
    if (recentOrders.length === 0) {
        recentOrdersContainer.innerHTML = `
            <div class="no-orders">
                <p>Belum ada pesanan</p>
                <a href="index.html#products" class="btn btn-primary">Mulai Belanja</a>
            </div>
        `;
        return;
    }
    
    recentOrdersContainer.innerHTML = '';
    
    recentOrders.forEach(order => {
        const orderElement = createOrderSummaryElement(order);
        recentOrdersContainer.appendChild(orderElement);
    });
}

// ====== LOAD ORDERS DATA ======
function loadOrdersData() {
    const ordersContainer = document.getElementById('ordersContainer');
    if (!ordersContainer) return;
    
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-box-open"></i>
                <h3>Belum ada pesanan</h3>
                <p>Anda belum memiliki pesanan. Mulai berbelanja sekarang!</p>
                <a href="index.html#products" class="btn btn-primary">Mulai Belanja</a>
            </div>
        `;
        return;
    }
    
    ordersContainer.innerHTML = '';
    
    userOrders.forEach(order => {
        const orderElement = createDetailedOrderElement(order);
        ordersContainer.appendChild(orderElement);
    });
}

// ====== CREATE ORDER ELEMENTS ======
function createOrderSummaryElement(order) {
    const orderElement = document.createElement('div');
    orderElement.className = 'order-summary-item';
    
    const orderDate = new Date(order.createdAt).toLocaleDateString('id-ID');
    const statusClass = getStatusClass(order.status);
    const statusText = getStatusText(order.status);
    
    orderElement.innerHTML = `
        <div class="order-summary-header">
            <div class="order-id">#${order.id}</div>
            <div class="order-status ${statusClass}">${statusText}</div>
        </div>
        <div class="order-summary-details">
            <div class="order-date">${orderDate}</div>
            <div class="order-total">Rp ${formatPrice(order.payment.total)}</div>
        </div>
        <div class="order-items-preview">
            ${order.items.slice(0, 2).map(item => `<span class="item-name">${item.name}</span>`).join(', ')}
            ${order.items.length > 2 ? ` dan ${order.items.length - 2} lainnya` : ''}
        </div>
    `;
    
    return orderElement;
}

function createDetailedOrderElement(order) {
    const orderElement = document.createElement('div');
    orderElement.className = 'order-detail-item';
    
    const orderDate = new Date(order.createdAt).toLocaleDateString('id-ID');
    const statusClass = getStatusClass(order.status);
    const statusText = getStatusText(order.status);
    
    orderElement.innerHTML = `
        <div class="order-header">
            <div class="order-info">
                <h3>Pesanan #${order.id}</h3>
                <p>Tanggal: ${orderDate}</p>
            </div>
            <div class="order-status ${statusClass}">${statusText}</div>
        </div>
        
        <div class="order-items">
            ${order.items.map(item => `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/placeholder.jpg'">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>Qty: ${item.quantity} × Rp ${formatPrice(item.price)}</p>
                    </div>
                    <div class="item-total">Rp ${formatPrice(item.price * item.quantity)}</div>
                </div>
            `).join('')}
        </div>
        
        <div class="order-summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>Rp ${formatPrice(order.payment.subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Ongkir:</span>
                <span>Rp ${formatPrice(order.payment.shipping)}</span>
            </div>
            <div class="summary-row">
                <span>Pajak:</span>
                <span>Rp ${formatPrice(order.payment.tax)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>Rp ${formatPrice(order.payment.total)}</span>
            </div>
        </div>
        
        <div class="order-actions">
            ${getOrderActions(order)}
        </div>
    `;
    
    return orderElement;
}

// ====== ORDER STATUS HELPERS ======
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

function getOrderActions(order) {
    const actions = [];
    
    switch (order.status) {
        case 'pending':
            actions.push(`<button class="btn btn-outline" onclick="cancelOrder('${order.id}')">Batalkan</button>`);
            actions.push(`<button class="btn btn-primary" onclick="uploadPaymentProof('${order.id}')">Upload Bukti</button>`);
            break;
        case 'processing':
            actions.push(`<button class="btn btn-outline" onclick="trackOrder('${order.id}')">Lacak Pesanan</button>`);
            break;
        case 'shipped':
            actions.push(`<button class="btn btn-outline" onclick="trackOrder('${order.id}')">Lacak Pesanan</button>`);
            actions.push(`<button class="btn btn-primary" onclick="confirmDelivery('${order.id}')">Konfirmasi Terima</button>`);
            break;
        case 'delivered':
            actions.push(`<button class="btn btn-outline" onclick="reviewOrder('${order.id}')">Beri Ulasan</button>`);
            actions.push(`<button class="btn btn-primary" onclick="reorderItems('${order.id}')">Pesan Lagi</button>`);
            break;
    }
    
    actions.push(`<button class="btn btn-outline" onclick="viewOrderDetails('${order.id}')">Detail</button>`);
    
    return actions.join('');
}

// ====== FILTER ORDERS ======
function filterOrders(status) {
    let filteredOrders = userOrders;
    
    if (status !== 'all') {
        filteredOrders = userOrders.filter(order => order.status === status);
    }
    
    // Update filter buttons
    document.querySelectorAll('.orders-filter .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="filterOrders('${status}')"]`).classList.add('active');
    
    // Update orders display
    const ordersContainer = document.getElementById('ordersContainer');
    if (!ordersContainer) return;
    
    ordersContainer.innerHTML = '';
    
    if (filteredOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="no-orders">
                <p>Tidak ada pesanan dengan status ${status === 'all' ? 'apapun' : getStatusText(status)}</p>
            </div>
        `;
        return;
    }
    
    filteredOrders.forEach(order => {
        const orderElement = createDetailedOrderElement(order);
        ordersContainer.appendChild(orderElement);
    });
}

// ====== ORDER ACTIONS ======
function cancelOrder(orderId) {
    if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
        // Update order status
        const orderIndex = userOrders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            userOrders[orderIndex].status = 'cancelled';
            localStorage.setItem('user_orders', JSON.stringify(userOrders));
            localStorage.setItem(`order_${orderId}`, JSON.stringify(userOrders[orderIndex]));
            
            showNotification('Pesanan berhasil dibatalkan!', 'info');
            loadOrdersData();
        }
    }
}

function uploadPaymentProof(orderId) {
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // Simulate upload
            showNotification('Bukti pembayaran berhasil diupload! Pesanan akan segera diproses.', 'success');
            
            // Update order status
            const orderIndex = userOrders.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                userOrders[orderIndex].status = 'processing';
                userOrders[orderIndex].paymentProof = URL.createObjectURL(file);
                localStorage.setItem('user_orders', JSON.stringify(userOrders));
                localStorage.setItem(`order_${orderId}`, JSON.stringify(userOrders[orderIndex]));
                
                loadOrdersData();
            }
        }
    };
    fileInput.click();
}

function trackOrder(orderId) {
    showNotification('Fitur pelacakan pesanan akan segera tersedia!', 'info');
}

function confirmDelivery(orderId) {
    if (confirm('Konfirmasi bahwa Anda telah menerima pesanan ini?')) {
        const orderIndex = userOrders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            userOrders[orderIndex].status = 'delivered';
            userOrders[orderIndex].deliveredAt = new Date().toISOString();
            localStorage.setItem('user_orders', JSON.stringify(userOrders));
            localStorage.setItem(`order_${orderId}`, JSON.stringify(userOrders[orderIndex]));
            
            showNotification('Pesanan dikonfirmasi telah diterima!', 'success');
            loadOrdersData();
        }
    }
}

function reviewOrder(orderId) {
    showNotification('Fitur review akan segera tersedia!', 'info');
}

function reorderItems(orderId) {
    const order = userOrders.find(order => order.id === orderId);
    if (order) {
        // Add items to cart
        const currentCart = JSON.parse(localStorage.getItem('kedaikopi_cart') || '[]');
        
        order.items.forEach(item => {
            const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                currentCart.push({...item});
            }
        });
        
        localStorage.setItem('kedaikopi_cart', JSON.stringify(currentCart));
        showNotification('Produk berhasil ditambahkan ke keranjang!', 'success');
        
        // Update cart count
        updateCartCount();
    }
}

function viewOrderDetails(orderId) {
    window.location.href = `order-details.html?orderId=${orderId}`;
}

// ====== HANDLE PROFILE UPDATE ======
function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Get current user data
    const savedUser = localStorage.getItem('kedaikopi_user');
    const user = savedUser ? JSON.parse(savedUser) : {};
    
    // Update user data
    const updatedUser = {
        ...user,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phone: formData.get('phone'),
        birthDate: formData.get('birthDate'),
        gender: formData.get('gender'),
        updatedAt: new Date().toISOString()
    };
    
    // Save updated data
    localStorage.setItem('kedaikopi_user', JSON.stringify(updatedUser));
    
    showNotification('Profil berhasil diperbarui!', 'success');
    loadUserData();
}

// ====== HANDLE AVATAR UPLOAD ======
function handleAvatarUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const avatarImg = document.querySelector('.profile-avatar img');
                if (avatarImg) {
                    avatarImg.src = e.target.result;
                }
                
                // Save to user data
                const savedUser = localStorage.getItem('kedaikopi_user');
                const user = savedUser ? JSON.parse(savedUser) : {};
                user.avatar = e.target.result;
                localStorage.setItem('kedaikopi_user', JSON.stringify(user));
                
                showNotification('Avatar berhasil diperbarui!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    fileInput.click();
}

// ====== PLACEHOLDER DATA LOADERS ======
function loadAddressesData() {
    const addressesSection = document.getElementById('addresses');
    if (addressesSection) {
        addressesSection.innerHTML = `
            <div class="admin-header">
                <h1>Alamat Saya</h1>
                <button class="btn btn-primary" onclick="addNewAddress()">Tambah Alamat</button>
            </div>
            <div class="addresses-list">
                <div class="address-card">
                    <div class="address-info">
                        <h4>Alamat Utama</h4>
                        <p>Jl. Contoh No. 123, Jakarta Selatan</p>
                        <p>Telepon: +62 812-3456-7890</p>
                    </div>
                    <div class="address-actions">
                        <button class="btn btn-outline" onclick="editAddress(1)">Edit</button>
                        <button class="btn btn-outline" onclick="deleteAddress(1)">Hapus</button>
                    </div>
                </div>
            </div>
        `;
    }
}

function loadPaymentsData() {
    const paymentsSection = document.getElementById('payments');
    if (paymentsSection) {
        paymentsSection.innerHTML = `
            <div class="admin-header">
                <h1>Metode Pembayaran</h1>
                <button class="btn btn-primary" onclick="addPaymentMethod()">Tambah Metode</button>
            </div>
            <p>Kelola metode pembayaran favorit Anda untuk checkout yang lebih cepat.</p>
        `;
    }
}

function loadWishlistData() {
    const wishlistSection = document.getElementById('wishlist');
    if (wishlistSection) {
        wishlistSection.innerHTML = `
            <div class="admin-header">
                <h1>Wishlist</h1>
            </div>
            <p>Produk yang Anda simpan untuk dibeli nanti akan muncul di sini.</p>
        `;
    }
}

function loadSettingsData() {
    const settingsSection = document.getElementById('settings');
    if (settingsSection) {
        settingsSection.innerHTML = `
            <div class="admin-header">
                <h1>Pengaturan Akun</h1>
            </div>
            <div class="settings-grid">
                <div class="setting-item">
                    <h4>Notifikasi Email</h4>
                    <label class="toggle-switch">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <h4>Notifikasi Push</h4>
                    <label class="toggle-switch">
                        <input type="checkbox">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <h4>Newsletter</h4>
                    <label class="toggle-switch">
                        <input type="checkbox" checked>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        `;
    }
}

// ====== UTILITY FUNCTIONS ======
function formatPrice(price) {
    return price.toLocaleString('id-ID');
}

function updateCartCount() {
    const savedCart = localStorage.getItem('kedaikopi_cart');
    const cartItems = savedCart ? JSON.parse(savedCart) : [];
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'flex' : 'none';
    });
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

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        localStorage.removeItem('kedaikopi_user');
        window.location.href = 'index.html';
    }
}

// ====== EXPORT FUNCTIONS ======
window.showSection = showSection;
window.filterOrders = filterOrders;
window.cancelOrder = cancelOrder;
window.uploadPaymentProof = uploadPaymentProof;
window.trackOrder = trackOrder;
window.confirmDelivery = confirmDelivery;
window.reviewOrder = reviewOrder;
window.reorderItems = reorderItems;
window.viewOrderDetails = viewOrderDetails;
window.logout = logout;
