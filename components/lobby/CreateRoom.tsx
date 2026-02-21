'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface CreateRoomProps {
  onCreate: (playerName: string) => void;
  disabled?: boolean;
}

export default function CreateRoom({ onCreate, disabled }: CreateRoomProps) {
  const [name, setName] = useState('');

  return (
    <div className="space-y-4">
      <label className="text-white/70 text-sm block">Your name</label>
      <input
        className="w-full bg-white/10 border border-[#B8860B]/40 rounded-xl text-white px-4 py-3 focus:outline-none focus:border-[#B8860B]"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        maxLength={20}
      />
      <motion.button
        className="w-full py-3 rounded-xl bg-[#B8860B] hover:bg-[#D4A017] text-white font-bold transition-colors disabled:opacity-50"
        style={{ fontFamily: 'var(--font-cinzel)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onCreate(name.trim() || 'Player')}
        disabled={disabled || !name.trim()}
      >
        Create Game
      </motion.button>
    </div>
  );
}
