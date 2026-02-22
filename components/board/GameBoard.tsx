'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { playTurnChime } from '@/lib/sounds';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useGameStore } from '@/lib/game-engine/gameState';
import { getAIAction, executeAIAction, getAIDiscardTokens } from '@/lib/game-engine/aiLogic';
import { useSocket, useRoom, useOnlineGame } from '@/lib/socket';
import { CLIENT_EVENTS, SERVER_EVENTS as SE } from '@/lib/game-protocol';
import type { DevelopmentCard as DevelopmentCardType, GemColor, GemType } from '@/lib/game-engine/types';

import CardGrid from './CardGrid';
import NobleRow from './NobleRow';
import TokenBank from './TokenBank';
import ZoomableArea from './ZoomableArea';
import PlayerHand from './PlayerHand';
import PlayerSidebar from './PlayerSidebar';
import TurnIndicator from '@/components/game-ui/TurnIndicator';
import ActionModal from '@/components/game-ui/ActionModal';
import TokenSelectionModal from '@/components/game-ui/TokenSelectionModal';
import DiscardModal from '@/components/game-ui/DiscardModal';
import NobleChoiceModal from '@/components/game-ui/NobleChoiceModal';
import WinScreen from '@/components/game-ui/WinScreen';

export default function GameBoard() {
  const router = useRouter();
  const state = useGameStore();
  const {
    phase, players, currentPlayerIndex, board, round, winner, turnLog,
    previousState, pendingAction, deckCounts, mode, yourPlayerId,
    takeThreeTokens, takeTwoTokens, purchaseCard, reserveCard, reserveFromDeck,
    discardTokens, claimNoble, undo, initGame, syncState,
  } = state;

  const { socket, status: connectionStatus } = useSocket();
  const { leaveRoom } = useRoom();
  const handleActionError = useCallback((message: string) => toast.error(message), []);
  const handleGameState = useCallback(
    (payload: { gameState: Parameters<typeof syncState>[0]['gameState']; yourPlayerId: string }) => {
      syncState(payload);
    },
    [syncState],
  );
  const onlineActions = useOnlineGame(handleGameState, handleActionError);

  const currentPlayer = players[currentPlayerIndex] || null;
  const isOnline = mode === 'online';
  const isCurrentPlayerAI = currentPlayer?.isAI ?? false;
  const isMyTurn = isOnline ? currentPlayer?.id === yourPlayerId : !isCurrentPlayerAI;
  const isHumanTurn = phase === 'playing' && isMyTurn;
  const bottomPlayer =
    isOnline && yourPlayerId != null
      ? (players.find((p) => p.id === yourPlayerId) ?? currentPlayer)
      : currentPlayer;

  const [selectedCard, setSelectedCard] = useState<DevelopmentCardType | null>(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<GemColor[]>([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [showTurnLog, setShowTurnLog] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [rematchVotes, setRematchVotes] = useState<string[]>([]);
  const [rematchTotalHumans, setRematchTotalHumans] = useState(0);
  const prevPlayerIndexRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (mode !== 'online' || yourPlayerId == null) return;
    const isMyTurnNow = currentPlayer?.id === yourPlayerId;
    if (!isMyTurnNow) {
      prevPlayerIndexRef.current = currentPlayerIndex;
      return;
    }
    if (prevPlayerIndexRef.current !== undefined && prevPlayerIndexRef.current !== currentPlayerIndex) {
      playTurnChime();
    }
    prevPlayerIndexRef.current = currentPlayerIndex;
  }, [mode, yourPlayerId, currentPlayer?.id, currentPlayerIndex]);

  const runAITurn = useCallback(() => {
    if (!currentPlayer || !currentPlayer.isAI) return;
    if (phase !== 'playing' && phase !== 'discardTokens' && phase !== 'nobleChoice') return;

    setAiThinking(true);

    setTimeout(() => {
      const currentState = useGameStore.getState();
      const aiPlayer = currentState.players[currentState.currentPlayerIndex];
      if (!aiPlayer?.isAI) { setAiThinking(false); return; }

      if (currentState.phase === 'discardTokens' && currentState.pendingAction?.type === 'discard') {
        const toDiscard = getAIDiscardTokens(aiPlayer, currentState.pendingAction.tokensToDiscard);
        currentState.discardTokens(toDiscard as Partial<Record<GemType, number>>);
      } else if (currentState.phase === 'nobleChoice' && currentState.pendingAction?.type === 'nobleChoice') {
        currentState.claimNoble(currentState.pendingAction.nobleIds[0]);
      } else if (currentState.phase === 'playing') {
        const action = getAIAction(aiPlayer, currentState);
        executeAIAction(action);
      }

      setAiThinking(false);
    }, 800 + Math.random() * 700);
  }, [currentPlayer, phase]);

  useEffect(() => {
    if (isOnline) return;
    if (currentPlayer?.isAI && (phase === 'playing' || phase === 'discardTokens' || phase === 'nobleChoice')) {
      const timer = setTimeout(runAITurn, 500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, currentPlayerIndex, phase, currentPlayer?.isAI, runAITurn]);

  useEffect(() => {
    if (!isOnline || !socket) return;
    const onDisconnected = (payload: { playerName: string }) => toast.info(`${payload.playerName} disconnected`);
    const onReconnected = (payload: { playerId: string }) => {
      const name = players.find((p) => p.id === payload.playerId)?.name ?? 'A player';
      toast.success(`${name} reconnected`);
    };
    const onPlayerQuit = (payload: { playerName: string }) =>
      toast.info(`${payload.playerName} quit (replaced by AI)`);
    const onQuitAccepted = () => {
      leaveRoom();
      router.push('/');
    };
    const onRematchUpdate = (payload: { rematchVotes: string[]; totalHumans: number }) => {
      setRematchVotes(payload.rematchVotes);
      setRematchTotalHumans(payload.totalHumans);
    };
    const onRematchStarted = () => {
      setRematchVotes([]);
      setRematchTotalHumans(0);
    };
    socket.on(SE.playerReconnected, onReconnected);
    socket.on(SE.playerDisconnected, onDisconnected);
    socket.on(SE.playerQuit, onPlayerQuit);
    socket.on(SE.quitAccepted, onQuitAccepted);
    socket.on(SE.rematchUpdate, onRematchUpdate);
    socket.on(SE.rematchStarted, onRematchStarted);
    return () => {
      socket.off(SE.playerReconnected, onReconnected);
      socket.off(SE.playerDisconnected, onDisconnected);
      socket.off(SE.playerQuit, onPlayerQuit);
      socket.off(SE.quitAccepted, onQuitAccepted);
      socket.off(SE.rematchUpdate, onRematchUpdate);
      socket.off(SE.rematchStarted, onRematchStarted);
    };
  }, [isOnline, socket, players, leaveRoom, router]);

  const handleQuit = useCallback(() => {
    if (!socket) return;
    if (!window.confirm('Quit this game? Your seat will be taken over by an AI (medium) player.')) return;
    socket.emit(CLIENT_EVENTS.quitAndReplaceWithAI);
  }, [socket]);

  function handleCardClick(card: DevelopmentCardType) {
    if (!isHumanTurn) return;
    if ('hidden' in card && card.hidden) return;
    setViewOnly(false);
    setSelectedCard(card);
  }

  function handleReservedCardClick(card: DevelopmentCardType) {
    if ('hidden' in card && card.hidden) return;
    setViewOnly(!isHumanTurn);
    setSelectedCard(card);
  }

  function handleDeckClick(tier: 1 | 2 | 3) {
    if (!isHumanTurn) return;
    if (isOnline) onlineActions.reserveFromDeck(tier);
    else reserveFromDeck(tier);
  }

  function handleTokenBankClick(color: GemColor) {
    if (!isHumanTurn) return;
    setShowTokenModal(true);
  }

  function handlePurchase() {
    if (!selectedCard) return;
    if (isOnline) onlineActions.purchaseCard(selectedCard.id);
    else purchaseCard(selectedCard.id);
    setSelectedCard(null);
  }

  function handleReserve() {
    if (!selectedCard) return;
    if (isOnline) onlineActions.reserveCard(selectedCard.id);
    else reserveCard(selectedCard.id);
    setSelectedCard(null);
  }

  function handleTakeThree(colors: GemColor[]) {
    if (isOnline) onlineActions.takeThreeTokens(colors);
    else takeThreeTokens(colors);
    setShowTokenModal(false);
    setSelectedTokens([]);
  }

  function handleTakeTwo(color: GemColor) {
    if (isOnline) onlineActions.takeTwoTokens(color);
    else takeTwoTokens(color);
    setShowTokenModal(false);
    setSelectedTokens([]);
  }

  function handleDiscard(tokens: Partial<Record<GemType, number>>) {
    if (isOnline) onlineActions.discardTokens(tokens);
    else discardTokens(tokens);
  }

  function handleNobleChoice(nobleId: string) {
    if (isOnline) onlineActions.claimNoble(nobleId);
    else claimNoble(nobleId);
  }

  if (phase === 'setup' || players.length === 0) {
    return null;
  }

  const tiers = [
    { tier: 3 as const, visible: board.tier3.visible, deckCount: deckCounts?.tier3 ?? board.tier3.deck.length },
    { tier: 2 as const, visible: board.tier2.visible, deckCount: deckCounts?.tier2 ?? board.tier2.deck.length },
    { tier: 1 as const, visible: board.tier1.visible, deckCount: deckCounts?.tier1 ?? board.tier1.deck.length },
  ];

  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex flex-col"
      style={{
        background: `
          repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(255,255,255,0.015) 48px, rgba(255,255,255,0.015) 50px),
          repeating-linear-gradient(180deg, transparent 0px, transparent 100px, rgba(0,0,0,0.1) 100px, rgba(0,0,0,0.1) 102px),
          linear-gradient(135deg, #1C0F07 0%, #0D0702 100%)
        `,
      }}
    >
      {isOnline && connectionStatus !== 'connected' && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-lg bg-amber-900/90 text-amber-200 text-sm font-medium">
          Connection lost. Reconnecting…
        </div>
      )}
      <TurnIndicator
        currentPlayer={currentPlayer}
        round={round}
        phase={phase}
        isAIThinking={aiThinking}
        onUndo={undo}
        canUndo={!isOnline && !!previousState && !isCurrentPlayerAI}
        onQuit={isOnline ? handleQuit : undefined}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          <div className="flex-1 flex min-h-0 overflow-hidden px-2 md:px-4 py-2">
            <ZoomableArea>
              <div className="min-w-0 px-0 py-2">
                <CardGrid
                  tiers={tiers}
                  currentPlayer={currentPlayer}
                  onCardClick={handleCardClick}
                  onDeckClick={handleDeckClick}
                  disabled={!isHumanTurn}
                />
              </div>
              <div className="shrink-0 flex justify-center px-2 pt-2 pb-2 min-w-0 overflow-hidden">
                <NobleRow nobles={board.nobles} />
              </div>
            </ZoomableArea>
            <div className="shrink-0">
              <TokenBank
                tokens={board.tokens}
                selectedTokens={selectedTokens}
                onTokenClick={handleTokenBankClick}
                disabled={!isHumanTurn}
              />
            </div>
          </div>

          <div className="shrink-0">
            {bottomPlayer && (
              <PlayerHand
                player={bottomPlayer}
                isActive={isMyTurn}
                onReservedCardClick={handleReservedCardClick}
              />
            )}
          </div>
        </div>

        <button
          className="md:hidden absolute top-2 right-2 z-20 bg-[#B8860B]/80 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? '✕' : '☰'}
        </button>

        <div
          className={`border-l h-full flex flex-col shrink-0 transition-all ${showSidebar ? 'w-[200px]' : 'w-0 overflow-hidden border-l-0'} hidden md:flex md:w-[200px]`}
          style={{ borderColor: 'rgba(184,134,11,0.3)' }}
        >
          <PlayerSidebar
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            activePlayerIndex={currentPlayerIndex}
            yourPlayerId={isOnline ? yourPlayerId : null}
            isOnline={isOnline}
            connectionStatus={connectionStatus}
          />

          <div
            className="border-t overflow-hidden flex flex-col"
            style={{ borderColor: 'rgba(184,134,11,0.2)' }}
          >
            <button
              type="button"
              onClick={() => setShowTurnLog((v) => !v)}
              className="w-full p-3 flex items-center justify-between gap-2 text-left hover:bg-white/5 transition-colors"
            >
              <h4
                className="text-[#B8860B] text-xs tracking-widest"
                style={{ fontFamily: 'var(--font-cinzel)' }}
              >
                LOG
              </h4>
              <span className="text-[#B8860B]/80 text-sm shrink-0" aria-hidden>
                {showTurnLog ? '−' : '+'}
              </span>
            </button>
            {showTurnLog && (
              <div className="px-3 pb-3 max-h-[200px] overflow-y-auto">
                <div className="flex flex-col gap-1">
                  {turnLog.slice(0, 8).map((log, i) => (
                    <p key={i} className={`text-xs ${i === 0 ? 'text-white/80' : 'text-white/40'}`}>
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCard && (viewOnly ? bottomPlayer : currentPlayer) && (
          <ActionModal
            card={selectedCard}
            player={viewOnly ? bottomPlayer! : currentPlayer!}
            viewOnly={viewOnly}
            onPurchase={handlePurchase}
            onReserve={handleReserve}
            onClose={() => {
              setSelectedCard(null);
              setViewOnly(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTokenModal && (
          <TokenSelectionModal
            bankTokens={board.tokens}
            onConfirmThree={handleTakeThree}
            onConfirmTwo={handleTakeTwo}
            onClose={() => { setShowTokenModal(false); setSelectedTokens([]); }}
          />
        )}
      </AnimatePresence>

      {phase === 'discardTokens' && currentPlayer && !isCurrentPlayerAI && isMyTurn && pendingAction?.type === 'discard' && (
        <DiscardModal
          player={currentPlayer}
          tokensToDiscard={pendingAction.tokensToDiscard}
          onConfirm={handleDiscard}
        />
      )}

      {phase === 'nobleChoice' && currentPlayer && !isCurrentPlayerAI && isMyTurn && pendingAction?.type === 'nobleChoice' && (
        <NobleChoiceModal
          nobles={board.nobles.filter((n) => pendingAction.nobleIds.includes(n.id))}
          onSelect={handleNobleChoice}
        />
      )}

      {phase === 'ended' && winner && (
        <WinScreen
          winner={winner}
          players={players}
          onPlayAgain={() => {
            if (isOnline) {
              window.location.href = '/';
              return;
            }
            const setupPlayers = players.map((p) => ({
              name: p.name,
              isAI: p.isAI,
              aiDifficulty: p.aiDifficulty,
            }));
            initGame(setupPlayers);
          }}
          onMainMenu={() => {
            try { sessionStorage.removeItem('splendor_room'); } catch (_) {}
            window.location.href = '/';
          }}
          isOnline={isOnline}
          rematchVotes={rematchVotes}
          totalHumans={rematchTotalHumans}
          yourPlayerId={yourPlayerId}
          onRequestRematch={isOnline && socket ? () => socket.emit(CLIENT_EVENTS.requestRematch) : undefined}
        />
      )}
    </div>
  );
}
