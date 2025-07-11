// ====== PRODUCT DETAIL FUNCTIONALITY ======

// Global variables
let currentProduct = null;
let selectedVariant = null;
let currentQuantity = 1;

// Sample product data
const productData = {
    1: {
        id: 1,
        name: 'Kopi Arabica Premium',
        category: 'kopi-bubuk',
        categoryName: 'Kopi Bubuk',
        price: 85000,
        originalPrice: 100000,
        discount: 15,
        images: [
            'assets/images/arabica-premium.jpg',
            'assets/images/arabica-premium-2.jpg',
            'assets/images/arabica-premium-3.jpg'
        ],
        description: 'Kopi Arabica Premium dengan cita rasa yang halus dan aroma yang khas. Dipetik dari kebun kopi terbaik di dataran tinggi Jawa Barat dengan proses pengolahan yang sempurna.',
        longDescription: `
            Kopi Arabica Premium kami dipetik dari kebun kopi terbaik di dataran tinggi Jawa Barat 
            pada ketinggian 1200-1500 mdpl. Dengan proses pengolahan semi-washed yang sempurna, 
            menghasilkan biji kopi dengan kualitas premium yang memiliki karakteristik rasa yang unik.
        `,
        features: [
            'Jenis: Arabica Premium',
            'Asal: Jawa Barat',
            'Tingkat Sangrai: Medium Roast',
            'Berat: 250g',
            'Kemasan: Standing Pouch',
            'Kadaluarsa: 12 bulan'
        ],
        variants: [
            { weight: '250g', price: 85000 },
            { weight: '500g', price: 160000 },
            { weight: '1kg', price: 300000 }
        ],
        stock: 50,
        rating: 4.5,
        reviewCount: 127,
        inWishlist: false
    },
    2: {
        id: 2,
        name: 'Kopi Robusta Asli',
        category: 'kopi-bubuk',
        categoryName: 'Kopi Bubuk',
        price: 65000,
        images: [
            'assets/images/robusta-asli.jpg',
            'assets/images/robusta-asli-2.jpg'
        ],
        description: 'Kopi robusta dengan karakteristik rasa yang kuat dan kandungan kafein tinggi.',
        features: [
            'Jenis: Robusta Asli',
            'Asal: Lampung',
            'Tingkat Sangrai: Dark Roast',
            'Berat: 250g',
            'Kemasan: Standing Pouch',
            'Kadaluarsa: 12 bulan'
        ],
        variants: [
            { weight: '250g', price: 65000 },
            { weight: '500g', price: 120000 }
        ],
        stock: 30,
        rating: 4.2,
        reviewCount: 89,
        inWishlist: false
    }
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProductDetail();
    setupEventListeners();
});

// ====== INITIALIZATION ======
function initializeProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || '1'; // Default to product 1
    
    loadProductData(productId);
    loadRelatedProducts();
    updateCartUI();
}

function setupEventListeners() {
    // Quantity controls
    const quantityInput = document.getElementById('productQuantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            currentQuantity = parseInt(this.value) || 1;
            validateQuantity();
        });
    }

    // Variant selection
    const variantOptions = document.querySelectorAll('.variant-option');
    variantOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectVariant(this);
        });
    });

    // Tab navigation
    const tabHeaders = document.querySelectorAll('.tab-header');
    tabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const tabName = this.textContent.toLowerCase().split(' ')[0];
            showTab(tabName);
        });
    });

    // Image zoom modal
    const modal = document.getElementById('imageZoomModal');
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeImageZoom();
            }
        });
    }
}

// ====== LOAD PRODUCT DATA ======
function loadProductData(productId) {
    const product = productData[productId];
    
    if (!product) {
        console.error('Product not found');
        return;
    }
    
    currentProduct = product;
    selectedVariant = product.variants[0]; // Select first variant by default
    
    // Update page title
    document.title = `${product.name} - Kedai Kopi`;
    
    // Update breadcrumb
    document.getElementById('productCategory').textContent = product.categoryName;
    document.getElementById('productName').textContent = product.name;
    
    // Update product info
    document.getElementById('productTitle').textContent = product.name;
    document.getElementById('productDescription').textContent = product.description;
    
    // Update price
    updateProductPrice();
    
    // Update stock
    document.getElementById('stockCount').textContent = product.stock;
    
    // Update rating
    updateProductRating();
    
    // Update images
    updateProductImages();
    
    // Update features
    updateProductFeatures();
    
    // Update variants
    updateProductVariants();
    
    // Update tabs content
    updateTabsContent();
}

function updateProductPrice() {
    const priceElement = document.getElementById('productPrice');
    const originalPriceElement = document.getElementById('originalPrice');
    const discountBadge = document.getElementById('discountBadge');
    
    if (currentProduct.discount && currentProduct.originalPrice) {
        priceElement.textContent = `Rp ${selectedVariant.price.toLocaleString('id-ID')}`;
        originalPriceElement.textContent = `Rp ${currentProduct.originalPrice.toLocaleString('id-ID')}`;
        originalPriceElement.style.display = 'inline';
        discountBadge.textContent = `${currentProduct.discount}% OFF`;
        discountBadge.style.display = 'inline';
    } else {
        priceElement.textContent = `Rp ${selectedVariant.price.toLocaleString('id-ID')}`;
        originalPriceElement.style.display = 'none';
        discountBadge.style.display = 'none';
    }
}

