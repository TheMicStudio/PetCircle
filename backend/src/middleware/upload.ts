import { randomUUID } from "crypto";
import multer from "multer";
import { env } from "../config/env";
import { HttpError } from "../http/errors";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, env.uploadsDir);
  },
  filename: (_req, file, callback) => {
    callback(null, `${Date.now()}-${randomUUID()}${IMAGE_EXTENSIONS[file.mimetype]}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (IMAGE_EXTENSIONS[file.mimetype] === undefined) {
      callback(new HttpError(400, "Unsupported image format"));
      return;
    }

    callback(null, true);
  },
});
