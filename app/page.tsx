'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import GemToken from '@/components/tokens/GemToken';
import type { GemType } from '@/lib/game-engine/types';

const floatingGems: { type: GemType; x: number; y: number; delay: number; duration: number }[] = [
  { type: 'diamond', x: 10, y: 20, delay: 0, duration: 6 },
  { type: 'sapphire', x: 80, y: 15, delay: 1.2, duration: 7 },
  { type: 'emerald', x: 25, y: 70, delay: 0.5, duration: 5.5 },
  { type: 'ruby', x: 70, y: 65, delay: 2, duration: 8 },
  { type: 'onyx', x: 50, y: 40, delay: 0.8, duration: 6.5 },
  { type: 'gold', x: 90, y: 80, delay: 1.5, duration: 7.5 },
  { type: 'diamond', x: 40, y: 85, delay: 3, duration: 6 },
  { type: 'sapphire', x: 15, y: 50, delay: 2.5, duration: 5 },
  { type: 'ruby', x: 60, y: 25, delay: 1, duration: 7 },
  { type: 'emerald', x: 85, y: 45, delay: 0.3, duration: 6.5 },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex flex-col items-center justify-center"
      style={{
        background: `
          repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(255,255,255,0.01) 48px, rgba(255,255,255,0.01) 50px),
          repeating-linear-gradient(0deg, transparent 0px, transparent 100px, rgba(0,0,0,0.08) 100px, rgba(0,0,0,0.08) 102px),
          radial-gradient(ellipse at 50% 30%, #2C1810 0%, #0D0702 100%)
        `,
      }}
    >
      {mounted && floatingGems.map((gem, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none opacity-20"
          style={{ left: `${gem.x}%`, top: `${gem.y}%` }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 10, -10, 5, 0],
            rotate: [0, 10, -5, 8, 0],
          }}
          transition={{
            duration: gem.duration,
            delay: gem.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <GemToken type={gem.type} size="lg" />
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className="text-7xl md:text-8xl font-bold mb-4 tracking-widest"
          style={{
            fontFamily: 'var(--font-cinzel)',
            background: 'linear-gradient(180deg, #F1C40F 0%, #B8860B 50%, #8B6914 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 20px rgba(184, 134, 11, 0.4))',
          }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          SPLENDOR
        </motion.h1>

        <motion.p
          className="text-white/50 text-lg mb-12 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          The Renaissance Gem Trading Game
        </motion.p>

        <div className="flex flex-col gap-4 items-center">
          <Link href="/setup?mode=ai">
            <motion.button
              className="w-72 py-4 rounded-xl bg-[#B8860B] hover:bg-[#D4A017] text-white font-bold text-xl transition-colors shadow-lg shadow-[#B8860B]/30"
              style={{ fontFamily: 'var(--font-cinzel)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              Play vs AI
            </motion.button>
          </Link>

          <Link href="/setup?mode=local">
            <motion.button
              className="w-72 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xl transition-colors border border-[#B8860B]/30"
              style={{ fontFamily: 'var(--font-cinzel)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              Local Multiplayer
            </motion.button>
          </Link>

          <Link href="/lobby">
            <motion.button
              className="w-72 py-4 rounded-xl bg-[#1a472a] hover:bg-[#2d5a3d] text-white font-bold text-xl transition-colors border border-[#2d5a3d]/50"
              style={{ fontFamily: 'var(--font-cinzel)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              Play Online
            </motion.button>
          </Link>

          <motion.button
            className="w-72 py-3 rounded-xl text-white/50 hover:text-white/80 font-semibold text-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            onClick={() => {
              const el = document.getElementById('rules');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            How to Play
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 text-white/20 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Built with Next.js, Zustand, Framer Motion &amp; Tailwind CSS
      </motion.div>
    </div>
  );
}
