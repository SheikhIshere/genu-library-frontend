# 10 — Book Delete (Tablet)

## 1. Page Title & Route

| Property | Value |
|----------|-------|
| Route | `/books/:slug/delete` |
| Title | Delete Book |
| Auth | Required (owner only) |
| Layout | Tablet centered confirmation dialog with top navigation |
| Breakpoint | 641px–1024px |

## 2. Tablet Design Rationale

Book deletion on tablet uses a centered modal-style confirmation dialog instead of a full-page takeover. The wider viewport means the card doesn't need to span edge-to-edge — it sits at `max-w-md` centered on canvas with the page dimmed behind it. The top navigation remains visible for context but the dialog is the focus. The book's cover is displayed larger than mobile for better recognition. The delete button still requires long-press (500ms) to prevent accidental deletion, with a double-tap accessibility alternative. Cancel is a prominent side-by-side button. The dialog has a subtle shadow for elevation. Hover states are enabled on both buttons. The page is minimal — no other content competes with the destructive action confirmation.

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────────────────┐
│  Library Logo    Books   Playlists   Tags   Reports    [👤]     │  ← Top nav (dimmed)
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← Dimmed canvas
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │     bg: rgba(0,0,0,0.4)
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░┌───────────────────────────────────┐░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░│                                   │░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░│   Delete Book                     │░░  ← Playfair Display│
│  ░░░░│                                   │░░     heading-3       │
│  ░░░░│   ┌─────────────┐                 │░░                     │
│  ░░░░│   │             │                 │░░                     │
│  ░░░░│   │ [Cover img] │                 │░░  ← w-32 h-40       │
│  ░░░░│   │  128×160px  │                 │░░     larger preview  │
│  ░░░░│   │             │                 │░░                     │
│  ░░░░│   └─────────────┘                 │░░                     │
│  ░░░░│                                   │░░                     │
│  ░░░░│   The Great Gatsby                │░░  ← Playfair h-4    │
│  ░░░░│   by F. Scott Fitzgerald          │░░  ← Inter body-small│
│  ░░░░│                                   │░░                     │
│  ░░░░│   ⚠ Are you sure you want to     │░░  ← Warning icon     │
│  ░░░░│   delete this book?               │░░     + text          │
│  ░░░░│                                   │░░                     │
│  ░░░░│   This action cannot be undone.   │░░  ← #a89c93          │
│  ░░░░│   All copies and data will be     │░░                     │
│  ░░░░│   permanently removed.            │░░                     │
│  ░░░░│                                   │░░                     │
│  ░░░░│   ┌─────────────┬─────────────┐  │░░                     │
│  ░░░░│   │ Hold to     │   Cancel    │  │░░  ← Side by side     │
│  ░░░░│   │ Delete      │             │  │░░                     │
│  ░░░░│   └─────────────┴─────────────┘  │░░                     │
│  ░░░░│                                   │░░                     │
│  ░░░░└───────────────────────────────────┘░░                     │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└──────────────────────────────────────────────────────────────────┘
       Dialog: max-w-md, centered, elevated (shadow)
```

## 4. Component Breakdown

### Top Navigation (Dimmed Behind Dialog)
- Same as other tablet pages: horizontal `h-14`, `bg: #211a17`, `border-bottom`
- Visually dimmed when dialog is open: `opacity: 0.4`, `pointer-events: none`
- Provides context — user knows where they are

### Dimmed Background Overlay
- `position: fixed`, `inset: 0`, `z-40`
- `bg: rgba(0,0,0,0.4)`
- Click does NOT dismiss (destructive action should require explicit cancel)
- Fade-in on mount: `opacity 0→1`, 200ms

