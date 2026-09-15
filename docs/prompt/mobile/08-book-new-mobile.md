# 08 — Book New (Mobile)

## 1. Page Title & Route

| Property | Value |
|----------|-------|
| Route | `/books/new` |
| Title | New Book |
| Auth | Required |
| Layout | Mobile single-column with bottom nav |
| Max-width | 640px |

## 2. Mobile-First Design Rationale

Book creation on mobile must be fast and thumb-friendly. The form is long — cover, title, author, description, tags, visibility, price, PDF — so the primary action (Submit) is pinned at the bottom in the thumb zone. Cover upload uses a large tap target since mobile users are comfortable tapping to pick images. The tag selector uses a bottom sheet instead of a dropdown, which is hostile on small screens. The visibility picker is a segmented control (3 equal buttons) — no picker wheel, no dropdown. PDF upload is a separate large tap area below the price. All inputs are stacked vertically in a single column. The bottom nav is present for cross-section navigation. Keyboard avoidance shifts the form up when inputs are focused.

## 3. Mobile Layout Specification

```
┌─────────────────────────────┐
│  [safe-area top padding]    │
├─────────────────────────────┤
│  ← New Book                 │  ← Back link (top-left)
│                             │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │   Cover Image Upload  │  │  ← h-48, dashed border, center icon+text
│  │   Tap to add cover    │  │
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  Title                      │
│  ┌───────────────────────┐  │
│  │ Book title...         │  │  ← text input
│  └───────────────────────┘  │
│                             │
│  Author                     │
│  ┌───────────────────────┐  │
│  │ Author name...        │  │  ← text input
│  └───────────────────────┘  │
│                             │
│  Description                │
│  ┌───────────────────────┐  │
│  │                       │  │  ← textarea, auto-resize, 4 rows min
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  Tags                       │
│  ┌───────────────────────┐  │
│  │ Select tags...    [+] │  │  ← opens bottom sheet
│  └───────────────────────┘  │
│                             │
│  Visibility                 │
│  ┌─────┬─────┬─────┐       │
│  │ Pub │Priv │Unl. │       │  ← segmented control, 3 equal
│  └─────┴─────┴─────┘       │
│                             │
│  Price (coins)              │
│  ┌───────────────────────┐  │
│  │ 🪙 0                  │  │  ← number input, coin icon prefix
│  └───────────────────────┘  │
│                             │
│  PDF File                   │
│  ┌───────────────────────┐  │
│  │                       │  │  ← h-32, dashed border
│  │   Tap to upload PDF   │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │     Publish Book      │  │  ← full-width, rust orange, thumb zone
│  └───────────────────────┘  │
│                             │
│  [pb-safe for bottom nav]   │
├─────────────────────────────┤
│  📚  🏠  🔍  👤            │  ← Bottom nav, fixed, z-50
│  safe-area-inset-bottom     │
└─────────────────────────────┘
```

## 4. Component Breakdown

### Back Link
- Top-left, ghost button style
- Icon: `←` arrow (20px), text: "New Book" in Inter body
- Color: `#a89c93`, hover/tap: `#ece0dc`
- min-h-[44px], min-w-[44px]

### Cover Image Upload
- Container: `bg: #211a17`, `border: 2px dashed #3a322d`, `border-radius: 12px`, `height: 12rem` (h-48)
- Center: Camera icon (24px, `#a89c93`) + "Tap to add cover" text (Inter body-small, `#a89c93`)
- Tap opens native file input: `accept="image/*"`, `capture="environment"` (camera option)
- On file select: show image preview with fade-in, replace dashed area
- Preview: `object-fit: cover`, `border-radius: 12px`, full container
- "Change" overlay button bottom-right on preview (ghost style, 44×44px)
- Framer Motion: fade-in `opacity: 0→1`, `duration: 300ms`

### Title Input
- Label: "Title", Inter body-small, `#a89c93`, `mb-1`
- Input: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 10px 14px`
- Placeholder: "Book title...", `#7a706a`
- Focus: `border-color: #e8693f`, `box-shadow: 0 0 0 3px rgba(232,105,63,0.15)`
- Text color: `#ece0dc`, Inter body
- min-h-[44px], `w-full`

### Author Input
- Same styling as Title input
- Placeholder: "Author name..."

### Description Textarea
- Label: "Description", Inter body-small, `#a89c93`
- Same input styling
- `rows="4"`, auto-resize via `onInput` handler (min 4 rows, max 8 rows)
- Placeholder: "Tell readers about this book..."
- `resize: none` (handled by auto-resize logic)

