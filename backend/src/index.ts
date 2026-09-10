import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter } from "./middleware/rateLimit";
import router from "./routes";

if (!fs.existsSync(env.uploadsDir)) {
  fs.mkdirSync(env.uploadsDir, { recursive: true });
}

const app = express();
// behind one proxy: read the client ip from X-Forwarded-For, rateLimit needs it
app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.allowedOrigins,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
// must come before any router: authenticate reads req.cookies
app.use(cookieParser());
app.use("/uploads", express.static(env.uploadsDir));
app.use(express.static(env.publicDir));

app.use("/api", apiLimiter, router);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
