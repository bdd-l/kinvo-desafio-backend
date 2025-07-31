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
const client_1 = require("@prisma/client");
const validateTransaction_1 = require("../utils/validateTransaction");
const handlePrismaError_1 = require("../utils/handlePrismaError");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// GET all transactions
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield prisma.transactionMovement.findMany();
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
        const newTransaction = Object.assign(Object.assign({}, validationResult.data), { id: Date.now().toString() });
        const createdTransaction = yield prisma.transactionMovement.create({
            data: newTransaction,
        });
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
        const existing = yield prisma.transactionMovement.findUnique({
            where: { id },
        });
        if (!existing) {
            return res.status(404).json({
                error: `Transaction with ID "${id}" not found`,
            });
        }
        const updateData = validationResult.data;
        const updatedTransaction = yield prisma.transactionMovement.update({
            where: { id },
            data: updateData,
        });
        return res.status(200).json(updatedTransaction);
    }
    catch (error) {
        return (0, handlePrismaError_1.handlePrismaError)(res, "update", error);
    }
}));
exports.default = router;
