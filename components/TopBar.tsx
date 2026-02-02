"use client";

export default function TopBar() {
  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-gradient-to-r from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-b border-gold-500/20 flex items-center px-8 z-30">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold text-white font-[var(--font-space-grotesk)] hidden md:block">
          ImageLab Studio
        </h1>
        
        <div className="flex items-center gap-4">
          {/* Theme indicator */}
          <div className="flex items-center gap-2 text-gold-400 font-[var(--font-space-mono)] text-sm">
            <span>🌙</span>
            <span>Premium Edition</span>
          </div>
        </div>
      </div>
    </div>
  );
}
