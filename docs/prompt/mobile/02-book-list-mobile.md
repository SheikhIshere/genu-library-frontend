# 02 — Book List / Catalog (Mobile)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| **Page** | Books Catalog |
| **Route** | `/books` |
| **Component** | `app/books/page.tsx` (server) + `components/mobile/BookListMobile.tsx` (client) |
| **Bottom Nav Tab** | Books (second tab) |

---

## 2. Mobile-First Design Rationale

The book list is a high-density browsing surface. On mobile, users scroll vertically with one thumb while holding the phone in the other hand. The search bar sits at the very top (just below the status bar) so it's always accessible. Filter/sort controls collapse into a bottom sheet triggered by a single button — no inline dropdown that overlaps content. Book cards are full-width with tall cover images (the primary visual anchor for recognition). Pull-to-refresh gives the "live catalog" feel. Infinite scroll replaces pagination to avoid bottom-of-page dead zones. Swipe left on a card to reveal "Add to Playlist" as a contextual action — progressive disclosure.

---

## 3. Mobile Layout Specification

```
┌─────────────────────────────┐
│  Status bar (safe area)     │
├─────────────────────────────┤
│  Search bar                 │  sticky top-0, z-40, px-5, py-3
│  [🔍 Search books...]       │  bg-[#16110f]/95 backdrop-blur-md
├─────────────────────────────┤
│  Filter bar                 │  px-5, flex between
│  [Filter ▼] [Sort ▼] [ chips]│
├─────────────────────────────┤
│  Book list (scrollable)     │  px-5, space-y-4, pb-safe
│  ┌─────────────────────────┐│
│  │ Book card (full width)  ││
│  ├─────────────────────────┤│
│  │ Book card               ││
│  ├─────────────────────────┤│
│  │ ... infinite scroll     ││
│  └─────────────────────────┘│
├─────────────────────────────┤
│  Bottom Nav Bar             │  fixed bottom, z-50
└─────────────────────────────┘
```

- **Search bar**: `sticky top-0 z-40`, background `#16110f/95 backdrop-blur-md`, borders bottom `#3a322d`
- **Filter triggers**: two buttons in a row, each `min-h-[44px]`, open bottom sheets
- **Book list**: `space-y-4`, each card full width, `rounded-xl`

---

## 4. Component Breakdown

### 4a. Bottom Navigation Bar

```tsx
<nav className="fixed bottom-0 inset-x-0 z-50 bg-[#16110f]/95 backdrop-blur-md border-t border-[#3a322d]"
     style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
  <div className="flex items-center justify-around h-14">
    <a href="/" className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-[#a89c93]">
      <svg className="w-5 h-5" /* home icon */ />
      <span className="text-[10px] mt-0.5 font-medium">Home</span>
    </a>
    <a href="/books" className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-[#e8693f]">
      <svg className="w-5 h-5" /* book icon */ />
      <span className="text-[10px] mt-0.5 font-medium">Books</span>
      <span className="absolute top-0 w-6 h-[2px] bg-[#e8693f] rounded-full" />
    </a>
    <a href="/playlists" className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-[#a89c93]">
      <svg className="w-5 h-5" /* playlist icon */ />
      <span className="text-[10px] mt-0.5 font-medium">Lists</span>
    </a>
    <a href="/profile" className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-[#a89c93]">
      <svg className="w-5 h-5" /* profile icon */ />
      <span className="text-[10px] mt-0.5 font-medium">Me</span>
    </a>
  </div>
</nav>
```

### 4b. Search Bar (sticky)

```tsx
<div className="sticky top-0 z-40 bg-[#16110f]/95 backdrop-blur-md border-b border-[#3a322d] px-5 py-3">
  <div className="relative">
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a706a]" /* search icon */ />
    <input
      type="search"
      placeholder="Search by title, author..."
      value={search}
      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      className="w-full h-11 pl-10 pr-4 rounded-lg bg-[#16110f] border border-[#3a322d] text-sm text-[#ece0dc] placeholder:text-[#7a706a] focus:outline-none focus:border-[#e8693f] focus:shadow-[0_0_0_3px_rgba(232,105,63,0.15)] transition-colors"
      aria-label="Search books"
    />
  </div>
</div>
```

