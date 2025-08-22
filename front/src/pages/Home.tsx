import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AboutMe from "../components/AboutMe";
import ContactSection from "../components/ContactForm";
import GallerySection from "../components/GallerySection";

type Slide = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const slides: Slide[] = [
  {
    id: "1",
    title: "Final Amber",
    description:
      "‘Final Amber’ showcases a golden sunset over Montenegro’s Durmitor National Park",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Frozen Ridge",
    description: "Snow textures carving through a silent valley.",
    image:
      "https://images.unsplash.com/photo-1482192505345-5655af888cc4?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Misty Path",
    description: "Morning haze rolling over ancient hills.",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    slidesToScroll: 1,
  });

  const [selected, setSelected] = useState(0);

  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  // radiusları bərkidək ki, uyğunsuzluq olmasın
  const IMG_RADIUS = 19; // real şəkil radiusu
  const HALO_RADIUS = 24; // overlay radiusu (bir az böyük)
  const HALO_INSET = 3; // şəkildən nə qədər kənarda

  return (
    <>
      ;
      <section className="relative max-w-[1268px] mx-auto">
        <div className="overflow-hidden [isolation:isolate]" ref={emblaRef}>
          <div className="flex">
            {slides.map((s, idx) => {
              const isActive = idx === selected;
              const total = slides.length;
              const pos = (idx - selected + total) % total;
              const isLeft = pos === total - 1;
              const isRight = pos === 1;

              const zClass = isActive ? "z-30" : "z-10";
              const sizeOpacity = isActive
                ? "scale-100 opacity-100"
                : "scale-90 opacity-50";
              const nudge = isLeft
                ? "translate-x-[60px]"
                : isRight
                ? "-translate-x-[60px]"
                : "";

              return (
                <div
                  key={s.id}
                  className={`mt-3 relative shrink-0 basis-[90%] md:basis-[70%] lg:basis-[60%] transition-all duration-900 ${zClass} ${sizeOpacity} ${nudge}`}
                >
                  {/* OUTER: overflow yoxdur → overlay kəsilmir */}
                  <div className="relative">
                    {/* INNER: şəkil konteyneri (overflow-hidden) */}
                    <div
                      className="overflow-hidden shadow-lg"
                      style={{ borderRadius: IMG_RADIUS, height: 400 }}
                    >
                      <img
                        src={s.image}
                        alt={s.title}
                        className="w-full h-full object-cover"
                        style={{ borderRadius: IMG_RADIUS }}
                      />
                    </div>

                    {/* BORDER ANİMASİYASI — sol-yuxarı L-dən başlayır */}
                    {isActive && (
                      <div
                        className="pointer-events-none absolute z-40 corner-frame"
                        style={{
                          top: -HALO_INSET,
                          left: -HALO_INSET,
                          right: -HALO_INSET,
                          bottom: -HALO_INSET,
                          borderRadius: HALO_RADIUS,
                          // ↓ YAVAŞ
                          // @ts-ignore
                          ["--bw"]: "3.8px",
                          // @ts-ignore
                          ["--border-color"]: "#f59e0b",
                          // @ts-ignore
                          ["--dur1"]: "2400ms",
                          // @ts-ignore
                          ["--dur2"]: "1900ms",
                          // @ts-ignore
                          ["--delay2"]: "400ms",
                          // @ts-ignore
                          ["--ease"]: "cubic-bezier(.25,.75,.25,1)",
                        }}
                      />
                    )}
                  </div>

                  {/* Caption yalnız aktiv slaydda */}
                  {isActive && (
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium">{s.title}</h3>
                        <p className="text-sm italic text-gray-400">
                          /description{" "}
                          <span className="not-italic text-gray-300">
                            {s.description}
                          </span>
                        </p>
                      </div>
                      <a
                        href="#"
                        className="rounded-full border border-gray-600 px-5 py-2 text-sm hover:border-[#D9B36C] hover:text-[#D9B36C] transition"
                      >
                        See more
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Prev / Next buttons */}
        <button
          onClick={scrollPrev}
          aria-label="Previous"
          className="absolute left-0 top-1/2 -translate-y-1/2 text-white text-2xl p-2 z-50"
        >
          ←
        </button>
        <button
          onClick={scrollNext}
          aria-label="Next"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-2xl p-2 z-50"
        >
          →
        </button>
      </section>
      <AboutMe />
      <GallerySection />
      <ContactSection />
    </>
  );
}
