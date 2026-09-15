# 09 — Book Edit (Tablet)

## 1. Page Title & Route

| Property | Value |
|----------|-------|
| Route | `/books/:slug/edit` |
| Title | Edit Book |
| Auth | Required (owner only) |
| Layout | Tablet 2-column asymmetric with top navigation |
| Breakpoint | 641px–1024px |

## 2. Tablet Design Rationale

Book editing on tablet mirrors the creation layout but replaces the upload-centric left column with a persistent cover preview that supports hover-to-change. The form fields on the right are pre-populated from the server. There is no PDF re-upload section — PDFs are immutable after creation — so the left column is shorter and the cover preview is the sole focus. The wider viewport makes change detection visual feedback possible: a subtle accent border pulses on any field that differs from its initial state. The save/cancel buttons sit side-by-side. The top navigation provides context switching. A skeleton loading state shows while data fetches, transitioning smoothly to the populated form.

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────────────────┐
│  Library Logo    Books   Playlists   Tags   Reports    [👤]     │  ← Top nav
├──────────────────────────────────────────────────────────────────┤
│  ← Edit Book                                                     │  ← Back breadcrumb
│                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐  │
│  │                          │  │                              │  │
│  │  [Skeleton shimmer]      │  │  [Skeleton shimmer bars]    │  │
│  │  OR                      │  │  OR                          │  │
│  │  ┌──────────────────┐   │  │  ┌────────────────────────┐  │  │
│  │  │                  │   │  │  │ Title                  │  │  │
│  │  │  [Current Cover] │   │  │  │ ┌────────────────────┐ │  │  │
│  │  │  object-fit:cover│   │  │  │ │ Pre-filled title   │ │  │  │
│  │  │                  │   │  │  │ └────────────────────┘ │  │  │
│  │  │  ┌────────────┐  │   │  │  └────────────────────────┘  │  │
│  │  │  │ Change     │  │   │  │                              │  │
│  │  │  └────────────┘  │   │  │  Author                      │  │
│  │  └──────────────────┘   │  │  ┌────────────────────────┐  │  │
│  │  h-72, larger preview   │  │  │ Pre-filled author     │  │  │
│  │                          │  │  └────────────────────────┘  │  │
│  │  Book Details            │  │                              │  │
│  │  ┌──────────────────┐   │  │  Description                 │  │
│  │  │ 📄 filename.pdf  │   │  │  ┌────────────────────────┐  │  │
│  │  │    2.3 MB        │   │  │  │ Pre-filled desc...     │  │  │
│  │  └──────────────────┘   │  │  │                        │  │  │
│  │  (read-only, no upload) │  │  └────────────────────────┘  │  │
│  │                          │  │                              │  │
│  │                          │  │  Tags                        │  │
│  │                          │  │  ┌────────────────────────┐  │  │
│  │                          │  │  │ [Fiction] [Sci-Fi] [+] │  │  │
│  │                          │  │  └────────────────────────┘  │  │
│  │                          │  │                              │  │
│  │                          │  │  Visibility        Price     │  │
│  │                          │  │  ┌─────┬─────┬──┐ ┌───────┐ │  │
│  │                          │  │  │Pub  │Priv │Ul│ │🪙 250 │ │  │
│  │                          │  │  └─────┴─────┴──┘ └───────┘ │  │
│  │                          │  │                              │  │
│  │                          │  │  ┌──────────┐ ┌──────────┐  │  │
│  │                          │  │  │ Save     │ │  Cancel  │  │  │
│  │                          │  │  └──────────┘ └──────────┘  │  │
│  │                          │  │                              │  │
│  └──────────────────────────┘  └──────────────────────────────┘  │
│       40% width                   60% width                      │
└──────────────────────────────────────────────────────────────────┘
```

## 4. Component Breakdown

### Top Navigation
- Same as Book New tablet: horizontal `h-14`, `bg: #211a17`, `border-bottom`, `px-6`
- "Books" active, other links as defined
- min-h-[40px] on all interactive elements

### Back Breadcrumb
- Same as Book New: `← Edit Book`, ghost style, `px-6 pt-4 pb-2`

### Skeleton Loading State
- Rendered while `isLoading` is true
- Left column: cover shimmer `h-72`, `bg: #211a17`, `border-radius: 12px`, animated gradient sweep
- Right column: 6 shimmer bars stacked vertically
  - Title: `h-11 rounded-lg`
  - Author: `h-11 rounded-lg`
  - Description: `h-28 rounded-lg`
  - Tags: 3 shimmer pills `h-8 w-16 rounded-full`
  - Visibility: 3 segment shimmers `h-11 rounded-lg`
  - Price: `h-11 rounded-lg`
