import { Router } from "express";
import { readTransactions, writeTransactions } from "../utils/fileOperations";
import { validateTransaction } from "../utils/validateTransaction";
import { getTransactionById } from "../utils/transactionUtils";

const router = Router();

// GET all completed transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await readTransactions();
    res.json(transactions);
  } catch (error) {
    console.error("Error reading transactions:", error);
    res.status(500).json({
      error: "Failed to retrieve transactions. Please try again later.",
    });
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

    const transactions = await readTransactions();
    const newTransaction = {
      ...validationResult.data,
      id: Date.now().toString(),
    };

    transactions.push(newTransaction);
    await writeTransactions(transactions);

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({
      error: "Failed to save transaction. Please try again later.",
    });
  }
});

// DELETE Deletes a transaction by its unique identifier
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const transactions = await readTransactions();

    // Check if transaction exists
    const result = getTransactionById(transactions, id, res);
    if (!result) return; // Error response already sent

    // Remove the transaction from the collection
    transactions.splice(result.index, 1);
    await writeTransactions(transactions);

    // 204 No Content - successful deletion with no response body
    // This follows HTTP specification for successful DELETE operations
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({
      error: "Failed to process transaction deletion. Please try again later.",
    });
  }
});

// PUT Updates an existing transaction with new data
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const validationResult = validateTransaction(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: validationResult.error,
      });
    }

    const transactions = await readTransactions();

    // Check if transaction exists
    const result = getTransactionById(transactions, id, res);
    if (!result) return; // Error response already sent

    // Create updated transaction while preserving the original ID
    const updatedTransaction = {
      ...validationResult.data,
      id: result.transaction.id,
    };

    transactions[result.index] = updatedTransaction;
    await writeTransactions(transactions);

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({
      error: "Failed to update transaction. Please try again later.",
    });
  }
});

export default router;
