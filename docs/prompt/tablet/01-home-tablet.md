# 01 — Home Page (Tablet)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| **Page** | Home / Dashboard |
| **Route** | `/` |
| **Component** | `app/page.tsx` (server) + `components/tablet/HomeTablet.tsx` (client) |
| **Nav Tab** | Home (first tab) — horizontal top nav, not bottom bar |

---

## 2. Tablet Design Rationale

The home page on tablet (641px–1024px) exploits horizontal space that mobile can't offer. The top navigation replaces the bottom bar — bottom nav wastes vertical space on a landscape-oriented tablet where thumbs aren't anchored to the bottom. A 2-column book grid lets users scan more titles without scrolling. The hero section and featured carousel sit side-by-side, using the full width for immersion. Stats counters expand to a 3-column row since there's room. Genre chips wrap naturally into 2 rows instead of a horizontal scroll. The CTA section breathes with `max-w-2xl mx-auto` centering. All interactive elements drop to `min-h-[40px] min-w-[40px]` — accessible on tablet where fingers are larger but not phone-small. Hover states activate since tablet users often have a pointer available (stylus, trackpad, mouse).

---

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────┐
│  Top Navigation Bar                               │  sticky top-0, z-50, bg #16110f
│  [Logo] [Search bar............] [Books] [Lists]  │  h-14, px-6, border-b #3a322d
│  [Profile avatar]                                  │
├──────────────────────────────────────────────────┤
│  Page scroll container                            │  overflow-y-auto
│  ┌──────────────────────────────────────────────┐ │
│  │ Hero + Featured (side-by-side)               │ │  px-6, mt-6, gap-6, flex
│  │ ┌─────────────────┐ ┌──────────────────────┐ │ │
│  │ │ Welcome card     │ │ Featured carousel    │ │ │
│  │ │ (brand + CTA)    │ │ (2 cards visible)    │ │ │
│  │ └─────────────────┘ └──────────────────────┘ │ │
│  ├──────────────────────────────────────────────┤ │
│  │ Quick Actions row (3 cards, flex gap-4)      │ │  px-6
│  │ [Browse] [New Book] [My Lists]               │ │
│  ├──────────────────────────────────────────────┤ │
│  │ Stats row (3 stat cards, grid-cols-3)        │ │  px-6, gap-4
│  │ [Total Books] [Free] [New This Week]         │ │
│  ├──────────────────────────────────────────────┤ │
│  │ Recently Added section                       │ │
│  │ Book cards: 2-column grid                    │ │  px-6, grid-cols-2, gap-4
│  │ ┌──────────┐ ┌──────────┐                    │ │
│  │ │ Card 1   │ │ Card 2   │                    │ │
│  │ ├──────────┤ ├──────────┤                    │ │
│  │ │ Card 3   │ │ Card 4   │                    │ │
│  │ └──────────┘ └──────────┘                    │ │
│  ├──────────────────────────────────────────────┤ │
│  │ Trending section                             │ │
│  │ Book cards: 2-column grid                    │ │  px-6, grid-cols-2, gap-4
│  ├──────────────────────────────────────────────┤ │
│  │ Genre chips (flex-wrap, 2 rows)              │ │  px-6, gap-2
│  │ [Fiction] [Sci-Fi] [History] [Poetry] ...    │ │
│  ├──────────────────────────────────────────────┤ │
│  │ CTA section (centered, max-w-2xl)            │ │  px-6, mb-8
│  └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

- **Scroll container**: `overflow-y-auto`, no pull-to-refresh (pointer-based tablet)
- **Content padding**: `px-6` (24px) on all sections
- **Section spacing**: `space-y-8` between sections
- **Max content width**: `max-w-5xl mx-auto` to prevent overly long lines on landscape tablets
- **No bottom nav**: replaced by horizontal top nav

---

## 4. Component Breakdown

### 4a. Top Navigation Bar

