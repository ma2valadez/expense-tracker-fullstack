import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Paper,
    Box,
    Typography,
    Link,
    Alert,
} from '@mui/material';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials } from '../types';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const handleLogin = async (data: LoginCredentials) => {
        setError(null);
        setLoading(true);

        try {
            await login(data);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center">
                        Sign In
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <LoginForm onSubmit={handleLogin} loading={loading} />

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link component={RouterLink} to="/register" variant="body2">
                            Don't have an account? Sign Up
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};