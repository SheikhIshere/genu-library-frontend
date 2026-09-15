# Delete Book Confirmation — Stitch Prompt

## Purpose
Confirm book deletion. User intent: permanently remove a book from the platform.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Centered Confirmation Card
- Warning icon (large, orange or red)
- Heading: "Delete Book"
- Book title in bold below heading
- Warning message: "This action cannot be undone. The book and all its data will be permanently removed."
- Book preview: small cover thumbnail + title + author

### 3. Action Buttons
- "Delete Permanently" danger button (red background)
- "Cancel" secondary button (outlined)
- Both centered, Delete on left, Cancel on right (or stacked on mobile)

### 4. Subtle Details
- Delete button has slight shake animation on hover (optional, subtle)
- Keyboard: Escape navigates back, Enter does not auto-confirm (safety)

## Key Interactions
- Delete: DELETE request, loading spinner, redirect to book list with success toast
- Cancel: navigate back to book detail
- Focus management: Cancel button focused by default (safety against accidental delete)
- Mobile: full-width buttons stacked
- Tablet: centered card
- Desktop: centered card with max-width constraint
