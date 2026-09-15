# 08 — Book New (Tablet)

## 1. Page Title & Route

| Property | Value |
|----------|-------|
| Route | `/books/new` |
| Title | New Book |
| Auth | Required |
| Layout | Tablet 2-column asymmetric with top navigation |
| Breakpoint | 641px–1024px |

## 2. Tablet Design Rationale

Book creation on tablet exploits the wider viewport to split the form into two columns: a persistent cover preview on the left (40%) and form fields on the right (60%). This lets the user see the cover updating live as they fill in metadata. The top navigation replaces the bottom nav — tablets are used in landscape and landscape bottom nav wastes vertical space. Tags are rendered as inline chips with a popover, not a bottom sheet, because the viewport is wide enough. The PDF upload zone is wider and more prominent since tablet users often have files ready. All inputs use slightly larger type than mobile. Hover states are enabled for interactive elements. Buttons sit side-by-side (Publish + Cancel) instead of stacked. The page uses `px-6` (24px) horizontal padding instead of mobile's `px-5`.

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────────────────┐
│  Library Logo    Books   Playlists   Tags   Reports    [👤]     │  ← Top nav, horizontal
├──────────────────────────────────────────────────────────────────┤
│  ← New Book                                                     │  ← Back breadcrumb
│                                                                  │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐  │
│  │                          │  │                              │  │
│  │   Cover Image Upload     │  │  Title                       │  │
│  │   ┌──────────────────┐   │  │  ┌────────────────────────┐  │  │
│  │   │                  │   │  │  │ Book title...          │  │  │
│  │   │  Tap to add      │   │  │  └────────────────────────┘  │  │
│  │   │  cover image     │   │  │                              │  │
│  │   │                  │   │  │  Author                      │  │
│  │   └──────────────────┘   │  │  ┌────────────────────────┐  │  │
│  │   h-64, dashed border    │  │  │ Author name...         │  │  │
│  │                          │  │  └────────────────────────┘  │  │
│  │   ── OR after upload ──  │  │                              │  │
│  │                          │  │  Description                 │  │
│  │   ┌──────────────────┐   │  │  ┌────────────────────────┐  │  │
│  │   │  [Cover Preview] │   │  │  │                        │  │  │
│  │   │  object-fit:cover│   │  │  │ Tell readers about...  │  │  │
│  │   │  [Change] btn    │   │  │  │                        │  │  │
│  │   └──────────────────┘   │  │  └────────────────────────┘  │  │
│  │                          │  │                              │  │
│  │   PDF Upload Zone        │  │  Tags                        │  │
│  │   ┌──────────────────┐   │  │  ┌────────────────────────┐  │  │
│  │   │  📄 Upload PDF   │   │  │  │ [Fiction] [Sci-Fi] [+] │  │  │
│  │   └──────────────────┘   │  │  └────────────────────────┘  │  │
│  │   h-40, wider area       │  │                              │  │
│  │                          │  │  Visibility        Price     │  │
│  │                          │  │  ┌─────┬─────┬──┐ ┌───────┐ │  │
│  │                          │  │  │Pub  │Priv │Ul│ │🪙 0   │ │  │
│  │                          │  │  └─────┴─────┴──┘ └───────┘ │  │
│  │                          │  │                              │  │
│  │                          │  │  ┌──────────┐ ┌──────────┐  │  │
│  │                          │  │  │ Publish  │ │  Cancel  │  │  │
│  │                          │  │  └──────────┘ └──────────┘  │  │
│  │                          │  │                              │  │
│  └──────────────────────────┘  └──────────────────────────────┘  │
│       40% width                   60% width                      │
└──────────────────────────────────────────────────────────────────┘
```

## 4. Component Breakdown

### Top Navigation
- Horizontal bar, full-width, `bg: #211a17`, `border-bottom: 1px solid #3a322d`
- Height: `h-14` (56px), `px-6`, flex items-center justify-between
- Left: logo (Playfair Display, accent color) + nav links (Inter body, `#a89c93`)
- Links: "Books" (active, `#ece0dc`), "Playlists", "Tags", "Reports"
- Active link: `#ece0dc` text, `border-bottom: 2px solid #e8693f`
- Hover link: `#ece0dc`, transition `color 200ms smooth`
- Right: avatar icon (32×32, `rounded-full`, `border: 2px solid #3a322d`)
- min-h-[40px] on all interactive elements

