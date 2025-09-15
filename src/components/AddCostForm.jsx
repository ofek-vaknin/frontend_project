// AddCostForm.jsx
// ----------------------------
// A controlled form component for adding new cost items.
// Validates inputs (sum, currency, category, description)
// and stores the item in IndexedDB.
// ----------------------------

import React, { useState } from 'react';
import {
    Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography, Snackbar, Alert
} from '@mui/material';
import { addCost } from '../services/idb.module';

// ---------- Constants ----------
const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO']; // Supported currencies
const CATEGORIES = ['Food', 'Car', 'Education', 'Home', 'Health', 'Leisure', 'Other']; // Supported categories

/**
 * AddCostForm Component
 * ----------------------------
 * Renders a form to add new costs.
 * @param {Function} onAdded - Callback after a cost is successfully added.
 */
export default function AddCostForm({ onAdded }) {
    /* ---------------- State ---------------- */
    const [form, setForm] = useState({ sum: '', currency: 'USD', category: 'Food', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    /**
     * handleChange
     * ----------------------------
     * Updates form state when input fields change.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    /**
     * handleSubmit
     * ----------------------------
     * Validates form inputs and submits new cost to IndexedDB.
     * Displays success or error feedback.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate sum input
        if (!form.sum || Number.isNaN(Number(form.sum)) || Number(form.sum) <= 0) {
            setError('Sum must be a positive number');
            return;
        }

        // Validate currency
        if (!CURRENCIES.includes(form.currency)) {
            setError('Currency must be one of USD, ILS, GBP, EURO');
            return;
        }

        // Validate category
        if (!CATEGORIES.includes(form.category)) {
            setError('Category is invalid');
            return;
        }

        // Validate description (required field)
        if (!form.description.trim()) {
            setError('Description is required');
            return;
        }

        setLoading(true);
        try {
            await addCost({
                sum: Number(form.sum),
                currency: form.currency,
                category: form.category,
                description: form.description.trim(),
            });

            // Reset form after success
            setForm({ sum: '', currency: 'USD', category: 'Food', description: '' });
            onAdded?.();
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Failed to add cost, please try again.');
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- JSX ---------------- */
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Add New Cost</Typography>

                {/* Form fields */}
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        {/* Sum field */}
                        <TextField
                            label="Sum"
                            name="sum"
                            type="number"
                            fullWidth
                            value={form.sum}
                            onChange={handleChange}
                            required
                        />

                        {/* Currency selector */}
                        <TextField
                            label="Currency"
                            name="currency"
                            select
                            fullWidth
                            value={form.currency}
                            onChange={handleChange}
                        >
                            {CURRENCIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </TextField>

                        {/* Category selector */}
                        <TextField
                            label="Category"
                            name="category"
                            select
                            fullWidth
                            value={form.category}
                            onChange={handleChange}
                        >
                            {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </TextField>

                        {/* Description (required) */}
                        <TextField
                            label="Description"
                            name="description"
                            fullWidth
                            value={form.description}
                            onChange={handleChange}
                            required
                        />
                    </Stack>

                    {/* Submit button */}
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit" disabled={loading}>Add Cost</Button>
                    </Box>
                </Box>

                {/* Error message */}
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

                {/* Success Snackbar */}
                <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
                    <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                        Cost added successfully!
                    </Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
}
