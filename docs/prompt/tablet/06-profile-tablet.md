# 06 — Profile Page (Tablet Breakpoint 641px–1024px)

---

## 1. Page Title & Route

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Page**       | Profile                            |
| **Route**      | `/profile`                         |
| **Component**  | `ProfilePageTablet`                |
| **Nav Tab**    | Profile (top nav)                  |
| **Breakpoint** | 641px–1024px (tablet)             |

---

## 2. Tablet Design Rationale

Tablet replaces the mobile bottom nav with a horizontal top nav. The 2-column layout uses the wider viewport: left column holds avatar + stats, right column holds tabbed content (books, playlists, settings). Avatar is larger (w-32). Stats display in a 3-column row. Content grids use 2 columns. Tabs use an underline indicator (not pill tabs). Hover states are enabled.

---

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────────────┐
│ TOP NAV: [Logo]  [Home]  [Browse]  [Profile]     [Avatar▼] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────┬──────────────────────────────────┐   │
│  │ LEFT COLUMN        │ RIGHT COLUMN                     │   │
│  │ (w-80, sticky)     │ (flex-1)                         │   │
│  │                    │                                  │   │
│  │   ┌──────────┐     │  ┌──────┬──────────┬──────────┐  │   │
│  │   │  Avatar  │     │  │ Books│ Playlists│ Settings │  │   │
│  │   │  w-32    │     │  │──────┴──────────┴──────────┘  │   │
│  │   └──────────┘     │  │  underline indicator          │   │
│  │                    │  │                               │   │
│  │   Username         │  │  ┌──────┐ ┌──────┐           │   │
│  │   @handle          │  │  │ Book │ │ Book │           │   │
│  │                    │  │  │ Card │ │ Card │           │   │
│  │   ┌───┬───┬───┐   │  │  └──────┘ └──────┘           │   │
│  │   │ 12│ 34│ 56│   │  │  ┌──────┐ ┌──────┐           │   │
│  │   │Bks│Pls│Fav│   │  │  │ Book │ │ Book │           │   │
│  │   └───┴───┴───┘   │  │  └──────┘ └──────┘           │   │
│  │                    │                                  │   │
│  └────────────────────┴──────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Component Breakdown

```tsx
// ProfilePageTablet.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const FORGE_TOKENS = {
  canvas: "#16110f",
  surface: "#211a17",
  surfaceHover: "#2a211c",
  accent: "#e8693f",
  accentHover: "#d45a30",
  accentMuted: "#e8693f20",
  border: "#3a322d",
  borderHover: "#4d433d",
  textPrimary: "#ece0dc",
  textSecondary: "#a89c93",
  textMuted: "#7a706a",
  textOnAccent: "#16110f",
};

type TabKey = "books" | "playlists" | "settings";

const TABS: { key: TabKey; label: string }[] = [
  { key: "books", label: "Books" },
  { key: "playlists", label: "Playlists" },
  { key: "settings", label: "Settings" },
];

export function ProfilePageTablet() {
  const [activeTab, setActiveTab] = useState<TabKey>("books");
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#16110f] flex flex-col">
      {/* Top Nav */}
      <nav className="h-16 border-b border-[#3a322d] flex items-center justify-between px-6">
        <Link to="/" className="font-['Playfair_Display'] text-xl text-[#ece0dc]">
          Library
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm text-[#a89c93] hover:text-[#ece0dc] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center">
            Home
          </Link>
          <Link to="/browse" className="text-sm text-[#a89c93] hover:text-[#ece0dc] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center">
            Browse
          </Link>
          <Link
            to="/profile"
            className="text-sm text-[#e8693f] font-medium min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            Profile
          </Link>
          <div className="w-8 h-8 rounded-full bg-[#2a211c] border border-[#3a322d] flex items-center justify-center text-xs text-[#a89c93]">
            U
          </div>
        </div>
      </nav>

      {/* Profile Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-5xl mx-auto flex gap-8">
          {/* Left Column — Avatar & Stats */}
          <aside className="w-80 shrink-0">
            <div className="bg-[#211a17] border border-[#3a322d] rounded-xl p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-32 h-32 rounded-full bg-[#2a211c] border-2 border-[#3a322d] flex items-center justify-center text-4xl text-[#7a706a] mb-4 overflow-hidden">
                  <img
                    src="/avatar.jpg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <h2 className="font-['Playfair_Display'] text-xl text-[#ece0dc]">
                  Jane Cooper
                </h2>
                <p className="text-sm text-[#a89c93]">@janecooper</p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Books", value: "12" },
                  { label: "Playlists", value: "34" },
                  { label: "Favorites", value: "56" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#16110f] border border-[#3a322d] rounded-lg p-3 text-center"
                  >
                    <div className="font-['JetBrains_Mono'] text-lg text-[#ece0dc]">
                      {stat.value}
                    </div>
                    <div className="text-xs text-[#7a706a]">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Edit Profile Button */}
              <Link
                to="/profile/edit"
                className="mt-6 w-full h-10 border border-[#3a322d] rounded-lg text-sm text-[#a89c93] hover:border-[#4d433d] hover:text-[#ece0dc] transition-colors flex items-center justify-center"
              >
                Edit Profile
              </Link>
            </div>
          </aside>

          {/* Right Column — Tabbed Content */}
          <section className="flex-1 min-w-0">
            {/* Tabs with Underline Indicator */}
            <div className="border-b border-[#3a322d] mb-6">
              <div className="flex gap-0">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative px-5 py-3 text-sm font-medium transition-colors min-h-[40px] ${
                      activeTab === tab.key
                        ? "text-[#ece0dc]"
                        : "text-[#7a706a] hover:text-[#a89c93]"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e8693f]"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Panels */}
            <AnimatePresence mode="wait">
              {activeTab === "books" && (
                <motion.div
                  key="books"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="grid grid-cols-2 gap-4"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#211a17] border border-[#3a322d] rounded-lg p-4 hover:border-[#4d433d] transition-colors cursor-pointer"
                    >
                      <div className="w-full h-40 bg-[#2a211c] rounded-md mb-3" />
                      <h3 className="text-sm font-medium text-[#ece0dc] truncate">
                        Book Title {i + 1}
                      </h3>
                      <p className="text-xs text-[#7a706a] mt-1">Author Name</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "playlists" && (
                <motion.div
                  key="playlists"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="grid grid-cols-2 gap-4"
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#211a17] border border-[#3a322d] rounded-lg p-4 hover:border-[#4d433d] transition-colors cursor-pointer"
                    >
                      <div className="w-full h-32 bg-[#2a211c] rounded-md mb-3 flex items-center justify-center">
                        <span className="text-2xl text-[#7a706a]">📚</span>
                      </div>
                      <h3 className="text-sm font-medium text-[#ece0dc]">
                        Playlist {i + 1}
                      </h3>
                      <p className="text-xs text-[#7a706a] mt-1">
                        {Math.floor(Math.random() * 20 + 5)} books
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="bg-[#211a17] border border-[#3a322d] rounded-xl p-6 space-y-4"
                >
                  {[
                    { label: "Email Notifications", desc: "Receive email about new books" },
                    { label: "Dark Mode", desc: "Always on" },
                    { label: "Language", desc: "English" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-3 border-b border-[#3a322d] last:border-0"
                    >
                      <div>
                        <div className="text-sm text-[#ece0dc]">{item.label}</div>
                        <div className="text-xs text-[#7a706a]">{item.desc}</div>
                      </div>
                      <div className="w-10 h-6 bg-[#e8693f] rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-[#16110f] rounded-full" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}
```