function updateProductRating() {
    const ratingText = document.querySelector('.rating-text');
    if (ratingText) {
        ratingText.textContent = `(${currentProduct.rating}/5 - ${currentProduct.reviewCount} ulasan)`;
    }
}

function updateProductImages() {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnailContainer = document.querySelector('.image-thumbnails');
    
    if (currentProduct.images && currentProduct.images.length > 0) {
        // Update main image
        mainImage.src = currentProduct.images[0];
        mainImage.alt = currentProduct.name;
        
        // Update thumbnails
        thumbnailContainer.innerHTML = '';
        currentProduct.images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.alt = `Thumbnail ${index + 1}`;
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.onclick = () => changeMainImage(thumbnail);
            thumbnail.onerror = () => thumbnail.src = 'assets/images/placeholder.jpg';
            
            thumbnailContainer.appendChild(thumbnail);
        });
    }
}

function updateProductFeatures() {
    const featuresElement = document.getElementById('productFeatures');
    
    if (currentProduct.features) {
        featuresElement.innerHTML = currentProduct.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');
    }
}

function updateProductVariants() {
    const variantOptions = document.querySelectorAll('.variant-option');
    
    variantOptions.forEach((option, index) => {
        if (currentProduct.variants[index]) {
            const variant = currentProduct.variants[index];
            option.setAttribute('data-price', variant.price);
            option.setAttribute('data-weight', variant.weight);
            
            const sizeElement = option.querySelector('.variant-size');
            const priceElement = option.querySelector('.variant-price');
            
            if (sizeElement) sizeElement.textContent = variant.weight;
            if (priceElement) priceElement.textContent = `Rp ${variant.price.toLocaleString('id-ID')}`;
            
            option.style.display = 'flex';
        } else {
            option.style.display = 'none';
        }
    });
}

function updateTabsContent() {
    // Update description tab
    const descriptionTab = document.getElementById('description');
    if (descriptionTab && currentProduct.longDescription) {
        const descriptionContent = descriptionTab.querySelector('p');
        if (descriptionContent) {
            descriptionContent.textContent = currentProduct.longDescription;
        }
    }
    
    // Update reviews tab header
    const reviewsTabHeader = document.querySelector('.tab-header:nth-child(2)');
    if (reviewsTabHeader) {
        reviewsTabHeader.textContent = `Ulasan (${currentProduct.reviewCount})`;
    }
}

// ====== IMAGE FUNCTIONS ======
function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Update main image
    mainImage.src = thumbnail.src;
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

function zoomImage() {
    const mainImage = document.getElementById('mainProductImage');
    const modal = document.getElementById('imageZoomModal');
    const zoomedImage = document.getElementById('zoomedImage');
    
    zoomedImage.src = mainImage.src;
    modal.style.display = 'block';
}

function closeImageZoom() {
    const modal = document.getElementById('imageZoomModal');
    modal.style.display = 'none';
}

// ====== VARIANT SELECTION ======
function selectVariant(variantElement) {
    const variants = document.querySelectorAll('.variant-option');
    variants.forEach(v => v.classList.remove('active'));
    
    variantElement.classList.add('active');
    
    const price = parseInt(variantElement.getAttribute('data-price'));
    const weight = variantElement.getAttribute('data-weight');
    
    selectedVariant = {
        weight: weight,
        price: price
    };
    
    updateProductPrice();
}

// ====== QUANTITY FUNCTIONS ======
function increaseQuantity() {
    const quantityInput = document.getElementById('productQuantity');
    const maxQuantity = Math.min(10, currentProduct.stock);
    
    if (currentQuantity < maxQuantity) {
        currentQuantity++;
        quantityInput.value = currentQuantity;
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('productQuantity');
    
    if (currentQuantity > 1) {
        currentQuantity--;
        quantityInput.value = currentQuantity;
    }
}

function validateQuantity() {
    const quantityInput = document.getElementById('productQuantity');
    const maxQuantity = Math.min(10, currentProduct.stock);
    
    if (currentQuantity < 1) {
        currentQuantity = 1;
    } else if (currentQuantity > maxQuantity) {
        currentQuantity = maxQuantity;
    }
    
    quantityInput.value = currentQuantity;
}

// ====== CART FUNCTIONS ======
function addToCartFromDetail() {
    if (!currentProduct || !selectedVariant) {
        showNotification('Terjadi kesalahan saat menambahkan produk', 'error');
        return;
    }
    
    const cartItem = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: selectedVariant.price,
        image: currentProduct.images[0],
        quantity: currentQuantity,
        variant: selectedVariant.weight
    };
    
    addToCart(cartItem);
    showNotification(`${cartItem.name} (${cartItem.variant}) berhasil ditambahkan ke keranjang!`, 'success');
    
    // Update button text temporarily
    const addButton = document.querySelector('.add-to-cart-btn');
    const originalText = addButton.innerHTML;
    addButton.innerHTML = '<i class="fas fa-check"></i> Ditambahkan!';
    addButton.classList.add('btn-success');
    
    setTimeout(() => {
        addButton.innerHTML = originalText;
        addButton.classList.remove('btn-success');
    }, 2000);
}

