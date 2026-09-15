# Reports — New Report (Mobile)

## 1. Page Title & Route

| Field | Value |
|-------|-------|
| Page | Report a Book |
| Route | `/books/:id/report` |
| Auth | Required |
| Mobile max-width | 640px |
| Bottom nav | Yes — Library, Browse, Search, Tags, Profile (active) |

## 2. Mobile-First Design Rationale

Reporting is a sensitive action. The user has identified a problem and needs to communicate it clearly. On mobile, the challenge is fitting a multi-step selection flow (book context, reason, description) into a single scrollable screen without overwhelming the user.

**Book preview as anchor**: The book card at the top serves as a constant visual reminder of what's being reported. On mobile, this is compact — small cover thumbnail, title, author — not the full hero card from desktop. It's sticky-adjacent (scrolls with page but stays visually anchored at top).

**Bottom sheet for reason selection**: Instead of radio cards that take up 60% of the screen (desktop pattern), the reason selection uses a bottom sheet triggered by tapping a "Select reason" row. The sheet slides up from the bottom with 4 radio options in a list format. This keeps the main form compact and puts the selection in the natural thumb zone.

**Description is optional, pushed down**: The description textarea is below the reason selector. It's optional and clearly marked. The user can submit with just a reason. This reduces friction for quick reports.

**Trust note positioned before submit**: The "Reports are reviewed by moderators" note sits just above the submit button, reinforcing confidence right before the commitment action.

**Submit in thumb zone**: Full-width button at the bottom, above the nav bar. Natural thumb resting position.

## 3. Mobile Layout Specification

```
┌─────────────────────────────┐
│  Status Bar (safe area)     │
├─────────────────────────────┤
│  Header: "Report Book"      │  h-14, fixed top
│  [← Back]  Report Book      │
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │  Book preview card
│  │ [cover] Title         │  │  compact: h-20 cover
│  │         Author        │  │  bg-surface border-border
│  └───────────────────────┘  │  rounded-xl
│                             │
│  Reason *                   │
│  ┌───────────────────────┐  │  tap to open bottom sheet
│  │ Select reason...    > │  │  bg-surface border-border
│  └───────────────────────┘  │  rounded-lg, chevron_right icon
│                             │
│  Description (optional)     │
│  ┌───────────────────────┐  │  auto-resize textarea
│  │                       │  │  min 4 rows
│  │                       │  │  bg-surface border-border
│  └───────────────────────┘  │
│  0 / 500                    │
│                             │
│  ℹ️ Reports are reviewed    │
│  by moderators              │
│                             │
├─────────────────────────────┤
│  [  Submit Report  ]        │  fixed bottom, full width
│  env(safe-area-inset-bottom)│
├─────────────────────────────┤
│  Bottom Nav (5 tabs)        │  fixed bottom, z-50
└─────────────────────────────┘

BOTTOM SHEET (reason selection):
┌─────────────────────────────┐
│  ━━━ (drag handle)          │  rounded-t-2xl
├─────────────────────────────┤
│  Select Reason              │  Playfair Display headline-3
│                             │
│  ○ Copyright Infringement   │  min-h-[56px], tap to select
│  ○ Adult Content            │  selected: bg-primary/10 border-primary
│  ○ Spam                     │  unselected: bg-surface border-border
│  ○ Other                    │
│                             │
│  [  Confirm  ]              │  full width, bg-primary
├─────────────────────────────┤
│  env(safe-area-inset-bottom)│
└─────────────────────────────┘
```

## 4. Component Breakdown

### 4.1 Header Bar
- Fixed top, `h-14`, `bg-canvas/85 backdrop-blur-md border-b border-border`
- Back arrow: `min-h-[44px] min-w-[44px]`
- Title: "Report Book" in `font-headline-3 text-headline-3 text-text-primary`

### 4.2 Book Preview Card
- `bg-surface border border-border rounded-xl p-4`
- Flex row: cover image (w-16 h-22 rounded-lg object-cover) + text block
- Title: `font-body-default text-body-default font-semibold text-text-primary truncate`
- Author: `font-body-small text-body-small text-text-secondary`
- Subtle border accent: `border-l-2 border-primary/30` on left edge

### 4.3 Reason Selector Trigger
- Full width, `min-h-[56px]`, `bg-surface border border-border rounded-lg px-4`
- Flex row: label + chevron right icon
- Label (no selection): `font-body-default text-body-default text-text-muted` — "Select reason..."
- Label (selected): `font-body-default text-body-default text-text-primary` — shows selected reason
- Chevron right: `text-text-muted` icon
- Tap opens bottom sheet

### 4.4 Bottom Sheet (Reason Selection)
- Overlay: `fixed inset-0 bg-black/50 z-50`
- Sheet: `fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl z-50`
- Drag handle: `w-10 h-1 rounded-full bg-text-muted/40 mx-auto mt-3`
- Title: "Select Reason" in `font-headline-3 text-headline-3 text-text-primary px-6 pt-4 pb-3`
- Options list: `px-6 pb-6`
- Each option: `flex items-center gap-3 min-h-[56px] px-4 rounded-lg`
- Radio circle: `w-5 h-5 rounded-full border-2`
- Unselected: `border-border bg-canvas`
- Selected: `border-primary bg-primary` with inner dot `w-2.5 h-2.5 rounded-full bg-canvas`
- Option label: `font-body-default text-body-default text-text-primary`
- Confirm button: full width, `h-12`, `bg-primary rounded-lg font-semibold text-on-primary`