### Confirmation Dialog
- `position: fixed`, centered (`top: 50% left: 50% transform translate(-50%,-50%)`)
- `z-50`, above overlay
- `bg: #211a17`, `border: 1px solid #3a322d`, `border-radius: 16px`
- `max-w-md` (448px), `w-full mx-6` (responsive with margin on smaller tablets)
- `p-8` (32px internal padding)
- Elevation: `shadow: 0 8px 32px rgba(0,0,0,0.4)`
- Focus trap: Tab cycles within dialog only

### Dialog Title
- "Delete Book", Playfair Display heading-3 (1.5rem, weight 600)
- `#ece0dc`, `mb-6`
- Warning icon (20px, `#d4a24e`) inline before text

### Book Preview
- Cover thumbnail: `<img>` with `w-32 h-40` (128×160px), `border-radius: 8px`, `object-fit: cover`
- Centered horizontally within dialog
- If no cover: `bg: #16110f` placeholder with book icon (32px, `#a89c93`)
- Title: Playfair Display heading-4 (1.25rem, weight 600), `#ece0dc`, centered, `mt-4`
- Author: Inter body-small (0.875rem), `#a89c93`, centered, `mt-1`

### Warning Message
- Warning icon + text on same line: `⚠` (or inline SVG warning triangle, 16px, `#d4a24e`) + "Are you sure you want to delete this book?"
- Inter body (1rem), `#ece0dc`, `mt-6`, centered
- "This action cannot be undone. All copies and data will be permanently removed."
- Inter body-small (0.875rem), `#a89c93`, `mt-2`, centered

### Delete Button (Long-Press Required)
- `flex-1`, `bg: #c44d4d`, `color: #ece0dc`, `font-weight: 600`, Inter body
- `border-radius: 8px`, `padding: 14px 20px`, min-h-[44px]
- Text: "Hold to Delete" (default)
- On press-and-hold: text changes to "Release to Confirm"
- Progress bar: thin (3px) at bottom, fills left→right over 500ms, `#ece0dc` at 50% opacity
- On hold complete: haptic `navigator.vibrate([50, 30, 50])`, loading state
- Loading: spinner + "Deleting...", disabled, opacity 0.7
- Double-tap alternative: 2 taps within 300ms triggers same action
- Hover: `bg: #b33d3d`, transition 200ms
- Press (not hold): `scale(0.97)`

### Cancel Button
- `flex-1`, ghost/secondary style
- `bg: transparent`, `border: 1px solid #3a322d`, `color: #ece0dc`, `font-weight: 600`, Inter body
- `border-radius: 8px`, `padding: 14px 20px`, min-h-[44px]
- Text: "Cancel"
- Hover: `border-color: #4d433d`, `color: #ece0dc`, transition 200ms
- Press: `scale(0.97)`
- Click: close dialog, navigate back to book detail

### Button Row
- `flex gap-4 mt-8`
- Delete (left) + Cancel (right), equal width (`flex-1` each)

## 5. Tablet Interactions

### Dialog Open
1. Page mounts with dialog visible immediately (no entrance delay)
2. Overlay fades in (200ms)
3. Dialog scales from 0.95→1 + fades in (300ms spring)
4. Focus trapped inside dialog (Tab cycles through Delete → Cancel)
5. Top nav dimmed (`opacity: 0.4`, `pointer-events: none`)

### Long-Press Delete
1. User presses and holds delete button
2. Button text changes to "Release to Confirm"
3. Progress bar fills left-to-right over 500ms
4. Visual: button scales to 0.97 during hold
5. If released before 500ms: progress resets, text reverts
6. If hold completes: haptic vibration, loading state
7. API call to DELETE `/api/books/:slug`
8. Success: haptic, navigate to books list with toast "Book deleted"
9. Error: toast error, button re-enables

### Double-Tap Delete (Accessibility)
1. Two taps within 300ms triggers same as long-press complete
2. Provides alternative for users who struggle with long-press

### Cancel
1. Click cancel button
2. Dialog closes (scale 1→0.95 + fade out, 200ms)
3. Overlay fades out (200ms)
4. Navigate to book detail page

