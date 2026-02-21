'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player } from '@/lib/game-engine/types';

interface WinScreenProps {
  winner: Player;
  players: Player[];
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

function Confetti() {
  const [pieces, setPieces] = useState<Array<{ id: number; x: number; color: string; delay: number; size: number }>>([]);

  useEffect(() => {
    const colors = ['#F1C40F', '#E74C3C', '#3A7BD5', '#27AE60', '#F5F0E8', '#B8860B'];
    const newPieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      size: 4 + Math.random() * 8,
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute rounded-sm"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size,
            background: piece.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: 360 + Math.random() * 720 }}
          transition={{
            duration: 3 + Math.random() * 3,
            delay: piece.delay,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

export default function WinScreen({ winner, players, onPlayAgain, onMainMenu }: WinScreenProps) {
  const sorted = [...players].sort((a, b) => b.prestige - a.prestige || a.purchasedCards.length - b.purchasedCards.length);

  return (
    <>
      <Confetti />
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

        <motion.div
          className="relative bg-gradient-to-b from-[#2D1F00] to-[#1A1000] border-2 border-[#B8860B] rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl text-center"
          initial={{ scale: 0.5, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
        >
          <motion.div
            className="text-6xl mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            👑
          </motion.div>

          <motion.h1
            className="text-[#B8860B] text-3xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-cinzel)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {winner.name} Wins!
          </motion.h1>

          <motion.p
            className="text-white/70 text-lg mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {winner.prestige} prestige points · {winner.purchasedCards.length} cards
          </motion.p>

          <div className="mb-6">
            {sorted.map((player, i) => (
              <motion.div
                key={player.id}
                className={`flex items-center justify-between px-4 py-2 rounded-lg mb-1 ${
                  player.id === winner.id ? 'bg-[#B8860B]/20' : 'bg-white/5'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.15 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#B8860B] font-bold text-lg w-6">{i + 1}.</span>
                  <span className={`font-semibold ${player.id === winner.id ? 'text-[#B8860B]' : 'text-white/80'}`}>
                    {player.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-white/60">{player.purchasedCards.length} cards</span>
                  <span className="text-white font-bold">{player.prestige} pts</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3">
            <motion.button
              className="flex-1 py-3 rounded-xl bg-[#B8860B] hover:bg-[#D4A017] text-white font-bold text-lg transition-colors"
              style={{ fontFamily: 'var(--font-cinzel)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPlayAgain}
            >
              Play Again
            </motion.button>
            <motion.button
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg transition-colors"
              style={{ fontFamily: 'var(--font-cinzel)' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onMainMenu}
            >
              Main Menu
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
