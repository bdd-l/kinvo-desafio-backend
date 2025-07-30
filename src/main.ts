import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();
const PORT = Number(process.env.APPLICATION_PORT) || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Register routes
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
