import React, { useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

type SendState = "idle" | "loading" | "success" | "error";

export default function ProductCreateForm() {
  const navigate = useNavigate();
  const [state, setState] = useState<SendState>("idle");
  const [error, setError] = useState<string | null>(null);

  // Text fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // Files
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);

  // For clearing file inputs after submit
  const mainImageRef = useRef<HTMLInputElement | null>(null);
  const imagesRef = useRef<HTMLInputElement | null>(null);

  // Simple previews
  const mainPreview = useMemo(
    () => (mainImage ? URL.createObjectURL(mainImage) : ""),
    [mainImage]
  );
  const galleryPreviews = useMemo(
    () => images.map((f) => URL.createObjectURL(f)),
    [images]
  );

  const validate = () => {
    if (!title.trim() || title.trim().length < 2)
      return "Title minimum 2 simvol olmalıdır.";
    if (!mainImage) return "Main image seçilməyib.";
    if (!category.trim()) return "Category boş ola bilməz.";
    if (!location.trim()) return "Location boş ola bilməz.";
    if (!price.trim() || isNaN(Number(price))) return "Price rəqəm olmalıdır.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setState("loading");

      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("category", category.trim());
      fd.append("location", location.trim());
      fd.append("price", price.trim()); // backend number-a çevirsin
      fd.append("description", description.trim());
      if (mainImage) fd.append("mainImage", mainImage);
      images.forEach((f) => fd.append("images", f));

      // ✳️ Backend endpointini buradan dəyişə bilərsən
      const res = await fetch("https://oneartpix.khankishiyevravan.info/api/products/form-data", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const msg = await safeJsonMessage(res); 
        throw new Error(msg || "Yükləmə zamanı xəta baş verdi.");
      }

      setState("success");
      resetForm();
      navigate("/admin/products")
    } catch (err: any) {
      setState("error");
      setError(err?.message || "Xəta baş verdi.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setLocation("");
    setPrice("");
    setDescription("");
    setMainImage(null);
    setImages([]);
    // clear native file inputs
    if (mainImageRef.current) mainImageRef.current.value = "";
    if (imagesRef.current) imagesRef.current.value = "";
  };

  const onPickMain = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setMainImage(f);
  };

  const onPickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(files);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-lg border flex flex-col gap-5"
    >
      <h2 className="text-2xl font-bold">Add Product</h2>

      {/* Title */}
      <div className="grid gap-2">
        <label className="font-medium">Title</label>
        <input
          type="text"
          className="border rounded-lg px-3 py-2"
          placeholder="Məs: Vintage Camera"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Main Image */}
      <div className="grid gap-2">
        <label className="font-medium">Main Image (JPEG/PNG/WEBP/GIF)</label>
        <input
          ref={mainImageRef}
          type="file"
          accept="image/*"
          className="border rounded-lg px-3 py-2"
          onChange={onPickMain}
        />
        {!!mainPreview && (
          <div className="mt-1">
            <img
              src={mainPreview}
              alt="Main preview"
              className="h-36 w-36 object-cover rounded-lg border"
            />
          </div>
        )}
      </div>

      {/* Gallery Images */}
      <div className="grid gap-2">
        <label className="font-medium">Images (optional — multiple)</label>
        <input
          ref={imagesRef}
          type="file"
          accept="image/*"
          multiple
          className="border rounded-lg px-3 py-2"
          onChange={onPickImages}
        />
        {galleryPreviews.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-1">
            {galleryPreviews.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`preview-${i}`}
                className="h-20 w-20 object-cover rounded-md border"
              />
            ))}
          </div>
        )}
      </div>

      {/* Category & Location */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="font-medium">Category</label>
          <input
            type="text"
            className="border rounded-lg px-3 py-2"
            placeholder="Məs: Photography"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label className="font-medium">Location</label>
          <input
            type="text"
            className="border rounded-lg px-3 py-2"
            placeholder="Məs: Baku"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      {/* Price */}
      <div className="grid gap-2">
        <label className="font-medium">Price</label>
        <input
          type="number"
          inputMode="decimal"
          className="border rounded-lg px-3 py-2"
          placeholder="Məs: 199.99"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <label className="font-medium">Description</label>
        <textarea
          className="border rounded-lg px-3 py-2 min-h-28"
          placeholder="Qısa təsvir..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Errors */}
      {error && (
        <div className="text-red-600 text-sm border border-red-200 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={state === "loading"}
          className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-60"
        >
          {state === "loading" ? "Saving..." : "Save Product"}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-4 py-2 rounded-lg border"
        >
          Reset
        </button>
        {state === "success" && (
          <span className="text-green-600 text-sm">Uğurla əlavə olundu!</span>
        )}
        {state === "error" && (
          <span className="text-red-600 text-sm">Yadda saxlanmadı.</span>
        )}
      </div>
    </form>
  );
}

/** Helper: try to read JSON error message if provided by backend */
async function safeJsonMessage(res: Response) {
  try {
    const data = await res.json();
    return (data && (data.message || data.error)) as string | undefined;
  } catch {
    return undefined;
  }
}
