import { model, Schema } from "mongoose";
import { IBorrow } from "../interface/borrow.model";
import { Book } from "./books.models";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

// borrowSchema.post("save", async function (doc) {
//   const book = await Book.findById(doc.book);
//   if (book) {
//     book.copies -= doc.quantity;
//     await updateBookAvailabilityStatus(book);
//   }
// });

export const Borrow = model<IBorrow>("Borrow", borrowSchema);
