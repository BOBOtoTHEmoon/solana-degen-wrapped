import axios from 'axios';

const SOLSCAN_API = 'https://pro-api.solscan.io/v2.0';
const PUBLIC_API = 'https://public-api.solscan.io';

// Helper to add delays between requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface SolscanTransfer {
  trans_id: string;
  block_id: number;
  time: number;
  amount: number;
  decimals: number;
  token_address: string;
  token_symbol: string;
  from_address: string;
  to_address: string;
}

export async function getWalletTokenTransfers(
  walletAddress: string,
  limit: number = 50
): Promise<SolscanTransfer[]> {
  try {
    // Use public API for SPL token transfers
    const response = await axios.get(
      `${PUBLIC_API}/account/tokens`,
      {
        params: {
          account: walletAddress,
        },
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Error fetching token transfers:', error);
    return [];
  }
}

export async function getTokenInfo(tokenAddress: string) {
  try {
    await delay(100); // Small delay to avoid rate limits
    
    const response = await axios.get(
      `${PUBLIC_API}/token/meta`,
      {
        params: {
          token: tokenAddress,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching token info:', error);
    return null;
  }
}

// Simpler approach: Get recent transactions
export async function getRecentTransactions(walletAddress: string, limit: number = 100) {
  try {
    const response = await axios.get(
      `${PUBLIC_API}/account/transactions`,
      {
        params: {
          account: walletAddress,
          limit: limit,
        },
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}