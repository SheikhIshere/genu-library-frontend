'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { mediaUrl } from '@/lib/api';
import { relativeTime } from '@/lib/formatTokens';

interface PlaylistItem {
  slug: string;
  title: string;
  description: string;
  cover_image: string | null;
  books_count: number;
  creator_name: string;
  created_at: string;
}

interface PlaylistListClientProps {
  playlists: PlaylistItem[];
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'most-books', label: 'Most Books' },
];

function PlaylistCard({ playlist, mounted }: { playlist: PlaylistItem; mounted: boolean }) {
  return (
    <Link href={`/playlists/${playlist.slug}`}>
      <article className="group relative bg-surface border border-border hover:border-primary rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(232,105,63,0.12)]">
        <div className="relative h-48 overflow-hidden bg-surface-container">
          <img
            alt={playlist.title}
            src={mediaUrl(playlist.cover_image)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-black/40 pointer-events-none" />
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-canvas/80 backdrop-blur-md border border-border px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-primary text-[16px]">library_music</span>
            <span className="font-mono text-xs text-text-primary font-semibold">{playlist.books_count}</span>
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col justify-between gap-3">
          <div className="space-y-1.5">
            <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
              {playlist.title}
            </h3>
            <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
              {playlist.description || 'No description'}
            </p>
          </div>
          <div className="pt-3 border-t border-border/70 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-secondary font-mono text-[10px] font-bold">
                {playlist.creator_name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-text-muted">{playlist.creator_name}</span>
            </div>
            {mounted && <span className="text-xs text-text-muted">{relativeTime(playlist.created_at)}</span>}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function PlaylistListClient({ playlists }: PlaylistListClientProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = useMemo(() => {
    let result = [...playlists];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.creator_name.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'most-books':
        result.sort((a, b) => b.books_count - a.books_count);
        break;
      default:
        break;
    }

    return result;
  }, [playlists, search, sortBy]);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
  }, []);

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
            <span className="text-primary font-medium">Playlists</span>
          </nav>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-primary/40 text-primary font-mono text-xs uppercase tracking-wider shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {playlists.length} Playlist{playlists.length !== 1 ? 's' : ''} Curated
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-text-primary">
                Book Playlists
              </h1>
              <p className="font-body text-base text-text-secondary max-w-2xl leading-relaxed">
                Curated collections of treatises, manuscripts, and folios assembled by guild scholars for thematic study.
              </p>
            </div>
            <Link
              href="/playlists/new"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-container text-text-on-accent font-body text-sm font-semibold hover:bg-primary-hover transition-all duration-200 shadow-[0_0_20px_rgba(232,105,63,0.25)] active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Create Playlist</span>
            </Link>
          </div>
        </div>
      </div>

      <section className="sticky top-16 z-40 bg-canvas/95 backdrop-blur-md border-b border-border py-3.5 px-6 lg:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 sm:max-w-md">
            <div className="flex items-center bg-surface border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 rounded-lg px-3 py-2 transition-all">
              <span className="material-symbols-outlined text-text-muted text-[19px] mr-2 shrink-0">search</span>
              <input
                className="w-full bg-transparent border-none outline-none font-body-small text-sm text-text-primary placeholder:text-text-muted focus:ring-0"
                placeholder="Search playlists..."
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
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full">
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-border/60">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>Showing</span>
            <span className="font-mono text-primary font-semibold text-base">{filtered.length}</span>
            <span>playlist{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center border border-border text-primary">
              <span className="material-symbols-outlined text-[32px]">library_music</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-text-primary">
              {playlists.length === 0 ? 'No playlists yet' : 'No playlists found'}
            </h3>
            <p className="font-body text-sm text-text-muted">
              {playlists.length === 0
                ? 'Create your first playlist to organize and curate collections of books.'
                : 'Adjust your search to find playlists in the archive.'}
            </p>
            {playlists.length === 0 && (
              <Link
                href="/playlists/new"
                className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-text-on-accent font-semibold text-sm hover:bg-primary-hover transition-colors shadow-[0_0_20px_rgba(232,105,63,0.25)]"
              >
                Create Your First Playlist
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300">
            {filtered.map((playlist) => (
              <PlaylistCard key={playlist.slug} playlist={playlist} mounted={mounted} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
