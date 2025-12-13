import { DegenStats } from '@/types';

export const getMockDegenStats = (): DegenStats => {
  return {
    totalTokensTraded: 47,
    totalTrades: 284,
    winRate: 38.5,
    totalPnL: -12.34,
    biggestWin: {
      token: 'BONK',
      amount: 45.67,
      percent: 892.3,
    },
    biggestLoss: {
      token: 'COPE',
      amount: -38.21,
      percent: -94.7,
    },
    diamondHands: {
      token: 'WIF',
      holdTime: 672, // 28 days in hours
    },
    rugsSurvived: 7,
    apeInScore: 23,
    totalVolume: 156.89,
    mostTradedToken: {
      symbol: 'POPCAT',
      count: 31,
    },
  };
};

// Alternative mock for a winning degen
export const getMockDegenStatsWinner = (): DegenStats => {
  return {
    totalTokensTraded: 63,
    totalTrades: 412,
    winRate: 61.2,
    totalPnL: 287.45,
    biggestWin: {
      token: 'PNUT',
      amount: 156.32,
      percent: 2847.6,
    },
    biggestLoss: {
      token: 'FARTCOIN',
      amount: -23.45,
      percent: -87.3,
    },
    diamondHands: {
      token: 'POPCAT',
      holdTime: 1344, // 56 days
    },
    rugsSurvived: 12,
    apeInScore: 47,
    totalVolume: 892.34,
    mostTradedToken: {
      symbol: 'WIF',
      count: 54,
    },
  };
};