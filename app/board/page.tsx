"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Request = {
  id: string;
  registrationNumber: string;
  message?: string;
  status: string;
  createdAt: string;
};

export default function BoardPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "released">("open");

  // ✅ Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // ✅ API call (uses debouncedSearch instead of search)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());

    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/requests?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (res.ok) setRequests(Array.isArray(data) ? data : []);
        else setRequests([]);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setRequests([]);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort(); // ✅ cancel previous request
  }, [filter, debouncedSearch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Browse requests</h1>
        <p className="mt-1 text-slate-600">
          Find your old vehicle by registration number. If you see one you used to
          own, open fuelpass.gov.lk to delete your QR, then open the request and
          mark it released.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by registration number"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          {(["open", "released", "all"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-700 hover:bg-slate-300"
              }`}
            >
              {f === "open" ? "Open" : f === "released" ? "Released" : "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : requests.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
          No requests found. Try changing the filter or search.
        </div>
      ) : (
        <ul className="space-y-3">
          {requests.map((r) => (
            <li key={r.id}>
              <Link
                href={`/request/${r.id}`}
                className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900">
                    {r.registrationNumber}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.status === "open"
                        ? "bg-amber-100 text-amber-800"
                        : r.status === "released"
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                {r.message && (
                  <p className="mt-1 text-sm text-slate-600">{r.message}</p>
                )}

                <p className="mt-1 text-xs text-slate-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
        <p>
          If you’re the new owner,{" "}
          <Link href="/" className="font-medium text-blue-600 hover:underline">
            create a request
          </Link>{" "}
          and share the link with the previous owner for the easiest flow.
        </p>
      </div>
    </div>
  );
}