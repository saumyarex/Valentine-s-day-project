import { useEffect, useRef, useCallback } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { loadCouple, saveCouple, createCouple } from '../lib/supabaseService';

export function useSupabaseSync(state, setState, coupleId, setCoupleId) {
  const saveTimeoutRef = useRef(null);
  const isSyncingRef = useRef(false);
  const lastSavedRef = useRef(null);

  // Load from Supabase on mount (or when coupleId changes)
  useEffect(() => {
    if (!isSupabaseConfigured() || !coupleId) return;

    let cancelled = false;
    (async () => {
      isSyncingRef.current = true;
      const result = await loadCouple(coupleId);
      if (cancelled || !result) {
        isSyncingRef.current = false;
        return;
      }
      setState((prev) => ({ ...prev, ...result.data }));
      lastSavedRef.current = JSON.stringify(result.data);
      isSyncingRef.current = false;
    })();

    return () => { cancelled = true; };
  }, [coupleId, setState]);

  // Debounced save to Supabase on state changes
  const syncToSupabase = useCallback((currentState) => {
    if (!isSupabaseConfigured() || isSyncingRef.current) return;

    // Strip local-only preferences before saving to cloud
    const dataForDb = { ...currentState };
    delete dataForDb.darkMode;

    const serialized = JSON.stringify(dataForDb);
    if (serialized === lastSavedRef.current) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      if (!coupleId) {
        const newId = await createCouple(dataForDb);
        if (newId) {
          setCoupleId(newId);
          lastSavedRef.current = serialized;
        }
      } else {
        const success = await saveCouple(coupleId, dataForDb);
        if (success) lastSavedRef.current = serialized;
      }
    }, 500);
  }, [coupleId, setCoupleId]);

  useEffect(() => {
    if (state.onboarded) {
      syncToSupabase(state);
    }
  }, [state, syncToSupabase]);
}
