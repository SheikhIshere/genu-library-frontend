# 04 — Login Page (Mobile)

## 1. Page Title & Route

- **Page**: Login
- **Route**: `/login`
- **Bottom Nav**: None — auth page, no persistent navigation
- **Mobile breakpoint**: `max-width: 640px`

---

## 2. Mobile-First Design Rationale

Login on mobile is a single-task screen: authenticate and get out. The entire viewport is the form. No chrome, no nav, no distractions. The form sits in the natural thumb zone (center-to-bottom third) so the user never reaches for the top. The keyboard is anticipated — no fixed bottom elements that overlap inputs when the virtual keyboard opens. The submit button is the largest tap target on screen, always visible above the fold when the focused input is scrolled into view.

---

## 3. Mobile Layout Specification

```
<div class="min-h-dvh bg-[#16110f] flex flex-col items-center justify-center px-5 py-12">
```

- Full viewport height (`min-h-dvh` — dynamic viewport height for iOS address bar)
- Single column, vertically centered content
- `px-5` (20px) horizontal padding — safe from edge
- `py-12` (48px) vertical padding — breathing room top/bottom
- No `max-w-*` — let content fill the column width
- No bottom nav, no fixed elements
- Keyboard avoidance: page scrolls naturally; no sticky/fixed elements to collide with keyboard

---

## 4. Component Breakdown

### 4a. Brand / Logo Block

```html
<div class="flex flex-col items-center gap-3 mb-10">
  <!-- Logo SVG or icon, 48x48 -->
  <h1 class="font-['Playfair_Display'] text-2xl font-bold text-[#ece0dc] tracking-tight">
    Forge & Flux
  </h1>
  <p class="text-sm text-[#a89c93]">Sign in to your account</p>
</div>
```

- Logo: 48×48px, centered
- Title: Playfair Display, `text-2xl` (24px), `tracking-tight`
- Subtitle: Inter, `text-sm` (14px), `text-[#a89c93]`
- `mb-10` (40px) below brand block — separates from form

### 4b. Form Container

```html
<form class="w-full max-w-sm flex flex-col gap-5" autocomplete="on">
```

- `max-w-sm` (384px) — constrains on larger phones
- `gap-5` (20px) between fields — generous spacing for fat-finger

### 4c. Email Input

```html
<div class="flex flex-col gap-2">
  <label for="email" class="text-sm font-medium text-[#a89c93]">
    Email address
  </label>
  <input
    id="email"
    type="email"
    inputmode="email"
    autocomplete="email"
    placeholder="you@example.com"
    required
    class="w-full min-h-[48px] px-4 py-3 bg-[#16110f] border border-[#3a322d] rounded-lg
           text-[#ece0dc] placeholder:text-[#7a706a]
           focus:border-[#e8693f] focus:ring-3 focus:ring-[#e8693f26]
           focus:outline-none transition-colors"
  />
</div>
```

- `min-h-[48px]` — Android touch target
- `type="email"` — triggers email keyboard on mobile
- `inputmode="email"` — ensures email virtual keyboard
- `autocomplete="email"` — autofill support
- Focus ring: 3px at 15% opacity of accent

### 4d. Password Input

```html
<div class="flex flex-col gap-2">
  <label for="password" class="text-sm font-medium text-[#a89c93]">
    Password
  </label>
  <div class="relative">
    <input
      id="password"
      type="password"
      autocomplete="current-password"
      placeholder="Enter your password"
      required
      class="w-full min-h-[48px] px-4 py-3 pr-12 bg-[#16110f] border border-[#3a322d] rounded-lg
             text-[#ece0dc] placeholder:text-[#7a706a]
             focus:border-[#e8693f] focus:ring-3 focus:ring-[#e8693f26]
             focus:outline-none transition-colors"
    />
    <!-- Toggle visibility button, min 44x44 tap target -->
    <button
      type="button"
      aria-label="Toggle password visibility"
      class="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px]
             flex items-center justify-center text-[#a89c93] hover:text-[#ece0dc]"
    >
      <!-- Eye / EyeOff icon -->
    </button>
  </div>
</div>
```

