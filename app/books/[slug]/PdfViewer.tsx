'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(342);
  const [zoomLevel, setZoomLevel] = useState(100);
  const viewportRef = useRef<HTMLDivElement>(null);

  const clampZoom = useCallback((z: number) => Math.min(Math.max(z, 75), 175), []);

  const updatePage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') updatePage(currentPage - 1);
      if (e.key === 'ArrowRight') updatePage(currentPage + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentPage, updatePage]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      viewportRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">menu_book</span>
          <h2 className="font-display text-headline-3 text-text-primary">Illuminated Codex Reader</h2>
        </div>
        <span className="font-mono text-xs text-text-muted bg-surface-container px-3 py-1 rounded-full self-start sm:self-auto">
          Interactive Dual-Layer Vector Rendering
        </span>
      </div>

      <div className="w-full rounded-2xl bg-surface-container-lowest overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-surface-container px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md z-20">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider hidden sm:inline">Folio</span>
            <button
              className="w-8 h-8 rounded-md bg-surface-container-high hover:bg-surface-active flex items-center justify-center text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={currentPage <= 1}
              onClick={() => updatePage(currentPage - 1)}
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <div className="flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded-md">
              <input
                className="w-8 text-center bg-transparent font-mono text-sm font-semibold text-primary outline-none focus:ring-1 focus:ring-primary/40 rounded"
                type="text"
                value={String(currentPage).padStart(2, '0')}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) updatePage(val);
                }}
              />
              <span className="font-mono text-sm text-text-muted">/</span>
              <span className="font-mono text-sm text-text-secondary">{totalPages}</span>
            </div>
            <button
              className="w-8 h-8 rounded-md bg-surface-container-high hover:bg-surface-active flex items-center justify-center text-text-primary transition-colors"
              onClick={() => updatePage(currentPage + 1)}
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          <div className="flex items-center gap-2 bg-surface-container-low px-2 py-1 rounded-lg">
            <button
              className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-container transition-colors"
              title="Zoom Out (-)"
              onClick={() => setZoomLevel((z) => clampZoom(z - 15))}
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <span className="font-mono text-xs font-semibold text-text-primary px-2 min-w-[48px] text-center">
              {zoomLevel}%
            </span>
            <button
              className="w-7 h-7 rounded flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-container transition-colors"
              title="Zoom In (+)"
              onClick={() => setZoomLevel((z) => clampZoom(z + 15))}
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
            <button
              className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded text-text-muted hover:text-text-primary hover:bg-surface-container text-xs transition-colors"
              title="Fit to Width"
              onClick={() => setZoomLevel(100)}
            >
              <span className="material-symbols-outlined text-[14px]">fit_screen</span>
              <span>Fit</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-container-high transition-colors"
              title="Toggle Fullscreen [F]"
              onClick={toggleFullscreen}
            >
              <span className="material-symbols-outlined text-[20px]">fullscreen</span>
            </button>
            <a
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-primary hover:text-text-on-accent text-text-secondary font-body text-xs font-medium transition-colors"
              href={url}
              download
              title="Download Offline Folio"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="relative w-full h-[620px] overflow-auto bg-surface-dim p-4 md:p-8 flex justify-center items-start transition-all"
        >
          <div
            className="relative w-full max-w-[760px] min-h-[820px] bg-canvas text-text-primary p-8 md:p-14 rounded-lg shadow-2xl transition-transform duration-300 origin-top flex flex-col justify-between"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <div className="flex items-center justify-between pb-6 font-mono text-xs text-text-muted">
              <span>FOLIO IV · TRACTATUS DE LOGICA</span>
              <span>ARCH. ST. STERLING · 1492</span>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <p className="font-body text-lg leading-relaxed text-text-primary">
                  <span className="float-left text-primary font-display text-[68px] leading-[0.8] pr-3 pt-1 font-bold select-none">P</span>
                  rimum oportet statuere rationem qua mens humana per proportiones aureas veritatem comprehendat. When Euclidean principles intersect with natural cognitive perception, geometric harmony ceases to be merely spatial; it transforms into the primary scaffold through which discursive thought manifests clarity.
                </p>
              </div>
              <p className="font-body text-sm text-text-secondary italic leading-relaxed pl-4 border-l-2 border-primary/40 bg-surface-container-lowest/40 p-3 rounded-r-lg">
                &ldquo;Nihil est in intellectu quod non sit prius in harmonia formarum. The mind builds not in chaos, but under the infallible law of ternary synthesis.&rdquo;
              </p>
              <div className="my-6 p-6 rounded-xl bg-surface-container-lowest flex flex-col items-center justify-center space-y-3 shadow-inner">
                <svg className="w-56 h-56 text-primary" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" opacity="0.4" r="90" strokeDasharray="3 3" />
                  <circle cx="100" cy="100" opacity="0.8" r="60" />
                  <circle className="text-secondary" cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="1.5" />
                  <polygon opacity="0.6" points="100,10 178,145 22,145" stroke="currentColor" />
                  <polygon opacity="0.6" points="100,190 22,55 178,55" stroke="currentColor" />
                  <line opacity="0.3" strokeDasharray="2 2" x1="100" x2="100" y1="5" y2="195" />
                  <line opacity="0.3" strokeDasharray="2 2" x1="5" x2="195" y1="100" y2="100" />
                  <circle cx="100" cy="100" fill="currentColor" r="4" />
                </svg>
                <span className="font-mono text-xs text-secondary uppercase tracking-widest text-center">
                  Fig. 4.2 — The Hexagonal Projection of Intuitive Logic
                </span>
              </div>
              <p className="font-body text-sm text-text-secondary leading-relaxed">
                Every premise constitutes a pillar; every conclusion, the keystone of the vault. In Chapter III we observed how the classical syllogism corresponds directly to the triangulation of load-bearing stone arches. Where the logic fails, the cathedral of dialectics collapses under the immense weight of contradiction.
              </p>
            </div>
            <div className="mt-8 pt-4 flex items-center justify-between font-mono text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-warning" />
                Marginalia: Glossed by Master Eldrin in 1604
              </span>
              <span className="font-bold text-text-secondary">Page {currentPage}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container px-4 py-2 flex items-center justify-between text-xs font-body text-text-muted">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary">keyboard</span>
            <span>
              Tip: Use{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high font-mono text-text-secondary">←</kbd> /{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high font-mono text-text-secondary">→</kbd> arrows
              to flip folios,{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high font-mono text-text-secondary">F</kbd> for fullscreen
            </span>
          </span>
          <span className="hidden md:inline font-mono text-[10px] text-text-muted">Renderer: Guild Canvas v3.2 (WebGL Accelerated)</span>
        </div>
      </div>
    </div>
  );
}
