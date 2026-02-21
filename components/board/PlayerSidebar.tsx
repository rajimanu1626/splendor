'use client';

import GemToken from '@/components/tokens/GemToken';
import type { Player, GemType, GemColor } from '@/lib/game-engine/types';
import { ALL_GEM_TYPES, GEM_COLORS } from '@/lib/game-engine/types';

const bonusBgColors: Record<GemColor, string> = {
  diamond: 'rgba(245, 240, 232, 0.2)',
  sapphire: 'rgba(27, 79, 138, 0.6)',
  emerald: 'rgba(26, 107, 60, 0.6)',
  ruby: 'rgba(139, 26, 26, 0.6)',
  onyx: 'rgba(26, 26, 46, 0.8)',
};

interface PlayerSidebarProps {
  players: Player[];
  currentPlayerIndex: number;
  activePlayerIndex: number;
  yourPlayerId?: string | null;
  isOnline?: boolean;
  connectionStatus?: 'connected' | 'connecting' | 'disconnected';
}

export default function PlayerSidebar({
  players,
  currentPlayerIndex,
  activePlayerIndex,
  yourPlayerId = null,
  isOnline = false,
  connectionStatus = 'disconnected',
}: PlayerSidebarProps) {
  return (
    <div className="w-[200px] p-3 flex flex-col gap-3 overflow-y-auto h-full">
      {players.map((player, i) => {
        const isActive = i === currentPlayerIndex;
        const isYou = isOnline && yourPlayerId !== null && player.id === yourPlayerId;
        const showConnected = isOnline && (player.isAI || isYou);
        const connected = player.isAI ? true : connectionStatus === 'connected';
        return (
          <div
            key={player.id}
            className="rounded-lg border p-3 flex flex-col gap-2 transition-all"
            style={{
              background: isYou ? 'rgba(184,134,11,0.08)' : 'rgba(0,0,0,0.5)',
              borderColor: isActive ? '#B8860B' : 'rgba(255,255,255,0.1)',
              borderWidth: isActive ? '2px' : '1px',
              boxShadow: isActive ? '0 0 20px rgba(184,134,11,0.3)' : 'none',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showConnected && (
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${connected ? 'bg-green-500' : 'bg-amber-500'}`}
                    title={connected ? 'Connected' : 'Reconnecting…'}
                  />
                )}
                <div
                  className="w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(0,0,0,0.6)', borderColor: '#B8860B', color: '#B8860B' }}
                >
                  {player.name[0]}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-white text-sm font-semibold">{player.name}</span>
                    {isYou && <span className="text-[10px] bg-[#B8860B]/40 text-[#B8860B] px-1 rounded">You</span>}
                    {player.isAI && <span className="text-[10px] bg-[#B8860B]/30 text-[#B8860B] px-1 rounded">AI</span>}
                  </div>
                  {isActive && (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 text-[10px]">playing</span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className="bg-[#B8860B] text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                {player.prestige}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {ALL_GEM_TYPES.map(
                (gem) =>
                  player.gems[gem] > 0 && (
                    <div key={gem} className="flex items-center gap-1">
                      <GemToken type={gem} size="xs" />
                      <span className="text-white text-xs font-bold">{player.gems[gem]}</span>
                    </div>
                  ),
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {GEM_COLORS.map(
                (gem) =>
                  player.bonuses[gem] > 0 && (
                    <div
                      key={gem}
                      className="px-1.5 py-0.5 rounded text-white text-xs font-bold"
                      style={{ background: bonusBgColors[gem] }}
                    >
                      <GemToken type={gem} size="xs" /> {player.bonuses[gem]}
                    </div>
                  ),
              )}
            </div>

            <div className="text-white/70 text-xs">
              Reserved: {player.reservedCards.length}/3
              {player.nobles.length > 0 && ` · Nobles: ${player.nobles.length}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}
