import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    Divider
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/auth.service';

export const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleUpdateProfile = async () => {
        try {
            const updatedUser = await authService.updateProfile({ name, email });
            updateUser(updatedUser);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setEditing(false);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        }
    };

    const handleUpdatePassword = async () => {
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        try {
            await authService.updatePassword(currentPassword, newPassword);
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update password' });
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>

            {message && (
                <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
                    {message.text}
                </Alert>
            )}

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Personal Information
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!editing}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!editing}
                        sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {editing ? (
                            <>
                                <Button variant="contained" onClick={handleUpdateProfile}>
                                    Save Changes
                                </Button>
                                <Button variant="outlined" onClick={() => setEditing(false)}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button variant="contained" onClick={() => setEditing(true)}>
                                Edit Profile
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Change Password
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        type="password"
                        label="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleUpdatePassword}
                        disabled={!currentPassword || !newPassword || !confirmPassword}
                    >
                        Update Password
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};