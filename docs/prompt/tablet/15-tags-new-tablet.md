# Tags — New Tag (Tablet)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| Page | Create New Tag |
| Route | `/tags/new` |
| Auth | Required |
| Tablet breakpoint | 641px–1024px |
| Top nav | Yes — horizontal nav bar with Library, Browse, Search, Tags (active), Profile |
| Bottom nav | None (mobile-only) |

## 2. Tablet Design Rationale

Tag creation on tablet benefits from the extra horizontal space to show the form and existing tags side-by-side. The user sees their input and the full tag inventory simultaneously — no scrolling back and forth to check for duplicates.

**Two-column layout**: Form on the left (40%), existing tags cloud on the right (60%). The form column has the input field, duplicate warning, and create button stacked vertically. The right column shows all existing tags as a flex-wrap chip cloud with counts. This layout eliminates the need for a separate "check if exists" mental step — the user sees existing tags while typing.

**Top navigation, not bottom**: Tablet users interact with a horizontal top nav bar. The nav sits at the top of the viewport, persistent across all pages. No bottom tab bar. This frees up vertical space for the two-column content.

**Hover states enabled**: Unlike mobile where only `active:` states exist, tablet supports `hover:` states on all interactive elements. Buttons lighten on hover, chips highlight on hover, inputs show hover border. This gives visual feedback before commit.

**Larger touch targets**: `min-h-[40px] min-w-[40px]` instead of mobile's 44px — still generous for touch, but slightly tighter since tablet users often use a stylus or fingertip rather than thumb-only grips.

**Modal for discard confirmation**: Instead of a bottom sheet (mobile pattern), discard confirmation uses a centered modal overlay. Modals work better on tablet because the user's eye is centered on the screen, not anchored to the bottom.

**`px-6` padding**: 24px side padding instead of mobile's 16px. The wider screen can breathe without content feeling cramped.

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────────┐
│  Top Navigation Bar                                      │
│  [Logo]  Library  Browse  Search  Tags(active)  Profile  │
├──────────────────────────────────────────────────────────┤
│  px-6                                                    │
│                                                          │
│  Create New Tag                          2-column layout │
│  ┌─────────────────────┬────────────────────────────────┐│
│  │ LEFT (40%)          │ RIGHT (60%)                     ││
│  │                     │                                ││
│  │  Tag Name           │  Existing Tags (24)            ││
│  │  ┌─────────────────┐│  ┌─────┬─────┬─────┬─────┐   ││
│  │  │ Type tag name... ││  │fant │hist │myst │scifi│   ││
│  │  └─────────────────┘│  │ (12)│ (8) │ (5) │ (15)│   ││
│  │  ⚠️ "fantasy" already│  ├─────┼─────┼─────┼─────┤   ││
│  │     exists          │  │roman│phil │poet │tech │   ││
│  │                     │  │ (7) │ (3) │ (9) │ (11)│   ││
│  │  ┌─────────────────┐│  ├─────┼─────┼─────┼─────┤   ││
│  │  │  Create Tag     ││  │ bio │cook │dram │trave│   ││
│  │  │  (bg-primary)   ││  │ (6) │ (4) │ (2) │ (8) │   ││
│  │  └─────────────────┘│  └─────┴─────┴─────┴─────┘   ││
│  │                     │                                ││
│  └─────────────────────┴────────────────────────────────┘│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Spacing tokens**: `px-6` (24px side gutters), `gap-6` (24px between columns), `space-y-4` (16px between form elements), `gap-2` (8px between chips).

**Column widths**: Left column `w-2/5` (40%), right column `w-3/5` (60%). Below 768px, stacks to single column.

## 4. Component Breakdown

### 4.1 Top Navigation Bar
- Sticky top, `h-16`, `bg-canvas/85 backdrop-blur-md border-b border-border`
- Flex container: logo left, nav links center, profile right
- Logo: "Genu Library" in `font-headline text-headline text-text-primary`
- Nav links: `flex items-center gap-1`
- Each link: `px-4 py-2 rounded-lg font-body-default text-body-default`
- Inactive: `text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors`
- Active: `text-primary bg-primary/10 font-semibold`
- Profile: avatar circle `w-8 h-8 rounded-full bg-surface border border-border`
- All links: `min-h-[40px] min-w-[40px]` touch targets

