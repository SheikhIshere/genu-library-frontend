# 11 — Playlist List (Mobile)

## 1. Page Title & Route

**Page:** Playlist List
**Route:** `/playlists`
**Bottom Nav Index:** 2 (Playlists tab active)
**Auth Required:** Yes

---

## 2. Mobile-First Design Rationale

Playlists are a browsing-first experience on mobile. The user needs to scan, search, and act quickly. A single-column scrollable list with prominent search and a floating create button keeps the thumb zone clear. Long-press context menus avoid cluttering each card with icon buttons. Pull-to-refresh gives the user confidence the data is fresh without explicit refresh UI.

---

## 3. Mobile Layout Specification

```
┌──────────────────────────────┐ ← env(safe-area-inset-top)
│  "My Playlists"   [search]  │ ← sticky top bar
├──────────────────────────────┤
│  [Search input full-width]   │ ← search field with icon
│  Sort by: Newest ▾           │ ← bottom sheet trigger
├──────────────────────────────┤
│                              │
│  ┌────────────────────────┐  │ ← playlist card
│  │ ┌──┬──┐ ┌──┬──┐       │  │   cover collage (2×2)
│  │ │  │  │ │  │  │       │  │
│  │ ├──┼──┤ ├──┼──┤       │  │
│  │ │  │  │ │  │  │       │  │
│  │ └──┴──┘ └──┴──┘       │  │
│  │ Reading List            │  │
│  │ 12 books · Fiction      │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ (next card)             │  │
│  └────────────────────────┘  │
│                              │
│                        [+]  │ ← FAB above bottom nav
├──────────────────────────────┤
│  🏠   🔍   📚   ⚙️          │ ← bottom nav (pb-safe)
└──────────────────────────────┘ ← env(safe-area-inset-bottom)
```

**Full-width:** `max-w-[640px] mx-auto`
**Vertical padding:** `pt-[env(safe-area-inset-top)] pb-[calc(5rem+env(safe-area-inset-bottom))]`
**Card spacing:** `gap-3 px-4`

---

## 4. Component Breakdown

### 4.1 Top Bar (Sticky)
```tsx
<header className="sticky top-0 z-40 bg-[#16110f] px-4 pt-[env(safe-area-inset-top)]">
  <h1 className="font-[Playfair_Display] text-2xl text-[#ece0dc] py-3">
    My Playlists
  </h1>
</header>
```
- Sticky, opaque background, no blur

### 4.2 Search Input
```tsx
<div className="relative px-4 pb-3">
  <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a89c93]" />
  <input
    type="text"
    placeholder="Search playlists..."
    className="w-full min-h-[44px] rounded-xl bg-[#211a17] border border-[#3a322d] pl-11 pr-4 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f]"
  />
</div>
```
- `min-h-[44px]` for touch target
- Search icon left-aligned, input padding adjusted

### 4.3 Sort Trigger
```tsx
<button className="flex items-center gap-1.5 px-4 pb-4 min-h-[44px]">
  <ArrowUpDown className="w-4 h-4 text-[#a89c93]" />
  <span className="font-[Inter] text-sm text-[#a89c93]">Sort by: Newest</span>
</button>
```
- Opens sort bottom sheet
- Touch target: `min-h-[44px] min-w-[44px]`

### 4.4 Playlist Card
```tsx
<motion.div
  layout
  whileTap={{ scale: 0.98 }}
  onLongPress={() => openActionSheet(playlist)}
  className="bg-[#211a17] rounded-2xl border border-[#3a322d] overflow-hidden"
>
  {/* Cover Collage */}
  <div className="grid grid-cols-2 gap-[2px] h-40">
    {covers.slice(0, 4).map((cover, i) => (
      <img
        key={i}
        src={cover}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
      />
    ))}
    {Array.from({ length: Math.max(0, 4 - covers.length) }).map((_, i) => (
      <div key={i} className="bg-[#3a322d]" />
    ))}
  </div>

  {/* Info */}
  <div className="p-3">
    <h3 className="font-[Playfair_Display] text-base text-[#ece0dc] truncate">
      {playlist.name}
    </h3>
    <p className="font-[Inter] text-xs text-[#a89c93] truncate mt-0.5">
      {playlist.bookCount} books · {playlist.description || "No description"}
    </p>
  </div>
</motion.div>
```

