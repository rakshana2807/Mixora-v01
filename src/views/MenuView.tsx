import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Plus } from 'lucide-react';
import { MENU_DATA, DrinkItem, CartItem } from '../data/menuData';

interface MenuViewProps {
  onQuickOrder: (drink: DrinkItem) => void;
  onCustomize: (drink: DrinkItem) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({ onQuickOrder, onCustomize }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Milk Tea', 'Brown Sugar Boba', 'Matcha', 'Fruit Tea', 'Milkshakes', 'Smoothies'];

  const filteredDrinks = MENU_DATA.filter((drink) => {
    const matchesCategory = activeCategory === 'All' || drink.category === activeCategory;
    const matchesSearch = drink.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          drink.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-black tracking-widest text-[#FF6B81] uppercase">Artisanal Drinks</span>
        <h1 className="text-4xl md:text-5xl font-black text-[#FFF7ED] tracking-tight mt-1 mb-4">
          The Mixora Menu
        </h1>
        <p className="text-sm md:text-base text-[#FFF7ED]/70 font-medium leading-relaxed">
          Crafted with loose-leaf estate teas, organic dairy, and sweet tropical fruits.
        </p>
      </div>

      {/* Controls: Search & Category Filter Pills */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 text-[#FFC857] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drinks, ingredients..."
            className="w-full pl-12 pr-4 py-3.5 rounded-full bg-[#4D2837]/80 border border-[#FFC857]/30 text-[#FFF7ED] placeholder-[#FFF7ED]/40 text-sm font-semibold focus:outline-none focus:border-[#FFC857] shadow-xl"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`py-2 px-5 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#FF6B81] to-[#FFC857] text-[#3B1F2B] font-black shadow-lg shadow-[#FF6B81]/30 scale-105'
                  : 'bg-[#4D2837]/70 border border-[#FFC857]/20 text-[#FFF7ED] hover:border-[#FFC857]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Drinks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrinks.map((drink, idx) => (
          <motion.div
            key={drink.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -6 }}
            className="bg-[#4D2837]/75 backdrop-blur-xl rounded-3xl p-6 border border-[#FFC857]/20 flex flex-col justify-between hover:border-[#FFC857]/60 hover:shadow-2xl hover:shadow-[#FF6B81]/25 transition-all group"
          >
            <div>
              <div 
                className="w-full h-44 rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden shadow-inner border border-white/10"
                style={{
                  background: `radial-gradient(circle at 50% 40%, ${drink.imageColor}75 0%, #2D1420 100%)`
                }}
              >
                <div 
                  className="w-16 h-24 rounded-b-xl border-2 border-white/60 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300"
                  style={{ backgroundColor: drink.imageColor }}
                >
                  <div className="w-1.5 h-28 bg-[#FF6B81] -mt-6 rounded-full" />
                </div>
                {drink.bestSeller && (
                  <span className="absolute top-3 left-3 bg-[#FFC857] text-[#3B1F2B] text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                    Popular
                  </span>
                )}
              </div>

              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-[#FFF7ED] group-hover:text-[#FFC857] transition-colors">{drink.name}</h3>
                <span className="font-black text-lg text-[#FFC857]">₹{drink.basePrice}</span>
              </div>
              <p className="text-xs text-[#FFF7ED]/65 line-clamp-2 leading-relaxed mb-6">{drink.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onQuickOrder(drink)}
                className="w-full py-2.5 px-3 rounded-full bg-[#FF6B81] hover:bg-[#ff526b] text-[#3B1F2B] font-black text-xs tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
              <button
                onClick={() => onCustomize(drink)}
                className="w-full py-2.5 px-3 rounded-full bg-[#FFF7ED]/10 hover:bg-[#FFF7ED]/20 text-[#FFF7ED] font-bold text-xs tracking-wider transition-all border border-[#FFC857]/25"
              >
                Customize
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
