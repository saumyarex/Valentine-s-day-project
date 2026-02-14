import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function Onboarding() {
  const { update } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ partner1: '', partner2: '', anniversary: '' });

  const handleComplete = () => {
    if (!form.partner1.trim() || !form.partner2.trim()) return;
    update({
      onboarded: true,
      partner1: form.partner1.trim(),
      partner2: form.partner2.trim(),
      anniversary: form.anniversary,
    });
  };

  const steps = [
    {
      title: 'Welcome to Your Love Story',
      subtitle: 'Let\'s make something magical together',
      content: (
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-7xl mb-6"
          >
            💕
          </motion.div>
          <p className="text-lg text-gray-600 dark:text-night-text mb-8">
            This is a special place just for the two of you — a digital love letter filled with memories, surprises, and all the little things that make your love unique.
          </p>
          <button
            onClick={() => setStep(1)}
            className="bg-rose-deep text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-burgundy transition-colors"
          >
            Let's Begin
          </button>
        </div>
      ),
    },
    {
      title: 'Tell Us About Yourselves',
      subtitle: 'So we can personalize your experience',
      content: (
        <div className="space-y-6 max-w-md mx-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-night-text mb-1">Your Name</label>
            <input
              type="text"
              value={form.partner1}
              onChange={(e) => setForm({ ...form, partner1: e.target.value })}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border-2 border-blush focus:border-rose-deep focus:outline-none bg-white dark:bg-night-surface dark:text-night-text transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-night-text mb-1">Your Partner's Name</label>
            <input
              type="text"
              value={form.partner2}
              onChange={(e) => setForm({ ...form, partner2: e.target.value })}
              placeholder="Enter their name"
              className="w-full px-4 py-3 rounded-xl border-2 border-blush focus:border-rose-deep focus:outline-none bg-white dark:bg-night-surface dark:text-night-text transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-night-text mb-1">Your Anniversary Date</label>
            <input
              type="date"
              value={form.anniversary}
              onChange={(e) => setForm({ ...form, anniversary: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-blush focus:border-rose-deep focus:outline-none bg-white dark:bg-night-surface dark:text-night-text transition-colors"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setStep(0)}
              className="flex-1 px-6 py-3 rounded-full border-2 border-blush text-rose-deep hover:bg-blush/20 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleComplete}
              disabled={!form.partner1.trim() || !form.partner2.trim()}
              className="flex-1 bg-rose-deep text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-burgundy transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Our Journey 💕
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-night-bg p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white/80 dark:bg-night-surface/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-burgundy dark:text-blush text-center mb-2 font-[family-name:var(--font-heading)]">
              {steps[step].title}
            </h1>
            <p className="text-center text-gold mb-8 font-[family-name:var(--font-script)] text-xl">
              {steps[step].subtitle}
            </p>
            {steps[step].content}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
