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
      className="rounded-xl border-l p-3 flex flex-col gap-2 h-fit shrink-0 min-w-0 overflow-hidden"
      style={{
        width: 'var(--token-bank-width, 140px)',
        maxWidth: 'var(--token-bank-width, 140px)',
        background: 'rgba(0,0,0,0.4)',
        borderColor: 'rgba(184,134,11,0.3)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <h3
        className="text-[#B8860B] text-xs tracking-widest text-center shrink-0 truncate"
        style={{ fontFamily: 'var(--font-cinzel)' }}
      >
        GEM BANK
      </h3>

      <div className="flex flex-col gap-2 overflow-hidden">
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
      </div>

      <div className="border-t border-[#B8860B]/30 shrink-0" />

      <div className="flex items-center gap-2 shrink-0 min-w-0">
        <TokenPile type="gold" count={tokens.gold} disabled tokenSize="sm" tokenScale={1.2} />
        <div className="flex flex-col -ml-2 min-w-0">
          <span className="text-[#B8860B]/60 text-[10px] italic truncate">wild</span>
        </div>
      </div>
    </div>
  );
}
