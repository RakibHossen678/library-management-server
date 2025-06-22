import { Model } from "mongoose";

export interface IBooks {
  title: string;
  author: string;
  genre:
    | "FICTION"
    | "NON-FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
}

export interface bookMethods {
  updateBookAvailabilityStatus(): Promise<void>;
}
