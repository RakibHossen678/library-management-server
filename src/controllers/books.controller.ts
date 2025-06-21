import express, { Request, Response } from "express";
import { Book } from "../models/books.models";

export const booksRoutes = express.Router();

// create a new book
booksRoutes.post("/", async (req: Request, res: Response) => {
  const bookData = req.body;

  const book = await Book.create(bookData);

  res.status(201).json({
    success: true,
    message: "Book created successfully",
    data: book,
  });
});

// get all books
booksRoutes.get("/", async (req: Request, res: Response) => {
  const filter = req.query.filter;
  const sortBy = req.query.sortBy;
  const sort = req.query.sort === "desc" ? -1 : 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const query: any = {};

  if (filter) {
    query.genre = filter;
  }

  const books = await Book.find(query)
    .sort({ [sortBy as string]: sort })
    .limit(limit);

  res.status(200).json({
    success: true,
    message: "Books fetched successfully",
    data: books,
  });
});
