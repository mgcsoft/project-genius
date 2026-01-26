"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header
      className="w-full sticky top-0 z-[1] flex justify-between items-center py-3 lux-header-padding header-bottom-divider-line"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "saturate(180%) blur(5px)",
        boxShadow: "rgb(242, 244, 244) 0px 0px 0px 2px",
      }}
    >
      {/* Logo section - hidden on mobile */}
      <div className="hidden md:flex items-center gap-4">
        <Link href="/">
          <Image
            src="/GENIUS.png"
            alt="GENIUS logo"
            width={80}
            height={40}
            style={{ width: 80, height: 40 }}
          />
        </Link>
      </div>

      {/* Spacer for mobile - pushes button to right when logo is hidden */}
      <div className="md:hidden" />

      {/* Home button */}
      <Link
        href="/"
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium text-sm"
        style={{
          background: "linear-gradient(to right, rgb(0, 126, 132), rgb(0, 160, 160))",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        Home
      </Link>
    </header>
  );
}
