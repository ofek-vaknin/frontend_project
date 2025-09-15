// ReportControls.jsx
// ------------------------------------------------------
// Provides selectors for Year, Month, and Currency,
// and a button to trigger generating a report.
// ------------------------------------------------------

import React, { useMemo, useState } from 'react';
import { Card, CardContent, Stack, MenuItem, TextField, Button } from '@mui/material';

/* ---------------- Constants ---------------- */
const YEARS = (() => {
    const y = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, i) => y - 3 + i);  // Generate 8 years: 3 back + 4 ahead
})();
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1); // Months 1–12
const CURRENCIES = ['USD', 'ILS', 'GBP', 'EURO'];           // Supported currencies

/**
 * ReportControls Component
 * ------------------------------------------------------
 * Provides controls (Year, Month, Currency) to generate a report.
 *
 * @param {Function} onRun - Callback triggered when the user clicks "Get Report".
 * @returns {JSX.Element} - A card containing selectors and a button.
 */
export default function ReportControls({ onRun }) {
    /* ---------------- State ---------------- */
    const now = useMemo(() => new Date(), []);   // Current date
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [currency, setCurrency] = useState('USD');

    /* ---------------- Render ---------------- */
    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">

                    {/* Year selector */}
                    <TextField
                        label="Year"
                        select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        sx={{ minWidth: 140 }}
                    >
                        {YEARS.map((y) => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </TextField>

                    {/* Month selector */}
                    <TextField
                        label="Month"
                        select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        sx={{ minWidth: 140 }}
                    >
                        {MONTHS.map((m) => (
                            <MenuItem key={m} value={m}>{m}</MenuItem>
                        ))}
                    </TextField>

                    {/* Currency selector */}
                    <TextField
                        label="Currency"
                        select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        sx={{ minWidth: 160 }}
                    >
                        {CURRENCIES.map((c) => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                        ))}
                    </TextField>

                    {/* Action button */}
                    <Button
                        variant="contained"
                        onClick={() => onRun({ year, month, currency })}
                    >
                        Get Report
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
