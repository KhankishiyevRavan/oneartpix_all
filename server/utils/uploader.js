const multer = require("multer");
const path = require("path");
const fs = require("fs");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function makeUploader(subfolder) {
  const root = path.join(process.cwd(), "uploads");
  const dir = path.join(root, subfolder);
  ensureDir(dir);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const ext = (
        path.extname(file.originalname || "") || ".jpg"
      ).toLowerCase();
      const base = path
        .basename(file.originalname || "image", ext)
        .replace(/\s+/g, "-")
        .replace(/[^\w.-]/g, "");
      cb(null, `${Date.now()}-${base}${ext}`);
    },
  });

  const fileFilter = (_req, file, cb) => {
    const ok = /^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype);
    cb(ok ? null : new Error("Yalnız şəkil faylları qəbul olunur"), ok);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 15 }, // 5MB per file, max 15 fayl
  });
}

const productUpload = makeUploader("products");

module.exports = { productUpload };
