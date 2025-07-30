export interface Transaction {
  id: string;
  description: string;
  price: number;
  transactionType: "income" | "expense";
  transactionDate: string;
}
