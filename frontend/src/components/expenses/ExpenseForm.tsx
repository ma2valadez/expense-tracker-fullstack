import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    InputAdornment,
    SelectChangeEvent
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Expense, ExpenseFormData, ExpenseCategory } from '../../types';
import { expenseSchema } from '../../utils/validators';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import { formatDateForInput } from '../../utils/helpers';

interface ExpenseFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ExpenseFormData) => Promise<void>;
    expense?: Expense | null;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
                                                            open,
                                                            onClose,
                                                            onSubmit,
                                                            expense
                                                        }) => {
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<ExpenseFormData>({
        resolver: yupResolver(expenseSchema) as any,
        defaultValues: {
            title: '',
            amount: 0,
            category: 'Other' as ExpenseCategory,
            description: '',
            date: formatDateForInput(new Date()),
            isRecurring: false,
            tags: []
        }
    });

    useEffect(() => {
        if (expense) {
            reset({
                title: expense.title,
                amount: expense.amount,
                category: expense.category,
                description: expense.description ?? '',
                date: formatDateForInput(expense.date),
                isRecurring: expense.isRecurring,
                recurringInterval: expense.recurringInterval,
                tags: expense.tags ?? []
            });
        } else {
            reset({
                title: '',
                amount: 0,
                category: 'Other' as ExpenseCategory,
                description: '',
                date: formatDateForInput(new Date()),
                isRecurring: false,
                tags: []
            });
        }
    }, [expense, reset]);

    const handleFormSubmit = async (data: ExpenseFormData) => {
        setLoading(true);
        try {
            await onSubmit(data);
            onClose();
        } catch (error) {
            console.error('Error submitting expense:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit(handleFormSubmit as any)}>
                <DialogTitle>
                    {expense ? 'Edit Expense' : 'Add New Expense'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Title"
                                    fullWidth
                                    error={!!errors.title}
                                    helperText={errors.title?.message ?? ''}
                                />
                            )}
                        />

                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Amount"
                                    type="number"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                                    }}
                                    error={!!errors.amount}
                                    helperText={errors.amount?.message ?? ''}
                                    inputProps={{ step: 0.01, min: 0 }}
                                />
                            )}
                        />

                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.category}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        {...field}
                                        label="Category"
                                        value={field.value}
                                        onChange={(e: SelectChangeEvent) => field.onChange(e.target.value)}
                                    >
                                        {EXPENSE_CATEGORIES.map((cat) => (
                                            <MenuItem key={cat} value={cat}>
                                                {cat}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />

                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Date"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.date}
                                    helperText={errors.date?.message ?? ''}
                                />
                            )}
                        />

                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description (Optional)"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    error={!!errors.description}
                                    helperText={errors.description?.message ?? ''}
                                />
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Saving...' : expense ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};