// SettingsView.jsx
// ------------------------------------------------------
// Allows the user to configure the URL for fetching exchange rates,
// test the connection, and reset to the default API.
// ------------------------------------------------------

import React, { useState } from 'react'
import { Box, Button, Stack, TextField, Typography, Paper } from '@mui/material'
import { fetchRates, setRatesURL, getRatesURL } from '../services/exchangeRates'

/**
 * SettingsView Component
 * ------------------------------------------------------
 * Provides controls for:
 * - Setting a custom exchange rates API
 * - Testing the connection
 * - Resetting to the default API
 *
 * @returns {JSX.Element} - The settings view component.
 */
export default function SettingsView() {

    /* ---------------- State ---------------- */
    const [url, setUrl] = useState(getRatesURL())   /* Current URL for exchange rates */
    const [rates, setRates] = useState(null)        /* Exchange rates data */
    const [error, setError] = useState(null)        /* Error state */

    /**
     * Handle save & test
     * ------------------------------------------------------
     * Saves the URL in localStorage and attempts to fetch the rates.
     * If successful, updates the rates state; otherwise sets error.
     *
     * @returns {Promise<void>}
     */
    const handleSave = async () => {
        try {
            setRatesURL(url)                        /* Save new URL in localStorage */
            const data = await fetchRates()         /* Try to fetch rates */
            setRates(data)                          /* Update state with fetched rates */
            setError(null)                          /* Clear error */
        } catch (err) {
            if (err.message.includes('Invalid exchange rates JSON structure')) {
                setError(
                    'The API you provided returned an unsupported format. ' +
                    'Please use a valid URL that provides rates in JSON format ' +
                    'with USD, GBP, EURO and ILS.'
                )
            } else {
                setError(err.message || 'Failed to fetch rates. Please check the URL.')
            }
            setRates(null)
        }
    }

    /**
     * Handle reset to default API
     * ------------------------------------------------------
     * Removes the custom URL from localStorage and reloads the default API.
     *
     * @returns {Promise<void>}
     */
    const handleReset = async () => {
        localStorage.removeItem("ratesURL")         /* Delete custom URL */
        const defaultUrl = getRatesURL()            /* Will fallback to default API */
        setUrl(defaultUrl)                          /* Update input field */

        try {
            const data = await fetchRates()         /* Fetch default API */
            setRates(data)
            setError(null)
        } catch (err) {
            setError(err.message || "Failed to load default API")
            setRates(null)
        }
    }

    /* ---------------- Render ---------------- */
    return (
        <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h5">Settings</Typography>

                {/* Input field for exchange rates URL */}
                <TextField
                    label="Exchange Rates URL"
                    fullWidth
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />

                {/* Action buttons */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Test & Save
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleReset}>
                        Reset to Default API
                    </Button>
                </Box>

                {/* Show error if exists */}
                {error && (
                    <Typography color="error" sx={{ whiteSpace: 'pre-line' }}>
                        {error}
                    </Typography>
                )}

                {/* Show current rates if valid */}
                {rates && (
                    <Box>
                        <Typography variant="body2">Current rates:</Typography>
                        <pre>{JSON.stringify(rates, null, 2)}</pre>
                    </Box>
                )}
            </Stack>
        </Paper>
    )
}
