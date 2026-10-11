document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if(navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.backgroundColor = 'var(--clr-bg)';
                navLinks.style.padding = '1rem';
                navLinks.style.borderBottom = '1px solid var(--clr-border)';
            }
        });
    }

    // Render Featured Drinks on Homepage
    const featuredGrid = document.getElementById('featured-drinks-grid');
    if (featuredGrid && window.MIXORA_MENU) {
        const featuredDrinks = window.MIXORA_MENU.filter(d => d.featured).slice(0, 3);
        
        featuredDrinks.forEach(drink => {
            const card = document.createElement('div');
            card.className = 'drink-card';
            
            card.innerHTML = `
                <div class="drink-img-container" style="background-color: ${drink.imageColor}20;">
                    <!-- Placeholder SVG for now -->
                    <svg width="80" height="120" viewBox="0 0 80 120">
                        <path d="M10,10 L70,10 L60,110 L20,110 Z" fill="${drink.imageColor}" opacity="0.8"/>
                        <rect x="35" y="0" width="10" height="110" fill="#ddd"/>
                    </svg>
                </div>
                <div class="drink-info">
                    <div class="drink-header">
                        <h4>${drink.name}</h4>
                        <span class="drink-price">${window.Pricing.formatPrice(drink.basePrice)}</span>
                    </div>
                    <p class="drink-desc">${drink.description}</p>
                    <div class="drink-actions">
                        <button class="btn btn-outline add-to-cart-btn" data-id="${drink.id}">Add to Cart</button>
                        <a href="customizer.html?base=${drink.id}" class="btn btn-primary">Customize</a>
                    </div>
                </div>
            `;
            featuredGrid.appendChild(card);
        });
        
        // Add to cart listeners
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const drink = window.MIXORA_MENU.find(d => d.id === id);
                if (drink) {
                    window.ShoppingCart.addItem({
                        baseDrinkId: id,
                        name: drink.name,
                        size: 'Medium', // default size
                        bobas: [],
                        jellies: [],
                        milks_foams: [],
                        syrups: [],
                        garnishes: [],
                        ice: 'Regular Ice',
                        sugar: '100%',
                        unitPrice: drink.basePrice + window.MIXORA_PRICES.size_surcharge['Medium']
                    });
                    
                    // Show a toast or feedback
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Added!';
                    setTimeout(() => {
                        e.target.textContent = originalText;
                    }, 2000);
                }
            });
        });
    }
});
