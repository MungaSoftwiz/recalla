"use client";

import { SHARED_STYLES, buttonStyles } from "@/styles/theme";
import { UserMenu } from "./UserMenu";
import { Typography, Button } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { AppBar as MuiAppBar, Toolbar, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AppBar({ onLogoClick, onSignOut }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const handleSignOutLocal = () => {
    supabase.auth.signOut().then(() => {
      onSignOut?.();
      handleMenuClose();
      router.push("/");
    });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        background: SHARED_STYLES.gradients.background,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={onLogoClick}
          edge="start"
          sx={{ mr: 2 }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <AutoAwesomeIcon sx={{ color: SHARED_STYLES.colors.primary }} />
          </motion.div>
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "white",
          }}
        >
          Recalla AI
        </Typography>

        <Button
          variant="contained"
          onClick={() => router.push("/flashcards")}
          sx={buttonStyles.contained}
        >
          Back to Home
        </Button>

        <UserMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          onSignOut={handleSignOutLocal}
        />
      </Toolbar>
    </MuiAppBar>
  );
}
