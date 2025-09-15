// ReportView.jsx
// ------------------------------------------------------
// Main report view: allows the user to generate and display reports.
// Stores last generated report in localStorage for persistence.
// ------------------------------------------------------

import React, { useEffect } from 'react';
import { Stack, Typography, Paper, Alert } from '@mui/material';
import CostList from './CostList.jsx';
import ReportControls from './ReportControls.jsx';
import { getReport } from '../services/idb.module.js';

/**
 * ReportView Component
 * ------------------------------------------------------
 * Displays the report controls (year/month/currency) and the results table.
 *
 * @param {Object}   report   - Current report object (from parent state).
 * @param {Function} setReport - Setter function for updating report state.
 * @param {string}   error    - Error message if report building failed.
 * @param {Function} setError - Setter function for updating error state.
 * @returns {JSX.Element} - The report view component.
 */
export default function ReportView({ report, setReport, error, setError }) {

    /* ---------------- Load last report from localStorage ---------------- */
    useEffect(() => {
        if (!report) {
            const saved = localStorage.getItem('lastReport');
            if (saved) {
                try {
                    setReport(JSON.parse(saved));
                } catch {
                    // Ignore JSON parse error
                }
            }
        }
    }, [report, setReport]);

    /* ---------------- Handle "Get Report" button ---------------- */
    const handleReport = async ({ year, month, currency }) => {
        setError?.('');
        try {
            const rep = await getReport(year, month, currency);   // Fetch report
            setReport(rep);                                       // Save in state
            localStorage.setItem('lastReport', JSON.stringify(rep)); // Persist to localStorage
        } catch (e) {
            setError?.(e.message || 'Failed to build report');
        }
    };

    /* ---------------- Render ---------------- */
    return (
        <Stack spacing={3}>
            <Typography variant="h5">Report</Typography>

            {/* Report controls (year/month/currency) */}
            <Paper sx={{ p: 2 }}>
                <ReportControls onRun={handleReport} />
            </Paper>

            {/* Error alert if exists */}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Report results table */}
            {report && (
                <CostList
                    items={report.costs}
                    reportCurrency={report.currency}
                    total={report.total}   // Pass the total object from the report
                />
            )}
        </Stack>
    );
}
