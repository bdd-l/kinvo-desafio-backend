import fs from "fs/promises";
import { Transaction } from "../entities/transaction.entity";

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
export async function readTransactions(): Promise<Transaction[]> {
  try {
    const data = await fs.readFile("transactions.json", "utf8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
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
export async function writeTransactions(
  transactions: Transaction[],
): Promise<void> {
  await fs.writeFile(
    "transactions.json",
    JSON.stringify(transactions, null, 2),
  );
}
