// ✅ 3. ProductCard.tsx

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Heart, Star, CheckCircle } from "lucide-react";
import {
  addToWishlist,
  removeFromWishlist,
  isWished,
} from "../services/wishlistService";
import type { Product } from "../types/product";
import { useState } from "react";

type ProductCardProps = {
  product: Product;
  onWishlistToggle?: () => void; // 📌 Optional prop
};

export default function ProductCard({
  product,
  onWishlistToggle,
}: ProductCardProps) {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [wished, setWished] = useState(isWished(product._id));
  const currentLang = i18n.language as keyof Product["name"];

  //   const wished = isWished(product._id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (wished) {
      removeFromWishlist(product._id);
      setWished(false);
    } else {
      addToWishlist(product);
      setWished(true);
    }
    if (onWishlistToggle) onWishlistToggle(); // 📌 Burada çağırırıq
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="rounded-2xl overflow-hidden shadow-lg border bg-white hover:shadow-xl transition cursor-pointer"
    >
      {/* Şəkil */}
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src={`${import.meta.env.VITE_API_URL}${product.image || ""}`}
          alt={product.name?.[currentLang] || "No name"}
        />
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 left-2 rounded-full p-2 shadow-md hover:scale-110 transition ${
            wished ? "bg-red-500 text-white" : "bg-white text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${wished ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Kontent */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-red-600 font-bold text-xl">
            {product.price || "0"}₼
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Star className="text-yellow-500 w-4 h-4" />
            <span className="font-semibold">{product.rating || 0}</span>
          </div>
        </div>

        <h3 className="font-bold text-lg text-gray-800">
          {product.name?.[currentLang] || t("no_name")}
        </h3>

        <ul className="mt-2 space-y-1 text-gray-600 text-sm">
          <li className="flex items-center gap-2">
            <CheckCircle className="text-orange-500 w-4 h-4" />
            {product.time || "-"}
          </li>
        </ul>
      </div>
    </div>
  );
}
