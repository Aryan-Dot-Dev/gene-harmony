import { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { DNAHelix } from "./DNAHelix";
import { gsap } from "gsap";

export function HeroScene() {
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      canvasWrapRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.5 }
    )
      .fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        "-=1"
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(
        badgesRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.5"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      );
  }, []);

  const scrollToAnalysis = () => {
    document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden grid-bg">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />

      {/* Data stream lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"
            style={{
              left: `${15 + i * 14}%`,
              top: 0,
              bottom: 0,
              animationDelay: `${i * 0.8}s`,
              animation: "data-stream 4s ease-in-out infinite",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div ref={titleRef} className="space-y-4">
              {/* Label */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
                Pharmacogenomics AI Platform
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="block text-foreground">Decode Your</span>
                <span className="block text-glow" style={{ color: "hsl(var(--primary))" }}>
                  Genome.
                </span>
                <span className="block text-foreground">Personalize</span>
                <span className="block" style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsl(270 80% 65%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                  Medicine.
                </span>
              </h1>
            </div>

            <p ref={subtitleRef} className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Upload your VCF genomic data and receive precision drug-gene interaction analysis powered by CYP450 enzyme profiling and evidence-based pharmacogenomic guidelines.
            </p>

            {/* Stats badges */}
            <div ref={badgesRef} className="flex flex-wrap gap-3">
              {[
                { label: "Genes Analyzed", value: "200+" },
                { label: "Drug Interactions", value: "1,400+" },
                { label: "CPIC Guidelines", value: "v4.2" },
              ].map((stat) => (
                <div key={stat.label} className="pgx-card px-4 py-3 rounded-xl">
                  <div className="stat-number text-xl">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-wrap gap-4">
              <button
                onClick={scrollToAnalysis}
                className="btn-primary px-8 py-4 rounded-xl font-medium inline-flex items-center gap-3 group"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Start Analysis
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <a
                href="#how-it-works"
                className="btn-ghost px-8 py-4 rounded-xl font-medium inline-flex items-center gap-2"
              >
                How It Works
              </a>
            </div>
          </div>

          {/* Right: 3D Canvas */}
          <div ref={canvasWrapRef} className="relative h-[500px] lg:h-[650px]">
            {/* Glow behind canvas */}
            <div className="absolute inset-0 rounded-3xl" style={{
              background: "radial-gradient(ellipse at center, hsl(185 100% 50% / 0.1) 0%, transparent 70%)"
            }} />

            <Canvas
              camera={{ position: [0, 0, 6], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: "transparent" }}
              dpr={[1, 1.5]}
            >
              <ambientLight intensity={0.2} />
              <pointLight position={[5, 5, 5]} intensity={1} color="#00f5ff" />
              <pointLight position={[-5, -5, -5]} intensity={0.5} color="#7c3aed" />
              <pointLight position={[0, 8, 0]} intensity={0.3} color="#00f5ff" />

              <Suspense fallback={null}>
                <Stars radius={50} depth={20} count={800} factor={3} saturation={0} fade speed={0.5} />
                <DNAHelix speed={0.25} />
              </Suspense>

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
                maxPolarAngle={Math.PI * 0.7}
                minPolarAngle={Math.PI * 0.3}
              />
            </Canvas>

            {/* Floating info cards */}
            <div className="absolute top-8 right-4 pgx-card px-3 py-2 rounded-lg text-xs font-mono animate-float" style={{ animationDelay: "0s" }}>
              <div className="text-primary">CYP2D6 *1/*4</div>
              <div className="text-muted-foreground text-[10px]">Poor Metabolizer</div>
            </div>
            <div className="absolute bottom-20 left-4 pgx-card px-3 py-2 rounded-lg text-xs font-mono animate-float" style={{ animationDelay: "2s" }}>
              <div className="text-safe-glow">CODEINE → Safe</div>
              <div className="text-muted-foreground text-[10px]">Standard dose</div>
            </div>
            <div className="absolute top-1/2 right-2 pgx-card px-3 py-2 rounded-lg text-xs font-mono animate-float" style={{ animationDelay: "1s" }}>
              <div className="text-danger-glow">WARFARIN → ⚠</div>
              <div className="text-muted-foreground text-[10px]">Dose reduction</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
