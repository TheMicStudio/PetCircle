import path from "path";
import { randomUUID } from "crypto";
import multer from "multer";
import { env } from "../config/env";
import { HttpError } from "../http/errors";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, env.uploadsDir);
  },
  // Le nom d'origine vient du client : on n'en garde que l'extension.
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      callback(new HttpError(400, "Unsupported image format"));
      return;
    }

    callback(null, true);
  },
});
