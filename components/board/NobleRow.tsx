'use client';

import { AnimatePresence, motion } from 'framer-motion';
import NobleCard from '@/components/cards/NobleCard';
import type { NobleCard as NobleCardType } from '@/lib/game-engine/types';

interface NobleRowProps {
  nobles: NobleCardType[];
}

export default function NobleRow({ nobles }: NobleRowProps) {
  return (
    <div className="flex justify-center gap-3 pb-2">
      <AnimatePresence>
        {nobles.map((noble) => (
          <motion.div
            key={noble.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <NobleCard noble={noble} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
