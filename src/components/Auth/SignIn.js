"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Typography, Box, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { Sparkles, Loader } from "lucide-react";
import { useAuth } from "./hooks/useAuth";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, signIn } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(email, password);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(to right, #1F1A30 50%, #3A2F50 50%)",
      }}
    >
      {/* Sign In Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: "#2A2438",
            padding: 4,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Sparkles className="w-12 h-12 text-[#B78FFF] mx-auto mb-4 drop-shadow-[0_0_12px_rgba(156,85,255,0.5)]" />
            <Typography
              variant="h4"
              sx={{
                color: "#EDE7FF",
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(156,85,255,0.3)",
              }}
            >
              Welcome Back!
            </Typography>
            <Typography sx={{ color: "#D4C8FF", mt: 1, fontSize: "1.1rem" }}>
              Sign in to continue your learning adventure.
            </Typography>
          </Box>

          <TextField
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              style: { color: "#EDE7FF" },
            }}
            InputLabelProps={{
              style: { color: "#B78FFF" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "rgba(156,85,255,0.05)",
                borderColor: "rgba(156,85,255,0.3)",
                "&:hover fieldset": { borderColor: "#B78FFF" },
                "&.Mui-focused fieldset": { borderColor: "#9C55FF" },
              },
            }}
            disabled={loading}
          />
          <TextField
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              style: { color: "#EDE7FF" },
            }}
            InputLabelProps={{
              style: { color: "#B78FFF" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "rgba(156,85,255,0.05)",
                borderColor: "rgba(156,85,255,0.3)",
                "&:hover fieldset": { borderColor: "#B78FFF" },
                "&.Mui-focused fieldset": { borderColor: "#9C55FF" },
              },
            }}
            disabled={loading}
          />
          {error && (
            <Typography
              sx={{ color: "#FF6B6B", textAlign: "center", fontSize: "0.9rem", mt: 2 }}
            >
              {error}
            </Typography>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              disabled={loading}
              fullWidth
              sx={{
                mt: 3,
                background: "linear-gradient(135deg, #9C55FF 0%, #D4A5FF 100%)",
                color: "#EDE7FF",
                borderRadius: 2,
                py: 1.5,
                fontWeight: "bold",
                boxShadow: "0 4px 12px rgba(156,85,255,0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #8044FF 0%, #B78FFF 100%)",
                  boxShadow: "0 6px 16px rgba(156,85,255,0.5)",
                },
                "&:disabled": { bgcolor: "#423760", cursor: "not-allowed" },
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex items-center"
                >
                  <Loader className="w-5 h-5 mr-2 text-[#EDE7FF]" />
                  Signing in...
                </motion.div>
              ) : (
                "Log In"
              )}
            </Button>
          </motion.div>
          <Typography sx={{ textAlign: "center", color: "#D4C8FF", mt: 4, fontSize: "0.9rem" }}>
            Don’t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-[#B78FFF] hover:text-[#D4A5FF] transition-colors duration-200"
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Right Side Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          backgroundColor: "#3A2F50",
          color: "#EDE7FF",
          textAlign: "center",
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }}>
            Join Our Community
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Discover new opportunities and expand your knowledge with us.
          </Typography>
          <Typography>
            &quot;The beautiful thing about learning is that nobody can take it away from you.&quot; - B.B. King
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
