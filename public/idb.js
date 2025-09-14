(function () {
    const DB_NAME = "costsdb";
    const DB_VERSION = 1;
    const STORE_NAME = "costs";

    const DEFAULT_RATES = { USD: 1, GBP: 1.8, EURO: 0.7, ILS: 3.4 };

    // פתיחת מסד הנתונים
    function openCostsDB(databaseName = DB_NAME, databaseVersion = DB_VERSION) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(databaseName, databaseVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                    store.createIndex("year", "date.year", { unique: false });
                    store.createIndex("month", "date.month", { unique: false });
                }
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                resolve({
                    addCost: (cost) => addCost(db, cost),
                    getReport: (year, month, currency) =>
                        getReport(db, year, month, currency),
                });
            };

            request.onerror = (event) => reject(event.target.error);
        });
    }

    // פונקציית עזר להפעלת טרנזקציה
    function withStore(db, mode, fn) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, mode);
            const store = tx.objectStore(STORE_NAME);
            const result = fn(store);
            tx.oncomplete = () => resolve(result);
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });
    }

    // הוספת הוצאה חדשה
    function addCost(db, cost) {
        const now = new Date();
        const item = {
            sum: cost.sum,
            currency: cost.currency || cost.curency, // ✅ תומך גם בטעות כתיב
            category: cost.category,
            description: cost.description,
            date: {
                year: now.getFullYear(),
                month: now.getMonth() + 1,
                day: now.getDate(),
            },
        };

        return withStore(db, "readwrite", (store) => store.add(item)).then(
            () => item
        );
    }

    // טעינת שערי המרה
    function loadRates() {
        const url = localStorage.getItem("ratesURL") || "/exchange-rates.json";
        return fetch(url, { cache: "no-store" })
            .then((r) => {
                if (!r.ok) throw new Error("Failed to fetch rates");
                return r.json();
            })
            .catch(() => DEFAULT_RATES); // אם אין קובץ, חוזרים לברירת מחדל
    }

    // המרת סכום לפי שערי המרה
    function convertAmount(amount, from, to, rates) {
        const src = rates[from];
        const tgt = rates[to];
        if (typeof src !== "number" || typeof tgt !== "number") return amount;
        return (amount / src) * tgt;
    }

    // הפקת דוח
    function getReport(db, year, month, currency) {
        const items = [];
        return withStore(db, "readonly", (store) => {
            const request = store.openCursor();
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor) {
                    items.push(cursor.value);
                    cursor.continue();
                }
            };
        }).then(() =>
            loadRates().then((rates) => {
                let totalConverted = 0;
                const normalized = items
                    .filter((i) => i.date.year === year && i.date.month === month)
                    .map((c) => {
                        const converted = convertAmount(
                            c.sum,
                            c.currency,
                            currency,
                            rates
                        );
                        totalConverted += converted;
                        return {
                            sum: c.sum,
                            currency: c.currency,
                            category: c.category,
                            description: c.description,
                            Date: { day: c.date.day }, // ✅ בדיוק לפי דרישה
                        };
                    });
                return {
                    year,
                    month,
                    costs: normalized,
                    total: { currency, total: Number(totalConverted) }, // ✅ במבנה שהמרצה ביקש
                };
            })
        );
    }

    // לחשוף ל־window
    window.idb = { openCostsDB };
})();
