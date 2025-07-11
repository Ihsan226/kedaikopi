// ====== GLOBAL VARIABLES ======
let currentUser = null;
let cartItems = [];
let currentFilter = 'all';

// Sample products data
const products = [
    {
        id: 1,
        name: 'Kopi Arabica Premium',
        category: 'kopi-bubuk',
        price: 85000,
        image: 'assets/images/arabica-premium.jpg',
        description: 'Kopi arabica premium dengan cita rasa yang halus dan aroma yang khas.',
        stock: 50,
        rating: 4.8,
        badge: 'Terlaris'
    },
    {
        id: 2,
        name: 'Kopi Robusta Asli',
        category: 'kopi-bubuk',
        price: 65000,
        image: 'assets/images/robusta-asli.jpg',
        description: 'Kopi robusta dengan karakteristik rasa yang kuat dan kandungan kafein tinggi.',
        stock: 30,
        rating: 4.5,
        badge: null
    },
    {
        id: 3,
        name: 'Biji Kopi Luwak',
        category: 'kopi-biji',
        price: 250000,
        image: 'assets/images/kopi-luwak.jpg',
        description: 'Biji kopi luwak asli dengan proses fermentasi alami yang unik.',
        stock: 10,
        rating: 5.0,
        badge: 'Premium'
    },
    {
        id: 4,
        name: 'Kopi Instan Cappuccino',
        category: 'kopi-instan',
        price: 25000,
        image: 'assets/images/cappuccino-instant.jpg',
        description: 'Kopi instan cappuccino dengan rasa creamy dan praktis untuk diseduh.',
        stock: 100,
        rating: 4.2,
        badge: null
    },
    {
        id: 5,
        name: 'French Press',
        category: 'alat-seduh',
        price: 150000,
        image: 'assets/images/french-press.jpg',
        description: 'Alat seduh French Press berkualitas tinggi untuk kopi yang sempurna.',
        stock: 25,
        rating: 4.7,
        badge: null
    },
    {
        id: 6,
        name: 'V60 Dripper',
        category: 'alat-seduh',
        price: 120000,
        image: 'assets/images/v60-dripper.jpg',
        description: 'V60 dripper untuk metode pour over yang menghasilkan kopi berkualitas tinggi.',
        stock: 40,
        rating: 4.6,
        badge: null
    },
    {
        id: 7,
        name: 'Kopi Gayo Organic',
        category: 'kopi-biji',
        price: 95000,
        image: 'assets/images/gayo-organic.jpg',
        description: 'Biji kopi Gayo organic langsung dari petani dengan sertifikasi organic.',
        stock: 35,
        rating: 4.9,
        badge: 'Organic'
    },
    {
        id: 8,
        name: 'Espresso Blend',
        category: 'kopi-bubuk',
        price: 75000,
        image: 'assets/images/espresso-blend.jpg',
        description: 'Campuran kopi khusus untuk espresso dengan crema yang sempurna.',
        stock: 45,
        rating: 4.4,
        badge: null
    }
];

// ====== DOM CONTENT LOADED ======
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ====== INITIALIZATION ======
function initializeApp() {
    loadCartFromStorage();
    updateCartCount();
    setupEventListeners();
    
    // Load products if on main page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadProducts();
    }
    
    // Check authentication status
    checkAuthStatus();
}

// ====== EVENT LISTENERS ======
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && hamburger && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// ====== PRODUCTS FUNCTIONALITY ======
function loadProducts(filter = 'all') {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    
    // Add animation
    productsGrid.classList.add('animate-fadeIn');
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', product.category);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
            <div class="product-category">${getCategoryName(product.category)}</div>
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">Rp ${formatPrice(product.price)}</div>
            <div class="product-rating">
                ${generateStars(product.rating)}
                <span>(${product.rating})</span>
            </div>
            <div class="product-actions">
                <button class="btn-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Tambah ke Keranjang
                </button>
                <button class="btn-wishlist" onclick="toggleWishlist(${product.id})">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add click event for product details
    card.addEventListener('click', function(e) {
        if (!e.target.closest('button')) {
            showProductDetails(product);
        }
    });
    
    return card;
}

function getCategoryName(category) {
    const categories = {
        'kopi-bubuk': 'Kopi Bubuk',
        'kopi-biji': 'Kopi Biji',
        'kopi-instan': 'Kopi Instan',
        'alat-seduh': 'Alat Seduh'
    };
    return categories[category] || category;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function filterProducts(category) {
    currentFilter = category;
    loadProducts(category);
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[onclick="filterProducts('${category}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function showProductDetails(product) {
    // Create modal for product details
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${product.name}</h3>
                <button class="modal-close" onclick="closeModal(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="product-details">
                    <img src="${product.image}" alt="${product.name}" class="product-detail-image">
                    <div class="product-detail-info">
                        <div class="product-category">${getCategoryName(product.category)}</div>
                        <h2>${product.name}</h2>
                        <div class="product-rating">
                            ${generateStars(product.rating)}
                            <span>(${product.rating})</span>
                        </div>
                        <p>${product.description}</p>
                        <div class="product-price">Rp ${formatPrice(product.price)}</div>
                        <div class="product-stock">Stok: ${product.stock} tersedia</div>
                        <div class="quantity-selector">
                            <label>Jumlah:</label>
                            <div class="quantity-controls">
                                <button type="button" onclick="changeQuantity(-1)">-</button>
                                <input type="number" value="1" min="1" max="${product.stock}" id="productQuantity">
                                <button type="button" onclick="changeQuantity(1)">+</button>
                            </div>
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-primary" onclick="addToCartWithQuantity(${product.id})">
                                <i class="fas fa-shopping-cart"></i> Tambah ke Keranjang
                            </button>
                            <button class="btn btn-outline" onclick="toggleWishlist(${product.id})">
                                <i class="far fa-heart"></i> Simpan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal(modal.querySelector('.modal-close'));
        }
    });
}

