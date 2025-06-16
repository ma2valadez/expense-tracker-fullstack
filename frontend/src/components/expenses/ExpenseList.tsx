import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Box,
    Typography,
    TablePagination
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { Expense } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CATEGORY_COLORS } from '../../utils/constants';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface ExpenseListProps {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
                                                            expenses,
                                                            onEdit,
                                                            onDelete
                                                        }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        expenseId: string | null;
        expenseTitle: string;
    }>({
        open: false,
        expenseId: null,
        expenseTitle: ''
    });

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteClick = (expense: Expense) => {
        setDeleteDialog({
            open: true,
            expenseId: expense._id,
            expenseTitle: expense.title
        });
    };

    const handleDeleteConfirm = () => {
        if (deleteDialog.expenseId) {
            onDelete(deleteDialog.expenseId);
        }
        setDeleteDialog({ open: false, expenseId: null, expenseTitle: '' });
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ open: false, expenseId: null, expenseTitle: '' });
    };

    if (expenses.length === 0) {
        return (
            <Box
                sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 2,
                    backgroundColor: 'background.paper',
                    borderRadius: 1
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    No expenses found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Start by adding your first expense
                </Typography>
            </Box>
        );
    }

    const paginatedExpenses = expenses.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedExpenses.map((expense: Expense) => (
                            <TableRow key={expense._id} hover>
                                <TableCell>{formatDate(expense.date)}</TableCell>
                                <TableCell>{expense.title}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={expense.category}
                                        size="small"
                                        style={{
                                            backgroundColor: CATEGORY_COLORS[expense.category] ?? '#969696',
                                            color: 'white'
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    {formatCurrency(expense.amount)}
                                </TableCell>
                                <TableCell>{expense.description ?? '-'}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        onClick={() => onEdit(expense)}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteClick(expense)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={expenses.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <ConfirmDialog
                open={deleteDialog.open}
                title="Delete Expense"
                message={`Are you sure you want to delete "${deleteDialog.expenseTitle}"?`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </>
    );
};