// components/SplashScreen.jsx
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SplashScreen = ({ onGetStarted }) => {
  const theme = useTheme();
  
  const handleGetStarted = () => {
    // Call the parent component's function to proceed
    if (onGetStarted) {
      onGetStarted();
    }
  };
  
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#FFFEFE", // Specific background color
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: 3,
      }}
    >
      {/* Welcome text */}
      <Typography 
        variant="h6" 
        sx={{ 
          color: "#4A6FDC", // Light dark blue color
          mb: 4,
          textAlign: "center",
          fontWeight: "normal",
          fontSize: "1.25rem",
        }}
      >
        WELCOME TO,
      </Typography>
      
      {/* Logo image */}
      <Box
        component="img"
        src="/logo.png" // Path to your logo in public folder
        alt="Enfuna Logo"
        sx={{
          width: 150,
          height: 150,
          mb: 3,
          objectFit: "contain",
        }}
        onError={(e) => {
          // Fallback if logo doesn't exist - show placeholder
          e.target.style.display = 'none';
          const fallback = document.getElementById('logo-fallback');
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      
      {/* Fallback if logo doesn't load */}
      <Box
        id="logo-fallback"
        sx={{
          width: 120,
          height: 120,
          backgroundColor: theme.palette.primary.main,
          color: "#FFFEFE", // Match background color for text
          borderRadius: "50%",
          display: "none", // Hidden by default, shown only if logo fails to load
          justifyContent: "center",
          alignItems: "center",
          fontSize: "3rem",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        E
      </Box>

      {/* Get Started Button */}
      <Button
        variant="contained"
        size="large"
        onClick={handleGetStarted}
        sx={{
          backgroundColor: "#001B98", // Specific blue color for button
          color: "#FFFFFF",
          paddingX: 4,
          paddingY: 1.5,
          fontSize: "1.1rem",
          fontWeight: "bold",
          borderRadius: 2,
          minWidth: 100,
          mt: 4,
          '&:hover': {
            backgroundColor: "#00157A", // Darker shade for hover
          },
        }}
      >
        Get Started
      </Button>
    </Box>
  );
};

export default SplashScreen;