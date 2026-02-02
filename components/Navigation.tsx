"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", emoji: "🏠" },
    { href: "/filters", label: "Filters", emoji: "🎨" },
    { href: "/bg-changer", label: "BG Changer", emoji: "🎯" },
    { href: "/compressor", label: "Compressor", emoji: "📦" },
    { href: "/cropper", label: "Crop", emoji: "✂️" },
    { href: "/resize", label: "Resize", emoji: "📐" },
    { href: "/rotate", label: "Rotate", emoji: "🔄" },
    { href: "/watermark", label: "Watermark", emoji: "📝" },
    { href: "/bg-remover", label: "BG Remover", emoji: "🎭" },
  ];

  return (
    <nav 
      ref={navRef}
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "gradient-primary shadow-lg shadow-purple-500/50" 
          : "glass-effect border-b border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-3xl font-bold text-gradient hover:opacity-80 transition-opacity duration-300 transform hover:scale-105 font-[var(--font-space-grotesk)]"
          >
            ✨ ImageLab
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 lg:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 lg:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-xs lg:text-sm ${
                  isActive(link.href)
                    ? `${isScrolled ? "bg-white/20" : "bg-gradient-primary"} text-white shadow-lg transform scale-105`
                    : isScrolled
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                }`}
              >
                <span className="mr-1">{link.emoji}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-fadeInDown">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  isActive(link.href)
                    ? "gradient-primary text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="mr-2">{link.emoji}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
