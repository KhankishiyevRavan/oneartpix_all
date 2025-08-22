function notFound(_req, res) {
  res.status(404).json({ message: "Route tapılmadı" });
}

function errorHandler(err, _req, res, _next) {
  console.error(err);
  if (err?.message?.includes("Yalnız şəkil faylları")) {
    return res
      .status(400)
      .json({ message: "Yalnız şəkil faylları qəbul olunur" });
  }
  res.status(500).json({ message: err?.message || "Server xətası" });
}

module.exports = { notFound, errorHandler };