### Click Outside Dialog
1. Click on overlay does NOT dismiss
2. Destructive actions require explicit cancel
3. Visual feedback: subtle shake on overlay click (optional)

### Keyboard
1. Focus trapped in dialog (Tab cycles: Delete → Cancel → Delete)
2. Escape key: equivalent to Cancel (close dialog, navigate back)
3. Enter on focused button: triggers action (long-press not required for keyboard users — keyboard Enter = direct activation with confirmation)

## 6. Animation Spec (Framer Motion)

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Overlay | Dialog open | fade `opacity 0→1` | 200ms | smooth |
| Overlay | Dialog close | fade `opacity 1→0` | 200ms | smooth |
| Dialog | Open | scale `0.95→1` + fade `opacity 0→1` + `y: 8→0` | 300ms | spring |
| Dialog | Close | scale `1→0.95` + fade `opacity 1→0` + `y: 0→8` | 200ms | smooth |
| Cover thumbnail | Mount | fade-in `opacity 0→1` | 300ms | smooth |
| Delete button | Press (not hold) | `scale(0.97)` | 150ms | spring |
| Delete button | Press release | `scale(1)` | 150ms | spring |
| Progress bar | Long-press start | width `0%→100%` | 500ms | linear |
| Progress bar | Long-press cancel | width reset to `0%` | 150ms | smooth |
| Delete button text | Hold start | crossfade text | 150ms | smooth |
| Cancel button | Press | `scale(0.97)` | 150ms | spring |
| Top nav | Dialog open | `opacity: 1→0.4` | 200ms | smooth |
| Top nav | Dialog close | `opacity: 0.4→1` | 200ms | smooth |

## 7. Anti-Slop Checklist

- [ ] Dialog is centered, `max-w-md`, NOT full-page
- [ ] Top navigation present but dimmed behind dialog
- [ ] Delete button requires long-press (500ms) or double-tap — NOT a simple tap
- [ ] Progress bar visible during hold with visual feedback
- [ ] Text changes during hold ("Hold to Delete" → "Release to Confirm")
- [ ] Haptic vibration on delete activation (pattern: vibrate-pause-vibrate)
- [ ] Loading state on delete prevents double-submission
- [ ] Cancel button is prominent, side-by-side with delete
- [ ] Cover thumbnail is larger than mobile (w-32 h-40 vs w-24 h-32)
- [ ] All interactive elements min-h-[40px] min-w-[40px]
- [ ] Focus trapped inside dialog (Tab cycles)
- [ ] Escape key closes dialog (equivalent to Cancel)
- [ ] Overlay click does NOT dismiss (destructive action requires explicit cancel)
- [ ] Warning icon (`#d4a24e`) used for visual emphasis
- [ ] Delete button uses `#c44d4d` (error color, not accent)
- [ ] Hover states on both buttons (200ms transition)
- [ ] No glassmorphism, no shadow-lg, no indigo/blue/purple
- [ ] Dialog has elevation shadow (`0 8px 32px rgba(0,0,0,0.4)`)
- [ ] All text uses DESIGN.md tokens
- [ ] Cover thumbnail has fallback for missing images
- [ ] Long-press timeout is 500ms
- [ ] Double-tap window is 300ms
- [ ] Swipe back does NOT trigger delete
- [ ] Network error: toast + button re-enables
- [ ] Success: navigate away from delete page

## 8. Complete Stitch Prompt

You are building the **Book Delete** confirmation page for a library management app, tablet breakpoint (641px–1024px). This is a centered modal-style dialog with a dimmed overlay, not a full-page layout.

