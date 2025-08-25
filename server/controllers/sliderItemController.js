// controllers/slider.controller.js
const mongoose = require("mongoose");
const SliderItem = require("../models/SliderItem");
const Product = require("../models/Product");

// Tək item əlavə (sən artıq yazmışdınsa, bunu saxla)
async function addItem(req, res) {
  const { productId, order = 100, visible = true } = req.body || {};
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "productId düzgün deyil" });
  }
  const exists = await SliderItem.findOne({ productId });
  if (exists)
    return res.status(409).json({ message: "Bu məhsul artıq slayderdadır" });
  const prod = await Product.findById(productId);
  if (!prod) return res.status(404).json({ message: "Product tapılmadı" });

  const item = await SliderItem.create({ productId, order, visible });
  res.status(201).json({ item });
}

// Siyahı
async function listItems(_req, res) {
  const items = await SliderItem.find()
    .sort({ order: 1, updatedAt: -1 })
    .populate("productId", "title slug mainImage images description");
  res.json({ items });
}

// Yenilə
async function updateItem(req, res) {
  const { itemId } = req.params;
  const { order, visible } = req.body || {};
  const $set = {};
  if (typeof order === "number") $set.order = order;
  if (typeof visible === "boolean") $set.visible = visible;

  const item = await SliderItem.findByIdAndUpdate(
    itemId,
    { $set },
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: "Slide tapılmadı" });
  res.json({ item });
}

// Sil
async function removeItem(req, res) {
  const { itemId } = req.params;
  const r = await SliderItem.findByIdAndDelete(itemId);
  if (!r) return res.status(404).json({ message: "Slide tapılmadı" });
  res.json({ ok: true });
}

// Front feed
async function feed(_req, res) {
  const items = await SliderItem.find({ visible: true })
    .sort({ order: 1, updatedAt: -1 })
    .limit(20)
    .populate("productId", "title slug mainImage images description")
    .lean();

  const dto = items.map((it) => {
    const p = it.productId || {};
    const image = p.mainImage || (Array.isArray(p.images) ? p.images[0] : "");
    const url = p.slug ? `/gallery/${p.slug}` : `/gallery/${p._id}`;
    return {
      _id: String(p._id),
      title: p.title,
      description: p.description,
      image,
      ctaLabel: "See more",
      ctaUrl: url,
    };
  });
  res.json({ items: dto });
}

// BULK əlavə
async function addMany(req, res) {
  try {
    const {
      productIds = [],
      visible = true,
      startAt = null,
      endAt = null,
      ctaLabel = null,
      ctaUrl = null,
      baseOrder = 100,
      orderStep = 10,
    } = req.body || {};

    const raw = Array.isArray(productIds) ? productIds : [];
    const invalid = [];
    const ids = [...new Set(raw.map(String))].filter((id) => {
      const ok = mongoose.isValidObjectId(id);
      if (!ok) invalid.push(id);
      return ok;
    });
    if (ids.length === 0)
      return res.status(400).json({ message: "productIds boşdur", invalid });

    const [existing, found] = await Promise.all([
      SliderItem.find({ productId: { $in: ids } }).select("productId"),
      Product.find({ _id: { $in: ids } }).select("_id"),
    ]);
    const existsSet = new Set(existing.map((x) => String(x.productId)));
    const foundSet = new Set(found.map((x) => String(x._id)));

    const toCreate = ids.filter((id) => !existsSet.has(id) && foundSet.has(id));
    const docs = toCreate.map((pid, i) => ({
      productId: pid,
      order: baseOrder + i * orderStep,
      visible,
      startAt: startAt ? new Date(startAt) : null,
      endAt: endAt ? new Date(endAt) : null,
      ctaLabel: ctaLabel ?? null,
      ctaUrl: ctaUrl ?? null,
    }));

    const created = docs.length
      ? await SliderItem.insertMany(docs, { ordered: false })
      : [];
    res.status(201).json({
      createdCount: created.length,
      created,
      skipped: {
        invalid,
        notFound: ids.filter((id) => !foundSet.has(id)),
        exists: ids.filter((id) => existsSet.has(id)),
      },
    });
  } catch (e) {
    console.error("[addMany] error:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  addItem,
  listItems,
  updateItem,
  removeItem,
  feed,
  addMany,
};