### 4.5 Description Textarea
- Label: "Description" + `(Optional)` badge
- `bg-surface border border-border rounded-lg p-4`
- `min-h-[100px]` (approx 4 rows), auto-resize on input
- `font-body-small text-body-small text-text-primary`
- `placeholder:text-text-muted`
- Character count: `font-label-mono text-caption text-text-muted`
- Focus state: `border-primary ring-2 ring-primary/15`

### 4.6 Trust Note
- `flex items-start gap-3 p-4 rounded-xl bg-surface-container-high/40 border border-primary/20`
- Info icon: `text-primary` in a small rounded container
- Text: `font-body-small text-body-small text-text-secondary` — "Reports are reviewed by moderators to maintain archive quality."

### 4.7 Submit Button
- Fixed bottom, above nav
- Full width, `h-12`, `rounded-lg`
- `bg-primary hover:bg-primary-hover active:scale-[0.98]`
- `text-text-on-accent font-body-default text-body-default font-semibold`
- Disabled when no reason selected: `opacity-50 cursor-not-allowed`
- Loading: spinner + "Submitting..."

### 4.8 Success State
- Full screen overlay: `fixed inset-0 bg-canvas z-50 flex items-center justify-center`
- Checkmark animation (animated SVG or material icon scale bounce)
- "Thank you" message: `font-headline-3 text-headline-3 text-text-primary`
- Subtext: `font-body-small text-text-secondary` — "Your report has been submitted for review."
- Auto-redirect after 2 seconds (or back to book detail)

## 5. Mobile Interactions

### 5.1 Bottom Sheet Open/Close
- Tap reason trigger → sheet slides up from bottom (300ms spring)
- Tap overlay → sheet slides down
- Swipe down on sheet → sheet slides down (gesture)
- Drag handle visual affordance

### 5.2 Reason Selection
- Tap option → radio fills with primary color
- Previous selection un-fills
- Confirm button enables
- Tap confirm → sheet slides down, trigger row updates to show selected reason

### 5.3 Description Input
- Auto-resize: textarea grows as user types (min 4 rows, max 8 rows)
- Character count updates in real-time
- At 450/500 chars: count turns to `text-status-warning`
- At 500/500: count turns to `text-status-error`, input stops accepting

### 5.4 Report Submission
- Validate: reason must be selected
- Button shows spinner
- `navigator.vibrate(50)` on success (haptic)
- Success overlay fades in
- After 2s: navigate back to book detail or previous page

### 5.5 Back Navigation
- If reason selected or description has content:
  - Show confirmation bottom sheet: "Discard report?"
  - "Discard" (red) / "Keep Editing"
- If form empty: direct back navigation

## 6. Animation Spec

| Element | Animation | Timing | Easing |
|---------|-----------|--------|--------|
| Bottom sheet enter | `translateY 100% → 0` | 300ms | spring(1, 80, 12) |
| Bottom sheet exit | `translateY 0 → 100%` | 250ms | ease-in |
| Overlay fade | `opacity 0 → 1` | 200ms | ease |
| Radio fill | `scale 0 → 1` (inner dot) | 150ms | spring(1, 80, 10) |
| Reason trigger update | `opacity 0.5 → 1` | 150ms | ease |
| Success checkmark | SVG stroke draw or scale 0→1 bounce | 500ms | spring(1, 60, 10) |
| Success text fade | `opacity 0 → 1`, `translateY 8px → 0` | 300ms, delay 200ms | ease-out |
| Page enter | `opacity 0 → 1`, `translateY 8px → 0` | 250ms | ease-out |
| Toast (if used) | `translateY 100% → 0` | 300ms | spring(1, 80, 10) |

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] All interactive elements `min-h-[44px] min-w-[44px]`
- [ ] Bottom sheet respects safe areas (`env(safe-area-inset-bottom)`)
- [ ] Submit button above bottom nav, not hidden behind it
- [ ] Bottom sheet swipe-to-dismiss works
- [ ] Book cover image does not stretch or distort (`object-cover`)
- [ ] Textarea auto-resize works on mobile keyboards
- [ ] Character count visible during typing (not hidden by keyboard)
- [ ] No glassmorphism on surfaces
- [ ] No indigo/blue/purple colors — only rust orange `#e8693f`
- [ ] No `shadow-lg`
- [ ] Single column always
- [ ] Success state fully covers screen (no content bleed-through)
- [ ] Haptic on submit success
- [ ] Back swipe gesture works
- [ ] Trust note is readable but not dominant
- [ ] Bottom sheet overlay does not scroll the page behind it
- [ ] Reason options are tappable targets (min 56px height)

## 8. Complete Stitch Prompt

