# 14 — Playlist Edit (Mobile)

## 1. Page Title & Route

**Page:** Edit Playlist
**Route:** `/playlists/:id/edit`
**Bottom Nav Index:** 2 (Playlists tab active)
**Auth Required:** Yes
**Params:** `id` — playlist identifier
**Owner Only:** Yes (redirect if not owner)

---

## 2. Mobile-First Design Rationale

Editing mirrors creation but starts pre-populated. The key difference is showing already-selected books at the top of the picker with checkmarks, so the user sees what's in the playlist before adding more. The save button replaces create, and a delete option lives in the header as a secondary action. The form layout is identical to the new page for muscle memory.

---

## 3. Mobile Layout Specification

```
┌──────────────────────────────┐ ← env(safe-area-inset-top)
│ ←  Edit Playlist      [🗑️]  │ ← sticky header
├──────────────────────────────┤
│                              │
│  Playlist Name               │ ← pre-filled input
│  ┌────────────────────────┐  │
│  │ Reading List           │  │
│  └────────────────────────┘  │
│                              │
│  Description (optional)      │ ← pre-filled textarea
│  ┌────────────────────────┐  │
│  │ My favorite books      │  │
│  └────────────────────────┘  │
│                              │
│  Books in Playlist (5)       │ ← selected section
│  ┌──┐ ┌──┐ ┌──┐             │
│  │✓ │ │✓ │ │✓ │             │   pre-selected books
│  └──┘ └──┘ └──┘             │   with checkmarks
│  ┌──┐ ┌──┐                  │
│  │✓ │ │✓ │                  │
│  └──┘ └──┘                  │
│                              │
│  Add More Books              │ ← picker section
│  ┌────────────────────────┐  │
│  │ 🔍 Search books...     │  │
│  └────────────────────────┘  │
│  ┌──┐ ┌──┐ ┌──┐             │
│  │  │ │✓ │ │  │             │   unselected books
│  └──┘ └──┘ └──┘             │
│                              │
├──────────────────────────────┤
│  [  Save Changes  ]          │ ← CTA button
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
    <h1 className="flex-1 font-[Playfair_Display] text-xl text-[#ece0dc]">
      Edit Playlist
    </h1>
    <button
      onClick={confirmDelete}
      className="min-h-[44px] min-w-[44px] flex items-center justify-center"
    >
      <Trash2 className="w-5 h-5 text-[#ef4444]" />
    </button>
  </div>
</header>
```

- Delete button in header: red icon `#ef4444`
- Opens confirmation bottom sheet on tap

### 4.2 Name Input (Pre-populated)
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

### 4.3 Description Textarea (Pre-populated)
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

### 4.4 Selected Books Section
```tsx
<div className="px-4 pt-5">
  <div className="flex items-center justify-between mb-3">
    <h2 className="font-[Playfair_Display] text-base text-[#ece0dc]">
      Books in Playlist
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
        className="flex gap-3 bg-[#e8693f]/10 rounded-xl border border-[#e8693f] p-3"
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
          className="min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
        >
          <X className="w-4 h-4 text-[#a89c93]" />
        </button>
      </motion.div>
    ))}
  </div>
</div>
```

- Orange-tinted background for selected books
- X button on each to deselect
- `min-h-[44px] min-w-[44px]` on X button
- Animate exit when deselecting

### 4.5 Add More Books Section
```tsx
<div className="px-4 pt-5">
  <div className="flex items-center justify-between mb-3">
    <h2 className="font-[Playfair_Display] text-base text-[#ece0dc]">
      Add More Books
    </h2>
    {newlySelectedCount > 0 && (
      <span className="font-[Inter] text-xs text-[#e8693f] bg-[#e8693f]/10 px-2.5 py-1 rounded-full">
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
      className="w-full min-h-[44px] rounded-xl bg-[#211a17] border border-[#3a322d] pl-10 pr-4 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f]"
    />
  </div>
</div>
```

### 4.6 Unselected Book Picker
```tsx
<div className="px-4 space-y-2 pb-4">
  {unselectedBooks.map((book) => {
    const isSelected = pendingAdditions.includes(book.id);
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

### 4.7 Delete Confirmation Bottom Sheet
```tsx
<BottomSheet open={deleteSheetOpen} onOpenChange={setDeleteSheetOpen}>
  <BottomSheetHeader>Delete Playlist?</BottomSheetHeader>
  <BottomSheetBody>
    <p className="font-[Inter] text-sm text-[#a89c93] mb-4">
      This will permanently delete "{playlist?.name}" and remove all books from it. This action cannot be undone.
    </p>
    <div className="space-y-2">
      <button
        onClick={handleDelete}
        className="w-full min-h-[44px] rounded-xl bg-[#ef4444] text-white font-[Inter] text-sm font-medium"
      >
        Delete Playlist
      </button>
      <button
        onClick={() => setDeleteSheetOpen(false)}
        className="w-full min-h-[44px] rounded-xl bg-[#3a322d] text-[#ece0dc] font-[Inter] text-sm"
      >
        Cancel
      </button>
    </div>
  </BottomSheetBody>
