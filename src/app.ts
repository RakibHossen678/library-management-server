import express, { Application, Request, Response } from "express";
import { booksRoutes } from "./controllers/books.controller";

import dotenv from "dotenv";
import { borrowRoutes } from "./controllers/borrow.controller";

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the library management system!");
});

export default app;
