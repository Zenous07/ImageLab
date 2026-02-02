"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-3xl font-bold text-gradient hover:opacity-80 transition-opacity duration-300 transform hover:scale-105"
          >
            ✨ ImageLab
          </Link>
          <div className="flex gap-2 md:gap-6">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive("/")
                  ? "bg-gradient-primary text-white shadow-lg shadow-purple-500/50 transform scale-105"
                  : "text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              Home
            </Link>
            <Link
              href="/filters"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive("/filters")
                  ? "bg-gradient-success text-white shadow-lg shadow-pink-500/50 transform scale-105"
                  : "text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              Filters
            </Link>
            <Link
              href="/bg-changer"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive("/bg-changer")
                  ? "bg-gradient-warning text-white shadow-lg shadow-blue-500/50 transform scale-105"
                  : "text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              BG Changer
            </Link>
            <Link
              href="/compressor"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive("/compressor")
                  ? "bg-gradient-info text-white shadow-lg shadow-green-500/50 transform scale-105"
                  : "text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm"
              }`}
            >
              Compressor
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
