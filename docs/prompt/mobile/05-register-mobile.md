# 05 — Register Page (Mobile)

## 1. Page Title & Route

- **Page**: Register / Sign Up
- **Route**: `/register`
- **Bottom Nav**: None — auth page, no persistent navigation
- **Mobile breakpoint**: `max-width: 640px`

---

## 2. Mobile-First Design Rationale

Register mirrors login's single-task pattern but adds progressive disclosure: the password strength meter appears only after the user starts typing, keeping the initial view clean. All four fields are stacked in a single column within the natural thumb zone. The confirm-password field triggers real-time match validation. Client-side validation prevents wasted server round-trips. The submit button is oversized and anchored to the bottom of the form, always within thumb reach.

---

## 3. Mobile Layout Specification

```
<div class="min-h-dvh bg-[#16110f] flex flex-col items-center px-5 py-12">
```

- Full viewport height (`min-h-dvh`)
- Vertically scrollable if content exceeds viewport (keyboard open scenario)
- Single column, centered
- `px-5` (20px) horizontal padding
- `py-12` (48px) vertical padding
- No bottom nav, no fixed elements
- Content scrolls naturally when keyboard opens

---

## 4. Component Breakdown

### 4a. Brand / Logo Block

```html
<div class="flex flex-col items-center gap-3 mb-8">
  <div class="w-12 h-12"><!-- Logo SVG --></div>
  <h1 class="font-['Playfair_Display'] text-2xl font-bold text-[#ece0dc] tracking-tight">
    Create Account
  </h1>
  <p class="text-sm text-[#a89c93]">Join the forge. Start building your library.</p>
</div>
```

- Same brand pattern as login
- `mb-8` (32px) — slightly tighter than login since there are more fields

### 4b. Form Container

```html
<form class="w-full max-w-sm flex flex-col gap-4" autocomplete="on" novalidate>
```

- `gap-4` (16px) — tighter than login to fit more fields above fold
- `novalidate` — custom validation messages instead of browser defaults

### 4c. Username Input

```html
<div class="flex flex-col gap-2">
  <label for="username" class="text-sm font-medium text-[#a89c93]">
    Username
  </label>
  <input
    id="username"
    type="text"
    inputmode="text"
    autocomplete="username"
    placeholder="Choose a username"
    required
    minlength="3"
    maxlength="30"
    class="w-full min-h-[48px] px-4 py-3 bg-[#16110f] border border-[#3a322d] rounded-lg
           text-[#ece0dc] placeholder:text-[#7a706a]
           focus:border-[#e8693f] focus:ring-3 focus:ring-[#e8693f26]
           focus:outline-none transition-colors"
  />
  <p class="text-xs text-[#7a706a]">3–30 characters, letters, numbers, and underscores</p>
</div>
```

- Helper text below: `text-xs text-[#7a706a]`
- `minlength="3"` + `maxlength="30"` for client-side constraints

### 4d. Email Input

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

### 4e. Password Input + Strength Meter

```html
<div class="flex flex-col gap-2">
  <label for="password" class="text-sm font-medium text-[#a89c93]">
    Password
  </label>
  <div class="relative">
    <input
      id="password"
      type="password"
      autocomplete="new-password"
      placeholder="Create a password"
      required
      minlength="8"
      class="w-full min-h-[48px] px-4 py-3 pr-12 bg-[#16110f] border border-[#3a322d] rounded-lg
             text-[#ece0dc] placeholder:text-[#7a706a]
             focus:border-[#e8693f] focus:ring-3 focus:ring-[#e8693f26]
             focus:outline-none transition-colors"
    />
    <button
      type="button"
      aria-label="Toggle password visibility"
      class="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px]
             flex items-center justify-center text-[#a89c93] hover:text-[#ece0dc]"
    >
      <!-- Eye / EyeOff icon -->
    </button>
  </div>

  <!-- Password Strength Meter — only visible when password.length > 0 -->
  <div class="flex flex-col gap-1.5">
    <div class="flex gap-1">
      <div class="h-1 flex-1 rounded-full bg-[#3a322d]"></div>
      <div class="h-1 flex-1 rounded-full bg-[#3a322d]"></div>
      <div class="h-1 flex-1 rounded-full bg-[#3a322d]"></div>
      <div class="h-1 flex-1 rounded-full bg-[#3a322d]"></div>
    </div>
    <p class="text-xs text-[#7a706a]">
      <!-- Dynamic: "Weak", "Fair", "Strong", "Very strong" -->
    </p>
  </div>
</div>
```