### Design System Reference
- Canvas background: `#16110f`
- Surface: `#211a17`
- Surface hover: `#2a211c`
- Primary accent (rust orange): `#e8693f`
- Border: `#3a322d`
- Border hover: `#4d433d`
- Text primary: `#ece0dc`
- Text secondary: `#a89c93`
- Text muted/placeholder: `#7a706a`
- Error: `#c44d4d` (delete button)
- Error hover: `#b33d3d`
- Warning: `#d4a24e` (warning icon)
- Success: `#4a7c59`
- Display font: Playfair Display (dialog title, book title)
- Body font: Inter (all other text)
- Border radius: 8px (buttons), 16px (dialog)
- Elevation: dialog shadow `0 8px 32px rgba(0,0,0,0.4)`
- Animations: spring `cubic-bezier(0.34, 1.56, 0.64, 1)`, smooth `cubic-bezier(0.25, 0.1, 0.25, 1)`

### Layout
- Top navigation: present but dimmed (`opacity: 0.4`, `pointer-events: none`) when dialog is open
- Dimmed overlay: `position: fixed`, `inset: 0`, `z-40`, `bg: rgba(0,0,0,0.4)`
- Dialog: `position: fixed`, centered (`top: 50% left: 50% transform translate(-50%,-50%)`), `z-50`
- Dialog: `bg: #211a17`, `border: 1px solid #3a322d`, `border-radius: 16px`, `max-w-md` (448px), `w-full`, `mx-6`
- Dialog: `p-8` (32px), `shadow: 0 8px 32px rgba(0,0,0,0.4)`

### Components to Build

**1. Dimmed Overlay**
- `position: fixed`, `inset: 0`, `z-40`
- `bg: rgba(0,0,0,0.4)`
- Fade-in on mount: `opacity: 0→1`, 200ms smooth
- Click does NOT dismiss (destructive action requires explicit cancel)

**2. Confirmation Dialog**
- Centered, `max-w-md`, `w-full`, `mx-6` (margin for narrow tablets)
- `bg: #211a17`, `border: 1px solid #3a322d`, `border-radius: 16px`
- `p-8`, `shadow: 0 8px 32px rgba(0,0,0,0.4)`
- Entrance: `scale: 0.95→1`, `opacity: 0→1`, `y: 8→0`, 300ms spring
- Exit: `scale: 1→0.95`, `opacity: 1→0`, `y: 0→8`, 200ms smooth
- Focus trap: Tab cycles through Delete → Cancel buttons

**3. Dialog Title**
- Warning icon (inline SVG triangle, 16px, `#d4a24e`) + "Delete Book" text
- Playfair Display heading-3 (1.5rem, weight 600), `#ece0dc`, `mb-6`

**4. Book Preview**
- Cover thumbnail: `<img>` with `w-32 h-40` (128×160px), `border-radius: 8px`, `object-fit: cover`, centered
- If no cover: `bg: #16110f` placeholder with book icon (32px, `#a89c93`)
- Title: Playfair Display heading-4 (1.25rem, weight 600), `#ece0dc`, centered, `mt-4`
- Author: Inter body-small (0.875rem), `#a89c93`, centered, `mt-1`

**5. Warning Message**
- Warning icon + "Are you sure you want to delete this book?" — Inter body, `#ece0dc`, centered, `mt-6`
- "This action cannot be undone. All copies and data will be permanently removed." — Inter body-small, `#a89c93`, centered, `mt-2`

**6. Button Row**
- `flex gap-4 mt-8`

