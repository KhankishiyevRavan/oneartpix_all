import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productService } from "../services/productService";

type Product = Awaited<ReturnType<typeof productService.getById>>;

function formatPrice(v?: number | string) {
  const n = typeof v === "string" ? Number(v) : v ?? 0;
  try {
    return new Intl.NumberFormat("az-AZ", {
      style: "currency",
      currency: "AZN",
    }).format(n);
  } catch {
    return `${n} AZN`;
  }
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Image gallery
  const images = useMemo(() => {
    if (!product) return [];
    const arr = [product.mainImage, ...(product.images || [])].filter(Boolean);
    // eyni URL-ləri təkrarlamasın
    return Array.from(new Set(arr));
  }, [product]);
  const [active, setActive] = useState(0);

  // Related
  const [related, setRelated] = useState<Product[]>([]);
  const [relLoading, setRelLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const p = await productService.getById(id);
        if (!mounted) return;
        setProduct(p);
        setActive(0);
      } catch (e: any) {
        setErr(e?.message || "Məhsul tapılmadı");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!product) return;
    let mounted = true;
    (async () => {
      try {
        setRelLoading(true);
        const data = await productService.relatedByCategory(
          product.category,
          8
        );
        if (!mounted) return;
        // özünü related-dən çıxart
        setRelated(data.filter((x) => x._id !== product._id));
      } finally {
        setRelLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [product]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse grid md:grid-cols-2 gap-8">
          <div className="h-[420px] bg-gray-100 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-gray-100 rounded" />
            <div className="h-6 w-40 bg-gray-100 rounded" />
            <div className="h-6 w-56 bg-gray-100 rounded" />
            <div className="h-24 bg-gray-100 rounded" />
            <div className="h-10 w-40 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (err || !product) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-red-600 mb-4">{err || "Məhsul tapılmadı."}</p>
        <Link to="/products" className="text-blue-600 underline">
          Məhsul siyahısına qayıt
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-4 text-gray-600">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:underline">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.title}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Gallery */}
        <div>
          {/* Main */}
          {images[active] && (
            <div className="aspect-[4/3] w-full bg-gray-50 border rounded-2xl overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[active]}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`border rounded-lg overflow-hidden shrink-0 ${
                    i === active ? "ring-2 ring-blue-500" : ""
                  }`}
                  title={`Image ${i + 1}`}
                >
                  <img
                    src={src}
                    alt={`thumb-${i}`}
                    className="h-16 w-16 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="px-2 py-1 rounded-full bg-gray-100 border">
              {product.category}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 border">
              {product.location}
            </span>
            <span className="px-2 py-1 rounded-full bg-gray-100 border">
              {new Date(product.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="text-2xl font-semibold">
            {formatPrice(product.price)}
          </div>

          {product.description && (
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          )}

          <div className="pt-4 flex items-center gap-3">
            <Link
              to="/products"
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Geri
            </Link>

            {/* İstəsən admin edit səhifənə keçid də qoya bilərsən */}
            <Link
              to={`/admin/product/${product._id}/edit`}
              className="px-4 py-2 rounded-lg bg-amber-600 text-white"
            >
              Edit (Admin)
            </Link>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">
          Releated Products ({product.category})
        </h2>

        {relLoading && <div className="text-gray-500">Loading...</div>}

        {!relLoading && related.length === 0 && (
          <div className="text-gray-500">Not found related products</div>
        )}

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {related.map((r) => (
            <Link
              key={r._id}
              to={`/products/${r._id}`}
              className="border rounded-xl overflow-hidden hover:shadow transition"
              title={r.title}
            >
              <img
                src={r.mainImage}
                alt={r.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-3">
                <div className="font-medium line-clamp-1">{r.title}</div>
                <div className="text-sm text-gray-600">
                  {formatPrice(r.price)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
