import { supabase } from '@/lib/supabase';

export async function uploadFile(file) {
  const filePath = `uploads/${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from('recalla-uploads')
    .upload(filePath, file);

  if (error) throw new Error(`Failed to upload file: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from('recalla-uploads')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function saveSession(session) {
  // Remove local storage operations
  const { data, error } = await supabase
    .from('study_sessions')
    .insert([session])
    .select();

  if (error) throw new Error(`Failed to save session: ${error.message}`);
  return data[0];
}

export async function updateSessionProgress(sessionId, completed, total) {
  const { error } = await supabase
    .from('study_sessions')
    .update({
      progress: (completed / total) * 100,
      completed_cards: completed,
      total_cards: total,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (error) throw new Error(`Failed to update progress: ${error.message}`);
}