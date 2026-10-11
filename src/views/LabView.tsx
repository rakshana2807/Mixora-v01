import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Heart, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../data/menuData';

interface LabViewProps {
  onAddToCart: (item: CartItem) => void;
}

interface Question {
  id: number;
  question: string;
  options: { label: string; vibe: string; color: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What's your current energy state?",
    options: [
      { label: "Radiant & Electric", vibe: "mango", color: "#FFC857" },
      { label: "Velvety & Comforting", vibe: "vanilla", color: "#FFF7ED" },
      { label: "Playful & Sweet", vibe: "strawberry", color: "#FF6B81" },
      { label: "Fresh & Harmonious", vibe: "mint", color: "#A8D5BA" }
    ]
  },
  {
    id: 2,
    question: "Which texture makes your heart smile?",
    options: [
      { label: "Chewy warm tapioca pearls", vibe: "classic", color: "#3B1F2B" },
      { label: "Popping fruit bursting boba", vibe: "strawberry", color: "#FF6B81" },
      { label: "Whipped cloud velvet foam", vibe: "vanilla", color: "#FFF7ED" },
      { label: "Juicy tropical jelly bites", vibe: "mango", color: "#FFC857" }
    ]
  },
  {
    id: 3,
    question: "What vibe defines your ideal day?",
    options: [
      { label: "Sun-drenched beach lounge", vibe: "mango", color: "#FFC857" },
      { label: "Cozy reading nook with rain", vibe: "vanilla", color: "#FFF7ED" },
      { label: "Spontaneous neon city stroll", vibe: "strawberry", color: "#FF6B81" },
      { label: "Zen botanical garden retreat", vibe: "mint", color: "#A8D5BA" }
    ]
  }
];

export const LabView: React.FC<LabViewProps> = ({ onAddToCart }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const handleSelectOption = (vibe: string) => {
    const updated = [...answers, vibe];
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      // Calculate Personality Persona
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B81', '#FFC857', '#A8D5BA', '#FFF7ED']
      });

      setResult({
        persona: "The Velvet Dreamer",
        flavor: "Strawberry Mango Sunset with Vanilla Cloud",
        description: "You're vibrant yet grounded, infusing every room with warm sunshine, contagious optimism, and sweet creativity.",
        matchScore: "98% Resonance",
        drinkName: "Strawberry Velvet Sunset",
        price: 159,
        imageColor: "#FF6B81"
      });
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  const handleOrderPersona = () => {
    if (!result) return;
    const cartItem: CartItem = {
      id: `lab-${Date.now()}`,
      drinkId: 'd_strawberry_matcha',
      name: result.drinkName,
      size: 'Medium',
      sugar: '75%',
      ice: 'Regular Ice',
      bobas: ['Strawberry Popping Boba'],
      jellies: ['Mango Jelly'],
      milks_foams: ['Vanilla Sweet Cream'],
      syrups: ['Strawberry Syrup'],
      garnishes: ['Fresh Strawberry'],
      unitPrice: result.price,
      quantity: 1,
      imageColor: result.imageColor
    };
    onAddToCart(cartItem);
    alert('Added your signature personality boba to cart!');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <span className="text-xs font-black tracking-widest text-[#FF6B81] uppercase">AI Flavor Profiler</span>
        <h1 className="text-4xl md:text-5xl font-black text-[#FFF7ED] tracking-tight mt-1 mb-3">
          Boba Personality Lab
        </h1>
        <p className="text-sm md:text-base text-[#FFF7ED]/70 font-medium max-w-lg mx-auto">
          Discover the unique beverage recipe that resonates with your personal energy aura.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-[#4D2837]/80 backdrop-blur-2xl border border-[#FFC857]/20 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8"
          >
            {/* Progress bar */}
            <div className="w-full bg-[#2D1420] h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF6B81] to-[#FFC857]"
                animate={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>

            <div className="text-center">
              <span className="text-xs font-bold text-[#FFC857] uppercase tracking-wider">
                Question {currentStep + 1} of {QUESTIONS.length}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-[#FFF7ED] mt-2">
                {QUESTIONS[currentStep].question}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {QUESTIONS[currentStep].options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectOption(opt.vibe)}
                  className="p-5 rounded-2xl bg-[#3B1F2B]/75 border border-[#FFC857]/20 hover:border-[#FF6B81] hover:bg-[#3B1F2B] text-left transition-all group flex items-center justify-between shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: opt.color }}
                    />
                    <span className="text-sm font-bold text-[#FFF7ED] group-hover:text-[#FFC857] transition-colors">
                      {opt.label}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#FFF7ED]/30 group-hover:text-[#FFC857] transition-colors" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#4D2837]/85 backdrop-blur-2xl border border-[#FFC857]/30 rounded-3xl p-8 md:p-12 shadow-2xl text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6B81]/20 border border-[#FF6B81]/40 text-[#FFC857] text-xs font-black uppercase">
              <Trophy className="w-4 h-4 text-[#FFC857]" />
              {result.matchScore}
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#FFF7ED] mb-2">{result.persona}</h2>
              <p className="text-lg font-bold text-[#FFC857]">{result.flavor}</p>
            </div>

            {/* Collectible Recipe Card */}
            <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#2D1420] border border-[#FFC857]/30 text-left shadow-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-[#FF6B81] uppercase">Signature Recipe</span>
                <span className="text-sm font-black text-[#FFC857]">₹{result.price}</span>
              </div>
              <p className="text-xs text-[#FFF7ED]/75 leading-relaxed">{result.description}</p>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] font-bold">
                <span className="px-2.5 py-1 rounded-full bg-[#FF6B81]/25 text-[#FF6B81]">Strawberry Popping</span>
                <span className="px-2.5 py-1 rounded-full bg-[#FFC857]/25 text-[#FFC857]">Mango Jelly</span>
                <span className="px-2.5 py-1 rounded-full bg-[#A8D5BA]/25 text-[#A8D5BA]">Vanilla Sweet Foam</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handleReset}
                className="py-3 px-6 rounded-full border border-[#FFC857]/30 text-[#FFF7ED] font-bold text-sm hover:border-[#FFC857] flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4 text-[#FFC857]" />
                Retake Quiz
              </button>
              <button
                onClick={handleOrderPersona}
                className="py-3.5 px-8 rounded-full bg-gradient-to-r from-[#FF6B81] to-[#FFC857] text-[#3B1F2B] font-black text-sm shadow-xl shadow-[#FF6B81]/30 hover:scale-105 transition-all"
              >
                Add My Signature Drink to Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
