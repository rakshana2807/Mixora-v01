// Visualizer Core Logic
const VisualizerState = {
    baseDrinkId: 'd_classic_milk_tea',
    size: 'Medium',
    sugar: '100%',
    ice: 'Regular Ice',
    bobas: [],
    jellies: [],
    milks_foams: [],
    syrups: [],
    garnishes: []
};

// SVG Definitions for the cup
const SVG_CUP_TEMPLATE = (state, baseInfo) => {
    // Determine heights and widths based on size
    let width = 235, height = 325;
    if (state.size === 'Small') { width = 210; height = 285; }
    if (state.size === 'Large') { width = 260; height = 365; }
    
    const cupTopW = width * 0.9;
    const cupBotW = width * 0.65;
    
    const liquidColor = baseInfo.imageColor;
    
    let iceAmount = 0;
    if (state.ice === 'Less Ice') iceAmount = 3;
    if (state.ice === 'Regular Ice') iceAmount = 6;
    if (state.ice === 'Extra Ice') iceAmount = 10;
    if (state.ice === 'Crushed Ice') iceAmount = 15;
    if (state.ice === 'Clear Ice Cubes') iceAmount = 8;
    
    const hasWhip = state.milks_foams.some(m => window.MIXORA_PRICES.milks_foams[m] && window.MIXORA_PRICES.milks_foams[m].type === 'whip');
    const hasFoam = state.milks_foams.some(m => window.MIXORA_PRICES.milks_foams[m] && window.MIXORA_PRICES.milks_foams[m].type === 'foam');
    const hasScoop = state.milks_foams.some(m => window.MIXORA_PRICES.milks_foams[m] && window.MIXORA_PRICES.milks_foams[m].type === 'scoop');

    return `
    <svg id="drink-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height + 20}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="cupHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#fff" stop-opacity="0.12" />
                <stop offset="12%" stop-color="#fff" stop-opacity="0.28" />
                <stop offset="18%" stop-color="#fff" stop-opacity="0.08" />
                <stop offset="82%" stop-color="#fff" stop-opacity="0.08" />
                <stop offset="100%" stop-color="#fff" stop-opacity="0.18" />
            </linearGradient>
            
            <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="${liquidColor}" stop-opacity="0.9" />
                <stop offset="100%" stop-color="${liquidColor}" stop-opacity="1" />
            </linearGradient>
            
            <clipPath id="cupClip">
                <polygon points="${(width - cupTopW)/2},40 ${(width + cupTopW)/2},40 ${(width + cupBotW)/2},${height - 10} ${(width - cupBotW)/2},${height - 10}" />
            </clipPath>
        </defs>
        
        <!-- Contact Shadow -->
        <ellipse cx="${width/2}" cy="${height + 5}" rx="${cupBotW/2 + 10}" ry="10" fill="rgba(0,0,0,0.1)" />

        <!-- Liquid Area (clipped) -->
        <g clip-path="url(#cupClip)">
            <!-- Liquid Body -->
            <rect x="0" y="50" width="${width}" height="${height}" fill="url(#liquidGrad)" />
            
            <!-- Syrups -->
            ${state.syrups.map((syrup, idx) => {
                const sData = window.MIXORA_PRICES.syrups[syrup];
                if(!sData) return '';
                const color = sData.color || '#000';
                const yOffset = 60 + (idx * 15);
                return `<path d="M0,${yOffset} Q${width/4},${yOffset+40} ${width/2},${yOffset+20} T${width},${yOffset+10} L${width},${yOffset+60} Q${width*0.75},${yOffset+90} ${width/2},${yOffset+70} T0,${yOffset+80} Z" fill="${color}" opacity="0.6"/>`;
            }).join('')}

            <!-- Ice Cubes -->
            ${Array.from({length: iceAmount}).map((_, i) => {
                const x = width*0.3 + (i%3)*20 + Math.random()*10;
                const y = 80 + Math.floor(i/3)*30 + Math.random()*20;
                const isCrushed = state.ice === 'Crushed Ice';
                const isClear = state.ice === 'Clear Ice Cubes';
                const s = isCrushed ? 10 : 25;
                const o = isClear ? 0.2 : (isCrushed ? 0.6 : 0.4);
                return `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="5" fill="#fff" opacity="${o}" transform="rotate(${Math.random()*45}, ${x+s/2}, ${y+s/2})" />`;
            }).join('')}
            
            <!-- Bobas -->
            ${state.bobas.map((boba, bIdx) => {
                const bData = window.MIXORA_PRICES.bobas[boba];
                if(!bData) return '';
                return Array.from({length: 25}).map((_, i) => {
                    const x = (width - cupBotW)/2 + 10 + Math.random() * (cupBotW - 20);
                    const y = height - 10 - Math.random() * 40 - (bIdx * 5); // stack slightly
                    const r = bData.type === 'tapioca_mini' ? 4 : 6;
                    const c = bData.color === 'rainbow' ? ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'][i%4] : bData.color;
                    if(bData.type === 'tapioca' || bData.type === 'tapioca_mini') {
                        return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" /><circle cx="${x-2}" cy="${y-2}" r="${r/4}" fill="#fff" opacity="0.4"/>`;
                    }
                    if(bData.type === 'crystal') {
                        return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="0.7" /><circle cx="${x}" cy="${y}" r="${r-1}" fill="none" stroke="#fff" opacity="0.5"/>`;
                    }
                    if(bData.type === 'popping') {
                        return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="0.9" /><circle cx="${x+2}" cy="${y-2}" r="1" fill="#fff" opacity="0.8"/>`;
                    }
                    return '';
                }).join('');
            }).join('')}

            <!-- Jellies -->
            ${state.jellies.map((jelly, jIdx) => {
                const jData = window.MIXORA_PRICES.jellies[jelly];
                if(!jData) return '';
                return Array.from({length: 15}).map((_, i) => {
                    const x = (width - cupBotW)/2 + 15 + Math.random() * (cupBotW - 30);
                    const y = height - 15 - Math.random() * 40 - (jIdx * 10);
                    const c = jData.color === 'rainbow' ? ['#FF69B4', '#FFA500', '#00FA9A'][i%3] : jData.color;
                    if (jData.type === 'cube') {
                        return `<rect x="${x}" y="${y}" width="12" height="12" fill="${c}" opacity="0.8" rx="2" />`;
                    }
                    if (jData.type === 'round' || jData.type === 'bean') {
                        return `<circle cx="${x}" cy="${y}" r="6" fill="${c}" opacity="0.9"/>`;
                    }
                    if (jData.type === 'pudding_layer') {
                        // Just render a layer instead of random pieces
                        if(i===0) return `<rect x="0" y="${height-40 - jIdx*15}" width="${width}" height="30" fill="${c}" opacity="0.9"/>`;
                        return '';
                    }
                    return '';
                }).join('');
            }).join('')}
            
            <!-- Foams -->
            ${state.milks_foams.map((mf) => {
                const mfData = window.MIXORA_PRICES.milks_foams[mf];
                if(mfData && mfData.type === 'foam') {
                    return `<rect x="0" y="45" width="${width}" height="25" fill="${mfData.color}" opacity="0.95"/>`;
                }
                return '';
            }).join('')}
            
        </g>

        <!-- Straw -->
        <rect x="${width/2 - 5}" y="-20" width="10" height="${height+10}" fill="#173F3A" rx="2"/>
        <rect x="${width/2 - 2}" y="-20" width="2" height="${height+10}" fill="#fff" opacity="0.4"/>

        <!-- Lid / Whip Top / Scoop -->
        ${(() => {
            let topElements = '';
            
            // Draw Whip
            const whips = state.milks_foams.filter(m => window.MIXORA_PRICES.milks_foams[m] && window.MIXORA_PRICES.milks_foams[m].type === 'whip');
            if(whips.length > 0) {
                const c = window.MIXORA_PRICES.milks_foams[whips[0]].color;
                topElements += `<path d="M${width/2 - 40},40 Q${width/2 - 20},0 ${width/2},0 T${width/2 + 40},40 Z" fill="${c}" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.1))"/>`;
            }
            
            // Draw Scoop
            const scoops = state.milks_foams.filter(m => window.MIXORA_PRICES.milks_foams[m] && window.MIXORA_PRICES.milks_foams[m].type === 'scoop');
            if(scoops.length > 0) {
                const c = window.MIXORA_PRICES.milks_foams[scoops[0]].color;
                topElements += `<circle cx="${width/2}" cy="25" r="25" fill="${c}" filter="drop-shadow(0 2px 2px rgba(0,0,0,0.1))"/>`;
            }
            
            // Draw Garnishes
            state.garnishes.forEach((g) => {
                const gData = window.MIXORA_PRICES.garnishes[g];
                if(!gData) return;
                if(gData.type === 'fruit') {
                    topElements += `<circle cx="${width/2 + 30}" cy="35" r="12" fill="#FF4500" opacity="0.9"/>`;
                }
                if(gData.type === 'leaf') {
                    topElements += `<path d="M${width/2 - 15},35 Q${width/2 - 30},20 ${width/2 - 40},35 Q${width/2 - 30},45 ${width/2 - 15},35 Z" fill="#228B22"/>`;
                }
                if(['crumb', 'flake', 'dust', 'sprinkle'].includes(gData.type)) {
                    for(let i=0; i<15; i++) {
                        const x = width/2 - 30 + Math.random()*60;
                        const y = 15 + Math.random()*20;
                        const c = gData.type === 'sprinkle' ? ['red','blue','yellow','green'][i%4] : '#3E2723';
                        topElements += `<circle cx="${x}" cy="${y}" r="2" fill="${c}"/>`;
                    }
                }
                if(gData.type === 'drizzle') {
                    const c = g.includes('Caramel') ? '#D2691E' : '#DAA520';
                    topElements += `<path d="M${width/2-30},25 Q${width/2},10 ${width/2+30},25" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
                }
            });
            
            if(topElements === '') {
                topElements = `<ellipse cx="${width/2}" cy="40" rx="${cupTopW/2 + 5}" ry="5" fill="#fff" opacity="0.9"/>`;
            }
            return topElements;
        })()}

        <!-- Cup Body (Plastic Shine & Border) -->
        <polygon points="${(width - cupTopW)/2},40 ${(width + cupTopW)/2},40 ${(width + cupBotW)/2},${height - 10} ${(width - cupBotW)/2},${height - 10}" fill="url(#cupHighlight)" fill-opacity="0.18" stroke="rgba(255,255,255,0.45)" stroke-width="1.5"/>
        
        <!-- Cup Rim -->
        <ellipse cx="${width/2}" cy="40" rx="${cupTopW/2}" ry="8" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="3"/>
        
        <!-- Cup Base -->
        <ellipse cx="${width/2}" cy="${height - 10}" rx="${cupBotW/2}" ry="6" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"/>
    </svg>
    `;
};

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('drink-svg-wrapper')) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedBase = urlParams.get('base');
    if (preSelectedBase && window.MIXORA_MENU.find(d => d.id === preSelectedBase)) {
        VisualizerState.baseDrinkId = preSelectedBase;
    }

    renderControls();
    updateVisualizer();
    setupListeners();
});

function renderControls() {
    const baseSelector = document.getElementById('base-options');
    baseSelector.innerHTML = window.MIXORA_MENU.map(drink => `
        <div class="base-card ${drink.id === VisualizerState.baseDrinkId ? 'active' : ''}" data-id="${drink.id}">
            <div class="base-color" style="background-color: ${drink.imageColor}"></div>
            <div style="font-size: 0.85rem; font-weight: 500;">${drink.name}</div>
        </div>
    `).join('');

    const renderList = (id, dataObj, stateArr, name) => {
        const el = document.getElementById(id);
        if(!el) return;
        el.innerHTML = Object.keys(dataObj).map(key => `
            <label class="checkbox-label">
                <input type="checkbox" name="${name}" value="${key}" ${stateArr.includes(key) ? 'checked' : ''}>
                ${key}
                ${dataObj[key].price > 0 ? `<span class="addon-price">+₹${dataObj[key].price}</span>` : ''}
            </label>
        `).join('');
    };

    renderList('bobas-list', window.MIXORA_PRICES.bobas, VisualizerState.bobas, 'bobas');
    renderList('jellies-list', window.MIXORA_PRICES.jellies, VisualizerState.jellies, 'jellies');
    renderList('milks-foams-list', window.MIXORA_PRICES.milks_foams, VisualizerState.milks_foams, 'milks_foams');
    renderList('syrups-list', window.MIXORA_PRICES.syrups, VisualizerState.syrups, 'syrups');
    renderList('garnishes-list', window.MIXORA_PRICES.garnishes, VisualizerState.garnishes, 'garnishes');
}

function setupListeners() {
    document.getElementById('base-options').addEventListener('click', (e) => {
        const card = e.target.closest('.base-card');
        if (card) {
            document.querySelectorAll('.base-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            VisualizerState.baseDrinkId = card.getAttribute('data-id');
            updateVisualizer();
        }
    });

    document.querySelectorAll('input[name="cup-size"]').forEach(input => {
        input.addEventListener('change', (e) => {
            VisualizerState.size = e.target.value;
            updateVisualizer();
        });
    });

    const sugarSlider = document.getElementById('sugar-slider');
    const sugarVal = document.getElementById('sugar-val');
    sugarSlider.addEventListener('input', (e) => {
        sugarVal.textContent = e.target.value + '%';
        VisualizerState.sugar = e.target.value + '%';
    });

    document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            VisualizerState.ice = e.target.getAttribute('data-val');
            updateVisualizer();
        });
    });

    document.querySelector('.addons-grid').addEventListener('change', (e) => {
        const name = e.target.name;
        if (VisualizerState[name] !== undefined) {
            if (e.target.checked) VisualizerState[name].push(e.target.value);
            else VisualizerState[name] = VisualizerState[name].filter(v => v !== e.target.value);
            updateVisualizer();
        }
    });
    
    document.getElementById('btn-add-cart').addEventListener('click', () => {
        const drink = window.MIXORA_MENU.find(d => d.id === VisualizerState.baseDrinkId);
        window.ShoppingCart.addItem({
            baseDrinkId: VisualizerState.baseDrinkId,
            name: drink.name,
            size: VisualizerState.size,
            bobas: [...VisualizerState.bobas],
            jellies: [...VisualizerState.jellies],
            milks_foams: [...VisualizerState.milks_foams],
            syrups: [...VisualizerState.syrups],
            garnishes: [...VisualizerState.garnishes],
            ice: VisualizerState.ice,
            sugar: VisualizerState.sugar,
            unitPrice: window.Pricing.calculateDrinkPrice(
                VisualizerState.baseDrinkId,
                VisualizerState.size,
                VisualizerState.bobas,
                VisualizerState.jellies,
                VisualizerState.milks_foams,
                VisualizerState.syrups,
                VisualizerState.garnishes
            )
        });
        
        const btn = document.getElementById('btn-add-cart');
        const originalText = btn.textContent;
        btn.textContent = 'Added to Cart!';
        btn.classList.add('btn-secondary');
        btn.classList.remove('btn-primary');
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
        }, 2000);
    });
    
    document.getElementById('btn-surprise').addEventListener('click', () => {
        const bases = window.MIXORA_MENU.map(d => d.id);
        const sizes = ['Small', 'Medium', 'Large'];
        const ice = ['No Ice', 'Less Ice', 'Regular Ice', 'Extra Ice'];
        
        VisualizerState.baseDrinkId = bases[Math.floor(Math.random() * bases.length)];
        VisualizerState.size = sizes[Math.floor(Math.random() * sizes.length)];
        VisualizerState.ice = ice[Math.floor(Math.random() * ice.length)];
        VisualizerState.sugar = (Math.floor(Math.random() * 5) * 25) + '%';
        
        VisualizerState.bobas = [];
        VisualizerState.jellies = [];
        VisualizerState.milks_foams = [];
        VisualizerState.syrups = [];
        VisualizerState.garnishes = [];
        
        // Randomly pick a boba
        const bobas = Object.keys(window.MIXORA_PRICES.bobas);
        VisualizerState.bobas.push(bobas[Math.floor(Math.random() * bobas.length)]);
        
        document.querySelector(`input[name="cup-size"][value="${VisualizerState.size}"]`).checked = true;
        document.getElementById('sugar-slider').value = parseInt(VisualizerState.sugar);
        document.getElementById('sugar-val').textContent = VisualizerState.sugar;
        
        document.querySelectorAll('.pill-btn').forEach(b => {
            if(b.getAttribute('data-val') === VisualizerState.ice) b.classList.add('active');
            else b.classList.remove('active');
        });
        
        renderControls();
        updateVisualizer();
    });
}

