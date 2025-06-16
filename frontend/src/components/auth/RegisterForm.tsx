import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    TextField,
    Button,
    Box,
    CircularProgress,
} from '@mui/material';
import { RegisterCredentials } from '../../types';
import { registerSchema } from '../../utils/validators';

interface RegisterFormProps {
    onSubmit: (data: RegisterCredentials) => Promise<void>;
    loading?: boolean;
}

interface RegisterFormData extends RegisterCredentials {
    confirmPassword: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema) as any,
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const handleFormSubmit = (data: RegisterFormData) => {
        const { confirmPassword, ...registerData } = data;
        return onSubmit(registerData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit as any)} noValidate>
            <Controller
                name="name"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        margin="normal"
                        label="Full Name"
                        autoComplete="name"
                        autoFocus
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />
                )}
            />

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
                        autoComplete="new-password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                )}
            />

            <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        margin="normal"
                        label="Confirm Password"
                        type="password"
                        autoComplete="new-password"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
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
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
        </Box>
    );
};