// src/components/GalleryLightbox.tsx
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type GalleryImage = { src: string; alt?: string };

type Props = {
  open: boolean;
  images: GalleryImage[];
  initialIndex?: number;
  category?: string;
  region?: string;
  onClose: () => void;
};

export default function GalleryLightbox({
  open,
  images,
  initialIndex = 0,
  category = "Travel & Culture",
  region = "Europe",
  onClose,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const dragging = useRef(false);
  const last = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });

  const total = images.length;
  const current = useMemo(() => images[index], [images, index]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "=" || e.key === "+") zoomIn();
      if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]); // eslint-disable-line

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(total - 1, i + 1));
  const go = (i: number) => setIndex(Math.min(Math.max(0, i), total - 1));

  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
  const zoomOut = () =>
    setZoom((z) => {
      const nz = Math.max(1, +(z - 0.25).toFixed(2));
      if (nz === 1) setOffset({ x: 0, y: 0 });
      return nz;
    });

  const toggleFullscreen = async () => {
    const el = rootRef.current;
    const doc: any = document;
    if (!el) return;
    if (doc.fullscreenElement) await doc.exitFullscreen?.();
    else await el.requestFullscreen?.();
  };

  useLayoutEffect(() => {
    if (!viewportRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const cr = entry.contentRect;
      setContainerSize({ w: cr.width, h: cr.height });
    });
    ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  const onImgLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
  };

  const clampOffset = (x: number, y: number) => {
    const { w: cw, h: ch } = containerSize;
    const { w: nw, h: nh } = naturalSize;
    if (!cw || !ch || !nw || !nh) return { x, y };

    const containerRatio = cw / ch;
    const imageRatio = nw / nh;

    let baseW: number, baseH: number;
    if (imageRatio > containerRatio) {
      baseW = cw;
      baseH = cw / imageRatio;
    } else {
      baseH = ch;
      baseW = ch * imageRatio;
    }

    const scaledW = baseW * zoom;
    const scaledH = baseH * zoom;

    const maxX = Math.max(0, (scaledW - baseW) / 2);
    const maxY = Math.max(0, (scaledH - baseH) / 2);

    return {
      x: Math.min(Math.max(x, -maxX), maxX),
      y: Math.min(Math.max(y, -maxY), maxY),
    };
  };

  const handlePanPointerDown = (e: React.PointerEvent) => {
    if (zoom === 1) return;
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    document.body.style.cursor = "grabbing";
  };
  const handlePanPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || zoom === 1) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setOffset((o) => clampOffset(o.x + dx, o.y + dy));
  };
  const handlePanPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    document.body.style.cursor = "";
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const lastTap = useRef<number>(0);
  const onDoubleTap = (e: React.PointerEvent) => {
    console.log(e);

    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (zoom === 1) setZoom(2);
      else {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      }
    }
    lastTap.current = now;
  };

  if (!open) return null;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-black/90 text-[#9ca3af] select-none"
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/70 hover:bg-black/90"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="#d1d5db"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Wrapper */}
      <div className="mx-auto flex h-dvh max-h-dvh flex-col bg-black max-w-[1440px]">
        <div className="flex flex-1 min-h-0 bg-black max-[900px]:flex-col">
          {/* MAIN (yuxarı, mobildə) */}
          <main
            ref={viewportRef}
            className="
              order-1
              relative flex min-h-0 flex-1 min-w-0 items-center justify-center overflow-hidden
              max-[900px]:order-1
            "
          >
            {/* Prev/Next */}
            <div className="pointer-events-none absolute left-4 right-4 top-1/2 z-20 flex -translate-y-1/2 justify-between">
              <button
                type="button"
                onClick={prev}
                disabled={index === 0}
                aria-label="Previous image"
                className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/70 hover:bg-black/90 disabled:opacity-40"
              >
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.25 25.167L12.9038 16.8208L21.25 8.47461"
                    stroke="white"
                    stroke-width="2.78207"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                disabled={index === total - 1}
                aria-label="Next image"
                className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/70 hover:bg-black/90 disabled:opacity-40"
              >
                <svg
                  width="35"
                  height="34"
                  viewBox="0 0 35 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.21 25.167L21.5562 16.8208L13.21 8.47461"
                    stroke="white"
                    stroke-width="2.78207"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Image wrapper */}
            <div className="relative h-full w-full">
              <div
                onPointerDown={(e) => {
                  onDoubleTap(e);
                  handlePanPointerDown(e);
                }}
                onPointerMove={handlePanPointerMove}
                onPointerUp={handlePanPointerUp}
                onPointerCancel={handlePanPointerUp}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  width: "100%",
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transition: dragging.current
                    ? "none"
                    : "transform 200ms ease-out",
                  cursor: zoom > 1 ? "grab" : "default",
                }}
              >
                <img
                  ref={imgRef}
                  src={current?.src}
                  alt={current?.alt || "Gallery image"}
                  className="max-h-full max-w-full object-contain w-full"
                  onLoad={onImgLoad}
                  draggable={false}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 right-4 z-20 flex gap-[11px]">
              <button
                type="button"
                onClick={zoomIn}
                aria-label="Zoom in"
                className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-black/70 hover:bg-black/90"
              >
                <svg
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.6725 22.1531C18.7941 22.1531 22.9461 18.0012 22.9461 12.8795C22.9461 7.75787 18.7941 3.60596 13.6725 3.60596C8.55084 3.60596 4.39893 7.75787 4.39893 12.8795C4.39893 18.0012 8.55084 22.1531 13.6725 22.1531Z"
                    stroke="white"
                    stroke-width="2.78207"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M25.2642 24.4715L20.2217 19.429"
                    stroke="white"
                    stroke-width="2.78207"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13.6719 9.40186V16.357"
                    stroke="white"
                    stroke-width="2.78207"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10.1943 12.8796H17.1495"
                    stroke="white"
                    stroke-width="2.78207"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={zoomOut}
                aria-label="Zoom out"
                className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-black/70 hover:bg-black/90"
              >
                <svg
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.4669 22.1531C18.5886 22.1531 22.7405 18.0012 22.7405 12.8795C22.7405 7.75787 18.5886 3.60596 13.4669 3.60596C8.34528 3.60596 4.19336 7.75787 4.19336 12.8795C4.19336 18.0012 8.34528 22.1531 13.4669 22.1531Z"
                    stroke="white"
                    stroke-width="2.78207"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M25.0586 24.4715L20.0161 19.429"
                    stroke="white"
                    stroke-width="2.78207"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.98877 12.8796H16.9439"
                    stroke="white"
                    stroke-width="2.78207"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label="Toggle fullscreen"
                className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-black/70 hover:bg-black/90"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.40047 3.60596V7.08355C9.40047 7.69842 9.15621 8.28811 8.72143 8.7229C8.28665 9.15768 7.69696 9.40194 7.08208 9.40194H3.60449"
                    stroke="white"
                    stroke-width="2.78207"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M24.4703 9.40194H20.9927C20.3778 9.40194 19.7881 9.15768 19.3534 8.7229C18.9186 8.28811 18.6743 7.69842 18.6743 7.08355V3.60596"
                    stroke="white"
                    stroke-width="2.78207"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3.60449 18.6753H7.08208C7.69696 18.6753 8.28665 18.9196 8.72143 19.3543C9.15621 19.7891 9.40047 20.3788 9.40047 20.9937V24.4713"
                    stroke="white"
                    stroke-width="2.78207"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.6743 24.4713V20.9937C18.6743 20.3788 18.9186 19.7891 19.3534 19.3543C19.7881 18.9196 20.3778 18.6753 20.9927 18.6753H24.4703"
                    stroke="white"
                    stroke-width="2.78207"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </main>

          {/* ASIDE (aşağı, mobildə) */}
          <aside
            className="
              order-0 max-[900px]:order-2
              flex w-[136px] shrink-0 items-start justify-center
              border-r border-[#1f2937] p-[11px]
              max-[900px]:w-full max-[900px]:border-r-0 max-[900px]:border-t max-[900px]:p-4
            "
          >
            <div
              className="
                flex flex-col gap-[11px]
                max-[900px]:flex-row max-[900px]:gap-4 max-[900px]:justify-start
                max-[900px]:flex-wrap
                /* XÜSUSİ İSTƏK: 500px-dən kiçikdə qırılmasın */
                max-[500px]:flex-nowrap max-[500px]:overflow-hidden
              "
            >
              {images.map((img, i) => {
                const active = i === index;
                return (
                  <button
                    key={img.src + i}
                    type="button"
                    onClick={() => go(i)}
                    className={[
                      "overflow-hidden rounded-[5.56px] border-[3px] border-transparent bg-black/70 transition-colors",
                      active
                        ? "border-[#ffe30d]"
                        : "hover:border-[rgba(255,227,13,0.5)]",
                      // Default ölçü (desktop/≤900)
                      "h-[111px] w-[111px] max-[900px]:h-[88px] max-[900px]:w-[88px]",
                      // 500px-dən kiçikdə: tam 4 sütun, qırılma yoxdur
                      "max-[500px]:box-border max-[500px]:h-auto max-[500px]:w-auto max-[500px]:aspect-square max-[500px]:basis-[calc((100%_-_48px)/4)]",
                    ].join(" ")}
                  >
                    <img
                      src={img.src}
                      alt={img.alt || `Thumbnail ${i + 1}`}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </button>
                );
              })}
            </div>
          </aside>
        </div>

        {/* FOOTER */}
        <div className="shrink-0 bg-black">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-[22px] max-[900px]:px-4">
            <div className="pl-[22px] max-[900px]:pl-0 text-[18.9px] leading-[33.38px]">
              <span>{index + 1}</span>
              <span className="px-2 text-[#9ca3af]">/</span>
              <span>{total}</span>
            </div>
            <div className="flex items-center gap-4 text-[16.55px] leading-[27.82px]">
              <span>{category}</span>
              <span className="text-[#9ca3af]">•</span>
              <span>{region}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
