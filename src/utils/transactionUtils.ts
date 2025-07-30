import { Transaction } from "../entities/transaction.entity";
import { Response } from "express";

/**
 * Finds the index of a transaction by ID in the array
 *
 * For small datasets (< 100 items), uses linear search (O(n) but with low constant factors)
 * For larger datasets, uses a Map for O(1) lookup
 *
 * Time Complexity: O(n) for small datasets, O(1) for larger ones
 * Space Complexity: O(1) for small datasets, O(n) for larger ones (temporary map)
 *
 * @param transactions Array of transactions to search
 * @param id ID of the transaction to find
 * @returns Index of the transaction or -1 if not found
 */
export const findTransactionIndex = (
  transactions: Transaction[],
  id: string,
): number => {
  // For small datasets, linear search is actually more efficient than building a map
  // due to lower constant factors
  if (transactions.length < 100) {
    return transactions.findIndex((transaction) => transaction.id === id);
  }

  // For larger datasets, create a temporary map
  const idMap = new Map<string, number>();
  for (let i = 0; i < transactions.length; i++) {
    idMap.set(transactions[i].id, i);
  }

  return idMap.has(id) ? idMap.get(id)! : -1;
};

/**
 * Gets a transaction by ID with error handling
 *
 * Time Complexity: O(n) for small datasets, O(1) for larger ones
 * Space Complexity: O(1) for small datasets, O(n) for larger ones
 *
 * @param transactions Array of transactions
 * @param id ID of the transaction to find
 * @param res Express response object for error handling
 * @returns Object containing transaction and index, or null if not found
 */
export const getTransactionById = (
  transactions: Transaction[],
  id: string,
  res: Response,
): { transaction: Transaction; index: number } | null => {
  const index = findTransactionIndex(transactions, id);
  if (index === -1) {
    res.status(404).json({
      error: `Transaction with ID "${id}" not found`,
    });
    return null;
  }
  return {
    transaction: transactions[index],
    index,
  };
};
