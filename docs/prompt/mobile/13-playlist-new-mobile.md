# 13 — Playlist New (Mobile)

## 1. Page Title & Route

**Page:** Create Playlist
**Route:** `/playlists/new`
**Bottom Nav Index:** 2 (Playlists tab active)
**Auth Required:** Yes

---

## 2. Mobile-First Design Rationale

Creating a playlist on mobile is a form-heavy task. The primary friction is the book picker — the user needs to scroll through their collection and select books. Placing the form fields at the top and the book picker below keeps the flow linear. The "Create" button stays at the bottom in the thumb zone, so the user fills the form top-down and taps create without scrolling back up. A floating selected-count badge on the book picker gives constant feedback.

---

## 3. Mobile Layout Specification

```
┌──────────────────────────────┐ ← env(safe-area-inset-top)
│ ←  Create Playlist           │ ← sticky header
├──────────────────────────────┤
│                              │
│  Playlist Name               │ ← text input
│  ┌────────────────────────┐  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  Description (optional)      │ ← textarea
│  ┌────────────────────────┐  │
│  │                        │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  Add Books                   │ ← section header
│  ┌────────────────────────┐  │
│  │ 🔍 Search books...     │  │ ← search within picker
│  └────────────────────────┘  │
│  Selected: 3 books           │ ← count badge
│                              │
│  ┌──┐ ┌──┐ ┌──┐             │ ← book picker grid
│  │  │ │  │ │  │             │   single column
│  │  │ │✓ │ │  │             │   checkmark on selected
│  └──┘ └──┘ └──┘             │
│  ┌──┐ ┌──┐ ┌──┐             │
│  │✓ │ │  │ │  │             │
│  └──┘ └──┘ └──┘             │
│                              │
├──────────────────────────────┤
│  [  Create Playlist  ]       │ ← CTA button (thumb zone)
├──────────────────────────────┤
│  🏠   🔍   📚   ⚙️          │ ← bottom nav
└──────────────────────────────┘ ← env(safe-area-inset-bottom)
```

**Full-width:** `max-w-[640px] mx-auto`
**Form padding:** `px-4`
**CTA safe area:** `pb-[calc(5rem+env(safe-area-inset-bottom))]`

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
    <h1 className="font-[Playfair_Display] text-xl text-[#ece0dc]">
      Create Playlist
    </h1>
  </div>
</header>
```

### 4.2 Name Input
```tsx
<div className="px-4 pt-4">
  <label className="font-[Inter] text-sm text-[#a89c93] mb-1.5 block">
    Playlist Name
  </label>
  <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="My reading list"
    maxLength={100}
    className="w-full min-h-[44px] rounded-xl bg-[#211a17] border border-[#3a322d] px-4 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f]"
  />
  <span className="font-[Inter] text-xs text-[#a89c93] mt-1 block text-right">
    {name.length}/100
  </span>
