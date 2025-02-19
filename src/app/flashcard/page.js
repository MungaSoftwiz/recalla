"use client";

import { useState, useEffect } from "react";
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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MenuIcon from "@mui/icons-material/Menu";
import SendIcon from "@mui/icons-material/Send";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "@/lib/supabase";
import ChatWindow from "@/components/Chat/ChatWindow";
import FlashcardComponent from "@/components/Flashcard/FlashcardComponent";
import StudySessionList from "@/components/SideBar/StudySessionList";
import { Main, drawerWidth } from "@/components/Layout/MainContent";
import { StyledBadge } from "@/components/common/StyledBadge";
import { uploadFile, updateSessionProgress } from "@/utils/flashcardUtils";

export default function FlashcardsLayout() {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessions, setSessions] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [totalCards, setTotalCards] = useState(0);
  const [completedCards, setCompletedCards] = useState(0);
  // const fileInputRef = useRef(null);
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

    fetchSessions();
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

      const createNewSession = async (topic) => {
        const newSession = {
          topic,
          created_at: new Date().toISOString(),
          progress: 0,
          total_cards: 0,
          completed_cards: 0,
        };
        return await saveSession(newSession);
      };

      const updateProgress = async (sessionId, completed, total) => {
        await updateSessionProgress(sessionId, completed, total);
        const { data } = await supabase
          .from("study_sessions")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) {
          setSessions(data);
        }
      };

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
    if (!file) return;

    setIsLoading(true);
    try {
      const fileUrl = await uploadFile(file);
      const response = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to process file");
      }

      const data = await response.json();
      setFlashcards(data);

      const newSession = await saveSession({
        topic: file.name.replace(".pdf", ""),
        created_at: new Date().toISOString(),
        progress: 0,
        total_cards: data.length,
        completed_cards: 0,
      });

      setSessions((prev) => [newSession, ...prev]);
      setTotalCards(data.length);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          text: `Error: ${err.message}`,
          sent: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    if (!e) return;
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages((prev) => [...prev, { text: inputMessage, sent: true }]);

      await generateFlashcards(inputMessage);
      setInputMessage("");
    }
  };

  const saveSession = async (newSession) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("study_sessions").insert({
      ...newSession,
      user_id: user.id,
    });

    if (error) {
      console.error("Error saving session:", error);
      return null;
    }

    return data;
  };

  const createStudySession = async (topic, pdfUrl) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
  
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          topic,
          pdf_url: pdfUrl,
          progress: 0,
          total_cards: 0,
          completed_cards: 0
        })
        .select()
        .single();
  
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating study session:', error);
      throw error;
    }
  };

  const updateStudyProgress = async (sessionId, completedCards) => {
    try {
      const { data: session, error: sessionError } = await supabase
        .from('study_sessions')
        .select('total_cards')
        .eq('id', sessionId)
        .single();
  
      if (sessionError) throw sessionError;
  
      const progress = Math.round((completedCards / session.total_cards) * 100);
  
      const { error } = await supabase
        .from('study_sessions')
        .update({
          progress,
          completed_cards: completedCards
        })
        .eq('id', sessionId);
  
      if (error) throw error;
    } catch (error) {
      console.error('Error updating study progress:', error);
      throw error;
    }
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

      {flashcards.length > 0 && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <FlashcardComponent
            card={flashcards[0]}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
          />
        </Paper>
      )}
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
          <StudySessionList sessions={sessions} />
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

      <ChatWindow
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        onSubmit={handleChatSubmit}
      />
    </Box>
  );
}
