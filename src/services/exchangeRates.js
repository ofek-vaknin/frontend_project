// src/services/exchangeRates.js
const KEY = 'ratesURL';

export function getRatesURL() {
    // ברירת מחדל: קובץ סטטי מ-public
    return localStorage.getItem(KEY) || '/exchange-rates.json';
}

export function setRatesURL(url) {
    localStorage.setItem(KEY, url);
}

export async function fetchRates() {
    const url = getRatesURL();
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch exchange rates from ${url}`);
    const json = await res.json();

    // ולידציה בסיסית
    const required = ['USD', 'GBP', 'EURO', 'ILS'];
    for (const k of required) {
        if (typeof json[k] !== 'number') {
            throw new Error('Invalid exchange rates JSON structure.');
        }
    }
    return json;
}
