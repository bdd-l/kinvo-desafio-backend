"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRateLimiter = void 0;
const express_1 = require("express");
const transactions_service_1 = require("../services/transactions.service");
const validateTransaction_1 = require("../utils/validateTransaction");
const handlePrismaError_1 = require("../utils/handlePrismaError");
const rateLimiter_1 = require("../middleware/rateLimiter"); // Add this import
/**
 * Creates and configures the transaction routes with rate limiting
 *
 * This router handles all transaction-related HTTP requests with rate limiting
 * to prevent abuse, while delegating database operations to the TransactionService.
 *
 * Time Complexity: O(1) for all route handlers (service methods are O(1))
 * Space Complexity: O(n) where n is the number of transactions returned
 */
const router = (0, express_1.Router)();
const transactionService = new transactions_service_1.TransactionService();
// Add rate limiting middleware - 10 requests per minute, block for 1 hour
const transactionRateLimiter = new rateLimiter_1.RateLimiter(10, 60000, 3600000);
exports.transactionRateLimiter = transactionRateLimiter;
router.use(transactionRateLimiter.limit);
// GET all transactions with optional pagination
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit } = req.query;
        // Check if pagination parameters were provided
        if (page !== undefined || limit !== undefined) {
            // Parse and validate parameters
            const pageInt = page ? parseInt(page) : 1;
            const limitInt = limit ? parseInt(limit) : 10; // Default to 10 for pagination
            // Validate parameters
            if (isNaN(pageInt) || pageInt < 1) {
                return res.status(400).json({
                    error: "Page must be a positive integer",
                });
            }
            if (isNaN(limitInt) || limitInt < 1 || limitInt > 10) {
                return res.status(400).json({
                    error: "Limit must be between 1 and 10",
                });
            }
            // Get paginated transactions
            const result = yield transactionService.getPaginatedTransactions(pageInt, limitInt);
            return res.json(result);
        }
        // No pagination parameters provided
        const transactions = yield transactionService.getAllTransactions();
        return res.json(transactions);
    }
    catch (error) {
        return (0, handlePrismaError_1.handlePrismaError)(res, "retrieve", error);
    }
}));
// POST a new transaction
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validationResult = (0, validateTransaction_1.validateTransaction)(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: validationResult.error,
            });
        }
        // Add ID to the transaction
        const newTransaction = Object.assign(Object.assign({}, validationResult.data), { id: crypto.randomUUID() });
        const createdTransaction = yield transactionService.createTransaction(newTransaction);
        return res.status(201).json(createdTransaction);
    }
    catch (error) {
        return (0, handlePrismaError_1.handlePrismaError)(res, "save", error);
    }
}));
// DELETE a transaction by ID
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // Check if transaction exists first for better error messaging
        const exists = yield transactionService.transactionExists(id);
        if (!exists) {
            return res.status(404).json({
                error: `Transaction with ID "${id}" not found`,
            });
        }
        yield transactionService.deleteTransaction(id);
        return res.sendStatus(204);
    }
    catch (error) {
        return (0, handlePrismaError_1.handlePrismaError)(res, "delete", error);
    }
}));
// PATCH updates an existing transaction with partial data
router.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const validationResult = (0, validateTransaction_1.validatePartialTransaction)(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: validationResult.error,
            });
        }
        // Check if transaction exists first
        const exists = yield transactionService.transactionExists(id);
        if (!exists) {
            return res.status(404).json({
                error: `Transaction with ID "${id}" not found`,
            });
        }
        const updateData = validationResult.data;
        const updatedTransaction = yield transactionService.updateTransaction(id, updateData);
        return res.status(200).json(updatedTransaction);
    }
    catch (error) {
        return (0, handlePrismaError_1.handlePrismaError)(res, "update", error);
    }
}));
exports.default = router;
