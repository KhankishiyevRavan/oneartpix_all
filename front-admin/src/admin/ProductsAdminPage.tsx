// src/pages/ProductsAdminPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { productService } from "../services/productService";
import { useNavigate } from "react-router";

type Product = Parameters<typeof productService.list>[0] extends never
  ? never
  : Awaited<ReturnType<typeof productService.list>>["data"][number];


export default function ProductsAdminPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  // Editable fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");

  // Optional file updates
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const mainPreview = useMemo(
    () => (mainImageFile ? URL.createObjectURL(mainImageFile) : ""),
    [mainImageFile]
  );
  const galleryPreviews = useMemo(
    () => imageFiles.map((f) => URL.createObjectURL(f)),
    [imageFiles]
  );

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const { data, total } = await productService.list({
        page,
        pageSize,
        q,
        sort: "new",
      });
      setItems(data as Product[]);
      setTotal(total);
    } catch (e: any) {
      setErr(e?.message || "Yüklənmə xətası");
    } finally {
      setLoading(false);
    }
  }

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load();
  }

  async function onDelete(id: string) {
    if (!confirm("Bu məhsul silinsin?")) return;
    try {
      await productService.remove(id);
      await load();
    } catch (e: any) {
      alert(e?.message || "Silinmə xətası");
    }
  }


  function closeEdit() {
    setEditOpen(false);
    setEditing(null);
    setMainImageFile(null);
    setImageFiles([]);
  }

  async function saveEdit() {
    if (!editing) return;
    const id = editing._id;
    const onlyTextChanged = mainImageFile === null && imageFiles.length === 0;

    try {
      if (onlyTextChanged) {
        // JSON update
        await productService.updateJson(id, {
          title,
          category,
          location,
          price: Number(price),
          description,
        });
      } else {
        // With files (and text)
        await productService.updateWithFiles(id, {
          title,
          category,
          location,
          price,
          description,
          mainImageFile,
          imageFiles,
        });
      }
      closeEdit();
      await load();
    } catch (e: any) {
      alert(e?.message || "Yeniləmə xətası");
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Search */}
      <form onSubmit={onSearch} className="flex items-center gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title..."
          className="border rounded-lg px-3 py-2 w-full max-w-md"
        />
        <button
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          type="submit"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
              <th>Preview</th>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Price</th>
              <th>Created</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center">
                  Yüklənir...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center">
                  Heç bir məhsul tapılmadı
                </td>
              </tr>
            )}
            {!loading &&
              items.map((p) => (
                <tr
                  key={p._id}
                  className="border-t"
                  onClick={() => navigate(`/admin/product/${p._id}`)}
                >
                  <td className="px-3 py-2">
                    <img
                      src={p.mainImage}
                      alt={p.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-3 py-2 font-medium">{p.title}</td>
                  <td className="px-3 py-2">{p.category}</td>
                  <td className="px-3 py-2">{p.location}</td>
                  <td className="px-3 py-2">{p.price}</td>
                  <td className="px-3 py-2">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/product/${p._id}/edit`)
                        //   openEdit(p);
                        }}
                        className="px-3 py-1 rounded bg-amber-600 text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(p._id)}
                        className="px-3 py-1 rounded bg-red-600 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center gap-2">
        <button
          className="px-3 py-1 border rounded"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} / {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>

      {/* EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit: {editing?.title}</h2>
              <button onClick={closeEdit} className="px-3 py-1 border rounded">
                Close
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="font-medium">Title</label>
                <input
                  className="border rounded-lg px-3 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="font-medium">Category</label>
                <input
                  className="border rounded-lg px-3 py-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="font-medium">Location</label>
                <input
                  className="border rounded-lg px-3 py-2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label className="font-medium">Price</label>
                <input
                  type="number"
                  inputMode="decimal"
                  className="border rounded-lg px-3 py-2"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 grid gap-2">
                <label className="font-medium">Description</label>
                <textarea
                  className="border rounded-lg px-3 py-2 min-h-24"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Optional: replace images */}
            <div className="mt-4 grid gap-3">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-sm font-medium">Current Main</div>
                  {editing?.mainImage && (
                    <img
                      src={editing.mainImage}
                      className="h-16 w-16 object-cover rounded border"
                    />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">New Main (optional)</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setMainImageFile(e.target.files?.[0] || null)
                    }
                  />
                  {mainPreview && (
                    <img
                      src={mainPreview}
                      className="h-16 w-16 object-cover rounded border mt-2"
                    />
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium">
                  New Gallery (optional, replaces)
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setImageFiles(
                      e.target.files ? Array.from(e.target.files) : []
                    )
                  }
                />
                {galleryPreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {galleryPreviews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        className="h-14 w-14 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button onClick={closeEdit} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded bg-green-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* /MODAL */}
      {err && <div className="mt-4 text-red-600 text-sm">{err}</div>}
    </div>
  );
}