### Back Breadcrumb
- `px-6`, `pt-4 pb-2`
- `←` icon (20px, `#a89c93`) + "New Book" text (Inter body, `#a89c93`)
- Hover: `#ece0dc`, transition `color 200ms smooth`
- min-h-[40px], min-w-[40px]

### 2-Column Container
- `px-6`, `py-4`, `max-w-4xl mx-auto`
- `flex gap-8` — left column `flex-[2]`, right column `flex-[3]`
- Left column: cover upload + PDF upload, stacked vertically
- Right column: all form fields, stacked vertically

### Cover Image Upload (Left Column — Tablet Size)
- Container: `bg: #211a17`, `border: 2px dashed #3a322d`, `border-radius: 12px`
- `h-64` (256px) — taller than mobile for better preview
- Center: Camera icon (32px, `#a89c93`) + "Drop image or click to upload" text (Inter body, `#a89c93`)
- Hidden `<input type="file" accept="image/*">`
- Supports drag-and-drop: on `dragover` → `border-color: #e8693f`, `bg: #e8693f10`
- On drop/file select: fade-in image preview, `object-fit: cover`, `border-radius: 12px`
- "Change" overlay button bottom-right: ghost, camera icon, min-h-[40px] min-w-[40px]
- Hover overlay: `opacity: 0→1` on container hover, `transition: opacity 200ms smooth`

### PDF Upload Zone (Left Column — Below Cover)
- Container: `bg: #211a17`, `border: 2px dashed #3a322d`, `border-radius: 12px`
- `h-40` (160px) — wider and taller than mobile
- Center: Document icon (28px, `#a89c93`) + "Upload PDF" heading (Inter body, `#ece0dc`) + "Drag or click" subtext (Inter body-small, `#a89c93`)
- Hidden `<input type="file" accept=".pdf">`
- Supports drag-and-drop with same highlight as cover
- After selection: file name + file size + remove (×) button
- Hover: `border-color: #4d433d`, transition 200ms

### Title Input (Right Column)
- Label: "Title", Inter body-small, `#a89c93`, `mb-1`
- Input: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 12px 16px`
- Text size: `text-base` (16px, slightly larger than mobile's 14px)
- Focus: `border-color: #e8693f`, `box-shadow: 0 0 0 3px rgba(232,105,63,0.15)`
- min-h-[40px], `w-full`

### Author Input
- Same styling as Title input
- Placeholder: "Author name..."

### Description Textarea
- Label: "Description", Inter body-small, `#a89c93`
- Same input styling
- `rows="5"`, auto-resize (min 5, max 10 rows)
- Placeholder: "Tell readers about this book..."

### Tag Selector (Inline Chips)
- Label: "Tags", Inter body-small, `#a89c93`
- Container: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 8px 12px`
- `flex flex-wrap gap-2 items-center`
- Each selected tag: pill chip, `bg: #e8693f20`, `border: 1px solid #e8693f`, `color: #e8693f`, `border-radius: 9999px`, `padding: 4px 12px`, Inter body-small
- Remove icon (×) in each chip, 20×20, hover: `#c44d4d`
- "+" add button: ghost circle, `w-8 h-8`, `border: 1px solid #3a322d`, `border-radius: 9999px`, hover: `border-color: #e8693f`
- Tag popover on "+" click: `bg: #211a17`, `border: 1px solid #3a322d`, `border-radius: 12px`, `shadow: 0 4px 24px rgba(0,0,0,0.3)`, positioned below trigger
- Popover contains search input + tag chip grid (flex-wrap, gap-2)
- Close on click outside or Escape key

