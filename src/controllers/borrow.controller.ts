import express, { NextFunction, Request, Response } from "express";
import { Book } from "../models/books.models";
import { Borrow } from "../models/borrow.models";

export const borrowRoutes = express.Router();

// Borrow a book
borrowRoutes.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { book, quantity, dueDate } = req.body;
      if (!dueDate || !quantity || !book) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: "Due date, quantity, and book ID are required",
        });
        return;
      }

      const findBook = await Book.findById(book);
      if (!findBook) {
        res.status(404).json({
          success: false,
          message: "Book not found",
          error: "No book found with this ID",
        });
        return;
      }

      if (findBook.copies < quantity) {
        res.status(400).json({
          success: false,
          message: "Insufficient quantity",
          error: "Not enough copies of the book available",
        });
        return;
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
