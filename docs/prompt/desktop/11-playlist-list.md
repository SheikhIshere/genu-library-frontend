# Playlist List — Stitch Prompt

## Purpose
Browse all user's playlists. User intent: discover and manage playlists.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Page Header
- Heading: "My Playlists"
- "Create New Playlist" primary button (orange, top-right)
- Total playlist count badge

### 3. Filter Bar
- Search input: filter playlists by name
- Sort dropdown: Newest, Oldest, Name A-Z, Most Books

### 4. Playlist Grid
- 3 columns desktop, 2 tablet, 1 mobile
- Each playlist card:
  - Cover collage: 2x2 grid of first 4 book covers (or placeholder if fewer)
  - Playlist name (heading)
  - Description (secondary text, 2 lines max)
  - Book count badge: "X books"
  - Created date
  - Hover: subtle lift + orange glow

### 5. Empty State
- Illustration + "No playlists yet" + "Create your first playlist" CTA button

## Key Interactions
- Search: instant filter with stagger animation on cards
- Sort: instant re-render with transition
- Cards: click navigates to playlist detail
- Create button: navigates to /playlists/new
- Mobile: single column, full-width cards
- Tablet: 2-column grid
- Desktop: 3-column grid
