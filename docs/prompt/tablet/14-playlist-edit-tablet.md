# 14 — Playlist Edit (Tablet)

## 1. Page Title & Route

**Page:** Edit Playlist
**Route:** `/playlists/:id/edit`
**Nav Tab:** Playlists (active)
**Auth Required:** Yes
**Params:** `id` — playlist identifier
**Owner Only:** Yes (redirect if not owner)
**Breakpoint:** 641px–1024px

---

## 2. Tablet Design Rationale

Editing mirrors creation with a 2-column layout: pre-populated form left, book picker right. The picker shows already-selected books at the top with deselect controls, then unselected books below. Change detection tracks all modifications. The save button in the form column shows dynamic state (No Changes / Save Changes / Spinner). A delete button at the bottom of the form provides a clear danger zone. Modals handle delete confirmation. Hover states provide desktop-like feedback throughout.

---

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────┐
│  Logo   Home  Search  Playlists ▾  Profile     [🔍] │ ← horizontal top nav
├──────────────────────────────────────────────────────┤
│                                                      │
│  ← Back   Edit Playlist                              │ ← page header
│                                                      │
│  ┌─────────────────────┐  ┌─────────────────────┐    │
│  │  Playlist Name       │  │  Selected Books (3) │    │ ← 2-col layout
│  │  ┌───────────────┐  │  │  ┌────┐ [×]         │    │
│  │  │ Reading List  │  │  │  │    │ ┌────┐ [×]  │    │ ← selected at top
│  │  └───────────────┘  │  │  └────┘ │    │      │    │
│  │                     │  │         └────┘      │    │
│  │  Description        │  │                     │    │
│  │  ┌───────────────┐  │  │  Add More Books     │    │
│  │  │ My favorite   │  │  │  🔍 Search books... │    │
│  │  │ books         │  │  │                     │    │
│  │  └───────────────┘  │  │  ┌────┐ ┌────┐      │    │ ← unselected below
│  │                     │  │  │    │ │ ✓  │      │    │
│  │  [Save Changes]     │  │  └────┘ └────┘      │    │
│  │                     │  │  ┌────┐ ┌────┐      │    │
│  │  [Delete Playlist]  │  │  │ ✓  │ │    │      │    │
│  │  (danger zone)      │  │  └────┘ └────┘      │    │
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
      Edit Playlist
    </h1>
  </div>
</header>
```

### 4.3 Two-Column Layout Container
```tsx
<div className="px-6 pt-6 max-w-[960px] mx-auto grid grid-cols-[1fr_1.5fr] gap-6 items-start">
  {/* Left: Form (sticky) */}
  <div className="sticky top-20 space-y-5">
    {/* form fields + save + delete */}
  </div>

  {/* Right: Book Picker */}
  <div>
    {/* selected books + unselected picker */}
  </div>
</div>
```

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

### 4.6 Save Button (Form Column)
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.97 }}
  disabled={!name.trim() || isSaving || !hasChanges}
  className="w-full min-h-[48px] rounded-xl bg-[#e8693f] text-[#16110f] font-[Inter] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#d45a30] transition-colors"
>
  {isSaving ? (
    <Loader2 className="w-4 h-4 animate-spin" />
  ) : hasChanges ? (
    "Save Changes"
  ) : (
    "No Changes"
  )}
</motion.button>
```

- Three states: "No Changes" (disabled), "Save Changes" (enabled), spinner (saving)
- `hasChanges` computed from diffing initial state vs current

### 4.7 Delete Button (Form Column, Danger Zone)
```tsx
<div className="pt-4 border-t border-[#3a322d]">
  <button
    onClick={openDeleteModal}
    className="w-full min-h-[40px] rounded-xl border border-[#c44d4d] text-[#c44d4d] font-[Inter] text-sm font-medium hover:bg-[#c44d4d20] transition-colors"
  >
    Delete Playlist
  </button>
</div>
```

- Danger styling: border and text in `#c44d4d`
- Hover: `hover:bg-[#c44d4d20]` (subtle red tint)
- Separated by border-t for visual danger zone

### 4.8 Delete Confirmation Modal (NOT bottom sheet)
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
        This will permanently delete "{playlist?.name}" and remove all books from it. This action cannot be undone.
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

- Same modal pattern as playlist list and detail pages
- Error color `#c44d4d` for delete button

