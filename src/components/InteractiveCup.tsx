import React from 'react';
import { motion } from 'framer-motion';
import { CustomizerState, INGREDIENTS, DrinkItem } from '../data/menuData';

interface InteractiveCupProps {
  state: CustomizerState;
  baseDrink: DrinkItem;
}

export const InteractiveCup: React.FC<InteractiveCupProps> = ({ state, baseDrink }) => {
  let width = 240;
  let height = 330;
  if (state.size === 'Small') { width = 215; height = 290; }
  if (state.size === 'Large') { width = 265; height = 370; }

  const cupTopW = width * 0.9;
  const cupBotW = width * 0.65;
  const liquidColor = baseDrink.imageColor;

  let iceAmount = 0;
  if (state.ice === 'Less Ice') iceAmount = 4;
  if (state.ice === 'Regular Ice') iceAmount = 7;
  if (state.ice === 'Extra Ice') iceAmount = 11;

  const hasFoam = state.milks_foams.some(m => INGREDIENTS.milks_foams[m]?.type === 'foam');
  const foamItem = state.milks_foams.find(m => INGREDIENTS.milks_foams[m]?.type === 'foam');
  const foamColor = foamItem ? (INGREDIENTS.milks_foams[foamItem]?.color || '#FFF7ED') : '#FFF7ED';

  const hasWhip = state.milks_foams.some(m => INGREDIENTS.milks_foams[m]?.type === 'whip');

  return (
    <motion.div 
      className="relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      animate={{ y: [-4, 6, -4] }}
      transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
      whileHover={{ scale: 1.05, rotate: 2 }}
    >
      {/* Back glow shadow aura */}
      <div 
        className="absolute w-72 h-72 rounded-full pointer-events-none filter blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,129,0.4) 0%, rgba(255,200,87,0.3) 50%, transparent 70%)'
        }}
      />

      <svg 
        id="drink-svg"
        width={width} 
        height={height + 25} 
        viewBox={`0 0 ${width} ${height + 25}`} 
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)] transition-all duration-300"
      >
        <defs>
          <linearGradient id="cupHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
            <stop offset="15%" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="25%" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="80%" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={liquidColor} stopOpacity="0.92" />
            <stop offset="100%" stopColor={liquidColor} stopOpacity="1" />
          </linearGradient>

          <clipPath id="cupClipReact">
            <polygon points={`${(width - cupTopW) / 2},42 ${(width + cupTopW) / 2},42 ${(width + cupBotW) / 2},${height - 10} ${(width - cupBotW) / 2},${height - 10}`} />
          </clipPath>
        </defs>

        {/* Contact Shadow on Table */}
        <ellipse cx={width / 2} cy={height + 12} rx={cupBotW / 2 + 15} ry={10} fill="rgba(0,0,0,0.35)" />

        {/* Clipped Liquid Area */}
        <g clipPath="url(#cupClipReact)">
          {/* Main Liquid */}
          <rect x="0" y="45" width={width} height={height} fill="url(#liquidGrad)" />

          {/* Syrups marbling layers */}
          {state.syrups.map((syrup, idx) => {
            const sData = INGREDIENTS.syrups[syrup];
            if (!sData) return null;
            const yOffset = 65 + (idx * 20);
            return (
              <path 
                key={syrup}
                d={`M0,${yOffset} Q${width/4},${yOffset+40} ${width/2},${yOffset+20} T${width},${yOffset+10} L${width},${yOffset+60} Q${width*0.75},${yOffset+90} ${width/2},${yOffset+70} T0,${yOffset+80} Z`} 
                fill={sData.color} 
                opacity="0.65" 
              />
            );
          })}

          {/* Ice Cubes */}
          {Array.from({ length: iceAmount }).map((_, i) => {
            const x = width * 0.28 + (i % 3) * 22;
            const y = 80 + Math.floor(i / 3) * 28;
            return (
              <rect 
                key={i} 
                x={x} 
                y={y} 
                width="22" 
                height="22" 
                rx="5" 
                fill="#FFF7ED" 
                opacity="0.5" 
                transform={`rotate(${i * 18}, ${x + 11}, ${y + 11})`}
              />
            );
          })}

          {/* Boba Pearls */}
          {state.bobas.map((boba, bIdx) => {
            const bData = INGREDIENTS.bobas[boba];
            if (!bData) return null;
            const count = 24;
            return Array.from({ length: count }).map((_, i) => {
              const x = (width - cupBotW) / 2 + 12 + ((i * 17) % (cupBotW - 24));
              const y = height - 12 - (Math.floor(i / 6) * 11) - (bIdx * 6);
              const color = bData.color === 'rainbow' ? ['#FF6B81', '#FFC857', '#A8D5BA', '#FFF7ED'][i % 4] : bData.color;
              return (
                <g key={`${boba}-${i}`}>
                  <circle cx={x} cy={y} r="5.5" fill={color} />
                  <circle cx={x - 1.5} cy={y - 1.5} r="1.5" fill="#FFF7ED" opacity="0.6" />
                </g>
              );
            });
          })}

          {/* Jellies */}
          {state.jellies.map((jelly, jIdx) => {
            const jData = INGREDIENTS.jellies[jelly];
            if (!jData) return null;
            if (jData.type === 'pudding_layer') {
              return (
                <rect key={jelly} x="0" y={height - 40 - (jIdx * 15)} width={width} height="30" fill={jData.color} opacity="0.9" />
              );
            }
            return Array.from({ length: 14 }).map((_, i) => {
              const x = (width - cupBotW) / 2 + 15 + ((i * 19) % (cupBotW - 30));
              const y = height - 18 - (Math.floor(i / 4) * 12) - (jIdx * 8);
              return (
                <rect key={`${jelly}-${i}`} x={x} y={y} width="11" height="11" rx="2" fill={jData.color} opacity="0.85" />
              );
            });
          })}

          {/* Cream Foam Layer */}
          {hasFoam && (
            <rect x="0" y="42" width={width} height="26" fill={foamColor} opacity="0.95" />
          )}
        </g>

        {/* Straw */}
        <rect x={width / 2 - 5} y="-15" width="10" height={height + 5} fill="#FF6B81" rx="3" />
        <rect x={width / 2 - 2} y="-15" width="2.5" height={height + 5} fill="#FFF7ED" opacity="0.6" />

        {/* Whip Topping if present */}
        {hasWhip && (
          <path 
            d={`M${width/2 - 35},42 Q${width/2 - 20},20 ${width/2},22 Q${width/2 + 25},24 ${width/2 + 35},42 Z`} 
            fill="#FFF7ED" 
            opacity="0.95" 
          />
        )}

        {/* Outer Cup Outline & Glass Reflection */}
        <polygon 
          points={`${(width - cupTopW) / 2},42 ${(width + cupTopW) / 2},42 ${(width + cupBotW) / 2},${height - 10} ${(width - cupBotW) / 2},${height - 10}`} 
          fill="url(#cupHighlight)" 
          stroke="rgba(255, 200, 87, 0.4)" 
          strokeWidth="2" 
        />

        {/* Cup Rim Top */}
        <ellipse 
          cx={width / 2} 
          cy="42" 
          rx={cupTopW / 2} 
          ry="7" 
          fill="none" 
          stroke="rgba(255, 200, 87, 0.6)" 
          strokeWidth="3" 
        />
      </svg>
    </motion.div>
  );
};
