import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export type Product = {
  id: string;
  image: string;
  category: string;
  location: string;
  title: string;
  price?: number; // optional: əgər servisdən gəlirsə göstərmək/səbətə qoymaq üçün
};

interface ProductsProps {
  products: Product[];
  total?: number;
  showingFrom?: number;
  showingTo?: number;
  loading?: boolean; // ✅ əlavə olundu
}

export default function Products({
  products,
  total = 0,
  showingFrom = 0,
  showingTo = 0,
  loading = false,
}: ProductsProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Skeleton (loading)
  if (loading) {
    const count =
      showingTo - showingFrom + 1 > 0 ? showingTo - showingFrom + 1 : 12;
    return (
      <section id="products" className="max-w-[1268px] mx-auto py-10">
        <div className="grid grid-cols-3 gap-x-[54px] gap-y-[66px] max-[1024px]:grid-cols-2 max-[1024px]:gap-[40px] max-[768px]:grid-cols-1">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="bg-[#1d2a35] border border-[#2a3842] rounded-[12px] overflow-hidden"
            >
              <div className="h-[265px] bg-[#0f1720] animate-pulse" />
              <div className="p-[16px_25px_25px]">
                <div className="h-5 w-3/4 bg-[#0f1720] animate-pulse rounded mb-2" />
                <div className="h-4 w-1/2 bg-[#0f1720] animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="max-w-[1268px] mx-auto py-10">
      {/* Summary (istəsən saxla) */}
      {/* {total > 0 && showingFrom > 0 && showingTo > 0 && (
        <div className="mb-[22px]">
          <p className="m-0 text-[#9ca3af] text-[17px] leading-[28px]">
            Showing {showingFrom} - {showingTo} of {total} results
          </p>
        </div>
      )} */}

      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-x-[54px] gap-y-[66px] max-[1024px]:grid-cols-2 max-[1024px]:gap-[40px] max-[768px]:grid-cols-1">
        {products.map((product) => {
          // Yeni detal route:
          const detailHref = `/products/${product.id}`;
          // Köhnə (query-string) route lazımdırsa bunu istifadə et:
          // const detailHref = `/gallery/detail?image=${encodeURIComponent(product.image)}&loc=${encodeURIComponent(product.location)}&title=${encodeURIComponent(product.title)}&category=${encodeURIComponent(product.category)}`;

          return (
            <article
              key={product.id}
              onClick={() => navigate(detailHref)}
              className="bg-[#1d2a35] border border-[#2a3842] rounded-[12px] shadow-[0px_6px_9px_-2px_rgba(0,0,0,0.1),0px_3px_6px_-3px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-[265px]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover block"
                  loading="lazy"
                />
                <span className="absolute top-[19px] left-[19px] bg-[rgba(18,27,37,0.8)] border border-[#2a3842] rounded-full py-[7px] px-[14px] text-[#ffd8a2] text-[16px] font-medium leading-[25px]">
                  {product.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-[20px] p-[16px_25px_25px]">
                <div className="flex flex-col gap-[2px]">
                  <p className="m-0 text-[#9ca3af] text-[16px] leading-[25px] font-normal">
                    {product.location}
                  </p>
                  <h3 className="m-0 text-white text-[20px] font-medium leading-[37px]">
                    {product.title}
                  </h3>
                </div>

                <button
                  className="bg-[#171717] border border-[rgba(139,139,139,0.11)] rounded-[9px] p-[15px] flex justify-center items-center gap-[11px] text-[#d1d5db] text-[18px] font-medium leading-none hover:bg-[#2a2a2a] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: product.id, // ✅ real backend ID
                      title: product.title,
                      image: product.image,
                      category: product.category,
                      location: product.location,
                      price: product.price ?? 2100, // lazım olsa default saxla
                      qty: 1,
                    });
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      stroke="#d1d5db"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Add to Cart</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
