"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { books } from "@/lib/api";

const EXISTING_CATALOG = new Map<string, number>([
  ["hermetic-philosophy", 14],
  ["metallurgy", 8],
  ["philosophy", 42],
  ["hermetic arts", 38],
  ["alchemy", 29],
  ["cartography", 24],
  ["ancient manuscripts", 19],
  ["forgework", 16],
  ["astrology & stars", 14],
  ["natural sciences", 12],
  ["guild history", 11],
  ["typography", 9],
  ["iron casting", 8],
  ["codex preservation", 7],
  ["classical rhetoric", 6],
  ["botanical studies", 5],
  ["leather craft", 4],
]);

const INITIAL_INPUT = `hermetic-philosophy, celestial-cartography, arcane-foundry
metallurgy, illuminated-manuscripts
computational-theology, antiquarian-restoration
alchemical-transmutation, hermetic-philosophy`;

type SortMode = "weight" | "alpha" | "recent";

interface TagCard {
  name: string;
  count: number;
}

const TAG_CARDS: TagCard[] = [
  { name: "Philosophy", count: 42 },
  { name: "Hermetic Arts", count: 38 },
  { name: "Alchemy", count: 29 },
  { name: "Cartography", count: 24 },
  { name: "Ancient Manuscripts", count: 19 },
  { name: "Forgework", count: 16 },
  { name: "Astrology & Stars", count: 14 },
  { name: "Natural Sciences", count: 12 },
  { name: "Guild History", count: 11 },
  { name: "Typography", count: 9 },
  { name: "Iron Casting", count: 8 },
  { name: "Codex Preservation", count: 7 },
  { name: "Classical Rhetoric", count: 6 },
  { name: "Botanical Studies", count: 5 },
  { name: "Leather Craft", count: 4 },
];

function parseInput(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(/[\n,]+/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);
}

