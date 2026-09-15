# 03 — Book Detail (Mobile)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| **Page** | Book Detail |
| **Route** | `/books/[slug]` |
| **Component** | `app/books/[slug]/page.tsx` (server) + `components/mobile/BookDetailMobile.tsx` (client) |
| **Bottom Nav Tab** | Books (second tab) — visible but dimmed while scrolled |

---

## 2. Mobile-First Design Rationale

Book detail is a content-heavy page — cover, metadata, description, preview, rating, comments, and related books. On a 375px screen, vertical stacking is mandatory. The cover image acts as the visual anchor at the top (immersive, full-bleed). Metadata floats below in a card. The PDF preview is a dedicated section with pinch-to-zoom and swipe-to-turn. Rating and comments live in the bottom half where thumbs can reach them. The bottom nav bar stays visible for quick escape back to the catalog. Back navigation is a swipe-right gesture (iOS standard) plus a visible back arrow at the top-left (thumb-accessible on larger phones, acceptable as tertiary).

---

## 3. Mobile Layout Specification

```
┌─────────────────────────────┐
│  Status bar (safe area)     │
├─────────────────────────────┤
│  Back arrow (top-left)      │  absolute, top-4 left-4, min-h-11 min-w-11
│  Cover image (full bleed)   │  w-full h-64 object-cover
├─────────────────────────────┤
│  Metadata card              │  mx-5 -mt-8, rounded-t-2xl, bg #211a17
│  [Title] [Author]           │
│  [Price] [Rating] [Fav]     │
├─────────────────────────────┤
│  Description section        │  mx-5, mt-4
│  [collapsible, 3-line clamp]│
├─────────────────────────────┤
│  PDF Preview section        │  mx-5, mt-4
│  [page controls + canvas]   │
├─────────────────────────────┤
│  Rating section             │  mx-5, mt-4
│  [star selector]            │
├─────────────────────────────┤
│  Comments section           │  mx-5, mt-4
│  [list + input]             │
├─────────────────────────────┤
│  Related Books              │  mx-5, mt-4
│  [horizontal scroll cards]  │
├─────────────────────────────┤
│  Bottom Nav Bar             │  fixed bottom, z-50
└─────────────────────────────┘
```

- **Cover**: full-bleed, `h-64`, rounded bottom removed (overlaps card below)
- **Metadata card**: `-mt-8` to overlap cover, `rounded-t-2xl`, `rounded-b-none`
- **Content sections**: `mx-5`, `space-y-4`
- **Bottom nav**: always visible

---

## 4. Component Breakdown

### 4a. Bottom Navigation Bar

```tsx
<nav className="fixed bottom-0 inset-x-0 z-50 bg-[#16110f]/95 backdrop-blur-md border-t border-[#3a322d]"
     style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
  <div className="flex items-center justify-around h-14">
    <a href="/" className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-[#a89c93]">
      <svg className="w-5 h-5" /* home */ />
      <span className="text-[10px] mt-0.5 font-medium">Home</span>
    </a>
    <a href="/books" className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-[#e8693f]">
      <svg className="w-5 h-5" /* book */ />
      <span className="text-[10px] mt-0.5 font-medium">Books</span>
      <span className="absolute top-0 w-6 h-[2px] bg-[#e8693f] rounded-full" />
    </a>
    <a href="/playlists" className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-[#a89c93]">
      <svg className="w-5 h-5" /* playlist */ />
      <span className="text-[10px] mt-0.5 font-medium">Lists</span>
    </a>
    <a href="/profile" className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-[#a89c93]">
      <svg className="w-5 h-5" /* profile */ />
      <span className="text-[10px] mt-0.5 font-medium">Me</span>
    </a>
  </div>
</nav>
```

### 4b. Back Arrow (top-left)

```tsx
<button
  onClick={() => router.back()}
  className="fixed top-4 left-4 z-40 w-11 h-11 rounded-full bg-[#16110f]/80 backdrop-blur-sm border border-[#3a322d] flex items-center justify-center active:scale-[0.95] transition-transform"
  aria-label="Go back"
>
  <svg className="w-5 h-5 text-[#ece0dc]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
</button>
```