---

## 5. Tablet Interactions

| Element           | Interaction                                        |
| ----------------- | -------------------------------------------------- |
| Tab buttons       | Hover: text `#7a706a → #a89c93`. Active: underline indicator. |
| Tab underline     | Animated slide via `layoutId` spring.               |
| Book/playlist card| Hover: `border-[#4d433d]`. Click: navigate to detail. |
| Settings toggles  | Hover: slight brightness increase. Click: toggle.   |
| Edit Profile btn  | Hover: `border-[#4d433d]`, text lighten.           |
| Avatar            | Hover: subtle scale or border color change.         |
| Stat cards        | Hover: `border-[#4d433d]`.                          |
| Keyboard          | Arrow keys switch tabs. Tab cycles interactive elements. |
| Focus visible     | Focus ring: `ring-2 ring-[#e8693f] ring-offset-2 ring-offset-[#16110f]`. |

---

## 6. Animation Spec

```ts
// Tab underline slide
{
  layoutId: "tab-underline",
  transition: { type: "spring", stiffness: 500, damping: 35 }
}

// Tab panel swap
{
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }
}

// Card hover lift
{
  whileHover: { y: -2 },
  transition: { type: "spring", stiffness: 300, damping: 20 }
}

// Avatar hover
{
  whileHover: { scale: 1.03 },
  transition: { type: "spring", stiffness: 400, damping: 25 }
}
```

---

## 7. Anti-Slop Checklist

- [ ] Zero indigo/blue/purple colors anywhere
- [ ] No glassmorphism or backdrop-blur
- [ ] No `shadow-lg` — elevation via border only
- [ ] Top nav present, no bottom nav
- [ ] 2-column layout (left sidebar + right content)
- [ ] Avatar is `w-32`, not smaller
- [ ] Stats in 3-column row, not stacked
- [ ] Tab indicator is underline, not pill
- [ ] Book grid is 2 columns, not 1 or 3
- [ ] Playlist grid is 2 columns
- [ ] No gradients on backgrounds
- [ ] All text uses specified font families
- [ ] `min-h-[40px] min-w-[40px]` on all interactive targets
- [ ] Canvas bg is `#16110f`
- [ ] Hover states enabled on all interactive elements

---

## 8. Complete Stitch Prompt

