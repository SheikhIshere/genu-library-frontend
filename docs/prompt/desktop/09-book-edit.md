# Edit Book — Stitch Prompt

## Purpose
Edit an existing book's details. User intent: update metadata, change cover, adjust visibility/price. No PDF re-upload.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Page Header
- Breadcrumb: Home > Books > [Book Title] > Edit
- Heading: "Edit Book"
- Book title in secondary text below heading

### 3. Form Layout — Same as Add Book (asymmetric 2-column desktop)

### 4. Cover Section
- Current cover image displayed (not upload zone by default)
- Hover overlay (desktop): dark overlay + "Change Cover" text + camera icon
- Click: opens file picker
- After new selection: preview replaces current image
- No "remove" — just replace

### 5. Form Fields (pre-populated)
- Title: text input (pre-filled)
- Author: text input (pre-filled)
- Description: textarea (pre-filled, character count)
- Tags: chips showing current tags, add/remove
- Visibility: segmented control (pre-selected)
- Price: number input with coin icon (pre-filled)
- NO PDF upload field (excluded from edit form)

### 6. Action Buttons
- "Save Changes" primary (orange)
- "Cancel" secondary
- "Delete Book" danger button (red, right-aligned or bottom)

## Key Interactions
- All fields pre-populated from existing book data
- Cover hover overlay reveals change option
- Save: PATCH request, loading spinner, redirect to book detail
- Delete: confirmation dialog/modal before navigation to delete page
- Mobile: stacked, cover on top
- Tablet: centered single column
- Desktop: cover left, form right, asymmetric grid
