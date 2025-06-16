import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface ErrorMessageProps {
    error: Error | string | null;
    title?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, title }) => {
    if (!error) return null;

    const message = typeof error === 'string' ? error : error.message;

    return (
        <Alert severity="error" sx={{ mb: 2 }}>
            {title && <AlertTitle>{title}</AlertTitle>}
            {message}
        </Alert>
    );
};