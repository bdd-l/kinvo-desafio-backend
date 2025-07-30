import fs from "fs/promises";
import { Transaction } from "../entities/transaction.entity";

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

export async function writeTransactions(
  transactions: Transaction[],
): Promise<void> {
  await fs.writeFile(
    "transactions.json",
    JSON.stringify(transactions, null, 2),
  );
}
