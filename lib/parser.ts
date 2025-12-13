import { HeliusTransaction } from './helius';
import { TokenSwap, TokenPosition } from '@/types';

export function parseSwapTransactions(
  transactions: HeliusTransaction[],
  walletAddress: string
): TokenSwap[] {
  const swaps: TokenSwap[] = [];

  for (const tx of transactions) {
    if (!tx.tokenTransfers || tx.tokenTransfers.length === 0) continue;

    // Detect swap pattern: SOL in/out + Token in/out
    const hasNativeTransfer = tx.nativeTransfers && tx.nativeTransfers.length > 0;
    const hasTokenTransfer = tx.tokenTransfers.length > 0;

    if (!hasNativeTransfer || !hasTokenTransfer) continue;

    // Determine if buy or sell
    const nativeTransfer = tx.nativeTransfers![0];
    const tokenTransfer = tx.tokenTransfers[0];

    const isBuy = nativeTransfer.fromUserAccount === walletAddress;
    const isSell = tokenTransfer.fromUserAccount === walletAddress;

    if (!isBuy && !isSell) continue;

    const solAmount = nativeTransfer.amount / 1e9; // Convert lamports to SOL
    const tokenAmount = tokenTransfer.tokenAmount;

    swaps.push({
      signature: tx.signature,
      timestamp: tx.timestamp,
      type: isBuy ? 'buy' : 'sell',
      tokenMint: tokenTransfer.mint,
      tokenSymbol: 'UNKNOWN', // We'll fetch this separately
      tokenAmount: tokenAmount,
      solAmount: solAmount,
      pricePerToken: solAmount / tokenAmount,
    });
  }

  return swaps;
}

export function calculatePositions(swaps: TokenSwap[]): Map<string, TokenPosition> {
  const positions = new Map<string, TokenPosition>();

  for (const swap of swaps) {
    if (!positions.has(swap.tokenMint)) {
      positions.set(swap.tokenMint, {
        mint: swap.tokenMint,
        symbol: swap.tokenSymbol,
        buyTransactions: [],
        sellTransactions: [],
        totalBought: 0,
        totalSold: 0,
        avgBuyPrice: 0,
        avgSellPrice: 0,
        realizedPnL: 0,
        realizedPnLPercent: 0,
      });
    }

    const position = positions.get(swap.tokenMint)!;

    if (swap.type === 'buy') {
      position.buyTransactions.push(swap);
      position.totalBought += swap.solAmount;
    } else {
      position.sellTransactions.push(swap);
      position.totalSold += swap.solAmount;
    }
  }

  // Calculate metrics for each position
  for (const [_, position] of positions) {
    if (position.buyTransactions.length > 0) {
      position.avgBuyPrice =
        position.totalBought /
        position.buyTransactions.reduce((sum, tx) => sum + tx.tokenAmount, 0);
    }

    if (position.sellTransactions.length > 0) {
      position.avgSellPrice =
        position.totalSold /
        position.sellTransactions.reduce((sum, tx) => sum + tx.tokenAmount, 0);
    }

    position.realizedPnL = position.totalSold - position.totalBought;
    position.realizedPnLPercent =
      position.totalBought > 0 ? (position.realizedPnL / position.totalBought) * 100 : 0;

    // Calculate hold time
    if (position.buyTransactions.length > 0 && position.sellTransactions.length > 0) {
      const firstBuy = Math.min(...position.buyTransactions.map((tx) => tx.timestamp));
      const lastSell = Math.max(...position.sellTransactions.map((tx) => tx.timestamp));
      position.holdTime = (lastSell - firstBuy) / 3600; // Convert to hours
    }
  }

  return positions;
}