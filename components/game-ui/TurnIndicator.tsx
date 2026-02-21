'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Player } from '@/lib/game-engine/types';

interface TurnIndicatorProps {
  currentPlayer: Player;
  round: number;
  phase: string;
  isAIThinking?: boolean;
  onUndo?: () => void;
  canUndo?: boolean;
}

export default function TurnIndicator({
  currentPlayer,
  round,
  phase,
  isAIThinking = false,
  onUndo,
  canUndo = false,
}: TurnIndicatorProps) {
  return (
    <div
      className="w-full h-12 px-6 flex items-center justify-between z-10"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
    >
      <div className="text-[#B8860B] text-xl font-bold tracking-wider" style={{ fontFamily: 'var(--font-cinzel)' }}>
        SPLENDOR
      </div>

      <div className="flex items-center gap-4">
        <span className="text-white/70 text-sm">Round {round}</span>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPlayer.id}
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white font-semibold">{currentPlayer.name}&apos;s Turn</span>
            {currentPlayer.isAI && (
              <span className="text-[10px] bg-[#B8860B]/30 text-[#B8860B] px-1.5 py-0.5 rounded">AI</span>
            )}
          </motion.div>
        </AnimatePresence>

        {isAIThinking && (
          <motion.div className="flex items-center gap-1 text-[#B8860B]">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#B8860B]"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {canUndo && onUndo && (
          <motion.button
            className="text-white/50 hover:text-white text-sm px-3 py-1 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onUndo}
          >
            Undo
          </motion.button>
        )}
      </div>
    </div>
  );
}
