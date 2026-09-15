# 06 — Profile Page (Mobile)

## 1. Page Title & Route

- **Page**: User Profile
- **Route**: `/profile/:username`
- **Bottom Nav**: Yes — 4-tab bar (Home, Explore, Library, Profile)
- **Mobile breakpoint**: `max-width: 640px`

---

## 2. Mobile-First Design Rationale

Profile is a content-rich page with multiple data sections. On mobile, it uses a scrollable single column with a hero section at top, tabbed content below, and a fixed bottom nav. The tab bar uses horizontal scroll with swipe gesture support between tabs. Pull-to-refresh is supported on the entire page. Share/copy actions live in the top-right corner within thumb reach. Skeleton loading replaces all data sections during initial load.

---

## 3. Mobile Layout Specification

```
<div class="min-h-dvh bg-[#16110f] pb-20">
  <!-- pb-20 accounts for bottom nav height -->
  <!-- Pull-to-refresh wrapper -->
  <div class="relative">
    <!-- Hero section -->
    <!-- Tab bar -->
    <!-- Tab content -->
  </div>
  <!-- Bottom nav fixed -->
</div>
```

- `min-h-dvh` for full viewport
- `pb-20` (80px) — clears fixed bottom nav
- Single column, `px-4` (16px) horizontal padding
- Pull-to-refresh: wrapper div with `overscroll-behavior-y: contain`
- Content scrolls behind fixed bottom nav

---

## 4. Component Breakdown

### 4a. Top Action Bar

```html
<div class="sticky top-0 z-40 bg-[#16110f]/90 backdrop-blur-md border-b border-[#3a322d]">
  <div class="flex items-center justify-between h-14 px-4">
    <button class="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#a89c93]">
      <!-- Back arrow (if navigated from elsewhere) -->
    </button>
    <h2 class="text-sm font-medium text-[#ece0dc]">Profile</h2>
    <div class="flex items-center gap-1">
      <button class="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#a89c93] hover:text-[#ece0dc]"
              aria-label="Share profile">
        <!-- Share icon -->
      </button>
      <button class="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#a89c93] hover:text-[#ece0dc]"
              aria-label="More options">
        <!-- Ellipsis icon -->
      </button>
    </div>
  </div>
</div>
```

- Sticky top bar, `z-40`, translucent canvas with blur
- Back button (conditionally shown), title, share + more buttons
- All buttons: `min-h-[44px] min-w-[44px]`
- Share button: haptic light on tap, opens bottom sheet

### 4b. Hero Section

```html
<section class="flex flex-col items-center py-8 px-4">
  <!-- Avatar -->
  <div class="relative mb-4">
    <img
      src={avatarUrl}
      alt={displayName}
      class="w-24 h-24 rounded-full object-cover border-2 border-[#3a322d]"
    />
    <!-- Verified badge -->
    <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#16110f] flex items-center justify-center">
      <div class="w-5 h-5 rounded-full bg-[#e8693f] flex items-center justify-center">
        <!-- Checkmark SVG, 12px -->
      </div>
    </div>
  </div>

  <!-- Name + Username -->
  <h1 class="font-['Playfair_Display'] text-xl font-bold text-[#ece0dc] tracking-tight">
    {displayName}
  </h1>
  <p class="text-sm text-[#a89c93] mt-1">@{username}</p>

  <!-- Token Balance -->
  <div class="flex items-center gap-2 mt-4 px-4 py-2 bg-[#211a17] border border-[#3a322d] rounded-full">
    <svg class="w-5 h-5 text-[#e8693f]" viewBox="0 0 20 20" fill="currentColor">
      <!-- Gold coin SVG -->
    </svg>
    <span class="font-['JetBrains_Mono'] text-sm font-medium text-[#ece0dc]">
      {tokenBalance.toLocaleString()}
    </span>
  </div>
</section>
```

- Avatar: `w-24 h-24` (96px), `rounded-full`, 2px border
- Verified badge: positioned bottom-right, 24×24px circle
- Name: Playfair Display, `text-xl` (20px), bold
- Username: `text-sm`, secondary color
- Token balance: pill shape, Surface background, gold coin SVG + JetBrains Mono number

### 4c. Stats Row

