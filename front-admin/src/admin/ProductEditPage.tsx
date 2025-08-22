import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productService } from "../services/productService";

type Product = Awaited<ReturnType<typeof productService.getById>>;
type SendState = "idle" | "saving";

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SendState>("idle");
  const [err, setErr] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);

  // editable fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");

  // images state
  const [mainImageFile, setMainImageFile] = useState<File | null>(null); // replace main
  const [gallery, setGallery] = useState<string[]>([]); // existing gallery URLs
  const [selectedRemove, setSelectedRemove] = useState<Set<string>>(new Set()); // URLs to remove
  const [addImageFiles, setAddImageFiles] = useState<File[]>([]); // new files to append

  const mainPreview = useMemo(
    () => (mainImageFile ? URL.createObjectURL(mainImageFile) : ""),
    [mainImageFile]
  );
  const addPreviews = useMemo(
    () => addImageFiles.map((f) => URL.createObjectURL(f)),
    [addImageFiles]
  );

  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const p = await productService.getById(id);
        if (!alive) return;
        setProduct(p);
        setTitle(p.title);
        setCategory(p.category);
        setLocation(p.location);
        setPrice(String(p.price));
        setDescription(p.description || "");
        setGallery(p.images || []);
        setSelectedRemove(new Set());
        setMainImageFile(null);
        setAddImageFiles([]);
      } catch (e: any) {
        setErr(e?.message || "Məhsul tapılmadı");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  function toggleRemove(url: string) {
    setSelectedRemove((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  }

  async function onSave() {
    if (!product || !id) return;
    if (!title.trim()) return alert("Title tələb olunur");
    if (!category.trim()) return alert("Category tələb olunur");
    if (!location.trim()) return alert("Location tələb olunur");
    if (!price.trim() || isNaN(Number(price)))
      return alert("Price düzgün deyil");

    try {
      setSaving("saving");
      setErr(null);

      // qalacaq şəkillər = mövcud qalereya - silinənlər
      const keepImages = gallery.filter((u) => !selectedRemove.has(u));

      await productService.updateWithFilesAdvanced(id, {
        title: title.trim(),
        category: category.trim(),
        location: location.trim(),
        price,
        description: description.trim(),
        mainImageFile, // varsa əvəzləyəcək
        addImageFiles, // varsa əlavə edəcək
        keepImages, // qalereyada saxlanacaq url-lər
      });

      // uğurla yadda saxlananda geri admin siyahıya yönləndir (istəyə görə dəyiş)
      nav("/admin/products");
    } catch (e: any) {
      setErr(e?.message || "Yeniləmə xətası");
    } finally {
      setSaving("idle");
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-72 bg-gray-100 rounded" />
            <div className="space-y-3">
              <div className="h-6 bg-gray-100 rounded w-2/3" />
              <div className="h-6 bg-gray-100 rounded w-1/2" />
              <div className="h-24 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (err || !product) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-red-600 mb-3">{err || "Məhsul tapılmadı."}</p>
        <Link to="/admin/products" className="text-blue-600 underline">
          Siyahıya qayıt
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit product</h1>
        <div className="flex items-center gap-2">
          <Link
            to={`/products/${product._id}`}
            className="px-3 py-1 border rounded"
          >
            Görünüş
          </Link>
          <Link to="/admin/products" className="px-3 py-1 border rounded">
            Geri
          </Link>
        </div>
      </div>

      {/* Essentials */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Main image replace */}
        <div className="space-y-3">
          <div className="text-sm font-medium">Cari Main Image</div>
          <img
            src={product.mainImage}
            className="w-full max-w-md aspect-[4/3] object-cover rounded-xl border"
          />

          <div className="text-sm font-medium mt-3">
            Yeni Main Image (optional)
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
            className="block"
          />
          {mainPreview && (
            <img
              src={mainPreview}
              className="w-40 h-28 object-cover rounded mt-2 border"
            />
          )}
        </div>

        {/* Text fields */}
        <div className="grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Title</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Category</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Location</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Price</span>
            <input
              type="number"
              inputMode="decimal"
              className="border rounded-lg px-3 py-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Description</span>
            <textarea
              className="border rounded-lg px-3 py-2 min-h-24"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Gallery manager */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Gallery</h2>

        {/* Existing images list (select to remove) */}
        {gallery.length === 0 ? (
          <div className="text-gray-500">Qalereyada şəkil yoxdur.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {gallery.map((url) => {
              const selected = selectedRemove.has(url);
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => toggleRemove(url)}
                  className={`relative border rounded-xl overflow-hidden group ${
                    selected ? "ring-2 ring-red-500" : ""
                  }`}
                  title={selected ? "Silinmədən çıxar" : "Sil seç"}
                >
                  <img src={url} className="h-32 w-full object-cover" />
                  <span
                    className={`absolute inset-0 bg-black/40 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition ${
                      selected ? "opacity-100" : ""
                    }`}
                  >
                    {selected ? "Silinəcək" : "Sil"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Add new images */}
        <div className="mt-3">
          <div className="text-sm font-medium">
            Yeni şəkillər əlavə et (optional)
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setAddImageFiles(e.target.files ? Array.from(e.target.files) : [])
            }
            className="block"
          />
          {addPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {addPreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="h-20 w-20 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Actions */}
      {err && <div className="text-red-600">{err}</div>}
      <div className="flex items-center gap-3">
        <button
          onClick={onSave}
          disabled={saving === "saving"}
          className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-60"
        >
          {saving === "saving" ? "Saving..." : "Save changes"}
        </button>
        <Link to="/admin/products" className="px-4 py-2 border rounded-lg">
          Cancel
        </Link>
      </div>
    </div>
  );
}
