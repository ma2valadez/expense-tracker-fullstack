import React from 'react';
import {
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Typography,
    Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../utils/constants';

interface ExpenseItemProps {
    expense: Expense;
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
}

export const ExpenseItem: React.FC<ExpenseItemProps> = ({
                                                            expense,
                                                            onEdit,
                                                            onDelete
                                                        }) => {
    return (
        <ListItem>
            <ListItemText
                primary={
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1">{expense.title}</Typography>
                        <Chip
                            label={expense.category}
                            size="small"
                            style={{
                                backgroundColor: CATEGORY_COLORS[expense.category],
                                color: 'white'
                            }}
                        />
                    </Box>
                }
                secondary={
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(expense.date)} • {formatCurrency(expense.amount)}
                        </Typography>
                        {expense.description && (
                            <Typography variant="body2" color="text.secondary">
                                {expense.description}
                            </Typography>
                        )}
                    </Box>
                }
            />
            <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => onEdit(expense)}>
                    <Edit />
                </IconButton>
                <IconButton edge="end" onClick={() => onDelete(expense._id)}>
                    <Delete />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};