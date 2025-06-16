import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    TextField,
    Button,
    Box,
    CircularProgress,
} from '@mui/material';
import { LoginCredentials } from '../../types';
import { loginSchema } from '../../utils/validators';

interface LoginFormProps {
    onSubmit: (data: LoginCredentials) => Promise<void>;
    loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginCredentials>({
        resolver: yupResolver(loginSchema) as any,
        defaultValues: {
            email: '',
            password: '',
        },
    });

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit as any)} noValidate>
            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        margin="normal"
                        label="Email Address"
                        type="email"
                        autoComplete="email"
                        autoFocus
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                )}
            />

            <Controller
                name="password"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        margin="normal"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                )}
            />

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
        </Box>
    );
};