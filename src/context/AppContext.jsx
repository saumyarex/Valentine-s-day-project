import { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCoupleId } from '../hooks/useCoupleId';
import { useSupabaseSync } from '../hooks/useSupabaseSync';
import { isSupabaseConfigured } from '../lib/supabase';

const AppContext = createContext();

const defaultState = {
  onboarded: false,
  partner1: '',
  partner2: '',
  anniversary: '',
  couplePhoto: null,
  timeline: [],
  loveLetter: { message: '', opened: false },
  reasons: [],
  quiz: { questions: [], answers: {}, score: 0, completed: false },
  bucketList: [],
  giftBox: { message: '', photo: null, coupons: [], opened: false },
  darkMode: false,
};

export function AppProvider({ children }) {
  const [state, setState] = useLocalStorage('valentine-app-data', defaultState);
  const { coupleId, setCoupleId, isSharedView } = useCoupleId();

  // Sync with Supabase (no-ops if not configured)
  useSupabaseSync(state, setState, coupleId, setCoupleId);

  const update = (partial) => {
    setState((prev) => ({ ...prev, ...partial }));
  };

  const updateNested = (key, value) => {
    setState((prev) => ({
      ...prev,
      [key]: typeof value === 'function' ? value(prev[key]) : { ...prev[key], ...value },
    }));
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{
      state, update, updateNested, setState,
      coupleId, isSharedView, isCloudEnabled: isSupabaseConfigured(),
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
