---
name: Forge & Flux
colors:
  surface: '#211a17'
  surface-dim: '#18120f'
  surface-bright: '#403734'
  surface-container-lowest: '#130d0a'
  surface-container-low: '#211a17'
  surface-container: '#251e1b'
  surface-container-high: '#302825'
  surface-container-highest: '#3b3330'
  on-surface: '#eee0da'
  on-surface-variant: '#dfc0b7'
  inverse-surface: '#eee0da'
  inverse-on-surface: '#372f2b'
  outline: '#a68b82'
  outline-variant: '#58423b'
  surface-tint: '#ffb59e'
  primary: '#ffb59e'
  on-primary: '#5e1700'
  primary-container: '#ea6a40'
  on-primary-container: '#521300'
  inverse-primary: '#a73a13'
  secondary: '#f3be67'
  on-secondary: '#432c00'
  secondary-container: '#7c5400'
  on-secondary-container: '#ffcd7d'
  tertiary: '#61d6ed'
  on-tertiary: '#00363f'
  tertiary-container: '#049fb5'
  on-tertiary-container: '#002f36'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#3a0b00'
  on-primary-fixed-variant: '#842500'
  secondary-fixed: '#ffdead'
  secondary-fixed-dim: '#f3be67'
  on-secondary-fixed: '#281900'
  on-secondary-fixed-variant: '#604100'
  tertiary-fixed: '#a4eeff'
  tertiary-fixed-dim: '#61d6ed'
  on-tertiary-fixed: '#001f25'
  on-tertiary-fixed-variant: '#004e5a'
  background: '#18120f'
  on-background: '#eee0da'
  surface-variant: '#3b3330'
  canvas: '#16110f'
  surface-hover: '#2a211c'
  surface-active: '#332a24'
  primary-hover: '#d45a30'
  border: '#3a322d'
  border-hover: '#4d433d'
  text-primary: '#ece0dc'
  text-secondary: '#a89c93'
  text-muted: '#7a706a'
  text-on-accent: '#16110f'
  status-success: '#4a7c59'
  status-error: '#c44d4d'
  status-warning: '#d4a24e'
  status-info: '#5b8fb9'
typography:
  display-xl:
    fontFamily: Playfair Display
    fontSize: 60px
    fontWeight: '700'
    lineHeight: 68px
    letterSpacing: -0.025em
  display-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  display-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-1:
    fontFamily: Playfair Display
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-2:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-3:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-large:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-default:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-small:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  overline:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies the warmth, tactile focus, and deliberate atmosphere of an artisan guild library and luxury reading room. It replaces sterile, cold-tech dark modes with deep, carbonized hearth tones, aged wood subtleties, and molten amber-orange accents. The UI addresses discerning collectors, digital archivists, and craftspeople who value deliberate interfaces over disposable trends.

Visually, the system aligns with **Tactile Minimalist Dark** design:
- Layered warm-black substrates evoke textured stone and dark oak rather than void-black emptiness.
- Sharp, subtle structural boundary lines define components cleanly without requiring heavy elevation shadows.
- Warm ember highlights and molten glows activate upon user interaction, lending kinetic life and hearth-lit warmth to interactive surfaces.
- Micro-interactions lean on organic spring physics, balancing literary stillness with the mechanical feedback of a physical workshop.

## Colors

The palette is tuned around soot, embers, and warm parchment. Cool-gray and slate tones are strictly disallowed.

- **Primary (`#e8693f`)**: The heart of the forge. Used for critical call-to-actions, active indicators, focus cues, and fiery atmospheric accents. In transparent states, use `rgba(232, 105, 63, 0.12)` for subtle fills.
- **Secondary (`#d4a24e`)**: Aged brass and guild coin. Reserved for value metadata, currency symbols, and secondary badges.
- **Neutral / Surfaces (`#16110f`, `#211a17`, `#2a211c`)**: The foundational layered structure. Deep hearth brown forms the page canvas, stepped up through lighter card containers and active click states.
- **Border / Boundaries (`#3a322d`)**: Hand-carved perimeter outlines that provide crisp structural delineation on dark surfaces.
- **Text Tiering**: Creamy off-white (`#ece0dc`) preserves high contrast without blue glare. Weathered stone (`#a89c93`) carries secondary descriptions, while ash brown (`#7a706a`) marks disabled or inactive elements.

## Typography

The typographic tension pairs an editorial high-contrast serif with functional structural sans-serif and utilitarian monospace:

- **Playfair Display**: Channels historical folio printing and library book spine title craftsmanship. Used for primary displays, hero titles, and major card headings. Always applied with tight tracking (`-0.02em` to `-0.025em`) to consolidate ink-spread illusion.
- **Inter**: Neutral, legible, and unpretentious body typeface ensuring frictionless interaction across complex UI patterns, long paragraphs, forms, and navigation controls.
- **JetBrains Mono**: Represents the artisan’s ledger. Used exclusively for monetary denominations, statistics, telemetry readings, and uppercase overlines to inject technical precision into an otherwise warm environment.

## Layout & Spacing

The layout is architected around a disciplined 4px atomic unit scaling up through standard rhythm points (8px, 16px, 24px, 32px, 48px, 64px).

