import { HttpError } from "../http/errors";
import { ErrorRequestHandler } from "express";
import { MulterError } from "multer";


// turns an error into a JSON answer, always the last middleware
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message, fields: error.fields });
    return;
  }

  if (error instanceof MulterError) {
    res.status(400).json({ error: "Invalid or oversized file" });
    return;
  }

  // express.json() throws when the JSON is broken: this is a client error
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ error: "Malformed JSON body" });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
};
