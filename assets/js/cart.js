// ====== CART PAGE FUNCTIONALITY ======

// Global variables
let currentDiscount = 0;
let shippingCost = 15000;
let taxRate = 0.11;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
});

// ====== INITIALIZATION ======
function initializeCart() {
    loadCartItems();
    updateCartSummary();
    loadRelatedProducts();
    setupCartEventListeners();
}

// ====== EVENT LISTENERS ======
function setupCartEventListeners() {
    // Quantity change events will be attached dynamically
    
    // Promo code application
    const promoButton = document.querySelector('[onclick="applyPromo()"]');
    if (promoButton) {
        const promoInput = document.getElementById('promoCode');
        if (promoInput) {
            promoInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    applyPromo();
                }
            });
        }
    }
}

// ====== LOAD CART ITEMS ======
function loadCartItems() {
    const cartList = document.getElementById('cartList');
    const cartEmpty = document.getElementById('cartEmpty');
    
    if (!cartList) return;
    
    // Get cart items from localStorage
    const savedCart = localStorage.getItem('kedaikopi_cart');
    const cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    if (cartItems.length === 0) {
        cartList.style.display = 'none';
        if (cartEmpty) cartEmpty.style.display = 'block';
        return;
    }
    
    cartList.style.display = 'block';
    if (cartEmpty) cartEmpty.style.display = 'none';
    
    cartList.innerHTML = '';
    
    cartItems.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartList.appendChild(cartItemElement);
    });
}

// ====== CREATE CART ITEM ELEMENT ======
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-id', item.id);
    
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/placeholder.jpg'">
        </div>
        <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>${getCategoryName(item.category)}</p>
            <p class="item-description">${item.description}</p>
        </div>
        <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">
                <i class="fas fa-minus"></i>
            </button>
            <input type="number" class="quantity-input" value="${item.quantity}" 
                   min="1" max="${item.stock}" 
                   onchange="updateItemQuantity(${item.id}, this.value)">
            <button class="quantity-btn" onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <div class="cart-item-price">
            <span class="item-total">Rp ${formatPrice(item.price * item.quantity)}</span>
            <span class="item-unit-price">Rp ${formatPrice(item.price)} / item</span>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})" title="Hapus item">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    return cartItem;
}

// ====== UPDATE ITEM QUANTITY ======
function updateItemQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) {
        if (confirm('Hapus item ini dari keranjang?')) {
            removeFromCart(productId);
        }
        return;
    }
    
    // Get current cart
    const savedCart = localStorage.getItem('kedaikopi_cart');
    let cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    // Find and update item
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        // Check stock limit
        if (newQuantity > cartItems[itemIndex].stock) {
            showNotification(`Stok tidak mencukupi! Maksimal ${cartItems[itemIndex].stock} item`, 'warning');
            loadCartItems(); // Reload to reset input
            return;
        }
        
        cartItems[itemIndex].quantity = newQuantity;
        
        // Save updated cart
        localStorage.setItem('kedaikopi_cart', JSON.stringify(cartItems));
        
        // Update displays
        updateCartCount();
        loadCartItems();
        updateCartSummary();
        
        showNotification('Keranjang berhasil diperbarui!', 'success');
    }
}

// ====== REMOVE FROM CART ======
function removeFromCart(productId) {
    // Get current cart
    const savedCart = localStorage.getItem('kedaikopi_cart');
    let cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    // Remove item
    cartItems = cartItems.filter(item => item.id !== productId);
    
    // Save updated cart
    localStorage.setItem('kedaikopi_cart', JSON.stringify(cartItems));
    
    // Update displays
    updateCartCount();
    loadCartItems();
    updateCartSummary();
    
    showNotification('Item berhasil dihapus dari keranjang!', 'info');
}

// ====== CLEAR CART ======
function clearCart() {
    if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
        localStorage.removeItem('kedaikopi_cart');
        updateCartCount();
        loadCartItems();
        updateCartSummary();
        showNotification('Keranjang berhasil dikosongkan!', 'info');
    }
}