- Password toggle: 44×44px tap target, positioned inside input right edge
- `type="password"` + `autocomplete="current-password"`
- Toggle button uses `min-h-[44px] min-w-[44px]` for touch target

### 4e. Remember Me + Forgot Password Row

```html
<div class="flex items-center justify-between">
  <label class="flex items-center gap-2 min-h-[44px] cursor-pointer">
    <input
      type="checkbox"
      class="w-5 h-5 rounded border-[#3a322d] bg-[#16110f] text-[#e8693f]
             focus:ring-[#e8693f26] accent-[#e8693f]"
    />
    <span class="text-sm text-[#a89c93]">Remember me</span>
  </label>
  <a
    href="/forgot-password"
    class="min-h-[44px] flex items-center text-sm text-[#e8693f] hover:text-[#d45a30]"
  >
    Forgot password?
  </a>
</div>
```

- Checkbox label: full 44px touch height
- "Forgot password?" link: 44px touch height, right-aligned
- Both sit on the same row, `justify-between`

### 4f. Submit Button

```html
<button
  type="submit"
  class="w-full min-h-[52px] rounded-lg bg-[#e8693f] text-[#16110f] font-semibold text-base
         hover:bg-[#d45a30] active:scale-[0.97] transition-all
         disabled:opacity-50 disabled:cursor-not-allowed"
>
  Sign In
</button>
```

- `min-h-[52px]` — oversized for thumb zone prominence
- `active:scale-[0.97]` — press feedback
- Disabled state: opacity 50%, cursor not-allowed
- Loading state: replace text with spinner SVG + "Signing in..."

### 4g. Loading State (Submit)

```html
<button type="submit" disabled class="... disabled:opacity-50">
  <svg class="animate-spin h-5 w-5" /* spinner */ />
  <span>Signing in...</span>
</button>
```

- Spinner: 20×20px, `animate-spin`, same text color
- Button disabled during load

### 4h. Divider + Social Login

```html
<div class="relative my-6">
  <div class="absolute inset-0 flex items-center">
    <div class="w-full border-t border-[#3a322d]"></div>
  </div>
  <div class="relative flex justify-center text-xs">
    <span class="px-3 bg-[#16110f] text-[#7a706a]">or continue with</span>
  </div>
</div>

<div class="flex gap-3">
  <button
    type="button"
    class="flex-1 min-h-[48px] flex items-center justify-center gap-2
           bg-[#211a17] border border-[#3a322d] rounded-lg text-[#ece0dc]
           hover:border-[#4d433d] active:scale-[0.97] transition-all"
  >
    <!-- Google icon SVG -->
    <span class="text-sm font-medium">Google</span>
  </button>
  <button
    type="button"
    class="flex-1 min-h-[48px] flex items-center justify-center gap-2
           bg-[#211a17] border border-[#3a322d] rounded-lg text-[#ece0dc]
           hover:border-[#4d433d] active:scale-[0.97] transition-all"
  >
    <!-- GitHub icon SVG -->
    <span class="text-sm font-medium">GitHub</span>
  </button>
</div>
```

- Divider: horizontal line with centered text
- Social buttons: `flex-1` equal width, `min-h-[48px]`
- Surface background (`#211a17`) with border
- `active:scale-[0.97]` press feedback

### 4i. Sign Up Link

```html
<p class="mt-8 text-center text-sm text-[#a89c93]">
  Don't have an account?
  <a href="/register" class="text-[#e8693f] font-medium hover:text-[#d45a30]">
    Sign up
  </a>
</p>
```

- `mt-8` (32px) above — clear separation
- Link in accent color, `font-medium`
- Below the fold if keyboard is open — acceptable, user can scroll

---

## 5. Mobile Interactions

