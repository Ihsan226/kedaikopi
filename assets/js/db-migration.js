/**
 * Database Migration Script
 * Script untuk migrasi dari localStorage ke MySQL database
 */

// Migration functions to integrate with existing JavaScript frontend
class DatabaseMigration {
    constructor() {
        this.apiBase = '/kedaikopi/api/';
    }

    /**
     * Migrate cart data from localStorage to database
     */
    async migrateCart() {
        const cart = JSON.parse(localStorage.getItem('kedaikopi_cart') || '[]');
        
        if (cart.length === 0) {
            console.log('No cart items to migrate');
            return;
        }

        try {
            for (const item of cart) {
                const response = await fetch(this.apiBase + 'cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        product_id: item.id,
                        quantity: item.quantity,
                        variant_info: {
                            size: item.variant || '250g'
                        }
                    })
                });

                if (!response.ok) {
                    console.error('Failed to migrate cart item:', item);
                }
            }

            console.log('Cart migration completed');
            
            // Clear localStorage cart after successful migration
            localStorage.removeItem('kedaikopi_cart');
            
        } catch (error) {
            console.error('Cart migration error:', error);
        }
    }

    /**
     * Sync products from database
     */
    async syncProducts() {
        try {
            const response = await fetch(this.apiBase + 'products');
            const data = await response.json();
            
            if (data.success) {
                // Update products in localStorage for offline capability
                localStorage.setItem('kedaikopi_products_cache', JSON.stringify(data.data));
                console.log('Products synced from database');
                return data.data;
            }
        } catch (error) {
            console.error('Product sync error:', error);
            // Fallback to localStorage
            return JSON.parse(localStorage.getItem('kedaikopi_products_cache') || '[]');
        }
    }

    /**
     * Sync user orders from database
     */
    async syncUserOrders(userId) {
        try {
            const response = await fetch(this.apiBase + `orders?user_id=${userId}`);
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('kedaikopi_user_orders', JSON.stringify(data.data));
                console.log('User orders synced from database');
                return data.data;
            }
        } catch (error) {
            console.error('Orders sync error:', error);
            return JSON.parse(localStorage.getItem('kedaikopi_user_orders') || '[]');
        }
    }

    /**
     * Create order in database
     */
    async createOrder(orderData) {
        try {
            const response = await fetch(this.apiBase + 'orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('Order created in database:', data);
                
                // Clear cart after successful order
                localStorage.removeItem('kedaikopi_cart');
                
                // Store last order for confirmation page
                localStorage.setItem('kedaikopi_last_order', JSON.stringify({
                    orderId: data.order_number,
                    date: new Date().toLocaleDateString('id-ID'),
                    ...orderData
                }));
                
                return data;
            } else {
                throw new Error(data.error || 'Failed to create order');
            }
        } catch (error) {
            console.error('Create order error:', error);
            throw error;
        }
    }

    /**
     * Login user with database
     */
    async loginUser(email, password) {
        try {
            const response = await fetch(this.apiBase + 'auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (data.success) {
                // Store user data in localStorage
                localStorage.setItem('kedaikopi_user', JSON.stringify(data.user));
                console.log('User logged in successfully');
                
                // Migrate cart if exists
                await this.migrateCart();
                
                return data.user;
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Register user with database
     */
    async registerUser(userData) {
        try {
            const response = await fetch(this.apiBase + 'auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('User registered successfully');
                return data;
            } else {
                throw new Error(data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    /**
     * Enhanced cart functions with database integration
     */
    async addToCart(product, quantity = 1, variant = null) {
        const user = JSON.parse(localStorage.getItem('kedaikopi_user') || 'null');
        
        if (user) {
            // User is logged in, save to database
            try {
                const response = await fetch(this.apiBase + 'cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        product_id: product.id,
                        quantity: quantity,
                        variant_info: variant ? { size: variant } : {}
                    })
                });

                const data = await response.json();
                if (data.success) {
                    console.log('Item added to database cart');
                    await this.syncCart();
                }
            } catch (error) {
                console.error('Database cart error, falling back to localStorage:', error);
                this.addToCartLocal(product, quantity, variant);
            }
        } else {
            // User not logged in, save to localStorage
            this.addToCartLocal(product, quantity, variant);
        }
    }

    addToCartLocal(product, quantity, variant) {
        let cart = JSON.parse(localStorage.getItem('kedaikopi_cart') || '[]');
        
        const existingItem = cart.find(item => 
            item.id === product.id && item.variant === variant
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                variant: variant || '250g'
            });
        }
        
        localStorage.setItem('kedaikopi_cart', JSON.stringify(cart));
        this.updateCartUI();
    }

    async syncCart() {
        const user = JSON.parse(localStorage.getItem('kedaikopi_user') || 'null');
        
        if (user) {
            try {
                const response = await fetch(this.apiBase + 'cart');
                const data = await response.json();
                
                if (data.success) {
                    // Convert database cart format to frontend format
                    const cart = data.data.map(item => ({
                        id: item.product_id,
                        name: item.product_name,
                        price: item.price,
                        image: item.image || 'assets/images/placeholder.jpg',
                        quantity: item.quantity,
                        variant: item.variant_info?.size || '250g'
                    }));
                    
                    localStorage.setItem('kedaikopi_cart', JSON.stringify(cart));
                    this.updateCartUI();
                }
            } catch (error) {
                console.error('Cart sync error:', error);
            }
        }
    }

    updateCartUI() {
        const cart = JSON.parse(localStorage.getItem('kedaikopi_cart') || '[]');
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count in navbar
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = cartCount;
        });
        
        // Dispatch custom event for cart update
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart, count: cartCount } }));
    }

    /**
     * Initialize migration on page load
     */
    async init() {
        console.log('Database migration initialized');
        
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('kedaikopi_user') || 'null');
        
        if (user) {
            // Sync data for logged in user
            await this.syncCart();
            await this.syncUserOrders(user.id);
        }
        
        // Always sync products for cache
        await this.syncProducts();
        
        // Update UI
        this.updateCartUI();
    }
}