```html
<div class="flex justify-around py-4 mx-4 border-y border-[#3a322d]">
  <div class="flex flex-col items-center gap-1">
    <span class="font-['JetBrains_Mono'] text-lg font-semibold text-[#ece0dc]">
      {uploadCount}
    </span>
    <span class="text-xs text-[#a89c93]">Uploads</span>
  </div>
  <div class="flex flex-col items-center gap-1">
    <span class="font-['JetBrains_Mono'] text-lg font-semibold text-[#ece0dc]">
      {favoriteCount}
    </span>
    <span class="text-xs text-[#a89c93]">Favorites</span>
  </div>
  <div class="flex flex-col items-center gap-1">
    <span class="font-['JetBrains_Mono'] text-lg font-semibold text-[#ece0dc]">
      {avgRating}
    </span>
    <span class="text-xs text-[#a89c93]">Avg Rating</span>
  </div>
</div>
```

- `flex justify-around` — 3 equal-width stat columns
- Numbers: JetBrains Mono, `text-lg`, bold
- Labels: `text-xs`, secondary color
- Top/bottom borders separate from hero and tabs

### 4d. Tab Bar

```html
<div class="sticky top-14 z-30 bg-[#16110f] border-b border-[#3a322d]">
  <div class="flex overflow-x-auto scrollbar-hide" role="tablist">
    {['Overview', 'Books', 'Reviews', 'Playlists'].map((tab) => (
      <button
        key={tab}
        role="tab"
        aria-selected={activeTab === tab}
        class={`relative flex-shrink-0 min-h-[48px] px-5 text-sm font-medium transition-colors
          ${activeTab === tab ? 'text-[#e8693f]' : 'text-[#a89c93]'}`}
      >
        {tab}
        {activeTab === tab && (
          <motion.div
            layoutId="tab-indicator"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e8693f]"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
      </button>
    ))}
  </div>
</div>
```

- Sticky below top bar, `z-30`
- Horizontal scroll with `overflow-x-auto`, hidden scrollbar
- Each tab: `min-h-[48px]`, `px-5`
- Active tab: accent color text + animated underline indicator
- Underline: `motion.div` with `layoutId="tab-indicator"` for spring slide
- Swipe gesture: detect horizontal swipe on tab content area to switch tabs

### 4e. Tab Content Panels

#### Overview Tab

```html
<div class="px-4 py-6 flex flex-col gap-6">
  <!-- Bio -->
  <div>
    <h3 class="text-xs font-medium text-[#7a706a] uppercase tracking-widest mb-2">About</h3>
    <p class="text-sm text-[#ece0dc] leading-relaxed">{bio}</p>
  </div>

  <!-- Address -->
  {address && (
    <div>
      <h3 class="text-xs font-medium text-[#7a706a] uppercase tracking-widest mb-2">Location</h3>
      <p class="text-sm text-[#a89c93]">{address}</p>
    </div>
  )}

  <!-- Social Links -->
  {socialLinks.length > 0 && (
    <div>
      <h3 class="text-xs font-medium text-[#7a706a] uppercase tracking-widest mb-3">Links</h3>
      <div class="flex flex-col gap-2">
        {socialLinks.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 min-h-[44px] px-3 py-2 bg-[#211a17] border border-[#3a322d] rounded-lg
                   text-sm text-[#ece0dc] hover:border-[#4d433d] transition-colors"
          >
            <span class="text-[#a89c93]"><!-- icon --></span>
            <span class="truncate">{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  )}
</div>
```

- Section headers: uppercase, `tracking-widest`, `text-xs`, muted color
- Bio: `text-sm`, `leading-relaxed`
- Social links: card-style rows, each `min-h-[44px]`
- Single column, `gap-6` between sections

#### Books Tab

```html
<div class="px-4 py-6">
  <div class="grid grid-cols-1 gap-4">
    {books.map((book) => (
      <BookCard key={book.id} book={book} />
    ))}
  </div>
</div>
```

- `grid-cols-1` — single column on mobile
- `gap-4` between cards

#### Reviews Tab

```html
<div class="px-4 py-6 flex flex-col gap-4">
  {reviews.map((review) => (
    <ReviewCard key={review.id} review={review} />
  ))}
</div>
```

- Vertical stack, `gap-4`

#### Playlists Tab

```html
<div class="px-4 py-6 grid grid-cols-1 gap-4">
  {playlists.map((playlist) => (
    <PlaylistCard key={playlist.id} playlist={playlist} />
  ))}
</div>
```

- `grid-cols-1` — single column on mobile

### 4f. Bottom Navigation Bar

