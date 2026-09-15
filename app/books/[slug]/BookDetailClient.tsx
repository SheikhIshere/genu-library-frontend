'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { books, mediaUrl } from '@/lib/api';

const PdfViewer = dynamic(() => import('./PdfViewer'), { ssr: false });

interface BookDetailClientProps {
  book: Record<string, unknown>;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
  votes: number;
  role: string;
}

const STAR_LABELS = [
  'Incomplete / Requires Scholarly Revisions',
  'Elementary Exposition with Discrepancies',
  'Rigorous Dialectic with Solid Citations',
  'Distinguished Contribution to Guild Canon',
  'Masterwork of Classical Logic & Sacred Geometry',
];

export default function BookDetailClient({ book }: BookDetailClientProps) {
  const title = (book.title as string) || 'Untitled';
  const author = (book.author as string) || 'Unknown';
  const coverPage = (book.cover_page as string) || null;
  const price = (book.price as number) || 0;
  const avgRating = (book.average_rating as number) || 0;
  const favCount = (book.total_favorites as number) || 0;
  const description = (book.description as string) || '';
  const tags = Array.isArray(book.tag)
    ? (book.tag as Array<{name: string}>).map(t => t.name)
    : [];
  const uploader = (book.uploader && typeof book.uploader === 'object'
    ? (book.uploader as {username: string}).username
    : (book.uploader as string)) || 'Archivist';
  const isPublic = book.is_public !== false;
  const pdfUrl = (book.book_file as string) || null;

  const [isFavorited, setIsFavorited] = useState(false);
  const [favNum, setFavNum] = useState(favCount);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'Eldrin of Canterbury',
      text: "Sterling's treatment of the Pythagorean tetractys on page 82 directly clarifies why early scholastic architects considered structural cathedrals to be acoustic resonators of the divine intellect. Pay particular attention to the marginal notes regarding the fifth harmonic ratio.",
      time: '2 hours ago',
      votes: 42,
      role: 'Hierophant',
    },
    {
      id: 2,
      author: 'Magister Vance',
      text: 'We cross-checked the Latin transcriptions in this scan against our physical 1540 Venetian print. The resolution captures even the faintest quill rubrics in the outer margins. Commendations to Archivist Thorne for this immaculate digitization.',
      time: 'Yesterday',
      votes: 19,
      role: 'Senior Archivist',
    },
    {
      id: 3,
      author: 'Scholar Julian',
      text: 'Are there companion audio lectures available in the Auditory Codex wing for this treatise? The geometric diagrams are stunning, but listening to the dialectical commentary while reading would be an unmatched study ritual.',
      time: '3 days ago',
      votes: 7,
      role: 'Fellow',
    },
  ]);
  const [showExtended, setShowExtended] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);

  const handleFavorite = useCallback(async () => {
    setIsFavorited((f) => !f);
    setFavNum((n) => (isFavorited ? n - 1 : n + 1));
    try {
      await books.favorite((book.slug as string) || '');
    } catch {}
  }, [isFavorited, book.slug]);

  const handleRate = useCallback(
    async (rating: number) => {
      setUserRating(rating);
      try {
        await books.rate((book.slug as string) || '', rating);
      } catch {}
    },
    [book.slug]
  );

  const handleComment = useCallback(async () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      author: 'Guest Scholar',
      text: commentText.trim(),
      time: 'Just now',
      votes: 0,
      role: 'Live Seal',
    };
    setComments((c) => [newComment, ...c]);
    setCommentText('');
    try {
      await books.comment((book.slug as string) || '', { comment: newComment.text });
    } catch {}
  }, [commentText, book.slug]);

  const scrollToReader = useCallback(() => {
    readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const displayRating = hoverRating || userRating;

  return (
    <main className="w-full min-h-screen">
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-primary-container/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-96 -left-32 w-80 h-80 bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-body-small text-sm text-text-muted">
            <Link className="hover:text-primary transition-colors flex items-center gap-1.5" href="/">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </Link>
            <span className="text-text-muted/50 font-mono text-xs">/</span>
            <Link className="hover:text-primary transition-colors" href="/books">
              Books Catalog
            </Link>
            <span className="text-text-muted/50 font-mono text-xs">/</span>
            <span className="text-text-primary font-medium truncate max-w-xs md:max-w-md">{title}</span>
          </nav>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[420px] group">
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary-container/20 via-secondary/15 to-transparent rounded-2xl blur-lg group-hover:opacity-100 opacity-60 transition-opacity duration-500" />
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-surface-container shadow-2xl shadow-canvas/90 flex flex-col justify-between p-6">
                  <img
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    src={mediaUrl(coverPage)}
                    alt={title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                      {tags[0] || 'Folio'}
                    </span>
                    {isPublic && (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-status-success/20 border-0 backdrop-blur-md font-body-small text-xs text-status-success font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                        Public Edition
                      </span>
                    )}
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-canvas/60 via-canvas/20 to-transparent pointer-events-none" />
                  <div className="relative z-10 space-y-1">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-secondary">Sanctum Vault Index</div>
                    <div className="font-mono text-sm text-text-primary">MSS-ARK-108.IV</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 w-full">
                  <div className="bg-surface-container-low rounded-lg p-2.5 text-center shadow-sm">
                    <span className="block font-mono text-[10px] text-text-muted uppercase">Vellum</span>
                    <span className="font-mono text-sm font-medium text-text-primary">342 Folios</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-2.5 text-center shadow-sm">
                    <span className="block font-mono text-[10px] text-text-muted uppercase">Weight</span>
                    <span className="font-mono text-sm font-medium text-text-primary">48.2 MB</span>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-2.5 text-center shadow-sm">
                    <span className="block font-mono text-[10px] text-text-muted uppercase">Cipher</span>
                    <span className="font-mono text-sm font-medium text-secondary">SHA-256</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary font-mono text-xs font-semibold tracking-wider">
                  PUBLIC SANCTUM
                </span>
                {tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-surface-container-low text-text-secondary font-mono text-xs">
                    {tag}
                  </span>
                ))}
                <span className="px-3 py-1 rounded-full bg-surface-container-low text-text-muted font-body-small text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Archivist Verified
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-headline-1 lg:text-4xl text-text-primary font-bold tracking-tight">
                  {title}
                </h1>
                <p className="font-body text-base text-text-secondary">
                  By{' '}
                  <span className="text-primary underline underline-offset-4 decoration-primary/40 font-medium">{author}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center font-display text-lg text-secondary font-bold shadow-inner">
                      {uploader.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-text-on-accent" title="Guild Master Seal">
                      <span className="material-symbols-outlined text-[10px] font-bold">military_tech</span>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-body text-sm font-semibold text-text-primary">{uploader}</span>
                      <span className="px-2 py-0.5 rounded bg-primary-container/20 text-primary font-mono text-[10px] font-semibold">Guild Master</span>
                    </div>
                    <span className="font-body-small text-xs text-text-muted block">Uploaded 3 months ago</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-lg shadow-inner">
                  <span className="text-secondary text-lg">🪙</span>
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-bold text-secondary tracking-wider">
                      {price === 0 ? 'FREE' : `${price} TOKENS`}
                    </span>
                    <span className="font-mono text-[10px] text-text-muted">Preservation Bounty</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-primary-container hover:bg-primary-hover text-text-on-accent font-body text-sm font-semibold shadow-lg shadow-primary-container/20 transition-all duration-200 transform active:scale-[0.98] group"
                  onClick={scrollToReader}
                >
                  <span className="material-symbols-outlined text-[20px] group-hover:rotate-6 transition-transform">auto_stories</span>
                  <span>Read Codex / PDF</span>
                </button>
                <button
                  aria-label="Toggle Favorite"
                  className="flex items-center gap-2 px-4 py-3.5 rounded-lg bg-surface-container hover:bg-surface-hover text-text-primary transition-all duration-200 shadow-sm group active:scale-95"
                  onClick={handleFavorite}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] transition-colors ${isFavorited ? 'text-primary' : 'text-text-muted group-hover:text-primary'}`}
                    style={isFavorited ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    favorite
                  </span>
                  <span className={`font-mono text-sm font-medium transition-colors ${isFavorited ? 'text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                    {favNum.toLocaleString()}
                  </span>
                </button>
                <button
                  className="flex items-center gap-1.5 px-4 py-3.5 rounded-lg bg-surface-container hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-all duration-200 shadow-sm"
                  onClick={() => navigator.clipboard?.writeText(window.location.href)}
                  title="Copy Manuscript Citation Link"
                >
                  <span className="material-symbols-outlined text-[20px]">share</span>
                  <span className="font-body-small text-sm font-medium hidden sm:inline">Share</span>
                </button>
              </div>

              <div className="bg-surface-container-lowest/60 rounded-xl p-4 flex items-start gap-3.5 shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">workspace_premium</span>
                <div className="space-y-1">
                  <h2 className="font-body-small text-sm font-semibold text-text-primary">Sovereign Vault Guarantee</h2>
                  <p className="font-body-small text-xs text-text-secondary leading-relaxed">
                    Bound with zero-loss cryptographic timestamps. Certified by the Genu Library Epistemological Council for cross-referencing logic theorems and classical architectural ratios.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {pdfUrl && (
            <section ref={readerRef} className="scroll-mt-24 space-y-4" id="pdf-reader-anchor">
              <PdfViewer url={mediaUrl(pdfUrl)} />
            </section>
          )}

          {description && (
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-6">
                <div className="space-y-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">Treatise Overview</span>
                  <h2 className="font-display text-headline-2 text-text-primary">The Dialectical Structure of Classical Reason</h2>
                </div>
                <div className="space-y-4 font-body text-base text-text-secondary leading-relaxed">
                  <p className="font-body text-lg text-text-primary font-light leading-relaxed">{description}</p>
                  {showExtended && (
                    <div className="space-y-4 pt-2">
                      <p>Drawing heavily from the recovered fragments of the Neoplatonist Academy, each categorical syllogism possesses both dynamic weight and static equilibrium.</p>
                      <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
                        <span className="font-mono text-xs uppercase text-secondary font-semibold">Topics &amp; Themes Explored:</span>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {tags.map((t) => (
                            <span key={t} className="px-3 py-1 rounded-full bg-surface-container text-text-primary font-body-small text-xs">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className="flex items-center gap-1.5 text-primary hover:text-primary-hover font-body text-sm font-semibold pt-1 transition-colors"
                  onClick={() => setShowExtended((s) => !s)}
                >
                  <span>{showExtended ? 'Collapse treatise commentary' : 'Read full treatise commentary'}</span>
                  <span className="material-symbols-outlined text-[18px]">{showExtended ? 'expand_less' : 'expand_more'}</span>
                </button>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div className="p-6 rounded-2xl bg-surface-container-low shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-headline-3 text-text-primary">Folio Metadata</h3>
                    <span className="material-symbols-outlined text-text-muted">receipt_long</span>
                  </div>
                  <div className="space-y-3.5">
                    {[
                      ['Language', 'Latin & Classical English'],
                      ['Codex Identifier', 'ISBN-892-0-9118'],
                      ['Licensing', 'Guild Open Access (v4)'],
                      ['Digitized Medium', '1200 DPI Master Folio'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between py-1.5">
                        <span className="font-body-small text-sm text-text-muted">{label}</span>
                        <span className="font-body-small text-sm text-text-primary font-medium">{value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-1.5">
                      <span className="font-body-small text-sm text-text-muted">Preservation Tier</span>
                      <span className="px-2.5 py-0.5 rounded bg-status-success/20 text-status-success font-mono text-[10px] font-semibold">Tier 1 · Immutable</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="p-8 rounded-2xl bg-surface-container-low shadow-md space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">Peer Consensus</span>
                <h2 className="font-display text-headline-2 text-text-primary">Scholarly Appraisal &amp; Review</h2>
              </div>
              <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg text-text-secondary font-body-small text-xs">
                <span className="material-symbols-outlined text-secondary text-[16px]">balance</span>
                <span>Weighted Guild Evaluation System</span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 flex flex-col items-center sm:items-start space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-display-xl text-text-primary font-bold">{avgRating.toFixed(1)}</span>
                  <span className="font-display text-headline-3 text-text-muted font-normal">/ 5.0</span>
                </div>
                <div className="flex items-center gap-1.5 text-secondary">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className="material-symbols-outlined text-[26px]"
                      style={s <= Math.round(avgRating) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      {s === Math.round(avgRating) && avgRating % 1 >= 0.5 ? 'star_half' : 'star'}
                    </span>
                  ))}
                </div>
                <div className="pt-3 w-full bg-surface-container p-4 rounded-xl space-y-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-text-muted block">Register Your Appraisal</span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        aria-label={`Rate ${s} Stars`}
                        className={`transition-colors ${s <= displayRating ? 'text-secondary' : 'text-text-muted hover:text-secondary'}`}
                        type="button"
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRate(s)}
                      >
                        <span
                          className="material-symbols-outlined text-[28px]"
                          style={s <= displayRating ? { fontVariationSettings: "'FILL' 1" } : undefined}
                        >
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="font-body-small text-xs text-text-muted block transition-all">
                    {displayRating > 0
                      ? hoverRating
                        ? STAR_LABELS[hoverRating - 1]
                        : `Your Registered Appraisal: ${userRating} Star${userRating > 1 ? 's' : ''} — ${STAR_LABELS[userRating - 1]}`
                      : 'Click a star above to register your appraisal seal.'}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-3">
                {[
                  { label: '5 Stars', width: '88%', color: 'bg-primary-container' },
                  { label: '4 Stars', width: '9%', color: 'bg-secondary' },
                  { label: '3 Stars', width: '2%', color: 'bg-surface-bright' },
                  { label: '2 Stars', width: '1%', color: 'bg-surface-bright' },
                  { label: '1 Star', width: '0%', color: 'bg-surface-bright' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="w-12 font-mono text-xs text-text-secondary text-right">{row.label}</span>
                    <div className="flex-1 h-3 rounded-full bg-surface-container overflow-hidden">
                      <div className={`h-full ${row.color} rounded-full`} style={{ width: row.width }} />
                    </div>
                    <span className="w-12 font-mono text-xs text-text-primary font-medium text-right">{row.width}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[24px]">forum</span>
                <h2 className="font-display text-headline-2 text-text-primary">
                  Scholarly Annotations &amp; Discussions{' '}
                  <span className="text-text-muted text-headline-3">({comments.length})</span>
                </h2>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-surface-container-low shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center font-bold text-text-on-accent text-sm">GS</div>
                  <span className="font-body text-sm font-semibold text-text-primary">Guest Scholar Station</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container text-text-muted font-mono text-[10px]">Unsealed Identity</span>
                </div>
                <span className="font-mono text-[10px] text-text-muted">{commentText.length} / 1000</span>
              </div>
              <textarea
                className="w-full bg-surface-dim text-text-primary placeholder:text-text-muted rounded-xl p-4 font-body text-sm focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-y min-h-[100px]"
                maxLength={1000}
                placeholder="Engrave your thoughts, critique or marginalia regarding folio dialectics..."
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === 'Enter') handleComment();
                }}
              />
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-3 text-text-muted font-body-small text-xs">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">code</span> Markdown supported
                  </span>
                </div>
                <button
                  className="px-5 py-2.5 rounded-lg bg-primary text-text-on-accent font-body text-sm font-semibold hover:bg-primary-hover transition-all flex items-center gap-2 shadow-sm active:scale-98"
                  onClick={handleComment}
                >
                  <span className="material-symbols-outlined text-[18px]">publish</span>
                  <span>Publish Annotation</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="p-6 rounded-2xl bg-surface-container-low shadow-sm space-y-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-display text-lg text-secondary font-bold">
                        {c.author.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-body text-sm font-semibold text-text-primary">{c.author}</span>
                          <span className="px-2 py-0.5 rounded bg-secondary/15 text-secondary font-mono text-[10px] font-semibold">{c.role}</span>
                        </div>
                        <span className="font-body-small text-xs text-text-muted">{c.time}</span>
                      </div>
                    </div>
                    <button className="text-text-muted hover:text-text-primary p-1">
                      <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                    </button>
                  </div>
                  <p className="font-body text-sm text-text-secondary leading-relaxed">{c.text}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 bg-surface-container rounded-lg p-1">
                      <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-surface-active text-text-secondary hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                        <span className="font-mono text-xs font-semibold">{c.votes}</span>
                      </button>
                      <div className="w-px h-3 bg-surface-container-high" />
                      <button className="px-2 py-1 rounded hover:bg-surface-active text-text-muted hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                      </button>
                    </div>
                    <button className="flex items-center gap-1 font-body-small text-xs text-text-muted hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[16px]">reply</span>
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">Curated Kinship</span>
                <h2 className="font-display text-headline-2 text-text-primary">Sanctum Recommends: You Might Also Like</h2>
              </div>
              <Link className="flex items-center gap-1 text-primary hover:text-primary-hover font-body text-sm font-semibold transition-colors" href="/books">
                <span>Browse Category</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {['Foundational Metallurgy', 'Lexicon of Antiquity', 'Hermetic Geometry', 'Chronicles of the Iron Foundry'].map(
                (relTitle, i) => (
                  <div key={relTitle} className="group flex flex-col rounded-xl bg-surface-container-low overflow-hidden hover:-translate-y-1.5 transition-all duration-300 shadow-md">
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-container">
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[44px] text-primary/40">
                          {['hardware', 'menu_book', 'architecture', 'factory'][i]}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h3 className="font-display text-headline-3 text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                          {relTitle}
                        </h3>
                        <p className="font-body-small text-xs text-text-muted">Guild Archivist</p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1 text-secondary text-xs">
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="font-mono text-xs text-text-primary font-medium">{(4.7 + i * 0.1).toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-sm font-semibold text-secondary">
                          <span>🪙</span>
                          <span>{[280, 420, 510, 190][i]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
