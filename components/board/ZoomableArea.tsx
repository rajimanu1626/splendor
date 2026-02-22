'use client';

import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react';

const STORAGE_KEY = 'splendor_board_zoom';

interface ZoomableAreaProps {
  children: ReactNode;
  minScale?: number;
  maxScale?: number;
  step?: number;
}

export default function ZoomableArea({
  children,
  minScale = 0.5,
  maxScale = 1.5,
  step = 0.1,
}: ZoomableAreaProps) {
  const [scale, setScale] = useState(1);
  const lastDistance = useRef<number | null>(null);

  const clamp = useCallback(
    (v: number) => Math.min(maxScale, Math.max(minScale, v)),
    [minScale, maxScale],
  );

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = parseFloat(stored);
        if (!Number.isNaN(parsed)) setScale(clamp(parsed));
      }
    } catch {
      // ignore
    }
  }, [clamp]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, String(scale));
    } catch {
      // ignore
    }
  }, [scale]);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        lastDistance.current = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
      }
    },
    [],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 2) return;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      if (lastDistance.current !== null) {
        const delta = (dist - lastDistance.current) * 0.005;
        setScale((s) => clamp(s + delta));
      }
      lastDistance.current = dist;
    },
    [clamp],
  );

  const onTouchEnd = useCallback(() => {
    lastDistance.current = null;
  }, []);

  const zoomIn = useCallback(() => {
    setScale((s) => clamp(s + step));
  }, [clamp, step]);

  const zoomOut = useCallback(() => {
    setScale((s) => clamp(s - step));
  }, [clamp, step]);

  return (
    <div
      className="relative flex-1 min-h-0 min-w-0 overflow-auto scrollbar-hide"
      style={{ touchAction: 'none' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div
        className="flex flex-col min-w-0 origin-top-left"
        style={{
          transform: `scale(${scale})`,
          width: `${100 / scale}%`,
          minHeight: `${100 / scale}%`,
        }}
      >
        {children}
      </div>

      <div className="absolute top-2 right-2 z-20 flex flex-col gap-1 pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-1">
          <button
            type="button"
            onClick={zoomIn}
            className="w-8 h-8 rounded-md flex items-center justify-center bg-black/60 hover:bg-black/80 border border-[#B8860B]/50 text-[#B8860B] font-bold text-lg leading-none transition-colors"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={zoomOut}
            className="w-8 h-8 rounded-md flex items-center justify-center bg-black/60 hover:bg-black/80 border border-[#B8860B]/50 text-[#B8860B] font-bold text-lg leading-none transition-colors"
            aria-label="Zoom out"
          >
            −
          </button>
        </div>
      </div>
    </div>
  );
}
