# Bulk Upload — Books (Mobile)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| Page | Bulk Upload Books |
| Route | `/admin/bulk-upload` |
| Auth | Required (admin) |
| Mobile max-width | 640px |
| Bottom nav | Yes (admin variant — may include Admin tab) |

## 2. Mobile-First Design Rationale

Bulk upload on mobile is inherently a power-user action. The user is entering structured data (book metadata) and attaching files. On mobile, this demands careful attention to input ergonomics and file selection.

**Monospace textarea is non-negotiable**: Structured data entry (title, author, genre per line) requires monospace font for alignment. JetBrains Mono at 14px with min 8 rows ensures readability and prevents character misalignment. Auto-resize is critical — the textarea grows as the user types more entries.

**Tap-to-select, not drag-and-drop**: Drag-and-drop doesn't work well on mobile. The file upload area is a large tap target (min-h-[120px]) that opens the native file picker on tap. Multiple PDF selection is handled by the OS file picker.

**Collapsible template section**: The PowerShell template is useful reference but shouldn't dominate the screen. It's collapsed by default with a "Show template" toggle. When expanded, it shows the template in a scrollable code block with a copy button.

**Results section scrollable**: After upload, results may be long (dozens of books). A scrollable container with max height ensures the page doesn't become infinitely tall.

**Clear as escape hatch**: A clear/reset button allows starting over. It's a ghost button (not destructive red) since it's just clearing the form, not deleting data.

## 3. Mobile Layout Specification

```
┌─────────────────────────────┐
│  Status Bar (safe area)     │
├─────────────────────────────┤
│  Header: "Bulk Upload"      │  h-14, fixed top
│  [← Back]  Bulk Upload      │
├─────────────────────────────┤
│                             │
│  Book Data *                │  px-4, mt-4
│  ┌─────────────────────────┐│
│  │ title|author|genre      ││  JetBrains Mono, min 8 rows
│  │ title|author|genre      ││  auto-resize
│  │ title|author|genre      ││  bg-surface border-border
│  │                         ││
│  └─────────────────────────┘│
│  3 lines · 0 characters     │
│                             │
│  ── Show Template ──        │  collapsible toggle
│  ┌─────────────────────────┐│  (hidden by default)
│  │ $books = @(...)         ││  bg-surface-container-lowest
│  │ ...                     ││  overflow-x-auto
│  │ [Copy]                  ││
│  └─────────────────────────┘│
│                             │
│  Upload PDFs               │
│  ┌─────────────────────────┐│  tap to select
│  │  📁 Tap to select PDFs  ││  min-h-[120px]
│  │  PDF only, multiple OK  ││  border-dashed
│  └─────────────────────────┘│
│                             │
│  Selected Files (3)         │  (hidden if none)
│  ┌─────────────────────────┐│
│  │ 📄 book1.pdf    2.3MB ✕││  scrollable list
│  │ 📄 book2.pdf    1.8MB ✕││  max-h-[200px]
│  │ 📄 book3.pdf    4.1MB ✕││
│  └─────────────────────────┘│
│                             │
│  [  Upload Books  ]         │  full width, bg-primary
│  [  Clear  ]                │  ghost button, full width
│                             │
├─────────────────────────────┤
│  Results (if any)           │  (hidden by default)
│  ┌─────────────────────────┐│
│  │ ✅ The Alchemist    ✓  ││  scrollable, max-h-[300px]
│  │ ✅ Dune             ✓  ││
│  │ ❌ Invalid Book     ✕  ││
│  └─────────────────────────┘│
│                             │
├─────────────────────────────┤
│  Bottom Nav                 │
└─────────────────────────────┘
```

## 4. Component Breakdown

### 4.1 Header Bar
- Fixed top, `h-14`, `bg-canvas/85 backdrop-blur-md border-b border-border`
- Back arrow: `min-h-[44px] min-w-[44px]`
- Title: "Bulk Upload" in `font-headline-3 text-headline-3 text-text-primary`