```
Build a mobile-only (max-width: 640px) "Report a Book" page for a library app called Genu Library. Single HTML file with Tailwind CSS CDN, Framer Motion CDN, Google Fonts (Playfair Display, Inter, JetBrains Mono), and Material Symbols Outlined.

DESIGN SYSTEM (Forge & Flux):
- Canvas: #16110f, Surface: #211a17, Primary: #e8693f
- Border: #3a322d, Text primary: #ece0dc, Text secondary: #a89c93
- Status success: #4ade80, Status error: #ef4444
- Typography: Playfair Display (headlines), Inter (body), JetBrains Mono (mono)
- All interactive elements: min-h-[44px] min-w-[44px]
- Rounded: sm 0.25rem, DEFAULT 0.5rem, md 0.75rem, lg 1rem, xl 1.5rem, full 9999px

LAYOUT (single column, stacked):
1. Fixed top header (h-14, bg-canvas/85 backdrop-blur-md border-b border-border):
   - Back arrow button (min-h-[44px] min-w-[44px])
   - "Report Book" title (Playfair Display, headline-3)

2. Main content (px-4, pt-20, pb-36, space-y-6):
   a. Book preview card (bg-surface border-border rounded-xl p-4, flex items-center gap-4):
      - Cover image (w-16 h-22 rounded-lg object-cover border border-border)
      - Title (font-body-default font-semibold text-text-primary truncate)
      - Author (font-body-small text-text-secondary)
   
   b. Reason selector trigger (full width, min-h-[56px], bg-surface border-border rounded-lg px-4):
      - Flex row: label text + chevron_right icon
      - No selection: "Select reason..." in text-text-muted
      - Selected: shows selected reason in text-text-primary
      - Tap opens bottom sheet
   
   c. Description textarea (bg-surface border-border rounded-lg p-4):
      - Label "Description" + "(Optional)" badge in text-text-muted
      - min-h-[100px] (4 rows), auto-resize on input (max 8 rows)
      - font-body-small text-text-primary, placeholder:text-text-muted
      - Character count right-aligned below (JetBrains Mono caption)
      - Focus: border-primary ring-2 ring-primary/15
   
   d. Trust note (p-4 rounded-xl bg-surface-container-high/40 border border-primary/20):
      - info icon in rounded container
      - "Reports are reviewed by moderators to maintain archive quality."

3. Fixed bottom submit area (above nav, px-4, pb-[calc(56px+env(safe-area-inset-bottom))]):
   - Full width h-12 rounded-lg bg-primary button
   - "Submit Report" in text-on-accent font-semibold
   - Disabled (no reason selected): opacity-50 cursor-not-allowed
   - Loading: spinner + "Submitting..."

4. Fixed bottom nav (z-50, bg-canvas/95 backdrop-blur-md border-t border-border, pb-[env(safe-area-inset-bottom)]):
   - 5 tabs: Library, Browse, Search, Tags, Profile (active)
   - Each: min-h-[44px], icon + label

BOTTOM SHEET (reason selection):
- Overlay: fixed inset-0 bg-black/50 z-50
- Sheet: fixed bottom-0 left-0 right-0 bg-surface rounded-t-2xl z-50
- Drag handle: w-10 h-1 rounded-full bg-text-muted/40 mx-auto mt-3
- Title: "Select Reason" (Playfair Display headline-3, px-6 pt-4 pb-3)
- 4 options (px-6 pb-6):
  - Copyright Infringement (icon: balance)
  - Adult Content (icon: warning)
  - Spam (icon: error_outline)
  - Other (icon: flag)
  - Each: min-h-[56px] px-4 rounded-lg, flex items-center gap-3
  - Radio: w-5 h-5 rounded-full, unselected: border-border bg-canvas, selected: border-primary bg-primary with inner dot
  - Label: font-body-default text-text-primary
- Confirm button: full width h-12 rounded-lg bg-primary

INTERACTIONS:
- Bottom sheet: tap trigger → slide up (spring animation), tap overlay or swipe down → slide down
- Reason selection: tap option → radio fills, confirm enables, tap confirm → sheet closes, trigger updates
- Description: auto-resize textarea, character count updates, warn at 450/500, block at 500
- Submit validation: require reason selected
- On submit: button shows spinner, simulate API (1s timeout)
- On success: navigator.vibrate(50), show full-screen success overlay with animated checkmark + "Thank you" + "Your report has been submitted for review." auto-dismiss after 2s, navigate back
- Back: if form has content, show confirmation "Discard report?" bottom sheet with "Discard" (red) / "Keep Editing"

ANIMATIONS (Framer Motion):
- Page: initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
- Bottom sheet: AnimatePresence with motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
- Radio dot: scale 0→1 spring on select
- Success overlay: initial={{ opacity: 0 }} animate={{ opacity: 1 }}
- Success checkmark: motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
- Success text: initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}

ANTI-SLOP:
- No glassmorphism on surfaces (only header/nav backdrop-blur)
- No indigo/blue/purple colors
- No shadow-lg
- Single column always
- env(safe-area-inset-bottom) for safe areas
- Touch targets minimum 44x44px
- Bottom sheet swipe-to-dismiss gesture
- Submit button not obscured by keyboard or nav
```