**7. Delete Button (Long-Press Required)**
- `flex-1`, `bg: #c44d4d`, `color: #ece0dc`, `font-weight: 600`, Inter body
- `border-radius: 8px`, `padding: 14px 20px`, min-h-[44px]
- Text: "Hold to Delete" (default)
- On press-and-hold: text changes to "Release to Confirm"
- Progress bar: 3px height at bottom of button, fills left→right over 500ms, `#ece0dc` at 50% opacity
- On hold complete (500ms): haptic `navigator.vibrate([50, 30, 50])`, loading state
- Loading: spinner + "Deleting...", disabled, opacity 0.7
- Double-tap alternative: 2 taps within 300ms triggers same action
- Hover: `bg: #b33d3d`, transition 200ms
- Press: `scale(0.97)` via framer-motion whileTap
- Implementation:
  ```typescript
  const holdTimer = useRef<NodeJS.Timeout>()
  const progressInterval = useRef<NodeJS.Timeout>()
  const tapCount = useRef(0)
  const lastTapTime = useRef(0)

  const startHold = () => {
    holdTimer.current = setTimeout(() => confirmDelete(), 500)
    // Start progress bar animation over 500ms
  }

  const cancelHold = () => {
    clearTimeout(holdTimer.current)
    // Reset progress bar
  }

  const handleTap = () => {
    const now = Date.now()
    if (now - lastTapTime.current < 300) confirmDelete()
    lastTapTime.current = now
  }
  ```

**8. Cancel Button**
- `flex-1`, ghost style
- `bg: transparent`, `border: 1px solid #3a322d`, `color: #ece0dc`, `font-weight: 600`, Inter body
- `border-radius: 8px`, `padding: 14px 20px`, min-h-[44px]
- Text: "Cancel"
- Hover: `border-color: #4d433d`, transition 200ms
- Click: close dialog (scale + fade out), navigate to book detail
- Press: `scale(0.97)`

### Animations (Framer Motion)
- Dialog entrance: `scale: 0.95→1`, `opacity: 0→1`, `y: 8→0`, 300ms spring
- Dialog exit: `scale: 1→0.95`, `opacity: 1→0`, `y: 0→8`, 200ms smooth
- Overlay: `opacity: 0→1→0`, 200ms each
- Cover thumbnail: `opacity: 0→1`, 300ms smooth
- Delete button press: `whileTap={{ scale: 0.97 }}`
- Cancel button press: `whileTap={{ scale: 0.97 }}`
- Progress bar: animate width `0%→100%` over 500ms linear
- Text crossfade during hold: `opacity: 0→1` for new text
- Top nav: `opacity: 1→0.4`, 200ms smooth

### State Management
```typescript
const [book, setBook] = useState<Book | null>(null)
const [isLoading, setIsLoading] = useState(true)
const [isDeleting, setIsDeleting] = useState(false)
const [holdProgress, setHoldProgress] = useState(0) // 0-100
const [dialogOpen, setDialogOpen] = useState(true)
const holdTimer = useRef<NodeJS.Timeout>()
const progressInterval = useRef<NodeJS.Timeout>()
const tapCount = useRef(0)
const lastTapTime = useRef(0)
```

### API Contract
```
DELETE /api/books/:slug
Response: 204 No Content
```

### Error Handling
- Network error: toast "Failed to delete book. Please try again.", re-enable button
- 404: toast "Book not found.", navigate to books list
- 403: toast "You don't have permission to delete this book.", navigate to book detail

### Focus Management
- On dialog mount: focus first focusable element (Delete button)
- Tab cycles: Delete → Cancel → Delete (focus trap)
- Escape key: close dialog, navigate back (equivalent to Cancel)
- On dialog close: return focus to triggering element (book detail page)

### Tablet Constraints
- Centered dialog (`max-w-md`), NOT full-page — this is a modal confirmation
- Top navigation present but dimmed, NOT hidden
- Delete button MUST require long-press or double-tap — never a simple tap
- Progress bar provides visual feedback during hold
- Haptic vibration pattern: vibrate-pause-vibrate (distinct from other actions)
- Loading state prevents double-submission after activation
- Cancel button side-by-side with delete, NOT stacked
- Cover thumbnail larger than mobile (w-32 h-40 vs w-24 h-32)
- All interactive elements min-h-[40px] min-w-[40px]
- Overlay click does NOT dismiss (destructive action requires explicit cancel)
- Focus trapped inside dialog
- No glassmorphism, no shadow-lg, no indigo/blue/purple
- Dialog has elevation shadow for visual separation from canvas
