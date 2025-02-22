"use client";

import { Box, Dialog, DialogContent } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SHARED_STYLES } from "@/styles/theme";
import AppBar from "@/components/Layout/AppBar";
import FlashcardSidebar from "@/components/SideBar/StudySessionList";
import { FlashcardGenerator } from "@/components/Flashcard/FlashcardGenerator";
import WelcomeScreen from "@/components/Welcome/WelcomeScreen";
import StudyView from "@/components/Flashcard/StudyView";

const mainContentStyles = {
  root: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
  },
  nav: {
    width: (drawerOpen) => (drawerOpen ? 256 : 0),
    flexShrink: 0,
    transition: "width 0.3s",
  },
  navContent: {
    marginTop: "64px",
    height: "calc(100vh - 64px)",
    overflow: "hidden",
  },
  main: {
    flexGrow: 1,
    height: "100vh",
    overflow: "hidden",
    marginTop: "64px",
    bgcolor: SHARED_STYLES.colors.background,
  },
  mainContent: {
    height: "100%",
    overflow: "auto",
  },
};

export default function FlashcardsLayout() {
  const [sessions, setSessions] = useState([]);
  const [totalCards, setTotalCards] = useState(0);
  const [completedCards, setCompletedCards] = useState(0);
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [userName, setUserName] = useState("User");
  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("study_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setSessions(data);
      }
    };

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserName(
          user.user_metadata?.name || user.email.split("@")[0] || "User"
        );
      }
    };

    fetchSessions();
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleLogoClick = () => {
    router.push("/flashcards");
    setShowWelcome(true);
    setFlashcards([]);
    setActiveSessionId(null);
    setShowProgress(false);
  };

  const onGenerateFlashcards = async (newFlashcards, sessionId) => {
    setFlashcards(newFlashcards);
    setTotalCards(newFlashcards.length);
    setCompletedCards(0);
    setCurrentCardIndex(0);
    setShowWelcome(false);
    setShowProgress(false);
    setActiveSessionId(sessionId);
    setDialogOpen(false);

    const newSession = sessions.find((s) => s.id === sessionId) || {
      id: sessionId,
      topic: `Session ${sessionId}`,
    };
    setSessions((prev) => [
      newSession,
      ...prev.filter((s) => s.id !== sessionId),
    ]);

    router.push(`/flashcards/study?sessionId=${sessionId}`);
  };

  return (
    <Box sx={mainContentStyles.root}>
      <AppBar
        onLogoClick={handleLogoClick}
        onSignOut={handleSignOut}
        onNewSet={() => setDialogOpen(true)}
        userName={userName}
      />

      <Box component="nav" sx={mainContentStyles.nav}>
        <Box sx={mainContentStyles.navContent}>
          <FlashcardSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSessionSelect={async (session) => {
              try {
                const { data } = await supabase
                  .from("flashcards")
                  .select("*")
                  .eq("session_id", session.id);
                onGenerateFlashcards(data || [], session.id);
              } catch (err) {
                setError("Failed to load flashcards for this session");
              }
            }}
          />
        </Box>
      </Box>

      <Box component="main" sx={mainContentStyles.main}>
        <Box sx={mainContentStyles.mainContent}>
          {showWelcome ? (
            <WelcomeScreen
              userName={userName}
              onGenerateFlashcards={onGenerateFlashcards}
              isLoading={isLoading}
              activeSessionId={activeSessionId}
              sessions={sessions}
            />
          ) : (
            <StudyView
              flashcards={flashcards}
              totalCards={totalCards}
              completedCards={completedCards}
              currentCardIndex={currentCardIndex}
              isFlipped={isFlipped}
              setIsFlipped={setIsFlipped}
              setCompletedCards={setCompletedCards}
              activeSessionId={activeSessionId}
              isLoading={isLoading}
              error={error}
              showProgress={showProgress}
              onNext={() => setCurrentCardIndex((prev) => prev + 1)}
              onPrevious={() => setCurrentCardIndex((prev) => prev - 1)}
            />
          )}
        </Box>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogContent>
            <FlashcardGenerator
              onFlashcardsGenerated={(newFlashcards) => {
                const sessionId = sessions[0]?.id || crypto.randomUUID();
                onGenerateFlashcards(newFlashcards, sessionId);
              }}
              onError={(errorMessage) => setError(errorMessage)}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}
