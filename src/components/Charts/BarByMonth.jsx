// BarByMonth.jsx
// ----------------------------
// Displays a bar chart of total costs per month
// for a given year and selected currency.
// ----------------------------

import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

/**
 * BarByMonth Component
 * ----------------------------
 * Renders a bar chart with totals for all 12 months.
 * Falls back to an empty dataset if no data is provided.
 *
 * @param {Array} data - Array of objects with {month, total}
 * @param {string} currency - The selected currency to display
 * @returns {JSX.Element} - Responsive bar chart
 */
export default function BarByMonth({ data, currency }) {
    // If no data, generate 12 months with zero totals
    const months = data && data.length > 0
        ? data
        : Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: 0 }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={months}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                {/* Grid lines for readability */}
                <CartesianGrid strokeDasharray="3 3" />

                {/* X axis represents months */}
                <XAxis dataKey="month" />

                {/* Y axis represents totals */}
                <YAxis />

                {/* Tooltip shows formatted value with currency */}
                <Tooltip formatter={(value) => `${value.toFixed(2)} ${currency}`} />

                <Legend />

                {/* Bar with totals */}
                <Bar
                    dataKey="total"
                    fill="#1976d2"
                    name={`Total (${currency})`}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