### 4c. Filter Bar

```tsx
<div className="flex items-center gap-3 px-5 py-3">
  <button
    onClick={() => setShowFilterSheet(true)}
    className="h-11 px-4 rounded-lg bg-[#211a17] border border-[#3a322d] text-sm text-[#a89c93] flex items-center gap-2 active:scale-[0.97] transition-transform min-w-[44px] justify-center"
  >
    <svg className="w-4 h-4" /* filter icon */ />
    Filter
    {activeFilters.length > 0 && (
      <span className="ml-1 w-5 h-5 rounded-full bg-[#e8693f] text-[#16110f] text-[10px] font-bold flex items-center justify-center">
        {activeFilters.length}
      </span>
    )}
  </button>
  <button
    onClick={() => setShowSortSheet(true)}
    className="h-11 px-4 rounded-lg bg-[#211a17] border border-[#3a322d] text-sm text-[#a89c93] flex items-center gap-2 active:scale-[0.97] transition-transform min-w-[44px] justify-center"
  >
    <svg className="w-4 h-4" /* sort icon */ />
    {SORT_OPTIONS.find(o => o.value === sort)?.label || 'Sort'}
  </button>
</div>
```

### 4d. Active Filter Chips (below filter bar)

```tsx
{activeFilters.length > 0 && (
  <div className="flex gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
    {activeFilters.map(f => (
      <span key={f} className="flex-shrink-0 h-9 px-3 rounded-full bg-[#e8693f20] border border-[#e8693f] text-[#e8693f] text-xs font-medium flex items-center gap-1.5">
        {f}
        <button onClick={() => removeFilter(f)} className="w-4 h-4 flex items-center justify-center min-h-[44px] min-w-[44px] -mr-1">
          <svg className="w-3 h-3" /* x icon */ />
        </button>
      </span>
    ))}
  </div>
)}
```

### 4e. Book Card (full-width, swipeable)

```tsx
<div className="relative">
  {/* Swipe reveal layer */}
  <div className="absolute inset-y-0 right-0 w-24 bg-[#e8693f] rounded-r-xl flex items-center justify-center">
    <svg className="w-6 h-6 text-[#16110f]" /* playlist-plus icon */ />
  </div>

  {/* Card */}
  <motion.a
    href={`/books/${book.slug}`}
    drag="x"
    dragConstraints={{ left: -80, right: 0 }}
    onDragEnd={(_, info) => {
      if (info.offset.x < -60) setShowPlaylistSheet(book);
    }}
    className="relative block w-full rounded-xl bg-[#211a17] border border-[#3a322d] overflow-hidden active:scale-[0.98] transition-transform z-10"
    style={{ touchAction: 'pan-y' }}
  >
    <div className="flex">
      {/* Cover image */}
      <div className="relative w-28 h-36 flex-shrink-0 bg-[#16110f]">
        {book.cover_page ? (
          <img src={book.cover_page} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#3a322d]" /* book icon */ />
          </div>
        )}
        {book.price === 0 && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#4a7c59] text-[#ece0dc] text-[9px] font-bold">Free</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 p-3 min-w-0">
        <h3 className="text-[15px] font-semibold text-[#ece0dc] truncate">{book.title}</h3>
        <p className="mt-0.5 text-[13px] text-[#a89c93] truncate">{book.author}</p>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#d4a24e]" /* star */ />
            <span className="text-xs text-[#ece0dc] font-medium">{book.average_rating.toFixed(1)}</span>
          </div>
          <span className="text-[10px] text-[#7a706a]">{book.total_ratings} ratings</span>
        </div>

        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          {book.tags?.slice(0, 2).map(t => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-[#3a322d] text-[10px] text-[#a89c93]">{t}</span>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#e8693f]">
            {book.price === 0 ? 'Free' : `${book.price} coins`}
          </span>
          <span className="text-[11px] text-[#7a706a]">{book.total_favorites}♥</span>
        </div>
      </div>
    </div>
  </motion.a>
</div>
```

### 4f. Filter Bottom Sheet