### 4.2 Book Data Textarea
- Label: "Book Data" + required asterisk
- `bg-surface border border-border rounded-lg p-4`
- `font-label-mono text-[14px] text-text-primary`
- `min-h-[200px]` (approx 8 rows), auto-resize up to max 60vh
- `placeholder:text-text-muted` — "title|author|genre\nOne book per line..."
- Focus: `border-primary ring-2 ring-primary/15`
- Below: line count + character count in `font-label-mono text-caption text-text-muted`

### 4.3 Template Toggle
- Ghost button: "Show Template" / "Hide Template"
- Chevron icon rotates on toggle
- When expanded: `bg-surface-container-lowest border border-border rounded-lg p-4`
- Code block: `font-label-mono text-[13px] text-text-secondary overflow-x-auto whitespace-pre`
- Copy button: `bg-surface border border-border rounded px-3 py-1.5 font-body-small text-text-primary`

### 4.4 File Upload Area
- Full width, `min-h-[120px]`, `border-2 border-dashed border-border rounded-xl`
- `bg-surface-container-lowest/60 hover:bg-surface-container-lowest hover:border-border-hover transition-colors`
- Center: icon + text
- Icon: `upload_file` material, `text-[32px] text-text-muted`
- Text: `font-body-small text-text-secondary` — "Tap to select PDFs"
- Subtext: `font-body-small text-caption text-text-muted` — "PDF only, multiple files"
- Hidden `<input type="file" accept=".pdf" multiple>`
- Tap triggers native file picker

### 4.5 Selected Files List
- Header: "Selected Files ({n})" in `font-body-default text-body-default font-medium text-text-primary`
- Container: `max-h-[200px] overflow-y-auto space-y-2`
- Each file row: `flex items-center gap-3 p-3 bg-surface border border-border rounded-lg`
- Icon: `description` material, `text-primary`
- Name: `font-body-small text-body-small text-text-primary truncate flex-1`
- Size: `font-label-mono text-caption text-text-secondary` — "2.3 MB"
- Remove button: `min-h-[44px] min-w-[44px] flex items-center justify-center` — `close` icon, `text-text-muted hover:text-status-error`

### 4.6 Submit Button
- Full width, `h-12`, `rounded-lg`
- `bg-primary hover:bg-primary-hover active:scale-[0.98]`
- `text-text-on-accent font-body-default text-body-default font-semibold`
- Disabled: no book data entered — `opacity-50 cursor-not-allowed`
- Loading: spinner + "Uploading..."

### 4.7 Clear Button
- Full width, `h-12`, `rounded-lg`
- `bg-transparent border border-border text-text-secondary`
- `font-body-default text-body-default`
- `hover:border-status-error hover:text-status-error`
- Tapping clears all inputs and file selection

### 4.8 Results Section
- Header: "Results" in `font-headline-3 text-headline-3 text-text-primary`
- Container: `max-h-[300px] overflow-y-auto space-y-2 bg-surface border border-border rounded-xl p-4`
- Success row: `flex items-center gap-3 p-3 rounded-lg bg-status-success/10 border border-status-success/20`
  - Check icon: `text-status-success`
  - Book title: `font-body-small text-text-primary`
- Error row: `flex items-center gap-3 p-3 rounded-lg bg-status-error/10 border border-status-error/20`
  - X icon: `text-status-error`
  - Book title + error message: `font-body-small text-text-primary` + `font-body-small text-status-error`

## 5. Mobile Interactions

### 5.1 Textarea Input
- Auto-resize: grows as lines are added (min 8 rows, max ~20 rows before scroll)
- Line count updates on every input change
- Tab key inserts tab character (not browser default focus change)
- Paste support: multi-line paste works correctly

### 5.2 Template Copy
- Tap "Copy" → text copied to clipboard
- Button shows "Copied!" with checkmark for 2s
- `navigator.vibrate(20)` on copy (haptic)

### 5.3 File Selection
- Tap upload area → native file picker opens
- Multiple PDFs can be selected at once
- After selection: files appear in the list
- Duplicate files prevented (same name + size)