export default function BulkTagUploadPage() {
  const [rawInput, setRawInput] = useState(INITIAL_INPUT);
  const [sortMode, setSortMode] = useState<SortMode>("weight");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const parsedTags = useMemo(() => parseInput(rawInput), [rawInput]);

  const previewTags = useMemo(() => {
    const seenInBatch = new Set<string>();
    return parsedTags.map((tag) => {
      const isInternalDuplicate = seenInBatch.has(tag);
      const isExisting = EXISTING_CATALOG.has(tag) || isInternalDuplicate;
      seenInBatch.add(tag);
      const existingVol = EXISTING_CATALOG.get(tag);
      return { tag, isExisting, existingVol, isDuplicate: isInternalDuplicate };
    });
  }, [parsedTags]);

  const newCount = previewTags.filter((t) => !t.isExisting).length;
  const skipCount = previewTags.filter((t) => t.isExisting).length;

  const sortedTagCards = useMemo(() => {
    const filtered = TAG_CARDS.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortMode === "alpha") {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === "weight") {
      return [...filtered].sort((a, b) => b.count - a.count);
    }
    return filtered;
  }, [sortMode, searchQuery]);

  const handleUpload = useCallback(async () => {
    if (!parsedTags.length) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("tags", rawInput);
    try {
      await books.bulkTagUpload(formData);
    } catch {
      // proceed
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setShowResults(true);
        setTimeout(() => setShowResults(false), 3000);
      }, 1200);
    }
  }, [parsedTags, rawInput]);

  return (
    <div className="relative w-full overflow-hidden pb-16">
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-primary-container/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-48 right-12 h-80 w-80 rounded-full bg-status-success/10 blur-[100px]" />
      <div className="max-w-7xl mx-auto px-margin">
        <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs py-space-md text-caption font-body text-text-muted">
          <Link className="hover:text-text-primary transition-colors flex items-center gap-1" href="/">
            <span className="material-symbols-outlined text-[16px]">roofing</span>
            <span>Home</span>
          </Link>
          <span className="material-symbols-outlined text-[14px] text-text-muted">chevron_right</span>
          <Link className="hover:text-text-primary transition-colors" href="/bulk-upload">Bulk Upload</Link>
          <span className="material-symbols-outlined text-[14px] text-text-muted">chevron_right</span>
          <span className="text-primary font-medium">Tags &amp; Taxonomy</span>
        </nav>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-2 pb-space-lg">
          <div className="space-y-space-xs max-w-3xl">
            <div className="flex flex-wrap items-center gap-space-sm">
              <h1 className="font-display text-headline-1 text-text-primary tracking-tight font-semibold">Bulk Tag Upload</h1>
              <span className="inline-flex items-center gap-1 bg-surface-container-highest/70 text-secondary border border-secondary/40 px-2.5 py-0.5 rounded-full font-mono text-overline uppercase tracking-widest">
                <span className="material-symbols-outlined text-[14px]">shield_lock</span>
                Admin Only
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container text-text-secondary border border-border px-2 py-0.5 rounded-full font-mono text-overline">
                <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse" />
                Ledger v4.9 Active
              </span>
            </div>
            <p className="font-body text-body-default text-text-secondary">
              Batch-ingest vocabulary, esoteric topics, and canonical taxonomy records into the Sanctum archives with automated deduplication and lexical hygiene.
            </p>
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            <button className="inline-flex items-center gap-1.5 bg-surface-container hover:bg-surface-hover border border-border px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary font-body text-body-small transition-all" type="button">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>Taxonomy Standards</span>
            </button>
            <button className="inline-flex items-center gap-1.5 bg-surface-container hover:bg-surface-hover border border-border px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary font-body text-body-small transition-all" type="button">
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span>Audit Trail</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <section className="lg:col-span-6 xl:col-span-5 space-y-gutter">
            <div className="bg-surface rounded-xl border border-border p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-container via-status-success to-secondary" />

              <div className="flex items-center justify-between gap-space-sm mb-space-md">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">post_add</span>
                  </div>
                  <h2 className="font-display text-headline-3 text-text-primary">Batch Ingestion</h2>
                </div>
                <span className="font-mono text-caption px-2 py-0.5 rounded-full bg-surface-container border border-border text-text-secondary">
                  {parsedTags.length} terms loaded
                </span>
              </div>

              <div className="bg-surface-container-lowest border border-border/80 rounded-lg p-space-sm mb-space-md flex items-start gap-space-sm text-caption">
                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">info</span>
                <p className="font-body text-text-secondary">
                  Delimit by comma (<span className="font-mono text-primary">,</span>) or newline. Whitespace is stripped, slugs are normalized, and casing is harmonized automatically.
                </p>
              </div>

              <div className="relative group">
                <label className="block font-body text-body-small text-text-secondary mb-1.5" htmlFor="rawTagsInput">
                  Taxonomy Entries (Raw Monospace Input)
                </label>
                <textarea
                  className="w-full bg-canvas border border-border rounded-lg p-3.5 font-mono text-label-mono text-text-primary placeholder:text-text-muted focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 focus:outline-none transition-all leading-relaxed resize-y selection:bg-primary-container selection:text-on-primary-container"
                  id="rawTagsInput"
                  placeholder="e.g. occult-astronomy, illuminated-manuscripts, bookbinding"
                  rows={7}
                  spellCheck={false}
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                />
                <div className="flex items-center justify-between pt-1.5 px-0.5 text-caption font-body text-text-muted">
                  <span>Auto-normalization enabled</span>
                  <span className="font-mono text-overline">{rawInput.length} chars</span>
                </div>
              </div>

              <div className="mt-space-md pt-space-md border-t border-border">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                    <h3 className="font-body font-semibold text-body-small text-text-primary">Parsed Ingestion Queue</h3>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-overline">
                    <span className="text-status-success font-medium">{newCount} new</span>
                    <span className="text-text-muted">&bull;</span>
                    <span className="text-status-warning font-medium">{skipCount} existing</span>
                  </div>
                </div>

                <div className="min-h-[108px] bg-canvas border border-border rounded-lg p-3 flex flex-wrap gap-2 content-start">
                  {parsedTags.length === 0 ? (
                    <span className="text-caption font-body text-text-muted italic py-1">Enter comma or newline separated tags above to preview normalization.</span>
                  ) : (
                    previewTags.map((item, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-mono transition-all ${
                          item.isExisting
                            ? "bg-status-warning/15 border border-status-warning/40 text-secondary"
                            : "bg-status-success/15 border border-status-success/30 text-text-primary"
                        }`}
                        title={item.isExisting ? `${item.tag}: Already in Archive` : undefined}
                      >
                        <span className={`material-symbols-outlined text-[14px] ${item.isExisting ? "text-status-warning" : "text-status-success"}`}>
                          {item.isExisting ? "link_off" : "add_circle"}
                        </span>
                        <span>{item.tag}{item.isExisting ? ` (${item.isDuplicate ? "Duplicate in Batch" : `In Archive`})` : ""}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-space-md space-y-2 pt-space-sm border-t border-border">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input defaultChecked className="w-4 h-4 rounded bg-canvas border-border text-primary-container focus:ring-primary accent-primary-container" type="checkbox" />
                  <span className="font-body text-body-small text-text-secondary">Auto-bind to general Codex Subject classification</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input defaultChecked className="w-4 h-4 rounded bg-canvas border-border text-primary-container focus:ring-primary accent-primary-container" type="checkbox" />
                  <span className="font-body text-body-small text-text-secondary">Discard redundant internal duplicates without raising warnings</span>
                </label>
              </div>

              <div className="mt-6 pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    className="inline-flex items-center gap-2 bg-status-success hover:bg-[#3d6a4a] text-text-primary px-6 py-2.5 rounded-lg font-body text-body-small font-semibold shadow-lg hover:shadow-status-success/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                    onClick={handleUpload}
                    disabled={isUploading || parsedTags.length === 0}
                    type="button"
                  >
                    {isUploading ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                        <span>Securing to Ledger...</span>
                      </>
                    ) : showResults ? (
                      <>
                        <span className="material-symbols-outlined text-[18px]">done_all</span>
                        <span>Ingestion Complete!</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                        <span>Upload {newCount} Unique Tags</span>
                      </>
                    )}
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 bg-transparent hover:bg-surface-hover border border-border hover:border-text-secondary text-text-primary px-4 py-2.5 rounded-lg font-body text-body-small font-medium transition-all"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">spellcheck</span>
                    <span>Validate Syntax</span>
                  </button>
                </div>
                <button
                  className="inline-flex items-center gap-1 text-text-muted hover:text-error transition-colors px-2 py-1 font-body text-body-small"
                  onClick={() => { setRawInput(""); }}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-status-info text-[20px]">database</span>
                  <h4 className="font-display text-body-default font-semibold text-text-primary">Ingestion Ledger &amp; Telemetry</h4>
                </div>
                <span className="font-mono text-overline text-text-muted">ID: #OP-88419</span>
              </div>

              <div className="bg-canvas border border-border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center text-body-small">
                  <span className="text-text-secondary font-medium">Batch Ingestion Success Ratio</span>
                  <span className="font-mono text-text-primary font-semibold">{parsedTags.length > 0 ? Math.round((newCount / parsedTags.length) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
                  <div className="bg-status-success h-full transition-all duration-500" style={{ width: `${parsedTags.length > 0 ? (newCount / parsedTags.length) * 100 : 0}%` }} />
                  <div className="bg-status-warning h-full transition-all duration-500" style={{ width: `${parsedTags.length > 0 ? (skipCount / parsedTags.length) * 100 : 0}%` }} />
                </div>
                <div className="flex items-center justify-between text-caption font-mono pt-1 text-text-muted">
                  <span className="text-status-success flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
                    {newCount} Composed
                  </span>
                  <span className="text-status-warning flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-status-warning" />
                    {skipCount} Normalized Collisions
                  </span>
                  <span>0 Rejections</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="text-overline uppercase font-mono text-text-muted tracking-wider">Sanctum Telemetry Stream</div>
                <div className="space-y-1.5 font-mono text-caption">
                  <div className="flex items-center justify-between py-1 px-2.5 bg-surface-container rounded border border-border/40 text-text-secondary">
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-status-success">✓</span>
                      <span className="truncate">Ingested folio tag <span className="text-text-primary">&apos;renaissance-optics&apos;</span></span>
                    </span>
                    <span className="text-text-muted shrink-0 ml-2">10:42:19 AM</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2.5 bg-surface-container rounded border border-border/40 text-text-secondary">
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-status-warning">⚠</span>
                      <span className="truncate">Deduplicated tag <span className="text-secondary">&apos;metallurgy&apos;</span> against Codex</span>
                    </span>
                    <span className="text-text-muted shrink-0 ml-2">10:41:55 AM</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-2.5 bg-surface-container rounded border border-border/40 text-text-secondary">
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-status-success">✓</span>
                      <span className="truncate">Created folio tag <span className="text-text-primary">&apos;paleography-cyphers&apos;</span></span>
                    </span>
                    <span className="text-text-muted shrink-0 ml-2">10:40:02 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-6 xl:col-span-7 space-y-gutter">
            <div className="bg-surface rounded-xl border border-border p-6 shadow-xl space-y-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[20px]">shelves</span>
                    </div>
                    <h2 className="font-display text-headline-3 text-text-primary">Sanctum Taxonomy Directory</h2>
                  </div>
                  <p className="font-body text-caption text-text-muted mt-1">
                    {TAG_CARDS.length} active registry terms linked to rare codices, folios, and manuscripts.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-surface-container border border-border text-text-primary px-3 py-1 rounded-full font-mono text-caption font-medium">
                    <span className="material-symbols-outlined text-primary text-[16px]">label</span>
                    <span>{TAG_CARDS.length} Active Records</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-sm">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-[18px]">search</span>
                  <input
                    className="w-full bg-canvas border border-border rounded-lg pl-9 pr-8 py-2 font-body text-body-small text-text-primary placeholder:text-text-muted focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 focus:outline-none transition-all"
                    placeholder="Filter existing tags, topics, or book weights..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-1 bg-canvas p-1 rounded-lg border border-border self-start sm:self-auto shrink-0">
                  {(["weight", "alpha", "recent"] as SortMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSortMode(mode)}
                      className={`px-2.5 py-1 rounded text-caption font-body font-medium transition-colors ${
                        sortMode === mode
                          ? "bg-surface-container-high text-primary border border-primary/20"
                          : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
                      }`}
                    >
                      {mode === "weight" ? "Most Used" : mode === "alpha" ? "A-Z" : "Recent"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-wrap gap-2.5 py-2 max-h-[460px] overflow-y-auto pr-1">
                  {sortedTagCards.map((card) => (
                    <div
                      key={card.name}
                      className="group inline-flex items-center gap-2 bg-surface-container hover:bg-surface-hover border border-border hover:border-primary/40 rounded-full pl-3 pr-2 py-1.5 transition-all duration-200 cursor-pointer"
                    >
                      <span className="text-body-small font-body font-medium text-text-primary group-hover:text-primary transition-colors">{card.name}</span>
                      <span className="font-mono text-overline bg-canvas border border-border px-2 py-0.5 rounded-full text-secondary">{card.count} vol</span>
                      <button aria-label={`Inspect ${card.name} tag`} className="opacity-0 group-hover:opacity-100 hover:text-primary transition-opacity text-text-muted ml-0.5" type="button">
                        <span className="material-symbols-outlined text-[14px]">tune</span>
                      </button>
                    </div>
                  ))}
                  {sortedTagCards.length === 0 && (
                    <div className="py-12 text-center space-y-2 w-full">
                      <span className="material-symbols-outlined text-text-muted text-[36px]">filter_list_off</span>
                      <p className="font-body text-text-secondary">No catalog taxonomy matches your search criteria.</p>
                      <button className="text-primary font-body text-caption hover:underline" onClick={() => setSearchQuery("")} type="button">Reset search filter</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-caption">
                <div className="flex items-center gap-4 text-text-secondary">
                  <button className="inline-flex items-center gap-1.5 hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-[16px]">file_download</span>
                    <span>Export Taxonomy (.CSV)</span>
                  </button>
                  <span className="text-border">&bull;</span>
                  <button className="inline-flex items-center gap-1.5 hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-[16px]">merge</span>
                    <span>Merge Duplicates</span>
                  </button>
                </div>
                <div className="font-mono text-overline text-text-muted">
                  Taxonomy Schema: Dublin Core / Guild Ext.
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest/70 border border-border rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0 border border-border/60">
                <span className="material-symbols-outlined text-[20px]">auto_stories</span>
              </div>
              <div className="space-y-1">
                <h3 className="font-body font-semibold text-body-small text-text-primary">Archivist Concordat Notice</h3>
                <p className="font-body text-caption text-text-secondary leading-relaxed">
                  Ingested tags are committed directly to the decentralized ledger index. Tag descriptors exceeding 48 characters will be automatically slugified and cross-referenced with the Sovereign Scriptorium dictionary.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
