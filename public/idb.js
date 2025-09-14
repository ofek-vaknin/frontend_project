(function () {
    const DB_NAME = "costsdb";
    const STORE_NAME = "costs";

    function openCostsDB(databaseName = DB_NAME, databaseVersion = 1) {
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

            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    function addCost(cost) {
        return openCostsDB().then((db) => {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, "readwrite");
                const store = tx.objectStore(STORE_NAME);

                // הוספת תאריך אוטומטית
                const now = new Date();
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
                };

                const request = store.add(item);
                request.onsuccess = () => resolve(item);
                request.onerror = (event) => reject(event.target.error);
            });
        });
    }

    function getReport(year, month, currency) {
        return openCostsDB().then((db) => {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, "readonly");
                const store = tx.objectStore(STORE_NAME);

                const costs = [];
                let total = 0;

                const request = store.openCursor();
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const item = cursor.value;
                        if (item.date.year === year && item.date.month === month) {
                            costs.push(item);
                            total += item.sum; // בלי המרות מטבע ב-Vanilla
                        }
                        cursor.continue();
                    } else {
                        resolve({
                            year,
                            month,
                            costs,
                            total: { currency, total },
                        });
                    }
                };
                request.onerror = (event) => reject(event.target.error);
            });
        });
    }

    // לחשוף את הפונקציות כ-global
    window.idb = {
        openCostsDB,
        addCost,
        getReport,
    };
})();