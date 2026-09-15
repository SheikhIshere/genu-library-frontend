# 03 — Book Detail (Tablet)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| **Page** | Book Detail |
| **Route** | `/books/[slug]` |
| **Component** | `app/books/[slug]/page.tsx` (server) + `components/tablet/BookDetailTablet.tsx` (client) |
| **Nav Tab** | Books (second tab) — horizontal top nav |

---

## 2. Tablet Design Rationale

Book detail on tablet (641px–1024px) uses the extra width for a 2-column header: cover image left, metadata right. This eliminates mobile's stacked layout and makes the cover immediately visible without scrolling. The PDF viewer goes full-width below the header — it needs all the horizontal space for readability. Rating and comments sit side-by-side in a 2-column layout below the PDF. Related books display as a 2-column grid instead of mobile's horizontal scroll. The back arrow lives in the top nav (not floating), keeping the page clean. Hover states activate on all interactive elements. `px-6` padding throughout. Modals replace bottom sheets for confirmations since there's room for a centered dialog.

---

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────┐
│  Top Navigation Bar                               │  sticky top-0, z-50
│  [← Back] [Logo] [Search] [Home] [Books] [Lists]  │  h-14, px-6
│  [Profile]                                         │
├──────────────────────────────────────────────────┤
│  Page scroll container                            │
│  ┌──────────────────────────────────────────────┐ │
│  │ Header: 2-column                             │ │  px-6, mt-6, gap-6, flex
│  │ ┌────────────┐ ┌────────────────────────────┐│ │
│  │ │ Cover img  │ │ Title + Author + Uploader  ││ │
│  │ │ w-48 h-64  │ │ Stats row (rating, favs)   ││ │
│  │ │ rounded-xl │ │ Tags row                    ││ │
│  │ │            │ │ Price + Download + Share    ││ │
│  │ └────────────┘ └────────────────────────────┘│ │
│  ├──────────────────────────────────────────────┤ │
│  │ Description section (collapsible)             │ │  px-6, mt-6
│  ├──────────────────────────────────────────────┤ │
│  │ PDF Preview — full width                      │ │  px-6, mt-6
│  │ [page controls] [canvas]                      │ │
│  ├──────────────────────────────────────────────┤ │
│  │ Rating + Comments (side-by-side, 2-column)   │ │  px-6, mt-6, gap-6, flex
│  │ ┌──────────────────┐ ┌──────────────────────┐│ │
│  │ │ Rate this book   │ │ Comments             ││ │
│  │ │ [star selector]  │ │ [list + input]       ││ │
│  │ └──────────────────┘ └──────────────────────┘│ │
│  ├──────────────────────────────────────────────┤ │
│  │ Related Books (2-column grid)                 │ │  px-6, mt-6
│  │ ┌──────────┐ ┌──────────┐                    │ │
│  │ │ Card 1   │ │ Card 2   │                    │ │
│  │ ├──────────┤ ├──────────┤                    │ │
│  │ │ Card 3   │ │ Card 4   │                    │ │
│  │ └──────────┘ └──────────┘                    │ │
│  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

- **Header**: 2-column flex, cover `w-48 h-64`, metadata `flex-1`
- **PDF viewer**: full width for readability
- **Rating + Comments**: side-by-side `flex gap-6`
- **Related books**: `grid-cols-2`
- **No bottom nav**: top nav only

---

## 4. Component Breakdown

### 4a. Top Navigation Bar (with back button)