</BottomSheet>
```

### 4.8 Save Button (Thumb Zone)
```tsx
<div className="sticky bottom-[calc(4rem+env(safe-area-inset-bottom))] px-4 py-3 bg-[#16110f]">
  <motion.button
    whileTap={{ scale: 0.97 }}
    disabled={!name.trim() || isSaving}
    className="w-full min-h-[48px] rounded-xl bg-[#e8693f] text-white font-[Inter] text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    {isSaving ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : hasChanges ? (
      "Save Changes"
    ) : (
      "No Changes"
    )}
  </motion.button>
</div>
```

- `disabled` when name empty OR no changes made
- Three states: "No Changes" (disabled), "Save Changes" (enabled), spinner (saving)
- `hasChanges` computed from diffing initial state vs current

### 4.9 Change Detection Hook
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

### 4.10 Skeleton Loader
```tsx
<div className="px-4 pt-4 space-y-4">
  <div className="space-y-1.5">
    <div className="h-4 w-24 rounded bg-[#3a322d] animate-pulse" />
    <div className="h-11 w-full rounded-xl bg-[#3a322d] animate-pulse" />
  </div>
  <div className="space-y-1.5">
    <div className="h-4 w-20 rounded bg-[#3a322d] animate-pulse" />
    <div className="h-20 w-full rounded-xl bg-[#3a322d] animate-pulse" />
  </div>
  <div className="h-4 w-32 rounded bg-[#3a322d] animate-pulse mt-5" />
  {Array.from({ length: 3 }).map((_, i) => (
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
| Tap back | Navigate to detail (if no changes) or confirm discard | Confirm dialog with changes |
| Tap delete icon | Open delete confirmation bottom sheet | Sheet slides up |
| Tap "Delete Playlist" | Delete and navigate to list | Haptic heavy, page slides left |
| Tap X on selected book | Deselect, move to picker below | Haptic light, card exits with animation |
| Tap unselected book | Select, move to selected section above | Haptic light, card enters with animation |
| Type in picker search | Filter unselected books | Client-side filter |
| Type in name | Update name, recalculate hasChanges | Character count updates |
| Tap Save | Save changes, navigate to detail | Haptic heavy, page transitions |
| No changes + tap Save | Button disabled | "No Changes" text, opacity-40 |

### Delete Flow
1. Tap trash icon in header
2. Bottom sheet opens with warning message
3. "Delete Playlist" button: red `#ef4444`, full-width
4. On confirm: DELETE API call, haptic heavy, navigate to `/playlists`
5. On cancel: sheet closes

### Deselect Book (Remove from Playlist)
- Tap X button on selected book card
- Card exits with animation (opacity 0, x: -100, height: 0)
- Book appears in unselected picker below
- Count badge updates
- Haptic: light

### Select Book (Add to Playlist)
- Tap unselected book in picker
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

### Delete Sheet
```tsx
// Handled by BottomSheet component
snapPoints={["auto"]}
```

---

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] `max-w-[640px]` wrapper on all content
- [ ] `pb-[calc(4.5rem+env(safe-area-inset-bottom))]` for bottom nav
- [ ] `pt-[env(safe-area-inset-top)]` on sticky header
- [ ] All interactive elements `min-h-[44px] min-w-[44px]`
- [ ] Name input `min-h-[44px]`, pre-populated
- [ ] Description textarea `min-h-[88px]`, pre-populated
- [ ] X deselect button `min-h-[44px] min-w-[44px]`
- [ ] Each book row is a button with `min-h-[44px]`
- [ ] Save button `min-h-[48px]` (primary CTA)
- [ ] Save button sticky at bottom, above bottom nav
- [ ] Delete button in header (red, not hidden in menu)
- [ ] Delete uses bottom sheet confirmation, not alert()
- [ ] Single column book lists — no grid
- [ ] Change detection tracks name, description, and books
- [ ] Save disabled when no changes OR name empty
- [ ] "No Changes" state shown when nothing modified
- [ ] Selected books shown separately from unselected picker
- [ ] Deselect animates card out, select animates card in
- [ ] No `shadow-lg`
- [ ] No glassmorphism — opaque surfaces
- [ ] No indigo/blue/purple
- [ ] Haptic feedback on select, deselect, save, delete
- [ ] Skeleton loading during initial fetch
- [ ] Unsaved changes confirmation on back
- [ ] Owner-only access enforced
- [ ] Typography: Playfair for headings, Inter for body
- [ ] Colors match design system exactly
- [ ] Bottom nav present on this page
- [ ] Book picker searches locally (client-side filter)

---

## 8. Complete Stitch Prompt

```
Build a mobile-only edit playlist page for a library app. Max-width 640px, centered. Route: /playlists/:id/edit

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
   - Row: Back button (ChevronLeft, min-h-[44px] min-w-[44px], -ml-2) | "Edit Playlist" (Playfair text-xl text-[#ece0dc], flex-1) | Delete button (Trash2 icon, min-h-[44px] min-w-[44px], text-[#ef4444])
   - Delete button opens a bottom sheet with: "Delete Playlist?" header, warning message in Inter text-sm text-[#a89c93], "Delete Playlist" button (w-full min-h-[44px] rounded-xl bg-[#ef4444] text-white), "Cancel" button (w-full min-h-[44px] rounded-xl bg-[#3a322d] text-[#ece0dc]). On confirm: DELETE API, haptic heavy, navigate to /playlists.

2. NAME INPUT: px-4 pt-4. Label "Playlist Name" in Inter text-sm text-[#a89c93] mb-1.5. Input: w-full min-h-[44px] rounded-xl bg-[#211a17] border border-[#3a322d] px-4 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f]. Pre-populated with existing name. Character count "{length}/100" right-aligned.

3. DESCRIPTION: px-4 pt-3. Label "Description" with "(optional)" in text-[#3a322d]. Textarea: w-full min-h-[88px] rounded-xl bg-[#211a17] border border-[#3a322d] px-4 py-3 text-[#ece0dc] placeholder:text-[#a89c93] font-[Inter] text-sm focus:outline-none focus:border-[#e8693f] resize-none rows=3. Pre-populated. Character count "{length}/300".

4. SELECTED BOOKS SECTION: px-4 pt-5. Header: "Books in Playlist" in Playfair text-base text-[#ece0dc] | count in Inter text-xs text-[#a89c93]. Space-y-2 list of selected books. Each: flex gap-3 bg-[#e8693f]/10 rounded-xl border border-[#e8693f] p-3. Left: cover w-12 h-16 rounded-lg object-cover. Center: title (Inter text-sm truncate) + author (Inter text-xs text-[#a89c93] truncate). Right: X button (min-h-[44px] min-w-[44px], X icon w-4 h-4 text-[#a89c93]). On tap X: deselect book, haptic light, card exits with animation (opacity 0, x: -100, height: 0, layout). Count updates.

5. ADD MORE BOOKS SECTION: px-4 pt-5. Header: "Add More Books" in Playfair text-base | new selections count badge "+{n} new" in Inter text-xs text-[#e893f] bg-[#e8693f]/10 px-2.5 py-1 rounded-full (only if count > 0). Search input: w-full min-h-[44px] rounded-xl bg-[#211a17] border-[#3a322d] pl-10 pr-4, SearchIcon left-3, placeholder "Search books...". Book picker list: same as create page — each unselected book as motion.button, flex gap-3 rounded-xl border p-3 min-h-[44px]. Toggle selection on tap with haptic. Selected books appear in section 4, unselected remain here.

6. SAVE BUTTON (THUMB ZONE): sticky bottom-[calc(4rem+env(safe-area-inset-bottom))]. px-4 py-3 bg-[#16110f]. Button: w-full min-h-[48px] rounded-xl bg-[#e8693f] text-white font-[Inter] text-sm font-medium. Three states: (a) "No Changes" — disabled:opacity-40 when no changes detected, (b) "Save Changes" — enabled when name non-empty AND changes exist, (c) Spinner — Loader2 w-4 h-4 animate-spin while saving. whileTap={{ scale: 0.97 }}.

7. CHANGE DETECTION: Track diff between initial load state and current form state. Compare: name, description, selected book IDs (sorted). hasChanges boolean drives save button state. Back navigation with changes shows confirm dialog: "Discard changes?" with Cancel/Discard.

8. SKELETON LOADING: While data loads, show form skeletons. Name: h-4 w-24 + h-11 input. Description: h-4 w-20 + h-20 textarea. Selected: h-4 w-32 + 3 book row skeletons. All animate-pulse bg-[#3a322d].

9. BOTTOM NAV: Fixed bottom, z-50, opaque #16110f, pb-[env(safe-area-inset-bottom)]. 4 tabs: Home, Search, Playlists (active), Profile. Each tab min-h-[44px] min-w-[44px].

INTERACTIONS:
- Tap back: if changes exist, show confirm dialog "Discard changes?" with Cancel/Discard. If no changes, navigate back.
- Tap delete icon: open delete confirmation bottom sheet with warning and red delete button.
- Tap X on selected book: deselect with haptic light, card exits animation, book appears in picker below.
- Tap unselected book: select with haptic light, card exits picker, enters selected section above.
- Type in picker search: client-side filter on unselected books.
- Tap Save: validate name non-empty, check hasChanges, disable button + spinner, PATCH to API, on success haptic heavy (vibrate(20)) and navigate to /playlists/{id}, on error re-enable + error toast.
- Page transitions: slide from right on enter, slide to left on exit.
- Selected/unselected book lists use layout animations for smooth reflow.

DO NOT use: shadow-lg, glassmorphism, indigo/blue/purple, multiple columns, dropdowns, popovers, tooltips, hamburger menu, or any element without min-h-[44px].

Use the project's router for navigation. Use existing BottomSheet and Toast components. Owner-only access enforced — redirect non-owners to /playlists.
```
