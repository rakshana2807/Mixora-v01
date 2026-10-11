/**
 * Calculates the total price of a customized drink.
 * Formula: Base Price + Size Surcharge + Add-ons
 */
function calculateDrinkPrice(baseDrinkId, size, bobas = [], jellies = [], milks_foams = [], syrups = [], garnishes = []) {
    const drink = window.MIXORA_MENU.find(d => d.id === baseDrinkId);
    if (!drink) return 0;
    
    let total = drink.basePrice;
    
    // Size surcharge
    const sizeSurcharge = window.MIXORA_PRICES.size_surcharge[size] || 0;
    total += sizeSurcharge;
    
    // Bobas
    bobas.forEach(b => {
        if (window.MIXORA_PRICES.bobas[b]) total += window.MIXORA_PRICES.bobas[b].price;
    });
    // Jellies
    jellies.forEach(j => {
        if (window.MIXORA_PRICES.jellies[j]) total += window.MIXORA_PRICES.jellies[j].price;
    });
    // Milks & Foams
    milks_foams.forEach(m => {
        if (window.MIXORA_PRICES.milks_foams[m]) total += window.MIXORA_PRICES.milks_foams[m].price;
    });
    // Syrups
    syrups.forEach(s => {
        if (window.MIXORA_PRICES.syrups[s]) total += window.MIXORA_PRICES.syrups[s].price;
    });
    // Garnishes
    garnishes.forEach(g => {
        if (window.MIXORA_PRICES.garnishes[g]) total += window.MIXORA_PRICES.garnishes[g].price;
    });
    
    return total;
}

/**
 * Format price to Indian Rupees
 */
function formatPrice(amount) {
    return `₹${amount.toFixed(2)}`;
}

window.Pricing = {
    calculateDrinkPrice,
    formatPrice
};
