'use client';

import { motion } from 'framer-motion';
import type { RoomPlayerInfo } from '@/lib/game-protocol';
import type { AIDifficulty } from '@/lib/game-engine/types';

interface WaitingRoomProps {
  roomCode: string;
  hostId: string;
  players: RoomPlayerInfo[];
  canStart: boolean;
  myPlayerId: string | null;
  isHost: boolean;
  onLeave: () => void;
  onStart: () => void;
  onAddAI: (difficulty: AIDifficulty) => void;
}

export default function WaitingRoom({
  roomCode,
  hostId,
  players,
  canStart,
  myPlayerId,
  isHost,
  onLeave,
  onStart,
  onAddAI,
}: WaitingRoomProps) {
  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-white/50 text-sm mb-1">Room code</p>
        <motion.button
          className="text-4xl font-bold tracking-[0.4em] text-[#B8860B] px-4 py-2 rounded-lg border-2 border-[#B8860B]/50 hover:bg-[#B8860B]/10 transition-colors"
          style={{ fontFamily: 'var(--font-cinzel)' }}
          onClick={copyCode}
          whileTap={{ scale: 0.98 }}
        >
          {roomCode}
        </motion.button>
        <p className="text-white/40 text-xs mt-2">Click to copy · Share with friends</p>
      </div>

      <div>
        <h3 className="text-[#B8860B] text-sm tracking-widest mb-3">Players ({players.length}/4)</h3>
        <div className="space-y-2">
          {players.map((p) => (
            <motion.div
              key={p.playerId}
              className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10"
              layout
            >
              <div
                className={`w-3 h-3 rounded-full shrink-0 ${p.isAI ? 'bg-amber-500' : p.isConnected ? 'bg-green-500' : 'bg-white/30'}`}
              />
              <span className="text-white font-medium flex-1">{p.playerName}</span>
              {p.playerId === hostId && (
                <span className="text-[#B8860B] text-xs font-semibold">HOST</span>
              )}
              {p.playerId === myPlayerId && (
                <span className="text-white/60 text-xs">You</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {isHost && players.length < 4 && (
        <div>
          <p className="text-white/50 text-sm mb-2">Add AI opponent</p>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as AIDifficulty[]).map((diff) => (
              <motion.button
                key={diff}
                className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                whileTap={{ scale: 0.97 }}
                onClick={() => onAddAI(diff)}
              >
                AI ({diff})
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <motion.button
          className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
          style={{ fontFamily: 'var(--font-cinzel)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onLeave}
        >
          Leave
        </motion.button>
        {isHost && (
          <motion.button
            className="flex-1 py-3 rounded-xl bg-[#B8860B] hover:bg-[#D4A017] text-white font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none"
            style={{ fontFamily: 'var(--font-cinzel)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            disabled={!canStart}
          >
            Start Game
          </motion.button>
        )}
      </div>
    </div>
  );
}