</div>
```

- `min-h-[44px]` for touch target
- Character count display
- Focus ring: `border-[#e8693f]`

### 4.3 Description Textarea
```tsx
<div className="px-4 pt-3">
  <label className="font-[Inter] text-sm text-[#a89c93] mb-1.5 block">
    Description <span className="text-[#3a322d]">(optional)</span>
  </label>
  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="What's this playlist about?"
    rows={3}
    maxLength={300}
    className="w-full min-h-[88px] rounded-xl bg-[#211a17] border border-[#3a322d] px-4 py-3 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f] resize-none"
  />
  <span className="font-[Inter] text-xs text-[#a89c93] mt-1 block text-right">
    {description.length}/300
  </span>
</div>
```

- `min-h-[88px]` (2 rows minimum)
- `resize-none` — user cannot resize on mobile
- Character count

### 4.4 Book Picker Section
```tsx
<div className="px-4 pt-5">
  <div className="flex items-center justify-between mb-3">
    <h2 className="font-[Playfair_Display] text-base text-[#ece0dc]">
      Add Books
    </h2>
    {selectedBooks.length > 0 && (
      <span className="font-[Inter] text-xs text-[#e8693f] bg-[#e8693f]/10 px-2.5 py-1 rounded-full">
        {selectedBooks.length} selected
      </span>
    )}
  </div>

  {/* Search within picker */}
  <div className="relative mb-3">
    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89c93]" />
    <input
      type="text"
      value={pickerSearch}
      onChange={(e) => setPickerSearch(e.target.value)}
      placeholder="Search books..."
      className="w-full min-h-[44px] rounded-xl bg-[#211a17] border border-[#3a322d] pl-10 pr-4 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f]"
    />
  </div>
</div>
```

- Selected count badge: `bg-[#e8693f]/10 text-[#e8693f]`
- Search input within picker section
- Both have `min-h-[44px]`

### 4.5 Book Picker Grid
```tsx
<div className="px-4 space-y-2 pb-4">
  {filteredBooks.map((book) => {
    const isSelected = selectedBooks.includes(book.id);
    return (
      <motion.button
        key={book.id}
        whileTap={{ scale: 0.98 }}
        onClick={() => toggleBook(book.id)}
        className={`flex gap-3 w-full text-left rounded-xl border p-3 min-h-[44px] ${
          isSelected
            ? "bg-[#e8693f]/10 border-[#e8693f]"
            : "bg-[#211a17] border-[#3a322d]"
        }`}
      >
        <div className="relative">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-12 h-16 rounded-lg object-cover"
            loading="lazy"
          />
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#e8693f] flex items-center justify-center"
            >
              <Check className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-[Inter] text-sm text-[#ece0dc] truncate">
            {book.title}
          </h3>
          <p className="font-[Inter] text-xs text-[#a89c93] truncate">
            {book.author}
          </p>
        </div>
        {/* Checkbox indicator */}
        <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
          isSelected
            ? "bg-[#e8693f] border-[#e8693f]"
            : "border-[#3a322d]"
        }`}>
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </div>
      </motion.button>
    );
  })}
</div>
```

- Single column: each book is a full-width button
- Selected state: orange tinted background + border
- Checkmark badge on cover corner + checkbox on right
- `whileTap={{ scale: 0.98 }}` on each row

### 4.6 Create Button (Thumb Zone)
```tsx
<div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] px-4 py-3 bg-[#16110f]">
  <motion.button
    whileTap={{ scale: 0.97 }}
    disabled={!name.trim() || isCreating}
    className="w-full min-h-[48px] rounded-xl bg-[#e8693f] text-white font-[Inter] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    {isCreating ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : (
      "Create Playlist"
    )}
  </motion.button>
</div>
```

- `sticky bottom` — stays in thumb zone
- `min-h-[48px]` for primary CTA (larger than minimum)
- Disabled state: `opacity-40` when name is empty
- Loading state: spinner icon

### 4.7 Empty Book List
```tsx
<div className="flex flex-col items-center py-12 px-6">
  <BookOpen className="w-8 h-8 text-[#a89c93] mb-3" />
  <p className="font-[Inter] text-sm text-[#a89c93] text-center">
    No books in your collection yet
  </p>
