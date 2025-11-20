// components/SplashScreen.jsx
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SplashScreen = () => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      {/* Replace with your actual logo - using a placeholder for now */}
      <Box
        component="img"
        src="/logo.png" // Path to your logo in public folder
        alt="Logo"
        sx={{
          width: 150,
          height: 150,
          mb: 3,
          borderRadius: 2,
          
          
        }}
        onError={(e) => {
          // Fallback if logo doesn't exist
          e.target.style.display = 'none';
        }}
      />
      
      {/* Fallback if logo doesn't load */}
    

      <Typography 
        variant="h4" 
        sx={{ 
          color: theme.palette.text.primary,
          fontWeight: "bold",
          mb: 1
        }}
      >
         Enfuna
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          color: theme.palette.text.secondary 
        }}
      >
        Loading...
      </Typography>

      {/* Optional: Loading spinner */}
      <Box
        sx={{
          width: 40,
          height: 40,
          border: `4px solid ${theme.palette.primary.light}`,
          borderTop: `4px solid ${theme.palette.primary.main}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          mt: 3,
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
    </Box>
  );
};

export default SplashScreen;