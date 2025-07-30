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
const fileOperations_1 = require("../utils/fileOperations");
const validateTransaction_1 = require("../utils/validateTransaction");
const transactionUtils_1 = require("../utils/transactionUtils");
const router = (0, express_1.Router)();
// GET all completed transactions
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield (0, fileOperations_1.readTransactions)();
        res.json(transactions);
    }
    catch (error) {
        console.error("Error reading transactions:", error);
        res.status(500).json({
            error: "Failed to retrieve transactions. Please try again later.",
        });
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
        const transactions = yield (0, fileOperations_1.readTransactions)();
        const newTransaction = Object.assign(Object.assign({}, validationResult.data), { id: Date.now().toString() });
        transactions.push(newTransaction);
        yield (0, fileOperations_1.writeTransactions)(transactions);
        res.status(201).json(newTransaction);
    }
    catch (error) {
        console.error("Error saving transaction:", error);
        res.status(500).json({
            error: "Failed to save transaction. Please try again later.",
        });
    }
}));
/**
 * DELETE /:id
 * Deletes a transaction by its unique identifier
 *
 * Time Complexity: O(n) for small datasets, O(1) for larger ones
 * Space Complexity: O(1) for small datasets, O(n) for larger ones
 */
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const transactions = yield (0, fileOperations_1.readTransactions)();
        // Check if transaction exists
        const result = (0, transactionUtils_1.getTransactionById)(transactions, id, res);
        if (!result)
            return; // Error response already sent
        // Remove the transaction from the collection
        transactions.splice(result.index, 1);
        yield (0, fileOperations_1.writeTransactions)(transactions);
        // 204 No Content - successful deletion with no response body
        // This follows HTTP specification for successful DELETE operations
        res.sendStatus(204);
    }
    catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({
            error: "Failed to process transaction deletion. Please try again later.",
        });
    }
}));
/**
 * PUT /:id
 * Updates an existing transaction with new data
 *
 * Time Complexity: O(n) for small datasets, O(1) for larger ones
 * Space Complexity: O(1) for small datasets, O(n) for larger ones
 */
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const validationResult = (0, validateTransaction_1.validateTransaction)(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: validationResult.error,
            });
        }
        const transactions = yield (0, fileOperations_1.readTransactions)();
        // Check if transaction exists
        const result = (0, transactionUtils_1.getTransactionById)(transactions, id, res);
        if (!result)
            return; // Error response already sent
        // Create updated transaction while preserving the original ID
        const updatedTransaction = Object.assign(Object.assign({}, validationResult.data), { id: result.transaction.id });
        transactions[result.index] = updatedTransaction;
        yield (0, fileOperations_1.writeTransactions)(transactions);
        res.status(200).json(updatedTransaction);
    }
    catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({
            error: "Failed to update transaction. Please try again later.",
        });
    }
}));
exports.default = router;
