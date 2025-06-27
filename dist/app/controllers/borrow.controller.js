"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_models_1 = require("../models/books.models");
const borrow_models_1 = require("../models/borrow.models");
const appError_1 = require("../../utils/appError");
exports.borrowRoutes = express_1.default.Router();
// Borrow a book
exports.borrowRoutes.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = req.body;
        if (!dueDate || !quantity || !book) {
            return (0, appError_1.appError)(res, "Validation failed", "All fields are required", 400);
        }
        const findBook = yield books_models_1.Book.findById(book);
        if (!findBook) {
            return (0, appError_1.appError)(res, "Book not found", "No book found with this ID", 404);
        }
        if (findBook.copies < quantity) {
            return (0, appError_1.appError)(res, "Validation failed", "Not enough copies available", 400);
        }
        const borrow = yield borrow_models_1.Borrow.create(req.body);
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow,
        });
    }
    catch (error) {
        next(error);
    }
}));
// borrowed book summary
exports.borrowRoutes.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const summary = yield borrow_models_1.Borrow.aggregate([
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
}));