- 4-segment strength meter, each segment `h-1 flex-1 rounded-full`
- Colors per level:
  - Level 1 (weak): `bg-[#c44d4d]` — red
  - Level 2 (fair): `bg-[#d4a24e]` — warning
  - Level 3 (strong): `bg-[#4a7c59]` — green
  - Level 4 (very strong): `bg-[#4a7c59]` + text "Very strong"
- Meter appears only when password field has content
- `autocomplete="new-password"` for password managers

### 4f. Confirm Password Input

```html
<div class="flex flex-col gap-2">
  <label for="confirm-password" class="text-sm font-medium text-[#a89c93]">
    Confirm password
  </label>
  <div class="relative">
    <input
      id="confirm-password"
      type="password"
      autocomplete="new-password"
      placeholder="Re-enter your password"
      required
      class="w-full min-h-[48px] px-4 py-3 pr-12 bg-[#16110f] border border-[#3a322d] rounded-lg
             text-[#ece0dc] placeholder:text-[#7a706a]
             focus:border-[#e8693f] focus:ring-3 focus:ring-[#e8693f26]
             focus:outline-none transition-colors"
    />
    <button
      type="button"
      aria-label="Toggle password visibility"
      class="absolute right-2 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px]
             flex items-center justify-center text-[#a89c93] hover:text-[#ece0dc]"
    >
      <!-- Eye / EyeOff icon -->
    </button>
  </div>
  <!-- Match indicator: shown when confirm field has content -->
  <p class="text-xs" id="match-indicator">
    <!-- If match: text-[#4a7c59] "Passwords match" -->
    <!-- If mismatch: text-[#c44d4d] "Passwords don't match" -->
  </p>
</div>
```

- Real-time match check against password field
- Visual indicator: green checkmark + text or red X + text
- `autocomplete="new-password"` for password managers

### 4g. Terms Notice

```html
<p class="text-xs text-[#7a706a] text-center leading-relaxed">
  By creating an account, you agree to our
  <a href="/terms" class="text-[#e8693f] hover:text-[#d45a30]">Terms of Service</a>
  and
  <a href="/privacy" class="text-[#e8693f] hover:text-[#d45a30]">Privacy Policy</a>.
</p>
```

- `text-xs`, `text-center`, `leading-relaxed`
- Links in accent color

### 4h. Submit Button

```html
<button
  type="submit"
  class="w-full min-h-[52px] rounded-lg bg-[#e8693f] text-[#16110f] font-semibold text-base
         hover:bg-[#d45a30] active:scale-[0.97] transition-all
         disabled:opacity-50 disabled:cursor-not-allowed"
>
  Create Account
</button>
```

- Same pattern as login submit
- Loading state: spinner + "Creating account..."

### 4i. Divider + Social Login

```html
<!-- Same pattern as login: divider + Google/GitHub buttons -->
<div class="relative my-6">
  <div class="absolute inset-0 flex items-center">
    <div class="w-full border-t border-[#3a322d]"></div>
  </div>
  <div class="relative flex justify-center text-xs">
    <span class="px-3 bg-[#16110f] text-[#7a706a]">or sign up with</span>
  </div>
</div>

<div class="flex gap-3">
  <button type="button" class="flex-1 min-h-[48px] flex items-center justify-center gap-2 bg-[#211a17] border border-[#3a322d] rounded-lg text-[#ece0dc] hover:border-[#4d433d] active:scale-[0.97] transition-all">
    <!-- Google icon + "Google" -->
  </button>
  <button type="button" class="flex-1 min-h-[48px] flex items-center justify-center gap-2 bg-[#211a17] border border-[#3a322d] rounded-lg text-[#ece0dc] hover:border-[#4d433d] active:scale-[0.97] transition-all">
    <!-- GitHub icon + "GitHub" -->
  </button>
</div>
```

### 4j. Login Link

```html
<p class="mt-8 text-center text-sm text-[#a89c93]">
  Already have an account?
  <a href="/login" class="text-[#e8693f] font-medium hover:text-[#d45a30]">
    Sign in
  </a>
</p>
```

---

## 5. Mobile Interactions

| Interaction | Behavior |
|---|---|
| **Input focus** | `scrollIntoView({ behavior: 'smooth', block: 'center' })`. Border transitions to accent with glow ring |
| **Password typing** | As user types, evaluate strength: length≥8 → level 1, +uppercase → level 2, +number/special → level 3, +length≥12 → level 4. Animate meter segments with 200ms width transition. Haptic: light tick on level change |
| **Confirm password typing** | Real-time comparison with password. Show ✓ "Passwords match" in green or ✗ "Passwords don't match" in red. Haptic: light on first match |
| **Password toggle** | Tap eye icon → toggles visibility. Haptic light |
| **Submit validation** | Client-side check: email format regex, password ≥8 chars, passwords match, username ≥3 chars. Failed fields: red border + shake + inline error. Haptic: error feedback |
| **Submit success** | Button spinner, then navigate to /verify-email or /login. Haptic: medium success |
| **Social signup** | Same as login social buttons. `active:scale-[0.97]` + haptic light |
| **Keyboard avoidance** | All content in document flow, no fixed elements. scrollIntoView on each field focus |

