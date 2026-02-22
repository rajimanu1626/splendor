'use client';

import { motion } from 'framer-motion';

const tierColors: Record<number, string> = {
  1: '#2D5A3D',
  2: '#5A2D2D',
  3: '#2D2D5A',
};

interface CardBackProps {
  tier: 1 | 2 | 3;
  count?: number;
  onClick?: () => void;
}

export default function CardBack({ tier, count, onClick }: CardBackProps) {
  return (
    <div className="relative">
      <motion.div
        className="rounded-xl border-2 relative overflow-hidden cursor-pointer"
        style={{
          width: 'var(--card-width, 120px)',
          height: 'var(--card-height, 170px)',
          borderColor: '#B8860B',
          background: '#0D1B2A',
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {[60, 50, 40, 30].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                borderColor: `rgba(184,134,11,${0.3 - i * 0.05})`,
              }}
            />
          ))}
          <div
            className="absolute w-8 h-8 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(184,134,11,0.6), transparent 70%)' }}
          />
        </div>

        <div className="absolute top-0 left-0 right-0 h-2" style={{ background: tierColors[tier] }} />

        <div className="absolute bottom-3 left-0 right-0 text-center text-white/40 font-bold text-sm"
          style={{ fontFamily: 'var(--font-cinzel)' }}>
          {['I', 'II', 'III'][tier - 1]}
        </div>

        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(184,134,11,0.5) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 4s linear infinite',
          }}
        />
      </motion.div>

      {count !== undefined && count > 0 && (
        <div className="absolute -top-2 -right-2 bg-[#B8860B] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-black z-10">
          {count}
        </div>
      )}
    </div>
  );
}
