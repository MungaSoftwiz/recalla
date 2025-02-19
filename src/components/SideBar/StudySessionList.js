import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StudySession = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "rgba(156, 85, 255, 0.1)",
  marginBottom: theme.spacing(1),
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(156, 85, 255, 0.2)",
  },
}));

export default function StudySessionList({ sessions }) {
  return (
    <AnimatePresence>
      {sessions.map((session) => (
        <StudySession
          key={session.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="subtitle1">{session.topic}</Typography>
            <Typography variant="caption">
              {new Date(session.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ width: "100%", mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={session.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(156, 85, 255, 0.2)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#9C55FF",
                },
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {session.completedCards} / {session.totalCards} cards completed
          </Typography>
        </StudySession>
      ))}
    </AnimatePresence>
  );
}