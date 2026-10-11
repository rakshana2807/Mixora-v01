import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem } from '../data/menuData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemove,
  onClear
}) => {
  const subtotal = items.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + taxes;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#3B1F2B] border-l border-[#FFC857]/20 shadow-2xl flex flex-col text-[#FFF7ED]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#FFC857]/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFC857]" />
                <h2 className="text-xl font-black tracking-wide text-[#FFF7ED]">Your Mixora Cart</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#FFF7ED]/10 text-[#FFF7ED]/75 hover:text-[#FFC857] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-[#FF6B81]/15 flex items-center justify-center mb-4 text-[#FF6B81]">
                    <Sparkles className="w-10 h-10 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-[#FFF7ED] mb-1">Your cart is feeling thirsty!</h3>
                  <p className="text-sm text-[#FFF7ED]/60 max-w-xs">
                    Design a signature beverage in the Drink Studio or order from our chef curation.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-[#4D2837]/70 border border-[#FFC857]/15 hover:border-[#FFC857]/35 transition-all flex gap-4"
                  >
                    {/* Color disc */}
                    <div 
                      className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center border border-white/20 shadow-inner"
                      style={{ backgroundColor: item.imageColor }}
                    >
                      <span className="text-xs font-black text-black/70 uppercase">
                        {item.size[0]}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-[#FFF7ED] truncate">{item.name}</h4>
                        <span className="font-black text-sm text-[#FFC857]">₹{item.unitPrice * item.quantity}</span>
                      </div>
                      <p className="text-xs text-[#FFF7ED]/60 line-clamp-1 mb-2">
                        {item.size} • {item.sugar} sugar • {item.ice}
                        {[...item.bobas, ...item.jellies, ...item.milks_foams, ...item.syrups].length > 0 && 
                          ` • +${[...item.bobas, ...item.jellies, ...item.milks_foams, ...item.syrups].length} add-ons`}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-[#2D1420] rounded-full p-1 border border-[#FFC857]/20">
                          <button 
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#FF6B81] hover:text-[#3B1F2B] transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#FFC857] hover:text-[#3B1F2B] transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-[#FF6B81] hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 bg-[#2D1420] border-t border-[#FFC857]/20 space-y-3">
                <div className="flex justify-between text-sm text-[#FFF7ED]/75">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-[#FFF7ED]/75">
                  <span>Taxes (5%)</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#FFC857] border-t border-[#FFC857]/20 pt-2">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={onClear}
                    className="py-3 px-4 rounded-full border border-[#FF6B81]/40 text-[#FF6B81] hover:bg-[#FF6B81]/10 text-xs font-bold transition-all"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => alert(`Order placed successfully! Total: ₹${total}`)}
                    className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-[#FF6B81] to-[#FFC857] text-[#3B1F2B] font-black text-sm shadow-lg shadow-[#FF6B81]/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Checkout Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
