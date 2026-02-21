'use client';

import { AnimatePresence, motion } from 'framer-motion';
import DevelopmentCard from '@/components/cards/DevelopmentCard';
import CardBack from '@/components/cards/CardBack';
import type { DevelopmentCard as DevelopmentCardType, Player } from '@/lib/game-engine/types';
import { canPurchaseCard } from '@/lib/game-engine/rules';

interface TierRow {
  tier: 1 | 2 | 3;
  visible: (DevelopmentCardType | null)[];
  deckCount: number;
}

interface CardGridProps {
  tiers: TierRow[];
  currentPlayer: Player | null;
  onCardClick: (card: DevelopmentCardType) => void;
  onDeckClick: (tier: 1 | 2 | 3) => void;
  disabled?: boolean;
}

const tierLabels: Record<number, { label: string; color: string }> = {
  3: { label: 'III', color: '#2D2D5A' },
  2: { label: 'II', color: '#5A2D2D' },
  1: { label: 'I', color: '#2D5A3D' },
};

export default function CardGrid({ tiers, currentPlayer, onCardClick, onDeckClick, disabled }: CardGridProps) {
  function getCardState(card: DevelopmentCardType): 'affordable' | 'unaffordable' | 'default' {
    if (!currentPlayer || disabled) return 'default';
    return canPurchaseCard(currentPlayer, card) ? 'affordable' : 'unaffordable';
  }

  return (
    <div className="flex flex-col gap-1">
      {tiers.map(({ tier, visible, deckCount }) => (
        <div key={tier} className="flex items-center gap-3 py-2">
          <div
            className="w-12 h-8 rounded flex items-center justify-center font-bold text-white text-sm shrink-0"
            style={{ background: tierLabels[tier].color, fontFamily: 'var(--font-cinzel)' }}
          >
            {tierLabels[tier].label}
          </div>

          <div className="relative shrink-0">
            {deckCount >= 3 && (
              <div className="absolute top-1 left-1 opacity-40">
                <CardBack tier={tier} />
              </div>
            )}
            {deckCount >= 2 && (
              <div className="absolute top-0.5 left-0.5 opacity-60">
                <CardBack tier={tier} />
              </div>
            )}
            <CardBack tier={tier} count={deckCount} onClick={() => !disabled && onDeckClick(tier)} />
          </div>

          <div className="flex gap-3 overflow-visible">
            <AnimatePresence mode="popLayout">
              {visible.map((card, i) =>
                card ? (
                  <motion.div
                    key={card.id}
                    className="shrink-0 relative"
                    style={{ overflow: 'visible' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <DevelopmentCard
                      card={card}
                      state={getCardState(card)}
                      onClick={() => !disabled && onCardClick(card)}
                    />
                  </motion.div>
                ) : (
                  <div
                    key={`empty-${tier}-${i}`}
                    className="w-[120px] h-[170px] rounded-xl border-2 border-dashed flex items-center justify-center shrink-0"
                    style={{ borderColor: 'rgba(184,134,11,0.2)' }}
                  />
                ),
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
