'use client';

import TokenPile from '@/components/tokens/TokenPile';
import type { GemColor, GemType } from '@/lib/game-engine/types';
import { GEM_COLORS } from '@/lib/game-engine/types';

interface TokenBankProps {
  tokens: Record<GemType, number>;
  selectedTokens: GemColor[];
  onTokenClick: (color: GemColor) => void;
  disabled?: boolean;
}

export default function TokenBank({ tokens, selectedTokens, onTokenClick, disabled }: TokenBankProps) {
  return (
    <div
      className="w-[140px] rounded-xl border-l p-4 flex flex-col gap-3 h-full"
      style={{
        background: 'rgba(0,0,0,0.4)',
        borderColor: 'rgba(184,134,11,0.3)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <h3
        className="text-[#B8860B] text-xs tracking-widest text-center"
        style={{ fontFamily: 'var(--font-cinzel)' }}
      >
        GEM BANK
      </h3>

      {GEM_COLORS.map((gem) => (
        <TokenPile
          key={gem}
          type={gem}
          count={tokens[gem]}
          onClick={() => onTokenClick(gem)}
          disabled={disabled}
          selected={selectedTokens.includes(gem)}
        />
      ))}

      <div className="border-t border-[#B8860B]/30" />

      <div className="flex items-center gap-2">
        <TokenPile type="gold" count={tokens.gold} disabled />
        <div className="flex flex-col -ml-2">
          <span className="text-[#B8860B]/60 text-[10px] italic">wild</span>
        </div>
      </div>
    </div>
  );
}
