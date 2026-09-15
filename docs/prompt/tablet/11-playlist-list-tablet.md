# 11 — Playlist List (Tablet)

## 1. Page Title & Route

**Page:** Playlist List
**Route:** `/playlists`
**Nav Tab:** Playlists (active)
**Auth Required:** Yes
**Breakpoint:** 641px–1024px

---

## 2. Tablet Design Rationale

Tablet users have more screen real estate but still rely on touch. A horizontal top nav replaces the bottom nav to reclaim vertical space. Playlist cards use a 2-column grid to show more content without excessive scrolling. Hover states provide desktop-like feedback — cards lift with a subtle glow on hover. Sort is an inline dropdown, not a bottom sheet, since there's enough horizontal space. The FAB remains for quick create access. All touch targets are min-h-[40px] min-w-[40px] to prevent mis-taps on tablet-sized fingers.

---

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────┐
│  Logo   Home  Search  Playlists ▾  Profile     [🔍] │ ← horizontal top nav
├──────────────────────────────────────────────────────┤
│                                                      │
│  My Playlists              Sort by: Newest ▾         │ ← title + inline sort
│                                                      │
│  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ ┌──┬──┐ ┌──┬──┐     │  │ ┌──┬──┐ ┌──┬──┐     │  │ ← 2-col grid
│  │ │  │  │ │  │  │     │  │ │  │  │ │  │  │     │  │
│  │ ├──┼──┤ ├──┼──┤     │  │ ├──┼──┤ ├──┼──┤     │  │
│  │ │  │  │ │  │  │     │  │ │  │  │ │  │  │     │  │
│  │ └──┴──┘ └──┴──┘     │  │ └──┴──┘ └──┴──┘     │  │
│  │ Reading List          │  │ Favorites            │  │
│  │ 12 books · Fiction    │  │ 8 books · Sci-Fi     │  │
│  └──────────────────────┘  └──────────────────────┘  │
│                                                      │
│  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ ┌──┬──┐ ┌──┬──┐     │  │ ┌──┬──┐ ┌──┬──┐     │  │
│  │ │  │  │ │  │  │     │  │ │  │  │ │  │  │     │  │
│  │ ├──┼──┤ ├──┼──┤     │  │ ├──┼──┤ ├──┼──┤     │  │
│  │ │  │  │ │  │  │     │  │ │  │  │ │  │  │     │  │
│  │ └──┴──┘ └──┴──┘     │  │ └──┴──┘ └──┴──┘     │  │
│  │ Want to Read          │  │ Book Club             │  │
│  │ 5 books · Mixed       │  │ 15 books · Non-Fic   │  │
│  └──────────────────────┘  └──────────────────────┘  │
│                                                      │
│                                              [+]     │ ← FAB bottom-right
└──────────────────────────────────────────────────────┘
```

**Max-width:** `max-w-[960px] mx-auto`
**Horizontal padding:** `px-6`
**Grid:** `grid grid-cols-2 gap-4`
**Card hover elevation:** elevation 2 on hover

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

- Horizontal nav with Playfair logo, tab buttons with icons
- Active tab: `#e8693f` text + `#e8693f20` background
- Hover: `hover:text-[#ece0dc] hover:bg-[#2a211c]`
- `min-h-[40px]` on all nav buttons

