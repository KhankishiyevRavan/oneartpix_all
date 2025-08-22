// controllers/contactController.js
const ContactMessage = require("../models/ContactMessage");

const validate = ({ name, email, message }) => {
  if (!name || name.trim().length < 2) return "Name is required (min 2 chars).";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Email is invalid.";
  if (!message || message.trim().length < 5)
    return "Message must be at least 5 characters.";
  return null;
};

exports.createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    const err = validate({ name, email, message });
    if (err) return res.status(400).json({ message: err });

    const doc = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "",
    });

    return res.status(201).json({ ok: true, id: doc._id });
  } catch (e) {
    console.error("[createContact] error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.listContacts = async (_req, res) => {
  console.log("[listContacts] test"); // ✅ BUNU MÜTLƏQ GÖRMƏLİSƏN
  try {
    const items = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(200);
    console.log("[listContacts] count:", items.length);
    res.json({ items });
  } catch (e) {
    console.error("[listContacts] error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getContact = async (req, res) => {
  try {
    const item = await ContactMessage.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ item });
  } catch (e) {
    console.error("[getContact] error:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};
