import { Router } from "express";
import { generateId } from "../utils/generateId";
import { readTransactions, writeTransactions } from "../utils/fileOperations";
import { validateTransaction } from "../utils/validateTransaction";

const router = Router();

// GET /transactions - Retrieve all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await readTransactions();
    res.json(transactions);
  } catch (err) {
    console.error("Failed to read transactions:", err);
    res.status(500).json({ error: "Failed to retrieve transactions" });
  }
});

// POST /transactions - Register new transaction
router.post("/", async (req, res) => {
  const validationResult = validateTransaction(req.body);

  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error });
  }

  // Generate UUIDv4 and construct transaction
  const { id: _, ...cleanData } = validationResult.data;
  const newTransaction = {
    id: generateId(),
    ...cleanData,
  };

  try {
    // Read existing transactions with concurrency safety
    let transactions = await readTransactions();

    // Append new transaction
    transactions.push(newTransaction);

    // Persist to disk with atomic write
    await writeTransactions(transactions);

    res.status(201).json(newTransaction);
  } catch (err) {
    console.error("Storage error:", err);
    res.status(500).json({
      error: "Failed to save transaction. Please try again later.",
    });
  }
});

export default router;
