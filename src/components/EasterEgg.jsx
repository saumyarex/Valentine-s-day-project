import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';

// Konami code: up up down down left right left right b a
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

export default function EasterEgg() {
  const [show, setShow] = useState(false);
  const [sequence, setSequence] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      setSequence((prev) => {
        const next = [...prev, e.code].slice(-KONAMI.length);
        if (next.length === KONAMI.length && next.every((k, i) => k === KONAMI[i])) {
          setShow(true);
          return [];
        }
        return next;
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Mobile: 5 taps on the header area triggers it
  useEffect(() => {
    let taps = 0;
    let timer;
    const handler = (e) => {
      // Only count taps in the top 60px (header area)
      if (e.clientY > 60) return;
      taps++;
      clearTimeout(timer);
      timer = setTimeout(() => { taps = 0; }, 2000);
      if (taps >= 7) {
        setShow(true);
        taps = 0;
      }
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4"
      >
        <Confetti />
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-white dark:bg-night-surface rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-6xl mb-4"
          >
            💕
          </motion.div>
          <h2 className="text-2xl font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)] mb-4">
            Will you be my Valentine?
          </h2>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShow(false)}
              className="bg-rose-deep text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-burgundy"
            >
              YES! 💖
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShow(false)}
              className="bg-gold text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-yellow-600"
            >
              YES! 💕
            </motion.button>
          </div>
          <p className="text-xs text-gray-400 mt-4">(There's only one right answer 😉)</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
