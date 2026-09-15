# 10 — Book Delete (Mobile)

## 1. Page Title & Route

| Property | Value |
|----------|-------|
| Route | `/books/:slug/delete` |
| Title | Delete Book |
| Auth | Required (owner only) |
| Layout | Mobile single-column, centered confirmation card |
| Max-width | 640px |

## 2. Mobile-First Design Rationale

Book deletion on mobile must prevent accidental actions. The confirmation is a centered card — not a full-screen takeover — with the book's cover and title for context. The delete button requires a long-press (500ms hold) to activate, preventing accidental taps. A double-tap alternative exists for users who find long-press difficult. The cancel button is prominent and easy to reach. The page is minimal — no bottom nav clutter, just the confirmation. The background is dimmed to focus attention on the destructive action. Loading state on the delete button prevents double-tap after activation.

## 3. Mobile Layout Specification

```
┌─────────────────────────────┐
│  [safe-area top padding]    │
├─────────────────────────────┤
│  ← Back                    │  ← Ghost back button
│                             │
│                             │
│    ┌───────────────────┐    │
│    │                   │    │
│    │   ┌───────────┐   │    │
│    │   │  [Cover]   │   │    │  ← Small cover thumbnail (96×128)
│    │   │            │   │    │
│    │   └───────────┘   │    │
│    │                   │    │
│    │   Book Title      │    │  ← Playfair Display heading-3
│    │   by Author Name  │    │  ← Inter body-small
│    │                   │    │
│    ├───────────────────┤    │
│    │                   │    │
│    │  Are you sure     │    │  ← Inter body, centered
│    │  you want to      │    │
│    │  delete this      │    │
│    │  book?            │    │
│    │                   │    │
│    │  This action      │    │  ← Warning text, #a89c93
│    │  cannot be undone.│    │
│    │                   │    │
│    ├───────────────────┤    │
│    │                   │    │
│    │  ┌─────────────┐  │    │
│    │  │ Hold to      │  │    │  ← Red button, long-press required
│    │  │ Delete       │  │    │
│    │  └─────────────┘  │    │
│    │                   │    │
│    │  ┌─────────────┐  │    │
│    │  │   Cancel     │  │    │  ← Ghost/secondary button
│    │  └─────────────┘  │    │
│    │                   │    │
│    └───────────────────┘    │
│                             │
│                             │
└─────────────────────────────┘
```

## 4. Component Breakdown

### Back Button
- Top-left, ghost style, `←` icon + "Back"
- min-h-[44px], min-w-[44px]
- Color: `#a89c93`, tap: `#ece0dc`
- Navigates to book detail page

### Confirmation Card
- Container: `bg: #211a17`, `border: 1px solid #3a322d`, `border-radius: 16px`
- `max-w-sm` (384px), `mx-auto`, centered vertically and horizontally
- `p-6` (24px) internal padding
- `mt-16` top margin (below back button)

### Book Preview
- Cover thumbnail: `w-24 h-32` (96×128px), `border-radius: 8px`, `object-fit: cover`
- Centered horizontally within card
- Title: Playfair Display heading-3 (1.25rem/20px, weight 600), `#ece0dc`, `mt-4`
- Author: Inter body-small (0.875rem), `#a89c93`, `mt-1`
- If no cover: placeholder `bg: #16110f` with book icon

### Warning Message
- "Are you sure you want to delete this book?"
- Inter body (1rem), `#ece0dc`, centered, `mt-6`
- "This action cannot be undone."
- Inter body-small (0.875rem), `#a89c93`, centered, `mt-2`

### Delete Button (Long-Press)
- Full-width within card, `bg: #c44d4d`, `color: #ece0dc`
- `border-radius: 8px`, `padding: 14px 20px`, min-h-[48px]
- Inter body, `font-weight: 600`
- Text: "Hold to Delete" (default), changes to "Release to Confirm" (while holding)
- Progress indicator: thin bar at bottom of button that fills during hold (0→100% over 500ms)
- Bar color: `#ece0dc` at 50% opacity
- On long-press complete: haptic (`navigator.vibrate([50, 30, 50])`), button enters loading state
- Loading: spinner + "Deleting...", disabled, opacity 0.7
- Press (not hold): `scale(0.97)` visual feedback

### Cancel Button
- Full-width within card, ghost/secondary style
- `bg: transparent`, `border: 1px solid #3a322d`, `color: #ece0dc`
- `border-radius: 8px`, `padding: 14px 20px`, min-h-[48px]
- Inter body, `font-weight: 600`
- Text: "Cancel"
- Tap: navigate back to book detail
- Press: `scale(0.97)`

