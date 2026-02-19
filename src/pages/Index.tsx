import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { Navigation } from "@/components/Navigation";
import { HeroScene } from "@/components/HeroScene";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { InfoSections } from "@/components/InfoSections";

const Index = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero with 3D DNA */}
      <HeroScene />

      {/* PGx Analysis Engine */}
      <AnalysisPanel />

      {/* Info sections */}
      <InfoSections />

      {/* Footer */}
      <footer className="border-t border-border/30 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center">
                <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className="text-sm font-bold">
                <span className="text-foreground">PGx</span>
                <span className="text-primary">Insight</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-mono text-center">
              For research and educational use only. Not a substitute for clinical pharmacogenomic testing.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
              <a href="https://cpicpgx.org" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">CPIC</a>
              <a href="https://pharmgkb.org" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">PharmGKB</a>
              <span>© 2025</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
