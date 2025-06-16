import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Header onMenuClick={isMobile ? handleDrawerToggle : undefined} />
            <Sidebar
                open={isMobile ? mobileOpen : true}
                variant={isMobile ? 'temporary' : 'permanent'}
                onClose={handleDrawerToggle}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - 240px)` },
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};