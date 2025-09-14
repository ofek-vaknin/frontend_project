import React, { useState } from 'react';
import { Box, Button, Stack, TextField, Typography, Paper } from '@mui/material';
import { fetchRates, setRatesURL, getRatesURL } from '../services/exchangeRates';

export default function SettingsView() {
    const [url, setUrl] = useState(getRatesURL());
    const [rates, setRates] = useState(null);
    const [error, setError] = useState(null);

    const handleSave = async () => {
        try {
            setRatesURL(url);
            const data = await fetchRates();
            setRates(data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch rates. Please check the URL.');
            setRates(null);
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h5">Settings</Typography>
                <TextField label="Exchange Rates URL" fullWidth value={url} onChange={(e) => setUrl(e.target.value)} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={handleSave}>Test & Save</Button>
                </Box>
                {error && <Typography color="error">{error}</Typography>}
                {rates && (
                    <Box>
                        <Typography variant="body2">Current rates:</Typography>
                        <pre>{JSON.stringify(rates, null, 2)}</pre>
                    </Box>
                )}
            </Stack>
        </Paper>
    );
}
