# Add Book — Stitch Prompt

## Purpose
Upload a new book to the platform. User intent: fill in book details, upload cover image and PDF file.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Page Header
- Breadcrumb: Home > Books > Add New
- Heading: "Add New Book"

### 3. Form Layout — Asymmetric Two-Column (desktop)
- Left column (38%): Cover upload area
- Right column (62%): All form fields

### 4. Cover Upload Area
- Large dashed-border drop zone
- Default state: upload icon + "Drop cover image here" text + "or browse" link
- Drag-over state: orange border glow, scale effect
- After upload: cover image preview with hover overlay to change
- Validation: image types only, max 1MB, shown below upload area
- Filename display after selection

### 5. Form Fields (right column)
- Title: text input (required)
- Author: text input (required)
- Description: textarea with character count (max 1000)
- Tags: multi-select dropdown or chip input — searchable, shows existing tags
- Visibility: segmented control (3 options: Public | Private | Unlisted) — styled as pill toggle, not dropdown
- Price: number input with gold coin SVG icon prefix (monospace font)

### 6. PDF Upload Section
- File input with styled button "Choose PDF"
- After selection: filename display + file size + remove button
- Validation: PDF only, max 25MB
- Helper text: "Maximum file size: 25MB"

### 7. Action Buttons
- "Publish Book" primary button (orange)
- "Save as Draft" secondary button
- "Cancel" ghost button

## Key Interactions
- Cover drag-and-drop: border glows orange on drag-over, image preview on drop
- Tag chips: add/remove with spring animation
- Visibility segmented control: sliding indicator
- PDF upload: filename appears with fade-in
- Submit: FormData POST, loading spinner, redirect to book list on success
- Mobile: single column, cover upload on top, fields stacked below
- Tablet: centered single column, max-width constraint
- Desktop: asymmetric 2-column, cover sticky while scrolling form
