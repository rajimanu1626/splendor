'use client';

import { motion } from 'framer-motion';
import type { GemType } from '@/lib/game-engine/types';

const gemConfig: Record<GemType, { symbol: string; gradient: string; glow: string }> = {
  diamond: {
    symbol: '◆',
    gradient: 'radial-gradient(circle at 30% 30%, #FFFFFF, #F5F0E8 40%, #C8B99A)',
    glow: 'rgba(245, 240, 232, 0.5)',
  },
  sapphire: {
    symbol: '✦',
    gradient: 'radial-gradient(circle at 30% 30%, #3A7BD5, #1B4F8A 60%, #0D2750)',
    glow: 'rgba(58, 123, 213, 0.6)',
  },
  emerald: {
    symbol: '♦',
    gradient: 'radial-gradient(circle at 30% 30%, #27AE60, #1A6B3C 60%, #0D3520)',
    glow: 'rgba(39, 174, 96, 0.6)',
  },
  ruby: {
    symbol: '❤',
    gradient: 'radial-gradient(circle at 30% 30%, #E74C3C, #8B1A1A 60%, #450D0D)',
    glow: 'rgba(231, 76, 60, 0.6)',
  },
  onyx: {
    symbol: '●',
    gradient: 'radial-gradient(circle at 30% 30%, #5D5D7A, #1A1A2E 60%, #0A0A14)',
    glow: 'rgba(93, 93, 122, 0.6)',
  },
  gold: {
    symbol: '★',
    gradient: 'radial-gradient(circle at 30% 30%, #F1C40F, #C9981D 50%, #8B6914)',
    glow: 'rgba(241, 196, 15, 0.7)',
  },
};

const sizeMap = {
  xs: { className: 'w-5 h-5', fontSize: '9px' },
  sm: { className: 'w-7 h-7', fontSize: '12px' },
  md: { className: 'w-10 h-10', fontSize: '16px' },
  lg: { className: 'w-14 h-14', fontSize: '20px' },
};

interface GemTokenProps {
  type: GemType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  count?: number;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
}

export default function GemToken({
  type,
  size = 'md',
  count,
  onClick,
  disabled = false,
  selected = false,
}: GemTokenProps) {
  const config = gemConfig[type];
  const s = sizeMap[size];

  return (
    <div className="relative inline-block group">
      <motion.div
        className={`${s.className} rounded-full relative overflow-hidden cursor-pointer`}
        style={{
          background: config.gradient,
          boxShadow: selected
            ? `0 0 0 3px #F1C40F, 0 0 15px ${config.glow}`
            : `0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.4)`,
          opacity: disabled ? 0.4 : 1,
          filter: disabled ? 'grayscale(50%)' : 'none',
        }}
        whileHover={!disabled ? { scale: 1.15 } : undefined}
        whileTap={!disabled ? { scale: 0.95 } : undefined}
        onClick={!disabled ? onClick : undefined}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.3) 60deg, transparent 120deg, rgba(255,255,255,0.3) 180deg, transparent 240deg, rgba(255,255,255,0.3) 300deg, transparent 360deg)`,
          }}
        />
        <div
          className="absolute top-0 left-0 w-1/2 h-1/2 rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center text-white font-bold drop-shadow-lg"
          style={{ fontSize: s.fontSize }}
        >
          {config.symbol}
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 opacity-40"
          style={{
            background: 'radial-gradient(ellipse at bottom, rgba(0,0,0,0.6), transparent)',
          }}
        />
      </motion.div>

      {count !== undefined && count > 0 && (
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-1.5 py-0.5 text-[10px] font-bold text-black border border-gray-300 shadow-md min-w-[18px] text-center z-10">
          {count}
        </div>
      )}
    </div>
  );
}

export { gemConfig };
