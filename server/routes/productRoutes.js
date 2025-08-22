const express = require("express");
const Product = require("../models/Product");
const { productUpload } = require("../utils/uploader");

const router = express.Router();

function toPublicUrl(req, relativePath) {
  const base =
    process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
  const clean = String(relativePath).replace(/\\/g, "/").replace(/^\/+/, "");
  return `${base}/${clean}`;
}

/**
 * POST /api/products/form-data
 * Fields:
 * - mainImage: single file
 * - images: multiple
 * - title, category, location, price, description
 */
router.post(
  "/form-data",
  productUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 12 },
  ]),
  async (req, res) => {
    const { title, category, location, description } = req.body;
    const price = Number(req.body.price);

    if (!title || !title.trim())
      return res.status(400).json({ message: "Title tələb olunur" });
    if (!category || !category.trim())
      return res.status(400).json({ message: "Category tələb olunur" });
    if (!location || !location.trim())
      return res.status(400).json({ message: "Location tələb olunur" });
    if (!Number.isFinite(price))
      return res.status(400).json({ message: "Price düzgün deyil" });

    const mainF = req.files?.mainImage?.[0];
    if (!mainF)
      return res.status(400).json({ message: "Main image tələb olunur" });

    const gallery = req.files?.images || [];

    const mainImageUrl = toPublicUrl(req, `uploads/products/${mainF.filename}`);
    const imageUrls = gallery.map((f) =>
      toPublicUrl(req, `uploads/products/${f.filename}`)
    );

    const doc = await Product.create({
      title: title.trim(),
      mainImage: mainImageUrl,
      images: imageUrls,
      category: category.trim(),
      location: location.trim(),
      price,
      description: (description || "").toString(),
    });

    return res.status(201).json(doc);
  }
);

/** GET /api/products? page,pageSize,q,category,location,sort(new|priceAsc|priceDesc) */
router.get("/", async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 12));
  const q = (req.query.q || "").toString();
  const category = (req.query.category || "").toString();
  const location = (req.query.location || "").toString();
  const sort = (req.query.sort || "new").toString();

  const filter = {};
  if (q) filter.title = { $regex: q, $options: "i" };
  if (category) filter.category = category;
  if (location) filter.location = location;

  let sortObj = { createdAt: -1 };
  if (sort === "priceAsc") sortObj = { price: 1 };
  if (sort === "priceDesc") sortObj = { price: -1 };

  const [data, total] = await Promise.all([
    Product.find(filter)
      .sort(sortObj)
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    Product.countDocuments(filter),
  ]);

  res.json({ data, total, page, pageSize });
});

/** GET /api/products/:id */
router.get("/:id", async (req, res) => {
  const doc = await Product.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Tapılmadı" });
  res.json(doc);
});

/** DELETE /api/products/:id */
router.delete("/:id", async (req, res) => {
  const doc = await Product.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: "Tapılmadı" });
  res.json({ ok: true });
});
// JSON update (yalnız mətn / qiymət)
router.patch("/:id", async (req, res) => {
  const body = {};
  if (req.body.title !== undefined) body.title = String(req.body.title).trim();
  if (req.body.category !== undefined)
    body.category = String(req.body.category).trim();
  if (req.body.location !== undefined)
    body.location = String(req.body.location).trim();
  if (req.body.price !== undefined) {
    const price = Number(req.body.price);
    if (!Number.isFinite(price))
      return res.status(400).json({ message: "Price düzgün deyil" });
    body.price = price;
  }
  if (req.body.description !== undefined)
    body.description = String(req.body.description);

  const doc = await Product.findByIdAndUpdate(req.params.id, body, {
    new: true,
  });
  if (!doc) return res.status(404).json({ message: "Tapılmadı" });
  res.json(doc);
});

// Multipart update (şəkilləri əvəzlə / əlavə et + keepImages)
router.patch(
  "/:id/form-data",
  productUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 20 }
  ]),
  async (req, res) => {
    const body = {};
    if (req.body.title !== undefined) body.title = String(req.body.title).trim();
    if (req.body.category !== undefined) body.category = String(req.body.category).trim();
    if (req.body.location !== undefined) body.location = String(req.body.location).trim();
    if (req.body.price !== undefined) {
      const n = Number(req.body.price);
      if (!Number.isFinite(n)) return res.status(400).json({ message: "Price düzgün deyil" });
      body.price = n;
    }
    if (req.body.description !== undefined) body.description = String(req.body.description);

    const mainF = req.files?.mainImage?.[0];
    const galleryFiles = (req.files?.images || []);

    // keepImages sahəsini oxu (bir və ya bir neçə field kimi gələ bilər)
    let keepImages = req.body.keepImages;
    if (keepImages && !Array.isArray(keepImages)) keepImages = [keepImages];
    if (!Array.isArray(keepImages)) keepImages = [];

    // Main image: varsa əvəzlə
    if (mainF) {
      body.mainImage = toPublicUrl(req, `uploads/products/${mainF.filename}`);
    }

    // Qalereya məntiqi:
    // - keepImages: qalacaq köhnə URL-lər
    // - galleryFiles: yeni yüklənənlər (əlavə)
    const newGalleryUrls = galleryFiles.map((f) => toPublicUrl(req, `uploads/products/${f.filename}`));

    if (keepImages.length || newGalleryUrls.length) {
      body.images = [...keepImages, ...newGalleryUrls];
    }

    const doc = await Product.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!doc) return res.status(404).json({ message: "Tapılmadı" });
    res.json(doc);
  }
);


module.exports = router;
