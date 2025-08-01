import { Router } from "express";
import { TransactionService } from "../services/transactions.service";
import {
  validateTransaction,
  validatePartialTransaction,
} from "../utils/validateTransaction";
import { handlePrismaError } from "../utils/handlePrismaError";
import { RateLimiter } from "../middleware/rateLimiter"; // Add this import

/**
 * Creates and configures the transaction routes with rate limiting
 *
 * This router handles all transaction-related HTTP requests with rate limiting
 * to prevent abuse, while delegating database operations to the TransactionService.
 *
 * Time Complexity: O(1) for all route handlers (service methods are O(1))
 * Space Complexity: O(n) where n is the number of transactions returned
 */
const router = Router();
const transactionService = new TransactionService();

// Add rate limiting middleware - 10 requests per minute, block for 1 hour
const transactionRateLimiter = new RateLimiter(10, 60000, 3600000);
router.use(transactionRateLimiter.limit);

// GET all transactions with optional pagination
router.get("/", async (req, res) => {
  try {
    const { page, limit } = req.query;

    // Check if pagination parameters were provided
    if (page !== undefined || limit !== undefined) {
      // Parse and validate parameters
      const pageInt = page ? parseInt(page as string) : 1;
      const limitInt = limit ? parseInt(limit as string) : 10; // Default to 10 for pagination

      // Validate parameters
      if (isNaN(pageInt) || pageInt < 1) {
        return res.status(400).json({
          error: "Page must be a positive integer",
        });
      }

      if (isNaN(limitInt) || limitInt < 1 || limitInt > 10) {
        return res.status(400).json({
          error: "Limit must be between 1 and 10",
        });
      }

      // Get paginated transactions
      const result = await transactionService.getPaginatedTransactions(
        pageInt,
        limitInt,
      );
      return res.json(result);
    }

    // No pagination parameters provided
    const transactions = await transactionService.getAllTransactions();
    return res.json(transactions);
  } catch (error) {
    return handlePrismaError(res, "retrieve", error);
  }
});

// POST a new transaction
router.post("/", async (req, res) => {
  try {
    const validationResult = validateTransaction(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: validationResult.error,
      });
    }
    // Add ID to the transaction
    const newTransaction = {
      ...validationResult.data,
      id: crypto.randomUUID(),
    };
    const createdTransaction =
      await transactionService.createTransaction(newTransaction);
    return res.status(201).json(createdTransaction);
  } catch (error) {
    return handlePrismaError(res, "save", error);
  }
});

// DELETE a transaction by ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // Check if transaction exists first for better error messaging
    const exists = await transactionService.transactionExists(id);
    if (!exists) {
      return res.status(404).json({
        error: `Transaction with ID "${id}" not found`,
      });
    }
    await transactionService.deleteTransaction(id);
    return res.sendStatus(204);
  } catch (error) {
    return handlePrismaError(res, "delete", error);
  }
});

// PATCH updates an existing transaction with partial data
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const validationResult = validatePartialTransaction(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: validationResult.error,
      });
    }
    // Check if transaction exists first
    const exists = await transactionService.transactionExists(id);
    if (!exists) {
      return res.status(404).json({
        error: `Transaction with ID "${id}" not found`,
      });
    }
    const updateData = validationResult.data;
    const updatedTransaction = await transactionService.updateTransaction(
      id,
      updateData,
    );
    return res.status(200).json(updatedTransaction);
  } catch (error) {
    return handlePrismaError(res, "update", error);
  }
});

// Export rate limiter for graceful shutdown if needed
export { transactionRateLimiter };
export default router;
