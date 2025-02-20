import { supabase } from "@/lib/supabase";

export async function uploadFile(file) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { data, error } = await supabase.storage
      .from("pdfs")
      .upload(filePath, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("pdfs").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

export async function createStudySession(topic, pdfUrl) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("study_sessions")
      .insert({
        user_id: user.id,
        topic,
        pdf_url: pdfUrl,
        progress: 0,
        total_cards: 0,
        completed_cards: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating study session:", error);
    throw error;
  }
}

export async function saveSession(newSession) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("study_sessions").insert({
    ...newSession,
    user_id: user.id,
  });

  if (error) {
    console.error("Error saving session:", error);
    return null;
  }

  return data;
}

export async function updateSessionProgress(sessionId, completed, total) {
  const { error } = await supabase
    .from("study_sessions")
    .update({
      progress: (completed / total) * 100,
      completed_cards: completed,
      total_cards: total,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) throw new Error(`Failed to update progress: ${error.message}`);
}
