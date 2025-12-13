import axios from 'axios';
import { calculateDegenStats } from './statsCalculator';
import { DegenStats, TokenSwap, TokenPosition } from '@/types';

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function analyzeWallet(
  walletAddress: string,
  onProgress?: (message: string) => void
): Promise<DegenStats> {
  try {
    onProgress?.('Starting analysis...');
    
    // Fetch multiple pages to get more history
    const allTransactions = [];
    let beforeSignature = undefined;
    const targetTransactions = 500; // Target ~500 transactions for good coverage
    const batchSize = 100; // Helius allows up to 100
    const maxBatches = 10; // Safety limit (10 batches = 1000 max transactions)
    
    for (let i = 0; i < maxBatches; i++) {
      if (allTransactions.length >= targetTransactions) break;
      
      if (i > 0) {
        await delay(1200); // 1.2 second delay between batches
      }
      
      onProgress?.(`Fetching batch ${i + 1}... (${allTransactions.length} txs so far)`);
      
      const params: any = {
        'api-key': HELIUS_API_KEY,
        limit: batchSize,
      };
      
      if (beforeSignature) {
        params.before = beforeSignature;
      }
      
      try {
        const response = await axios.get(
          `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions`,
          { params }
        );

        const txs = response.data;
        
        if (!txs || txs.length === 0) {
          console.log('No more transactions available');
          break;
        }
        
        allTransactions.push(...txs);
        beforeSignature = txs[txs.length - 1]?.signature;
        
        console.log(`Batch ${i + 1}: ${txs.length} transactions, total: ${allTransactions.length}`);
      } catch (error: any) {
        if (error.response?.status === 429) {
          console.log('Rate limit hit, stopping fetch');
          break;
        }
        throw error;
      }
    }

    if (allTransactions.length === 0) {
      throw new Error('No transactions found for this wallet');
    }

    console.log(`Total transactions fetched: ${allTransactions.length}`);
    onProgress?.(`Analyzing ${allTransactions.length} transactions...`);

    // Parse into swaps
    const swaps = parseEnhancedTransactions(allTransactions, walletAddress);

    if (swaps.length === 0) {
      throw new Error('No token swaps detected. Try a wallet with more DeFi activity.');
    }

    console.log(`Detected ${swaps.length} swaps`);
    onProgress?.(`Found ${swaps.length} token swaps!`);

    // Group by token
    const positions = groupByToken(swaps);

    console.log(`Analyzing ${positions.size} unique tokens`);
    onProgress?.(`Fetching metadata for ${positions.size} tokens...`);

    // Fetch token metadata for symbols
    await enrichTokenSymbols(positions, onProgress);

    onProgress?.('Calculating your degen stats...');

    // Calculate stats
    const stats = calculateDegenStats(positions);

    return stats;
  } catch (error: any) {
    console.error('Analyzer error:', error);
    
    if (error.response?.status === 429) {
      throw new Error('Rate limit reached. Try again in a minute!');
    }
    
    throw new Error(error.message || 'Failed to analyze wallet');
  }
}

function parseEnhancedTransactions(
  transactions: any[],
  walletAddress: string
): TokenSwap[] {
  const swaps: TokenSwap[] = [];

  for (const tx of transactions) {
    if (!tx.tokenTransfers || tx.tokenTransfers.length === 0) continue;
    if (!tx.nativeTransfers || tx.nativeTransfers.length === 0) continue;

    const timestamp = tx.timestamp || Math.floor(Date.now() / 1000);

    for (const tokenTransfer of tx.tokenTransfers) {
      const isReceiving = tokenTransfer.toUserAccount === walletAddress;
      const isSending = tokenTransfer.fromUserAccount === walletAddress;

      if (!isReceiving && !isSending) continue;

      const solTransfer = tx.nativeTransfers.find(
        (nt: any) =>
          nt.fromUserAccount === walletAddress ||
          nt.toUserAccount === walletAddress
      );

      if (!solTransfer) continue;

      const solAmount = Math.abs(solTransfer.amount / 1e9);
      const tokenAmount = tokenTransfer.tokenAmount;

      if (tokenAmount === 0 || solAmount === 0) continue;

      const type: 'buy' | 'sell' = isReceiving ? 'buy' : 'sell';

      swaps.push({
        signature: tx.signature || '',
        timestamp,
        type,
        tokenMint: tokenTransfer.mint || '',
        tokenSymbol: 'UNKNOWN',
        tokenAmount,
        solAmount,
        pricePerToken: solAmount / tokenAmount,
      });
    }
  }

  return swaps;
}

function groupByToken(swaps: TokenSwap[]): Map<string, TokenPosition> {
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

    position.avgBuyPrice =
      totalTokensBought > 0 ? position.totalBought / totalTokensBought : 0;

    position.avgSellPrice =
      totalTokensSold > 0 ? position.totalSold / totalTokensSold : 0;

    position.realizedPnL = position.totalSold - position.totalBought;
    position.realizedPnLPercent =
      position.totalBought > 0
        ? (position.realizedPnL / position.totalBought) * 100
        : 0;

    if (
      position.buyTransactions.length > 0 &&
      position.sellTransactions.length > 0
    ) {
      const firstBuy = Math.min(
        ...position.buyTransactions.map((tx) => tx.timestamp)
      );
      const lastSell = Math.max(
        ...position.sellTransactions.map((tx) => tx.timestamp)
      );
      position.holdTime = (lastSell - firstBuy) / 3600;
    }
  }

  return positions;
}

async function enrichTokenSymbols(
  positions: Map<string, TokenPosition>,
  onProgress?: (message: string) => void
) {
  const mints = Array.from(positions.keys());
  
  console.log(`Fetching metadata for ${mints.length} tokens...`);
  
  // Batch process in groups of 100 (Helius allows 100)
  for (let i = 0; i < mints.length; i += 100) {
    const batch = mints.slice(i, i + 100);
    
    if (i > 0) {
      await delay(1000);
    }
    
    onProgress?.(`Fetching token names... (${i + batch.length}/${mints.length})`);
    
    try {
      const response = await axios.post(
        `https://api.helius.xyz/v0/token-metadata?api-key=${HELIUS_API_KEY}`,
        {
          mintAccounts: batch,
        }
      );

      const metadataList = response.data;
      
      metadataList.forEach((metadata: any, index: number) => {
        const mint = batch[index];
        const position = positions.get(mint);
        
        if (position && metadata) {
          const symbol = 
            metadata.onChainMetadata?.metadata?.data?.symbol ||
            metadata.offChainMetadata?.symbol ||
            metadata.symbol ||
            `${mint.slice(0, 4)}...${mint.slice(-4)}`;
          
          position.symbol = symbol;
          position.buyTransactions.forEach(tx => tx.tokenSymbol = symbol);
          position.sellTransactions.forEach(tx => tx.tokenSymbol = symbol);
        }
      });
    } catch (error) {
      console.error(`Error fetching metadata:`, error);
      batch.forEach(mint => {
        const position = positions.get(mint);
        if (position && position.symbol === 'UNKNOWN') {
          position.symbol = `${mint.slice(0, 4)}...${mint.slice(-4)}`;
        }
      });
    }
  }
}