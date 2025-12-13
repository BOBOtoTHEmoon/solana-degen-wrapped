import { TokenSwap, TokenPosition } from '@/types';

export function parseTransactionsToSwaps(
  transactions: any[],
  walletAddress: string
): TokenSwap[] {
  const swaps: TokenSwap[] = [];

  for (const tx of transactions) {
    // Skip if no token changes
    if (!tx.tokenBalanceChanges || tx.tokenBalanceChanges.length === 0) continue;

    // Look for swap patterns (token in + token out or SOL in/out)
    const tokenChanges = tx.tokenBalanceChanges;
    const solChange = tx.nativeBalanceChange || 0;

    for (const change of tokenChanges) {
      // Determine if buy or sell based on balance change
      const isBuy = change.rawTokenAmount?.tokenAmount > 0;
      const isSell = change.rawTokenAmount?.tokenAmount < 0;

      if (!isBuy && !isSell) continue;

      const tokenAmount = Math.abs(change.rawTokenAmount?.tokenAmount || 0);
      const decimals = change.rawTokenAmount?.decimals || 9;
      const normalizedAmount = tokenAmount / Math.pow(10, decimals);

      // Estimate SOL amount from native balance change
      const solAmount = Math.abs(solChange / 1e9);

      if (solAmount === 0) continue; // Skip if no SOL involved

      swaps.push({
        signature: tx.transactionHash || tx.txHash || '',
        timestamp: tx.blockTime || tx.time || Date.now() / 1000,
        type: isBuy ? 'buy' : 'sell',
        tokenMint: change.mint || '',
        tokenSymbol: change.symbol || 'UNKNOWN',
        tokenAmount: normalizedAmount,
        solAmount: solAmount,
        pricePerToken: solAmount / normalizedAmount,
      });
    }
  }

  return swaps;
}

export function groupSwapsByToken(swaps: TokenSwap[]): Map<string, TokenPosition> {
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

  // Calculate metrics
  for (const [_, position] of positions) {
    const totalTokensBought = position.buyTransactions.reduce(
      (sum, tx) => sum + tx.tokenAmount,
      0
    );
    const totalTokensSold = position.sellTransactions.reduce(
      (sum, tx) => sum + tx.tokenAmount,
      0
    );

    position.avgBuyPrice = totalTokensBought > 0 
      ? position.totalBought / totalTokensBought 
      : 0;
    
    position.avgSellPrice = totalTokensSold > 0 
      ? position.totalSold / totalTokensSold 
      : 0;

    position.realizedPnL = position.totalSold - position.totalBought;
    position.realizedPnLPercent = position.totalBought > 0
      ? (position.realizedPnL / position.totalBought) * 100
      : 0;

    // Calculate hold time
    if (position.buyTransactions.length > 0 && position.sellTransactions.length > 0) {
      const firstBuy = Math.min(...position.buyTransactions.map(tx => tx.timestamp));
      const lastSell = Math.max(...position.sellTransactions.map(tx => tx.timestamp));
      position.holdTime = (lastSell - firstBuy) / 3600; // hours
    }
  }

  return positions;
}