const { Router } = require("express");
const { upload } = require("../middleware/upload");
const { uploadImage } = require("../controllers/uploadController");

const router = Router();

// POST /api/uploads  (form-data: file=<image>)
router.post("/", upload.single("file"), uploadImage);

module.exports = router;
