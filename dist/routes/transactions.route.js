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
const express_1 = require("express");
const transactions_service_1 = require("../services/transactions.service");
const validateTransaction_1 = require("../utils/validateTransaction");
const handlePrismaError_1 = require("../utils/handlePrismaError");
/**
 * Creates and configures the transaction routes
 *
 * This router handles all transaction-related HTTP requests, delegating
 * database operations to the TransactionService for better separation
 * of concerns and testability.
 *
 * Time Complexity: O(1) for all route handlers (service methods are O(1))
 * Space Complexity: O(n) where n is the number of transactions returned
 */
const router = (0, express_1.Router)();
const transactionService = new transactions_service_1.TransactionService();
// GET all transactions
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        const newTransaction = Object.assign(Object.assign({}, validationResult.data), { id: Date.now().toString() });
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
