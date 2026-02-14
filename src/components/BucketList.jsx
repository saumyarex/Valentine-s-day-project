import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const categories = {
  Travel: { icon: '✈️', color: 'bg-blue-50 dark:bg-blue-900/20' },
  Food: { icon: '🍕', color: 'bg-orange-50 dark:bg-orange-900/20' },
  Adventures: { icon: '🎢', color: 'bg-green-50 dark:bg-green-900/20' },
  Milestones: { icon: '💎', color: 'bg-purple-50 dark:bg-purple-900/20' },
};

export default function BucketList() {
  const { state, update } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('Travel');
  const [filter, setFilter] = useState('all');

  const addItem = () => {
    if (!newItem.trim()) return;
    update({
      bucketList: [
        ...state.bucketList,
        { id: Date.now(), text: newItem.trim(), category, done: false },
      ],
    });
    setNewItem('');
    setShowAdd(false);
  };

  const toggleItem = (id) => {
    update({
      bucketList: state.bucketList.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    });
  };

  const removeItem = (id) => {
    update({ bucketList: state.bucketList.filter((item) => item.id !== id) });
  };

  const filtered = filter === 'all'
    ? state.bucketList
    : state.bucketList.filter((item) => item.category === filter);

  const doneCount = state.bucketList.filter((i) => i.done).length;

  return (
    <section className="min-h-[80vh] px-4 py-12 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)]">
          Our Bucket List 🗺️
        </h2>
        <p className="text-gold font-[family-name:var(--font-script)] text-xl mt-2">
          Dreams we'll chase together
        </p>
        {state.bucketList.length > 0 && (
          <div className="mt-4">
            <div className="h-2 bg-blush/20 rounded-full overflow-hidden max-w-xs mx-auto">
              <motion.div
                className="h-full bg-rose-deep rounded-full"
                animate={{ width: `${(doneCount / state.bucketList.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">{doneCount} of {state.bucketList.length} completed</p>
          </div>
        )}
      </motion.div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-rose-deep text-white'
              : 'bg-blush/20 text-gray-600 dark:text-night-text hover:bg-blush/40'
          }`}
        >
          All
        </button>
        {Object.entries(categories).map(([cat, { icon }]) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === cat
                ? 'bg-rose-deep text-white'
                : 'bg-blush/20 text-gray-600 dark:text-night-text hover:bg-blush/40'
            }`}
          >
            {icon} {cat}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
              layout
              className={`rounded-xl p-4 flex items-center gap-3 group ${categories[item.category]?.color || 'bg-white'} ${
                item.done ? 'opacity-60' : ''
              }`}
            >
              <motion.button
                whileTap={{ scale: 1.3 }}
                onClick={() => toggleItem(item.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  item.done
                    ? 'bg-rose-deep border-rose-deep text-white check-satisfy'
                    : 'border-blush hover:border-rose-deep'
                }`}
              >
                {item.done && '✓'}
              </motion.button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${item.done ? 'line-through text-gray-400' : 'text-gray-700 dark:text-night-text'}`}>
                  {item.text}
                </p>
                <span className="text-[10px] text-gray-400">
                  {categories[item.category]?.icon} {item.category}
                </span>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-rose-deep text-sm transition-opacity"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add button/form */}
      {!showAdd ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAdd(true)}
          className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-blush/50 text-blush hover:border-rose-deep hover:text-rose-deep transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span> Add to Bucket List
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-white dark:bg-night-surface rounded-xl p-4 shadow-lg"
        >
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="Something we want to do together..."
            className="w-full px-4 py-2 rounded-lg border border-blush/50 focus:border-rose-deep focus:outline-none bg-white dark:bg-night-bg dark:text-night-text mb-3"
            autoFocus
          />
          <div className="flex gap-2 mb-3 flex-wrap">
            {Object.entries(categories).map(([cat, { icon }]) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  category === cat ? 'bg-rose-deep text-white' : 'bg-blush/20 text-gray-600 dark:text-night-text'
                }`}
              >
                {icon} {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowAdd(false); setNewItem(''); }}
              className="flex-1 px-4 py-2 rounded-full border border-blush text-rose-deep text-sm"
            >
              Cancel
            </button>
            <button
              onClick={addItem}
              disabled={!newItem.trim()}
              className="flex-1 bg-rose-deep text-white px-4 py-2 rounded-full text-sm hover:bg-burgundy disabled:opacity-50"
            >
              Add 💕
            </button>
          </div>
        </motion.div>
      )}

      {state.bucketList.length === 0 && (
        <div className="text-center mt-12 text-gray-400 dark:text-night-text/50">
          <p className="text-5xl mb-4">🌍</p>
          <p>Your adventure list is empty!</p>
          <p className="text-sm mt-1">Start dreaming together</p>
        </div>
      )}
    </section>
  );
}
