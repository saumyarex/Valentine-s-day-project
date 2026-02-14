import { useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { uploadPhoto } from '../lib/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

export function usePhotoUpload() {
  const { coupleId } = useApp();

  const upload = useCallback(async (file, purpose = 'photo') => {
    if (isSupabaseConfigured() && coupleId) {
      const url = await uploadPhoto(coupleId, file, purpose);
      if (url) return url;
    }
    // Fallback: base64 data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }, [coupleId]);

  return { upload };
}
