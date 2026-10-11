import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, Heart, RefreshCw, Check } from 'lucide-react';
import { MENU_DATA, INGREDIENTS, CustomizerState, DrinkItem, CartItem } from '../data/menuData';
import { InteractiveCup } from '../components/InteractiveCup';

interface CustomizerViewProps {
  onAddToCart: (item: CartItem) => void;
}

export const CustomizerView: React.FC<CustomizerViewProps> = ({ onAddToCart }) => {
  const [state, setState] = useState<CustomizerState>({
    baseDrinkId: 'd_classic_milk_tea',
    size: 'Medium',
    sugar: '100%',
    ice: 'Regular Ice',
    bobas: ['Classic Black Tapioca Pearls'],
    jellies: [],
    milks_foams: [],
    syrups: [],
    garnishes: []
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const baseDrink = MENU_DATA.find(d => d.id === state.baseDrinkId) || MENU_DATA[0];

  // Pricing calculation
  const calculateTotal = (): number => {
    let price = baseDrink.basePrice;
    price += INGREDIENTS.size_surcharge[state.size];

    state.bobas.forEach(b => price += (INGREDIENTS.bobas[b]?.price || 0));
    state.jellies.forEach(j => price += (INGREDIENTS.jellies[j]?.price || 0));
    state.milks_foams.forEach(m => price += (INGREDIENTS.milks_foams[m]?.price || 0));
    state.syrups.forEach(s => price += (INGREDIENTS.syrups[s]?.price || 0));
    state.garnishes.forEach(g => price += (INGREDIENTS.garnishes[g]?.price || 0));

    return price;
  };

  const totalPrice = calculateTotal();

  const handleToggleAddon = (category: 'bobas' | 'jellies' | 'milks_foams' | 'syrups' | 'garnishes', item: string) => {
    setState(prev => {
      const exists = prev[category].includes(item);
      return {
        ...prev,
        [category]: exists 
          ? prev[category].filter(x => x !== item)
          : [...prev[category], item]
      };
    });
  };

  const handleSurpriseMe = () => {
    const randomBase = MENU_DATA[Math.floor(Math.random() * MENU_DATA.length)];
    const sizes: ('Small' | 'Medium' | 'Large')[] = ['Small', 'Medium', 'Large'];
    const sugars: ('0%' | '25%' | '50%' | '75%' | '100%')[] = ['25%', '50%', '75%', '100%'];
    const ices: ('No Ice' | 'Less Ice' | 'Regular Ice' | 'Extra Ice')[] = ['Less Ice', 'Regular Ice', 'Extra Ice'];

    const bobaKeys = Object.keys(INGREDIENTS.bobas);
    const jellyKeys = Object.keys(INGREDIENTS.jellies);
    const foamKeys = Object.keys(INGREDIENTS.milks_foams);

    setState({
      baseDrinkId: randomBase.id,
      size: sizes[Math.floor(Math.random() * sizes.length)],
      sugar: sugars[Math.floor(Math.random() * sugars.length)],
      ice: ices[Math.floor(Math.random() * ices.length)],
      bobas: [bobaKeys[Math.floor(Math.random() * bobaKeys.length)]],
      jellies: Math.random() > 0.5 ? [jellyKeys[Math.floor(Math.random() * jellyKeys.length)]] : [],
      milks_foams: Math.random() > 0.5 ? [foamKeys[Math.floor(Math.random() * foamKeys.length)]] : [],
      syrups: [],
      garnishes: []
    });
  };

  const handleAdd = () => {
    const cartItem: CartItem = {
      id: `${state.baseDrinkId}-${Date.now()}`,
      drinkId: state.baseDrinkId,
      name: baseDrink.name,
      size: state.size,
      sugar: state.sugar,
      ice: state.ice,
      bobas: state.bobas,
      jellies: state.jellies,
      milks_foams: state.milks_foams,
      syrups: state.syrups,
      garnishes: state.garnishes,
      unitPrice: totalPrice,
      quantity: 1,
      imageColor: baseDrink.imageColor
    };
    onAddToCart(cartItem);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 min-h-[calc(100vh-80px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Drink Visualizer Panel */}
        <div className="lg:col-span-5 bg-[#4D2837]/80 backdrop-blur-2xl border border-[#FFC857]/20 rounded-3xl p-8 sticky top-24 flex flex-col items-center justify-between min-h-[580px] shadow-2xl">
          <div className="w-full flex justify-between items-center pb-4 border-b border-[#FFC857]/20">
            <div>
              <span className="text-xs font-bold text-[#FF6B81] uppercase tracking-wider">Live Visualizer</span>
              <h2 className="text-2xl font-black text-[#FFF7ED]">{baseDrink.name}</h2>
            </div>
            <div className="bg-[#2D1420] px-4 py-2 rounded-full border border-[#FFC857]/30 text-xl font-black text-[#FFC857] shadow-inner">
              ₹{totalPrice}
            </div>
          </div>

          {/* Interactive Drink Canvas */}
          <div className="my-8 w-full flex items-center justify-center">
            <InteractiveCup state={state} baseDrink={baseDrink} />
          </div>

          {/* Studio Quick Actions */}
          <div className="w-full grid grid-cols-3 gap-3">
            <button
              onClick={handleSurpriseMe}
              className="py-3 px-2 rounded-2xl bg-[#3B1F2B] border border-[#FFC857]/30 text-[#FFF7ED] hover:border-[#FFC857] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#FFC857]" />
              Surprise
            </button>
            <button
              onClick={() => {
                alert(`Recipe saved: ${baseDrink.name} (${state.size})`);
              }}
              className="py-3 px-2 rounded-2xl bg-[#3B1F2B] border border-[#FFC857]/30 text-[#FFF7ED] hover:border-[#FF6B81] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
            >
              <Heart className="w-3.5 h-3.5 text-[#FF6B81]" />
              Save
            </button>
            <button
              onClick={handleAdd}
              className="py-3 px-2 rounded-2xl bg-gradient-to-r from-[#FF6B81] to-[#FFC857] text-[#3B1F2B] font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#FF6B81]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-green-900" /> : <ShoppingBag className="w-3.5 h-3.5" />}
              {savedSuccess ? 'Added!' : 'Add Cart'}
            </button>
          </div>
        </div>

        {/* Right Configuration Controls Area */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Base Drink Selector */}
          <div className="bg-[#4D2837]/75 backdrop-blur-xl border border-[#FFC857]/20 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-black text-[#FFC857] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF6B81] text-[#3B1F2B] text-xs flex items-center justify-center font-black">1</span>
              Choose Base Drink
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MENU_DATA.slice(0, 9).map((drink) => {
                const isSelected = state.baseDrinkId === drink.id;
                return (
                  <button
                    key={drink.id}
                    onClick={() => setState(s => ({ ...s, baseDrinkId: drink.id }))}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      isSelected 
                        ? 'bg-gradient-to-b from-[#FF6B81]/30 to-[#FFC857]/20 border-[#FF6B81] shadow-lg shadow-[#FF6B81]/20 scale-[1.02]' 
                        : 'bg-[#3B1F2B]/60 border-white/10 hover:border-[#FFC857]/40'
                    }`}
                  >
                    <span 
                      className="w-8 h-8 rounded-full border-2 border-white/40 shadow-sm"
                      style={{ backgroundColor: drink.imageColor }}
                    />
                    <span className="text-xs font-bold text-[#FFF7ED] truncate w-full">{drink.name}</span>
                    <span className="text-[11px] font-black text-[#FFC857]">₹{drink.basePrice}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Size Selector */}
          <div className="bg-[#4D2837]/75 backdrop-blur-xl border border-[#FFC857]/20 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-black text-[#FFC857] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF6B81] text-[#3B1F2B] text-xs flex items-center justify-center font-black">2</span>
              Select Cup Size
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['Small', 'Medium', 'Large'] as const).map((size) => {
                const isSelected = state.size === size;
                const extraPrice = INGREDIENTS.size_surcharge[size];
                return (
                  <button
                    key={size}
                    onClick={() => setState(s => ({ ...s, size }))}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSelected 
                        ? 'bg-gradient-to-b from-[#FF6B81]/30 to-[#FFC857]/20 border-[#FF6B81] shadow-lg shadow-[#FF6B81]/20' 
                        : 'bg-[#3B1F2B]/60 border-white/10 hover:border-[#FFC857]/40'
                    }`}
                  >
                    <div 
                      className={`bg-gradient-to-b from-[#FF6B81] to-[#FFC857] rounded-b-lg mb-1 ${
                        size === 'Small' ? 'w-5 h-6' : size === 'Medium' ? 'w-6 h-8' : 'w-7 h-10'
                      }`}
                    />
                    <span className="text-xs font-bold text-[#FFF7ED]">{size}</span>
                    <span className="text-[11px] font-black text-[#FFC857]">
                      {extraPrice === 0 ? 'Standard' : `+₹${extraPrice}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Sugar & Ice Levels */}
          <div className="bg-[#4D2837]/75 backdrop-blur-xl border border-[#FFC857]/20 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-base font-black text-[#FFC857] uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF6B81] text-[#3B1F2B] text-xs flex items-center justify-center font-black">3</span>
              Adjustments
            </h3>

            {/* Sugar Range */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#FFF7ED]">Sweetness Level</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFC857] text-[#3B1F2B] text-xs font-black">
                  {state.sugar}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                value={parseInt(state.sugar)}
                onChange={(e) => {
                  const val = `${e.target.value}%` as any;
                  setState(s => ({ ...s, sugar: val }));
                }}
                className="w-full accent-[#FF6B81] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-bold text-[#FFF7ED]/60 mt-1">
                <span>0% Unsugared</span>
                <span>50% Balanced</span>
                <span>100% Full Sweet</span>
              </div>
            </div>

            {/* Ice Options */}
            <div>
              <span className="block text-xs font-bold text-[#FFF7ED] mb-2">Ice Proportion</span>
              <div className="grid grid-cols-4 gap-2">
                {(['No Ice', 'Less Ice', 'Regular Ice', 'Extra Ice'] as const).map((ice) => (
                  <button
                    key={ice}
                    onClick={() => setState(s => ({ ...s, ice }))}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      state.ice === ice
                        ? 'bg-gradient-to-r from-[#FF6B81] to-[#FFC857] text-[#3B1F2B] border-transparent font-black shadow-md'
                        : 'bg-[#3B1F2B]/60 border-white/10 text-[#FFF7ED] hover:border-[#FFC857]/40'
                    }`}
                  >
                    {ice.replace(' Ice', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Add-ons: Bobas, Jellies, Foams & Syrups */}
          <div className="bg-[#4D2837]/75 backdrop-blur-xl border border-[#FFC857]/20 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-base font-black text-[#FFC857] uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#FF6B81] text-[#3B1F2B] text-xs flex items-center justify-center font-black">4</span>
              Signature Add-ons
            </h3>

            {/* Boba Bar */}
            <div>
              <h4 className="text-xs font-black uppercase text-[#FF6B81] tracking-wider mb-2.5">Boba Bar</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(INGREDIENTS.bobas).slice(0, 6).map(([name, data]) => {
                  const isChecked = state.bobas.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() => handleToggleAddon('bobas', name)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        isChecked 
                          ? 'bg-[#FF6B81]/25 border-[#FF6B81] text-[#FFF7ED]' 
                          : 'bg-[#3B1F2B]/60 border-white/10 text-[#FFF7ED]/75 hover:border-white/30'
                      }`}
                    >
                      <span className="truncate pr-1">{name}</span>
                      <span className="text-[11px] font-black text-[#FFC857] flex-shrink-0">+₹{data.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Jellies & Chewy */}
            <div>
              <h4 className="text-xs font-black uppercase text-[#FF6B81] tracking-wider mb-2.5">Jelly & Chewy</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(INGREDIENTS.jellies).slice(0, 4).map(([name, data]) => {
                  const isChecked = state.jellies.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() => handleToggleAddon('jellies', name)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        isChecked 
                          ? 'bg-[#FF6B81]/25 border-[#FF6B81] text-[#FFF7ED]' 
                          : 'bg-[#3B1F2B]/60 border-white/10 text-[#FFF7ED]/75 hover:border-white/30'
                      }`}
                    >
                      <span className="truncate pr-1">{name}</span>
                      <span className="text-[11px] font-black text-[#FFC857] flex-shrink-0">+₹{data.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Milk & Foams */}
            <div>
              <h4 className="text-xs font-black uppercase text-[#FF6B81] tracking-wider mb-2.5">Cream & Foams</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(INGREDIENTS.milks_foams).slice(0, 4).map(([name, data]) => {
                  const isChecked = state.milks_foams.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() => handleToggleAddon('milks_foams', name)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        isChecked 
                          ? 'bg-[#FF6B81]/25 border-[#FF6B81] text-[#FFF7ED]' 
                          : 'bg-[#3B1F2B]/60 border-white/10 text-[#FFF7ED]/75 hover:border-white/30'
                      }`}
                    >
                      <span className="truncate pr-1">{name}</span>
                      <span className="text-[11px] font-black text-[#FFC857] flex-shrink-0">+₹{data.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