---

## 6. Animation Spec (Framer Motion)

```tsx
// Page entry
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
>

// Brand block
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.1, type: 'spring' }}
/>

// Fields stagger
{fields.map((field, i) => (
  <motion.div
    key={field}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
  />
))}

// Strength meter segments animate width
<motion.div
  animate={{ scaleX: isActive ? 1 : 0 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
  style={{ transformOrigin: 'left' }}
/>

// Match indicator fade in
<motion.p
  initial={{ opacity: 0, height: 0 }}
  animate={{ opacity: 1, height: 'auto' }}
  transition={{ duration: 0.2 }}
/>

// Error shake
<motion.div
  animate={{ x: [0, -8, 8, -4, 4, 0] }}
  transition={{ duration: 0.3 }}
/>

// Submit button press
<motion.button
  whileTap={{ scale: 0.97 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
/>
```

---

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] No bottom nav on this page (auth page)
- [ ] No hamburger menu
- [ ] `min-h-[48px]` on every input, button, and link
- [ ] `min-h-[44px] min-w-[44px]` on password toggles
- [ ] `type="email"` + `inputmode="email"` on email field
- [ ] `autocomplete="new-password"` on password fields
- [ ] Password strength meter is 4 segments, color-coded
- [ ] Client-side validation before submit (email format, password length, match)
- [ ] Real-time password match indicator
- [ ] No fixed bottom elements that overlap keyboard
- [ ] Form scrolls naturally when keyboard opens
- [ ] Loading state disables button and shows spinner
- [ ] Error states inline below each field, with shake animation
- [ ] `min-h-dvh` for full viewport
- [ ] Single column layout
- [ ] No glassmorphism, no indigo/blue/purple, no shadow-lg, no gradient backgrounds
- [ ] All colors from Forge & Flux palette
- [ ] Terms/Privacy links in accent color
- [ ] Haptic feedback on submit, password strength change, and match confirmation

---

## 8. Complete Stitch Prompt

