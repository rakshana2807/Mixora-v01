// LocalStorage wrapper
const Storage = {
    KEYS: {
        CART: 'mixora_cart',
        USER: 'mixora_user',
        FAVORITES: 'mixora_favorites',
        SAVED_RECIPES: 'mixora_saved_recipes',
        ORDERS: 'mixora_orders'
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to localStorage', e);
            return false;
        }
    },
    
    remove(key) {
        localStorage.removeItem(key);
    }
};

// Single source of truth helper for User Profile
Storage.UserProfile = {
    // Calculate initials consistently across all components
    getInitials(name) {
        if (!name || typeof name !== 'string') return 'CU';
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return 'CU';
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    },

    // Normalize and retrieve canonical profile
    get() {
        const u = Storage.get(Storage.KEYS.USER);
        if (!u) return null;
        
        // Ensure required fields exist with sensible fallbacks
        const normalized = {
            id: u.id || 'cust_demo_01',
            name: (u.name && u.name.trim()) ? u.name.trim() : 'Aanya Demo',
            email: u.email || 'demo.customer@mixora.example',
            type: u.type || 'Customer',
            status: u.status || 'Active Member',
            memberSince: u.memberSince || '15 September 2026',
            preferredLanguage: u.preferredLanguage || 'English',
            currency: u.currency || 'INR (₹)',
            preferences: Object.assign({
                category: 'Boba Milk Tea',
                sweetness: '50%',
                ice: 'Less Ice',
                size: 'Medium',
                dietary: 'None specified',
                allergies: 'Not provided'
            }, u.preferences || {}),
            addresses: Array.isArray(u.addresses) ? u.addresses : [
                { id: 'addr_1', type: 'Home', address: 'Example Address, Chennai, Tamil Nadu — DEMO ONLY', instructions: 'Sample instructions for demonstration only' }
            ]
        };

        normalized.initials = this.getInitials(normalized.name);
        return normalized;
    },

    // Save and notify all active components across website
    save(updatedFields) {
        const current = this.get() || {};
        const merged = Object.assign({}, current, updatedFields);
        if (updatedFields.preferences) {
            merged.preferences = Object.assign({}, current.preferences || {}, updatedFields.preferences);
        }
        if (merged.name) {
            merged.name = merged.name.trim();
        }
        merged.initials = this.getInitials(merged.name);

        const success = Storage.set(Storage.KEYS.USER, merged);
        if (success) {
            this.broadcast(merged);
        }
        return success;
    },

    // Event broadcast for live synchronization
    broadcast(user) {
        const event = new CustomEvent('mixora:user_updated', { detail: user });
        window.dispatchEvent(event);
        this.updateNavBadges(user);
    },

    // Update global navigation avatar, badge, and dropdown
    updateNavBadges(user) {
        if (!user) return;
        const initials = user.initials || this.getInitials(user.name);

        document.querySelectorAll('.user-initials-badge').forEach(badge => {
            badge.textContent = initials;
            badge.setAttribute('title', user.name);
        });

        document.querySelectorAll('.profile-link').forEach(link => {
            link.setAttribute('aria-label', `User Profile (${user.name})`);
            const badge = link.querySelector('.user-initials-badge');
            if (badge) {
                badge.textContent = initials;
                badge.setAttribute('title', user.name);
            }
        });

        document.querySelectorAll('.profile-menu-name').forEach(el => {
            el.textContent = user.name;
        });

        document.querySelectorAll('.profile-menu-role').forEach(el => {
            el.textContent = `${user.type || 'Customer'} • ${user.status || 'Active Member'}`;
        });
    }
};

window.Storage = Storage;

// Initialize Demo Data

