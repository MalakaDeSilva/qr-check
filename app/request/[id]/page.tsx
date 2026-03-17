"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const FUELPASS_URL = "https://fuelpass.gov.lk";

type Request = {
  id: string;
  registrationNumber: string;
  message?: string;
  status: "open" | "released" | "confirmed";
  createdAt: string;
  releasedAt?: string;
};

export default function RequestPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState(false);
  const [released, setReleased] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/requests/${id}`);
        const data = await res.json();
        if (cancelled) return;
        if (res.ok) {
          setRequest(data);
          if (data.status === "released" || data.status === "confirmed") {
            setReleased(true);
          }
        } else {
          setRequest(null);
        }
      } catch {
        if (!cancelled) setRequest(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleMarkReleased() {
    if (!id) return;
    setReleasing(true);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "release" }),
      });
      if (res.ok) {
        const data = await res.json();
        setRequest(data);
        setReleased(true);
      }
    } finally {
      setReleasing(false);
    }
  }

  if (loading || !id) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">Request not found.</p>
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Create a new request
        </Link>
      </div>
    );
  }

  const isOpen = request.status === "open";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Vehicle registration</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">
          {request.registrationNumber}
        </p>
        {request.message && (
          <p className="mt-2 text-slate-600">{request.message}</p>
        )}
      </div>

      {released ? (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6">
          <h2 className="font-semibold text-green-800">
            {request.status === "confirmed"
              ? "Successfully resolved"
              : "Someone has marked this vehicle as released"}
          </h2>
          <p className="mt-2 text-sm text-green-700">
            The previous owner has indicated they deleted the QR on fuelpass.gov.lk.
            Try registering this vehicle at{" "}
            <a
              href={FUELPASS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              fuelpass.gov.lk
            </a>
            .
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Create another request
            </Link>
          </div>
        </div>
      ) : isOpen ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="font-semibold text-amber-900">
            Previous owner: please release this vehicle’s QR
          </h2>
          <p className="mt-2 text-sm text-amber-800">
            The new owner of this vehicle cannot get a fuel pass until the old QR
            is removed. If you used to own this vehicle and still have a QR for it,
            follow these steps:
          </p>
          <ol className="mt-4 list-inside list-decimal space-y-3 text-sm text-amber-900">
            <li>
              Open fuelpass.gov.lk and log in. Delete the QR for this vehicle (
              <strong>{request.registrationNumber}</strong>).
            </li>
            <li>
              When you’ve deleted it, click the button below to let the new owner
              know.
            </li>
          </ol>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={FUELPASS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-3 font-medium text-white hover:bg-amber-700"
            >
              Open fuelpass.gov.lk to delete your QR
            </a>
            <button
              type="button"
              onClick={handleMarkReleased}
              disabled={releasing}
              className="inline-flex items-center justify-center rounded-lg border-2 border-amber-600 bg-white px-4 py-3 font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
            >
              {releasing ? "Updating…" : "I’ve deleted the QR – mark as released"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
