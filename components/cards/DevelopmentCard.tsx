'use client';

import { motion } from 'framer-motion';
import GemToken from '@/components/tokens/GemToken';
import type { DevelopmentCard as DevelopmentCardType, GemColor } from '@/lib/game-engine/types';

type CardState = 'default' | 'affordable' | 'unaffordable' | 'reserved';

// One image per gem (card bonus). Put PNGs in public/images/cards/:
// diamond.png, sapphire.png, emerald.png, ruby.png, onyx.png
// For sharp display (no pixelation): use at least 360×510px (3× card size 120×170), or 240×340px for 2× retina.
const cardBackgroundImages: Record<GemColor, string> = {
  diamond: '/images/cards/diamond.png',
  sapphire: '/images/cards/sapphire.png',
  emerald: '/images/cards/emerald.png',
  ruby: '/images/cards/ruby.png',
  onyx: '/images/cards/onyx.png',
};

const fallbackBgByGem: Record<GemColor, string> = {
  diamond: '#E8DCC8',
  sapphire: '#3B82F6',
  emerald: '#10B981',
  ruby: '#EF4444',
  onyx: '#1a1a1a',
};

interface DevelopmentCardProps {
  card: DevelopmentCardType;
  state?: CardState;
  onClick?: () => void;
}

export default function DevelopmentCard({ card, state = 'default', onClick }: DevelopmentCardProps) {
  const size = 'w-[120px] h-[170px]';
  const cardBg = cardBackgroundImages[card.bonus];
  const fallbackBg = fallbackBgByGem[card.bonus];

  const glowShadow =
    state === 'affordable'
      ? '0 0 12px rgba(39, 174, 96, 0.6), 0 0 0 2px rgba(39, 174, 96, 0.4)'
      : 'none';

  const hoverVariants = {
    affordable: {
      scale: 1.12,
      y: -12,
      zIndex: 30,
      boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 25px rgba(39, 174, 96, 0.7), 0 0 0 2px rgba(39, 174, 96, 0.5)',
    },
    unaffordable: {
      scale: 1.04,
      y: -4,
      zIndex: 20,
      boxShadow: '0 12px 24px rgba(0,0,0,0.4)',
    },
    default: {
      scale: 1.1,
      y: -10,
      zIndex: 30,
      boxShadow: '0 18px 36px rgba(0,0,0,0.5), 0 0 15px rgba(184,134,11,0.3)',
    },
  };

  const hoverState = state === 'reserved' ? 'default' : state;

  return (
    <motion.div
      className={`${size} rounded-xl border-2 relative flex flex-col overflow-hidden cursor-pointer
        ${state === 'unaffordable' ? 'saturate-75 opacity-80' : ''}
      `}
      style={{
        borderColor: 'rgba(184,134,11,0.5)',
        backgroundColor: fallbackBg,
        boxShadow: glowShadow,
        transformOrigin: 'center bottom',
      }}
      whileHover={hoverVariants[hoverState]}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
    >
      <img
        src={cardBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center rounded-[10px] z-0"
        style={{ imageRendering: 'auto' }}
        role="presentation"
      />
      <div className="flex justify-between items-start p-2 relative z-10">
        <div className="flex items-center justify-center w-8">
          {card.prestige > 0 && (
            <span
              className="text-3xl font-bold text-white"
              style={{
                fontFamily: 'var(--font-cinzel)',
                textShadow: '0 0 10px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {card.prestige}
            </span>
          )}
        </div>
        <div className="scale-90">
          <GemToken type={card.bonus} size="sm" />
        </div>
      </div>

      <div className="flex-1 relative z-10 flex items-end justify-end p-2">
        <span
          className="text-white/70 font-bold text-xs drop-shadow-md"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          {['I', 'II', 'III'][card.tier - 1]}
        </span>
      </div>

      <div className="bg-black/40 rounded-b-xl p-2 min-h-[44px] flex items-center justify-center relative z-10">
        {Object.keys(card.cost).length > 0 ? (
          <div className="flex flex-wrap gap-1 justify-center max-w-full">
            {Object.entries(card.cost).map(([gem, count]) => (
              <div key={gem} className="flex items-center gap-0.5 bg-black/40 rounded-full px-1.5 py-0.5">
                <GemToken type={gem as GemColor} size="xs" />
                <span className="text-white font-bold text-xs">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-[#C9981D] italic text-sm font-semibold">FREE</span>
        )}
      </div>

      {state === 'reserved' && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(184,134,11,0.95) 50%, transparent 70%)',
          }}
        >
          <span
            className="text-white font-bold text-lg tracking-wider transform -rotate-12"
            style={{ fontFamily: 'var(--font-cinzel)', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
          >
            RESERVED
          </span>
        </div>
      )}

      {state === 'unaffordable' && (
        <div className="absolute inset-0 bg-red-900/10 pointer-events-none rounded-xl" />
      )}
    </motion.div>
  );
}
