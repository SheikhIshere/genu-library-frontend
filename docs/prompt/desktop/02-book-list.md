# Book List — Stitch Prompt

## Purpose
Browse and search the full book catalog. User intent: find books by search, filter by tags, sort by various criteria, paginate through results.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (same as home page, sticky)

### 2. Page Header
- Breadcrumb: Home > Books
- Page title: "Book Collection"
- Total books count badge

### 3. Filter Bar (sticky below nav on scroll)
- Left: Search input with magnifying glass, debounced
- Center: Sort dropdown (Newest, Oldest, Price: Low→High, Price: High→Low, Highest Rated)
- Right: Active filter count with clear button
- Below: Horizontal scrollable row of tag filter chips (pill-shaped), active tag highlighted with orange border

### 4. Book Grid
- 3 columns desktop, 2 tablet, 1 mobile
- Each book card:
  - Cover image (aspect ratio maintained, object-fit cover)
  - Title (heading weight)
  - Author name (secondary text)
  - Favorite heart icon (top-right corner of card, toggles with bounce animation)
  - Price badge with coin icon (bottom-right)
  - Hover: card lifts, subtle orange glow, image scales up slightly
- Empty state: illustration + "No books found" message + clear filters button

### 5. Pagination (bottom)
- Previous/Next buttons
- Page number buttons (with ellipsis for large ranges)
- Current page highlighted with orange
- "Page X of Y" text
- Clicking page scrolls to top of grid smoothly

## Key Interactions
- Search: live filter, debounced 300ms
- Sort: instant re-render with smooth card transition animation (stagger)
- Tag chips: toggle active/inactive, filter books by tag
- Pagination: URL query param `?page=X`, smooth scroll to top
- Mobile: filters stack vertically, bottom pagination
- Cards: stagger-in animation on load/filter change
