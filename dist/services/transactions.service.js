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
exports.TransactionService = void 0;
const client_1 = require("@prisma/client");
/**
 * Service class for handling transaction-related database operations
 *
 * This service abstracts all database interactions for transactions,
 * providing a clean interface for the route handlers to use.
 * It handles the necessary type conversions between Prisma's return
 * types and our application's Transaction interface.
 *
 * Time Complexity for all methods: O(1) - Prisma operations are generally constant time
 * Space Complexity for all methods: O(n) where n is the number of transactions returned
 */
class TransactionService {
    /**
     * Creates a new TransactionService instance
     *
     * @param prismaClient - Optional PrismaClient instance (for testing)
     */
    constructor(prismaClient = new client_1.PrismaClient()) {
        this.prisma = prismaClient;
    }
    /**
     * Converts a Prisma TransactionMovement object to our Transaction interface
     *
     * Handles the critical type conversion where Prisma returns Date objects
     * but our interface requires ISO 8601 strings for transactionDate.
     *
     * Time Complexity: O(1) - Simple property mapping
     * Space Complexity: O(1) - Creates a single new object
     *
     * @param prismaTransaction - Transaction from Prisma
     * @returns Transaction object matching our interface
     */
    toTransactionInterface(prismaTransaction) {
        return {
            id: prismaTransaction.id,
            description: prismaTransaction.description,
            price: prismaTransaction.price,
            transactionType: prismaTransaction.transactionType,
            transactionDate: prismaTransaction.transactionDate.toISOString(),
        };
    }
    /**
     * Retrieves all transactions from the database
     *
     * @returns Promise resolving to an array of Transaction objects
     * @throws Error if database operation fails
     */
    getAllTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaTransactions = yield this.prisma.transactionMovement.findMany();
            return prismaTransactions.map((transaction) => this.toTransactionInterface(transaction));
        });
    }
    /**
     * Creates a new transaction in the database
     *
     * @param data - Transaction data to create
     * @returns Promise resolving to the created Transaction object
     * @throws Error if database operation fails
     */
    createTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield this.prisma.transactionMovement.create({
                data: Object.assign(Object.assign({}, data), { 
                    // Prisma expects Date objects for date fields
                    transactionDate: new Date(data.transactionDate) }),
            });
            return this.toTransactionInterface(created);
        });
    }
    /**
     * Checks if a transaction with the given ID exists
     *
     * @param id - Transaction ID to check
     * @returns Promise resolving to true if transaction exists, false otherwise
     * @throws Error if database operation fails
     */
    transactionExists(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.prisma.transactionMovement.findUnique({
                where: { id },
            });
            return !!transaction;
        });
    }
    /**
     * Deletes a transaction from the database
     *
     * @param id - ID of the transaction to delete
     * @returns Promise resolving when deletion is complete
     * @throws Error if transaction doesn't exist or database operation fails
     */
    deleteTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.transactionMovement.delete({
                where: { id },
            });
        });
    }
    /**
     * Updates a transaction in the database with partial data
     *
     * @param id - ID of the transaction to update
     * @param data - Partial Transaction data to update
     * @returns Promise resolving to the updated Transaction object
     * @throws Error if transaction doesn't exist or database operation fails
     */
    updateTransaction(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = Object.assign({}, data);
            // Convert transactionDate to Date object if it's provided
            if (data.transactionDate) {
                updateData.transactionDate = new Date(data.transactionDate);
            }
            const updated = yield this.prisma.transactionMovement.update({
                where: { id },
                data: updateData,
            });
            return this.toTransactionInterface(updated);
        });
    }
}
exports.TransactionService = TransactionService;
