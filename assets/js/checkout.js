// ====== CHECKOUT PAGE FUNCTIONALITY ======

// Global variables
let currentStep = 1;
let checkoutData = {};
let orderData = {};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
});

// ====== INITIALIZATION ======
function initializeCheckout() {
    loadCheckoutData();
    loadOrderSummary();
    setupCheckoutEventListeners();
    prefillUserData();
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('kedaikopi_user');
    if (!savedUser) {
        alert('Anda harus login terlebih dahulu!');
        window.location.href = 'login.html';
        return;
    }
}

// ====== EVENT LISTENERS ======
function setupCheckoutEventListeners() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    
    // City selection change
    const citySelect = document.getElementById('city');
    if (citySelect) {
        citySelect.addEventListener('change', updateShippingCost);
    }
    
    // Payment method change
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', updatePaymentInfo);
    });
}

// ====== LOAD CHECKOUT DATA ======
function loadCheckoutData() {
    const savedCheckoutData = sessionStorage.getItem('checkout_data');
    if (savedCheckoutData) {
        checkoutData = JSON.parse(savedCheckoutData);
    } else {
        // Fallback: load from cart
        const savedCart = localStorage.getItem('kedaikopi_cart');
        const cartItems = savedCart ? JSON.parse(savedCart) : [];
        
        if (cartItems.length === 0) {
            alert('Keranjang Anda kosong!');
            window.location.href = 'cart.html';
            return;
        }
        
        checkoutData = {
            items: cartItems,
            subtotal: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            discount: 0,
            shipping: 15000,
            tax: 0
        };
    }
    
    // Calculate tax
    const taxableAmount = checkoutData.subtotal * (1 - checkoutData.discount);
    checkoutData.tax = taxableAmount * 0.11;
}