### 4.9 Selected Books Section (Picker Column, Top)
```tsx
<div className="mb-6">
  <div className="flex items-center justify-between mb-3">
    <h2 className="font-[Playfair_Display] text-lg text-[#ece0dc]">
      Selected Books
    </h2>
    <span className="font-[Inter] text-xs text-[#a89c93]">
      {selectedBooks.length}
    </span>
  </div>

  <div className="space-y-2">
    {selectedBookDetails.map((book) => (
      <motion.div
        key={book.id}
        layout
        exit={{ opacity: 0, x: -100, height: 0 }}
        className="flex gap-3 bg-[#e8693f20] rounded-xl border border-[#e8693f] p-3"
      >
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-12 h-16 rounded-lg object-cover flex-shrink-0"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-[Inter] text-sm text-[#ece0dc] truncate">
            {book.title}
          </h3>
          <p className="font-[Inter] text-xs text-[#a89c93] truncate">
            {book.author}
          </p>
        </div>
        <button
          onClick={() => deselectBook(book.id)}
          className="min-h-[40px] min-w-[40px] flex items-center justify-center flex-shrink-0 rounded-lg hover:bg-[#2a211c] transition-colors"
        >
          <X className="w-4 h-4 text-[#a89c93]" />
        </button>
      </motion.div>
    ))}
  </div>
</div>
```

- Orange-tinted background for selected books
- X button on each to deselect, with hover state
- Animate exit when deselecting

### 4.10 Add More Books Section (Picker Column, Below)
```tsx
<div>
  <div className="flex items-center justify-between mb-3">
    <h2 className="font-[Playfair_Display] text-lg text-[#ece0dc]">
      Add More Books
    </h2>
    {newlySelectedCount > 0 && (
      <span className="font-[Inter] text-xs text-[#e8693f] bg-[#e8693f20] px-2.5 py-1 rounded-full">
        +{newlySelectedCount} new
      </span>
    )}
  </div>

  {/* Search */}
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
</div>
```

