// src/services/idb.module.js
import { fetchRates } from "./exchangeRates"

const DB_NAME = "costsdb"
const STORE_NAME = "costs"

const listeners = new Set()

export function subscribeToChanges(listener) {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

function notifyChange() {
    listeners.forEach((l) => l())
}
// -------------------

export function openCostsDB(databaseName = DB_NAME, databaseVersion = 1) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(databaseName, databaseVersion)

        request.onupgradeneeded = (event) => {
            const db = event.target.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true,
                })
                store.createIndex("year", "date.year", { unique: false })
                store.createIndex("month", "date.month", { unique: false })
            }
        }

        request.onsuccess = (event) => resolve(event.target.result)
        request.onerror = (event) => reject(event.target.error)
    })
}

export async function addCost(cost) {
    const db = await openCostsDB()
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)

    const now = new Date()
    const item = {
        sum: cost.sum,
        currency: cost.currency,
        category: cost.category,
        description: cost.description,
        date: {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate(),
        },
    }

    return new Promise((resolve, reject) => {
        const req = store.add(item)
        req.onsuccess = () => {
            notifyChange()   // 🔹 נעדכן את כל הגרפים
            resolve(item)
        }
        req.onerror = (e) => reject(e.target.error)
    })
}

export async function getReport(year, month, currency) {
    // קודם כל שערי המרה
    const rates = await fetchRates();

    const db = await openCostsDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    const costs = [];
    let total = 0;

    return new Promise((resolve, reject) => {
        const req = store.openCursor();
        req.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const item = cursor.value;
                if (item.date.year === year && item.date.month === month) {
                    const converted = (item.sum / rates[item.currency]) * rates[currency];
                    costs.push({ ...item, converted });
                    total += converted;
                }
                cursor.continue();
            } else {
                resolve({ year, month, currency, costs, total });
            }
        };
        req.onerror = (e) => reject(e.target.error);
    });
}

export async function getPieData(year, month, currency) {
    const report = await getReport(year, month, currency);
    const grouped = {};
    report.costs.forEach((c) => {
        grouped[c.category] = (grouped[c.category] || 0) + c.converted;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
}

export async function getBarData(year, currency) {
    // קודם שערי המרה
    const rates = await fetchRates();

    const db = await openCostsDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    const months = Array(12).fill(0);

    return new Promise((resolve, reject) => {
        const req = store.openCursor();
        req.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const item = cursor.value;
                if (item.date.year === year) {
                    const converted = (item.sum / rates[item.currency]) * rates[currency];
                    months[item.date.month - 1] += converted;
                }
                cursor.continue();
            } else {
                resolve(months.map((total, idx) => ({ month: idx + 1, total })));
            }
        };
        req.onerror = (e) => reject(e.target.error);
    });
}