### Grid Configuration
- **Desktop (>= 1024px)**: 12-column fluid grid, max-width `1280px` (`max-w-7xl`), gutters of `1.5rem` (24px) to `2rem` (32px), outer margin padding of `2rem` (32px).
- **Tablet (768px - 1023px)**: 6 or 8-column layout, max-width `768px` (`max-w-3xl`), gutters and padding fixed at `1.5rem` (24px).
- **Mobile (< 768px)**: 4-column layout collapsing into a single stacked column for content cards, screen margins pinned to `1rem` (16px).

Content sections retain generous breathing space. Editorial narratives follow a narrow readability column (`max-w-3xl` / 768px), while catalog shelves and inventory grids expand across the full 12-column boundary.

## Elevation & Depth

Rather than relying on heavy, dark drop shadows that dissolve into the pitch canvas, this system builds depth using **tonal layering**, **structural perimeter outlines**, and **amber emission glows**:

- **Canvas (Level 0)**: `#16110f` – The deep foundation.
- **Surface Tier 1 (Level 1)**: `#211a17` bordered by `1px solid #3a322d`. Flat, foundational card and panel layer.
- **Elevated Menus (Level 2)**: `#211a17` with `border: 1px solid #4d433d` accompanied by subtle ground separation: `box-shadow: 0 4px 24px rgba(0, 0, 0, 0.45)`.
- **Modals & Overlays (Level 3)**: Elevated substrate `#2a211c` with `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6)`.

### Ember Bloom (Accent Glows)
Interactions do not cast gray shadows; they radiate localized heat:
- **Card Hover**: `box-shadow: 0 0 20px rgba(232, 105, 63, 0.08)` paired with a slight vertical translation (`translateY(-2px)`).
- **Input Focus & Active Radiance**: `box-shadow: 0 0 0 3px rgba(232, 105, 63, 0.18)`.
- **Primary Action Accent**: `box-shadow: 0 0 32px rgba(232, 105, 63, 0.22)`.

## Shapes

The design system maintains a balanced geometry (`roundedness: 2`) that pairs modern ergonomics with structural weight.

- **Base Radius (8px / `0.5rem`)**: Interactive controls, buttons, form inputs, and small notification toasts.
- **Large Radius (12px to 16px / `0.75rem` to `1rem`)**: Cards, panels, modular sheets, and flyout dialogs.
- **Outer Bounds (24px / `1.5rem`)**: Featured hero showcases and display containers.
- **Capsule / Pill (`9999px`)**: Status chips, categorical taxonomy tags, monetary counters, and user avatars.

## Components

### Buttons
- **Primary**: Solid `#e8693f` background with `#16110f` text, font weight 600, 8px corner radius. Padding: 10px 20px. Hover transitions to `#d45a30` accompanied by a soft amber bloom (`box-shadow: 0 0 24px rgba(232, 105, 63, 0.25)`). Active press initiates spring scale compression to `0.97`.
- **Secondary / Outlined**: Transparent background, border `1px solid #3a322d`, `#ece0dc` text. Hover transitions border to `#e8693f` and text to `#e8693f`.
- **Ghost**: Unframed, `#a89c93` text. Hover activates background `#211a17` and shifts text to `#ece0dc`.

### Cards & Content Containers
- Base background `#211a17` encapsulated by a crisp `1px solid #3a322d` border and 12px corner radius.
- Imagery nested in cards must apply `border-radius: 12px 12px 0 0` with zero bleeding borders.
- Hover behavior: Subtle dynamic lift (`translateY(-3px)`), border shifts to `#4d433d`, and faint hearth illumination (`0 0 20px rgba(232, 105, 63, 0.08)`) over `200ms cubic-bezier(0.34, 1.56, 0.64, 1)`.

### Tags & Categorical Chips
- Fully pill-shaped (`border-radius: 9999px`), padding: 4px 12px, font size 12px to 14px.
- Inactive state: `#211a17` fill, `1px solid #3a322d` perimeter, text `#a89c93`.
- Active/Selected state: Tinted hearth background `rgba(232, 105, 63, 0.1)`, perimeter border `#e8693f`, label colored `#e8693f`.

### Inputs & Form Fields
- Surface background `#16110f` inset within `#3a322d` border, text `#ece0dc`, padding 10px 14px, radius 8px.
- Field labels rendered in `Inter` 14px medium `#a89c93`; placeholder text in `#7a706a`.
- Focus state activates `#e8693f` border along with outer ring halo `box-shadow: 0 0 0 3px rgba(232, 105, 63, 0.15)`.

### Checkboxes & Radio Controls
- Base: 18px square (checkbox) or circle (radio), `#16110f` interior, `#3a322d` border.
- Selected state fills with `#e8693f` displaying dark glyph `#16110f` centered within. Smooth scale bounce applied on transition.

### Monospace Ledger & Price Displays
- Formatted strictly in `JetBrains Mono`.
- Prefixed by a warm coin icon or symbol colored in `#d4a24e` or `#e8693f`.
- High tabular numeral clarity designed for catalog ledgers, item weights, and rarity indices.

### Navigation Header
- Fixed bar styled in `rgba(22, 17, 15, 0.85)` with `backdrop-filter: blur(16px)` and a grounding lower border `1px solid #3a322d`.
- Brand logotype set in `Playfair Display` bold, `#ece0dc`.