(function initDemoData() {
    if (!Storage.get('mixora_demo_seeded_v2')) {
        const demoUser = {
            name: 'Aanya Demo',
            email: 'demo.customer@mixora.example',
            type: 'Customer',
            status: 'Active Demo Account',
            memberSince: '15 September 2026',
            preferredLanguage: 'English',
            currency: 'INR (₹)',
            preferences: {
                category: 'Boba Milk Tea',
                sweetness: '50%',
                ice: 'Less Ice',
                size: 'Medium',
                bases: ['Classic Milk Tea', 'Matcha Latte', 'Brown Sugar Boba Milk Tea'],
                toppings: ['Brown Sugar Tapioca Pearls', 'Crystal Boba', 'Strawberry Popping Boba'],
                dietary: 'None specified',
                allergies: 'Not provided'
            },
            addresses: [
                { id: 'addr_1', type: 'Home', address: 'Example Address, Chennai, Tamil Nadu — DEMO ONLY', instructions: 'Sample instructions for demonstration only' }
            ]
        };
        Storage.set(Storage.KEYS.USER, demoUser);
        
        // 25 Customers
        const customers = [
            { name: "Aarav Patel", email: "aarav.p@mixora.example", phone: "Demo only" },
            { name: "Priya Sharma", email: "priya.s@mixora.example", phone: "Demo only" },
            { name: "Rahul Kumar", email: "rahul.k@mixora.example", phone: "Demo only" },
            { name: "Neha Gupta", email: "neha.g@mixora.example", phone: "Demo only" },
            { name: "Aditya Singh", email: "aditya.s@mixora.example", phone: "Demo only" },
            { name: "Kavya Desai", email: "kavya.d@mixora.example", phone: "Demo only" },
            { name: "Rohan Joshi", email: "rohan.j@mixora.example", phone: "Demo only" },
            { name: "Ananya Reddy", email: "ananya.r@mixora.example", phone: "Demo only" },
            { name: "Vikram Malhotra", email: "vikram.m@mixora.example", phone: "Demo only" },
            { name: "Sanya Mehta", email: "sanya.m@mixora.example", phone: "Demo only" },
            { name: "Arjun Rao", email: "arjun.r@mixora.example", phone: "Demo only" },
            { name: "Ishita Verma", email: "ishita.v@mixora.example", phone: "Demo only" },
            { name: "Karthik Iyer", email: "karthik.i@mixora.example", phone: "Demo only" },
            { name: "Mira Nair", email: "mira.n@mixora.example", phone: "Demo only" },
            { name: "Siddharth Bose", email: "siddharth.b@mixora.example", phone: "Demo only" },
            { name: "Tara Menon", email: "tara.m@mixora.example", phone: "Demo only" },
            { name: "Dev Agarwal", email: "dev.a@mixora.example", phone: "Demo only" },
            { name: "Riya Kapoor", email: "riya.k@mixora.example", phone: "Demo only" },
            { name: "Varun Das", email: "varun.d@mixora.example", phone: "Demo only" },
            { name: "Sneha Pillai", email: "sneha.p@mixora.example", phone: "Demo only" },
            { name: "Yash Thakur", email: "yash.t@mixora.example", phone: "Demo only" },
            { name: "Pooja Jain", email: "pooja.j@mixora.example", phone: "Demo only" },
            { name: "Kabir Bhatia", email: "kabir.b@mixora.example", phone: "Demo only" },
            { name: "Diya Chatterjee", email: "diya.c@mixora.example", phone: "Demo only" },
            { name: "Aryan Sen", email: "aryan.s@mixora.example", phone: "Demo only" }
        ];

        // Drinks from menu
        const menuDrinks = [
            { name: 'Classic Milk Tea', baseDrinkId: 'd_classic_milk_tea', basePrice: 99 },
            { name: 'Brown Sugar Boba Milk Tea', baseDrinkId: 'd_brown_sugar_boba', basePrice: 129 },
            { name: 'Matcha Latte', baseDrinkId: 'd_matcha_latte', basePrice: 119 },
            { name: 'Strawberry Milk', baseDrinkId: 'd_strawberry_milk', basePrice: 119 },
            { name: 'Mango Green Tea', baseDrinkId: 'd_mango_green', basePrice: 109 },
            { name: 'Caramel Coffee', baseDrinkId: 'd_caramel_coffee', basePrice: 129 },
            { name: 'Chocolate Milkshake', baseDrinkId: 'd_chocolate_milkshake', basePrice: 139 },
            { name: 'Oreo Milkshake', baseDrinkId: 'd_oreo_milkshake', basePrice: 149 },
            { name: 'Strawberry Milkshake', baseDrinkId: 'd_strawberry_milkshake', basePrice: 139 }
        ];

        const statuses = [
            ...Array(16).fill('New'),
            ...Array(12).fill('Confirmed'),
            ...Array(10).fill('Preparing'),
            ...Array(8).fill('Ready'),
            ...Array(29).fill('Completed'),
            ...Array(3).fill('Cancelled'),
            ...Array(1).fill('Rejected')
        ];

        const todayStart = new Date();
        todayStart.setHours(8, 0, 0, 0); // Start at 8 AM today

        const orders = [];
        for (let i = 0; i < 79; i++) {
            const customer = customers[i % customers.length];
            const status = statuses[i];
            const orderDate = new Date(todayStart.getTime() + (i * 5 * 60000)); // Spread by 5 mins
            const drink = menuDrinks[i % menuDrinks.length];
            const size = (i % 2 === 0) ? 'Medium' : 'Large';
            const sizePrice = size === 'Large' ? 30 : 15; // Rough estimate based on pricing
            
            const bobas = i % 3 === 0 ? ['Brown Sugar Tapioca Pearls'] : [];
            const bobaPrice = bobas.length > 0 ? 20 : 0;
            
            const unitPrice = drink.basePrice + sizePrice + bobaPrice;
            const quantity = (i % 5 === 0) ? 2 : 1;
            
            const subtotal = unitPrice * quantity;
            const fees = subtotal * 0.05;
            const total = subtotal + fees;

            orders.push({
                orderId: `MIX-DEMO-TODAY-${(i + 1).toString().padStart(3, '0')}`,
                date: orderDate.toISOString(),
                status: status,
                isDemo: true,
                customer: customer,
                fulfillment: { type: i % 4 === 0 ? 'Delivery' : 'Pickup', address: i % 4 === 0 ? 'Demo Delivery Address' : '' },
                payment: 'Pay at Pickup',
                items: [
                    { 
                        name: drink.name, baseDrinkId: drink.baseDrinkId, 
                        size: size, sugar: '50%', ice: 'Regular Ice', 
                        bobas: bobas, jellies: [], milks_foams: [], syrups: [], garnishes: [], 
                        unitPrice: unitPrice, quantity: quantity 
                    }
                ],
                totals: { subtotal: subtotal, fees: fees, total: total },
                notes: (i % 10 === 0) ? 'Demo sample note.' : ''
            });
        }
        
        // Merge with existing non-demo orders if any (to be safe)
        const existingOrders = (Storage.get(Storage.KEYS.ORDERS) || []).filter(o => !o.isDemo);
        Storage.set(Storage.KEYS.ORDERS, [...existingOrders, ...orders]);
        
        Storage.set('mixora_demo_seeded_v2', true);
    }
})();

