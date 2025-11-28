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
        backgroundColor: "#FFFEFE",
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
          color: "#4A6FDC",
          mb: -1, // Negative margin to pull logo closer
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
        src="/start.png"
        alt="Enfuna Logo"
        sx={{
          width: 500,
          height: 350,
          mb: 0, // No margin
          objectFit: "contain",
        }}
        onError={(e) => {
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
          color: "#FFFEFE",
          borderRadius: "50%",
          display: "none",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "3rem",
          fontWeight: "bold",
          mb: 0,
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
          backgroundColor: "#001B98",
          color: "#FFFFFF",
          paddingX: 6,
          paddingY: 1.5,
          fontSize: "1rem",
          fontWeight: "bold",
          borderRadius: 25,
          minWidth: 200,
          textTransform: 'none',
          boxShadow: '0 2px 8px rgba(0, 27, 152, 0.3)',
          marginTop: -0.5, // Negative margin to pull button closer to logo
          '&:hover': {
            backgroundColor: "#00157A",
            boxShadow: '0 4px 12px rgba(0, 27, 152, 0.4)',
          },
        }}
      >
        Get Started
      </Button>
    </Box>
  );
};

export default SplashScreen;