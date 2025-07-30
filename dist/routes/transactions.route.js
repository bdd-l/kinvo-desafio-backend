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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generateId_1 = require("../utils/generateId");
const fileOperations_1 = require("../utils/fileOperations");
const validateTransaction_1 = require("../utils/validateTransaction");
const router = (0, express_1.Router)();
// GET /transactions - Retrieve all transactions
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield (0, fileOperations_1.readTransactions)();
        res.json(transactions);
    }
    catch (err) {
        console.error("Failed to read transactions:", err);
        res.status(500).json({ error: "Failed to retrieve transactions" });
    }
}));
// POST /transactions - Register new transaction
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationResult = (0, validateTransaction_1.validateTransaction)(req.body);
    if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error });
    }
    // Generate UUIDv4 and construct transaction
    const _a = validationResult.data, { id: _ } = _a, cleanData = __rest(_a, ["id"]);
    const newTransaction = Object.assign({ id: (0, generateId_1.generateId)() }, cleanData);
    try {
        // Read existing transactions with concurrency safety
        let transactions = yield (0, fileOperations_1.readTransactions)();
        // Append new transaction
        transactions.push(newTransaction);
        // Persist to disk with atomic write
        yield (0, fileOperations_1.writeTransactions)(transactions);
        res.status(201).json(newTransaction);
    }
    catch (err) {
        console.error("Storage error:", err);
        res.status(500).json({
            error: "Failed to save transaction. Please try again later.",
        });
    }
}));
exports.default = router;
