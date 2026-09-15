# 13 — Playlist New (Tablet)

## 1. Page Title & Route

**Page:** Create Playlist
**Route:** `/playlists/new`
**Nav Tab:** Playlists (active)
**Auth Required:** Yes
**Breakpoint:** 641px–1024px

---

## 2. Tablet Design Rationale

Creating a playlist on tablet uses a 2-column layout: form fields on the left, book picker on the right. This lets the user see the form and browse books simultaneously without scrolling back and forth. The form column is sticky so it stays visible while scrolling the book picker. Hover states on book rows provide clear selection feedback. The create button lives in the form column, always visible. A selected-count badge floats above the book picker grid.

---

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────┐
│  Logo   Home  Search  Playlists ▾  Profile     [🔍] │ ← horizontal top nav
├──────────────────────────────────────────────────────┤
│                                                      │
│  ← Back   Create Playlist                            │ ← page header
│                                                      │
│  ┌─────────────────────┐  ┌─────────────────────┐    │
│  │  Playlist Name       │  │  Add Books          │    │ ← 2-col layout
│  │  ┌───────────────┐  │  │  🔍 Search books... │    │
│  │  │               │  │  │  Selected: 3 books  │    │
│  │  └───────────────┘  │  │                     │    │
│  │                     │  │  ┌────┐ ┌────┐      │    │
│  │  Description        │  │  │    │ │ ✓  │      │    │ ← 2-col picker
│  │  ┌───────────────┐  │  │  │    │ │    │      │    │
│  │  │               │  │  │  └────┘ └────┘      │    │
│  │  │               │  │  │  ┌────┐ ┌────┐      │    │
│  │  └───────────────┘  │  │  │ ✓  │ │    │      │    │
│  │                     │  │  │    │ │    │      │    │
│  │  [Create Playlist]  │  │  └────┘ └────┘      │    │
│  │                     │  │                     │    │
│  └─────────────────────┘  └─────────────────────┘    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Max-width:** `max-w-[960px] mx-auto`
**Horizontal padding:** `px-6`
**Layout:** `grid grid-cols-[1fr_1.5fr] gap-6` (form narrower, picker wider)
**Form column:** sticky so it stays visible while scrolling picker

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

### 4.2 Page Header
```tsx
<header className="px-6 pt-6 pb-2 max-w-[960px] mx-auto">
  <div className="flex items-center gap-4">
    <button
      onClick={goBack}
      className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg hover:bg-[#2a211c] transition-colors"
    >
      <ChevronLeft className="w-5 h-5 text-[#ece0dc]" />
    </button>
    <h1 className="font-[Playfair_Display] text-2xl text-[#ece0dc]">
      Create Playlist
    </h1>
  </div>
</header>
```

### 4.3 Two-Column Layout Container
```tsx
<div className="px-6 pt-6 max-w-[960px] mx-auto grid grid-cols-[1fr_1.5fr] gap-6 items-start">
  {/* Left: Form (sticky) */}
  <div className="sticky top-20 space-y-5">
    {/* form fields */}
  </div>

  {/* Right: Book Picker */}
  <div>
    {/* picker */}
  </div>
</div>
```

- `grid-cols-[1fr_1.5fr]` — form column narrower, picker wider
- `items-start` so picker can scroll independently
- Form column: `sticky top-20` stays visible while scrolling picker

### 4.4 Name Input (Form Column)
```tsx
<div>
  <label className="font-[Inter] text-sm text-[#a89c93] mb-1.5 block">
    Playlist Name
  </label>
  <input
    type="text"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="My reading list"
    maxLength={100}
    className="w-full min-h-[44px] rounded-xl bg-[#211a17] border border-[#3a322d] px-4 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f] hover:border-[#4d433d] transition-colors"
  />
  <span className="font-[Inter] text-xs text-[#a89c93] mt-1 block text-right">
    {name.length}/100
  </span>
</div>
```

### 4.5 Description Textarea (Form Column)
```tsx
<div>
  <label className="font-[Inter] text-sm text-[#a89c93] mb-1.5 block">
    Description <span className="text-[#7a706a]">(optional)</span>
  </label>
  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="What's this playlist about?"
    rows={4}
    maxLength={300}
    className="w-full min-h-[100px] rounded-xl bg-[#211a17] border border-[#3a322d] px-4 py-3 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f] hover:border-[#4d433d] resize-none transition-colors"
  />
  <span className="font-[Inter] text-xs text-[#a89c93] mt-1 block text-right">
    {description.length}/300
  </span>
</div>
```

- `min-h-[100px]` slightly taller on tablet
- `rows={4}` instead of mobile's `rows={3}`

### 4.6 Create Button (Form Column, Bottom)
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.97 }}
  disabled={!name.trim() || isCreating}
  className="w-full min-h-[48px] rounded-xl bg-[#e8693f] text-[#16110f] font-[Inter] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#d45a30] transition-colors"
>
  {isCreating ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : (
    "Create Playlist"
  )}
