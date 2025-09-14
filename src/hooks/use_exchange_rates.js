import { useEffect, useState } from 'react'
import { fetchRates } from '../services/exchangeRates.js'

/**
 * useExchangeRates
 * Hook to initialize and refresh exchange rates.
 * Returns { error } so App can display errors if needed.
 */
export function useExchangeRates() {
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadRates = async () => {
            try {
                await fetchRates()        // מביא שערי מטבעות
                setError(null)            // הכל טוב
            } catch (err) {
                setError(err.message)     // שמירת שגיאה כדי שנוכל להציג למשתמש
            }
        }
        loadRates()
    }, [])

    return { error }
}
