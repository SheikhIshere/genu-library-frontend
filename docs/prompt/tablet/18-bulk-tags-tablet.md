# Bulk Tags — Create (Tablet)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| Page | Bulk Create Tags |
| Route | `/admin/bulk-tags` |
| Auth | Required (admin) |
| Tablet breakpoint | 641px–1024px |
| Top nav | Yes — horizontal nav bar (admin variant) |
| Bottom nav | None (mobile-only) |

## 2. Tablet Design Rationale

Bulk tag creation is a streamlined single-field operation — enter tag names, see what exists, create the rest. On tablet, the wider viewport lets the textarea breathe and the existing tags cloud display without horizontal scrolling.

**Centered textarea, wider**: The textarea spans the full content width (with `px-6` gutters) rather than being confined to a narrow mobile column. This makes scanning long lists of tag names much easier. 8 rows visible on tablet (vs mobile's 6).

**Existing tags cloud below, flex-wrap**: The existing tags display below the textarea as a flex-wrap chip cloud. On tablet, there's enough width for 4-6 chips per row, so the cloud feels like a natural grid rather than a horizontal scroll. This gives the user an at-a-glance view of what already exists.

**Results in 2-column grid**: After submission, results show in a 2-column grid. Created tags get green cards, duplicates get warning cards, errors get red cards. This makes scanning results fast.

**Upload button prominent**: The "Create Tags" button is visually prominent — full width within its container, `h-12`, primary orange. The clear button sits below as a secondary action.

**Top navigation**: Standard horizontal nav bar. No bottom tab bar.

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────────┐
│  Top Navigation Bar                                      │
│  [Logo]  Library  Browse  Search  Tags  Profile          │
├──────────────────────────────────────────────────────────┤
│  px-6                                                    │
│                                                          │
│  Bulk Create Tags                                        │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │  Tag Names *                                         ││
│  │  ┌──────────────────────────────────────────────────┐││
│  │  │ fantasy                                          │││
│  │  │ sci-fi, romance                                  │││
│  │  │ mystery                                          │││
│  │  │                                                  │││
│  │  │                                                  │││
│  │  │  (8 rows, JetBrains Mono)                        │││
│  │  └──────────────────────────────────────────────────┘││
│  │  One tag per line or comma-separated    4 lines · 42ch││
│  └──────────────────────────────────────────────────────┘│
│                                                          │
│  Existing Tags (24)                                      │
│  ┌──────────────────────────────────────────────────────┐│
│  │ ┌─────┬─────┬─────┬─────┬─────┬─────┐              ││
│  │ │fant │hist │myst │scifi│roman│phil │              ││
│  │ │(12) │ (8) │ (5) │(15) │ (7) │ (3) │              ││
│  │ ├─────┼─────┼─────┼─────┼─────┼─────┤              ││
│  │ │poet │tech │ bio │cook │dram │trave│              ││
│  │ │ (9) │(11) │ (6) │ (4) │ (2) │ (8) │              ││
│  │ └─────┴─────┴─────┴─────┴─────┴─────┘              ││
│  └──────────────────────────────────────────────────────┘│
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │  [  Create Tags  ]                                   ││
│  └──────────────────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────────────────┐│
│  │  [  Clear  ]                                         ││
│  └──────────────────────────────────────────────────────┘│
│                                                          │
│  Results (if any) — 2-column grid                        │
│  ┌──────────────────┬──────────────────┐                │
│  │✅ fantasy    ✓   │✅ sci-fi     ✓   │                │
│  │⚠️ romance (exists)│❌ invalid    ✕   │                │
│  └──────────────────┴──────────────────┘                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Spacing tokens**: `px-6` (24px side gutters), `space-y-4` (16px between sections), `gap-2` (8px between chips), `gap-3` (12px between result cards).

## 4. Component Breakdown

### 4.1 Top Navigation Bar
- Sticky top, `h-16`, `bg-canvas/85 backdrop-blur-md border-b border-border`
- Standard nav links with active state
- All links: `min-h-[40px] min-w-[40px]`

### 4.2 Page Header
- `px-6 pt-8 pb-6`
- Breadcrumb: "Home > Admin > Bulk Tags" in `font-body-small text-text-muted`
- Heading: "Bulk Create Tags" in `font-headline-2 text-headline-2 text-text-primary mt-2`

### 4.3 Tag Names Textarea (Full Width)
- Container: `px-6 pb-6`
- Label: "Tag Names" + required asterisk
- `bg-surface border border-border rounded-lg p-4`
- `font-label-mono text-[14px] text-text-primary`
- `min-h-[200px]` (approx 8 rows), auto-resize up to max 40vh
- `placeholder:text-text-muted` — "fantasy\nsci-fi, romance\nmystery"
- Focus: `border-primary ring-2 ring-primary/15`
- Hover: `hover:border-border-hover transition-colors`
- Below textarea (always visible):
  - Hint: `font-body-small text-caption text-text-muted` — "One tag per line or comma-separated"
  - Stats: `font-label-mono text-caption text-text-muted` — "{n} lines · {m} characters"

### 4.4 Existing Tags Section (Full Width)
- Container: `px-6 pb-6`
- Section header: flex items-center justify-between
  - Label: "Existing Tags" in `font-headline-3 text-headline-3 text-text-primary`
  - Count badge: `font-label-mono text-caption text-text-secondary bg-surface px-2 py-1 rounded-full` — "{n} tags"
- Chip container: `flex flex-wrap gap-2 p-4 bg-surface border border-border rounded-xl`
- Tag chips: `px-3 py-1.5 rounded-full bg-canvas border border-border font-body-small text-body-small text-text-secondary hover:bg-surface-hover hover:border-border-hover hover:text-text-primary cursor-default transition-all`
- Each chip: tag name + count in `font-label-mono text-caption text-text-muted`
- Skeleton state: 12 pulsing placeholder chips while loading
- Max height: `max-h-[200px] overflow-y-auto`

### 4.5 Submit Button (Full Width)
- Container: `px-6 pb-2`
- Full width, `h-12`, `rounded-lg`
- `bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all`
- `text-text-on-accent font-body-default text-body-default font-semibold`
- Disabled: no tag names entered — `opacity-50 cursor-not-allowed`
- Loading: spinner + "Creating..."
- `min-h-[40px] min-w-[40px]`

### 4.6 Clear Button (Full Width)
- Container: `px-6 pb-6`
- Full width, `h-12`, `rounded-lg`
- `bg-transparent border border-border text-text-secondary`
- `font-body-default text-body-default`
- `hover:border-status-error hover:text-status-error transition-colors`
- Click → modal confirmation: "Clear all tags?" / "Clear" (red) / "Cancel"

### 4.7 Results Section (2-Column Grid)
- Container: `px-6 pb-8`
- Header: "Results" in `font-headline-3 text-headline-3 text-text-primary mb-4`
- 2-column grid: `grid grid-cols-2 gap-3`
- Success card: `flex items-center gap-3 p-4 rounded-lg bg-surface border border-border border-l-4 border-l-status-success`
  - `check_circle` icon: `text-status-success`
  - Tag name: `font-body-default text-body-default text-text-primary`
- Duplicate card: `flex items-center gap-3 p-4 rounded-lg bg-surface border border-border border-l-4 border-l-status-warning`
  - `warning` icon: `text-status-warning`
  - Tag name + "(already exists)": `font-body-small text-text-primary` + `text-status-warning`
- Error card: `flex items-center gap-3 p-4 rounded-lg bg-surface border border-border border-l-4 border-l-status-error`
  - `cancel` icon: `text-status-error`
  - Tag name + error: `font-body-small text-text-primary` + `text-status-error`
- Scrollable if >8 results: `max-h-[300px] overflow-y-auto`

### 4.8 Clear Confirmation Modal
- Overlay: `fixed inset-0 bg-black/60 z-50 flex items-center justify-center`
- Modal: `bg-surface border border-border rounded-xl p-6 max-w-sm w-full mx-6`
- Title: "Clear all tags?" in `font-headline-3 text-headline-3 text-text-primary`
- Body: "All entered tag names and results will be removed." in `font-body-small text-text-secondary`
- Buttons: flex gap-3
  - "Cancel": `flex-1 h-10 rounded-lg bg-surface border border-border text-text-primary`
  - "Clear": `flex-1 h-10 rounded-lg bg-status-error text-white font-semibold`

## 5. Tablet Interactions

### 5.1 Textarea Input
- Auto-resize: grows as lines are added (min 8 rows, max ~18 rows before scroll)
- Line count + character count update on every input change
- Comma-separated parsing: split on commas, trim whitespace, filter empty
- Newline parsing: split on newlines, trim whitespace, filter empty
- Combined: deduplicate input entries before submission

### 5.2 Existing Tags Load
- On mount: fetch existing tags (simulated 500ms delay)
- Show skeleton chips during load
- Chips appear with stagger animation

### 5.3 Tag Creation
- Validate: at least one tag name entered
- Parse input: split by newlines and commas, deduplicate
- Button shows spinner + "Creating..."
- Results section slides in below
- Each result card appears with stagger

### 5.4 Hover States
- Chips: hover highlights (`bg-surface-hover`, `border-border-hover`)
- Submit button: hover deepens to `#d45a30`
- Clear button: hover turns border + text to error color
- Result cards: subtle hover lift

### 5.5 Clear All
- Click clear → modal confirmation
- "Clear" clears textarea, results, resets state
- "Cancel" dismisses modal

### 5.6 Keyboard Navigation
- Tab: textarea → submit → clear
- Enter on textarea (with Ctrl/Cmd) could also submit
- Escape closes clear modal
- Focus trap in modal when open

## 6. Animation Spec

| Element | Animation | Timing | Easing |
|---------|-----------|--------|--------|
| Existing tags load | Stagger chip appear, `opacity 0→1`, `scale 0.9→1` | 30ms per chip | ease-out |
| Skeleton chips | `opacity 0.4→0.7→0.4` pulsing | 1.5s | ease-in-out infinite |
| Results slide-in | `translateY 20px→0`, `opacity 0→1` | 300ms | spring(1, 80, 10) |
| Result card enter | `opacity 0→1`, `scale 0.95→1` | 200ms, stagger 50ms | ease-out |
| Page enter | `opacity 0→1`, `translateY 8px→0` | 250ms | ease-out |
| Modal overlay | `opacity 0→1` | 200ms | ease |
| Modal content | `scale 0.95→1`, `opacity 0→1` | 200ms | ease-out |
| Chip hover | `background-color` + `border-color` transition | 150ms | ease |

**Framer Motion references:**
- Page: `<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>`
- Existing tags: `variants` with `staggerChildren: 0.03`, each chip `initial={{ opacity: 0, scale: 0.9 }}` `animate={{ opacity: 1, scale: 1 }}`
- Results: `initial={{ y: 20, opacity: 0 }}` `animate={{ y: 0, opacity: 1 }}`
- Result cards: `variants` with `staggerChildren: 0.05`
- Modal: `AnimatePresence`, overlay `initial={{ opacity: 0 }}`, content `initial={{ scale: 0.95, opacity: 0 }}`

## 7. Tablet Anti-Slop Checklist

- [ ] All interactive elements `min-h-[40px] min-w-[40px]`
- [ ] Top nav is sticky, not fixed
- [ ] No bottom navigation — tablet uses top nav only
- [ ] Textarea min 8 rows visible on initial render
- [ ] Monospace font (JetBrains Mono) renders correctly
- [ ] Hint text always visible below textarea
- [ ] Existing tags wrap to multiple lines (flex-wrap, not horizontal scroll)
- [ ] 4-6 chips per row on tablet width (not 2-3 like mobile)
- [ ] Submit button full width, prominent
- [ ] Results in 2-column grid
- [ ] Results scroll if many tags (max-h-[300px])
- [ ] Hover states on chips, buttons
- [ ] Focus ring visible on keyboard navigation
- [ ] Modal replaces bottom sheet for clear confirmation
- [ ] `px-6` (24px) side padding
- [ ] No glassmorphism on surfaces
- [ ] No indigo/blue/purple — only rust orange `#e8693f`
- [ ] No `shadow-lg` — use border-based depth
- [ ] Clear button has confirmation (not accidental click)
- [ ] Line count + char count visible
- [ ] Comma-separated and newline input both work
- [ ] Duplicate input entries deduplicated before submission
- [ ] Focus trap in modal when open

## 8. Complete Stitch Prompt

```
Build a tablet-only (min-width: 641px, max-width: 1024px) "Bulk Create Tags" page for a library app called Genu Library. Single HTML file with Tailwind CSS CDN, Framer Motion CDN, Google Fonts (Playfair Display, Inter, JetBrains Mono), and Material Symbols Outlined.

DESIGN SYSTEM (Forge & Flux):
- Canvas: #16110f, Surface: #211a17, Surface Hover: #2a211c
- Accent: #e8693f, Accent Hover: #d45a30, Accent Muted: #e8693f20
- Border: #3a322d, Border Hover: #4d433d
- Text primary: #ece0dc, Text secondary: #a89c93, Text muted: #7a706a, Text on accent: #16110f
- Status success: #4a7c59, error: #c44d4d, warning: #d4a24e, info: #5b8fb9
- Typography: Playfair Display (headlines), Inter (body), JetBrains Mono (prices/code)
- All interactive elements: min-h-[40px] min-w-[40px]
- Radius: sm 4px, 8px, lg 12px, xl 16px, 2xl 24px, full 9999px

LAYOUT (full-width sections, tablet):
1. Sticky top navigation bar (h-16, bg-canvas/85 backdrop-blur-md border-b border-border):
   - Logo: "Genu Library" (Playfair Display)
   - Nav links: Library, Browse, Search, Tags, Profile (active state)
   - Each link: px-4 py-2 rounded-lg, hover:bg-surface-hover, min-h-[40px] min-w-[40px]

2. Page content (px-6, pt-8):
   a. Breadcrumb: "Home > Admin > Bulk Tags" (body-small, text-muted)
   b. Heading: "Bulk Create Tags" (Playfair Display, headline-2)

3. Tag Names textarea (px-6 pb-6, full width):
   - Label "Tag Names *" (Inter, body-default, font-medium)
   - bg-surface border-border rounded-lg p-4
   - font-label-mono text-[14px] text-text-primary
   - min-h-[200px] (8 rows), auto-resize on input, max-height 40vh
   - placeholder: "fantasy\nsci-fi, romance\nmystery"
   - Focus: border-primary ring-2 ring-primary/15
   - Hover: border-border-hover
   - Below (always visible):
     - Hint: "One tag per line or comma-separated" (body-small, caption, text-muted)
     - Stats: "{n} lines · {m} characters" (JetBrains Mono, caption, text-muted)

4. Existing Tags section (px-6 pb-6, full width):
   - Section header: "Existing Tags" (Playfair Display, headline-3) + count badge (JetBrains Mono, caption)
   - Chip container: flex flex-wrap gap-2 p-4 bg-surface border-border rounded-xl
   - Each chip: px-3 py-1.5 rounded-full bg-canvas border-border
     - Tag name (body-small, text-secondary) + count (JetBrains Mono, caption, text-muted)
     - hover:bg-surface-hover hover:border-border-hover hover:text-text-primary
     - transition-all 150ms
   - 4-6 chips per row on tablet (flex-wrap)
   - Skeleton state: 12 pulsing placeholder chips
   - Max height: max-h-[200px] overflow-y-auto

5. Submit button (px-6 pb-2, full width):
   - h-12 rounded-lg bg-primary
   - hover:bg-primary-hover, active:scale-[0.98]
   - "Create Tags" in text-on-accent font-semibold
   - Disabled when no tags: opacity-50 cursor-not-allowed
   - Loading: spinner + "Creating..."

6. Clear button (px-6 pb-6, full width):
   - h-12 rounded-lg bg-transparent border border-border
   - "Clear" in text-text-secondary
   - hover:border-status-error hover:text-status-error
   - Click: modal confirmation "Clear all tags?"

7. Results section (hidden by default, shown after creation, px-6 pb-8):
   - Header "Results" (headline-3, mb-4)
   - 2-column grid: grid grid-cols-2 gap-3
   - Success card: flex items-center gap-3 p-4 rounded-lg bg-surface border-border border-l-4 border-l-status-success
     - check_circle icon (text-status-success) + tag name
   - Duplicate card: flex items-center gap-3 p-4 rounded-lg bg-surface border-border border-l-4 border-l-status-warning
     - warning icon (text-status-warning) + tag name + "(already exists)" in text-status-warning
   - Error card: flex items-center gap-3 p-4 rounded-lg bg-surface border-border border-l-4 border-l-status-error
     - cancel icon (text-status-error) + tag name + error message
   - Scrollable if >8 results: max-h-[300px] overflow-y-auto

MODAL (clear confirmation):
- Overlay: fixed inset-0 bg-black/60 z-50 flex items-center justify-center
- Modal: bg-surface border-border rounded-xl p-6 max-w-sm w-full mx-6
- Title: "Clear all tags?" (Playfair Display, headline-3)
- Body: "All entered tag names and results will be removed." (body-small, text-secondary)
- Buttons: flex gap-3
  - "Cancel": flex-1 h-10 rounded-lg bg-surface border-border text-text-primary
  - "Clear": flex-1 h-10 rounded-lg bg-status-error text-white font-semibold

INTERACTIONS:
- Textarea: auto-resize, line count + char count update on input
- Input parsing: split by newlines AND commas, trim whitespace, filter empty, deduplicate
- Existing tags: fetch on mount (simulate 500ms), skeleton → chips with stagger animation
- Submit: validate at least 1 tag name, parse input, show spinner, simulate 1s API call
- On complete: results section slides in, each card appears with stagger
- Hover: chips highlight, submit deepens, clear turns error-colored
- Clear: modal confirm → clear all state
- Keyboard: Tab through textarea→submit→clear, Escape closes modal
- Focus trap in modal when open

ANIMATIONS (Framer Motion):
- Page: initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
- Existing tags: variants with staggerChildren 0.03, each chip initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
- Results: initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
- Result cards: variants with staggerChildren 0.05, each initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
- Modal: AnimatePresence, overlay initial={{ opacity: 0 }}, content initial={{ scale: 0.95, opacity: 0 }}

ANTI-SLOP:
- No bottom navigation — tablet uses top nav only
- No glassmorphism on surfaces (only nav backdrop-blur)
- No indigo/blue/purple colors — only rust orange #e8693f
- No shadow-lg — use shadow-sm or border-based depth
- Touch targets minimum 40x40px
- Modal replaces bottom sheet for confirmations
- px-6 (24px) side padding
- JetBrains Mono for all monospace content
- Textarea min 8 rows on initial render
- Hint text always visible (not placeholder-only)
- Existing tags flex-wrap (4-6 per row on tablet)
- Comma-separated AND newline input both work
- Duplicate input entries deduplicated client-side before submission
- Focus trap in modal
- Focus ring visible on keyboard navigation
- Hover states on all interactive elements
```
