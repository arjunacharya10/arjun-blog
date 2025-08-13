// components/SiteHeader.tsx
"use client";

import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="font-black tracking-tight text-[20px]">
          Arjun Acharya
        </Link>
        <nav className="flex items-center gap-5">
          <button>Subscribe</button>
        </nav>
      </div>
    </header>
  );
}