## 5. Mobile Interactions

### Long-Press Delete
1. User presses and holds delete button
2. Button text changes to "Release to Confirm"
3. Progress bar fills left-to-right over 500ms
4. Visual feedback: button scales to 0.97 during hold
5. If user releases before 500ms: progress resets, text reverts
6. If hold completes: haptic vibration pattern, loading state begins
7. API call to DELETE `/api/books/:slug`
8. On success: haptic, navigate to books list with toast "Book deleted"
9. On error: toast error, button re-enables

### Double-Tap Delete (Accessibility Alternative)
1. User taps delete button twice within 300ms
2. Same flow as long-press completion
3. Provides alternative for users who struggle with long-press

### Cancel
1. User taps cancel button
2. Navigate back to book detail page
3. No confirmation needed (cancel is safe action)

### Swipe Back
1. Swipe from left edge triggers browser back
2. Equivalent to cancel — no confirmation needed
3. Returns to book detail page

### Back Button
1. Tap back button (top-left)
2. Navigate to book detail page
3. No confirmation (leaving delete page is safe)

## 6. Animation Spec (Framer Motion)

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Card | Page mount | scale `0.95→1` + fade `opacity 0→1` | 400ms | spring |
| Card | Page mount | slide up `translateY(20px→0)` | 400ms | spring |
| Cover thumbnail | Page mount | fade-in `opacity 0→1` | 300ms | smooth |
| Delete button | Press (not hold) | `scale(0.97)` | 150ms | spring |
| Delete button | Press release | `scale(1)` | 150ms | spring |
| Progress bar | Long-press start | width `0%→100%` | 500ms | linear |
| Progress bar | Long-press cancel | width reset to `0%` | 150ms | smooth |
| Delete button text | Hold start | crossfade text | 150ms | smooth |
| Cancel button | Press | `scale(0.97)` | 150ms | spring |
| Background dim | Page mount | fade `opacity 0→1` | 300ms | smooth |

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] Delete button requires long-press (500ms) or double-tap — NOT a simple tap
- [ ] Progress bar visible during hold so user sees feedback
- [ ] Text changes during hold ("Hold to Delete" → "Release to Confirm")
- [ ] Haptic vibration on delete activation (distinct pattern)
- [ ] Loading state on delete prevents double-submission
- [ ] Cancel button is prominent and easy to reach (full-width)
- [ ] Card is centered, not edge-to-edge
- [ ] All interactive elements min-h-[44px] min-w-[44px]
- [ ] No bottom nav on this page (focused, minimal)
- [ ] Back button available as alternative to cancel
- [ ] No glassmorphism, no shadow-lg, no indigo/blue/purple
- [ ] Warning text uses `#a89c93` (secondary, not alarming)
- [ ] Delete button uses `#c44d4d` (error color, not accent)
- [ ] Cover thumbnail has fallback for missing images
- [ ] Long-press timeout is 500ms (not too short, not too long)
- [ ] Double-tap window is 300ms (reasonable threshold)
- [ ] Swipe back does NOT trigger delete (only navigates away)
- [ ] No horizontal scroll at any width ≤640px
- [ ] Network error on delete: toast + button re-enables
- [ ] Success: navigate away from delete page (no stale state)

## 8. Complete Stitch Prompt

You are building the **Book Delete** confirmation page for a library management app, mobile-only (max-width: 640px). This is a focused, minimal page with a centered confirmation card and a long-press delete button.

### Design System Reference
- Canvas background: `#16110f`
- Surface: `#211a17`
- Primary accent (rust orange): `#e8693f`
- Border: `#3a322d`
- Text primary: `#ece0dc`
- Text secondary: `#a89c93`
- Error: `#c44d4d` (delete button)
- Error hover: `#b33d3d`
- Display font: Playfair Display (book title only)
- Body font: Inter (all other text)
- Border radius: 8px buttons, 16px card, 8px cover thumbnail

### Layout
- Mobile single-column, centered
- Back button top-left (← icon + "Back"), ghost style
- Confirmation card centered vertically and horizontally (`mt-16`, `mx-auto`, `max-w-sm`)
- No bottom nav on this page (focused destructive action)
- Card: `bg: #211a17`, `border: 1px solid #3a322d`, `border-radius: 16px`, `p-6`