// ====== CART FUNCTIONALITY ======
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({
            ...product,
            quantity: quantity
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    showNotification(`${product.name} ditambahkan ke keranjang!`, 'success');
}

function addToCartWithQuantity(productId) {
    const quantityInput = document.getElementById('productQuantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    addToCart(productId, quantity);
    
    // Close modal
    const modal = quantityInput.closest('.modal');
    if (modal) {
        closeModal(modal.querySelector('.modal-close'));
    }
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    loadCartItems(); // Refresh cart display if on cart page
}

function updateCartQuantity(productId, quantity) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCartToStorage();
        updateCartCount();
        loadCartItems(); // Refresh cart display if on cart page
    }
}

function clearCart() {
    if (confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
        cartItems = [];
        saveCartToStorage();
        updateCartCount();
        loadCartItems();
        showNotification('Keranjang berhasil dikosongkan!', 'info');
    }
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function saveCartToStorage() {
    localStorage.setItem('kedaikopi_cart', JSON.stringify(cartItems));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('kedaikopi_cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
}

// ====== UTILITY FUNCTIONS ======
function formatPrice(price) {
    return price.toLocaleString('id-ID');
}

function changeQuantity(change) {
    const quantityInput = document.getElementById('productQuantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value);
        const newValue = Math.max(1, Math.min(currentValue + change, parseInt(quantityInput.max)));
        quantityInput.value = newValue;
    }
}

function closeModal(closeButton) {
    const modal = closeButton.closest('.modal');
    if (modal) {
        modal.remove();
    }
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
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

function toggleWishlist(productId) {
    // Implement wishlist functionality
    showNotification('Fitur wishlist akan segera tersedia!', 'info');
}

// ====== CONTACT FORM ======
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    
    // Simulate form submission
    showNotification('Terima kasih! Pesan Anda telah dikirim.', 'success');
    e.target.reset();
}

// ====== AUTHENTICATION CHECK ======
function checkAuthStatus() {
    const savedUser = localStorage.getItem('kedaikopi_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authLinks = document.querySelector('.nav-auth');
    if (authLinks && currentUser) {
        authLinks.innerHTML = `
            <a href="account.html" class="nav-link">Akun Saya</a>
            <a href="cart.html" class="cart-icon">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-count">0</span>
            </a>
            <button class="btn btn-outline" onclick="logout()">Keluar</button>
        `;
        updateCartCount();
    }
}

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        localStorage.removeItem('kedaikopi_user');
        currentUser = null;
        window.location.href = 'index.html';
    }
}

// ====== SEARCH FUNCTIONALITY ======
function searchProducts(query) {
    if (!query.trim()) {
        loadProducts(currentFilter);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        getCategoryName(product.category).toLowerCase().includes(query.toLowerCase())
    );
    
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Tidak ada produk ditemukan</h3>
                    <p>Coba gunakan kata kunci yang berbeda</p>
                </div>
            `;
        } else {
            filteredProducts.forEach(product => {
                const productCard = createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        }
    }
}

// ====== SCROLL EFFECTS ======
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }
});

// ====== LAZY LOADING IMAGES ======
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// ====== PROMO CODE FUNCTIONALITY ======
function applyPromo() {
    const promoInput = document.getElementById('promoCode');
    if (!promoInput) return;
    
    const promoCode = promoInput.value.trim().toUpperCase();
    const validCodes = {
        'WELCOME10': 0.1,
        'COFFEE20': 0.2,
        'NEWUSER': 0.15
    };
    
    if (validCodes[promoCode]) {
        const discount = validCodes[promoCode];
        showNotification(`Kode promo berhasil diterapkan! Diskon ${discount * 100}%`, 'success');
        // Update price calculation here
        updateCartSummary(discount);
    } else {
        showNotification('Kode promo tidak valid!', 'error');
    }
}

function updateCartSummary(discount = 0) {
    // This will be implemented in cart.js
    console.log('Updating cart summary with discount:', discount);
}

// ====== PROCEED TO CHECKOUT ======
function proceedToCheckout() {
    if (cartItems.length === 0) {
        showNotification('Keranjang Anda masih kosong!', 'warning');
        return;
    }
    
    if (!currentUser) {
        if (confirm('Anda harus login terlebih dahulu. Redirect ke halaman login?')) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    window.location.href = 'checkout.html';
}

// ====== NAVBAR SCROLL EFFECT ======
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ====== HAMBURGER MENU TOGGLE ======
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ====== EXPORT FUNCTIONS FOR GLOBAL ACCESS ======
window.filterProducts = filterProducts;
window.addToCart = addToCart;
window.addToCartWithQuantity = addToCartWithQuantity;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.changeQuantity = changeQuantity;
window.closeModal = closeModal;
window.toggleWishlist = toggleWishlist;
window.logout = logout;
window.searchProducts = searchProducts;
window.applyPromo = applyPromo;
window.proceedToCheckout = proceedToCheckout;