### 5.4 File Removal
- Tap ✕ on file → file removed from list with fade-out animation
- `navigator.vibrate(10)` on remove

### 5.5 Upload Process
- Validate: at least one book data line entered
- Button shows spinner + "Uploading..."
- Progress simulated (no real progress on mobile without XHR)
- `navigator.vibrate(50)` on completion (haptic)
- Results section slides in from below

### 5.6 Clear All
- Tap clear → confirmation: "Clear all data?"
- "Clear" / "Cancel"
- On confirm: textarea clears, files list clears, results clear
- No haptic (not destructive)

## 6. Animation Spec

| Element | Animation | Timing | Easing |
|---------|-----------|--------|--------|
| File row enter | `opacity 0→1`, `translateY -8px→0` | 200ms | ease-out |
| File row exit | `opacity 1→0`, `translateX 0→-20px` | 150ms | ease-in |
| Template expand | `max-height 0→200px`, `opacity 0→1` | 250ms | ease-out |
| Results slide-in | `translateY 20px→0`, `opacity 0→1` | 300ms | spring(1, 80, 10) |
| Success/error row | `scale 0.95→1`, `opacity 0→1` | 200ms | ease-out |
| Page enter | `opacity 0→1`, `translateY 8px→0` | 250ms | ease-out |
| Copy button feedback | "Copy" → "Copied!" text swap | instant | — |

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] All interactive elements `min-h-[44px] min-w-[44px]`
- [ ] Textarea min 8 rows visible on initial render
- [ ] Monospace font (JetBrains Mono) renders correctly on mobile
- [ ] File upload opens native picker (not broken drag-drop)
- [ ] Multiple PDF selection works in native picker
- [ ] File list scrolls if many files selected
- [ ] Results section scrolls if many results
- [ ] Submit button not obscured by keyboard or bottom nav
- [ ] `env(safe-area-inset-bottom)` applied to bottom nav
- [ ] No glassmorphism on surfaces
- [ ] No indigo/blue/purple colors
- [ ] No `shadow-lg`
- [ ] Single column always
- [ ] Template code block scrolls horizontally (no word wrap)
- [ ] Clear button has confirmation (not accidental tap)
- [ ] Haptic feedback on upload complete
- [ ] Back swipe gesture works
- [ ] Character count / line count visible
- [ ] Paste into textarea works correctly

## 8. Complete Stitch Prompt

