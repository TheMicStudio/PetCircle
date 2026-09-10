import rateLimit from "express-rate-limit";
import { env } from "../config/env";

const WINDOW_MS = 15 * 60 * 1000;

export const apiLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 300,
  skip: () => env.rateLimitDisabled,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, try again later" },
});

export const authLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 20,
  skip: () => env.rateLimitDisabled,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts, try again later" },
});
