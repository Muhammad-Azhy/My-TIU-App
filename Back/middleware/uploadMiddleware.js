import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safeOriginalName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeOriginalName}`);
  },
});

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
]);

const fileFilter = (_req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    return cb(null, true);
  }
  return cb(new Error("Unsupported file type"), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});
