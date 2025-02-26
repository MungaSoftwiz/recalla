import { supabase } from "@/lib/supabase";

export async function uploadFile(file) {
  try {
    console.log("File object:", file); // debug

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    if (!file.name) {
      throw new Error("File name is undefined")
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    console.log("File path:", filePath); // debug

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

export async function updateSessionProgress(sessionId, completed, total) {
  const { error } = await supabase
    .from("study_sessions")
    .update({
      progress: (completed / total) * 100,
      completed_cards: completed,
      total_cards: total,
      // time_spent: timeSpent,
      // study_streak: streak,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (error) throw new Error(`Failed to update progress: ${error.message}`);
}

// WIP: DO NOT DELETE

// export async function uploadAndGenerateFlashcards(
//   file,
//   accessToken,
//   sessionId = null
// ) {
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   if (!session) throw new Error("Not authenticated");
//   const fileUrl = await uploadFile(file);
//   const newSession = sessionId
//     ? { id: sessionId }
//     : await createStudySession(file.name.replace(".pdf", ""), fileUrl);
//   const response = await fetch("/api/flashcards/pdf", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     },
//     body: JSON.stringify({ fileUrl, sessionId: newSession.id }),
//   });
//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(`API error: ${response.status} - ${errorText}`);
//   }
//   const flashcards = await response.json();
//   await updateSessionProgress(newSession.id, 0, flashcards.length);
//   return { flashcards, sessionId: newSession.id };
// }

export async function generateFlashcardsFromChat(
  topic,
  accessToken,
  sessionId = null
) {
  if (!accessToken) throw new Error("No access token provided");

  const newSession = sessionId
    ? { id: sessionId }
    : await createStudySession(`Chat: ${topic.substring(0, 20)}`, null);

  const response = await fetch("/api/flashcards/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ topic, sessionId: newSession.id }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  }
  const flashcards = await response.json();
  await updateSessionProgress(newSession.id, 0, flashcards.length);
  return { flashcards, sessionId: newSession.id };
}
