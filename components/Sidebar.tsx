"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const delta = e.clientX - dragStart;

      // Drag left to collapse
      if (delta < -50 && isOpen) {
        setIsOpen(false);
        setIsDragging(false);
      }

      // Drag right to expand
      if (delta > 50 && !isOpen) {
        setIsOpen(true);
        setIsDragging(false);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, isOpen, setIsOpen]);

  return (
    <>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        onMouseDown={handleMouseDown}
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-gold-500/20 transition-all duration-300 z-40 cursor-grab active:cursor-grabbing ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "16rem" }}
      >
        <div className="p-6 flex flex-col h-full select-none">
          {/* Logo */}
          <div className="mb-8">
            <Link
              href="/"
              className="flex items-center gap-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-cyan-400 hover:opacity-80 transition-opacity font-[var(--font-space-grotesk)]"
              onClick={(e) => {
                if (isDragging) e.preventDefault();
              }}
            >
              <span className="text-3xl">✨</span>
              <span>ImageLab</span>
            </Link>
          </div>

          {/* Navigation Items - Scrollable - Hidden Scrollbar */}
          <nav className="flex-1 space-y-2 overflow-y-auto pr-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <style>{`
              nav::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group font-[var(--font-space-grotesk)] pointer-events-auto ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-gold-500/30 to-cyan-500/30 border border-gold-500/50 text-gold-300 shadow-lg shadow-gold-500/20"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                onClick={(e) => {
                  if (isDragging) e.preventDefault();
                }}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="flex-1 text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer Hint */}
          <div className="space-y-3">
            <p className="text-xs text-white/40 px-4 font-[var(--font-space-mono)] text-center">
              💡 Drag left to collapse
            </p>
          </div>
        </div>
      </div>

      {/* Expand Button - Floating (only show when collapsed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-gold-500 to-cyan-500 hover:from-gold-400 hover:to-cyan-400 text-slate-950 p-3 rounded-lg font-bold hover:shadow-xl hover:shadow-gold-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 font-[var(--font-space-grotesk)] text-xl"
          title="Expand Sidebar"
        >
          →
        </button>
      )}

      {/* Mobile overlay */}
      <div className="md:hidden fixed inset-0 bg-black/50 z-30 pointer-events-none" />
    </>
  );
}
