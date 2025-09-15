// CostList.jsx
// ----------------------------
// Displays a table of costs in the report.
// - Each row shows date, category, description, and original sum.
// - At the bottom a total row is displayed in the chosen report currency.
// ----------------------------

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';

/**
 * CostList Component
 * ----------------------------
 * @param {Array} items - Array of cost objects
 *   Each cost contains { sum, currency, category, description, date }
 * @param {Object} total - Object with total result { currency, total }
 * @returns {JSX.Element} - A table with all costs and total
 */
export default function CostList({ items, total }) {
    /* ---------------- Render: no items ---------------- */
    if (!items || items.length === 0) {
        return <Typography color="text.secondary">No items yet.</Typography>;
    }

    /* ---------------- Render: table ---------------- */
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Original</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* Render each cost row */}
                    {items.map((c) => (
                        <TableRow key={c.id}>
                            {/* Date cell */}
                            <TableCell>
                                {c.date.year}-
                                {String(c.date.month).padStart(2, '0')}-
                                {String(c.date.day).padStart(2, '0')}
                            </TableCell>

                            {/* Category cell */}
                            <TableCell>{c.category}</TableCell>

                            {/* Description cell */}
                            <TableCell>{c.description || '—'}</TableCell>

                            {/* Original sum cell */}
                            <TableCell>
                                {c.sum} {c.currency}
                            </TableCell>
                        </TableRow>
                    ))}

                    {/* Render total row */}
                    <TableRow>
                        <TableCell colSpan={3} align="right">
                            <strong>Total</strong>
                        </TableCell>
                        <TableCell>
                            <strong>
                                {total.total.toFixed(2)} {total.currency}
                            </strong>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
