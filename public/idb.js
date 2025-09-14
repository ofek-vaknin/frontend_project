(function () {
    const DB_NAME = "costsdb";
    const STORE_NAME = "costs";
    const DEFAULT_RATES_URL = "/exchange-rates.json";

    // ---------- פותח DB ומחזיר API ----------
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

            request.onsuccess = (event) => {
                const db = event.target.result;

                // מחזירים אובייקט API עם החתימות שהמרצה ביקש
                resolve({
                    addCost: (cost) => addCost(cost, db),
                    getReport: (year, month, currency) =>
                        getReport(year, month, currency, db),
                });
            };

            request.onerror = (event) => reject(event.target.error);
        });
    }

    // ---------- הוספת הוצאה ----------
    function addCost(cost, db) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);

            const now = new Date();
            const item = {
                sum: cost.sum,
                currency: cost.currency, // שדה נכון (המרצה כבר תיקן את ה־curency)
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
    }

    // ---------- טעינת שערי המרה ----------
    async function fetchRates() {
        const url = localStorage.getItem("ratesURL") || DEFAULT_RATES_URL;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch exchange rates");
        return res.json();
    }

    // ---------- הפקת דו"ח ----------
    function getReport(year, month, currency, db) {
        return new Promise(async (resolve, reject) => {
            try {
                const rates = await fetchRates();
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
                            // costs נשארים מקוריים
                            costs.push({
                                sum: item.sum,
                                currency: item.currency,
                                category: item.category,
                                description: item.description,
                                Date: { day: item.date.day },
                            });

                            // המרה לצורך ה־total בלבד
                            total += (item.sum / rates[item.currency]) * rates[currency];
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
            } catch (err) {
                reject(err);
            }
        });
    }

    // ---------- חשיפה ל־window ----------
    window.idb = {
        openCostsDB,
    };
})();
