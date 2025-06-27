import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/books.models";
import { appError } from "../../utils/appError";

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
        return appError(
          res,
          "Validation failed",
          "All fields are required",
          400
        );
      }
      if (bookData.copies < 0) {
        return appError(
          res,
          "Validation failed",
          "Copies must be greater than 0"
        );
      }

      const book = await Book.create(bookData);

      if (!book) {
        return appError(
          res,
          "Book creation failed",
          "Failed to create book",
          500
        );
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
        appError(res, "No books found", "No books found", 404);
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
        return appError(
          res,
          "Validation failed",
          "Book ID is required to get a book",
          400
        );
      }

      const book = await Book.findById(bookId);

      if (!book) {
        return appError(
          res,
          "Book not found",
          "No book found with this ID",
          404
        );
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
        return appError(
          res,
          "Validation failed",
          "Book ID is required to update a book",
          400
        );
      }
      const bookData = req.body;

      if (!bookData) {
        return appError(
          res,
          "Validation failed",
          "Book data is required to update a book",
          400
        );
      }

      const book = await Book.findByIdAndUpdate(bookId, bookData, {
        new: true,
      });

      if (!book) {
        return appError(
          res,
          "Book not found",
          "No book found with this ID",
          404
        );
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
        return appError(
          res,
          "Validation failed",
          "Book ID is required to delete a book",
          400
        );
      }

      const book = await Book.findByIdAndDelete(bookId);

      if (!book) {
        return appError(
          res,
          "Book not found",
          "No book found with this ID",
          404
        );
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
