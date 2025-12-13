export interface TokenSwap {
  signature: string;
  timestamp: number;
  type: 'buy' | 'sell';
  tokenMint: string;
  tokenSymbol: string;
  tokenAmount: number;
  solAmount: number;
  pricePerToken: number;
}

export interface TokenPosition {
  mint: string;
  symbol: string;
  buyTransactions: TokenSwap[];
  sellTransactions: TokenSwap[];
  totalBought: number;
  totalSold: number;
  avgBuyPrice: number;
  avgSellPrice: number;
  realizedPnL: number;
  realizedPnLPercent: number;
  holdTime?: number; // in hours
}

export interface DegenStats {
  totalTokensTraded: number;
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  biggestWin: {
    token: string;
    amount: number;
    percent: number;
  };
  biggestLoss: {
    token: string;
    amount: number;
    percent: number;
  };
  diamondHands: {
    token: string;
    holdTime: number; // hours
  };
  rugsSurvived: number;
  apeInScore: number; // trades within 1hr of launch
  totalVolume: number;
  mostTradedToken: {
    symbol: string;
    count: number;
  };
}