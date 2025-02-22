"use client";

import React, { useState, useCallback } from "react";
import {
  SHARED_STYLES,
  textFieldStyles,
  buttonStyles,
  progressStyles,
} from "@/styles/theme";
import { motion } from "framer-motion";
import {
  Typography,
  Paper,
  TextField,
  Box,
  Button,
  LinearProgress,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  uploadAndGenerateFlashcards,
  generateFlashcardsFromChat,
} from "@/utils/flashcardUtils";
import { useRouter } from "next/navigation";

export function FlashcardGenerator({ onFlashcardsGenerated, onError }) {
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!file && !topic.trim()) return;

      setIsLoading(true);
      setError(null);
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

        if (!session) {
          throw new Error("Please log in to generate flashcards");
        }

        if (file) {
          const { flashcards, sessionId } = await uploadAndGenerateFlashcards(
            file,
            session.access_token
          );
          onFlashcardsGenerated(flashcards, sessionId);
          router.push(`/flashcards/study?sessionId=${sessionId}`);
        } else if (topic.trim()) {
          const { flashcards, sessionId } = await generateFlashcardsFromChat(
            topic.trim(),
            session.access_token
          );
          onFlashcardsGenerated(flashcards, sessionId);
          router.push(`/flashcards/study?sessionId=${sessionId}`);
        }
      } catch (err) {
        setError(err.message);
        onError?.(err.message);
        console.log("Error generating flashcards: ", err);
      } finally {
        setIsLoading(false);
      }
    },
    [file, topic, onFlashcardsGenerated, onError, router]
  );

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setTopic("");
      setError(null);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  // return (
  //   <motion.div
  //     initial={{ opacity: 0, y: 20 }}
  //     animate={{ opacity: 1, y: 0 }}
  //     exit={{ opacity: 0, y: -20 }}
  //   >
  //     <Paper
  //       sx={{
  //         p: 3,
  //         background: SHARED_STYLES.gradients.cardBg,
  //         borderRadius: 2,
  //       }}
  //     >

  //       <form onSubmit={handleSubmit}>
  //         <Box sx={{ mb: 3 }}>
  //           <Typography
  //             variant="h6"
  //             sx={{
  //               display: "flex",
  //               alignItems: "center",
  //               gap: 1,
  //               mb: 2,
  //               color: "white",
  //             }}
  //           >
  //             <AutoAwesomeIcon sx={{ color: SHARED_STYLES.colors.primary }} />
  //             Generate Flashcards
  //           </Typography>
  //           <TextField
  //             fullWidth
  //             value={topic}
  //             onChange={handleTopicChange}
  //             placeholder="Enter a topic for flashcard generation"
  //             disabled={isLoading || !!file}
  //             sx={textFieldStyles}
  //           />
  //         </Box>

  //         <Button
  //           component="label"
  //           variant="outlined"
  //           startIcon={
  //             <UploadFileIcon sx={{ color: SHARED_STYLES.colors.primary }} />
  //           }
  //           fullWidth
  //           disabled={isLoading || !!topic}
  //           sx={buttonStyles.outlined}
  //         >
  //           Upload PDF
  //           <input
  //             type="file"
  //             hidden
  //             accept=".pdf"
  //             onChange={handleFileChange}
  //             disabled={isLoading || !!topic}
  //           />
  //         </Button>

  //         <Button
  //           type="submit"
  //           fullWidth
  //           variant="contained"
  //           disabled={isLoading || (!topic && !file)}
  //           sx={buttonStyles.contained}
  //         >
  //           {isLoading ? "Generating..." : "Generate Flashcards"}
  //         </Button>

  //         {/* ... Progress bar ... */}
  //         {isLoading && <LinearProgress sx={progressStyles} />}
  //       </form>
  //     </Paper>
  //   </motion.div>
  // );
}