```tsx
<nav className="sticky top-0 z-50 bg-[#16110f] border-b border-[#3a322d]">
  <div className="max-w-5xl mx-auto flex items-center h-14 px-6 gap-4">
    {/* Back button */}
    <button
      onClick={() => router.back()}
      className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#211a17] border border-[#3a322d] flex items-center justify-center hover:bg-[#2a211c] hover:border-[#4d433d] active:scale-[0.95] transition-all min-h-[40px] min-w-[40px]"
      aria-label="Go back"
    >
      <svg className="w-5 h-5 text-[#ece0dc]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>

    {/* Logo */}
    <a href="/" className="flex-shrink-0 flex items-center gap-2">
      <svg className="w-7 h-7 text-[#e8693f]" /* logo icon */ />
      <span className="text-lg font-bold text-[#ece0dc] font-['Playfair_Display']">Genu</span>
    </a>

    {/* Search bar */}
    <div className="flex-1 max-w-md relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a706a]" /* search icon */ />
      <input
        type="search"
        placeholder="Search books, authors..."
        className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#211a17] border border-[#3a322d] text-sm text-[#ece0dc] placeholder:text-[#7a706a] focus:outline-none focus:border-[#e8693f] focus:shadow-[0_0_0_3px_rgba(232,105,63,0.15)] transition-colors hover:border-[#4d433d]"
      />
    </div>

    {/* Nav links */}
    <div className="flex items-center gap-1">
      <a href="/" className="h-10 px-4 rounded-lg text-[#a89c93] text-sm font-medium flex items-center min-h-[40px] min-w-[40px] justify-center hover:bg-[#2a211c] hover:text-[#ece0dc] transition-colors">
        Home
      </a>
      <a href="/books" className="h-10 px-4 rounded-lg bg-[#e8693f20] text-[#e8693f] text-sm font-medium flex items-center min-h-[40px] min-w-[40px] justify-center hover:bg-[#e8693f30] transition-colors">
        Books
      </a>
      <a href="/playlists" className="h-10 px-4 rounded-lg text-[#a89c93] text-sm font-medium flex items-center min-h-[40px] min-w-[40px] justify-center hover:bg-[#2a211c] hover:text-[#ece0dc] transition-colors">
        Lists
      </a>
    </div>

    {/* Profile avatar */}
    <a href="/profile" className="flex-shrink-0 w-9 h-9 rounded-full bg-[#e8693f20] border border-[#3a322d] flex items-center justify-center text-[#e8693f] text-sm font-semibold hover:border-[#e8693f] transition-colors min-h-[40px] min-w-[40px]">
      {user?.initials || 'U'}
    </a>
  </div>
</nav>
```

### 4b. Header Section (2-column: cover + metadata)

