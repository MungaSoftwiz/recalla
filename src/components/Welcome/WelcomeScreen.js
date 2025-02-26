"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import { Sparkles, Upload, Brain, BookOpen, Paperclip } from "lucide-react";
import {
  // uploadAndGenerateFlashcards,
  generateFlashcardsFromChat,
} from "@/utils/flashcardUtils";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function WelcomeScreen({
  userName,
  onGenerateFlashcards,
  activeSessionId,
  sessions,
}) {
  const [inputMessage, setInputMessage] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // WIP: DO NOT DELETE

  // const handleFileUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   setIsLoading(true);
  //   try {
  //     let {
  //       data: { session },
  //     } = await supabase.auth.getSession();

  //     if (!session || Date.now() / 1000 > session.expires_at) {
  //       const { data: refreshData, error: refreshError } =
  //         await supabase.auth.refreshSession();
  //       if (refreshError) throw new Error("Authentication failed");
  //       session = refreshData.session;
  //     }

  //     const { flashcards, sessionId } = await uploadAndGenerateFlashcards(
  //       file,
  //       session.access_token
  //     );
  //     onGenerateFlashcards(flashcards, sessionId);
  //     router.push(`/flashcards/study?sessionId=${sessionId}`);
  //   } catch (err) {
  //     console.error("PDF upload error:", err.message);
  //     setError(err.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setIsLoading(true);
    try {
      let {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session || Date.now() / 1000 > session.expires_at) {
        const { data: refreshData, error: refreshError } =
          await supabase.auth.refreshSession();
        if (refreshError) throw new Error("Authentication failed");
        session = refreshData.session;
      }

      const { flashcards, sessionId } = await generateFlashcardsFromChat(
        inputMessage.trim(),
        session.access_token
      );
      console.log("Received flashcards:", flashcards);
      onGenerateFlashcards(flashcards, sessionId);
      router.push(`/flashcards/study?sessionId=${sessionId}`);
    } catch (err) {
      console.error("Chat submit error:", err.message);
      setError(err.message);
    } finally {
      setInputMessage("");
      setIsLoading(false);
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleViewProgress = () => {
    router.push(
      `/flashcards/progress?sessionId=${activeSessionId || sessions[0]?.id}`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center py-16 bg-gradient-to-b from-[#1F1A30] via-[#2A2438] to-[#3A2F50] min-h-screen"
    >
      {/* Header Section */}
      <div className="mb-12 relative">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block relative"
        >
          <Sparkles className="w-16 h-16 text-[#B78FFF] mb-4 drop-shadow-[0_0_10px_rgba(183,143,255,0.5)]" />
          <div className="absolute inset-0 bg-[#9C55FF] opacity-20 blur-xl rounded-full scale-150"></div>
        </motion.div>
        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-[0_2px_4px_rgba(156,85,255,0.3)]">
          Welcome back, {userName}!
        </h1>
        <p className="text-[#D4C8FF] text-lg mb-8 max-w-2xl mx-auto font-light">
          Unleash your potential with AI-crafted flashcards.
        </p>
      </div>

      {/* Ask Recalla AI Section */}
      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
          mb: 10,
          p: 4,
          bgcolor: "rgba(42, 36, 56, 0.9)",
          borderRadius: 3,
          border: "1px solid rgba(156, 85, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(156, 85, 255, 0.15)",
          backdropFilter: "blur(10px)",
          position: "relative",
        }}
      >
        <Typography variant="h6" className="text-[#EDE7FF] mb-4 font-semibold">
          Ask Recalla AI
        </Typography>
        <form onSubmit={handleChatSubmit} className="flex gap-3 items-center">
          <TextField
            label="What do you want to learn today?"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Type a topic, question, or upload a PDF"
            sx={{
              input: { color: "#EDE7FF" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "rgba(156, 85, 255, 0.05)",
                borderColor: "rgba(156, 85, 255, 0.3)",
                "&:hover fieldset": { borderColor: "#B78FFF" },
                "&.Mui-focused fieldset": { borderColor: "#9C55FF" },
              },
              "& .MuiInputLabel-root": { color: "#B78FFF" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#9C55FF" },
            }}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {!isLoading && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() =>
                          document.getElementById("pdf-upload").click()
                        }
                        sx={{ color: "#B78FFF", textTransform: "none", p: 0 }}
                      >
                        <Paperclip className="w-5 h-5 mr-1" /> Upload
                      </Button>
                    </motion.div>
                  )}
                </InputAdornment>
              ),
            }}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #9C55FF 0%, #D4A5FF 100%)",
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                boxShadow: "0 4px 12px rgba(156, 85, 255, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #8044FF 0%, #B78FFF 100%)",
                  boxShadow: "0 6px 16px rgba(156, 85, 255, 0.5)",
                },
              }}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Create"}
            </Button>
          </motion.div>
        </form>
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          // onChange={handleFileUpload}
          style={{ display: "none" }}
          disabled={isLoading}
        />

        {/* Loader Below Chat Input */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 flex flex-col items-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="relative w-12 h-12"
            >
              <div className="absolute inset-0 border-4 border-t-[#9C55FF] border-l-[#B78FFF] border-r-transparent border-b-transparent rounded-full"></div>
              <div className="absolute inset-1 border-4 border-t-transparent border-l-[#D4A5FF] border-r-transparent border-b-transparent rounded-full opacity-50"></div>
            </motion.div>
            <motion.p
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-[#B78FFF] text-sm mt-2 font-medium"
            >
              {inputMessage ? "Thinking deeply..." : "Scanning your PDF..."}
            </motion.p>
          </motion.div>
        )}
      </Box>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-[rgba(66,55,96,0.9)] rounded-xl p-6 shadow-lg border border-[rgba(156,85,255,0.2)] backdrop-blur-md"
        >
          <Upload className="w-12 h-12 text-[#B78FFF] mb-4 mx-auto drop-shadow-[0_0_8px_rgba(183,143,255,0.3)]" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Upload & Explore
          </h2>
          <p className="text-[#D4C8FF] text-sm">
            Drop your PDFs and let the magic begin.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-[rgba(66,55,96,0.9)] rounded-xl p-6 shadow-lg border border-[rgba(156,85,255,0.2)] backdrop-blur-md"
        >
          <Brain className="w-12 h-12 text-[#B78FFF] mb-4 mx-auto drop-shadow-[0_0_8px_rgba(183,143,255,0.3)]" />
          <h2 className="text-xl font-semibold text-white mb-2">AI Magic</h2>
          <p className="text-[#D4C8FF] text-sm">
            Flashcards crafted just for you.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-[rgba(66,55,96,0.9)] rounded-xl p-6 shadow-lg border border-[rgba(156,85,255,0.2)] backdrop-blur-md"
        >
          <BookOpen className="w-12 h-12 text-[#B78FFF] mb-4 mx-auto drop-shadow-[0_0_8px_rgba(183,143,255,0.3)]" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Learn Smarter
          </h2>
          <p className="text-[#D4C8FF] text-sm">Master anything, anytime.</p>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleDialogOpen}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #9C55FF 0%, #D4A5FF 100%)",
              borderRadius: 2,
              px: 5,
              py: 2,
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(156, 85, 255, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #8044FF 0%, #B78FFF 100%)",
              },
            }}
          >
            New Flashcard Set
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outlined"
            onClick={handleViewProgress}
            sx={{
              borderColor: "#9C55FF",
              color: "#EDE7FF",
              borderRadius: 2,
              px: 5,
              py: 2,
              fontWeight: "bold",
              "&:hover": {
                borderColor: "#B78FFF",
                background: "rgba(156, 85, 255, 0.1)",
              },
            }}
          >
            Track Progress
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