| Interaction | Behavior |
|---|---|
| **Input focus** | Border transitions to accent, 3px glow ring appears. Input scrolls into view via `scrollIntoView({ behavior: 'smooth', block: 'center' })` |
| **Password toggle** | Tap eye icon → toggles `type` between `password`/`text`. Haptic: light impact on toggle |
| **Submit** | On tap: `active:scale-[0.97]` + haptic medium. Disable button, show spinner. On error: shake animation on input border (200ms) + error text below field |
| **Keyboard avoidance** | No fixed bottom elements. Form is in normal document flow. `scrollIntoView` on focused input. iOS safe area handled by `min-h-dvh` |
| **Forgot password tap** | Navigate to `/forgot-password`. Haptic: light |
| **Social login tap** | `active:scale-[0.97]` + haptic light. Loading state on tapped button |
| **Link hover (external)** | `text-[#d45a30]` color shift, 150ms |

---

## 6. Animation Spec (Framer Motion)

```tsx
// Page entry
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
>

// Brand logo
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.1, duration: 0.3, ease: spring }}
/>

// Form fields stagger
{fields.map((field, i) => (
  <motion.div
    key={field.id}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
  />
))}

// Submit button
<motion.button
  whileTap={{ scale: 0.97 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
/>

// Error shake
<motion.div
  animate={{ x: [0, -8, 8, -4, 4, 0] }}
  transition={{ duration: 0.3 }}
/>
```

- Page: fade up, 400ms smooth
- Logo: scale in from 0.9, 300ms spring
- Fields: staggered fade-up, 60ms apart
- Button: spring press, stiffness 400
- Error: horizontal shake, 300ms

---

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] No bottom nav on this page (auth page)
- [ ] No hamburger menu
- [ ] `min-h-[48px]` on every input, button, and link
- [ ] `min-h-[44px] min-w-[44px]` on password toggle and checkbox
- [ ] `type="email"` and `inputmode="email"` on email field
- [ ] `autocomplete="current-password"` on password field
- [ ] No fixed bottom elements that overlap with keyboard
- [ ] Form handles virtual keyboard (scrollIntoView on focus)
- [ ] Submit button visible above fold when keyboard is closed
- [ ] No glassmorphism, no indigo/blue/purple
- [ ] No `shadow-lg`, no gradient backgrounds
- [ ] Single column layout, no side-by-side form fields
- [ ] Loading state disables button and shows spinner
- [ ] Error states shown inline below each field
- [ ] `min-h-dvh` for full viewport (iOS safe area)
- [ ] All colors from Forge & Flux palette only
- [ ] Touch targets meet 48px Android minimum
- [ ] Haptic feedback on submit tap

---

## 8. Complete Stitch Prompt

