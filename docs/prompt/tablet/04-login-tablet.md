# 04 — Login Page (Tablet Breakpoint 641px–1024px)

---

## 1. Page Title & Route

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Page**       | Login                              |
| **Route**      | `/login`                           |
| **Component**  | `LoginPageTablet`                  |
| **Nav Tab**    | None (unauthenticated top nav)    |
| **Breakpoint** | 641px–1024px (tablet)             |

---

## 2. Tablet Design Rationale

Tablet gets a centered card layout with generous padding — not the full-width stretch of mobile, not the split-panel of desktop. The extra horizontal space (vs mobile) lets social login buttons sit side-by-side and form fields breathe without feeling cramped. Top navigation is visible above the card (horizontal, not bottom nav). Hover states are enabled on tablet since users have a pointing device or larger touch targets.

---

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────┐
│ TOP NAV: [Logo]  [Home]  [Browse]         [Login]   │
├──────────────────────────────────────────────────────┤
│                                                      │
│                    #16110f (canvas)                   │
│                                                      │
│         ┌─────────────────────────────────┐          │
│         │        CARD (max-w-md)          │          │
│         │     bg: #211a17, border         │          │
│         │                                 │          │
│         │   ┌─────────────────────────┐   │          │
│         │   │    Welcome Back          │   │          │
│         │   │    (Playfair Display)    │   │          │
│         │   └─────────────────────────┘   │          │
│         │                                 │          │
│         │   [Email field — full width]    │          │
│         │   [Password field — full width] │          │
│         │                                 │          │
│         │   ┌──────────┬──────────┐       │          │
│         │   │ Facebook │ Google   │       │          │
│         │   └──────────┴──────────┘       │          │
│         │                                 │          │
│         │   [  Sign In  — full width ]    │          │
│         │                                 │          │
│         │   Don't have account? Sign Up   │          │
│         └─────────────────────────────────┘          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 4. Component Breakdown

```tsx
// LoginPageTablet.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

export function LoginPageTablet() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#16110f] flex flex-col">
      {/* Top Nav */}
      <nav className="h-16 border-b border-[#3a322d] flex items-center justify-between px-6">
        <Link to="/" className="font-['Playfair_Display'] text-xl text-[#ece0dc]">
          Library
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/browse" className="text-sm text-[#a89c93] hover:text-[#ece0dc] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center">
            Browse
          </Link>
          <Link
            to="/login"
            className="text-sm text-[#e8693f] font-medium min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Centered Card */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-md bg-[#211a17] border border-[#3a322d] rounded-xl p-8"
        >
          <h1 className="font-['Playfair_Display'] text-2xl text-[#ece0dc] mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-[#a89c93] mb-8">
            Sign in to continue reading
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm text-[#a89c93] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 px-4 bg-[#16110f] border border-[#3a322d] rounded-lg text-sm text-[#ece0dc] placeholder-[#7a706a] focus:outline-none focus:border-[#e8693f] transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm text-[#a89c93] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 px-4 pr-12 bg-[#16110f] border border-[#3a322d] rounded-lg text-sm text-[#ece0dc] placeholder-[#7a706a] focus:outline-none focus:border-[#e8693f] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a706a] hover:text-[#a89c93] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Social Login — Side by Side */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="flex-1 h-12 border border-[#3a322d] rounded-lg text-sm text-[#a89c93] hover:border-[#4d433d] hover:text-[#ece0dc] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Facebook
              </button>
              <button
                type="button"
                className="flex-1 h-12 border border-[#3a322d] rounded-lg text-sm text-[#a89c93] hover:border-[#4d433d] hover:text-[#ece0dc] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex-1 h-px bg-[#3a322d]" />
              <span className="text-xs text-[#7a706a]">or</span>
              <div className="flex-1 h-px bg-[#3a322d]" />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-12 bg-[#e8693f] hover:bg-[#d45a30] text-[#16110f] font-medium rounded-lg transition-colors text-sm"
            >
              Sign In
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-sm text-[#a89c93] mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-[#e8693f] hover:text-[#d45a30] transition-colors">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
```

---

## 5. Tablet Interactions

| Element           | Interaction                                     |
| ----------------- | ----------------------------------------------- |
| Email input       | Focus: `border-[#e8693f]` ring. Tab order 1.   |
| Password input    | Focus: `border-[#e8693f]` ring. Tab order 2.   |
| Show/Hide toggle  | Hover: text `#a89c93 → #ece0dc`. Click: toggle.|
| Social buttons    | Hover: `border-[#4d433d]`, text lighten. Click: auth redirect. |
| Sign In button    | Hover: `bg-[#d45a30]`. Active: `scale-[0.98]`.  |
| Sign Up link      | Hover: `text-[#d45a30]`.                        |
| Keyboard          | Enter submits form. Tab cycles fields.          |
| Focus trap        | On modal open (if any): trap focus inside card.  |

---

## 6. Animation Spec

```ts
// Card entrance
{
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } // smooth
}

// Button hover micro-interaction
{
  whileHover: { scale: 1.01 },
  transition: { type: "spring", stiffness: 400, damping: 25 }
}

// Button active press
{
  whileTap: { scale: 0.98 }
}
```

---

## 7. Anti-Slop Checklist

