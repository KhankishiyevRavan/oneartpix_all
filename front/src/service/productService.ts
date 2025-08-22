// src/service/productService.ts

// UI grid üçün tip
export type UIProduct = {
  id: string;
  image: string;
  category: string;
  location: string;
  title: string;
  price: number;
  createdAt?: string;
};

// Backend-dən gələn product tipi
export type APIProduct = {
  _id: string;
  mainImage: string;
  images: string[];
  category: string;
  location: string;
  title: string;
  price: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

type ApiListResponse = {
  data: APIProduct[];
  total: number;
  page: number;
  pageSize: number;
};

// ---- Sort
export const SORT_VALUES = [
  "default",
  "new",
  "priceAsc",
  "priceDesc",
  "az",
  "za",
] as const;
export type SortKey = (typeof SORT_VALUES)[number];

export function parseSort(s: string): SortKey {
  return (SORT_VALUES as readonly string[]).includes(s)
    ? (s as SortKey)
    : "default";
}

// ---- ENV & fetch helper
const RAW_BASE = import.meta.env?.VITE_API_URL ?? "";
const BASE_URL = String(RAW_BASE).replace(/\/+$/, "");
const makeUrl = (p: string) => `${BASE_URL}${p.startsWith("/") ? p : `/${p}`}`;

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(makeUrl(path), { credentials: "include", ...init });
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json")
    ? await res.json()
    : await res.text();
  if (!res.ok) {
    const msg =
      (typeof data === "object" && (data?.message || data?.error)) ||
      `HTTP ${res.status}`;
    throw new ApiError(msg, res.status);
  }
  return data as T;
}

function mapToUI(p: APIProduct): UIProduct {
  return {
    id: p._id,
    image: p.mainImage,
    category: p.category,
    location: p.location,
    title: p.title,
    price: p.price,
    createdAt: p.createdAt,
  };
}

// ---- Public API
export type ListParams = {
  page?: number;
  pageSize?: number;
  q?: string;
  category?: string | null;
  location?: string | null;
  // "default" | "new" | "priceAsc" | "priceDesc" → serverdə sort
  // "az" | "za" → client-də başlığa görə sort (Gallery edəcək)
  sort?: SortKey;
};

export async function listUI(params: ListParams = {}) {
  const qs = new URLSearchParams();
  qs.set("page", String(params.page ?? 1));
  qs.set("pageSize", String(params.pageSize ?? 12));
  if (params.q) qs.set("q", params.q);
  if (params.category) qs.set("category", params.category);
  if (params.location) qs.set("location", params.location);

  // Server sort xəritəsi (title sortu serverdə yoxdursa ötürməyək)
  const sortMap: Record<SortKey, "new" | "priceAsc" | "priceDesc" | undefined> =
    {
      default: "new",
      new: "new",
      priceAsc: "priceAsc",
      priceDesc: "priceDesc",
      az: undefined,
      za: undefined,
    };
  const serverSort = sortMap[params.sort ?? "default"];
  if (serverSort) qs.set("sort", serverSort);

  const resp = await apiFetch<ApiListResponse>(
    `/api/products?${qs.toString()}`
  );
  const items = Array.isArray(resp.data) ? resp.data.map(mapToUI) : [];
  return {
    items,
    total: resp.total ?? 0,
    page: resp.page ?? 1,
    pageSize: resp.pageSize ?? params.pageSize ?? 12,
  };
}


export async function getDetail(id: string): Promise<APIProduct> {
  return apiFetch<APIProduct>(`/api/products/${id}`);
}

const productsClient = { getDetail, listUI, parseSort, ApiError };
export default productsClient;
