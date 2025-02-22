import { supabase } from "@/lib/supabase";

export async function calculateStudyStreak() {
  const { data: sessions } = await supabase
    .from("study_sessions")
    .select("updated_at")
    .order("updated_at", { ascending: false });

  if (sessions.length > 0) {
    const lastDate = new Date(sessions[0].updated_at);
    const today = new Date();
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || diffDays === 1) {
      return { streak: (prev) => prev + (diffDays === 0 ? 0 : 1), lastDate };
    } else {
      return { streak: 1, lastDate };
    }
  }
  return { streak: 0, lastDate: null };
}