### Components to Build

**1. Back Button**
- Ghost style, `←` icon (20px) + "Back" text
- min-h-[44px], min-w-[44px]
- Color: `#a89c93`, hover/tap: `#ece0dc`
- Navigate to `/books/:slug`

**2. Confirmation Card**
- Centered, `max-w-sm` (384px), `mx-auto`, `mt-16`
- `bg: #211a17`, `border: 1px solid #3a322d`, `border-radius: 16px`, `p-6`
- Contains: book preview, warning message, delete button, cancel button

**3. Book Preview**
- Cover thumbnail: `<img>` with `w-24 h-32` (96×128px), `border-radius: 8px`, `object-fit: cover`, `mx-auto`
- If no cover: `bg: #16110f` placeholder with book icon (24px, `#a89c93`)
- Title: Playfair Display heading-3, `#ece0dc`, centered, `mt-4`
- Author: Inter body-small, `#a89c93`, centered, `mt-1`

**4. Warning Message**
- "Are you sure you want to delete this book?" — Inter body, `#ece0dc`, centered, `mt-6`
- "This action cannot be undone." — Inter body-small, `#a89c93`, centered, `mt-2`

**5. Delete Button (Long-Press Required)**
- Full-width within card, `bg: #c44d4d`, `color: #ece0dc`, `font-weight: 600`, Inter body
- `border-radius: 8px`, `padding: 14px 20px`, min-h-[48px]
- Text: "Hold to Delete" (default)
- On press-and-hold: text changes to "Release to Confirm", progress bar fills
- Progress bar: thin (3px height) bar at bottom of button, fills left→right over 500ms, color `#ece0dc` at 50% opacity
- On hold complete (500ms): haptic `navigator.vibrate([50, 30, 50])`, loading state
- Loading: spinner + "Deleting...", disabled, opacity 0.7
- Double-tap alternative: 2 taps within 300ms triggers same as long-press complete
- Press (short): `scale(0.97)` visual feedback via framer-motion whileTap
- Implementation approach:
  ```typescript
  const holdTimer = useRef<NodeJS.Timeout>()
  const progressTimer = useRef<NodeJS.Timeout>()
  const tapCount = useRef(0)
  const lastTapTime = useRef(0)

  const startHold = () => {
    holdTimer.current = setTimeout(() => {
      confirmDelete()
    }, 500)
    // Start progress bar animation
  }

  const cancelHold = () => {
    clearTimeout(holdTimer.current)
    // Reset progress bar
  }

  const handleTap = () => {
    const now = Date.now()
    if (now - lastTapTime.current < 300) {
      confirmDelete() // Double-tap
    }
    lastTapTime.current = now
  }
  ```

**6. Cancel Button**
- Full-width within card, ghost/secondary style
- `bg: transparent`, `border: 1px solid #3a322d`, `color: #ece0dc`, `font-weight: 600`, Inter body
- `border-radius: 8px`, `padding: 14px 20px`, min-h-[48px]
- Text: "Cancel"
- Tap: navigate back to `/books/:slug`
- Press: `scale(0.97)`

### Animations (Framer Motion)
- Card mount: `scale: 0.95→1`, `opacity: 0→1`, `y: 20→0`, 400ms spring
- Cover thumbnail: `opacity: 0→1`, 300ms smooth
- Delete button press: `whileTap={{ scale: 0.97 }}`
- Cancel button press: `whileTap={{ scale: 0.97 }}`
- Progress bar: animate width `0%→100%` over 500ms linear
- Text crossfade during hold: `opacity: 0→1` for new text

### State Management
```typescript
const [book, setBook] = useState<Book | null>(null)
const [isLoading, setIsLoading] = useState(true)
const [isDeleting, setIsDeleting] = useState(false)
const [holdProgress, setHoldProgress] = useState(0) // 0-100
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

### Mobile Constraints
- No bottom nav — focused page, minimal distractions
- Delete button MUST require long-press or double-tap — never a simple tap
- Progress bar provides visual feedback during hold
- Haptic vibration is distinct (pattern: vibrate-pause-vibrate) to confirm activation
- Loading state prevents double-submission after activation
- Cancel button is full-width and easy to reach
- Card centered, not edge-to-edge, for visual focus
- All interactive elements min-h-[44px] min-w-[44px]
- No glassmorphism, no shadow-lg, no indigo/blue/purple
- Swipe back navigates away (safe action, no confirmation needed)
