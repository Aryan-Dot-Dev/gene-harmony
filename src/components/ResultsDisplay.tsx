import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { uploadVcf } from "@/lib/api";

// Helper functions for mapping backend response to UI
const mapRiskLevelToStatus = (riskLevel: string): "safe" | "warn" | "danger" => {
  const lower = riskLevel.toLowerCase();
  if (lower.includes("low") || lower.includes("safe")) return "safe";
  if (lower.includes("moderate") || lower.includes("adjust")) return "warn";
  if (lower.includes("high") || lower.includes("avoid")) return "danger";
  return "warn";
};

const mapRiskLevelToDetail = (riskLevel: string): string => {
  const lower = riskLevel.toLowerCase();
  if (lower.includes("low") || lower.includes("safe")) return "safe therapeutic use";
  if (lower.includes("moderate") || lower.includes("adjust")) return "need for dose adjustment or monitoring";
  if (lower.includes("high") || lower.includes("avoid")) return "high risk of adverse effects";
  return "potential drug interaction";
};

interface DrugResult {
  drug: string;
  gene: string;
  phenotype: string;
  status: "safe" | "warn" | "danger";
  recommendation: string;
  dose: string;
  evidence: string;
  detail: string;
}

const MOCK_RESULTS: DrugResult[] = [
  {
    drug: "CODEINE",
    gene: "CYP2D6",
    phenotype: "Poor Metabolizer (*4/*4)",
    status: "danger",
    recommendation: "AVOID - Use alternative analgesic",
    dose: "Contraindicated",
    evidence: "CPIC Level A",
    detail: "CYP2D6 *4/*4 results in complete loss of enzyme function. Codeine cannot be converted to active morphine, leading to therapeutic failure. Risk of adverse effects. Consider tramadol (with caution) or non-opioid alternatives."
  },
  {
    drug: "WARFARIN",
    gene: "CYP2C9/VKORC1",
    phenotype: "Intermediate Metabolizer + Low Sensitivity",
    status: "warn",
    recommendation: "REDUCE DOSE by 25–50%",
    dose: "Initiate at 1.5–3mg/day",
    evidence: "CPIC Level A",
    detail: "CYP2C9 *1/*3 combined with VKORC1 -1639 G>A variant indicates slower warfarin clearance and increased anticoagulant sensitivity. Increased bleeding risk. Begin with 30–50% of standard dose and titrate based on INR."
  },
  {
    drug: "SIMVASTATIN",
    gene: "SLCO1B1",
    phenotype: "Decreased Function (*5 variant)",
    status: "warn",
    recommendation: "CONSIDER ALTERNATIVE or REDUCE DOSE",
    dose: "Max 20mg/day",
    evidence: "CPIC Level A",
    detail: "SLCO1B1 *5 variant (rs4149056 C allele) impairs hepatic uptake of simvastatin, leading to elevated plasma concentrations and increased myopathy risk. Consider rosuvastatin or pravastatin as alternatives with lower SLCO1B1 dependence."
  },
  {
    drug: "CLOPIDOGREL",
    gene: "CYP2C19",
    phenotype: "Normal Metabolizer (*1/*1)",
    status: "safe",
    recommendation: "STANDARD THERAPY",
    dose: "75mg/day maintenance",
    evidence: "CPIC Level A",
    detail: "CYP2C19 *1/*1 indicates normal enzyme activity. Clopidogrel will be effectively converted to its active thienopyridine metabolite. Standard antiplatelet therapy is appropriate. No dose adjustment required."
  },
  {
    drug: "TAMOXIFEN",
    gene: "CYP2D6",
    phenotype: "Poor Metabolizer (*4/*4)",
    status: "danger",
    recommendation: "AVOID - Consider aromatase inhibitor",
    dose: "Alternative therapy recommended",
    evidence: "CPIC Level A",
    detail: "CYP2D6 poor metabolizer status severely reduces conversion of tamoxifen to active endoxifen. Significantly reduced therapeutic efficacy for hormone-receptor positive breast cancer. Aromatase inhibitors (letrozole, anastrozole) are preferred for postmenopausal patients."
  },
];

