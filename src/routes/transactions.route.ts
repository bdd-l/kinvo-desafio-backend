import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { validateTransaction } from "../utils/validateTransaction";

const prisma = new PrismaClient();
const router = Router();

// Helper function to handle Prisma errors consistently
const handlePrismaError = (res: any, operation: string, error: unknown) => {
  console.error(`Error ${operation} transaction:`, error);
  return res.status(500).json({
    error: `Failed to ${operation} transaction. Please try again later.`,
  });
};

// GET all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await prisma.transactionMovement.findMany();
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

    const newTransaction = {
      ...validationResult.data,
      id: Date.now().toString(),
    };

    const createdTransaction = await prisma.transactionMovement.create({
      data: newTransaction,
    });

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
    const existing = await prisma.transactionMovement.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        error: `Transaction with ID "${id}" not found`,
      });
    }

    await prisma.transactionMovement.delete({
      where: { id },
    });

    return res.sendStatus(204);
  } catch (error) {
    return handlePrismaError(res, "delete", error);
  }
});

// PUT updates an existing transaction
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const validationResult = validateTransaction(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: validationResult.error,
      });
    }

    // Check if transaction exists first
    const existing = await prisma.transactionMovement.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        error: `Transaction with ID "${id}" not found`,
      });
    }

    // CRITICAL FIX: Remove id from the validation data
    // This prevents Prisma from trying to update the ID field
    const { id: _, ...updateData } = validationResult.data;

    const updatedTransaction = await prisma.transactionMovement.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updatedTransaction);
  } catch (error) {
    return handlePrismaError(res, "update", error);
  }
});
export default router;
