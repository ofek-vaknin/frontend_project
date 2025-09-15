(function () {
    // ---------- Constants ----------
    // Default configuration values
    const DB_NAME = "costsdb";  // Database name
    const STORE_NAME = "costs"; // Object store name
    const DEFAULT_RATES_URL = "https://api.exchangerate-api.com/v4/latest/USD"; // Default API for exchange rates

    // Internal reference to IndexedDB connection
    let db = null;

    /**
     * openCostsDB
     * ----------------------
     * Opens the IndexedDB database.
     * Creates an object store with indexes if it doesn't exist.
     * @param {string} databaseName - The name of the database
     * @param {number} databaseVersion - The version number of the database
     * @returns {Promise<IDBDatabase>} - A Promise resolving with the DB instance
     */
    function openCostsDB(databaseName = DB_NAME, databaseVersion = 1) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(databaseName, databaseVersion);

            request.onupgradeneeded = (event) => {
                const upgradeDb = event.target.result;
                if (!upgradeDb.objectStoreNames.contains(STORE_NAME)) {
                    const store = upgradeDb.createObjectStore(STORE_NAME, {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                    // Create indexes for queries
                    store.createIndex("year", "date.year", { unique: false });
                    store.createIndex("month", "date.month", { unique: false });
                }
            };

            request.onsuccess = (event) => {
                db = event.target.result; // Save DB reference
                resolve(db);
            };

            request.onerror = (event) => reject(event.target.error);
        });
    }

    /**
     * addCost
     * ----------------------
     * Adds a new cost item to the database.
     * @param {Object} cost - The cost object to insert
     * @returns {Promise<Object>} - A Promise resolving with the inserted cost
     */
    function addCost(cost) {
        return new Promise((resolve, reject) => {
            if (!db) {
                reject(new Error("Database not initialized. Call openCostsDB() first."));
                return;
            }

            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);

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
    }

    /**
     * fetchRates
     * ----------------------
     * Fetches exchange rates from either localStorage URL or default API.
     * Supports APIs that return { rates: {...} } or a plain object.
     * @returns {Promise<Object>} - Normalized exchange rates object
     */
    async function fetchRates() {
        const url = localStorage.getItem("ratesURL") || DEFAULT_RATES_URL;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch exchange rates");

        const json = await res.json();
        const source = json.rates ? json.rates : json;

        return {
            USD: source.USD ?? 1,
            GBP: source.GBP,
            EURO: source.EURO ?? source.EUR,
            ILS: source.ILS,
        };
    }

    /**
     * convert
     * ----------------------
     * Converts an amount between two currencies using given rates.
     * Formula: amount * (rates[dst] / rates[src]).
     * @param {number} amount - The amount to convert
     * @param {string} src - Source currency
     * @param {string} dst - Destination currency
     * @param {Object} rates - Rates object
     * @returns {number} - Converted amount
     */
    function convert(amount, src, dst, rates) {
        if (src === dst) return amount;
        if (!rates[src] || !rates[dst]) throw new Error("Unsupported currency");
        return (amount / rates[src]) * rates[dst];
    }

    /**
     * getReport
     * ----------------------
     * Builds a report for the given year, month, and target currency.
     * Costs remain in original currency, total is converted.
     * @param {number} year - The year to query
     * @param {number} month - The month to query
     * @param {string} currency - Target currency for total
     * @returns {Promise<Object>} - Report object
     */
    function getReport(year, month, currency) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!db) {
                    reject(new Error("Database not initialized. Call openCostsDB() first."));
                    return;
                }

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
                            costs.push({
                                sum: item.sum,
                                currency: item.currency,
                                category: item.category,
                                description: item.description,
                                Date: { day: item.date.day },
                            });
                            total += convert(item.sum, item.currency, currency, rates);
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

    // ---------- Expose globally ----------
    // Attach all functions to global "idb" object
    window.idb = {
        openCostsDB,
        addCost,
        getReport
    };
})();
