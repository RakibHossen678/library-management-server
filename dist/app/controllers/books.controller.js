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
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_models_1 = require("../models/books.models");
const appError_1 = require("../../utils/appError");
exports.booksRoutes = express_1.default.Router();
// create a new book
exports.booksRoutes.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookData = req.body;
        if (!bookData.title ||
            !bookData.author ||
            !bookData.genre ||
            !bookData.isbn ||
            !bookData.copies) {
            return (0, appError_1.appError)(res, "Validation failed", "All fields are required", 400);
        }
        if (bookData.copies < 0) {
            return (0, appError_1.appError)(res, "Validation failed", "Copies must be greater than 0");
        }
        const book = yield books_models_1.Book.create(bookData);
        if (!book) {
            return (0, appError_1.appError)(res, "Book creation failed", "Failed to create book", 500);
        }
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
// get all books
exports.booksRoutes.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = req.query.filter;
        const sortBy = req.query.sortBy;
        const sort = req.query.sort === "desc" ? -1 : 1;
        const limit = parseInt(req.query.limit) || 10;
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        const books = yield books_models_1.Book.find(query)
            .sort({ [sortBy]: sort })
            .limit(limit);
        if (!books || books.length === 0) {
            (0, appError_1.appError)(res, "No books found", "No books found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Books fetched successfully",
            data: books,
        });
    }
    catch (error) {
        next(error);
    }
}));
// get a single book
exports.booksRoutes.get("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        if (!bookId) {
            return (0, appError_1.appError)(res, "Validation failed", "Book ID is required to get a book", 400);
        }
        const book = yield books_models_1.Book.findById(bookId);
        if (!book) {
            return (0, appError_1.appError)(res, "Book not found", "No book found with this ID", 404);
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
// update a book
exports.booksRoutes.put("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        if (!bookId) {
            return (0, appError_1.appError)(res, "Validation failed", "Book ID is required to update a book", 400);
        }
        const bookData = req.body;
        if (!bookData) {
            return (0, appError_1.appError)(res, "Validation failed", "Book data is required to update a book", 400);
        }
        const book = yield books_models_1.Book.findByIdAndUpdate(bookId, bookData, {
            new: true,
        });
        if (!book) {
            return (0, appError_1.appError)(res, "Book not found", "No book found with this ID", 404);
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
// delete a book
exports.booksRoutes.delete("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        if (!bookId) {
            return (0, appError_1.appError)(res, "Validation failed", "Book ID is required to delete a book", 400);
        }
        const book = yield books_models_1.Book.findByIdAndDelete(bookId);
        if (!book) {
            return (0, appError_1.appError)(res, "Book not found", "No book found with this ID", 404);
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
}));
