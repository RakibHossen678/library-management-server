import { model, Schema } from "mongoose";
import { IBooks } from "../interface/books.interface";

const bookSchema = new Schema<IBooks>(
  {
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
  },
  {
    timestamps: true,
  }
);

export const Book = model<IBooks>("Book", bookSchema);
