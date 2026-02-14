import { useState, useCallback } from 'react';

const COUPLE_ID_KEY = 'valentine-couple-id';

export function useCoupleId() {
  const [coupleId, setCoupleIdState] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('couple');
    if (fromUrl) {
      localStorage.setItem(COUPLE_ID_KEY, fromUrl);
      return fromUrl;
    }
    return localStorage.getItem(COUPLE_ID_KEY) || null;
  });

  const setCoupleId = useCallback((id) => {
    localStorage.setItem(COUPLE_ID_KEY, id);
    setCoupleIdState(id);
  }, []);

  const isSharedView = Boolean(
    new URLSearchParams(window.location.search).get('couple')
  );

  return { coupleId, setCoupleId, isSharedView };
}
