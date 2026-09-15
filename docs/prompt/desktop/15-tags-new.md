# Add Tag — Stitch Prompt

## Purpose
Create a new tag for categorizing books. User intent: add a tag name to the system.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Page Header
- Breadcrumb: Home > Tags > Add New
- Heading: "Add New Tag"

### 3. Two-Column Layout (desktop)
- Left (40%): Tag creation form
- Right (60%): Existing tags display

### 4. Tag Form
- Tag name input (required, max 100 chars)
- "Add Tag" primary button (orange)
- Helper text: "Tag names must be unique"

### 5. Existing Tags Display
- Heading: "Existing Tags"
- Tag count badge
- Grid/list of existing tags as pills/chips
- Each tag: name + book count (e.g., "Python (12)")
- Tags sorted by count or name
- Clickable to filter books by that tag (optional)

## Key Interactions
- Submit: POST request, success toast, input clears
- Duplicate: error message if tag already exists
- Existing tags: stagger-in animation on load
- Mobile: stacked (form on top, tags below)
- Tablet: 2-column
- Desktop: sidebar form + main tag grid
