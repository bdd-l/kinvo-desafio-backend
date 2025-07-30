"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransaction = void 0;
const normalizeTransactionDate = (input) => {
    // Case 1: Pure date (YYYY-MM-DD) → UTC midnight
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
        return `${input}T00:00:00.000Z`;
    }
    // Case 2: Date + time without timezone → Interpret as UTC
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(input)) {
        return `${input}.000Z`;
    }
    // Case 3: Unix timestamp (number as string)
    if (/^\d+$/.test(input)) {
        return new Date(parseInt(input)).toISOString();
    }
    // Case 4: Any other format → Let Date.parse handle it
    const date = new Date(input);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format: "${input}"`);
    }
    return date.toISOString();
};
const validateTransaction = (data) => {
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return {
            success: false,
            error: "Invalid payload format. Expected a JSON object.",
        };
    }
    const { description, price, transactionType, transactionDate } = data;
    if (typeof description !== "string" || description.trim() === "") {
        return {
            success: false,
            error: "Description must be a non-empty string.",
        };
    }
    if (typeof price !== "number" || price <= 0) {
        return {
            success: false,
            error: "Price must be a positive number.",
        };
    }
    if (typeof transactionType !== "string" ||
        !["income", "expense"].includes(transactionType)) {
        return {
            success: false,
            error: `Transaction type must be "income" or "expense". Received: "${transactionType}"`,
        };
    }
    if (typeof transactionDate !== "string") {
        return {
            success: false,
            error: "Transaction date must be a string.",
        };
    }
    try {
        const normalizedDate = normalizeTransactionDate(transactionDate);
        const date = new Date(normalizedDate);
        const minDate = new Date("1900-01-01");
        const maxDate = new Date("2100-01-01");
        if (date < minDate || date > maxDate) {
            return {
                success: false,
                error: "Transaction date must be between 1900 and 2100.",
            };
        }
        return {
            success: true,
            data: {
                id: "",
                description: description.trim(),
                price,
                transactionType: transactionType,
                transactionDate: normalizedDate,
            },
        };
    }
    catch (err) {
        return {
            success: false,
            error: err instanceof Error ? err.message : "Invalid transaction date format.",
        };
    }
};
exports.validateTransaction = validateTransaction;