### 4.2 Page Header
- `px-6 pt-8 pb-6`
- Breadcrumb: `font-body-small text-body-small text-text-muted` — "Home > Tags > Add New"
- Breadcrumb links: `hover:text-text-primary transition-colors`
- Heading: "Create New Tag" in `font-headline-2 text-headline-2 text-text-primary mt-2`

### 4.3 Two-Column Container
- `flex gap-6 px-6 pb-8`
- Left column: `w-2/5` — form
- Right column: `w-3/5` — existing tags
- Below 768px: `flex-col` (stacks vertically)

### 4.4 Tag Name Input (Left Column)
- Label: `font-body-default text-body-default font-medium text-text-primary mb-2` — "Tag Name"
- Full width, `h-12`, `rounded-lg bg-surface border border-border`
- `font-body-default text-body-default text-text-primary`
- `placeholder:text-text-muted`
- `autofocus` on mount
- Focus state: `border-primary ring-2 ring-primary/15`
- Hover state: `hover:border-border-hover transition-colors`
- Below input: character count `font-label-mono text-caption text-text-muted` right-aligned

### 4.5 Duplicate Warning (Left Column)
- Conditional render below input: `hidden` by default, `block` when duplicate detected
- `flex items-center gap-2 mt-2 px-1`
- Icon: `warning` material, `text-[16px] text-status-error`
- Text: `font-body-small text-body-small text-status-error` — "{name} already exists"
- Animate in: `opacity-0 → opacity-100` over 200ms

### 4.6 Create Button (Left Column)
- Full width, `h-12`, `rounded-lg`
- `bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all`
- `text-text-on-accent font-body-default text-body-default font-semibold`
- Disabled state: `bg-surface text-text-muted cursor-not-allowed opacity-50`
- Loading state: spinner + "Creating..."
- `min-h-[40px] min-w-[40px]`

### 4.7 Existing Tags Section (Right Column)
- Section header: flex items-center justify-between
  - Label: `font-headline-3 text-headline-3 text-text-primary` — "Existing Tags"
  - Count badge: `font-label-mono text-caption text-text-secondary bg-surface px-2 py-1 rounded-full` — "{n} tags"
- Chip container: `flex flex-wrap gap-2 p-4 bg-surface border border-border rounded-xl`
- Tag chips: `px-3 py-1.5 rounded-full bg-canvas border border-border font-body-small text-body-small text-text-secondary hover:bg-surface-hover hover:border-border-hover hover:text-text-primary cursor-default transition-all`
- Each chip: tag name + count in `font-label-mono text-caption text-text-muted`
- Skeleton state: 12 chips, each `w-16 h-8 rounded-full bg-surface animate-pulse`
- Max height: `max-h-[calc(100vh-200px)] overflow-y-auto`

### 4.8 Discard Confirmation Modal
- Overlay: `fixed inset-0 bg-black/60 z-50 flex items-center justify-center`
- Modal: `bg-surface border border-border rounded-xl p-6 max-w-sm w-full mx-6`
- Title: `font-headline-3 text-headline-3 text-text-primary mb-2` — "Discard new tag?"
- Body: `font-body-small text-body-small text-text-secondary mb-6` — "Your tag name will be lost."
- Buttons: `flex gap-3`
  - "Keep Editing": `flex-1 h-10 rounded-lg bg-surface border border-border text-text-primary font-body-default hover:bg-surface-hover transition-colors`
  - "Discard": `flex-1 h-10 rounded-lg bg-status-error text-white font-body-default font-semibold hover:bg-status-error/90 transition-colors`
- Both buttons: `min-h-[40px] min-w-[40px]`
- Focus is trapped within modal when open
- Escape key or overlay click = "Keep Editing"

## 5. Tablet Interactions