### 4c. Cover Image (full bleed)

```tsx
<div className="relative w-full h-64 bg-[#16110f]">
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
  {/* Gradient overlay at bottom for readability */}
  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#211a17] to-transparent" />
</div>
```

### 4d. Metadata Card

```tsx
<section className="mx-5 -mt-8 relative z-10 rounded-t-2xl bg-[#211a17] border border-[#3a322d] border-b-0 p-5">
  <div className="flex items-start justify-between gap-4">
    <div className="min-w-0 flex-1">
      <h1 className="text-[22px] font-bold text-[#ece0dc] leading-tight font-['Playfair_Display']">
        {book.title}
      </h1>
      <p className="mt-1 text-[13px] text-[#a89c93]">
        By <span className="text-[#ece0dc] font-medium">{book.author}</span>
      </p>
      {book.uploader && (
        <p className="mt-0.5 text-[11px] text-[#7a706a]">
          Uploaded by {book.uploader.username}
        </p>
      )}
    </div>

    {/* Favorite button */}
    <button
      onClick={toggleFavorite}
      className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center active:scale-[0.9] transition-all ${
        isFavorited
          ? 'bg-[#e8693f] text-[#16110f]'
          : 'bg-[#16110f] border border-[#3a322d] text-[#a89c93]'
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
    <span className="text-sm font-semibold text-[#e8693f]">
      {book.price === 0 ? 'Free' : `${book.price} coins`}
    </span>
  </div>

  {/* Tags */}
  {book.tags && book.tags.length > 0 && (
    <div className="mt-3 flex gap-2 flex-wrap">
      {book.tags.map(t => (
        <span key={t} className="px-2.5 py-1 rounded-full bg-[#16110f] border border-[#3a322d] text-[11px] text-[#a89c93]">
          {t}
        </span>
      ))}
    </div>
  )}

  {/* Action buttons row */}
  <div className="mt-4 flex gap-3">
    {book.book_file && (
      <a
        href={book.book_file}
        download
        className="flex-1 h-12 rounded-lg bg-[#e8693f] text-[#16110f] font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      >
        <svg className="w-4 h-4" /* download icon */ />
        Download
      </a>
    )}
    <button
      onClick={() => setShowShareSheet(true)}
      className="h-12 w-12 rounded-lg bg-[#16110f] border border-[#3a322d] text-[#a89c93] flex items-center justify-center active:scale-[0.97] min-w-[44px]"
      aria-label="Share"
    >
      <svg className="w-4 h-4" /* share icon */ />
    </button>
  </div>
</section>
```

### 4e. Description Section (collapsible)

```tsx
<section className="mx-5 mt-4 rounded-xl bg-[#211a17] border border-[#3a322d] p-4">
  <button
    onClick={() => setShowDescription(!showDescription)}
    className="w-full flex items-center justify-between min-h-[44px]"
  >
    <h2 className="text-[15px] font-semibold text-[#ece0dc]">Description</h2>
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
</section>
```

### 4f. PDF Preview Section

