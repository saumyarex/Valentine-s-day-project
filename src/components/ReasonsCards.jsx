import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const patterns = [
  'radial-gradient(circle at 30% 30%, #FFB4C230, transparent 60%)',
  'radial-gradient(circle at 70% 70%, #E6394620, transparent 50%)',
  'linear-gradient(135deg, #D4A37315, #FFB4C215)',
  'radial-gradient(circle at 50% 0%, #80002015, transparent 60%)',
  'linear-gradient(45deg, #FFB4C210, #D4A37320)',
  'radial-gradient(circle at 80% 20%, #E6394615, transparent 50%)',
  'linear-gradient(180deg, #80002010, #FFB4C215)',
  'radial-gradient(ellipse at 20% 80%, #D4A37320, transparent 60%)',
];

const suitSymbols = ['♥', '♦', '♣', '♠'];

export default function ReasonsCards() {
  const { state, update } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newReason, setNewReason] = useState('');
  const [flippedCards, setFlippedCards] = useState(new Set());

  const addReason = () => {
    if (!newReason.trim()) return;
    update({ reasons: [...state.reasons, { id: Date.now(), text: newReason.trim() }] });
    setNewReason('');
  };

  const removeReason = (id) => {
    update({ reasons: state.reasons.filter((r) => r.id !== id) });
    setFlippedCards((prev) => { const next = new Set(prev); next.delete(id); return next; });
  };

  const toggleFlip = (id) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="min-h-[80vh] px-4 py-12 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)]">
          Reasons I Love You 💝
        </h2>
        <p className="text-gold font-[family-name:var(--font-script)] text-xl mt-2">
          {state.reasons.length} of 52 cards filled
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        <AnimatePresence>
          {state.reasons.map((reason, i) => (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: i * 0.02 }}
              className={`flip-card aspect-[2.5/3.5] ${flippedCards.has(reason.id) ? 'flipped' : ''}`}
              onClick={() => toggleFlip(reason.id)}
            >
              <div className="flip-card-inner relative w-full h-full">
                {/* Front - card back design */}
                <div
                  className="flip-card-front absolute inset-0 rounded-xl border-2 border-rose-deep/30 flex flex-col items-center justify-center p-3 shadow-md"
                  style={{
                    background: patterns[i % patterns.length],
                    backgroundColor: 'white',
                  }}
                >
                  <span className="text-rose-deep text-4xl mb-1">
                    {suitSymbols[i % 4]}
                  </span>
                  <span className="text-xs text-rose-deep/60 font-bold">#{i + 1}</span>
                  <span className="text-[10px] text-gray-400 mt-2">Tap to reveal</span>
                </div>
                {/* Back - reason */}
                <div
                  className="flip-card-back absolute inset-0 rounded-xl border-2 border-gold/50 flex flex-col items-center justify-center p-4 shadow-md bg-gradient-to-br from-cream to-white dark:from-night-surface dark:to-night-bg"
                >
                  <p className="text-sm text-center text-burgundy dark:text-blush font-medium leading-relaxed">
                    {reason.text}
                  </p>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeReason(reason.id); }}
                    className="absolute top-1 right-2 text-xs text-gray-300 hover:text-rose-deep"
                  >
                    ✕
                  </button>
                  <span className="absolute bottom-2 text-gold text-xs">💕 #{i + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add card placeholder */}
        {state.reasons.length < 52 && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAdd(true)}
            className="aspect-[2.5/3.5] rounded-xl border-2 border-dashed border-blush/50 flex flex-col items-center justify-center cursor-pointer hover:border-rose-deep hover:bg-blush/10 transition-all"
          >
            <span className="text-3xl text-blush">+</span>
            <span className="text-xs text-gray-400 mt-1">Add reason</span>
          </motion.div>
        )}
      </div>

      {/* Add form modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-night-surface rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)] mb-4">
                Add a Reason 💕
              </h3>
              <textarea
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder={`I love ${state.partner2} because...`}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-blush/50 focus:border-rose-deep focus:outline-none bg-white dark:bg-night-bg dark:text-night-text resize-none"
                autoFocus
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { setShowAdd(false); setNewReason(''); }}
                  className="flex-1 px-4 py-2 rounded-full border border-blush text-rose-deep"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { addReason(); setShowAdd(false); }}
                  disabled={!newReason.trim()}
                  className="flex-1 bg-rose-deep text-white px-4 py-2 rounded-full hover:bg-burgundy disabled:opacity-50"
                >
                  Add Card
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {state.reasons.length === 0 && (
        <div className="text-center mt-12 text-gray-400 dark:text-night-text/50">
          <p className="text-5xl mb-4">🃏</p>
          <p>Start filling your deck of love!</p>
          <p className="text-sm mt-1">Aim for 52 reasons, like a deck of cards</p>
        </div>
      )}
    </section>
  );
}
