'use client';

import GemToken from './GemToken';
import type { GemType } from '@/lib/game-engine/types';

interface TokenPileProps {
  type: GemType;
  count: number;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  tokenSize?: 'xs' | 'sm' | 'md' | 'lg';
  tokenScale?: number;
}

export default function TokenPile({ type, count, onClick, disabled, selected, tokenSize = 'md', tokenScale = 1.5 }: TokenPileProps) {
  return (
    <div className="relative flex items-center gap-2">
      <GemToken
        type={type}
        size={tokenSize}
        scale={tokenScale}
        onClick={onClick}
        disabled={disabled || count === 0}
        selected={selected}
      />
      <span className={`text-lg font-bold min-w-[20px] ${count > 0 ? 'text-white' : 'text-white/30'}`}>
        {count > 0 ? count : '–'}
      </span>
    </div>
  );
}
