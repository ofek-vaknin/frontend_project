import React, { useState } from 'react';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import AddCostForm from './components/AddCostForm.jsx';
import ReportView from './components/ReportView.jsx';
import ChartsView from './components/ChartsView.jsx';
import SettingsView from './components/SettingsView.jsx';

export default function App() {
    const [view, setView] = useState('add');
    const [report, setReport] = useState(null);
    const [error, setError] = useState('');

    const renderView = () => {
        switch (view) {
            case 'add':
                return <AddCostForm />;
            case 'report':
                return <ReportView report={report} setReport={setReport} error={error} setError={setError} />;
            case 'charts':
                return <ChartsView report={report} />;
            case 'settings':
                return <SettingsView />;
            default:
                return <AddCostForm />;
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
            <AppBar position="static" sx={{ bgcolor: '#4caf50' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Cost Manager</Typography>
                    <Stack direction="row" spacing={2}>
                        <Button color="inherit" onClick={() => setView('add')}>Add</Button>
                        <Button color="inherit" onClick={() => setView('report')}>Report</Button>
                        <Button color="inherit" onClick={() => setView('charts')}>Charts</Button>
                        <Button color="inherit" onClick={() => setView('settings')}>Settings</Button>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {renderView()}
            </Container>
            <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: '#e8f5e9', mt: 4 }}>
                <Typography variant="body2">Cost Manager © {new Date().getFullYear()}</Typography>
            </Box>
        </Box>
    );
}