### 4.11 Unselected Book Picker Grid (2-Column)
```tsx
<div className="grid grid-cols-2 gap-3">
  {unselectedBooks.map((book) => {
    const isSelected = pendingAdditions.includes(book.id);
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

### 4.12 Change Detection Hook
```tsx
const hasChanges = useMemo(() => {
  if (!playlist) return false;
  return (
    name !== playlist.name ||
    description !== (playlist.description || "") ||
    JSON.stringify([...selectedBooks].sort()) !==
    JSON.stringify([...playlist.bookIds].sort())
  );
}, [name, description, selectedBooks, playlist]);
```

### 4.13 Skeleton Loader
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
    <div className="h-10 w-full rounded-xl border border-[#c44d4d] bg-transparent animate-pulse mt-4" />
  </div>
  {/* Picker skeleton */}
  <div>
    <div className="h-5 w-32 rounded bg-[#3a322d] animate-pulse mb-3" />
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="flex gap-3 p-3 rounded-xl bg-[#211a17] border border-[#3a322d] animate-pulse mb-2">
        <div className="w-12 h-16 rounded-lg bg-[#3a322d]" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-3/4 rounded bg-[#3a322d]" />
          <div className="h-3 w-1/2 rounded bg-[#3a322d]" />
        </div>
      </div>
    ))}
    <div className="h-5 w-28 rounded bg-[#3a322d] animate-pulse mt-6 mb-3" />
    <div className="h-11 w-full rounded-xl bg-[#3a322d] animate-pulse mb-3" />
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
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
| Click back | Navigate to detail (if no changes) or confirm discard | Confirm dialog with changes |
| Click delete button | Open delete confirmation modal | Modal animates in |
| Click "Delete" in modal | Delete and navigate to list | Haptic heavy, page slides left |
| Click "Cancel" in modal | Close modal | Modal animates out |
| Click X on selected book | Deselect, move to unselected picker | Haptic light, card exits with animation |
| Hover unselected book | Lift + border lighten | `y: -1`, `border-[#4d433d]` |
| Click unselected book | Select, move to selected section | Haptic light, card enters with animation |
| Type in picker search | Filter unselected books | Client-side filter |
| Type in name | Update name, recalculate hasChanges | Character count updates |
| Hover save button | Scale up slightly | `scale: 1.02` |
| Click Save | Save changes, navigate to detail | Haptic heavy, page transitions |
| No changes + Save | Button disabled | "No Changes" text, opacity-40 |
| Hover delete button | Background tint red | `hover:bg-[#c44d4d20]` |
| Keyboard: Escape | Close modal | Dismiss overlay |

### Delete Flow
1. Click delete button in form column
2. Modal opens with warning message
3. "Delete" button: red `#c44d4d`, aligned right
4. On confirm: DELETE API call, haptic heavy, navigate to `/playlists`
5. On cancel: modal closes

### Deselect Book (Remove from Playlist)
- Click X button on selected book card
- Card exits with animation (opacity 0, x: -100, height 0)
- Book appears in unselected picker below
- Count badge updates
- Haptic: light

### Select Book (Add to Playlist)
- Click unselected book in picker
- Card exits picker with animation
- Card enters selected section with animation
- Count badge updates
- Haptic: light

### Change Tracking
- Compared against initial load state
- Name change: detected
- Description change: detected
- Book additions: detected
- Book removals: detected
- Save button only enabled when `hasChanges === true`
- Back with changes: confirmation dialog

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

### Selected Book Exit (Deselect)
```tsx
exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
transition={{ duration: 0.3, ease: "easeInOut" }}
layout
```

### Selected Book Enter (Select)
```tsx
initial={{ opacity: 0, x: -20, height: 0 }}
animate={{ opacity: 1, x: 0, height: "auto" }}
transition={{ duration: 0.3, ease: "easeOut" }}
layout
```

### Save Button Press
```tsx
whileTap={{ scale: 0.97 }}
transition={{ type: "spring", stiffness: 500, damping: 25 }}
```

### Count Badge
```tsx
animate={{ opacity: 1, scale: 1 }}
initial={{ opacity: 0, scale: 0.8 }}
transition={{ duration: 0.2 }}
key={selectedBooks.length}
```

### Delete Modal
```tsx
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.95 }}
transition={{ type: "spring", stiffness: 400, damping: 30 }}
```

---

## 7. Tablet-Specific Anti-Slop Checklist

- [ ] `max-w-[960px]` wrapper on all content
- [ ] `px-6` padding (24px) instead of mobile's `px-4`
- [ ] Horizontal top nav — NO bottom nav
- [ ] All interactive elements `min-h-[40px] min-w-[40px]`
- [ ] 2-column layout: form left, book picker right
- [ ] Form column sticky: `sticky top-20`
- [ ] Book picker grid: `grid-cols-2` for unselected books
- [ ] Selected books shown separately at top of picker column
- [ ] Hover states on book rows: `y: -1` lift + border lighten
- [ ] Hover states on buttons: save (scale), delete (red tint)
- [ ] Delete uses modal, NOT bottom sheet
- [ ] Modal has backdrop overlay + close on backdrop click
- [ ] Change detection tracks name, description, and books
- [ ] Save disabled when no changes OR name empty
- [ ] "No Changes" state shown when nothing modified
- [ ] Deselect animates card out, select animates card in
- [ ] Delete button styled as danger zone at bottom of form
- [ ] Delete button: border `#c44d4d`, hover bg `#c44d4d20`
- [ ] No `shadow-lg`
- [ ] No glassmorphism — opaque surfaces
- [ ] No indigo/blue/purple
- [ ] Haptic feedback on select, deselect, save, delete
- [ ] Skeleton loading during initial fetch (2-col layout)
- [ ] Unsaved changes confirmation on back
- [ ] Owner-only access enforced
- [ ] Typography: Playfair for headings, Inter for body
- [ ] Colors match design system exactly
- [ ] Book picker searches locally (client-side filter)
- [ ] Form inputs have hover border state
- [ ] Description textarea slightly taller (`min-h-[100px]`)
- [ ] Modal focus trap: first focusable element receives focus
- [ ] Modal closes on Escape key

---

## 8. Complete Stitch Prompt

```
Build a tablet-only edit playlist page for a library app. Breakpoint: 641px–1024px. Max-width 960px, centered. Route: /playlists/:id/edit. NO bottom nav.

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
   - Title: "Edit Playlist" in Playfair_Display text-2xl text-[#ece0dc].

3. TWO-COLUMN LAYOUT: px-6 pt-6 max-w-[960px] mx-auto grid grid-cols-[1fr_1.5fr] gap-6 items-start.

   LEFT COLUMN (Form, sticky top-20):
   a. NAME INPUT: Label "Playlist Name" in Inter text-sm text-[#a89c93] mb-1.5. Input: w-full min-h-[44px] rounded-xl bg-[#211a17] border border-[#3a322d] px-4 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f] hover:border-[#4d433d] transition-colors. Pre-populated. Character count "{length}/100".

   b. DESCRIPTION: Label "Description" with "(optional)" in text-[#7a706a]. Textarea: w-full min-h-[100px] rounded-xl bg-[#211a17] border border-[#3a322d] px-4 py-3 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f] hover:border-[#4d433d] resize-none rows=4. Pre-populated. Character count "{length}/300".

   c. SAVE BUTTON: w-full min-h-[48px] rounded-xl bg-[#e8693f] text-[#16110f] font-[Inter] text-sm font-medium. Three states: (a) "No Changes" — disabled:opacity-40 when no changes, (b) "Save Changes" — enabled when name non-empty AND changes exist, (c) Spinner — Loader2 w-4 h-4 animate-spin while saving. whileHover: scale 1.02. whileTap: scale 0.97. Hover: hover:bg-[#d45a30].

   d. DELETE BUTTON (danger zone): pt-4 border-t border-[#3a322d]. Button: w-full min-h-[40px] rounded-xl border border-[#c44d4d] text-[#c44d4d] font-[Inter] text-sm font-medium hover:bg-[#c44d4d20] transition-colors. Opens delete confirmation modal on click.

   RIGHT COLUMN (Book Picker):
   a. SELECTED BOOKS SECTION: mb-6. Header: flex items-center justify-between mb-3. "Selected Books" in Playfair_Display text-lg text-[#ece0dc] | count in Inter text-xs text-[#a89c93]. Space-y-2 list. Each: flex gap-3 bg-[#e8693f20] rounded-xl border border-[#e8693f] p-3. Cover w-12 h-16 rounded-lg object-cover. Title (Inter text-sm truncate) + author (Inter text-xs text-[#a89c93] truncate). X button: min-h-[40px] min-w-[40px] rounded-lg hover:bg-[#2a211c], X icon w-4 h-4 text-[#a89c93]. On click X: deselect book, haptic light, card exit animation (opacity 0, x: -100, height 0, layout). Count updates.

   b. ADD MORE BOOKS SECTION: Header: "Add More Books" in Playfair_Display text-lg | new selections count badge "+{n} new" in Inter text-xs text-[#e8693f] bg-[#e8693f20] px-2.5 py-1 rounded-full (only if count > 0). Search: same as create page. Book picker grid: grid grid-cols-2 gap-3. Each: motion.button, flex gap-3 rounded-xl border p-3 min-h-[40px]. Default: bg-[#211a17] border-[#3a322d] hover:border-[#4d433d]. Selected: bg-[#e8693f20] border-[#e8693f]. Hover: y -1. WhileTap: scale 0.98. Toggle selection on click with haptic navigator.vibrate(5).

4. DELETE CONFIRMATION MODAL: Fixed inset-0 z-50 flex items-center justify-center p-6. Backdrop: absolute inset-0 bg-black/60. Modal: relative bg-[#211a17] border border-[#3a322d] rounded-2xl w-full max-w-[400px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]. Title: "Delete Playlist?" in Playfair_Display text-lg text-[#ece0dc] mb-2. Body: warning in Inter text-sm text-[#a89c93] mb-6. Buttons: flex gap-3 justify-end. Cancel: min-h-[40px] px-4 rounded-xl border border-[#3a322d] text-[#ece0dc] font-[Inter] text-sm hover:bg-[#2a211c]. Delete: min-h-[40px] px-4 rounded-xl bg-[#c44d4d] text-white font-[Inter] text-sm font-medium hover:bg-[#b03c3c]. On confirm: DELETE API, haptic heavy, navigate to /playlists. Enter: spring scale 0.95→1.

5. CHANGE DETECTION: Track diff between initial load state and current form state. Compare: name, description, selected book IDs (sorted). hasChanges boolean drives save button state. Back navigation with changes shows confirm dialog: "Discard changes?" with Cancel/Discard.

6. SKELETON LOADING: grid grid-cols-[1fr_1.5fr] gap-6. Form: name input + textarea + save button + delete button skeletons. Picker: selected section + search + 2-col grid of 4 book row skeletons. All animate-pulse bg-[#3a322d].

INTERACTIONS:
- Click back: if changes, show confirm dialog "Discard changes?" with Cancel/Discard. If no changes, navigate back.
- Click delete: open delete confirmation modal.
- Modal backdrop click: close modal.
- Modal Delete: DELETE API, haptic heavy, navigate to /playlists.
- Modal Cancel: close modal.
- Click X on selected book: deselect with haptic light, card exits, book appears in picker below.
- Click unselected book: select with haptic light, card exits picker, enters selected section.
- Type in picker search: client-side filter on unselected books.
- Click Save: validate name non-empty, check hasChanges, disable + spinner, PATCH to API, on success haptic heavy (vibrate(20)) navigate to /playlists/{id}, on error re-enable + error toast.
- Page transitions: slide from right on enter, slide to left on exit.
- Selected/unselected book lists use layout animations for smooth reflow.
- Keyboard: Escape closes modal, Tab traps in modal.

DO NOT use: bottom nav, bottom sheets, shadow-lg, glassmorphism, indigo/blue/purple, dropdowns, popovers, tooltips, hamburger menu, or any element without min-h-[40px].

Use the project's router for navigation. Use existing toast component. Owner-only access enforced — redirect non-owners to /playlists.
```