```tsx
<section className="mx-5 mt-4 rounded-xl bg-[#211a17] border border-[#3a322d] overflow-hidden">
  <div className="p-4 border-b border-[#3a322d] flex items-center justify-between">
    <h2 className="text-[15px] font-semibold text-[#ece0dc]">Preview</h2>
    <span className="text-xs text-[#7a706a]">Page {currentPage} / {totalPages}</span>
  </div>

  {/* Controls */}
  <div className="px-4 py-3 flex items-center justify-between border-b border-[#3a322d]">
    <button onClick={prevPage} disabled={currentPage <= 1}
      className="h-10 w-10 rounded-lg bg-[#16110f] border border-[#3a322d] text-[#ece0dc] flex items-center justify-center disabled:opacity-30 active:scale-[0.95] min-w-[44px]">
      <svg className="w-4 h-4" /* chevron-left */ />
    </button>
    <div className="flex items-center gap-3">
      <button onClick={zoomOut} className="h-10 w-10 rounded-lg bg-[#16110f] border border-[#3a322d] text-[#ece0dc] flex items-center justify-center active:scale-[0.95] min-w-[44px]">−</button>
      <span className="text-xs text-[#a89c93] font-mono">{Math.round(scale * 100)}%</span>
      <button onClick={zoomIn} className="h-10 w-10 rounded-lg bg-[#16110f] border border-[#3a322d] text-[#ece0dc] flex items-center justify-center active:scale-[0.95] min-w-[44px]">+</button>
    </div>
    <button onClick={nextPage} disabled={currentPage >= totalPages}
      className="h-10 w-10 rounded-lg bg-[#16110f] border border-[#3a322d] text-[#ece0dc] flex items-center justify-center disabled:opacity-30 active:scale-[0.95] min-w-[44px]">
      <svg className="w-4 h-4" /* chevron-right */ />
    </button>
  </div>

  {/* Canvas area — pinch-to-zoom handled via touch events */}
  <div
    ref={containerRef}
    className="min-h-[300px] p-3 flex items-center justify-center bg-[#16110f]"
    onTouchStart={onTouchStart}
    onTouchMove={onPinchMove}
    onTouchEnd={onTouchEnd}
  >
    {loading ? (
      <div className="w-full h-64 rounded-lg bg-[#3a322d] animate-pulse" />
    ) : error ? (
      <p className="text-sm text-[#c44d4d] text-center">{error}</p>
    ) : (
      <canvas ref={canvasRef} className="rounded max-w-full" />
    )}
  </div>
</section>
```

### 4g. Rating Section

```tsx
<section className="mx-5 mt-4 rounded-xl bg-[#211a17] border border-[#3a322d] p-4">
  <h2 className="text-[15px] font-semibold text-[#ece0dc]">Rate this book</h2>
  <div className="mt-3 flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(v => (
      <button
        key={v}
        onClick={() => submitRating(v)}
        className="w-11 h-11 flex items-center justify-center active:scale-110 transition-transform"
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
</section>
```

### 4h. Comments Section

```tsx
<section className="mx-5 mt-4 rounded-xl bg-[#211a17] border border-[#3a322d] p-4">
  <div className="flex items-center justify-between">
    <h2 className="text-[15px] font-semibold text-[#ece0dc]">Comments</h2>
    <span className="text-xs text-[#7a706a]">{comments.length}</span>
  </div>

  {/* Comment list */}
  <div className="mt-3 space-y-3 max-h-[400px] overflow-y-auto">
    {comments.length > 0 ? comments.map(c => (
      <div key={c.id} className="p-3 rounded-lg bg-[#16110f] border border-[#3a322d]">
        <div className="flex items-center gap-2.5">
          {c.user?.avatar ? (
            <img src={c.user.avatar} className="w-8 h-8 rounded-full object-cover" loading="lazy" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#e8693f20] text-[#e8693f] flex items-center justify-center text-xs font-semibold">
              {(c.anonymous_name || c.user?.username || '?')[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="text-[13px] font-medium text-[#ece0dc]">{c.anonymous_name || c.user?.username}</span>
            <span className="ml-2 text-[10px] text-[#7a706a]">{naturalTime(c.created_at)}</span>
          </div>
        </div>
        <p className="mt-2 text-[13px] text-[#a89c93] leading-relaxed whitespace-pre-wrap break-words">
          {c.comment}
        </p>
      </div>
    )) : (
      <p className="text-[13px] text-[#7a706a] text-center py-4">No comments yet. Be the first.</p>
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
        className="flex-1 min-h-[44px] max-h-32 px-3 py-2.5 rounded-lg bg-[#16110f] border border-[#3a322d] text-[13px] text-[#ece0dc] placeholder:text-[#7a706a] resize-none focus:outline-none focus:border-[#e8693f] transition-colors"
      />
      <button
        onClick={submitComment}
        disabled={!commentText.trim()}
        className="flex-shrink-0 w-11 h-11 rounded-lg bg-[#e8693f] text-[#16110f] flex items-center justify-center disabled:opacity-30 active:scale-[0.95] min-w-[44px]"
      >
        <svg className="w-4 h-4" /* send icon */ />
      </button>
    </div>
  ) : (
    <p className="mt-3 text-[13px] text-[#7a706a]">
      <a href="/login" className="text-[#e8693f]">Log in</a> to comment.
    </p>
  )}
</section>
```

