// src/components/AddCostForm.jsx
import React, { useState } from 'react';
import {
    Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography, Snackbar, Alert
} from '@mui/material';
import { addCost } from '../services/idb.module';

const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO'];
const CATEGORIES = ['Food', 'Car', 'Education', 'Home', 'Health', 'Leisure', 'Other'];

export default function AddCostForm({ onAdded }) {
    const [form, setForm] = useState({ sum: '', currency: 'USD', category: 'Food', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); // ✅ state חדש להצלחה

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.sum || Number.isNaN(Number(form.sum)) || Number(form.sum) <= 0) {
            setError('Sum must be a positive number');
            return;
        }
        if (!CURRENCIES.includes(form.currency)) {
            setError('Currency must be one of USD, ILS, GBP, EURO');
            return;
        }
        if (!CATEGORIES.includes(form.category)) {
            setError('Category is invalid');
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
            setForm({ sum: '', currency: 'USD', category: 'Food', description: '' });
            onAdded?.();
            setSuccess(true); // ✅ מפעיל הודעת הצלחה
        } catch (err) {
            console.error(err);
            setError('Failed to add cost, please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Add New Cost</Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField label="Sum" name="sum" type="number" fullWidth value={form.sum} onChange={handleChange} required />
                        <TextField label="Currency" name="currency" select fullWidth value={form.currency} onChange={handleChange}>
                            {CURRENCIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </TextField>
                        <TextField label="Category" name="category" select fullWidth value={form.category} onChange={handleChange}>
                            {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </TextField>
                        <TextField label="Description" name="description" fullWidth value={form.description} onChange={handleChange} />
                    </Stack>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit" disabled={loading}>Add Cost</Button>
                    </Box>
                </Box>
                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

                {/* ✅ הודעת הצלחה */}
                <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
                    <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                        Cost added successfully!
                    </Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
}