// Global User Profile Nav Enhancer
document.addEventListener('DOMContentLoaded', () => {
    const profileLinks = document.querySelectorAll('.profile-link');
    const user = window.Storage.UserProfile ? window.Storage.UserProfile.get() : window.Storage.get(window.Storage.KEYS.USER);

    profileLinks.forEach(link => {
        // If user is logged in, show initials or avatar
        if (user && user.name) {
            const initials = window.Storage.UserProfile ? window.Storage.UserProfile.getInitials(user.name) : user.name.substring(0, 2).toUpperCase();
            link.innerHTML = `<span class="user-initials-badge" title="${user.name}">${initials}</span>`;
            link.setAttribute('aria-label', `User Profile (${user.name})`);
        }

        // Wrap into profile-nav-wrapper if not already
        const parent = link.parentElement;
        if (parent && !parent.classList.contains('profile-nav-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'profile-nav-wrapper';
            parent.insertBefore(wrapper, link);
            wrapper.appendChild(link);

            // Create dropdown menu
            const dropdown = document.createElement('div');
            dropdown.className = 'profile-dropdown-menu';
            dropdown.setAttribute('role', 'menu');

            if (user && user.name) {
                dropdown.innerHTML = `
                    <div class="profile-menu-header">
                        <div class="profile-menu-name">${user.name}</div>
                        <div class="profile-menu-role">${user.type || 'Member'} &bull; ${user.status || 'Active'}</div>
                    </div>
                    <a href="profile.html" class="profile-dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        My Profile
                    </a>
                    <a href="orders.html" class="profile-dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        My Orders
                    </a>
                    <a href="profile.html#saved-recipes" class="profile-dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        Saved Recipes
                    </a>
                    <div class="profile-dropdown-divider"></div>
                    <button type="button" class="profile-dropdown-item" id="nav-btn-signout" style="color: #FF6B81;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Sign Out
                    </button>
                `;
            } else {
                dropdown.innerHTML = `
                    <div class="profile-menu-header">
                        <div class="profile-menu-name">Welcome to MIXORA</div>
                        <div class="profile-menu-role">Guest Experience</div>
                    </div>
                    <a href="profile.html" class="profile-dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                        Sign In
                    </a>
                    <a href="profile.html" class="profile-dropdown-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                        Create Account
                    </a>
                `;
            }

            wrapper.appendChild(dropdown);

            // Toggle dropdown on click
            link.addEventListener('click', (e) => {
                // If user clicks on icon directly, toggle dropdown
                e.preventDefault();
                const isOpen = dropdown.classList.contains('active');
                document.querySelectorAll('.profile-dropdown-menu').forEach(d => d.classList.remove('active'));
                if (!isOpen) {
                    dropdown.classList.add('active');
                }
            });

            // Sign out button handler
            const signOutBtn = dropdown.querySelector('#nav-btn-signout');
            if (signOutBtn) {
                signOutBtn.addEventListener('click', () => {
                    window.Storage.remove(window.Storage.KEYS.USER);
                    window.location.reload();
                });
            }
        }
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.profile-nav-wrapper')) {
            document.querySelectorAll('.profile-dropdown-menu').forEach(d => d.classList.remove('active'));
        }
    });
});

