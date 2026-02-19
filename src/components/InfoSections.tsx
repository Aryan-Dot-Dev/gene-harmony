import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Upload VCF File",
    desc: "Submit your Variant Call Format (VCF) file containing single nucleotide polymorphisms (SNPs) identified from whole-genome or targeted sequencing.",
    icon: "🧬",
    color: "primary",
  },
  {
    step: "02",
    title: "Enter Medications",
    desc: "Input the drugs you're prescribed or planning to take. Our system supports 200+ medications across cardiovascular, oncology, psychiatry, and pain management.",
    icon: "💊",
    color: "primary",
  },
  {
    step: "03",
    title: "Variant Analysis",
    desc: "PGxInsight maps your genetic variants to pharmacogenes (CYP2D6, CYP2C19, VKORC1, SLCO1B1, etc.) and determines your metabolizer phenotype.",
    icon: "⚡",
    color: "primary",
  },
  {
    step: "04",
    title: "Clinical Recommendations",
    desc: "Evidence-based prescribing guidance using CPIC, DPWG, and FDA PGx labeling. Color-coded risk stratification for every drug-gene pair.",
    icon: "📋",
    color: "primary",
  },
];

const GENES = [
  { name: "CYP2D6", drugs: 25, role: "Opioids, Antidepressants, Beta-blockers" },
  { name: "CYP2C19", drugs: 18, role: "PPIs, Antiplatelets, SSRIs" },
  { name: "CYP2C9", drugs: 15, role: "NSAIDs, Anticoagulants, Antiepileptics" },
  { name: "VKORC1", drugs: 3, role: "Vitamin K antagonists" },
  { name: "SLCO1B1", drugs: 8, role: "Statins, Anticancer agents" },
  { name: "DPYD", drugs: 4, role: "Fluoropyrimidines (5-FU, Capecitabine)" },
  { name: "TPMT", drugs: 5, role: "Thiopurines (6-MP, Azathioprine)" },
  { name: "HLA-B", drugs: 6, role: "Abacavir, Carbamazepine, Allopurinol" },
];

export function InfoSections() {
  const howRef = useRef<HTMLElement>(null);
  const geneRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cards = howRef.current?.querySelectorAll(".how-card");
    cards?.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        }
      );
    });

    const genePills = geneRef.current?.querySelectorAll(".gene-pill");
    genePills?.forEach((pill, i) => {
      gsap.fromTo(
        pill,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: i * 0.08,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: pill,
            start: "top 90%",
          },
        }
      );
    });
  }, []);

  return (
    <>
      {/* How It Works */}
      <section ref={howRef} id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0 hex-bg opacity-40 pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Workflow
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              How <span style={{ color: "hsl(var(--primary))" }}>PGxInsight</span> Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From raw genomic data to precision prescribing in seconds. Powered by evidence-based pharmacogenomic databases.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, idx) => (
              <div key={step.step} className="how-card pgx-card rounded-2xl p-6 glow-border relative group">
                {/* Connector line */}
                {idx < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 w-6 border-t border-dashed border-primary/30 z-10" />
                )}

                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-xs font-mono text-primary mb-2 tracking-widest">{step.step}</div>
                <h3 className="text-foreground font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Genes Section */}
      <section ref={geneRef} id="genes" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at 80% 50%, hsl(270 80% 65% / 0.05) 0%, transparent 60%), radial-gradient(ellipse at 20% 50%, hsl(185 100% 50% / 0.05) 0%, transparent 60%)"
        }} />
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Pharmacogenes
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Key <span style={{ color: "hsl(var(--primary))" }}>Gene Targets</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">
              PGxInsight analyzes clinically actionable pharmacogenes with the strongest evidence for drug response prediction.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GENES.map((gene) => (
              <div
                key={gene.name}
                className="gene-pill pgx-card rounded-xl p-4 glow-border group cursor-default"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-primary font-bold font-mono text-lg">{gene.name}</span>
                  <span className="text-xs bg-primary/10 text-primary font-mono px-2 py-0.5 rounded-full">
                    {gene.drugs} drugs
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{gene.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About section */}
      <section id="about" className="py-24 border-t border-border/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                About PGx
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Precision Medicine<br />
                <span style={{ color: "hsl(var(--primary))" }}>at the Genomic Level</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pharmacogenomics (PGx) studies how genes affect a person's response to drugs. This relatively new field combines pharmacology (the science of drugs) and genomics (the study of genes and their functions).
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                With PGxInsight, clinicians and patients can predict how an individual will respond to medications based on their unique genetic makeup — reducing adverse drug reactions and improving therapeutic outcomes.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Adverse Drug Reactions\npreventable via PGx", value: "~30%" },
                  { label: "Patients carry an\nactionable PGx variant", value: "9/10" },
                ].map((stat) => (
                  <div key={stat.label} className="pgx-card rounded-xl p-4">
                    <div className="stat-number text-3xl mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground leading-tight whitespace-pre-line">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "CPIC (Clinical Pharmacogenetics Implementation Consortium)", desc: "Level A-C gene-drug pair guidelines", color: "primary" },
                { label: "PharmGKB Database", desc: "Curated pharmacogenomic knowledge", color: "safe" },
                { label: "FDA PGx Table", desc: "Drug labeling with pharmacogenomic information", color: "warn" },
                { label: "DPWG Guidelines", desc: "Dutch Pharmacogenetics Working Group", color: "primary" },
              ].map((source) => (
                <div key={source.label} className="pgx-card rounded-xl p-4 flex items-center gap-4">
                  <div className={`w-2 h-8 rounded-full flex-shrink-0`} style={{
                    background: source.color === "primary" ? "hsl(var(--primary))" :
                      source.color === "safe" ? "hsl(var(--safe))" : "hsl(var(--warn))"
                  }} />
                  <div>
                    <div className="text-foreground text-sm font-medium">{source.label}</div>
                    <div className="text-muted-foreground text-xs mt-0.5">{source.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
