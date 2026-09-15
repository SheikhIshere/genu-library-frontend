# 12 — Playlist Detail (Tablet)

## 1. Page Title & Route

**Page:** Playlist Detail
**Route:** `/playlists/:id`
**Nav Tab:** Playlists (active)
**Auth Required:** Yes
**Params:** `id` — playlist identifier
**Breakpoint:** 641px–1024px

---

## 2. Tablet Design Rationale

The detail page on tablet shows more books per row in a 2-column grid, reducing scroll depth. The top nav keeps navigation persistent. The playlist header shows name, description, and edit icon inline. Book cards use a grid layout with cover, title, author, and a remove button (for owners). Hover states on cards reveal subtle lift. The empty state fills the viewport more prominently. Modals replace swipe-to-remove for book management — cleaner on a larger touch screen.

---

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────┐
│  Logo   Home  Search  Playlists ▾  Profile     [🔍] │ ← horizontal top nav
├──────────────────────────────────────────────────────┤
│                                                      │
│  ← Back   Reading List                    [✏️]       │ ← playlist header
│  My favorite books about focus and deep work         │
│  12 books                                           │
│                                                      │
│  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ ┌──┐ Reading         │  │ ┌──┐ Deep Work        │  │ ← 2-col book grid
│  │ │  │ Recovery        │  │ │  │ Cal Newport       │  │
│  │ │  │ Jane Smith      │  │ │  │                   │  │
│  │ └──┘          [×]    │  │ └──┘            [×]   │  │
│  └──────────────────────┘  └──────────────────────┘  │
│                                                      │
│  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ ┌──┐ Atomic Habits   │  │ ┌──┐ Thinking, Fast  │  │
│  │ │  │ James Clear      │  │ │  │ Daniel Kahneman │  │
│  │ └──┘          [×]    │  │ └──┘            [×]   │  │
│  └──────────────────────┘  └──────────────────────┘  │
│                                                      │
│                              [+]                     │ ← FAB bottom-right
└──────────────────────────────────────────────────────┘
```

**Max-width:** `max-w-[960px] mx-auto`
**Horizontal padding:** `px-6`
**Grid:** `grid grid-cols-2 gap-4`
**Book card:** horizontal layout (cover left, info right) with remove button

---

## 4. Component Breakdown

### 4.1 Top Navigation
```tsx
<nav className="sticky top-0 z-50 bg-[#16110f] border-b border-[#3a322d] px-6">
  <div className="flex items-center h-14 max-w-[960px] mx-auto">
    <span className="font-[Playfair_Display] text-lg text-[#e8693f] mr-8">
      Library
    </span>
    <div className="flex items-center gap-1">
      {[
        { label: "Home", icon: Home, active: false },
        { label: "Search", icon: Search, active: false },
        { label: "Playlists", icon: ListMusic, active: true },
        { label: "Profile", icon: User, active: false },
      ].map((tab) => (
        <button
          key={tab.label}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg min-h-[40px] font-[Inter] text-sm transition-colors ${
            tab.active
              ? "text-[#e8693f] bg-[#e8693f20]"
              : "text-[#a89c93] hover:text-[#ece0dc] hover:bg-[#2a211c]"
          }`}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
    <div className="flex-1" />
    <button className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg hover:bg-[#2a211c] transition-colors">
      <SearchIcon className="w-5 h-5 text-[#a89c93]" />
    </button>
  </div>
</nav>
```

### 4.2 Playlist Header
```tsx
<header className="px-6 pt-6 pb-4 max-w-[960px] mx-auto border-b border-[#3a322d]">
  <div className="flex items-start gap-4">
    <button
      onClick={goBack}
      className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg hover:bg-[#2a211c] transition-colors mt-0.5"
    >
      <ChevronLeft className="w-5 h-5 text-[#ece0dc]" />
    </button>
    <div className="flex-1 min-w-0">
      <h1 className="font-[Playfair_Display] text-2xl text-[#ece0dc]">
        {playlist.name}
      </h1>
      {playlist.description && (
        <p className="font-[Inter] text-sm text-[#a89c93] mt-1 line-clamp-2">
          {playlist.description}
        </p>
      )}
      <p className="font-[Inter] text-xs text-[#a89c93] mt-2">
        {playlist.bookCount} books
      </p>
    </div>
    {isOwner && (
      <button
        onClick={goToEdit}
        className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg hover:bg-[#2a211c] transition-colors"
      >
        <Pencil className="w-5 h-5 text-[#a89c93]" />
      </button>
    )}
  </div>
</header>
```

- Back button, playlist name, description, book count, edit icon
- `line-clamp-2` on description to prevent blowout

### 4.3 Book Card (2-Column Grid)
```tsx
<motion.div
  layout
  whileHover={{ y: -2, boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
  className="bg-[#211a17] rounded-xl border border-[#3a322d] hover:border-[#4d433d] overflow-hidden transition-colors"
>
  <div className="flex gap-3 p-4">
    <img
      src={book.coverUrl}
      alt={book.title}
      className="w-16 h-24 rounded-lg object-cover flex-shrink-0"
      loading="lazy"
    />
    <div className="flex-1 min-w-0">
      <h3 className="font-[Playfair_Display] text-sm text-[#ece0dc] truncate">
        {book.title}
      </h3>
      <p className="font-[Inter] text-xs text-[#a89c93] truncate mt-0.5">
        {book.author}
      </p>
    </div>
  </div>

  {isOwner && (
    <div className="px-4 pb-3 flex justify-end">
      <button
        onClick={() => openRemoveModal(book)}
        className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg hover:bg-[#2a211c] transition-colors"
      >
        <X className="w-4 h-4 text-[#a89c93]" />
      </button>
    </div>
  )}
</motion.div>
```

- Larger cover than mobile (w-16 h-24 vs w-14 h-20)
- Remove button (X) only for owners
- Hover: `y: -2` lift + border lighten

### 4.4 Remove Book Confirmation Modal (NOT bottom sheet)
```tsx
{removeModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
    <div className="absolute inset-0 bg-black/60" onClick={closeRemoveModal} />
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative bg-[#211a17] border border-[#3a322d] rounded-2xl w-full max-w-[400px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <h3 className="font-[Playfair_Display] text-lg text-[#ece0dc] mb-2">
        Remove Book?
      </h3>
      <p className="font-[Inter] text-sm text-[#a89c93] mb-6">
        Remove "{removeTarget?.title}" from this playlist?
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={closeRemoveModal}
          className="min-h-[40px] px-4 rounded-xl border border-[#3a322d] text-[#ece0dc] font-[Inter] text-sm hover:bg-[#2a211c] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleRemoveBook}
          className="min-h-[40px] px-4 rounded-xl bg-[#c44d4d] text-white font-[Inter] text-sm font-medium hover:bg-[#b03c3c] transition-colors"
        >
          Remove
        </button>
      </div>
    </motion.div>
  </div>
)}
```

- Centered modal, same pattern as delete playlist modal
- Error color `#c44d4d` for destructive action

### 4.5 Empty State
```tsx
<div className="flex flex-col items-center justify-center py-24 px-6">
  <div className="w-28 h-28 mb-5 rounded-full bg-[#211a17] flex items-center justify-center">
    <BookOpen className="w-12 h-12 text-[#a89c93]" />
  </div>
  <p className="font-[Playfair_Display] text-xl text-[#ece0dc] text-center">
    No books in this playlist
  </p>
  <p className="font-[Inter] text-sm text-[#a89c93] text-center mt-1.5 max-w-[320px]">
    Add books from your collection to get started
  </p>
  {isOwner && (
    <button
      onClick={goToAddBooks}
      className="mt-6 min-h-[44px] px-6 rounded-xl bg-[#e8693f] text-[#16110f] font-[Inter] text-sm font-medium hover:bg-[#d45a30] transition-colors"
    >
      Add Books
    </button>
  )}
</div>
```

### 4.6 FAB (Add Books — Owner Only)
```tsx
{isOwner && (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.9 }}
    onClick={goToAddBooks}
    className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-[#e8693f] flex items-center justify-center shadow-[0_4px_12px_rgba(232,105,63,0.3)] hover:shadow-[0_6px_20px_rgba(232,105,63,0.4)] transition-shadow"
  >
    <Plus className="w-6 h-6 text-[#16110f]" />
  </motion.button>
)}
```

### 4.7 Remove Success Toast
```tsx
// After book removal
<Toast variant="success" duration={3000}>
  Book removed from playlist
</Toast>
```

### 4.8 Skeleton Loader
```tsx
<div className="grid grid-cols-2 gap-4 px-6 max-w-[960px] mx-auto pt-6">
  {Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="bg-[#211a17] rounded-xl border border-[#3a322d] p-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-16 h-24 rounded-lg bg-[#3a322d]" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 w-3/4 rounded bg-[#3a322d]" />
          <div className="h-3 w-1/2 rounded bg-[#3a322d]" />
        </div>
      </div>
    </div>
  ))}
</div>
```

---

## 5. Tablet Interactions

| Trigger | Action | Feedback |
|---|---|---|
| Hover book card | Lift + glow | `y: -2`, `boxShadow`, border lighten |
| Click back button | Navigate to playlist list | Page slides left |
| Click edit icon | Navigate to edit page | Page slides right |
| Click remove (X) on book | Open remove confirmation modal | Modal animates in |
| Click modal backdrop | Close modal | Modal animates out |
| Click "Remove" in modal | Remove book from playlist | Card exits, haptic, success toast |
| Click "Cancel" in modal | Close modal | Modal animates out |
| Click FAB (+) | Navigate to add books | FAB press animation |
| Click "Add Books" (empty) | Navigate to add books | Button press animation |
| Hover edit button | Background darken | `hover:bg-[#2a211c]` |
| Hover remove button | Background darken | `hover:bg-[#2a211c]` |
| Keyboard: Escape | Close modal | Dismiss overlay |

### Remove Book Details
- Click X button on book card opens modal
- Modal shows book title in warning message
- On confirm: API call to remove book, card exits with animation
- Haptic: `navigator.vibrate(10)` on removal
- Toast: "Book removed from playlist", auto-dismiss 3s
- If playlist becomes empty after removal, transition to empty state

### Back Navigation
- Uses browser history or router back
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

### Book Card Hover
```tsx
whileHover={{ y: -2, boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
transition={{ type: "spring", stiffness: 300, damping: 20 }}
```

### Card Exit (Remove)
```tsx
exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
transition={{ duration: 0.3 }}
layout
```

### Remove Modal
```tsx
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.95 }}
transition={{ type: "spring", stiffness: 400, damping: 30 }}
```

### FAB
```tsx
whileTap={{ scale: 0.85 }}
transition={{ type: "spring", stiffness: 500, damping: 20 }}
```

---

## 7. Tablet-Specific Anti-Slop Checklist

- [ ] `max-w-[960px]` wrapper on all content
- [ ] `px-6` padding (24px) instead of mobile's `px-4`
- [ ] Horizontal top nav — NO bottom nav
- [ ] All interactive elements `min-h-[40px] min-w-[40px]`
- [ ] 2-column grid for book cards: `grid-cols-2`
- [ ] Book cards use horizontal layout (cover + info side by side)
- [ ] Hover states on cards, buttons, and nav tabs
- [ ] Remove book uses modal, NOT swipe-to-remove or bottom sheet
- [ ] Modal has backdrop overlay + close on backdrop click
- [ ] Card hover: `y: -2` lift + border lighten
- [ ] Edit icon only visible if `isOwner`
- [ ] FAB: `bottom-8 right-8` (no bottom nav to clear)
- [ ] Empty state only shows "Add Books" for playlist owner
- [ ] No `shadow-lg` — only custom warm glow on FAB and card hover
- [ ] No glassmorphism — opaque surfaces
- [ ] No indigo/blue/purple
- [ ] Skeleton loading shown during initial fetch (2-col grid)
- [ ] Haptic feedback on book remove
- [ ] Success toast after book removal
- [ ] Header description `line-clamp-2` max
- [ ] Typography: Playfair for headings, Inter for body
- [ ] Colors match design system exactly
- [ ] Cover images: `object-cover`, fixed dimensions
- [ ] Modal focus trap: first focusable element receives focus
- [ ] Dropdown/modal closes on Escape key

---

## 8. Complete Stitch Prompt

```
Build a tablet-only playlist detail page for a library app. Breakpoint: 641px–1024px. Max-width 960px, centered. Route: /playlists/:id. NO bottom nav.

DESIGN SYSTEM:
- Canvas background: #16110f
- Surface: #211a17
- Surface Hover: #2a211c
- Accent: #e8693f
- Accent Hover: #d45a30
- Border: #3a322d
- Border Hover: #4d433d
- Text primary: #ece0dc
- Text secondary: #a89c93
- Text muted: #7a706a
- Text on accent: #16110f
- Status: Success #4a7c59, Error #c44d4d, Warning #d4a24e, Info #5b8fb9
- Fonts: Playfair Display (headings), Inter (body), JetBrains Mono (prices)
- Radius: sm 4px, md 8px, lg 12px, xl 16px, 2xl 24px, full 9999px
- Elevation: 0=canvas, 1=surface+border, 2=surface+border+shadow(0 4px 24px), 3=surface hover+shadow(0 8px 32px)
- Animations: spring cubic-bezier(0.34, 1.56, 0.64, 1), smooth cubic-bezier(0.25, 0.1, 0.25, 1), dramatic cubic-bezier(0.19, 1, 0.22, 1)

LAYOUT (top to bottom):
1. HORIZONTAL TOP NAV: sticky top-0 z-50, bg-[#16110f], border-b border-[#3a322d], px-6, h-14. Flex row max-w-[960px] mx-auto.
   - Logo: "Library" in Playfair_Display text-lg text-[#e8693f] mr-8
   - Tabs: Home, Search, Playlists (active), Profile. Each: flex items-center gap-2 px-3 py-2 rounded-lg min-h-[40px] font-[Inter] text-sm. Active: text-[#e8693f] bg-[#e8693f20]. Inactive: text-[#a89c93] hover:text-[#ece0dc] hover:bg-[#2a211c].
   - Right: SearchIcon button, min-h-[40px] min-w-[40px].

2. PLAYLIST HEADER: px-6 pt-6 pb-4 max-w-[960px] mx-auto border-b border-[#3a322d]. Flex row items-start gap-4.
   - Back button: min-h-[40px] min-w-[40px] rounded-lg hover:bg-[#2a211c] mt-0.5. ChevronLeft icon.
   - Content (flex-1 min-w-0): Playlist name in Playfair_Display text-2xl text-[#ece0dc]. Description in Inter text-sm text-[#a89c93] mt-1 line-clamp-2 (if present). Book count in Inter text-xs text-[#a89c93] mt-2.
   - Edit button (if isOwner): min-h-[40px] min-w-[40px] rounded-lg hover:bg-[#2a211c]. Pencil icon.

3. BOOK GRID: px-6 pt-6 max-w-[960px] mx-auto. Grid: grid-cols-2 gap-4. Each book card:
   - Outer: bg-[#211a17] rounded-xl border border-[#3a322d] hover:border-[#4d433d] overflow-hidden transition-colors
   - whileHover: y -2, boxShadow "0 4px 24px rgba(0,0,0,0.2)"
   - Content: flex gap-3 p-4. Left: book cover image w-16 h-24 rounded-lg object-cover flex-shrink-0. Right (flex-1 min-w-0): Title in Playfair_Display text-sm text-[#ece0dc] truncate, Author in Inter text-xs text-[#a89c93] truncate mt-0.5.
   - Owner actions (if isOwner): px-4 pb-3 flex justify-end. X button: min-h-[40px] min-w-[40px] rounded-lg hover:bg-[#2a211c]. X icon w-4 h-4 text-[#a89c93].
   - Cards stagger in on load: staggerChildren 0.04, opacity 0→1, y 16→0.

4. REMOVE BOOK MODAL (NOT swipe, NOT bottom sheet):
   - Fixed inset-0 z-50 flex items-center justify-center p-6
   - Backdrop: absolute inset-0 bg-black/60, onClick closes modal
   - Modal: relative bg-[#211a17] border border-[#3a322d] rounded-2xl w-full max-w-[400px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]
   - Title: "Remove Book?" in Playfair_Display text-lg text-[#ece0dc] mb-2
   - Body: 'Remove "{book.title}" from this playlist?' in Inter text-sm text-[#a89c93] mb-6
   - Buttons: flex gap-3 justify-end. Cancel: min-h-[40px] px-4 rounded-xl border border-[#3a322d] text-[#ece0dc] font-[Inter] text-sm hover:bg-[#2a211c]. Remove: min-h-[40px] px-4 rounded-xl bg-[#c44d4d] text-white font-[Inter] text-sm font-medium hover:bg-[#b03c3c].
   - Enter: initial opacity 0 scale 0.95 → animate opacity 1 scale 1, spring stiffness 400 damping 30.
   - On confirm: API remove book, haptic vibrate(10), card exit animation (opacity 0, scale 0.9, height 0, marginBottom 0, layout), success toast "Book removed from playlist" auto-dismiss 3s.
   - If playlist becomes empty, transition to empty state.

5. EMPTY STATE: py-24 px-6 flex flex-col items-center. Icon: BookOpen w-12 h-12 text-[#a89c93] in w-28 h-28 rounded-full bg-[#211a17] flex items-center justify-center. "No books in this playlist" in Playfair_Display text-xl text-[#ece0dc] text-center. "Add books from your collection to get started" in Inter text-sm text-[#a89c93] text-center mt-1.5 max-w-[320px]. If isOwner: "Add Books" button, mt-6 min-h-[44px] px-6 rounded-xl bg-[#e8693f] text-[#16110f] font-[Inter] text-sm font-medium hover:bg-[#d45a30].

6. FAB (owner only): fixed bottom-8 right-8 z-40. w-14 h-14 rounded-full bg-[#e8693f] flex items-center justify-center shadow-[0_4px_12px_rgba(232,105,63,0.3)] hover:shadow-[0_6px_20px_rgba(232,105,63,0.4)] transition-shadow. Plus icon w-6 h-6 text-[#16110f]. whileHover: scale 1.05, whileTap: scale 0.85.

7. SKELETON LOADING: grid grid-cols-2 gap-4 px-6 max-w-[960px] mx-auto pt-6. 6 skeleton cards: bg-[#211a17] rounded-xl border border-[#3a322d] p-4 animate-pulse. Each: flex gap-3, w-16 h-24 cover placeholder + two text bars. All bg-[#3a322d].

INTERACTIONS:
- Hover book card: lift + glow, border lighten
- Click back: navigate to playlist list (page slides left)
- Click edit: navigate to edit page (page slides right)
- Click X on book: open remove modal
- Modal backdrop click: close modal
- Modal Remove button: remove book, haptic, card exits, toast
- Modal Cancel: close modal
- FAB: navigate to add books (only if isOwner)
- Keyboard: Escape closes modal, Tab traps in modal

DO NOT use: bottom nav, bottom sheets, swipe-to-remove, shadow-lg, glassmorphism, indigo/blue/purple, single column grid, dropdowns, popovers, tooltips, hamburger menu, or any element without min-h-[40px].

Use the project's router for navigation. Use existing toast component for success/error messages.
```
