'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { books, mediaUrl } from '@/lib/api';

export default function DeleteBookPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [book, setBook] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (!slug) return;
    books.detail(slug).then((data) => {
      setBook(data);
      setIsLoading(false);
    }).catch(() => {
      router.push('/books');
    });
  }, [slug, router]);

  const handleDelete = useCallback(async () => {
    if (!acknowledged || isDeleting) return;
    setIsDeleting(true);
    try {
      const res = await books.delete(slug);
      if (res.ok) {
        router.push('/books');
      } else {
        setIsDeleting(false);
      }
    } catch {
      setIsDeleting(false);
    }
  }, [slug, acknowledged, isDeleting, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.back();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  if (isLoading || !book) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </main>
    );
  }

  const title = (book.title as string) || 'Untitled';
  const author = (book.author as string) || 'Unknown';
  const coverPage = (book.cover_page as string) || null;
  const tags = Array.isArray(book.tag) ? (book.tag as string[]) : [];
  const price = (book.price as number) || 0;

  return (
    <main className="w-full min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 py-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-text-muted">
          <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
            <span className="material-symbols-outlined text-[15px]">home</span>
            <span>Home</span>
          </Link>
          <span className="text-text-muted/60">/</span>
          <Link className="hover:text-primary transition-colors" href="/books">Books Catalog</Link>
          <span className="text-text-muted/60">/</span>
          <Link className="hover:text-text-primary text-text-secondary transition-colors truncate max-w-[180px] sm:max-w-xs" href={`/books/${slug}`}>{title}</Link>
          <span className="text-text-muted/60">/</span>
          <span aria-current="page" className="text-status-error font-semibold">Expulsion Protocol</span>
        </nav>
      </div>

      <div className="relative w-full px-4 pb-8 pt-2 flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-gradient-to-br from-status-error/10 via-primary-container/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="w-full max-w-xl bg-surface rounded-xl shadow-2xl relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-status-error to-transparent" />
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-status-error/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-primary-container/10 rounded-full blur-2xl pointer-events-none" />

          <div className="p-6 sm:p-10 flex flex-col relative z-10">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center relative group">
                  <div className="absolute inset-0 rounded-xl bg-status-error/20 animate-ping opacity-25" />
                  <span className="material-symbols-outlined text-status-error text-[26px]">local_fire_department</span>
                </div>
                <div>
                  <span className="font-overline text-overline text-status-error uppercase tracking-widest block">Guild Sanction</span>
                  <span className="font-mono text-caption text-text-muted">Destructive De-accession</span>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-status-error/15 text-status-error font-mono text-caption flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-error animate-pulse" />
                <span>Irreversible</span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-headline-1 text-text-primary tracking-tight">Expel Codex</h1>
              <p className="font-display text-headline-3 font-semibold text-text-primary">&ldquo;{title}&rdquo;</p>
            </div>

            <div className="mt-4 p-3.5 bg-surface-container-lowest rounded-lg">
              <p className="font-body text-body-small text-text-secondary leading-relaxed">
                This action strikes the volume from the Sovereign Guild ledger. The master file, synchronized margin annotations, audial recordings, and scholar citations will be irrevocably purged to cinder.
              </p>
            </div>

            <div className="my-6 bg-surface-container-lowest rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative shrink-0 w-20 h-28 rounded-lg overflow-hidden bg-surface-container shadow-md">
                {coverPage ? (
                  <img
                    className="w-full h-full object-cover"
                    alt={`${title} cover`}
                    src={mediaUrl(coverPage)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-text-muted text-[32px]">menu_book</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-2 w-full">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-overline text-overline text-primary uppercase">Rare Manuscript</span>
                    <p className="font-body text-body-default font-semibold text-text-primary truncate">{title}</p>
                    <p className="font-body text-caption text-text-muted flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">history_edu</span>
                      <span className="truncate">{author}</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-caption">
                  {tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-surface text-text-secondary">{tag}</span>
                  ))}
                  <span className="px-2 py-0.5 rounded-full bg-surface text-secondary flex items-center gap-1">
                    <span>🪙</span> {price}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-high/60">
                <span className="material-symbols-outlined text-status-warning text-[20px] shrink-0 mt-0.5">warning</span>
                <div className="text-caption font-body space-y-1">
                  <p className="text-text-primary font-medium">Automatic Recall Mandate</p>
                  <p className="text-text-muted">All active archivist lending leases will be instantly cancelled and refunded. Bookmark markers will be dissolved.</p>
                </div>
              </div>
              <label className="flex items-center gap-3 p-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer select-none">
                <input
                  className="w-4 h-4 rounded bg-canvas border-none accent-status-error cursor-pointer"
                  checked={acknowledged}
                  id="sealAcknowledge"
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  type="checkbox"
                />
                <span className="font-body text-body-small text-text-secondary">
                  I certify under guild oath to strike this folio from the archives
                </span>
              </label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-center justify-end">
              <button
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-text-primary font-body text-body-small font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 text-center"
                onClick={() => router.back()}
                type="button"
              >
                Cancel &amp; Retain
              </button>
              <button
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-status-error disabled:opacity-40 disabled:hover:bg-status-error hover:bg-red-700 text-text-primary font-body text-body-small font-semibold shadow-lg shadow-status-error/20 transition-all flex items-center justify-center gap-2 group cursor-not-allowed disabled:cursor-not-allowed"
                disabled={!acknowledged || isDeleting}
                onClick={handleDelete}
                type="button"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-text-primary" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Incinerating Folio...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">delete_forever</span>
                    <span>Expel Permanently</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-container-highest flex items-center justify-between text-caption font-mono text-text-muted">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-text-secondary">ESC</kbd> to return
              </span>
              <span className="text-right">Enter does not execute deletion</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
