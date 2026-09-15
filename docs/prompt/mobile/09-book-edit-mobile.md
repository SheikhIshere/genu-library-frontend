# 09 — Book Edit (Mobile)

## 1. Page Title & Route

| Property | Value |
|----------|-------|
| Route | `/books/:slug/edit` |
| Title | Edit Book |
| Auth | Required (owner only) |
| Layout | Mobile single-column with bottom nav |
| Max-width | 640px |

## 2. Mobile-First Design Rationale

Book editing on mobile mirrors creation but with two critical differences: fields are pre-populated from the server, and there is no PDF re-upload (PDFs are immutable after creation). The cover image shows the current cover with a "Change cover" overlay on tap. A skeleton loading state displays while the book data loads. The form uses the same vertical stack as Book New for consistency. The save button sits at the bottom in the thumb zone. The bottom nav is present. The page must handle the transition from loading skeleton to populated form smoothly.

## 3. Mobile Layout Specification

```
┌─────────────────────────────┐
│  [safe-area top padding]    │
├─────────────────────────────┤
│  ← Edit Book                │  ← Back link
│                             │
│  ┌───────────────────────┐  │
│  │  [Skeleton: h-48 bar] │  │  ← Loading: animated shimmer
│  │  OR                    │  │
│  │  ┌─────────────────┐  │  │
│  │  │  Current Cover   │  │  │  ← h-48, object-fit cover
│  │  │  [Change cover]  │  │  │  ← overlay on tap
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
│                             │
│  Title                      │
│  ┌───────────────────────┐  │
│  │ Pre-filled title      │  │  ← pre-populated
│  └───────────────────────┘  │
│                             │
│  Author                     │
│  ┌───────────────────────┐  │
│  │ Pre-filled author     │  │
│  └───────────────────────┘  │
│                             │
│  Description                │
│  ┌───────────────────────┐  │
│  │ Pre-filled desc...    │  │  ← auto-resize
│  │                       │  │
│  └───────────────────────┘  │
│                             │
│  Tags                       │
│  ┌───────────────────────┐  │
│  │ 3 tags selected   [+] │  │
│  └───────────────────────┘  │
│                             │
│  Visibility                 │
│  ┌─────┬─────┬─────┐       │
│  │ Pub │Priv │Unl. │       │
│  └─────┴─────┴─────┘       │
│                             │
│  Price (coins)              │
│  ┌───────────────────────┐  │
│  │ 🪙 250                │  │
│  └───────────────────────┘  │
│                             │
│  PDF                        │
│  ┌───────────────────────┐  │
│  │ 📄 filename.pdf  2.3MB│  │  ← read-only, no upload
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │      Save Changes     │  │  ← full-width, rust orange
│  └───────────────────────┘  │
│                             │
│  [pb-safe for bottom nav]   │
├─────────────────────────────┤
│  📚  🏠  🔍  👤            │  ← Bottom nav, fixed
└─────────────────────────────┘
```

## 4. Component Breakdown

### Skeleton Loading State
- Cover area: `h-48`, `bg: #211a17`, animated shimmer gradient (sweep left-to-right)
- Title input: single shimmer bar, `h-11`, `rounded-lg`
- Author input: single shimmer bar, `h-11`, `rounded-lg`
- Description: 3 shimmer bars, `h-24`, `rounded-lg`
- Tags: 3 pill shimmer bars, `h-8 w-16`, `rounded-full`
- Visibility: 3 segment shimmer bars, `h-11`, `rounded-lg`
- Price: single shimmer bar, `h-11`, `rounded-lg`
- Stagger: each bar fades in 60ms apart
- Duration: shimmer sweep 1.5s infinite

### Back Link
- Same as Book New: ghost style, ← icon + "Edit Book", min-h-[44px]

### Cover Display
- Container: same dimensions as Book New upload area (`h-48`, `border-radius: 12px`)
- Shows current cover image with `object-fit: cover`
- On tap: opens native file input (`accept="image/*"`)
- After new selection: preview replaces current cover with fade transition
- "Change cover" overlay: bottom-right, ghost button, camera icon + text, appears on hover/long-press
- Fallback if no cover: dashed border with upload prompt (same as Book New)

### Title Input (Pre-populated)
- Same styling as Book New
- Value: loaded from book data, `defaultValue` set on mount
- Auto-focus not triggered (avoid keyboard popup on load)

### Author Input (Pre-populated)
- Same styling as Title
- Value: loaded from book data

