import express, { Request, Response } from "express";
import { Book } from "../models/books.models";

export const booksRoutes = express.Router();

// create a new book
booksRoutes.post("/", async (req: Request, res: Response) => {
  const bookData = req.body;
  if (
    !bookData.title ||
    !bookData.author ||
    !bookData.genre ||
    !bookData.isbn ||
    !bookData.copies
  ) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: "Title, author, genre, ISBN, and number of copies are required",
    });
  }
  if (bookData.copies < 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: "Number of copies must be a positive number",
    });
  }

  const book = await Book.create(bookData);

  if (!book) {
    return res.status(500).json({
      success: false,
      message: "Failed to create book",
      error: "Internal server error",
    });
  }

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

  if (!books || books.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No books found",
      error: "No books match the specified criteria",
    });
  }

  res.status(200).json({
    success: true,
    message: "Books fetched successfully",
    data: books,
  });
});

// get a single book
booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  if (!bookId) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: "Book ID is required to retrieve a book",
    });
  }

  const book = await Book.findById(bookId);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
      error: "No book found with the specified ID",
    });
  }

  res.status(200).json({
    success: true,
    message: "Book retrieved successfully",
    data: book,
  });
});

// update a book
booksRoutes.put("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  if (!bookId) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: "Book ID is required to update a book",
    });
  }
  const bookData = req.body;

  if (!bookData) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: "Book data is required to update a book",
    });
  }

  const book = await Book.findByIdAndUpdate(bookId, bookData, { new: true });

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
      error: "No book found with the specified ID",
    });
  }

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    data: book,
  });
});

// delete a book
booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  if (!bookId) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: "Book ID is required to delete a book",
    });
  }

  const book = await Book.findByIdAndDelete(bookId);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
      error: "No book found with the specified ID",
    });
  }

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    data: null,
  });
});
