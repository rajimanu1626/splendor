'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import GemToken from '@/components/tokens/GemToken';
import { useGameStore } from '@/lib/game-engine/gameState';
import type { AIDifficulty, SetupPlayer } from '@/lib/game-engine/types';
import { Suspense } from 'react';

function SetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'ai';
  const initGame = useGameStore((s) => s.initGame);

  const [playerCount, setPlayerCount] = useState(mode === 'ai' ? 2 : 2);
  const [players, setPlayers] = useState<SetupPlayer[]>([
    { name: 'Player 1', isAI: false },
    { name: 'AI Opponent', isAI: mode === 'ai', aiDifficulty: 'medium' },
    { name: 'Player 3', isAI: mode === 'ai', aiDifficulty: 'medium' },
    { name: 'Player 4', isAI: mode === 'ai', aiDifficulty: 'medium' },
  ]);

  useEffect(() => {
    if (mode === 'ai') {
      setPlayers((prev) => prev.map((p, i) => i === 0 ? { ...p, isAI: false } : { ...p, isAI: true, aiDifficulty: p.aiDifficulty || 'medium' }));
    }
  }, [mode]);

  function handleStart() {
    const activePlayers = players.slice(0, playerCount);
    initGame(activePlayers);
    router.push('/game');
  }

  function updatePlayer(index: number, updates: Partial<SetupPlayer>) {
    setPlayers((prev) => prev.map((p, i) => i === index ? { ...p, ...updates } : p));
  }

  return (
    <div
      className="w-screen min-h-screen flex items-center justify-center p-8"
      style={{
        background: `
          radial-gradient(ellipse at 50% 30%, #2C1810 0%, #0D0702 100%)
        `,
      }}
    >
      <motion.div
        className="bg-[#1A1000]/80 border-2 border-[#B8860B]/50 rounded-2xl p-8 max-w-xl w-full shadow-2xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-3xl text-[#B8860B] font-bold mb-8 text-center tracking-widest"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          GAME SETUP
        </h1>

        <div className="mb-6">
          <label className="text-white/70 text-sm mb-2 block">Number of Players</label>
          <div className="flex gap-3">
            {[2, 3, 4].map((n) => (
              <motion.button
                key={n}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-colors ${
                  playerCount === n
                    ? 'bg-[#B8860B] text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPlayerCount(n)}
              >
                {n}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          {Array.from({ length: playerCount }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#B8860B]/20 border border-[#B8860B]/50 flex items-center justify-center text-[#B8860B] font-bold">
                  {i + 1}
                </div>
                <input
                  className="flex-1 bg-transparent border-b border-white/20 text-white text-lg py-1 px-2 focus:outline-none focus:border-[#B8860B] transition-colors"
                  value={players[i].name}
                  onChange={(e) => updatePlayer(i, { name: e.target.value })}
                  placeholder={`Player ${i + 1}`}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={players[i].isAI}
                    onChange={(e) => updatePlayer(i, {
                      isAI: e.target.checked,
                      aiDifficulty: e.target.checked ? 'medium' : undefined,
                    })}
                    className="sr-only"
                    disabled={i === 0 && mode === 'local'}
                  />
                  <div className={`w-10 h-5 rounded-full transition-colors relative ${players[i].isAI ? 'bg-[#B8860B]' : 'bg-white/20'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${players[i].isAI ? 'left-5.5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-white/70 text-sm">AI Player</span>
                </label>

                {players[i].isAI && (
                  <div className="flex gap-2 ml-auto">
                    {(['easy', 'medium', 'hard'] as AIDifficulty[]).map((diff) => (
                      <motion.button
                        key={diff}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          players[i].aiDifficulty === diff
                            ? 'bg-[#B8860B] text-white'
                            : 'bg-white/10 text-white/50 hover:bg-white/20'
                        }`}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updatePlayer(i, { aiDifficulty: diff })}
                      >
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-white/40 text-sm mb-2 text-center">
            {playerCount + 1} nobles will be used · Tokens: {playerCount === 2 ? 4 : playerCount === 3 ? 5 : 7} per gem
          </p>
          <div className="flex justify-center gap-2">
            {(['diamond', 'sapphire', 'emerald', 'ruby', 'onyx'] as const).map((gem) => (
              <GemToken key={gem} type={gem} size="lg" scale={1.5} />
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <motion.button
            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg transition-colors"
            style={{ fontFamily: 'var(--font-cinzel)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
          >
            Back
          </motion.button>

          <motion.button
            className="flex-1 py-3 rounded-xl bg-[#B8860B] hover:bg-[#D4A017] text-white font-bold text-lg transition-colors shadow-lg shadow-[#B8860B]/30"
            style={{ fontFamily: 'var(--font-cinzel)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
          >
            Start Game
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="w-screen h-screen flex items-center justify-center" style={{ background: '#0D0702' }}>
        <div className="text-[#B8860B] text-xl" style={{ fontFamily: 'var(--font-cinzel)' }}>Loading...</div>
      </div>
    }>
      <SetupContent />
    </Suspense>
  );
}
