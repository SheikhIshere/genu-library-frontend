# Playlist Detail — Stitch Prompt

## Purpose
View a single playlist's books. User intent: browse books in a curated collection.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Playlist Header
- Playlist name (display heading)
- Description text
- Book count: "X books"
- Created date
- If owner: "Edit Playlist" button (secondary)
- If owner: "Add Book" button (primary, orange)

### 3. Book Grid
- 3 columns desktop, 2 tablet, 1 mobile
- Each book card: same style as book list (cover, title, author, price, favorite)
- Drag-to-reorder handles (if owner, desktop only)
- Empty state: "This playlist is empty" + "Add books" CTA

### 4. Related Playlists (optional section)
- "More Playlists" heading
- Horizontal scroll of other playlist cards

## Key Interactions
- Book cards: click navigates to book detail
- Edit: navigates to /playlists/[slug]/edit
- Add Book: navigates to add-to-playlist flow
- Drag reorder: drag handles, smooth reorder animation
- Mobile: single column, stacked
- Tablet: 2-column grid
- Desktop: 3-column grid with sidebar for playlist info
