const path = require("path");
const Product = require("../models/Product");

async function createProductMultipart(req, res) {
  try {
    // Multer file
    const file = req.file; // field name: "image"
    const { title, category, location, price, description } = req.body;
    console.log(req.body);

    if (!title || !category || !location || price === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (!file && !req.body.imageUrl) {
      // ya file gəlməlidir, ya da hazır imageUrl göndərmisən (CDN və s.)
      return res.status(400).json({ message: "Image is required" });
    }

    // Image URL hazırla
    let imageUrl = req.body.imageUrl && String(req.body.imageUrl).trim();
    if (file) {
      const base =
        process.env.BASE_URL ||
        `https://https://oneartpix.khankishiyevravan.info/`;
      imageUrl = `${base}/uploads/${encodeURIComponent(
        path.basename(file.path)
      )}`;
    }

    const product = await Product.create({
      title: String(title).trim(),
      image: imageUrl,
      category: String(category).trim(),
      location: String(location).trim(),
      price: Number(price),
      description: description ? String(description).trim() : undefined,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("createProductMultipart error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function listProducts(req, res) {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(),
  ]);

  res.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
}

async function getProduct(req, res) {
  const doc = await Product.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Product not found" });
  res.json(doc);
}

async function updateProduct(req, res) {
  // İstəsən burada da multipart dəstəyi verə bilərik (aşağıda ayrıca nümunə var)
  const patch = { ...req.body };
  if (patch.price !== undefined) patch.price = Number(patch.price);

  const doc = await Product.findByIdAndUpdate(req.params.id, patch, {
    new: true,
    runValidators: true,
  });
  if (!doc) return res.status(404).json({ message: "Product not found" });
  res.json(doc);
}

async function deleteProduct(req, res) {
  const doc = await Product.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: "Product not found" });
  res.json({ success: true });
}

module.exports = {
  createProductMultipart,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
