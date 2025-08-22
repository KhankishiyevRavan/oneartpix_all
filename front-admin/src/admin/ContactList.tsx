import { useEffect, useMemo, useState } from "react";
import contactClient, { ContactItem } from "../services/contactService";

const PAGE_SIZE = 10;

const normalize = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

export default function ContactList() {
  const [all, setAll] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | "new" | "read" | "archived">("");

  // pagination
  const [page, setPage] = useState(1);

  // detail modal
  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ContactItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // initial load (only once)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const items = await contactClient.listContacts();
        if (!mounted) return;
        // default: newest first (already sorted in backend, just in case sort here too)
        const sorted = [...items].sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
        );
        setAll(sorted);
      } catch (e: any) {
        if (!mounted) return;
        setErr(e?.message || "Yükləmə xətası.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // filter + search client-side
  const filtered = useMemo(() => {
    let arr = [...all];
    if (status) arr = arr.filter((x) => x.status === status);

    const q = normalize(search.trim());
    if (q) {
      arr = arr.filter((x) => {
        return (
          normalize(x.name).includes(q) ||
          normalize(x.email).includes(q) ||
          normalize(x.message).includes(q)
        );
      });
    }
    return arr;
  }, [all, status, search]);

  // pagination calc
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, total);
  const pageItems = filtered.slice(startIdx, endIdx);

  // detail open
  const openDetail = async (id: string) => {
    try {
      setDetailLoading(true);
      setOpenId(id);
      const item = await contactClient.getContact(id);
      setDetail(item);
    } catch (e: any) {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setOpenId(null);
    setDetail(null);
  };

  const badge = (s: ContactItem["status"]) => {
    const base =
      "inline-flex items-center px-2 py-0.5 rounded-full border text-xs";
    if (s === "new")
      return (
        <span className={`${base} border-amber-400/30 text-amber-300`}>
          new
        </span>
      );
    if (s === "read")
      return (
        <span className={`${base} border-sky-400/30 text-sky-300`}>read</span>
      );
    return (
      <span className={`${base} border-zinc-500/40 text-zinc-300`}>
        archived
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-[#121b25] text-white">
      <section className="max-w-[1268px] mx-auto px-5 py-8">
        <h1 className="text-2xl font-semibold mb-6">Contact Messages</h1>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, email, message…"
            className="w-full sm:max-w-md rounded-md bg-[#1d2a35] border border-[#2a3842] px-3 py-2 outline-none"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as any);
              setPage(1);
            }}
            className="w-full sm:w-[200px] rounded-md bg-[#1d2a35] border border-[#2a3842] px-3 py-2 outline-none"
          >
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Summary */}
        <div className="mb-4 text-[#9ca3af]">
          {loading ? (
            <p>Loading…</p>
          ) : err ? (
            <p className="text-red-400">{err}</p>
          ) : total > 0 ? (
            <p>
              Showing {startIdx + 1} - {endIdx} of {total} results
              {status ? ` · ${status}` : ""}
              {search ? ` · “${search}”` : ""}
            </p>
          ) : (
            <p>No results found{search ? ` for “${search}”` : ""}.</p>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-[#2a3842]">
          <table className="min-w-full text-left">
            <thead className="bg-[#0f1822] text-[#9ca3af] text-sm">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-[#9ca3af]"
                  >
                    Loading…
                  </td>
                </tr>
              ) : pageItems.length ? (
                pageItems.map((m) => (
                  <tr
                    key={m._id}
                    className="border-t border-[#2a3842] hover:bg-[#1a2632]"
                  >
                    <td className="px-4 py-3">{m.name}</td>
                    <td className="px-4 py-3 text-[#9ca3af]">{m.email}</td>
                    <td className="px-4 py-3">
                      <span title={m.message}>
                        {m.message.length > 80
                          ? m.message.slice(0, 80) + "…"
                          : m.message}
                      </span>
                    </td>
                    <td className="px-4 py-3">{badge(m.status)}</td>
                    <td className="px-4 py-3 text-[#9ca3af]">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openDetail(m._id)}
                        className="rounded-md border border-[#2a3842] bg-[#1d2a35] px-3 py-1.5 text-sm hover:bg-[#233141]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-[#9ca3af]"
                  >
                    No messages.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              className="px-3 py-2 rounded-md border border-[#2a3842] bg-[#1d2a35] disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              Prev
            </button>
            <span className="px-3 py-2 text-[#9ca3af]">
              Page {currentPage} / {totalPages}
            </span>
            <button
              className="px-3 py-2 rounded-md border border-[#2a3842] bg-[#1d2a35] disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {openId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-lg border border-[#2a3842] bg-[#0f1822]">
            <div className="flex items-center justify-between border-b border-[#2a3842] px-5 py-3">
              <h3 className="text-lg font-semibold">Message detail</h3>
              <button
                className="rounded-md border border-[#2a3842] bg-[#1d2a35] px-3 py-1 text-sm hover:bg-[#233141]"
                onClick={closeDetail}
              >
                Close
              </button>
            </div>

            {detailLoading ? (
              <div className="p-5 text-[#9ca3af]">Loading…</div>
            ) : detail ? (
              <div className="p-5 space-y-3">
                <div className="text-sm text-[#9ca3af]">
                  <span className="mr-2">{badge(detail.status)}</span>
                  <span>{new Date(detail.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <div className="text-white font-medium">{detail.name}</div>
                  <div className="text-[#9ca3af]">{detail.email}</div>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {detail.message}
                </div>
                {(detail.ip || detail.userAgent) && (
                  <div className="mt-3 text-xs text-[#9ca3af]">
                    {detail.ip ? <div>IP: {detail.ip}</div> : null}
                    {detail.userAgent ? (
                      <div>UA: {detail.userAgent}</div>
                    ) : null}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-5 text-red-400">Not found.</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
