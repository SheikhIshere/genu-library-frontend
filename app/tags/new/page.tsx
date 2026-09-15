"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { books } from "@/lib/api";

interface Tag {
  name: string;
  count: number;
}

const INITIAL_TAGS: Tag[] = [
  { name: "Alchemical Transmutation", count: 42 },
  { name: "Sacred Geometry", count: 38 },
  { name: "Blacksmithing & Foundry", count: 29 },
  { name: "Celestial Navigation", count: 24 },
  { name: "Hermetic Treatises", count: 19 },
  { name: "Ancient Cartography", count: 17 },
  { name: "Herbalism & Botany", count: 15 },
  { name: "Philosopher's Stone", count: 14 },
  { name: "Guild Chronicles", count: 12 },
  { name: "Illuminated Manuscripts", count: 11 },
  { name: "Cryptanalysis", count: 9 },
  { name: "Glassmaking", count: 8 },
  { name: "Steam Automata", count: 6 },
  { name: "Aetheric Theory", count: 5 },
  { name: "Calligraphy", count: 4 },
  { name: "Timekeeping Horology", count: 3 },
  { name: "Binding & Vellum", count: 3 },
];

const CATEGORIES = [
  { label: "✧ Arcana", value: "Arcana" },
  { label: "⚒ Craft & Foundry", value: "Craft & Foundry" },
  { label: "⚖ Philosophy", value: "Natural Philosophy" },
  { label: "📜 History", value: "Historiography" },
  { label: "✦ Aetheric", value: "Aetheric Sciences" },
];

type SortMode = "folios" | "alpha" | "recent";

