// src/theme.js
import { createTheme } from "@mui/material/styles";

/**
 * Custom Material-UI theme for the application.
 * Defines color palette and component overrides.
 */
const theme = createTheme({
    palette: {
        mode: "light", // Light mode theme
        primary: { main: "#4caf50" }, // Green (modern look)
        secondary: { main: "#ff9800" }, // Orange
    },
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    // Extend container to full width
                    maxWidth: "100% !important",
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                },
            },
        },
    },
});

export default theme;