```html
<nav class="fixed bottom-0 inset-x-0 z-50 bg-[#16110f]/90 backdrop-blur-md border-t border-[#3a322d]"
     style="padding-bottom: env(safe-area-inset-bottom)">
  <div class="flex items-center justify-around h-16">
    <a href="/" class="flex flex-col items-center gap-1 min-h-[48px] min-w-[48px] justify-center text-[#a89c93]">
      <svg class="w-6 h-6"><!-- Home icon --></svg>
      <span class="text-xs">Home</span>
    </a>
    <a href="/explore" class="flex flex-col items-center gap-1 min-h-[48px] min-w-[48px] justify-center text-[#a89c93]">
      <svg class="w-6 h-6"><!-- Explore icon --></svg>
      <span class="text-xs">Explore</span>
    </a>
    <a href="/library" class="flex flex-col items-center gap-1 min-h-[48px] min-w-[48px] justify-center text-[#a89c93]">
      <svg class="w-6 h-6"><!-- Library icon --></svg>
      <span class="text-xs">Library</span>
    </a>
    <a href="/profile" class="flex flex-col items-center gap-1 min-h-[48px] min-w-[48px] justify-center text-[#e8693f]"
       aria-current="page">
      <svg class="w-6 h-6"><!-- Profile icon, filled --></svg>
      <span class="text-xs">Profile</span>
    </a>
  </div>
</nav>
```

- `fixed bottom-0 inset-x-0 z-50`
- Translucent canvas with blur
- `padding-bottom: env(safe-area-inset-bottom)` for iOS safe area
- 4 tabs, each `min-h-[48px] min-w-[48px]`
- Active tab: accent color, filled icon
- Haptic: light on tab switch

### 4g. Skeleton Loading States

```html
<!-- Hero skeleton -->
<section class="flex flex-col items-center py-8 px-4">
  <div class="w-24 h-24 rounded-full bg-[#211a17] animate-pulse mb-4"></div>
  <div class="h-5 w-32 bg-[#211a17] rounded animate-pulse mb-2"></div>
  <div class="h-4 w-24 bg-[#211a17] rounded animate-pulse"></div>
</section>

<!-- Stats skeleton -->
<div class="flex justify-around py-4 mx-4 border-y border-[#3a322d]">
  {[1, 2, 3].map((i) => (
    <div key={i} class="flex flex-col items-center gap-1">
      <div class="h-6 w-10 bg-[#211a17] rounded animate-pulse"></div>
      <div class="h-3 w-12 bg-[#211a17] rounded animate-pulse"></div>
    </div>
  ))}
</div>

<!-- Tab content skeleton -->
<div class="px-4 py-6 flex flex-col gap-4">
  {[1, 2, 3].map((i) => (
    <div key={i} class="h-24 bg-[#211a17] rounded-xl animate-pulse"></div>
  ))}
</div>
```

- All skeleton elements: `bg-[#211a17] animate-pulse`
- Rounded shapes match actual content dimensions
- Pulse animation: default Tailwind `animate-pulse`

---

## 5. Mobile Interactions

| Interaction | Behavior |
|---|---|
| **Pull to refresh** | `overscroll-behavior-y: contain` on wrapper. On pull-down: show refresh spinner at top, re-fetch profile data. Haptic: medium on refresh trigger |
| **Tab swipe** | Horizontal swipe on tab content switches to adjacent tab. Animated underline follows. Haptic: light on tab switch |
| **Tab tap** | Tap tab → switch content, underline slides via `layoutId`. Haptic: light |
| **Share button tap** | Opens bottom sheet with share options (Copy Link, Twitter, Copy vCard). Haptic: medium |
| **More options tap** | Opens bottom sheet with profile actions (Report, Block). Haptic: light |
| **Avatar press** | If own profile: opens bottom sheet with "Change photo" / "Remove photo". Haptic: light |
| **Token balance press** | Navigate to /tokens/history. Haptic: light |
| **Social link tap** | Opens external link in new tab. Haptic: light |
| **Stat item tap** | Navigate to corresponding list (e.g., /profile/:user/uploads). Haptic: light |
| **Bottom nav tap** | Haptic: light. Navigate to route. Active state: accent color |
| **Back swipe** | Left edge swipe triggers browser back. Standard iOS/Android behavior |

---

## 6. Animation Spec (Framer Motion)

```tsx
// Page entry
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>

// Hero avatar
<motion.img
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
/>

// Stats counter
<motion.span
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 + index * 0.1 }}
/>

// Tab indicator
<motion.div
  layoutId="tab-indicator"
  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
/>

// Tab content switch
<motion.div
  key={activeTab}
  initial={{ opacity: 0, x: direction * 20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: direction * -20 }}
  transition={{ duration: 0.2 }}
/>

// Bottom sheet
<motion.div
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
/>

// Book card stagger
{books.map((book, i) => (
  <motion.div
    key={book.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.06 }}
  />
))}
```

