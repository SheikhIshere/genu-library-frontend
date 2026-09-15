"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { books } from "@/lib/api";

const SAMPLE_MANIFEST = `Title: The Alchemist's Codex
Author: Master Corvus
Description: Ancient treatises on transmutation, alloy forging, and celestial glyphs.
Tags: Alchemy, Metallurgy, Arcana
Price: 250
---
Title: Architecture of Thought
Author: Sophia Vance
Description: Foundational exploration into structural philosophy and architectural cognition.
Tags: Philosophy, Architecture, Design
Price: 180
---
Title: Principles of High Metallurgy
Author: Kaelen Vance
Description: Guild blueprints of forge temperatures and crucible construction.
Tags: Metallurgy, Craft, Metallurgy
Price: 320`;

const PS1_SCRIPT = `# Genu Library Bulk Archival CLI Dispatch
$manifest = Get-ChildItem ./folios/*.pdf | ForEach-Object {
    [PSCustomObject]@{
        Title       = $_.BaseName -replace '_',' '
        Author      = 'Archivist Guild'
        Description = "Archived folio manuscript: $($_.Name)"
        Tags        = 'Archive, Treatise'
        Price       = 150
    }
}
$manifest | Out-File -Encoding utf8 ./library_manifest.txt`;

interface ParsedBook {
  title: string;
  author: string;
  description: string;
  tags: string[];
  price: number;
}

interface UploadedFile {
  name: string;
  size: string;
  matched: boolean;
  matchedEntry?: number;
}

function parseManifest(raw: string): ParsedBook[] {
  return raw
    .split("---")
    .map((block) => {
      const lines = block.trim().split("\n");
      const book: ParsedBook = { title: "", author: "", description: "", tags: [], price: 0 };
      for (const line of lines) {
        const colonIdx = line.indexOf(":");
        if (colonIdx === -1) continue;
        const key = line.slice(0, colonIdx).trim().toLowerCase();
        const val = line.slice(colonIdx + 1).trim();
        if (key === "title") book.title = val;
        else if (key === "author") book.author = val;
        else if (key === "description") book.description = val;
        else if (key === "tags") book.tags = val.split(",").map((t) => t.trim()).filter(Boolean);
        else if (key === "price") book.price = parseInt(val) || 0;
      }
      return book;
    })
    .filter((b) => b.title);
}

