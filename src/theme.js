import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#4caf50' },   // ירוק מודרני
        secondary: { main: '#ff9800' }, // כתום
    },
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    maxWidth: '100% !important', // הרחבה על כל המסך
                    paddingLeft: '2rem',
                    paddingRight: '2rem',
                },
            },
        },
    },
})

export default theme