- Avatar: spring scale-in
- Stats: staggered fade-up
- Tab indicator: spring slide via layoutId
- Tab content: directional slide (left/right based on swipe direction)
- Bottom sheet: spring slide from bottom
- Content cards: staggered fade-up

---

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] Bottom nav present and fixed at bottom
- [ ] `pb-20` on main content to clear bottom nav
- [ ] `env(safe-area-inset-bottom)` on bottom nav for iOS
- [ ] `min-h-[48px]` on all buttons and interactive elements
- [ ] `min-h-[44px] min-w-[44px]` on icon-only buttons
- [ ] Pull-to-refresh supported
- [ ] Tab bar scrollable horizontally on small screens
- [ ] Swipe gesture switches between tabs
- [ ] Skeleton loading for all data sections
- [ ] Single column layout (grid-cols-1)
- [ ] Share/more actions use bottom sheets, not modals
- [ ] No glassmorphism, no indigo/blue/purple
- [ ] No shadow-lg, no gradient backgrounds
- [ ] `min-h-dvh` for viewport
- [ ] Bottom nav haptic on tab switch
- [ ] Tab underline animates via Framer Motion
- [ ] Avatar is 96×96px, rounded-full
- [ ] Token balance uses JetBrains Mono
- [ ] Section headers uppercase with tracking-widest

---

## 8. Complete Stitch Prompt

