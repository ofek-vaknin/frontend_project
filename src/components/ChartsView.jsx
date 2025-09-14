import React from 'react';
import { Typography, Paper, Box } from '@mui/material';
import PieByCategory from './Charts/PieByCategory.jsx';
import BarByMonth from './Charts/BarByMonth.jsx';

export default function ChartsView({ report }) {
    if (!report) {
        return (
            <Typography variant="body1" color="text.secondary">
                No report data available. Please run a report first.
            </Typography>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h5">Charts</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Paper sx={{ flex: 1, minWidth: 400, p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        By Category ({report.currency})
                    </Typography>
                    <PieByCategory data={report.costs} currency={report.currency} />
                </Paper>
                <Paper sx={{ flex: 1, minWidth: 400, p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        By Month ({report.currency})
                    </Typography>
                    <BarByMonth data={report.costs} currency={report.currency} />
                </Paper>
            </Box>
        </Box>
    );
}
