'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { books, mediaUrl } from '@/lib/api';

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  const [price, setPrice] = useState(0);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [initialState, setInitialState] = useState({
    title: '',
    author: '',
    description: '',
    tags: [] as string[],
    visibility: 'public' as 'public' | 'private' | 'unlisted',
    price: 0,
    coverSrc: '',
  });

  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!slug) return;
    books.detail(slug).then((data) => {
      const t = (data.title as string) || '';
      const a = (data.author as string) || '';
      const d = (data.description as string) || '';
      const tg = Array.isArray(data.tag) ? (data.tag as string[]) : [];
      const p = (data.price as number) || 0;
      const cp = (data.cover_page as string) || null;
      const pdf = (data.pdf_file as string) || '';
      const vis = data.is_public !== false ? 'public' : 'private';

      setTitle(t);
      setAuthor(a);
      setDescription(d);
      setTags(tg);
      setPrice(p);
      setVisibility(vis);
      setCoverPreview(cp ? mediaUrl(cp) : null);
      setPdfFileName(pdf ? pdf.split('/').pop() || '' : '');

      setInitialState({
        title: t,
        author: a,
        description: d,
        tags: [...tg],
        visibility: vis,
        price: p,
        coverSrc: cp ? mediaUrl(cp) : '',
      });
      setIsLoading(false);
    }).catch(() => {
      router.push('/books');
    });
  }, [slug, router]);

  const isDirty = title !== initialState.title ||
    author !== initialState.author ||
    description !== initialState.description ||
    JSON.stringify(tags) !== JSON.stringify(initialState.tags) ||
    visibility !== initialState.visibility ||
    price !== initialState.price ||
    coverFile !== null;

  const handleCoverChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setCoverPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
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

  const addTag = useCallback((tag: string) => {
    if (!tags.includes(tag)) setTags((prev) => [...prev, tag]);
  }, [tags]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('author', author.trim());
    formData.append('description', description.trim());
    formData.append('tag', JSON.stringify(tags));
    formData.append('is_public', String(visibility === 'public'));
    formData.append('price', String(price));
    if (coverFile) formData.append('cover_page', coverFile);

    try {
      const res = await books.update(slug, formData);
      if (res.ok) {
        router.push(`/books/${slug}`);
      } else {
        setIsSubmitting(false);
      }
    } catch {
      setIsSubmitting(false);
    }
  }, [title, author, description, tags, visibility, price, coverFile, slug, router]);

  if (isLoading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </main>
    );
  }

  const visDescriptions: Record<string, string> = {
    public: 'Discoverable in catalog search, curated shelves, guild recommendations, and public reading chambers.',
    private: 'Restricted exclusively to your personal archive. Invisible in public catalog searches.',
    unlisted: 'Accessible solely to acolytes possessing the direct cryptographic folio key.',
  };

  const visLabels: Record<string, string> = {
    public: 'Public Circulation',
    private: 'Private Sanctum',
    unlisted: 'Direct Folio Link',
  };

  return (
    <main className="w-full min-h-screen">
      <div className="relative w-full max-w-6xl mx-auto px-4 py-8">
        <div className="absolute -top-12 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col gap-6 mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-overline text-text-muted">
            <Link className="hover:text-text-primary transition-colors flex items-center gap-1" href="/">
              <span className="material-symbols-outlined text-[15px]">cottage</span>
              <span>Home</span>
            </Link>
            <span className="material-symbols-outlined text-[14px] text-border">chevron_right</span>
            <Link className="hover:text-text-primary transition-colors flex items-center gap-1" href="/books">
              <span className="material-symbols-outlined text-[15px]">menu_book</span>
              <span>Books</span>
            </Link>
            <span className="material-symbols-outlined text-[14px] text-border">chevron_right</span>
            <span className="text-text-secondary truncate max-w-[200px] sm:max-w-none">{title}</span>
            <span className="material-symbols-outlined text-[14px] text-border">chevron_right</span>
            <span className="text-primary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
              Edit Folio
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-overline text-overline uppercase tracking-widest text-primary font-semibold bg-surface-container px-2.5 py-1 rounded border border-border">Guild Archive Record</span>
              </div>
              <h1 className="font-display text-headline-1 text-text-primary tracking-tight">Edit Book Folio</h1>
              <p className="font-body text-body-small text-text-secondary">
                Editing canonical metadata and sanctum distribution parameters for <span className="text-text-primary italic font-display">{title}</span>.
              </p>
            </div>
            <div className="flex items-center flex-wrap gap-3 shrink-0">
              <Link className="border border-border text-text-primary hover:border-primary px-4 py-2 rounded-lg font-body text-body-small font-medium transition-colors" href={`/books/${slug}/delete`}>
                Delete Folio
              </Link>
              <Link className="border border-border text-text-primary hover:border-primary px-4 py-2 rounded-lg font-body text-body-small font-medium transition-colors" href={`/books/${slug}`}>
                Cancel
              </Link>
              <button
                className="bg-primary-container text-text-on-accent font-body text-body-small font-semibold px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-hover active:scale-[0.98] transition-all shadow-[0_0_24px_rgba(234,106,64,0.22)] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isDirty || isSubmitting}
                onClick={handleSubmit}
                type="button"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-text-on-accent" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Preserving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">bookmark_check</span>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="font-overline text-overline uppercase tracking-widest text-text-secondary font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[15px]">auto_stories</span>
                  Book Cover Artwork
                </span>
              </div>

              <div
                className="relative group cursor-pointer aspect-[3/4] w-full rounded-lg overflow-hidden border border-border bg-surface-container-lowest flex items-center justify-center"
                onClick={() => coverInputRef.current?.click()}
              >
                {coverPreview ? (
                  <img
                    alt={`${title} cover`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    src={coverPreview}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <span className="material-symbols-outlined text-primary text-[48px]">add_photo_alternate</span>
                    <p className="font-body text-sm text-text-secondary mt-2">Click to upload cover</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-surface border border-primary text-primary flex items-center justify-center shadow-[0_0_20px_rgba(234,106,64,0.3)] group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[24px]">photo_camera</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-body text-body-small font-semibold text-text-primary">Change Cover Artwork</p>
                    <p className="font-body text-caption text-text-secondary max-w-[200px]">Click to inspect local archive (PNG, JPG, WEBP up to 5MB)</p>
                  </div>
                  <span className="inline-flex items-center gap-1 font-mono text-overline text-primary bg-surface-container border border-primary/40 px-2 py-1 rounded mt-1">
                    <span className="material-symbols-outlined text-[12px]">upload_file</span> Replace Plate
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

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-caption font-mono text-text-muted">
                <span className="truncate max-w-[180px]">{coverFile?.name || 'Current cover'}</span>
                <span className="text-text-secondary">{coverFile ? `${(coverFile.size / (1024 * 1024)).toFixed(1)} MB` : ''}</span>
              </div>

              <div className="mt-4 bg-canvas/90 p-3.5 rounded-lg border border-border/70 flex items-start gap-3 text-caption text-text-secondary">
                <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">verified</span>
                <p className="font-body text-caption leading-relaxed">
                  Book cover alterations synchronize across the Sovereign Reader and Guild Index instantly upon commit.
                </p>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-overline text-overline uppercase tracking-wider text-text-muted">Digital Custody Record</span>
                <span className="font-mono text-overline text-status-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success" /> Sealed
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-caption">
                <div className="bg-canvas p-2.5 rounded border border-border">
                  <span className="font-body text-caption text-text-muted block">First Cataloged</span>
                  <span className="font-mono text-body-small text-text-primary">14 Oct 2024</span>
                </div>
                <div className="bg-canvas p-2.5 rounded border border-border">
                  <span className="font-body text-caption text-text-muted block">Ledger Revision</span>
                  <span className="font-mono text-body-small text-text-primary">#REV-049</span>
                </div>
                <div className="bg-canvas p-2.5 rounded border border-border col-span-2">
                  <span className="font-body text-caption text-text-muted block">Cryptographic Hash</span>
                  <span className="font-mono text-overline text-text-secondary truncate block">SHA256: 8f42e...d99a14bc08e</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <form className="bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6 shadow-sm" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="flex items-center justify-between font-body text-body-small font-medium text-text-primary" htmlFor="book-title">
                  <span>Book Title <span className="text-primary">*</span></span>
                  <span className="font-overline text-overline text-text-muted font-normal">Primary Catalog Index</span>
                </label>
                <input
                  className="w-full bg-canvas border border-border rounded-lg px-4 py-3 font-display text-headline-3 text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-text-muted"
                  id="book-title"
                  name="title"
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block font-body text-body-small font-medium text-text-primary" htmlFor="book-author">
                    Primary Author / Transcriber <span className="text-primary">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined text-text-muted text-[18px] absolute left-3 pointer-events-none">history_edu</span>
                    <input
                      className="w-full bg-canvas border border-border rounded-lg pl-9 pr-4 py-2.5 font-body text-body-small text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                      id="book-author"
                      name="author"
                      required
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between font-body text-body-small font-medium text-text-primary">
                  <label htmlFor="book-description">Description &amp; Codex Abstract</label>
                  <span className="font-mono text-overline text-text-muted">{description.length} / 1000 characters</span>
                </div>
                <textarea
                  className="w-full bg-canvas border border-border rounded-lg p-4 font-body text-body-small text-text-primary leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-y"
                  id="book-description"
                  maxLength={1000}
                  name="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-body text-body-small font-medium text-text-primary">Categorical Tags</label>
                  <span className="font-overline text-overline text-text-muted uppercase">Shelving &amp; Ontology</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 bg-canvas border border-border rounded-full px-3 py-1.5 text-caption font-body text-text-primary transition-colors hover:border-primary group">
                      <span>{tag}</span>
                      <button className="text-text-muted hover:text-primary leading-none transition-colors" onClick={() => removeTag(tag)} type="button">
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined text-text-muted text-[18px] absolute left-3 pointer-events-none">label</span>
                  <input
                    className="w-full bg-canvas border border-border rounded-lg pl-9 pr-24 py-2 font-body text-body-small text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-text-muted"
                    id="tag-input"
                    onKeyDown={handleTagKeydown}
                    placeholder="+ Add tag (press Enter or comma)..."
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                  <button
                    className="absolute right-2 font-mono text-overline text-primary hover:text-primary-hover px-2 py-1 rounded bg-surface-container border border-border hover:border-primary transition-colors"
                    onClick={() => {
                      const val = tagInput.trim().replace(/^,+|,+$/g, '');
                      if (val.length > 0 && !tags.includes(val)) {
                        setTags((prev) => [...prev, val]);
                        setTagInput('');
                      }
                    }}
                    type="button"
                  >
                    + Append
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-body text-body-small font-medium text-text-primary">Catalog Visibility</label>
                  <span className="font-mono text-overline text-primary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {visLabels[visibility]}
                  </span>
                </div>
                <div className="bg-canvas p-1.5 rounded-lg border border-border grid grid-cols-3 gap-1">
                  {(['public', 'private', 'unlisted'] as const).map((opt) => (
                    <button
                      key={opt}
                      className={`font-body text-caption font-medium py-2 px-3 rounded-md flex items-center justify-center gap-2 transition-all ${
                        visibility === opt
                          ? 'bg-surface border border-primary text-primary font-semibold shadow-[0_0_15px_rgba(234,106,64,0.12)]'
                          : 'text-text-secondary hover:text-text-primary border border-transparent'
                      }`}
                      onClick={() => setVisibility(opt)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {opt === 'public' ? 'public' : opt === 'private' ? 'lock' : 'link'}
                      </span>
                      <span className="capitalize">{opt}</span>
                    </button>
                  ))}
                </div>
                <p className="font-body text-caption text-text-muted leading-relaxed">
                  <strong className="text-text-secondary capitalize">{visibility}:</strong> {visDescriptions[visibility]}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-body text-body-small font-medium text-text-primary" htmlFor="book-price">
                    Access Price (Guild Tokens)
                  </label>
                  <span className="font-body text-caption text-text-secondary">Archivist royalty split: 85%</span>
                </div>
                <div className="relative flex items-center max-w-xs">
                  <span className="absolute left-3.5 text-secondary text-[18px]">🪙</span>
                  <input
                    className="w-full bg-canvas border border-border rounded-lg pl-10 pr-4 py-2.5 font-mono text-headline-3 font-bold text-text-primary focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    id="book-price"
                    min={0}
                    name="price"
                    step={10}
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                  <span className="font-mono text-overline text-text-muted absolute right-3">TOKENS</span>
                </div>
              </div>

              <div className="bg-canvas border border-border/80 rounded-lg p-4 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center border border-border shrink-0 text-primary">
                  <span className="material-symbols-outlined text-[20px]">enhanced_encryption</span>
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-body text-body-small font-medium text-text-primary">Attached Manuscript:</span>
                    <code className="font-mono text-overline bg-surface-container border border-border px-2 py-0.5 rounded text-primary">{pdfFileName || 'None'}</code>
                  </div>
                  <p className="font-body text-caption text-text-muted leading-relaxed">
                    PDF treatises are permanently etched upon initial publication to guarantee scholarly provenance. In accordance with the Sovereign Guild Concordat, original manuscript files cannot be altered during metadata edits.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-border flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4">
                <Link className="text-status-error hover:bg-status-error/10 border border-status-error/30 hover:border-status-error px-4 py-2.5 rounded-lg text-body-small font-body font-medium flex items-center justify-center gap-2 transition-all duration-200" href={`/books/${slug}/delete`}>
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  <span>Delete Book</span>
                </Link>
                <div className="flex items-center gap-3 justify-end">
                  <Link className="border border-border hover:border-primary text-text-primary font-body text-body-small font-medium px-4 py-2.5 rounded-lg transition-colors text-center" href={`/books/${slug}`}>
                    Cancel
                  </Link>
                  <button
                    className="bg-primary-container text-text-on-accent font-body text-body-small font-semibold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-hover active:scale-[0.98] transition-all shadow-[0_0_24px_rgba(234,106,64,0.22)] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isDirty || isSubmitting}
                    onClick={handleSubmit}
                    type="button"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-text-on-accent" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Preserving...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