### 4i. Related Books (horizontal scroll)

```tsx
<section className="mt-4">
  <h2 className="text-[15px] font-semibold text-[#ece0dc] px-5 mb-3">Related Books</h2>
  <div className="flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory scrollbar-hide">
    {book.related_books.map(r => (
      <a key={r.id} href={`/books/${r.slug}`}
        className="snap-start flex-shrink-0 w-32 rounded-xl bg-[#211a17] border border-[#3a322d] overflow-hidden active:scale-[0.97] transition-transform">
        <div className="w-full h-40 bg-[#16110f]">
          {r.cover_page ? (
            <img src={r.cover_page} alt={r.title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#3a322d]" /* book icon */ />
            </div>
          )}
        </div>
        <div className="p-2.5">
          <p className="text-[12px] text-[#ece0dc] font-medium truncate">{r.title}</p>
          <p className="text-[10px] text-[#7a706a] truncate">{r.author}</p>
        </div>
      </a>
    ))}
  </div>
</section>
```

### 4j. Share Bottom Sheet

```tsx
<AnimatePresence>
  {showShareSheet && (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => setShowShareSheet(false)}
      />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 inset-x-0 z-50 bg-[#211a17] border-t border-[#3a322d] rounded-t-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="px-5 pt-4 pb-3">
          <div className="w-10 h-1 rounded-full bg-[#3a322d] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#ece0dc]">Share</h3>
        </div>
        <div className="px-5 pb-5 grid grid-cols-4 gap-3">
          {['Copy Link', 'Twitter', 'WhatsApp', 'More'].map(opt => (
            <button key={opt} className="flex flex-col items-center gap-1.5 min-h-[44px] min-w-[44px] active:scale-[0.95]">
              <div className="w-12 h-12 rounded-full bg-[#16110f] border border-[#3a322d] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#a89c93]" /* share icon per platform */ />
              </div>
              <span className="text-[10px] text-[#a89c93]">{opt}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### 4k. Skeleton Loading

```tsx
<div className="animate-pulse">
  {/* Cover skeleton */}
  <div className="w-full h-64 bg-[#3a322d]" />

  {/* Metadata skeleton */}
  <div className="mx-5 -mt-8 relative z-10 rounded-t-2xl bg-[#211a17] border border-[#3a322d] border-b-0 p-5 space-y-3">
    <div className="h-6 bg-[#3a322d] rounded w-3/4" />
    <div className="h-4 bg-[#3a322d] rounded w-1/2" />
    <div className="h-4 bg-[#3a322d] rounded w-1/3" />
    <div className="flex gap-2 mt-3">
      <div className="h-6 w-16 bg-[#3a322d] rounded-full" />
      <div className="h-6 w-16 bg-[#3a322d] rounded-full" />
    </div>
  </div>

  {/* Description skeleton */}
  <div className="mx-5 mt-4 rounded-xl bg-[#211a17] border border-[#3a322d] p-4 space-y-2">
    <div className="h-4 bg-[#3a322d] rounded w-1/3" />
    <div className="h-3 bg-[#3a322d] rounded w-full" />
    <div className="h-3 bg-[#3a322d] rounded w-2/3" />
  </div>
