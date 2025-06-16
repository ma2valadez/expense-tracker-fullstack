import React from 'react';
import {
    Paper,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    useTheme
} from '@mui/material';
import { ExpenseStats as ExpenseStatsType, CategoryStats, MonthlyStats } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { MONTHS } from '../../utils/constants';

interface ExpenseStatsProps {
    stats: ExpenseStatsType;
}

export const ExpenseStats: React.FC<ExpenseStatsProps> = ({ stats }) => {
    const theme = useTheme();

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                    Expense Statistics
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2}>
                    {stats.categoryStats.map((stat: CategoryStats) => (
                        <Grid item xs={12} sm={6} md={3} key={stat.category}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        {stat.category}
                                    </Typography>
                                    <Typography variant="h5">
                                        {formatCurrency(stat.totalAmount)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {stat.count} transactions
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Avg: {formatCurrency(stat.avgAmount)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Monthly Breakdown
                    </Typography>
                    <Grid container spacing={2}>
                        {stats.monthlyStats.map((stat: MonthlyStats) => (
                            <Grid item xs={12} sm={6} md={4} key={`${stat.year}-${stat.month}`}>
                                <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        {MONTHS[stat.month - 1]} {stat.year}
                                    </Typography>
                                    <Typography variant="h6">
                                        {formatCurrency(stat.totalAmount)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {stat.count} expenses
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
};