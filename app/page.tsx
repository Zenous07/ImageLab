import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function Home() {
  const tools = [
    {
      id: 1,
      title: "Image Filters",
      description: "Brightness, contrast, saturation, blur, grayscale, and sepia effects.",
      icon: "🎨",
      href: "/filters",
      gradient: "gradient-primary",
      shadowColor: "shadow-purple-500/50",
    },
    {
      id: 2,
      title: "Background Changer",
      description: "Replace background colors with precision and adjustable tolerance.",
      icon: "🎯",
      href: "/bg-changer",
      gradient: "gradient-warning",
      shadowColor: "shadow-blue-500/50",
    },
    {
      id: 3,
      title: "Image Compressor",
      description: "Reduce image size while maintaining quality with advanced algorithms.",
      icon: "📦",
      href: "/compressor",
      gradient: "gradient-info",
      shadowColor: "shadow-green-500/50",
    },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fadeInUp">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white leading-tight">
              <span className="text-gradient">Professional Image</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Processing Toolkit
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Fast, powerful, and completely client-side. Your images, your rules, your device.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <div className="flex items-center gap-2 text-white/70 px-4 py-2 glass-effect rounded-lg">
                <span>⚡</span> Lightning Fast
              </div>
              <div className="flex items-center gap-2 text-white/70 px-4 py-2 glass-effect rounded-lg">
                <span>🔒</span> 100% Private
              </div>
              <div className="flex items-center gap-2 text-white/70 px-4 py-2 glass-effect rounded-lg">
                <span>📱</span> Fully Responsive
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {tools.map((tool, idx) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`,
                }}
              >
                <div className="relative h-full overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer">
                  {/* Gradient Background */}
                  <div className={`${tool.gradient} absolute inset-0`}></div>
                  
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                    <div>
                      <div className="text-6xl mb-4 transform group-hover:scale-125 transition-transform duration-500">
                        {tool.icon}
                      </div>
                      <h2 className="text-3xl font-bold mb-3">{tool.title}</h2>
                      <p className="text-white/90 text-lg leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                    
                    {/* Button */}
                    <button className="mt-6 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-lg hover:bg-white/30 transition-all duration-300 transform group-hover:translate-x-1 flex items-center gap-2 w-full justify-center">
                      Open Tool
                      <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Features Section */}
          <div className="glass-effect rounded-2xl p-12 mb-16 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Why Choose ImageLab?
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: "⚡",
                  title: "Instant Processing",
                  desc: "Real-time preview with zero latency",
                },
                {
                  icon: "🔒",
                  title: "Complete Privacy",
                  desc: "Everything happens on your device",
                },
                {
                  icon: "🎨",
                  title: "Multiple Tools",
                  desc: "Filters, compression, and more",
                },
                {
                  icon: "📱",
                  title: "Mobile Ready",
                  desc: "Perfect on any screen size",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="text-center p-6 rounded-xl glass-effect hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${0.4 + idx * 0.1}s both`,
                  }}
                >
                  <div className="text-5xl mb-4 transform group-hover:scale-125 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center animate-fadeInUp" style={{ animationDelay: "0.5s" }}>
            <div className="glass-effect rounded-2xl p-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ready to enhance your images?
              </h3>
              <p className="text-white/70 mb-8 text-lg">
                Choose any tool above and get started instantly
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