### Description Textarea (Pre-populated)
- Same styling as Book New
- Value: loaded from book data
- Auto-resize triggers on mount to fit content

### Tag Selector + Bottom Sheet
- Same as Book New
- Pre-populated with book's current tags
- On open: shows all tags with current selections checked

### Visibility Segmented Control (Pre-selected)
- Same as Book New
- Default: book's current visibility value

### Price Input (Pre-populated)
- Same as Book New
- Value: loaded from book data

### PDF Display (Read-Only)
- No upload functionality
- Shows: document icon (24px, `#a89c93`) + file name + file size
- Container: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 10px 14px`
- File name: Inter body, `#ece0dc`, truncated with ellipsis max-w
- File size: Inter body-small, `#a89c93`
- No interaction — purely informational

### Save Button
- Full-width, primary button style
- Text: "Save Changes"
- Loading: spinner + "Saving...", disabled, opacity 0.7
- Disabled when: no changes detected (compared to initial state)
- Press: `scale(0.97)`, spring physics

## 5. Mobile Interactions

### Page Load
1. Show skeleton loading state immediately
2. Fetch book data from `/api/books/:slug`
3. Populate all fields with loaded data
4. Transition: skeleton fades out (200ms), form fades in (300ms)
5. Store initial state for change detection

### Cover Change
1. User taps cover image
2. Native file picker opens (image gallery/camera)
3. New image selected: fade transition replaces current cover
4. "Change cover" overlay reappears on new preview
5. Track cover file for upload on save

### Tag Sheet
1. Same interaction as Book New
2. Opens with current tags pre-selected
3. Toggle adds/removes tags
4. "Done" confirms selection

### Visibility Toggle
1. Same as Book New
2. Starts on book's current visibility
3. Change tracked for dirty state

### Change Detection
1. On mount: snapshot all initial values
2. On each field change: compare to snapshot
3. Save button enabled only when at least one field differs
4. Visual indicator: button opacity reduced when no changes

### Form Submit (Save)
1. Validate required fields (title, cover if changed)
2. Build FormData with changed fields only
3. PATCH to `/api/books/:slug`
4. On success: haptic, toast "Book updated", navigate to book detail
5. On error: toast error message, button re-enables

### Swipe Back
1. Same as Book New
2. If dirty: "Discard changes?" confirmation
3. If clean: navigate back immediately

## 6. Animation Spec (Framer Motion)

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| Skeleton shimmer | Load | gradient sweep left→right | 1.5s | linear infinite |
| Skeleton → form | Data loaded | skeleton fade-out + form fade-in | 200ms + 300ms | smooth |
| Cover image | New selected | crossfade `opacity 0→1` | 300ms | smooth |
| Cover image | Page load | fade-in `opacity 0→1` | 400ms | smooth |
| Tag bottom sheet | Open | slide up `translateY(100%→0)` | 300ms | spring |
| Tag bottom sheet | Close | slide down `translateY(0→100%)` | 250ms | smooth |
| Visibility indicator | Segment change | `layout` slide | 200ms | spring |
| Save button | Press | `scale(0.97)` | 150ms | spring |
| Form fields | Mount | stagger `translateY(16px→0)` + `opacity 0→1` | 250ms each, 60ms stagger | spring |
| Error text | Appear | fade-in + slide `translateY(4px→0)` | 200ms | smooth |
| Toast | Appear | slide in from top | 300ms | spring |
| PDF info | Mount | fade-in `opacity 0→1` | 200ms | smooth |

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] Skeleton loading state shows while data fetches
- [ ] All interactive elements min-h-[44px] min-w-[44px]
- [ ] Single column, no horizontal layout
- [ ] Bottom nav fixed, respects safe area
- [ ] Cover area shows current image, not upload prompt (unless no cover)
- [ ] No PDF upload — read-only display only
- [ ] Form pre-populated correctly from server data
- [ ] Auto-resize textarea fits initial content without manual intervention
- [ ] Save button disabled when no changes detected
- [ ] Change detection compares all fields to initial snapshot
- [ ] No glassmorphism, no shadow-lg, no indigo/blue/purple
- [ ] All text uses DESIGN.md tokens
- [ ] Input focus ring uses `#e8693f`
- [ ] Price uses `JetBrains Mono`
- [ ] Skeleton shimmer is subtle (not jarring)
- [ ] Keyboard avoidance does not break bottom nav
- [ ] Swipe back checks dirty state before navigating
- [ ] Loading state on save prevents double-tap
- [ ] Haptic feedback on save success
- [ ] No horizontal scroll at any width ≤640px
- [ ] Cover change: if user selects same image, no re-upload
- [ ] Network error on load: show error state, not blank form

