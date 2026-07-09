import multer from "multer";

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
      return cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }

    cb(null, true);
  },
});
