import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
    size?: number;
    fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                                  size = 40,
                                                                  fullScreen = false
                                                              }) => {
    if (fullScreen) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
            >
                <CircularProgress size={size} />
            </Box>
        );
    }

    return <CircularProgress size={size} />;
};