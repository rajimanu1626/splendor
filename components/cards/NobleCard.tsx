'use client';

import { motion } from 'framer-motion';
import type { NobleCard as NobleCardType, GemColor } from '@/lib/game-engine/types';

const gemSymbols: Record<GemColor, string> = {
  diamond: '◆',
  sapphire: '✦',
  emerald: '♦',
  ruby: '❤',
  onyx: '●',
};

const gemTextColors: Record<GemColor, string> = {
  diamond: 'text-[#F5F0E8]',
  sapphire: 'text-[#3A7BD5]',
  emerald: 'text-[#2ECC71]',
  ruby: 'text-[#E74C3C]',
  onyx: 'text-[#9090B0]',
};

const nobleColors = [
  '#8B1A1A', '#1B4F8A', '#1A6B3C', '#C9981D', '#1A1A2E',
  '#5A2D2D', '#2D5A3D', '#2D2D5A', '#6B4226', '#4A0E4E',
];

interface NobleCardProps {
  noble: NobleCardType;
  claimed?: boolean;
  onClick?: () => void;
}

export default function NobleCard({ noble, claimed = false, onClick }: NobleCardProps) {
  const colorIdx = parseInt(noble.id.replace('n-', ''), 10) - 1;
  const robeColor = nobleColors[colorIdx % nobleColors.length];

  return (
    <motion.div
      className={`w-[100px] h-[100px] rounded-lg relative overflow-hidden
        ${!claimed ? 'cursor-pointer' : 'grayscale'}
      `}
      style={{
        borderColor: '#B8860B',
        borderWidth: '3px',
        borderStyle: 'solid',
        background: 'linear-gradient(135deg, #1A1000, #2D1F00)',
        boxShadow: !claimed ? '0 0 20px rgba(184,134,11,0.4)' : 'none',
      }}
      whileHover={!claimed ? { scale: 1.08 } : undefined}
      whileTap={!claimed ? { scale: 0.95 } : undefined}
      onClick={!claimed ? onClick : undefined}
      layout
    >
      <div
        className="absolute top-1 right-1 bg-[#B8860B] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold z-10"
        style={{ fontFamily: 'var(--font-cinzel)' }}
      >
        3
      </div>

      <div className="absolute inset-0 flex items-center justify-center pt-2">
        <div className="relative w-16 h-16">
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-12 rounded-full"
            style={{ background: 'radial-gradient(ellipse, #D4A574 30%, #B8956A 70%)' }}
          />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-4"
            style={{
              background: 'conic-gradient(from 180deg, #B8860B 0deg, #F1C40F 60deg, #B8860B 120deg, #F1C40F 180deg, #B8860B 240deg, #F1C40F 300deg, #B8860B 360deg)',
              clipPath: 'polygon(20% 100%, 35% 0%, 50% 100%, 65% 0%, 80% 100%, 90% 50%, 100% 100%, 0% 100%, 10% 50%)',
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-8"
            style={{
              background: `linear-gradient(180deg, ${robeColor}, ${robeColor}dd)`,
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
            }}
          />
        </div>
      </div>

      <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1 px-1 z-10">
        {Object.entries(noble.requirements).map(([gem, count]) => (
          <div key={gem} className="flex items-center gap-0.5 bg-black/80 rounded-full px-1.5 py-0.5 border border-white/10">
            <span className={`text-xs font-bold ${gemTextColors[gem as GemColor]}`}>
              {gemSymbols[gem as GemColor]}
            </span>
            <span className="text-white text-xs font-bold">{count}</span>
          </div>
        ))}
      </div>

      {claimed && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <span className="text-white/70 font-bold text-xs" style={{ fontFamily: 'var(--font-cinzel)' }}>
            CLAIMED
          </span>
        </div>
      )}
    </motion.div>
  );
}
