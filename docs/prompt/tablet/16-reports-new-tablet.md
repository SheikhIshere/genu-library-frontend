# Reports — New Report (Tablet)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| Page | Report a Book |
| Route | `/books/:id/report` |
| Auth | Required |
| Tablet breakpoint | 641px–1024px |
| Top nav | Yes — horizontal nav bar with Library, Browse, Search, Tags, Profile |
| Bottom nav | None (mobile-only) |

## 2. Tablet Design Rationale

Reporting is a sensitive action that requires clear communication of a problem. On tablet, the extra horizontal space allows the book preview and the report form to sit side-by-side, giving the user constant visual context of what they're reporting while they fill out the form.

**Two-column layout**: Book preview card on the left (smaller, compact), report form on the right. The left column acts as a persistent anchor — the user never loses sight of the book they're reporting. The right column contains reason selection, description, and submit.

**Radio cards in 2-column grid**: Instead of a bottom sheet (mobile) or a single-column list (small tablet), the four reason options display as a 2x2 grid of radio cards. Each card has an icon, title, and brief description. This makes the options scannable and tappable without scrolling.

**Description textarea larger**: With more vertical space available, the textarea starts at 6 rows (vs mobile's 4). The user can see more of their description while typing. Max height is 12 rows.

**Submit button with deep red/orange**: The submit action uses a slightly deeper shade (`#d45a30` on hover) to signal the weight of the report action. The button text is "Submit Report" — clear and direct.

**Trust note below form**: The "Reports are reviewed by moderators" note sits between the description and submit button, reinforcing confidence at the decision point.

**Top navigation**: Horizontal nav bar at the top. No bottom tab bar. This gives more vertical space for the two-column form layout.

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────────┐
│  Top Navigation Bar                                      │
│  [Logo]  Library  Browse  Search  Tags  Profile          │
├──────────────────────────────────────────────────────────┤
│  px-6                                                    │
│                                                          │
│  Report a Book                       2-column layout     │
│  ┌─────────────────────┬────────────────────────────────┐│
│  │ LEFT (35%)          │ RIGHT (65%)                     ││
│  │                     │                                ││
│  │  ┌───────────────┐  │  Reason *                       ││
│  │  │ [cover]       │  │  ┌──────────┬──────────┐      ││
│  │  │  w-20 h-28    │  │  │ ⚖️       │ ⚠️       │      ││
│  │  │               │  │  │ Copyright│ Adult    │      ││
│  │  └───────────────┘  │  │ Infring. │ Content  │      ││
│  │  The Alchemist       │  ├──────────┼──────────┤      ││
│  │  Paulo Coelho        │  │ 📢       │ 🚩       │      ││
│  │  Genre: Fiction      │  │ Spam     │ Other    │      ││
│  │                     │  │          │          │      ││
│  │                     │  └──────────┴──────────┘      ││
│  │                     │                                ││
│  │                     │  Description (Optional)        ││
│  │                     │  ┌────────────────────────┐   ││
│  │                     │  │                        │   ││
│  │                     │  │  (6 rows, auto-resize) │   ││
│  │                     │  │                        │   ││
│  │                     │  └────────────────────────┘   ││
│  │                     │  0 / 500                       ││
│  │                     │                                ││
│  │                     │  ℹ️ Reports are reviewed by   ││
│  │                     │  moderators                    ││
│  │                     │                                ││
│  │                     │  ┌────────────────────────┐   ││
│  │                     │  │    Submit Report        │   ││
│  │                     │  └────────────────────────┘   ││
│  └─────────────────────┴────────────────────────────────┘│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Spacing tokens**: `px-6` (24px side gutters), `gap-6` (24px between columns), `space-y-4` (16px between form elements).

**Column widths**: Left column `w-[35%]` (book preview), right column `w-[65%]` (form). Below 768px, stacks vertically.

## 4. Component Breakdown

### 4.1 Top Navigation Bar
- Sticky top, `h-16`, `bg-canvas/85 backdrop-blur-md border-b border-border`
- Logo + nav links + profile avatar
- Active page: "Profile" highlighted with `text-primary bg-primary/10`
- All links: `min-h-[40px] min-w-[40px]`

### 4.2 Page Header
- `px-6 pt-8 pb-6`
- Breadcrumb: "Home > [Book Title] > Report" in `font-body-small text-text-muted`
- Heading: "Report a Book" in `font-headline-2 text-headline-2 text-text-primary mt-2`

### 4.3 Two-Column Container
- `flex gap-6 px-6 pb-8`
- Left column: `w-[35%]` — book preview
- Right column: `w-[65%]` — report form
- Below 768px: `flex-col` (stacks vertically)

### 4.4 Book Preview Card (Left Column)
- `bg-surface border border-border rounded-xl p-5 sticky top-24`
- Cover image: `w-full h-auto max-h-[320px] rounded-lg object-cover border border-border`
- Title: `font-headline-3 text-headline-3 text-text-primary mt-4 truncate`
- Author: `font-body-default text-body-default text-text-secondary mt-1`
- Genre badge: `inline-flex px-2 py-1 rounded-full bg-primary/10 text-primary font-body-small text-body-small mt-2`

### 4.5 Reason Selection Grid (Right Column)
- Label: "Reason" + required asterisk in `font-body-default text-body-default font-medium text-text-primary mb-3`
- 2-column grid: `grid grid-cols-2 gap-3`
- Each radio card:
  - `relative p-4 rounded-xl border-2 cursor-pointer transition-all`
  - Unselected: `border-border bg-surface hover:bg-surface-hover hover:border-border-hover`
  - Selected: `border-primary bg-primary/10`
  - Icon: `text-[24px] mb-2` — material icon per reason
  - Title: `font-body-default text-body-default font-medium text-text-primary`
  - Description: `font-body-small text-body-small text-text-secondary mt-1`
  - Radio indicator: top-right corner, `w-5 h-5 rounded-full border-2`
    - Unselected: `border-border bg-canvas`
    - Selected: `border-primary bg-primary` with inner dot `w-2.5 h-2.5 rounded-full bg-canvas`
  - Min height: `min-h-[100px]`

### 4.6 Reason Options
1. Copyright Infringement — icon: `balance`, desc: "Violates copyright law"
2. Adult Content — icon: `warning`, desc: "Inappropriate material"
3. Spam — icon: `error_outline`, desc: "Fake or misleading entry"
4. Other — icon: `flag`, desc: "Different issue"

### 4.7 Description Textarea (Right Column)
- Label: "Description" + `(Optional)` badge in `text-text-muted`
- `bg-surface border border-border rounded-lg p-4`
- `min-h-[150px]` (approx 6 rows), auto-resize up to max 12 rows
- `font-body-default text-body-default text-text-primary`
- `placeholder:text-text-muted`
- Character count: `font-label-mono text-caption text-text-muted`
- Focus: `border-primary ring-2 ring-primary/15`
- At 450/500: count turns `text-status-warning`
- At 500/500: count turns `text-status-error`, input stops

### 4.8 Trust Note
- `flex items-start gap-3 p-4 rounded-xl bg-surface border border-primary/20`
- Info icon: `text-primary` in a small rounded container
- Text: `font-body-small text-body-small text-text-secondary` — "Reports are reviewed by moderators to maintain archive quality."

### 4.9 Submit Button
- Full width, `h-12`, `rounded-lg`
- `bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all`
- `text-text-on-accent font-body-default text-body-default font-semibold`
- Disabled when no reason selected: `opacity-50 cursor-not-allowed`
- Loading: spinner + "Submitting..."
- `min-h-[40px] min-w-[40px]`

### 4.10 Success State
- Full screen overlay: `fixed inset-0 bg-canvas z-50 flex items-center justify-center`
- Checkmark animation (animated SVG or material icon scale bounce)
- "Thank you" message: `font-headline-2 text-headline-2 text-text-primary`
- Subtext: `font-body-default text-text-secondary` — "Your report has been submitted for review."
- Auto-redirect after 2 seconds

### 4.11 Discard Confirmation Modal
- Overlay: `fixed inset-0 bg-black/60 z-50 flex items-center justify-center`
- Modal: `bg-surface border border-border rounded-xl p-6 max-w-sm w-full mx-6`
- Title: "Discard report?" in `font-headline-3 text-headline-3 text-text-primary`
- Body: "Your report details will be lost." in `font-body-small text-text-secondary`
- Buttons: flex gap-3
  - "Keep Editing": `flex-1 h-10 rounded-lg bg-surface border border-border text-text-primary`
  - "Discard": `flex-1 h-10 rounded-lg bg-status-error text-white font-semibold`

## 5. Tablet Interactions

### 5.1 Reason Selection
- Click a radio card → border transitions to primary, radio fills
- Previous selection un-fills
- Card gets `bg-primary/10` background
- Hover state: `bg-surface-hover border-border-hover` before selection

### 5.2 Description Input
- Auto-resize: textarea grows as user types (min 6 rows, max 12 rows)
- Character count updates in real-time
- At 450/500: count turns `text-status-warning`
- At 500/500: count turns `text-status-error`, blocks input

### 5.3 Report Submission
- Validate: reason must be selected
- Button shows spinner
- On success: success overlay fades in
- After 2s: navigate back to book detail

### 5.4 Hover States
- Radio cards: hover lightens background and border
- Submit button: hover deepens to `#d45a30`
- Trust note: no hover (informational)
- Breadcrumb links: hover underlines

### 5.5 Keyboard Navigation
- Tab: reason cards → description → submit
- Arrow keys within reason grid (2x2)
- Enter on focused card selects it
- Escape closes discard modal

### 5.6 Back Navigation
- Click browser back or breadcrumb
- If reason selected or description has content, show discard modal
- Modal overlay click = "Keep Editing"

## 6. Animation Spec

| Element | Animation | Timing | Easing |
|---------|-----------|--------|--------|
| Radio card select | `border-color`, `background-color` transition | 200ms | ease |
| Radio dot fill | `scale 0→1` | 150ms | spring(1, 80, 10) |
| Description auto-resize | `height` transition | 100ms | ease |
| Success overlay | `opacity 0→1` | 200ms | ease |
| Success checkmark | `scale 0→1` bounce | 500ms | spring(1, 60, 10) |
| Success text | `opacity 0→1`, `translateY 8px→0` | 300ms, delay 200ms | ease-out |
| Page enter | `opacity 0→1`, `translateY 8px→0` | 250ms | ease-out |
| Modal overlay | `opacity 0→1` | 200ms | ease |
| Modal content | `scale 0.95→1`, `opacity 0→1` | 200ms | ease-out |
| Book card enter | `opacity 0→1`, `translateX -8px→0` | 300ms | ease-out |

**Framer Motion references:**
- Page: `<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>`
- Book card: `<motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>`
- Reason cards: `variants` with `staggerChildren: 0.05`
- Success overlay: `<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>`

## 7. Tablet Anti-Slop Checklist

- [ ] All interactive elements `min-h-[40px] min-w-[40px]`
- [ ] Top nav is sticky, not fixed
- [ ] No bottom navigation — tablet uses top nav only
- [ ] Two-column layout at 641px+, single-column below 768px
- [ ] Book preview sticky on scroll (stays in view while filling form)
- [ ] Radio cards in 2-column grid, not stacked list
- [ ] Hover states on radio cards, buttons, links
- [ ] Focus ring visible on keyboard navigation
- [ ] Modal replaces bottom sheet for discard confirmation
- [ ] `px-6` (24px) side padding
- [ ] No glassmorphism on surfaces
- [ ] No indigo/blue/purple — only rust orange `#e8693f`
- [ ] No `shadow-lg` — use border-based depth
- [ ] Success state fully covers screen (no content bleed-through)
- [ ] Textarea auto-resize works correctly (6 rows start, 12 max)
- [ ] Character count visible during typing
- [ ] Book cover image does not distort (`object-cover`)
- [ ] Focus trap in modal when open
- [ ] Toast positioned top-right if used
- [ ] Description optional badge clearly visible

## 8. Complete Stitch Prompt

```
Build a tablet-only (min-width: 641px, max-width: 1024px) "Report a Book" page for a library app called Genu Library. Single HTML file with Tailwind CSS CDN, Framer Motion CDN, Google Fonts (Playfair Display, Inter, JetBrains Mono), and Material Symbols Outlined.

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
   - Nav links: Library, Browse, Search, Tags, Profile (active: text-primary bg-primary/10)
   - Each link: px-4 py-2 rounded-lg, hover:bg-surface-hover, min-h-[40px] min-w-[40px]

2. Page content (px-6, pt-8, pb-8):
   a. Breadcrumb: "Home > [Book Title] > Report" (body-small, text-muted)
   b. Heading: "Report a Book" (Playfair Display, headline-2)

3. Two-column container (flex gap-6):
   LEFT COLUMN (w-[35%]):
   a. Book preview card (sticky top-24):
      - bg-surface border-border rounded-xl p-5
      - Cover image: w-full max-h-[320px] rounded-lg object-cover border-border
      - Title (Playfair Display, headline-3, truncate)
      - Author (body-default, text-secondary)
      - Genre badge: inline-flex px-2 py-1 rounded-full bg-primary/10 text-primary

   RIGHT COLUMN (w-[65%]):
   b. Reason selection (2-column grid: grid grid-cols-2 gap-3):
      - Label "Reason *" (body-default, font-medium, mb-3)
      - Each card: relative p-4 rounded-xl border-2 cursor-pointer transition-all
        - Unselected: border-border bg-surface hover:bg-surface-hover hover:border-border-hover
        - Selected: border-primary bg-primary/10
        - Icon: text-[24px] mb-2
        - Title: body-default font-medium text-text-primary
        - Description: body-small text-text-secondary mt-1
        - Radio indicator: top-right, w-5 h-5 rounded-full border-2
        - Min height: min-h-[100px]
      - Options: Copyright Infringement (balance), Adult Content (warning), Spam (error_outline), Other (flag)

   c. Description textarea:
      - Label "Description" + "(Optional)" badge
      - bg-surface border-border rounded-lg p-4
      - min-h-[150px] (6 rows), auto-resize up to 12 rows
      - font-body-default text-text-primary
      - Character count right-aligned (JetBrains Mono, caption)
      - Focus: border-primary ring-2 ring-primary/15
      - At 450/500: text-status-warning, at 500/500: text-status-error, block input

   d. Trust note:
      - flex items-start gap-3 p-4 rounded-xl bg-surface border border-primary/20
      - info icon (text-primary) + "Reports are reviewed by moderators to maintain archive quality." (body-small, text-secondary)

   e. Submit button:
      - Full width h-12 rounded-lg bg-primary
      - hover:bg-primary-hover, active:scale-[0.98]
      - "Submit Report" in text-on-accent font-semibold
      - Disabled (no reason): opacity-50 cursor-not-allowed
      - Loading: spinner + "Submitting..."

MODAL (discard confirmation):
- Overlay: fixed inset-0 bg-black/60 z-50 flex items-center justify-center
- Modal: bg-surface border-border rounded-xl p-6 max-w-sm w-full mx-6
- Title: "Discard report?" (Playfair Display, headline-3)
- Body: "Your report details will be lost." (body-small, text-secondary)
- Buttons: flex gap-3
  - "Keep Editing": flex-1 h-10 rounded-lg bg-surface border-border text-text-primary
  - "Discard": flex-1 h-10 rounded-lg bg-status-error text-white font-semibold

SUCCESS STATE:
- Full screen overlay: fixed inset-0 bg-canvas z-50 flex items-center justify-center
- Checkmark: animated SVG stroke-draw or material icon scale-bounce
- "Thank you" (Playfair Display, headline-2)
- "Your report has been submitted for review." (body-default, text-secondary)
- Auto-redirect after 2s

INTERACTIONS:
- Reason selection: click card → border+bg transition, radio dot springs in, previous deselects
- Description: auto-resize, char count updates, warn at 450, block at 500
- Submit: validate reason selected, show spinner, simulate 1s API, show success overlay
- Hover: cards lighten, submit deepens to #d45a30, breadcrumb links highlight
- Keyboard: Tab through cards→description→submit, arrow keys in 2x2 grid, Enter selects, Escape closes modal
- Back/breadcrumb: if form has content, show discard modal, overlay click = Keep Editing

ANIMATIONS (Framer Motion):
- Page: initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
- Book card: initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
- Reason cards: variants with staggerChildren 0.05
- Radio dot: scale 0→1 spring on select
- Success overlay: initial={{ opacity: 0 }} animate={{ opacity: 1 }}
- Success checkmark: initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
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
- Book preview sticky in left column
- Radio cards in 2x2 grid, not stacked
- Focus trap in modal
- Focus ring visible on keyboard navigation
- Hover states on interactive elements
```
