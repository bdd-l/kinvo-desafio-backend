import { Router } from "express";
import transactionsRouter from "./transactions.route";

const router = Router();

router.use("/transactions", transactionsRouter);

export default router;
