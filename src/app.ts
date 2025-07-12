import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import cors from "cors";

import dotenv from "dotenv";
import { booksRoutes } from "./app/controllers/books.controller";
import { borrowRoutes } from "./app/controllers/borrow.controller";

dotenv.config();

const app: Application = express();

app.use(cors());

app.use(express.json());

app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the library management system!");
});

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error,
    });
  }

  res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
    success: false,
    error: error,
  });
};

app.use(globalErrorHandler as ErrorRequestHandler);

export default app;