### Tag Selector Trigger
- Label: "Tags", Inter body-small, `#a89c93`
- Trigger: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 10px 14px`
- Left: "Select tags..." placeholder (`#7a706a`) or selected tag count
- Right: `+` icon button, 44×44px min
- Opens Tag Bottom Sheet on tap

### Tag Bottom Sheet
- Overlay: `bg: rgba(0,0,0,0.5)`, dismiss on tap
- Sheet: slides up from bottom, `bg: #211a17`, `border-radius: 16px 16px 0 0`
- Handle bar: `w-10 h-1 bg: #3a322d`, centered, `mt-2 mb-3`
- Title: "Select Tags", Playfair Display heading-3, `#ece0dc`, `px-4`
- Search input at top of sheet: same input styling, placeholder "Search tags..."
- Tag grid: flex-wrap, `gap-2`, `px-4 py-3`
- Each tag: pill chip, `bg: #211a17`, `border: 1px solid #3a322d`, `border-radius: 9999px`, `padding: 4px 12px`
- Selected: `border-color: #e8693f`, `color: #e8693f`, `bg: rgba(232,105,63,0.08)`
- Unselected: `color: #a89c93`
- min-h-[44px] per tag chip (touch target)
- "Done" button at bottom of sheet: full-width, primary style, `mb-safe`
- Framer Motion: sheet slides up `y: 100%→0`, overlay fades in, `duration: 300ms`

### Visibility Segmented Control
- Label: "Visibility", Inter body-small, `#a89c93`
- Container: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 4px`, `display: flex`
- 3 segments: "Public", "Private", "Unlisted"
- Each segment: `flex: 1`, `text-align: center`, `padding: 10px 0`, min-h-[44px], `border-radius: 6px`
- Active: `bg: #e8693f`, `color: #16110f`, `font-weight: 600`
- Inactive: `color: #a89c93`, `bg: transparent`
- Framer Motion: active indicator slides with `layout` prop, spring transition

### Price Input
- Label: "Price (coins)", Inter body-small, `#a89c93`
- Input wrapper: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 10px 14px`, `display: flex`, `align-items: center`
- Coin icon prefix: inline SVG, 20×20px, `fill: #e8693f`, `mr-2`
- Input: `type="number"`, `min="0"`, no spinner (`appearance: textfield`), `bg: transparent`, `border: none`, `color: #ece0dc`, `w-full`
- Placeholder: "0", `#7a706a`

### PDF Upload
- Label: "PDF File", Inter body-small, `#a89c93`
- Container: `bg: #211a17`, `border: 2px dashed #3a322d`, `border-radius: 12px`, `height: 8rem` (h-32)
- Center: Document icon (24px, `#a89c93`) + "Tap to upload PDF" text
- Native file input: `accept=".pdf"`
- After selection: show file name + file size + remove (×) button
- File name: Inter body, `#ece0dc`, truncated with ellipsis
- Remove button: ghost style, 44×44px, `×` icon

### Submit Button
- Full-width, `bg: #e8693f`, `color: #16110f`, `font-weight: 600`, Inter body
- `border-radius: 8px`, `padding: 14px 20px`, min-h-[48px]
- Press: `scale(0.97)`, spring physics
- Loading state: spinner icon (rotating) + "Publishing..." text, button disabled, opacity 0.7
- Disabled when: title empty OR cover not selected OR PDF not selected
- Haptic: `navigator.vibrate(10)` on tap

## 5. Mobile Interactions

### Cover Image Tap
1. User taps cover upload area
2. Native file picker opens (image gallery or camera)
3. On selection: image loads with fade-in (300ms)
4. Cover area transforms from dashed-border to image preview
5. "Change" overlay appears bottom-right
6. Haptic feedback on successful upload

### Tag Bottom Sheet Open/Close
1. User taps tag selector trigger
2. Sheet slides up from bottom (300ms spring)
3. Overlay fades in simultaneously
4. User can search tags via input at top
5. Tap tag chip to toggle (haptic on toggle)
6. Tap "Done" or swipe down to dismiss
7. Selected count updates on trigger

### Visibility Toggle
1. Tap any segment
2. Active indicator slides to tapped segment (spring, 200ms)
3. Previous selection deactivates
4. Only one active at a time

### PDF Upload
1. User taps PDF upload area
2. Native file picker opens (filtered to .pdf)
3. On selection: file name + size displayed
4. Remove (×) button clears selection
5. Haptic feedback on upload success

### Keyboard Avoidance
1. On input focus, viewport shifts up to keep input visible
2. Bottom nav remains fixed at bottom
3. On blur, viewport returns to original position
4. Submit button may be obscured by keyboard — user scrolls to reach it

