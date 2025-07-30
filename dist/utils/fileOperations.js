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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTransactions = readTransactions;
exports.writeTransactions = writeTransactions;
const promises_1 = __importDefault(require("fs/promises"));
/**
 * Reads transactions from the JSON file storage
 *
 * Handles file reading and parsing with proper error handling
 * Specifically handles ENOENT (file not found) to return empty array
 *
 * Time Complexity: O(n) - Proportional to the size of the transactions file
 * Space Complexity: O(n) - Stores all transactions in memory
 *
 * @returns Promise resolving to array of Transaction objects
 * @throws Error if file exists but cannot be parsed (other than ENOENT)
 */
function readTransactions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield promises_1.default.readFile("transactions.json", "utf8");
            return JSON.parse(data);
        }
        catch (error) {
            if (error.code === "ENOENT") {
                return [];
            }
            throw error;
        }
    });
}
/**
 * Writes transactions to the JSON file storage
 *
 * Serializes transactions with 2-space indentation for readability
 *
 * Time Complexity: O(n) - Proportional to the number of transactions
 * Space Complexity: O(n) - Memory usage proportional to data size during serialization
 *
 * @param transactions - Array of Transaction objects to persist
 * @returns Promise that resolves when write operation completes
 */
function writeTransactions(transactions) {
    return __awaiter(this, void 0, void 0, function* () {
        yield promises_1.default.writeFile("transactions.json", JSON.stringify(transactions, null, 2));
    });
}