export default function AddNewTagPage() {
  const [tags, setTags] = useState<Tag[]>(INITIAL_TAGS);
  const [tagName, setTagName] = useState("");
  const [annotation, setAnnotation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("folios");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const duplicateTag = useMemo(() => {
    const trimmed = tagName.trim().toLowerCase();
    if (!trimmed) return null;
    return tags.find((t) => t.name.toLowerCase() === trimmed) || null;
  }, [tagName, tags]);

  const filteredTags = useMemo(() => {
    let result = tags.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortMode === "folios") {
      result.sort((a, b) => b.count - a.count);
    } else if (sortMode === "alpha") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.reverse();
    }
    return result;
  }, [tags, sortMode, searchQuery]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = tagName.trim();
      if (!trimmed || duplicateTag) return;

      setIsSubmitting(true);
      try {
        await books.addTag({ name: trimmed });
        setTags((prev) => [{ name: trimmed, count: 1 }, ...prev]);
        setTagName("");
        setAnnotation("");
      } catch {
        setTags((prev) => [{ name: trimmed, count: 1 }, ...prev]);
        setTagName("");
        setAnnotation("");
      } finally {
        setIsSubmitting(false);
      }
    },
    [tagName, duplicateTag]
  );

  const validationState: "empty" | "duplicate" | "valid" = !tagName.trim()
    ? "empty"
    : duplicateTag
      ? "duplicate"
      : "valid";

  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary-container/10 blur-3xl" />
      <div className="pointer-events-none absolute top-48 right-10 h-72 w-72 rounded-full bg-secondary/5 blur-3xl" />
      <div className="mx-auto w-full max-w-6xl px-margin py-space-xl">
        <nav aria-label="Breadcrumb" className="mb-space-md flex items-center gap-2">
          <Link className="font-body text-body-small text-text-muted transition-colors hover:text-text-primary" href="/">
            Home
          </Link>
          <span className="font-mono text-overline text-outline-variant">/</span>
          <Link className="font-body text-body-small text-text-muted transition-colors hover:text-text-primary" href="/tags">
            Tags
          </Link>
          <span className="font-mono text-overline text-outline-variant">/</span>
          <span className="font-body text-body-small text-primary">Add New</span>
        </nav>

        <header className="mb-space-xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div className="space-y-space-xs">
            <div className="flex items-center gap-space-sm">
              <span className="font-body text-overline uppercase tracking-widest text-primary">Archive Lexicon Forge</span>
              <span className="h-1 w-1 rounded-full bg-primary" />
              <span className="font-mono text-caption text-text-muted">Codex Registry Sec-04</span>
            </div>
            <h1 className="font-display text-display text-text-primary">Add New Tag</h1>
            <p className="max-w-2xl font-body text-body-default text-text-secondary">
              Curate taxonomy codices and thematic lexicons for classifying rare treatises, illuminated folios, and auditory scrolls across the archives.
            </p>
          </div>
          <div className="flex items-center gap-space-sm self-start rounded-lg bg-surface-container px-space-md py-space-sm md:self-auto">
            <span className="material-symbols-outlined text-primary text-[20px]">auto_stories</span>
            <div className="flex flex-col">
              <span className="font-mono text-caption font-medium text-text-muted">Catalog Coverage</span>
              <span className="font-mono text-body-small font-semibold text-text-primary">{tags.length * 108} Works Tagged</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-12">
          <section className="flex flex-col gap-space-lg lg:col-span-5">
            <div className="relative overflow-hidden rounded-xl bg-surface p-space-lg shadow-xl transition-all">
              <div className="pointer-events-none absolute top-0 right-0 h-28 w-28 translate-x-8 -translate-y-8 rounded-full bg-primary/10 blur-2xl" />
              <div className="mb-space-md flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  </div>
                  <h2 className="font-display text-headline-3 text-text-primary">Guild Taxonomy Tag</h2>
                </div>
                <span className="rounded-full bg-surface-container px-2.5 py-0.5 font-mono text-overline text-secondary">SEAL OF INGRESS</span>
              </div>

              <form className="space-y-space-lg" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-body text-body-small font-medium text-text-primary" htmlFor="tag-name">
                      Tag Name <span className="text-primary-container">*</span>
                    </label>
                    <span className="font-mono text-caption text-text-muted">{tagName.length} / 100</span>
                  </div>
                  <div className="relative">
                    <input
                      className="w-full rounded-lg bg-canvas px-3.5 py-2.5 font-body text-body-default text-text-primary placeholder:text-text-muted focus:outline-none transition-all"
                      id="tag-name"
                      maxLength={100}
                      value={tagName}
                      onChange={(e) => setTagName(e.target.value)}
                      placeholder="e.g. Hermetic Philosophy, Celestial Cartography"
                      type="text"
                    />
                    <div className="pointer-events-none absolute right-3 top-2.5 text-text-muted">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          validationState === "valid"
                            ? "text-status-success"
                            : validationState === "duplicate"
                              ? "text-error"
                              : "text-text-muted"
                        }`}
                      >
                        {validationState === "valid" ? "check" : validationState === "duplicate" ? "cancel" : "edit_note"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 pt-1 text-text-muted">
                    <span className="material-symbols-outlined mt-0.5 text-[15px] shrink-0">info</span>
                    <p className="font-body text-caption text-text-muted leading-tight">
                      Tag names must be unique across the Sovereign Guild Lexicon and remain casing-agnostic during search lookups.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-body-small font-medium text-text-primary">Lexicon Domain (Discipline)</span>
                    <span className="font-mono text-caption text-text-muted">Quick Stamp</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setSelectedCategory(selectedCategory === cat.value ? "" : cat.value)}
                        className={`rounded-full px-3 py-1 font-body text-body-small transition-all ${
                          selectedCategory === cat.value
                            ? "bg-primary/20 text-primary font-semibold shadow-sm"
                            : "bg-surface-container text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-body text-body-small font-medium text-text-secondary" htmlFor="tag-scope">
                    Scholarly Annotation <span className="text-caption text-text-muted">(Optional)</span>
                  </label>
                  <textarea
                    className="w-full resize-none rounded-lg bg-canvas px-3.5 py-2 font-body text-body-small text-text-primary placeholder:text-text-muted focus:outline-none transition-all"
                    id="tag-scope"
                    placeholder="Summarize taxonomy parameters for apprentices and catalogers..."
                    rows={2}
                    value={annotation}
                    onChange={(e) => setAnnotation(e.target.value)}
                  />
                </div>

                <div
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 ${
                    validationState === "duplicate"
                      ? "bg-error-container/30 text-error"
                      : validationState === "valid"
                        ? "bg-status-success/20 text-text-primary"
                        : "bg-surface-container"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] shrink-0 ${
                      validationState === "duplicate"
                        ? "text-error"
                        : validationState === "valid"
                          ? "text-status-success"
                          : "text-status-success"
                    }`}
                  >
                    {validationState === "duplicate" ? "warning" : validationState === "valid" ? "check_circle" : "verified_user"}
                  </span>
                  <p
                    className={`font-body text-caption leading-snug ${
                      validationState === "duplicate" ? "text-error" : validationState === "valid" ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {validationState === "duplicate"
                      ? `Tag \u201c${tagName.trim()}\u201d already exists within the Sovereign Codex. Duplicates are restricted.`
                      : validationState === "valid"
                        ? `\u201c${tagName.trim()}\u201d is unique and eligible for guild registration.`
                        : "Duplicate verification active: ready for ingestion into the archival codex."}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || validationState === "duplicate" || !tagName.trim()}
                  className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-space-md py-3 font-body text-body-default font-semibold text-text-on-accent transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-12">bookmark_add</span>
                  <span>Add Tag to Lexicon</span>
                  <span className="font-mono text-caption opacity-80">↵</span>
                </button>
              </form>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-surface-container p-space-md">
              <div className="flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[22px] shrink-0">shield_with_heart</span>
                <div className="space-y-1">
                  <h4 className="font-display text-body-default font-semibold text-text-primary">Archival Consensus Rule</h4>
                  <p className="font-body text-caption text-text-secondary">
                    Once registered, newly minted tags are propagated across federated reading desks and catalog indices within three ticks of the guild water clock.
                  </p>
                  <div className="pt-1 font-mono text-overline text-text-muted">REGISTRY PROTOCOL · REV 4.8.19</div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-space-md lg:col-span-7">
            <div className="flex flex-col rounded-xl bg-surface p-space-lg shadow-xl">
              <div className="mb-space-md flex flex-col justify-between gap-space-sm sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-display text-headline-2 text-text-primary">Existing Archive Tags</h3>
                  <p className="font-body text-caption text-text-muted">Curated vocabulary currently indexed across the shelves</p>
                </div>
                <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary/10 px-3 py-1 font-mono text-caption font-semibold text-primary sm:self-auto">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  {tags.length} Lexicon Tags Active
                </span>
              </div>

              <div className="mb-space-lg flex flex-col gap-space-sm sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined pointer-events-none absolute left-3 top-2.5 text-text-muted text-[18px]">search</span>
                  <input
                    className="w-full rounded-lg bg-canvas pl-9 pr-3.5 py-2 font-body text-body-small text-text-primary placeholder:text-text-muted focus:outline-none transition-all"
                    placeholder="Filter existing tags..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center rounded-lg bg-canvas p-1">
                  {(["folios", "alpha", "recent"] as SortMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSortMode(mode)}
                      className={`rounded-md px-2.5 py-1 font-mono text-overline font-medium transition-all ${
                        sortMode === mode
                          ? "bg-surface-container text-primary"
                          : "text-text-muted hover:text-text-primary"
                      }`}
                    >
                      {mode === "folios" ? "Most Folios" : mode === "alpha" ? "A\u2013Z" : "Recent"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 py-space-xs min-h-[300px] content-start">
                {filteredTags.map((tag) => (
                  <button
                    key={tag.name}
                    type="button"
                    className="group inline-flex items-center gap-2 rounded-full bg-canvas px-3.5 py-1.5 text-left transition-all hover:-translate-y-0.5 hover:bg-surface-hover"
                  >
                    <span className="font-body text-body-small text-text-primary group-hover:text-primary">{tag.name}</span>
                    <span className="rounded-full bg-surface-container px-2 py-0.5 font-mono text-overline font-medium text-secondary">{tag.count}</span>
                  </button>
                ))}
                {filteredTags.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center w-full">
                    <span className="material-symbols-outlined text-text-muted text-[36px] mb-2">find_in_page</span>
                    <p className="font-display text-headline-3 text-text-primary">No Matching Lexicon Tags</p>
                    <p className="font-body text-body-small text-text-secondary max-w-sm mt-1">
                      No archived tags match your query. You can mint this as a new term using the forge panel on the left.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-space-lg flex flex-col justify-between gap-space-sm rounded-lg bg-surface-container px-space-md py-space-sm sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 text-text-secondary">
                  <span className="material-symbols-outlined text-secondary text-[18px]">touch_app</span>
                  <span className="font-body text-caption text-text-secondary">Click any tag to inspect related codices in the catalog.</span>
                </div>
                <Link className="inline-flex items-center gap-1 font-mono text-overline font-semibold text-primary hover:text-primary-hover transition-colors" href="/tags">
                  <span>OPEN TAXONOMY MATRIX</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-space-md">
              <div className="flex flex-col rounded-xl bg-surface p-space-md shadow-sm">
                <span className="font-body text-overline uppercase text-text-muted">Active Lexicographers</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-headline-2 text-text-primary">14</span>
                  <span className="font-mono text-caption text-status-success">Online</span>
                </div>
              </div>
              <div className="flex flex-col rounded-xl bg-surface p-space-md shadow-sm">
                <span className="font-body text-overline uppercase text-text-muted">Unclassified Folios</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-headline-2 text-text-primary">19</span>
                  <span className="font-mono text-caption text-status-warning">Awaiting Tag</span>
                </div>
              </div>
              <div className="flex flex-col rounded-xl bg-surface p-space-md shadow-sm">
                <span className="font-body text-overline uppercase text-text-muted">Consensus Rate</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-headline-2 text-text-primary">99.4%</span>
                  <span className="font-mono text-caption text-secondary">Verified</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
