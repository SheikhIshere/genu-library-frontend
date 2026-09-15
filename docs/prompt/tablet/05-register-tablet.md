# 05 — Register Page (Tablet Breakpoint 641px–1024px)

---

## 1. Page Title & Route

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Page**       | Register                           |
| **Route**      | `/register`                        |
| **Component**  | `RegisterPageTablet`               |
| **Nav Tab**    | None (unauthenticated top nav)    |
| **Breakpoint** | 641px–1024px (tablet)             |

---

## 2. Tablet Design Rationale

Tablet registration uses a centered card with more padding than mobile, giving the form fields room to breathe. Password strength meter is wider and more visible at tablet widths. Inline validation (username availability, password match) is shown alongside fields rather than below. Social signup buttons sit side-by-side. Top nav is visible above.

---

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────┐
│ TOP NAV: [Logo]  [Home]  [Browse]       [Register]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│                    #16110f (canvas)                   │
│                                                      │
│         ┌─────────────────────────────────┐          │
│         │      CREATE ACCOUNT             │          │
│         │     bg: #211a17, border         │          │
│         │                                 │          │
│         │   [Username field]  [inline ✓]  │          │
│         │   [Email field]                 │          │
│         │   [Password field]              │          │
│         │   ┌─────────────────────────┐   │          │
│         │   │ ████████░░░░ Strong     │   │          │
│         │   └─────────────────────────┘   │          │
│         │   [Confirm Password]  [match ✓] │          │
│         │                                 │          │
│         │   ┌──────────┬──────────┐       │          │
│         │   │ Facebook │ Google   │       │          │
│         │   └──────────┴──────────┘       │          │
│         │                                 │          │
│         │   [  Create Account  ]          │          │
│         │                                 │          │
│         │   Already have account? Sign In │          │
│         └─────────────────────────────────┘          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 4. Component Breakdown

