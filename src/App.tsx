import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { HomeView } from './views/HomeView';
import { CustomizerView } from './views/CustomizerView';
import { MenuView } from './views/MenuView';
import { LabView } from './views/LabView';
import { CartItem, DrinkItem } from './data/menuData';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'demo-cart-item-1',
      drinkId: 'd_strawberry_matcha',
      name: 'Strawberry Velvet Matcha',
      size: 'Medium',
      sugar: '75%',
      ice: 'Regular Ice',
      bobas: ['Strawberry Popping Boba'],
      jellies: ['Mango Jelly'],
      milks_foams: ['Vanilla Sweet Cream'],
      syrups: [],
      garnishes: ['Fresh Strawberry'],
      unitPrice: 159,
      quantity: 1,
      imageColor: '#FF6B81'
    }
  ]);

  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.name === item.name && i.size === item.size && i.sugar === item.sugar);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const next = item.quantity + delta;
          return next > 0 ? { ...item, quantity: next } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemove = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClear = () => {
    setCartItems([]);
  };

  const handleQuickOrder = (drink: DrinkItem) => {
    handleAddToCart({
      id: `${drink.id}-${Date.now()}`,
      drinkId: drink.id,
      name: drink.name,
      size: 'Medium',
      sugar: '100%',
      ice: 'Regular Ice',
      bobas: ['Classic Black Tapioca Pearls'],
      jellies: [],
      milks_foams: [],
      syrups: [],
      garnishes: [],
      unitPrice: drink.basePrice + 15,
      quantity: 1,
      imageColor: drink.imageColor
    });
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#3B1F2B] text-[#FFF7ED] selection:bg-[#FF6B81] selection:text-[#3B1F2B] font-['Outfit',sans-serif]">
      {/* Top Navbar */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        cartCount={totalCartCount} 
        openCart={() => setIsCartOpen(true)} 
      />

      {/* Main Content Views */}
      <main className="transition-all duration-300">
        {currentTab === 'home' && (
          <HomeView 
            onNavigate={(tab) => setCurrentTab(tab)} 
            onQuickOrder={handleQuickOrder}
          />
        )}
        {currentTab === 'customizer' && (
          <CustomizerView onAddToCart={handleAddToCart} />
        )}
        {currentTab === 'menu' && (
          <MenuView 
            onQuickOrder={handleQuickOrder}
            onCustomize={() => setCurrentTab('customizer')}
          />
        )}
        {currentTab === 'lab' && (
          <LabView onAddToCart={handleAddToCart} />
        )}
      </main>

      {/* Sliding Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onClear={handleClear}
      />

      {/* Footer */}
      <footer className="border-t border-[#FFC857]/15 bg-[#2A141E] py-12 px-6 mt-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <span className="text-xl font-black tracking-widest bg-gradient-to-r from-[#FF6B81] via-[#FFC857] to-[#FFF7ED] bg-clip-text text-transparent">
              MIXORA
            </span>
            <p className="text-xs text-[#FFF7ED]/60 mt-1 max-w-xs">
              Handcrafted artisan bubble teas, fruit infusions, and velvet cloud lattes.
            </p>
          </div>
          <div className="text-xs text-[#FFF7ED]/50">
            &copy; 2026 MIXORA Café. Strawberry Berry + Mango + Vanilla Cream.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