### 4.5 Sort Bottom Sheet
```tsx
<BottomSheet open={sortOpen} onOpenChange={setSortOpen}>
  <BottomSheetHeader>Sort by</BottomSheetHeader>
  <BottomSheetBody className="space-y-1">
    {[
      { label: "Newest", value: "newest" },
      { label: "Oldest", value: "oldest" },
      { label: "Name A-Z", value: "name_asc" },
      { label: "Most Books", value: "book_count" },
    ].map((opt) => (
      <button
        key={opt.value}
        onClick={() => { setSort(opt.value); setSortOpen(false); }}
        className="w-full flex items-center justify-between min-h-[44px] px-4 rounded-xl font-[Inter] text-sm text-[#ece0dc] hover:bg-[#3a322d]"
      >
        {opt.label}
        {sort === opt.value && <Check className="w-4 h-4 text-[#e8693f]" />}
      </button>
    ))}
  </BottomSheetBody>
</BottomSheet>
```
- Uses project's BottomSheet component
- `snapPoints={["auto"]}` for content height

### 4.6 Action Bottom Sheet (Long-Press)
```tsx
<BottomSheet open={actionSheetOpen} onOpenChange={setActionSheetOpen}>
  <BottomSheetHeader>{selectedPlaylist?.name}</BottomSheetHeader>
  <BottomSheetBody className="space-y-1">
    <BottomSheetAction icon={Pencil} onClick={goToEdit}>
      Edit
    </BottomSheetAction>
    <BottomSheetAction icon={Trash2} variant="danger" onClick={handleDelete}>
      Delete
    </BottomSheetAction>
  </BottomSheetBody>
</BottomSheet>
```
- `variant="danger"` renders text in `#ef4444`

### 4.7 Empty State
```tsx
<div className="flex flex-col items-center justify-center py-20 px-6">
  <div className="w-24 h-24 mb-4 rounded-full bg-[#211a17] flex items-center justify-center">
    <BookOpen className="w-10 h-10 text-[#a89c93]" />
  </div>
  <p className="font-[Playfair_Display] text-lg text-[#ece0dc] text-center">
    No playlists yet
  </p>
  <p className="font-[Inter] text-sm text-[#a89c93] text-center mt-1">
    Create your first playlist to organize your reading
  </p>
  <button
    onClick={goToCreate}
    className="mt-6 min-h-[44px] min-w-[44px] px-6 rounded-xl bg-[#e8693f] text-white font-[Inter] text-sm font-medium"
  >
    Create Playlist
  </button>
</div>
```

### 4.8 FAB (Floating Action Button)
```tsx
<motion.button
  whileTap={{ scale: 0.9 }}
  onClick={goToCreate}
  className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] right-4 z-30 w-14 h-14 rounded-full bg-[#e8693f] flex items-center justify-center shadow-[0_4px_12px_rgba(232,105,63,0.3)]"
>
  <Plus className="w-6 h-6 text-white" />
</motion.button>
```
- Position: `bottom-[calc(4rem+env(safe-area-inset-bottom))]`
- Right-aligned with `right-4`
- `shadow-[0_4px_12px_rgba(232,105,63,0.3)]` (subtle warm glow, not `shadow-lg`)

### 4.9 Skeleton Loader
```tsx
<div className="space-y-3 px-4">
  {Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="bg-[#211a17] rounded-2xl border border-[#3a322d] overflow-hidden animate-pulse">
      <div className="grid grid-cols-2 gap-[2px] h-40 bg-[#3a322d]" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 rounded bg-[#3a322d]" />
        <div className="h-3 w-1/2 rounded bg-[#3a322d]" />
      </div>
    </div>
  ))}
</div>
```

---

## 5. Mobile Interactions