```tsx
<section className="px-6 mt-6">
  <div className="max-w-5xl mx-auto flex gap-6">
    {/* Cover image — left column */}
    <div className="flex-shrink-0 w-48 h-64 rounded-xl bg-[#16110f] border border-[#3a322d] overflow-hidden">
      {book.cover_page ? (
        <img
          src={book.cover_page}
          alt={`Cover — ${book.title}`}
          className="w-full h-full object-cover"
          loading="eager"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-16 h-16 text-[#3a322d]" /* book placeholder icon */ />
        </div>
      )}
    </div>

    {/* Metadata — right column */}
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[#ece0dc] leading-tight font-['Playfair_Display']">
            {book.title}
          </h1>
          <p className="mt-1.5 text-sm text-[#a89c93]">
            By <span className="text-[#ece0dc] font-medium">{book.author}</span>
          </p>
          {book.uploader && (
            <p className="mt-0.5 text-xs text-[#7a706a]">
              Uploaded by {book.uploader.username}
            </p>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center active:scale-[0.9] transition-all ${
            isFavorited
              ? 'bg-[#e8693f] text-[#16110f]'
              : 'bg-[#16110f] border border-[#3a322d] text-[#a89c93] hover:border-[#4d433d] hover:text-[#ece0dc]'
          }`}
          aria-pressed={isFavorited}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
            <path d="M12.1 20.3c-.6-.5-5.9-5.0-7.6-7.0A5.6 5.6 0 0112 5.5c1.7 0 3.2.8 4 2.1.8-1.3 2.3-2.1 4-2.1 1.6 0 3 1.1 3.5 2.6.7 2.2-1.3 5.1-6.4 9.2l-4.9 3z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Stats row */}
      <div className="mt-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#d4a24e]" /* star */ />
          <span className="text-sm text-[#ece0dc] font-medium">{book.average_rating.toFixed(1)}</span>
          <span className="text-xs text-[#7a706a]">({book.total_ratings})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#a89c93]" /* heart */ />
          <span className="text-xs text-[#a89c93]">{book.total_favorites}</span>
        </div>
        <span className="text-sm font-semibold text-[#e8693f] font-['JetBrains_Mono']">
          {book.price === 0 ? 'Free' : `${book.price} coins`}
        </span>
      </div>

      {/* Tags */}
      {book.tags && book.tags.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {book.tags.map(t => (
            <span key={t} className="px-2.5 py-1 rounded-full bg-[#16110f] border border-[#3a322d] text-xs text-[#a89c93] hover:border-[#4d433d] transition-colors">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-4 flex gap-3">
        {book.book_file && (
          <a
            href={book.book_file}
            download
            className="flex-1 h-10 rounded-lg bg-[#e8693f] text-[#16110f] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#d45a30] active:scale-[0.98] transition-all min-h-[40px] min-w-[40px]"
          >
            <svg className="w-4 h-4" /* download icon */ />
            Download
          </a>
        )}
        <button
          onClick={() => setShowShareModal(true)}
          className="h-10 w-10 rounded-lg bg-[#16110f] border border-[#3a322d] text-[#a89c93] flex items-center justify-center hover:bg-[#2a211c] hover:border-[#4d433d] hover:text-[#ece0dc] active:scale-[0.97] min-h-[40px] min-w-[40px]"
          aria-label="Share"
        >
          <svg className="w-4 h-4" /* share icon */ />
        </button>
      </div>
    </div>
  </div>
</section>
```

### 4c. Description Section (collapsible)

```tsx
<section className="px-6 mt-6">
  <div className="max-w-5xl mx-auto rounded-xl bg-[#211a17] border border-[#3a322d] p-4 hover:border-[#4d433d] transition-colors">
    <button
      onClick={() => setShowDescription(!showDescription)}
      className="w-full flex items-center justify-between min-h-[40px]"
    >
      <h2 className="text-base font-semibold text-[#ece0dc]">Description</h2>
      <motion.svg
        animate={{ rotate: showDescription ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="w-4 h-4 text-[#a89c93]"
        /* chevron-down */
      />
    </button>
    <AnimatePresence>
      {showDescription && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <p className="mt-3 text-sm text-[#a89c93] leading-relaxed whitespace-pre-wrap">
            {book.description}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</section>
```

### 4d. PDF Preview Section (full width)

```tsx
<section className="px-6 mt-6">
  <div className="max-w-5xl mx-auto rounded-xl bg-[#211a17] border border-[#3a322d] overflow-hidden hover:border-[#4d433d] transition-colors">
    <div className="p-4 border-b border-[#3a322d] flex items-center justify-between">
      <h2 className="text-base font-semibold text-[#ece0dc]">Preview</h2>
      <span className="text-xs text-[#7a706a] font-['JetBrains_Mono']">Page {currentPage} / {totalPages}</span>
    </div>

    {/* Controls */}
    <div className="px-4 py-3 flex items-center justify-between border-b border-[#3a322d]">
      <button onClick={prevPage} disabled={currentPage <= 1}
        className="h-10 w-10 rounded-lg bg-[#16110f] border border-[#3a322d] text-[#ece0dc] flex items-center justify-center hover:bg-[#2a211c] hover:border-[#4d433d] disabled:opacity-30 active:scale-[0.95] min-h-[40px] min-w-[40px] transition-colors">
        <svg className="w-4 h-4" /* chevron-left */ />
      </button>
      <div className="flex items-center gap-3">
        <button onClick={zoomOut} className="h-10 w-10 rounded-lg bg-[#16110f] border border-[#3a322d] text-[#ece0dc] flex items-center justify-center hover:bg-[#2a211c] hover:border-[#4d433d] active:scale-[0.95] min-h-[40px] min-w-[40px] transition-colors">−</button>
        <span className="text-sm text-[#a89c93] font-['JetBrains_Mono']">{Math.round(scale * 100)}%</span>
        <button onClick={zoomIn} className="h-10 w-10 rounded-lg bg-[#16110f] border border-[#3a322d] text-[#ece0dc] flex items-center justify-center hover:bg-[#2a211c] hover:border-[#4d433d] active:scale-[0.95] min-h-[40px] min-w-[40px] transition-colors">+</button>
      </div>
      <button onClick={nextPage} disabled={currentPage >= totalPages}
        className="h-10 w-10 rounded-lg bg-[#16110f] border border-[#3a322d] text-[#ece0dc] flex items-center justify-center hover:bg-[#2a211c] hover:border-[#4d433d] disabled:opacity-30 active:scale-[0.95] min-h-[40px] min-w-[40px] transition-colors">
        <svg className="w-4 h-4" /* chevron-right */ />
      </button>
    </div>

    {/* Canvas area */}
    <div
      ref={containerRef}
      className="min-h-[400px] p-4 flex items-center justify-center bg-[#16110f]"
    >
      {loading ? (
        <div className="w-full h-80 rounded-lg bg-[#3a322d] animate-pulse" />
      ) : error ? (
        <p className="text-sm text-[#c44d4d] text-center">{error}</p>
      ) : (
        <canvas ref={canvasRef} className="rounded max-w-full" />
      )}
    </div>
  </div>
</section>
```

### 4e. Rating + Comments (side-by-side, 2 columns)

```tsx
<section className="px-6 mt-6">
  <div className="max-w-5xl mx-auto flex gap-6">
    {/* Rating — left column */}
    <div className="w-72 flex-shrink-0 rounded-xl bg-[#211a17] border border-[#3a322d] p-4 hover:border-[#4d433d] transition-colors">
      <h2 className="text-base font-semibold text-[#ece0dc]">Rate this book</h2>
      <div className="mt-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(v => (
          <button
            key={v}
            onClick={() => submitRating(v)}
            className="w-10 h-10 flex items-center justify-center hover:scale-110 active:scale-125 transition-transform min-h-[40px] min-w-[40px]"
            aria-label={`${v} star${v > 1 ? 's' : ''}`}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24"
              fill={v <= (hoverRating || rating) ? '#d4a24e' : 'none'}
              stroke={v <= (hoverRating || rating) ? '#d4a24e' : '#3a322d'}
              strokeWidth="1" strokeLinejoin="round">
              <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
            </svg>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-[#7a706a]">
        Average: <span className="text-[#ece0dc] font-medium">{book.average_rating.toFixed(1)}</span> · {book.total_ratings} ratings
      </p>

      {/* Rating breakdown bar */}
      <div className="mt-4 space-y-1.5">
        {[5, 4, 3, 2, 1].map(star => (
          <div key={star} className="flex items-center gap-2">
            <span className="text-[11px] text-[#7a706a] w-3 text-right">{star}</span>
            <div className="flex-1 h-2 rounded-full bg-[#16110f] overflow-hidden">
              <div className="h-full rounded-full bg-[#d4a24e]" style={{ width: `${(ratingBreakdown[star] || 0)}%` }} />
            </div>
            <span className="text-[10px] text-[#7a706a] w-8 font-['JetBrains_Mono']">{ratingBreakdown[star] || 0}%</span>
          </div>
        ))}
      </div>
    </div>

    {/* Comments — right column (flex-1) */}
    <div className="flex-1 min-w-0 rounded-xl bg-[#211a17] border border-[#3a322d] p-4 hover:border-[#4d433d] transition-colors">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#ece0dc]">Comments</h2>
        <span className="text-xs text-[#7a706a]">{comments.length}</span>
      </div>

      {/* Comment list */}
      <div className="mt-3 space-y-3 max-h-[480px] overflow-y-auto">
        {comments.length > 0 ? comments.map(c => (
          <div key={c.id} className="p-3 rounded-lg bg-[#16110f] border border-[#3a322d] hover:border-[#4d433d] transition-colors">
            <div className="flex items-center gap-2.5">
              {c.user?.avatar ? (
                <img src={c.user.avatar} className="w-8 h-8 rounded-full object-cover" loading="lazy" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#e8693f20] text-[#e8693f] flex items-center justify-center text-xs font-semibold">
                  {(c.anonymous_name || c.user?.username || '?')[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-[#ece0dc]">{c.anonymous_name || c.user?.username}</span>
                <span className="ml-2 text-[10px] text-[#7a706a]">{naturalTime(c.created_at)}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-[#a89c93] leading-relaxed whitespace-pre-wrap break-words">
              {c.comment}
            </p>
          </div>
        )) : (
          <p className="text-sm text-[#7a706a] text-center py-6">No comments yet. Be the first.</p>
        )}
      </div>

      {/* Comment input */}
      {isLoggedIn ? (
        <div className="mt-4 flex gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            maxLength={1000}
            value={commentText}
            onChange={(e) => { setCommentText(e.target.value); autoResize(); }}
            placeholder="Write a comment..."
            className="flex-1 min-h-[40px] max-h-32 px-3 py-2.5 rounded-lg bg-[#16110f] border border-[#3a322d] text-sm text-[#ece0dc] placeholder:text-[#7a706a] resize-none focus:outline-none focus:border-[#e8693f] transition-colors"
          />
          <button
            onClick={submitComment}
            disabled={!commentText.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#e8693f] text-[#16110f] flex items-center justify-center disabled:opacity-30 hover:bg-[#d45a30] active:scale-[0.95] min-h-[40px] min-w-[40px] transition-all"
          >
            <svg className="w-4 h-4" /* send icon */ />
          </button>
        </div>
      ) : (
        <p className="mt-3 text-sm text-[#7a706a]">
          <a href="/login" className="text-[#e8693f] hover:text-[#d45a30] transition-colors">Log in</a> to comment.
        </p>
      )}
    </div>
  </div>
</section>
```

### 4f. Related Books (2-column grid)

```tsx
<section className="px-6 mt-6">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-base font-semibold text-[#ece0dc] mb-4">Related Books</h2>
    <div className="grid grid-cols-2 gap-4">
      {book.related_books.map(r => (
        <a key={r.id} href={`/books/${r.slug}`}
           className="flex rounded-xl bg-[#211a17] border border-[#3a322d] overflow-hidden hover:border-[#4d433d] hover:bg-[#2a211c] active:scale-[0.98] transition-all group">
          <div className="w-24 h-32 flex-shrink-0 bg-[#16110f] overflow-hidden">
            {r.cover_page ? (
              <img src={r.cover_page} alt={r.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#3a322d]" /* book icon */ />
              </div>
            )}
          </div>
          <div className="flex-1 p-3 min-w-0">
            <p className="text-sm font-semibold text-[#ece0dc] truncate">{r.title}</p>
            <p className="text-xs text-[#a89c93] truncate">{r.author}</p>
            <div className="mt-1.5 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[#d4a24e]" /* star */ />
              <span className="text-xs text-[#ece0dc] font-medium">{r.average_rating.toFixed(1)}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>
```

### 4g. Share Modal (replaces mobile bottom sheet)

```tsx
<AnimatePresence>
  {showShareModal && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60"
        onClick={() => setShowShareModal(false)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[400px] max-w-[90vw] rounded-2xl bg-[#211a17] border border-[#3a322d] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        <div className="px-6 pt-6 pb-4 border-b border-[#3a322d]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#ece0dc]">Share this book</h3>
            <button onClick={() => setShowShareModal(false)}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#a89c93] hover:bg-[#2a211c] hover:text-[#ece0dc] transition-colors min-h-[40px] min-w-[40px]">
              <svg className="w-5 h-5" /* x icon */ />
            </button>
          </div>
        </div>
        <div className="p-6 grid grid-cols-4 gap-4">
          {['Copy Link', 'Twitter', 'WhatsApp', 'More'].map(opt => (
            <button key={opt} className="flex flex-col items-center gap-2 min-h-[40px] min-w-[40px] hover:bg-[#2a211c] rounded-xl p-2 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#16110f] border border-[#3a322d] flex items-center justify-center hover:border-[#4d433d] transition-colors">
                <svg className="w-5 h-5 text-[#a89c93]" /* share icon per platform */ />
              </div>
              <span className="text-xs text-[#a89c93]">{opt}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### 4h. Delete Confirmation Modal

```tsx
<AnimatePresence>
  {showDeleteModal && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60"
        onClick={() => setShowDeleteModal(false)}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[380px] max-w-[90vw] rounded-2xl bg-[#211a17] border border-[#3a322d] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        <div className="p-6 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#c44d4d20] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#c44d4d]" /* alert icon */ />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#ece0dc]">Delete this book?</h3>
          <p className="mt-2 text-sm text-[#a89c93]">This action cannot be undone. The book and all its data will be permanently removed.</p>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={() => setShowDeleteModal(false)}
            className="flex-1 h-10 rounded-lg bg-[#3a322d] text-[#ece0dc] text-sm font-medium hover:bg-[#4d433d] active:scale-[0.98] transition-all min-h-[40px]">
            Cancel
          </button>
          <button onClick={confirmDelete}
            className="flex-1 h-10 rounded-lg bg-[#c44d4d] text-[#ece0dc] text-sm font-semibold hover:bg-[#b34040] active:scale-[0.98] transition-all min-h-[40px]">
            Delete
          </button>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### 4i. Skeleton Loading

```tsx
<div className="px-6 mt-6 animate-pulse">
  <div className="max-w-5xl mx-auto flex gap-6">
    {/* Cover skeleton */}
    <div className="w-48 h-64 rounded-xl bg-[#3a322d] flex-shrink-0" />
    {/* Metadata skeleton */}
    <div className="flex-1 space-y-3">
      <div className="h-7 bg-[#3a322d] rounded w-3/4" />
      <div className="h-4 bg-[#3a322d] rounded w-1/2" />
      <div className="h-3 bg-[#3a322d] rounded w-1/3" />
      <div className="flex gap-2 mt-3">
        <div className="h-6 w-16 bg-[#3a322d] rounded-full" />
        <div className="h-6 w-16 bg-[#3a322d] rounded-full" />
      </div>
      <div className="flex gap-2 mt-3">
        <div className="h-6 w-12 bg-[#3a322d] rounded-full" />
        <div className="h-6 w-12 bg-[#3a322d] rounded-full" />
      </div>
      <div className="flex gap-3 mt-4">
        <div className="h-10 flex-1 bg-[#3a322d] rounded-lg" />
        <div className="h-10 w-10 bg-[#3a322d] rounded-lg" />
      </div>
    </div>
  </div>
</div>
```

---

## 5. Tablet Interactions

| Interaction | Trigger | Action |
|-------------|---------|--------|
| **Hover on cover** | Pointer enter cover image | Subtle scale-up (2% max) |
| **Hover on favorite** | Pointer enter heart button | Border lightens to `#4d433d` (when unfavorited) |
| **Hover on tag** | Pointer enter tag pill | Border lightens to `#4d433d` |
| **Hover on download** | Pointer enter download button | Background changes to `#d45a30` |
| **Hover on related book** | Pointer enter related card | Border lightens, cover scales, bg shifts |
| **Back arrow click** | Click back button in nav | `router.back()`, haptic `navigator.vibrate(10)` |
| **Favorite toggle** | Click heart button | Toggle favorite, spring bounce animation, haptic |
| **Description expand/collapse** | Click description header | Animate height open/close, rotate chevron |
| **PDF page turn** | Click prev/next buttons | Navigate page, haptic on change |
| **PDF zoom** | Click +/− buttons | Scale canvas, clamp 0.5–2.8 |
| **Star rating hover** | Pointer enter star | Preview rating (hover stars fill) |
| **Star rating click** | Click star 1–5 | Submit rating, stars fill with spring animation, haptic |
| **Comment submit** | Click send button or Ctrl+Enter | Submit comment, new comment animates in at top |
| **Share click** | Click share icon | Open share modal (centered, not bottom sheet) |
| **Copy link** | Click "Copy Link" in share modal | Copy URL to clipboard, show toast "Copied!", haptic |
| **Download click** | Click download button | Start file download, haptic |
| **Delete confirmation** | Click delete → confirm in modal | Delete book, navigate to `/books` |
| **Related book click** | Click related book card | Navigate to that book's detail page |
| **Keyboard navigation** | Tab/Enter | Focus-visible rings, Enter activates buttons/links |
| **Hover on comment** | Pointer enter comment | Border lightens to `#4d433d` |

---

## 6. Animation Spec (Framer Motion)

```tsx
// Page enter — fade in from slightly below
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
>

// Cover image — fade in on load
<motion.img
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
/>

// Metadata — slide in from right
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.1, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
>

// Favorite button — spring bounce on toggle
<motion.button
  whileTap={{ scale: 0.85 }}
  animate={isFavorited ? { scale: [1, 1.3, 1] } : {}}
  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
>

// Description collapse/expand
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: 'auto', opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.25 }}
>

// Star rating — each star scales on hover/click
<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 1.2 }}
  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
>

// Comment list — new comment slides in from top
<motion.div
  initial={{ opacity: 0, y: -12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>

// Related books grid — stagger in
<motion.div variants={{
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } }
}}>
  {book.related_books.map(r => (
    <motion.a key={r.id}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -2 }}
    />
  ))}
</motion.div>

// Share modal — scale + fade
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
>

// Delete modal — same pattern as share

// Toast — slide from top
<motion.div
  initial={{ y: -60, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -60, opacity: 0 }}
  transition={{ duration: 0.25 }}
>

// Skeleton shimmer — CSS: background linear-gradient, animate background-position
```

---

## 7. Tablet-Specific Anti-Slop Checklist

- [x] Horizontal top nav with back button — NO bottom nav bar
- [x] All interactive elements ≥ 40×40px (`min-h-[40px] min-w-[40px]`)
- [x] Hover states enabled on all interactive elements
- [x] 2-column header: cover left, metadata right
- [x] PDF viewer full width for readability
- [x] Rating and comments side-by-side (2 columns)
- [x] Related books as 2-column grid (not horizontal scroll)
- [x] Modals for share and delete confirmation (not bottom sheets)
- [x] Skeleton loading, not spinners
- [x] `px-6` (24px) content padding
- [x] Back arrow in top nav (not floating over cover)
- [x] Cover image: `w-48 h-64` — larger than mobile
- [x] No glassmorphism — solid backgrounds only
- [x] No indigo/blue/purple — Forge & Flux palette only
- [x] No shadow-lg — borders define depth, modals use elevation-3
- [x] No gradient backgrounds on cards
- [x] Focus-visible rings on all interactive elements
- [x] Rating breakdown bar chart in rating section
- [x] Max content width: `max-w-5xl mx-auto`
- [x] Comment input with send button h-10 w-10

---

## 8. Complete Stitch Prompt

```
BUILD THE TABLET BOOK DETAIL PAGE for a library app. Breakpoint: 641px–1024px only. Next.js 14 + Tailwind CSS + Framer Motion. Forge & Flux dark theme (background #16110f, surface #211a17, surface hover #2a211c, accent #e8693f, accent hover #d45a30, accent muted #e8693f20, border #3a322d, border hover #4d433d, text primary #ece0dc, text secondary #a89c93, muted #7a706a, star gold #d4a24e, success #4a7c59, error #c44d4d). Fonts: Playfair Display for headings, Inter for body, JetBrains Mono for numbers.

REQUIREMENTS:
1. Top navigation bar (sticky top-0, z-50, bg #16110f, border-b #3a322d). Contains: back button (w-10 h-10 rounded-lg bg #211a17 border #3a322d, hover: bg #2a211c border #4d433d, router.back()), logo, search bar (flex-1 max-w-md, h-10, bg #211a17), nav links (Home, Books active: bg-[#e8693f20] text-[#e8693f], Lists), profile avatar. All items min-h-[40px] min-w-[40px]. NO bottom nav.

2. Header section: 2-column flex (max-w-5xl mx-auto px-6 mt-6 gap-6). Left: cover image w-48 h-64 rounded-xl bg #16110f border #3a322d object-cover. Right: metadata flex-1. Contains: title (text-2xl font-bold Playfair Display #ece0dc), author (text-sm #a89c93), uploader (text-xs #7a706a), stats row (rating with #d4a24e star + number, favorites with heart icon, price in JetBrains Mono #e8693f), tags as pills (bg #16110f border #3a322d rounded-full text-xs hover:border-[#4d433d]), action buttons (Download: flex-1 h-10 rounded-lg bg #e8693f hover:bg-[#d45a30] with download icon, Share: w-10 h-10 rounded-lg bg #16110f border #3a322d hover: bg #2a211c). Favorite button: w-10 h-10 rounded-xl top-right of metadata. Favorited: bg #e8693f text #16110f. Unfavorited: bg #16110f border #3a322d hover:border-[#4d433d].

3. Description section (px-6 mt-6, max-w-5xl mx-auto): rounded-xl bg #211a17 border #3a322d hover:border-[#4d433d]. Collapsible — header button toggles height with Framer Motion. Chevron rotates.

4. PDF Preview section (px-6 mt-6, max-w-5xl mx-auto): rounded-xl bg #211a17 border #3a322d hover:border-[#4d433d]. Header with "Preview" + page count JetBrains Mono. Controls: prev/next/zoom buttons (h-10 w-10 rounded-lg bg #16110f border #3a322d hover:bg-[#2a211c]). Canvas: min-h-[400px] bg #16110f.

5. Rating + Comments side-by-side (px-6 mt-6, max-w-5xl mx-auto, flex gap-6). Left column: w-72 rounded-xl bg #211a17 border #3a322d p-4. "Rate this book" heading. 5 star buttons (w-10 h-10 each), hover scale 1.1, tap scale 1.2 spring. Average rating display. Rating breakdown bar chart (5 rows: star count, progress bar bg-[#d4a24e], percentage JetBrains Mono). Right column: flex-1 rounded-xl bg #211a17 border #3a322d p-4. Comment list (max-h-[480px] overflow-y-auto), each comment in bg #16110f border #3a322d hover:border-[#4d433d] with avatar + username + timestamp + text. Input: textarea (min-h-[40px] max-h-32 bg #16110f border #3a322d) + send button (w-10 h-10 bg #e8693f hover:bg-[#d45a30]).

6. Related Books (px-6 mt-6, max-w-5xl mx-auto): grid-cols-2 gap-4. Each card: flex row with cover w-24 h-32 + info (title text-sm, author text-xs, star rating). Hover: border #4d433d bg #2a211c, cover scales 2%. active:scale-[0.98].

7. Share modal (not bottom sheet): fixed centered (top-1/2 left-1/2 -translate), w-[400px] max-w-[90vw], rounded-2xl bg #211a17 border #3a322d shadow-[0_8px_32px_rgba(0,0,0,0.5)]. Header with title + close button (w-10 h-10). Body: grid-cols-4 gap-4 of share options (each: icon circle w-12 h-12 bg #16110f border #3a322d + label). Backdrop: bg-black/60.

8. Delete confirmation modal: same centered pattern. Alert icon (w-12 h-12 rounded-full bg-[#c44d4d20]), "Delete this book?" heading, description, two buttons (Cancel: h-10 bg #3a322d, Delete: h-10 bg #c44d4d).

9. Skeleton loading: 2-column flex, cover w-48 h-64 skeleton, metadata skeleton lines, animate-pulse.

ANIMATIONS (Framer Motion):
- Page: initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} duration 0.3s.
- Cover: initial={{ opacity: 0 }} animate={{ opacity: 1 }} duration 0.5s.
- Metadata: initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} delay 0.1s, spring cubic-bezier(0.34, 1.56, 0.64, 1).
- Favorite: whileTap scale 0.85, spring bounce [1, 1.3, 1] stiffness 500 damping 15.
- Description: height 0→auto, opacity 0→1, 0.25s.
- Stars: hover scale 1.1, tap scale 1.2 spring stiffness 400 damping 10.
- New comment: initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}.
- Related books: staggerChildren 0.05, each fades up y:12, hover y:-2.
- Modals: initial={{ opacity: 0, scale: 0.95 }} spring cubic-bezier(0.34, 1.56, 0.64, 1) duration 0.2s.
- Toast: y -60→0, 0.25s.
- Skeleton shimmer: CSS gradient animation.

INTERACTIONS:
- Back arrow → router.back(), haptic vibrate(10).
- Favorite toggle → spring bounce, haptic.
- Description tap → expand/collapse.
- PDF prev/next → page turn, haptic.
- PDF zoom +/− → scale canvas, clamp 0.5–2.8.
- Star hover → preview rating.
- Star click → submit rating, spring fill, haptic.
- Comment submit → new comment slides in, haptic.
- Share tap → open share modal (centered).
- Copy link → clipboard, toast "Copied!", haptic.
- Download tap → file download, haptic.
- Delete → confirm modal → delete + navigate to /books.
- Related book tap → navigate to that book.
- Keyboard: Tab through all controls, Enter to activate. Focus-visible:ring-2 ring-[#e8693f].

CONSTRAINTS:
- 2-column header (cover left, metadata right).
- Rating and comments side-by-side (2 columns).
- Related books as 2-column grid.
- Horizontal top nav with back button. NO bottom nav.
- Hover states enabled on all interactive elements.
- Modals for share and delete (not bottom sheets).
- px-6 for all content padding.
- All interactive elements min-h-[40px] min-w-[40px].
- No glassmorphism. No indigo/blue/purple. No shadow-lg. No gradient backgrounds.
- Body text min 14px. JetBrains Mono for prices and page numbers.
- Focus-visible rings on all interactive elements.
- PDF viewer full width below header.
- Max content width: max-w-5xl mx-auto.
```
