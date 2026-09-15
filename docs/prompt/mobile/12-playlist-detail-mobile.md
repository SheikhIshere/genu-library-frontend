# 12 — Playlist Detail (Mobile)

## 1. Page Title & Route

**Page:** Playlist Detail
**Route:** `/playlists/:id`
**Bottom Nav Index:** 2 (Playlists tab active)
**Auth Required:** Yes
**Params:** `id` — playlist identifier

---

## 2. Mobile-First Design Rationale

The detail page is a focused reading list. On mobile, the user wants to scan books quickly and manage the list with minimal friction. A single-column book grid with swipe-to-remove keeps management hidden until needed. The header establishes ownership with an edit icon only for the playlist owner. The layout prioritizes book covers and titles over metadata.

---

## 3. Mobile Layout Specification

```
┌──────────────────────────────┐ ← env(safe-area-inset-top)
│ ←  Playlist Name      [✏️]  │ ← sticky header
│ Description text here        │
│ 12 books                     │
├──────────────────────────────┤
│                              │
│  ┌──────┐ Reading            │ ← book card (single column)
│  │      │ Recovery           │
│  │ cover│ Jane Smith         │
│  │      │ [swipe left → ]    │
│  └──────┘                    │
│                              │
│  ┌──────┐ Deep Work          │ ← swipe reveals red "Remove"
│  │      │ Cal Newport        │
│  │ cover│                    │
│  │      │                    │
│  └──────┘                    │
│                              │
│                        [+]  │ ← FAB above bottom nav
├──────────────────────────────┤
│  🏠   🔍   📚   ⚙️          │ ← bottom nav
└──────────────────────────────┘ ← env(safe-area-inset-bottom)
```

**Full-width:** `max-w-[640px] mx-auto`
**Content padding:** `px-4`
**Bottom safe area:** `pb-[calc(5rem+env(safe-area-inset-bottom))]`

---

## 4. Component Breakdown

### 4.1 Sticky Header
```tsx
<header className="sticky top-0 z-40 bg-[#16110f] border-b border-[#3a322d] pt-[env(safe-area-inset-top)]">
  <div className="flex items-center gap-3 px-4 py-3">
    <button
      onClick={goBack}
      className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2"
    >
      <ChevronLeft className="w-5 h-5 text-[#ece0dc]" />
    </button>
    <div className="flex-1 min-w-0">
      <h1 className="font-[Playfair_Display] text-xl text-[#ece0dc] truncate">
        {playlist.name}
      </h1>
    </div>
    {isOwner && (
      <button
        onClick={goToEdit}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        <Pencil className="w-5 h-5 text-[#a89c93]" />
      </button>
    )}
  </div>
  {playlist.description && (
    <p className="px-4 pb-2 font-[Inter] text-sm text-[#a89c93] line-clamp-2">
      {playlist.description}
    </p>
  )}
  <div className="px-4 pb-3">
    <span className="font-[Inter] text-xs text-[#a89c93]">
      {playlist.bookCount} books
    </span>
  </div>
</header>
```

- Back button: `min-h-[44px] min-w-[44px]`
- Edit button: only visible if `isOwner`
- Description: `line-clamp-2` to prevent header blowout

### 4.2 Book Card (Swipeable)
```tsx
<SwipeableRow onSwipeLeft={() => onRemove(book.id)}>
  <motion.div
    layout
    whileTap={{ scale: 0.98 }}
    className="flex gap-3 bg-[#211a17] rounded-xl border border-[#3a322d] p-3"
  >
    <img
      src={book.coverUrl}
      alt={book.title}
      className="w-14 h-20 rounded-lg object-cover flex-shrink-0"
      loading="lazy"
    />
    <div className="flex-1 min-w-0 py-0.5">
      <h3 className="font-[Playfair_Display] text-sm text-[#ece0dc] truncate">
        {book.title}
      </h3>
      <p className="font-[Inter] text-xs text-[#a89c93] truncate mt-0.5">
        {book.author}
      </p>
    </div>
  </motion.div>
</SwipeableRow>
```

### 4.3 SwipeableRow Component
```tsx
function SwipeableRow({ children, onSwipeLeft }: Props) {
  const x = useMotionValue(0);
  const threshold = -80;

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Red background revealed on swipe */}
      <div className="absolute inset-0 flex items-center justify-end pr-4 bg-[#ef4444] rounded-xl">
        <Trash2 className="w-5 h-5 text-white" />
        <span className="font-[Inter] text-sm text-white ml-2">Remove</span>
      </div>

      {/* Foreground content */}
      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: threshold, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x < threshold) {
            onSwipeLeft();
          }
          animate(x, 0);
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
```

- Swipe threshold: `-80px` from left edge
- Drag elastic: `0.1` (resist overswipe)
- On release past threshold: `onSwipeLeft` fires, card exits
- Haptic: `navigator.vibrate(10)` on remove

