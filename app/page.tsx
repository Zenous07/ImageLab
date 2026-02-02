"use client";

import Navigation from "@/components/Navigation";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  const tools = [
    {
      id: 1,
      title: "Image Filters",
      description: "Professional filters with undo/redo, custom presets, and number controls.",
      icon: "🎨",
      href: "/filters",
      gradient: "bg-gradient-to-br from-[#d4af37] via-[#b8960f] to-[#8b5cf6]",
      shadowColor: "shadow-[#d4af37]/40",
      size: "md:col-span-1",
    },
    {
      id: 2,
      title: "Background Changer",
      description: "Replace background colors with eye dropper tool for precise selection.",
      icon: "🎯",
      href: "/bg-changer",
      gradient: "bg-gradient-to-br from-[#00d9ff] via-[#0099cc] to-[#00b8d4]",
      shadowColor: "shadow-[#00d9ff]/40",
      size: "md:col-span-1",
    },
    {
      id: 3,
      title: "Image Compressor",
      description: "Reduce image size while maintaining quality with advanced algorithms.",
      icon: "📦",
      href: "/compressor",
      gradient: "bg-gradient-to-br from-[#ff006e] via-[#cc0055] to-[#d4af37]",
      shadowColor: "shadow-[#ff006e]/40",
      size: "md:col-span-1",
    },
    {
      id: 4,
      title: "Background Remover",
      description: "Compare 4 AI-like algorithms to remove backgrounds with precision.",
      icon: "🎭",
      href: "/bg-remover",
      gradient: "bg-gradient-to-br from-[#8b5cf6] via-[#6d28d9] to-[#00d9ff]",
      shadowColor: "shadow-[#8b5cf6]/40",
      size: "md:col-span-2",
    },
    {
      id: 5,
      title: "Image Cropper",
      description: "Crop with aspect ratio presets and freeform options.",
      icon: "✂️",
      href: "/cropper",
      gradient: "bg-gradient-to-br from-[#d4af37] via-[#ff6b35] to-[#ff006e]",
      shadowColor: "shadow-[#ff6b35]/40",
      size: "md:col-span-1",
    },
    {
      id: 6,
      title: "Image Resize",
      description: "Resize images with aspect ratio control and size presets.",
      icon: "📐",
      href: "/resize",
      gradient: "bg-gradient-to-br from-[#00d9ff] via-[#00b8d4] to-[#8b5cf6]",
      shadowColor: "shadow-[#00d9ff]/40",
      size: "md:col-span-1",
    },
    {
      id: 7,
      title: "Rotate & Flip",
      description: "Rotate any angle and flip horizontally or vertically.",
      icon: "🔄",
      href: "/rotate",
      gradient: "bg-gradient-to-br from-[#ff006e] via-[#f723d4] to-[#d4af37]",
      shadowColor: "shadow-[#ff006e]/40",
      size: "md:col-span-1",
    },
    {
      id: 8,
      title: "Watermark & Text",
      description: "Add custom text overlays with position presets and opacity control.",
      icon: "📝",
      href: "/watermark",
      gradient: "bg-gradient-to-br from-[#8b5cf6] via-[#6d28d9] to-[#d4af37]",
      shadowColor: "shadow-[#8b5cf6]/40",
      size: "md:col-span-1",
    },
  ];

  useEffect(() => {
    // Set initial states to visible
    gsap.set(".hero-title", { opacity: 1, y: 0 });
    gsap.set(".hero-desc", { opacity: 1, y: 0 });
    gsap.set(".feature-badge", { opacity: 1, scale: 1 });
    gsap.set(".tool-card", { opacity: 1, y: 0 });
    gsap.set(".feature-card", { opacity: 1, y: 0 });
    gsap.set(".cta-section", { opacity: 1, y: 0 });

    // Hero section animation
    gsap.from(".hero-title", {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power2.out",
    });

    gsap.from(".hero-desc", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.2,
      ease: "power2.out",
    });

    // Feature badges animation
    gsap.from(".feature-badge", {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.4,
      ease: "back.out",
    });

    // Tool cards stagger animation
    gsap.from(".tool-card", {
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.08,
      delay: 0.6,
      ease: "power2.out",
    });

    // Add hover animation to tool cards
    document.querySelectorAll(".tool-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -8,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(card.querySelector(".tool-icon"), {
          scale: 1.3,
          duration: 0.3,
          ease: "back.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(card.querySelector(".tool-icon"), {
          scale: 1,
          duration: 0.3,
          ease: "back.out",
        });
      });
    });

    // Features section animation
    gsap.from(".feature-card", {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      delay: 1,
      ease: "power2.out",
    });

    // CTA section animation
    gsap.from(".cta-section", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      delay: 1.3,
      ease: "power2.out",
    });
  }, []);

  return (
    <>
      <Navigation />
      <main ref={containerRef} className="min-h-screen pb-20 relative overflow-hidden">
        {/* Animated background gradients */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-br from-indigo-600/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="hero-title text-6xl md:text-7xl font-bold mb-6 text-white leading-tight font-[var(--font-space-grotesk)]">
              <span className="text-gradient">Professional Image</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                Processing Toolkit
              </span>
            </h1>
            <p className="hero-desc text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed font-[var(--font-space-mono)]">
              Fast, powerful, and completely client-side. Your images, your rules, your device.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <div className="feature-badge flex items-center gap-2 text-white/90 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm border border-purple-400/30 rounded-lg font-[var(--font-space-mono)] hover:border-purple-400/60 transition-all">
                <span>⚡</span> Lightning Fast
              </div>
              <div className="feature-badge flex items-center gap-2 text-white/90 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg font-[var(--font-space-mono)] hover:border-blue-400/60 transition-all">
                <span>🔒</span> 100% Private
              </div>
              <div className="feature-badge flex items-center gap-2 text-white/90 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-400/30 rounded-lg font-[var(--font-space-mono)] hover:border-indigo-400/60 transition-all">
                <span>📱</span> Fully Responsive
              </div>
            </div>
          </div>

          {/* Bento Grid */}
          <div ref={toolsRef} className="grid md:grid-cols-3 gap-6 mb-20">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className={`tool-card group bento-card ${tool.size}`}
              >
                <div className="relative h-full overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl">
                  {/* Gradient Background */}
                  <div className={`${tool.gradient} absolute inset-0`}></div>
                  
                  {/* Shine effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                    <div>
                      <div className="tool-icon text-6xl mb-4 transform transition-transform duration-500">
                        {tool.icon}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-3 font-[var(--font-space-grotesk)] group-hover:text-white transition-colors">
                        {tool.title}
                      </h2>
                      <p className="text-white/85 text-base leading-relaxed font-[var(--font-space-mono)]">
                        {tool.description}
                      </p>
                    </div>
                    
                    {/* Button */}
                    <button className="mt-6 px-6 py-3 bg-white/25 backdrop-blur-sm border border-white/40 text-white font-bold rounded-lg hover:bg-white/40 transition-all duration-300 transform group-hover:translate-x-1 flex items-center gap-2 w-full justify-center font-[var(--font-space-grotesk)] shadow-lg">
                      Open Tool
                      <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Features Section */}
          <div className="bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50 rounded-2xl p-12 mb-16 border border-purple-500/20 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-white mb-12 text-center font-[var(--font-space-grotesk)]">
              Why Choose ImageLab?
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: "⚡",
                  title: "Instant Processing",
                  desc: "Real-time preview with zero latency",
                  gradient: "from-yellow-500/30 to-orange-500/30",
                },
                {
                  icon: "🔒",
                  title: "Complete Privacy",
                  desc: "Everything happens on your device",
                  gradient: "from-green-500/30 to-emerald-500/30",
                },
                {
                  icon: "🎨",
                  title: "Multiple Tools",
                  desc: "9+ professional tools included",
                  gradient: "from-blue-500/30 to-purple-500/30",
                },
                {
                  icon: "📱",
                  title: "Mobile Ready",
                  desc: "Perfect on any screen size",
                  gradient: "from-pink-500/30 to-rose-500/30",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`feature-card text-center p-6 rounded-xl bg-gradient-to-br ${feature.gradient} border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-xl backdrop-blur-sm`}
                >
                  <div className="text-5xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2 font-[var(--font-space-grotesk)]">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 font-[var(--font-space-mono)]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section text-center">
            <div className="bg-gradient-to-r from-purple-600/50 via-indigo-600/50 to-blue-600/50 rounded-2xl p-12 border border-purple-400/30 backdrop-blur-sm hover:border-purple-400/60 transition-all duration-300">
              <h3 className="text-3xl font-bold text-white mb-4 font-[var(--font-space-grotesk)]">
                Ready to enhance your images?
              </h3>
              <p className="text-white/80 mb-8 text-lg font-[var(--font-space-mono)]">
                Choose any tool above and get started instantly
              </p>
              <Link
                href="/filters"
                className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 font-[var(--font-space-grotesk)]"
              >
                ✨ Start Now
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

