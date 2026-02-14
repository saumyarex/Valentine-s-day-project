import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useApp } from '../context/AppContext';

export default function ShareButton() {
  const { coupleId, isCloudEnabled } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl = window.location.origin + window.location.pathname;
  const url = coupleId ? `${baseUrl}?couple=${coupleId}` : baseUrl;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-rose-deep text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm hover:bg-burgundy transition-colors"
      >
        💕 Share with your love
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-night-surface rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
            >
              <h3 className="text-xl font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)] mb-2">
                Share the Love 💕
              </h3>
              <p className="text-sm text-gray-500 dark:text-night-text/60 mb-4">
                Send this link to your special someone
              </p>

              {/* Cloud status */}
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs mb-4 ${
                isCloudEnabled && coupleId
                  ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                  : isCloudEnabled
                  ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                  : 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  isCloudEnabled && coupleId ? 'bg-green-500' : isCloudEnabled ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
                {isCloudEnabled && coupleId
                  ? 'Cloud synced'
                  : isCloudEnabled
                  ? 'Syncing...'
                  : 'Local only'}
              </div>

              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 rounded-xl shadow-inner">
                  <QRCodeSVG value={url} size={160} fgColor="#800020" />
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  value={url}
                  readOnly
                  className="flex-1 px-3 py-2 rounded-lg border border-blush/50 bg-cream dark:bg-night-bg dark:text-night-text text-xs truncate"
                />
                <button
                  onClick={copyLink}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    copied ? 'bg-green-500 text-white' : 'bg-rose-deep text-white hover:bg-burgundy'
                  }`}
                >
                  {copied ? '✓' : 'Copy'}
                </button>
              </div>

              {!isCloudEnabled && (
                <p className="text-xs text-amber-500 mt-3">
                  Cloud sync not configured. Set up Supabase to share data with your partner.
                </p>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="mt-4 text-sm text-gray-400 hover:text-rose-deep"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
