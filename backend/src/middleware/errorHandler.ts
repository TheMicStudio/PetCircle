import { HttpError } from "../http/errors";
import { ErrorRequestHandler } from "express";
import { MulterError } from "multer";


export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message, fields: error.fields });
    return;
  }

  if (error instanceof MulterError) {
    res.status(400).json({ error: "Invalid or oversized file" });
    return;
  }

  // express.json() lève une SyntaxError portant le corps reçu : c'est une
  // erreur du client, pas une panne serveur.
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ error: "Malformed JSON body" });
    return;
  }

  console.error(error);
  res.status(500).json({ error: "Internal server error" });
};
