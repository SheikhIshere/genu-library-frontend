# Bulk Upload — Books (Tablet)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| Page | Bulk Upload Books |
| Route | `/admin/bulk-upload` |
| Auth | Required (admin) |
| Tablet breakpoint | 641px–1024px |
| Top nav | Yes — horizontal nav bar (admin variant may include Admin tab) |
| Bottom nav | None (mobile-only) |

## 2. Tablet Design Rationale

Bulk upload on tablet is a power-user action that benefits from the wider viewport to show input and upload areas side-by-side. The two-column layout lets the user enter structured book data on the left while managing file uploads on the right — two parallel workflows that converge at the submit button.

**Two-column layout**: Textarea for book data on the left (50%), file drop zone on the right (50%). The user can type book entries and select PDFs simultaneously without scrolling between sections. Below both columns: submit and clear buttons. Below that: results in a 2-column grid.

**Textarea larger**: 12 rows on tablet (vs mobile's 8). The monospace JetBrains Mono font at 14px ensures alignment. Auto-resize up to 60vh.

**File drop zone bigger and more visible**: On tablet, drag-and-drop actually works (unlike mobile). The drop zone is `min-h-[200px]` with a dashed border, centered icon, and clear "Drop PDFs here or click to browse" text. Hover state makes the border accent-colored.

**Results in 2-column grid**: After upload, results display as a 2-column grid showing each book's status. Success cards get green left border, error cards get red. This makes scanning dozens of results much faster than a vertical list.

**PowerShell template collapsible below**: Collapsed by default. Expands inline below the form area. Not a separate section — it's reference material the user may or may not need.

**Top navigation**: Standard horizontal nav bar. No bottom tab bar.

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────────┐
│  Top Navigation Bar                                      │
│  [Logo]  Library  Browse  Search  Tags  Profile          │
├──────────────────────────────────────────────────────────┤
│  px-6                                                    │
│                                                          │
│  Bulk Upload Books                   2-column layout     │
│  ┌─────────────────────┬────────────────────────────────┐│
│  │ LEFT (50%)          │ RIGHT (50%)                     ││
│  │                     │                                ││
│  │  Book Data *        │  Upload PDFs                    ││
│  │  ┌─────────────────┐│  ┌────────────────────────┐   ││
│  │  │ title|author|   ││  │                        │   ││
│  │  │ genre           ││  │  📁 Drop PDFs here     │   ││
│  │  │ title|author|   ││  │  or click to browse    │   ││
│  │  │ genre           ││  │                        │   ││
│  │  │ title|author|   ││  │  PDF only, multiple    │   ││
│  │  │ genre           ││  │                        │   ││
│  │  │                 ││  └────────────────────────┘   ││
│  │  │                 ││                                ││
│  │  │  (12 rows)      ││  Selected Files (3)           ││
│  │  └─────────────────┘│  ┌────────────────────────┐   ││
│  │  12 lines · 142 chars│  │📄 book1.pdf   2.3MB ✕│   ││
│  │                     │  │📄 book2.pdf   1.8MB ✕│   ││
│  │  ── Show Template ──│  │📄 book3.pdf   4.1MB ✕│   ││
│  │  ┌─────────────────┐│  └────────────────────────┘   ││
│  │  │ $books = @(...) ││                                ││
│  │  │ ...             ││                                ││
│  │  │ [Copy]          ││                                ││
│  │  └─────────────────┘│                                ││
│  └─────────────────────┴────────────────────────────────┘│
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │  [  Upload Books  ]    [  Clear  ]                    ││
│  └──────────────────────────────────────────────────────┘│
│                                                          │
│  Results (if any) — 2-column grid                        │
│  ┌──────────────────┬──────────────────┐                │
│  │✅ The Alchemist  │✅ Dune           │                │
│  │✅ 1984           │❌ Invalid Book   │                │
│  └──────────────────┴──────────────────┘                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Spacing tokens**: `px-6` (24px side gutters), `gap-6` (24px between columns), `space-y-4` (16px between sections), `gap-3` (12px between result cards).

## 4. Component Breakdown

### 4.1 Top Navigation Bar
- Sticky top, `h-16`, `bg-canvas/85 backdrop-blur-md border-b border-border`
- Standard nav links with active state on current page
- All links: `min-h-[40px] min-w-[40px]`

### 4.2 Page Header
- `px-6 pt-8 pb-6`
- Breadcrumb: "Home > Admin > Bulk Upload" in `font-body-small text-text-muted`
- Heading: "Bulk Upload Books" in `font-headline-2 text-headline-2 text-text-primary mt-2`

### 4.3 Two-Column Container
- `flex gap-6 px-6 pb-6`
- Left column: `w-1/2` — book data textarea + template
- Right column: `w-1/2` — file upload + selected files
- Below 768px: `flex-col` (stacks vertically)

### 4.4 Book Data Textarea (Left Column)
- Label: "Book Data" + required asterisk
- `bg-surface border border-border rounded-lg p-4`
- `font-label-mono text-[14px] text-text-primary`
- `min-h-[300px]` (approx 12 rows), auto-resize up to max 60vh
- `placeholder:text-text-muted` — "title|author|genre\nOne book per line..."
- Focus: `border-primary ring-2 ring-primary/15`
- Hover: `hover:border-border-hover transition-colors`
- Below: line count + character count `font-label-mono text-caption text-text-muted`

### 4.5 Template Toggle (Left Column)
- Ghost button: "Show Template" / "Hide Template"
- `flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors`
- Chevron icon rotates on toggle
- When expanded: `bg-surface border border-border rounded-lg p-4 mt-4`
- Code block: `font-label-mono text-[13px] text-text-secondary overflow-x-auto whitespace-pre`
- Copy button: `bg-surface-hover border border-border rounded px-3 py-1.5 font-body-small text-text-primary hover:bg-surface transition-colors`

### 4.6 File Upload Area (Right Column)
- Full width, `min-h-[200px]`, `border-2 border-dashed border-border rounded-xl`
- `bg-surface hover:bg-surface-hover hover:border-primary/50 transition-all cursor-pointer`
- Center: icon + text
- Icon: `upload_file` material, `text-[40px] text-text-muted`
- Text: `font-body-default text-body-default text-text-secondary` — "Drop PDFs here or click to browse"
- Subtext: `font-body-small text-caption text-text-muted` — "PDF only, multiple files"
- On drag-over: `border-primary bg-primary/5` (visual feedback)
- Hidden `<input type="file" accept=".pdf" multiple>`
- Click or drop triggers file selection

### 4.7 Selected Files List (Right Column)
- Header: "Selected Files ({n})" in `font-body-default text-body-default font-medium text-text-primary mb-3`
- Container: `max-h-[250px] overflow-y-auto space-y-2`
- Each file row: `flex items-center gap-3 p-3 bg-surface border border-border rounded-lg hover:bg-surface-hover transition-colors`
- Icon: `description` material, `text-primary`
- Name: `font-body-small text-body-small text-text-primary truncate flex-1`
- Size: `font-label-mono text-caption text-text-secondary`
- Remove button: `min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg hover:bg-status-error/10 transition-colors` — `close` icon, `text-text-muted hover:text-status-error`

### 4.8 Submit + Clear Row
- `flex gap-4 px-6 pb-6`
- Submit button: `flex-1 h-12 rounded-lg bg-primary hover:bg-primary-hover active:scale-[0.98] text-text-on-accent font-semibold`
- Clear button: `flex-1 h-12 rounded-lg bg-transparent border border-border text-text-secondary hover:border-status-error hover:text-status-error`
- Both: `min-h-[40px] font-body-default text-body-default`

### 4.9 Results Section
- Header: "Results" in `font-headline-3 text-headline-3 text-text-primary mb-4`
- 2-column grid: `grid grid-cols-2 gap-3 px-6 pb-8`
- Success card: `flex items-center gap-3 p-4 rounded-lg bg-surface border border-border border-l-4 border-l-status-success`
  - Check icon: `text-status-success`
  - Book title: `font-body-default text-body-default text-text-primary`
- Error card: `flex items-center gap-3 p-4 rounded-lg bg-surface border border-border border-l-4 border-l-status-error`
  - X icon: `text-status-error`
  - Book title: `font-body-default text-body-default text-text-primary`
  - Error message: `font-body-small text-body-small text-status-error`
- Scrollable container if >8 results: `max-h-[400px] overflow-y-auto`

## 5. Tablet Interactions

### 5.1 Textarea Input
- Auto-resize: grows as lines are added (min 12 rows, max ~25 rows before scroll)
- Line count updates on every input change
- Tab key inserts tab character (not browser default focus change)
- Paste support: multi-line paste works correctly

### 5.2 Template Copy
- Click "Copy" → text copied to clipboard
- Button shows "Copied!" with checkmark for 2s
- Hover: button background lightens

### 5.3 File Selection — Click
- Click upload area → native file picker opens
- Multiple PDFs can be selected at once
- After selection: files appear in the list

### 5.4 File Selection — Drag and Drop
- Drag files over area → border turns primary, background tints
- Drop → files added to list
- Duplicate files prevented (same name + size)

### 5.5 File Removal
- Click ✕ on file → file removed from list with fade-out animation
- Hover on remove button: background tints error, icon turns red

### 5.6 Upload Process
- Validate: at least one book data line entered
- Button shows spinner + "Uploading..."
- Progress bar animation (simulated)
- Results section slides in below
- Success/error cards appear with stagger

### 5.7 Clear All
- Click clear → modal confirmation: "Clear all data?"
- "Clear" (destructive) / "Cancel"
- On confirm: textarea clears, files list clears, results clear

### 5.8 Keyboard Navigation
- Tab: textarea → template toggle → upload area → file list → submit → clear
- Enter on focused upload area opens file picker
- Backspace/Delete on focused file removes it

## 6. Animation Spec

| Element | Animation | Timing | Easing |
|---------|-----------|--------|--------|
| File row enter | `opacity 0→1`, `translateY -8px→0` | 200ms | ease-out |
| File row exit | `opacity 1→0`, `translateX 0→-20px` | 150ms | ease-in |
| Template expand | `max-height 0→auto`, `opacity 0→1` | 250ms | ease-out |
| Drop zone drag-over | `border-color`, `background-color` | 150ms | ease |
| Results slide-in | `translateY 20px→0`, `opacity 0→1` | 300ms | spring(1, 80, 10) |
| Result card enter | `scale 0.95→1`, `opacity 0→1` | 200ms | ease-out, stagger 50ms |
| Page enter | `opacity 0→1`, `translateY 8px→0` | 250ms | ease-out |
| Copy button feedback | "Copy" → "Copied!" text swap | instant | — |

**Framer Motion references:**
- Page: `<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>`
- File rows: `<AnimatePresence>` with `initial={{ opacity: 0, y: -8 }}` `exit={{ opacity: 0, x: -20 }}`
- Template expand: `initial={{ height: 0, opacity: 0 }}` `animate={{ height: "auto", opacity: 1 }}`
- Results: `initial={{ y: 20, opacity: 0 }}` `animate={{ y: 0, opacity: 1 }}`
- Result cards: `variants` with `staggerChildren: 0.05`

## 7. Tablet Anti-Slop Checklist

- [ ] All interactive elements `min-h-[40px] min-w-[40px]`
- [ ] Top nav is sticky, not fixed
- [ ] No bottom navigation — tablet uses top nav only
- [ ] Two-column layout at 641px+, single-column below 768px
- [ ] Textarea min 12 rows visible on initial render
- [ ] Monospace font (JetBrains Mono) renders correctly
- [ ] File upload supports both click AND drag-and-drop
- [ ] Drag-over visual feedback (border + background change)
- [ ] Multiple PDF selection works
- [ ] File list scrolls if many files selected
- [ ] Results in 2-column grid, not stacked list
- [ ] Results scroll if many (max-h-[400px])
- [ ] Hover states on all interactive elements
- [ ] Focus ring visible on keyboard navigation
- [ ] Modal replaces bottom sheet for clear confirmation
- [ ] `px-6` (24px) side padding
- [ ] No glassmorphism on surfaces
- [ ] No indigo/blue/purple — only rust orange `#e8693f`
- [ ] No `shadow-lg` — use border-based depth
- [ ] Template code block scrolls horizontally
- [ ] Clear button has confirmation (not accidental click)
- [ ] Submit and clear buttons side by side (flex row)
- [ ] Focus trap in modal when open

## 8. Complete Stitch Prompt

```
Build a tablet-only (min-width: 641px, max-width: 1024px) "Bulk Upload Books" page for a library app called Genu Library. Single HTML file with Tailwind CSS CDN, Framer Motion CDN, Google Fonts (Playfair Display, Inter, JetBrains Mono), and Material Symbols Outlined.

DESIGN SYSTEM (Forge & Flux):
- Canvas: #16110f, Surface: #211a17, Surface Hover: #2a211c
- Accent: #e8693f, Accent Hover: #d45a30, Accent Muted: #e8693f20
- Border: #3a322d, Border Hover: #4d433d
- Text primary: #ece0dc, Text secondary: #a89c93, Text muted: #7a706a, Text on accent: #16110f
- Status success: #4a7c59, error: #c44d4d, warning: #d4a24e, info: #5b8fb9
- Typography: Playfair Display (headlines), Inter (body), JetBrains Mono (prices/code)
- All interactive elements: min-h-[40px] min-w-[40px]
- Radius: sm 4px, 8px, lg 12px, xl 16px, 2xl 24px, full 9999px

LAYOUT (2-column, tablet):
1. Sticky top navigation bar (h-16, bg-canvas/85 backdrop-blur-md border-b border-border):
   - Logo: "Genu Library" (Playfair Display)
   - Nav links: Library, Browse, Search, Tags, Profile (active state)
   - Each link: px-4 py-2 rounded-lg, hover:bg-surface-hover, min-h-[40px] min-w-[40px]

2. Page content (px-6, pt-8, pb-6):
   a. Breadcrumb: "Home > Admin > Bulk Upload" (body-small, text-muted)
   b. Heading: "Bulk Upload Books" (Playfair Display, headline-2)

3. Two-column container (flex gap-6):
   LEFT COLUMN (w-1/2):
   a. Book Data textarea:
      - Label "Book Data *" (Inter, body-default, font-medium)
      - bg-surface border-border rounded-lg p-4
      - font-label-mono text-[14px] text-text-primary
      - min-h-[300px] (12 rows), auto-resize on input, max-height 60vh
      - placeholder: "title|author|genre\nOne book per line..."
      - Focus: border-primary ring-2 ring-primary/15
      - Hover: border-border-hover
      - Below: line count + char count (JetBrains Mono, caption, text-muted)

   b. Template toggle (collapsed by default):
      - Ghost button "Show Template" with expand_more icon (rotates)
      - When expanded: bg-surface border-border rounded-lg p-4 mt-4
      - Code block: font-label-mono text-[13px] text-text-secondary overflow-x-auto whitespace-pre
      - PowerShell template content
      - Copy button: bg-surface-hover border-border rounded px-3 py-1.5
        - On copy: "Copied!" for 2s, hover:bg-surface transition

   RIGHT COLUMN (w-1/2):
   c. File upload area:
      - min-h-[200px] border-2 border-dashed border-border rounded-xl
      - bg-surface hover:bg-surface-hover hover:border-primary/50 cursor-pointer transition-all
      - Center: upload_file icon (text-[40px] text-muted) + "Drop PDFs here or click to browse" (body-default, text-secondary) + "PDF only, multiple files" (caption, text-muted)
      - Drag-over state: border-primary bg-primary/5
      - Hidden input: type="file" accept=".pdf" multiple
      - Click or drop triggers file selection

   d. Selected Files list (shown when files selected):
      - Header "Selected Files ({n})" (body-default, font-medium, mb-3)
      - Container: max-h-[250px] overflow-y-auto space-y-2
      - Each file: flex items-center gap-3 p-3 bg-surface border-border rounded-lg
        - Hover: bg-surface-hover
        - description icon (text-primary)
        - filename (body-small, truncate, flex-1)
        - file size (JetBrains Mono, caption, text-secondary)
        - Remove button (close icon, min-h-[40px] min-w-[40px], hover:bg-status-error/10, hover:text-status-error)

4. Submit + Clear row (flex gap-4 px-6 pb-6):
   a. Submit button:
      - flex-1 h-12 rounded-lg bg-primary
      - hover:bg-primary-hover, active:scale-[0.98]
      - "Upload Books" in text-on-accent font-semibold
      - Disabled when no book data: opacity-50 cursor-not-allowed
      - Loading: spinner + "Uploading..."
   b. Clear button:
      - flex-1 h-12 rounded-lg bg-transparent border border-border
      - "Clear" in text-text-secondary
      - hover:border-status-error hover:text-status-error
      - Click: modal confirmation "Clear all data?"

5. Results section (hidden by default, shown after upload):
   - Header "Results" (headline-3, mb-4)
   - 2-column grid: grid grid-cols-2 gap-3 px-6 pb-8
   - Success card: flex items-center gap-3 p-4 rounded-lg bg-surface border-border border-l-4 border-l-status-success
     - check_circle icon (text-status-success) + book title
   - Error card: flex items-center gap-3 p-4 rounded-lg bg-surface border-border border-l-4 border-l-status-error
     - cancel icon (text-status-error) + book title + error message (text-status-error)
   - Scrollable if >8 results: max-h-[400px] overflow-y-auto

MODAL (clear confirmation):
- Overlay: fixed inset-0 bg-black/60 z-50 flex items-center justify-center
- Modal: bg-surface border-border rounded-xl p-6 max-w-sm w-full mx-6
- Title: "Clear all data?" (Playfair Display, headline-3)
- Body: "All book data and selected files will be removed." (body-small, text-secondary)
- Buttons: flex gap-3
  - "Cancel": flex-1 h-10 rounded-lg bg-surface border-border text-text-primary
  - "Clear": flex-1 h-10 rounded-lg bg-status-error text-white font-semibold

INTERACTIONS:
- Textarea: auto-resize, line count + char count update, paste support, tab inserts tab char
- Template: toggle expand/collapse, copy to clipboard with "Copied!" feedback
- File select: click area → native picker, multiple PDFs, prevent duplicates (same name+size)
- Drag-and-drop: drag files over → border-primary bg-primary/5, drop → add to list
- File remove: click ✕ → fade-out row
- Upload: validate at least 1 line of book data, show spinner, simulate 1.5s API call
- On complete: results section slides in, cards appear with stagger
- Clear: modal confirm → clear all state
- Keyboard: Tab through all interactive areas, Enter on upload area opens picker

ANIMATIONS (Framer Motion):
- Page: initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
- File rows: AnimatePresence, enter={{ opacity: 0, y: -8 }}, exit={{ opacity: 0, x: -20 }}
- Template expand: initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
- Results: initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
- Result cards: variants with staggerChildren 0.05, each initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
- Modal: AnimatePresence, overlay initial={{ opacity: 0 }}, content initial={{ scale: 0.95, opacity: 0 }}

ANTI-SLOP:
- No bottom navigation — tablet uses top nav only
- No glassmorphism on surfaces (only nav backdrop-blur)
- No indigo/blue/purple colors — only rust orange #e8693f
- No shadow-lg — use shadow-sm or border-based depth
- Two-column at 641px+, single-column below 768px
- Touch targets minimum 40x40px
- Modal replaces bottom sheet for confirmations
- px-6 (24px) side padding
- JetBrains Mono for all monospace content
- Textarea min 12 rows on initial render
- File upload supports both click and drag-and-drop
- Monospace code block scrolls horizontally
- Submit and clear side by side (not stacked)
- Results in 2-column grid
- Focus trap in modal
```
