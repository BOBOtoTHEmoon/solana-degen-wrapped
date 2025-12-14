'use client';

import { useState } from 'react';
import { DegenStats } from '@/types';
import StatsDisplay from '@/components/StatsDisplay';
import { getMockDegenStats, getMockDegenStatsWinner } from '@/lib/mockData';
import { analyzeWallet } from '@/lib/analyzer'; 

export default function Home() {
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DegenStats | null>(null);
  const [error, setError] = useState('');
const [loadingMessage, setLoadingMessage] = useState('');

 const handleAnalyze = async () => {
  if (!walletAddress) {
    setError('Please enter a wallet address');
    return;
  }

  setLoading(true);
  setError('');
  setStats(null);
  setLoadingMessage('Starting analysis...');

  try {
 const realStats = await analyzeWallet(walletAddress, (msg: string) => {
        setLoadingMessage(msg);
      });
      setStats(realStats);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze wallet. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };
// Update loading display:
{loading ? (
  <div className="flex flex-col items-center justify-center gap-3">
    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
    <span>{loadingMessage || 'Analyzing...'}</span>
    <span className="text-sm text-gray-400">This may take 20-30 seconds ⏳</span>
  </div>
) : (
  <span className="flex items-center justify-center gap-2">
    🚀 Unwrap My 2024 Degen Journey
  </span>
)}

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* --- New Background: Darker, More Chaotic Glow --- */}
      <div className="fixed inset-0 bg-gray-950"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1: Pink/Purple Energy */}
        <div className="absolute top-[10%] left-[5%] w-1/3 h-1/3 bg-pink-700/50 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000 transition-all duration-1000"></div>
        {/* Blob 2: Blue/Cyan Speed */}
        <div className="absolute top-[30%] right-[15%] w-1/4 h-1/4 bg-blue-700/50 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000 transition-all duration-1000"></div>
        {/* Blob 3: Central Yellow/Green for POP */}
        <div className="absolute bottom-[20%] left-[20%] w-1/5 h-1/5 bg-yellow-500/50 rounded-full filter blur-3xl opacity-30 animate-blob transition-all duration-1000"></div>
        
        {/* Add a subtle dark overlay for depth and focus */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header - ENHANCED NEON */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <h1 className="text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-lg [text-shadow:0_0_15px_rgba(255,255,255,0.4)]">
              Solana Degen
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 animate-gradient text-9xl">
                WRAPPED
              </span>
            </h1>
            {/* Neon effect behind the title */}
            <div className="absolute inset-0 blur-2xl opacity-50 bg-gradient-to-r from-yellow-500 to-purple-500 -z-10"></div>
          </div>
          <p className="text-2xl text-gray-300 font-medium">
            Your 2025 memecoin journey, unwrapped 🎁
          </p>
          <div className="mt-4 flex gap-2 justify-center items-center text-sm text-gray-400">
            <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
              ✨ No wallet connection needed
            </span>
            <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full">
              🔒 100% Safe
            </span>
          </div>
        </div>

        {/* Input Section - SHARPER GLASS EFFECT */}
        {!stats && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-black/40 backdrop-blur-xl rounded-[40px] p-12 border-2 border-purple-500/50 shadow-[0_0_30px_rgba(255,0,255,0.2)]">
              <label className="block text-white text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-3xl">🎯</span>
                Enter Your Solana Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                className="w-full px-6 py-5 rounded-2xl bg-black/60 text-white text-lg placeholder-gray-500 border-2 border-pink-500/50 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all font-mono"
                disabled={loading}
              />

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-xl">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full mt-6 px-8 py-6 bg-gradient-to-r from-pink-500 to-cyan-400 text-white text-2xl font-black uppercase rounded-2xl hover:from-pink-600 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-[0_0_25px_rgba(255,0,255,0.6)] disabled:shadow-none disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing your degen moves...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🚀 Unwrap My 2025 Degen Journey
                  </span>
                )}
              </button>
            </div>

            {/* Fun examples */}
            <div className="mt-8 text-center space-y-3">
              <p className="text-gray-400 text-sm font-medium">Try these examples:</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => setWalletAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-all border border-white/20"
                >
                  😎 Winner Wallet
                </button>
                <button
                  onClick={() => setWalletAddress('3nF8Kt5g2BkheTqA83TZRuJosgAsUKXtg2CW87d97TX')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-all border border-white/20"
                >
                  💀 Rug Survivor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Display */}
        {stats && (
          <StatsDisplay stats={stats} walletAddress={walletAddress} />
        )}
      </div>
    </main>
  );
}