import { useRef, useState, useCallback, useEffect } from "react";
import { gsap } from "gsap";

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
}

export function FileUpload({ onFileAccepted }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              sectionRef.current,
              { opacity: 0, y: 50 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
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

  const validateFile = useCallback((f: File): boolean => {
    if (!f.name.endsWith(".vcf") && !f.name.endsWith(".txt")) {
      showError("Invalid file type. Please upload a VCF file (.vcf)");
      return false;
    }
    if (f.size > 5 * 1024 * 1024) {
      showError("File exceeds 5MB limit. Please upload a smaller VCF file.");
      return false;
    }
    return true;
  }, []);

  const showError = (msg: string) => {
    setError(msg);
    if (dropZoneRef.current) {
      gsap.fromTo(
        dropZoneRef.current,
        { x: -8 },
        { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" }
      );
      gsap.to(dropZoneRef.current, { x: 8, duration: 0.08, yoyo: true, repeat: 5 });
    }
    setTimeout(() => setError(null), 4000);
  };

  const handleFile = useCallback((f: File) => {
    if (!validateFile(f)) return;
    setFile(f);
    setError(null);
    setUploading(true);

    gsap.to(dropZoneRef.current, {
      borderColor: "hsl(145 80% 45% / 0.8)",
      duration: 0.3,
    });

    // Simulate processing
    setTimeout(() => {
      setUploading(false);
      onFileAccepted(f);
    }, 1200);
  }, [validateFile, onFileAccepted]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
    gsap.to(dropZoneRef.current, { scale: 1.02, duration: 0.2 });
  };

  const handleDragLeave = () => {
    setDragOver(false);
    gsap.to(dropZoneRef.current, { scale: 1, duration: 0.2 });
  };

  const removeFile = () => {
    setFile(null);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    gsap.to(dropZoneRef.current, {
      borderColor: "hsl(185 40% 15% / 0.5)",
      duration: 0.3,
    });
  };

  return (
    <div ref={sectionRef} className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
          <span className="text-primary text-sm font-mono font-bold">01</span>
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-sm">Upload Genomic Data</h3>
          <p className="text-muted-foreground text-xs font-mono">VCF format · max 5MB</p>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !file && fileRef.current?.click()}
        className={`upload-zone rounded-2xl p-8 text-center cursor-pointer transition-all relative overflow-hidden ${
          dragOver ? "drag-over" : ""
        } ${file ? "border-safe/60 bg-safe/5" : ""}`}
      >
        {/* Scan line animation */}
        {(dragOver || uploading) && (
          <div className="absolute inset-0 scan-line pointer-events-none" />
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".vcf,.txt"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {!file ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-foreground font-medium">
                Drop your VCF file here
              </p>
              <p className="text-muted-foreground text-sm mt-1">or click to browse</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {["chr1", "rs334", "GT:AD:DP", "PASS"].map((tag) => (
                <span key={tag} className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {uploading ? (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-primary font-mono text-sm">Parsing VCF data...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-safe/20 border border-safe/40 flex items-center justify-center">
                  <svg className="w-6 h-6 text-safe-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-safe-glow font-medium text-sm">{file.name}</p>
                  <p className="text-muted-foreground text-xs font-mono mt-1">
                    {(file.size / 1024).toFixed(1)} KB · VCF parsed successfully
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(); }}
                  className="text-xs text-muted-foreground hover:text-danger transition-colors font-mono"
                >
                  × Remove file
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          ref={errorRef}
          className="flex items-center gap-3 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger-glow text-sm"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