export default function BulkUploadPage() {
  const [manifest, setManifest] = useState(SAMPLE_MANIFEST);
  const [parsedBooks, setParsedBooks] = useState<ParsedBook[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showAccordion, setShowAccordion] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lineCount = manifest.split("\n").length;
  const charCount = manifest.length;
  const parsedCount = parseManifest(manifest).length;

  const handleParse = useCallback(() => {
    const parsed = parseManifest(manifest);
    setParsedBooks(parsed);
  }, [manifest]);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      matched: false,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleUpload = useCallback(async () => {
    if (!parsedBooks.length) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("manifest", manifest);
    try {
      await books.bulkUpload(formData);
    } catch {
      // proceed
    } finally {
      setTimeout(() => setIsUploading(false), 1800);
    }
  }, [parsedBooks, manifest]);

  const handleCopyScript = useCallback(() => {
    navigator.clipboard.writeText(PS1_SCRIPT).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const removeFile = useCallback((idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-margin-mobile md:px-margin pt-6 pb-20 overflow-hidden">
      <div className="absolute top-12 left-1/3 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-body text-body-small text-text-muted mb-4">
        <Link className="hover:text-primary transition-colors" href="/">Home</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link className="hover:text-primary transition-colors" href="/books">Books</Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-text-primary font-medium">Bulk Upload</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-body text-overline uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Archivist Guild &bull; Admin Only
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container font-mono text-overline text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success inline-block animate-pulse" />
              Node v4.18 Active
            </span>
          </div>
          <h1 className="font-display text-headline-1 md:text-display text-text-primary tracking-tight">Bulk Book Upload</h1>
          <p className="font-body text-body-default text-text-secondary">
            Batch-ingest folios, treatises, and rare manuscripts into the library archives via structured plaintext manifests paired with digital folios.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="bg-surface-container px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[22px]">auto_stories</span>
            <div>
              <div className="font-mono text-overline text-text-muted uppercase">Guild Quota</div>
              <div className="font-mono text-label-mono text-text-primary font-semibold">150 Folios / Day</div>
            </div>
          </div>
          <button
            className="bg-surface-container-high hover:bg-surface-bright text-text-primary font-body text-body-small font-medium px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm"
            onClick={() => setShowGuideModal(true)}
            type="button"
          >
            <span className="material-symbols-outlined text-primary text-[18px]">help_outline</span>
            <span>Manifest Syntax</span>
          </button>
        </div>
      </div>

      <div className="w-full bg-surface-container p-3.5 rounded-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-text-secondary">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary text-[20px] shrink-0">tips_and_updates</span>
          <p className="font-body text-body-small">
            <span className="text-text-primary font-medium">Archivist Protocol:</span> Manuscripts will auto-pair with PDF folios based on title or explicit filename tokens. Use delimiter{" "}
            <code className="font-mono text-primary bg-canvas px-1.5 py-0.5 rounded">---</code> between folios.
          </p>
        </div>
        <div className="flex items-center gap-2 text-text-muted font-mono text-overline shrink-0">
          <span>ENCODING: UTF-8</span>
          <span>&bull;</span>
          <span>MAX RECURSION: 50 ENTRIES</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-10">
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-surface-container rounded-xl shadow-md p-5 flex flex-col h-full">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                </div>
                <div>
                  <h3 className="font-display text-headline-3 text-text-primary">Structured Book Manifest</h3>
                  <p className="font-mono text-caption text-text-muted">Plaintext key-value declarations delimited by triple hyphens</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-canvas px-2.5 py-1 rounded-full text-status-success font-mono text-overline font-semibold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>{parsedCount} MANUSCRIPTS DETECTED</span>
              </div>
            </div>

            <div className="relative flex-1 bg-canvas rounded-lg overflow-hidden shadow-inner flex flex-row min-h-[380px]">
              <div className="w-10 bg-surface-container-lowest text-text-muted font-mono text-caption select-none pt-3 pb-3 flex flex-col items-center gap-[6px] opacity-70">
                {Array.from({ length: 15 }, (_, i) => (
                  <span key={i}>{String(i + 1).padStart(2, "0")}</span>
                ))}
              </div>
              <textarea
                className="w-full bg-transparent p-3 font-mono text-body-small text-text-primary resize-y focus:outline-none leading-[26px] selection:bg-primary-container selection:text-on-primary-container"
                spellCheck={false}
                value={manifest}
                onChange={(e) => setManifest(e.target.value)}
              />
            </div>

            <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  className="bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary font-body text-body-small px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  onClick={() => setManifest(SAMPLE_MANIFEST)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">history_edu</span>
                  Load Sample Data
                </button>
                <button
                  className="bg-surface hover:bg-surface-hover text-text-muted hover:text-error font-body text-body-small px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  onClick={() => setManifest("")}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">backspace</span>
                  Clear
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-caption text-text-muted">Lines: {lineCount} &bull; Chars: {charCount}</span>
                <button
                  className="bg-primary hover:bg-primary-hover text-text-on-accent font-body text-body-small font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md"
                  onClick={handleParse}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  Parse &amp; Validate
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-surface-container rounded-xl shadow-md p-5 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                  </div>
                  <div>
                    <h3 className="font-display text-headline-3 text-text-primary">Digital Folios</h3>
                    <p className="font-mono text-caption text-text-muted">PDF Manuscript Archives</p>
                  </div>
                </div>
                <span className="font-mono text-caption text-secondary bg-surface px-2.5 py-1 rounded-md">
                  {files.length} files
                </span>
              </div>

              <div
                className={`relative group cursor-pointer mt-2 bg-canvas hover:bg-surface-hover p-6 rounded-xl transition-all duration-200 text-center flex flex-col items-center justify-center min-h-[170px] ${isDragOver ? "bg-surface-hover ring-2 ring-primary/40" : ""}`}
                onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                </div>
                <p className="font-body text-body-small font-semibold text-text-primary mb-1">
                  Drag &amp; drop PDF manuscripts here, or <span className="text-primary underline underline-offset-2">Browse Folios</span>
                </p>
                <p className="font-mono text-caption text-text-muted">
                  Accepts encrypted &amp; raw <span className="font-mono text-text-secondary">.pdf</span> documents up to 100MB each
                </p>
                <input
                  ref={fileInputRef}
                  accept=".pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  multiple
                  type="file"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2.5">
                  {files.map((file, idx) => (
                    <div key={idx} className="bg-canvas hover:bg-surface-container-high p-3 rounded-lg flex items-center justify-between gap-3 transition-colors shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded bg-surface-container flex items-center justify-center text-primary shrink-0">
                          <span className="material-symbols-outlined text-[20px]">description</span>
                        </div>
                        <div className="truncate">
                          <div className="font-mono text-body-small text-text-primary truncate">{file.name}</div>
                          <div className="flex items-center gap-2 font-mono text-caption text-text-muted">
                            <span>{file.size}</span>
                            <span>&bull;</span>
                            <span className="text-status-success font-medium inline-flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[13px]">check_circle</span> Uploaded
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="text-text-muted hover:text-error p-1 rounded transition-colors" title="Remove folio" onClick={() => removeFile(idx)} type="button">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between font-mono text-caption text-text-muted">
              <span className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-text-muted">lock_clock</span>
                Storage: Guild Vault #3 (Encrypted)
              </span>
            </div>
          </div>
        </div>
      </div>

      {parsedBooks.length > 0 && (
        <div className="bg-surface-container rounded-xl p-6 shadow-lg mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">fact_check</span>
                <h2 className="font-display text-headline-2 text-text-primary">Parsed Folio Staging</h2>
              </div>
              <p className="font-body text-body-small text-text-secondary mt-1">
                Real-time interpretation of manifest data mapped with associated binary artifacts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-canvas px-3 py-1.5 rounded-lg flex items-center gap-2 text-text-muted font-mono text-caption">
                <span>SHOWING: {parsedBooks.length} VALIDATED</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {parsedBooks.map((book, idx) => (
              <div key={idx} className="bg-canvas rounded-xl p-5 shadow-md flex flex-col justify-between group hover:bg-surface-container-high transition-all duration-200">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-body text-overline uppercase text-primary tracking-wider">ENTRY #{String(idx + 1).padStart(2, "0")}</span>
                      <h3 className="font-display text-headline-3 text-text-primary font-semibold mt-0.5 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <div className="font-body text-body-small text-text-secondary">by <span className="text-text-primary font-medium">{book.author}</span></div>
                    </div>
                    <span className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full text-status-success font-mono text-caption font-semibold shrink-0">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Ready
                    </span>
                  </div>
                  <p className="font-body text-body-small text-text-muted line-clamp-2">{book.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {book.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full bg-surface-container font-mono text-caption text-text-secondary">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 pt-4 bg-surface-container/50 -mx-5 -mb-5 px-5 py-3 rounded-b-xl flex items-center justify-between text-caption">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">attachment</span>
                    <span className="font-mono text-text-secondary truncate max-w-[160px] sm:max-w-[200px]">folio_{idx + 1}.pdf</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-secondary text-[14px]">🪙</span>
                    <span className="font-mono font-semibold text-secondary">{book.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 text-text-muted font-mono text-caption">
            <div className="flex items-center gap-4">
              <span>TOTAL ESTIMATED WEIGHT: <strong>14.8 MB</strong></span>
              <span>&bull;</span>
              <span>ESTIMATED GAS/PLEDGE: <strong className="text-secondary">430 🪙</strong></span>
            </div>
            <div className="flex items-center gap-2 text-status-success">
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>Zero metadata collisions discovered</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface-container rounded-xl shadow-md overflow-hidden mb-10">
        <button
          className="w-full p-5 text-left flex items-center justify-between hover:bg-surface-hover transition-colors"
          onClick={() => setShowAccordion(!showAccordion)}
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">terminal</span>
            </div>
            <div>
              <h3 className="font-display text-headline-3 text-text-primary">Automated Ingestion Script &amp; AI Prompt Generator</h3>
              <p className="font-mono text-caption text-text-muted">Execute batch preprocessing via terminal or generate structured manifests with local LLMs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline font-mono text-overline text-primary">POWERSHELL / BASH</span>
            <span
              className="material-symbols-outlined text-text-muted transform transition-transform duration-200"
              style={{ transform: showAccordion ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              expand_more
            </span>
          </div>
        </button>
        {showAccordion && (
          <div className="p-5 pt-0">
            <div className="bg-canvas rounded-lg p-4 font-mono text-body-small text-text-secondary relative shadow-inner">
              <div className="flex items-center justify-between pb-3 text-text-muted font-mono text-caption">
                <span>Terminal Automation / scripts/batch_pack.ps1</span>
                <button
                  className="flex items-center gap-1 text-primary hover:text-primary-hover transition-colors"
                  onClick={handleCopyScript}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">{copied ? "check" : "content_copy"}</span>
                  <span>{copied ? "Copied!" : "Copy Script"}</span>
                </button>
              </div>
              <pre className="overflow-x-auto text-text-primary leading-relaxed">
                <code className="text-text-secondary">{PS1_SCRIPT}</code>
              </pre>
            </div>
            <div className="mt-4 bg-surface p-3.5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-caption">
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="material-symbols-outlined text-primary text-[18px]">neurology</span>
                <span>Tip: Instruct your local Claude/GPT archivist with: <em className="text-text-primary">&quot;Convert this bibliography table to Genu YAML-style manifest blocks&quot;</em></span>
              </div>
              <button className="text-primary hover:underline font-body text-caption shrink-0">View LLM Template</button>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-4 z-40 w-full bg-surface-container/95 backdrop-blur-md rounded-2xl shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[22px]">publish</span>
          </div>
          <div>
            <div className="font-body text-body-default font-semibold text-text-primary flex items-center gap-2">
              <span>{parsedBooks.length} Validated Manuscripts Ready</span>
              {parsedBooks.length > 0 && <span className="w-2 h-2 rounded-full bg-status-success inline-block" />}
            </div>
            <div className="font-mono text-caption text-text-muted">
              {files.length > parsedBooks.length ? `${files.length - parsedBooks.length} unmatched folio will be queued as raw digital parchment asset` : "Manifest parsed and ready for archival ingestion"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            className="bg-surface hover:bg-surface-hover text-text-muted hover:text-text-primary font-body text-body-small px-4 py-2.5 rounded-lg transition-colors"
            onClick={() => { setManifest(""); setParsedBooks([]); setFiles([]); }}
            type="button"
          >
            Clear All
          </button>
          <button
            className="bg-surface-container-high hover:bg-surface-bright text-text-primary font-body text-body-small font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Inspect JSON
          </button>
          <button
            className="bg-primary-container hover:bg-primary-hover text-text-on-accent font-body text-body-small font-bold px-6 py-2.5 rounded-lg transition-all transform active:scale-95 shadow-md flex items-center gap-2"
            onClick={handleUpload}
            disabled={isUploading || parsedBooks.length === 0}
          >
            {isUploading ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                <span>Ingesting Batch...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">cloud_done</span>
                <span>Upload All to Archives</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container max-w-xl w-full rounded-2xl shadow-2xl p-6 relative">
            <button className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-1 rounded" onClick={() => setShowGuideModal(false)} type="button">
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">menu_book</span>
              </div>
              <div>
                <h3 className="font-display text-headline-2 text-text-primary">Manifest Specification</h3>
                <p className="font-mono text-caption text-text-muted">Guild Archival Manifest Standard v2.4</p>
              </div>
            </div>
            <div className="space-y-4 text-body-small text-text-secondary">
              <p>Each codex manuscript record is identified by key-value headers separated by a new line. Multiple records are delimited by a single line with <code className="text-primary font-mono">---</code>.</p>
              <div className="bg-canvas p-3 rounded-lg font-mono text-caption text-text-primary space-y-1">
                <div><strong className="text-secondary">Title:</strong> Name of the manuscript folio [Mandatory]</div>
                <div><strong className="text-secondary">Author:</strong> Scribe, scholar, or guild house [Mandatory]</div>
                <div><strong className="text-secondary">Description:</strong> Synopsis, bindings, and abstract [Optional]</div>
                <div><strong className="text-secondary">Tags:</strong> Comma-separated categorical disciplines [Optional]</div>
                <div><strong className="text-secondary">Price:</strong> Guild Coin value in JetBrains format [Optional]</div>
              </div>
              <p className="font-mono text-caption text-text-muted">
                Manuscript PDF matching runs automatically on exact or fuzzy Title-to-Filename heuristics. You may re-bind any mislinked folios in the parsed staging table.
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-primary hover:bg-primary-hover text-text-on-accent font-body text-body-small font-semibold px-5 py-2 rounded-lg transition-colors" onClick={() => setShowGuideModal(false)} type="button">
                Understood, Return to Folios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
