import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Grid
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useExpenses } from '../hooks/useExpenses';
import { ExpenseForm } from '../components/expenses/ExpenseForm';
import { ExpenseList } from '../components/expenses/ExpenseList';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Expense, ExpenseFormData } from '../types';
import { formatCurrency } from '../utils/helpers';

export const Expenses: React.FC = () => {
    const {
        expenses,
        loading,
        error,
        totalAmount,
        createExpense,
        updateExpense,
        deleteExpense
    } = useExpenses();

    const [formOpen, setFormOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const handleAdd = () => {
        setEditingExpense(null);
        setFormOpen(true);
    };

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setFormOpen(true);
    };

    const handleFormSubmit = async (data: ExpenseFormData) => {
        try {
            if (editingExpense) {
                await updateExpense(editingExpense._id, data);
            } else {
                await createExpense(data);
            }
            setFormOpen(false);
            setEditingExpense(null);
        } catch (error) {
            console.error('Error saving expense:', error);
            // You might want to show an error message to the user here
        }
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setEditingExpense(null);
    };

    if (loading) return <LoadingSpinner fullScreen />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Expenses</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAdd}
                >
                    Add Expense
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Total Expenses
                        </Typography>
                        <Typography variant="h5">
                            {formatCurrency(totalAmount)}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Number of Expenses
                        </Typography>
                        <Typography variant="h5">
                            {expenses.length}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <ExpenseList
                expenses={expenses}
                onEdit={handleEdit}
                onDelete={deleteExpense}
            />

            <ExpenseForm
                open={formOpen}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                expense={editingExpense}
            />
        </Box>
    );
};