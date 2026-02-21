'use client';

import GemToken from './GemToken';
import type { GemType } from '@/lib/game-engine/types';

interface TokenPileProps {
  type: GemType;
  count: number;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
}

export default function TokenPile({ type, count, onClick, disabled, selected }: TokenPileProps) {
  return (
    <div className="relative flex items-center gap-2">
      <GemToken
        type={type}
        size="lg"
        onClick={onClick}
        disabled={disabled || count === 0}
        selected={selected}
      />
      <span className={`text-xl font-bold min-w-[24px] ${count > 0 ? 'text-white' : 'text-white/30'}`}>
        {count > 0 ? count : '–'}
      </span>
    </div>
  );
}