- Stagger: 60ms between each bar
- Duration: 1.5s infinite sweep

### Cover Display (Left Column — Tablet Size)
- Container: `h-72` (288px), `border-radius: 12px`, `overflow: hidden`, `relative`
- Shows `<img>` of current cover with `object-fit: cover`
- Hover state: overlay darkens slightly (`bg: rgba(0,0,0,0.3)`) and "Change Cover" button appears
- "Change Cover" button: centered, `bg: #211a17cc`, `border: 1px solid #3a322d`, `border-radius: 8px`, camera icon + text, min-h-[40px] min-w-[40px]
- Click opens hidden `<input type="file" accept="image/*">`
- After new selection: crossfade to new preview (opacity 300ms)
- If no cover: dashed-border upload area same as Book New but `h-72`

### PDF Info Display (Left Column, Below Cover)
- Container: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 12px 16px`
- Document icon (24px, `#a89c93`) + file name (Inter body, `#ece0dc`, truncated) + file size (Inter body-small, `#a89c93`)
- Label: "PDF File" (Inter body-small, `#a89c93`)
- No file input, no upload — purely informational
- No hover interaction — this is static

### Title Input (Pre-populated, Right Column)
- Same styling as Book New tablet: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 12px 16px`, `text-base`
- `defaultValue={book.title}`
- Focus: `border-color: #e8693f`, `box-shadow: 0 0 0 3px rgba(232,105,63,0.15)`
- Changed indicator: if value differs from initial, show thin accent left-border (`border-left: 2px solid #e8693f`)

### Author Input (Pre-populated)
- Same as Title, `defaultValue={book.author}`
- Changed indicator same as Title

### Description Textarea (Pre-populated)
- Same input styling, `rows="5"`, auto-resize (min 5, max 10)
- `defaultValue={book.description}`
- Auto-resize triggers on mount to fit content

### Tag Selector (Inline Chips + Popover, Pre-populated)
- Same as Book New tablet: inline chips + popover
- Pre-populated: `selectedTags` initialized from `book.tags`
- Popover shows all tags with current selections pre-checked
- Changed indicator: accent border on wrapper if tags differ from initial

### Visibility Segmented Control (Pre-selected)
- Same as Book New tablet
- Default: `book.visibility`
- Changed indicator: accent border if value differs

### Price Input (Pre-populated)
- Same as Book New tablet
- `defaultValue={book.price}`
- Changed indicator same as above

### Button Row
- `flex gap-4 mt-6`
- Save Button: flex-1, `bg: #e8693f`, `color: #16110f`, `font-weight: 600`, `rounded-lg`, min-h-[44px]
- Cancel Button: flex-1, ghost style, `bg: transparent`, `border: 1px solid #3a322d`, `color: #a89c93`, min-h-[44px]
- Save disabled when no changes detected
- Save hover: `bg: #d45a30`
- Cancel hover: `border-color: #4d433d`, `color: #ece0dc`
- Loading state: spinner + "Saving...", disabled, opacity 0.7

## 5. Tablet Interactions

### Page Load
1. Show skeleton loading state immediately
2. Fetch book data from `/api/books/:slug`
3. Populate all fields, store initial state snapshot
4. Transition: skeleton fades out (200ms), form fades in (300ms) — left column and right column stagger

### Cover Change (Hover-to-Change)
1. User hovers over cover container
2. Dark overlay fades in (200ms)
3. "Change Cover" button appears (200ms)
4. Click button → native file picker opens
5. New selection → crossfade to new preview (300ms)
6. Track new cover file in state

### Change Detection with Visual Feedback
1. On mount: snapshot all initial values
2. On each field change: compare to snapshot
3. If different: add `border-left: 2px solid #e8693f` to that field's wrapper
4. If same as initial: remove accent border
5. Save button enabled only when at least one field differs
6. Button opacity reduced when no changes

### Tag Popover
1. Same as Book New: click "+" to open, search + toggle chips
2. Popover closes on outside click or Escape
3. Change detection tracks tag array changes

### Keyboard Navigation
1. Tab order: Back → Title → Author → Description → Tags → Visibility → Price → Save → Cancel
2. Focus ring: `0 0 0 3px rgba(232,105,63,0.15)`
3. Enter on Save triggers submit

### Form Submit (Save)
1. Validate required fields
2. Build FormData with changed fields only
3. PATCH to `/api/books/:slug`
4. Success: toast "Book updated", navigate to book detail
5. Error: toast error, button re-enables

