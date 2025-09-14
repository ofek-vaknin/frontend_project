import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#1976d2', '#9c27b0', '#ff9800', '#4caf50', '#f44336', '#009688', '#795548'];

export default function PieByCategory({ data, currency }) {
    if (!data || data.length === 0) return <p>No data for pie chart</p>;

    const aggregated = data.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + (item.converted ?? item.sum);
        return acc;
    }, {});

    const chartData = Object.entries(aggregated).map(([name, value]) => ({ name, value }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" outerRadius={150} dataKey="value"
                     label={({ name, value }) => `${name}: ${value.toFixed(2)} ${currency}`}>
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${Number(v).toFixed(2)} ${currency}`} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
