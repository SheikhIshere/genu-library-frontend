# Tags — New Tag (Mobile)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| Page | Create New Tag |
| Route | `/tags/new` |
| Auth | Required |
| Mobile max-width | 640px |
| Bottom nav | Yes — Library, Browse, Search, Tags (active), Profile |

## 2. Mobile-First Design Rationale

Tag creation on mobile is a high-frequency micro-action. The user's primary mental model is: type a name, see if it exists, confirm creation. Every design decision minimizes friction for this flow.

**Thumb-zone priority**: The input field sits in the upper-mid zone for reading, but the submit button is anchored at the bottom of the viewport above the nav bar — right in the natural thumb resting zone. This inverts the desktop pattern where the button was at the form bottom.

**Bottom sheet over dropdown**: Existing tags are displayed as a horizontal scrollable chip list, not a dropdown. A dropdown would obscure the input on small screens. The horizontal chip list gives instant visual context without covering the input area.

**Real-time duplicate detection**: As the user types, we debounce-check against the existing tags list. If a match is found, a warning toast appears inline below the input — not a modal, not an alert. The submit button dims and disables. This prevents the dead-end of submitting, waiting, then being told it's a duplicate.

**Single column, no grid**: Everything stacks vertically. The input takes full width. The existing tags section scrolls horizontally. The submit button is full-width. No side-by-side layouts.

**Skeleton loading for existing tags**: On initial load, the existing tags section shows skeleton chips (pulsing placeholder rectangles) before the real data renders. This prevents layout shift and gives immediate visual feedback that data is loading.

## 3. Mobile Layout Specification

```
┌─────────────────────────────┐
│  Status Bar (safe area)     │
├─────────────────────────────┤
│  Header: "Create Tag"       │  h-14, flex items-center
│  [← Back]  Create Tag       │
├─────────────────────────────┤
│                             │
│  Tag Name                   │  px-4, mt-4
│  ┌─────────────────────────┐│
│  │ Type tag name...        ││  h-12, full width
│  └─────────────────────────┘│
│  ⚠️ "fantasy" already exists │  conditional, hidden by default
│                             │
├─────────────────────────────┤
│  Existing Tags              │  px-4, mt-6
│  "24 tags in library"       │
│  ┌───┬───┬───┬───┬───┐     │  horizontal scroll
│  │ f │ h │ m │ s │ t │ →   │  overflow-x-auto, snap-x
│  └───┴───┴───┴───┴───┘     │
│  (skeleton: 6 pulsing)      │  while loading
├─────────────────────────────┤
│                             │
│                             │  spacer pushes button down
│                             │
├─────────────────────────────┤
│  [  Create Tag  ]           │  fixed bottom, full width
│  env(safe-area-inset-bottom)│  pb-safe
├─────────────────────────────┤
│  Bottom Nav (4 tabs)        │  fixed bottom, z-50
│  📚  🔍  🏷️  👤             │
└─────────────────────────────┘
```

**Spacing tokens**: `px-4` (16px gutters), `mt-4` (16px), `mt-6` (24px), `gap-2` (8px between chips).

**Safe areas**: Bottom nav uses `pb-[env(safe-area-inset-bottom)]`. Submit button sits above nav with `mb-[calc(56px+env(safe-area-inset-bottom))]`.

## 4. Component Breakdown

### 4.1 Header Bar
- Fixed top, `h-14`, `bg-canvas/85 backdrop-blur-md border-b border-border`
- Left: back arrow button `min-h-[44px] min-w-[44px]` (touch target)
- Center: "Create Tag" in `font-headline-3 text-headline-3 text-text-primary`
- No right action

### 4.2 Tag Name Input
- Full width, `h-12`, `rounded-lg bg-surface border border-border`
- `font-body-default text-body-default text-text-primary`
- `placeholder:text-text-muted`
- `autofocus` on mount
- Focus state: `border-primary ring-2 ring-primary/15`
- Below input: character count `font-label-mono text-caption text-text-muted` (right-aligned)

### 4.3 Duplicate Warning
- Conditional render: `hidden` by default, `block` when duplicate detected
- `flex items-center gap-2 mt-2 px-1`
- Icon: `warning` material icon, `text-[16px] text-status-error`
- Text: `font-body-small text-body-small text-status-error` — "{name} already exists"
- Animate in: `opacity-0 → opacity-100` over 200ms

