# Bulk Tag Upload — Stitch Prompt

## Purpose
Create multiple tags at once via text input. User intent: batch-add tags from a comma/newline-separated list.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Page Header
- Breadcrumb: Home > Bulk Upload > Tags
- Heading: "Bulk Tag Upload"
- Permission badge: "Admin only"

### 3. Two-Column Layout (desktop)
- Left: Tag input form
- Right: Existing tags display

### 4. Tag Input Section
- Large textarea for tag names
- Format: comma-separated or one-per-line
- Placeholder: "python, machine-learning, django\nweb-development, react"
- Helper text: "Separate tags with commas or new lines. Duplicates will be skipped."

### 5. Existing Tags Preview
- Heading: "Existing Tags"
- Tag cloud/list showing current tags with book counts
- Sorted by count (most used first)
- Visual pills with count badges

### 6. Results Section (after upload)
- Summary: "X tags created, Y skipped (duplicates)"
- List of newly created tags
- Stagger-in animation

### 7. Action Buttons
- "Upload Tags" primary button (green/forest color — different from standard orange to distinguish bulk actions)
- "Clear" ghost button

## Key Interactions
- Textarea input: real-time preview of parsed tags below textarea
- Duplicate detection: highlighted in preview before upload
- Upload: POST request, success summary with counts
- Results: animated entry
- Mobile: stacked (input on top, existing tags below)
- Tablet: 2-column
- Desktop: sidebar input + main tag cloud
