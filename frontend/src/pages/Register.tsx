// frontend/src/pages/Register.tsx
import React, { useState, useRef } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Box,
    Typography,
    Link,
    Alert,
} from '@mui/material';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import { RegisterCredentials } from '../types';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const isSubmittingRef = useRef(false);

    const handleRegister = async (data: RegisterCredentials) => {
        // Prevent double submission
        if (isSubmittingRef.current || loading) {
            console.log('Registration already in progress');
            return;
        }

        isSubmittingRef.current = true;
        setError(null);
        setLoading(true);

        try {
            console.log('Starting registration for:', data.email);
            await register(data);
            console.log('Registration successful, navigating to dashboard');
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Failed to register');
        } finally {
            setLoading(false);
            isSubmittingRef.current = false;
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
                        Sign Up
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <RegisterForm onSubmit={handleRegister} loading={loading} />

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Link component={RouterLink} to="/login" variant="body2">
                            Already have an account? Sign In
                        </Link>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};