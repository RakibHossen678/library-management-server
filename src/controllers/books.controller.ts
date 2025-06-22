import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/books.models";

export const booksRoutes = express.Router();

// create a new book
booksRoutes.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookData = req.body;
      if (
        !bookData.title ||
        !bookData.author ||
        !bookData.genre ||
        !bookData.isbn ||
        !bookData.copies
      ) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error:
            "Title, author, genre, ISBN, and number of copies are required",
        });
        return;
      }
      if (bookData.copies < 0) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: "Number of copies must be a positive number",
        });
        return;
      }

      const book = await Book.create(bookData);

      if (!book) {
        res.status(500).json({
          success: false,
          message: "Failed to create book",
          error: "Internal server error",
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);

// get all books
booksRoutes.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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
        res.status(404).json({
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
    } catch (error) {
      next(error);
    }
  }
);

// get a single book
booksRoutes.get(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookId = req.params.bookId;

      if (!bookId) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: "Book ID is required to retrieve a book",
        });
      }

      const book = await Book.findById(bookId);

      if (!book) {
        res.status(404).json({
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
    } catch (error) {
      next(error);
    }
  }
);

// update a book
booksRoutes.put(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookId = req.params.bookId;
      if (!bookId) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: "Book ID is required to update a book",
        });
      }
      const bookData = req.body;

      if (!bookData) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: "Book data is required to update a book",
        });
      }

      const book = await Book.findByIdAndUpdate(bookId, bookData, {
        new: true,
      });

      if (!book) {
        res.status(404).json({
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
    } catch (error) {
      next(error);
    }
  }
);

// delete a book
booksRoutes.delete(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bookId = req.params.bookId;

      if (!bookId) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: "Book ID is required to delete a book",
        });
      }

      const book = await Book.findByIdAndDelete(bookId);

      if (!book) {
        res.status(404).json({
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
    } catch (error) {
      next(error);
    }
  }
);
