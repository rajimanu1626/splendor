'use client';

import { motion, AnimatePresence } from 'framer-motion';
import GemToken from '@/components/tokens/GemToken';
import DevelopmentCard from '@/components/cards/DevelopmentCard';
import type { DevelopmentCard as DevelopmentCardType, Player, GemColor } from '@/lib/game-engine/types';
import { GEM_COLORS } from '@/lib/game-engine/types';
import { canPurchaseCard, canReserveCard, calculateGemPayment } from '@/lib/game-engine/rules';

interface ActionModalProps {
  card: DevelopmentCardType;
  player: Player;
  viewOnly?: boolean;
  onPurchase: () => void;
  onReserve: () => void;
  onClose: () => void;
}

export default function ActionModal({ card, player, viewOnly = false, onPurchase, onReserve, onClose }: ActionModalProps) {
  const affordable = canPurchaseCard(player, card);
  const canReserve = canReserveCard(player);
  const payment = affordable ? calculateGemPayment(player, card) : null;

  return (
    <AnimatePresence>
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
          <button
            className="absolute top-3 right-3 text-white/50 hover:text-white text-xl"
            onClick={onClose}
          >
            &times;
          </button>

          <h2
            className="text-[#B8860B] text-lg font-bold mb-4"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            {viewOnly ? 'Card Details' : 'Card Action'}
          </h2>

          <div className="flex justify-center mb-4">
            <DevelopmentCard card={card} state={affordable ? 'affordable' : 'unaffordable'} />
          </div>

          {affordable && payment && (
            <div className="mb-4">
              <p className="text-white/70 text-sm mb-2">Payment:</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {GEM_COLORS.map(
                  (color) =>
                    payment[color] > 0 && (
                      <div key={color} className="flex items-center gap-1 bg-black/40 rounded-full px-2 py-1">
                        <GemToken type={color} size="xs" />
                        <span className="text-white text-sm font-bold">{payment[color]}</span>
                      </div>
                    ),
                )}
                {payment.gold > 0 && (
                  <div className="flex items-center gap-1 bg-black/40 rounded-full px-2 py-1">
                    <GemToken type="gold" size="xs" />
                    <span className="text-white text-sm font-bold">{payment.gold}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {!affordable && (
            <div className="mb-4">
              <p className="text-red-400/80 text-sm mb-2">Shortfall:</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {GEM_COLORS.map((color) => {
                  const cost = card.cost[color] || 0;
                  const have = player.gems[color] + player.bonuses[color];
                  const deficit = cost - have;
                  if (deficit <= 0) return null;
                  return (
                    <div key={color} className="flex items-center gap-1 bg-red-900/30 rounded-full px-2 py-1">
                      <GemToken type={color} size="xs" />
                      <span className="text-red-400 text-sm font-bold">-{deficit}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!viewOnly && (
            <div className="flex gap-3 mt-4">
              <motion.button
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-colors ${
                  affordable
                    ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                style={{ fontFamily: 'var(--font-cinzel)' }}
                whileHover={affordable ? { scale: 1.02 } : undefined}
                whileTap={affordable ? { scale: 0.98 } : undefined}
                onClick={affordable ? onPurchase : undefined}
                disabled={!affordable}
              >
                Purchase
              </motion.button>

              <motion.button
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-colors ${
                  canReserve
                    ? 'bg-[#B8860B] hover:bg-[#D4A017] text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                style={{ fontFamily: 'var(--font-cinzel)' }}
                whileHover={canReserve ? { scale: 1.02 } : undefined}
                whileTap={canReserve ? { scale: 0.98 } : undefined}
                onClick={canReserve ? onReserve : undefined}
                disabled={!canReserve}
              >
                Reserve
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
