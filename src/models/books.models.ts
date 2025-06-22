import { model, Model, Schema } from "mongoose";
import { bookMethods, IBooks } from "../interface/books.interface";

const bookSchema = new Schema<IBooks, Model<IBooks>, bookMethods>(
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

bookSchema.method("updateBookAvailabilityStatus", async function () {
  this.available = this.copies > 0 ? true : false;
  await this.save();
});

export const Book = model<IBooks>("Book", bookSchema);