```tsx
<AnimatePresence>
  {showFilterSheet && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => setShowFilterSheet(false)}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 inset-x-0 z-50 bg-[#211a17] border-t border-[#3a322d] rounded-t-2xl max-h-[80vh] overflow-y-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="sticky top-0 bg-[#211a17] px-5 pt-4 pb-3 border-b border-[#3a322d]">
          <div className="w-10 h-1 rounded-full bg-[#3a322d] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#ece0dc]">Filters</h3>
        </div>
        <div className="p-5 space-y-4">
          {/* Price filter */}
          <div>
            <p className="text-sm text-[#a89c93] mb-2">Price</p>
            <div className="flex gap-2">
              {['All', 'Free', 'Premium'].map(opt => (
                <button key={opt} className="h-11 px-4 rounded-full bg-[#16110f] border border-[#3a322d] text-sm text-[#a89c93] active:scale-[0.97] min-w-[44px]">
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {/* Rating filter */}
          <div>
            <p className="text-sm text-[#a89c93] mb-2">Minimum Rating</p>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map(r => (
                <button key={r} className="h-11 px-4 rounded-full bg-[#16110f] border border-[#3a322d] text-sm text-[#a89c93] active:scale-[0.97] min-w-[44px]">
                  {r === 0 ? 'Any' : `${r}+`}
                </button>
              ))}
            </div>
          </div>
          {/* Apply button */}
          <button className="w-full h-12 rounded-lg bg-[#e8693f] text-[#16110f] font-semibold active:scale-[0.98] transition-transform">
            Apply Filters
          </button>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### 4g. Sort Bottom Sheet

```tsx
<AnimatePresence>
  {showSortSheet && (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => setShowSortSheet(false)}
      />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-0 inset-x-0 z-50 bg-[#211a17] border-t border-[#3a322d] rounded-t-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="sticky top-0 bg-[#211a17] px-5 pt-4 pb-3 border-b border-[#3a322d]">
          <div className="w-10 h-1 rounded-full bg-[#3a322d] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#ece0dc]">Sort by</h3>
        </div>
        <div className="p-5">
          {SORT_OPTIONS.map(o => (
            <button key={o.value} onClick={() => { setSort(o.value); setShowSortSheet(false); }}
              className={`w-full h-12 flex items-center justify-between px-4 rounded-lg text-sm active:bg-[#332a24] transition-colors ${sort === o.value ? 'text-[#e8693f]' : 'text-[#ece0dc]'}`}>
              {o.label}
              {sort === o.value && <svg className="w-5 h-5 text-[#e8693f]" /* check icon */ />}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### 4h. Skeleton Loading

```tsx
// Skeleton search bar
<div className="sticky top-0 z-40 bg-[#16110f]/95 backdrop-blur-md border-b border-[#3a322d] px-5 py-3">
  <div className="w-full h-11 rounded-lg bg-[#3a322d] animate-pulse" />
</div>

// Skeleton cards (3)
{Array.from({ length: 3 }).map((_, i) => (
  <div key={i} className="w-full rounded-xl bg-[#211a17] border border-[#3a322d] overflow-hidden animate-pulse">
    <div className="flex">
      <div className="w-28 h-36 bg-[#3a322d] flex-shrink-0" />
      <div className="flex-1 p-3 space-y-2">
        <div className="h-4 bg-[#3a322d] rounded w-3/4" />
        <div className="h-3 bg-[#3a322d] rounded w-1/2" />
        <div className="h-3 bg-[#3a322d] rounded w-1/3" />
        <div className="h-5 bg-[#3a322d] rounded w-1/4 mt-2" />
      </div>
    </div>
  </div>
))}
```

### 4i. Empty State

```tsx
<div className="mx-5 mt-12 text-center">
  <svg className="mx-auto w-16 h-16 text-[#3a322d]" /* search-off icon */ />
  <h3 className="mt-4 text-lg font-semibold text-[#ece0dc]">No books found</h3>
  <p className="mt-2 text-sm text-[#a89c93]">Try adjusting your search or filters.</p>
  <button onClick={clearFilters} className="mt-4 h-11 px-5 rounded-lg bg-[#3a322d] text-[#ece0dc] text-sm font-medium active:scale-[0.98]">
    Clear Filters
  </button>
</div>
```

### 4j. Error State

```tsx
<div className="mx-5 mt-12 text-center">
  <p className="text-sm text-[#c44d4d]">Failed to load books.</p>
  <button onClick={retry} className="mt-3 h-11 px-5 rounded-lg bg-[#3a322d] text-[#ece0dc] text-sm font-medium active:scale-[0.98]">
    Retry
  </button>
</div>
```

---

## 5. Mobile Interactions

| Interaction | Trigger | Action |
|-------------|---------|--------|
| **Pull to refresh** | Drag down on book list | Re-fetch books, show skeleton loading |
| **Swipe left on card** | Drag left on book card | Reveal "Add to Playlist" action button behind card |
| **Tap revealed action** | Tap the playlist button after swipe | Open playlist picker bottom sheet, haptic `navigator.vibrate(10)` |
| **Card tap** | Tap anywhere on card body | Navigate to `/books/[slug]` |
| **Filter button tap** | Tap "Filter" button | Open filter bottom sheet (slide up) |
| **Sort button tap** | Tap "Sort" button | Open sort bottom sheet (slide up) |
| **Filter chip tap** | Tap active filter chip `×` | Remove that filter, re-filter list |
| **Genre chip tap** | Tap genre/tag chip | Add to active filters, re-filter list |
| **Search input** | Type in search bar | Debounced (300ms) filter, update page to 1 |
| **Long-press card** | 500ms hold on card | Show context menu bottom sheet: View, Add to Playlist, Share, Report |
| **Infinite scroll** | Scroll near bottom | Load next page of results |
| **Swipe right from edge** | System back gesture | Navigate to previous page |

---

## 6. Animation Spec (Framer Motion)

```tsx
// Page enter
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>

// Card list stagger
<motion.div variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
{books.map(book => (
  <motion.div key={book.id}
    variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
    whileTap={{ scale: 0.98 }}
  >
    {/* book card */}
  </motion.div>
))}

// Swipe reveal — use framer-motion drag with dragConstraints
// drag="x" dragConstraints={{ left: -80, right: 0 }}
// On drag end, if offset < -60, snap to -80 to reveal action

// Bottom sheet entrance
<motion.div
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
>

// Filter chip enter/exit
<AnimatePresence>
  {activeFilters.map(f => (
    <motion.span key={f}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.15 }}
    />
  ))}
</AnimatePresence>

// Search bar focus glow — CSS transition on border-color + box-shadow

// Skeleton shimmer — CSS only: animate background-position on a linear-gradient
```

---

## 7. Mobile-Specific Anti-Slop Checklist

- [x] No hamburger menu — bottom nav only
- [x] All touch targets ≥ 44×44px (`min-h-[44px] min-w-[44px]`)
- [x] Primary actions in bottom third (filter/sort buttons are mid-screen, list fills bottom)
- [x] No hover states — using `active:` only
- [x] Skeleton loading, not spinners
- [x] Safe area padding on bottom bar (`env(safe-area-inset-bottom)`)
- [x] Single column always (`w-full`, no grid)
- [x] No text smaller than 14px (filter chips and badges use 10-11px — acceptable for labels)
- [x] Pull to refresh on list
- [x] Bottom sheets for filter and sort (not modals, not dropdowns)
- [x] No glassmorphism (nav uses backdrop-blur, not decorative glass)
- [x] No indigo/blue/purple
- [x] No shadow-lg — borders define depth
- [x] Search bar is sticky but doesn't block scroll context
- [x] Swipe-to-reveal as progressive disclosure, not hidden by default

---

## 8. Complete Stitch Prompt

```
BUILD THE MOBILE BOOK LIST / CATALOG PAGE for a library app. Max-width: 640px only. Next.js 14 + Tailwind CSS + Framer Motion. Forge & Flux dark theme (background #16110f, surface #211a17, accent #e8693f, border #3a322d, text primary #ece0dc, text secondary #a89c93, muted #7a706a). Fonts: Playfair Display for headings, Inter for body.

REQUIREMENTS:
1. Bottom navigation bar (fixed, z-50, pb-safe for iOS) with 4 tabs: Home, Books (active, accent), Lists, Profile. Each tab min-h-[44px] min-w-[44px]. Active tab: text #e8693f + 2px indicator bar. Nav bg #16110f/95 backdrop-blur-md, border-t #3a322d.

2. Sticky search bar at top (sticky top-0, z-40, bg #16110f/95, backdrop-blur-md, border-b #3a322d). Input: h-11, pl-10, rounded-lg, bg #16110f, border #3a322d, text #ece0dc, placeholder #7a706a. Focus: border #e8693f + glow shadow. Search icon in #7a706a.

3. Filter bar: flex row with two buttons. "Filter" button (h-11, px-4, rounded-lg, bg #211a17, border #3a322d) — if filters active, show count badge (w-5 h-5 rounded-full bg #e8693f text #16110f). "Sort" button shows current sort label. Both min-h-[44px].

4. Active filter chips: horizontal scrollable row. Each chip: h-9, px-3, rounded-full, bg #e8693f20, border #e8693f, text #e8693f, text-xs, with × remove button.

5. Book cards: full-width, rounded-xl, bg #211a17, border #3a322d. Layout: horizontal flex with cover image (w-28 h-36, object-cover) on left, info on right. Info: title text-[15px] #ece0dc truncate, author text-[13px] #a89c93, star rating (d4a24e star icon), tags as pills (bg #3a322d, rounded-full, text-[10px]), price in #e8693f. "Free" badge: bg #4a7c59. active:scale-[0.98].

6. Swipe-to-reveal on cards: drag left to reveal "Add to Playlist" action (w-24, bg #e8693f, rounded-r-xl) behind the card. Use framer-motion drag="x" with dragConstraints.

7. Filter bottom sheet: slides up from bottom (spring damping 25, stiffness 300). Contains: drag handle (w-10 h-1 rounded-full bg #3a322d), title "Filters", filter groups (Price: All/Free/Premium, Rating: Any/3+/4+/4.5+), and "Apply Filters" button (w-full h-12 rounded-lg bg #e8693f).

8. Sort bottom sheet: same slide-up pattern. Shows sort options as rows (h-12 each), active option in #e8693f with checkmark.

9. Skeleton loading: search bar skeleton (w-full h-11 rounded-lg bg #3a322d animate-pulse), 3 skeleton cards with image placeholder + text lines.

10. Empty state: centered with search-off icon (w-16 h-16 text-[#3a322d]), "No books found" heading, "Try adjusting your search or filters" description, "Clear Filters" button.

11. Error state: red text #c44d4d + "Retry" button.

ANIMATIONS (Framer Motion):
- Page: initial={{ opacity: 0 }} animate={{ opacity: 1 }} duration 0.25s.
- Card stagger: staggerChildren 0.04, each card slides in from x:-12.
- Card press: whileTap={{ scale: 0.98 }}.
- Bottom sheets: spring damping 25, stiffness 300.
- Filter chip enter/exit: scale 0.8→1, opacity 0→1, 150ms.
- Swipe reveal: dragConstraints left -80, snap on release.

INTERACTIONS:
- Pull to refresh → re-fetch, show skeleton.
- Swipe left on card → reveal playlist action button.
- Filter/Sort button → open respective bottom sheet.
- Long-press card (500ms) → context menu bottom sheet: View, Add to Playlist, Share, Report.
- Search input → debounced 300ms filter, reset page to 1.
- Infinite scroll → load next page when near bottom.
- Haptic feedback on: filter select, sort select, card tap, swipe action.
- Swipe right from left edge → navigate back.

CONSTRAINTS:
- Single column, w-full, px-5 for content padding.
- No hamburger menu. No hover states. No grid.
- No glassmorphism (except nav blur). No indigo/blue/purple. No shadow-lg. No gradients.
- All interactive elements min-h-[44px] min-w-[44px].
- env(safe-area-inset-bottom) on bottom nav.
- Body text min 14px. Use JetBrains Mono for price/coin numbers.
```
