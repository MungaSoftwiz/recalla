import { motion } from 'framer-motion';
import { Paper, Typography, Box } from '@mui/material';

export default function FlashcardComponent({ card, isFlipped, onFlip }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Paper
        sx={{
          p: 3,
          mb: 2,
          cursor: "pointer",
          transform: isFlipped ? "rotateY(180deg)" : "none",
          transition: "transform 0.6s",
          transformStyle: "preserve-3d",
          position: "relative",
          background: "linear-gradient(135deg, rgba(156, 85, 255, 0.1) 0%, rgba(183, 143, 255, 0.1) 100%)",
        }}
        onClick={onFlip}
      >
        <Box sx={{ backfaceVisibility: "hidden", display: isFlipped ? "none" : "block" }}>
          <Typography variant="h6">{card.front}</Typography>
        </Box>
        <Box sx={{
          backfaceVisibility: "hidden",
          display: isFlipped ? "block" : "none",
          transform: "rotateY(180deg)",
        }}>
          <Typography variant="body1">{card.back}</Typography>
        </Box>
      </Paper>
    </motion.div>
  );
}
