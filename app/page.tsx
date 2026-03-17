"use client";

import { useState } from "react";
import Link from "next/link";

type Result = { id: string; registrationNumber: string } | null;

export default function HomePage() {
  const [regNo, setRegNo] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    const trimmed = regNo.trim();
    if (!trimmed) {
      setError("Enter the vehicle registration number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationNumber: trimmed,
          message: message.trim() || undefined,
          notifyEmail: email.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setResult({ id: data.id, registrationNumber: data.registrationNumber });
      setRegNo("");
      setMessage("");
      setEmail("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const shareUrl = result
    ? typeof window !== "undefined"
      ? `${window.location.origin}/request/${result.id}`
      : ""
    : "";

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Can’t get a fuel QR? Request a release
        </h1>
        <p className="mt-2 text-slate-600">
          New owner of a vehicle? Post your registration number and get a link to
          share. The previous owner can open the link, delete their QR on
          fuelpass.gov.lk, and mark it released.
        </p>
      </div>

      <div className="mx-auto max-w-lg">
        {result ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
            <p className="font-medium text-green-800">
              Request created for <strong>{result.registrationNumber}</strong>
            </p>
            <p className="mt-2 text-sm text-green-700">
              Share this link with the previous owner (e.g. via WhatsApp or
              Facebook). When they release the QR, you can register on
              fuelpass.gov.lk.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <input
                readOnly
                value={shareUrl}
                className="w-full rounded-lg border border-green-300 bg-white px-3 py-2 text-sm text-slate-800 sm:w-72"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                }}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Copy link
              </button>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                href={`/request/${result.id}`}
                className="text-sm text-green-700 underline hover:text-green-800"
              >
                Open request page
              </Link>
              <button
                type="button"
                onClick={() => setResult(null)}
                className="text-sm text-green-700 underline hover:text-green-800"
              >
                Create another request
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label htmlFor="regNo" className="block text-sm font-medium text-slate-700">
                Vehicle registration number *
              </label>
              <input
                id="regNo"
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. CAR-1234"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                Short message (optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Bought in Jan 2025"
                rows={2}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email for notification when released (optional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating…" : "Create request & get shareable link"}
            </button>
          </form>
        )}
      </div>

      <div className="rounded-lg bg-slate-100 p-4 text-center text-sm text-slate-600">
        <p>
          You can also{" "}
          <Link href="/board" className="font-medium text-blue-600 hover:underline">
            browse all requests
          </Link>{" "}
          to see if your old vehicle is listed and release it there.
        </p>
      </div>
    </div>
  );
}