```
Build a mobile-only Register page (max-width: 640px) for the Forge & Flux library app.

## Tech
React, Tailwind CSS, Framer Motion, React Router v6.

## Route & Nav
- Route: /register
- NO bottom navigation bar — auth page.
- NO hamburger menu.

## Layout
Full-screen scrollable layout:
- Outer: min-h-dvh bg-[#16110f] flex flex-col items-center px-5 py-12
- Content: w-full max-w-sm flex flex-col items-center

## Brand Block
- Logo/SVG 48x48px centered
- "Create Account" — font-['Playfair_Display'] text-2xl font-bold text-[#ece0dc] tracking-tight
- "Join the forge. Start building your library." — text-sm text-[#a89c93]
- mb-8 below

## Form
w-full max-w-sm flex flex-col gap-4, autocomplete="on", novalidate

### Username
- Label: "Username", text-sm font-medium text-[#a89c93], gap-2 below label
- Input: type="text", inputmode="text", autocomplete="username", placeholder="Choose a username", required, minlength="3", maxlength="30"
- Input classes: w-full min-h-[48px] px-4 py-3 bg-[#16110f] border border-[#3a322d] rounded-lg text-[#ece0dc] placeholder:text-[#7a706a] focus:border-[#e8693f] focus:ring-3 focus:ring-[#e8693f26] focus:outline-none transition-colors
- Helper: "3–30 characters, letters, numbers, and underscores" in text-xs text-[#7a706a]

### Email
- Label: "Email address"
- Input: type="email", inputmode="email", autocomplete="email", placeholder="you@example.com", required
- Same input classes as username

### Password
- Label: "Password"
- Wrapper div with relative
- Input: type="password", autocomplete="new-password", placeholder="Create a password", required, minlength="8", same classes + pr-12
- Toggle button: absolute right-2 top-1/2 -translate-y-1/2, min-h-[44px] min-w-[44px], text-[#a89c93] hover:text-[#ece0dc]. Eye/EyeOff icon toggle. Haptic light on toggle.

### Password Strength Meter
- Only visible when password.length > 0
- Container: flex flex-col gap-1.5
- Bar row: flex gap-1, 4 segments each h-1 flex-1 rounded-full
- Default segment: bg-[#3a322d]
- Active segment colors by level: 1=bg-[#c44d4d] (weak), 2=bg-[#d4a24e] (fair), 3=bg-[#4a7c59] (strong), 4=bg-[#4a7c59] (very strong)
- Label below: "Weak"/"Fair"/"Strong"/"Very strong" in text-xs, color matches meter
- Strength logic: length≥8 → level 1, +uppercase → level 2, +number/special → level 3, +length≥12 → level 4
- Animate segment width with motion.div, scaleX from 0 to 1, transformOrigin left, duration 200ms
- Haptic: light tick on level change

### Confirm Password
- Label: "Confirm password"
- Input: type="password", autocomplete="new-password", placeholder="Re-enter your password", required, same classes + pr-12
- Toggle button: same as password toggle
- Match indicator below: motion.p, initial={{ opacity: 0, height: 0 }}, animate={{ opacity: 1, height: 'auto' }}
  - When match: text-xs text-[#4a7c59] "Passwords match"
  - When mismatch: text-xs text-[#c44d4d] "Passwords don't match"
  - Only visible when confirm field has content
  - Haptic: light on first match confirmation

### Terms
- text-xs text-[#7a706a] text-center leading-relaxed
- "By creating an account, you agree to our Terms of Service and Privacy Policy."
- Links: text-[#e8693f] hover:text-[#d45a30]

### Submit Button
- w-full min-h-[52px] rounded-lg bg-[#e8693f] text-[#16110f] font-semibold text-base
- hover:bg-[#d45a30] active:scale-[0.97] transition-all
- disabled:opacity-50 disabled:cursor-not-allowed
- Text: "Create Account"
- Loading: disable + spinner (animate-spin h-5 w-5) + "Creating account..."
- Haptic: medium on tap

### Divider
- my-6, relative, absolute horizontal line border-t border-[#3a322d]
- Centered span: px-3 bg-[#16110f] text-xs text-[#7a706a] "or sign up with"

### Social Buttons
- flex gap-3
- Each: flex-1 min-h-[48px] flex items-center justify-center gap-2 bg-[#211a17] border border-[#3a322d] rounded-lg text-[#ece0dc] hover:border-[#4d433d] active:scale-[0.97] transition-all
- Google: Google SVG + "Google" text-sm font-medium
- GitHub: GitHub SVG + "GitHub" text-sm font-medium

### Login Link
- mt-8 text-center text-sm text-[#a89c93]
- "Already have an account?" + link to /register→/login: text-[#e8693f] font-medium hover:text-[#d45a30] "Sign in"

## Client-Side Validation
1. Username: required, 3-30 chars. On fail: red border on field + "Username must be 3-30 characters" below in text-xs text-[#c44d4d]
2. Email: required, must match /^[^\s@]+@[^\s@]+\.[^\s@]+$/. On fail: "Please enter a valid email" below field
3. Password: required, min 8 chars. On fail: "Password must be at least 8 characters" below field
4. Confirm: must match password. On fail: "Passwords don't match" below field
5. All errors: field gets border-[#c44d4d] + shake animation (x: [0, -8, 8, -4, 4, 0] over 300ms)
6. On submit: validate all fields, first invalid field gets scrollIntoView

## Interactions
1. scrollIntoView on each input focus for keyboard avoidance
2. Password strength meter animates segments as user types
3. Confirm password real-time match check
4. Haptic light on password strength level change
5. Haptic light on password match confirmation
6. Haptic medium on submit tap
7. No fixed/sticky elements — all in document flow

## Framer Motion Animations
- Page: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
- Brand: initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: 'spring' }}
- Fields: stagger, initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }}
- Strength segments: motion.div animate={{ scaleX: active ? 1 : 0 }} transition={{ duration: 0.2 }}
- Match indicator: motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
- Submit: whileTap={{ scale: 0.97 }}, spring stiffness 400

## Design Tokens (Forge & Flux)
- Canvas: #16110f, Surface: #211a17
- Primary: #e8693f, Hover: #d45a30
- Border: #3a322d, Hover: #4d433d
- Text: #ece0dc, #a89c93, #7a706a
- Success: #4a7c59, Error: #c44d4d, Warning: #d4a24e
- Fonts: Playfair Display (display), Inter (body)
- Radius: 8px (inputs/buttons), 12px (cards), 9999px (pills)

## Anti-Slop Rules
- NO bottom navigation bar (auth page)
- NO hamburger menu
- NO glassmorphism, NO indigo/blue/purple
- NO shadow-lg, NO gradient backgrounds
- NO modals
- Single column only
- Every interactive element min-h-[48px] or min-w-[48px]
- All colors from Forge & Flux palette only
```