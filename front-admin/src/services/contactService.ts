// src/service/contactService.ts

export type ContactItem = {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "archived";
  ip?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
};

type ListResp = { items: ContactItem[] };
type GetResp = { item: ContactItem };

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

export async function listContacts(): Promise<ContactItem[]> {
  try {
    // ✅ DOĞRU ENDPOINT: /api/contacts (ÇOĞUL)
    const { items } = await apiFetch<ListResp>(
      "/api/contacts"
    );
    // ✅ Obyekti düzgün logla
    console.log("[listContacts] items:", items);
    return Array.isArray(items) ? items : [];
  } catch (e: any) {
    // ✅ Xətanı detallı göstər
    console.error("[listContacts] error:", {
      status: e?.status,
      message: e?.message,
      error: e,
    });
    throw e; // UI-da göstərilsin deyə yuxarı atırıq
  }
}

export async function getContact(id: string): Promise<ContactItem> {
  try {
    // ✅ DOĞRU ENDPOINT
    const { item } = await apiFetch<GetResp>(
      `/api/contacts/${id}`
    );
    console.log("[getContact] item:", item);
    return item;
  } catch (e: any) {
    console.error("[getContact] error:", {
      id,
      status: e?.status,
      message: e?.message,
      error: e,
    });
    throw e;
  }
}

const contactClient = { listContacts, getContact, ApiError };
export default contactClient;
