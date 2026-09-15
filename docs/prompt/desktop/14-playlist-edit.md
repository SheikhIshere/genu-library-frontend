# Edit Playlist — Stitch Prompt

## Purpose
Edit an existing playlist. User intent: change name, description, add/remove books.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Page Header
- Breadcrumb: Home > Playlists > [Name] > Edit
- Heading: "Edit Playlist"
- Current playlist name in secondary text

### 3. Form Section (pre-populated)
- Name input (pre-filled)
- Description textarea (pre-filled)

### 4. Book Picker Grid (pre-selected)
- Same as create playlist but with current books pre-checked
- Search to add more books
- Uncheck to remove books
- Visual: selected cards have orange border + checkmark

### 5. Action Buttons
- "Save Changes" primary (orange)
- "Cancel" secondary
- "Delete Playlist" danger button (bottom)

## Key Interactions
- All fields pre-populated
- Book selection: toggle with spring animation
- Save: PATCH request, redirect to playlist detail
- Delete: confirmation, DELETE request, redirect to playlist list
- Mobile: stacked layout
- Tablet: centered
- Desktop: 2-column with form left, book picker right
