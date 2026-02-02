"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/", label: "Dashboard", icon: "🏠" },
    { href: "/filters", label: "Filters", icon: "🎨" },
    { href: "/bg-changer", label: "BG Changer", icon: "🎯" },
    { href: "/bg-remover", label: "BG Remover", icon: "🎭" },
    { href: "/compressor", label: "Compress", icon: "📦" },
    { href: "/cropper", label: "Crop", icon: "✂️" },
    { href: "/resize", label: "Resize", icon: "📐" },
    { href: "/rotate", label: "Rotate", icon: "🔄" },
    { href: "/watermark", label: "Watermark", icon: "📝" },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-gold-500/20 transition-all duration-300 z-40 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Logo */}
          <div className="mb-8">
            <Link
              href="/"
              className="flex items-center gap-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-cyan-400 hover:opacity-80 transition-opacity font-[var(--font-space-grotesk)]"
            >
              <span className="text-3xl">✨</span>
              {!isCollapsed && <span>ImageLab</span>}
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group font-[var(--font-space-grotesk)] ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-gold-500/30 to-cyan-500/30 border border-gold-500/50 text-gold-300 shadow-lg shadow-gold-500/20"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-xl"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div className="md:hidden fixed inset-0 bg-black/50 z-30 pointer-events-none" />
    </>
  );
}
