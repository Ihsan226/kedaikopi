// ====== AUTH FUNCTIONALITY ======

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

// ====== INITIALIZATION ======
function initializeAuth() {
    setupAuthEventListeners();
    setupPasswordToggle();
    setupPasswordStrength();
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('kedaikopi_user');
    if (savedUser && !window.location.pathname.includes('login') && !window.location.pathname.includes('register')) {
        // User is logged in, redirect if on auth pages
        if (window.location.pathname.includes('admin-login')) {
            return; // Allow admin login page
        }
    }
}

// ====== EVENT LISTENERS ======
function setupAuthEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Admin login form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
}

// ====== PASSWORD TOGGLE ======
function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('onclick')?.match(/togglePassword\('(.+?)'\)/)?.[1];
            const input = targetId ? document.getElementById(targetId) : 
                         this.parentElement.querySelector('input[type="password"], input[type="text"]');
            
            if (input) {
                const icon = this.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            }
        });
    });
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = document.querySelector(`[onclick="togglePassword('${inputId}')"]`);
    
    if (input && button) {
        const icon = button.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
}

// ====== PASSWORD STRENGTH ======
function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strength = calculatePasswordStrength(this.value);
            updatePasswordStrengthUI(strength);
        });
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    return {
        score,
        checks,
        level: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong'
    };
}

function updatePasswordStrengthUI(strength) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    // Update bar
    const percentage = (strength.score / 5) * 100;
    strengthBar.style.background = `linear-gradient(to right, 
        ${getStrengthColor(strength.level)} ${percentage}%, 
        #e9ecef ${percentage}%)`;
    
    // Update text
    const messages = {
        weak: 'Lemah - Tambahkan huruf besar, angka, dan simbol',
        medium: 'Sedang - Tambahkan lebih banyak variasi karakter',
        strong: 'Kuat - Password aman'
    };
    
    strengthText.textContent = messages[strength.level];
    strengthText.style.color = getStrengthColor(strength.level);
}

function getStrengthColor(level) {
    const colors = {
        weak: '#dc3545',
        medium: '#ffc107',
        strong: '#28a745'
    };
    return colors[level];
}

// ====== LOGIN HANDLER ======
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Basic validation
    if (!email || !password) {
        showAuthError('Email dan password harus diisi!');
        return;
    }
    
    // Show loading
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading-spinner"></span> Memproses...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Demo credentials
        const demoUsers = [
            { email: 'user@example.com', password: 'password123', name: 'John Doe', role: 'user' },
            { email: 'demo@kedaikopi.com', password: 'demo123', name: 'Demo User', role: 'user' }
        ];
        
        const user = demoUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Save user data
            const userData = {
                id: Date.now(),
                email: user.email,
                name: user.name,
                role: user.role,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('kedaikopi_user', JSON.stringify(userData));
            
            showAuthSuccess('Login berhasil! Mengalihkan...');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showAuthError('Email atau password salah!');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }, 1000);
}

// ====== REGISTER HANDLER ======
function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const terms = formData.get('terms');
    
    // Validation
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showAuthError('Semua field wajib diisi!');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthError('Konfirmasi password tidak cocok!');
        return;
    }
    
    if (password.length < 8) {
        showAuthError('Password minimal 8 karakter!');
        return;
    }
    
    if (!terms) {
        showAuthError('Anda harus menyetujui syarat dan ketentuan!');
        return;
    }
    
    // Show loading
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading-spinner"></span> Memproses...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Check if email already exists (demo)
        const existingUser = localStorage.getItem(`user_${email}`);
        
        if (existingUser) {
            showAuthError('Email sudah terdaftar!');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            return;
        }
        
        // Save user data
        const userData = {
            id: Date.now(),
            firstName,
            lastName,
            email,
            phone,
            role: 'user',
            registrationTime: new Date().toISOString()
        };
        
        localStorage.setItem(`user_${email}`, JSON.stringify(userData));
        localStorage.setItem('kedaikopi_user', JSON.stringify(userData));
        
        showAuthSuccess('Pendaftaran berhasil! Mengalihkan...');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1000);
}

// ====== ADMIN LOGIN HANDLER ======
function handleAdminLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('adminEmail');
    const password = formData.get('adminPassword');
    const adminCode = formData.get('adminCode');
    
    // Validation
    if (!email || !password || !adminCode) {
        showAuthError('Semua field harus diisi!');
        return;
    }
    
    // Show loading
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading-spinner"></span> Memproses...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Demo admin credentials
        const adminCredentials = {
            email: 'admin@kedaikopi.com',
            password: 'admin123',
            code: 'KEDAI2025'
        };
        
        if (email === adminCredentials.email && 
            password === adminCredentials.password && 
            adminCode === adminCredentials.code) {
            
            // Save admin session
            const adminData = {
                id: 1,
                email: adminCredentials.email,
                name: 'Administrator',
                role: 'admin',
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('kedaikopi_admin', JSON.stringify(adminData));
            
            showAuthSuccess('Login admin berhasil! Mengalihkan ke dashboard...');
            
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1500);
        } else {
            showAuthError('Kredensial admin tidak valid!');
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }, 1000);
}

// ====== AUTH UI HELPERS ======
function showAuthError(message) {
    showAuthMessage(message, 'error');
}

function showAuthSuccess(message) {
    showAuthMessage(message, 'success');
}

function showAuthMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.auth-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `auth-message auth-message-${type}`;
    messageElement.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Insert after form header
    const form = document.querySelector('.auth-form');
    const header = form.querySelector('h2');
    header.parentNode.insertBefore(messageElement, header.nextSibling);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentElement) {
            messageElement.remove();
        }
    }, 5000);
}

// ====== SOCIAL LOGIN (Demo) ======
function handleGoogleLogin() {
    showAuthMessage('Fitur login Google akan segera tersedia!', 'info');
}

function handleFacebookLogin() {
    showAuthMessage('Fitur login Facebook akan segera tersedia!', 'info');
}

// ====== PASSWORD RESET (Demo) ======
function handleForgotPassword() {
    const email = prompt('Masukkan email Anda untuk reset password:');
    if (email) {
        showAuthSuccess('Link reset password telah dikirim ke email Anda!');
    }
}

// ====== FORM VALIDATION HELPERS ======
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^(\+62|62|0)[0-9]{9,13}$/;
    return re.test(phone.replace(/\s+/g, ''));
}

// ====== AUTO-FILL DEMO DATA ======
function fillDemoData() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('login.html')) {
        document.getElementById('email').value = 'user@example.com';
        document.getElementById('password').value = 'password123';
    } else if (currentPage.includes('admin-login.html')) {
        document.getElementById('adminEmail').value = 'admin@kedaikopi.com';
        document.getElementById('adminPassword').value = 'admin123';
        document.getElementById('adminCode').value = 'KEDAI2025';
    }
}

// ====== EXPORT FUNCTIONS ======
window.togglePassword = togglePassword;
window.handleGoogleLogin = handleGoogleLogin;
window.handleFacebookLogin = handleFacebookLogin;
window.handleForgotPassword = handleForgotPassword;
window.fillDemoData = fillDemoData;

// Add demo data button (for development)
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const authForm = document.querySelector('.auth-form');
        if (authForm) {
            const demoButton = document.createElement('button');
            demoButton.type = 'button';
            demoButton.className = 'btn btn-outline btn-full';
            demoButton.textContent = 'Isi Data Demo';
            demoButton.onclick = fillDemoData;
            demoButton.style.marginBottom = '1rem';
            
            const form = authForm.querySelector('form');
            form.parentNode.insertBefore(demoButton, form);
        }
    }
});