## 6. Animation Spec (Framer Motion)

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Skeleton → form | Data loaded | skeleton fade-out + form fade-in | 200ms + 300ms | smooth |
| Cover image | New selected | crossfade `opacity 0→1` | 300ms | smooth |
| Cover image | Page load | fade-in `opacity 0→1` | 400ms | smooth |
| Cover hover overlay | Hover in | `opacity 0→1` | 200ms | smooth |
| Cover hover overlay | Hover out | `opacity 1→0` | 300ms | smooth |
| Change indicator | Field changed | `border-left` width `0→2px` + color `transparent→#e8693f` | 200ms | smooth |
| Change indicator | Field reverted | `border-left` color `#e8693f→transparent` | 200ms | smooth |
| Tag popover | Open | scale `0.95→1` + fade `opacity 0→1` + `y: -4→0` | 200ms | spring |
| Tag popover | Close | scale `1→0.95` + fade `opacity 1→0` | 150ms | smooth |
| Save button | Press | `scale(0.97)` | 150ms | spring |
| Cancel button | Press | `scale(0.97)` | 150ms | spring |
| Form fields | Mount | stagger `translateY(12px→0)` + `opacity 0→1` | 250ms each, 50ms stagger | spring |
| Error text | Appear | fade-in + slide `translateY(4px→0)` | 200ms | smooth |
| Toast | Appear | slide in from top | 300ms | spring |

## 7. Anti-Slop Checklist

- [ ] Top navigation present, horizontal, no bottom nav
- [ ] 2-column layout: cover (40%) + form (60%) with `gap-8`
- [ ] All interactive elements min-h-[40px] min-w-[40px]
- [ ] Hover states on all buttons, links, and cover area
- [ ] Cover preview is `h-72` (larger than mobile and new-book)
- [ ] No PDF upload section — read-only display only
- [ ] Tags are inline chips with popover — NOT bottom sheet
- [ ] Visibility + Price in side-by-side row
- [ ] Buttons side-by-side (Save + Cancel) — NOT stacked
- [ ] `px-6` (24px) horizontal padding
- [ ] `text-base` (16px) on inputs
- [ ] Skeleton loading state shows while data fetches
- [ ] Form pre-populated correctly from server data
- [ ] Change detection with visual feedback (accent border on changed fields)
- [ ] Save button disabled when no changes detected
- [ ] Cover hover overlay has smooth transition
- [ ] Auto-resize textarea fits initial content
- [ ] Keyboard tab order is logical
- [ ] Focus ring uses `#e8693f`
- [ ] No glassmorphism, no shadow-lg, no indigo/blue/purple
- [ ] All text uses DESIGN.md tokens
- [ ] Price uses `JetBrains Mono`
- [ ] Skeleton shimmer is subtle (not jarring)
- [ ] Network error on load: show error state, not blank form
- [ ] No horizontal scroll at any width ≤1024px

## 8. Complete Stitch Prompt

You are building the **Book Edit** page for a library management app, tablet breakpoint (641px–1024px). This mirrors Book New's 2-column layout but with pre-populated fields, no PDF re-upload, and change detection visual feedback.

### Design System Reference
- Canvas background: `#16110f`
- Surface: `#211a17`
- Surface hover: `#2a211c`
- Primary accent (rust orange): `#e8693f`
- Primary hover: `#d45a30`
- Accent muted: `#e8693f20`
- Border: `#3a322d`
- Border hover: `#4d433d`
- Text primary: `#ece0dc`
- Text secondary: `#a89c93`
- Text muted/placeholder: `#7a706a`
- Text on accent: `#16110f`
- Error: `#c44d4d`
- Success: `#4a7c59`
- Display font: Playfair Display (headings only)
- Body font: Inter (all UI text)
- Mono font: JetBrains Mono (price numbers)
- Border radius: 4px (sm), 8px (inputs), 12px (cards), 16px (xl), 9999px (pills)
- Elevation: 1 = surface + border, 2 = surface + border + shadow(0 4px 24px)
- Animations: spring `cubic-bezier(0.34, 1.56, 0.64, 1)`, smooth `cubic-bezier(0.25, 0.1, 0.25, 1)`

### Layout
- Top navigation: horizontal, `h-14`, `bg: #211a17`, `border-bottom: 1px solid #3a322d`, `px-6`
- Main content: `px-6 py-4`, `max-w-4xl mx-auto`
- 2-column flex: left (`flex-[2]`) = cover + PDF info, right (`flex-[3]`) = form fields
- `gap-8` between columns

### Components to Build

**1. Top Navigation**
- Same as Book New tablet

**2. Back Breadcrumb**
- Same as Book New tablet, text: "Edit Book"

**3. Skeleton Loading State**
- Left column: cover shimmer `h-72`, `bg: #211a17`, `border-radius: 12px`, animated gradient sweep
- Right column: shimmer bars for each form field, stagger 60ms
- Transition: skeleton fade-out 200ms, form fade-in 300ms

