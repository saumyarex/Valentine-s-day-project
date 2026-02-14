import { motion } from 'framer-motion';

const navItems = [
  { id: 'countdown', icon: '⏰', label: 'Countdown' },
  { id: 'timeline', icon: '📖', label: 'Our Story' },
  { id: 'letter', icon: '💌', label: 'Love Letter' },
  { id: 'reasons', icon: '💝', label: 'Reasons' },
  { id: 'quiz', icon: '🎯', label: 'Quiz' },
  { id: 'bucketlist', icon: '🗺️', label: 'Bucket List' },
  { id: 'gift', icon: '🎁', label: 'Gift Box' },
];

export default function Navigation({ active, onNavigate }) {
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-20 bg-white/90 dark:bg-night-surface/90 backdrop-blur-sm flex-col items-center justify-center gap-2 z-50 shadow-lg">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(item.id)}
            className={`relative w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all text-xs gap-0.5 ${
              active === item.id
                ? 'bg-rose-deep text-white shadow-lg'
                : 'text-gray-500 dark:text-night-text hover:bg-blush/30'
            }`}
            title={item.label}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] leading-tight">{item.label}</span>
            {active === item.id && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -right-1 w-1.5 h-8 bg-rose-deep rounded-full"
              />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-night-surface/95 backdrop-blur-sm z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-around items-center px-1 py-1 safe-bottom">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all ${
              active === item.id
                ? 'text-rose-deep'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] mt-0.5">{item.label}</span>
            {active === item.id && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute bottom-0 w-8 h-0.5 bg-rose-deep rounded-full"
              />
            )}
          </motion.button>
        ))}
      </nav>
    </>
  );
}
