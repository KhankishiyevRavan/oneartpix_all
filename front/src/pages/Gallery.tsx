import { useEffect, useMemo, useState } from "react";
import GalleryFilters from "../components/GalleryFilters";
import Products from "../components/Products";
import productsClient, {
  parseSort,
  type SortKey,
  type UIProduct,
} from "../service/productService";

const PAGE_SIZE = 12;
const PAGE_FETCH_SIZE = 200;

// Diakritika təmizləmə
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

function Gallery() {
  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("default");

  // Client pagination
  const [page, setPage] = useState(1);

  // Data
  const [allItems, setAllItems] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 🔹 BÜTÜN MƏHSULLARI BİR DƏFƏ ÇƏK (category/sort-dan ASILI DEYİL)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const acc: UIProduct[] = [];
        let currentPage = 1;
        let total = Infinity;
        let guard = 0;

        while (acc.length < total && guard < 100) {
          const resp = await productsClient.listUI({
            page: currentPage,
            pageSize: PAGE_FETCH_SIZE,
            // q/göndərmirik — hər şey frontdadır
            // category göndərmirik — hamısını yığırıq
            // sort göndərmirik — hamısı frontda
          });
          acc.push(...(resp.items ?? []));
          total = resp.total ?? acc.length;
          currentPage += 1;
          guard += 1;
          if (!resp.items || resp.items.length === 0) break;
        }

        if (!mounted) return;
        setAllItems(acc);
        setPage(1);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || "Yükləmə xətası baş verdi.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []); // ← yalnız bir dəfə işləyir

  // 🔹 Client-side filter + sort
  const filtered = useMemo(() => {
    let arr = [...allItems];

    // Category filter (front)
    if (category) {
      arr = arr.filter((p) => p.category === category);
    }

    // Search (front)
    const q = normalize(search.trim());
    if (q) {
      arr = arr.filter((p) => {
        const inTitle = normalize(p.title).includes(q);
        const inLoc = normalize(p.location || "").includes(q);
        const inCat = normalize(p.category || "").includes(q);
        return inTitle || inLoc || inCat;
      });
    }

    // Sort (front)
    if (sort === "az") {
      arr.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      );
    } else if (sort === "za") {
      arr.sort((a, b) =>
        b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
      );
    } else if (sort === "priceAsc") {
      arr.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    } else if (sort === "priceDesc") {
      arr.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    } else if (sort === "new") {
      // createdAt varsa, yenidən köhnəyə
      arr.sort(
        (a, b) =>
          (b.createdAt ? +new Date(b.createdAt) : 0) -
          (a.createdAt ? +new Date(a.createdAt) : 0)
      );
    }
    // "default" → gələn sıranı saxla

    return arr;
  }, [allItems, search, category, sort]);

  // Categories — ALL data-dan çıxar
  const categories = useMemo(() => {
    const s = new Set<string>();
    for (const p of allItems) if (p.category) s.add(p.category);
    return Array.from(s).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
  }, [allItems]);

  // Pagination (front)
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const showingFrom = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(currentPage * PAGE_SIZE, total);
  const pageItems = useMemo(
    () => filtered.slice(showingFrom - 1, showingTo),
    [filtered, showingFrom, showingTo]
  );

  // Handlers
  const handleSearchChange = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleCategoryChange = (c: string | null) => {
    setCategory(c);
    setPage(1);
  };
  const handleSortChange = (s: string) => {
    setSort(parseSort(s));
    setPage(1);
  };

  return (
    <main className="min-h-screen text-white">
      <GalleryFilters
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        categories={categories}
        activeCategory={category}
        activeSort={sort}
        searchValue={search}
      />

      <section className="max-w-[1268px] mx-auto px-5">
        {/* Summary */}
        <div className="mb-4 text-[#9ca3af]">
          {loading ? (
            <p>Loading…</p>
          ) : err ? (
            <p className="text-red-400">{err}</p>
          ) : total > 0 ? (
            <p>
              Showing {showingFrom} - {showingTo} of {total} results
              {category ? ` · ${category}` : ""}
              {search ? ` · “${search}”` : ""}
            </p>
          ) : (
            <p>No results found{search ? ` for “${search}”` : ""}.</p>
          )}
        </div>

        {/* Grid */}
        <Products
          products={pageItems}
          total={total}
          showingFrom={showingFrom}
          showingTo={showingTo}
          loading={loading}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 mb-16 flex items-center justify-center gap-2">
            <button
              className="px-3 py-2 rounded-md border border-[#2a3842] bg-[#1d2a35] disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              Prev
            </button>
            <span className="px-3 py-2 text-[#9ca3af]">
              Page {currentPage} / {totalPages}
            </span>
            <button
              className="px-3 py-2 rounded-md border border-[#2a3842] bg-[#1d2a35] disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Gallery;
