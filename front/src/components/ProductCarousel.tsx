// src/components/ProductCarouselOneByOne.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "./ProductCard";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
  title?: string;
  autoplay?: boolean;
  intervalMs?: number;
  maxSlides?: number; // İstəsən limitləyə bilərsən; default limitsiz
};

function useItemsPerView() {
  const [w, setW] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  // <640 mob = 1, <1024 tablet = 2, ≥1024 desktop = 3
  if (w < 640) return 1;
  if (w < 1024) return 2;
  return 3;
}

export default function ProductCarouselOneByOne({
  products,
  title = "You may also like",
  autoplay = false,
  intervalMs = 4500,
  maxSlides,
}: Props) {
  const itemsPerView = useItemsPerView();

  // Item-ları (istəsən maxSlides * itemsPerView qədər) limitlə
  const items = useMemo(() => {
    if (!maxSlides) return products;
    const limit = Math.max(1, maxSlides * itemsPerView);
    return products.slice(0, limit);
  }, [products, maxSlides, itemsPerView]);

  // İndeks item səviyyəsindədir (1 addım = 1 item)
  const [index, setIndex] = useState(0);

  // maxIndex: son görünüşdə sağda boşluq qalmasın
  const maxIndex = Math.max(0, items.length - itemsPerView);

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [maxIndex, index]);

  const canPrev = index > 0;
  const canNext = index < maxIndex;

  const prev = () => canPrev && setIndex((i) => i - 1);
  const next = () => canNext && setIndex((i) => i + 1);

  // Autoplay (opsional)
  useEffect(() => {
    if (!autoplay || maxIndex === 0) return;
    const id = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, intervalMs);
    return () => clearInterval(id);
  }, [autoplay, intervalMs, maxIndex]);

  // Drag / Swipe
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const deltaX = useRef<number>(0);

  const itemWidthPercent = 100 / itemsPerView; // hər itemin faiz eni
  const snap = (i: number) => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(-${i * itemWidthPercent}%)`;
  };

  useEffect(() => {
    snap(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, itemWidthPercent]);

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
    deltaX.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current == null || !viewportRef.current || !trackRef.current)
      return;
    deltaX.current = e.clientX - startX.current;

    // Delta-nı viewport eninə görə faizə çevir
    const vw = viewportRef.current.clientWidth || 1;
    const deltaPercent = (deltaX.current / vw) * 100;

    // Aktiv indeksin mövqeyinə delta əlavə et
    const base = -(index * itemWidthPercent);
    trackRef.current.style.transform = `translateX(${base + deltaPercent}%)`;
  };

  const onPointerUp = () => {
    if (startX.current == null || !viewportRef.current) return;
    const vw = viewportRef.current.clientWidth || 1;

    // Threshold: ən azı 10% viewport və ya 60px
    const thresholdPx = 60;
    const thresholdPercent = 10; // %
    const byPercent = Math.abs((deltaX.current / vw) * 100) >= thresholdPercent;
    const byPixels = Math.abs(deltaX.current) >= thresholdPx;

    if (byPercent || byPixels) {
      if (deltaX.current < 0) next(); // sola sürüşdürmə -> növbəti
      else prev(); // sağa sürüşdürmə -> əvvəlki
    } else {
      // Yığcam sürüşdürmə: geri qayıt
      snap(index);
    }

    startX.current = null;
    deltaX.current = 0;
  };

  // Dots sayı = maxIndex + 1 (hər mövqe üçün 1 nöqtə)

  return (
    <section className="max-w-[1268px] mx-auto mt-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-white text-[22px] font-semibold">{title}</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            disabled={!canPrev}
            aria-label="Previous"
            className="h-10 w-10 rounded-full bg-[rgba(18,27,37,0.8)] border border-[#2a3842] flex items-center justify-center disabled:opacity-40"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="#d1d5db"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={next}
            disabled={!canNext}
            aria-label="Next"
            className="h-10 w-10 rounded-full bg-[rgba(18,27,37,0.8)] border border-[#2a3842] flex items-center justify-center disabled:opacity-40"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="#d1d5db"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Viewport */}
      <div
        ref={viewportRef}
        className="relative  rounded-xl "
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Track: item-based, 1 addım = 1 item */}
        <div
          ref={trackRef}
          className="flex transition-transform duration-300 ease-out gap-[20px]"
          // translateX dinamik snap() ilə idarə olunur
        >
          {items.map((p) => {
            // hər item görünən sahənin 1/itemsPerView hissəsi olmalıdır
            // const basis = `${ 100 / itemsPerView}%`;
            const gap = 20; // px
            const totalGap = gap * (itemsPerView - 1); // px
            return (
              <div
                key={p.id}
                className="shrink-0 "
                // style={{ flex: `0 0 ${basis}` }}

                style={{
                  width: `calc((100% - ${totalGap}px) / ${itemsPerView})`,
                }}
              >
                <ProductCard product={p} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      {/* <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: dotsCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to position ${i + 1}`}
            className={[
              "h-2 w-2 rounded-full transition-opacity",
              i === index
                ? "opacity-100 bg-[#ffd8a2]"
                : "opacity-50 bg-[#9ca3af]",
            ].join(" ")}
          />
        ))}
      </div> */}
    </section>
  );
}
