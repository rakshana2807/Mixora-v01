import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Award, Flame, Heart } from 'lucide-react';
import { MENU_DATA, DrinkItem } from '../data/menuData';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onQuickOrder: (drink: DrinkItem) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onQuickOrder }) => {
  const featuredDrinks = MENU_DATA.filter(d => d.featured).slice(0, 4);

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#FF6B81]/15 border border-[#FFC857]/30 text-[#FFC857] text-xs font-black tracking-widest uppercase mb-8 shadow-lg shadow-[#FF6B81]/10"
          >
            <Sparkles className="w-4 h-4 text-[#FF6B81] animate-spin" style={{ animationDuration: '6s' }} />
            Strawberry Berry &bull; Mango Gold &bull; Vanilla Cream
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-[#FFF7ED]"
          >
            Your Drink. Your Taste. <br />
            <span className="bg-gradient-to-r from-[#FF6B81] via-[#FFC857] to-[#A8D5BA] bg-clip-text text-transparent">
              Your MIXORA.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-[#FFF7ED]/75 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Immerse yourself in our interactive drink laboratory. Blend handcrafted teas, real fruit purées, signature boba pearls, and silky sweet foams with dynamic live visual preview.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('customizer')}
              className="py-4 px-8 rounded-full bg-gradient-to-r from-[#FF6B81] to-[#FFC857] text-[#3B1F2B] font-black text-base shadow-xl shadow-[#FF6B81]/30 flex items-center gap-3 hover:shadow-2xl hover:shadow-[#FFC857]/40 transition-all"
            >
              Open Drink Studio
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('menu')}
              className="py-4 px-8 rounded-full bg-[#FFF7ED]/10 border border-[#FFC857]/30 text-[#FFF7ED] font-bold text-base hover:bg-[#FFF7ED]/20 hover:border-[#FFC857] transition-all backdrop-blur-md"
            >
              Explore Menu
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-black tracking-widest text-[#FF6B81] uppercase">Curated Sips</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#FFF7ED] tracking-tight mt-1">Trending Creations</h2>
          </div>
          <button 
            onClick={() => onNavigate('menu')}
            className="hidden md:flex items-center gap-1.5 text-sm font-bold text-[#FFC857] hover:text-[#FF6B81] transition-all"
          >
            View Full Menu &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDrinks.map((drink, idx) => (
            <motion.div
              key={drink.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-[#4D2837]/75 backdrop-blur-xl rounded-3xl p-6 border border-[#FFC857]/15 flex flex-col justify-between hover:border-[#FFC857]/50 hover:shadow-2xl hover:shadow-[#FF6B81]/20 transition-all group"
            >
              <div>
                <div 
                  className="w-full h-48 rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden shadow-inner border border-white/10"
                  style={{
                    background: `radial-gradient(circle at 50% 40%, ${drink.imageColor}80 0%, #2D1420 100%)`
                  }}
                >
                  <div 
                    className="w-20 h-28 rounded-b-2xl border-2 border-[#FFF7ED]/50 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                    style={{ backgroundColor: drink.imageColor }}
                  >
                    <div className="w-2 h-32 bg-[#FF6B81] -mt-6 rounded-full" />
                  </div>
                  {drink.bestSeller && (
                    <span className="absolute top-3 left-3 bg-[#FFC857] text-[#3B1F2B] text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md">
                      Best Seller
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
                  className="w-full py-2.5 px-3 rounded-full bg-[#FF6B81] hover:bg-[#ff526b] text-[#3B1F2B] font-bold text-xs tracking-wider transition-all"
                >
                  Quick Add
                </button>
                <button
                  onClick={() => onNavigate('customizer')}
                  className="w-full py-2.5 px-3 rounded-full bg-[#FFF7ED]/10 hover:bg-[#FFF7ED]/20 text-[#FFF7ED] font-bold text-xs tracking-wider transition-all border border-[#FFC857]/20"
                >
                  Customize
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lab Callout Feature */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden p-8 md:p-14 bg-gradient-to-r from-[#4D2837] via-[#5C2B40] to-[#3B1F2B] border border-[#FFC857]/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-[#FF6B81]/20 border border-[#FF6B81]/40 text-[#FFC857] text-xs font-black uppercase mb-3">
              AI Taste Matcher
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#FFF7ED] mb-4 tracking-tight leading-tight">
              Boba Personality Lab
            </h2>
            <p className="text-sm md:text-base text-[#FFF7ED]/75 leading-relaxed mb-6 font-medium">
              Take our interactive mood assessment to decode your flavor profile, reveal your signature boba recipe, and generate your custom collectible drink card.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate('lab')}
              className="py-3.5 px-7 rounded-full bg-gradient-to-r from-[#FF6B81] to-[#FFC857] text-[#3B1F2B] font-black text-sm shadow-xl shadow-[#FF6B81]/30 inline-flex items-center gap-2"
            >
              Take the Personality Quiz
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#FF6B81]/20 rounded-full filter blur-2xl animate-pulse" />
            <div className="w-36 h-48 rounded-2xl bg-gradient-to-tr from-[#FF6B81] to-[#FFC857] p-1 shadow-2xl rotate-6">
              <div className="w-full h-full bg-[#2D1420] rounded-xl flex flex-col items-center justify-center p-3 text-center">
                <Sparkles className="w-8 h-8 text-[#FFC857] mb-2" />
                <span className="text-xs font-black text-[#FFF7ED]">MANGO VELVET</span>
                <span className="text-[10px] text-[#A8D5BA] font-bold">100% Match</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
