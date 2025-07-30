/**
 * Transaction entity interface
 *
 * Represents a financial transaction with the following properties:
 * - id: Unique identifier (string)
 * - description: Brief description of the transaction
 * - price: Monetary value (positive number)
 * - transactionType: Either "income" or "expense"
 * - transactionDate: ISO 8601 formatted date string in UTC
 *
 * Time Complexity for operations: Varies by implementation
 * Space Complexity: O(1) per transaction instance
 */
export interface Transaction {
  id: string;
  description: string;
  price: number;
  transactionType: "income" | "expense";
  transactionDate: string;
}
