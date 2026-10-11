// Global exports for lab interactions
window.startPersonalityQuiz = function() {
    if (typeof window.initLabQuiz === 'function') {
        window.initLabQuiz();
    } else {
        document.querySelectorAll('.lab-view').forEach(v => v.classList.remove('active'));
        const assessment = document.getElementById('lab-step-assessment');
        if (assessment) {
            assessment.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    let selectedPersonality = null;
    let currentRecipeId = generateRecipeId();
    let svgCloneSequence = 0;
    let currentRecommendation = null;
    let activeQuizStep = 1;

    // 3-Question Mood Assessment State
    const quizState = {
        energy: null,   // Q1: radiant_electric, velvety_comforting, playful_sweet, fresh_harmonious
        flavor: null,   // Q2: creamy_milky, fruity_tropical, bold_roasted, light_refreshing
        texture: null   // Q3: chewy_boba, popping_boba, creamy_smooth, light_clean
    };

    switchView('lab-step-quiz');

    const personalityRules = {
        "Softie": {
            base: "d_taro_milk_tea",
            bobas: ["Classic Black Tapioca Pearls"],
            sugar: "50%",
            ice: "Regular Ice",
            size: "Medium",
            name: "The Softie",
            desc: "Creamy, sweet, comforting flavours that wrap you in soothing indulgence."
        },
        "Main Character": {
            base: "d_brown_sugar_boba",
            bobas: ["Brown Sugar Tapioca Pearls"],
            sugar: "75%",
            ice: "Less Ice",
            size: "Medium",
            name: "The Main Character",
            desc: "Bold, rich, statement-making flavours with caramelized brown sugar depth."
        },
        "Fruity Bestie": {
            base: "d_mango_green",
            bobas: ["Mango Popping Boba"],
            sugar: "50%",
            ice: "Regular Ice",
            size: "Medium",
            name: "The Fruity Bestie",
            desc: "Fruity, refreshing, vibrant combinations bursting with juicy tropical sunshine."
        },
        "Chill Soul": {
            base: "d_jasmine_green",
            bobas: ["Crystal Boba"],
            sugar: "25%",
            ice: "Less Ice",
            size: "Medium",
            name: "The Chill Soul",
            desc: "Light, refreshing tea-based drink providing serene, floral tranquility."
        },
        "Chaos Creator": {
            base: "d_strawberry_matcha",
            bobas: ["Mango Popping Boba"],
            sugar: "50%",
            ice: "Less Ice",
            size: "Medium",
            name: "The Chaos Creator",
            desc: "Unexpected but thoughtfully paired flavour combinations for adventurous palates."
        }
    };

    function generateRecipeId() {
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint8Array(3);
            window.crypto.getRandomValues(array);
            return 'BOBA-' + Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        }
        return 'BOBA-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    function switchView(viewId) {
        const target = document.getElementById(viewId);
        if (!target) return;

        document.querySelectorAll('.lab-view').forEach(v => v.classList.remove('active'));
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function cloneSvgInto(target, source) {
        if (!target || !source) return;
        const template = document.createElement('template');
        template.innerHTML = source;

        const idMap = new Map();
        template.content.querySelectorAll('[id]').forEach(element => {
            const originalId = element.id;
            const uniqueId = `lab-svg-${++svgCloneSequence}-${originalId}`;
            idMap.set(originalId, uniqueId);
            element.id = uniqueId;
        });

        template.content.querySelectorAll('*').forEach(element => {
            [...element.attributes].forEach(attribute => {
                let value = attribute.value.replace(/url\(#([^)]+)\)/g, (match, id) =>
                    `url(#${idMap.get(id) || id})`
                );
                if ((attribute.name === 'href' || attribute.name === 'xlink:href') && value.startsWith('#')) {
                    value = `#${idMap.get(value.slice(1)) || value.slice(1)}`;
                }
                element.setAttribute(attribute.name, value);
            });
        });

        target.replaceChildren(template.content);
    }

    // Step 1: Horizontal Personality Selector Logic
    const quizValidation = document.getElementById('quiz-validation-message');
    const showQuizValidation = (message) => {
        if (!quizValidation) return;
        quizValidation.textContent = message;
    };

    document.querySelectorAll('.personality-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.personality-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedPersonality = card.getAttribute('data-id');
            const btn = document.getElementById('btn-quiz-continue');
            if (btn) btn.disabled = false;
            showQuizValidation('');
        });
    });

    const btnQuizContinue = document.getElementById('btn-quiz-continue');
    if (btnQuizContinue) {
        btnQuizContinue.addEventListener('click', () => {
            if (!selectedPersonality) {
                showQuizValidation('Please choose a personality to continue.');
                return;
            }
            showQuizValidation('');
            // Map personality to initial quiz state if selected directly
            if (selectedPersonality === "Softie") {
                quizState.energy = "velvety_comforting"; quizState.flavor = "creamy_milky"; quizState.texture = "chewy_boba";
            } else if (selectedPersonality === "Main Character") {
                quizState.energy = "radiant_electric"; quizState.flavor = "bold_roasted"; quizState.texture = "chewy_boba";
            } else if (selectedPersonality === "Fruity Bestie") {
                quizState.energy = "playful_sweet"; quizState.flavor = "fruity_tropical"; quizState.texture = "popping_boba";
            } else if (selectedPersonality === "Chill Soul") {
                quizState.energy = "fresh_harmonious"; quizState.flavor = "light_refreshing"; quizState.texture = "light_clean";
            } else if (selectedPersonality === "Chaos Creator") {
                quizState.energy = "radiant_electric"; quizState.flavor = "fruity_tropical"; quizState.texture = "popping_boba";
            }
            calculateAndApplyRecommendation();
            switchView('lab-step-recommendation');
        });
    }

    const btnQuizBack = document.getElementById('btn-quiz-back');
    if (btnQuizBack) {
        btnQuizBack.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    const btnRecBack = document.getElementById('btn-rec-back');
    if (btnRecBack) {
        btnRecBack.addEventListener('click', () => {
            switchView('lab-step-quiz');
        });
    }

    // "Take the Personality Quiz" CTA button
    const btnTakeQuiz = document.getElementById('btn-take-quiz');
    if (btnTakeQuiz) {
        btnTakeQuiz.addEventListener('click', (e) => {
            e.preventDefault();
            startPersonalityQuiz();
        });
    }

    function startPersonalityQuiz() {
        activeQuizStep = 1;
        updateAssessmentStepView();
        switchView('lab-step-assessment');
    }

    window.startPersonalityQuiz = startPersonalityQuiz;
    window.initLabQuiz = startPersonalityQuiz;
    window.switchView = switchView;

    // 3-Step Assessment Selection
    document.querySelectorAll('#lab-step-assessment .quiz-option-card').forEach(card => {
        const handleSelect = () => {
            const key = card.getAttribute('data-key');
            const value = card.getAttribute('data-value');
            
            const parentStep = card.closest('.question-step');
            if (parentStep) {
                parentStep.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
            }
            card.classList.add('selected');
            quizState[key] = value;
            
            // Enable Next/Discover button
            const nextBtn = document.getElementById('btn-quiz-step-next');
            if (nextBtn) nextBtn.disabled = false;
        };

        card.addEventListener('click', handleSelect);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelect();
            }
        });
    });

    function updateAssessmentStepView() {
        const steps = document.querySelectorAll('#lab-step-assessment .question-step');
        steps.forEach(s => {
            const stepNum = parseInt(s.getAttribute('data-step'));
            if (stepNum === activeQuizStep) s.classList.add('active');
            else s.classList.remove('active');
        });

        const progressPct = Math.round((activeQuizStep / 3) * 100);
        const progressFill = document.getElementById('quiz-progress-fill');
        const progressPctEl = document.getElementById('quiz-progress-pct');
        const stepTitleEl = document.getElementById('quiz-step-title');

        if (progressFill) progressFill.style.width = `${progressPct}%`;
        if (progressPctEl) progressPctEl.textContent = `${progressPct}%`;
        if (stepTitleEl) stepTitleEl.textContent = `QUESTION ${activeQuizStep} OF 3`;

        const nextBtn = document.getElementById('btn-quiz-step-next');
        if (nextBtn) {
            if (activeQuizStep === 3) {
                nextBtn.textContent = 'Discover My Drink ✨';
            } else {
                nextBtn.textContent = 'Continue';
            }

            // Check if current step has an answer selected
            let currentKey = activeQuizStep === 1 ? 'energy' : (activeQuizStep === 2 ? 'flavor' : 'texture');
            nextBtn.disabled = !quizState[currentKey];
        }
    }

    // Assessment Navigation Controls
    const btnStepBack = document.getElementById('btn-quiz-step-back');
    if (btnStepBack) {
        btnStepBack.addEventListener('click', () => {
            if (activeQuizStep > 1) {
                activeQuizStep--;
                updateAssessmentStepView();
            } else {
                switchView('lab-step-quiz');
            }
        });
    }

    const btnStepNext = document.getElementById('btn-quiz-step-next');
    if (btnStepNext) {
        btnStepNext.addEventListener('click', () => {
            let currentKey = activeQuizStep === 1 ? 'energy' : (activeQuizStep === 2 ? 'flavor' : 'texture');
            if (!quizState[currentKey]) return; // Do not proceed without a valid selection

            if (activeQuizStep < 3) {
                activeQuizStep++;
                updateAssessmentStepView();
            } else {
                calculateAndApplyRecommendation();
                switchView('lab-step-recommendation');
            }
        });
    }

    /**
     * Rule-Based Recommendation Engine:
     * Analyzes all three answers and selects exactly ONE genuine product from MIXORA_MENU.
     * Generates a tailored explanation and calculates authentic price and match score.
     */
    function calculateAndApplyRecommendation() {
        const energy = quizState.energy || "radiant_electric";
        const flavor = quizState.flavor || "bold_roasted";
        const texture = quizState.texture || "chewy_boba";

        // Score drinks in MENU_DATA based on the 3 answers
        const candidateScores = window.MIXORA_MENU.map(drink => {
            let score = 40;
            let matchTags = [];

            // 1. Energy Match
            if (energy === "radiant_electric") {
                if (drink.category === "Brown Sugar Boba" || drink.category === "Coffee" || drink.bestSeller) {
                    score += 25;
                    matchTags.push("energetic bold notes");
                }
            } else if (energy === "velvety_comforting") {
                if (drink.id === "d_taro_milk_tea" || drink.category === "Milk Tea" || drink.base === "milk" || drink.category === "Milkshakes") {
                    score += 25;
                    matchTags.push("comforting creamy notes");
                }
            } else if (energy === "playful_sweet") {
                if (drink.category === "Fruit Tea" || drink.id.includes("strawberry") || drink.id.includes("mango") || drink.category === "Smoothies") {
                    score += 25;
                    matchTags.push("cheerful sweet fruit");
                }
            } else if (energy === "fresh_harmonious") {
                if (drink.id === "d_jasmine_green" || drink.category === "Fruit Tea" || drink.id === "d_honey_lemon" || drink.base === "tea") {
                    score += 25;
                    matchTags.push("calm balanced tea");
                }
            }

            // 2. Flavor Match
            if (flavor === "creamy_milky") {
                if (drink.category === "Milk Tea" || drink.base === "milk" || drink.id === "d_taro_milk_tea" || drink.id === "d_vanilla_latte") {
                    score += 25;
                }
            } else if (flavor === "fruity_tropical") {
                if (drink.category === "Fruit Tea" || drink.base === "fruit" || drink.id.includes("mango") || drink.id.includes("passion") || drink.id.includes("peach")) {
                    score += 25;
                }
            } else if (flavor === "bold_roasted") {
                if (drink.category === "Brown Sugar Boba" || drink.category === "Coffee" || drink.category === "Matcha" || drink.id === "d_hojicha_latte" || drink.id === "d_classic_milk_tea") {
                    score += 25;
                }
            } else if (flavor === "light_refreshing") {
                if (drink.id === "d_jasmine_green" || drink.id === "d_honey_lemon" || drink.id === "d_peach_iced_tea" || drink.category === "Fruit Tea") {
                    score += 25;
                }
            }

            // 3. Texture Affinity
            if (texture === "chewy_boba") {
                if (drink.category === "Brown Sugar Boba" || drink.category === "Milk Tea") score += 10;
            } else if (texture === "popping_boba") {
                if (drink.category === "Fruit Tea" || drink.base === "fruit") score += 10;
            } else if (texture === "creamy_smooth") {
                if (drink.base === "milk" || drink.category === "Milkshakes" || drink.category === "Smoothies") score += 10;
            } else if (texture === "light_clean") {
                if (drink.base === "tea") score += 10;
            }

            // Authentic clamped match percentage
            score = Math.min(99, Math.max(78, Math.round(score)));

            return {
                drink,
                score,
                matchTags
            };
        });

        // Deterministic sorting: Highest score, then bestSeller, then alphabetical name
        candidateScores.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (b.drink.bestSeller && !a.drink.bestSeller) return 1;
            if (!b.drink.bestSeller && a.drink.bestSeller) return -1;
            return a.drink.name.localeCompare(b.drink.name);
        });

        // Exactly ONE recommended product
        const winningMatch = candidateScores[0];
        const chosenDrink = winningMatch.drink;

        // Determine compatible topping and sweetness/ice
        let recBoba = [];
        let recJellies = [];
        let recFoam = [];
        let toppingName = "None";
        let sweetness = "50%";
        let ice = "Regular Ice";

        if (texture === "chewy_boba") {
            recBoba = ["Brown Sugar Tapioca Pearls"];
            toppingName = "Brown Sugar Tapioca Pearls";
            sweetness = energy === "radiant_electric" ? "75%" : "50%";
        } else if (texture === "popping_boba") {
            if (chosenDrink.name.toLowerCase().includes("mango")) {
                recBoba = ["Mango Popping Boba"];
                toppingName = "Mango Popping Boba";
            } else {
                recBoba = ["Strawberry Popping Boba"];
                toppingName = "Strawberry Popping Boba";
            }
            sweetness = "50%";
        } else if (texture === "creamy_smooth") {
            recFoam = ["Cheese Foam"];
            toppingName = "Velvet Cheese Foam Layer";
            sweetness = "50%";
            ice = "Less Ice";
        } else if (texture === "light_clean") {
            toppingName = "No boba (Pure & Clean)";
            sweetness = "25%";
            ice = "Less Ice";
        }

        if (energy === "fresh_harmonious") {
            ice = "Less Ice";
            sweetness = "25%";
        } else if (energy === "velvety_comforting") {
            sweetness = "50%";
            ice = "Regular Ice";
        }

        // Calculate authentic price via Pricing engine
        const calculatedPrice = window.Pricing.calculateDrinkPrice(
            chosenDrink.id,
            "Medium",
            recBoba,
            recJellies,
            recFoam,
            [],
            []
        );

        // Friendly profile names
        const energyProfileTitles = {
            "radiant_electric": "⚡ Radiant & Electric",
            "velvety_comforting": "🌸 Velvety & Comforting",
            "playful_sweet": "🍓 Playful & Sweet",
            "fresh_harmonious": "🌿 Fresh & Harmonious"
        };

        const flavorDescriptions = {
            "creamy_milky": "creamy, velvety flavours",
            "fruity_tropical": "vibrant tropical fruit notes",
            "bold_roasted": "bold, roasted aromatics",
            "light_refreshing": "crisp, light botanical notes"
        };

        const textureDescriptions = {
            "chewy_boba": "classic chewy tapioca pearls",
            "popping_boba": "juicy popping boba",
            "creamy_smooth": "silky smooth cream layers",
            "light_clean": "a clean, refreshing finish"
        };

        const explanationText = `Your ${energyProfileTitles[energy].split(' ')[1].toLowerCase()} mood and preference for ${flavorDescriptions[flavor]} pair perfectly with this handcrafted ${chosenDrink.name}, complemented by ${textureDescriptions[texture]}.`;

        currentRecommendation = {
            energyProfile: energyProfileTitles[energy] + " Profile",
            moodKey: energy,
            drinkId: chosenDrink.id,
            drinkName: chosenDrink.name,
            category: chosenDrink.category,
            explanation: explanationText,
            base: chosenDrink.name,
            toppingName: toppingName,
            bobas: recBoba,
            jellies: recJellies,
            milks_foams: recFoam,
            sweetness: sweetness,
            ice: ice,
            size: "Medium",
            unitPrice: calculatedPrice,
            matchScore: winningMatch.score
        };

        // Synchronize with VisualizerState (single source of truth for customizer)
        if (typeof VisualizerState !== 'undefined') {
            VisualizerState.baseDrinkId = currentRecommendation.drinkId;
            VisualizerState.bobas = [...currentRecommendation.bobas];
            VisualizerState.jellies = [...currentRecommendation.jellies];
            VisualizerState.milks_foams = [...currentRecommendation.milks_foams];
            VisualizerState.syrups = [];
            VisualizerState.garnishes = [];
            VisualizerState.sugar = currentRecommendation.sweetness;
            VisualizerState.ice = currentRecommendation.ice;
            VisualizerState.size = currentRecommendation.size;

            if (typeof renderControls !== 'undefined') renderControls();

            const sugarSlider = document.getElementById('sugar-slider');
            const sugarVal = document.getElementById('sugar-val');
            if (sugarSlider && sugarVal) {
                sugarSlider.value = parseInt(currentRecommendation.sweetness);
                sugarVal.textContent = currentRecommendation.sweetness;
            }
            document.querySelectorAll('.pill-btn').forEach(btn => {
                if (btn.getAttribute('data-val') === currentRecommendation.ice) btn.classList.add('active');
                else btn.classList.remove('active');
            });

            if (typeof updateVisualizer !== 'undefined') updateVisualizer();
        }

        renderSignatureResultScreen(currentRecommendation);
    }

    function renderSignatureResultScreen(rec) {
        document.getElementById('rec-energy-badge').textContent = rec.energyProfile;
        document.getElementById('rec-category-badge').textContent = rec.category;
        document.getElementById('rec-drink-name').textContent = rec.drinkName;
        document.getElementById('rec-explanation').textContent = rec.explanation;
        document.getElementById('rec-base').textContent = rec.base;
        document.getElementById('rec-boba').textContent = rec.toppingName;
        document.getElementById('rec-sweetness').textContent = rec.sweetness;
        document.getElementById('rec-ice').textContent = rec.ice;
        document.getElementById('rec-size').textContent = rec.size;
        document.getElementById('rec-price-val').textContent = window.Pricing.formatPrice(rec.unitPrice);
        document.getElementById('rec-match-score').textContent = `${rec.matchScore}% MATCH`;

        setTimeout(() => {
            const svgWrapper = document.getElementById('drink-svg-wrapper');
            const cloneDiv = document.getElementById('rec-svg-clone');
            if (svgWrapper && cloneDiv) cloneSvgInto(cloneDiv, svgWrapper.innerHTML);
        }, 60);

        const toast = document.getElementById('rec-feedback-toast');
        if (toast) toast.textContent = '';
    }

    // Action 1: Customize My Drink
    const btnRecCustomize = document.getElementById('btn-rec-customize');
    if (btnRecCustomize) {
        btnRecCustomize.addEventListener('click', () => {
            switchView('lab-step-customizer');
            if (typeof updateVisualizer !== 'undefined') updateVisualizer();
        });
    }

    // Action 2: Save My Creation
    const btnRecSave = document.getElementById('btn-rec-save');
    if (btnRecSave) {
        btnRecSave.addEventListener('click', () => {
            if (!currentRecommendation) return;
            const savedRecipes = window.Storage.get(window.Storage.KEYS.SAVED_RECIPES, []);
            const newRecipe = {
                id: currentRecipeId,
                name: `${currentRecommendation.drinkName} (${currentRecommendation.energyProfile})`,
                baseDrinkId: currentRecommendation.drinkId,
                base: currentRecommendation.base,
                size: currentRecommendation.size,
                sugar: currentRecommendation.sweetness,
                ice: currentRecommendation.ice,
                bobas: currentRecommendation.bobas,
                jellies: currentRecommendation.jellies,
                milks_foams: currentRecommendation.milks_foams,
                syrups: [],
                garnishes: [],
                unitPrice: currentRecommendation.unitPrice,
                date: new Date().toLocaleDateString()
            };
            savedRecipes.push(newRecipe);
            window.Storage.set(window.Storage.KEYS.SAVED_RECIPES, savedRecipes);

            const toast = document.getElementById('rec-feedback-toast');
            if (toast) {
                toast.textContent = '✓ Saved to your Saved Recipes!';
                setTimeout(() => { toast.textContent = ''; }, 3000);
            }
        });
    }

    // Action 3: Add to Cart
    const btnRecAddCart = document.getElementById('btn-rec-add-cart');
    if (btnRecAddCart) {
        btnRecAddCart.addEventListener('click', () => {
            if (!currentRecommendation) return;
            window.ShoppingCart.addItem({
                baseDrinkId: currentRecommendation.drinkId,
                name: currentRecommendation.drinkName,
                size: currentRecommendation.size,
                bobas: [...currentRecommendation.bobas],
                jellies: [...currentRecommendation.jellies],
                milks_foams: [...currentRecommendation.milks_foams],
                syrups: [],
                garnishes: [],
                ice: currentRecommendation.ice,
                sugar: currentRecommendation.sweetness,
                unitPrice: currentRecommendation.unitPrice,
                quantity: 1
            });

            const toast = document.getElementById('rec-feedback-toast');
            if (toast) {
                toast.textContent = '✓ Added to your Cart!';
                setTimeout(() => { toast.textContent = ''; }, 3000);
            }
        });
    }

    // Action 4: Retake Quiz
    const btnRecRetake = document.getElementById('btn-rec-retake');
    if (btnRecRetake) {
        btnRecRetake.addEventListener('click', () => {
            // Reset quiz answers
            quizState.energy = null;
            quizState.flavor = null;
            quizState.texture = null;
            currentRecipeId = generateRecipeId();

            document.querySelectorAll('#lab-step-assessment .quiz-option-card').forEach(c => c.classList.remove('selected'));
            activeQuizStep = 1;
            updateAssessmentStepView();
            switchView('lab-step-assessment');
        });
    }

    // Customizer view: Back to Match
    const btnLabBack = document.getElementById('btn-lab-back');
    if (btnLabBack) {
        btnLabBack.addEventListener('click', () => {
            if (currentRecommendation && typeof VisualizerState !== 'undefined') {
                // Keep updated customized choices
                currentRecommendation.bobas = [...VisualizerState.bobas];
                currentRecommendation.jellies = [...VisualizerState.jellies];
                currentRecommendation.milks_foams = [...VisualizerState.milks_foams];
                currentRecommendation.sweetness = VisualizerState.sugar;
                currentRecommendation.ice = VisualizerState.ice;
                currentRecommendation.size = VisualizerState.size;
                const priceEl = document.getElementById('total-price');
                if (priceEl) currentRecommendation.unitPrice = parseFloat(priceEl.textContent.replace('₹', '')) || currentRecommendation.unitPrice;
                renderSignatureResultScreen(currentRecommendation);
            }
            switchView('lab-step-recommendation');
        });
    }

    // Customizer view: View Collectible Card
    const btnLabCard = document.getElementById('btn-lab-card');
    if (btnLabCard) {
        btnLabCard.addEventListener('click', () => {
            generateRecipeCard();
            document.getElementById('recipe-card-modal').classList.add('active');
        });
    }

    // Close Modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.remove('active');
        });
    });

    // Generate Collectible Recipe Card
    function generateRecipeCard() {
        const state = typeof VisualizerState !== 'undefined' ? VisualizerState : null;
        if (!state) return;

        const drinkName = window.MIXORA_MENU.find(d => d.id === state.baseDrinkId)?.name || 'Custom Drink';
        const tops = [...state.bobas, ...state.jellies, ...state.milks_foams, ...state.syrups, ...state.garnishes];
        const profile = currentRecommendation ? currentRecommendation.energyProfile : "COLLECTIBLE";

        document.getElementById('card-title').textContent = (drinkName + " CARD").toUpperCase();
        document.getElementById('card-personality-val').textContent = profile.toUpperCase();
        document.getElementById('card-base').textContent = drinkName;
        document.getElementById('card-toppings').textContent = tops.length > 0 ? tops.join(', ') : 'None';
        document.getElementById('card-sweetness').textContent = state.sugar;
        document.getElementById('card-ice').textContent = state.ice;
        document.getElementById('card-size').textContent = state.size;

        const svgSource = document.getElementById('drink-svg-wrapper').innerHTML;
        cloneSvgInto(document.getElementById('card-svg-container'), svgSource);

        document.getElementById('card-recipe-code').textContent = currentRecipeId;
        const priceVal = document.getElementById('total-price')?.textContent || (currentRecommendation ? window.Pricing.formatPrice(currentRecommendation.unitPrice) : '₹129.00');
        document.getElementById('card-price').textContent = priceVal;
    }

    // Modal Add to Cart
    const btnOrderCreation = document.getElementById('btn-order-creation');
    if (btnOrderCreation) {
        btnOrderCreation.addEventListener('click', () => {
            const addCartBtn = document.getElementById('btn-add-cart');
            if (addCartBtn) addCartBtn.click();
            document.getElementById('recipe-card-modal').classList.remove('active');
            currentRecipeId = generateRecipeId();
        });
    }

    const btnLabSave = document.getElementById('btn-lab-save-recipe');
    if (btnLabSave) {
        btnLabSave.addEventListener('click', () => {
            const hiddenSave = document.getElementById('btn-save-recipe');
            if (hiddenSave) hiddenSave.click();
            alert("Creation saved to your profile!");
        });
    }

    const btnDownloadCard = document.getElementById('btn-download-card');
    if (btnDownloadCard) {
        btnDownloadCard.addEventListener('click', () => {
            window.print();
        });
    }

    const btnCopyLink = document.getElementById('btn-copy-link');
    if (btnCopyLink) {
        btnCopyLink.addEventListener('click', () => {
            const shareUrl = `${window.location.origin}/customizer.html?base=${VisualizerState.baseDrinkId}&code=${currentRecipeId}`;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(shareUrl).then(() => {
                    alert("Collectible Recipe link copied to clipboard:\n" + shareUrl);
                });
            } else {
                alert("Recipe link: " + shareUrl);
            }
        });
    }
});