| Trigger | Action | Feedback |
|---|---|---|
| Pull down on list | Refresh playlists | Haptic light, skeleton replaces list during load |
| Tap search input | Focus field, show keyboard | Keyboard slides up, input scrolls into view |
| Tap sort button | Open sort bottom sheet | Sheet slides up from bottom |
| Tap sort option | Apply sort, close sheet | Sheet slides down, list re-orders |
| Long-press card | Open action bottom sheet | Haptic medium, sheet slides up |
| Tap "Edit" in sheet | Navigate to edit page | Sheet closes, page pushes |
| Tap "Delete" in sheet | Confirm dialog → delete | Haptic heavy, card exits with layout animation |
| Tap FAB (+) | Navigate to new playlist page | FAB press animation, page pushes |
| Tap playlist card | Navigate to detail page | Card press animation, page pushes |
| Swipe left on card | Reveal "Remove" button (future) | Red background revealed |

### Long-Press Details
- **Threshold:** 500ms hold
- **Haptic:** `navigator.vibrate(10)` (medium) on trigger
- **Visual:** Card scales to `0.97`, background darkens
- **Action sheet opens** from bottom with playlist name as header

### Pull-to-Refresh Details
- Uses `react-pull-to-refresh` or native `useRefresh` hook
- Custom indicator: spinner in `#e8693f`
- Minimum pull distance: 80px
- Haptic: light on trigger

### Search Details
- Debounce: 300ms
- Clear button appears when input has text
- Search filters locally (client-side) on loaded playlists
- Empty search results: show "No playlists match your search"

---

## 6. Animation Spec

### Page Enter
```tsx
// From page transition wrapper
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.25, ease: "easeOut" }}
```

### Card Stagger (List Load)
```tsx
staggerChildren: 0.05
// Each card:
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.3, ease: "easeOut" }}
```

### Card Press
```tsx
whileTap={{ scale: 0.98 }}
transition={{ type: "spring", stiffness: 400, damping: 30 }}
```

### Card Exit (Delete)
```tsx
exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
transition={{ duration: 0.3 }}
layout
```

### FAB
```tsx
whileTap={{ scale: 0.85, rotate: 90 }}
transition={{ type: "spring", stiffness: 500, damping: 20 }}
```

### Sort Sheet
```tsx
// Handled by BottomSheet component
snapPoints={["auto"]}
// Slide-up with spring, backdrop fade
```

---

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] `max-w-[640px]` wrapper on all content
- [ ] `pb-[calc(4.5rem+env(safe-area-inset-bottom))]` for bottom nav safe area
- [ ] `pt-[env(safe-area-inset-top)]` on sticky header
- [ ] All interactive elements `min-h-[44px] min-w-[44px]`
- [ ] Search input `min-h-[44px]`
- [ ] FAB positioned above bottom nav: `bottom-[calc(4rem+env(safe-area-inset-bottom))]`
- [ ] Sort trigger is a bottom sheet, NOT a dropdown
- [ ] Action menu is a bottom sheet, NOT a popover or tooltip
- [ ] Single column layout always — no grid columns > 1
- [ ] Card collage: `grid-cols-2` only, not responsive
- [ ] No `shadow-lg` — only custom warm glow on FAB
- [ ] No glassmorphism — all surfaces opaque `#211a17`
- [ ] No indigo/blue/purple anywhere
- [ ] Skeleton loading shown during initial fetch
- [ ] Pull-to-refresh implemented
- [ ] Haptic feedback on long-press, create, delete
- [ ] Long-press threshold ≥ 400ms
- [ ] Search debounce ≥ 250ms
- [ ] Typography: Playfair for headings, Inter for body
- [ ] Colors match design system exactly
- [ ] Empty state includes illustration, message, and CTA button
- [ ] Bottom nav present on this page

---

## 8. Complete Stitch Prompt

