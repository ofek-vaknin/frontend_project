import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function BarByMonth({ data, currency }) {
    // מכינים מראש 12 חודשים עם ערך 0
    const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: 0 }))

    if (data && data.length > 0) {
        data.forEach(item => {
            const m = item.date?.month || new Date().getMonth() + 1
            months[m - 1].total += item.sum
        })
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={months} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(2)} ${currency}`} />
                <Legend />
                <Bar dataKey="total" fill="#1976d2" name={`Total (${currency})`} />
            </BarChart>
        </ResponsiveContainer>
    )
}