// ====== UPDATE CART SUMMARY ======
function updateCartSummary() {
    const savedCart = localStorage.getItem('kedaikopi_cart');
    const cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * currentDiscount;
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * taxRate;
    const total = taxableAmount + tax + (subtotal > 200000 ? 0 : shippingCost);
    
    // Update subtotal
    const subtotalElement = document.getElementById('subtotal');
    if (subtotalElement) {
        subtotalElement.textContent = `Rp ${formatPrice(subtotal)}`;
    }
    
    // Update shipping (free if over 200k)
    const shippingElement = document.getElementById('shipping');
    if (shippingElement) {
        if (subtotal > 200000) {
            shippingElement.innerHTML = '<span style="text-decoration: line-through;">Rp 15.000</span> <span style="color: var(--success-color);">GRATIS</span>';
        } else {
            shippingElement.textContent = `Rp ${formatPrice(shippingCost)}`;
        }
    }
    
    // Update tax
    const taxElement = document.getElementById('tax');
    if (taxElement) {
        taxElement.textContent = `Rp ${formatPrice(tax)}`;
    }
    
    // Update total
    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = `Rp ${formatPrice(total)}`;
    }
    
    // Show discount if applied
    if (currentDiscount > 0) {
        const discountRow = document.querySelector('.discount-row') || createDiscountRow();
        discountRow.querySelector('.discount-amount').textContent = `-Rp ${formatPrice(discountAmount)}`;
        if (!document.querySelector('.discount-row')) {
            const summaryCard = document.querySelector('.summary-card');
            const totalRow = summaryCard.querySelector('.total');
            summaryCard.insertBefore(discountRow, totalRow);
        }
    }
}

// ====== CREATE DISCOUNT ROW ======
function createDiscountRow() {
    const discountRow = document.createElement('div');
    discountRow.className = 'summary-row discount-row';
    discountRow.innerHTML = `
        <span>Diskon <button class="remove-discount" onclick="removeDiscount()">×</button></span>
        <span class="discount-amount">-Rp 0</span>
    `;
    return discountRow;
}

// ====== APPLY PROMO CODE ======
function applyPromo() {
    const promoInput = document.getElementById('promoCode');
    if (!promoInput) return;
    
    const promoCode = promoInput.value.trim().toUpperCase();
    
    if (!promoCode) {
        showNotification('Masukkan kode promo!', 'warning');
        return;
    }
    
    const validCodes = {
        'WELCOME10': { discount: 0.1, description: 'Diskon 10% untuk pelanggan baru' },
        'COFFEE20': { discount: 0.2, description: 'Diskon 20% untuk pembelian kopi' },
        'NEWUSER': { discount: 0.15, description: 'Diskon 15% untuk pengguna baru' },
        'GRATIS15': { discount: 0.15, description: 'Diskon 15% tanpa minimum pembelian' },
        'KEDAI25': { discount: 0.25, description: 'Diskon 25% spesial Kedai Kopi' }
    };
    
    if (validCodes[promoCode]) {
        const promo = validCodes[promoCode];
        currentDiscount = promo.discount;
        updateCartSummary();
        
        showNotification(`${promo.description} berhasil diterapkan!`, 'success');
        promoInput.value = '';
        promoInput.disabled = true;
        
        // Change button text
        const promoButton = document.querySelector('[onclick="applyPromo()"]');
        if (promoButton) {
            promoButton.textContent = 'Diterapkan';
            promoButton.disabled = true;
            promoButton.style.background = 'var(--success-color)';
        }
    } else {
        showNotification('Kode promo tidak valid atau sudah kadaluarsa!', 'error');
    }
}

// ====== REMOVE DISCOUNT ======
function removeDiscount() {
    currentDiscount = 0;
    updateCartSummary();
    
    // Remove discount row
    const discountRow = document.querySelector('.discount-row');
    if (discountRow) {
        discountRow.remove();
    }
    
    // Reset promo input
    const promoInput = document.getElementById('promoCode');
    const promoButton = document.querySelector('[onclick="applyPromo()"]');
    
    if (promoInput) {
        promoInput.disabled = false;
        promoInput.value = '';
    }
    
    if (promoButton) {
        promoButton.textContent = 'Terapkan';
        promoButton.disabled = false;
        promoButton.style.background = '';
    }
    
    showNotification('Diskon dihapus!', 'info');
}

