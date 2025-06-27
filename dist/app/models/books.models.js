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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Title is required"],
    },
    author: {
        type: String,
        trim: true,
        required: [true, "Author is required"],
    },
    genre: {
        type: String,
        trim: true,
        enum: [
            "FICTION",
            "NON-FICTION",
            "SCIENCE",
            "HISTORY",
            "BIOGRAPHY",
            "FANTASY",
        ],
        required: [true, "Genre is required"],
    },
    isbn: {
        type: String,
        trim: true,
        required: [true, "ISBN is required"],
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
    copies: {
        type: Number,
        required: [true, "Number of copies is required"],
        min: [0, "Copies must be a positive number"],
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
bookSchema.method("updateBookAvailabilityStatus", function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.available = this.copies > 0 ? true : false;
        yield this.save();
    });
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