### 5.1 Input Focus
- On focus: border transitions to `#e8693f`, ring appears with `ring-primary/15`
- On hover: border lightens to `#4d433d`
- On blur: border returns to `#3a322d` unless duplicate detected
- Focus ring persists while input has value and is focused

### 5.2 Real-Time Duplicate Check
- Debounce: 300ms after last keystroke
- On match found: duplicate warning fades in, submit button disables
- On match cleared: duplicate warning fades out, submit button enables
- Check is case-insensitive
- Empty input: no warning shown, submit disabled (no value to create)
- Whitespace-only input: trimmed before check, treated as empty

### 5.3 Tag Creation Flow
- Click submit → button shows spinner + "Creating..."
- Simulated API call: 800ms timeout
- On success:
  1. Input clears immediately
  2. New tag animates into the chip cloud (scale 0.8→1, opacity 0→1, spring bounce)
  3. Chip cloud auto-scrolls if needed to show new tag
  4. Success toast: "Tag created" with check_circle icon, auto-dismiss 2s
  5. Toast appears top-right: `fixed top-20 right-6 z-50`
- On error: toast shows error message, input retains value
- Button returns to default state after completion

### 5.4 Chip Cloud Interaction
- Chips are non-clickable (display only)
- Hover: chip highlights (`bg-surface-hover`, `border-border-hover`, `text-text-primary`)
- Chip cloud reflows naturally as new tags are added
- Scrollable if chips exceed container height
- New chips appear with spring animation and layout reflow

### 5.5 Back Navigation / Discard
- Click browser back or breadcrumb link
- If input has unsaved content, show discard modal
- Modal buttons: "Keep Editing" (closes modal), "Discard" (navigates back, clears state)
- Click overlay to dismiss modal (equivalent to "Keep Editing")
- If input is empty: direct back navigation, no modal

### 5.6 Keyboard Navigation
- Tab through: input → create button → nav links
- Enter on input submits if no duplicate and input has value
- Escape closes discard modal
- Focus trap in modal when open (tab cycles through modal buttons only)
- Shift+Tab from first modal button goes to last, vice versa

## 6. Animation Spec

| Element | Animation | Timing | Easing |
|---------|-----------|--------|--------|
| Duplicate warning | `opacity 0→1`, `translateY -4px→0` | 200ms | ease-out |
| New tag chip | `scale 0.8→1`, `opacity 0→1` | 300ms | spring(1, 80, 10) |
| Create button disabled | `opacity 1→0.5` | 150ms | ease |
| Skeleton pulse | `opacity 0.4→0.7→0.4` | 1.5s | ease-in-out infinite |
| Page enter | `opacity 0→1`, `translateY 8px→0` | 250ms | ease-out |
| Toast slide-in | `translateX 100%→0`, `opacity 0→1` | 300ms | spring(1, 80, 10) |
| Modal overlay | `opacity 0→1` | 200ms | ease |
| Modal content | `scale 0.95→1`, `opacity 0→1` | 200ms | ease-out |
| Chip hover | `background-color` + `border-color` transition | 150ms | ease |

**Framer Motion references:**
- Page: `<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>`
- New tag chip: `<motion.div layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 100, damping: 15 }}>`
- Existing tags: `variants` with `staggerChildren: 0.03`
- Modal: `<motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }}>`

## 7. Tablet Anti-Slop Checklist

