document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('cart-items-container')) return;

    const itemsContainer = document.getElementById('cart-items-container');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const cartContent = document.getElementById('cart-content');
    
    function renderCart() {
        const items = window.ShoppingCart.items;
        
        if (items.length === 0) {
            cartContent.style.display = 'none';
            emptyMsg.style.display = 'block';
            return;
        }
        
        cartContent.style.display = 'grid';
        emptyMsg.style.display = 'none';
        
        itemsContainer.innerHTML = '';
        
        items.forEach(item => {
            const drink = window.MIXORA_MENU.find(d => d.id === item.baseDrinkId);
            
            const addonsArr = [];
            if(item.bobas) addonsArr.push(...item.bobas);
            if(item.jellies) addonsArr.push(...item.jellies);
            if(item.milks_foams) addonsArr.push(...item.milks_foams);
            if(item.syrups) addonsArr.push(...item.syrups);
            if(item.garnishes) addonsArr.push(...item.garnishes);
            const addons = addonsArr.join(', ');
            
            let customizationText = `${item.size} • ${item.sugar} Sugar • ${item.ice}`;
            if(addons) customizationText += ` • ${addons}`;
            
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <div class="cart-item-img" style="background-color: ${drink ? drink.imageColor : '#ccc'}20;">
                    <svg width="40" height="60" viewBox="0 0 80 120">
                        <path d="M10,10 L70,10 L60,110 L20,110 Z" fill="${drink ? drink.imageColor : '#ccc'}" opacity="0.8"/>
                    </svg>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-details">${customizationText}</div>
                    <div class="cart-item-price" style="margin-top: 0.5rem;">${window.Pricing.formatPrice(item.unitPrice)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="qty-btn minus" data-id="${item.cartId}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn plus" data-id="${item.cartId}">+</button>
                    </div>
                    <button class="remove-btn" data-id="${item.cartId}">Remove</button>
                </div>
                <div class="cart-item-total" style="font-weight: 700; width: 80px; text-align: right;">
                    ${window.Pricing.formatPrice(item.unitPrice * item.quantity)}
                </div>
            `;
            itemsContainer.appendChild(el);
        });
        
        updateSummary();
    }
    
    function updateSummary() {
        const subtotal = window.ShoppingCart.getSubtotal();
        const taxRate = 0.05; // 5% fee for demo
        const fees = subtotal * taxRate;
        const total = subtotal + fees;
        
        document.getElementById('summary-subtotal').textContent = window.Pricing.formatPrice(subtotal);
        document.getElementById('summary-fees').textContent = window.Pricing.formatPrice(fees);
        document.getElementById('summary-total').textContent = window.Pricing.formatPrice(total);
    }
    
    // Listeners
    itemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('minus')) {
            const id = e.target.getAttribute('data-id');
            const item = window.ShoppingCart.items.find(i => i.cartId === id);
            window.ShoppingCart.updateQuantity(id, item.quantity - 1);
            renderCart();
        } else if (e.target.classList.contains('plus')) {
            const id = e.target.getAttribute('data-id');
            const item = window.ShoppingCart.items.find(i => i.cartId === id);
            window.ShoppingCart.updateQuantity(id, item.quantity + 1);
            renderCart();
        } else if (e.target.classList.contains('remove-btn')) {
            const id = e.target.getAttribute('data-id');
            window.ShoppingCart.removeItem(id);
            renderCart();
        }
    });
    
    document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
        if(confirm('Are you sure you want to empty your cart?')) {
            window.ShoppingCart.clear();
            renderCart();
        }
    });
    
    // Subscribe to cart changes from other sources if needed
    window.ShoppingCart.subscribe(() => {
        renderCart();
    });
    
    renderCart();
});