### Form Submit
1. Validate all required fields client-side
2. Show inline errors below invalid fields (red text, `#c44d4d`)
3. On valid: button enters loading state
4. POST to `/api/books` with FormData (cover image + PDF + metadata)
5. On success: haptic, navigate to book detail page
6. On error: toast notification, button re-enables

### Swipe Back
1. Swipe from left edge triggers browser back
2. If form has unsaved changes: show confirmation dialog
3. Dialog: "Discard new book?" with "Cancel" and "Discard" buttons

## 6. Animation Spec (Framer Motion)

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Cover preview | File selected | fade-in `opacity 0→1` | 300ms | smooth |
| Cover preview | Image loaded | scale `0.95→1` | 300ms | spring |
| Tag bottom sheet | Open | slide up `translateY(100%→0)` | 300ms | spring |
| Tag bottom sheet | Close | slide down `translateY(0→100%)` | 250ms | smooth |
| Tag overlay | Open | fade `opacity 0→0.5` | 300ms | smooth |
| Tag overlay | Close | fade `opacity 0.5→0` | 250ms | smooth |
| Tag chip | Tap toggle | scale `1→1.05→1` | 200ms | spring |
| Visibility indicator | Segment change | `layout` slide | 200ms | spring |
| Submit button | Press | `scale(0.97)` | 150ms | spring |
| Submit button | Release | `scale(1)` | 150ms | spring |
| Error text | Appear | fade-in `opacity 0→1` + slide `translateY(4px→0)` | 200ms | smooth |
| Page load | Mount | stagger children `translateY(20px→0)` + `opacity 0→1` | 300ms each, 60ms stagger | spring |
| PDF file info | Appear | fade-in `opacity 0→1` | 200ms | smooth |

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] All interactive elements min-h-[44px] min-w-[44px]
- [ ] Single column layout, no multi-column at any breakpoint
- [ ] Bottom nav fixed at bottom with `env(safe-area-inset-bottom)` padding
- [ ] Back button touch target is 44×44px (not just the icon)
- [ ] Cover upload area is h-48 with full-width tap target
- [ ] Tag picker is bottom sheet, not dropdown
- [ ] Visibility picker is segmented control, not picker wheel
- [ ] PDF upload area is h-32 with full-width tap target
- [ ] Submit button is full-width and in thumb zone (bottom of form)
- [ ] No glassmorphism, no shadow-lg, no indigo/blue/purple
- [ ] All text uses DESIGN.md tokens (Playfair Display headings, Inter body)
- [ ] Input focus ring uses `#e8693f` accent
- [ ] Price input uses `JetBrains Mono` for number
- [ ] Coin icon is `#e8693f` fill
- [ ] Keyboard avoidance does not break bottom nav position
- [ ] Form scrollable when content exceeds viewport
- [ ] Loading spinner on submit prevents double-tap
- [ ] Haptic feedback on cover upload, tag toggle, form submit
- [ ] Swipe back triggers confirmation if form dirty
- [ ] No horizontal scroll on any screen width ≤640px
- [ ] Touch ripple/press feedback on all tap targets
- [ ] Placeholder text uses `#7a706a`
- [ ] Image preview uses `object-fit: cover`, no distortion

## 8. Complete Stitch Prompt

You are building the **Book New** page for a library management app, mobile-only (max-width: 640px). This is a single-column form with bottom navigation.

### Design System Reference
- Canvas background: `#16110f`
- Surface: `#211a17`
- Primary accent (rust orange): `#e8693f`
- Primary hover: `#d45a30`
- Border: `#3a322d`
- Text primary: `#ece0dc`
- Text secondary: `#a89c93`
- Text muted/placeholder: `#7a706a`
- Error: `#c44d4d`
- Success: `#4a7c59`
- Display font: Playfair Display (headings only)
- Body font: Inter (all UI text)
- Mono font: JetBrains Mono (price numbers)
- Border radius: 8px inputs, 12px cards/upload areas, 9999px pills
- Buttons: primary `bg: #e8693f, color: #16110f, font-weight: 600, radius: 8px`; ghost `bg: transparent, color: #a89c93`

### Layout
- Mobile single-column, `px-4` horizontal padding, scrollable
- Back link top-left (← icon + "New Book"), ghost style
- Bottom nav fixed at bottom, z-50, with `env(safe-area-inset-bottom)` padding
- All content above bottom nav padded with `pb-safe` (bottom nav height + safe area)

### Components to Build

