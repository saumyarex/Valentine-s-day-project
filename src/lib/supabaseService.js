import { supabase, isSupabaseConfigured } from './supabase';

export async function createCouple(data) {
  if (!isSupabaseConfigured()) return null;
  const { data: row, error } = await supabase
    .from('couples')
    .insert({ data })
    .select('id')
    .single();
  if (error) {
    console.error('createCouple error:', error);
    return null;
  }
  return row.id;
}

export async function loadCouple(coupleId) {
  if (!isSupabaseConfigured()) return null;
  const { data: row, error } = await supabase
    .from('couples')
    .select('data, updated_at')
    .eq('id', coupleId)
    .single();
  if (error) {
    console.error('loadCouple error:', error);
    return null;
  }
  return { data: row.data, updatedAt: row.updated_at };
}

export async function saveCouple(coupleId, data) {
  if (!isSupabaseConfigured()) return false;
  const { error } = await supabase
    .from('couples')
    .update({ data })
    .eq('id', coupleId);
  if (error) {
    console.error('saveCouple error:', error);
    return false;
  }
  return true;
}

export async function uploadPhoto(coupleId, file, purpose = 'photo') {
  if (!isSupabaseConfigured()) return null;
  const ext = file.name.split('.').pop();
  const path = `${coupleId}/${purpose}_${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('couple-photos')
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) {
    console.error('uploadPhoto error:', error);
    return null;
  }
  const { data: urlData } = supabase.storage
    .from('couple-photos')
    .getPublicUrl(path);
  return urlData.publicUrl;
}