```tsx
<nav className="sticky top-0 z-50 bg-[#16110f] border-b border-[#3a322d]">
  <div className="max-w-5xl mx-auto flex items-center h-14 px-6 gap-6">
    {/* Logo */}
    <a href="/" className="flex-shrink-0 flex items-center gap-2">
      <svg className="w-7 h-7 text-[#e8693f]" /* logo icon */ />
      <span className="text-lg font-bold text-[#ece0dc] font-['Playfair_Display']">Genu</span>
    </a>

    {/* Search bar — expanded for tablet */}
    <div className="flex-1 max-w-md relative">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a706a]" /* search icon */ />
      <input
        type="search"
        placeholder="Search books, authors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#211a17] border border-[#3a322d] text-sm text-[#ece0dc] placeholder:text-[#7a706a] focus:outline-none focus:border-[#e8693f] focus:shadow-[0_0_0_3px_rgba(232,105,63,0.15)] transition-colors hover:border-[#4d433d]"
      />
    </div>

    {/* Nav links */}
    <div className="flex items-center gap-1">
      <a href="/" className="h-10 px-4 rounded-lg bg-[#e8693f20] text-[#e8693f] text-sm font-medium flex items-center min-h-[40px] min-w-[40px] justify-center hover:bg-[#e8693f30] transition-colors">
        Home
      </a>
      <a href="/books" className="h-10 px-4 rounded-lg text-[#a89c93] text-sm font-medium flex items-center min-h-[40px] min-w-[40px] justify-center hover:bg-[#2a211c] hover:text-[#ece0dc] transition-colors">
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

- Active nav link: `bg-[#e8693f20] text-[#e8693f]`
- Inactive nav links: `text-[#a89c93]`, hover → `bg-[#2a211c] text-[#ece0dc]`
- All interactive elements: `min-h-[40px] min-w-[40px]`

### 4b. Hero Card + Featured Carousel (side-by-side)

```tsx
<section className="px-6 mt-6">
  <div className="max-w-5xl mx-auto flex gap-6">
    {/* Hero card — left side */}
    <div className="flex-1 rounded-2xl bg-[#211a17] border border-[#3a322d] p-6 hover:border-[#4d433d] transition-colors">
      <p className="text-xs uppercase tracking-widest text-[#a89c93] font-medium">Welcome back</p>
      <h1 className="mt-2 text-3xl font-bold text-[#ece0dc] leading-tight font-['Playfair_Display']">
        Genu Library
      </h1>
      <p className="mt-2 text-base text-[#a89c93] leading-relaxed">
        Discover free & premium books, preview inline, leave reviews.
      </p>
      <a href="/books"
         className="mt-5 inline-flex items-center justify-center h-10 px-6 rounded-lg bg-[#e8693f] text-[#16110f] text-sm font-semibold hover:bg-[#d45a30] active:scale-[0.98] transition-all min-h-[40px] min-w-[40px]">
        Browse Books
      </a>
    </div>

    {/* Featured carousel — right side */}
    <div className="flex-1 rounded-2xl bg-[#211a17] border border-[#3a322d] overflow-hidden hover:border-[#4d433d] transition-colors">
      <div className="p-4 border-b border-[#3a322d]">
        <h2 className="text-base font-semibold text-[#ece0dc] font-['Playfair_Display']">Featured</h2>
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {featuredBooks.map(book => (
            <a key={book.id} href={`/books/${book.slug}`}
               className="snap-start flex-shrink-0 w-full p-4 flex gap-4 hover:bg-[#2a211c] transition-colors">
              <div className="w-20 h-28 flex-shrink-0 rounded-lg bg-[#16110f] overflow-hidden">
                {book.cover_page ? (
                  <img src={book.cover_page} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#3a322d]" /* book icon */ />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 py-1">
                <h3 className="text-sm font-semibold text-[#ece0dc] truncate">{book.title}</h3>
                <p className="text-xs text-[#a89c93] truncate">{book.author}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[#d4a24e]" /* star */ />
                  <span className="text-xs text-[#ece0dc] font-medium">{book.average_rating.toFixed(1)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        {/* Carousel dots */}
        <div className="flex justify-center gap-1.5 pb-3">
          {featuredBooks.map((_, i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentSlide ? 'bg-[#e8693f]' : 'bg-[#3a322d]'}`} />
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
```

### 4c. Quick Actions Row

```tsx
<section className="px-6 mt-8">
  <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4">
    <a href="/books" className="h-24 rounded-xl bg-[#211a17] border border-[#3a322d] flex flex-col items-center justify-center gap-2 hover:bg-[#2a211c] hover:border-[#4d433d] active:scale-[0.97] transition-all min-h-[40px]">
      <svg className="w-6 h-6 text-[#e8693f]" /* book icon */ />
      <span className="text-sm text-[#ece0dc] font-medium">Browse</span>
    </a>
    <a href="/books/new" className="h-24 rounded-xl bg-[#211a17] border border-[#3a322d] flex flex-col items-center justify-center gap-2 hover:bg-[#2a211c] hover:border-[#4d433d] active:scale-[0.97] transition-all min-h-[40px]">
      <svg className="w-6 h-6 text-[#e8693f]" /* plus icon */ />
      <span className="text-sm text-[#ece0dc] font-medium">New Book</span>
    </a>
    <a href="/playlists" className="h-24 rounded-xl bg-[#211a17] border border-[#3a322d] flex flex-col items-center justify-center gap-2 hover:bg-[#2a211c] hover:border-[#4d433d] active:scale-[0.97] transition-all min-h-[40px]">
      <svg className="w-6 h-6 text-[#e8693f]" /* list icon */ />
      <span className="text-sm text-[#ece0dc] font-medium">My Lists</span>
    </a>
  </div>
