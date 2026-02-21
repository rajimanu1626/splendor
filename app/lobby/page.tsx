'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoom, useSocket } from '@/lib/socket';
import { useGameStore } from '@/lib/game-engine/gameState';
import { SERVER_EVENTS } from '@/lib/game-protocol';
import CreateRoom from '@/components/lobby/CreateRoom';
import JoinRoom from '@/components/lobby/JoinRoom';
import WaitingRoom from '@/components/lobby/WaitingRoom';

type Tab = 'create' | 'join';

export default function LobbyPage() {
  const router = useRouter();
  const { socket, status } = useSocket();
  const { room, createRoom, joinRoom, leaveRoom, addAI, startGame } = useRoom();
  const syncState = useGameStore((s) => s.syncState);
  const setOnlineContext = useGameStore((s) => s.setOnlineContext);
  const setMode = useGameStore((s) => s.setMode);

  const [tab, setTab] = useState<Tab>('create');

  const handleGameState = useCallback(
    (payload: { gameState: unknown; yourPlayerId: string }) => {
      if (room.roomCode) {
        try {
          sessionStorage.setItem('splendor_room', JSON.stringify({ roomCode: room.roomCode, playerId: payload.yourPlayerId }));
        } catch (_) {}
      }
      setMode('online');
      setOnlineContext(payload.yourPlayerId);
      syncState({ gameState: payload.gameState as Parameters<typeof syncState>[0]['gameState'], yourPlayerId: payload.yourPlayerId });
      router.push('/game');
    },
    [router, room.roomCode, setMode, setOnlineContext, syncState],
  );

  useEffect(() => {
    if (!socket) return;
    socket.on(SERVER_EVENTS.gameState, handleGameState);
    return () => {
      socket.off(SERVER_EVENTS.gameState, handleGameState);
    };
  }, [socket, handleGameState]);

  const inRoom = room.roomCode != null && room.players.length > 0;

  return (
    <div
      className="w-screen min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #2C1810 0%, #0D0702 100%)',
      }}
    >
      <motion.div
        className="bg-[#1A1000]/90 border-2 border-[#B8860B]/50 rounded-2xl p-8 max-w-md w-full shadow-2xl backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl text-[#B8860B] font-bold tracking-widest"
            style={{ fontFamily: 'var(--font-cinzel)' }}
          >
            PLAY ONLINE
          </h1>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' : status === 'connecting' ? 'bg-amber-500' : 'bg-red-500'}`}
            />
            <span className="text-white/50 text-xs">
              {status === 'connected' ? 'Connected' : status === 'connecting' ? 'Connecting…' : 'Disconnected'}
            </span>
          </div>
        </div>

        {!inRoom ? (
          <>
            <div className="flex gap-2 mb-6">
              <button
                className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${tab === 'create' ? 'bg-[#B8860B] text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                onClick={() => setTab('create')}
              >
                Create Game
              </button>
              <button
                className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${tab === 'join' ? 'bg-[#B8860B] text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                onClick={() => setTab('join')}
              >
                Join Game
              </button>
            </div>
            <AnimatePresence mode="wait">
              {tab === 'create' && (
                <motion.div
                  key="create"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <CreateRoom onCreate={createRoom} disabled={status !== 'connected'} />
                </motion.div>
              )}
              {tab === 'join' && (
                <motion.div
                  key="join"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <JoinRoom onJoin={joinRoom} disabled={status !== 'connected'} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <WaitingRoom
            roomCode={room.roomCode!}
            hostId={room.hostId ?? ''}
            players={room.players}
            canStart={room.canStart}
            myPlayerId={room.myPlayerId}
            isHost={room.hostId === room.myPlayerId}
            onLeave={leaveRoom}
            onStart={startGame}
            onAddAI={addAI}
          />
        )}

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-white/40 hover:text-white/70 text-sm transition-colors"
          >
            Back to menu
          </a>
        </div>
      </motion.div>
    </div>
  );
}