### Visibility + Price Row
- `flex gap-4`, full-width in right column
- Visibility: flex-[2], Price: flex-[1]

### Visibility Segmented Control
- Same as mobile but `text-base` (16px)
- Container: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 4px`, flex
- Active: `bg: #e8693f`, `color: #16110f`, `font-weight: 600`
- Hover on inactive: `color: #ece0dc`, `bg: #2a211c`

### Price Input
- Label: "Price (coins)", Inter body-small, `#a89c93`
- Coin icon prefix (20×20, `fill: #e8693f`) + `<input type="number">`
- `font-family: JetBrains Mono`, `text-base`
- No spinner, min-h-[40px]

### Button Row
- `flex gap-4`, `mt-6`
- Publish Button: flex-1, `bg: #e8693f`, `color: #16110f`, `font-weight: 600`, `padding: 12px 24px`, `border-radius: 8px`, min-h-[44px]
- Cancel Button: flex-1, ghost style, `bg: transparent`, `border: 1px solid #3a322d`, `color: #a89c93`, `font-weight: 600`, min-h-[44px]
- Hover Publish: `bg: #d45a30`, transition 200ms
- Hover Cancel: `border-color: #4d433d`, `color: #ece0dc`, transition 200ms
- Press: `scale(0.97)` on both

## 5. Tablet Interactions

### Cover Image — Click or Drag-and-Drop
1. Click opens native file picker
2. Drag-over: border turns accent (`#e8693f`), surface lightens to `#e8693f10`
3. Drop: file selected, image loads with fade-in (300ms)
4. Cover area transforms from dashed to image preview
5. "Change" overlay appears on hover of container
6. Click "Change" → reopens file picker

### Tag Popover Open/Close
1. Click "+" button or empty tag area
2. Popover appears below with spring animation (200ms)
3. Search input auto-focuses
4. Click tag chip to toggle selection
5. Click outside or press Escape → popover closes
6. Selected tags appear as chips in the inline container

### Hover States (Tablet-Specific)
1. All buttons: color/border transitions on hover (200ms smooth)
2. Cover area: "Change" overlay fades in on hover
3. Tag chips: remove icon color shifts on hover
4. Nav links: color shift on hover
5. Input fields: border darkens slightly on hover (`#3a322d → #4d433d`)

### Keyboard Navigation
1. Tab order: Back → Title → Author → Description → Tags → Visibility → Price → Publish → Cancel
2. Focus ring: `0 0 0 3px rgba(232,105,63,0.15)` on all focusable elements
3. Escape closes tag popover
4. Enter on Publish triggers submit

### Form Submit
1. Validate required fields (title, cover, PDF)
2. Show inline errors below fields: `#c44d4d`, Inter body-small, fade-in
3. Button enters loading state: spinner + "Publishing..."
4. POST to `/api/books` with FormData
5. Success: navigate to book detail with toast
6. Error: toast, button re-enables

## 6. Animation Spec (Framer Motion)

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Cover preview | File selected | fade-in `opacity 0→1` | 300ms | smooth |
| Cover preview | Image loaded | scale `0.95→1` | 300ms | spring |
| Tag popover | Open | scale `0.95→1` + fade `opacity 0→1` + `y: -4→0` | 200ms | spring |
| Tag popover | Close | scale `1→0.95` + fade `opacity 1→0` | 150ms | smooth |
| Tag chip | Toggle | scale `1→1.05→1` | 200ms | spring |
| Visibility indicator | Segment change | `layout` slide | 200ms | spring |
| Publish button | Press | `scale(0.97)` | 150ms | spring |
| Cancel button | Press | `scale(0.97)` | 150ms | spring |
| Error text | Appear | fade-in `opacity 0→1` + slide `translateY(4px→0)` | 200ms | smooth |
| Page load | Mount | stagger children `translateY(12px→0)` + `opacity 0→1` | 250ms each, 50ms stagger | spring |
| PDF file info | Appear | fade-in `opacity 0→1` | 200ms | smooth |
| Cover hover overlay | Hover in | `opacity 0→1` | 200ms | smooth |
| Cover hover overlay | Hover out | `opacity 1→0` | 300ms | smooth |