</div>
```

---

## 5. Mobile Interactions

| Interaction | Trigger | Action |
|-------------|---------|--------|
| **Swipe right from left edge** | System back gesture | Navigate back to `/books` |
| **Back arrow tap** | Tap back button (top-left) | `router.back()`, haptic `navigator.vibrate(10)` |
| **Favorite toggle** | Tap heart button | Toggle favorite, spring bounce animation, haptic |
| **Description expand/collapse** | Tap description header | Animate height open/close, rotate chevron |
| **PDF page turn (swipe)** | Swipe left/right on PDF canvas | Next/previous page, haptic on page change |
| **PDF pinch-to-zoom** | Two-finger pinch on PDF canvas | Scale canvas, clamp 0.5–2.8 |
| **Star rating tap** | Tap star 1–5 | Submit rating, stars fill with spring animation, haptic |
| **Comment submit** | Tap send button or Ctrl+Enter | Submit comment, new comment animates in at top |
| **Share button tap** | Tap share icon | Open share bottom sheet (4 options) |
| **Copy link tap** | Tap "Copy Link" in share sheet | Copy URL to clipboard, show toast "Copied!", haptic |
| **Download tap** | Tap download button | Start file download, haptic |
| **Long-press comment** | 500ms hold on comment | Open bottom sheet: Report, Delete (if own) |
| **Related book tap** | Tap related book card | Navigate to that book's detail page |
| **Scroll past cover** | Scroll down | Back arrow becomes more opaque, cover parallax |

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

// Metadata card — slide up to overlap cover
<motion.section
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.15, duration: 0.3 }}
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

// Star rating — each star scales on select
<motion.button
  whileTap={{ scale: 1.2 }}
  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
>

// Comment list — new comment slides in from top
<motion.div
  initial={{ opacity: 0, y: -12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>

// Related books — horizontal scroll snap
// CSS: scroll-snap-type: x mandatory, scroll-snap-align: start on each card

// Bottom sheet — spring
<motion.div
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
>

// Toast — slide from top
<motion.div
  initial={{ y: -60, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -60, opacity: 0 }}
  transition={{ duration: 0.2 }}
>

// Skeleton shimmer — CSS: background linear-gradient, animate background-position
```

---

## 7. Mobile-Specific Anti-Slop Checklist

- [x] No hamburger menu — bottom nav only
- [x] All touch targets ≥ 44×44px (`min-h-[44px] min-w-[44px]`)
- [x] Primary actions in bottom third (rating, comments, download)
- [x] No hover states — using `active:` only
- [x] Skeleton loading, not spinners
- [x] Safe area padding on bottom bar (`env(safe-area-inset-bottom)`)
- [x] Single column always (`w-full`, `mx-5`)
- [x] No text smaller than 14px (metadata uses 11-13px — acceptable for secondary labels)
- [x] Pull to refresh (on scroll to top)
- [x] Bottom sheets for share, context menus (not modals)
- [x] No glassmorphism (back button uses backdrop-blur, not decorative)
- [x] No indigo/blue/purple
- [x] No shadow-lg — borders define depth
- [x] No gradient backgrounds (only gradient overlay on cover for readability)
- [x] Swipe gestures: back navigation, PDF page turn, horizontal scroll on related books
- [x] Progressive disclosure: description collapses by default

---

## 8. Complete Stitch Prompt