**4. Cover Display (Left Column)**
- `h-72`, `border-radius: 12px`, `overflow: hidden`, `relative`
- `<img>` with `object-fit: cover`, `w-full h-full`
- Hover overlay: `absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity-200ms`
- "Change Cover" button: centered in overlay, ghost style with icon + text
- Click → hidden `<input type="file" accept="image/*">`
- Crossfade on new selection: `opacity: 0→1`, 300ms
- No cover: dashed-border upload area same as Book New (`h-72`)

**5. PDF Info Display (Left Column, Below Cover)**
- `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `p-4`
- Document icon (24px, `#a89c93`) + file name (truncated, `#ece0dc`) + size (`#a89c93`)
- Read-only, no upload, no interaction

**6. Title Input (Pre-populated)**
- `defaultValue={book.title}`
- Same styling as Book New tablet
- Changed indicator: `border-left: 2px solid #e8693f` when value ≠ initial

**7. Author Input (Pre-populated)**
- Same as Title, `defaultValue={book.author}`

**8. Description Textarea (Pre-populated)**
- Same input styling, `rows="5"`, auto-resize
- `defaultValue={book.description}`

**9. Tag Selector (Inline Chips + Popover, Pre-populated)**
- Same as Book New tablet
- `selectedTags` initialized from `book.tags`
- Popover shows all tags with current selections pre-checked

**10. Visibility Segmented Control (Pre-selected)**
- Same as Book New tablet
- Default: `book.visibility`

**11. Price Input (Pre-populated)**
- Same as Book New tablet
- `defaultValue={book.price}`

**12. Button Row**
- `flex gap-4 mt-6`
- Save: `flex-1`, `bg: #e8693f`, `color: #16110f`, `font-weight: 600`, min-h-[44px]
- Cancel: `flex-1`, ghost, `border: 1px solid #3a322d`, `color: #a89c93`, min-h-[44px]
- Save disabled when `!hasChanges`
- Loading: spinner + "Saving...", disabled, opacity 0.7

### Change Detection
```typescript
// On mount, after data loads:
const initialState = { title, author, description, tags, visibility, price, coverFile }

// On any field change:
const hasChanges = (
  title !== initialState.title ||
  author !== initialState.author ||
  description !== initialState.description ||
  JSON.stringify(tags) !== JSON.stringify(initialState.tags) ||
  visibility !== initialState.visibility ||
  price !== initialState.price ||
  coverFile !== initialState.coverFile
)
// Save button disabled when !hasChanges
// Each field wrapper gets border-left accent when its value differs
```

### Animations (Framer Motion)
- Skeleton → form: fade-out 200ms, fade-in 300ms
- Form fields: stagger `y: 12→0, opacity: 0→1`, 250ms each, 50ms delay
- Cover crossfade: `opacity: 0→1`, 300ms
- Hover overlay: CSS transition `opacity 200ms`
- Change indicator: CSS transition `border-left-color 200ms`
- Button press: `whileTap={{ scale: 0.97 }}`

### State Management
```typescript
const [isLoading, setIsLoading] = useState(true)
const [book, setBook] = useState<Book | null>(null)
const [coverFile, setCoverFile] = useState<File | null>(null)
const [coverPreview, setCoverPreview] = useState<string | null>(null)
const [title, setTitle] = useState('')
const [author, setAuthor] = useState('')
const [description, setDescription] = useState('')
const [selectedTags, setSelectedTags] = useState<string[]>([])
const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public')
const [price, setPrice] = useState(0)
const [isSaving, setIsSaving] = useState(false)
const [tagPopoverOpen, setTagPopoverOpen] = useState(false)
const [initialState, setInitialState] = useState(null)
```

### API Contract
```
GET /api/books/:slug
Response: { id, slug, title, author, description, tags, visibility, price, coverUrl, pdfName, pdfSize }

PATCH /api/books/:slug
Content-Type: multipart/form-data
Body: { cover?: File, title: string, author: string, description: string, tags: string[], visibility: string, price: number }
Response: { id, slug }
```

### Tablet Constraints
- Top navigation, NOT bottom nav
- Hover states enabled (cover overlay, button color shifts)
- 2-column layout at all widths 641–1024px
- Tags use inline chips + popover, NOT bottom sheet
- No PDF re-upload — read-only display only
- Buttons side-by-side, NOT stacked
- `px-6` padding (24px)
- All interactive elements min-h-[40px] min-w-[40px]
- Change detection with visual feedback on fields
- Skeleton loading before data loads
- No glassmorphism, no shadow-lg, no indigo/blue/purple
