'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { books } from '@/lib/api';

export default function NewPlaylistPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) return;

      setIsSubmitting(true);
      setError('');

      try {
        await books.playlistCreate({
          title: title.trim(),
          description: description.trim(),
          is_public: visibility === 'public',
        });
        router.push('/playlists');
      } catch {
        setError('Failed to create playlist. Please try again.');
        setIsSubmitting(false);
      }
    },
    [title, description, visibility, router]
  );

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
            <span className="text-primary font-medium">Create New</span>
          </nav>
          <div className="space-y-2.5 max-w-3xl">
            <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight text-text-primary">
              Create New Playlist
            </h1>
            <p className="font-body text-base text-text-secondary max-w-2xl leading-relaxed">
              Curate a collection of books into a themed playlist for study or sharing.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8 w-full">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <section className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-5">
            <div className="border-b border-border pb-2">
              <span className="font-mono text-overline uppercase text-text-muted tracking-wider">Playlist Details</span>
              <h2 className="font-display text-headline-3 text-text-primary mt-0.5">General Information</h2>
            </div>

            <div className="space-y-1.5">
              <label className="block font-body text-body-small font-medium text-text-secondary" htmlFor="playlistTitle">
                Title <span className="text-primary">*</span>
              </label>
              <input
                className="w-full bg-canvas border border-border rounded-lg px-3.5 py-2.5 font-display text-body-default text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                id="playlistTitle"
                placeholder="e.g., Medieval Astronomy Treatises"
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-body text-body-small font-medium text-text-secondary" htmlFor="playlistDescription">
                Description
              </label>
              <textarea
                className="w-full bg-canvas border border-border rounded-lg px-3.5 py-2.5 font-body text-body-small text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all resize-y leading-relaxed"
                id="playlistDescription"
                maxLength={1000}
                placeholder="Describe the theme or purpose of this playlist..."
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

          <section className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
            <div className="border-b border-border pb-2">
              <span className="font-mono text-overline uppercase text-text-muted tracking-wider">Visibility</span>
              <h2 className="font-display text-headline-3 text-text-primary mt-0.5">Access Settings</h2>
            </div>

            <div className="space-y-2">
              <label className="block font-body text-body-small font-medium text-text-secondary">Playlist Visibility</label>
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
              <p className="font-body text-xs text-text-muted">
                Public playlists are discoverable in the catalog. Private playlists are only visible to you.
              </p>
            </div>
          </section>

          {error && (
            <div className="p-4 rounded-lg bg-status-error/10 border border-status-error/30 flex items-center gap-3">
              <span className="material-symbols-outlined text-status-error text-[20px]">error</span>
              <p className="font-body text-sm text-status-error">{error}</p>
            </div>
          )}

          <section className="p-4 md:p-6 rounded-xl bg-surface border border-border space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Link className="font-body text-body-small text-text-muted hover:text-text-primary transition-colors text-center sm:text-left py-2" href="/playlists">
                Discard &amp; Cancel
              </Link>
              <div className="flex flex-col-reverse sm:flex-row items-center gap-3">
                <button
                  className="w-full sm:w-auto bg-primary-container text-text-on-accent font-body text-body-small font-semibold px-8 py-2.5 rounded-lg hover:bg-primary-hover transition-all duration-200 shadow-[0_0_24px_rgba(232,105,63,0.25)] flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !title.trim()}
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-text-on-accent" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">library_music</span>
                      Create Playlist
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="pt-1 border-t border-border flex items-center gap-2">
              <span className="material-symbols-outlined text-text-muted text-[16px] shrink-0">policy</span>
              <p className="font-body text-xs text-text-muted">
                By submitting, you affirm this playlist complies with the Genu Library Archival Codex.
              </p>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}
