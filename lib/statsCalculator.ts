import { TokenPosition, DegenStats } from '@/types';

export function calculateDegenStats(
  positions: Map<string, TokenPosition>
): DegenStats {
  const positionsArray = Array.from(positions.values());

  // Filter out positions with actual trades
  const completedPositions = positionsArray.filter(
    (p) => p.sellTransactions.length > 0
  );

  // Total tokens traded
  const totalTokensTraded = positions.size;

  // Total trades
  const totalTrades = positionsArray.reduce(
    (sum, p) => sum + p.buyTransactions.length + p.sellTransactions.length,
    0
  );

  // Win rate
  const winners = completedPositions.filter((p) => p.realizedPnL > 0);
  const winRate =
    completedPositions.length > 0
      ? (winners.length / completedPositions.length) * 100
      : 0;

  // Total P&L
  const totalPnL = completedPositions.reduce((sum, p) => sum + p.realizedPnL, 0);

  // Biggest win
  const biggestWinPosition = completedPositions.reduce(
    (max, p) => (p.realizedPnL > max.realizedPnL ? p : max),
    completedPositions[0] || { realizedPnL: 0, realizedPnLPercent: 0, symbol: 'N/A' }
  );

  // Biggest loss
  const biggestLossPosition = completedPositions.reduce(
    (min, p) => (p.realizedPnL < min.realizedPnL ? p : min),
    completedPositions[0] || { realizedPnL: 0, realizedPnLPercent: 0, symbol: 'N/A' }
  );

  // Diamond hands (longest hold)
  const diamondHandsPosition = positionsArray.reduce(
    (max, p) =>
      p.holdTime && (!max.holdTime || p.holdTime > max.holdTime) ? p : max,
    positionsArray[0] || { holdTime: 0, symbol: 'N/A' }
  );

  // Rugs survived (90%+ loss)
  const rugsSurvived = completedPositions.filter(
    (p) => p.realizedPnLPercent < -90
  ).length;

  // Ape-in score (placeholder - would need launch time data)
  const apeInScore = 0; // TODO: Implement with token launch time data

  // Total volume
  const totalVolume = positionsArray.reduce(
    (sum, p) => sum + p.totalBought + p.totalSold,
    0
  );

  // Most traded token
  const tokenTradeCounts = positionsArray.map((p) => ({
    symbol: p.symbol,
    count: p.buyTransactions.length + p.sellTransactions.length,
  }));
  const mostTradedToken = tokenTradeCounts.reduce(
    (max, t) => (t.count > max.count ? t : max),
    { symbol: 'N/A', count: 0 }
  );

  return {
    totalTokensTraded,
    totalTrades,
    winRate,
    totalPnL,
    biggestWin: {
      token: biggestWinPosition.symbol,
      amount: biggestWinPosition.realizedPnL,
      percent: biggestWinPosition.realizedPnLPercent,
    },
    biggestLoss: {
      token: biggestLossPosition.symbol,
      amount: biggestLossPosition.realizedPnL,
      percent: biggestLossPosition.realizedPnLPercent,
    },
    diamondHands: {
      token: diamondHandsPosition.symbol,
      holdTime: diamondHandsPosition.holdTime || 0,
    },
    rugsSurvived,
    apeInScore,
    totalVolume,
    mostTradedToken,
  };
}