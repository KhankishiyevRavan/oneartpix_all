// src/services/productService.ts
export type Product = {
  _id: string;
  title: string;
  mainImage: string;
  images: string[];
  category: string;
  location: string;
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type ListParams = {
  page?: number;
  pageSize?: number;
  q?: string;
  category?: string;
  location?: string;
  sort?: "new" | "priceAsc" | "priceDesc";
};

// ——— Config
const BASE_URL = import.meta.env?.VITE_API_URL || "";

// ——— Helper: API fetch
class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, { credentials: "include", ...init });
  let data: any = null;

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const msg =
      (typeof data === "object" && (data?.message || data?.error)) ||
      `HTTP ${res.status}`;
    throw new ApiError(msg, res.status);
  }
  return data as T;
}

// ——— Service
async function list(params: ListParams = {}): Promise<Paginated<Product>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));
  if (params.q) qs.set("q", params.q);
  if (params.category) qs.set("category", params.category);
  if (params.location) qs.set("location", params.location);
  if (params.sort) qs.set("sort", params.sort);
  const query = qs.toString();

  return apiFetch<Paginated<Product>>(
    `/api/products${query ? `?${query}` : ""}`
  );
}

async function remove(id: string): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>(`/api/products/${id}`, { method: "DELETE" });
}

// Yalnız mətn sahələrini yeniləmək üçün (backend: PATCH /api/products/:id — JSON)
async function updateJson(
  id: string,
  data: Partial<
    Pick<Product, "title" | "category" | "location" | "price" | "description">
  >
): Promise<Product> {
  return apiFetch<Product>(`/api/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// Şəkilləri də dəyişmək üçün (backend: PATCH /api/products/:id/form-data — multipart)
type UpdateFilesPayload = {
  title?: string;
  category?: string;
  location?: string;
  price?: number | string;
  description?: string;
  // istəyə görə fayllar
  mainImageFile?: File | null;
  imageFiles?: File[]; // tam əvəzləmə üçün göndər
};

async function updateWithFiles(
  id: string,
  payload: UpdateFilesPayload
): Promise<Product> {
  const fd = new FormData();
  if (payload.title !== undefined) fd.append("title", String(payload.title));
  if (payload.category !== undefined)
    fd.append("category", String(payload.category));
  if (payload.location !== undefined)
    fd.append("location", String(payload.location));
  if (payload.price !== undefined) fd.append("price", String(payload.price));
  if (payload.description !== undefined)
    fd.append("description", String(payload.description));
  if (payload.mainImageFile) fd.append("mainImage", payload.mainImageFile);
  if (payload.imageFiles?.length) {
    payload.imageFiles.forEach((f) => fd.append("images", f));
  }
  return apiFetch<Product>(`/api/products/${id}/form-data`, {
    method: "PATCH",
    body: fd,
  });
}

// ⬇️ ƏLAVƏ: ID ilə məhsulu çək
async function getById(id: string): Promise<Product> {
  return apiFetch<Product>(`/api/products/${id}`);
}

// ⬇️ ƏLAVƏ: eyni kateqoriyadan oxşar məhsullar (mövcud list() istifadə edir)
async function relatedByCategory(category: string, limit = 8) {
  const res = await list({ page: 1, pageSize: limit, category, sort: "new" });
  return res.data;
}
type UpdateAdvancedPayload = {
  title?: string;
  category?: string;
  location?: string;
  price?: number | string;
  description?: string;
  mainImageFile?: File | null; // yeni əsas şəkil (optional)
  addImageFiles?: File[]; // qalereyaya əlavə ediləcək yeni fayllar (optional)
  keepImages?: string[]; // mövcud qalereyadan saxlanılacaq URL-lər
};

async function updateWithFilesAdvanced(
  id: string,
  payload: UpdateAdvancedPayload
) {
  const fd = new FormData();
  if (payload.title !== undefined) fd.append("title", String(payload.title));
  if (payload.category !== undefined)
    fd.append("category", String(payload.category));
  if (payload.location !== undefined)
    fd.append("location", String(payload.location));
  if (payload.price !== undefined) fd.append("price", String(payload.price));
  if (payload.description !== undefined)
    fd.append("description", String(payload.description));
  if (payload.mainImageFile) fd.append("mainImage", payload.mainImageFile);
  if (payload.addImageFiles?.length) {
    payload.addImageFiles.forEach((f) => fd.append("images", f));
  }
  if (payload.keepImages?.length) {
    // server bir neçə "keepImages" fieldı kimi qəbul edir
    payload.keepImages.forEach((u) => fd.append("keepImages", u));
  }
  return apiFetch<Product>(`/api/products/${id}/form-data`, {
    method: "PATCH",
    body: fd,
  });
}
export const productService = {
  // mövcud metodlarınız:
  list,
  remove,
  updateJson,
  updateWithFiles,
  ApiError,
  // ⬇️ yeniləri:
  getById,
  relatedByCategory,
  updateWithFilesAdvanced
};