// ====== PROCEED TO CHECKOUT ======
function proceedToCheckout() {
    const savedCart = localStorage.getItem('kedaikopi_cart');
    const cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    if (cartItems.length === 0) {
        showNotification('Keranjang Anda masih kosong!', 'warning');
        return;
    }
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('kedaikopi_user');
    if (!savedUser) {
        if (confirm('Anda harus login terlebih dahulu untuk melanjutkan ke checkout. Login sekarang?')) {
            // Save current cart state
            sessionStorage.setItem('redirect_after_login', 'checkout.html');
            window.location.href = 'login.html';
        }
        return;
    }
    
    // Save checkout data
    const checkoutData = {
        items: cartItems,
        subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        discount: currentDiscount,
        shipping: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) > 200000 ? 0 : shippingCost,
        tax: (cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * (1 - currentDiscount)) * taxRate
    };
    
    sessionStorage.setItem('checkout_data', JSON.stringify(checkoutData));
    window.location.href = 'checkout.html';
}

// ====== LOAD RELATED PRODUCTS ======
function loadRelatedProducts() {
    const relatedContainer = document.getElementById('relatedProducts');
    if (!relatedContainer) return;
    
    // Get sample products (this would come from API in real app)
    const sampleProducts = [
        {
            id: 9,
            name: 'Kopi Toraja Special',
            category: 'kopi-bubuk',
            price: 95000,
            image: 'assets/images/toraja-special.jpg',
            description: 'Kopi Toraja dengan cita rasa unik dari Sulawesi.'
        },
        {
            id: 10,
            name: 'Chemex Pour Over',
            category: 'alat-seduh',
            price: 180000,
            image: 'assets/images/chemex.jpg',
            description: 'Alat seduh Chemex untuk pengalaman kopi yang elegan.'
        },
        {
            id: 11,
            name: 'Kopi Aceh Gayo',
            category: 'kopi-biji',
            price: 85000,
            image: 'assets/images/aceh-gayo.jpg',
            description: 'Biji kopi Aceh Gayo dengan aroma yang menggoda.'
        },
        {
            id: 12,
            name: 'Cold Brew Concentrate',
            category: 'kopi-instan',
            price: 45000,
            image: 'assets/images/cold-brew.jpg',
            description: 'Konsentrat cold brew siap minum yang praktis.'
        }
    ];
    
    relatedContainer.innerHTML = '';
    
    sampleProducts.slice(0, 4).forEach(product => {
        const productCard = createRelatedProductCard(product);
        relatedContainer.appendChild(productCard);
    });
}

// ====== CREATE RELATED PRODUCT CARD ======
function createRelatedProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
        </div>
        <div class="product-info">
            <div class="product-category">${getCategoryName(product.category)}</div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">Rp ${formatPrice(product.price)}</div>
            <div class="product-actions">
                <button class="btn-cart" onclick="addToCartFromRelated(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Tambah
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ====== ADD TO CART FROM RELATED ======
function addToCartFromRelated(productId) {
    // This would normally fetch product details from API
    // For demo, we'll create a basic product object
    const relatedProducts = [
        { id: 9, name: 'Kopi Toraja Special', category: 'kopi-bubuk', price: 95000, stock: 30 },
        { id: 10, name: 'Chemex Pour Over', category: 'alat-seduh', price: 180000, stock: 15 },
        { id: 11, name: 'Kopi Aceh Gayo', category: 'kopi-biji', price: 85000, stock: 25 },
        { id: 12, name: 'Cold Brew Concentrate', category: 'kopi-instan', price: 45000, stock: 50 }
    ];
    
    const product = relatedProducts.find(p => p.id === productId);
    if (product) {
        // Get current cart
        const savedCart = localStorage.getItem('kedaikopi_cart');
        let cartItems = savedCart ? JSON.parse(savedCart) : [];
        
        // Check if item already exists
        const existingItem = cartItems.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({
                ...product,
                quantity: 1,
                image: `assets/images/product-${productId}.jpg`,
                description: `Deskripsi ${product.name}`
            });
        }
        
        // Save updated cart
        localStorage.setItem('kedaikopi_cart', JSON.stringify(cartItems));
        
        // Update displays
        updateCartCount();
        loadCartItems();
        updateCartSummary();
        
        showNotification(`${product.name} ditambahkan ke keranjang!`, 'success');
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
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
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
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
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

// ====== EXPORT FUNCTIONS ======
window.updateItemQuantity = updateItemQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.applyPromo = applyPromo;
window.removeDiscount = removeDiscount;
window.proceedToCheckout = proceedToCheckout;
window.addToCartFromRelated = addToCartFromRelated;
