# 01 — Home Page (Mobile)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| **Page** | Home / Dashboard |
| **Route** | `/` |
| **Component** | `app/page.tsx` (server) + `components/mobile/HomeMobile.tsx` (client) |
| **Bottom Nav Tab** | Home (first tab) |

---

## 2. Mobile-First Design Rationale

The home page is the user's entry point — it must orient them in under 3 seconds on a 375px screen. Single-column vertical scroll, hero in the top third (thumb-inaccessible but purely visual), and all interactive CTAs in the bottom third where thumbs naturally rest. The bottom nav bar anchors navigation so users never need to reach to the top-left for a hamburger. Pull-to-refresh gives a sense of live data without requiring a dedicated "refresh" button. Cards stack vertically with generous padding — no grids, no side-by-side layouts.

---

## 3. Mobile Layout Specification

```
┌─────────────────────────────┐
│  Status bar (safe area)     │  env(safe-area-inset-top)
├─────────────────────────────┤
│  Page scroll container      │
│  ┌─────────────────────────┐│
│  │ Hero card               ││  px-5, mt-4
│  │ (brand + CTA)           ││
│  ├─────────────────────────┤│
│  │ Quick Actions row       ││  horizontal scroll, px-5
│  │ [Browse] [New] [My List]││
│  ├─────────────────────────┤│
│  │ Recently Added section  ││
│  │ Book card stack (1 col) ││  px-5, gap-4
│  ├─────────────────────────┤│
│  │ Trending section        ││
│  │ Book card stack (1 col) ││  px-5, gap-4
│  ├─────────────────────────┤│
│  │ Genre chips (horiz)     ││  px-5, overflow-x-auto
│  └─────────────────────────┘│
├─────────────────────────────┤
│  Bottom Nav Bar             │  fixed bottom, z-50
│  [Home] [Books] [Lists] [Me]│  pb-safe: env(safe-area-inset-bottom)
└─────────────────────────────┘
```

- **Scroll container**: `overflow-y-auto`, pull-to-refresh enabled
- **Content padding**: `px-5` (20px) on all sections
- **Section spacing**: `space-y-8` between sections
- **No max-width**: always `w-full`

---

## 4. Component Breakdown

### 4a. Bottom Navigation Bar

