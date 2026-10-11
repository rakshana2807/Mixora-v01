class Cart {
    constructor() {
        this.items = window.Storage.get(window.Storage.KEYS.CART, []);
        this.listeners = [];
    }
    
    subscribe(listener) {
        this.listeners.push(listener);
    }
    
    notify() {
        this.listeners.forEach(listener => listener(this.items));
        this.updateCartUI();
    }
    
    save() {
        window.Storage.set(window.Storage.KEYS.CART, this.items);
        this.notify();
    }
    
    addItem(item) {
        // item must have a unique id or we generate one
        if (!item.cartId) {
            item.cartId = 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        
        // Calculate price if not set
        if (!item.unitPrice) {
            item.unitPrice = window.Pricing.calculateDrinkPrice(
                item.baseDrinkId, 
                item.size, 
                item.bobas || [],
                item.jellies || [],
                item.milks_foams || [],
                item.syrups || [],
                item.garnishes || []
            );
        }
        
        // Check if identical item exists (same base, size, toppings, syrups, ice, sugar)
        const existingItemIndex = this.items.findIndex(i => 
            i.baseDrinkId === item.baseDrinkId &&
            i.size === item.size &&
            JSON.stringify(i.bobas) === JSON.stringify(item.bobas) &&
            JSON.stringify(i.jellies) === JSON.stringify(item.jellies) &&
            JSON.stringify(i.milks_foams) === JSON.stringify(item.milks_foams) &&
            JSON.stringify(i.syrups) === JSON.stringify(item.syrups) &&
            JSON.stringify(i.garnishes) === JSON.stringify(item.garnishes) &&
            i.ice === item.ice &&
            i.sugar === item.sugar
        );
        
        if (existingItemIndex > -1) {
            this.items[existingItemIndex].quantity += (item.quantity || 1);
        } else {
            if(!item.quantity) item.quantity = 1;
            this.items.push(item);
        }
        
        this.save();
    }
    
    removeItem(cartId) {
        this.items = this.items.filter(item => item.cartId !== cartId);
        this.save();
    }
    
    updateQuantity(cartId, quantity) {
        const item = this.items.find(i => i.cartId === cartId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(cartId);
            } else {
                item.quantity = quantity;
                this.save();
            }
        }
    }
    
    clear() {
        this.items = [];
        this.save();
    }
    
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    getSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    }
    
    updateCartUI() {
        const countElements = document.querySelectorAll('.cart-count');
        const count = this.getTotalItems();
        countElements.forEach(el => {
            el.textContent = count;
            if(count > 0) {
                el.style.display = 'flex';
            } else {
                el.style.display = 'none';
            }
        });
    }
}

window.ShoppingCart = new Cart();

// Initialize UI on load
document.addEventListener('DOMContentLoaded', () => {
    window.ShoppingCart.updateCartUI();
});
