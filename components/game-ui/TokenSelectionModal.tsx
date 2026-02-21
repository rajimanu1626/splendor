'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import GemToken from '@/components/tokens/GemToken';
import type { GemColor, GemType } from '@/lib/game-engine/types';
import { GEM_COLORS } from '@/lib/game-engine/types';
import { canTakeThreeTokens, canTakeTwoTokens } from '@/lib/game-engine/rules';

interface TokenSelectionModalProps {
  bankTokens: Record<GemType, number>;
  onConfirmThree: (colors: GemColor[]) => void;
  onConfirmTwo: (color: GemColor) => void;
  onClose: () => void;
}

export default function TokenSelectionModal({
  bankTokens,
  onConfirmThree,
  onConfirmTwo,
  onClose,
}: TokenSelectionModalProps) {
  const [selected, setSelected] = useState<GemColor[]>([]);
  const [mode, setMode] = useState<'three' | 'two' | null>(null);

  const toggleColor = useCallback(
    (color: GemColor) => {
      if (mode === 'two') {
        setSelected([color]);
        return;
      }

      setSelected((prev) => {
        if (prev.includes(color)) return prev.filter((c) => c !== color);
        if (prev.length >= 3) return prev;
        return [...prev, color];
      });
    },
    [mode],
  );

  const canConfirmThree = mode === 'three' && selected.length > 0 && selected.length <= 3;
  const validThree = canConfirmThree && canTakeThreeTokens(
    selected.length === 3 ? selected : [],
    bankTokens,
  );

  const canConfirmTwo = mode === 'two' && selected.length === 1 && canTakeTwoTokens(selected[0], bankTokens);

  const availableThree = GEM_COLORS.filter((c) => bankTokens[c] > 0).length >= 3 ||
    GEM_COLORS.filter((c) => bankTokens[c] > 0).length > 0;
  const availableTwo = GEM_COLORS.some((c) => bankTokens[c] >= 4);

  function handleConfirm() {
    if (mode === 'three' && selected.length > 0 && selected.length <= 3) {
      const available = selected.filter((c) => bankTokens[c] > 0);
      if (available.length === selected.length) {
        onConfirmThree(selected);
      }
    } else if (mode === 'two' && selected.length === 1) {
      onConfirmTwo(selected[0]);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative bg-[#1A1000] border-2 border-[#B8860B] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <button className="absolute top-3 right-3 text-white/50 hover:text-white text-xl" onClick={onClose}>
          &times;
        </button>

        <h2 className="text-[#B8860B] text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-cinzel)' }}>
          Take Tokens
        </h2>

        <div className="flex gap-3 mb-4">
          <motion.button
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-colors ${
              mode === 'three' ? 'bg-[#B8860B] text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setMode('three'); setSelected([]); }}
          >
            3 Different
          </motion.button>
          <motion.button
            className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-colors ${
              mode === 'two' ? 'bg-[#B8860B] text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
            } ${!availableTwo ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileTap={availableTwo ? { scale: 0.95 } : undefined}
            onClick={() => { if (availableTwo) { setMode('two'); setSelected([]); } }}
            disabled={!availableTwo}
          >
            2 Same (≥4)
          </motion.button>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-4 justify-items-center">
          {GEM_COLORS.map((color) => {
            const count = bankTokens[color];
            const isSelected = selected.includes(color);
            const disabled =
              count === 0 ||
              (mode === 'two' && count < 4) ||
              (mode === 'three' && !isSelected && selected.length >= 3);

            return (
              <div key={color} className="flex flex-col items-center gap-1">
                <GemToken
                  type={color}
                  size="lg"
                  selected={isSelected}
                  disabled={disabled && !isSelected}
                  onClick={() => {
                    if (!mode) setMode('three');
                    if (!disabled || isSelected) toggleColor(color);
                  }}
                />
                <span className={`text-sm font-bold ${count > 0 ? 'text-white' : 'text-white/30'}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div className="flex items-center gap-2 justify-center mb-4 text-white/70 text-sm">
            Selected: {selected.map((c) => (
              <GemToken key={c} type={c} size="sm" />
            ))}
          </div>
        )}

        <motion.button
          className={`w-full py-3 rounded-xl font-bold text-lg transition-colors ${
            (mode === 'three' && selected.length > 0 && selected.length <= 3) || canConfirmTwo
              ? 'bg-[#B8860B] hover:bg-[#D4A017] text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          style={{ fontFamily: 'var(--font-cinzel)' }}
          whileHover={((mode === 'three' && selected.length > 0) || canConfirmTwo) ? { scale: 1.02 } : undefined}
          whileTap={((mode === 'three' && selected.length > 0) || canConfirmTwo) ? { scale: 0.98 } : undefined}
          onClick={handleConfirm}
          disabled={!((mode === 'three' && selected.length > 0 && selected.length <= 3) || canConfirmTwo)}
        >
          Confirm
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