const STATUS_CONFIG = {
  safe: {
    label: "SAFE",
    icon: "✓",
    badgeClass: "badge-safe",
    bgClass: "bg-safe/5",
    borderClass: "border-safe/20",
    textClass: "text-safe-glow",
    dotClass: "bg-safe",
  },
  warn: {
    label: "ADJUST",
    icon: "⚠",
    badgeClass: "badge-warn",
    bgClass: "bg-warn/5",
    borderClass: "border-warn/20",
    textClass: "text-warn-glow",
    dotClass: "bg-warn",
  },
  danger: {
    label: "AVOID",
    icon: "✕",
    badgeClass: "badge-danger",
    bgClass: "bg-danger/5",
    borderClass: "border-danger/20",
    textClass: "text-danger-glow",
    dotClass: "bg-danger",
  },
};

interface ResultsDisplayProps {
  drugs: string[];
  hasFile: boolean;
  file?: File | null;
  wallet?: string;
}

export function ResultsDisplay({ drugs, hasFile, file, wallet }: ResultsDisplayProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [apiResults, setApiResults] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const filteredResults = apiResults 
    ? [{
        drug: apiResults.drug || "Unknown",
        gene: apiResults.gene || "Unknown",
        phenotype: apiResults.phenotype || "Unknown",
        status: mapRiskLevelToStatus(apiResults.riskLevel),
        recommendation: apiResults.recommendation || "See CPIC guidelines",
        dose: "See recommendation",
        evidence: "CPIC Level A",
        detail: `${apiResults.phenotype} indicates ${mapRiskLevelToDetail(apiResults.riskLevel)}. ${apiResults.recommendation}`
      }]
    : MOCK_RESULTS.filter((r) => drugs.includes(r.drug));
  const canAnalyze = drugs.length > 0 && hasFile && !!wallet;

  const runAnalysis = async () => {
    if (!file || !drugs.length || !wallet) {
      setApiError("Please upload a VCF file, select a drug, and enter wallet address");
      return;
    }

    setAnalyzing(true);
    setShowResults(false);
    setApiError(null);
    setExpanded(null);

    try {
      // For multiple drugs, we'll use the first selected drug
      // But ideally you'd want to analyze all drugs - that would require 
      // either multiple API calls or backend support for batch analysis
      const selectedDrug = drugs[0];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Call the backend API
      const data = await uploadVcf(file, wallet, selectedDrug);
      
      setApiResults(data);
      setAnalyzing(false);
      setShowResults(true);

      setTimeout(() => {
        cardRefs.current.forEach((card, i) => {
          if (card) {
            gsap.fromTo(
              card,
              { opacity: 0, x: -20, scale: 0.97 },
              { opacity: 1, x: 0, scale: 1, duration: 0.5, delay: i * 0.1, ease: "power3.out" }
            );
          }
        });
      }, 50);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalyzing(false);
      setApiError(error instanceof Error ? error.message : "Failed to process VCF file");
    }
  };

  const toggleExpand = (drug: string) => {
    const prev = expanded;
    setExpanded(expanded === drug ? null : drug);

    if (prev !== drug) {
      setTimeout(() => {
        const el = document.getElementById(`detail-${drug}`);
        if (el) {
          gsap.fromTo(el, { opacity: 0, height: 0 }, { opacity: 1, height: "auto", duration: 0.4, ease: "power3.out" });
        }
      }, 10);
    }
  };

  const exportJSON = () => {
    const data = filteredResults.map((r) => ({
      drug: r.drug,
      gene: r.gene,
      phenotype: r.phenotype,
      status: r.status,
      recommendation: r.recommendation,
      dose: r.dose,
      evidence: r.evidence,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pgx_results.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const text = filteredResults
      .map((r) => `${r.drug}: ${r.recommendation} (${r.gene} - ${r.phenotype})`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const safeCount = filteredResults.filter((r) => r.status === "safe").length;
  const warnCount = filteredResults.filter((r) => r.status === "warn").length;
  const dangerCount = filteredResults.filter((r) => r.status === "danger").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
          <span className="text-primary text-sm font-mono font-bold">03</span>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-sm">PGx Risk Assessment</h3>
          <p className="text-muted-foreground text-xs font-mono">CPIC evidence-based guidelines</p>
        </div>
      </div>

      {/* Run Analysis Button */}
      <button
        onClick={runAnalysis}
        disabled={!canAnalyze || analyzing}
        className={`w-full py-4 rounded-xl font-medium text-sm inline-flex items-center justify-center gap-3 transition-all ${
          canAnalyze && !analyzing
            ? "btn-primary"
            : "bg-muted text-muted-foreground cursor-not-allowed border border-border"
        }`}
      >
        {analyzing ? (
          <>
            <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            <span className="font-mono text-xs">Analyzing genome variants...</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
            </svg>
            {canAnalyze 
              ? "Run PGx Analysis" 
              : drugs.length === 0 
                ? "Add medications first" 
                : !wallet
                  ? "Enter wallet address first"
                  : "Upload VCF file first"}
          </>
        )}
      </button>

      {/* Error message */}
      {apiError && (
        <div className="pgx-card rounded-xl p-4 border border-danger/20 bg-danger/5 space-y-2">
          <div className="flex items-start gap-3">
            <svg className="w-4 h-4 text-danger-glow flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0a9 9 0 11-9-9a9 9 0 0 1 9 9z" />
            </svg>
            <div>
              <div className="text-xs font-mono font-semibold text-danger-glow">Analysis Failed</div>
              <p className="text-xs text-foreground/80 mt-1">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Analyzing progress */}
      {analyzing && (
        <div className="pgx-card rounded-xl p-4 space-y-3">
          {["Loading variant data", "Querying CYP450 database", "Applying CPIC guidelines", "Generating recommendations"].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className="w-4 h-4 border border-primary/30 border-t-primary rounded-full animate-spin flex-shrink-0"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
              <span className="text-xs font-mono text-muted-foreground">{step}...</span>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {showResults && filteredResults.length > 0 && (
        <div ref={resultsRef} className="space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Safe", count: safeCount, status: "safe" as const },
              { label: "Adjust", count: warnCount, status: "warn" as const },
              { label: "Avoid", count: dangerCount, status: "danger" as const },
            ].map(({ label, count, status }) => {
              const cfg = STATUS_CONFIG[status];
              return (
                <div key={label} className={`pgx-card rounded-xl p-3 text-center ${cfg.bgClass} border ${cfg.borderClass}`}>
                  <div className={`text-2xl font-bold font-mono ${cfg.textClass}`}>{count}</div>
                  <div className="text-xs text-muted-foreground mt-1">{label}</div>
                </div>
              );
            })}
          </div>

          {/* Result cards */}
          <div className="space-y-3">
            {filteredResults.map((result, idx) => {
              const cfg = STATUS_CONFIG[result.status];
              const isExpanded = expanded === result.drug;

              return (
                <div
                  key={result.drug}
                  ref={(el) => { cardRefs.current[idx] = el; }}
                  className={`pgx-card rounded-xl overflow-hidden border ${cfg.borderClass} transition-all`}
                >
                  {/* Card header */}
                  <button
                    onClick={() => toggleExpand(result.drug)}
                    className="w-full p-4 flex items-center gap-4 text-left hover:bg-white/2 transition-colors"
                  >
                    {/* Status dot */}
                    <div className={`w-2.5 h-2.5 rounded-full ${cfg.dotClass} flex-shrink-0 animate-glow-pulse`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-foreground font-semibold text-sm font-mono">{result.drug}</span>
                        <span className="text-muted-foreground text-xs">→</span>
                        <span className="text-muted-foreground text-xs font-mono">{result.gene}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{result.phenotype}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold ${cfg.badgeClass}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                      <svg
                        className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div id={`detail-${result.drug}`} className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="text-xs text-muted-foreground font-mono mb-1">Recommendation</div>
                          <div className={`text-xs font-semibold ${cfg.textClass}`}>{result.recommendation}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="text-xs text-muted-foreground font-mono mb-1">Dosing</div>
                          <div className="text-xs text-foreground font-mono">{result.dose}</div>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30">
                        <div className="text-xs text-muted-foreground font-mono mb-2">Clinical Guidance</div>
                        <p className="text-xs text-foreground/80 leading-relaxed">{result.detail}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground">Evidence: {result.evidence}</span>
                        <a
                          href="https://cpicpgx.org"
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary hover:underline font-mono"
                        >
                          View CPIC Guideline →
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Export actions */}
          <div className="flex gap-3">
            <button
              onClick={exportJSON}
              className="flex-1 btn-ghost py-3 rounded-xl text-sm inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export JSON
            </button>
            <button
              onClick={copyToClipboard}
              className="flex-1 btn-ghost py-3 rounded-xl text-sm inline-flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-safe-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Text
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {showResults && filteredResults.length === 0 && (
        <div className="pgx-card rounded-xl p-6 text-center">
          <p className="text-muted-foreground text-sm font-mono">No PGx data available for selected medications.</p>
        </div>
      )}
    </div>
  );
}
