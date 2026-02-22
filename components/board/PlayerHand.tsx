'use client';

import GemToken from '@/components/tokens/GemToken';
import DevelopmentCard from '@/components/cards/DevelopmentCard';
import CardBack from '@/components/cards/CardBack';
import type { Player, GemType, GemColor, DevelopmentCard as DevelopmentCardType, HiddenReservedCard } from '@/lib/game-engine/types';
import { ALL_GEM_TYPES, GEM_COLORS } from '@/lib/game-engine/types';
import { canPurchaseCard } from '@/lib/game-engine/rules';

interface PlayerHandProps {
  player: Player;
  isActive: boolean;
  onReservedCardClick?: (card: DevelopmentCardType) => void;
}

const bonusBgColors: Record<GemColor, string> = {
  diamond: 'rgba(245, 240, 232, 0.2)',
  sapphire: 'rgba(27, 79, 138, 0.6)',
  emerald: 'rgba(26, 107, 60, 0.6)',
  ruby: 'rgba(139, 26, 26, 0.6)',
  onyx: 'rgba(26, 26, 46, 0.8)',
};

export default function PlayerHand({ player, isActive, onReservedCardClick }: PlayerHandProps) {
  const totalGems = Object.values(player.gems).reduce((a, b) => a + b, 0);

  return (
    <div
      className="w-full border-t-2 px-6 py-3 flex items-center gap-6 overflow-x-auto"
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.85))',
        borderColor: isActive ? '#B8860B' : 'rgba(184,134,11,0.3)',
      }}
    >
      <div className="flex items-center gap-3 shrink-0">
        <div
          className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-[#B8860B] font-bold text-lg"
          style={{ background: 'rgba(0,0,0,0.8)', borderColor: '#B8860B' }}
        >
          {player.name[0]}
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-lg">{player.name}</span>
          <span className="text-[#B8860B] text-2xl font-bold" style={{ fontFamily: 'var(--font-cinzel)' }}>
            {player.prestige} pts
          </span>
          {isActive && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-semibold">YOUR TURN</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        <span className="text-[#B8860B] text-xs tracking-widest uppercase">Gems</span>
        <div className="flex gap-2">
          {ALL_GEM_TYPES.map(
            (gem) =>
              player.gems[gem] > 0 && (
                <div key={gem} className="flex flex-col items-center">
                  <GemToken type={gem} size="md" />
                  <span className="text-white font-bold text-sm mt-1">{player.gems[gem]}</span>
                </div>
              ),
          )}
        </div>
        <span className="text-white/60 text-xs">{totalGems}/10 tokens</span>
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        <span className="text-[#B8860B] text-xs tracking-widest uppercase">Reserved</span>
        <div className="flex gap-2">
          {player.reservedCards.map((card) => (
            <div key={card.id} className="scale-[0.55] origin-top-left -mr-12 -mb-16">
              {'hidden' in card && card.hidden ? (
                <CardBack tier={(card as HiddenReservedCard).tier} />
              ) : (
                <DevelopmentCard
                  card={card as DevelopmentCardType}
                  state={canPurchaseCard(player, card as DevelopmentCardType) ? 'affordable' : 'default'}
                  onClick={() => onReservedCardClick?.(card as DevelopmentCardType)}
                />
              )}
            </div>
          ))}
          {[...Array(3 - player.reservedCards.length)].map((_, i) => (
            <div
              key={`empty-${i}`}
              className="rounded-lg border-2 border-dashed"
              style={{
                width: 'calc(var(--card-width, 120px) * 0.55)',
                height: 'calc(var(--card-height, 170px) * 0.55)',
                borderColor: 'rgba(184,134,11,0.2)',
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        <span className="text-[#B8860B] text-xs tracking-widest uppercase">Bonuses</span>
        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
          {GEM_COLORS.map(
            (gem) =>
              player.bonuses[gem] > 0 && (
                <div
                  key={gem}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-sm font-bold text-white"
                  style={{ background: bonusBgColors[gem] }}
                >
                  <GemToken type={gem} size="xs" />
                  <span>&times;{player.bonuses[gem]}</span>
                </div>
              ),
          )}
        </div>
      </div>

      {player.nobles.length > 0 && (
        <div className="flex flex-col gap-1 shrink-0">
          <span className="text-[#B8860B] text-xs tracking-widest uppercase">Nobles</span>
          <div className="flex gap-1">
            {player.nobles.map((noble) => (
              <div
                key={noble.id}
                className="w-8 h-8 rounded bg-[#B8860B] flex items-center justify-center text-white text-xs font-bold"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                3
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