### 4.2 Page Header with Inline Sort
```tsx
<header className="px-6 pt-6 pb-2 max-w-[960px] mx-auto">
  <div className="flex items-center justify-between">
    <h1 className="font-[Playfair_Display] text-2xl text-[#ece0dc]">
      My Playlists
    </h1>
    <div className="relative">
      <button
        onClick={() => setSortOpen(!sortOpen)}
        className="flex items-center gap-2 min-h-[40px] px-3 rounded-lg border border-[#3a322d] bg-[#211a17] hover:bg-[#2a211c] hover:border-[#4d433d] transition-colors"
      >
        <ArrowUpDown className="w-4 h-4 text-[#a89c93]" />
        <span className="font-[Inter] text-sm text-[#a89c93]">
          Sort by: {sortLabel}
        </span>
        <ChevronDown className={`w-3 h-3 text-[#a89c93] transition-transform ${sortOpen ? "rotate-180" : ""}`} />
      </button>

      {sortOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-[#211a17] border border-[#3a322d] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden z-50">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setSort(opt.value); setSortOpen(false); }}
              className="w-full flex items-center justify-between px-4 min-h-[40px] font-[Inter] text-sm text-[#ece0dc] hover:bg-[#2a211c] transition-colors"
            >
              {opt.label}
              {sort === opt.value && <Check className="w-4 h-4 text-[#e8693f]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
</header>
```

- Inline dropdown for sort (not bottom sheet)
- Dropdown: `bg-[#211a17] border-[#3a322d] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]`
- Click outside closes dropdown (via `useEffect` on document click)

### 4.3 Search Bar (in page header row)
```tsx
<div className="relative max-w-[960px] mx-auto px-6 pb-4">
  <SearchIcon className="absolute left-9 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a89c93]" />
  <input
    type="text"
    placeholder="Search playlists..."
    className="w-full min-h-[44px] rounded-xl bg-[#211a17] border border-[#3a322d] pl-11 pr-4 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f] hover:border-[#4d433d] transition-colors"
  />
</div>
```

- `min-h-[44px]` touch target
- Hover: `hover:border-[#4d433d]`

### 4.4 Playlist Card (2-Column Grid)
```tsx
<motion.div
  layout
  whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
  whileTap={{ scale: 0.98 }}
  onClick={() => navigateTo(`/playlists/${playlist.id}`)}
  className="bg-[#211a17] rounded-2xl border border-[#3a322d] hover:border-[#4d433d] overflow-hidden cursor-pointer transition-colors"
>
  {/* Cover Collage */}
  <div className="grid grid-cols-2 gap-[2px] h-44">
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
  <div className="p-4">
    <h3 className="font-[Playfair_Display] text-base text-[#ece0dc] truncate">
      {playlist.name}
    </h3>
    <p className="font-[Inter] text-xs text-[#a89c93] truncate mt-1">
      {playlist.bookCount} books · {playlist.description || "No description"}
    </p>
  </div>

  {/* Action Menu (on hover) */}
  <div className="px-4 pb-3 flex justify-end gap-2">
    <button
      onClick={(e) => { e.stopPropagation(); goToEdit(playlist.id); }}
      className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg hover:bg-[#2a211c] transition-colors"
    >
      <Pencil className="w-4 h-4 text-[#a89c93]" />
    </button>
    <button
      onClick={(e) => { e.stopPropagation(); openDeleteModal(playlist); }}
      className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg hover:bg-[#2a211c] transition-colors"
    >
      <Trash2 className="w-4 h-4 text-[#a89c93]" />
    </button>
  </div>
</motion.div>
```

- `whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}` for lift + glow
- Hover border: `hover:border-[#4d433d]`
- Action buttons inline on each card (edit + delete)
- `cursor-pointer` for pointer devices

### 4.5 Delete Confirmation Modal (NOT bottom sheet)
```tsx
{deleteModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
    <div className="absolute inset-0 bg-black/60" onClick={closeDeleteModal} />
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative bg-[#211a17] border border-[#3a322d] rounded-2xl w-full max-w-[400px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <h3 className="font-[Playfair_Display] text-lg text-[#ece0dc] mb-2">
        Delete Playlist?
      </h3>
      <p className="font-[Inter] text-sm text-[#a89c93] mb-6">
        This will permanently delete "{deleteTarget?.name}" and remove all books from it. This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={closeDeleteModal}
          className="min-h-[40px] px-4 rounded-xl border border-[#3a322d] text-[#ece0dc] font-[Inter] text-sm hover:bg-[#2a211c] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="min-h-[40px] px-4 rounded-xl bg-[#c44d4d] text-white font-[Inter] text-sm font-medium hover:bg-[#b03c3c] transition-colors"
        >
          Delete
        </button>
      </div>
    </motion.div>
  </div>
)}
```

- Centered modal with backdrop overlay
- Uses `#c44d4d` for error/delete (design system error color)
- Spring animation on enter/exit
- Close on backdrop click

### 4.6 Empty State
```tsx
<div className="flex flex-col items-center justify-center py-24 px-6">
  <div className="w-28 h-28 mb-5 rounded-full bg-[#211a17] flex items-center justify-center">
    <BookOpen className="w-12 h-12 text-[#a89c93]" />
  </div>
  <p className="font-[Playfair_Display] text-xl text-[#ece0dc] text-center">
    No playlists yet
  </p>
  <p className="font-[Inter] text-sm text-[#a89c93] text-center mt-1.5 max-w-[320px]">
    Create your first playlist to organize your reading
  </p>
  <button
    onClick={goToCreate}
    className="mt-6 min-h-[44px] px-6 rounded-xl bg-[#e8693f] text-[#16110f] font-[Inter] text-sm font-medium hover:bg-[#d45a30] transition-colors"
  >
    Create Playlist
  </button>
</div>
```

- Larger icon and text than mobile
- Button hover: `hover:bg-[#d45a30]`

### 4.7 FAB (Floating Action Button)
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.9 }}
  onClick={goToCreate}
  className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-[#e8693f] flex items-center justify-center shadow-[0_4px_12px_rgba(232,105,63,0.3)] hover:shadow-[0_6px_20px_rgba(232,105,63,0.4)] transition-shadow"
>
  <Plus className="w-6 h-6 text-[#16110f]" />
</motion.button>
```

- Bottom-right fixed, no bottom nav to avoid
- `whileHover` adds scale up
- Warm glow shadow

### 4.8 Skeleton Loader
```tsx
<div className="grid grid-cols-2 gap-4 px-6 max-w-[960px] mx-auto">
  {Array.from({ length: 6 }).map((_, i) => (
    <div key={i} className="bg-[#211a17] rounded-2xl border border-[#3a322d] overflow-hidden animate-pulse">
      <div className="grid grid-cols-2 gap-[2px] h-44 bg-[#3a322d]" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-[#3a322d]" />
        <div className="h-3 w-1/2 rounded bg-[#3a322d]" />
      </div>
    </div>
  ))}
</div>
```

---

## 5. Tablet Interactions

| Trigger | Action | Feedback |
|---|---|---|
| Hover card | Lift + glow shadow | `y: -2`, `boxShadow` increase, border lighten |
| Click card | Navigate to detail | Card press animation, page transition |
| Hover sort button | Border lighten | `hover:border-[#4d433d]` |
| Click sort button | Toggle inline dropdown | Chevron rotates, dropdown appears |
| Click sort option | Apply sort, close dropdown | Dropdown closes, list re-orders |
| Hover edit button | Background darken | `hover:bg-[#2a211c]` |
| Click edit | Navigate to edit page | Page transition |
| Hover delete button | Background darken | `hover:bg-[#2a211c]` |
| Click delete | Open delete modal | Modal animates in (spring scale) |
| Click modal backdrop | Close modal | Modal animates out |
| Click "Delete" in modal | Delete playlist | Haptic, card exits, modal closes |
| Click "Cancel" in modal | Close modal | Modal animates out |
| Click FAB (+) | Navigate to create | FAB press animation |
| Focus search input | Highlight border | `focus:border-[#e8693f]` |
| Hover nav tab | Background darken | `hover:bg-[#2a211c]` |
| Keyboard: Escape | Close dropdown/modal | Dismiss overlay |

### Sort Dropdown Details
- Opens downward from button, right-aligned
- Closes on click outside (document listener)
- Closes on Escape key
- Each option: `min-h-[40px]`, hover `hover:bg-[#2a211c]`
- Selected option shows `Check` icon in `#e8693f`

### Search Details
- Debounce: 300ms
- Clear button appears when input has text
- Client-side filter on loaded playlists
- Empty results: "No playlists match your search"

---

## 6. Animation Spec

### Page Enter
```tsx
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

### Card Hover
```tsx
whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
transition={{ type: "spring", stiffness: 300, damping: 20 }}
```

### Card Press
```tsx
whileTap={{ scale: 0.98 }}
transition={{ type: "spring", stiffness: 400, damping: 30 }}
```

### Card Exit (Delete)
```tsx
exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
transition={{ duration: 0.3 }}
layout
```

### Sort Dropdown
```tsx
initial={{ opacity: 0, y: -8 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -8 }}
transition={{ duration: 0.15 }}
```

### Delete Modal
```tsx
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.95 }}
transition={{ type: "spring", stiffness: 400, damping: 30 }}
```

### FAB
```tsx
whileTap={{ scale: 0.85, rotate: 90 }}
transition={{ type: "spring", stiffness: 500, damping: 20 }}
```

---

## 7. Tablet-Specific Anti-Slop Checklist

- [ ] `max-w-[960px]` wrapper on all content
- [ ] `px-6` padding (24px) instead of mobile's `px-4`/`px-5`
- [ ] Horizontal top nav — NO bottom nav
- [ ] All interactive elements `min-h-[40px] min-w-[40px]`
- [ ] 2-column grid for playlist cards: `grid-cols-2`
- [ ] Hover states on cards, buttons, and nav tabs
- [ ] Sort is inline dropdown, NOT bottom sheet
- [ ] Delete confirmation uses modal, NOT bottom sheet
- [ ] Modal has backdrop overlay + close on backdrop click
- [ ] Card hover: `y: -2` lift + `boxShadow` glow
- [ ] Card hover border: `hover:border-[#4d433d]`
- [ ] FAB: `bottom-8 right-8` (no bottom nav to clear)
- [ ] No `shadow-lg` — only custom warm glow on FAB and card hover
- [ ] No glassmorphism — all surfaces opaque `#211a17`
- [ ] No indigo/blue/purple anywhere
- [ ] Skeleton loading shown during initial fetch (2-col grid)
- [ ] Search debounce >= 250ms
- [ ] Typography: Playfair for headings, Inter for body
- [ ] Colors match design system exactly
- [ ] Empty state includes illustration, message, and CTA button
- [ ] Dropdown closes on click outside and Escape key
- [ ] Focus management: Escape closes overlays, Tab traps in modal
- [ ] Modal focus trap: first focusable element receives focus on open
- [ ] Sort dropdown is z-50 (above cards)

---

## 8. Complete Stitch Prompt

```
Build a tablet-only playlist list page for a library app. Breakpoint: 641px–1024px. Max-width 960px, centered. NO bottom nav.

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
1. HORIZONTAL TOP NAV: sticky top-0 z-50, bg-[#16110f], border-b border-[#3a322d], px-6, h-14. Flex row max-w-[960px] mx-auto:
   - Logo: "Library" in Playfair_Display text-lg text-[#e8693f] mr-8
   - Tabs: flex items-center gap-1. Each tab: flex items-center gap-2 px-3 py-2 rounded-lg min-h-[40px] font-[Inter] text-sm. Inactive: text-[#a89c93] hover:text-[#ece0dc] hover:bg-[#2a211c]. Active (Playlists): text-[#e8693f] bg-[#e8693f20].
   - Right side: SearchIcon button (min-h-[40px] min-w-[40px], rounded-lg, hover:bg-[#2a211c])

2. PAGE HEADER + SORT: px-6 pt-6 pb-2 max-w-[960px] mx-auto. Flex row justify-between:
   - Title: "My Playlists" in Playfair_Display text-2xl text-[#ece0dc]
   - Sort dropdown trigger: button min-h-[40px] px-3 rounded-lg border border-[#3a322d] bg-[#211a17] hover:bg-[#2a211c] hover:border-[#4d433d]. Content: ArrowUpDown icon + "Sort by: {current}" text in Inter text-sm text-[#a89c93] + ChevronDown icon (rotate-180 when open).
   - Sort dropdown: absolute right-0 top-full mt-1 w-48 bg-[#211a17] border border-[#3a322d] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden z-50. 4 options: Newest, Oldest, Name A-Z, Most Books. Each: w-full flex items-center justify-between px-4 min-h-[40px] font-[Inter] text-sm text-[#ece0dc] hover:bg-[#2a211c]. Selected: Check icon w-4 h-4 text-[#e8693f] on right.
   - Close dropdown on click outside (useEffect with document click listener) and on Escape key.

3. SEARCH: px-6 pb-4 max-w-[960px] mx-auto. Relative container. SearchIcon absolutely positioned left-9. Input: w-full min-h-[44px] rounded-xl bg-[#211a17] border border-[#3a322d] pl-11 pr-4 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f] hover:border-[#4d433d] transition-colors. Debounce 300ms. Show clear button when text present. Empty search: "No playlists match your search".

4. PLAYLIST CARDS: px-6 max-w-[960px] mx-auto. Grid: grid-cols-2 gap-4. Each card:
   - Outer: bg-[#211a17] rounded-2xl border border-[#3a322d] hover:border-[#4d433d] overflow-hidden cursor-pointer
   - whileHover: y -2, boxShadow "0 8px 32px rgba(0,0,0,0.3)"
   - whileTap: scale 0.98
   - Cover collage: CSS grid-cols-2, gap-[2px], h-44. 4 slots for book cover images. Empty slots: bg-[#3a322d]. Images: object-cover.
   - Info: p-4. Playlist name in Playfair_Display text-base text-[#ece0dc] truncate. Subtitle in Inter text-xs text-[#a89c93] truncate mt-1: "{count} books · {description}".
   - Action row: px-4 pb-3 flex justify-end gap-2. Edit button (Pencil icon) + Delete button (Trash2 icon). Both: min-h-[40px] min-w-[40px] rounded-lg hover:bg-[#2a211c].
   - Cards stagger in on load: staggerChildren 0.05, opacity 0→1, y 20→0.

5. DELETE CONFIRMATION MODAL (NOT bottom sheet):
   - Fixed inset-0 z-50 flex items-center justify-center p-6
   - Backdrop: absolute inset-0 bg-black/60, onClick closes modal
   - Modal: relative bg-[#211a17] border border-[#3a322d] rounded-2xl w-full max-w-[400px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]
   - Title: "Delete Playlist?" in Playfair_Display text-lg text-[#ece0dc] mb-2
   - Body: warning in Inter text-sm text-[#a89c93] mb-6
   - Buttons: flex gap-3 justify-end. Cancel: min-h-[40px] px-4 rounded-xl border border-[#3a322d] text-[#ece0dc] font-[Inter] text-sm hover:bg-[#2a211c]. Delete: min-h-[40px] px-4 rounded-xl bg-[#c44d4d] text-white font-[Inter] text-sm font-medium hover:bg-[#b03c3c].
   - Enter: initial opacity 0 scale 0.95 → animate opacity 1 scale 1, spring stiffness 400 damping 30.
   - Exit: reverse.
   - Focus trap: first focusable element receives focus on open.

6. FAB: fixed bottom-8 right-8 z-40. w-14 h-14 rounded-full bg-[#e8693f] flex items-center justify-center shadow-[0_4px_12px_rgba(232,105,63,0.3)] hover:shadow-[0_6px_20px_rgba(232,105,63,0.4)] transition-shadow. Plus icon w-6 h-6 text-[#16110f]. whileHover: scale 1.05, whileTap: scale 0.85 rotate 90.

7. EMPTY STATE: py-24 px-6 flex flex-col items-center. Icon: BookOpen w-12 h-12 text-[#a89c93] in w-28 h-28 rounded-full bg-[#211a17] flex items-center justify-center. "No playlists yet" in Playfair_Display text-xl text-[#ece0dc] text-center. "Create your first playlist to organize your reading" in Inter text-sm text-[#a89c93] text-center mt-1.5 max-w-[320px]. "Create Playlist" button: mt-6 min-h-[44px] px-6 rounded-xl bg-[#e8693f] text-[#16110f] font-[Inter] text-sm font-medium hover:bg-[#d45a30].

8. SKELETON LOADING: grid grid-cols-2 gap-4 px-6 max-w-[960px] mx-auto. 6 skeleton cards: same card shape, animate-pulse, bg-[#3a322d] for collage area and text placeholder bars.

INTERACTIONS:
- Hover card: lift + glow (y: -2, boxShadow), border lighten
- Click card: navigate to detail
- Sort dropdown: toggle open/close, click outside closes, Escape closes
- Edit button: navigate to edit page
- Delete button: open delete modal
- Modal backdrop click: close modal
- Modal Delete button: DELETE API, haptic, card exits, modal closes
- FAB: navigate to create
- Search: 300ms debounce, client-side filter
- Keyboard: Escape closes dropdown/modal, Tab traps in modal

DO NOT use: bottom nav, bottom sheets, shadow-lg, glassmorphism, indigo/blue/purple, single column grid, dropdowns (for actions — use inline buttons), popovers, tooltips, hamburger menu, or any element without min-h-[40px].

Use the project's router for navigation. Use existing toast component for success/error messages.
```
