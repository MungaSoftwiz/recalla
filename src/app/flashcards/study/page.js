"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Typography, LinearProgress } from "@mui/material";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import FlashcardComponent from "@/components/Flashcard/FlashcardComponent";
import AppBar from "@/components/Layout/AppBar";
import FlashcardSidebar from "@/components/SideBar/StudySessionList";

export default function StudyPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [flashcards, setFlashcards] = useState([]);
  const [totalCards, setTotalCards] = useState(0);
  const [completedCards, setCompletedCards] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(sessionId);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const { data: session, error: sessionError } = await supabase
          .from("study_sessions")
          .select("total_cards, completed_cards")
          .eq("id", sessionId)
          .single();

        if (!session) throw new Error("Session not found");

        const { data: flashcardsData, error: flashcardsError } = await supabase
          .from("flashcards")
          .select("*")
          .eq("session_id", sessionId);

        if (flashcardsError) throw new Error("Flashcards not found");

        setFlashcards(flashcardsData || []);
        setTotalCards(session.total_cards);
        setCompletedCards(session.completed_cards);
      } catch (err) {
        setError(err.message);
        console.log("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) fetchFlashcards();
  }, [sessionId]);

  const handleNextCard = async () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsFlipped(false);
      setCompletedCards((prev) => {
        const newCompleted = prev + 1;
        updateSessionProgress(sessionId, newCompleted, totalCards);
        return newCompleted;
      });
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const updateSessionProgress = async (sessionId, completed, total) => {
    const { error } = await supabase
      .from("study_sessions")
      .update({
        progress: (completed / total) * 100,
        completed_cards: completed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (error) console.error("Failed to update progress:", error);
  };

  const handleSessionSelect = (session) => {
    setActiveSessionId(session.id);
    window.location.href = `/flashcards/study?sessionId=${session.id}`;
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <AppBar onLogoClick={() => {}} onSignOut={() => {}} />

      <FlashcardSidebar
        sessions={[]}
        onSessionSelect={handleSessionSelect}
        activeSessionId={activeSessionId}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Offset for navbar
          height: "calc(100vh - 64px)", // Account for navbar height
          overflow: "auto",
          bgcolor: "#1A1A2E", // Dark background to match dashboard
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isLoading ? ( //
          <LinearProgress
            sx={{ "& .MuiLinearProgress-bar": { backgroundColor: "#9C55FF" } }}
          />
        ) : error ? (
          <Typography color="error" sx={{ p: 3, color: "white" }}>
            {error}
          </Typography>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ width: "100%", maxWidth: "800px" }}
          >
            <Box
              sx={{
                p: 1,
                mb: 2,
                background:
                  "linear-gradient(135deg, rgba(156, 85, 255, 0.1) 0%, rgba(183, 143, 255, 0.1) 100%)",
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(156, 85, 255, 0.2)",
                width: "250px",
                mx: "auto",
              }}
            >
              <Typography
                variant="body1"
                align="center"
                sx={{ color: "white", mb: 1 }}
              >
                Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(completedCards / totalCards) * 100}
                sx={{
                  "& .MuiLinearProgress-bar": { backgroundColor: "#9C55FF" },
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "rgba(156, 85, 255, 0.2)",
                }}
              />
              <Typography
                variant="caption"
                align="center"
                sx={{ color: "white", mt: 0.5 }}
              >
                {completedCards}/{totalCards} completed
              </Typography>
            </Box>

            <FlashcardComponent
              card={flashcards[currentCardIndex]}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
              onNext={handleNextCard}
              onPrevious={handlePreviousCard}
              currentIndex={currentCardIndex}
              totalCards={flashcards.length}
            />
          </motion.div>
        )}
      </Box>
    </Box>
  );
}
