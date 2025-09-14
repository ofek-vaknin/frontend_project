import React, { useMemo, useState } from 'react';
import { Card, CardContent, Stack, MenuItem, TextField, Button } from '@mui/material';

const YEARS = (() => {
    const y = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, i) => y - 3 + i);
})();
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO'];

export default function ReportControls({ onRun }) {
    const now = useMemo(() => new Date(), []);
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [currency, setCurrency] = useState('USD');

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <TextField label="Year" select value={year} onChange={(e) => setYear(Number(e.target.value))} sx={{ minWidth: 140 }}>
                        {YEARS.map((y) => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </TextField>
                    <TextField label="Month" select value={month} onChange={(e) => setMonth(Number(e.target.value))} sx={{ minWidth: 140 }}>
                        {MONTHS.map((m) => (
                            <MenuItem key={m} value={m}>{m}</MenuItem>
                        ))}
                    </TextField>
                    <TextField label="Currency" select value={currency} onChange={(e) => setCurrency(e.target.value)} sx={{ minWidth: 160 }}>
                        {CURRENCIES.map((c) => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </TextField>
                    <Button variant="contained" onClick={() => onRun({ year, month, currency })}>
                        Get Report
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