function updateVisualizer() {
    const baseInfo = window.MIXORA_MENU.find(d => d.id === VisualizerState.baseDrinkId);
    
    document.getElementById('recipe-title').textContent = `Custom ${baseInfo.name}`;
    
    const price = window.Pricing.calculateDrinkPrice(
        VisualizerState.baseDrinkId,
        VisualizerState.size,
        VisualizerState.bobas,
        VisualizerState.jellies,
        VisualizerState.milks_foams,
        VisualizerState.syrups,
        VisualizerState.garnishes
    );
    document.getElementById('total-price').textContent = window.Pricing.formatPrice(price);
    
    const svgContainer = document.getElementById('drink-svg-wrapper');
    svgContainer.innerHTML = SVG_CUP_TEMPLATE(VisualizerState, baseInfo);
    
    let cal = 150;
    if (VisualizerState.size === 'Medium') cal += 50;
    if (VisualizerState.size === 'Large') cal += 100;
    cal += VisualizerState.bobas.length * 50;
    cal += VisualizerState.jellies.length * 40;
    cal += VisualizerState.syrups.length * 60;
    cal += VisualizerState.milks_foams.length * 80;
    
    let allergens = [];
    if(baseInfo.base === 'milk' || baseInfo.base === 'milkshake' || baseInfo.base === 'smoothie') allergens.push('Milk/Dairy');
    
    // Check toppings for dairy
    const dairyToppings = ['Milk Foam', 'Cheese Foam', 'Cold Foam', 'Vanilla Sweet Cream', 'Whipped Cream', 'Chocolate Cream', 'Vanilla Ice Cream Scoop', 'Chocolate Ice Cream Scoop', 'Strawberry Ice Cream Scoop', 'Regular Milk', 'Extra Milk'];
    if (VisualizerState.milks_foams.some(m => dairyToppings.includes(m))) {
        if(!allergens.includes('Milk/Dairy')) allergens.push('Milk/Dairy');
    }
    
    const nutsToppings = ['Almond Milk', 'Hazelnut Syrup'];
    if (VisualizerState.milks_foams.some(m => nutsToppings.includes(m)) || VisualizerState.syrups.some(s => nutsToppings.includes(s))) {
        allergens.push('Tree Nuts');
    }
    
    const soyToppings = ['Soy Milk'];
    if (VisualizerState.milks_foams.some(m => soyToppings.includes(m))) {
        allergens.push('Soy');
    }
    
    document.getElementById('nutrition-details').innerHTML = `
        <strong>Calories:</strong> ~${cal} kcal <br>
        <strong>Sugar:</strong> ${VisualizerState.sugar} <br>
        <strong>Allergens:</strong> ${allergens.length > 0 ? allergens.join(', ') : 'None specified'}
    `;
}