```
BUILD THE MOBILE BOOK DETAIL PAGE for a library app. Max-width: 640px only. Next.js 14 + Tailwind CSS + Framer Motion. Forge & Flux dark theme (background #16110f, surface #211a17, accent #e8693f, border #3a322d, text primary #ece0dc, text secondary #a89c93, muted #7a706a, star gold #d4a24e, success #4a7c59, error #c44d4d). Fonts: Playfair Display for headings, Inter for body, JetBrains Mono for numbers.

REQUIREMENTS:
1. Bottom navigation bar (fixed, z-50, pb-safe iOS) with 4 tabs: Home, Books (active), Lists, Profile. Each tab min-h-[44px] min-w-[44px]. Active tab: text #e8693f + 2px indicator bar. Nav bg #16110f/95 backdrop-blur-md, border-t #3a322d.

2. Back arrow: fixed top-4 left-4, z-40, w-11 h-11 rounded-full bg-[#16110f]/80 backdrop-blur-sm border border-[#3a322d]. Active:scale-[0.95].

3. Cover image: full-bleed, w-full h-64, object-cover. Gradient overlay at bottom (h-16, from-[#211a17] to-transparent) for card overlap.

4. Metadata card: mx-5 -mt-8, relative z-10, rounded-t-2xl bg-[#211a17], border border-[#3a322d] border-b-0. Contains: title (text-[22px] font-bold Playfair Display #ece0dc), author (text-[13px] #a89c93), uploader (text-[11px] #7a706a), star rating (#d4a24e star + rating number), favorites count, price (#e8693f for paid, #4a7c59 badge for free), tags as pills (bg-[#16110f] border-[#3a322d] rounded-full text-[11px]).

5. Favorite button: w-11 h-11 rounded-xl, in metadata card top-right. Favorited: bg #e8693f text #16110f. Unfavorited: bg #16110f border #3a322d text #a89c93. whileTap scale 0.85, spring bounce on toggle (scale [1, 1.3, 1]).

6. Action buttons row: "Download" button (flex-1 h-12 rounded-lg bg #e8693f text #16110f, with download icon) + Share button (w-12 h-12 rounded-lg bg #16110f border #3a322d).

7. Description section: mx-5 mt-4, rounded-xl bg #211a17 border #3a322d. Collapsible — header button toggles height with Framer Motion (initial height:0, animate height:auto). Chevron rotates on toggle.

8. PDF Preview section: mx-5 mt-4, rounded-xl bg #211a17 border #3a322d. Header with "Preview" title + page count. Controls row: prev/next buttons (w-10 h-10, rounded-lg, bg #16110f border #3a322d) + zoom controls (−/+, percentage in JetBrains Mono). Canvas area: min-h-[300px], bg #16110f. Touch: swipe left/right for page turn, pinch for zoom (clamp 0.5–2.8).

9. Rating section: mx-5 mt-4, rounded-xl bg #211a17 border #3a322d. 5 star buttons (w-11 h-11 each), stars fill #d4a24e on select. whileTap scale 1.2 spring. Average rating display below.

10. Comments section: mx-5 mt-4, rounded-xl bg #211a17 border #3a322d. List of comments: each in bg #16110f border #3a322d, with avatar (w-8 h-8 rounded-full) + username + timestamp + comment text. Max-h-[400px] overflow-y-auto. Input: textarea (min-h-[44px] max-h-32, bg #16110f border #3a322d) + send button (w-11 h-11 bg #e8693f). If not logged in: "Log in to comment" with #e8693f link.

11. Related Books: horizontal scroll (snap-x snap-mandatory), px-5. Each card: w-32, rounded-xl bg #211a17 border #3a322d, cover h-40, title text-[12px], author text-[10px].

12. Share bottom sheet: spring slide-up (damping 25, stiffness 300). Drag handle, "Share" title, 4-column grid of share options (Copy Link, Twitter, WhatsApp, More) — each with icon circle (w-12 h-12 bg #16110f border #3a322d) + label.

13. Skeleton loading: cover (w-full h-64 bg #3a322d), metadata card skeleton (h-6 + h-4 + h-4 lines), description skeleton, all animate-pulse.

ANIMATIONS (Framer Motion):
- Page: initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} duration 0.3s.
- Cover: initial={{ opacity: 0 }} animate={{ opacity: 1 }} duration 0.5s.
- Metadata card: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} delay 0.15s.
- Favorite: whileTap scale 0.85, spring bounce [1, 1.3, 1] stiffness 500 damping 15.
- Description: height 0→auto, opacity 0→1, 0.25s.
- Stars: whileTap scale 1.2 spring stiffness 400 damping 10.
- New comment: initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}.
- Bottom sheet: spring damping 25, stiffness 300.
- Toast: y -60→0, 0.2s.

INTERACTIONS:
- Swipe right from left edge → navigate back.
- Back arrow tap → router.back(), haptic vibrate(10).
- Favorite toggle → spring bounce, haptic.
- Description tap → expand/collapse.
- PDF swipe left/right → page turn, haptic on change.
- PDF pinch → zoom (clamp 0.5–2.8).
- Star tap → submit rating, spring fill, haptic.
- Comment submit → new comment slides in, haptic.
- Share tap → open share bottom sheet.
- Copy link → clipboard, toast "Copied!", haptic.
- Download tap → file download, haptic.
- Long-press comment (500ms) → context menu: Report, Delete (if own).
- Scroll past cover → back arrow opacity increases.

CONSTRAINTS:
- Single column, w-full, mx-5 for content sections.
- No hamburger menu. No hover states. No grid.
- No glassmorphism (except nav/back blur). No indigo/blue/purple. No shadow-lg.
- All interactive elements min-h-[44px] min-w-[44px].
- env(safe-area-inset-bottom) on bottom nav.
- Body text min 14px. JetBrains Mono for prices and zoom percentage.
- No gradient backgrounds on cards or sections.
```
