document.addEventListener('DOMContentLoaded', () => {
    // Single Source of Truth
    function getActiveUser() {
        if (window.Storage.UserProfile) {
            return window.Storage.UserProfile.get();
        }
        return window.Storage.get(window.Storage.KEYS.USER);
    }

    let user = getActiveUser();
    if (!user) return; // Not initialized or logged out
    
    // Update Sidebar & Summary Initials and Details
    function updateHeaderAndSidebar() {
        user = getActiveUser();
        if (!user) return;

        const initials = window.Storage.UserProfile ? window.Storage.UserProfile.getInitials(user.name) : (user.name ? user.name.substring(0, 2).toUpperCase() : 'CU');
        
        // Sidebar
        const avatarInitialsEl = document.getElementById('avatar-initials');
        if (avatarInitialsEl) avatarInitialsEl.textContent = initials;
        
        const displayNameEl = document.getElementById('display-name');
        if (displayNameEl) displayNameEl.textContent = user.name;
        
        const displayEmailEl = document.getElementById('display-email');
        if (displayEmailEl) displayEmailEl.textContent = user.email;

        // Top Summary Card
        const sumInitialsEl = document.getElementById('summary-avatar-initials');
        if (sumInitialsEl) sumInitialsEl.textContent = initials;

        const sumNameEl = document.getElementById('summary-user-name');
        if (sumNameEl) sumNameEl.textContent = user.name;

        const sumEmailEl = document.getElementById('summary-user-email');
        if (sumEmailEl) sumEmailEl.textContent = user.email;

        const sumAccountEl = document.getElementById('summary-account-type');
        if (sumAccountEl) sumAccountEl.textContent = user.type || 'Customer';

        const sumMemberEl = document.getElementById('summary-member-since');
        if (sumMemberEl) sumMemberEl.textContent = user.memberSince || '15 September 2026';

        // Update nav badges as well
        if (window.Storage.UserProfile) {
            window.Storage.UserProfile.updateNavBadges(user);
        }
    }

    updateHeaderAndSidebar();
    
    let isEditing = false;

    function renderProfile() {
        user = getActiveUser();
        if (!user) return;

        // Update quick stats counters from actual current user records
        const recipes = window.Storage.get(window.Storage.KEYS.SAVED_RECIPES, []);
        const statRecipesEl = document.getElementById('stat-recipes-count');
        if (statRecipesEl) statRecipesEl.textContent = recipes.length;

        const addresses = (user && Array.isArray(user.addresses)) ? user.addresses : [];
        const statAddrEl = document.getElementById('stat-addresses-count');
        if (statAddrEl) statAddrEl.textContent = addresses.length;

        // 1. Basic Information Grid
        const infoGrid = document.getElementById('profile-info-grid');
        if (infoGrid) {
            if (isEditing) {
                infoGrid.innerHTML = `
                    <div class="info-item">
                        <label>Display Name</label>
                        <input type="text" id="edit-name" class="edit-input" value="${user.name || ''}" placeholder="Full Name" required>
                    </div>
                    <div class="info-item">
                        <label>Email Address</label>
                        <div>${user.email || 'demo.customer@mixora.example'}</div>
                    </div>
                    <div class="info-item">
                        <label>Account Type</label>
                        <div>${user.type || 'Customer'}</div>
                    </div>
                    <div class="info-item">
                        <label>Member Since</label>
                        <div>${user.memberSince || '15 September 2026'}</div>
                    </div>
                    <div class="info-item">
                        <label>Preferred Currency</label>
                        <div>${user.currency || 'INR (₹)'}</div>
                    </div>
                    <div class="info-item">
                        <label>Account Status</label>
                        <div style="color: #A8D5BA;">● ${user.status || 'Active Member'}</div>
                    </div>
                `;
            } else {
                infoGrid.innerHTML = `
                    <div class="info-item">
                        <label>Display Name</label>
                        <div>${user.name || 'Aanya Demo'}</div>
                    </div>
                    <div class="info-item">
                        <label>Email Address</label>
                        <div>${user.email || 'demo.customer@mixora.example'}</div>
                    </div>
                    <div class="info-item">
                        <label>Account Type</label>
                        <div>${user.type || 'Customer'}</div>
                    </div>
                    <div class="info-item">
                        <label>Member Since</label>
                        <div>${user.memberSince || '15 September 2026'}</div>
                    </div>
                    <div class="info-item">
                        <label>Preferred Currency</label>
                        <div>${user.currency || 'INR (₹)'}</div>
                    </div>
                    <div class="info-item">
                        <label>Account Status</label>
                        <div style="color: #A8D5BA;">● ${user.status || 'Active Member'}</div>
                    </div>
                `;
            }
        }
        
        // 2. Drink Preferences Grid
        const prefsGrid = document.getElementById('preferences-info-grid');
        if (prefsGrid) {
            const p = user.preferences || {};
            if (isEditing) {
                prefsGrid.innerHTML = `
                    <div class="info-item">
                        <label>Favourite Category</label>
                        <input type="text" id="edit-cat" class="edit-input" value="${p.category || 'Boba Milk Tea'}">
                    </div>
                    <div class="info-item">
                        <label>Preferred Sweetness</label>
                        <select id="edit-sweetness" class="edit-input">
                            <option value="0%" ${p.sweetness === '0%' ? 'selected' : ''}>0% (Unsweetened)</option>
                            <option value="25%" ${p.sweetness === '25%' ? 'selected' : ''}>25% (Light)</option>
                            <option value="50%" ${p.sweetness === '50%' ? 'selected' : ''}>50% (Standard Half)</option>
                            <option value="75%" ${p.sweetness === '75%' ? 'selected' : ''}>75% (Less Sweet)</option>
                            <option value="100%" ${p.sweetness === '100%' ? 'selected' : ''}>100% (Full Sweet)</option>
                        </select>
                    </div>
                    <div class="info-item">
                        <label>Preferred Ice</label>
                        <select id="edit-ice" class="edit-input">
                            <option value="No Ice" ${p.ice === 'No Ice' ? 'selected' : ''}>No Ice</option>
                            <option value="Less Ice" ${p.ice === 'Less Ice' ? 'selected' : ''}>Less Ice</option>
                            <option value="Regular Ice" ${p.ice === 'Regular Ice' ? 'selected' : ''}>Regular Ice</option>
                            <option value="Extra Ice" ${p.ice === 'Extra Ice' ? 'selected' : ''}>Extra Ice</option>
                        </select>
                    </div>
                    <div class="info-item">
                        <label>Preferred Cup Size</label>
                        <select id="edit-size" class="edit-input">
                            <option value="Small" ${p.size === 'Small' ? 'selected' : ''}>Small (350ml)</option>
                            <option value="Medium" ${p.size === 'Medium' ? 'selected' : ''}>Medium (500ml)</option>
                            <option value="Large" ${p.size === 'Large' ? 'selected' : ''}>Large (700ml)</option>
                        </select>
                    </div>
                    <div class="info-item full-width">
                        <label>Dietary Preferences</label>
                        <input type="text" id="edit-dietary" class="edit-input" value="${p.dietary || 'None specified'}" placeholder="e.g., Oat milk, Vegan, Lactose-free">
                    </div>
                    <div class="info-item full-width">
                        <label>Allergy Information</label>
                        <input type="text" id="edit-allergies" class="edit-input" value="${p.allergies || 'Not provided'}" placeholder="e.g., Dairy, Nuts, Soy">
                    </div>
                `;
            } else {
                prefsGrid.innerHTML = `
                    <div class="info-item">
                        <label>Favourite Category</label>
                        <div>${p.category || 'Boba Milk Tea'}</div>
                    </div>
                    <div class="info-item">
                        <label>Preferred Sweetness</label>
                        <div>${p.sweetness || '50%'}</div>
                    </div>
                    <div class="info-item">
                        <label>Preferred Ice</label>
                        <div>${p.ice || 'Less Ice'}</div>
                    </div>
                    <div class="info-item">
                        <label>Preferred Cup Size</label>
                        <div>${p.size || 'Medium'}</div>
                    </div>
                    <div class="info-item full-width">
                        <label>Dietary Preferences</label>
                        <div>${p.dietary || 'None specified'}</div>
                    </div>
                    <div class="info-item full-width">
                        <label>Allergy Information</label>
                        <div>${p.allergies || 'Not provided'}</div>
                    </div>
                `;
            }
        }
        
        // 3. Saved Recipes Grid
        const recipesList = document.getElementById('recipes-list');
        if (recipesList) {
            if (recipes.length === 0) {
                recipesList.innerHTML = `
                    <div class="profile-empty-state" style="grid-column: 1 / -1;">
                        <div class="empty-icon">🧋</div>
                        <h4 class="empty-title">No saved recipes yet.</h4>
                        <p class="empty-desc">Discover your signature drink with our Boba Personality Lab or handcraft your dream boba from scratch in our Drink Studio.</p>
                        <div style="display: flex; gap: 0.85rem; flex-wrap: wrap; justify-content: center;">
                            <a href="customizer.html" class="btn btn-primary" style="font-size: 0.95rem;">Open Drink Studio</a>
                            <a href="lab.html" class="btn btn-outline" style="font-size: 0.95rem;">Personality Lab</a>
                        </div>
                    </div>
                `;
            } else {
                recipesList.innerHTML = recipes.map(r => {
                    const allToppings = [...(r.bobas || []), ...(r.jellies || []), ...(r.milks_foams || []), ...(r.syrups || []), ...(r.garnishes || [])];
                    const toppingsText = allToppings.length > 0 ? allToppings.join(', ') : 'No extra toppings';
                    const priceFormatted = r.unitPrice ? (window.Pricing ? window.Pricing.formatPrice(r.unitPrice) : `₹${r.unitPrice}`) : '₹129.00';
                    
                    return `
                        <div class="recipe-card">
                            <div class="recipe-card-top">
                                <div class="recipe-cup-icon">🧋</div>
                                <div class="recipe-card-info">
                                    <h4 class="recipe-card-title">${r.name}</h4>
                                    <div class="recipe-card-specs">
                                        <span>${r.size || 'Medium'}</span> • 
                                        <span>${r.sugar || '50%'} Sugar</span> • 
                                        <span>${r.ice || 'Regular Ice'}</span>
                                    </div>
                                    <span class="recipe-card-toppings">+ ${toppingsText}</span>
                                </div>
                            </div>
                            <div class="recipe-card-actions">
                                <span style="font-weight: 800; color: #FFC857; margin-right: auto; font-size: 1.05rem;">${priceFormatted}</span>
                                <a href="customizer.html?base=${r.baseDrinkId || 'd_classic_milk_tea'}" class="btn btn-outline" style="padding: 0.4rem 0.95rem; font-size: 0.85rem;">Customize</a>
                                <button class="btn btn-primary btn-order-recipe" data-id="${r.id}" style="padding: 0.4rem 0.95rem; font-size: 0.85rem;">Add to Cart</button>
                                ${isEditing ? `<button class="btn btn-outline btn-delete-recipe" data-id="${r.id}" style="padding: 0.4rem 0.75rem; font-size: 0.85rem; border-color: #FF4757; color: #FF4757;">Delete</button>` : ''}
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
        
        // 4. Saved Addresses Grid
        const addrList = document.getElementById('addresses-list');
        if (addrList) {
            if (addresses.length === 0) {
                addrList.innerHTML = `
                    <div class="profile-empty-state" style="grid-column: 1 / -1;">
                        <div class="empty-icon">📍</div>
                        <h4 class="empty-title">No saved addresses yet.</h4>
                        <p class="empty-desc">Your saved delivery locations will appear here for fast, one-tap checkout on all boba orders.</p>
                    </div>
                `;
            } else {
                addrList.innerHTML = addresses.map(a => `
                    <div class="address-card">
                        <div>
                            <div class="address-badge">📍 ${a.type || 'Location'}</div>
                            <div class="address-text" style="margin-top: 0.75rem;">${a.address || 'Address not set'}</div>
                        </div>
                        <div class="address-instructions">
                            <strong>Note:</strong> ${a.instructions || 'Standard contactless delivery'}
                        </div>
                    </div>
                `).join('');
            }
        }
    }
    
    // Edit / Save Profile Button Toggle
    const btnEditProfile = document.getElementById('btn-edit-profile');
    if (btnEditProfile) {
        btnEditProfile.addEventListener('click', (e) => {
            if (!isEditing) {
                isEditing = true;
                e.target.textContent = 'Save Changes';
                e.target.classList.remove('btn-primary');
                e.target.classList.add('btn-primary');
                e.target.style.boxShadow = '0 0 20px rgba(255, 200, 87, 0.6)';
                renderProfile();
            } else {
                // Input validation
                const editNameInput = document.getElementById('edit-name');
                const newName = editNameInput ? editNameInput.value.trim() : '';
                if (!newName) {
                    alert('Please enter a valid display name.');
                    if (editNameInput) editNameInput.focus();
                    return;
                }

                const catInput = document.getElementById('edit-cat');
                const sweetInput = document.getElementById('edit-sweetness');
                const iceInput = document.getElementById('edit-ice');
                const sizeInput = document.getElementById('edit-size');
                const dietInput = document.getElementById('edit-dietary');
                const allergyInput = document.getElementById('edit-allergies');

                const updatedFields = {
                    name: newName,
                    preferences: {
                        category: catInput ? catInput.value.trim() : (user.preferences?.category || 'Boba Milk Tea'),
                        sweetness: sweetInput ? sweetInput.value : (user.preferences?.sweetness || '50%'),
                        ice: iceInput ? iceInput.value : (user.preferences?.ice || 'Less Ice'),
                        size: sizeInput ? sizeInput.value : (user.preferences?.size || 'Medium'),
                        dietary: dietInput ? dietInput.value.trim() : (user.preferences?.dietary || 'None specified'),
                        allergies: allergyInput ? allergyInput.value.trim() : (user.preferences?.allergies || 'Not provided')
                    }
                };
                
                // Save via single source of truth
                if (window.Storage.UserProfile) {
                    window.Storage.UserProfile.save(updatedFields);
                } else {
                    Object.assign(user, updatedFields);
                    window.Storage.set(window.Storage.KEYS.USER, user);
                }
                
                updateHeaderAndSidebar();
                
                isEditing = false;
                e.target.textContent = 'Edit Profile';
                e.target.style.boxShadow = '';
                renderProfile();
            }
        });
    }
    
    // Recipe Actions: Delete and Order Directly
    const recipesContainer = document.getElementById('recipes-list');
    if (recipesContainer) {
        recipesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete-recipe')) {
                const id = e.target.getAttribute('data-id');
                let recipes = window.Storage.get(window.Storage.KEYS.SAVED_RECIPES, []);
                recipes = recipes.filter(r => r.id !== id);
                window.Storage.set(window.Storage.KEYS.SAVED_RECIPES, recipes);
                renderProfile();
            } else if (e.target.classList.contains('btn-order-recipe')) {
                const id = e.target.getAttribute('data-id');
                const recipes = window.Storage.get(window.Storage.KEYS.SAVED_RECIPES, []);
                const found = recipes.find(r => r.id === id);
                if (found && window.ShoppingCart) {
                    window.ShoppingCart.addItem({
                        baseDrinkId: found.baseDrinkId || 'd_classic_milk_tea',
                        name: found.name,
                        size: found.size || 'Medium',
                        bobas: [...(found.bobas || [])],
                        jellies: [...(found.jellies || [])],
                        milks_foams: [...(found.milks_foams || [])],
                        syrups: [...(found.syrups || [])],
                        garnishes: [...(found.garnishes || [])],
                        ice: found.ice || 'Regular Ice',
                        sugar: found.sugar || '50%',
                        unitPrice: found.unitPrice || 129,
                        quantity: 1
                    });
                    const originalText = e.target.textContent;
                    e.target.textContent = '✓ Added!';
                    setTimeout(() => { e.target.textContent = originalText; }, 2000);
                }
            }
        });
    }

    // Listen to profile updates broadcasted from anywhere in the application
    window.addEventListener('mixora:user_updated', (e) => {
        user = e.detail || getActiveUser();
        updateHeaderAndSidebar();
        if (!isEditing) {
            renderProfile();
        }
    });

    renderProfile();
});
