import type { GemType, GemColor, Player, DevelopmentCard, NobleCard, BoardState } from './types';
import { GEM_COLORS } from './types';

export function getInitialTokens(playerCount: number): Record<GemType, number> {
  const gemCount = playerCount === 2 ? 4 : playerCount === 3 ? 5 : 7;
  return {
    diamond: gemCount,
    sapphire: gemCount,
    emerald: gemCount,
    ruby: gemCount,
    onyx: gemCount,
    gold: 5,
  };
}

export function getNobleCount(playerCount: number): number {
  return playerCount + 1;
}

export function getTokenCount(player: Player): number {
  return Object.values(player.gems).reduce((sum, n) => sum + n, 0);
}

export function canTakeThreeTokens(
  selected: GemColor[],
  bankTokens: Record<GemType, number>,
): boolean {
  if (selected.length === 0 || selected.length > 3) return false;
  const unique = new Set(selected);
  if (unique.size !== selected.length) return false;
  if (!selected.every((color) => bankTokens[color] >= 1)) return false;

  const availableColors = GEM_COLORS.filter((c) => bankTokens[c] > 0);
  if (availableColors.length >= 3 && selected.length < 3) return false;
  if (availableColors.length < 3 && selected.length !== Math.min(availableColors.length, 3)) return false;

  return true;
}

export function canTakeTwoTokens(
  color: GemColor,
  bankTokens: Record<GemType, number>,
): boolean {
  return bankTokens[color] >= 4;
}

export function getAvailableTokenColors(bankTokens: Record<GemType, number>): GemColor[] {
  return GEM_COLORS.filter((c) => bankTokens[c] > 0);
}

export function getEffectivePurchasePower(player: Player, color: GemColor): number {
  return player.gems[color] + player.bonuses[color];
}

export function canPurchaseCard(player: Player, card: DevelopmentCard): boolean {
  let goldNeeded = 0;
  for (const color of GEM_COLORS) {
    const cost = card.cost[color] || 0;
    const power = getEffectivePurchasePower(player, color);
    if (cost > power) {
      goldNeeded += cost - power;
    }
  }
  return player.gems.gold >= goldNeeded;
}

export function calculateGemPayment(
  player: Player,
  card: DevelopmentCard,
): Record<GemType, number> {
  const payment: Record<GemType, number> = {
    diamond: 0, sapphire: 0, emerald: 0, ruby: 0, onyx: 0, gold: 0,
  };

  for (const color of GEM_COLORS) {
    const cost = card.cost[color] || 0;
    const bonusDiscount = player.bonuses[color];
    const netCost = Math.max(0, cost - bonusDiscount);
    const gemsAvailable = player.gems[color];

    if (gemsAvailable >= netCost) {
      payment[color] = netCost;
    } else {
      payment[color] = gemsAvailable;
      payment.gold += netCost - gemsAvailable;
    }
  }

  return payment;
}

export function canReserveCard(player: Player): boolean {
  return player.reservedCards.length < 3;
}

export function getClaimableNobles(player: Player, nobles: NobleCard[]): NobleCard[] {
  return nobles.filter((noble) => {
    for (const color of GEM_COLORS) {
      const req = noble.requirements[color] || 0;
      if (player.bonuses[color] < req) return false;
    }
    return true;
  });
}

export function shuffleDeck<T>(deck: T[]): T[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function findCardOnBoard(
  board: BoardState,
  cardId: string,
): { tier: 'tier1' | 'tier2' | 'tier3'; index: number } | null {
  for (const tierKey of ['tier1', 'tier2', 'tier3'] as const) {
    const idx = board[tierKey].visible.findIndex((c) => c?.id === cardId);
    if (idx !== -1) return { tier: tierKey, index: idx };
  }
  return null;
}

export function findCardInReserved(player: Player, cardId: string): number {
  return player.reservedCards.findIndex((c) => c.id === cardId);
}

export function determineWinner(players: Player[]): Player | null {
  const maxPrestige = Math.max(...players.map((p) => p.prestige));
  if (maxPrestige < 15) return null;

  const candidates = players.filter((p) => p.prestige === maxPrestige);
  if (candidates.length === 1) return candidates[0];

  const minCards = Math.min(...candidates.map((p) => p.purchasedCards.length));
  const winners = candidates.filter((p) => p.purchasedCards.length === minCards);
  return winners[0];
}

export function hasValidTokenAction(bankTokens: Record<GemType, number>): boolean {
  const available = getAvailableTokenColors(bankTokens);
  if (available.length >= 1) return true;
  return false;
}
