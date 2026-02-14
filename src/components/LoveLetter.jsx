import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function LoveLetter() {
  const { state, updateNested } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(state.loveLetter.message);
  const [opened, setOpened] = useState(state.loveLetter.opened);

  const saveLetter = () => {
    updateNested('loveLetter', { message: draft, opened: false });
    setOpened(false);
    setEditing(false);
  };

  const openEnvelope = () => {
    setOpened(true);
    updateNested('loveLetter', { opened: true });
  };

  return (
    <section className="min-h-[80vh] px-4 py-12 flex flex-col items-center justify-center max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)]">
          Love Letter 💌
        </h2>
        <p className="text-gold font-[family-name:var(--font-script)] text-xl mt-2">
          Words from the heart
        </p>
      </motion.div>

      {editing ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="parchment rounded-2xl p-6 md:p-8">
            <p className="text-sm text-gray-500 mb-3 font-[family-name:var(--font-script)] text-lg">
              Dear {state.partner2},
            </p>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write your heartfelt message here..."
              rows={10}
              className="w-full bg-transparent border-none focus:outline-none text-gray-700 text-lg leading-relaxed resize-none font-[family-name:var(--font-body)]"
              style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #d4a37340 31px, #d4a37340 32px)', lineHeight: '32px' }}
            />
            <p className="text-right text-gray-500 font-[family-name:var(--font-script)] text-lg mt-4">
              With all my love, {state.partner1} 💕
            </p>
          </div>
          <div className="flex gap-3 mt-4 justify-center">
            <button
              onClick={() => { setEditing(false); setDraft(state.loveLetter.message); }}
              className="px-6 py-2 rounded-full border border-blush text-rose-deep hover:bg-blush/10"
            >
              Cancel
            </button>
            <button
              onClick={saveLetter}
              disabled={!draft.trim()}
              className="bg-rose-deep text-white px-6 py-2 rounded-full hover:bg-burgundy disabled:opacity-50"
            >
              Seal with a Kiss 💋
            </button>
          </div>
        </motion.div>
      ) : state.loveLetter.message ? (
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {!opened ? (
              <motion.div
                key="envelope"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="cursor-pointer"
                onClick={openEnvelope}
              >
                {/* Envelope */}
                <div className="relative mx-auto w-72 md:w-96 perspective-[1000px]">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                    className="relative"
                  >
                    {/* Envelope body */}
                    <div className="bg-gradient-to-b from-rose-deep to-burgundy rounded-xl h-48 md:h-56 relative overflow-hidden shadow-2xl">
                      {/* Inner flap shadow */}
                      <div className="absolute inset-x-0 top-0 h-24 md:h-28">
                        <div className="w-0 h-0 mx-auto border-l-[144px] md:border-l-[192px] border-r-[144px] md:border-r-[192px] border-t-[96px] md:border-t-[112px] border-l-transparent border-r-transparent border-t-blush/30" />
                      </div>
                      {/* Heart seal */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-lg z-10"
                        >
                          <span className="text-3xl">💌</span>
                        </motion.div>
                      </div>
                      {/* Bottom flap pattern */}
                      <div className="absolute bottom-0 inset-x-0 h-16">
                        <div className="w-0 h-0 mx-auto border-l-[144px] md:border-l-[192px] border-r-[144px] md:border-r-[192px] border-b-[64px] border-l-transparent border-r-transparent border-b-burgundy/50" />
                      </div>
                    </div>
                    {/* Top flap */}
                    <div className="absolute inset-x-0 top-0 origin-top" style={{ perspective: '1000px' }}>
                      <div className="w-0 h-0 mx-auto border-l-[144px] md:border-l-[192px] border-r-[144px] md:border-r-[192px] border-t-[96px] md:border-t-[112px] border-l-transparent border-r-transparent border-t-rose-deep drop-shadow-md" />
                    </div>
                  </motion.div>
                  <p className="text-center mt-6 text-gray-500 dark:text-night-text/60 animate-pulse">
                    Tap to open your letter 💕
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="letter"
                initial={{ opacity: 0, y: 30, rotateX: -30 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div className="parchment rounded-2xl p-6 md:p-8 shadow-xl">
                  <p className="text-gray-500 font-[family-name:var(--font-script)] text-xl mb-4">
                    Dear {state.partner2},
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {state.loveLetter.message}
                  </p>
                  <p className="text-right text-gray-500 font-[family-name:var(--font-script)] text-xl mt-6">
                    With all my love,<br />{state.partner1} 💕
                  </p>
                </div>
                <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={() => setOpened(false)}
                    className="px-4 py-2 rounded-full border border-blush text-rose-deep hover:bg-blush/10 text-sm"
                  >
                    Close Envelope
                  </button>
                  <button
                    onClick={() => { setEditing(true); setDraft(state.loveLetter.message); }}
                    className="px-4 py-2 rounded-full bg-rose-deep text-white hover:bg-burgundy text-sm"
                  >
                    Edit Letter
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-5xl mb-4">✉️</p>
          <p className="text-gray-400 dark:text-night-text/50 mb-6">No letter written yet...</p>
          <button
            onClick={() => setEditing(true)}
            className="bg-rose-deep text-white px-6 py-3 rounded-full hover:bg-burgundy transition-colors"
          >
            Write a Love Letter 💕
          </button>
        </motion.div>
      )}

      {!editing && state.loveLetter.message && (
        <button
          onClick={() => { setEditing(true); setDraft(state.loveLetter.message); }}
          className="mt-4 text-sm text-gray-400 hover:text-rose-deep transition-colors"
        >
          ✏️ Edit letter
        </button>
      )}
    </section>
  );
}
