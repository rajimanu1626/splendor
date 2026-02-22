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

const gemBgColors: Record<string, string> = {
  diamond: '#F5F5F4',
  sapphire: '#2563EB',
  emerald: '#4ADE80',
  ruby: '#B91C1C',
  onyx: '#0A0A14',
};

interface DevelopmentCardProps {
  card: DevelopmentCardType;
  state?: CardState;
  onClick?: () => void;
}

export default function DevelopmentCard({ card, state = 'default', onClick }: DevelopmentCardProps) {
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
      className={`rounded-xl border-2 relative flex flex-col overflow-hidden cursor-pointer
        ${state === 'unaffordable' ? 'saturate-75 opacity-80' : ''}
      `}
      style={{
        width: 'var(--card-width, 120px)',
        height: 'var(--card-height, 170px)',
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
      <div
        className="absolute inset-0 rounded-xl z-[5] pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.4)' }}
        aria-hidden
      />
      <div className="flex items-start p-2 pt-1.5 pl-2 pr-0 relative z-10">
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
        <div className="absolute top-0 right-0">
          <GemToken type={card.bonus} size="sm" scale={2} />
        </div>
      </div>

      <div className="flex-1 min-h-0 pl-1.5 pr-1 py-1 flex flex-col justify-end relative z-10">
        {Object.keys(card.cost).length > 0 ? (
          <div className="flex flex-col gap-0 items-start w-full [&>div:not(:last-child)]:-mb-1.5">
            {Object.entries(card.cost).map(([gem, count]) => (
              <div key={gem} className="relative w-6 h-6 shrink-0">
                <div
                  className="w-full h-full rounded-full flex items-center justify-center border border-white/90"
                  style={{ background: gemBgColors[gem] }}
                >
                  <span
                    className={`font-extrabold text-xs ${gem === 'diamond' ? 'text-gray-800' : 'text-white'}`}
                    style={{ textShadow: gem === 'diamond' ? '0 1px 1px rgba(255,255,255,0.8)' : '0 1px 2px rgba(0,0,0,0.7)' }}
                  >
                    {count}
                  </span>
                </div>
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
