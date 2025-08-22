// routes/contactRoutes.js
const express = require("express");
const router = express.Router();

const contactCtrl = require("../controllers/contactController");

// ✅ Logger: bu fayla qoy ki, hər request görünsün
router.use((req, _res, next) => {
  console.log(`[contactRoutes] ${req.method} ${req.originalUrl}`);
  next();
});

router.get("/", contactCtrl.listContacts);
router.get("/:id", contactCtrl.getContact);
router.post("/", contactCtrl.createContact);

module.exports = router;
