import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        greenAccent: {
          100: "#fffbd6",
          200: "#fff7ae",
          300: "#fff386",
          400: "#ffee5e",
          500: "#ffeb01",
          600: "#d1bc00",
          700: "#a38e00",
          800: "#756000",
          900: "#473200"
        },
        redAccent: {
          100: "#f8dcdb",
          200: "#f1b9b7",
          300: "#e99592",
          400: "#e2726e",
          500: "#db4f4a",
          600: "#af3f3b",
          700: "#832f2c",
          800: "#58201e",
          900: "#2c100f",
        },
        blueAccent: {
          100: "#e1e2fe",
          200: "#c3c6fd",
          300: "#a4a9fc",
          400: "#868dfb",
          500: "#6870fa",
          600: "#535ac8",
          700: "#3e4396",
          800: "#2a2d64",
          900: "#151632",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#040509",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0", // manually changed
          500: "#141b2d",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        greenAccent: {
          100: "#d6ccf5",
          200: "#ae99eb",
          300: "#8666e2",
          400: "#5e33d8",
          500: "#3700bd",
          600: "#4a22c4",
          700: "#5e44cb",
          800: "#725ed2",
          900: "#8679d9"
        },
        redAccent: {
          100: "#2c100f",
          200: "#58201e",
          300: "#832f2c",
          400: "#af3f3b",
          500: "#db4f4a",
          600: "#e2726e",
          700: "#e99592",
          800: "#f1b9b7",
          900: "#f8dcdb",
        },
        blueAccent: {
          100: "#151632",
          200: "#2a2d64",
          300: "#3e4396",
          400: "#535ac8",
          500: "#6870fa",
          600: "#868dfb",
          700: "#a4a9fc",
          800: "#c3c6fd",
          900: "#e1e2fe",
        },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.greenAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fcfcfc",
            },
          }),
    },
    typography: {
      fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      fontSize: 12,
      h1: {
        fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        fontSize: 40,
        fontWeight: 600,
      },
      h2: {
        fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        fontSize: 32,
        fontWeight: 600,
      },
      h3: {
        fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        fontSize: 24,
        fontWeight: 600,
      },
      h4: {
        fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        fontSize: 20,
        fontWeight: 600,
      },
      h5: {
        fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        fontSize: 16,
        fontWeight: 500,
      },
      h6: {
        fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        fontSize: 14,
        fontWeight: 500,
      },
      body1: {
        fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        fontSize: 14,
      },
      body2: {
        fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        fontSize: 12,
      },
      button: {
        fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        fontWeight: 500,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  // Light mode loads first
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};