</div>
```

### 4.8 Skeleton Loader
```tsx
<div className="px-4 pt-4 space-y-4">
  {/* Name skeleton */}
  <div className="space-y-1.5">
    <div className="h-4 w-24 rounded bg-[#3a322d] animate-pulse" />
    <div className="h-11 w-full rounded-xl bg-[#3a322d] animate-pulse" />
  </div>
  {/* Description skeleton */}
  <div className="space-y-1.5">
    <div className="h-4 w-20 rounded bg-[#3a322d] animate-pulse" />
    <div className="h-20 w-full rounded-xl bg-[#3a322d] animate-pulse" />
  </div>
  {/* Picker skeleton */}
  <div className="h-4 w-20 rounded bg-[#3a322d] animate-pulse mt-5" />
  <div className="h-11 w-full rounded-xl bg-[#3a322d] animate-pulse" />
  {Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="flex gap-3 p-3 rounded-xl bg-[#211a17] border border-[#3a322d] animate-pulse">
      <div className="w-12 h-16 rounded-lg bg-[#3a322d]" />
      <div className="flex-1 space-y-2">
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
| Tap back | Navigate to playlist list | Page slides left, discard unsaved changes with confirm |
| Type in name | Update name, show character count | Character count updates live |
| Type in description | Update description, show count | Character count updates live |
| Tap book row | Toggle selection | Haptic light, checkbox toggles, background tints |
| Tap search in picker | Focus picker search | Keyboard slides up |
| Type in picker search | Filter book list | Client-side filter, no debounce needed (local data) |
| Tap Create button | Create playlist, navigate to detail | Haptic heavy, page transitions to new playlist |
| Empty name + tap Create | Button is disabled | No action, button at opacity-40 |

### Book Selection Details
- **Toggle:** Tap anywhere on the row
- **Visual feedback:** Background tints `#e8693f]/10`, border becomes `#e8693f`
- **Checkmark:** Appears on cover corner with spring animation (scale 0→1)
- **Checkbox:** Right side checkbox fills with `#e8693f`
- **Haptic:** `navigator.vibrate(5)` (light) on each toggle
- **Count:** Updates in the badge immediately

### Create Flow
1. Validate: name must not be empty
2. Disable button, show spinner
3. POST to API with name, description, bookIds
4. On success: haptic heavy (`navigator.vibrate(20)`), navigate to `/playlists/{newId}`
5. On error: re-enable button, show error toast

### Unsaved Changes
- If user taps back with changes, show confirmation dialog
- "Discard changes?" with "Cancel" and "Discard" options
- If no changes, navigate back immediately

---

## 6. Animation Spec

### Page Enter
```tsx
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.25, ease: "easeOut" }}
```

### Book Row Press
```tsx
whileTap={{ scale: 0.98 }}
transition={{ type: "spring", stiffness: 400, damping: 30 }}
```

### Checkmark Badge (on cover)
```tsx
initial={{ scale: 0 }}
animate={{ scale: 1 }}
transition={{ type: "spring", stiffness: 500, damping: 20 }}
```

### Create Button Press
```tsx
whileTap={{ scale: 0.97 }}
transition={{ type: "spring", stiffness: 500, damping: 25 }}
```

### Selected Count Badge
```tsx
animate={{ opacity: 1, scale: 1 }}
initial={{ opacity: 0, scale: 0.8 }}
transition={{ duration: 0.2 }}
key={selectedBooks.length} // re-animate on count change
```

### Book List Stagger (on filter change)
```tsx
staggerChildren: 0.03
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
```

---

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] `max-w-[640px]` wrapper on all content
- [ ] `pb-[calc(4.5rem+env(safe-area-inset-bottom))]` for bottom nav
- [ ] `pt-[env(safe-area-inset-top)]` on sticky header
- [ ] All interactive elements `min-h-[44px] min-w-[44px]`
- [ ] Name input `min-h-[44px]`
- [ ] Description textarea `min-h-[88px]`
- [ ] Book picker search `min-h-[44px]`
- [ ] Each book row is a button with `min-h-[44px]`
- [ ] Create button `min-h-[48px]` (larger for primary CTA)
- [ ] Create button is sticky at bottom, above bottom nav
- [ ] Single column book picker — no grid
- [ ] Selected count badge visible when count > 0
- [ ] Character counts on name and description
- [ ] Disabled state on Create when name empty
- [ ] Loading state with spinner on Create
- [ ] No `shadow-lg`
- [ ] No glassmorphism — opaque surfaces
- [ ] No indigo/blue/purple
- [ ] Haptic feedback on book toggle
- [ ] Haptic feedback on create
- [ ] Unsaved changes confirmation on back
- [ ] Skeleton loading during book list fetch
- [ ] Typography: Playfair for headings, Inter for body
- [ ] Colors match design system exactly
- [ ] Bottom nav present on this page
- [ ] Book picker searches locally (client-side filter)

---

## 8. Complete Stitch Prompt

