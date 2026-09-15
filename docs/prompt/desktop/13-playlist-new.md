# Create Playlist — Stitch Prompt

## Purpose
Create a new playlist. User intent: name playlist, add description, select books to include.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Page Header
- Breadcrumb: Home > Playlists > Create
- Heading: "Create Playlist"

### 3. Form Section
- Name input (required, max 100 chars)
- Description textarea (optional)

### 4. Book Picker Grid
- Heading: "Select Books"
- Search input to filter books
- Grid of book cards with checkbox overlay (checkmark in corner)
- Each card: cover image, title, author, price
- Selected cards: orange border + checkmark badge
- "Select All" / "Clear Selection" buttons
- Selected count: "X books selected"

### 5. Action Buttons
- "Create Playlist" primary (orange)
- "Cancel" secondary

## Key Interactions
- Book selection: click card toggles checkbox, orange border spring animation
- Search: instant filter of book grid
- Select All: checks all visible books
- Clear: deselects all
- Create: POST request, redirect to new playlist detail
- Mobile: full-width cards, single column
- Tablet: 2-column book grid
- Desktop: 3-column book grid, sidebar with form fields
