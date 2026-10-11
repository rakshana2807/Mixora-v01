import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Coffee, Heart, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, cartCount, openCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'customizer', label: 'Create Your Drink' },
    { id: 'menu', label: 'Menu' },
    { id: 'lab', label: 'Personality Lab' }
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#3B1F2B]/85 border-b border-[#FFC857]/20 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo with gradient */}
        <motion.div 
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => setCurrentTab('home')}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF6B81] to-[#FFC857] flex items-center justify-center shadow-lg shadow-[#FF6B81]/30">
            <Sparkles className="w-5 h-5 text-[#3B1F2B]" />
          </div>
          <span className="text-2xl font-black tracking-widest bg-gradient-to-r from-[#FF6B81] via-[#FFC857] to-[#FFF7ED] bg-clip-text text-transparent">
            MIXORA
          </span>
        </motion.div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`relative py-2 text-sm font-semibold transition-all ${
                  isActive ? 'text-[#FFC857]' : 'text-[#FFF7ED]/75 hover:text-[#FF6B81]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF6B81] to-[#FFC857] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCart}
            className="relative p-2.5 rounded-full bg-[#FFF7ED]/10 border border-[#FFC857]/25 text-[#FFF7ED] hover:text-[#FFC857] hover:border-[#FFC857] transition-all"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-tr from-[#FF6B81] to-[#FFC857] text-[#3B1F2B] font-black text-xs flex items-center justify-center shadow-md shadow-[#FF6B81]/50"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-[#FFF7ED]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-[#2D1420] border-b border-[#FFC857]/20 px-6 py-4 flex flex-col gap-3"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 rounded-lg font-bold text-sm ${
                currentTab === item.id ? 'bg-[#FF6B81]/20 text-[#FFC857]' : 'text-[#FFF7ED]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </header>
  );
};
