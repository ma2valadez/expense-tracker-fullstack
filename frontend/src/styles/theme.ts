import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#4F46E5',
            light: '#6366F1',
            dark: '#4338CA',
        },
        secondary: {
            main: '#10B981',
            light: '#34D399',
            dark: '#059669',
        },
        error: {
            main: '#EF4444',
        },
        warning: {
            main: '#F59E0B',
        },
        info: {
            main: '#3B82F6',
        },
        success: {
            main: '#10B981',
        },
        background: {
            default: '#F3F4F6',
            paper: '#FFFFFF',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                fullWidth: true,
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                },
            },
        },
    },
});