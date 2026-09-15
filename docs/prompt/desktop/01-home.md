# Home Page — Stitch Prompt

## Purpose
Landing page for a digital library/book platform. User intent: discover books, search, browse featured/recent titles, see platform stats.

## Platform
Web, Desktop-first, responsive across mobile/tablet/desktop.

## Page Structure

### 1. Navigation Bar (sticky, top)
- Left: Logo/brand name "Genu Library"
- Center: Search input with magnifying glass icon, debounced autocomplete dropdown showing book titles/authors/tags as user types
- Right: Auth section — if logged in: user avatar + dropdown menu (Profile, My Playlists, Logout); if not: Login + Sign Up buttons
- Below right: Gold coin icon with token balance number (formatted with K/M/B suffixes for large numbers)

### 2. Hero Section (full-width, generous padding)
- Large display heading: "Discover Your Next Great Read"
- Subtext paragraph below heading
- Large centered search bar with orange accent border on focus, placeholder text
- Below search: horizontal row of trending tag chips (pill-shaped, clickable)
- Right side (desktop only): decorative abstract book illustration or geometric shapes

### 3. Stats Counter Bar (horizontal strip)
- Three stat cards in a row: "Total Books" | "Active Readers" | "Reviews Written"
- Each stat: large monospace number (animated counter that counts up on scroll into view) + label below
- Numbers use abbreviated format (e.g., "1.2K", "340")

### 4. Featured Books Section
- Section heading: "Featured Collection"
- Horizontal carousel of book cards (draggable, touch-swipeable, auto-advances every 3.5 seconds)
- Each card: book cover image, title, author, favorite heart icon, price badge with coin icon
- Below carousel: dot indicators showing current position
- Cards have hover lift effect with subtle orange glow

### 5. Recent Additions Section
- Section heading: "Recently Added"
- Grid of book cards: 3 columns desktop, 2 tablet, 1 mobile
- Each card: cover image, title, author, upload date, price
- Cards clickable, navigate to book detail
- Hover: slight lift + image zoom

### 6. Call-to-Action Section
- Full-width banner with dark surface background
- Heading: "Share Your Knowledge"
- Subtext about uploading books
- Primary CTA button: "Start Uploading" (orange)
- Secondary text link: "Browse All Books"

### 7. Footer
- Left column: Brand name + short about text
- Center: Quick links (Home, Books, Playlists, Upload)
- Right: Social media icon links
- Bottom: Copyright line + newsletter email input with subscribe button

## Key Interactions
- Search autocomplete: debounced fetch, shows dropdown with results, keyboard navigable
- Carousel: drag to scroll, autoplay pauses on hover, dot navigation
- Stats counter: animated count-up triggered by scroll intersection
- Book cards: hover lift, click navigates to detail
- Mobile: hamburger menu replaces nav links, single column layout
- Tablet: 2-column grids, condensed hero