```
Build a mobile-only Profile page (max-width: 640px) for the Forge & Flux library app.

## Tech
React, Tailwind CSS, Framer Motion, React Router v6.

## Route & Nav
- Route: /profile/:username
- Bottom navigation bar: YES, fixed at bottom
- Bottom nav has 4 tabs: Home (/), Explore (/explore), Library (/library), Profile (/profile)
- Active tab (Profile): accent color #e8693f, filled icon
- Inactive tabs: text-[#a89c93]
- Bottom nav: fixed bottom-0 inset-x-0 z-50, bg-[#16110f]/90 backdrop-blur-md border-t border-[#3a322d]
- Safe area padding: style="padding-bottom: env(safe-area-inset-bottom)"
- Each nav item: min-h-[48px] min-w-[48px], flex flex-col items-center gap-1 justify-center
- Icon: w-6 h-6, label: text-xs
- Haptic: light on tab switch

## Layout
- Outer: min-h-dvh bg-[#16110f] pb-20 (clears bottom nav)
- Single column, px-4 horizontal padding
- Pull-to-refresh: wrapper with overscroll-behavior-y contain

## Top Action Bar
- Sticky top-0 z-40, bg-[#16110f]/90 backdrop-blur-md border-b border-[#3a322d]
- Height h-14, flex items-center justify-between px-4
- Left: back button (min-h-[44px] min-w-[44px], text-[#a89c93]), conditional
- Center: "Profile" text-sm font-medium text-[#ece0dc]
- Right: share button + more (ellipsis) button, each min-h-[44px] min-w-[44px], text-[#a89c93]
- Share tap: haptic medium, opens bottom sheet

## Hero Section
- flex flex-col items-center py-8 px-4
- Avatar: w-24 h-24 rounded-full object-cover border-2 border-[#3a322d]
- Verified badge: absolute -bottom-1 -right-1, w-6 h-6 rounded-full bg-[#16110f] inner w-5 h-5 rounded-full bg-[#e8693f] with white checkmark SVG
- Name: font-['Playfair_Display'] text-xl font-bold text-[#ece0dc] tracking-tight, mt-2
- Username: text-sm text-[#a89c93] mt-1, format "@username"
- Token balance: flex items-center gap-2 mt-4, px-4 py-2 bg-[#211a17] border border-[#3a322d] rounded-full
  - Gold coin SVG: w-5 h-5 text-[#e8693f]
  - Number: font-['JetBrains_Mono'] text-sm font-medium text-[#ece0dc], formatted with toLocaleString()

## Stats Row
- flex justify-around py-4 mx-4 border-y border-[#3a322d]
- 3 items: Uploads, Favorites, Avg Rating
- Each: flex flex-col items-center gap-1
- Number: font-['JetBrains_Mono'] text-lg font-semibold text-[#ece0dc]
- Label: text-xs text-[#a89c93]
- Numbers animate in with stagger (delay 0.2 + index * 0.1)

## Tab Bar
- Sticky top-14 z-30, bg-[#16110f] border-b border-[#3a322d]
- Container: flex overflow-x-auto scrollbar-hide, role="tablist"
- Tabs: Overview, Books, Reviews, Playlists
- Each tab: relative flex-shrink-0 min-h-[48px] px-5 text-sm font-medium
- Active: text-[#e8693f], Inactive: text-[#a89c93]
- Active indicator: motion.div layoutId="tab-indicator", absolute bottom-0 left-0 right-0 h-0.5 bg-[#e8693f], transition type spring stiffness 500 damping 35
- Swipe gesture: detect horizontal swipe on tab content, switch to adjacent tab with directional animation
- Haptic: light on tab switch (tap or swipe)

## Tab Content

### Overview
- px-4 py-6 flex flex-col gap-6
- Bio section: h3 "ABOUT" in text-xs font-medium text-[#7a706a] uppercase tracking-widest mb-2, p text-sm text-[#ece0dc] leading-relaxed
- Location section: same header style "LOCATION", p text-sm text-[#a89c93]
- Social Links section: header "LINKS", flex flex-col gap-2
  - Each link: flex items-center gap-3 min-h-[44px] px-3 py-2 bg-[#211a17] border border-[#3a322d] rounded-lg text-sm text-[#ece0dc] hover:border-[#4d433d] transition-colors
  - Icon + label, label truncated

### Books
- px-4 py-6 grid grid-cols-1 gap-4
- Book cards rendered as BookCard component

### Reviews
- px-4 py-6 flex flex-col gap-4
- Review cards rendered as ReviewCard component

### Playlists
- px-4 py-6 grid grid-cols-1 gap-4
- Playlist cards rendered as PlaylistCard component

## Bottom Sheets
- Share sheet: triggered by share button
  - Options: "Copy Link" (copy URL to clipboard, haptic medium), "Share on Twitter" (open intent), "Copy vCard" (copy contact, haptic medium)
  - Each option: min-h-[48px], flex items-center gap-3, px-4, text-sm text-[#ece0dc]
  - Close on backdrop tap or swipe down
- More options sheet: triggered by ellipsis button
  - Options: "Report profile", "Block user"
  - Same styling as share sheet
- Sheet animation: motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}, transition type spring damping 25 stiffness 300

## Skeleton Loading
- Hero: w-24 h-24 rounded-full bg-[#211a17] animate-pulse + two text skeletons
- Stats: 3 h-6 w-10 + h-3 w-12 skeletons
- Tab content: 3 × h-24 bg-[#211a17] rounded-xl animate-pulse
- All use bg-[#211a17] animate-pulse

## Interactions
1. Pull to refresh: overscroll-behavior-y contain, show refresh spinner, re-fetch data, haptic medium
2. Tab swipe: horizontal swipe switches tabs, directional slide animation
3. Tab tap: switch content, underline slides, haptic light
4. Share tap: open bottom sheet, haptic medium
5. Token balance tap: navigate to /tokens/history, haptic light
6. Social link tap: open external URL, haptic light
7. Bottom nav tap: haptic light, navigate
8. Back swipe: standard browser back

## Framer Motion
- Page: initial={{ opacity: 0 }} animate={{ opacity: 1 }} duration 0.3
- Avatar: initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} spring stiffness 300
- Stats: stagger fade-up, delay 0.2 + i * 0.1
- Tab indicator: layoutId="tab-indicator", spring stiffness 500 damping 35
- Tab content: key={activeTab}, initial={{ opacity: 0, x: dir * 20 }} animate={{ opacity: 1, x: 0 }}
- Bottom sheet: spring slide from bottom
- Cards: stagger fade-up, delay i * 0.06

## Design Tokens (Forge & Flux)
- Canvas: #16110f, Surface: #211a17
- Primary: #e8693f, Hover: #d45a30
- Border: #3a322d, Hover: #4d433d
- Text: #ece0dc, #a89c93, #7a706a
- Fonts: Playfair Display (display), Inter (body), JetBrains Mono (mono)
- Radius: 8px, 12px, 9999px

## Anti-Slop Rules
- Bottom nav present with env(safe-area-inset-bottom)
- pb-20 on content to clear nav
- Every button min-h-[48px] or min-h-[44px] min-w-[44px]
- Pull to refresh supported
- Skeleton loading for all data
- Single column layout
- Bottom sheets only, no modals
- No glassmorphism, no indigo/blue/purple, no shadow-lg, no gradient backgrounds
- All colors from Forge & Flux palette only
```