## 8. Complete Stitch Prompt

You are building the **Book Edit** page for a library management app, mobile-only (max-width: 640px). This mirrors Book New but with pre-populated fields, no PDF re-upload, and a skeleton loading state.

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
- Back link top-left (← icon + "Edit Book"), ghost style
- Bottom nav fixed at bottom, z-50, with `env(safe-area-inset-bottom)` padding
- All content padded with `pb-safe` for bottom nav clearance

### Components to Build

**1. Skeleton Loading State**
- Rendered while `isLoading` is true
- Cover: `h-48`, `bg: #211a17`, `border-radius: 12px`, animated shimmer (CSS gradient sweep, 1.5s infinite)
- Inputs: shimmer bars `h-11`, `bg: #211a17`, `border-radius: 8px`
- Description: shimmer bar `h-24`
- Tags: 3 shimmer pills `h-8 w-16`, `border-radius: 9999px`
- Stagger children with 60ms delay
- Transition: skeleton fades out (200ms), form fades in (300ms)

**2. Cover Display**
- Same dimensions as Book New (`h-48`, `border-radius: 12px`)
- Shows `<img>` of current cover with `object-fit: cover`, `border-radius: 12px`
- Tap opens hidden `<input type="file" accept="image/*">`
- After new selection: crossfade to new preview (opacity transition 300ms)
- "Change cover" overlay: bottom-right absolute, ghost button, camera icon + "Change" text, min-h-[44px]
- If no cover exists: show dashed-border upload area (same as Book New)
- Track new cover file in state; only upload if changed

**3. Title Input**
- Label: "Title" (Inter body-small, `#a89c93`, `mb-1`)
- `defaultValue={book.title}` (not value, to allow uncontrolled edits)
- Same styling as Book New: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 10px 14px`, min-h-[44px]
- Focus ring: `border-color: #e8693f`, `box-shadow: 0 0 0 3px rgba(232,105,63,0.15)`

**4. Author Input**
- Same as Title, `defaultValue={book.author}`, placeholder: "Author name..."

**5. Description Textarea**
- Same input styling, `rows="4"`, `resize: none`, auto-resize
- `defaultValue={book.description}`
- Auto-resize triggers on mount to fit initial content

**6. Tag Selector + Bottom Sheet**
- Same as Book New
- Pre-populated: `selectedTags` initialized from `book.tags`
- Sheet shows all tags with current selections pre-checked

**7. Visibility Segmented Control**
- Same as Book New
- Default: `book.visibility` (public/private/unlisted)

**8. Price Input**
- Same as Book New
- `defaultValue={book.price}`, coin icon prefix

**9. PDF Display (Read-Only)**
- Container: `bg: #16110f`, `border: 1px solid #3a322d`, `border-radius: 8px`, `padding: 10px 14px`
- Document icon (24px, `#a89c93`) + file name (Inter body, `#ece0dc`, truncated) + file size (Inter body-small, `#a89c93`)
- No file input, no upload — purely informational
- Label: "PDF File" (Inter body-small, `#a89c93`)

**10. Save Button**
- Full-width, primary button, `padding: 14px 20px`, min-h-[48px]
- Text: "Save Changes"
- Disabled when: no changes detected (compare current state to initial snapshot)
- Loading: spinner + "Saving...", disabled, opacity 0.7
- Press: `scale(0.97)` via framer-motion whileTap

### Animations (Framer Motion)
- Page mount: skeleton → form transition (skeleton fade-out 200ms, form fade-in 300ms)
- Form fields: stagger `y: 16→0, opacity: 0→1`, 250ms each, 60ms delay
- Cover crossfade: `opacity: 0→1`, 300ms
- Bottom sheet: `y: "100%→0"`, 300ms spring
- Button press: `whileTap={{ scale: 0.97 }}`

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
```

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
const [tagSheetOpen, setTagSheetOpen] = useState(false)
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

### Mobile Constraints
- Same as Book New: 44×44px min touch targets, single column, safe area padding, no glassmorphism
- No PDF re-upload — this is the key difference from Book New
- Skeleton loading must show before data loads (never blank form)
- Auto-resize textarea must handle pre-populated content on mount
- Change detection prevents unnecessary API calls