```
Build a mobile-only playlist list page for a library app. Max-width 640px, centered.

DESIGN SYSTEM:
- Canvas background: #16110f
- Surface: #211a17
- Primary accent: #e8693f
- Border: #3a322d
- Text primary: #ece0dc
- Text secondary: #a89c93
- Fonts: Playfair Display (display), Inter (body)

LAYOUT (top to bottom, single column):
1. STICKY HEADER: "My Playlists" in Playfair Display text-2xl, opaque #16110f background, z-40. Respect env(safe-area-inset-top).

2. SEARCH: Full-width input below header, SearchIcon (w-5 h-5 text-[#a89c93]) absolutely positioned left inside the input. Input: bg-[#211a17] border-[#3a322d], rounded-xl, min-h-[44px], placeholder "Search playlists...". Show clear button (X icon) when text present. Debounce 300ms.

3. SORT TRIGGER: Below search. Row with ArrowUpDown icon + "Sort by: {current}" text in Inter text-sm text-[#a89c93]. Tapping opens a bottom sheet with 4 options: Newest, Oldest, Name A-Z, Most Books. Each option is a button min-h-[44px] with Check icon on the selected one in #e8693f.

4. PLAYLIST CARDS: Single column, gap-3, px-4. Each card:
   - Outer: bg-[#211a17] rounded-2xl border border-[#3a322d] overflow-hidden
   - Cover collage: CSS grid-cols-2, gap-[2px], h-40. 4 slots for book cover images. Empty slots show bg-[#3a322d] placeholder. Images use object-cover.
   - Below collage: p-3, playlist name in Playfair text-base text-[#ece0dc] truncated, subtitle in Inter text-xs text-[#a89c93]: "{count} books · {description preview}"
   - Cards animate in with staggerChildren 0.05 (opacity 0→1, y 20→0)
   - whileTap={{ scale: 0.98 }}

5. LONG-PRESS ON CARD: After 500ms hold, trigger navigator.vibrate(10), open a bottom sheet with the playlist name as header, and two actions: "Edit" (Pencil icon, navigates to /playlists/{id}/edit) and "Delete" (Trash2 icon, variant danger in #ef4444, confirms then deletes with haptic heavy).

6. FAB: Fixed position bottom-right (right-4), above bottom nav. bottom-[calc(4rem+env(safe-area-inset-bottom))]. w-14 h-14 rounded-full bg-[#e8693f], Plus icon w-6 h-6 text-white. whileTap={{ scale: 0.85, rotate: 90 }}. Subtle warm shadow. Navigates to /playlists/new.

7. EMPTY STATE (when no playlists): Centered vertically. Large icon (BookOpen w-10 h-10 text-[#a89c93]) in a 24x24 rounded-full bg-[#211a17] circle. "No playlists yet" in Playfair text-lg text-[#ece0dc]. Subtext in Inter text-sm text-[#a89c93]. "Create Playlist" button: min-h-[44px] px-6 rounded-xl bg-[#e8693f] text-white.

8. SKELETON LOADING: While data loads, show 4 skeleton cards. Each: same card shape, animate-pulse, bg-[#3a322d] for collage area and text placeholder bars.

9. BOTTOM NAV: Fixed bottom, z-50, opaque #16110f, pb-[env(safe-area-inset-bottom)]. 4 tabs: Home, Search, Playlists (active, #e8693f icon+label), Profile. Each tab min-h-[44px] min-w-[44px].

10. PULL TO REFRESH: Custom spinner in #e8693f, 80px minimum pull. Haptic light on trigger. Refreshes playlist data.

INTERACTIONS:
- Pull to refresh with haptic feedback
- Search filters locally with 300ms debounce
- Sort bottom sheet with snap-to-content height
- Long-press opens action sheet with haptic
- FAB press animates (scale + rotate)
- Page transitions: slide from right on enter, slide to left on exit
- Cards stagger in on load
- Card press scale animation

DO NOT use: shadow-lg, glassmorphism, indigo/blue/purple, multiple columns, dropdowns, popovers, tooltips, hamburger menu, or any element without min-h-[44px].

The page component should accept a bottomNavSlot prop or wrap itself with the BottomNav component already in the project. Use the existing BottomSheet component for sort and action sheets.
```
