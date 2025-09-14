import React, { useEffect } from 'react';
import { Stack, Typography, Paper, Alert } from '@mui/material';
import CostList from './CostList.jsx';
import ReportControls from './ReportControls.jsx';
import { getReport } from '../services/idb.module.js';

export default function ReportView({ report, setReport, error, setError }) {
    // לטעון דו"ח אחרון אם יש (אופציונלי)
    useEffect(() => {
        if (!report) {
            const saved = localStorage.getItem('lastReport');
            if (saved) {
                try { setReport(JSON.parse(saved)); } catch {}
            }
        }
    }, [report, setReport]);

    const handleReport = async ({ year, month, currency }) => {
        setError?.('');
        try {
            const rep = await getReport(year, month, currency);
            setReport(rep);
            localStorage.setItem('lastReport', JSON.stringify(rep));
        } catch (e) {
            setError?.(e.message || 'Failed to build report');
        }
    };

    return (
        <Stack spacing={3}>
            <Typography variant="h5">Report</Typography>
            <Paper sx={{ p: 2 }}>
                <ReportControls onRun={handleReport} />
            </Paper>
            {error && <Alert severity="error">{error}</Alert>}
            {report && <CostList items={report.costs} reportCurrency={report.currency} />}
        </Stack>
    );
}