### 4.4 Existing Tags Section
- Label: `font-overline text-overline uppercase tracking-wider text-text-muted` — "Existing Tags"
- Count badge: `font-label-mono text-caption text-text-secondary` — "{n} tags"
- Scroll container: `overflow-x-auto flex gap-2 pb-2 snap-x snap-mandatory`
- Tag chips: `shrink-0 px-3 py-1.5 rounded-full bg-surface border border-border font-body-small text-body-small text-text-secondary`
- Each chip shows: tag name + count in `font-label-mono text-caption`
- Skeleton state: 6 chips, each `w-20 h-8 rounded-full bg-surface-container animate-pulse`

### 4.5 Submit Button
- Fixed to bottom above nav bar
- Full width, `h-12`, `rounded-lg`
- `bg-primary hover:bg-primary-hover active:scale-[0.98]`
- `text-text-on-accent font-body-default text-body-default font-semibold`
- Disabled state: `bg-surface-container text-text-muted cursor-not-allowed opacity-50`
- Loading state: spinner + "Creating..."

### 4.6 Bottom Navigation
- Fixed bottom, `z-50`
- `bg-canvas/95 backdrop-blur-md border-t border-border`
- `pb-[env(safe-area-inset-bottom)]`
- 4 tabs: Library, Browse, Search, Tags (active), Profile
- Active tab: `text-primary`, inactive: `text-text-muted`
- Each tab: `min-h-[44px] min-w-[44px]` with icon + label

## 5. Mobile Interactions

### 5.1 Input Focus
- On focus: border transitions to `#e8693f`, ring appears with `ring-primary/15`
- Keyboard opens (mobile), input scrolls into view

### 5.2 Real-Time Duplicate Check
- Debounce: 300ms after last keystroke
- On match found: duplicate warning fades in, submit button disables
- On match cleared: duplicate warning fades out, submit button enables
- Check is case-insensitive

### 5.3 Tag Creation
- Tap submit → button shows spinner + "Creating..."
- `navigator.vibrate(50)` on successful creation (haptic)
- Input clears
- New tag animates into the existing tags chip list (slide-in from right + scale bounce)
- Chip list auto-scrolls to show the new tag
- Success toast: "Tag created" with checkmark, auto-dismiss 2s

### 5.4 Horizontal Chip Scroll
- Snap scrolling: each chip snaps to the left edge
- Momentum scrolling on iOS
- `-webkit-overflow-scrolling: touch`
- Visual fade indicators on edges when scrollable

### 5.5 Back Navigation
- Tap back arrow or swipe from left edge
- If input has unsaved content, show confirmation bottom sheet: "Discard new tag?"
  - "Discard" (destructive, red) / "Keep Editing"

## 6. Animation Spec

| Element | Animation | Timing | Easing |
|---------|-----------|--------|--------|
| Duplicate warning | `opacity 0→1`, `translateY -4px→0` | 200ms | ease-out |
| New tag chip | `scale 0.8→1`, `opacity 0→1`, `translateX 20px→0` | 300ms | spring(1, 80, 10) |
| Submit button disabled | `opacity 1→0.5` | 150ms | ease |
| Skeleton pulse | `opacity 0.4→0.7→0.4` | 1.5s | ease-in-out infinite |
| Page enter | `opacity 0→1`, `translateY 8px→0` | 250ms | ease-out |
| Toast slide-up | `translateY 100%→0`, `opacity 0→1` | 300ms | spring(1, 80, 10) |
| Chip snap scroll | Native CSS `scroll-snap-type: x mandatory` | — | — |

**Framer Motion references:**
- Page: `<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>`
- New tag chip: `<motion.div layout initial={{ scale: 0.8, opacity: 0, x: 20 }} animate={{ scale: 1, opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 100, damping: 15 }}>`
- Stagger existing tags: `variants` with `staggerChildren: 0.05`

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] All interactive elements `min-h-[44px] min-w-[44px]`
- [ ] Submit button above bottom nav, not behind it
- [ ] `env(safe-area-inset-bottom)` applied to bottom nav and submit area
- [ ] Input `autofocus` works on mobile (keyboard opens)
- [ ] Keyboard does not obscure submit button (button is fixed, not in scroll flow)
- [ ] Horizontal chip list scrolls smoothly, no jank
- [ ] Skeleton loading prevents layout shift (fixed chip dimensions)
- [ ] Duplicate warning does not push submit button off-screen
- [ ] No glassmorphism (`backdrop-blur` only on nav/header, not surfaces)
- [ ] No indigo/blue/purple anywhere — only rust orange `#e8693f`
- [ ] No `shadow-lg` — use `shadow-2xl` sparingly or border-based depth
- [ ] Single column layout always — no grid, no side-by-side
- [ ] Touch feedback: `active:scale-[0.98]` on buttons
- [ ] Haptic feedback on successful tag creation
- [ ] No horizontal scroll on the page itself — only the chip list
- [ ] Text is readable at mobile sizes — no text below `text-caption` (12px)
- [ ] Back swipe gesture works (browser native)
- [ ] Page title truncated with ellipsis if too long