### 4.4 Book List Container
```tsx
<div className="px-4 py-3 space-y-3">
  {books.map((book) => (
    <SwipeableRow
      key={book.id}
      onSwipeLeft={() => handleRemoveBook(book.id)}
    >
      {/* book card content */}
    </SwipeableRow>
  ))}
</div>
```

### 4.5 Empty State
```tsx
<div className="flex flex-col items-center justify-center py-20 px-6">
  <div className="w-24 h-24 mb-4 rounded-full bg-[#211a17] flex items-center justify-center">
    <BookOpen className="w-10 h-10 text-[#a89c93]" />
  </div>
  <p className="font-[Playfair_Display] text-lg text-[#ece0dc] text-center">
    No books in this playlist
  </p>
  <p className="font-[Inter] text-sm text-[#a89c93] text-center mt-1">
    Add books from your collection to get started
  </p>
  {isOwner && (
    <button
      onClick={goToAddBooks}
      className="mt-6 min-h-[44px] min-w-[44px] px-6 rounded-xl bg-[#e8693f] text-white font-[Inter] text-sm font-medium"
    >
      Add Books
    </button>
  )}
</div>
```

### 4.6 FAB (Add Books)
```tsx
<motion.button
  whileTap={{ scale: 0.9 }}
  onClick={goToAddBooks}
  className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] right-4 z-30 w-14 h-14 rounded-full bg-[#e8693f] flex items-center justify-center shadow-[0_4px_12px_rgba(232,105,63,0.3)]"
>
  <Plus className="w-6 h-6 text-white" />
</motion.button>
```

### 4.7 Remove Confirmation Toast
```tsx
// After swipe-to-remove triggers
<Toast variant="success" duration={3000}>
  Book removed from playlist
</Toast>
```
- Success toast with undo option
- Auto-dismiss after 3s

### 4.8 Skeleton Loader
```tsx
<div className="px-4 py-3 space-y-3">
  {Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="flex gap-3 bg-[#211a17] rounded-xl border border-[#3a322d] p-3 animate-pulse">
      <div className="w-14 h-20 rounded-lg bg-[#3a322d]" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3.5 w-3/4 rounded bg-[#3a322d]" />
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
| Tap back button | Navigate to playlist list | Page slides left |
| Tap edit icon | Navigate to edit page | Page slides right |
| Swipe left on book | Reveal red "Remove" button | Card slides, red background appears |
| Release past threshold | Remove book from playlist | Card exits, haptic, success toast |
| Release before threshold | Snap back | Spring animation back to origin |
| Tap FAB (+) | Navigate to add books page | FAB press animation, page pushes |
| Tap "Add Books" (empty) | Navigate to add books page | Button press animation |

### Swipe-to-Remove Details
- **Minimum swipe distance:** 80px from left
- **Drag elastic:** 0.1 (slight resistance past threshold)
- **Red background:** Shows Trash2 icon + "Remove" text in white
- **On confirm:** Card animates out (opacity 0, height 0, marginBottom 0)
- **Haptic:** `navigator.vibrate(10)` on removal
- **Toast:** "Book removed from playlist" with auto-dismiss 3s
- **Edge case:** If playlist becomes empty after removal, show empty state

### Back Navigation
- Uses browser history or router back
- No haptic feedback on back
- Page transition: slides left (exit)

---

## 6. Animation Spec

### Page Enter
```tsx
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.25, ease: "easeOut" }}
```

### Book Card Stagger
```tsx
staggerChildren: 0.04
// Each card:
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.25, ease: "easeOut" }}
```

### Swipe Card
```tsx
// During drag
style={{ x: useMotionValue(0) }}
drag="x"
dragConstraints={{ left: -80, right: 0 }}
dragElastic={0.1}

// Card exit after remove
exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
transition={{ duration: 0.3, ease: "easeInOut" }}
layout
```

### Card Press
```tsx
whileTap={{ scale: 0.98 }}
transition={{ type: "spring", stiffness: 400, damping: 30 }}
```

### FAB
```tsx
whileTap={{ scale: 0.85 }}
transition={{ type: "spring", stiffness: 500, damping: 20 }}
```

---

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] `max-w-[640px]` wrapper on all content
- [ ] `pb-[calc(4.5rem+env(safe-area-inset-bottom))]` for bottom nav
- [ ] `pt-[env(safe-area-inset-top)]` on sticky header
- [ ] All interactive elements `min-h-[44px] min-w-[44px]`
- [ ] Back button is full touch target (not just icon)
- [ ] Edit icon is full touch target
- [ ] Book cards are single column, not grid
- [ ] Swipe gesture works on book cards, not on header
- [ ] Swipe threshold is ≥ 60px (prevents accidental remove)
- [ ] Remove shows confirmation toast, not silent delete
- [ ] Empty state only shows "Add Books" for playlist owner
- [ ] FAB positioned above bottom nav
- [ ] No `shadow-lg` — only subtle FAB glow
- [ ] No glassmorphism — opaque surfaces
- [ ] No indigo/blue/purple
- [ ] Skeleton loading during initial fetch
- [ ] Haptic feedback on book remove
- [ ] Long-press NOT used on book cards (swipe only)
- [ ] Header description `line-clamp-2` max
- [ ] Typography: Playfair for headings, Inter for body
- [ ] Colors match design system exactly
- [ ] Bottom nav present on this page
- [ ] Cover images: `object-cover`, fixed dimensions

---

## 8. Complete Stitch Prompt

```
Build a mobile-only playlist detail page for a library app. Max-width 640px, centered. Route: /playlists/:id

