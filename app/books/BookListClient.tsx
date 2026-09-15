'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { books, mediaUrl } from '@/lib/api';

interface BookItem {
  slug: string;
  title: string;
  author: string;
  cover_page: string | null;
  price: number;
  average_rating: number;
  total_favorites: number;
  tag: string[];
  uploader?: string;
}

interface BookListClientProps {
  books: BookItem[];
  totalCount: number;
}

const TAGS = [
  'Sacred Math',
  'Alchemy & Art',
  'Craftsmanship',
  'Astronomy',
  'Metallurgy',
  'Linguistics',
  'Printmaking',
  'Ancient History',
  'Typography',
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Additions' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price Low–High' },
];

const ITEMS_PER_PAGE = 12;

function StarRating({ rating, count }: { rating: number; count?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <span className="material-symbols-outlined text-secondary text-[16px]">star</span>
      <span className="font-mono text-xs text-text-primary font-medium">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-xs text-text-muted">({count})</span>
      )}
    </div>
  );
}

function PriceBadge({ price }: { price: number }) {
  if (price === 0) {
    return (
      <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-lg border border-border">
        <span className="text-status-success font-mono text-xs font-bold">Free</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-lg border border-border">
      <span className="text-[13px]">🪙</span>
      <span className="font-mono text-xs text-secondary font-bold">{price}</span>
    </div>
  );
}

function BookCard({ book }: { book: BookItem }) {
  const [isFav, setIsFav] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleFavorite = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    setIsFav((f) => !f);
    try {
      await books.favorite(book.slug);
    } catch {}
    setTimeout(() => setAnimating(false), 300);
  }, [book.slug]);

  return (
    <Link href={`/books/${book.slug}`}>
      <article className="group relative bg-surface border border-border hover:border-primary rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(232,105,63,0.12)]">
        <div className="relative h-64 overflow-hidden bg-surface-container">
          <img
            alt={book.title}
            src={mediaUrl(book.cover_page)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/40 pointer-events-none" />
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-full bg-canvas/80 backdrop-blur-md border border-border text-primary font-mono text-[11px] tracking-wide uppercase font-semibold">
              {book.tag[0] || 'Book'}
            </span>
          </div>
          <button
            aria-label="Add to Sanctum Registry"
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-canvas/80 backdrop-blur-md border border-border text-text-muted hover:text-primary hover:border-primary/60 flex items-center justify-center transition-all duration-200"
            type="button"
            onClick={handleFavorite}
          >
            <span
              className={`material-symbols-outlined text-[18px] ${animating ? 'heart-pop-anim' : ''}`}
              style={isFav ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              favorite
            </span>
          </button>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-text-secondary">
            <span className="bg-surface/90 backdrop-blur-sm px-2 py-0.5 rounded border border-border">
              {book.uploader || 'Guild Archive'}
            </span>
            <span className="bg-surface/90 backdrop-blur-sm px-2 py-0.5 rounded border border-border">
              {book.tag[0] || 'Folio'}
            </span>
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="font-display text-xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
              {book.title}
            </h3>
            <p className="font-body-small text-xs text-text-secondary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-text-muted">school</span>
              {book.author}
            </p>
          </div>
          <div className="pt-3 border-t border-border/70 flex items-center justify-between">
            <StarRating rating={book.average_rating} />
            <PriceBadge price={book.price} />
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BookListClient({ books: initialBooks, totalCount }: BookListClientProps) {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...initialBooks];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.tag.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeTag !== 'all') {
      result = result.filter((b) => b.tag.some((t) => t === activeTag));
    }

    switch (sortBy) {
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popular':
        result.sort((a, b) => b.total_favorites - a.total_favorites);
        break;
      case 'rating':
        result.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      default:
        break;
    }

    return result;
  }, [initialBooks, search, activeTag, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setCurrentPage(1);
  }, []);

  const handleTag = useCallback((tag: string) => {
    setActiveTag(tag);
    setCurrentPage(1);
  }, []);

  return (
    <main className="w-full min-h-screen">
      <div className="relative w-full overflow-hidden pt-8 pb-6 px-6 lg:px-8 border-b border-border/40">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-8 right-12 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-2 font-body-small text-xs">
            <Link className="text-text-muted hover:text-primary transition-colors flex items-center gap-1" href="/">
              <span className="material-symbols-outlined text-[15px]">home</span>
              <span>Home</span>
            </Link>
            <span className="text-border font-mono">&gt;</span>
            <span className="text-primary font-medium">Books</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-primary/40 text-primary font-mono text-xs uppercase tracking-wider shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {totalCount.toLocaleString()} Treatises Preserved
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-text-primary">
                Book Collection
              </h1>
              <p className="font-body text-base text-text-secondary max-w-2xl leading-relaxed">
                Explore ancient treatises, technical guild manuscripts, illuminated star charts, and handwritten codices safeguarded across eight centuries of craft.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto shrink-0">
              <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-border">
                <span className="text-[15px]">🪙</span>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Guild Vault</span>
                  <span className="font-mono text-xs font-semibold text-secondary">142,800 Total Reserve</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-border">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Curator Seal</span>
                  <span className="font-mono text-xs font-semibold text-text-primary">Class IX Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="sticky top-16 z-40 bg-canvas/95 backdrop-blur-md border-b border-border py-3.5 px-6 lg:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 md:max-w-md">
              <div className="flex items-center bg-surface border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 rounded-lg px-3 py-2 transition-all">
                <span className="material-symbols-outlined text-text-muted text-[19px] mr-2 shrink-0">search</span>
                <input
                  className="w-full bg-transparent border-none outline-none font-body-small text-sm text-text-primary placeholder:text-text-muted focus:ring-0"
                  placeholder="Search by title, author, topic, or seal..."
                  type="text"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="text-text-muted hover:text-text-primary p-0.5 transition-colors"
                    title="Clear search"
                    type="button"
                    onClick={() => handleSearch('')}
                  >
                    <span className="material-symbols-outlined text-[17px]">close</span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 justify-between md:justify-end">
              <div className="flex items-center bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm">
                <span className="material-symbols-outlined text-text-muted text-[17px] mr-1.5">swap_vert</span>
                <span className="text-text-muted text-xs mr-2">Sort:</span>
                <select
                  className="bg-transparent border-none outline-none font-body-small text-xs sm:text-sm text-text-primary cursor-pointer font-medium pr-6 focus:ring-0"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} className="bg-surface text-text-primary" value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface border border-border text-text-muted hover:text-primary hover:border-primary/50 transition-colors text-xs shrink-0"
                title="Reset Filters"
                type="button"
                onClick={() => {
                  handleSearch('');
                  setActiveTag('all');
                  setSortBy('newest');
                }}
              >
                <span className="material-symbols-outlined text-[17px]">filter_alt_off</span>
                <span className="hidden sm:inline font-medium">Reset Filters</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
            <button
              className={`shrink-0 px-3.5 py-1 rounded-full font-body-small text-xs font-medium transition-all duration-200 ${
                activeTag === 'all'
                  ? 'bg-primary/10 border border-primary text-primary shadow-[0_0_12px_rgba(232,105,63,0.18)]'
                  : 'bg-surface border border-border text-text-secondary hover:border-border-hover hover:text-text-primary'
              }`}
              onClick={() => handleTag('all')}
              type="button"
            >
              All Folios ({initialBooks.length})
            </button>
            {TAGS.map((tag) => (
              <button
                key={tag}
                className={`shrink-0 px-3.5 py-1 rounded-full font-body-small text-xs font-medium transition-all duration-200 ${
                  activeTag === tag
                    ? 'bg-primary/10 border border-primary text-primary shadow-[0_0_12px_rgba(232,105,63,0.18)]'
                    : 'bg-surface border border-border text-text-secondary hover:border-border-hover hover:text-text-primary'
                }`}
                onClick={() => handleTag(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-border/60">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>Viewing</span>
            <span className="font-mono text-primary font-semibold text-base">{filtered.length}</span>
            <span>sanctified treatises</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs text-text-muted font-mono uppercase tracking-wider">
            <span>BINDING: CALFSKIN &amp; VELLUM</span>
            <span>·</span>
            <span>INDEX: GUILD PROTOCOL 4.2</span>
          </div>
        </div>

        {paged.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center border border-border text-primary">
              <span className="material-symbols-outlined text-[32px]">auto_stories</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-text-primary">No folios or treatises found</h3>
            <p className="font-body text-sm text-text-muted">
              Adjust your search phrase or clear category constraints to reveal archived manuscripts.
            </p>
            <button
              className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-text-on-accent font-semibold text-sm hover:bg-primary-hover transition-colors shadow-[0_0_20px_rgba(232,105,63,0.25)]"
              type="button"
              onClick={() => {
                handleSearch('');
                setActiveTag('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300">
            {paged.map((book) => (
              <BookCard key={book.slug} book={book} />
            ))}
          </div>
        )}

        <div className="my-12 p-6 rounded-xl bg-surface border border-border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-border shrink-0 text-secondary">
              <span className="material-symbols-outlined text-[26px]">history_edu</span>
            </div>
            <div className="space-y-1">
              <h4 className="font-display text-lg font-bold text-text-primary">Requesting a Folio Not Listed?</h4>
              <p className="font-body text-sm text-text-secondary max-w-xl">
                Our vault scribes can unseal and digitize archived treatises from our locked subterranean chambers upon guild petition.
              </p>
            </div>
          </div>
          <Link
            className="shrink-0 px-5 py-2.5 rounded-lg bg-surface-container border border-border hover:border-primary text-text-primary hover:text-primary font-body font-medium text-xs sm:text-sm transition-all duration-200 flex items-center gap-2"
            href="/upload"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <span>Submit Archival Petition</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs sm:text-sm text-text-secondary order-2 sm:order-1">
            Showing{' '}
            <span className="font-mono text-text-primary font-medium">
              {filtered.length > 0 ? `${(safePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(safePage * ITEMS_PER_PAGE, filtered.length)}` : '0'}
            </span>{' '}
            of <span className="font-mono text-text-primary font-medium">{filtered.length}</span> treatises (Page{' '}
            <span className="font-mono text-primary font-semibold">{safePage}</span> of {totalPages})
          </p>
          <nav aria-label="Catalog Navigation" className="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-text-muted hover:text-text-primary hover:border-border-hover transition-colors font-body text-xs disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={safePage <= 1}
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              <span className="hidden sm:inline">Previous</span>
            </button>
            {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`w-9 h-9 rounded-lg font-mono text-xs font-semibold transition-all duration-200 ${
                  p === safePage
                    ? 'bg-primary text-text-on-accent shadow-[0_0_16px_rgba(232,105,63,0.3)]'
                    : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover'
                }`}
                type="button"
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            {totalPages > 4 && (
              <>
                <span className="w-6 text-center font-mono text-xs text-text-muted">...</span>
                <button
                  className={`w-9 h-9 rounded-lg font-mono text-xs font-medium transition-all duration-200 ${
                    totalPages === safePage
                      ? 'bg-primary text-text-on-accent shadow-[0_0_16px_rgba(232,105,63,0.3)]'
                      : 'bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover'
                  }`}
                  type="button"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors font-body text-xs"
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </nav>
        </div>
      </div>
    </main>
  );
}
