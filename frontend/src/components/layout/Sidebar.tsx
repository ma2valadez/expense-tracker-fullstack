import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
} from '@mui/material';
import {
    Dashboard,
    Receipt,
    BarChart,
    Person,
} from '@mui/icons-material';

const drawerWidth = 240;

interface SidebarProps {
    open?: boolean;
    variant?: 'permanent' | 'persistent' | 'temporary';
    onClose?: () => void;
}

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Expenses', icon: <Receipt />, path: '/expenses' },
    { text: 'Statistics', icon: <BarChart />, path: '/statistics' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
];

export const Sidebar: React.FC<SidebarProps> = ({
                                                    open = true,
                                                    variant = 'permanent',
                                                    onClose
                                                }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (path: string) => {
        navigate(path);
        if (onClose) onClose();
    };

    return (
        <Drawer
            variant={variant}
            open={open}
            onClose={onClose}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => handleNavigate(item.path)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};