DESIGN SYSTEM:
- Canvas background: #16110f
- Surface: #211a17
- Primary accent: #e8693f
- Border: #3a322d
- Text primary: #ece0dc
- Text secondary: #a89c93
- Fonts: Playfair Display (display), Inter (body)

LAYOUT (top to bottom, single column):

1. STICKY HEADER: z-40, bg-[#16110f], border-b border-[#3a322d], pt-[env(safe-area-inset-top)].
   - Row: Back button (ChevronLeft icon, min-h-[44px] min-w-[44px], -ml-2 for larger touch area) | Playlist name (Playfair text-xl text-[#ece0dc] truncate, flex-1) | Edit icon (Pencil, min-h-[44px] min-w-[44px], only if isOwner)
   - Below name: description in Inter text-sm text-[#a89c93] line-clamp-2 (if present)
   - Below description: "{count} books" in Inter text-xs text-[#a89c93]
   - Sticky top-0, opaque background, no blur

2. BOOK LIST: px-4 py-3 space-y-3. Each book card is a SwipeableRow component.

3. BOOK CARD (inside SwipeableRow):
   - Outer: flex gap-3 bg-[#211a17] rounded-xl border border-[#3a322d] p-3
   - Left: Book cover image w-14 h-20 rounded-lg object-cover flex-shrink-0, loading="lazy"
   - Right (flex-1 min-w-0 py-0.5): Title in Playfair text-sm text-[#ece0dc] truncate, Author in Inter text-xs text-[#a89c93] truncate mt-0.5
   - whileTap={{ scale: 0.98 }}

4. SWIPE-TO-REMOVE:
   - Component: SwipeableRow wrapping each book card
   - Foreground: card content with motion.div, style={{ x }}, drag="x", dragConstraints={{ left: -80, right: 0 }}, dragElastic={0.1}
   - Background (revealed on swipe): absolute inset-0, flex items-center justify-end pr-4, bg-[#ef4444] rounded-xl. Contains Trash2 icon w-5 h-5 text-white + "Remove" text in Inter text-sm text-white ml-2
   - On dragEnd: if offset.x < -80, trigger onSwipeLeft callback (removes book) + haptic navigator.vibrate(10). Then animate x back to 0.
   - Removed card: exit animation — opacity 0, height 0, marginBottom 0, transition 0.3s easeInOut, with layout prop
   - After removal, show success toast: "Book removed from playlist", auto-dismiss 3s
   - If playlist becomes empty, transition to empty state

5. EMPTY STATE: Centered vertically, py-20 px-6.
   - Icon: BookOpen w-10 h-10 text-[#a89c93] inside w-24 h-24 rounded-full bg-[#211a17] flex items-center justify-center
   - "No books in this playlist" in Playfair text-lg text-[#ece0dc] text-center
   - "Add books from your collection to get started" in Inter text-sm text-[#a89c93] text-center mt-1
   - If isOwner: "Add Books" button, min-h-[44px] px-6 rounded-xl bg-[#e8693f] text-white font-[Inter] text-sm font-medium

6. FAB: Fixed bottom-right (right-4), above bottom nav. bottom-[calc(4rem+env(safe-area-inset-bottom))]. w-14 h-14 rounded-full bg-[#e8693f], Plus icon w-6 h-6 text-white. whileTap={{ scale: 0.85 }}. Subtle warm shadow. Navigates to add books. Only show if isOwner.

7. SKELETON LOADING: While data loads, show 5 skeleton book cards. Each: same card shape (flex gap-3, p-3), animate-pulse, bg-[#3a322d] for cover placeholder and two text placeholder bars.

8. BOTTOM NAV: Fixed bottom, z-50, opaque #16110f, pb-[env(safe-area-inset-bottom)]. 4 tabs: Home, Search, Playlists (active), Profile. Each tab min-h-[44px] min-w-[44px].

INTERACTIONS:
- Swipe left on book card reveals red Remove button (80px threshold, elastic 0.1)
- Release past threshold removes book, haptic vibrate(10), success toast
- Release before threshold snaps card back with spring
- Back button navigates to playlist list (page slides left)
- Edit icon navigates to edit page (page slides right)
- FAB press animates (scale 0.85), navigates to add books
- Book cards stagger in on load (staggerChildren 0.04, opacity 0→1, y 16→0)
- Card press: scale 0.98 with spring

DO NOT use: shadow-lg, glassmorphism, indigo/blue/purple, multiple columns on book grid, dropdowns, popovers, tooltips, hamburger menu, or any element without min-h-[44px].

Use the existing BottomSheet component if any sheet dialogs are needed. Use the project's router for navigation.
```