</section>
```

### 4d. Stats Row (3-column)

```tsx
<section className="px-6 mt-8">
  <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4">
    <div className="rounded-xl bg-[#211a17] border border-[#3a322d] p-4 text-center hover:border-[#4d433d] transition-colors">
      <p className="text-2xl font-bold text-[#ece0dc] font-['JetBrains_Mono']">{stats.totalBooks}</p>
      <p className="mt-1 text-xs text-[#a89c93]">Total Books</p>
    </div>
    <div className="rounded-xl bg-[#211a17] border border-[#3a322d] p-4 text-center hover:border-[#4d433d] transition-colors">
      <p className="text-2xl font-bold text-[#4a7c59] font-['JetBrains_Mono']">{stats.freeBooks}</p>
      <p className="mt-1 text-xs text-[#a89c93]">Free</p>
    </div>
    <div className="rounded-xl bg-[#211a17] border border-[#3a322d] p-4 text-center hover:border-[#4d433d] transition-colors">
      <p className="text-2xl font-bold text-[#e8693f] font-['JetBrains_Mono']">{stats.newThisWeek}</p>
      <p className="mt-1 text-xs text-[#a89c93]">New This Week</p>
    </div>
  </div>
</section>
```

### 4e. Section Header

```tsx
<div className="flex items-center justify-between px-6">
  <h2 className="text-xl font-semibold text-[#ece0dc] font-['Playfair_Display']">Recently Added</h2>
  <a href="/books" className="text-sm text-[#e8693f] font-medium hover:text-[#d45a30] active:scale-[0.97] min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors">See all</a>
