# 02 — Book List / Catalog (Tablet)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| **Page** | Books Catalog |
| **Route** | `/books` |
| **Component** | `app/books/page.tsx` (server) + `components/tablet/BookListTablet.tsx` (client) |
| **Nav Tab** | Books (second tab) — horizontal top nav |

---

## 2. Tablet Design Rationale

The book catalog is a high-density browsing surface. On tablet (641px–1024px), the 2-column grid doubles visible titles compared to mobile's single column. Filters sit inline as a horizontal bar above the grid — no bottom sheet needed since there's room for dropdowns and chips. The search bar lives in the top nav (shared across pages) so the catalog starts with maximum vertical space for books. Sort becomes a dropdown menu instead of a bottom sheet. Pagination replaces infinite scroll with visible page numbers — tablet users expect this pattern. Hover states activate for all cards and controls. `px-6` padding gives breathing room. The filter bar uses `border-b border-[#3a322d]` to visually separate from the grid without wasting space.

---

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────┐
│  Top Navigation Bar                               │  sticky top-0, z-50
│  [Logo] [Search bar............] [Home] [Books]   │  h-14, px-6
│  [Lists] [Profile]                                │
├──────────────────────────────────────────────────┤
│  Filter bar (inline, horizontal)                  │  px-6, py-3, border-b
│  [Price ▼] [Rating ▼] [Genre ▼] [Sort ▼]        │
│  [Active chips: Free ×] [4+ ★ ×]                  │
├──────────────────────────────────────────────────┤
│  Results count + view toggle                      │  px-6, py-2
│  "24 books found" [Grid] [List]                   │
├──────────────────────────────────────────────────┤
│  Book grid (2 columns)                            │  px-6, grid-cols-2, gap-4
│  ┌──────────────┐  ┌──────────────┐              │
│  │ Book card     │  │ Book card     │              │
│  │ (cover+h-48) │  │ (cover+h-48) │              │
│  │ title + meta  │  │ title + meta  │              │
│  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐              │
│  │ Book card     │  │ Book card     │              │
│  └──────────────┘  └──────────────┘              │
│  ...                                              │
├──────────────────────────────────────────────────┤
│  Pagination                                       │  px-6, py-6
│  [< Prev] [1] [2] [3] ... [8] [Next >]           │
└──────────────────────────────────────────────────┘
```

- **Top nav**: same as home — `sticky top-0 z-50`
- **Filter bar**: `border-b border-[#3a322d]`, `flex gap-3`, buttons + chips
- **Grid**: `grid-cols-2 gap-4`, cards fill available width
- **Pagination**: `flex items-center justify-center gap-2`

---

## 4. Component Breakdown

### 4a. Top Navigation Bar

```tsx
<nav className="sticky top-0 z-50 bg-[#16110f] border-b border-[#3a322d]">
  <div className="max-w-5xl mx-auto flex items-center h-14 px-6 gap-6">
    <a href="/" className="flex-shrink-0 flex items-center gap-2">
      <svg className="w-7 h-7 text-[#e8693f]" /* logo icon */ />
      <span className="text-lg font-bold text-[#ece0dc] font-['Playfair_Display']">Genu</span>
    </a>
    <div className="flex-1 max-w-md relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a706a]" /* search icon */ />
      <input
        type="search"
        placeholder="Search by title, author..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#211a17] border border-[#3a322d] text-sm text-[#ece0dc] placeholder:text-[#7a706a] focus:outline-none focus:border-[#e8693f] focus:shadow-[0_0_0_3px_rgba(232,105,63,0.15)] transition-colors hover:border-[#4d433d]"
        aria-label="Search books"
      />
    </div>
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
    <a href="/profile" className="flex-shrink-0 w-9 h-9 rounded-full bg-[#e8693f20] border border-[#3a322d] flex items-center justify-center text-[#e8693f] text-sm font-semibold hover:border-[#e8693f] transition-colors min-h-[40px] min-w-[40px]">
      {user?.initials || 'U'}
    </a>
  </div>
</nav>
```

### 4b. Inline Filter Bar

```tsx
<div className="border-b border-[#3a322d] bg-[#16110f]">
  <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-3 flex-wrap">
    {/* Price dropdown */}
    <div className="relative">
      <button
        onClick={() => toggleDropdown('price')}
        className="h-10 px-4 rounded-lg bg-[#211a17] border border-[#3a322d] text-sm text-[#a89c93] flex items-center gap-2 hover:bg-[#2a211c] hover:border-[#4d433d] transition-colors min-h-[40px] min-w-[40px]"
      >
        <svg className="w-4 h-4" /* dollar icon */ />
        Price
        <svg className="w-3 h-3" /* chevron-down */ />
      </button>
      {activeDropdown === 'price' && (
        <div className="absolute top-full left-0 mt-1 w-40 rounded-xl bg-[#211a17] border border-[#3a322d] shadow-[0_4px_24px_rgba(0,0,0,0.4)] z-50 overflow-hidden">
          {['All', 'Free', 'Premium'].map(opt => (
            <button key={opt} onClick={() => { setPriceFilter(opt); closeDropdown(); }}
              className={`w-full h-10 px-4 text-left text-sm flex items-center hover:bg-[#2a211c] transition-colors ${priceFilter === opt ? 'text-[#e8693f]' : 'text-[#ece0dc]'}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Rating dropdown */}
    <div className="relative">
      <button
        onClick={() => toggleDropdown('rating')}
        className="h-10 px-4 rounded-lg bg-[#211a17] border border-[#3a322d] text-sm text-[#a89c93] flex items-center gap-2 hover:bg-[#2a211c] hover:border-[#4d433d] transition-colors min-h-[40px] min-w-[40px]"
      >
        <svg className="w-4 h-4" /* star icon */ />
        Rating
        <svg className="w-3 h-3" /* chevron-down */ />
      </button>
      {activeDropdown === 'rating' && (
        <div className="absolute top-full left-0 mt-1 w-32 rounded-xl bg-[#211a17] border border-[#3a322d] shadow-[0_4px_24px_rgba(0,0,0,0.4)] z-50 overflow-hidden">
          {[0, 3, 4, 4.5].map(r => (
            <button key={r} onClick={() => { setMinRating(r); closeDropdown(); }}
              className={`w-full h-10 px-4 text-left text-sm flex items-center hover:bg-[#2a211c] transition-colors ${minRating === r ? 'text-[#e8693f]' : 'text-[#ece0dc]'}`}>
              {r === 0 ? 'Any' : `${r}+ stars`}
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Genre dropdown */}
    <div className="relative">
      <button
        onClick={() => toggleDropdown('genre')}
        className="h-10 px-4 rounded-lg bg-[#211a17] border border-[#3a322d] text-sm text-[#a89c93] flex items-center gap-2 hover:bg-[#2a211c] hover:border-[#4d433d] transition-colors min-h-[40px] min-w-[40px]"
      >
        <svg className="w-4 h-4" /* tag icon */ />
        Genre
        <svg className="w-3 h-3" /* chevron-down */ />
      </button>
      {activeDropdown === 'genre' && (
        <div className="absolute top-full left-0 mt-1 w-44 rounded-xl bg-[#211a17] border border-[#3a322d] shadow-[0_4px_24px_rgba(0,0,0,0.4)] z-50 max-h-60 overflow-y-auto">
          {genres.map(g => (
            <button key={g} onClick={() => { toggleGenre(g); }}
              className={`w-full h-10 px-4 text-left text-sm flex items-center hover:bg-[#2a211c] transition-colors ${selectedGenres.includes(g) ? 'text-[#e8693f]' : 'text-[#ece0dc]'}`}>
              {g}
            </button>
          ))}
        </div>
      )}
    </div>

    {/* Sort dropdown */}
    <div className="relative ml-auto">
      <button
        onClick={() => toggleDropdown('sort')}
        className="h-10 px-4 rounded-lg bg-[#211a17] border border-[#3a322d] text-sm text-[#a89c93] flex items-center gap-2 hover:bg-[#2a211c] hover:border-[#4d433d] transition-colors min-h-[40px] min-w-[40px]"
      >
        <svg className="w-4 h-4" /* sort icon */ />
        {SORT_OPTIONS.find(o => o.value === sort)?.label || 'Sort'}
        <svg className="w-3 h-3" /* chevron-down */ />
      </button>
      {activeDropdown === 'sort' && (
        <div className="absolute top-full right-0 mt-1 w-48 rounded-xl bg-[#211a17] border border-[#3a322d] shadow-[0_4px_24px_rgba(0,0,0,0.4)] z-50 overflow-hidden">
          {SORT_OPTIONS.map(o => (
            <button key={o.value} onClick={() => { setSort(o.value); closeDropdown(); }}
              className={`w-full h-10 px-4 text-left text-sm flex items-center justify-between hover:bg-[#2a211c] transition-colors ${sort === o.value ? 'text-[#e8693f]' : 'text-[#ece0dc]'}`}>
              {o.label}
              {sort === o.value && <svg className="w-4 h-4 text-[#e8693f]" /* check icon */ />}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
</div>
```

### 4c. Active Filter Chips

```tsx
{activeFilters.length > 0 && (
  <div className="border-b border-[#3a322d] bg-[#16110f]">
    <div className="max-w-5xl mx-auto px-6 py-2 flex items-center gap-2 flex-wrap">
      {activeFilters.map(f => (
        <span key={f} className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-[#e8693f20] border border-[#e8693f] text-[#e8693f] text-xs font-medium">
          {f}
          <button onClick={() => removeFilter(f)} className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-[#e8693f30] min-h-[40px] min-w-[40px] -mr-1">
            <svg className="w-3 h-3" /* x icon */ />
          </button>
        </span>
      ))}
      <button onClick={clearAllFilters} className="text-xs text-[#7a706a] hover:text-[#a89c93] transition-colors ml-1 min-h-[40px] min-w-[40px] flex items-center">
        Clear all
      </button>
    </div>
  </div>
)}
```

### 4d. Results Count + View Toggle

```tsx
<div className="max-w-5xl mx-auto px-6 py-2 flex items-center justify-between">
  <p className="text-sm text-[#a89c93]">
    <span className="text-[#ece0dc] font-medium">{totalResults}</span> books found
  </p>
  <div className="flex items-center gap-1 rounded-lg bg-[#211a17] border border-[#3a322d] p-0.5">
    <button onClick={() => setViewMode('grid')}
      className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-[#e8693f20] text-[#e8693f]' : 'text-[#7a706a] hover:text-[#a89c93]'}`}>
      <svg className="w-4 h-4" /* grid icon */ />
    </button>
    <button onClick={() => setViewMode('list')}
      className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-[#e8693f20] text-[#e8693f]' : 'text-[#7a706a] hover:text-[#a89c93]'}`}>
      <svg className="w-4 h-4" /* list icon */ />
    </button>
  </div>
</div>
```

### 4e. Book Card (grid view — tablet 2-column)

```tsx
<a href={`/books/${book.slug}`}
   className="block rounded-xl bg-[#211a17] border border-[#3a322d] overflow-hidden hover:border-[#4d433d] hover:bg-[#2a211c] active:scale-[0.98] transition-all group">
  <div className="relative w-full h-48 bg-[#16110f]">
    {book.cover_page ? (
      <img src={book.cover_page} alt={book.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <svg className="w-12 h-12 text-[#3a322d]" /* book placeholder icon */ />
      </div>
    )}
    {book.price === 0 && (
      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#4a7c59] text-[#ece0dc] text-[10px] font-semibold">Free</span>
    )}
  </div>
  <div className="p-4">
    <h3 className="text-base font-semibold text-[#ece0dc] truncate">{book.title}</h3>
    <p className="mt-0.5 text-sm text-[#a89c93] truncate">{book.author}</p>
    <div className="mt-2 flex items-center gap-2">
      <svg className="w-4 h-4 text-[#d4a24e]" /* star icon */ />
      <span className="text-sm text-[#ece0dc] font-medium">{book.average_rating.toFixed(1)}</span>
      <span className="text-xs text-[#7a706a]">({book.total_ratings})</span>
    </div>
    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
      {book.tags?.slice(0, 3).map(t => (
        <span key={t} className="px-2 py-0.5 rounded-full bg-[#16110f] border border-[#3a322d] text-[11px] text-[#a89c93]">{t}</span>
      ))}
    </div>
    <div className="mt-3 flex items-center justify-between">
      <span className="text-sm font-semibold text-[#e8693f] font-['JetBrains_Mono']">
        {book.price === 0 ? 'Free' : `${book.price} coins`}
      </span>
      <span className="text-xs text-[#7a706a]">{book.total_favorites}♥</span>
    </div>
  </div>
</a>
```

### 4f. Book Card (list view — alternative)

```tsx
<a href={`/books/${book.slug}`}
   className="flex rounded-xl bg-[#211a17] border border-[#3a322d] overflow-hidden hover:border-[#4d433d] hover:bg-[#2a211c] active:scale-[0.98] transition-all">
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
  <div className="flex-1 p-3 min-w-0">
    <h3 className="text-[15px] font-semibold text-[#ece0dc] truncate">{book.title}</h3>
    <p className="text-[13px] text-[#a89c93] truncate">{book.author}</p>
    <div className="mt-1.5 flex items-center gap-2">
      <div className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5 text-[#d4a24e]" /* star */ />
        <span className="text-xs text-[#ece0dc] font-medium">{book.average_rating.toFixed(1)}</span>
      </div>
      <span className="text-[10px] text-[#7a706a]">{book.total_ratings} ratings</span>
    </div>
    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
      {book.tags?.slice(0, 2).map(t => (
        <span key={t} className="px-2 py-0.5 rounded-full bg-[#3a322d] text-[10px] text-[#a89c93]">{t}</span>
      ))}
    </div>
    <div className="mt-2 flex items-center justify-between">
      <span className="text-sm font-semibold text-[#e8693f] font-['JetBrains_Mono']">
        {book.price === 0 ? 'Free' : `${book.price} coins`}
      </span>
      <span className="text-[11px] text-[#7a706a]">{book.total_favorites}♥</span>
    </div>
  </div>
</a>
```

### 4g. Pagination

```tsx
<div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-center gap-2">
  <button
    onClick={() => setPage(p => Math.max(1, p - 1))}
    disabled={currentPage <= 1}
    className="h-10 px-3 rounded-lg bg-[#211a17] border border-[#3a322d] text-sm text-[#a89c93] flex items-center gap-1 hover:bg-[#2a211c] hover:border-[#4d433d] disabled:opacity-30 transition-colors min-h-[40px]"
  >
    <svg className="w-4 h-4" /* chevron-left */ />
    Prev
  </button>

  {pageNumbers.map(p => (
    <button
      key={p}
      onClick={() => setPage(p)}
      className={`h-10 w-10 rounded-lg text-sm font-medium flex items-center justify-center transition-colors min-h-[40px] min-w-[40px] ${
        p === currentPage
          ? 'bg-[#e8693f] text-[#16110f]'
          : 'bg-[#211a17] border border-[#3a322d] text-[#a89c93] hover:bg-[#2a211c] hover:border-[#4d433d]'
      }`}
    >
      {p}
    </button>
  ))}

  <button
    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
    disabled={currentPage >= totalPages}
    className="h-10 px-3 rounded-lg bg-[#211a17] border border-[#3a322d] text-sm text-[#a89c93] flex items-center gap-1 hover:bg-[#2a211c] hover:border-[#4d433d] disabled:opacity-30 transition-colors min-h-[40px]"
  >
    Next
    <svg className="w-4 h-4" /* chevron-right */ />
  </button>
</div>
```

### 4h. Skeleton Loading

```tsx
<div className="grid grid-cols-2 gap-4 px-6">
  {Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="rounded-xl bg-[#211a17] border border-[#3a322d] overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-[#3a322d]" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-[#3a322d] rounded w-3/4" />
        <div className="h-3 bg-[#3a322d] rounded w-1/2" />
        <div className="h-3 bg-[#3a322d] rounded w-1/3" />
        <div className="flex gap-1.5 mt-2">
          <div className="h-4 w-12 bg-[#3a322d] rounded-full" />
          <div className="h-4 w-12 bg-[#3a322d] rounded-full" />
        </div>
        <div className="h-4 bg-[#3a322d] rounded w-1/4 mt-2" />
      </div>
    </div>
  ))}
</div>
```

### 4i. Empty State

```tsx
<div className="px-6 mt-12 text-center">
  <div className="max-w-md mx-auto">
    <svg className="mx-auto w-14 h-14 text-[#3a322d]" /* search-off icon */ />
    <h3 className="mt-4 text-lg font-semibold text-[#ece0dc]">No books found</h3>
    <p className="mt-2 text-sm text-[#a89c93]">Try adjusting your search or filters.</p>
    <button onClick={clearAllFilters} className="mt-4 h-10 px-5 rounded-lg bg-[#3a322d] text-[#ece0dc] text-sm font-medium hover:bg-[#4d433d] active:scale-[0.98] min-h-[40px] min-w-[40px]">
      Clear Filters
    </button>
  </div>
</div>
```

### 4j. Error State

```tsx
<div className="px-6 mt-12 text-center">
  <div className="max-w-md mx-auto rounded-xl bg-[#211a17] border border-[#c44d4d]/30 p-6">
    <p className="text-sm text-[#c44d4d]">Failed to load books.</p>
    <button onClick={retry} className="mt-3 h-10 px-5 rounded-lg bg-[#3a322d] text-[#ece0dc] text-sm font-medium hover:bg-[#4d433d] active:scale-[0.98] min-h-[40px] min-w-[40px]">
      Retry
    </button>
  </div>
</div>
```

---

## 5. Tablet Interactions

| Interaction | Trigger | Action |
|-------------|---------|--------|
| **Hover on book card** | Pointer enter card | Border lightens to `#4d433d`, bg shifts to `#2a211c`, cover image scales up 2% |
| **Card click** | Click on book card | Navigate to `/books/[slug]`, scale animation |
| **Filter dropdown open** | Click filter button | Show dropdown menu with options, close others |
| **Dropdown option select** | Click option in dropdown | Set filter value, close dropdown, re-fetch books |
| **Active chip remove** | Click × on chip | Remove filter, re-fetch books |
| **Clear all** | Click "Clear all" | Reset all filters, re-fetch |
| **Sort select** | Click sort option | Set sort, close dropdown, re-fetch |
| **View mode toggle** | Click grid/list icon | Switch between 2-column grid and list view |
| **Pagination click** | Click page number or Prev/Next | Navigate to page, scroll to top of grid |
| **Search input** | Type in nav search bar | Debounced (300ms) filter, reset page to 1 |
| **Keyboard navigation** | Tab/Enter | Focus-visible rings, Enter activates links/buttons |
| **Hover on pagination** | Pointer enter page button | Border lightens to `#4d433d` |
| **Hover on filter chip** | Pointer enter chip × | Chip × background darkens |

---

## 6. Animation Spec (Framer Motion)

```tsx
// Page enter
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
>

// Card grid stagger
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.05 } }
  }}
>

// Each card
<motion.a
  variants={{
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 }
  }}
  whileHover={{ y: -3 }}
  whileTap={{ scale: 0.98 }}
  layout
>

// Dropdown open/close
<motion.div
  initial={{ opacity: 0, y: -8, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -8, scale: 0.95 }}
  transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
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

// View mode transition
<motion.div layout transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>

// Pagination page change — grid crossfade
<motion.div
  key={currentPage}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.2 }}
>

// Skeleton shimmer — CSS: background linear-gradient, animate background-position
```

---

## 7. Tablet-Specific Anti-Slop Checklist

- [x] Horizontal top nav only — NO bottom nav bar
- [x] All interactive elements ≥ 40×40px (`min-h-[40px] min-w-[40px]`)
- [x] Hover states enabled on cards, buttons, chips, pagination
- [x] 2-column book card grid (`grid-cols-2`)
- [x] Inline filter bar as horizontal row (not bottom sheet)
- [x] Dropdown menus for filters and sort (not modals, not bottom sheets)
- [x] Search bar in top nav, not a separate sticky bar
- [x] Pagination with visible page numbers (not infinite scroll)
- [x] Skeleton loading, not spinners
- [x] `px-6` (24px) content padding
- [x] Active filter chips inline with clear-all option
- [x] View mode toggle (grid/list) for user preference
- [x] No glassmorphism — solid backgrounds only
- [x] No indigo/blue/purple — Forge & Flux palette only
- [x] No shadow-lg — borders define depth, dropdowns use elevation-2
- [x] No gradient backgrounds on cards
- [x] Focus-visible rings on all interactive elements
- [x] Cover image subtle scale on hover (2% max)
- [x] Max content width: `max-w-5xl mx-auto`
- [x] Results count visible above grid

---

## 8. Complete Stitch Prompt

```
BUILD THE TABLET BOOK LIST / CATALOG PAGE for a library app. Breakpoint: 641px–1024px only. Next.js 14 + Tailwind CSS + Framer Motion. Forge & Flux dark theme (background #16110f, surface #211a17, surface hover #2a211c, accent #e8693f, accent hover #d45a30, accent muted #e8693f20, border #3a322d, border hover #4d433d, text primary #ece0dc, text secondary #a89c93, muted #7a706a). Fonts: Playfair Display for headings, Inter for body, JetBrains Mono for prices.

REQUIREMENTS:
1. Horizontal top navigation bar (sticky top-0, z-50, bg #16110f, border-b #3a322d). Contains: logo (w-7 h-7 accent + "Genu" Playfair), search bar (flex-1 max-w-md, h-10, bg #211a17, border #3a322d, focus: border #e8693f + glow), nav links (Home, Books active: bg-[#e8693f20] text-[#e8693f], Lists), profile avatar (w-9 h-9 rounded-full). All items min-h-[40px] min-w-[40px]. NO bottom nav.

2. Inline filter bar (border-b #3a322d, bg #16110f, max-w-5xl mx-auto, px-6 py-3, flex gap-3 flex-wrap). Four dropdown trigger buttons: Price, Rating, Genre, Sort. Each button: h-10 px-4 rounded-lg bg #211a17 border #3a322d, text-sm #a89c93, icon + label + chevron-down. Hover: bg #2a211c border #4d433d. Active dropdown shows: absolute top-full dropdown panel (rounded-xl bg #211a17 border #3a322d shadow-[0_4px_24px_rgba(0,0,0,0.4)]), options as h-10 rows with hover:bg-[#2a211c], active option in #e8693f. Sort dropdown positioned right (ml-auto).

3. Active filter chips (border-b #3a322d, px-6 py-2, flex gap-2 flex-wrap). Each chip: h-8 px-3 rounded-full bg #e8693f20 border #e8693f text #e8693f text-xs, with × remove button. "Clear all" text link.

4. Results count + view toggle (max-w-5xl mx-auto px-6 py-2, flex justify-between). Count: "N books found" with number in #ece0dc font-medium. View toggle: rounded-lg bg #211a17 border #3a322d, two icon buttons (grid/list), active: bg-[#e8693f20] text-[#e8693f].

5. Book cards grid (max-w-5xl mx-auto px-6, grid-cols-2 gap-4). Each card: rounded-xl bg #211a17 border #3a322d overflow-hidden. Cover: w-full h-48 object-cover, group-hover:scale-[1.02] transition. Title: text-base font-semibold #ece0dc truncate. Author: text-sm #a89c93. Star rating: #d4a24e star + number. Tags: up to 3 pills (bg #16110f border #3a322d rounded-full text-[11px] #a89c93). Price: text-sm font-semibold JetBrains Mono #e8693f. "Free" badge: bg #4a7c59 text-[10px]. Hover: border #4d433d bg #2a211c. active:scale-[0.98].

6. List view alternative: flex row with cover w-28 h-36 on left, info on right (same as mobile book card pattern). Toggle via view mode.

7. Pagination (max-w-5xl mx-auto px-6 py-6, flex justify-center gap-2). Prev/Next buttons: h-10 px-3 rounded-lg bg #211a17 border #3a322d, hover: bg #2a211c border #4d433d. Page number buttons: h-10 w-10 rounded-lg. Active page: bg #e8693f text #16110f. Inactive: bg #211a17 border #3a322d text #a89c93 hover: bg #2a211c. All min-h-[40px] min-w-[40px].

8. Skeleton loading: grid-cols-2 gap-4, 6 skeleton cards. Each: rounded-xl bg #211a17 border #3a322d, h-48 image + 3 text lines + 2 pill placeholders, animate-pulse bg #3a322d.

9. Empty state: max-w-md mx-auto, centered, w-14 h-14 icon, "No books found" heading, description, "Clear Filters" button (h-10 px-5 bg #3a322d hover:bg-[#4d433d]).

10. Error state: max-w-md mx-auto, rounded-xl bg #211a17 border-[#c44d4d]/30, error text #c44d4d, "Retry" button.

ANIMATIONS (Framer Motion):
- Page: initial={{ opacity: 0 }} animate={{ opacity: 1 }} duration 0.25s.
- Card grid: staggerChildren 0.05, each card fades up from y:16 scale 0.97.
- Card hover: whileHover={{ y: -3 }} subtle lift.
- Card press: whileTap={{ scale: 0.98 }}.
- Card layout: layout prop for smooth grid↔list transitions (duration 0.3s).
- Dropdown: initial={{ opacity: 0, y: -8, scale: 0.95 }} spring cubic-bezier(0.34, 1.56, 0.64, 1) duration 0.15s.
- Filter chip: scale 0.8→1, opacity 0→1, 150ms.
- Page change: crossfade opacity 0→1, 0.2s.
- Skeleton shimmer: CSS gradient animation.

INTERACTIONS:
- Hover on card → border #4d433d, bg #2a211c, cover scales 2%.
- Click card → navigate to /books/[slug], scale animation.
- Filter dropdown → open on click, close on outside click or option select.
- Dropdown option → set filter, close dropdown, re-fetch.
- Active chip × → remove filter, re-fetch.
- Clear all → reset all filters.
- Sort select → set sort, close, re-fetch.
- View mode toggle → switch grid/list with layout animation.
- Pagination → navigate page, scroll to top of grid.
- Search → debounced 300ms, reset page to 1.
- Keyboard: Tab through controls, Enter to activate. Focus-visible:ring-2 ring-[#e8693f].

CONSTRAINTS:
- 2-column grid for book cards, max-w-5xl mx-auto.
- Horizontal top nav, NO bottom nav. NO hamburger menu.
- Hover states enabled.
- Inline filter bar, NOT bottom sheets or modals for filters.
- Dropdown menus close on outside click.
- px-6 for all content padding.
- All interactive elements min-h-[40px] min-w-[40px].
- No glassmorphism. No indigo/blue/purple. No shadow-lg. No gradients.
- Body text min 14px. JetBrains Mono for prices.
- Focus-visible rings on all interactive elements.
- Pagination visible with page numbers.
- Results count and view mode toggle visible above grid.
```
