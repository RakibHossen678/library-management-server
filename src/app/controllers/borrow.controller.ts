import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/books.models";
import { Borrow } from "../models/borrow.models";
import { appError } from "../../utils/appError";

export const borrowRoutes = express.Router();

// Borrow a book
borrowRoutes.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { book, quantity, dueDate } = req.body;
      if (!dueDate || !quantity || !book) {
        return appError(
          res,
          "Validation failed",
          "All fields are required",
          400
        );
      }

      const findBook = await Book.findById(book);
      if (!findBook) {
        return appError(
          res,
          "Book not found",
          "No book found with this ID",
          404
        );
      }

      if (findBook.copies < quantity) {
        return appError(
          res,
          "Validation failed",
          "Not enough copies available",
          400
        );
      }

      const borrow = await Borrow.create(req.body);

      res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: borrow,
      });
    } catch (error) {
      next(error);
    }
  }
);

// borrowed book summary
borrowRoutes.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: "$book",
      },
      {
        $project: {
          book: {
            title: "$book.title",
            isbn: "$book.isbn",
          },
          _id: 0,
          totalQuantity: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary,
    });
  }
);
