# Book Detail — Stitch Prompt

## Purpose
View a single book's full details, read PDF, rate, comment, favorite. User intent: consume book content and interact with it.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Book Header Section
- Left: Large book cover image with rounded corners
- Right (desktop) / Below (mobile): 
  - Book title (display heading)
  - Author name (secondary text, clickable)
  - Uploader info with avatar + username link
  - Visibility badge (Public/Private/Unlisted)
  - Price display with gold coin icon (monospace font)
  - Favorite button (heart icon, toggleable, optimistic update with count)
  - Action buttons: "Read PDF" (primary), "Report" (secondary)
  - Upload date and last updated date

### 3. PDF Viewer Section (full-width)
- PDF.js embedded viewer
- Controls toolbar: Previous page, Page number input, Next page, Zoom in/out, Fullscreen toggle
- PDF renders in dark-themed container
- Mobile: touch swipe for page navigation, pinch-to-zoom
- Desktop: scroll within container, keyboard shortcuts (arrow keys, +/-)
- Page indicator: "Page X of Y" in monospace

### 4. Book Description
- Full description text
- "Read more" expand/collapse if long

### 5. Rating Section
- Star rating display (1-5 stars, half-star support)
- Your rating: interactive star selector (hover preview fills stars orange, click to rate)
- Average rating with total ratings count
- Rating distribution bar chart (optional)

### 6. Comments Section
- Section heading: "Comments" with count
- Comment form at top: textarea with character count, anonymous name input, submit button
- Comment list below:
  - Each comment: avatar (first letter fallback), username, timestamp (natural time like "2 hours ago"), comment text
  - Stagger-in animation on load
- "Load more" button if many comments

### 7. Related Books Section
- Horizontal scrollable row on mobile, 4-column grid on desktop
- Same card style as book list
- Section heading: "You Might Also Like"

## Key Interactions
- Favorite toggle: optimistic update, heart bounces, count abbreviates (BigInt format)
- Star rating: hover shows preview fill, click saves with spring animation
- PDF viewer: smooth page transitions, zoom with smooth scale
- Comments: stagger reveal, Ctrl+Enter to submit
- Mobile: PDF viewer full-width, swipe navigation
- Tablet: 2-column header, full-width PDF
- Desktop: cover left + details right, sticky PDF controls
