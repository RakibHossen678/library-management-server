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
exports.Borrow = void 0;
const mongoose_1 = require("mongoose");
const books_models_1 = require("./books.models");
const borrowSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Book",
        required: [true, "Book is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "At least one copy must be borrowed"],
    },
    dueDate: {
        type: Date,
        required: [true, "Due date is required"],
    },
}, {
    timestamps: true,
});
borrowSchema.post("save", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield books_models_1.Book.findById(doc.book);
        if (book) {
            book.copies -= doc.quantity;
            yield book.updateBookAvailabilityStatus();
        }
    });
});
exports.Borrow = (0, mongoose_1.model)("Borrow", borrowSchema);