```
Build a mobile-only Login page (max-width: 640px) for the Forge & Flux library app.

## Tech
React, Tailwind CSS, Framer Motion, React Router v6.

## Route & Nav
- Route: /login
- NO bottom navigation bar — this is an auth page, not part of the main app shell.
- NO hamburger menu.

## Layout
Full-screen vertical layout:
- Outer wrapper: min-h-dvh bg-[#16110f] flex flex-col items-center justify-center px-5 py-12
- Content: w-full max-w-sm flex flex-col items-center

## Brand Block (top center)
- Logo/SVG icon, 48x48px, centered
- "Forge & Flux" in font-['Playfair_Display'] text-2xl font-bold text-[#ece0dc] tracking-tight
- "Sign in to your account" subtitle in text-sm text-[#a89c93]
- mb-10 below brand block

## Form
Single column, gap-5 between fields. Form element: w-full max-w-sm flex flex-col gap-5

### Email Field
- Label: "Email address", text-sm font-medium text-[#a89c93], mb-2
- Input: type="email", inputmode="email", autocomplete="email", placeholder="you@example.com", required
- Input classes: w-full min-h-[48px] px-4 py-3 bg-[#16110f] border border-[#3a322d] rounded-lg text-[#ece0dc] placeholder:text-[#7a706a] focus:border-[#e8693f] focus:ring-3 focus:ring-[#e8693f26] focus:outline-none transition-colors

### Password Field
- Label: "Password", same styling as email label
- Wrapper div with relative positioning
- Input: type="password", autocomplete="current-password", placeholder="Enter your password", required, same input classes as email but with pr-12
- Toggle button: absolute right-2 top-1/2 -translate-y-1/2, min-h-[44px] min-w-[44px], flex items-center justify-center text-[#a89c93] hover:text-[#ece0dc]. Shows Eye icon when hidden, EyeOff when visible. Toggles input type between "password" and "text". On toggle: haptic light feedback.

### Remember Me + Forgot Password Row
- flex items-center justify-between
- Left: checkbox label with min-h-[44px], flex items-center gap-2. Checkbox: w-5 h-5 accent-[#e8693f]. "Remember me" text-sm text-[#a89c93]
- Right: "Forgot password?" link to /forgot-password, text-sm text-[#e8693f] hover:text-[#d45a30], min-h-[44px] flex items-center

### Submit Button
- w-full min-h-[52px] rounded-lg bg-[#e8693f] text-[#16110f] font-semibold text-base
- hover:bg-[#d45a30] active:scale-[0.97] transition-all
- disabled:opacity-50 disabled:cursor-not-allowed
- Text: "Sign In"
- Loading state: when submitting, disable button, replace text with animate-spin h-5 w-5 SVG spinner + "Signing in..." text. Haptic medium on tap.

### Divider
- my-6, relative container with absolute horizontal line (border-t border-[#3a322d])
- Centered span: px-3 bg-[#16110f] text-xs text-[#7a706a] "or continue with"

### Social Login Buttons
- flex gap-3
- Each button: flex-1 min-h-[48px] flex items-center justify-center gap-2 bg-[#211a17] border border-[#3a322d] rounded-lg text-[#ece0dc] hover:border-[#4d433d] active:scale-[0.97] transition-all
- Google button: Google SVG icon + "Google" text, text-sm font-medium
- GitHub button: GitHub SVG icon + "GitHub" text, text-sm font-medium

### Sign Up Link
- mt-8 text-center text-sm text-[#a89c93]
- "Don't have an account?" followed by link to /register: text-[#e8693f] font-medium hover:text-[#d45a30] "Sign up"

## Interactions
1. On input focus: scrollIntoView({ behavior: 'smooth', block: 'center' }) to handle virtual keyboard
2. Password toggle: tap toggles visibility, haptic light
3. Submit: on tap haptic medium, disable button, show spinner. On API error: display error message below the relevant field in text-sm text-[#c44d4d], shake the field (animate x: [0, -8, 8, -4, 4, 0] over 300ms)
4. No fixed/sticky elements anywhere — all content in normal document flow for keyboard compatibility

## Framer Motion Animations
- Page container: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
- Brand block: initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.3, type: 'spring' }}
- Each form field: initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + index * 0.06, duration: 0.3 }}
- Submit button: whileTap={{ scale: 0.97 }}, transition={{ type: 'spring', stiffness: 400, damping: 17 }}
- Error shake: animate={{ x: [0, -8, 8, -4, 4, 0] }} transition={{ duration: 0.3 }}

## Design Tokens (Forge & Flux)
- Canvas: #16110f, Surface: #211a17
- Primary: #e8693f, Primary Hover: #d45a30
- Border: #3a322d, Border Hover: #4d433d
- Text: #ece0dc (primary), #a89c93 (secondary), #7a706a (muted)
- Error: #c44d4d
- Font: Playfair Display (display), Inter (body)
- Border radius: 8px (inputs/buttons), 12px (cards), 9999px (avatars)

## Anti-Slop Rules
- NO bottom navigation bar (auth page)
- NO hamburger menu
- NO glassmorphism, NO indigo/blue/purple colors
- NO shadow-lg, NO gradient backgrounds
- NO modals or overlays
- Single column layout only
- Every interactive element must have min-h-[48px] or min-w-[48px] touch target
- Use env(safe-area-inset-*) where applicable
- All colors from Forge & Flux palette only
```