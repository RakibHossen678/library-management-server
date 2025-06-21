import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;
const PORT = process.env.PORT || 7000;

async function main() {
  try {
    await mongoose.connect(
      ``
    );
    console.log("Connected to MongoDB");
    server = app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
}

main();