</motion.button>
```

### 4.7 Book Picker Header
```tsx
<div className="flex items-center justify-between mb-3">
  <h2 className="font-[Playfair_Display] text-lg text-[#ece0dc]">
    Add Books
  </h2>
  {selectedBooks.length > 0 && (
    <span className="font-[Inter] text-xs text-[#e8693f] bg-[#e8693f20] px-2.5 py-1 rounded-full">
      {selectedBooks.length} selected
    </span>
  )}
</div>
```

### 4.8 Book Picker Search
```tsx
<div className="relative mb-3">
  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a89c93]" />
  <input
    type="text"
    value={pickerSearch}
    onChange={(e) => setPickerSearch(e.target.value)}
    placeholder="Search books..."
    className="w-full min-h-[44px] rounded-xl bg-[#211a17] border border-[#3a322d] pl-10 pr-4 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f] hover:border-[#4d433d] transition-colors"
  />
</div>
```

### 4.9 Book Picker Grid (2-Column)
```tsx
<div className="grid grid-cols-2 gap-3">
  {filteredBooks.map((book) => {
    const isSelected = selectedBooks.includes(book.id);
    return (
      <motion.button
        key={book.id}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => toggleBook(book.id)}
        className={`flex gap-3 w-full text-left rounded-xl border p-3 min-h-[40px] transition-colors ${
          isSelected
            ? "bg-[#e8693f20] border-[#e8693f]"
            : "bg-[#211a17] border-[#3a322d] hover:border-[#4d433d]"
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

- 2-column grid within the picker panel
- Each card: horizontal layout (cover + info)
- Hover: `y: -1` lift for unselected, border lighten for unselected
- Selected state: orange tint + border + checkmark

### 4.10 Empty Book List
```tsx
<div className="flex flex-col items-center py-12 px-6 col-span-2">
  <BookOpen className="w-8 h-8 text-[#a89c93] mb-3" />
  <p className="font-[Inter] text-sm text-[#a89c93] text-center">
    No books in your collection yet
  </p>
</div>
```

### 4.11 Skeleton Loader
```tsx
<div className="px-6 pt-6 max-w-[960px] mx-auto grid grid-cols-[1fr_1.5fr] gap-6">
  {/* Form skeleton */}
  <div className="space-y-5">
    <div className="space-y-1.5">
      <div className="h-4 w-24 rounded bg-[#3a322d] animate-pulse" />
      <div className="h-11 w-full rounded-xl bg-[#3a322d] animate-pulse" />
    </div>
    <div className="space-y-1.5">
      <div className="h-4 w-20 rounded bg-[#3a322d] animate-pulse" />
      <div className="h-24 w-full rounded-xl bg-[#3a322d] animate-pulse" />
    </div>
    <div className="h-12 w-full rounded-xl bg-[#3a322d] animate-pulse" />
  </div>
  {/* Picker skeleton */}
  <div>
    <div className="h-5 w-20 rounded bg-[#3a322d] animate-pulse mb-3" />
    <div className="h-11 w-full rounded-xl bg-[#3a322d] animate-pulse mb-3" />
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-3 p-3 rounded-xl bg-[#211a17] border border-[#3a322d] animate-pulse">
          <div className="w-12 h-16 rounded-lg bg-[#3a322d]" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-3/4 rounded bg-[#3a322d]" />
            <div className="h-3 w-1/2 rounded bg-[#3a322d]" />
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
```

---

## 5. Tablet Interactions

| Trigger | Action | Feedback |
|---|---|---|
| Click back | Navigate to playlist list | Confirm if changes, page slides left |
| Type in name | Update name, show character count | Character count updates live |
| Type in description | Update description, show count | Character count updates live |
| Hover book row | Lift + border lighten | `y: -1`, `border-[#4d433d]` |
| Click book row | Toggle selection | Haptic light, checkmark spring, background tints |
| Click search in picker | Focus picker search | Input border highlights |
| Type in picker search | Filter book list | Client-side filter |
| Click Create | Create playlist, navigate to detail | Haptic heavy, page transitions |
| Empty name + Create | Button disabled | No action, opacity-40 |
| Keyboard: Tab | Move between form fields and picker | Standard focus management |

### Book Selection Details
- **Toggle:** Click anywhere on the row
- **Hover:** `y: -1` lift for unselected, `hover:border-[#4d433d]`
- **Visual feedback:** Background tints `#e8693f20`, border becomes `#e8693f`
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
- If user clicks back with changes, show confirmation dialog
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

### Book Row Hover
```tsx
whileHover={{ y: -1 }}
transition={{ type: "spring", stiffness: 300, damping: 20 }}
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
key={selectedBooks.length}
```

### Book Grid Stagger (on filter change)
```tsx
staggerChildren: 0.03
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
```

---

## 7. Tablet-Specific Anti-Slop Checklist

- [ ] `max-w-[960px]` wrapper on all content
- [ ] `px-6` padding (24px) instead of mobile's `px-4`
- [ ] Horizontal top nav — NO bottom nav
- [ ] All interactive elements `min-h-[40px] min-w-[40px]`
- [ ] 2-column layout: form left, book picker right
- [ ] Form column sticky: `sticky top-20`
- [ ] Book picker grid: `grid-cols-2` within picker panel
- [ ] Hover states on book rows: `y: -1` lift + border lighten
- [ ] Create button in form column, not sticky at bottom
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
- [ ] Skeleton loading during book list fetch (2-col layout)
- [ ] Typography: Playfair for headings, Inter for body
- [ ] Colors match design system exactly
- [ ] Book picker searches locally (client-side filter)
- [ ] Form inputs have hover border state
- [ ] Description textarea slightly taller (`min-h-[100px]`)

---

## 8. Complete Stitch Prompt

```
Build a tablet-only create playlist page for a library app. Breakpoint: 641px–1024px. Max-width 960px, centered. Route: /playlists/new. NO bottom nav.

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

2. PAGE HEADER: px-6 pt-6 pb-2 max-w-[960px] mx-auto. Flex row items-center gap-4.
   - Back button: min-h-[40px] min-w-[40px] rounded-lg hover:bg-[#2a211c]. ChevronLeft icon.
   - Title: "Create Playlist" in Playfair_Display text-2xl text-[#ece0dc].

3. TWO-COLUMN LAYOUT: px-6 pt-6 max-w-[960px] mx-auto grid grid-cols-[1fr_1.5fr] gap-6 items-start.

   LEFT COLUMN (Form, sticky top-20):
   a. NAME INPUT: Label "Playlist Name" in Inter text-sm text-[#a89c93] mb-1.5. Input: w-full min-h-[44px] rounded-xl bg-[#211a17] border border-[#3a322d] px-4 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f] hover:border-[#4d433d] transition-colors. Character count "{length}/100" right-aligned.

   b. DESCRIPTION: Label "Description" with "(optional)" in text-[#7a706a]. Textarea: w-full min-h-[100px] rounded-xl bg-[#211a17] border border-[#3a322d] px-4 py-3 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f] hover:border-[#4d433d] resize-none rows=4. Character count "{length}/300".

   c. CREATE BUTTON: w-full min-h-[48px] rounded-xl bg-[#e8693f] text-[#16110f] font-[Inter] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed. whileHover: scale 1.02. whileTap: scale 0.97. Loading: Loader2 icon w-4 h-4 animate-spin. Hover: hover:bg-[#d45a30].

   RIGHT COLUMN (Book Picker):
   a. HEADER: flex items-center justify-between mb-3. "Add Books" in Playfair_Display text-lg text-[#ece0dc] | Selected count badge "{n} selected" in Inter text-xs text-[#e8693f] bg-[#e8693f20] px-2.5 py-1 rounded-full (only if count > 0).

   b. SEARCH: Relative container. SearchIcon absolutely positioned left-3. Input: w-full min-h-[44px] rounded-xl bg-[#211a17] border-[#3a322d] pl-10 pr-4 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f] hover:border-[#4d433d] transition-colors.

   c. BOOK PICKER GRID: grid grid-cols-2 gap-3. Each book: motion.button, w-full text-left, rounded-xl border p-3 min-h-[40px], flex gap-3.
      - Default: bg-[#211a17] border-[#3a322d] hover:border-[#4d433d]
      - Selected: bg-[#e8693f20] border-[#e8693f]
      - Hover: whileHover y -1 (unselected only)
      - WhileTap: scale 0.98
      - Layout: cover image w-12 h-16 rounded-lg object-cover. If selected: absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#e8693f] with Check icon w-3 h-3 text-white, spring scale 0→1.
      - Center: Title in Inter text-sm truncate, Author in Inter text-xs text-[#a89c93] truncate.
      - Right: checkbox w-5 h-5 rounded-md border border-[#3a322d] (default) or bg-[#e8693f] border-[#e8693f] (selected), Check icon w-3 h-3 text-white.
      - onClick toggles selection. Haptic navigator.vibrate(5).
      - Empty: if no books, BookOpen icon + "No books in your collection yet".

INTERACTIONS:
- Click back: if changes, show confirm dialog "Discard changes?" with Cancel/Discard. If no changes, navigate back.
- Click book row: toggle selection with haptic, animate checkmark spring, update count badge.
- Type in picker search: client-side filter on book list, stagger re-animation.
- Click Create: validate name non-empty, disable + spinner, POST to API, on success haptic heavy (vibrate(20)) navigate to /playlists/{newId}, on error re-enable + error toast.
- Page transitions: slide from right on enter, slide to left on exit.
- Tab between form fields and picker.
- Focus visible on all interactive elements.

DO NOT use: bottom nav, bottom sheets, shadow-lg, glassmorphism, indigo/blue/purple, dropdowns, popovers, tooltips, hamburger menu, or any element without min-h-[40px].

Use the project's router for navigation. Use existing toast component for error/success messages.
```
