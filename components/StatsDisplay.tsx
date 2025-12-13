'use client';

import { DegenStats } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface StatsDisplayProps {
  stats: DegenStats;
  walletAddress: string;
}

export default function StatsDisplay({ stats, walletAddress }: StatsDisplayProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const safeNumber = (value: number | undefined): number => {
    return typeof value === 'number' && !isNaN(value) ? value : 0;
  };

  const safeString = (value: string | undefined): string => {
    return value || 'UNKNOWN';
  };

  const formatMoney = (amount: number | undefined) => {
    const safe = safeNumber(amount);
    return `${safe >= 0 ? '+' : ''}${safe.toFixed(2)} SOL`;
  };

  const formatPercent = (percent: number | undefined) => {
    const safe = safeNumber(percent);
    return `${safe >= 0 ? '+' : ''}${safe.toFixed(2)}%`;
  };

  // Trigger confetti on biggest win slide
  useEffect(() => {
    if (currentSlide === 2 && !showConfetti) { // Slide 3 is biggest win
      setShowConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF69B4', '#00FF00'],
      });
    } else if (currentSlide !== 2 && showConfetti) {
      // Reset confetti flag when navigating away
      setShowConfetti(false);
    }
  }, [currentSlide, showConfetti]);

const slides = [
    // Slide 1: Epic Intro
    {
      title: '2025 DEGEN WRAPPED',
      bgColor: 'from-purple-600/40 to-pink-600/40',
      content: (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="space-y-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              // Larger, more powerful number on intro slide
              className="text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-4 tracking-tighter"
            >
              {safeNumber(stats.totalTokensTraded)}
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl text-gray-200 font-bold uppercase tracking-widest"
            >
              MEMECOINS TRADED
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 gap-6 mt-12"
          >
            {/* Darker, high-contrast stat boxes */}
            <div className="bg-black/50 rounded-2xl p-6 border border-blue-400/50 backdrop-blur">
              <div className="text-5xl font-black text-white mb-2">
                {safeNumber(stats.totalTrades)}
              </div>
              <div className="text-gray-300 text-lg font-semibold uppercase">TOTAL TRADES</div>
            </div>
            <div className="bg-black/50 rounded-2xl p-6 border border-green-400/50 backdrop-blur">
              <div className="text-5xl font-black text-white mb-2">
                {safeNumber(stats.winRate).toFixed(1)}%
              </div>
              <div className="text-gray-300 text-lg font-semibold uppercase">WIN RATE</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-3xl font-black mt-10"
          >
            {stats.totalPnL >= 0 ? '🚀' : '💀'} 
            <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-500">
              {stats.totalPnL >= 0 ? "LET'S SEE YOUR WINS" : "LET'S SEE YOUR JOURNEY"}
            </span>
          </motion.div>
        </motion.div>
      ),
    },

    // Slide 2: P&L - DRAMATIC (NEON APPLIED)
    {
      title: stats.totalPnL >= 0 ? '💰 PROFIT ZONE' : '📉 THE DAMAGE',
      bgColor: stats.totalPnL >= 0 ? 'from-green-600/40 to-emerald-600/40' : 'from-red-600/40 to-orange-600/40',
      content: (
        <motion.div
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              // APPLIED NEON GLOW HERE
              className={`text-9xl font-black tracking-tighter ${
                safeNumber(stats.totalPnL) >= 0 ? 'text-neon-green text-green-300' : 'text-neon-pink text-red-300'
              }`}
            >
              {formatMoney(stats.totalPnL)}
            </motion.div>
            
            {/* Animated emoji */}
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.2, 1.2, 1.2, 1]
              }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-7xl mt-4"
            >
              {stats.totalPnL >= 100 ? '🤑' : stats.totalPnL >= 10 ? '💰' : stats.totalPnL >= 0 ? '📈' : stats.totalPnL >= -50 ? '😬' : '💀'}
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-black/50 backdrop-blur rounded-2xl p-8 border border-white/20"
          >
            <div className="text-gray-400 text-sm mb-3 uppercase tracking-wider font-bold">Total Volume Traded</div>
            <div className="text-5xl font-black text-white">
              {safeNumber(stats.totalVolume).toFixed(2)} SOL
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-3xl font-black text-gray-300 mt-8"
          >
            {stats.totalPnL >= 100 
              ? "GIGACHAD ENERGY 💎" 
              : stats.totalPnL >= 0 
              ? "YOU'RE COOKING! 🔥" 
              : stats.totalPnL >= -50
              ? "LEARNING EXPERIENCE 📚"
              : "NGMI BUT WE LOVE YOU 🫡"}
          </motion.div>
        </motion.div>
      ),
    },

    // Slide 3: Biggest Win - CELEBRATION
    {
      title: '🏆 YOUR LEGENDARY WIN',
      bgColor: 'from-yellow-600/40 to-orange-600/40',
      content: (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            className="text-7xl font-black text-yellow-400 mb-4 [text-shadow:0_0_15px_rgba(255,165,0,0.8)]"
          >
            ${safeString(stats.biggestWin?.token)}
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-4 border-green-400 rounded-3xl p-10 backdrop-blur">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="text-8xl font-black text-green-300 text-neon-green mb-4"
              >
                {formatMoney(stats.biggestWin?.amount)}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="text-6xl font-black text-green-300"
              >
                {formatPercent(stats.biggestWin?.percent)}
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-3xl font-black text-gray-200 mt-8"
          >
            {safeNumber(stats.biggestWin?.percent) > 1000
              ? "🧠 1000 IQ PLAY! GENERATIONAL WEALTH!"
              : safeNumber(stats.biggestWin?.percent) > 500
              ? "🚀 ABSOLUTE DEGEN LEGEND!"
              : safeNumber(stats.biggestWin?.percent) > 100
              ? "💰 PRINTING MONEY!"
              : "📈 SOLID GAINS!"}
          </motion.div>
        </motion.div>
      ),
    },

    // Slide 4: Biggest Loss - DRAMATIC
    {
      title: '💀 YOUR BIGGEST RUG',
      bgColor: 'from-red-600/40 to-pink-600/40',
      content: (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ 
              rotate: [0, -5, 5, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
            }}
            className="text-7xl font-black text-red-400 mb-4 [text-shadow:0_0_15px_rgba(255,0,0,0.8)]"
          >
            ${safeString(stats.biggestLoss?.token)}
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 bg-red-500 blur-2xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-red-500/30 to-pink-500/30 border-4 border-red-500 rounded-3xl p-10 backdrop-blur">
              <div className="text-8xl font-black text-red-300 text-neon-pink mb-4">
                {formatMoney(stats.biggestLoss?.amount)}
              </div>
              <div className="text-6xl font-black text-red-300">
                {formatPercent(stats.biggestLoss?.percent)}
              </div>
            </div>
          </div>

          <div className="text-7xl my-8 animate-bounce">
            {safeNumber(stats.biggestLoss?.percent) < -90 ? '⚰️' : safeNumber(stats.biggestLoss?.percent) < -50 ? '😵' : '😬'}
          </div>

          <div className="text-3xl font-black text-gray-200">
            {safeNumber(stats.biggestLoss?.percent) < -95
              ? "MEGA RUG PULL 🪦"
              : safeNumber(stats.biggestLoss?.percent) < -80
              ? "GOT REKT HARD 💀"
              : safeNumber(stats.biggestLoss?.percent) < -50
              ? "OUCH, THAT HURT 😵"
              : "L'S ARE PART OF THE GAME 💪"}
          </div>

          <div className="text-gray-400 italic text-lg mt-4">
            "It's not about how many times you fall, it's about how many times you ape back in" - Sun Tzu probably
          </div>
        </motion.div>
      ),
    },

    // Slide 5: Diamond Hands
    {
      title: '💎 DIAMOND HANDS AWARD',
      bgColor: 'from-blue-600/40 to-cyan-600/40',
      content: (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ 
              rotateY: [0, 360],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="text-8xl mb-6 [text-shadow:0_0_20px_rgba(0,255,255,0.8)]"
          >
            💎
          </motion.div>

          <div className="text-6xl font-black text-cyan-400 mb-4">
            ${safeString(stats.diamondHands?.token)}
          </div>

          <div className="bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border-4 border-blue-400 rounded-3xl p-10 backdrop-blur">
            <div className="text-gray-300 text-sm mb-4 uppercase tracking-wider font-bold">LONGEST HOLD</div>
            <div className="text-7xl font-black text-blue-400">
              {safeNumber(stats.diamondHands?.holdTime) > 24
                ? `${(safeNumber(stats.diamondHands?.holdTime) / 24).toFixed(1)} DAYS`
                : `${safeNumber(stats.diamondHands?.holdTime).toFixed(1)} HOURS`}
            </div>
          </div>

          <div className="text-3xl font-black text-gray-200 mt-8">
            {safeNumber(stats.diamondHands?.holdTime) > 720
              ? "🏆 ABSOLUTE DIAMOND HANDS!"
              : safeNumber(stats.diamondHands?.holdTime) > 168
              ? "💎 TRUE BELIEVER!"
              : safeNumber(stats.diamondHands?.holdTime) > 24
              ? "🤝 YOU CAN HOLD!"
              : "🔄 PAPER HANDS SPEEDRUN"}
          </div>
        </motion.div>
      ),
    },

    // Slide 6: Degen Metrics - FUN STATS
    {
      title: '🎯 DEGEN SCORECARD',
      bgColor: 'from-purple-600/40 to-indigo-600/40',
      content: (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-5"
        >
          {[
            { label: 'Most Traded Token', value: `$${safeString(stats.mostTradedToken?.symbol)} (${safeNumber(stats.mostTradedToken?.count)}x)`, icon: '🔥', color: 'from-orange-500 to-red-500' },
            { label: 'Rugs Survived', value: `${safeNumber(stats.rugsSurvived)} 🪦`, icon: '💀', color: 'from-red-500 to-pink-500' },
            { label: 'Win Rate', value: `${safeNumber(stats.winRate).toFixed(1)}%`, icon: safeNumber(stats.winRate) >= 50 ? '🎯' : '🎲', color: 'from-green-500 to-emerald-500' },
            { label: 'Total Volume', value: `${safeNumber(stats.totalVolume).toFixed(2)} SOL`, icon: '💰', color: 'from-yellow-500 to-orange-500' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-r ${item.color} p-[3px] rounded-2xl shadow-xl`}
            >
              <div className="bg-black/80 backdrop-blur rounded-2xl p-5 flex justify-between items-center border border-white/10">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{item.icon}</span>
                  <span className="text-gray-300 font-semibold text-lg uppercase">{item.label}</span>
                </div>
                <span className="text-white font-black text-2xl">{item.value}</span>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="text-8xl mb-4">
              {safeNumber(stats.winRate) >= 70
                ? '👑'
                : safeNumber(stats.winRate) >= 50
                ? '🎯'
                : safeNumber(stats.winRate) >= 30
                ? '📊'
                : '🎲'}
            </div>
            <div className="text-3xl font-black text-gray-200">
              {safeNumber(stats.winRate) >= 70
                ? "TRADING ROYALTY 👑"
                : safeNumber(stats.winRate) >= 50
                ? "SOLID DEGEN 🎯"
                : safeNumber(stats.winRate) >= 30
                ? "LEARNING DEGEN 📚"
                : "PURE DEGEN CHAOS 🎲"}
            </div>
          </motion.div>
        </motion.div>
      ),
    },

    // Slide 7: Epic Summary
    {
      title: '🎊 YOUR 2025 DEGEN STORY',
      bgColor: 'from-pink-600/40 to-purple-600/40',
      content: (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 text-center"
        >
          <div className="text-3xl text-gray-200 leading-relaxed space-y-4 font-medium">
            <p>
              You traded{' '}
              <span className="text-pink-400 font-black text-4xl">{safeNumber(stats.totalTokensTraded)}</span>{' '}
              different memecoins
            </p>
            <p>
              Across{' '}
              <span className="text-purple-400 font-black text-4xl">{safeNumber(stats.totalTrades)}</span>{' '}
              total trades
            </p>
            <p>
              Survived{' '}
              <span className="text-red-400 font-black text-4xl">{safeNumber(stats.rugsSurvived)}</span>{' '}
              rug pulls
            </p>
            <p>
              And ended with{' '}
              <span className={`font-black text-5xl ${safeNumber(stats.totalPnL) >= 0 ? 'text-neon-green text-green-300' : 'text-neon-pink text-red-300'}`}>
                {formatMoney(stats.totalPnL)}
              </span>
            </p>
          </div>

          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
            }}
            className="text-8xl my-8"
          >
            {safeNumber(stats.totalPnL) > 100
              ? '🚀'
              : safeNumber(stats.totalPnL) > 10
              ? '📈'
              : safeNumber(stats.totalPnL) > -10
              ? '🎲'
              : '💀'}
          </motion.div>

          <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
            {safeNumber(stats.totalPnL) > 100
              ? '🏆 DEGEN LEGEND'
              : safeNumber(stats.totalPnL) > 10
              ? '📈 PROFITABLE DEGEN'
              : safeNumber(stats.totalPnL) > -10
              ? '🎲 BREAK-EVEN GAMBLER'
              : '💀 LEARNING THE HARD WAY'}
          </div>

          <div className="text-gray-400 text-lg italic mt-6">
            "Every degen has a story. This is yours." ✨
          </div>
        </motion.div>
      ),
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          // Sharper, faster transition
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          
          // Enhanced container look
          className={`bg-gradient-to-br ${slides[currentSlide].bgColor} backdrop-blur-xl rounded-[40px] p-12 border-4 border-white/50 min-h-[700px] flex flex-col shadow-[0_0_50px_rgba(255,255,255,0.1)]`}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              // Neon text shadow on the title
              className="text-5xl font-black text-white mb-3 tracking-tighter [text-shadow:0_0_10px_rgba(255,255,255,0.8)]"
            >
              {slides[currentSlide].title}
            </motion.h2>
            <div className="text-sm text-gray-400 font-mono bg-black/60 px-4 py-2 rounded-full inline-block border border-white/20">
              {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex items-center justify-center">
            {slides[currentSlide].content}
          </div>

          {/* Progress */}
          <div className="flex justify-center gap-3 mt-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-white w-12 shadow-lg shadow-white/50' // Added shadow to active dot
                    : 'bg-white/30 w-3 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="px-8 py-4 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all backdrop-blur border border-white/20 hover:scale-105 disabled:hover:scale-100 uppercase"
        >
          ← Previous
        </button>

        <div className="text-white font-black text-2xl">
          {currentSlide + 1} / {slides.length}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="px-8 py-4 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all backdrop-blur border border-white/20 hover:scale-105 disabled:hover:scale-100 uppercase"
        >
          Next →
        </button>
      </div>

      {/* CTA Buttons */}
      <div className="mt-8 space-y-4">
        <button
          onClick={() => {
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.6 },
            });
          }}
          className="w-full px-10 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-black text-xl rounded-2xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,0,255,0.8)]"
        >
          🐦 SHARE ON X (TWITTER)
        </button>

        <button
          onClick={() => window.location.reload()}
          className="w-full px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-2xl transition-all backdrop-blur border border-white/20"
        >
          🔄 ANALYZE ANOTHER WALLET
        </button>
      </div>
    </div>
  );
}