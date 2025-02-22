"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Paper, Typography, Box, IconButton, Tooltip } from "@mui/material";
import { ChevronLeft, ChevronRight, FlipHorizontal } from "lucide-react";

export default function FlashcardComponent({
  card,
  isFlipped,
  onFlip,
  onNext,
  onPrevious,
  currentIndex,
  totalCards,
}) {
  if (!card) return null;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 },
  };

  return (
    <Box sx={{ maxWidth: "900px", margin: "0 auto", py: 1 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {/* Card Container */}
          <Paper
            sx={{
              p: 4,
              height: "400px",
              width: "800px",
              position: "relative",
              borderRadius: 4,
              background: "linear-gradient(135deg, #9C55FF 0%, #B78FFF 100%)",
              boxShadow: "0 8px 32px rgba(156, 85, 255, 0.25)",
              overflow: "hidden",
              "&:hover": {
                boxShadow: "0 12px 48px rgba(156, 85, 255, 0.35)",
                transform: "translateY(-4px)",
              },
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onClick={onFlip}
          >
            {/* Front Side */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                transition: "transform 0.6s",
                transformStyle: "preserve-3d",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 4,
                opacity: isFlipped ? 0 : 1,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  textAlign: "center",
                  wordBreak: "break-word",
                }}
              >
                {card.front}
              </Typography>
            </Box>

            {/* Back Side */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                transform: isFlipped ? "rotateY(0)" : "rotateY(-180deg)",
                transition: "transform 0.6s",
                transformStyle: "preserve-3d",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 4,
                opacity: isFlipped ? 1 : 0,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "white",
                  fontWeight: 500,
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  textAlign: "center",
                  wordBreak: "break-word",
                  maxHeight: "100%",
                  overflowY: "auto",
                }}
              >
                {card.back}
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </AnimatePresence>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
          px: 1,
          height: "36px",
          width: "300px",
          margin: "0 auto",
        }}
      >
        <Tooltip title="Previous Card">
          <IconButton
            onClick={onPrevious}
            disabled={currentIndex === 0}
            sx={{
              background: "linear-gradient(135deg, #9C55FF 0%, #B78FFF 100%)",
              color: "white",
              p: 0.75,
              borderRadius: "50%",
              "&:hover": {
                background: "linear-gradient(135deg, #8044FF 0%, #A67EFF 100%)",
                transform: "scale(1.05)",
              },
              "&:disabled": {
                background: "#9C55FF50",
                color: "rgba(255,255,255,0.5)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ChevronLeft size={16} /> {/* Smaller icon */}
          </IconButton>
        </Tooltip>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: "white",
              fontWeight: 600,
              minWidth: "40px",
              textAlign: "center",
            }}
          >
            {currentIndex + 1}/{totalCards}
          </Typography>

          <Tooltip title="Flip Card">
            <IconButton
              onClick={onFlip}
              sx={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                p: 0.5,
                "&:hover": {
                  background: "rgba(255,255,255,0.25)",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <FlipHorizontal size={14} />
            </IconButton>
          </Tooltip>
        </Box>

        <Tooltip title="Next Card">
          <IconButton
            onClick={onNext}
            disabled={currentIndex === totalCards - 1}
            sx={{
              background: "linear-gradient(135deg, #9C55FF 0%, #B78FFF 100%)",
              color: "white",
              p: 0.75,
              borderRadius: "50%",
              "&:hover": {
                background: "linear-gradient(135deg, #8044FF 0%, #A67EFF 100%)",
                transform: "scale(1.05)",
              },
              "&:disabled": {
                background: "#9C55FF50",
                color: "rgba(255,255,255,0.5)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ChevronRight size={16} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
