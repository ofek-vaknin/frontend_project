// src/services/currency.js
/**
 * Currency Conversion Service
 * ---------------------------
 * Provides a helper function to convert amounts between supported currencies.
 *
 * The rates object is expected to be a normalized map
 * provided by fetchRates(), for example:
 * { USD: 1, GBP: 0.78, EURO: 0.92, ILS: 3.65 }
 */

/**
 * Converts an amount from one currency to another.
 *
 * Formula:
 *   converted = (amount / rates[src]) * rates[dst]
 *
 * @param {number} amount - The original amount.
 * @param {string} src - Source currency code.
 * @param {string} dst - Destination currency code.
 * @param {Object} rates - Exchange rates map.
 * @returns {number} The converted amount.
 * @throws {Error} If source or destination currency is not supported.
 */
export function convert(amount, src, dst, rates) {
    // No conversion needed if currencies are the same
    if (src === dst) {
        return amount;
    }

    // Validate that both source and destination exist in the rates object
    if (!rates?.[src] || !rates?.[dst]) {
        throw new Error("Unsupported currency");
    }

    // Perform conversion
    return (amount / rates[src]) * rates[dst];
}
