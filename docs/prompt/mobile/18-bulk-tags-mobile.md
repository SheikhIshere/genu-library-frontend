# Bulk Tags — Create (Mobile)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| Page | Bulk Create Tags |
| Route | `/admin/bulk-tags` |
| Auth | Required (admin) |
| Mobile max-width | 640px |
| Bottom nav | Yes (admin variant) |

## 2. Mobile-First Design Rationale

Bulk tag creation is simpler than bulk book upload — it's a single field (tag names) plus context (existing tags). The mobile design prioritizes speed: paste a list, see what already exists, create the rest.

**Monospace textarea for alignment**: Tags entered one-per-line or comma-separated benefit from monospace for scanning. JetBrains Mono at 14px, min 6 rows. The hint text "One tag per line or comma-separated" is always visible below the textarea.

**Existing tags as reference, not blocker**: The existing tags chip cloud is displayed below the textarea as a reference — the user can see what already exists before submitting. This is informational, not a validation gate. The API will handle duplicates server-side.

**Results as confirmation**: After submission, results show each tag with a success/error indicator. Created tags get a green check, duplicates or errors get a red indicator. This gives immediate feedback without requiring a page refresh.

**Clear as reset**: Ghost button to clear all state. Confirmation dialog prevents accidental clearing.

## 3. Mobile Layout Specification