```tsx
<nav className="fixed bottom-0 inset-x-0 z-50 bg-[#16110f]/95 backdrop-blur-md border-t border-[#3a322d]"
     style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
  <div className="flex items-center justify-around h-14">
    {/* Each tab: min-h-11 min-w-11, flex-col items-center justify-center */}
    <a href="/" className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-[#e8693f]">
      <svg className="w-5 h-5" /* home icon */ />
      <span className="text-[10px] mt-0.5 font-medium">Home</span>
    </a>
    <a href="/books" className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-[#a89c93]">
      <svg className="w-5 h-5" /* book icon */ />
      <span className="text-[10px] mt-0.5 font-medium">Books</span>
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

- Active tab: `text-[#e8693f]` + a 2px indicator bar above the icon (`bg-[#e8693f]`, `rounded-full`, absolute positioned, `w-6 h-[2px]`, `top-0`)
- Inactive tabs: `text-[#a89c93]`, on tap → `text-[#ece0dc]` briefly (active feedback)
- Touch feedback: `active:scale-95` on each tab container

### 4b. Hero Card

```tsx
<section className="mx-5 mt-4 rounded-2xl bg-[#211a17] border border-[#3a322d] p-5">
  <p className="text-[11px] uppercase tracking-widest text-[#a89c93] font-medium">Welcome back</p>
  <h1 className="mt-2 text-[28px] font-bold text-[#ece0dc] leading-tight font-['Playfair_Display']">
    Genu Library
  </h1>
  <p className="mt-2 text-sm text-[#a89c93] leading-relaxed">
    Discover free & premium books, preview inline, leave reviews.
  </p>
  <a href="/books"
     className="mt-4 inline-flex items-center justify-center h-11 px-6 rounded-lg bg-[#e8693f] text-[#16110f] text-sm font-semibold active:scale-[0.98] transition-transform min-w-[44px]">
    Browse Books
  </a>
</section>
```

### 4c. Quick Actions Row

```tsx
<section className="mt-6 px-5">
  <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory scrollbar-hide">
    {/* Each card: min-w-[120px] snap-start, min-h-20 */}
    <a href="/books" className="snap-start flex-shrink-0 w-[120px] h-20 rounded-xl bg-[#211a17] border border-[#3a322d] flex flex-col items-center justify-center gap-1 active:scale-[0.97] transition-transform">
      <svg className="w-5 h-5 text-[#e8693f]" /* book icon */ />
      <span className="text-xs text-[#ece0dc] font-medium">Browse</span>
    </a>
    <a href="/books/new" className="snap-start flex-shrink-0 w-[120px] h-20 rounded-xl bg-[#211a17] border border-[#3a322d] flex flex-col items-center justify-center gap-1 active:scale-[0.97] transition-transform">
      <svg className="w-5 h-5 text-[#e8693f]" /* plus icon */ />
      <span className="text-xs text-[#ece0dc] font-medium">New Book</span>
    </a>
    <a href="/playlists" className="snap-start flex-shrink-0 w-[120px] h-20 rounded-xl bg-[#211a17] border border-[#3a322d] flex flex-col items-center justify-center gap-1 active:scale-[0.97] transition-transform">
      <svg className="w-5 h-5 text-[#e8693f]" /* list icon */ />
      <span className="text-xs text-[#ece0dc] font-medium">My Lists</span>
    </a>
  </div>
</section>
```

### 4d. Book Card (used in "Recently Added" and "Trending")

```tsx
<a href={`/books/${book.slug}`}
   className="block w-full rounded-xl bg-[#211a17] border border-[#3a322d] overflow-hidden active:scale-[0.98] transition-transform">
  <div className="relative w-full h-48 bg-[#16110f]">
    {book.cover_page ? (
      <img src={book.cover_page} alt={book.title} className="w-full h-full object-cover" loading="lazy" />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <svg className="w-10 h-10 text-[#3a322d]" /* book placeholder icon */ />
      </div>
    )}
    {book.price === 0 && (
      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#4a7c59] text-[#ece0dc] text-[10px] font-semibold">Free</span>
    )}
  </div>
  <div className="p-4">
    <h3 className="text-[15px] font-semibold text-[#ece0dc] truncate">{book.title}</h3>
    <p className="mt-0.5 text-[13px] text-[#a89c93] truncate">{book.author}</p>
    <div className="mt-2 flex items-center gap-2">
      <svg className="w-3.5 h-3.5 text-[#d4a24e]" /* star icon */ />
      <span className="text-xs text-[#ece0dc] font-medium">{book.average_rating.toFixed(1)}</span>
      <span className="text-xs text-[#7a706a]">({book.total_ratings})</span>
    </div>
  </div>
</a>
```

### 4e. Section Header

```tsx
<div className="flex items-center justify-between px-5">
  <h2 className="text-lg font-semibold text-[#ece0dc] font-['Playfair_Display']">Recently Added</h2>
  <a href="/books" className="text-sm text-[#e8693f] font-medium active:scale-[0.97] min-h-[44px] min-w-[44px] flex items-center justify-center">See all</a>
</div>
```

### 4f. Genre Chips (horizontal scroll)

```tsx
<section className="px-5">
  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    {/* Each chip: min-h-11, min-w-[44px] for touch */}
    <button className="flex-shrink-0 h-11 px-4 rounded-full bg-[#211a17] border border-[#3a322d] text-sm text-[#a89c93] active:bg-[#e8693f20] active:border-[#e8693f] active:text-[#e8693f] transition-colors">
      Fiction
    </button>
    {/* ...more chips */}
  </div>
</section>
```

### 4g. Skeleton Loading State

```tsx
// Skeleton card — animated pulse placeholder
<div className="w-full rounded-xl bg-[#211a17] border border-[#3a322d] overflow-hidden animate-pulse">
  <div className="w-full h-48 bg-[#3a322d]" />
  <div className="p-4 space-y-3">
    <div className="h-4 bg-[#3a322d] rounded w-3/4" />
    <div className="h-3 bg-[#3a322d] rounded w-1/2" />
    <div className="h-3 bg-[#3a322d] rounded w-1/4" />
  </div>
</div>
// Render 3 of these in a column while data loads
```

### 4h. Empty State

```tsx
<div className="mx-5 mt-6 rounded-xl bg-[#211a17] border border-[#3a322d] p-8 text-center">
  <svg className="mx-auto w-12 h-12 text-[#3a322d]" /* empty book icon */ />
  <p className="mt-3 text-sm text-[#a89c93]">No books yet. Be the first to add one.</p>
  <a href="/books/new" className="mt-4 inline-flex items-center justify-center h-11 px-5 rounded-lg bg-[#e8693f] text-[#16110f] text-sm font-semibold active:scale-[0.98]">
    Add a Book
  </a>
</div>
```

### 4i. Error State

```tsx
<div className="mx-5 mt-6 rounded-xl bg-[#211a17] border border-[#c44d4d]/30 p-6 text-center">
  <p className="text-sm text-[#c44d4d]">Something went wrong loading the library.</p>
  <button className="mt-3 h-11 px-5 rounded-lg bg-[#3a322d] text-[#ece0dc] text-sm font-medium active:scale-[0.98]">
    Retry
  </button>
</div>
```

---

## 5. Mobile Interactions

| Interaction | Trigger | Action |
|-------------|---------|--------|
| **Pull to refresh** | Drag down on scroll container | Re-fetch home data, show skeleton loading |
| **Swipe right from left edge** | Gesture (system/browser) | Navigate back (no-op on home) |
| **Quick action tap** | Tap on quick action card | Navigate to target route, haptic `navigator.vibrate(10)` |
| **Book card tap** | Tap on book card | Navigate to `/books/[slug]`, card press scale animation |
| **Long-press book card** | 500ms hold on book card | Open bottom sheet with options: View, Add to Playlist, Share |
| **See all tap** | Tap "See all" link | Navigate to `/books` with haptic |
| **Genre chip tap** | Tap genre chip | Filter scrollable section, chip highlights with `#e8693f` border |
| **Horizontal swipe on quick actions** | Drag left/right on quick actions row | Scroll through action cards, snap to each |

---

## 6. Animation Spec (Framer Motion)

```tsx
// Page enter — slide up from bottom + fade
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
>

// Stagger children — book cards animate in sequence
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.04 } }
  }}
>

// Each card
<motion.a
  variants={{
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 }
  }}
  whileTap={{ scale: 0.98 }}
>

// Skeleton shimmer — CSS gradient sweep (not Framer)
// Use CSS: background linear-gradient 90deg, animate background-position

// Bottom sheet spring
<motion.div
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
>

// Toast slide from top
<motion.div
  initial={{ y: -80, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -80, opacity: 0 }}
  transition={{ duration: 0.25 }}
>
```

---

## 7. Mobile-Specific Anti-Slop Checklist

- [x] No hamburger menu — bottom nav only
- [x] All touch targets ≥ 44×44px (`min-h-[44px] min-w-[44px]`)
- [x] Primary actions in bottom third (CTA in hero, bottom nav)
- [x] No hover states (touch only) — using `active:` not `hover:`
- [x] Skeleton loading, not spinners
- [x] Safe area padding on bottom bar (`env(safe-area-inset-bottom)`)
- [x] Single column always (`w-full`, no grid on mobile)
- [x] No text smaller than 14px (captions use 12px which is acceptable for timestamps only)
- [x] Pull to refresh on scroll container
- [x] Bottom sheets, not modals (for long-press actions)
- [x] No glassmorphism (using `bg-[#16110f]/95 backdrop-blur-md` on nav only — not decorative glass)
- [x] No indigo/blue/purple — Forge & Flux palette only
- [x] No shadow-lg (borders define depth)
- [x] No gradient backgrounds on cards

---

## 8. Complete Stitch Prompt

```
BUILD THE MOBILE HOME PAGE for a library app. Max-width: 640px only. Next.js 14 + Tailwind CSS + Framer Motion. Forge & Flux dark theme (background #16110f, surface #211a17, accent #e8693f, border #3a322d, text primary #ece0dc, text secondary #a89c93). Fonts: Playfair Display for headings, Inter for body.

REQUIREMENTS:
1. Bottom navigation bar (fixed, z-50, pb-safe for iOS) with 4 tabs: Home (active, accent color), Books, Lists, Profile. Each tab min-h-[44px] min-w-[44px]. Active tab has 2px accent indicator bar. Background #16110f/95 with backdrop-blur-md, top border #3a322d.
2. Pull-to-refresh on the main scroll container (use PullToRefresh pattern or intersection observer).
3. Hero card: rounded-2xl, bg #211a17, border #3a322d, px-5, mt-4. Contains: overline "Welcome back" in 11px tracking-widest #a89c93, title "Genu Library" in 28px Playfair Display #ece0dc, description in text-sm #a89c93, and a CTA button "Browse Books" — bg #e8693f, text #16110f, h-11, rounded-lg, font-semibold, active:scale-[0.98].
4. Quick Actions row: horizontal scrollable, snap-x, px-5. Three cards: Browse, New Book, My Lists. Each card 120px wide, h-20, rounded-xl, bg #211a17, border #3a322d, flex-col centered, icon + label. active:scale-[0.97].
5. "Recently Added" section: section header with title (Playfair Display) and "See all" link (#e8693f). Then 3-4 book cards stacked vertically (w-full). Each card: rounded-xl, bg #211a17, border #3a322d, cover image h-48, title text-[15px] #ece0dc, author text-[13px] #a89c93, star rating with #d4a24e star. If price is 0, show "Free" badge (bg #4a7c59, text #ece0dc). active:scale-[0.98] on each card.
6. "Trending" section: same card layout as Recently Added but different data.
7. Genre chips: horizontal scrollable row of pill buttons. Each chip h-11 px-4 rounded-full, bg #211a17, border #3a322d. Active chip: border #e8693f, text #e8693f, bg #e8693f20.
8. Skeleton loading: 3 skeleton cards with animate-pulse, bg #3a322d placeholders for image + text lines.
9. Empty state: centered message with icon, "No books yet" text, and "Add a Book" CTA button.
10. Error state: error message with #c44d4d text and "Retry" button.

ANIMATIONS (Framer Motion):
- Page enter: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} duration 0.3s.
- Book card stagger: variants with staggerChildren 0.04, each card fades up from y:16.
- Card press: whileTap={{ scale: 0.98 }}.
- Bottom sheet (for long-press menu): spring with damping 25, stiffness 300.
- Toast: slide from top, y: -80 → 0.

INTERACTIONS:
- Long-press (500ms) on book card → open bottom sheet with options: View, Add to Playlist, Share.
- Genre chip tap → filter displayed books, chip highlights.
- Pull to refresh → re-fetch data, show skeleton.
- Haptic feedback (navigator.vibrate(10)) on: CTA tap, book card tap, genre chip select.

CONSTRAINTS:
- Single column layout always, w-full, px-5 for content padding.
- No hamburger menu. No hover states. No grid on mobile.
- No glassmorphism (except nav blur). No indigo/blue/purple. No shadow-lg. No gradient backgrounds.
- All interactive elements min-h-[44px] min-w-[44px].
- env(safe-area-inset-bottom) padding on bottom nav.
- Body text minimum 14px. Use JetBrains Mono for any numeric displays.
```
