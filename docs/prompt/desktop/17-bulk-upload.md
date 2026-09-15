# Bulk Book Upload — Stitch Prompt

## Purpose
Upload multiple books at once via structured text input and file upload. User intent: batch-create book entries efficiently.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Page Header
- Breadcrumb: Home > Bulk Upload
- Heading: "Bulk Book Upload"
- Permission note: "Admin only" badge

### 3. Two-Section Layout

### 4. Text Input Section
- Large textarea for structured bulk data
- Monospace font for the textarea
- Placeholder showing example format:
  ```
  Title: Book Name
  Author: Author Name
  Description: Short description
  Tags: tag1, tag2
  Price: 100
  ---
  Title: Another Book
  ...
  ```
- Helper text explaining the brace/comma format
- "Preview" button to validate parsed data before upload

### 5. File Upload Section
- Drag-and-drop zone for PDF files (multiple files allowed)
- Dashed border, upload icon
- Drag-over: orange glow
- After drop: file list with filenames, sizes, remove buttons
- Files matched to text entries by name/index

### 6. Results Area (after upload)
- Success count + error count summary
- List of created books with status (success/error)
- Error details expandable per item

### 7. PowerShell Template (collapsible)
- Pre-written command template for generating bulk prompts with AI
- Code block with copy button
- Collapsible/expandable section

### 8. Action Buttons
- "Upload All" primary button (orange)
- "Clear All" ghost button

## Key Interactions
- Textarea: monospace, tab key inserts spaces (not browser default)
- File drag-drop: visual feedback on drag-over
- Preview: parses text and shows structured preview cards
- Upload: POST with FormData, progress indication
- Results: stagger-in animation for result cards
- Mobile: stacked sections, full-width
- Tablet: 2-column layout
- Desktop: side-by-side text + file upload
