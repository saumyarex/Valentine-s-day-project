import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { usePhotoUpload } from '../hooks/usePhotoUpload';

const defaultCoupons = [
  'One free back massage 💆',
  'Breakfast in bed 🥞',
  'Movie night of your choice 🎬',
  'A surprise date planned by me 🌹',
  'One wish granted, no questions asked ✨',
];

export default function GiftBox() {
  const { state, updateNested } = useApp();
  const { upload } = usePhotoUpload();
  const gift = state.giftBox;
  const [opened, setOpened] = useState(gift.opened);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState(gift.message);
  const [coupons, setCoupons] = useState(gift.coupons.length > 0 ? gift.coupons : []);
  const [newCoupon, setNewCoupon] = useState('');
  const [photo, setPhoto] = useState(gift.photo);
  const fileRef = useRef(null);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await upload(file, 'gift');
    setPhoto(url);
  };

  const addCoupon = () => {
    if (!newCoupon.trim()) return;
    setCoupons([...coupons, newCoupon.trim()]);
    setNewCoupon('');
  };

  const removeCoupon = (index) => {
    setCoupons(coupons.filter((_, i) => i !== index));
  };

  const saveGift = () => {
    updateNested('giftBox', { message, photo, coupons, opened: false });
    setOpened(false);
    setEditing(false);
  };

  const openGift = () => {
    setOpened(true);
    updateNested('giftBox', { opened: true });
  };

  const hasContent = gift.message || gift.photo || gift.coupons.length > 0;

  return (
    <section className="min-h-[80vh] px-4 py-12 flex flex-col items-center justify-center max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)]">
          Virtual Gift Box 🎁
        </h2>
        <p className="text-gold font-[family-name:var(--font-script)] text-xl mt-2">
          A special surprise just for you
        </p>
      </motion.div>

      {editing ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-night-surface rounded-2xl p-6 shadow-lg"
        >
          <h3 className="font-bold text-burgundy dark:text-blush mb-4 font-[family-name:var(--font-heading)]">
            Prepare Your Gift
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Secret Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write something special..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-blush/50 focus:border-rose-deep focus:outline-none bg-white dark:bg-night-bg dark:text-night-text resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Photo</label>
              <button
                onClick={() => fileRef.current?.click()}
                className="text-sm text-rose-deep hover:text-burgundy flex items-center gap-1"
              >
                📷 {photo ? 'Change Photo' : 'Add Photo'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              {photo && <img src={photo} alt="Gift" className="mt-2 rounded-lg h-24 object-cover" />}
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Love Coupons</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCoupon}
                  onChange={(e) => setNewCoupon(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCoupon()}
                  placeholder="e.g., One free back massage"
                  className="flex-1 px-3 py-2 rounded-lg border border-blush/50 focus:border-rose-deep focus:outline-none bg-white dark:bg-night-bg dark:text-night-text text-sm"
                />
                <button onClick={addCoupon} className="px-3 py-2 bg-rose-deep text-white rounded-lg text-sm">+</button>
              </div>
              {coupons.length === 0 && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-1">Quick add:</p>
                  <div className="flex flex-wrap gap-1">
                    {defaultCoupons.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCoupons([...coupons, c])}
                        className="text-[10px] px-2 py-1 rounded-full bg-blush/20 text-rose-deep hover:bg-blush/40"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-1 mt-2">
                {coupons.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-night-text">
                    <span>🎫</span>
                    <span className="flex-1">{c}</span>
                    <button onClick={() => removeCoupon(i)} className="text-gray-300 hover:text-rose-deep">✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(false)} className="flex-1 px-4 py-2 rounded-full border border-blush text-rose-deep">Cancel</button>
              <button onClick={saveGift} className="flex-1 bg-rose-deep text-white px-4 py-2 rounded-full hover:bg-burgundy">
                Wrap It Up 🎁
              </button>
            </div>
          </div>
        </motion.div>
      ) : hasContent && !opened ? (
        <div className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="gift-wobble cursor-pointer inline-block"
            onClick={openGift}
          >
            {/* Gift box visual */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
              {/* Box body */}
              <div className="absolute bottom-0 w-full h-3/4 bg-gradient-to-br from-rose-deep to-burgundy rounded-xl shadow-2xl" />
              {/* Ribbon vertical */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3/4 bg-gold/80 rounded-sm" />
              {/* Lid */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-[15%] -left-2 -right-2 h-1/4 bg-gradient-to-br from-rose-deep to-burgundy rounded-xl shadow-lg border-b-4 border-burgundy"
              >
                {/* Ribbon horizontal */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-6 bg-gold/80" />
                {/* Bow */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl">🎀</div>
              </motion.div>
              {/* Sparkles */}
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute -top-2 -right-2 text-2xl"
              >✨</motion.div>
              <motion.div
                animate={{ opacity: [1, 0.3, 1], scale: [1.1, 0.8, 1.1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute -top-1 -left-1 text-xl"
              >✨</motion.div>
            </div>
          </motion.div>
          <p className="mt-6 text-gray-500 dark:text-night-text/60 animate-pulse">
            Tap the gift to unwrap it! 🎁
          </p>
          <button
            onClick={() => setEditing(true)}
            className="mt-2 text-xs text-gray-400 hover:text-rose-deep"
          >
            Edit gift contents
          </button>
        </div>
      ) : hasContent && opened ? (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-night-surface rounded-2xl p-6 shadow-xl text-center">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              className="text-5xl mb-4"
            >
              🎉
            </motion.div>

            {gift.message && (
              <div className="mb-6">
                <p className="text-lg text-burgundy dark:text-blush font-[family-name:var(--font-script)] leading-relaxed">
                  "{gift.message}"
                </p>
              </div>
            )}

            {gift.photo && (
              <img src={gift.photo} alt="Gift" className="rounded-xl w-full h-48 object-cover mb-6 shadow" />
            )}

            {gift.coupons.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-gold uppercase tracking-wider">Love Coupons</h4>
                {gift.coupons.map((coupon, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-gradient-to-r from-cream to-white dark:from-night-bg dark:to-night-surface border border-gold/30 rounded-xl p-3 flex items-center gap-3"
                  >
                    <span className="text-xl">🎫</span>
                    <span className="text-sm text-gray-700 dark:text-night-text">{coupon}</span>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setOpened(false); updateNested('giftBox', { opened: false }); }}
                className="flex-1 px-4 py-2 rounded-full border border-blush text-rose-deep text-sm"
              >
                Wrap Again
              </button>
              <button
                onClick={() => setEditing(true)}
                className="flex-1 bg-rose-deep text-white px-4 py-2 rounded-full text-sm hover:bg-burgundy"
              >
                Edit Gift
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="text-center">
          <p className="text-5xl mb-4">🎁</p>
          <p className="text-gray-400 dark:text-night-text/50 mb-6">No gift prepared yet...</p>
          <button
            onClick={() => setEditing(true)}
            className="bg-rose-deep text-white px-6 py-3 rounded-full hover:bg-burgundy"
          >
            Prepare a Gift 🎁
          </button>
        </div>
      )}
    </section>
  );
}
