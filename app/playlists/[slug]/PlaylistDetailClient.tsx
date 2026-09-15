'use client';

import { useMemo, useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { mediaUrl } from '@/lib/api';
import { relativeTime } from '@/lib/formatTokens';

interface BookItem {
  slug: string;
  title: string;
  author: string;
  cover_page: string | null;
  price: number;
  average_rating: number;
}

interface PlaylistDetailClientProps {
  playlist: Record<string, unknown>;
}

export default function PlaylistDetailClient({ playlist }: PlaylistDetailClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const title = (playlist.title as string) || 'Untitled';
  const description = (playlist.description as string) || '';
  const coverImage = (playlist.cover_image as string) || null;
  const creatorName = (playlist.creator_name as string) || (playlist.created_by as string) || 'Archivist';
  const createdAt = (playlist.created_at as string) || '';
  const rawBooks = Array.isArray(playlist.books) ? (playlist.books as Record<string, unknown>[]) : [];

  const books: BookItem[] = useMemo(
    () =>
      rawBooks.map((r) => ({
        slug: (r.slug as string) || '',
        title: (r.title as string) || 'Untitled',
        author: (r.author as string) || 'Unknown',
        cover_page: (r.cover_page as string) || null,
        price: (r.price as number) || 0,
        average_rating: (r.average_rating as number) || 0,
      })),
    [rawBooks]
  );

  const bookCount = books.length;
  const avgRating = useMemo(() => {
    if (bookCount === 0) return 0;
    return books.reduce((sum, b) => sum + b.average_rating, 0) / bookCount;
  }, [books, bookCount]);

  return (
    <main className="w-full min-h-screen">
      <div className="relative w-full overflow-hidden pt-8 pb-6 px-6 lg:px-8 border-b border-border/40">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-2 font-body-small text-xs">
            <Link className="text-text-muted hover:text-primary transition-colors flex items-center gap-1" href="/">
              <span className="material-symbols-outlined text-[15px]">home</span>
              <span>Home</span>
            </Link>
            <span className="text-border font-mono">&gt;</span>
            <Link className="text-text-muted hover:text-primary transition-colors" href="/playlists">
              Playlists
            </Link>
            <span className="text-border font-mono">&gt;</span>
            <span className="text-primary font-medium truncate max-w-[200px] sm:max-w-none">{title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[420px] group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary-container/20 via-secondary/15 to-transparent rounded-2xl blur-lg group-hover:opacity-100 opacity-60 transition-opacity duration-500" />
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-surface-container shadow-2xl">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  src={mediaUrl(coverImage)}
                  alt={title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                    Playlist
                  </span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 w-full">
                <div className="bg-surface-container-low rounded-lg p-2.5 text-center shadow-sm">
                  <span className="block font-mono text-[10px] text-text-muted uppercase">Books</span>
                  <span className="font-mono text-sm font-medium text-text-primary">{bookCount}</span>
                </div>
                <div className="bg-surface-container-low rounded-lg p-2.5 text-center shadow-sm">
                  <span className="block font-mono text-[10px] text-text-muted uppercase">Avg Rating</span>
                  <span className="font-mono text-sm font-medium text-secondary">{avgRating.toFixed(1)}</span>
                </div>
                <div className="bg-surface-container-low rounded-lg p-2.5 text-center shadow-sm">
                  <span className="block font-mono text-[10px] text-text-muted uppercase">Created</span>
                  <span className="font-mono text-sm font-medium text-text-primary">
                    {createdAt ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary font-mono text-xs font-semibold tracking-wider">
                CURATED COLLECTION
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-container-low text-text-secondary font-mono text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Archivist Verified
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-headline-1 lg:text-4xl text-text-primary font-bold tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="font-body text-base text-text-secondary leading-relaxed">{description}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-surface-container-high flex items-center justify-center font-display text-lg text-secondary font-bold shadow-inner">
                  {creatorName.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-0.5">
                  <span className="font-body text-sm font-semibold text-text-primary block">{creatorName}</span>
<span className="font-body-small text-xs text-text-muted">
  {createdAt && mounted ? `Created ${relativeTime(createdAt)}` : 'Unknown date'}
</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/playlists"
                className="flex items-center gap-1.5 px-4 py-3.5 rounded-lg bg-surface-container hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-all duration-200 shadow-sm font-body text-sm font-medium"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                <span>All Playlists</span>
              </Link>
              <Link
                href={`/playlists/${(playlist.slug as string) || ''}/edit`}
                className="flex items-center gap-2 px-5 py-3.5 rounded-lg bg-primary-container hover:bg-primary-hover text-text-on-accent font-body text-sm font-semibold shadow-lg shadow-primary-container/20 transition-all duration-200 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
                <span>Edit Playlist</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                Collection Contents
              </span>
              <h2 className="font-display text-headline-2 text-text-primary">
                Books in this Playlist{' '}
                <span className="text-text-muted text-headline-3">({bookCount})</span>
              </h2>
            </div>
          </div>

          {bookCount === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center border border-border text-primary">
                <span className="material-symbols-outlined text-[32px]">auto_stories</span>
              </div>
              <h3 className="font-display text-xl font-bold text-text-primary">No books in this playlist</h3>
              <p className="font-body text-sm text-text-muted">
                Edit this playlist to add books from the collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <Link key={book.slug} href={`/books/${book.slug}`}>
                  <article className="group relative bg-surface border border-border hover:border-primary rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(232,105,63,0.12)]">
                    <div className="relative h-56 overflow-hidden bg-surface-container">
                      <img
                        alt={book.title}
                        src={mediaUrl(book.cover_page)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/40 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-text-secondary">
                        <span className="bg-surface/90 backdrop-blur-sm px-2 py-0.5 rounded border border-border">
                          {book.author}
                        </span>
                        {book.price > 0 && (
                          <span className="bg-surface/90 backdrop-blur-sm px-2 py-0.5 rounded border border-border flex items-center gap-1">
                            <span>🪙</span>
                            <span className="text-secondary font-semibold">{book.price}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <h3 className="font-display text-base font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                        {book.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-secondary text-[16px]" style={book.average_rating >= 1 ? { fontVariationSettings: "'FILL' 1" } : undefined}>star</span>
                          <span className="font-mono text-xs text-text-primary font-medium">{book.average_rating.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-text-muted">View →</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