## 7. Anti-Slop Checklist

- [ ] Top navigation present, horizontal, no bottom nav
- [ ] 2-column layout: cover (40%) + form (60%) at `flex gap-8`
- [ ] All interactive elements min-h-[40px] min-w-[40px]
- [ ] Hover states on all buttons, links, and interactive elements
- [ ] Cover upload area is `h-64` (taller than mobile)
- [ ] PDF upload zone is `h-40` (wider/taller than mobile)
- [ ] Tags are inline chips with popover — NOT a bottom sheet
- [ ] Visibility + Price in a side-by-side row
- [ ] Buttons side-by-side (Publish + Cancel) — NOT stacked
- [ ] `px-6` (24px) horizontal padding throughout
- [ ] `text-base` (16px) on inputs (slightly larger than mobile)
- [ ] Drag-and-drop supported on cover and PDF upload zones
- [ ] Keyboard tab order is logical (top-left → bottom-right)
- [ ] Focus ring uses `#e8693f` accent
- [ ] No glassmorphism, no shadow-lg, no indigo/blue/purple
- [ ] All text uses DESIGN.md tokens (Playfair headings, Inter body)
- [ ] Price input uses `JetBrains Mono`
- [ ] Coin icon is `#e8693f` fill
- [ ] Loading spinner on submit prevents double-tap
- [ ] Form scrollable when content exceeds viewport height
- [ ] No horizontal scroll at any width ≤1024px
- [ ] Tag popover closes on outside click and Escape key
- [ ] Cover hover overlay has smooth transition (not instant snap)

## 8. Complete Stitch Prompt

You are building the **Book New** page for a library management app, tablet breakpoint (641px–1024px). This is an asymmetric 2-column layout with horizontal top navigation.

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
- Border radius: 4px (sm), 8px (inputs), 12px (cards), 16px (xl), 24px (2xl), 9999px (pills)
- Elevation: 1 = surface + border, 2 = surface + border + shadow(0 4px 24px), 3 = surface hover + shadow(0 8px 32px)
- Animations: spring `cubic-bezier(0.34, 1.56, 0.64, 1)`, smooth `cubic-bezier(0.25, 0.1, 0.25, 1)`

### Layout
- Top navigation: horizontal, `h-14`, `bg: #211a17`, `border-bottom: 1px solid #3a322d`, `px-6`
- Nav links: "Books", "Playlists", "Tags", "Reports" — active = `#ece0dc` + accent bottom border
- Main content: `px-6 py-4`, `max-w-4xl mx-auto`
- 2-column flex: left (`flex-[2]`) = cover + PDF, right (`flex-[3]`) = form fields
- `gap-8` between columns

### Components to Build

**1. Top Navigation**
- Full-width bar, `h-14`, `bg: #211a17`, `border-bottom: 1px solid #3a322d`
- Left: logo (Playfair Display, accent), nav links (Inter body, `#a89c93`)
- Right: avatar circle (32×32, `rounded-full`)
- Active nav: `#ece0dc`, `border-bottom: 2px solid #e8693f`
- Hover nav: `#ece0dc`, `transition: color 200ms`
- All links: min-h-[40px], flex items-center

**2. Back Breadcrumb**
- `px-6 pt-4 pb-2`
- `←` (20px, `#a89c93`) + "New Book" (Inter body, `#a89c93`)
- Hover: `#ece0dc`

**3. Cover Image Upload (Left Column)**
- `h-64`, `bg: #211a17`, `border: 2px dashed #3a322d`, `border-radius: 12px`
- Center: Camera icon (32px) + "Drop image or click to upload"
- Drag-and-drop: on dragover → `border-color: #e8693f`, `bg: #e8693f10`
- File input: `<input type="file" accept="image/*">`
- After upload: `<img>` preview, `object-fit: cover`, fade-in 300ms
- "Change" overlay: absolute bottom-right, ghost, appears on hover