## 8. Complete Stitch Prompt

```
Build a mobile-only (max-width: 640px) "Create Tag" page for a library app called Genu Library. Single HTML file with Tailwind CSS CDN, Framer Motion CDN, Google Fonts (Playfair Display, Inter, JetBrains Mono), and Material Symbols Outlined.

DESIGN SYSTEM (Forge & Flux):
- Canvas: #16110f, Surface: #211a17, Primary: #e8693f
- Border: #3a322d, Text primary: #ece0dc, Text secondary: #a89c93
- Typography: Playfair Display (headlines), Inter (body), JetBrains Mono (mono)
- All interactive elements: min-h-[44px] min-w-[44px]
- Rounded: sm 0.25rem, DEFAULT 0.5rem, md 0.75rem, lg 1rem, xl 1.5rem, full 9999px

LAYOUT (single column, stacked):
1. Fixed top header bar (h-14, bg-canvas/85 backdrop-blur-md border-b border-border):
   - Back arrow button (min-h-[44px] min-w-[44px])
   - "Create Tag" title (Playfair Display, headline-3)

2. Main content area (px-4, pt-20, pb-36):
   - Tag name input field (full width, h-12, bg-surface border-border rounded-lg, autofocus)
     - Placeholder: "Type tag name..."
     - Focus: border-primary ring-2 ring-primary/15
     - Character count right-aligned below (JetBrains Mono, caption)
   - Duplicate warning (hidden by default, shows when tag exists):
     - warning icon + "{name} already exists" in text-status-error
     - animate: opacity 0→1, translateY -4px→0, 200ms ease-out
   - Existing Tags section:
     - Label "EXISTING TAGS" (JetBrains Mono overline uppercase tracking-wider text-text-muted) + count badge
     - Horizontal scrollable chip list (overflow-x-auto, flex, gap-2, snap-x snap-mandatory, -webkit-overflow-scrolling: touch)
     - Each chip: shrink-0 px-3 py-1.5 rounded-full bg-surface border-border text-text-secondary
     - Shows tag name + count in JetBrains Mono
     - Skeleton state: 6 pulsing placeholder chips while loading

3. Fixed bottom submit area (above bottom nav):
   - Full width h-12 rounded-lg button
   - bg-primary hover:bg-primary-hover active:scale-[0.98]
   - Text: "Create Tag" in text-on-accent font-semibold
   - Disabled state when duplicate detected: bg-surface-container text-text-muted opacity-50 cursor-not-allowed
   - Loading state: spinner + "Creating..."

4. Fixed bottom navigation (z-50, bg-canvas/95 backdrop-blur-md border-t border-border):
   - pb-[env(safe-area-inset-bottom)]
   - 4 tabs: Library, Browse, Search, Tags (active, text-primary), Profile
   - Each tab: min-h-[44px] with material icon + label
   - Inactive tabs: text-text-muted

INTERACTIONS:
- On input change: debounce 300ms, check if tag name matches any existing tag (case-insensitive)
- If duplicate: show warning, disable submit
- On submit:
  1. Button shows spinner + "Creating..."
  2. Simulate API call (800ms timeout)
  3. On success: navigator.vibrate(50), clear input, animate new tag into chip list (scale 0.8→1, opacity 0→1, x 20→0, spring transition)
  4. Auto-scroll chip list to show new tag
  5. Show success toast: "Tag created" with check_circle icon, auto-dismiss 2s
- On back tap: if input has content, show bottom sheet confirmation "Discard new tag?" with "Discard" (red) and "Keep Editing" options

ANIMATIONS (Framer Motion):
- Page container: initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
- Existing tags stagger: variants with staggerChildren 0.05
- New tag chip: motion.div with layout, initial={{ scale: 0.8, opacity: 0, x: 20 }} animate={{ scale: 1, opacity: 1, x: 0 }}
- Duplicate warning: AnimatePresence for enter/exit

ANTI-SLOP:
- No glassmorphism on surfaces (only header/nav backdrop-blur)
- No indigo/blue/purple colors
- No shadow-lg
- Single column always
- env(safe-area-inset-bottom) for safe areas
- Touch targets minimum 44x44px
- Submit button not obscured by keyboard or bottom nav
```
