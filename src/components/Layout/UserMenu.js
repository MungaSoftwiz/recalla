"use client";

import { SHARED_STYLES } from "@/styles/theme";
import { StyledBadge } from "@/components/common/StyledBadge";
import { Avatar, Menu, MenuItem } from "@mui/material";

export function UserMenu({ anchorEl, setAnchorEl, onSignOut }) {
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
      >
        <Avatar
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            cursor: "pointer",
            background: SHARED_STYLES.gradients.primary,
          }}
          src="/avatar-placeholder.png"
        />
      </StyledBadge>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={onSignOut}>Sign out</MenuItem>
      </Menu>
    </>
  );
}