</div>
```

### 4f. Book Card (tablet — 2-column grid item)

```tsx
<a href={`/books/${book.slug}`}
   className="block rounded-xl bg-[#211a17] border border-[#3a322d] overflow-hidden hover:border-[#4d433d] hover:bg-[#2a211c] active:scale-[0.98] transition-all">
  <div className="relative w-full h-52 bg-[#16110f]">
    {book.cover_page ? (
      <img src={book.cover_page} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
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
  </div>
</a>
```

### 4g. Genre Chips (flex-wrap, 2 rows)

```tsx
<section className="px-6">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-xl font-semibold text-[#ece0dc] font-['Playfair_Display'] mb-3">Browse by Genre</h2>
    <div className="flex flex-wrap gap-2">
      {genres.map(genre => (
        <button key={genre}
          className="h-10 px-4 rounded-full bg-[#211a17] border border-[#3a322d] text-sm text-[#a89c93] hover:bg-[#e8693f20] hover:border-[#e8693f] hover:text-[#e8693f] active:scale-[0.97] transition-all min-h-[40px] min-w-[40px]">
          {genre}
        </button>
      ))}
    </div>
  </div>
</section>
```

### 4h. CTA Section

```tsx
<section className="px-6 mt-8 mb-8">
  <div className="max-w-2xl mx-auto rounded-2xl bg-[#211a17] border border-[#3a322d] p-8 text-center hover:border-[#4d433d] transition-colors">
    <h2 className="text-2xl font-bold text-[#ece0dc] font-['Playfair_Display']">Ready to start reading?</h2>
    <p className="mt-2 text-base text-[#a89c93]">Browse our collection of free and premium books.</p>
    <a href="/books"
       className="mt-5 inline-flex items-center justify-center h-11 px-8 rounded-lg bg-[#e8693f] text-[#16110f] text-sm font-semibold hover:bg-[#d45a30] active:scale-[0.98] transition-all min-h-[40px] min-w-[40px]">
      Explore Library
    </a>
  </div>
</section>
```

### 4i. Skeleton Loading State

```tsx
<div className="grid grid-cols-2 gap-4 px-6">
  {Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="rounded-xl bg-[#211a17] border border-[#3a322d] overflow-hidden animate-pulse">
      <div className="w-full h-52 bg-[#3a322d]" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-[#3a322d] rounded w-3/4" />
        <div className="h-3 bg-[#3a322d] rounded w-1/2" />
        <div className="h-3 bg-[#3a322d] rounded w-1/4" />
      </div>
    </div>
  ))}
</div>
```

### 4j. Empty State

```tsx
<div className="px-6 mt-12 text-center">
  <svg className="mx-auto w-14 h-14 text-[#3a322d]" /* empty book icon */ />
  <p className="mt-4 text-base text-[#a89c93]">No books yet. Be the first to add one.</p>
  <a href="/books/new" className="mt-4 inline-flex items-center justify-center h-10 px-6 rounded-lg bg-[#e8693f] text-[#16110f] text-sm font-semibold hover:bg-[#d45a30] active:scale-[0.98] min-h-[40px] min-w-[40px]">
    Add a Book
  </a>
</div>
```

### 4k. Error State

```tsx
<div className="px-6 mt-12 text-center">
  <div className="max-w-md mx-auto rounded-xl bg-[#211a17] border border-[#c44d4d]/30 p-6">
    <p className="text-sm text-[#c44d4d]">Something went wrong loading the library.</p>
    <button className="mt-3 h-10 px-5 rounded-lg bg-[#3a322d] text-[#ece0dc] text-sm font-medium hover:bg-[#4d433d] active:scale-[0.98] min-h-[40px] min-w-[40px]">
      Retry
    </button>
  </div>
</div>
```

---

## 5. Tablet Interactions

| Interaction | Trigger | Action |
|-------------|---------|--------|
| **Hover on book card** | Pointer enter card | Border lightens to `#4d433d`, background shifts to `#2a211c` |
| **Hover on CTA button** | Pointer enter button | Background changes to `#d45a30` (accent hover) |
| **Hover on genre chip** | Pointer enter chip | Chip bg becomes `#e8693f20`, border and text become `#e8693f` |
| **Card click** | Click on book card | Navigate to `/books/[slug]`, card press scale animation |
| **Quick action click** | Click on quick action | Navigate to target route, scale animation |
| **See all click** | Click "See all" link | Navigate to `/books` |
| **Genre chip click** | Click genre chip | Filter displayed books, chip highlights with accent border |
| **Search input** | Type in top nav search | Debounced (300ms) filter, update displayed books |
| **Featured carousel swipe** | Drag on carousel | Snap to next/prev featured book |
| **Keyboard navigation** | Tab/Enter keys | Focus visible rings (`focus-visible:ring-2 ring-[#e8693f]`), Enter activates links |
| **Stats hover** | Pointer enter stat card | Border lightens to `#4d433d` |

---

## 6. Animation Spec (Framer Motion)

```tsx
// Page enter — fade in + slide up
<motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
>

// Hero card — slide in from left
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
>

// Featured carousel — slide in from right
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.4, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
>

// Book card grid stagger
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.06 } }
  }}
>

// Each card
<motion.a
  variants={{
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 }
  }}
  whileHover={{ y: -2 }}
  whileTap={{ scale: 0.98 }}
>

// Stats counter — count up animation
// Use framer-motion useSpring + useTransform for number roll

// Genre chips — stagger in
<motion.div variants={{
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } }
}}>
  {genres.map(g => (
    <motion.button key={g}
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 }
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    />
  ))}
</motion.div>

// Skeleton shimmer — CSS: background linear-gradient, animate background-position

// Toast slide from top
<motion.div
  initial={{ y: -60, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -60, opacity: 0 }}
  transition={{ duration: 0.25 }}
>
```

---

## 7. Tablet-Specific Anti-Slop Checklist

- [x] Horizontal top nav only — NO bottom nav bar
- [x] All interactive elements ≥ 40×40px (`min-h-[40px] min-w-[40px]`)
- [x] Hover states enabled (`hover:bg-`, `hover:border-`, `hover:text-`) — not just `active:`
- [x] 2-column grid for book cards (`grid-cols-2`)
- [x] Side-by-side layout: hero + featured carousel
- [x] Skeleton loading, not spinners
- [x] `px-6` (24px) content padding throughout
- [x] No text smaller than 14px for body (captions use 12px acceptable for metadata)
- [x] Max content width: `max-w-5xl mx-auto` to prevent overly wide lines
- [x] Genre chips wrap into rows, not horizontal scroll
- [x] No glassmorphism — solid backgrounds only
- [x] No indigo/blue/purple — Forge & Flux palette only
- [x] No shadow-lg — borders define depth
- [x] No gradient backgrounds on cards
- [x] Search bar integrated in top nav, not a separate sticky bar
- [x] CTA section centered with max-width for readability
- [x] Featured carousel auto-advances with manual dots navigation
- [x] Focus-visible rings on all interactive elements for keyboard nav
- [x] No pull-to-refresh — tablet users use pointer, not touch gestures

---

## 8. Complete Stitch Prompt

```
BUILD THE TABLET HOME PAGE for a library app. Breakpoint: 641px–1024px only. Next.js 14 + Tailwind CSS + Framer Motion. Forge & Flux dark theme (background #16110f, surface #211a17, surface hover #2a211c, accent #e8693f, accent hover #d45a30, accent muted #e8693f20, border #3a322d, border hover #4d433d, text primary #ece0dc, text secondary #a89c93, muted #7a706a). Fonts: Playfair Display for headings, Inter for body, JetBrains Mono for numbers.

REQUIREMENTS:
1. Horizontal top navigation bar (sticky top-0, z-50, bg #16110f, border-b #3a322d). Contains: logo (w-7 h-7 text-[#e8693f] + "Genu" in Playfair Display), search bar (flex-1 max-w-md, h-10, bg #211a17, border #3a322d, focus: border #e8693f + glow), nav links (Home active: bg-[#e8693f20] text-[#e8693f], Books, Lists — each h-10 px-4 rounded-lg hover:bg-[#2a211c]), profile avatar (w-9 h-9 rounded-full bg-[#e8693f20] border-[#3a322d]). All nav items min-h-[40px] min-w-[40px]. NO bottom nav bar.

2. Hero + Featured side-by-side (px-6, mt-6, gap-6, max-w-5xl mx-auto, flex). Hero card: flex-1 rounded-2xl bg #211a17 border #3a322d p-6. Contains: overline "Welcome back" 11px tracking-widest #a89c93, title "Genu Library" 3xl Playfair Display #ece0dc, description text-base #a89c93, CTA "Browse Books" — bg #e8693f h-10 px-6 rounded-lg hover:bg-[#d45a30] min-h-[40px]. Featured carousel: flex-1 rounded-2xl bg #211a17 border #3a322d, header "Featured" in Playfair Display, horizontal snap scroll of book items (each: flex gap-4, cover w-20 h-28 rounded-lg, title + author + star rating), carousel dots below. Hover on both cards: border #4d433d.

3. Quick Actions row (px-6, mt-8, max-w-5xl mx-auto, grid-cols-3 gap-4). Three cards: Browse, New Book, My Lists. Each: h-24 rounded-xl bg #211a17 border #3a322d, flex-col centered, icon w-6 h-6 + label text-sm. Hover: bg #2a211c border #4d433d. active:scale-[0.97].

4. Stats row (px-6, mt-8, max-w-5xl mx-auto, grid-cols-3 gap-4). Three stat cards: Total Books (#ece0dc), Free (#4a7c59), New This Week (#e8693f). Each: rounded-xl bg #211a17 border #3a322d p-4 text-center. Number: text-2xl font-bold JetBrains Mono. Label: text-xs #a89c93. Hover: border #4d433d.

5. "Recently Added" section: section header (px-6, flex justify-between) with title (text-xl Playfair Display) and "See all" link (#e8693f hover:text-[#d45a30]). Book cards in 2-column grid (px-6, mt-6, max-w-5xl mx-auto, grid-cols-2 gap-4). Each card: rounded-xl bg #211a17 border #3a322d, cover h-52, title text-base #ece0dc truncate, author text-sm #a89c93, star rating with #d4a24e star. "Free" badge: bg #4a7c59 text-[10px] font-semibold. Hover: border #4d433d bg #2a211c. active:scale-[0.98].

6. "Trending" section: same 2-column grid as Recently Added, different data.

7. Genre chips (px-6, max-w-5xl mx-auto): flex-wrap gap-2 container. Each chip: h-10 px-4 rounded-full bg #211a17 border #3a322d text-sm #a89c93. Hover: bg #e8693f20 border #e8693f text #e8693f. active:scale-[0.97]. min-h-[40px] min-w-[40px].

8. CTA section (px-6, mt-8 mb-8, max-w-2xl mx-auto): rounded-2xl bg #211a17 border #3a322d p-8 text-center. Title: text-2xl Playfair Display #ece0dc. Description: text-base #a89c93. Button: h-11 px-8 rounded-lg bg #e8693f hover:bg-[#d45a30]. Hover on card: border #4d433d.

9. Skeleton loading: grid-cols-2 gap-4, 4 skeleton cards. Each: rounded-xl bg #211a17 border #3a322d, h-52 image placeholder + 3 text lines, animate-pulse bg #3a322d.

10. Empty state: centered, w-14 h-14 icon, "No books yet" text, "Add a Book" CTA button (h-10 px-6 rounded-lg bg #e8693f).

11. Error state: max-w-md mx-auto, rounded-xl bg #211a17 border-[#c44d4d]/30, error text #c44d4d, "Retry" button (h-10 px-5 rounded-lg bg #3a322d hover:bg-[#4d433d]).

ANIMATIONS (Framer Motion):
- Page enter: initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} duration 0.35s smooth easing.
- Hero card: initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} spring cubic-bezier(0.34, 1.56, 0.64, 1).
- Featured carousel: initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} delay 0.1s, same spring.
- Book card grid: staggerChildren 0.06, each card fades up from y:16 with scale 0.97→1.
- Card hover: whileHover={{ y: -2 }} subtle lift.
- Card press: whileTap={{ scale: 0.98 }}.
- Genre chips: staggerChildren 0.03, scale 0.9→1. Hover: scale 1.05. Tap: scale 0.95.
- Stats: useSpring count-up animation for numbers.
- Toast: y -60→0, 0.25s.

INTERACTIONS:
- Hover on book card → border #4d433d, bg #2a211c.
- Hover on CTA → bg #d45a30.
- Hover on genre chip → bg #e8693f20, border/text #e8693f.
- Click card → navigate to /books/[slug], scale animation.
- Search input → debounced 300ms filter.
- Featured carousel → snap scroll, dot indicators.
- Keyboard: Tab through nav items, Enter to activate. Focus-visible:ring-2 ring-[#e8693f].
- Click "See all" → navigate to /books.
- Click genre chip → filter books, chip highlights.

CONSTRAINTS:
- 2-column grid for book cards always, max-w-5xl mx-auto.
- Horizontal top nav, NO bottom nav. NO hamburger menu.
- Hover states enabled (not just active:).
- px-6 for all content padding.
- All interactive elements min-h-[40px] min-w-[40px].
- No glassmorphism. No indigo/blue/purple. No shadow-lg. No gradient backgrounds.
- Body text minimum 14px. JetBrains Mono for numeric displays.
- Focus-visible rings on all interactive elements for keyboard navigation.
- No pull-to-refresh (pointer-based interaction model).
- Featured carousel auto-advances every 5 seconds with manual dot control.
```