// Export for use in other scripts
window.DatabaseMigration = DatabaseMigration;

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dbMigration = new DatabaseMigration();
    window.dbMigration.init();
});

// Enhanced functions for existing JavaScript files

/**
 * Enhanced authentication functions
 */
window.enhancedAuth = {
    async login(email, password) {
        const dbMigration = window.dbMigration || new DatabaseMigration();
        
        try {
            const user = await dbMigration.loginUser(email, password);
            
            // Update UI
            document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
            
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    async register(userData) {
        const dbMigration = window.dbMigration || new DatabaseMigration();
        
        try {
            const result = await dbMigration.registerUser(userData);
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    logout() {
        localStorage.removeItem('kedaikopi_user');
        localStorage.removeItem('kedaikopi_cart');
        localStorage.removeItem('kedaikopi_user_orders');
        
        // Redirect to home
        window.location.href = 'index.html';
    }
};

/**
 * Enhanced checkout function
 */
window.enhancedCheckout = {
    async createOrder(orderData) {
        const dbMigration = window.dbMigration || new DatabaseMigration();
        
        try {
            // Prepare order data for database
            const cart = JSON.parse(localStorage.getItem('kedaikopi_cart') || '[]');
            
            const dbOrderData = {
                user_id: orderData.user_id || null,
                customer_name: orderData.customerName,
                customer_email: orderData.customerEmail,
                customer_phone: orderData.customerPhone,
                shipping_address: orderData.shippingAddress,
                shipping_city: orderData.shippingCity,
                shipping_province: orderData.shippingProvince,
                shipping_postal_code: orderData.shippingPostalCode,
                payment_method: orderData.paymentMethod.replace('-', '_'),
                subtotal: orderData.subtotal,
                shipping_cost: orderData.shippingCost || 15000,
                discount_amount: orderData.discountAmount || 0,
                total_amount: orderData.totalAmount,
                notes: orderData.notes || '',
                items: cart.map(item => ({
                    product_id: item.id,
                    product_name: item.name,
                    quantity: item.quantity,
                    unit_price: item.price,
                    total_price: item.price * item.quantity,
                    variant_info: { size: item.variant }
                }))
            };
            
            const result = await dbMigration.createOrder(dbOrderData);
            
            if (result.success) {
                // Redirect to confirmation page
                window.location.href = 'order-confirmation.html';
            }
            
            return result;
        } catch (error) {
            console.error('Enhanced checkout error:', error);
            
            // Fallback to localStorage method
            const orderId = 'KK' + new Date().getFullYear() + String(Math.floor(Math.random() * 10000)).padStart(4, '0');
            
            localStorage.setItem('kedaikopi_last_order', JSON.stringify({
                orderId: orderId,
                date: new Date().toLocaleDateString('id-ID'),
                ...orderData
            }));
            
            localStorage.removeItem('kedaikopi_cart');
            window.location.href = 'order-confirmation.html';
            
            return { success: true, order_number: orderId };
        }
    }
};

// Integration helper for existing code
window.isOnlineMode = () => {
    // Check if API is available
    return fetch('/kedaikopi/api/products?limit=1')
        .then(() => true)
        .catch(() => false);
};