// ====== LOAD ORDER SUMMARY ======
function loadOrderSummary() {
    const orderItemsContainer = document.getElementById('orderItems');
    if (!orderItemsContainer) return;
    
    orderItemsContainer.innerHTML = '';
    
    checkoutData.items.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-details">Qty: ${item.quantity} × Rp ${formatPrice(item.price)}</div>
            </div>
            <div class="item-price">Rp ${formatPrice(item.price * item.quantity)}</div>
        `;
        orderItemsContainer.appendChild(orderItem);
    });
    
    updateOrderSummary();
}

// ====== UPDATE ORDER SUMMARY ======
function updateOrderSummary() {
    const subtotalElement = document.getElementById('orderSubtotal');
    const shippingElement = document.getElementById('orderShipping');
    const taxElement = document.getElementById('orderTax');
    const totalElement = document.getElementById('orderTotal');
    
    if (subtotalElement) {
        subtotalElement.textContent = `Rp ${formatPrice(checkoutData.subtotal)}`;
    }
    
    if (shippingElement) {
        if (checkoutData.subtotal > 200000) {
            shippingElement.innerHTML = '<span style="text-decoration: line-through;">Rp 15.000</span> <span style="color: var(--success-color);">GRATIS</span>';
            checkoutData.shipping = 0;
        } else {
            shippingElement.textContent = `Rp ${formatPrice(checkoutData.shipping)}`;
        }
    }
    
    if (taxElement) {
        taxElement.textContent = `Rp ${formatPrice(checkoutData.tax)}`;
    }
    
    if (totalElement) {
        const total = checkoutData.subtotal + checkoutData.shipping + checkoutData.tax - (checkoutData.subtotal * checkoutData.discount);
        totalElement.textContent = `Rp ${formatPrice(total)}`;
    }
}

// ====== PREFILL USER DATA ======
function prefillUserData() {
    const savedUser = localStorage.getItem('kedaikopi_user');
    if (!savedUser) return;
    
    const user = JSON.parse(savedUser);
    
    // Prefill form fields
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    if (firstNameInput && user.firstName) firstNameInput.value = user.firstName;
    if (lastNameInput && user.lastName) lastNameInput.value = user.lastName;
    if (emailInput && user.email) emailInput.value = user.email;
    if (phoneInput && user.phone) phoneInput.value = user.phone;
}

// ====== STEP NAVIGATION ======
function nextStep(step) {
    if (!validateCurrentStep()) return;
    
    // Hide current step
    document.getElementById(`step${currentStep}`).style.display = 'none';
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.classList.remove('active');
        if (index < step - 1) {
            stepEl.classList.add('completed');
        }
    });
    
    // Show next step
    document.getElementById(`step${step}`).style.display = 'block';
    document.querySelectorAll('.step')[step - 1].classList.add('active');
    
    currentStep = step;
    
    // Update confirmation data if going to step 3
    if (step === 3) {
        updateConfirmationData();
    }
}

function prevStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).style.display = 'none';
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.classList.remove('active', 'completed');
        if (index < step - 1) {
            stepEl.classList.add('completed');
        }
    });
    
    // Show previous step
    document.getElementById(`step${step}`).style.display = 'block';
    document.querySelectorAll('.step')[step - 1].classList.add('active');
    
    currentStep = step;
}

// ====== VALIDATE CURRENT STEP ======
function validateCurrentStep() {
    if (currentStep === 1) {
        return validateShippingInfo();
    } else if (currentStep === 2) {
        return validatePaymentMethod();
    }
    return true;
}

function validateShippingInfo() {
    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'address', 'city', 'postalCode'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.style.borderColor = 'var(--danger-color)';
            isValid = false;
        } else if (field) {
            field.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        showNotification('Mohon lengkapi semua field yang diperlukan!', 'error');
    }
    
    return isValid;
}

function validatePaymentMethod() {
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedPayment) {
        showNotification('Pilih metode pembayaran terlebih dahulu!', 'error');
        return false;
    }
    return true;
}

// ====== UPDATE SHIPPING COST ======
function updateShippingCost() {
    const citySelect = document.getElementById('city');
    if (!citySelect) return;
    
    const shippingCosts = {
        'jakarta': 15000,
        'surabaya': 20000,
        'bandung': 18000,
        'medan': 25000,
        'semarang': 22000
    };
    
    const selectedCity = citySelect.value;
    const newShippingCost = shippingCosts[selectedCity] || 15000;
    
    // Don't charge shipping if subtotal > 200k
    if (checkoutData.subtotal > 200000) {
        checkoutData.shipping = 0;
    } else {
        checkoutData.shipping = newShippingCost;
    }
    
    updateOrderSummary();
}

// ====== UPDATE PAYMENT INFO ======
function updatePaymentInfo() {
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    if (selectedPayment) {
        orderData.paymentMethod = selectedPayment.value;
    }
}

// ====== UPDATE CONFIRMATION DATA ======
function updateConfirmationData() {
    // Shipping Info
    const shippingInfo = document.getElementById('shippingInfo');
    if (shippingInfo) {
        const formData = new FormData(document.getElementById('checkoutForm'));
        shippingInfo.innerHTML = `
            <div class="info-item">
                <strong>Nama:</strong> ${formData.get('firstName')} ${formData.get('lastName')}
            </div>
            <div class="info-item">
                <strong>Telepon:</strong> ${formData.get('phone')}
            </div>
            <div class="info-item">
                <strong>Email:</strong> ${formData.get('email')}
            </div>
            <div class="info-item">
                <strong>Alamat:</strong> ${formData.get('address')}
            </div>
            <div class="info-item">
                <strong>Kota:</strong> ${document.getElementById('city').selectedOptions[0].text}
            </div>
            <div class="info-item">
                <strong>Kode Pos:</strong> ${formData.get('postalCode')}
            </div>
            ${formData.get('notes') ? `<div class="info-item"><strong>Catatan:</strong> ${formData.get('notes')}</div>` : ''}
        `;
    }
    
    // Payment Info
    const paymentInfo = document.getElementById('paymentInfo');
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    if (paymentInfo && selectedPayment) {
        const paymentLabels = {
            'bank-transfer': 'Transfer Bank',
            'e-wallet': 'E-Wallet (OVO, GoPay, DANA)',
            'cod': 'Cash on Delivery (COD)'
        };
        
        paymentInfo.innerHTML = `
            <div class="info-item">
                <strong>Metode:</strong> ${paymentLabels[selectedPayment.value]}
            </div>
        `;
    }
}

// ====== HANDLE CHECKOUT SUBMIT ======
function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    if (currentStep !== 3) return;
    
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms || !agreeTerms.checked) {
        showNotification('Anda harus menyetujui syarat dan ketentuan!', 'error');
        return;
    }
    
    // Show loading
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading-spinner"></span> Memproses Pesanan...';
    submitButton.disabled = true;
    
    // Collect all order data
    const formData = new FormData(e.target);
    const finalOrderData = {
        id: generateOrderId(),
        items: checkoutData.items,
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        },
        shipping: {
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            notes: formData.get('notes') || ''
        },
        payment: {
            method: document.querySelector('input[name="paymentMethod"]:checked').value,
            subtotal: checkoutData.subtotal,
            shipping: checkoutData.shipping,
            tax: checkoutData.tax,
            discount: checkoutData.discount,
            total: checkoutData.subtotal + checkoutData.shipping + checkoutData.tax - (checkoutData.subtotal * checkoutData.discount)
        },
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Simulate order processing
    setTimeout(() => {
        // Save order
        saveOrder(finalOrderData);
        
        // Clear cart
        localStorage.removeItem('kedaikopi_cart');
        sessionStorage.removeItem('checkout_data');
        
        // Show success and redirect
        showNotification('Pesanan berhasil dibuat! Mengalihkan ke halaman konfirmasi...', 'success');
        
        setTimeout(() => {
            window.location.href = `order-confirmation.html?orderId=${finalOrderData.id}`;
        }, 2000);
    }, 2000);
}

// ====== SAVE ORDER ======
function saveOrder(orderData) {
    // Save to localStorage (in real app, this would be sent to API)
    const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    existingOrders.push(orderData);
    localStorage.setItem('user_orders', JSON.stringify(existingOrders));
    
    // Also save individual order
    localStorage.setItem(`order_${orderData.id}`, JSON.stringify(orderData));
}

// ====== GENERATE ORDER ID ======
function generateOrderId() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `KK${timestamp.slice(-8)}${random}`;
}

// ====== UTILITY FUNCTIONS ======
function formatPrice(price) {
    return price.toLocaleString('id-ID');
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
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
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

// Add custom CSS for notifications and animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text-light);
        margin-left: auto;
    }
    
    .info-item {
        margin-bottom: 0.5rem;
        line-height: 1.5;
    }
    
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ====== EXPORT FUNCTIONS ======
window.nextStep = nextStep;
window.prevStep = prevStep;
