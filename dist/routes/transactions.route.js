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
const client_1 = require("@prisma/client");
const validateTransaction_1 = require("../utils/validateTransaction");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Helper function to handle Prisma errors consistently
const handlePrismaError = (res, operation, error) => {
    console.error(`Error ${operation} transaction:`, error);
    return res.status(500).json({
        error: `Failed to ${operation} transaction. Please try again later.`,
    });
};
// GET all transactions
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield prisma.transactionMovement.findMany();
        return res.json(transactions);
    }
    catch (error) {
        return handlePrismaError(res, "retrieve", error);
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
        const newTransaction = Object.assign(Object.assign({}, validationResult.data), { id: Date.now().toString() });
        const createdTransaction = yield prisma.transactionMovement.create({
            data: newTransaction,
        });
        return res.status(201).json(createdTransaction);
    }
    catch (error) {
        return handlePrismaError(res, "save", error);
    }
}));
// DELETE a transaction by ID
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // Check if transaction exists first for better error messaging
        const existing = yield prisma.transactionMovement.findUnique({
            where: { id },
        });
        if (!existing) {
            return res.status(404).json({
                error: `Transaction with ID "${id}" not found`,
            });
        }
        yield prisma.transactionMovement.delete({
            where: { id },
        });
        return res.sendStatus(204);
    }
    catch (error) {
        return handlePrismaError(res, "delete", error);
    }
}));
// PUT updates an existing transaction
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const validationResult = (0, validateTransaction_1.validateTransaction)(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: validationResult.error,
            });
        }
        // Check if transaction exists first
        const existing = yield prisma.transactionMovement.findUnique({
            where: { id },
        });
        if (!existing) {
            return res.status(404).json({
                error: `Transaction with ID "${id}" not found`,
            });
        }
        // CRITICAL FIX: Remove id from the validation data
        // This prevents Prisma from trying to update the ID field
        const _a = validationResult.data, { id: _ } = _a, updateData = __rest(_a, ["id"]);
        const updatedTransaction = yield prisma.transactionMovement.update({
            where: { id },
            data: updateData,
        });
        return res.status(200).json(updatedTransaction);
    }
    catch (error) {
        return handlePrismaError(res, "update", error);
    }
}));
exports.default = router;
