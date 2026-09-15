# Profile View — Stitch Prompt

## Purpose
View a user's public profile with their books, reviews, playlists. User intent: learn about a user and their contributions.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Profile Hero Section
- Full-width banner area with dark surface background
- Left: Large circular avatar with golden gradient border frame
- Right of avatar: Username (display heading), verified badge (if verified — orange checkmark), age badge
- Below: Token balance display with coin icon (monospace, formatted with K/M suffixes)
- Contact row: email icon + email, phone icon + phone number
- Social link (if set): external link icon
- Right side (desktop): Share button, Copy Profile button, Download vCard button

### 3. Stats Bar (3 cards in a row)
- "Uploads" — animated count number
- "Favorites Received" — animated count
- "Average Rating" — star display + number
- Numbers animate up on scroll into view

### 4. Tabbed Content Area
- Tab bar: Overview | Books | Reviews | Playlists
- Active tab: orange underline indicator that slides to active tab with spring animation
- Content crossfades on tab switch

### 5. Overview Tab (default)
- Bio/description section
- Address section
- Quick stats summary

### 6. Books Tab
- Grid of user's uploaded books (3 col desktop, 2 tablet, 1 mobile)
- Same book card style as book list

### 7. Reviews Tab
- List of user's reviews with book cover thumbnail, rating stars, comment text, timestamp

### 8. Playlists Tab
- Grid of user's playlists
- Each playlist card: cover collage (2x2 book covers), name, description, book count

## Key Interactions
- Avatar: subtle float on hover, golden frame glow
- Stats: animated counter on scroll
- Tabs: underline indicator slides with spring physics, content crossfade
- Share: Web Share API with clipboard fallback, copy feedback (spring pop)
- vCard: triggers download of .vcf file
- Mobile: stacked hero, scrollable tabs
- Tablet: side-by-side avatar + info, 2-col content
- Desktop: 3-column layout, sidebar for related content