```
Build a mobile-only create playlist page for a library app. Max-width 640px, centered. Route: /playlists/new

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
   - Row: Back button (ChevronLeft icon, min-h-[44px] min-w-[44px], -ml-2) | "Create Playlist" in Playfair text-xl text-[#ece0dc]

2. NAME INPUT: px-4 pt-4. Label "Playlist Name" in Inter text-sm text-[#a89c93] mb-1.5. Input: w-full min-h-[44px] rounded-xl bg-[#211a17] border border-[#3a322d] px-4 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f]. Below: character count "{length}/100" right-aligned in Inter text-xs text-[#a89c93].

3. DESCRIPTION: px-4 pt-3. Label "Description" with "(optional)" in text-[#3a322d]. Textarea: w-full min-h-[88px] rounded-xl bg-[#211a17] border border-[#3a322d] px-4 py-3 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f] resize-none rows=3. Character count "{length}/300" right-aligned.

4. BOOK PICKER SECTION: px-4 pt-5. Header row: "Add Books" in Playfair text-base text-[#ece0dc] | Selected count badge "{n} selected" in Inter text-xs text-[#e8693f] bg-[#e8693f]/10 px-2.5 py-1 rounded-full (only if count > 0). Below: search input, w-full min-h-[44px] rounded-xl bg-[#211a17] border-[#3a322d] pl-10 pr-4, SearchIcon absolutely positioned left-3, placeholder "Search books...".

5. BOOK PICKER LIST: px-4 space-y-2 pb-4. Each book is a motion.button, w-full text-left, rounded-xl border p-3 min-h-[44px].
   - Default: bg-[#211a17] border-[#3a322d]
   - Selected: bg-[#e8693f]/10 border-[#e8693f]
   - Layout: flex gap-3. Left: book cover image w-12 h-16 rounded-lg object-cover. If selected: absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#e8693f] with Check icon w-3 h-3 text-white, animated with initial scale 0 → animate scale 1 spring.
   - Center (flex-1 min-w-0): Title in Inter text-sm text-[#ece0dc] truncate, Author in Inter text-xs text-[#a89c93] truncate.
   - Right: checkbox w-5 h-5 rounded-md border border-[#3a322d] (default) or bg-[#e8693f] border-[#e8693f] (selected), with Check icon w-3 h-3 text-white when selected.
   - Each row: whileTap={{ scale: 0.98 }}, onClick toggles book selection.
   - Haptic: navigator.vibrate(5) on each toggle.
   - Empty state: if no books, show BookOpen icon w-8 h-8 text-[#a89c93] + "No books in your collection yet" in Inter text-sm.

6. CREATE BUTTON (THUMB ZONE): sticky bottom-[calc(4rem+env(safe-area-inset-bottom))]. px-4 py-3 bg-[#16110f]. Button: w-full min-h-[48px] rounded-xl bg-[#e8693f] text-white font-[Inter] text-sm font-medium. Disabled when name.trim() is empty: disabled:opacity-40 disabled:cursor-not-allowed. Loading state: Loader2 icon w-4 h-4 animate-spin replacing text. whileTap={{ scale: 0.97 }}.

7. SKELETON LOADING: While data loads, show form skeletons. Name: h-4 w-24 label + h-11 input. Description: h-4 w-20 label + h-20 textarea. Picker: h-4 w-20 header + h-11 search + 5 book row skeletons (flex gap-3 p-3 rounded-xl, w-12 h-16 cover + two text bars). All animate-pulse bg-[#3a322d].

8. BOTTOM NAV: Fixed bottom, z-50, opaque #16110f, pb-[env(safe-area-inset-bottom)]. 4 tabs: Home, Search, Playlists (active), Profile. Each tab min-h-[44px] min-w-[44px].

INTERACTIONS:
- Tap back: if changes exist, show confirm dialog "Discard changes?" with Cancel/Discard. If no changes, navigate back immediately.
- Tap book row: toggle selection with haptic, animate checkmark badge spring, update selected count badge.
- Type in picker search: client-side filter on book list, stagger re-animation on filtered results.
- Tap Create: validate name non-empty, disable button + show spinner, POST to API, on success haptic heavy (vibrate(20)) and navigate to /playlists/{newId}, on error re-enable + show error toast.
- Page transitions: slide from right on enter, slide to left on exit.
- Selected count badge: re-animate on count change (scale 0.8→1).

DO NOT use: shadow-lg, glassmorphism, indigo/blue/purple, multiple columns, dropdowns, popovers, tooltips, hamburger menu, or any element without min-h-[44px].

Use the project's router for navigation. Use existing toast component for error/success messages.
```
