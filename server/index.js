const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const { notFound, errorHandler } = require("./middleware/error");
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const productRoutes = require("./routes/productRoutes");

// .env faylını _bu_ qovluqdan oxu
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

/* ---------------- Core Middlewares ---------------- */
const allowlist = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean); // "http://localhost:5173,https://menu.example" -> ["http://...","https://..."]

app.use(
  cors({
    origin: (origin, cb) => {
      // Postman/CLI origin = undefined olduqda icazə ver
      if (!origin) return cb(null, true);
      if (allowlist.length === 0 || allowlist.includes(origin))
        return cb(null, true);
      return cb(new Error("CORS blocked"), false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Şəkillərə birbaşa çıxış
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ---------------- Health ---------------- */
app.get("/health", (_req, res) => res.json({ ok: true }));

/* ---------------- Routes ---------------- */
app.use("/api/roles", roleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contacts", require("./routes/contactRoutes"));
/* ---------------- Errors ---------------- */
// 404 və ümumi errorlar routelardan sonra gəlir
app.use(notFound);
app.use(errorHandler);
/* ---------------- Start Server after DB ---------------- */
const PORT = process.env.PORT || 5003;

(async () => {
  try {
    await connectDB(); // ⚠️ Gözləyirik
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Mongo connect error:", err.message);
    process.exit(1);
  }
})();
