import axios from 'axios';

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
const HELIUS_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

export interface HeliusTransaction {
  signature: string;
  timestamp: number;
  type: string;
  source: string;
  tokenTransfers?: Array<{
    mint: string;
    tokenAmount: number;
    fromUserAccount?: string;
    toUserAccount?: string;
  }>;
  nativeTransfers?: Array<{
    amount: number;
    fromUserAccount?: string;
    toUserAccount?: string;
  }>;
}

export async function getWalletTransactions(
  walletAddress: string,
  limit: number = 1000
): Promise<HeliusTransaction[]> {
  try {
    const response = await axios.post(HELIUS_URL, {
      jsonrpc: '2.0',
      id: 'helius-test',
      method: 'getSignaturesForAddress',
      params: [
        walletAddress,
        {
          limit: limit,
        },
      ],
    });

    const signatures = response.data.result;
    
    // Get detailed transaction info
    const transactions: HeliusTransaction[] = [];
    
    // Batch process signatures (Helius allows batch requests)
    for (let i = 0; i < signatures.length; i += 50) {
      const batch = signatures.slice(i, i + 50);
      const txDetails = await getTransactionDetails(batch.map((s: any) => s.signature));
      transactions.push(...txDetails);
    }

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

async function getTransactionDetails(signatures: string[]): Promise<HeliusTransaction[]> {
  try {
    const response = await axios.post(
      `https://api.helius.xyz/v0/transactions?api-key=${HELIUS_API_KEY}`,
      {
        transactions: signatures,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return [];
  }
}

export async function getTokenMetadata(mintAddress: string) {
  try {
    const response = await axios.post(
      `https://api.helius.xyz/v0/token-metadata?api-key=${HELIUS_API_KEY}`,
      {
        mintAccounts: [mintAddress],
      }
    );

    return response.data[0];
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return null;
  }
}