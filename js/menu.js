document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('full-menu-grid')) return;

    let currentCategory = 'All';
    let searchQuery = '';

    const grid = document.getElementById('full-menu-grid');
    const searchInput = document.getElementById('menu-search');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Create Details Modal if not already present
    let detailsModal = document.getElementById('menu-details-modal');
    if (!detailsModal) {
        detailsModal = document.createElement('div');
        detailsModal.id = 'menu-details-modal';
        detailsModal.className = 'drink-details-modal';
        detailsModal.innerHTML = `
            <div class="drink-details-content">
                <button class="modal-close" id="btn-close-details" style="position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; font-size: 1.5rem; color: #FFF7ED; cursor: pointer;">&times;</button>
                <div id="modal-details-body"></div>
            </div>
        `;
        document.body.appendChild(detailsModal);

        detailsModal.querySelector('#btn-close-details').addEventListener('click', () => {
            detailsModal.classList.remove('active');
        });

        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) detailsModal.classList.remove('active');
        });
    }

    // Helper to generate distinct aesthetic drink SVG illustrations
    function getDrinkSvg(drink) {
        const color = drink.imageColor || '#FF6B81';
        const isBoba = drink.category.includes('Boba') || drink.id.includes('boba') || drink.id.includes('taro') || drink.id.includes('thai');
        const isMatcha = drink.category === 'Matcha';
        const isCoffee = drink.category === 'Coffee';
        const isFruit = drink.category === 'Fruit Tea';

        let pearlsSvg = '';
        if (isBoba) {
            pearlsSvg = `
                <circle cx="28" cy="100" r="5" fill="#22110c" opacity="0.9"/>
                <circle cx="40" cy="102" r="5.5" fill="#150a06" opacity="0.95"/>
                <circle cx="52" cy="99" r="5" fill="#22110c" opacity="0.9"/>
                <circle cx="34" cy="91" r="5" fill="#150a06" opacity="0.95"/>
                <circle cx="46" cy="92" r="5" fill="#22110c" opacity="0.9"/>
            `;
        } else if (isFruit) {
            pearlsSvg = `
                <circle cx="32" cy="98" r="4.5" fill="#FF8C00" opacity="0.85"/>
                <circle cx="48" cy="97" r="4.5" fill="#DC143C" opacity="0.85"/>
                <circle cx="40" cy="88" r="4.5" fill="#FFD700" opacity="0.85"/>
            `;
        }

        return `
            <svg width="100" height="150" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Straw -->
                <rect x="46" y="8" width="8" height="135" rx="4" fill="#FFC857" opacity="0.95" transform="rotate(-5 46 8)"/>
                
                <!-- Cup Outline -->
                <path d="M16 28 L84 28 L72 136 C71 140 67 143 63 143 L37 143 C33 140 29 140 28 136 Z" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255, 200, 87, 0.4)" stroke-width="2"/>
                
                <!-- Liquid Fill -->
                <path d="M19 45 L81 45 L71 134 C70 137 67 139 63 139 L37 139 C33 139 30 137 29 134 Z" fill="${color}" opacity="0.85"/>
                
                <!-- Liquid Gradient Wave / Cream Foam -->
                <path d="M19 45 Q50 49 81 45 L81 60 Q50 64 19 60 Z" fill="rgba(255, 247, 237, 0.35)"/>
                
                <!-- Boba / Fruit Pearls -->
                ${pearlsSvg}
                
                <!-- Ice Cubes -->
                <rect x="30" y="55" width="14" height="14" rx="3" fill="rgba(255, 255, 255, 0.45)" stroke="rgba(255, 255, 255, 0.6)" transform="rotate(12 30 55)"/>
                <rect x="52" y="62" width="13" height="13" rx="3" fill="rgba(255, 255, 255, 0.4)" stroke="rgba(255, 255, 255, 0.6)" transform="rotate(-8 52 62)"/>
                
                <!-- Cup Lid -->
                <ellipse cx="50" cy="28" rx="36" ry="6" fill="rgba(255, 255, 255, 0.3)" stroke="rgba(255, 200, 87, 0.6)" stroke-width="1.5"/>
            </svg>
        `;
    }

    function renderMenu() {
        let filtered = window.MIXORA_MENU;
        
        if (currentCategory === 'Best Sellers') {
            filtered = filtered.filter(d => d.bestSeller);
        } else if (currentCategory !== 'All') {
            filtered = filtered.filter(d => d.category === currentCategory);
        }
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(d => d.name.toLowerCase().includes(query) || d.description.toLowerCase().includes(query) || d.category.toLowerCase().includes(query));
        }

        grid.innerHTML = '';

        if (filtered.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: #FFF7ED; font-size: 1.15rem;">No drinks found matching your criteria. Try another search or category.</div>';
            return;
        }

        filtered.forEach(drink => {
            const card = document.createElement('div');
            card.className = 'drink-card';
            
            // Badges
            let badgeHtml = '';
            if (drink.bestSeller) {
                badgeHtml = '<div class="drink-card-badge">Best Seller</div>';
            } else if (drink.featured) {
                badgeHtml = '<div class="drink-card-badge featured">Featured</div>';
            }

            const sizesHtml = (drink.availableSizes || ['Small', 'Medium', 'Large'])
                .map(s => `<span class="size-pill">${s[0]}</span>`)
                .join('');

            card.innerHTML = `
                ${badgeHtml}
                <div class="drink-img-container">
                    ${getDrinkSvg(drink)}
                </div>
                <div class="drink-info">
                    <div class="drink-header">
                        <h4>${drink.name}</h4>
                        <span class="drink-price">${window.Pricing.formatPrice(drink.basePrice)}</span>
                    </div>
                    <p class="drink-desc">${drink.description}</p>
                    
                    <div class="drink-meta-row">
                        <div class="sizes-list">
                            <span style="margin-right: 0.25rem;">Sizes:</span>
                            ${sizesHtml}
                        </div>
                        <div class="customizable-indicator">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            Customizable
                        </div>
                    </div>

                    <div class="drink-actions-row">
                        <button class="btn btn-outline add-to-cart-btn" data-id="${drink.id}">Add to Cart</button>
                        <a href="customizer.html?base=${drink.id}" class="btn btn-primary">Customize</a>
                    </div>
                    <button class="view-details-btn" data-id="${drink.id}">View Details &rarr;</button>
                </div>
            `;
            grid.appendChild(card);
        });

        // Add to Cart Listeners
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const drink = window.MIXORA_MENU.find(d => d.id === id);
                if (drink) {
                    window.ShoppingCart.addItem({
                        baseDrinkId: id,
                        name: drink.name,
                        size: 'Medium',
                        bobas: [],
                        jellies: [],
                        milks_foams: [],
                        syrups: [],
                        garnishes: [],
                        ice: 'Regular Ice',
                        sugar: '100%',
                        unitPrice: drink.basePrice + (window.MIXORA_PRICES.size_surcharge['Medium'] || 15)
                    });
                    
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Added! ✓';
                    e.target.style.borderColor = '#A8D5BA';
                    e.target.style.color = '#A8D5BA';
                    setTimeout(() => {
                        e.target.textContent = originalText;
                        e.target.style.borderColor = '';
                        e.target.style.color = '';
                    }, 1800);
                }
            });
        });

        // View Details Modal Listeners
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const drink = window.MIXORA_MENU.find(d => d.id === id);
                if (drink) {
                    const modalBody = document.getElementById('modal-details-body');
                    modalBody.innerHTML = `
                        <div style="text-align: center; margin-bottom: 1.5rem;">
                            <div style="background: radial-gradient(circle, rgba(95, 48, 69, 0.8) 0%, rgba(46, 23, 33, 0.9) 100%); border-radius: var(--radius-md); padding: 1.5rem; display: inline-block;">
                                ${getDrinkSvg(drink)}
                            </div>
                        </div>
                        <h2 style="font-size: 1.75rem; color: #FFF7ED; margin-bottom: 0.5rem;">${drink.name}</h2>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                            <span style="color: #FFC857; font-size: 1.4rem; font-weight: 800;">${window.Pricing.formatPrice(drink.basePrice)}</span>
                            <span style="background: rgba(255, 107, 129, 0.2); color: #FF6B81; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 700;">${drink.category}</span>
                        </div>
                        <p style="color: rgba(255, 247, 237, 0.85); line-height: 1.6; margin-bottom: 1.5rem;">${drink.description}</p>
                        
                        <div style="background: rgba(43, 20, 31, 0.8); border: 1px solid rgba(255, 200, 87, 0.2); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.75rem;">
                            <div style="font-weight: 700; color: #FFC857; margin-bottom: 0.5rem; font-size: 0.9rem;">Available Sizes & Pricing</div>
                            <div style="display: flex; gap: 1rem; font-size: 0.9rem;">
                                <div>Small: <strong>${window.Pricing.formatPrice(drink.basePrice)}</strong></div>
                                <div>Medium: <strong>${window.Pricing.formatPrice(drink.basePrice + 15)}</strong></div>
                                <div>Large: <strong>${window.Pricing.formatPrice(drink.basePrice + 30)}</strong></div>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <button class="btn btn-outline" id="modal-quick-add" data-id="${drink.id}">Add to Cart</button>
                            <a href="customizer.html?base=${drink.id}" class="btn btn-primary" style="text-align: center;">Customize</a>
                        </div>
                    `;

                    modalBody.querySelector('#modal-quick-add').addEventListener('click', (ev) => {
                        window.ShoppingCart.addItem({
                            baseDrinkId: drink.id,
                            name: drink.name,
                            size: 'Medium',
                            bobas: [],
                            jellies: [],
                            milks_foams: [],
                            syrups: [],
                            garnishes: [],
                            ice: 'Regular Ice',
                            sugar: '100%',
                            unitPrice: drink.basePrice + 15
                        });
                        ev.target.textContent = 'Added to Cart! ✓';
                        setTimeout(() => { detailsModal.classList.remove('active'); }, 1000);
                    });

                    detailsModal.classList.add('active');
                }
            });
        });
    }

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderMenu();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.getAttribute('data-category');
            renderMenu();
        });
    });

    renderMenu();
});
