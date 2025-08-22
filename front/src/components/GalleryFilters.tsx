import { useMemo, useState } from "react";

type SortOption = { value: string; label: string };

export type GalleryFiltersProps = {
  title?: string;
  categories?: string[];
  defaultSelectedCategory?: string | null;
  sortOptions?: SortOption[];
  defaultSort?: string;

  // Optional callbacks (səndə artıq var idi)
  onSearchChange?: (value: string) => void;
  onCategoryChange?: (category: string | null) => void;
  onSortChange?: (sort: string) => void;

  // ✅ YENİ: kontrollu istifadə üçün optional “active” proplar
  searchValue?: string; // input dəyəri (kontrollu)
  activeCategory?: string | null; // seçilmiş kateqoriya (kontrollu)
  activeSort?: string; // seçilmiş sort (kontrollu)
};

export default function GalleryFilters({
  title = "Artwork Gallery",
  categories = [
    "Art & Creation",
    "Nature & Landscapes",
    "Black & White",
    "Travel & Culture",
    "Vintage",
  ],
  defaultSelectedCategory = null,
  sortOptions = [
    { value: "default", label: "Default sorting" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "az", label: "A → Z" },
    { value: "za", label: "Z → A" },
  ],
  defaultSort = "default",
  onSearchChange,
  onCategoryChange,
  onSortChange,
  // controlled props (optional)
  searchValue,
  activeCategory,
  activeSort,
}: GalleryFiltersProps) {
  // Daxili (uncontrolled) state-lər
  const [searchState, setSearchState] = useState("");
  const [selectedCategoryState, setSelectedCategoryState] = useState<
    string | null
  >(defaultSelectedCategory);
  const [sortState, setSortState] = useState(defaultSort);
  const [openSort, setOpenSort] = useState(false);

  // Effektiv dəyərlər: controlled prop verilibsə onu, yoxdursa state-i istifadə et
  const effSearch = searchValue ?? searchState;
  const effCategory = activeCategory ?? selectedCategoryState;
  const effSort = activeSort ?? sortState;

  const currentSortLabel = useMemo(
    () =>
      sortOptions.find((o) => o.value === effSort)?.label ?? "Default sorting",
    [effSort, sortOptions]
  );

  const handleSearch = (value: string) => {
    if (searchValue === undefined) setSearchState(value); // yalnız uncontrolled olduqda state dəyiş
    onSearchChange?.(value);
  };

  const handleCategoryClick = (cat: string) => {
    const next = effCategory === cat ? null : cat;
    if (activeCategory === undefined) setSelectedCategoryState(next);
    onCategoryChange?.(next);
  };

  const handleSortPick = (val: string) => {
    if (activeSort === undefined) setSortState(val);
    onSortChange?.(val);
    setOpenSort(false);
  };

  return (
    <section id="gallery-filters" className="text-white">
      <div className="mx-auto my-10 max-w-[1268px] px-5">
        <div className="flex flex-col gap-[41px]">
          <h1
            className="m-0 text-left font-normal leading-none"
            style={{
              fontSize: "50px",
              fontFamily: "'Bebas Neue', ui-sans-serif, system-ui",
            }}
          >
            {title}
          </h1>

          {/* Controls */}
          <div className="flex flex-col gap-[25px]">
            {/* Search */}
            <form
              className="relative flex items-center"
              onSubmit={(e) => e.preventDefault()}
              role="search"
            >
              <input
                type="text"
                className="w-full rounded-[10px] border border-[#516a7b] bg-[#1d2a35] px-[23px] py-[17px] pr-[60px] text-[19px] leading-[1.2] text-[#cccccc] placeholder-[#cccccc] focus:outline-none focus:ring-2 focus:ring-[#7a95a8]"
                placeholder="Search artworks..."
                value={effSearch}
                onChange={(e) => handleSearch(e.target.value)}
                aria-label="Search artworks"
              />
              <button
                type="submit"
                className="absolute right-[15px] top-1/2 -translate-y-1/2 cursor-pointer rounded p-2 outline-none"
                aria-label="Search"
              >
                {/* Search Icon */}
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                    stroke="#d1d5db"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>

            {/* Filters & Sort */}
            <div className="flex items-center justify-between gap-5 max-[1024px]:flex-col max-[1024px]:items-start">
              {/* Category Pills */}
              <div
                className="flex flex-wrap items-center gap-[17px]"
                role="group"
                aria-label="Artwork categories"
              >
                {categories.map((cat) => {
                  const active = effCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryClick(cat)}
                      className={[
                        "rounded-full border px-6 py-3 text-[17px] font-medium leading-[1.2] transition",
                        "border-[#516a7b]",
                        active
                          ? "bg-[#2c3e4d] text-white"
                          : "bg-[#1d2a35] text-[#d1d5db] hover:bg-[#2c3e4d] hover:border-[#7a95a8]",
                      ].join(" ")}
                      aria-pressed={active}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenSort((v) => !v)}
                  className="flex items-center gap-3 rounded-[10px] border border-[#516a7b] bg-[#1d2a35] px-[23px] py-[11px] text-[18px] leading-[1.2] transition hover:bg-[#2c3e4d] hover:border-[#7a95a8] max-[768px]:w-full max-[768px]:justify-between"
                  aria-haspopup="listbox"
                  aria-expanded={openSort}
                >
                  <span>{currentSortLabel}</span>
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    className={`transition-transform ${
                      openSort ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="#ffffff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {openSort && (
                  <ul
                    role="listbox"
                    className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-xl border border-[#516a7b] bg-[#1d2a35] shadow-xl"
                  >
                    {sortOptions.map((o) => (
                      <li key={o.value}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={effSort === o.value}
                          onClick={() => handleSortPick(o.value)}
                          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-[#2c3e4d] ${
                            effSort === o.value ? "opacity-100" : "opacity-90"
                          }`}
                        >
                          <span>{o.label}</span>
                          {effSort === o.value && (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="M5 13l4 4L19 7"
                                stroke="#ffffff"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive tweaks */}
      <style>{`
        @media (max-width: 768px) {
          #gallery-filters h1 { font-size: 40px; }
          #gallery-filters [data-pill] { font-size: 15px; padding: 10px 20px; }
        }
      `}</style>
    </section>
  );
}
