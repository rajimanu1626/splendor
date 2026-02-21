'use client';

import { motion } from 'framer-motion';
import NobleCard from '@/components/cards/NobleCard';
import type { NobleCard as NobleCardType } from '@/lib/game-engine/types';

interface NobleChoiceModalProps {
  nobles: NobleCardType[];
  onSelect: (nobleId: string) => void;
}

export default function NobleChoiceModal({ nobles, onSelect }: NobleChoiceModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        className="relative bg-[#1A1000] border-2 border-[#B8860B] rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <h2
          className="text-[#B8860B] text-lg font-bold mb-2 text-center"
          style={{ fontFamily: 'var(--font-cinzel)' }}
        >
          Choose a Noble
        </h2>
        <p className="text-white/70 text-sm mb-6 text-center">
          Multiple nobles are available. Select one to claim.
        </p>

        <div className="flex justify-center gap-4">
          {nobles.map((noble) => (
            <motion.div
              key={noble.id}
              whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(184,134,11,0.6)' }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer rounded-lg"
              onClick={() => onSelect(noble.id)}
            >
              <NobleCard noble={noble} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