```
┌─────────────────────────────┐
│  Status Bar (safe area)     │
├─────────────────────────────┤
│  Header: "Bulk Create Tags" │  h-14, fixed top
│  [← Back]  Bulk Tags        │
├─────────────────────────────┤
│                             │
│  Tag Names *                │  px-4, mt-4
│  ┌─────────────────────────┐│
│  │ fantasy                  ││  JetBrains Mono, min 6 rows
│  │ sci-fi, romance          ││  auto-resize
│  │ mystery                  ││  bg-surface border-border
│  │                         ││
│  └─────────────────────────┘│
│  One tag per line or comma- │  hint always visible
│  separated                  │
│  4 lines · 42 characters    │
│                             │
│  Existing Tags (24)         │
│  ┌───┬───┬───┬───┬───┐     │  horizontal scroll
│  │ f │ h │ m │ s │ t │ →   │  overflow-x-auto
│  └───┴───┴───┴───┴───┘     │
│                             │
│  [  Create Tags  ]          │  full width, bg-primary
│  [  Clear  ]                │  ghost button, full width
│                             │
├─────────────────────────────┤
│  Results (if any)           │  (hidden by default)
│  ┌─────────────────────────┐│
│  │ ✅ fantasy          ✓  ││  scrollable, max-h-[250px]
│  │ ✅ sci-fi           ✓  ││
│  │ ⚠️ romance (exists) ~  ││
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
- Title: "Bulk Create Tags" in `font-headline-3 text-headline-3 text-text-primary`
- If title too long, truncate with ellipsis

### 4.2 Tag Names Textarea
- Label: "Tag Names" + required asterisk
- `bg-surface border border-border rounded-lg p-4`
- `font-label-mono text-[14px] text-text-primary`
- `min-h-[150px]` (approx 6 rows), auto-resize up to max 40vh
- `placeholder:text-text-muted` — "fantasy\nsci-fi, romance\nmystery"
- Focus: `border-primary ring-2 ring-primary/15`
- Below textarea (always visible):
  - Hint: `font-body-small text-caption text-text-muted` — "One tag per line or comma-separated"
  - Stats: `font-label-mono text-caption text-text-muted` — "{n} lines · {m} characters"

### 4.3 Existing Tags Section
- Header: "Existing Tags ({n})" in `font-body-default text-body-default font-medium text-text-primary`
- Scroll container: `overflow-x-auto flex flex-wrap gap-2 pb-2`
- On mobile: flex-wrap allows chips to wrap to multiple lines (not just horizontal scroll)
- Tag chips: `px-3 py-1.5 rounded-full bg-surface border border-border font-body-small text-body-small text-text-secondary`
- Each chip shows: tag name + count in `font-label-mono text-caption`
- Skeleton state: 8 pulsing placeholder chips while loading

### 4.4 Submit Button
- Full width, `h-12`, `rounded-lg`
- `bg-primary hover:bg-primary-hover active:scale-[0.98]`
- `text-text-on-accent font-body-default text-body-default font-semibold`
- Disabled: no tag names entered — `opacity-50 cursor-not-allowed`
- Loading: spinner + "Creating..."

### 4.5 Clear Button
- Full width, `h-12`, `rounded-lg`
- `bg-transparent border border-border text-text-secondary`
- `font-body-default text-body-default`
- `hover:border-status-error hover:text-status-error`
- Tap → confirmation bottom sheet: "Clear all tags?" / "Clear" (red) / "Cancel"

### 4.6 Results Section
- Header: "Results" in `font-headline-3 text-headline-3 text-text-primary`
- Container: `max-h-[250px] overflow-y-auto bg-surface border border-border rounded-xl p-4`
- Success row: `flex items-center gap-3 p-3 rounded-lg bg-status-success/10 border border-status-success/20`
  - `check_circle` icon: `text-status-success`
  - Tag name: `font-body-small text-text-primary`
- Duplicate row: `flex items-center gap-3 p-3 rounded-lg bg-status-warning/10 border border-status-warning/20`
  - `warning` icon: `text-status-warning`
  - Tag name + "(already exists)": `font-body-small text-text-primary` + `text-status-warning`
- Error row: `flex items-center gap-3 p-3 rounded-lg bg-status-error/10 border border-status-error/20`
  - `cancel` icon: `text-status-error`
  - Tag name + error: `font-body-small text-text-primary` + `text-status-error`

### 4.7 Bottom Navigation
- Fixed bottom, `z-50`
- `bg-canvas/95 backdrop-blur-md border-t border-border`
- `pb-[env(safe-area-inset-bottom)]`
- 4-5 tabs, active tab `text-primary`, inactive `text-text-muted`

## 5. Mobile Interactions

### 5.1 Textarea Input
- Auto-resize: grows as lines are added (min 6 rows, max ~15 rows before scroll)
- Line count updates on every input change
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
- `navigator.vibrate(50)` on completion (haptic)
- Results section slides in
- Each result row appears with stagger

### 5.4 Clear All
- Tap clear → confirmation bottom sheet
- "Clear" clears textarea, results, resets state
- "Cancel" dismisses sheet
- No haptic (not destructive)

### 5.5 Back Navigation
- If textarea has content: show confirmation "Discard all tags?"
- "Discard" / "Keep Editing"
- If empty: direct back

## 6. Animation Spec

| Element | Animation | Timing | Easing |
|---------|-----------|--------|--------|
| Existing tags load | Stagger chip appear, `opacity 0→1`, `scale 0.9→1` | 50ms per chip | ease-out |
| Skeleton chips | `opacity 0.4→0.7→0.4` pulsing | 1.5s | ease-in-out infinite |
| Results slide-in | `translateY 20px→0`, `opacity 0→1` | 300ms | spring(1, 80, 10) |
| Result row enter | `opacity 0→1`, `translateX -10px→0` | 200ms, stagger 50ms | ease-out |
| Page enter | `opacity 0→1`, `translateY 8px→0` | 250ms | ease-out |
| Clear confirmation | Bottom sheet slide-up | 300ms | spring(1, 80, 12) |

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] All interactive elements `min-h-[44px] min-w-[44px]`
- [ ] Textarea min 6 rows visible on initial render
- [ ] Monospace font (JetBrains Mono) renders correctly
- [ ] Hint text always visible below textarea
- [ ] Existing tags wrap to multiple lines (not just horizontal scroll)
- [ ] Submit button not obscured by keyboard or bottom nav
- [ ] `env(safe-area-inset-bottom)` applied to bottom nav
- [ ] No glassmorphism on surfaces
- [ ] No indigo/blue/purple colors
- [ ] No `shadow-lg`
- [ ] Single column always
- [ ] Results scroll if many tags created
- [ ] Clear button has confirmation
- [ ] Haptic on creation complete
- [ ] Back swipe gesture works
- [ ] Line count + char count visible
- [ ] Comma-separated and newline input both work
- [ ] Duplicate input entries deduplicated before submission

## 8. Complete Stitch Prompt

```
Build a mobile-only (max-width: 640px) "Bulk Create Tags" page for a library app called Genu Library. Single HTML file with Tailwind CSS CDN, Framer Motion CDN, Google Fonts (Playfair Display, Inter, JetBrains Mono), and Material Symbols Outlined.

DESIGN SYSTEM (Forge & Flux):
- Canvas: #16110f, Surface: #211a17, Primary: #e8693f
- Border: #3a322d, Text primary: #ece0dc, Text secondary: #a89c93
- Status success: #4ade80, Status error: #ef4444, Status warning: #d4a24e
- Typography: Playfair Display (headlines), Inter (body), JetBrains Mono (mono)
- All interactive elements: min-h-[44px] min-w-[44px]

