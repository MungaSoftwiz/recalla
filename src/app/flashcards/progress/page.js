"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Typography, Button, LinearProgress } from "@mui/material";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import AppBar from "@/components/Layout/AppBar";
import FlashcardSidebar from "@/components/SideBar/StudySessionList";
import { Sparkles, Loader } from "lucide-react";
import { progressPageStyles as styles } from "@/styles/progressPage";

function ProgressContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [studyStreak, setStudyStreak] = useState(0);
  const [completedCards, setCompletedCards] = useState(0);
  const [totalCards, setTotalCards] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(sessionId);
  const router = useRouter();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        if (!sessionId) {
          setError("No session selected");
          return;
        }

        const { data: session, error: sessionError } = await supabase
          .from("study_sessions")
          .select("study_streak, completed_cards, total_cards, time_spent")
          .eq("id", sessionId)
          .single();

        if (sessionError) throw sessionError;

        setStudyStreak(session.study_streak || 0);
        setCompletedCards(session.completed_cards || 0);
        setTotalCards(session.total_cards || 0);
        setTimeSpent(session.time_spent || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("study_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) setSessions(data);
    };

    fetchProgress();
    fetchSessions();
  }, [sessionId]);

  const handleLogoClick = () => router.push("/flashcards");

  const handleSessionSelect = async (session) => {
    setActiveSessionId(session.id);
    router.push(`/flashcards/progress?sessionId=${session.id}`);
    try {
      const { data } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("id", session.id)
        .single();
      setStudyStreak(data.study_streak || 0);
      setCompletedCards(data.completed_cards || 0);
      setTotalCards(data.total_cards || 0);
      setTimeSpent(data.time_spent || 0);
    } catch (err) {
      setError("Failed to load session progress");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <Box sx={styles.loadingContainer}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative w-16 h-16 mb-4"
        >
          <Loader className="absolute inset-0 w-16 h-16 text-[#9C55FF] drop-shadow-[0_0_12px_rgba(156,85,255,0.5)]" />
        </motion.div>
        <Typography sx={{ color: "#D4C8FF", fontSize: "1.2rem" }}>
          Loading your progress...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={styles.loadingContainer}>
        <Typography sx={{ color: "#FF6B6B", fontSize: "1.5rem", mb: 2 }}>
          Oops! {error}
        </Typography>
        <Button
          variant="outlined"
          sx={{
            borderColor: "#9C55FF",
            color: "#EDE7FF",
            "&:hover": {
              borderColor: "#B78FFF",
              bgcolor: "rgba(156,85,255,0.1)",
            },
          }}
          onClick={() => router.push("/flashcards")}
        >
          Back to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={styles.root}>
      <AppBar onLogoClick={handleLogoClick} onSignOut={handleSignOut} />

      <FlashcardSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSessionSelect={handleSessionSelect}
      />

      <Box component="main" sx={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-16 h-16 text-[#B78FFF] mx-auto mb-4 drop-shadow-[0_0_12px_rgba(156,85,255,0.5)]" />
            </motion.div>
            <Typography
              variant="h3"
              sx={{
                color: "#EDE7FF",
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(156,85,255,0.3)",
              }}
            >
              Your Learning Journey
            </Typography>
            <Typography sx={{ color: "#D4C8FF", mt: 1, fontSize: "1.2rem" }}>
              Look how far you&apos;ve come—keep shining!
            </Typography>
          </Box>

          {/* Progress Stats */}
          <Box sx={{ maxWidth: "900px", mx: "auto" }}>
            <Box
              sx={{
                display: "grid",
                gap: 4,
                md: { gridTemplateColumns: "repeat(3, 1fr)" },
              }}
            >
              {/* Study Streak */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                style={styles.statsCard}
              >
                <Typography
                  sx={{
                    color: "#B78FFF",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {studyStreak} Days
                </Typography>
                <Typography sx={{ color: "#EDE7FF", mt: 1 }}>
                  Study Streak
                </Typography>
                <Typography
                  sx={{ color: "#D4C8FF", fontSize: "0.9rem", mt: 1 }}
                >
                  {studyStreak > 0
                    ? "You're on fire!"
                    : "Start your streak today!"}
                </Typography>
              </motion.div>

              {/* Cards Completed */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                style={styles.statsCard}
              >
                <Typography
                  sx={{
                    color: "#B78FFF",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {completedCards}/{totalCards}
                </Typography>
                <Typography sx={{ color: "#EDE7FF", mt: 1 }}>
                  Cards Mastered
                </Typography>
                <Typography
                  sx={{ color: "#D4C8FF", fontSize: "0.9rem", mt: 1 }}
                >
                  {completedCards === totalCards && totalCards > 0
                    ? "You've conquered them all!"
                    : "Keep pushing forward!"}
                </Typography>
              </motion.div>

              {/* Time Spent */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                style={styles.statsCard}
              >
                <Typography
                  sx={{
                    color: "#B78FFF",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {Math.floor(timeSpent / 60)} mins
                </Typography>
                <Typography sx={{ color: "#EDE7FF", mt: 1 }}>
                  Time Invested
                </Typography>
                <Typography
                  sx={{ color: "#D4C8FF", fontSize: "0.9rem", mt: 1 }}
                >
                  Every minute counts!
                </Typography>
              </motion.div>
            </Box>

            {/* Progress Visualization */}
            <Box sx={styles.progressContainer}>
              <Typography sx={{ color: "#EDE7FF", fontSize: "1.25rem", mb: 2 }}>
                Your Progress
              </Typography>
              <Box sx={{ position: "relative" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(completedCards / totalCards) * 100 || 0}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  sx={{
                    height: "20px",
                    bgcolor: "linear-gradient(135deg, #9C55FF, #D4A5FF)",
                    borderRadius: 2,
                    boxShadow: "0 0 12px rgba(156,85,255,0.5)",
                  }}
                />
                <Box
                  sx={{
                    height: "20px",
                    bgcolor: "#423760",
                    borderRadius: 2,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    zIndex: -1,
                  }}
                />
                <Typography
                  sx={{ color: "#D4C8FF", mt: 1, fontSize: "0.9rem" }}
                >
                  {completedCards}/{totalCards} cards completed
                </Typography>
              </Box>
            </Box>

            {/* Call to Action */}
            <Box sx={{ textAlign: "center", mt: 8 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  sx={styles.actionButton}
                  onClick={() =>
                    router.push(
                      `/flashcards/study?sessionId=${activeSessionId}`
                    )
                  }
                >
                  Keep Learning
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={<LinearProgress />}>
      <ProgressContent />
    </Suspense>
  );
}