```tsx
// RegisterPageTablet.tsx
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
  success: "#4a7c59",
  error: "#c44d4d",
  warning: "#d4a24e",
};

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "#c44d4d" };
  if (score <= 3) return { score, label: "Medium", color: "#d4a24e" };
  return { score, label: "Strong", color: "#4a7c59" };
}

export function RegisterPageTablet() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const usernameAvailable = username.length >= 3; // placeholder check

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
            to="/register"
            className="text-sm text-[#e8693f] font-medium min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            Register
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
            Create Account
          </h1>
          <p className="text-sm text-[#a89c93] mb-8">
            Join the library community
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm text-[#a89c93] mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full h-12 px-4 pr-10 bg-[#16110f] border border-[#3a322d] rounded-lg text-sm text-[#ece0dc] placeholder-[#7a706a] focus:outline-none focus:border-[#e8693f] transition-colors"
                />
                {username.length >= 3 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a7c59] text-sm">
                    ✓
                  </span>
                )}
              </div>
              {username.length > 0 && username.length < 3 && (
                <p className="text-xs text-[#c44d4d] mt-1">At least 3 characters</p>
              )}
            </div>

            {/* Email */}
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

            {/* Password */}
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
                  placeholder="Create a password"
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

              {/* Strength Meter */}
              {password.length > 0 && (
                <div className="mt-3">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-colors"
                        style={{
                          backgroundColor:
                            i < strength.score ? strength.color : "#3a322d",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strength.color }}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="block text-sm text-[#a89c93] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full h-12 px-4 pr-10 bg-[#16110f] border border-[#3a322d] rounded-lg text-sm text-[#ece0dc] placeholder-[#7a706a] focus:outline-none focus:border-[#e8693f] transition-colors"
                />
                {confirmPassword.length > 0 && (
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                    style={{ color: passwordsMatch ? "#4a7c59" : "#c44d4d" }}
                  >
                    {passwordsMatch ? "✓" : "✗"}
                  </span>
                )}
              </div>
            </div>

            {/* Social Signup */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="flex-1 h-12 border border-[#3a322d] rounded-lg text-sm text-[#a89c93] hover:border-[#4d433d] hover:text-[#ece0dc] transition-colors flex items-center justify-center gap-2"
              >
                Facebook
              </button>
              <button
                type="button"
                className="flex-1 h-12 border border-[#3a322d] rounded-lg text-sm text-[#a89c93] hover:border-[#4d433d] hover:text-[#ece0dc] transition-colors flex items-center justify-center gap-2"
              >
                Google
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-12 bg-[#e8693f] hover:bg-[#d45a30] text-[#16110f] font-medium rounded-lg transition-colors text-sm"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-[#a89c93] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#e8693f] hover:text-[#d45a30] transition-colors">
              Sign In
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

| Element             | Interaction                                      |
| ------------------- | ------------------------------------------------ |
| Username input      | Focus: `border-[#e8693f]`. Inline check ≥3 chars.|
| Email input         | Focus: `border-[#e8693f]`. Tab order 2.          |
| Password input      | Focus: `border-[#e8693f]`. Show/Hide toggle.     |
| Confirm input       | Focus: `border-[#e8693f]`. Inline match icon.    |
| Strength meter      | Animated width transition on password change.     |
| Social buttons      | Hover: `border-[#4d433d]`, text lighten.          |
| Submit button       | Hover: `bg-[#d45a30]`. Active: `scale-[0.98]`.   |
| Keyboard            | Enter submits. Tab cycles all fields.             |

---

## 6. Animation Spec

```ts
// Card entrance
{
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
}

// Strength meter fill animation
// Use CSS transition on width: transition: width 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)

// Check/cross icon entrance
{
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring", stiffness: 500, damping: 30 }
}
```

---

## 7. Anti-Slop Checklist

- [ ] Zero indigo/blue/purple colors anywhere
- [ ] No glassmorphism or backdrop-blur
- [ ] No `shadow-lg` — elevation only via border
- [ ] No bottom nav — top nav only
- [ ] Social buttons side-by-side, not stacked
- [ ] Card is `max-w-md` centered, not full-width
- [ ] No gradients on backgrounds or buttons
- [ ] No neon or glowing effects
- [ ] All text uses specified font families
- [ ] `min-h-[40px] min-w-[40px]` on all interactive targets
- [ ] Password strength meter uses 5-segment bar, not text-only
- [ ] Inline validation icons (✓/✗) appear inside input fields
- [ ] Canvas bg is `#16110f`
- [ ] No italic text on labels
- [ ] Confirm password shows match/mismatch indicator inline

---

## 8. Complete Stitch Prompt

```
Build a tablet-optimized registration page (641px–1024px breakpoint) for a library app.

ROUTE: /register
COMPONENT: RegisterPageTablet

DESIGN TOKENS (exact values — embed in Tailwind classes):
- Canvas background: #16110f
- Surface (card): #211a17
- Border: #3a322d, Border Hover: #4d433d
- Accent: #e8693f, Accent Hover: #d45a30
- Text Primary: #ece0dc, Text Secondary: #a89c93, Text Muted: #7a706a
- Text on Accent: #16110f
- Status: Success #4a7c59, Error #c44d4d, Warning #d4a24e
- Fonts: Playfair Display (headings), Inter (body)
- Radius: xl 16px (card), lg 8px (inputs/buttons)

LAYOUT:
- Full viewport, min-h-screen, bg-[#16110f]
- Top horizontal navigation: h-16, border-b border-[#3a322d], flex justify-between items-center px-6
  - Left: Logo "Library" in Playfair Display text-xl text-[#ece0dc]
  - Right: Browse link (text-sm text-[#a89c93] hover:text-[#ece0dc]), Register link (text-sm text-[#e8693f] font-medium)
- Main: flex-1, flex items-center justify-center, px-6, py-12
- Card: w-full max-w-md, bg-[#211a17], border border-[#3a322d], rounded-xl, p-8

FORM FIELDS (all h-12, px-4, bg-[#16110f], border-[#3a322d], rounded-lg, text-sm, text-[#ece0dc], placeholder-[#7a706a], focus:border-[#e8693f]):
1. Username: label "Username", inline ✓ icon (absolute right-3, color #4a7c59) when ≥3 chars, error text "At least 3 characters" (#c44d4d) when 1-2 chars
2. Email: label "Email", type="email"
3. Password: label "Password", type toggleable (Show/Hide button, absolute right-3, min-h-[40px] min-w-[40px]), strength meter below:
   - 5 horizontal bars, each h-1.5, flex-1, rounded-full
   - Filled segments colored: Weak (#c44d4d), Medium (#d4a24e), Strong (#4a7c59)
   - Empty segments: #3a322d
   - Label below bars showing strength text
   - Strength logic: 1pt per: length≥8, length≥12, has uppercase, has number, has special char
4. Confirm Password: label "Confirm Password", same type as password, inline ✓ (green) or ✗ (red) icon when filled

SOCIAL SIGNUP: flex gap-3, two buttons side-by-side (Facebook, Google), each flex-1, h-12, border border-[#3a322d], rounded-lg, text-sm, text-[#a89c93], hover:border-[#4d433d]

SUBMIT: w-full, h-12, bg-[#e8693f], hover:bg-[#d45a30], text-[#16110f], font-medium, rounded-lg

FOOTER: "Already have an account? Sign In" — center, text-sm, text-[#a89c93], Sign In link text-[#e8693f] hover:text-[#d45a30]

ANIMATIONS (Framer Motion):
- Card: initial { opacity: 0, y: 16 }, animate { opacity: 1, y: 0 }, transition { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
- Validation icons: initial { opacity: 0, scale: 0.8 }, animate { opacity: 1, scale: 1 }, transition { type: "spring", stiffness: 500, damping: 30 }
- Strength bars: CSS transition on background-color, 0.3s smooth

INTERACTIONS:
- All inputs: focus ring border-[#e8693f]
- All buttons: min-h-[40px] min-w-[40px]
- Tab order: username → email → password → confirm → social buttons → submit
- Enter key submits form

ANTI-SLOP (enforce all):
- No indigo/blue/purple colors
- No glassmorphism, no backdrop-blur
- No shadow-lg
- No bottom nav
- No stacked social buttons (side-by-side)
- No full-width card
- No gradients, no neon/glowing
- All interactive targets ≥ 40px
- No text-only strength indicator (must have visual bar)

Write production-quality React + Tailwind CSS. Use TypeScript. Import motion from framer-motion.
```