- [ ] Zero indigo/blue/purple colors anywhere
- [ ] No glassmorphism or backdrop-blur
- [ ] No `shadow-lg` — elevation only via border + optional `shadow(0 4px 24px)`
- [ ] No bottom nav — top nav only
- [ ] Social buttons side-by-side, not stacked
- [ ] Card is `max-w-md` centered, not full-width
- [ ] No gradients on backgrounds or buttons
- [ ] No neon or glowing effects
- [ ] All text uses specified font families (Playfair Display headings, Inter body)
- [ ] `min-h-[40px] min-w-[40px]` on all interactive targets
- [ ] No `rounded-full` on card (use `rounded-xl`)
- [ ] Canvas bg is `#16110f`, not pure black or white
- [ ] No italic text on labels
- [ ] Password field has show/hide toggle, not eye icon
- [ ] No `text-xs` on form labels (use `text-sm`)
- [ ] Input placeholder color is `#7a706a` (muted), not lighter
- [ ] Card padding is `p-8` (32px), not less
- [ ] No `shadow-xl` or `shadow-2x` — keep elevation minimal
- [ ] Divider uses `bg-[#3a322d]` border color, not opacity

---

## 8. Complete Stitch Prompt

```
Build a tablet-optimized login page (641px–1024px breakpoint) for a library app.

ROUTE: /login
COMPONENT: LoginPageTablet

DESIGN TOKENS (exact values — embed in Tailwind classes):
- Canvas background: #16110f
- Surface (card): #211a17
- Surface Hover: #2a211c
- Border: #3a322d, Border Hover: #4d433d
- Accent: #e8693f, Accent Hover: #d45a30, Accent Muted: #e8693f20
- Text Primary: #ece0dc, Text Secondary: #a89c93, Text Muted: #7a706a
- Text on Accent: #16110f
- Fonts: Playfair Display (headings), Inter (body), JetBrains Mono (prices/code)
- Radius: sm 4px, 8px, lg 12px, xl 16px, 2xl 24px
- Elevation: 0=canvas, 1=surface+border, 2=surface+border+shadow(0 4px 24px)
- Animations: spring cubic-bezier(0.34, 1.56, 0.64, 1), smooth cubic-bezier(0.25, 0.1, 0.25, 1)

LAYOUT:
- Full viewport, min-h-screen, bg-[#16110f]
- Top horizontal navigation bar: h-16, border-b border-[#3a322d], flex justify-between items-center px-6
  - Left: Logo text "Library" in Playfair Display, text-xl, text-[#ece0dc]
  - Right: Nav links (Browse, Login) with gap-6, text-sm, text-[#a89c93], hover:text-[#ece0dc]
  - All nav links: min-h-[40px] min-w-[40px] flex items-center justify-center
- Main content: flex-1, flex items-center justify-center, px-6, py-12
- Centered card: w-full max-w-md, bg-[#211a17], border border-[#3a322d], rounded-xl, p-8

CARD CONTENT:
- Heading: "Welcome Back" — Playfair Display, text-2xl, text-[#ece0dc], mb-2
- Subheading: "Sign in to continue reading" — text-sm, text-[#a89c93], mb-8
- Form with space-y-5:
  - Email field: label "Email" (text-sm, text-[#a89c93], mb-2), input h-12, px-4, bg-[#16110f], border-[#3a322d], rounded-lg, text-sm, text-[#ece0dc], placeholder-[#7a706a], focus:border-[#e8693f], transition-colors
  - Password field: same styling, with Show/Hide toggle button (absolute positioned, right-3, min-h-[40px] min-w-[40px], text-[#7a706a] hover:text-[#a89c93])
  - Social login row: flex gap-3, two buttons side-by-side (Facebook, Google), each flex-1, h-12, border border-[#3a322d], rounded-lg, text-sm, text-[#a89c93], hover:border-[#4d433d], hover:text-[#ece0dc], flex items-center justify-center gap-2, with SVG icons
  - Divider: flex items-center gap-4, horizontal rule (flex-1 h-px bg-[#3a322d]) with "or" text (text-xs, text-[#7a706a])
  - Submit button: w-full, h-12, bg-[#e8693f], hover:bg-[#d45a30], text-[#16110f], font-medium, rounded-lg, text-sm, transition-colors
- Footer: "Don't have an account? Sign Up" — center, text-sm, text-[#a89c93], Sign Up link is text-[#e8693f] hover:text-[#d45a30] transition-colors

ANIMATIONS (Framer Motion):
- Card: initial { opacity: 0, y: 16 }, animate { opacity: 1, y: 0 }, transition { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
- Button hover: whileHover { scale: 1.01 }, transition { type: "spring", stiffness: 400, damping: 25 }
- Button active: whileTap { scale: 0.98 }
- Social buttons: same hover/active as submit

INTERACTIONS:
- All inputs: focus ring border-[#e8693f], outline-none
- All buttons: min-h-[40px] min-w-[40px]
- Tab order: email → password → social Facebook → social Google → submit
- Enter key submits form (onSubmit handler on form element)
- Password show/hide: toggles type between "text" and "password"
- No auto-focus on mount (login page is neutral entry point)

ACCESSIBILITY:
- All inputs have associated labels via htmlFor/id
- Form has aria-label="Login"
- Error states announced via aria-live="polite" if validation added
- Color contrast: #ece0dc on #211a17 = 13.2:1 (AAA)
- Focus visible: browser default ring on inputs, custom border on focus

ANTI-SLOP (enforce all):
- No indigo/blue/purple colors
- No glassmorphism, no backdrop-blur
- No shadow-lg
- No bottom nav (horizontal top nav only)
- No stacked social buttons (side-by-side flex)
- No full-width card (max-w-md)
- No gradients on backgrounds or buttons
- No neon/glowing effects
- All interactive targets ≥ 40px (min-h-[40px] min-w-[40px])
- No text-xs on form labels (use text-sm)
- Card padding p-8 (32px), not smaller
- Canvas bg #16110f, not pure black or white
- No rounded-full on card (use rounded-xl)
- Input placeholder color #7a706a

Write production-quality React + Tailwind CSS. Use TypeScript.
Import motion from framer-motion for animations.
All components must be self-contained in a single file.
```
