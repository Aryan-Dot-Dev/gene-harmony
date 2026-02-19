import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

const DRUG_LIST = [
  "CODEINE", "WARFARIN", "SIMVASTATIN", "CLOPIDOGREL", "TAMOXIFEN",
  "ABACAVIR", "ALLOPURINOL", "CARBAMAZEPINE", "FLUOROURACIL", "MERCAPTOPURINE",
  "AZATHIOPRINE", "TACROLIMUS", "IRINOTECAN", "CAPECITABINE", "SERTRALINE",
  "FLUOXETINE", "PAROXETINE", "AMITRIPTYLINE", "NORTRIPTYLINE", "METOPROLOL",
  "ATOMOXETINE", "TRAMADOL", "OXYCODONE", "ONDANSETRON", "HALOPERIDOL",
];

interface DrugInputProps {
  onDrugsChange: (drugs: string[]) => void;
}

export function DrugInput({ onDrugsChange }: DrugInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              sectionRef.current,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.1 }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (val.length > 0) {
      const matches = DRUG_LIST.filter(
        (d) =>
          d.toLowerCase().includes(val.toLowerCase()) &&
          !selectedDrugs.includes(d)
      ).slice(0, 6);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addDrug = (drug: string) => {
    if (selectedDrugs.includes(drug)) return;
    const newDrugs = [...selectedDrugs, drug];
    setSelectedDrugs(newDrugs);
    onDrugsChange(newDrugs);
    setInputValue("");
    setSuggestions([]);
    setShowSuggestions(false);

    // Animate new tag
    setTimeout(() => {
      const tags = containerRef.current?.querySelectorAll(".drug-tag");
      if (tags && tags.length > 0) {
        const lastTag = tags[tags.length - 1];
        gsap.fromTo(lastTag, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
      }
    }, 10);
  };

  const removeDrug = (drug: string) => {
    const newDrugs = selectedDrugs.filter((d) => d !== drug);
    setSelectedDrugs(newDrugs);
    onDrugsChange(newDrugs);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      addDrug(suggestions[0]);
    } else if (e.key === "Enter" && inputValue) {
      const upper = inputValue.toUpperCase();
      if (DRUG_LIST.includes(upper)) {
        addDrug(upper);
      }
    } else if (e.key === "Backspace" && !inputValue && selectedDrugs.length > 0) {
      removeDrug(selectedDrugs[selectedDrugs.length - 1]);
    }
  };

  const handleFocus = () => {
    setFocused(true);
    gsap.to(containerRef.current, {
      boxShadow: "0 0 0 2px hsl(185 100% 50% / 0.3), 0 0 20px hsl(185 100% 50% / 0.1)",
      duration: 0.3,
    });
  };

  const handleBlur = () => {
    setFocused(false);
    setTimeout(() => setShowSuggestions(false), 150);
    gsap.to(containerRef.current, {
      boxShadow: "none",
      duration: 0.3,
    });
  };

  return (
    <div ref={sectionRef} className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
          <span className="text-primary text-sm font-mono font-bold">02</span>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-sm">Enter Medications</h3>
          <p className="text-muted-foreground text-xs font-mono">Type to search · press Enter to add</p>
        </div>
      </div>

      {/* Input container */}
      <div className="relative">
        <div
          ref={containerRef}
          className={`flex flex-wrap gap-2 p-3 rounded-xl bg-input border transition-all duration-300 min-h-[56px] ${
            focused ? "border-primary/50" : "border-border"
          }`}
        >
          {/* Selected drug tags */}
          {selectedDrugs.map((drug) => (
            <span
              key={drug}
              className="drug-tag inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/15 border border-primary/30 text-primary text-xs font-mono"
            >
              {drug}
              <button
                onClick={() => removeDrug(drug)}
                className="text-primary/60 hover:text-danger transition-colors ml-1"
              >
                ×
              </button>
            </span>
          ))}

          {/* Input */}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={selectedDrugs.length === 0 ? "e.g. WARFARIN, CODEINE..." : "Add more..."}
            className="flex-1 min-w-[140px] bg-transparent text-foreground placeholder:text-muted-foreground text-sm font-mono outline-none"
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 pgx-card rounded-xl overflow-hidden border border-primary/20">
            {suggestions.map((drug, idx) => (
              <button
                key={drug}
                onMouseDown={() => addDrug(drug)}
                className="w-full text-left px-4 py-2.5 text-sm font-mono text-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                {drug}
                <span className="ml-auto text-xs text-muted-foreground">
                  {getDrugGene(drug)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick add common drugs */}
      <div className="space-y-2">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Common medications</p>
        <div className="flex flex-wrap gap-2">
          {["CODEINE", "WARFARIN", "CLOPIDOGREL", "SIMVASTATIN", "TAMOXIFEN"].map((drug) => (
            <button
              key={drug}
              onClick={() => addDrug(drug)}
              disabled={selectedDrugs.includes(drug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                selectedDrugs.includes(drug)
                  ? "border-primary/30 bg-primary/10 text-primary/50 cursor-not-allowed"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5"
              }`}
            >
              {drug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function getDrugGene(drug: string): string {
  const map: Record<string, string> = {
    CODEINE: "CYP2D6",
    WARFARIN: "CYP2C9/VKORC1",
    SIMVASTATIN: "SLCO1B1",
    CLOPIDOGREL: "CYP2C19",
    TAMOXIFEN: "CYP2D6",
    ABACAVIR: "HLA-B",
    ALLOPURINOL: "HLA-B",
    CARBAMAZEPINE: "HLA-B",
    FLUOROURACIL: "DPYD",
    MERCAPTOPURINE: "TPMT/NUDT15",
    AZATHIOPRINE: "TPMT/NUDT15",
    SERTRALINE: "CYP2C19",
    FLUOXETINE: "CYP2D6",
    TRAMADOL: "CYP2D6",
    METOPROLOL: "CYP2D6",
  };
  return map[drug] || "PGx";
}
