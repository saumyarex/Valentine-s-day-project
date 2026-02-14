import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { usePhotoUpload } from '../hooks/usePhotoUpload';

export default function Header({ onToggleDark, onToggleMusic, musicPlaying }) {
  const { state, update } = useApp();
  const { upload } = usePhotoUpload();
  const fileRef = useRef(null);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await upload(file, 'couple');
    update({ couplePhoto: url });
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-20 z-40 bg-white/80 dark:bg-night-surface/80 backdrop-blur-sm border-b border-blush/30 dark:border-burgundy/30">
      <div className="flex items-center justify-between px-4 py-2 max-w-6xl mx-auto">
        {/* Couple photo + names */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            onClick={() => fileRef.current?.click()}
            className="w-10 h-10 rounded-full border-2 border-rose-deep overflow-hidden cursor-pointer flex items-center justify-center bg-blush/30"
          >
            {state.couplePhoto ? (
              <img src={state.couplePhoto} alt="Couple" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg">👫</span>
            )}
          </motion.div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          <div>
            <h1 className="text-sm font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)] leading-tight">
              {state.partner1} & {state.partner2}
            </h1>
            <p className="text-xs text-gold font-[family-name:var(--font-script)]">A Love Story</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onToggleMusic}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              musicPlaying ? 'bg-rose-deep text-white' : 'bg-blush/30 text-gray-500 dark:text-night-text'
            }`}
            title="Toggle music"
          >
            {musicPlaying ? '🎵' : '🔇'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onToggleDark}
            className="w-9 h-9 rounded-full bg-blush/30 dark:bg-burgundy/30 flex items-center justify-center text-gray-500 dark:text-night-text"
            title="Toggle dark mode"
          >
            {state.darkMode ? '☀️' : '🌙'}
          </motion.button>
        </div>
      </div>
    </header>
  );
}
