import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
import { connectToDatabase } from "./config/database.js";

dotenv.config();

const port = parseInt(process.env.PORT || "3000", 10);
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Routes
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});
app.get("/", (req, res) => {
  res.send("The Server is running : Use /api to Run Tests");
});

app.use(errorHandler);

app
  .listen(port, async () => {
    await connectToDatabase();
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Backend allowed client: ${process.env.CLIENT_URL}`);
  })
  .on("error", (err) => {
    if (err.code === "EACCES") {
      console.log(`Port ${port} requires elevated privileges.`);
    } else {
      console.error("Server error:", err);
    }
  });
