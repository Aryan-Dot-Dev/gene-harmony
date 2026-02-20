import { useState, useEffect } from "react";
import { FileUpload } from "./FileUpload";
import { DrugInput } from "./DrugInput";
import { ResultsDisplay } from "./ResultsDisplay";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AnalysisPanel() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>("");

  useEffect(() => {
    gsap.fromTo(
      "#analysis-panel",
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#analysis-panel",
          start: "top 75%",
        },
      }
    );
  }, []);

  return (
    <section id="analysis" className="py-24 relative">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 0%, hsl(185 100% 50% / 0.06) 0%, transparent 60%)"
      }} />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
            Live Analysis Engine
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Start Your{" "}
            <span style={{ color: "hsl(var(--primary))" }}>PGx Analysis</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Upload your genomic VCF file and specify your medications to receive personalized drug-gene interaction reports.
          </p>
        </div>

        <div id="analysis-panel" className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left: Input panel */}
          <div className="space-y-8">
            {/* Panel header */}
            <div className="pgx-card rounded-2xl p-6 glow-border scan-line">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-danger/70" />
                  <div className="w-3 h-3 rounded-full bg-warn/70" />
                  <div className="w-3 h-3 rounded-full bg-safe/70" />
                </div>
                <span className="text-muted-foreground text-xs font-mono">pgx-analysis-engine.vcf</span>
              </div>

              <div className="space-y-8">
                <FileUpload onFileAccepted={(f) => setUploadedFile(f)} />
                <div className="border-t border-border/50" />
                <DrugInput onDrugsChange={setSelectedDrugs} />
                <div className="border-t border-border/50" />
                
                {/* Wallet Address Input */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <span className="text-primary text-sm font-mono font-bold">03</span>
                    </div>
                    <div>
                      <h3 className="text-foreground font-semibold text-sm">Algorand Wallet</h3>
                      <p className="text-muted-foreground text-xs font-mono">for blockchain verification</p>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Algorand wallet address (e.g., XXXXXX...)"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-mono text-sm"
                  />
                  {walletAddress && (
                    <div className="text-xs text-muted-foreground font-mono flex items-center gap-2 px-2 py-1.5 rounded bg-safe/5 border border-safe/20">
                      <svg className="w-3 h-3 text-safe-glow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Wallet address detected
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gene variant legend */}
            <div className="pgx-card rounded-2xl p-5">
              <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">Risk Classification</h4>
              <div className="space-y-3">
                {[
                  { status: "safe", label: "Safe — Standard Therapy", desc: "No dose adjustment required", dotClass: "bg-safe" },
                  { status: "warn", label: "Adjust — Modified Dosing", desc: "Consider dose reduction or monitoring", dotClass: "bg-warn" },
                  { status: "danger", label: "Avoid — Alternative Recommended", desc: "High risk of ADR or therapeutic failure", dotClass: "bg-danger" },
                ].map((item) => (
                  <div key={item.status} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.dotClass} mt-1.5 flex-shrink-0 animate-glow-pulse`} />
                    <div>
                      <div className="text-foreground text-xs font-medium">{item.label}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Results panel */}
          <div className="pgx-card rounded-2xl p-6 glow-border h-fit sticky top-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/70" />
                <div className="w-3 h-3 rounded-full bg-warn/70" />
                <div className="w-3 h-3 rounded-full bg-safe/70" />
              </div>
              <span className="text-muted-foreground text-xs font-mono">pgx-results-output.json</span>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse" />
                <span className="text-primary text-xs font-mono">CPIC v4.2</span>
              </div>
            </div>

            <ResultsDisplay drugs={selectedDrugs} hasFile={!!uploadedFile} file={uploadedFile} wallet={walletAddress} />

            {/* Status bar */}
            <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Genome Build: GRCh38</span>
              <span>Db: PharmGKB 2024.12</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
