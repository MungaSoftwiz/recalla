export const SHARED_STYLES = {
  gradients: {
    primary: "linear-gradient(135deg, #9C55FF 0%, #B78FFF 100%)",
    primaryHover: "linear-gradient(135deg, #8044FF 0%, #A67EFF 100%)",
    background: "linear-gradient(135deg, #1A0B2E 0%, #392064 100%)",
    cardBg:
      "linear-gradient(135deg, rgba(156, 85, 255, 0.1) 0%, rgba(183, 143, 255, 0.1) 100%)",
  },
  colors: {
    primary: "#9C55FF",
    secondary: "#B78FFF",
    background: "#1A1A2E",
  },
};

export const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgba(156, 85, 255, 0.3)" },
    "&:hover fieldset": { borderColor: "rgba(156, 85, 255, 0.5)" },
    "&.Mui-focused fieldset": { borderColor: SHARED_STYLES.colors.primary },
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiInputLabel-root": { color: SHARED_STYLES.colors.primary },
  "& .MuiInputLabel-root.Mui-focused": { color: SHARED_STYLES.colors.primary },
};

export const buttonStyles = {
  contained: {
    background: SHARED_STYLES.gradients.primary,
    "&:hover": {
      background: SHARED_STYLES.gradients.primaryHover,
    },
    "&.Mui-disabled": {
      background: "linear-gradient(135deg, #9C55FF50 0%, #B78FFF50 100%)",
    },
  },
  outlined: {
    borderColor: "rgba(156, 85, 255, 0.5)",
    color: SHARED_STYLES.colors.primary,
    "&:hover": {
      borderColor: SHARED_STYLES.colors.primary,
      backgroundColor: "rgba(156, 85, 255, 0.1)",
    },
  },
};

export const progressStyles = {
  "& .MuiLinearProgress-bar": {
    backgroundColor: SHARED_STYLES.colors.primary,
  },
};

export const rightNavBarStyles = {
  width: 256,
  flexShrink: 0,
  bgcolor: "rgba(42,36,56,0.9)",
  borderRight: "1px solid rgba(156,85,255,0.3)",
  mt: "64px",
  height: "calc(100vh - 64px)",
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
};

export const mainContentStyles = {
  root: {
    display: "flex",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    background: "linear-gradient(to bottom, #1F1A30, #2A2438, #3A2F50)",
  },
  main: {
    flexGrow: 1,
    mt: "64px",
    p: 0,
    overflowY: "auto",
    background: "transparent",
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
  },
};
