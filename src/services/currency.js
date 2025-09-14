// We assume the rates map is **USD per 1 unit of currency**.
// Example: { USD:1, GBP:1.8, EURO:0.7, ILS:3.4 }
// Convert amount from src -> dst: amount * (rates[src] / rates[dst])


export function convert(amount, src, dst, rates) {
    if (src === dst) return amount
    if (!rates?.[src] || !rates?.[dst]) throw new Error('Unsupported currency')
    return amount * (rates[src] / rates[dst])
}