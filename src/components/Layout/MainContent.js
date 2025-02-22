"use client";

import { styled } from "@mui/material/styles";

export const drawerWidth = 280;

export const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
    background: "rgba(42,36,56,0.9)",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "linear-gradient(135deg, #9C55FF 0%, #D4A5FF 100%)",
    borderRadius: "4px",
    "&:hover": {
      background: "linear-gradient(135deg, #8044FF 0%, #B78FFF 100%)",
    },
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(42,36,56,0.9)",
    borderRadius: "4px",
  },
  ...(open && {
    marginLeft: drawerWidth,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
