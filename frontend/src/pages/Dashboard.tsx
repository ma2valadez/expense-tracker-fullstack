import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import {
    Add as AddIcon,
    TrendingUp,
    Receipt,
    AccountBalance,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency, getCurrentMonthRange } from '../utils/helpers';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { start, end } = getCurrentMonthRange();

    const { expenses, totalAmount, loading, error } = useExpenses({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
    });

    if (loading) return <LoadingSpinner fullScreen />;
    if (error) return <ErrorMessage error={error} />;

    const stats = [
        {
            title: 'Total Expenses',
            value: formatCurrency(totalAmount),
            icon: <AccountBalance />,
            color: '#4F46E5',
        },
        {
            title: 'Number of Expenses',
            value: expenses.length.toString(),
            icon: <Receipt />,
            color: '#10B981',
        },
        {
            title: 'Average Expense',
            value: formatCurrency(expenses.length > 0 ? totalAmount / expenses.length : 0),
            icon: <TrendingUp />,
            color: '#F59E0B',
        },
    ];

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">
                    Welcome back, {user?.name}!
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/expenses')}
                >
                    Add Expense
                </Button>
            </Box>

            <Grid container spacing={3}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardContent>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Box
                                        sx={{
                                            backgroundColor: stat.color,
                                            color: 'white',
                                            p: 1,
                                            borderRadius: 2,
                                            mr: 2,
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                    <Typography color="textSecondary" variant="body2">
                                        {stat.title}
                                    </Typography>
                                </Box>
                                <Typography variant="h5" component="div">
                                    {stat.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Expenses
                        </Typography>
                        {expenses.length === 0 ? (
                            <Typography color="textSecondary">
                                No expenses found for this month. Start by adding your first expense!
                            </Typography>
                        ) : (
                            <Typography>
                                You have {expenses.length} expenses this month totaling {formatCurrency(totalAmount)}.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};