**1. Cover Image Upload**
- Full-width area, `h-48`, `bg: #211a17`, `border: 2px dashed #3a322d`, `border-radius: 12px`
- Center: Camera icon (24px, `#a89c93`) + "Tap to add cover" text (Inter body-small)
- Hidden `<input type="file" accept="image/*">` triggered on tap
- After selection: show `<img>` preview with `object-fit: cover`, `border-radius: 12px`, fade-in
- "Change" ghost button overlay bottom-right on preview (44×44px)

**2. Title Input**
- Label: "Title" (Inter body-small, `#a89c93`, `mb-1`)
- Input: full-width, `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 10px 14px`, `color: #ece0dc`, min-h-[44px]
- Focus: `border-color: #e8693f`, `box-shadow: 0 0 0 3px rgba(232,105,63,0.15)`
- Placeholder: "Book title...", `#7a706a`

**3. Author Input**
- Same as Title, placeholder: "Author name..."

**4. Description Textarea**
- Same input styling, `rows="4"`, `resize: none`
- Auto-resize on input (min 4 rows, max 8 rows, measure scrollHeight)
- Placeholder: "Tell readers about this book..."

**5. Tag Selector + Bottom Sheet**
- Trigger: input-like element, "Select tags..." or selected count, `+` icon right
- Bottom sheet: `bg: #211a17`, `border-radius: 16px 16px 0 0`, slides up from bottom
- Overlay: `bg: rgba(0,0,0,0.5)`, dismiss on tap
- Sheet content: handle bar, "Select Tags" heading, search input, tag chip grid (flex-wrap, gap-2)
- Tag chips: pill shape, `border: 1px solid #3a322d`, `padding: 4px 12px`, min-h-[44px]
- Selected chips: `border-color: #e8693f`, `color: #e8693f`, `bg: rgba(232,105,63,0.08)`
- "Done" button at sheet bottom, full-width primary style
- Use `framer-motion` for sheet slide and overlay fade

**6. Visibility Segmented Control**
- Container: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 4px`, flex
- 3 equal segments: "Public", "Private", "Unlisted"
- Active: `bg: #e8693f`, `color: #16110f`, `font-weight: 600`
- Inactive: `color: #a89c93`
- Use `framer-motion` `layout` for sliding active indicator

**7. Price Input**
- Coin icon (inline SVG, 20×20, `fill: #e8693f`) as prefix inside input wrapper
- `<input type="number" min="0">`, no spinner, `bg: transparent`, `border: none`, `color: #ece0dc`, `font-family: JetBrains Mono`
- Wrapper: same input styling, `display: flex`, `align-items: center`

**8. PDF Upload**
- `h-32`, `bg: #211a17`, `border: 2px dashed #3a322d`, `border-radius: 12px`
- Document icon + "Tap to upload PDF" text
- `<input type="file" accept=".pdf">`
- After selection: file name (truncated) + file size + × remove button

**9. Submit Button**
- Full-width, primary button, `padding: 14px 20px`, min-h-[48px]
- Text: "Publish Book"
- Loading: spinner + "Publishing...", disabled, opacity 0.7
- Disabled when: `!title || !coverFile || !pdfFile`
- Press: `scale(0.97)` via framer-motion whileTap

### Animations (Framer Motion)
- Page mount: stagger children, each `y: 20→0, opacity: 0→1`, 300ms, 60ms delay
- Cover preview: `opacity: 0→1`, 300ms
- Bottom sheet: `y: "100%→0"`, 300ms spring
- Overlay: `opacity: 0→0.5`, 300ms
- Button press: `whileTap={{ scale: 0.97 }}`

### Mobile Constraints
- Every interactive element must be at least 44×44px touch target
- No multi-column layouts at any width
- Bottom nav must respect `env(safe-area-inset-bottom)`
- No glassmorphism, no shadow-lg, no indigo/blue/purple colors
- Form scrollable; keyboard avoidance handled via scroll-into-view on focus
- Haptic feedback: `navigator.vibrate(10)` on cover upload success, tag toggle, form submit

### State Management
```typescript
const [coverFile, setCoverFile] = useState<File | null>(null)
const [coverPreview, setCoverPreview] = useState<string | null>(null)
const [title, setTitle] = useState('')
const [author, setAuthor] = useState('')
const [description, setDescription] = useState('')
const [selectedTags, setSelectedTags] = useState<string[]>([])
const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public')
const [price, setPrice] = useState(0)
const [pdfFile, setPdfFile] = useState<File | null>(null)
const [isSubmitting, setIsSubmitting] = useState(false)
const [tagSheetOpen, setTagSheetOpen] = useState(false)
```

### API Contract
```
POST /api/books
Content-Type: multipart/form-data
Body: { cover: File, title: string, author: string, description: string, tags: string[], visibility: string, price: number, pdf: File }
Response: { id: string, slug: string }
```
