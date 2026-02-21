'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GameBoard from '@/components/board/GameBoard';
import { useGameStore } from '@/lib/game-engine/gameState';

export default function GamePage() {
  const router = useRouter();
  const phase = useGameStore((s) => s.phase);
  const playersCount = useGameStore((s) => s.players.length);

  useEffect(() => {
    if (phase === 'setup' || playersCount === 0) {
      router.replace('/setup');
    }
  }, [phase, playersCount, router]);

  if (phase === 'setup' || playersCount === 0) {
    return (
      <div
        className="w-screen h-screen flex items-center justify-center"
        style={{ background: '#0D0702' }}
      >
        <div className="text-[#B8860B] text-xl" style={{ fontFamily: 'var(--font-cinzel)' }}>
          Loading game...
        </div>
      </div>
    );
  }

  return <GameBoard />;
}