```
Build a tablet-optimized profile page (641px–1024px breakpoint) for a library app.

ROUTE: /profile
COMPONENT: ProfilePageTablet

DESIGN TOKENS (exact values — embed in Tailwind classes):
- Canvas: #16110f, Surface: #211a17, Surface Hover: #2a211c
- Accent: #e8693f, Accent Hover: #d45a30
- Border: #3a322d, Border Hover: #4d433d
- Text Primary: #ece0dc, Text Secondary: #a89c93, Text Muted: #7a706a
- Fonts: Playfair Display (headings), Inter (body), JetBrains Mono (stats)

TOP NAVIGATION (horizontal, NOT bottom nav):
- h-16, border-b border-[#3a322d], flex justify-between items-center px-6
- Left: Logo "Library" in Playfair Display, text-xl, text-[#ece0dc]
- Right: Nav links (Home, Browse, Profile) with gap-6, text-sm, text-[#a89c93]
  - Active tab: text-[#e8693f] font-medium
  - All links: min-h-[40px] min-w-[40px] flex items-center justify-center
- Far right: User avatar circle (w-8 h-8, rounded-full, bg-[#2a211c], border-[#3a322d])

MAIN LAYOUT (2-column):
- Container: max-w-5xl mx-auto, px-6, py-8, flex gap-8
- Left sidebar: w-80 shrink-0
- Right content: flex-1 min-w-0

LEFT SIDEBAR:
- Card: bg-[#211a17], border border-[#3a322d], rounded-xl, p-6
- Avatar: w-32 h-32, rounded-full, border-2 border-[#3a322d], bg-[#2a211c], centered, overflow-hidden with img
- Username: Playfair Display, text-xl, text-[#ece0dc], centered
- Handle: text-sm, text-[#a89c93], centered
- Stats row: grid grid-cols-3 gap-3, each stat card: bg-[#16110f], border-[#3a322d], rounded-lg, p-3, text-center
  - Value: JetBrains Mono, text-lg, text-[#ece0dc]
  - Label: text-xs, text-[#7a706a]
- Edit Profile button: Link to /profile/edit, w-full, h-10, border border-[#3a322d], rounded-lg, text-sm, text-[#a89c93], hover:border-[#4d433d] hover:text-[#ece0dc]

RIGHT CONTENT:
- Tab bar: border-b border-[#3a322d], flex, no gap
  - Each tab: px-5, py-3, text-sm, font-medium, min-h-[40px]
  - Inactive: text-[#7a706a] hover:text-[#a89c93]
  - Active: text-[#ece0dc] with animated underline (motion.div, layoutId="tab-underline", absolute bottom-0, h-0.5, bg-[#e8693f])
- Tab panels wrapped in AnimatePresence mode="wait"

BOOKS TAB:
- Grid grid-cols-2 gap-4
- Each card: bg-[#211a17], border-[#3a322d], rounded-lg, p-4, hover:border-[#4d433d]
  - Cover placeholder: w-full h-40, bg-[#2a211c], rounded-md, mb-3
  - Title: text-sm font-medium text-[#ece0dc], truncate
  - Author: text-xs text-[#7a706a], mt-1

PLAYLISTS TAB:
- Grid grid-cols-2 gap-4
- Each card: bg-[#211a17], border-[#3a322d], rounded-lg, p-4, hover:border-[#4d433d]
  - Cover: w-full h-32, bg-[#2a211c], rounded-md, centered emoji
  - Title: text-sm font-medium text-[#ece0dc]
  - Count: text-xs text-[#7a706a]

SETTINGS TAB:
- Card: bg-[#211a17], border-[#3a322d], rounded-xl, p-6, space-y-4
- Each row: flex justify-between items-center, py-3, border-b border-[#3a322d] (last:border-0)
  - Label: text-sm text-[#ece0dc]
  - Description: text-xs text-[#7a706a]
  - Toggle: w-10 h-6 bg-[#e8693f] rounded-full with inner circle

ANIMATIONS (Framer Motion):
- Tab underline: layoutId="tab-underline", transition { type: "spring", stiffness: 500, damping: 35 }
- Tab panels: initial { opacity: 0, y: 8 }, animate { opacity: 1, y: 0 }, exit { opacity: 0, y: -8 }, duration 0.25
- Cards: whileHover { y: -2 }, spring stiffness 300 damping 20

INTERACTIONS:
- Arrow keys switch between tabs
- Tab key cycles through all interactive elements
- Focus visible: ring-2 ring-[#e8693f] ring-offset-2 ring-offset-[#16110f]
- All buttons/links: min-h-[40px] min-w-[40px]

ANTI-SLOP (enforce all):
- No indigo/blue/purple
- No glassmorphism, no backdrop-blur
- No shadow-lg
- No bottom nav (horizontal top nav only)
- No single-column layout (must be 2-column)
- Avatar must be w-32
- Stats in 3-column grid
- Tab indicator must be underline (not pill)
- Book/playlist grids must be 2 columns
- No gradients, no neon/glowing
- All interactive targets ≥ 40px
- Canvas bg #16110f

Write production-quality React + Tailwind CSS. Use TypeScript. Import motion from framer-motion.
```