- [ ] All interactive elements `min-h-[40px] min-w-[40px]`
- [ ] Top nav is sticky, not fixed (scrolls with page but sticks at top)
- [ ] Two-column layout below 768px collapses to single column
- [ ] No bottom navigation — tablet uses top nav only
- [ ] Hover states on all interactive elements (buttons, chips, links)
- [ ] Focus ring visible on keyboard navigation (`ring-2 ring-primary/15`)
- [ ] Modal replaces bottom sheet for discard confirmation
- [ ] `px-6` (24px) side padding, not mobile's `px-4`
- [ ] Type scale slightly larger than mobile (headline-2 for page title)
- [ ] No glassmorphism on surfaces (only nav backdrop-blur)
- [ ] No indigo/blue/purple anywhere — only rust orange `#e8693f`
- [ ] No `shadow-lg` — use border-based depth or `shadow-sm`
- [ ] Chip cloud wraps naturally (flex-wrap), no horizontal scroll
- [ ] Duplicate warning inline below input, not toast
- [ ] Create button full-width within its column
- [ ] Character count visible below input (JetBrains Mono)
- [ ] Skeleton loading prevents layout shift (fixed chip dimensions)
- [ ] Focus trap in modal when open
- [ ] Toast positioned top-right (not bottom, that's mobile)
- [ ] Empty input disables submit (no "create empty tag" action)
- [ ] Whitespace-only input treated as empty
- [ ] Existing tags section scrolls if chips exceed container height
- [ ] Two-column layout uses `w-2/5` + `w-3/5` proportions
- [ ] Breadcrumb links are clickable with hover state
- [ ] Loading spinner is visible on primary button (not hidden behind text)
- [ ] Success toast auto-dismisses after 2s (not stuck on screen)
- [ ] Modal has max-width constraint (doesn't stretch full width)
- [ ] Tag input placeholder text is visible and helpful
- [ ] Chip count badge updates when new tag is created
- [ ] Two-column responsive breakpoint at 768px (not 641px)
- [ ] Existing tags load with stagger animation (not all at once)
- [ ] Back navigation uses browser history or breadcrumb (not a custom button)
- [ ] All text remains legible at tablet zoom levels (no text below 12px)
- [ ] No horizontal overflow on the page (content respects px-6 gutters)

## 8. Complete Stitch Prompt

```
Build a tablet-only (min-width: 641px, max-width: 1024px) "Create Tag" page for a library app called Genu Library. Single HTML file with Tailwind CSS CDN, Framer Motion CDN, Google Fonts (Playfair Display, Inter, JetBrains Mono), and Material Symbols Outlined.

DESIGN SYSTEM (Forge & Flux):
- Canvas: #16110f, Surface: #211a17, Surface Hover: #2a211c
- Accent: #e8693f, Accent Hover: #d45a30, Accent Muted: #e8693f20
- Border: #3a322d, Border Hover: #4d433d
- Text primary: #ece0dc, Text secondary: #a89c93, Text muted: #7a706a, Text on accent: #16110f
- Status success: #4a7c59, error: #c44d4d, warning: #d4a24e, info: #5b8fb9
- Typography: Playfair Display (headlines), Inter (body), JetBrains Mono (prices/code)
- All interactive elements: min-h-[40px] min-w-[40px]
- Radius: sm 4px, 8px, lg 12px, xl 16px, 2xl 24px, full 9999px
- Animations: spring cubic-bezier(0.34, 1.56, 0.64, 1), smooth cubic-bezier(0.25, 0.1, 0.25, 1)

LAYOUT (2-column, tablet):
1. Sticky top navigation bar (h-16, bg-canvas/85 backdrop-blur-md border-b border-border):
   - Logo: "Genu Library" (Playfair Display, headline, text-text-primary)
   - Nav links: Library, Browse, Search, Tags (active: text-primary bg-primary/10), Profile
   - Each link: px-4 py-2 rounded-lg, hover:bg-surface-hover, min-h-[40px] min-w-[40px]
   - Profile avatar: w-8 h-8 rounded-full bg-surface border-border
   - Active link has bg-primary/10 and text-primary, inactive have text-text-secondary

2. Page content (px-6, pt-8, pb-8):
   a. Breadcrumb: "Home > Tags > Add New" (body-small, text-muted)
      - Each segment hoverable: hover:text-text-primary, transition-colors
   b. Page heading: "Create New Tag" (Playfair Display, headline-2, text-text-primary)

3. Two-column container (flex gap-6):
   LEFT COLUMN (w-2/5):
   a. Tag name input:
      - Label "Tag Name" (Inter, body-default, font-medium, mb-2)
      - Full width h-12 rounded-lg bg-surface border-border
      - Focus: border-primary ring-2 ring-primary/15
      - Hover: border-border-hover, transition-colors
      - autofocus on mount
      - Character count right-aligned below (JetBrains Mono, caption, text-text-muted)
      - Empty input disables submit button
   b. Duplicate warning (hidden by default):
      - warning icon + "{name} already exists" in text-status-error
      - opacity 0→1, translateY -4px→0, 200ms ease-out
      - Case-insensitive match
   c. Create button:
      - Full width h-12 rounded-lg bg-primary
      - hover:bg-primary-hover, active:scale-[0.98]
      - text-on-accent font-semibold
      - Disabled: bg-surface text-text-muted opacity-50 cursor-not-allowed
      - Loading: spinner + "Creating..."
      - min-h-[40px] min-w-[40px]

   RIGHT COLUMN (w-3/5):
   d. Existing Tags section:
      - Section header: "Existing Tags" (Playfair Display, headline-3) + count badge (JetBrains Mono, caption)
      - Chip container: flex flex-wrap gap-2 p-4 bg-surface border-border rounded-xl
      - Each chip: px-3 py-1.5 rounded-full bg-canvas border-border
        - Tag name (body-small, text-secondary) + count (JetBrains Mono, caption, text-muted)
        - hover:bg-surface-hover hover:border-border-hover hover:text-text-primary
        - transition-all 150ms
        - Non-clickable (display only)
      - Skeleton state: 12 pulsing placeholder chips
      - Max height: max-h-[calc(100vh-200px)] overflow-y-auto
      - Scrollable if chips exceed container

INTERACTIONS:
- On input change: debounce 300ms, check if tag name matches any existing tag (case-insensitive)
- If duplicate: show warning, disable submit
- Empty or whitespace-only input: no warning, submit disabled
- On submit: button shows spinner, simulate API (800ms), on success clear input, animate new tag into chip cloud (scale 0.8→1, opacity 0→1, spring transition), show success toast top-right auto-dismiss 2s
- On submit error: toast shows error message, input retains value
- Hover on chips: bg-surface-hover, border-border-hover, text-text-primary (chips are display-only, not clickable)
- On back/breadcrumb click: if input has content, show centered modal "Discard new tag?" with "Keep Editing" (ghost) and "Discard" (red) buttons
- If input empty: direct back navigation, no modal
- Modal overlay click dismisses (equivalent to Keep Editing)
- Keyboard: Tab through input→button→nav, Enter submits (if valid), Escape closes modal
- Focus trap in modal when open (tab cycles through modal buttons only)
- Shift+Tab from first modal button goes to last, vice versa

MODAL (discard confirmation):
- Overlay: fixed inset-0 bg-black/60 z-50 flex items-center justify-center
- Modal: bg-surface border-border rounded-xl p-6 max-w-sm w-full mx-6
- Title: "Discard new tag?" (Playfair Display, headline-3)
- Body: "Your tag name will be lost." (body-small, text-secondary)
- Buttons: flex gap-3
  - "Keep Editing": flex-1 h-10 rounded-lg bg-surface border-border text-text-primary
  - "Discard": flex-1 h-10 rounded-lg bg-status-error text-white font-semibold

ANIMATIONS (Framer Motion):
- Page: initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
- Existing tags stagger: variants with staggerChildren 0.03
- New tag chip: motion.div with layout, initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 100, damping: 15 }}
- Duplicate warning: AnimatePresence for enter/exit
- Modal: AnimatePresence, overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }}, content initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
- Toast: motion.div initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 100, damping: 15 }}

ANTI-SLOP:
- No bottom navigation — tablet uses top nav only
- No glassmorphism on surfaces (only nav backdrop-blur)
- No indigo/blue/purple colors — only rust orange #e8693f
- No shadow-lg — use shadow-sm or border-based depth
- Two-column at 641px+, single-column below 768px
- env(safe-area-inset-bottom) not needed (no bottom nav)
- Touch targets minimum 40x40px
- Modal replaces bottom sheet for confirmations
- px-6 (24px) side padding
- Focus trap in modal
- Focus ring visible on keyboard navigation
- Hover states on all interactive elements
```
