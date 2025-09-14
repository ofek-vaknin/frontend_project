import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography
} from '@mui/material';

export default function CostList({ items, reportCurrency }) {
    if (!items || items.length === 0) {
        return <Typography color="text.secondary">No items yet.</Typography>;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Original</TableCell>
                        <TableCell>Converted ({reportCurrency})</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((c) => (
                        <TableRow key={c.id}>
                            <TableCell>
                                {c.date.year}-{String(c.date.month).padStart(2, '0')}-{String(c.date.day).padStart(2, '0')}
                            </TableCell>
                            <TableCell>{c.category}</TableCell>
                            <TableCell>{c.description || '—'}</TableCell>
                            <TableCell>{c.sum} {c.currency}</TableCell>
                            <TableCell>{c.converted?.toFixed(2) ?? '-'} {reportCurrency}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}