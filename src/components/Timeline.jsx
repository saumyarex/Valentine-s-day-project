import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { usePhotoUpload } from '../hooks/usePhotoUpload';

const milestoneIcons = {
  'First Date': '💑',
  'First Kiss': '💋',
  'First Trip': '✈️',
  'Moved In Together': '🏠',
  'Proposal': '💍',
  'Wedding': '💒',
  'Anniversary': '🎉',
  'Custom': '💕',
};

export default function Timeline() {
  const { state, update } = useApp();
  const { upload } = usePhotoUpload();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', description: '', icon: 'Custom', photo: null });
  const fileRef = useRef(null);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await upload(file, 'timeline');
    setForm((f) => ({ ...f, photo: url }));
  };

  const addMilestone = () => {
    if (!form.title.trim() || !form.date) return;
    const newTimeline = [...state.timeline, { ...form, id: Date.now() }]
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    update({ timeline: newTimeline });
    setForm({ title: '', date: '', description: '', icon: 'Custom', photo: null });
    setShowForm(false);
  };

  const removeMilestone = (id) => {
    update({ timeline: state.timeline.filter((m) => m.id !== id) });
  };

  return (
    <section className="min-h-[80vh] px-4 py-12 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)]">
          Our Love Story 📖
        </h2>
        <p className="text-gold font-[family-name:var(--font-script)] text-xl mt-2">
          Every moment with you is a chapter worth remembering
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {state.timeline.length > 0 && (
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 timeline-line transform md:-translate-x-px" />
        )}

        <AnimatePresence>
          {state.timeline.map((milestone, i) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex items-start gap-4 mb-8 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Heart connector */}
              <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-rose-deep rounded-full border-4 border-cream dark:border-night-bg transform -translate-x-[7px] md:-translate-x-2 z-10 top-6" />

              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                <div className="bg-white dark:bg-night-surface rounded-2xl p-5 shadow-lg border border-blush/20 hover:shadow-xl transition-shadow group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{milestoneIcons[milestone.icon] || '💕'}</span>
                      <div>
                        <h3 className="font-bold text-burgundy dark:text-blush font-[family-name:var(--font-heading)]">
                          {milestone.title}
                        </h3>
                        <p className="text-xs text-gold">
                          {new Date(milestone.date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeMilestone(milestone.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-deep transition-all text-sm"
                    >
                      ✕
                    </button>
                  </div>
                  {milestone.description && (
                    <p className="text-gray-600 dark:text-night-text/80 text-sm mt-2">{milestone.description}</p>
                  )}
                  {milestone.photo && (
                    <img
                      src={milestone.photo}
                      alt={milestone.title}
                      className="mt-3 rounded-xl w-full h-40 object-cover"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add milestone */}
      <div className="text-center mt-8">
        {!showForm ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="bg-rose-deep text-white px-6 py-3 rounded-full inline-flex items-center gap-2 hover:bg-burgundy transition-colors"
          >
            <span className="text-xl">+</span> Add a Memory
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-night-surface rounded-2xl p-6 shadow-lg max-w-md mx-auto text-left"
          >
            <h3 className="font-bold text-burgundy dark:text-blush mb-4 font-[family-name:var(--font-heading)]">
              New Memory
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Milestone Type</label>
                <select
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value, title: e.target.value === 'Custom' ? form.title : e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-blush/50 focus:border-rose-deep focus:outline-none bg-white dark:bg-night-bg dark:text-night-text text-sm"
                >
                  {Object.keys(milestoneIcons).map((key) => (
                    <option key={key} value={key}>{milestoneIcons[key]} {key}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-blush/50 focus:border-rose-deep focus:outline-none bg-white dark:bg-night-bg dark:text-night-text text-sm"
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-blush/50 focus:border-rose-deep focus:outline-none bg-white dark:bg-night-bg dark:text-night-text text-sm"
              />
              <textarea
                placeholder="What made this moment special?"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-blush/50 focus:border-rose-deep focus:outline-none bg-white dark:bg-night-bg dark:text-night-text text-sm resize-none"
              />
              <div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-sm text-rose-deep hover:text-burgundy flex items-center gap-1"
                >
                  📷 Add Photo
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                {form.photo && (
                  <img src={form.photo} alt="Preview" className="mt-2 rounded-lg h-24 object-cover" />
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 rounded-full border border-blush text-rose-deep hover:bg-blush/10 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={addMilestone}
                  disabled={!form.title.trim() || !form.date}
                  className="flex-1 bg-rose-deep text-white px-4 py-2 rounded-full text-sm hover:bg-burgundy disabled:opacity-50"
                >
                  Save Memory 💕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {state.timeline.length === 0 && (
        <div className="text-center mt-12 text-gray-400 dark:text-night-text/50">
          <p className="text-5xl mb-4">📖</p>
          <p>Your love story awaits its first chapter...</p>
        </div>
      )}
    </section>
  );
}
