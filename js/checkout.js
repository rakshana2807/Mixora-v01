document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('checkout-items');
    if (!itemsContainer) return;
    
    // Check if cart is empty
    if (window.ShoppingCart.items.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    // Render Summary
    function renderSummary() {
        const items = window.ShoppingCart.items;
        itemsContainer.innerHTML = '';
        
        items.forEach(item => {
            const el = document.createElement('div');
            el.style.display = 'flex';
            el.style.justifyContent = 'space-between';
            el.style.marginBottom = '0.5rem';
            el.style.fontSize = '0.9rem';
            el.innerHTML = `
                <span>${item.quantity}x ${item.name} <small class="text-muted">(${item.size})</small></span>
                <span>${window.Pricing.formatPrice(item.unitPrice * item.quantity)}</span>
            `;
            itemsContainer.appendChild(el);
        });
        
        const subtotal = window.ShoppingCart.getSubtotal();
        const fees = subtotal * 0.05;
        const total = subtotal + fees;
        
        document.getElementById('c-subtotal').textContent = window.Pricing.formatPrice(subtotal);
        document.getElementById('c-fees').textContent = window.Pricing.formatPrice(fees);
        document.getElementById('c-total').textContent = window.Pricing.formatPrice(total);
        
        return { subtotal, fees, total };
    }
    
    const totals = renderSummary();

    // Prefill customer information from canonical user profile
    const activeUser = window.Storage.UserProfile ? window.Storage.UserProfile.get() : window.Storage.get(window.Storage.KEYS.USER);
    if (activeUser) {
        const nameInput = document.getElementById('c-name');
        const emailInput = document.getElementById('c-email');
        const addressInput = document.getElementById('c-address');

        if (nameInput && !nameInput.value && activeUser.name) nameInput.value = activeUser.name;
        if (emailInput && !emailInput.value && activeUser.email) emailInput.value = activeUser.email;
        if (addressInput && !addressInput.value && activeUser.addresses && activeUser.addresses.length > 0) {
            addressInput.value = activeUser.addresses[0].address || '';
        }
    }
    
    // Toggle Address fields
    document.querySelectorAll('input[name="fulfillment"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('address-fields').style.display = e.target.value === 'Delivery' ? 'block' : 'none';
        });
    });
    
    // Form Submission
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fulfillment = document.querySelector('input[name="fulfillment"]:checked').value;
        const address = document.getElementById('c-address').value;
        const formError = document.getElementById('form-error');
        
        if (fulfillment === 'Delivery' && !address.trim()) {
            formError.textContent = 'Please enter a delivery address.';
            formError.style.display = 'block';
            return;
        }
        
        formError.style.display = 'none';
        
        // Prevent duplicate submits
        const submitBtn = document.querySelector('#checkout-form button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Placing Order...';
        }

        const customerName = document.getElementById('c-name').value.trim();
        const customerEmail = document.getElementById('c-email').value.trim();
        const customerPhone = document.getElementById('c-phone').value.trim();

        // Get current active user or create customer profile
        let user = window.Storage.UserProfile ? window.Storage.UserProfile.get() : window.Storage.get(window.Storage.KEYS.USER);
        if (!user) {
            user = {
                id: 'cust_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                type: 'Customer',
                status: 'Active Member',
                memberSince: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
            };
            if (window.Storage.UserProfile) {
                window.Storage.UserProfile.save(user);
            } else {
                window.Storage.set(window.Storage.KEYS.USER, user);
            }
        } else {
            // Keep email and name in sync if entered differently or updated
            if (customerEmail && (!user.email || user.email === 'demo.customer@mixora.example')) {
                user.email = customerEmail;
                user.name = customerName || user.name;
                user.phone = customerPhone || user.phone;
                if (window.Storage.UserProfile) {
                    window.Storage.UserProfile.save(user);
                } else {
                    window.Storage.set(window.Storage.KEYS.USER, user);
                }
            }
        }

        const customerId = user ? user.id : ('cust_' + customerEmail.toLowerCase().replace(/[^a-z0-9]/g, '_'));

        // Create Order Object
        const order = {
            orderId: 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            customerId: customerId,
            date: new Date().toISOString(),
            status: 'New', // New, Confirmed, Preparing, Ready, Completed, Cancelled
            isDemo: false, // Placed by actual customer in checkout
            customer: {
                id: customerId,
                name: customerName,
                email: customerEmail,
                phone: customerPhone
            },
            fulfillment: {
                type: fulfillment,
                address: address
            },
            notes: document.getElementById('c-notes').value,
            payment: document.querySelector('input[name="payment"]:checked').value,
            items: JSON.parse(JSON.stringify(window.ShoppingCart.items)), // deep copy snapshot
            totals: totals
        };
        
        try {
            // Save to LocalStorage
            const orders = window.Storage.get(window.Storage.KEYS.ORDERS, []);
            orders.unshift(order);
            const saved = window.Storage.set(window.Storage.KEYS.ORDERS, orders);

            if (!saved) {
                throw new Error('Failed to save order to local storage.');
            }
            
            // Clear Cart ONLY after success
            window.ShoppingCart.clear();
            
            // Show Success Modal
            document.getElementById('success-order-id').textContent = order.orderId;
            document.getElementById('success-modal').style.display = 'flex';
        } catch (err) {
            console.error('Order creation error:', err);
            formError.textContent = 'Could not place your order. Please try again.';
            formError.style.display = 'block';
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Place Order';
            }
        }
    });
});