```
Build a mobile-only (max-width: 640px) "Bulk Upload Books" page for a library app called Genu Library. Single HTML file with Tailwind CSS CDN, Framer Motion CDN, Google Fonts (Playfair Display, Inter, JetBrains Mono), and Material Symbols Outlined.

DESIGN SYSTEM (Forge & Flux):
- Canvas: #16110f, Surface: #211a17, Primary: #e8693f
- Border: #3a322d, Text primary: #ece0dc, Text secondary: #a89c93
- Status success: #4ade80, Status error: #ef4444
- Typography: Playfair Display (headlines), Inter (body), JetBrains Mono (mono)
- All interactive elements: min-h-[44px] min-w-[44px]

LAYOUT (single column, stacked):
1. Fixed top header (h-14, bg-canvas/85 backdrop-blur-md border-b border-border):
   - Back arrow button (min-h-[44px] min-w-[44px])
   - "Bulk Upload" title (Playfair Display, headline-3)

2. Main content (px-4, pt-20, pb-36, space-y-6):
   a. Book Data textarea:
      - Label "Book Data *" (Inter, body-default, text-text-primary)
      - bg-surface border-border rounded-lg p-4
      - font-label-mono text-[14px] text-text-primary
      - min-h-[200px] (8 rows), auto-resize on input, max-height 60vh
      - placeholder: "title|author|genre\nOne book per line..."
      - Focus: border-primary ring-2 ring-primary/15
      - Below: line count + char count (JetBrains Mono, caption, text-text-muted)
   
   b. Template toggle (collapsed by default):
      - Ghost button "Show Template" with expand_more icon (rotates on toggle)
      - When expanded: bg-surface-container-lowest border-border rounded-lg p-4
      - Code block: font-label-mono text-[13px] text-text-secondary overflow-x-auto whitespace-pre
      - PowerShell template content
      - Copy button: bg-surface border-border rounded px-3 py-1.5
      - On copy: text changes to "Copied!" for 2s, navigator.vibrate(20)
   
   c. File upload area:
      - min-h-[120px] border-2 border-dashed border-border rounded-xl
      - bg-surface-container-lowest/60 hover:bg-surface-container-lowest hover:border-border-hover
      - Center: upload_file icon (text-[32px] text-text-muted) + "Tap to select PDFs" (text-secondary) + "PDF only, multiple files" (caption, text-muted)
      - Hidden input: type="file" accept=".pdf" multiple
      - Tap triggers native file picker
   
   d. Selected Files list (shown when files selected):
      - Header "Selected Files ({n})" (body-default, font-medium)
      - Container: max-h-[200px] overflow-y-auto space-y-2
      - Each file: flex items-center gap-3 p-3 bg-surface border-border rounded-lg
        - description icon (text-primary)
        - filename (body-small, truncate, flex-1)
        - file size (JetBrains Mono, caption, text-secondary) e.g. "2.3 MB"
        - Remove button (close icon, min-h-[44px] min-w-[44px], text-muted hover:text-status-error)
   
   e. Submit button:
      - Full width h-12 rounded-lg bg-primary
      - "Upload Books" in text-on-accent font-semibold
      - Disabled when no book data: opacity-50 cursor-not-allowed
      - Loading: spinner + "Uploading..."
      - active:scale-[0.98]
   
   f. Clear button:
      - Full width h-12 rounded-lg bg-transparent border border-border
      - "Clear" in text-text-secondary
      - Hover: border-status-error text-status-error
      - Tap: confirmation "Clear all data?" → Clear / Cancel

3. Results section (hidden by default, shown after upload):
   - Header "Results" (headline-3)
   - Container: max-h-[300px] overflow-y-auto bg-surface border-border rounded-xl p-4
   - Success row: flex items-center gap-3 p-3 rounded-lg bg-status-success/10 border border-status-success/20
     - check_circle icon (text-status-success) + book title
   - Error row: flex items-center gap-3 p-3 rounded-lg bg-status-error/10 border border-status-error/20
     - cancel icon (text-status-error) + book title + error message

4. Fixed bottom nav (z-50, bg-canvas/95 backdrop-blur-md border-t border-border, pb-[env(safe-area-inset-bottom)]):
   - 4-5 tabs with min-h-[44px] each

INTERACTIONS:
- Textarea: auto-resize, line count updates on input, paste support
- Template: toggle expand/collapse with animation, copy to clipboard with feedback
- File select: tap area → native picker, multiple PDFs, prevent duplicates (same name+size)
- File remove: tap ✕ → fade-out row, navigator.vibrate(10)
- Upload: validate at least 1 line of book data, show spinner, simulate 1.5s API call
- On complete: navigator.vibrate(50), results section slides in, show success/error per book
- Clear: confirm dialog, then clear all state
- Back: if data entered, confirm "Discard all data?" before navigating

ANIMATIONS (Framer Motion):
- Page: initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
- File rows: AnimatePresence, enter={{ opacity: 0, y: -8 }}, exit={{ opacity: 0, x: -20 }}
- Template expand: motion.div with animate={{ height: "auto", opacity: 1 }} from initial={{ height: 0, opacity: 0 }}
- Results: initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
- Result rows: staggerChildren 0.05

ANTI-SLOP:
- No glassmorphism on surfaces
- No indigo/blue/purple colors
- No shadow-lg
- Single column always
- env(safe-area-inset-bottom) for safe areas
- Touch targets minimum 44x44px
- JetBrains Mono for all monospace content
- Textarea min 8 rows on initial render
- File upload uses native picker, not drag-drop
- Monospace code block scrolls horizontally
```
