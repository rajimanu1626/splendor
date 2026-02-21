'use client';

import { motion } from 'framer-motion';
import GemToken from '@/components/tokens/GemToken';
import type { DevelopmentCard as DevelopmentCardType, GemColor } from '@/lib/game-engine/types';

type CardState = 'default' | 'affordable' | 'unaffordable' | 'reserved';

const tierColors: Record<number, { light: string; dark: string }> = {
  1: { light: '#2D5A3D', dark: '#1A3D28' },
  2: { light: '#5A2D2D', dark: '#3D1A1A' },
  3: { light: '#2D2D5A', dark: '#1A1A3D' },
};

const bonusColors: Record<GemColor, string[]> = {
  diamond: ['#F5F0E8', '#C8B99A'],
  sapphire: ['#3A7BD5', '#1B4F8A'],
  emerald: ['#27AE60', '#1A6B3C'],
  ruby: ['#E74C3C', '#8B1A1A'],
  onyx: ['#5D5D7A', '#1A1A2E'],
};

interface DevelopmentCardProps {
  card: DevelopmentCardType;
  state?: CardState;
  onClick?: () => void;
}

export default function DevelopmentCard({ card, state = 'default', onClick }: DevelopmentCardProps) {
  const tierColor = tierColors[card.tier];
  const size = 'w-[120px] h-[170px]';
  const colors = bonusColors[card.bonus];

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
        background: `
          repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
          linear-gradient(135deg, ${tierColor.light}, ${tierColor.dark})
        `,
        boxShadow: glowShadow,
        transformOrigin: 'center bottom',
      }}
      whileHover={hoverVariants[hoverState]}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start p-2">
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

      <div className="flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 40%, ${colors[0]} 0%, transparent 60%),
              radial-gradient(ellipse at 70% 60%, ${colors[1]} 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, ${colors[0]}40 0%, transparent 70%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
          }}
        />
        <div
          className="absolute bottom-2 right-2 text-white/40 font-bold text-xs"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          {['I', 'II', 'III'][card.tier - 1]}
        </div>
      </div>

      <div className="bg-black/30 rounded-b-xl p-2 min-h-[44px] flex items-center justify-center">
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
