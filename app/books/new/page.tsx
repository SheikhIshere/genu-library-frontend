'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { books } from '@/lib/api';

const SUGGESTED_TAGS = ['Medieval', 'Rare Manuscript', 'Cosmology', 'Codex 42'];

export default function AddNewBookPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>(['Philosophy', 'Cartography', 'First Edition', 'Illuminated']);
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  const [price, setPrice] = useState(0);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [saveStatus, setSaveStatus] = useState('Draft idle');

  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleCoverChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handlePdfChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPdfFile(file);
  }, []);

  const handleTagKeydown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,+|,+$/g, '');
      if (val.length > 0 && !tags.includes(val)) {
        setTags((prev) => [...prev, val]);
        setTagInput('');
      }
    }
  }, [tagInput, tags]);

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const addSuggestedTag = useCallback((tag: string) => {
    if (!tags.includes(tag)) setTags((prev) => [...prev, tag]);
  }, [tags]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    setIsSubmitting(true);
    setSaveStatus('Publishing...');

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('author', author.trim());
    if (description.trim()) formData.append('description', description.trim());
    if (tags.length > 0) formData.append('tag', JSON.stringify(tags));
    formData.append('is_public', String(visibility === 'public'));
    formData.append('price', String(price));
    if (coverFile) formData.append('cover_page', coverFile);
    if (pdfFile) formData.append('pdf_file', pdfFile);

    try {
      const res = await books.create(formData);
      if (res.ok) {
        setSaveStatus('Published!');
        const data = await res.json();
        router.push(`/books/${data.slug || ''}`);
      } else {
        setSaveStatus('Failed to publish');
        setIsSubmitting(false);
      }
    } catch {
      setSaveStatus('Network error');
      setIsSubmitting(false);
    }
  }, [title, author, description, tags, visibility, price, coverFile, pdfFile, router]);

  return (
    <main className="w-full min-h-screen">
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute -top-40 right-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -left-32 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
            <div className="space-y-1">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-text-muted">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[14px]">home</span>
                  <span>Home</span>
                </Link>
                <span className="text-border-hover">/</span>
                <Link className="hover:text-primary transition-colors" href="/books">Books</Link>
                <span className="text-border-hover">/</span>
                <span className="text-primary font-semibold tracking-wide">Add New</span>
              </nav>
              <h1 className="font-display text-headline-1 text-text-primary tracking-tight mt-1">Add New Book</h1>
              <p className="font-body text-body-small text-text-secondary max-w-2xl">
                Contribute to the grand archive. Share manuscripts, literary treatises, and timeless chronicles bound for preservation.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto bg-surface-container border border-border px-3.5 py-1.5 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success" />
              </span>
              <span className="font-mono text-xs text-text-secondary">
                Auto-save active · <span className="text-text-primary">{saveStatus}</span>
              </span>
            </div>
          </div>

          <form className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" onSubmit={handleSubmit}>
            <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              <div className="bg-surface border border-border rounded-xl p-4 md:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display text-headline-3 text-text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">auto_stories</span>
                    Book Cover Art
                  </h2>
                  <span className="font-mono text-xs text-text-muted bg-surface-container px-2 py-0.5 rounded border border-border">3:4 Ratio</span>
                </div>
                <p className="font-body text-xs text-text-secondary mb-4">
                  Portrait ratio recommended (800x1066px or higher). Max 1MB (PNG, JPG, WebP).
                </p>

                {!coverPreview ? (
                  <div
                    className="relative group border-2 border-dashed border-border rounded-xl p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_0_24px_rgba(232,105,63,0.12)] bg-surface-container-lowest text-center flex flex-col items-center justify-center min-h-[380px] cursor-pointer"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    <input
                      ref={coverInputRef}
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      type="file"
                      onChange={handleCoverChange}
                    />
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 via-primary-container/10 to-transparent border border-primary/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(232,105,63,0.15)]">
                      <span className="material-symbols-outlined text-primary text-[32px]">add_photo_alternate</span>
                    </div>
                    <h3 className="font-display text-headline-3 text-text-primary mb-1">Drag & drop cover image</h3>
                    <p className="font-body text-xs text-text-secondary max-w-xs mb-2">
                      or <span className="text-primary underline font-medium">browse local files</span> to illumine your folio.
                    </p>
                    <div className="inline-flex items-center gap-2 font-mono text-xs text-text-muted mt-2 border border-border px-2.5 py-1 rounded-full bg-surface">
                      <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                      <span>PNG, JPG, WebP up to 1MB</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative group rounded-xl overflow-hidden border border-border bg-surface-container-lowest transition-all duration-300 hover:border-border-hover">
                    <div className="relative aspect-[3/4] w-full overflow-hidden">
                      <img
                        alt="Book cover preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={coverPreview}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-canvas/70 backdrop-blur-sm">
                        <button
                          type="button"
                          className="bg-primary text-text-on-accent font-body text-body-small font-semibold px-4 py-2 rounded-lg hover:bg-primary-hover flex items-center gap-1.5 shadow-[0_0_20px_rgba(232,105,63,0.3)] transform -translate-y-1 group-hover:translate-y-0 transition-all"
                          onClick={() => coverInputRef.current?.click()}
                        >
                          <span className="material-symbols-outlined text-[18px]">cached</span>
                          Change Cover
                        </button>
                        <span className="font-mono text-xs text-text-secondary">Click to upload new artwork</span>
                      </div>
                      <div className="absolute top-3 left-3 bg-canvas/90 backdrop-blur-md border border-border px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="font-mono text-xs text-secondary font-medium tracking-wide">Guild Seal Bound</span>
                      </div>
                    </div>
                    <div className="p-2 bg-surface-container border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0">image</span>
                        <span className="font-mono text-xs text-text-primary truncate">{coverFile?.name}</span>
                      </div>
                      <span className="font-mono text-xs text-text-muted shrink-0 pl-2">
                        {coverFile ? `${(coverFile.size / 1024).toFixed(0)} KB` : ''}
                      </span>
                    </div>
                    <input
                      ref={coverInputRef}
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      type="file"
                      onChange={handleCoverChange}
                    />
                  </div>
                )}

                <div className="mt-4 p-3.5 rounded-lg bg-surface-container-low border border-border flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">palette</span>
                  <div className="space-y-0.5">
                    <p className="font-body text-xs font-semibold text-text-primary">Archivist Folio Rule</p>
                    <p className="font-body text-xs text-text-secondary leading-relaxed">
                      &ldquo;A captivating cover honors the scholarship within.&rdquo; High-contrast typography and authentic tactile motifs enhance collector engagements across guild stalls.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            <main className="lg:col-span-7 space-y-6">
              <section className="bg-surface border border-border rounded-xl p-4 md:p-6 shadow-sm space-y-4">
                <div className="border-b border-border pb-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-overline uppercase text-text-muted tracking-wider">Tome Specifications · Phase I</span>
                    <h2 className="font-display text-headline-3 text-text-primary mt-0.5">General Details</h2>
                  </div>
                  <span className="material-symbols-outlined text-border-hover">clock_loader_40</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-body text-body-small font-medium text-text-secondary" htmlFor="bookTitle">
                    Book Title <span className="text-primary">*</span>
                  </label>
                  <input
                    className="w-full bg-canvas border border-border rounded-lg px-3.5 py-2.5 font-display text-body-default text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                    id="bookTitle"
                    placeholder="e.g., The Architecture of Lost Citadels"
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <p className="font-body text-xs text-text-muted">Enter the complete canonical volume or treaty title.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-body text-body-small font-medium text-text-secondary" htmlFor="bookAuthor">
                    Author / Scholar <span className="text-primary">*</span>
                  </label>
                  <input
                    className="w-full bg-canvas border border-border rounded-lg px-3.5 py-2.5 font-body text-body-default text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                    id="bookAuthor"
                    placeholder="e.g., Alistair Vance or 'Self'"
                    required
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-body text-body-small font-medium text-text-secondary" htmlFor="bookSynopsis">
                      Description / Abstract
                    </label>
                    <div className="flex items-center gap-1 border border-border bg-surface-container rounded px-1.5 py-0.5">
                      <button className="text-text-muted hover:text-text-primary px-1 font-body font-bold text-xs" title="Bold" type="button">B</button>
                      <button className="text-text-muted hover:text-text-primary px-1 font-body italic text-xs" title="Italic" type="button">I</button>
                      <span className="text-border">|</span>
                      <button className="text-text-muted hover:text-text-primary px-1 font-body text-xs flex items-center" title="Quote" type="button">
                        <span className="material-symbols-outlined text-[14px]">format_quote</span>
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="w-full bg-canvas border border-border rounded-lg px-3.5 py-2.5 font-body text-body-small text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all resize-y leading-relaxed"
                    id="bookSynopsis"
                    maxLength={1000}
                    placeholder="Provide a comprehensive synopsis or historical preface of the manuscript..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="flex items-center justify-between font-mono text-xs text-text-muted px-1">
                    <span>Markdown formatting permitted</span>
                    <span className="text-primary font-medium">{description.length} / 1000 max</span>
                  </div>
                </div>
              </section>

              <section className="bg-surface border border-border rounded-xl p-4 md:p-6 shadow-sm space-y-4">
                <div className="border-b border-border pb-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-overline uppercase text-text-muted tracking-wider">Classification Ledger · Phase II</span>
                    <h2 className="font-display text-headline-3 text-text-primary mt-0.5">Taxonomy &amp; Classification</h2>
                  </div>
                  <span className="material-symbols-outlined text-border-hover">category</span>
                </div>

                <div className="space-y-2">
                  <label className="block font-body text-body-small font-medium text-text-secondary">
                    Manuscript Tags &amp; Guild Indices
                  </label>
                  <div className="bg-canvas border border-border rounded-lg p-2 flex flex-wrap items-center gap-1.5 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 bg-primary/10 border border-primary text-primary px-2.5 py-0.5 rounded-full font-mono text-xs">
                        {tag}
                        <button className="hover:text-text-primary transition-colors ml-0.5" onClick={() => removeTag(tag)} title="Remove tag" type="button">&times;</button>
                      </span>
                    ))}
                    <input
                      className="bg-transparent border-none outline-none font-body text-body-small text-text-primary placeholder:text-text-muted px-2 py-1 flex-1 min-w-[140px]"
                      id="tagInput"
                      onKeyDown={handleTagKeydown}
                      placeholder="Type tag + press enter..."
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center flex-wrap gap-2 pt-1">
                    <span className="font-mono text-overline text-text-muted uppercase tracking-wider mr-1">Suggestions:</span>
                    {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
                      <button key={tag} className="font-mono text-xs text-text-secondary bg-surface-container hover:bg-surface-hover border border-border hover:border-primary px-2 py-0.5 rounded-full transition-all" onClick={() => addSuggestedTag(tag)} type="button">
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="bg-surface border border-border rounded-xl p-4 md:p-6 shadow-sm space-y-4">
                <div className="border-b border-border pb-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-overline uppercase text-text-muted tracking-wider">Sanctum Protocols · Phase III</span>
                    <h2 className="font-display text-headline-3 text-text-primary mt-0.5">Access &amp; Monetization</h2>
                  </div>
                  <span className="material-symbols-outlined text-secondary">token</span>
                </div>

                <div className="space-y-2">
                  <label className="block font-body text-body-small font-medium text-text-secondary">Archive Visibility State</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-surface-container-lowest p-1.5 rounded-xl border border-border">
                    {(['public', 'private', 'unlisted'] as const).map((opt) => (
                      <label key={opt} className="cursor-pointer">
                        <input
                          checked={visibility === opt}
                          className="peer sr-only"
                          name="visibility"
                          onChange={() => setVisibility(opt)}
                          type="radio"
                          value={opt}
                        />
                        <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-transparent font-body text-body-small text-text-secondary peer-checked:bg-surface peer-checked:border-primary peer-checked:text-primary peer-checked:shadow-[0_0_15px_rgba(232,105,63,0.15)] transition-all">
                          <span className="material-symbols-outlined text-[18px]">
                            {opt === 'public' ? 'public' : opt === 'private' ? 'lock' : 'link'}
                          </span>
                          <span className="font-medium capitalize">{opt}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="font-body text-xs text-text-muted">Public tomes are cataloged immediately in the grand ledger and discoverable by scholars.</p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block font-body text-body-small font-medium text-text-secondary" htmlFor="bookPrice">
                    Acquisition Tokens (0 for complimentary access)
                  </label>
                  <div className="relative max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <span className="text-secondary text-[18px]">🪙</span>
                    </div>
                    <input
                      className="w-full bg-canvas border border-border rounded-lg pl-10 pr-14 py-2.5 font-mono text-body-default text-secondary font-semibold focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                      id="bookPrice"
                      min={0}
                      placeholder="0"
                      step={5}
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <span className="font-mono text-xs text-text-muted">TOKENS</span>
                    </div>
                  </div>
                  <p className="font-body text-xs text-text-secondary">
                    Readers exchange tokens directly from their treasury balance. 85% of royalty is minted to your scribe ledger.
                  </p>
                </div>
              </section>

              <section className="bg-[#1b1513] border border-border rounded-xl p-4 md:p-6 shadow-sm space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full blur-2xl pointer-events-none" />
                <div className="border-b border-border pb-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-overline uppercase text-text-muted tracking-wider">Core Document Deposit · Phase IV</span>
                    <h2 className="font-display text-headline-3 text-text-primary mt-0.5">Digital Manuscript (PDF) <span className="text-primary">*</span></h2>
                  </div>
                  <span className="font-mono text-xs text-text-secondary bg-surface-container px-2.5 py-1 rounded border border-border">Max 25MB</span>
                </div>

                <div className="space-y-4">
                  {pdfFile ? (
                    <div className="bg-surface-container border border-border-hover rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-border flex items-center justify-center shrink-0 text-primary shadow-sm">
                          <span className="material-symbols-outlined text-[26px]">picture_as_pdf</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-body text-body-small font-semibold text-text-primary truncate">{pdfFile.name}</p>
                          <div className="flex items-center flex-wrap gap-2 text-text-muted font-mono text-xs mt-0.5">
                            <span>{(pdfFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                            <span className="inline-flex items-center gap-1 bg-status-success/15 text-status-success px-2 py-0.2 rounded-full font-sans font-medium text-[11px]">
                              <span className="material-symbols-outlined text-[12px]">check_circle</span>
                              Ready to compile
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                        <button className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:border-primary text-text-secondary hover:text-text-primary font-body text-xs transition-colors flex items-center gap-1" onClick={() => pdfInputRef.current?.click()} type="button">
                          <span className="material-symbols-outlined text-[16px]">sync</span>
                          Replace
                        </button>
                        <button className="p-1.5 rounded-lg border border-border bg-surface hover:border-error hover:text-error text-text-muted transition-colors" onClick={() => setPdfFile(null)} title="Remove Manuscript" type="button">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="relative group border-2 border-dashed border-border rounded-xl p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_0_24px_rgba(232,105,63,0.12)] bg-surface-container-lowest text-center flex flex-col items-center justify-center min-h-[160px] cursor-pointer"
                      onClick={() => pdfInputRef.current?.click()}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 via-primary-container/10 to-transparent border border-primary/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <span className="material-symbols-outlined text-primary text-[24px]">picture_as_pdf</span>
                      </div>
                      <p className="font-body text-body-small font-semibold text-text-primary mb-1">Drag & drop PDF manuscript</p>
                      <p className="font-body text-xs text-text-secondary">or <span className="text-primary underline font-medium">browse local files</span></p>
                      <div className="inline-flex items-center gap-2 font-mono text-xs text-text-muted mt-3 border border-border px-2.5 py-1 rounded-full bg-surface">
                        <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
                        <span>PDF up to 25MB</span>
                      </div>
                    </div>
                  )}
                  <input
                    ref={pdfInputRef}
                    accept=".pdf"
                    className="hidden"
                    type="file"
                    onChange={handlePdfChange}
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 rounded-lg bg-surface-container-lowest border border-border border-dashed">
                    <div className="flex items-center gap-2 font-body text-xs text-text-secondary">
                      <span className="material-symbols-outlined text-text-muted text-[18px]">verified_user</span>
                      <span>SHA-256 automated integrity checksum executed upon ledger save.</span>
                    </div>
                    <button className="shrink-0 px-4 py-1.5 rounded-lg border border-border bg-surface-container hover:bg-surface-hover hover:border-primary text-text-primary font-body text-xs font-medium transition-all" onClick={() => pdfInputRef.current?.click()} type="button">
                      Choose PDF Manuscript
                    </button>
                  </div>
                </div>
              </section>

              <section className="p-4 md:p-6 rounded-xl bg-surface border border-border space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <Link className="font-body text-body-small text-text-muted hover:text-text-primary transition-colors text-center sm:text-left py-2" href="/books">
                    Discard &amp; Cancel
                  </Link>
                  <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
                    <button className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-border text-text-primary hover:border-primary hover:text-primary font-body text-body-small font-medium transition-all flex items-center justify-center gap-2 active:scale-95" type="button">
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Save as Draft
                    </button>
                    <button
                      className="w-full sm:w-auto bg-primary-container text-text-on-accent font-body text-body-small font-semibold px-8 py-2.5 rounded-lg hover:bg-primary-hover transition-all duration-200 shadow-[0_0_24px_rgba(232,105,63,0.25)] flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-text-on-accent" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Publishing...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
                          Publish Book
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="pt-1 border-t border-border flex items-center gap-2">
                  <span className="material-symbols-outlined text-text-muted text-[16px] shrink-0">policy</span>
                  <p className="font-body text-xs text-text-muted">
                    By submitting, you affirm this work complies with the Genu Library Archival Codex · All records are registered indelibly.
                  </p>
                </div>
              </section>
            </main>
          </form>
        </div>
      </div>
    </main>
  );
}
