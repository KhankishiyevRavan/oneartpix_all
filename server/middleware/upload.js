const multer = require('multer');
const path = require('path');
const fs = require('fs');

function makeUploader(subfolder) {
  const root = path.join(__dirname, '..', 'uploads');
  const dir = path.join(root, subfolder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
      const base = path.basename(file.originalname || 'image', ext)
        .replace(/\s+/g, '-')
        .replace(/[^\w.-]/g, '');
      cb(null, `${Date.now()}-${base}${ext}`);
    }
  });

  const fileFilter = (_req, file, cb) => {
    const ok = /^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype);
    cb(ok ? null : new Error('Yalnız şəkil faylları qəbul olunur'), ok);
  };

  return multer({
    storage,
    fileFilter,
    limits: { files: 3, fileSize: 5 * 1024 * 1024 }, // hər fayl max 5MB
  });
}

module.exports = makeUploader;
