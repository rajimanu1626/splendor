'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface JoinRoomProps {
  onJoin: (roomCode: string, playerName: string) => void;
  disabled?: boolean;
}

export default function JoinRoom({ onJoin, disabled }: JoinRoomProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  return (
    <div className="space-y-4">
      <div>
        <label className="text-white/70 text-sm block mb-2">Your name</label>
        <input
          className="w-full bg-white/10 border border-[#B8860B]/40 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#B8860B]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          maxLength={20}
        />
      </div>
      <div>
        <label className="text-white/70 text-sm block mb-2">Room code</label>
        <input
          className="w-full bg-white/10 border border-[#B8860B]/40 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#B8860B] uppercase tracking-widest"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 4))}
          placeholder="XXXX"
          maxLength={4}
        />
      </div>
      <motion.button
        className="w-full py-3 rounded-xl bg-[#B8860B] hover:bg-[#D4A017] text-white font-bold transition-colors disabled:opacity-50"
        style={{ fontFamily: 'var(--font-cinzel)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onJoin(code.trim(), name.trim() || 'Player')}
        disabled={disabled || !name.trim() || code.trim().length < 4}
      >
        Join Game
      </motion.button>
    </div>
  );
}
