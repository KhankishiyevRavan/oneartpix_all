const path = require("path");

function uploadImage(req, res) {
  const file = req.file;
  if (!file) return res.status(400).json({ message: "No file provided" });

  // Public static path: /uploads/<filename>
  // BASE_URL (env) lazımdır ki tam URL qaytarılsın
  const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
  const url = `${base}/uploads/${encodeURIComponent(path.basename(file.path))}`;

  res.json({ url });
}

module.exports = { uploadImage };