**4. PDF Upload Zone (Left Column, Below Cover)**
- `h-40`, `bg: #211a17`, `border: 2px dashed #3a322d`, `border-radius: 12px`
- Center: Document icon (28px) + "Upload PDF" + "Drag or click"
- Drag-and-drop supported
- File input: `<input type="file" accept=".pdf">`
- After selection: file name + size + remove (×) button

**5. Title Input (Right Column)**
- Label: "Title" (Inter body-small, `#a89c93`)
- `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 12px 16px`, `text-base`
- Focus: `border-color: #e8693f`, `box-shadow: 0 0 0 3px rgba(232,105,63,0.15)`
- min-h-[40px]

**6. Author Input**
- Same as Title, placeholder: "Author name..."

**7. Description Textarea**
- Same input styling, `rows="5"`, auto-resize (min 5, max 10)

**8. Tag Selector (Inline Chips + Popover)**
- Container: input-like wrapper, `flex flex-wrap gap-2`, selected chips + "+" button
- Selected chips: `bg: #e8693f20`, `border: 1px solid #e8693f`, `color: #e8693f`, `rounded-full`, `px-3 py-1`
- "+" button: `w-8 h-8 rounded-full border border-[#3a322d]`, hover: `border-color: #e8693f`
- Popover: `bg: #211a17`, `border: 1px solid #3a322d`, `border-radius: 12px`, `shadow(0 4px 24px rgba(0,0,0,0.3))`
- Popover content: search input + tag chip grid (flex-wrap, gap-2)
- Close: click outside, Escape key

**9. Visibility Segmented Control**
- Container: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 4px`, flex
- 3 segments: "Public", "Private", "Unlisted"
- Active: `bg: #e8693f`, `color: #16110f`, `font-weight: 600`
- Hover inactive: `color: #ece0dc`, `bg: #2a211c`
- Use framer-motion `layout` for sliding indicator

**10. Price Input**
- Coin icon (20×20, `fill: #e8693f`) prefix
- `type="number"`, `font-family: JetBrains Mono`, `text-base`, no spinner
- Same wrapper styling as other inputs

**11. Button Row**
- `flex gap-4 mt-6`
- Publish: `flex-1`, `bg: #e8693f`, `color: #16110f`, `font-weight: 600`, `rounded-lg`, `px-6 py-3`, min-h-[44px]
- Cancel: `flex-1`, `bg: transparent`, `border: 1px solid #3a322d`, `color: #a89c93`, `font-weight: 600`, `rounded-lg`
- Hover Publish: `bg: #d45a30`
- Hover Cancel: `border-color: #4d433d`, `color: #ece0dc`
- Both: `whileTap={{ scale: 0.97 }}`

### Animations (Framer Motion)
- Page mount: stagger children, each `y: 12→0, opacity: 0→1`, 250ms, 50ms stagger
- Cover preview: `opacity: 0→1`, 300ms smooth
- Tag popover: `scale: 0.95→1, opacity: 0→1, y: -4→0`, 200ms spring
- Button press: `whileTap={{ scale: 0.97 }}`
- Hover overlays: CSS transitions 200ms smooth

### Tablet Constraints
- Top navigation, NOT bottom nav — that's mobile-only
- Hover states enabled (desktop-like interaction)
- 2-column layout at all widths 641–1024px
- Tags use inline chips + popover, NOT bottom sheet
- Buttons side-by-side, NOT stacked
- `px-6` padding (24px), not mobile's `px-5`
- All interactive elements min-h-[40px] min-w-[40px]
- No glassmorphism, no shadow-lg, no indigo/blue/purple

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
const [tagPopoverOpen, setTagPopoverOpen] = useState(false)
```

### API Contract
```
POST /api/books
Content-Type: multipart/form-data
Body: { cover: File, title: string, author: string, description: string, tags: string[], visibility: string, price: number, pdf: File }
Response: { id: string, slug: string }
```
