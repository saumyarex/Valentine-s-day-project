import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Confetti from './Confetti';

function getValentineStatus() {
  const now = new Date();
  const year = now.getFullYear();
  const valentine = new Date(year, 1, 14); // Feb 14
  const valentineEnd = new Date(year, 1, 15); // Feb 15

  if (now >= valentine && now < valentineEnd) return 'today';
  if (now < valentine) return 'before';
  return 'after';
}

function getTimeLeft() {
  const now = new Date();
  const year = now.getFullYear();
  let valentine = new Date(year, 1, 14);
  if (now >= valentine) valentine = new Date(year + 1, 1, 14);

  const diff = valentine - now;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeUnit({ value, label }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <div className="relative">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="block text-4xl md:text-6xl font-bold text-rose-deep dark:text-blush font-[family-name:var(--font-heading)] w-20 md:w-28 text-center"
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs md:text-sm text-gold mt-1 uppercase tracking-widest">{label}</span>
    </motion.div>
  );
}

export default function Countdown() {
  const { state } = useApp();
  const [status, setStatus] = useState(getValentineStatus);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getValentineStatus());
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status === 'today') {
      setShowCelebration(true);
    }
  }, [status]);

  const getDaysTogether = useCallback(() => {
    if (!state.anniversary) return null;
    const start = new Date(state.anniversary);
    const now = new Date();
    return Math.floor((now - start) / (1000 * 60 * 60 * 24));
  }, [state.anniversary]);

  const daysTogether = getDaysTogether();

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 relative">
      {showCelebration && <Confetti />}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl"
      >
        {status === 'today' ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-8xl mb-6"
            >
              💖
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-rose-deep dark:text-blush font-[family-name:var(--font-heading)] mb-4">
              Happy Valentine's Day!
            </h2>
            <p className="text-xl text-burgundy dark:text-night-text font-[family-name:var(--font-script)] mb-4">
              {state.partner1} & {state.partner2}
            </p>
            <p className="text-lg text-gray-600 dark:text-night-text/80">
              Today is all about celebrating your beautiful love story. Every moment together is a gift. 💕
            </p>
          </>
        ) : status === 'before' ? (
          <>
            <p className="text-gold font-[family-name:var(--font-script)] text-2xl mb-4">Counting down to</p>
            <h2 className="text-4xl md:text-5xl font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)] mb-8">
              Valentine's Day 💕
            </h2>
            <div className="flex justify-center gap-4 md:gap-6 mb-8">
              <TimeUnit value={timeLeft.days} label="Days" />
              <span className="text-4xl md:text-6xl text-blush self-start mt-1">:</span>
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <span className="text-4xl md:text-6xl text-blush self-start mt-1">:</span>
              <TimeUnit value={timeLeft.minutes} label="Min" />
              <span className="text-4xl md:text-6xl text-blush self-start mt-1">:</span>
              <TimeUnit value={timeLeft.seconds} label="Sec" />
            </div>
          </>
        ) : (
          <>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-7xl mb-6"
            >
              💗
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)] mb-4">
              Every Day is Valentine's Day
            </h2>
            <p className="text-xl text-gold font-[family-name:var(--font-script)]">
              with you, {state.partner2} 💕
            </p>
          </>
        )}

        {daysTogether !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-6 bg-white/60 dark:bg-night-surface/60 rounded-2xl backdrop-blur-sm"
          >
            <p className="text-sm text-gray-500 dark:text-night-text/70 mb-1">Together for</p>
            <p className="text-3xl font-bold text-rose-deep dark:text-blush font-[family-name:var(--font-heading)]">
              {daysTogether.toLocaleString()} days
            </p>
            <p className="text-sm text-gold font-[family-name:var(--font-script)] mt-1">
              and counting...
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
