'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GemToken from '@/components/tokens/GemToken';
import type { Player, GemType } from '@/lib/game-engine/types';
import { ALL_GEM_TYPES } from '@/lib/game-engine/types';

interface DiscardModalProps {
  player: Player;
  tokensToDiscard: number;
  onConfirm: (tokens: Partial<Record<GemType, number>>) => void;
}

export default function DiscardModal({ player, tokensToDiscard, onConfirm }: DiscardModalProps) {
  const [discarding, setDiscarding] = useState<Record<GemType, number>>({
    diamond: 0, sapphire: 0, emerald: 0, ruby: 0, onyx: 0, gold: 0,
  });

  const totalDiscarded = Object.values(discarding).reduce((a, b) => a + b, 0);
  const isValid = totalDiscarded === tokensToDiscard;

  function addDiscard(gem: GemType) {
    if (totalDiscarded >= tokensToDiscard) return;
    if (discarding[gem] >= player.gems[gem]) return;
    setDiscarding((prev) => ({ ...prev, [gem]: prev[gem] + 1 }));
  }

  function removeDiscard(gem: GemType) {
    if (discarding[gem] <= 0) return;
    setDiscarding((prev) => ({ ...prev, [gem]: prev[gem] - 1 }));
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        className="relative bg-[#1A1000] border-2 border-red-600/60 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        initial={{ scale: 0.8 }}
        animate={!isValid && totalDiscarded > 0 ? { scale: 1, x: [0, -5, 5, -5, 5, 0] } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <h2
          className="text-red-400 text-lg font-bold mb-2"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          Discard Tokens
        </h2>
        <p className="text-white/70 text-sm mb-4">
          You have too many tokens. Please discard <span className="text-red-400 font-bold">{tokensToDiscard}</span> token{tokensToDiscard > 1 ? 's' : ''}.
        </p>

        <div className="flex flex-col gap-3 mb-4">
          {ALL_GEM_TYPES.map((gem) => {
            if (player.gems[gem] === 0) return null;
            return (
              <div key={gem} className="flex items-center gap-3">
                <GemToken type={gem} size="md" />
                <span className="text-white font-bold min-w-[20px]">{player.gems[gem]}</span>
                <div className="flex items-center gap-2 ml-auto">
                  <motion.button
                    className="w-7 h-7 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 flex items-center justify-center disabled:opacity-30"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeDiscard(gem)}
                    disabled={discarding[gem] <= 0}
                  >
                    -
                  </motion.button>
                  <span className={`text-lg font-bold min-w-[20px] text-center ${discarding[gem] > 0 ? 'text-red-400' : 'text-white/30'}`}>
                    {discarding[gem]}
                  </span>
                  <motion.button
                    className="w-7 h-7 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 flex items-center justify-center disabled:opacity-30"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addDiscard(gem)}
                    disabled={discarding[gem] >= player.gems[gem] || totalDiscarded >= tokensToDiscard}
                  >
                    +
                  </motion.button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center text-white/50 text-sm mb-3">
          {totalDiscarded}/{tokensToDiscard} selected
        </div>

        <motion.button
          className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${
            isValid
              ? 'bg-red-700 hover:bg-red-600 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          style={{ fontFamily: 'var(--font-cinzel)' }}
          whileHover={isValid ? { scale: 1.02 } : undefined}
          whileTap={isValid ? { scale: 0.98 } : undefined}
          onClick={() => {
            if (isValid) {
              const toDiscard: Partial<Record<GemType, number>> = {};
              for (const [gem, count] of Object.entries(discarding)) {
                if (count > 0) toDiscard[gem as GemType] = count;
              }
              onConfirm(toDiscard);
            }
          }}
          disabled={!isValid}
        >
          Confirm Discard
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