LAYOUT (single column, stacked):
1. Fixed top header (h-14, bg-canvas/85 backdrop-blur-md border-b border-border):
   - Back arrow button (min-h-[44px] min-w-[44px])
   - "Bulk Create Tags" title (Playfair Display, headline-3, truncate if long)

2. Main content (px-4, pt-20, pb-36, space-y-6):
   a. Tag Names textarea:
      - Label "Tag Names *" (Inter, body-default, text-text-primary)
      - bg-surface border-border rounded-lg p-4
      - font-label-mono text-[14px] text-text-primary
      - min-h-[150px] (6 rows), auto-resize on input, max-height 40vh
      - placeholder: "fantasy\nsci-fi, romance\nmystery"
      - Focus: border-primary ring-2 ring-primary/15
      - Below (always visible):
        - Hint: "One tag per line or comma-separated" (body-small, caption, text-muted)
        - Stats: "{n} lines · {m} characters" (JetBrains Mono, caption, text-muted)
   
   b. Existing Tags section:
      - Header: "Existing Tags ({n})" (body-default, font-medium, text-primary)
      - Container: overflow-x-auto flex flex-wrap gap-2 pb-2
      - On mobile: flex-wrap for multi-line wrapping
      - Each chip: px-3 py-1.5 rounded-full bg-surface border-border
        - Tag name (body-small, text-secondary) + count (JetBrains Mono, caption)
      - Skeleton state: 8 pulsing placeholder chips (w-16 h-8 rounded-full bg-surface-container animate-pulse)
   
   c. Submit button:
      - Full width h-12 rounded-lg bg-primary
      - "Create Tags" in text-on-accent font-semibold
      - Disabled when no tags entered: opacity-50 cursor-not-allowed
      - Loading: spinner + "Creating..."
      - active:scale-[0.98]
   
   d. Clear button:
      - Full width h-12 rounded-lg bg-transparent border border-border
      - "Clear" in text-text-secondary
      - Hover: border-status-error text-status-error
      - Tap: confirmation bottom sheet "Clear all tags?" → Clear (red) / Cancel

3. Results section (hidden by default, shown after upload):
   - Header "Results" (headline-3)
   - Container: max-h-[250px] overflow-y-auto bg-surface border-border rounded-xl p-4
   - Success row: flex items-center gap-3 p-3 rounded-lg bg-status-success/10 border border-status-success/20
     - check_circle icon (text-status-success) + tag name
   - Duplicate row: flex items-center gap-3 p-3 rounded-lg bg-status-warning/10 border border-status-warning/20
     - warning icon (text-status-warning) + tag name + "(already exists)" in text-status-warning
   - Error row: flex items-center gap-3 p-3 rounded-lg bg-status-error/10 border border-status-error/20
     - cancel icon (text-status-error) + tag name + error message

4. Fixed bottom nav (z-50, bg-canvas/95 backdrop-blur-md border-t border-border, pb-[env(safe-area-inset-bottom)]):
   - 4-5 tabs with min-h-[44px] each
   - Active: text-primary, inactive: text-text-muted

INTERACTIONS:
- Textarea: auto-resize, line count + char count update on input
- Input parsing: split by newlines AND commas, trim whitespace, filter empty, deduplicate
- Existing tags: fetch on mount (simulate 500ms), skeleton → chips with stagger animation
- Upload: validate at least 1 tag name, parse input, show spinner, simulate 1s API call
- On complete: navigator.vibrate(50), results section slides in, each row appears with stagger
- Clear: confirm dialog → clear all state
- Back: if textarea has content, confirm "Discard all tags?" before navigating

ANIMATIONS (Framer Motion):
- Page: initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
- Existing tags: variants with staggerChildren 0.05, each chip initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
- Results: initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
- Result rows: variants with staggerChildren 0.05, each initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
- Clear confirmation: bottom sheet AnimatePresence

ANTI-SLOP:
- No glassmorphism on surfaces
- No indigo/blue/purple colors
- No shadow-lg
- Single column always
- env(safe-area-inset-bottom) for safe areas
- Touch targets minimum 44x44px
- JetBrains Mono for all monospace content
- Textarea min 6 rows on initial render
- Hint text always visible (not placeholder-only)
- Existing tags wrap to multiple lines on mobile
- Comma-separated AND newline input both work
- Duplicate input entries deduplicated client-side before submission
```
