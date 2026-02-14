import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { useApp } from './context/AppContext';
import FloatingHearts from './components/FloatingHearts';
import Onboarding from './components/Onboarding';
import Navigation from './components/Navigation';
import Header from './components/Header';
import Countdown from './components/Countdown';
import Timeline from './components/Timeline';
import LoveLetter from './components/LoveLetter';
import ReasonsCards from './components/ReasonsCards';
import Quiz from './components/Quiz';
import BucketList from './components/BucketList';
import GiftBox from './components/GiftBox';
import ShareButton from './components/ShareButton';
import EasterEgg from './components/EasterEgg';

const sections = {
  countdown: Countdown,
  timeline: Timeline,
  letter: LoveLetter,
  reasons: ReasonsCards,
  quiz: Quiz,
  bucketlist: BucketList,
  gift: GiftBox,
};

function AppContent() {
  const { state, update } = useApp();
  const [activeSection, setActiveSection] = useState('countdown');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://cdn.pixabay.com/audio/2024/11/29/audio_d4e4cf8300.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setMusicPlaying(!musicPlaying);
  }, [musicPlaying]);

  const toggleDark = useCallback(() => {
    update({ darkMode: !state.darkMode });
  }, [state.darkMode, update]);

  if (!state.onboarded) {
    return (
      <>
        <FloatingHearts />
        <Onboarding />
      </>
    );
  }

  const ActiveComponent = sections[activeSection];

  return (
    <div className={`min-h-screen ${state.darkMode ? 'bg-night-bg text-night-text' : 'bg-cream text-gray-800'} transition-colors duration-500`}>
      <FloatingHearts />
      <Navigation active={activeSection} onNavigate={setActiveSection} />
      <Header
        onToggleDark={toggleDark}
        onToggleMusic={toggleMusic}
        musicPlaying={musicPlaying}
      />

      <main className="md:ml-20 pt-14 pb-20 md:pb-4 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      <ShareButton />
      <EasterEgg />
    </div>
  );
}

export default function App() {
  return (
    <>
      <AppContent />
      <Analytics />
    </>
  );
}
