import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fuel QR Release – Help new owners get their fuel pass",
  description:
    "If you sold your vehicle, release your old fuel pass QR so the new owner can register. Request or release in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-4 sm:px-6">
            <Link
              href="/"
              className="text-lg font-semibold text-slate-800 hover:text-slate-600"
            >
              Fuel QR Release
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                New request
              </Link>
              <Link
                href="/board"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Browse requests
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
