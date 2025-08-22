import React, { useEffect, useMemo, useState } from "react";
import ProductCarousel from "../components/ProductCarousel";
import GalleryLightbox from "../components/GalleryLightbox";
import { useLocation, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import productsClient, { type UIProduct } from "../service/productService";

type ImageItem = { src: string; alt: string };

// Fallback şəkillər (ID/şəkil verilməsə boş qalmasın)
const BASE_IMAGES: ImageItem[] = [{ src: "", alt: "Thumbnail 1" }];

const MAIN_IMAGE_FALLBACK = "";

// Serverdən gələn məhsul (lokal tip)
type APIProduct = {
  _id: string;
  mainImage: string;
  images: string[];
  category: string;
  location: string;
  title: string;
  price: number;
  description?: string;
};

const GalleryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const [product, setProduct] = useState<APIProduct | null>(null);
  // const [loading, setLoading] = useState(false);
  // const [err, setErr] = useState<string | null>(null);

  const [related, setRelated] = useState<UIProduct[]>([]);

  // Query-fallback (əgər :id yoxdursa və ya məhsul tapılmırsa)
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const fallbackImage = params.get("image") || MAIN_IMAGE_FALLBACK;
  const fallbackTitle = params.get("title") || "Untitled";
  const fallbackCategory = params.get("category") || "Unknown";
  const fallbackLoc = params.get("loc") || "Unknown";

  // Məhsulu çək (ID varsa)
  useEffect(() => {
    let mounted = true;
    if (!id) {
      setProduct(null); // yalnız query-fallback işləyəcək
      return;
    }
    (async () => {
      try {
        // setLoading(true);
        // setErr(null);
        // hazır servisdən istifadə edək (env URL, error handling və s.)
        const data = await productsClient.getDetail(id);
        if (!mounted) return;
        // UIProduct yox, tam APIProduct lazımdır (getDetail geri API məhsulu qaytarır)
        setProduct(data as unknown as APIProduct);
        setActiveIndex(0);
      } catch (e: any) {
        if (!mounted) return;
        // setErr(e?.message || "Məhsul yüklənmədi.");
        setProduct(null); // fallback-ə keçə bilsin
      } finally {
        // if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Related (eyni kateqoriya üzrə)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!product?.category) {
          setRelated([]);
          return;
        }
        const resp = await productsClient.listUI({
          page: 1,
          pageSize: 12,
          category: product.category,
          sort: "new",
        });
        let items = resp.items || [];
        if (product?._id) items = items.filter((x) => x.id !== product._id);
        if (!mounted) return;
        setRelated(items);
      } catch {
        if (!mounted) return;
        setRelated([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [product?.category, product?._id]);

  // Qalereya şəkilləri
  const images: ImageItem[] = useMemo(() => {
    if (product) {
      const uniq = new Set<string>();
      const arr: ImageItem[] = [];
      if (product.mainImage && !uniq.has(product.mainImage)) {
        uniq.add(product.mainImage);
        arr.push({ src: product.mainImage, alt: product.title });
      }
      for (const u of product.images || []) {
        if (!uniq.has(u)) {
          uniq.add(u);
          arr.push({ src: u, alt: product.title });
        }
      }
      return arr.length
        ? arr
        : [{ src: MAIN_IMAGE_FALLBACK, alt: product.title }];
    }
    // fallback: URL + statik
    const uniq = new Set<string>();
    const arr: ImageItem[] = [];
    if (fallbackImage && !uniq.has(fallbackImage)) {
      uniq.add(fallbackImage);
      arr.push({ src: fallbackImage, alt: fallbackTitle });
    }
    for (const img of BASE_IMAGES) {
      if (!uniq.has(img.src)) {
        uniq.add(img.src);
        arr.push(img);
      }
    }
    return arr;
  }, [product, fallbackImage, fallbackTitle]);

  const productTitle = product?.title ?? fallbackTitle;
  const productCategory = product?.category ?? fallbackCategory;
  const productLocation = product?.location ?? fallbackLoc;
  const productPrice = product?.price ?? 2100;
  const productId = product?._id ?? `${fallbackTitle}-${fallbackImage}`;

  const next = () =>
    setActiveIndex((i) => (images.length ? (i + 1) % images.length : 0));
  const prev = () =>
    setActiveIndex((i) =>
      images.length ? (i - 1 + images.length) % images.length : 0
    );
  const mainSrc = images[activeIndex]?.src || MAIN_IMAGE_FALLBACK;

  const openLightbox = (i = 0) => {
    setStartIndex(i);
    setOpen(true);
  };

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const resp = await productsClient.listUI({
          page: 1,
          pageSize: 8,
          category: productCategory, // əsas məhsulun category-si
          sort: "new",
        });
        // cari məhsulu siyahıdan çıxar
        const filtered = (resp.items || []).filter((x) => x.id !== id);
        setRelated(filtered);
      } catch (err) {
        console.error("Related load error:", err);
        setRelated([]);
      }
    };
    if (productCategory) fetchRelated();
  }, [productCategory, id]);

  return (
    <main className="overflow-hidden">
      <section id="product-details" className="bg-[#121b25] text-[#d1d5db]">
        <div className="mx-auto max-w-[1261px] px-4 py-8">
          <div className="flex flex-wrap justify-center gap-16 lg:gap-[64px]">
            {/* Gallery column */}
            <div className="flex w-full flex-col gap-6 md:flex-1 md:basis-[600px]">
              <div className="relative overflow-hidden rounded-[11.3px] border border-[#2a3842]">
                <div className="aspect-[599/586]">
                  <img
                    src={mainSrc}
                    alt={
                      activeIndex === 0
                        ? productTitle
                        : images[activeIndex]?.alt || "Image"
                    }
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Prev/Next */}
                <div className="pointer-events-none absolute inset-y-1/2 left-6 right-6 -translate-y-1/2 flex items-center justify-between">
                  <button
                    onClick={prev}
                    aria-label="Previous image"
                    className="pointer-events-auto flex h-[50.8px] w-[50.8px] items-center justify-center rounded-full border-0 bg-[rgba(18,27,37,0.8)]"
                  >
                    <svg width="29" height="29" viewBox="0 0 29 29" fill="none">
                      <path
                        d="M17.9411 21.706L10.8823 14.6472L17.9411 7.58838"
                        stroke="white"
                        strokeWidth="2.82353"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next image"
                    className="pointer-events-auto flex h-[50.8px] w-[50.8px] items-center justify-center rounded-full border-0 bg-[rgba(18,27,37,0.8)]"
                  >
                    <svg width="29" height="29" viewBox="0 0 29 29" fill="none">
                      <path
                        d="M11.0596 21.706L18.1184 14.6472L11.0596 7.58838"
                        stroke="white"
                        strokeWidth="2.82353"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Zoom/Expand */}
                <div className="absolute bottom-6 right-6 flex gap-[11px]">
                  <button
                    aria-label="Zoom in"
                    className="flex h-[50.8px] w-[50.8px] items-center justify-center rounded-full border-0 bg-[rgba(18,27,37,0.8)]"
                    onClick={() => openLightbox(activeIndex)}
                  >
                    <svg width="29" height="29" viewBox="0 0 29 29" fill="none">
                      <path
                        d="M13.3537 22.8821C18.5516 22.8821 22.7654 18.6683 22.7654 13.4704C22.7654 8.27238 18.5516 4.05859 13.3537 4.05859C8.15568 4.05859 3.94189 8.27238 3.94189 13.4704C3.94189 18.6683 8.15568 22.8821 13.3537 22.8821Z"
                        stroke="white"
                        strokeWidth="2.82353"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M25.1184 25.2351L20.0007 20.1174"
                        stroke="white"
                        strokeWidth="2.82353"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.3528 9.94092V16.9997"
                        stroke="white"
                        strokeWidth="2.82353"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.82349 13.4705H16.8823"
                        stroke="white"
                        strokeWidth="2.82353"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    aria-label="Expand image"
                    className="flex h-[50.8px] w-[50.8px] items-center justify-center rounded-full border-0 bg-[rgba(18,27,37,0.8)]"
                  >
                    <svg width="29" height="29" viewBox="0 0 29 29" fill="none">
                      <path
                        d="M9.9429 4.05859H6.41349C5.78945 4.05859 5.19097 4.30649 4.74971 4.74775C4.30845 5.18902 4.06055 5.7875 4.06055 6.41153V9.94095"
                        stroke="white"
                        strokeWidth="2.82353"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M25.2381 9.94095V6.41153C25.2381 5.7875 24.9902 5.18902 24.5489 4.74775C24.1076 4.30649 23.5092 4.05859 22.8851 4.05859H19.3557"
                        stroke="white"
                        strokeWidth="2.82353"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.06055 19.3528V22.8822C4.06055 23.5062 4.30845 24.1047 4.74971 24.546C5.19097 24.9872 5.78945 25.2351 6.41349 25.2351H9.9429"
                        stroke="white"
                        strokeWidth="2.82353"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.3557 25.2351H22.8851C23.5092 25.2351 24.1076 24.9872 24.5489 24.546C24.9902 24.1047 25.2381 23.5062 25.2381 22.8822V19.3528"
                        stroke="white"
                        strokeWidth="2.82353"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-[11px]">
                {images.map((img, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={`${img.src}-${i}`}
                      onClick={() => setActiveIndex(i)}
                      className={[
                        "h-[90.35px] w-[90.35px] overflow-hidden rounded-[5.6px] border p-0",
                        isActive ? "border-[#ffd8a2]" : "border-[#2a3842]",
                        "bg-black/70",
                      ].join(" ")}
                      aria-label={`Select image ${i + 1}`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center gap-5">
                <span className="inline-flex items-center justify-center rounded-full bg-[#1d2a35] px-[37px] py-3 text-[18px] font-medium text-[#9ca3af]">
                  {productLocation}
                </span>
                <button
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2a3842] bg-[#1d2a35]"
                  aria-label="Share"
                  onClick={() =>
                    navigator
                      ?.share?.({
                        title: productTitle,
                        url: window.location.href,
                      })
                      .catch(() => {})
                  }
                >
                  <svg width="26" height="27" viewBox="0 0 26 27" fill="none">
                    <path
                      d="M19.3525 9.23551C21.1068 9.23551 22.529 7.81335 22.529 6.05904C22.529 4.30472 21.1068 2.88257 19.3525 2.88257C17.5982 2.88257 16.176 4.30472 16.176 6.05904C16.176 7.81335 17.5982 9.23551 19.3525 9.23551Z"
                      stroke="#9CA3AF"
                      strokeWidth="2.82353"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.64669 16.6474C8.401 16.6474 9.82316 15.2252 9.82316 13.4709C9.82316 11.7166 8.401 10.2944 6.64669 10.2944C4.89237 10.2944 3.47021 11.7166 3.47021 13.4709C3.47021 15.2252 4.89237 16.6474 6.64669 16.6474Z"
                      stroke="#9CA3AF"
                      strokeWidth="2.82353"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.3525 24.059C21.1068 24.059 22.529 22.6368 22.529 20.8825C22.529 19.1282 21.1068 17.7061 19.3525 17.7061C17.5982 17.7061 16.176 19.1282 16.176 20.8825C16.176 22.6368 17.5982 24.059 19.3525 24.059Z"
                      stroke="#9CA3AF"
                      strokeWidth="2.82353"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.39014 15.0696L16.6219 19.2837"
                      stroke="#9CA3AF"
                      strokeWidth="2.82353"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.6113 7.65771L9.39014 11.8718"
                      stroke="#9CA3AF"
                      strokeWidth="2.82353"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Info column */}
            <div className="w-full pt-2 md:flex-1 md:basis-[500px]">
              <span className="inline-flex items-center justify-center rounded-full border border-[rgba(139,139,139,0.11)] bg-[#1d2a35] px-[16.8px] py-[8.4px] text-[17px] font-medium leading-7 text-[#ffd8a2]">
                {productCategory}
              </span>

              <h1 className="mt-7 mb-[22px] text-[36px] font-bold leading-snug text-white">
                {productTitle}
              </h1>

              <p className="mb-[34px] text-[29px] font-semibold leading-6 text-[#ffd8a2]">
                <span className="mr-1">€</span>
                {Intl.NumberFormat("en-US").format(productPrice)}
              </p>

              <div className="mb-[88px] text-[19px] leading-[1.75] text-[#d1d5db]">
                {product?.description ? (
                  <p className="whitespace-pre-line">{product.description}</p>
                ) : (
                  <>
                    <p className="mb-4">
                      Morem ipsum dolor sit amet, consectetur adipiscing elit.
                      Etiam eu turpis molestie, dictum est a, mattis tellus. Sed
                      dignissim, metus nec fringilla accumsan.
                    </p>
                    <p>
                      Praesent auctor purus luctus enim egestas, ac scelerisque
                      ante pulvinar. Donec ut rhoncus ex.
                    </p>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="mb-[65px] flex flex-wrap gap-[30px]">
                <button
                  className="inline-flex items-center justify-center gap-[11px] rounded-[8.5px] bg-[#ffd8a2] px-12 py-[19px] text-[19px] font-medium leading-7 text-[#121b25]"
                  onClick={() =>
                    addToCart({
                      id: productId,
                      title: productTitle,
                      image: images[0]?.src || MAIN_IMAGE_FALLBACK,
                      category: productCategory,
                      location: productLocation,
                      price: productPrice,
                      qty: 1,
                    })
                  }
                >
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path
                      d="M26.2484 12.3154L18.9716 5.03857M26.2484 12.3154H4.41797M26.2484 12.3154L24.6027 20.5436C24.1493 22.8112 22.1582 24.4434 19.8458 24.4434H10.8206C8.50813 24.4434 6.51712 22.8112 6.06361 20.5436L4.41797 12.3154M4.41797 12.3154L11.6948 5.03857"
                      stroke="#121B25"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add to Cart
                </button>
                <button className="inline-flex items-center justify-center gap-[11px] rounded-[8.5px] border border-[#2a3842] bg-[#1d2a35] px-12 py-[19px] text-[19px] font-medium leading-7 text-white">
                  Special Request
                </button>
              </div>

              {/* Shipping */}
              <div className="flex items-center gap-[17px] text-[17px] font-normal text-[#9ca3af]">
                <span>Limited edition</span>
                <span className="h-[5.6px] w-[5.6px] rounded-full bg-[#6b7280]" />
                <span>Ships in 3-5 business days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <GalleryLightbox
        open={open}
        images={images}
        initialIndex={startIndex}
        category={productCategory}
        region={productLocation}
        onClose={() => setOpen(false)}
      />

      {/* Related (You may also like) */}
      <ProductCarousel
        products={related}
        title="You may also like"
        autoplay={false}
        intervalMs={4500}
        maxSlides={5}
      />
    </main>
  );
};

export default GalleryDetails;
