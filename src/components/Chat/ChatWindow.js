import { useState } from 'react';
import { Box, TextField, IconButton, InputAdornment, Typography, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

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

export default function ChatWindow({ open, onClose, messages, onSubmit }) {
  const [inputMessage, setInputMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSubmit(inputMessage);
      setInputMessage("");
    }
  };

  if (!open) return null;

  return (
    <ChatContainer>
      <Box sx={{
        p: 2,
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <Typography variant="subtitle1">AI Assistant</Typography>
        <IconButton size="small" onClick={onClose}>
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

      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
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
  );
}