import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;
const PORT = process.env.PORT || 7000;

async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://librarayMangement:qfYZjkZBvYZ4X9QE@cluster0.nbqp0.mongodb.net/libraryManagement?retryWrites=true&w=majority&appName=Cluster0`
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
