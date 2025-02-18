"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  Button,
  // List,
  // ListItem,
  // ListItemText,
  Drawer,
  TextField,
  Paper,
  // Container,
  IconButton as MuiIconButton,
  InputAdornment,
  // Collapse,
  LinearProgress,
  Badge,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";

const drawerWidth = 280;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      marginLeft: drawerWidth,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const ChatContainer = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  width: 350,
  maxHeight: 500,
  display: "flex",
  flexDirection: "column",
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  maxHeight: 350,
}));

const Message = styled(Box)(({ theme, sent }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  maxWidth: "80%",
  wordWrap: "break-word",
  ...(sent
    ? {
        marginLeft: "auto",
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }
    : {
        marginRight: "auto",
        background: theme.palette.background.default,
      }),
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

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

export default function FlashcardsLayout() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessions, setSessions] = useState([]);
  // const [currentProgress, setCurrentProgress] = useState(0);
  const [totalCards, setTotalCards] = useState(0);
  const [completedCards, setCompletedCards] = useState(0);
  // const fileInputRef = useRef(null);
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load saved sessions from localStorage
    const savedSessions = JSON.parse(
      localStorage.getItem("flashcardSessions") || "[]"
    );
    setSessions(savedSessions);
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const generateFlashcards = async (topic) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-host":
            "refactored-space-spork-qrxx66g95qrc9jp7-3000.app.github.dev",
        },
        body: JSON.stringify({ topic }),
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        throw new Error(errorData.error || "Failed to generate flashcards");
      }

      if (!contentType || !contentType.includes("application/json")) {
        const errorData = await response.text();
        console.error("Unexpected content type:", errorData);
        console.error("Response text:", errorData);
        throw new Error("Unexpected response format");
      }

      const data = await response.json();
      setFlashcards(data);

      const newSession = createNewSession(topic);
      // setTotalCards(data.length);
      updateProgress(newSession.id, 0, data.flashcards.length);

      // Add confirmation message to chat
      setMessages((prev) => [
        ...prev,
        {
          text: `Created ${data.length} flashcards for ${topic}. You can start studying now!`,
          sent: false,
        },
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error generating flashcards. Please try again.",
          sent: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      setIsLoading(true);
      try {
        // First, we need to extract text from PDF
        // You'll need to implement this API endpoint
        const textResponse = await fetch("/api/route", {
          method: "POST",
          body: formData,
        });

        // Log the response for debugging
        console.log("Response status:", textResponse.status);
        const responseText = await textResponse.text();
        console.log("Response text:", responseText);

        if (!textResponse.ok) {
          let errorMessage = "Failed to process PDF";
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
          } catch (err) {
            errorMessage = responseText;
          }
          throw new Error(errorMessage);
        }

        const data = await textResponse.json();
        setFlashcards(data);

        // Generate flashcards from the extracted text
        // await generateFlashcards(text);

        // Create a new session
        const newSession = createNewSession(file.name.replace(".pdf", ""));
        setTotalCards(data.length);
        updateProgress(newSession.id, 0, data.length);
      } catch (err) {
        setError(err.message);
        // Add error message to chat
        setMessages((prev) => [
          ...prev,
          {
            text: "Sorry, I had trouble processing your PDF. Please try again.",
            sent: false,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      // Add user message to chat first
      setMessages((prev) => [...prev, { text: inputMessage, sent: true }]);

      // Generate flashcards with the input message
      await generateFlashcards(inputMessage);

      // Clear input after processing
      setInputMessage("");
    }
  };

  const saveSession = (newSession) => {
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    localStorage.setItem("flashcardSessions", JSON.stringify(updatedSessions));
  };

  const createNewSession = (topic) => {
    const newSession = {
      id: Date.now(),
      topic,
      createdAt: new Date().toISOString(),
      progress: 0,
      totalCards: 0,
      completedCards: 0,
    };
    saveSession(newSession);
    return newSession;
  };

  const updateProgress = (sessionId, completed, total) => {
    const updatedSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        return {
          ...session,
          progress: (completed / total) * 100,
          completedCards: completed,
          totalCards: total,
        };
      }
      return session;
    });
    setSessions(updatedSessions);
    localStorage.setItem("flashcardSessions", JSON.stringify(updatedSessions));
  };

  // Update the Main content to display flashcards
  const renderMainContent = () => (
    <Box sx={{ p: 3 }}>
      {isLoading && (
        <LinearProgress
          sx={{
            mb: 2,
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#9C55FF",
            },
          }}
        />
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <AnimatePresence>
        {flashcards.map((card, index) => (
          <motion.div
            key={index}
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
                background:
                  "linear-gradient(135deg, rgba(156, 85, 255, 0.1) 0%, rgba(183, 143, 255, 0.1) 100%)",
              }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <Box
                sx={{
                  backfaceVisibility: "hidden",
                  display: isFlipped ? "none" : "block",
                }}
              >
                <Typography variant="h6">{card.front}</Typography>
              </Box>
              <Box
                sx={{
                  backfaceVisibility: "hidden",
                  display: isFlipped ? "block" : "none",
                  transform: "rotateY(180deg)",
                }}
              >
                <Typography variant="body1">{card.back}</Typography>
              </Box>
            </Paper>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(135deg, #1A0B2E 0%, #392064 100%)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton color="inherit" onClick={handleDrawerToggle} edge="start">
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 1 }}
          >
            <AutoAwesomeIcon sx={{ color: "#9C55FF" }} />
            Recalla AI
          </Typography>
          <Button
            variant="contained"
            onClick={() => setChatOpen(true)}
            sx={{
              mr: 2,
              background: "linear-gradient(135deg, #9C55FF 0%, #B78FFF 100%)",
            }}
          >
            New Set
          </Button>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                cursor: "pointer",
                background: "linear-gradient(135deg, #9C55FF 0%, #B78FFF 100%)",
              }}
              src="/avatar-placeholder.png"
            />
          </StyledBadge>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: "#1A0B2E",
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<UploadFileIcon />}
            fullWidth
            sx={{
              mb: 3,
              background: "linear-gradient(135deg, #9C55FF 0%, #B78FFF 100%)",
            }}
          >
            Upload PDF
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={handleFileUpload}
            />
          </Button>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Study Sessions
          </Typography>

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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
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
                  {session.completedCards} / {session.totalCards} cards
                  completed
                </Typography>
              </StudySession>
            ))}
          </AnimatePresence>
        </Box>
      </Drawer>

      <Main open={drawerOpen}>
        <Toolbar />
        {renderMainContent()}
        <Box sx={{ position: "fixed", top: 70, right: 24, zIndex: 1000 }}>
          <Tooltip title={`${completedCards} of ${totalCards} cards completed`}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                sx={{ color: "#9C55FF", fontWeight: "bold" }}
              >
                {totalCards > 0
                  ? Math.round((completedCards / totalCards) * 100)
                  : 0}
                %
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Progress
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Main>

      {chatOpen && (
        <ChatContainer>
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1">AI Assistant</Typography>
            <IconButton size="small" onClick={() => setChatOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <ChatMessages>
            {messages.map((message, index) => (
              <Message key={index} sent={message.sent}>
                {message.text}
              </Message>
            ))}
          </ChatMessages>

          <Box component="form" onSubmit={handleChatSubmit} sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="What would you like to learn?"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" edge="end">
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </ChatContainer>
      )}
    </Box>
  );
}
