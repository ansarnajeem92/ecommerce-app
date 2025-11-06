import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import { createTable } from "./models/productModel.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);

createTable();

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
