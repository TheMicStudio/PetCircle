import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import router from "./routes";

if (!fs.existsSync(env.uploadsDir)) {
  fs.mkdirSync(env.uploadsDir, { recursive: true });
}

const app = express();

app.use(
  cors({
    origin: env.allowedOrigins,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(env.uploadsDir));
app.use(express.static(env.publicDir));

app.use("/api", router);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