function buyNow() {
    addToCartFromDetail();
    
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 500);
}

// ====== WISHLIST FUNCTIONS ======
function toggleWishlist() {
    if (!currentProduct) return;
    
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const icon = wishlistBtn.querySelector('i');
    
    currentProduct.inWishlist = !currentProduct.inWishlist;
    
    if (currentProduct.inWishlist) {
        icon.className = 'fas fa-heart';
        wishlistBtn.classList.add('btn-wishlist-active');
        showNotification('Produk ditambahkan ke wishlist', 'success');
    } else {
        icon.className = 'far fa-heart';
        wishlistBtn.classList.remove('btn-wishlist-active');
        showNotification('Produk dihapus dari wishlist', 'info');
    }
    
    // Save to localStorage
    let wishlist = JSON.parse(localStorage.getItem('kedaikopi_wishlist') || '[]');
    
    if (currentProduct.inWishlist) {
        if (!wishlist.find(item => item.id === currentProduct.id)) {
            wishlist.push({
                id: currentProduct.id,
                name: currentProduct.name,
                price: currentProduct.price,
                image: currentProduct.images[0]
            });
        }
    } else {
        wishlist = wishlist.filter(item => item.id !== currentProduct.id);
    }
    
    localStorage.setItem('kedaikopi_wishlist', JSON.stringify(wishlist));
}

// ====== TAB FUNCTIONS ======
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tab headers
    const tabHeaders = document.querySelectorAll('.tab-header');
    tabHeaders.forEach(header => header.classList.remove('active'));
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to selected tab header
    const selectedHeader = Array.from(tabHeaders).find(header => 
        header.textContent.toLowerCase().includes(tabName)
    );
    if (selectedHeader) {
        selectedHeader.classList.add('active');
    }
}

// ====== SHARE FUNCTIONS ======
function shareProduct(platform) {
    const productUrl = window.location.href;
    const productName = currentProduct ? currentProduct.name : 'Produk Kedai Kopi';
    const productDescription = currentProduct ? currentProduct.description : 'Kopi berkualitas tinggi';
    
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(productName)}&url=${encodeURIComponent(productUrl)}`;
            break;
        case 'whatsapp':
            const whatsappText = `${productName}\n${productDescription}\n${productUrl}`;
            shareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function copyProductLink() {
    const productUrl = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(productUrl).then(() => {
            showNotification('Link produk berhasil disalin!', 'success');
        }).catch(() => {
            fallbackCopyText(productUrl);
        });
    } else {
        fallbackCopyText(productUrl);
    }
}

function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Link produk berhasil disalin!', 'success');
    } catch (err) {
        showNotification('Gagal menyalin link produk', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ====== LOAD RELATED PRODUCTS ======
function loadRelatedProducts() {
    const relatedProductsGrid = document.querySelector('.related-products .products-grid');
    if (!relatedProductsGrid) return;
    
    // Sample related products
    const relatedProducts = [
        {
            id: 2,
            name: 'Kopi Robusta Asli',
            price: 65000,
            image: 'assets/images/robusta-asli.jpg',
            rating: 4.2
        },
        {
            id: 3,
            name: 'Biji Kopi Luwak',
            price: 250000,
            image: 'assets/images/kopi-luwak.jpg',
            rating: 4.8
        },
        {
            id: 4,
            name: 'French Press',
            price: 150000,
            image: 'assets/images/french-press.jpg',
            rating: 4.6
        }
    ];
    
    relatedProductsGrid.innerHTML = relatedProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
                <div class="product-overlay">
                    <button class="btn btn-primary" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i> Lihat Detail
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span>(${product.rating})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">Rp ${product.price.toLocaleString('id-ID')}</span>
                </div>
                <button class="btn btn-outline add-to-cart-btn" onclick="quickAddToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Tambah ke Keranjang
                </button>
            </div>
        </div>
    `).join('');
}

function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

function quickAddToCart(productId) {
    const product = Object.values(productData).find(p => p.id === productId);
    if (product) {
        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1,
            variant: product.variants[0].weight
        };
        
        addToCart(cartItem);
        showNotification(`${product.name} berhasil ditambahkan ke keranjang!`, 'success');
    }
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// ====== NOTIFICATION FUNCTION ======
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

// ====== EXPORT FUNCTIONS ======
window.changeMainImage = changeMainImage;
window.zoomImage = zoomImage;
window.closeImageZoom = closeImageZoom;
window.selectVariant = selectVariant;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.addToCartFromDetail = addToCartFromDetail;
window.buyNow = buyNow;
window.toggleWishlist = toggleWishlist;
window.showTab = showTab;
window.shareProduct = shareProduct;
window.copyProductLink = copyProductLink;
window.viewProduct = viewProduct;
window.quickAddToCart = quickAddToCart;
