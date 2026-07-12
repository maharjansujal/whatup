import multer from "multer";
import { createAppError } from "../errors/appError";

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  // Images
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",

  // Videos
  "video/mp4",
  "video/webm",
  "video/quicktime",

  // Audio
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/webm",
  "audio/aac",
  "audio/flac",
  "audio/x-flac",

  // Source code
  "text/javascript", // .js
  "application/javascript", // .js
  "text/typescript", // .ts
  "application/typescript", // .ts (rare)
  "text/x-typescript", // .ts (older)
  "text/jsx", // .jsx (rare)
  "text/tsx", // .tsx (rare)
  "text/x-python", // .py
  "text/x-java-source", // .java
  "text/x-c", // .c
  "text/x-c++src", // .cpp
  "application/json", // .json
  "text/html", // .html
  "text/css", // .css
  "text/markdown", // .md

  // Documents
  "application/pdf",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",

  // Microsoft Office
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

export const upload = multer({
  storage,

  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB per file
    files: 10,
  },

  fileFilter(req, file, cb) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(createAppError(`Unsupported file type: ${file.mimetype}`, 400));
    }

    cb(null, true);
  },
});
