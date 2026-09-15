"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { mediaUrl } from "@/lib/api";

interface Book {
  id: number;
  title: string;
  slug: string;
  author: string;
  cover_page?: string;
  price?: number;
  average_rating?: number;
  category?: string;
}

interface FeaturedCarouselProps {
  books: Book[];
}

export default function FeaturedCarousel({ books }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  const visibleCount = typeof window !== "undefined" && window.innerWidth >= 1024 ? 4 : typeof window !== "undefined" && window.innerWidth >= 640 ? 2 : 1;
  const totalPages = Math.max(1, Math.ceil(books.length / visibleCount));

  const scrollToIndex = useCallback(
    (idx: number) => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      const cards = container.children;
      if (!cards.length) return;

      const card = cards[idx] as HTMLElement;
      if (!card) return;

      const containerWidth = container.clientWidth;
      const cardWidth = card.offsetWidth;
      const gap = 16;
      const targetScroll = idx * (cardWidth + gap);

      container.scrollTo({ left: targetScroll, behavior: "smooth" });
    },
    []
  );

  const goNext = useCallback(() => {
    setActiveIdx((prev) => {
      const next = (prev + 1) % totalPages;
      scrollToIndex(next * visibleCount);
      return next;
    });
  }, [totalPages, visibleCount, scrollToIndex]);

  const goPrev = useCallback(() => {
    setActiveIdx((prev) => {
      const next = (prev - 1 + totalPages) % totalPages;
      scrollToIndex(next * visibleCount);
      return next;
    });
  }, [totalPages, visibleCount, scrollToIndex]);

  useEffect(() => {
    autoplayRef.current = setInterval(goNext, 3500);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [goNext]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!books.length) return null;

  return (
    <div className="relative overflow-hidden">
      <div
        ref={scrollRef}
        className="flex gap-gutter overflow-x-auto scrollbar-none"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {books.map((book) => {
          const isFav = favorites[book.id] || false;
          return (
            <div
              key={book.id}
              className="carousel-item w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0 flex flex-col bg-surface border border-border rounded-xl space-y-space-sm hover:border-border-hover hover:-translate-y-1 transition-all duration-300 shadow-md group"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="relative w-full aspect-[3/4] rounded-t-xl overflow-hidden bg-surface-container-high border-b border-border">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={book.title}
                  src={mediaUrl(book.cover_page)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
                {book.category && (
                  <div className="absolute top-2.5 left-2.5">
                    <span className="font-overline text-overline px-2.5 py-0.5 rounded-full bg-surface/90 text-primary border border-border backdrop-blur-sm">
                      {book.category}
                    </span>
                  </div>
                )}
                <button
                  aria-label="Favorite toggle"
                  onClick={() => toggleFavorite(book.id)}
                  className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface/80 backdrop-blur-sm border border-border flex items-center justify-center hover:scale-110 transition-transform ${
                    isFav ? "text-primary-container" : "text-text-muted hover:text-primary-container"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                </button>
              </div>
              <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/books/${book.slug}`}>
                    <h3 className="font-display text-headline-3 text-text-primary group-hover:text-primary transition-colors truncate">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="font-body-small text-body-small text-text-secondary truncate">{book.author}</p>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-md border border-border">
                    <span className="text-secondary text-xs">🪙</span>
                    <span className="font-label-mono text-label-mono font-medium text-secondary">{book.price ?? 0}</span>
                  </div>
                  {book.average_rating != null && (
                    <div className="flex items-center text-status-warning gap-1">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-label-mono text-caption text-text-primary">
                        {book.average_rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2 pt-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            aria-label={`Slide ${idx + 1}`}
            onClick={() => {
              setActiveIdx(idx);
              scrollToIndex(idx * visibleCount);
            }}
            className={`h-1.5 rounded-full transition-all ${
              idx === activeIdx
                ? "w-6 bg-primary-container"
                : "w-2 bg-border hover:bg-text-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
