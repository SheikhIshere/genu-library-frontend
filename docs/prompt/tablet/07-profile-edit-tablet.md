# 07 — Profile Edit Page (Tablet Breakpoint 641px–1024px)

---

## 1. Page Title & Route

| Property       | Value                              |
| -------------- | ---------------------------------- |
| **Page**       | Edit Profile                       |
| **Route**      | `/profile/edit`                    |
| **Component**  | `ProfileEditPageTablet`            |
| **Nav Tab**    | Profile (top nav)                  |
| **Breakpoint** | 641px–1024px (tablet)             |

---

## 2. Tablet Design Rationale

Tablet edit profile uses a 2-column layout: left column for avatar preview with hover overlay, right column for a 2-column form grid. This充分利用了tablet的水平空间，避免了mobile的单列堆叠。Save/Cancel buttons are inline (not stacked). Form fields are larger with more padding. Top nav replaces bottom nav.

---

## 3. Tablet Layout Specification

```
┌──────────────────────────────────────────────────────────────┐
│ TOP NAV: [Logo]  [Home]  [Browse]  [Profile]     [Avatar▼] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────┬──────────────────────────────────┐   │
│  │ LEFT COLUMN        │ RIGHT COLUMN                     │   │
│  │                    │                                  │   │
│  │   ┌──────────┐     │  [First Name]  [Last Name]      │   │
│  │   │  Avatar  │     │  [Age]         [Gender ▼]       │   │
│  │   │  w-40    │     │  [Phone]       [Address]        │   │
│  │   │ hover:   │     │  [Social Link]                   │   │
│  │   │ "Change"│     │                                  │   │
│  │   └──────────┘     │  ┌──────────┬──────────┐        │   │
│  │                    │  │  Cancel  │   Save   │        │   │
│  │   Preview name     │  └──────────┴──────────┘        │   │
│  │   Preview email    │                                  │   │
│  │                    │                                  │   │
│  └────────────────────┴──────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Component Breakdown

```tsx
// ProfileEditPageTablet.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
};

interface ProfileForm {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  phone: string;
  address: string;
  socialLink: string;
}

export function ProfileEditPageTablet() {
  const navigate = useNavigate();
  const [avatarHover, setAvatarHover] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    firstName: "Jane",
    lastName: "Cooper",
    age: "28",
    gender: "female",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City",
    socialLink: "@janecooper",
  });

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

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

      {/* Page Header */}
      <div className="px-6 pt-6 pb-2">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-['Playfair_Display'] text-2xl text-[#ece0dc]">
            Edit Profile
          </h1>
        </div>
      </div>

      {/* Edit Content */}
      <main className="flex-1 px-6 py-6">
        <div className="max-w-5xl mx-auto flex gap-8">
          {/* Left Column — Avatar Preview */}
          <aside className="w-64 shrink-0">
            <div className="bg-[#211a17] border border-[#3a322d] rounded-xl p-6">
              <div
                className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden cursor-pointer"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                <img
                  src="/avatar.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div
                  className={`absolute inset-0 bg-[#16110f]/70 flex items-center justify-center transition-opacity ${
                    avatarHover ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-sm text-[#ece0dc] font-medium">
                    Change
                  </span>
                </div>
              </div>

              {/* Preview Info */}
              <div className="text-center">
                <p className="text-sm text-[#ece0dc] font-medium">
                  {form.firstName} {form.lastName}
                </p>
                <p className="text-xs text-[#7a706a] mt-1">
                  {form.socialLink}
                </p>
              </div>

              {/* Danger Zone */}
              <div className="mt-6 pt-4 border-t border-[#3a322d]">
                <button className="w-full h-10 text-sm text-[#c44d4d] hover:text-[#e8693f] transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          </aside>

          {/* Right Column — Form */}
          <section className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-[#211a17] border border-[#3a322d] rounded-xl p-8"
            >
              <form onSubmit={(e) => e.preventDefault()}>
                {/* 2-Column Form Grid */}
                <div className="grid grid-cols-2 gap-5">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm text-[#a89c93] mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      className="w-full h-12 px-4 bg-[#16110f] border border-[#3a322d] rounded-lg text-sm text-[#ece0dc] placeholder-[#7a706a] focus:outline-none focus:border-[#e8693f] transition-colors"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm text-[#a89c93] mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      className="w-full h-12 px-4 bg-[#16110f] border border-[#3a322d] rounded-lg text-sm text-[#ece0dc] placeholder-[#7a706a] focus:outline-none focus:border-[#e8693f] transition-colors"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm text-[#a89c93] mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={form.age}
                      onChange={(e) => handleChange("age", e.target.value)}
                      className="w-full h-12 px-4 bg-[#16110f] border border-[#3a322d] rounded-lg text-sm text-[#ece0dc] placeholder-[#7a706a] focus:outline-none focus:border-[#e8693f] transition-colors"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm text-[#a89c93] mb-2">
                      Gender
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      className="w-full h-12 px-4 bg-[#16110f] border border-[#3a322d] rounded-lg text-sm text-[#ece0dc] focus:outline-none focus:border-[#e8693f] transition-colors appearance-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not">Prefer not to say</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm text-[#a89c93] mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full h-12 px-4 bg-[#16110f] border border-[#3a322d] rounded-lg text-sm text-[#ece0dc] placeholder-[#7a706a] focus:outline-none focus:border-[#e8693f] transition-colors"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm text-[#a89c93] mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="w-full h-12 px-4 bg-[#16110f] border border-[#3a322d] rounded-lg text-sm text-[#ece0dc] placeholder-[#7a706a] focus:outline-none focus:border-[#e8693f] transition-colors"
                    />
                  </div>

                  {/* Social Link — spans full width */}
                  <div className="col-span-2">
                    <label className="block text-sm text-[#a89c93] mb-2">
                      Social Link
                    </label>
                    <input
                      type="text"
                      value={form.socialLink}
                      onChange={(e) => handleChange("socialLink", e.target.value)}
                      placeholder="@username"
                      className="w-full h-12 px-4 bg-[#16110f] border border-[#3a322d] rounded-lg text-sm text-[#ece0dc] placeholder-[#7a706a] focus:outline-none focus:border-[#e8693f] transition-colors"
                    />
                  </div>
                </div>

                {/* Action Buttons — Inline */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[#3a322d]">
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="h-12 px-6 border border-[#3a322d] rounded-lg text-sm text-[#a89c93] hover:border-[#4d433d] hover:text-[#ece0dc] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-12 px-8 bg-[#e8693f] hover:bg-[#d45a30] text-[#16110f] font-medium rounded-lg transition-colors text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
}
```

---

## 5. Tablet Interactions

| Element            | Interaction                                        |
| ------------------ | -------------------------------------------------- |
| Avatar container   | Hover: overlay appears with "Change" text, opacity transition. |
| Form inputs        | Focus: `border-[#e8693f]`. Tab order follows grid.  |
| Gender select      | Custom styled, no native dropdown chrome.            |
| Cancel button      | Hover: `border-[#4d433d]`, text lighten. Click: navigate back. |
| Save button        | Hover: `bg-[#d45a30]`. Active: `scale-[0.98]`.      |
| Delete Account     | Hover: `text-[#e8693f]`. Click: confirmation modal.  |
| Keyboard           | Enter saves. Escape cancels. Tab cycles fields.      |
| Focus management   | First field auto-focuses on page load.               |

---

## 6. Animation Spec

```ts
// Page entrance
{
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
}

// Avatar hover overlay
// CSS transition: opacity 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)

// Save button
{
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 400, damping: 25 }
}

// Cancel button
{
  whileHover: { scale: 1.01 },
  transition: { type: "spring", stiffness: 400, damping: 25 }
}
```

---

## 7. Anti-Slop Checklist

- [ ] Zero indigo/blue/purple colors anywhere
- [ ] No glassmorphism or backdrop-blur
- [ ] No `shadow-lg` — elevation via border only
- [ ] Top nav present, no bottom nav
- [ ] 2-column layout (avatar left, form right)
- [ ] Form fields in 2-column grid (not stacked)
- [ ] Save/Cancel buttons inline (flex justify-end), not stacked
- [ ] Avatar is `w-40`, with hover overlay for change
- [ ] Gender uses styled select, not native dropdown
- [ ] All inputs `h-12` (not h-10 like mobile)
- [ ] No gradients on backgrounds or buttons
- [ ] All text uses specified font families
- [ ] `min-h-[40px] min-w-[40px]` on all interactive targets
- [ ] Canvas bg is `#16110f`
- [ ] Social link spans full width (col-span-2)
- [ ] Delete Account is in sidebar, separate from form actions

---

## 8. Complete Stitch Prompt

```
Build a tablet-optimized profile edit page (641px–1024px breakpoint) for a library app.

ROUTE: /profile/edit
COMPONENT: ProfileEditPageTablet

DESIGN TOKENS (exact values — embed in Tailwind classes):
- Canvas: #16110f, Surface: #211a17, Surface Hover: #2a211c
- Accent: #e8693f, Accent Hover: #d45a30
- Border: #3a322d, Border Hover: #4d433d
- Text Primary: #ece0dc, Text Secondary: #a89c93, Text Muted: #7a706a
- Text on Accent: #16110f
- Status: Error #c44d4d
- Fonts: Playfair Display (headings), Inter (body)
- Radius: lg 8px, xl 16px

TOP NAVIGATION (horizontal, NOT bottom nav):
- h-16, border-b border-[#3a322d], flex justify-between items-center px-6
- Left: Logo "Library" in Playfair Display, text-xl, text-[#ece0dc]
- Right: Nav links (Home, Browse, Profile), text-sm, text-[#a89c93], active text-[#e8693f]
- All links: min-h-[40px] min-w-[40px] flex items-center justify-center
- Far right: User avatar circle

PAGE HEADER:
- px-6 pt-6 pb-2
- Heading: "Edit Profile", Playfair Display, text-2xl, text-[#ece0dc]
- Container: max-w-5xl mx-auto

MAIN LAYOUT (2-column):
- max-w-5xl mx-auto, flex gap-8, px-6 py-6

LEFT COLUMN (w-64 shrink-0):
- Card: bg-[#211a17], border border-[#3a322d], rounded-xl, p-6
- Avatar container: relative, w-40 h-40, mx-auto, mb-4, rounded-full, overflow-hidden, cursor-pointer
  - Image: w-full h-full object-cover
  - Hover overlay: absolute inset-0, bg-[#16110f]/70, flex items-center justify-center, opacity-0 → opacity-100 on hover, CSS transition 0.2s
  - Overlay text: "Change", text-sm, text-[#ece0dc], font-medium
- Preview info: text-center
  - Name: text-sm text-[#ece0dc] font-medium
  - Handle: text-xs text-[#7a706a] mt-1
- Danger zone: mt-6 pt-4 border-t border-[#3a322d]
  - Delete Account button: w-full h-10, text-sm text-[#c44d4d], hover:text-[#e8693f]

RIGHT COLUMN (flex-1 min-w-0):
- Card: bg-[#211a17], border border-[#3a322d], rounded-xl, p-8
- Form with grid grid-cols-2 gap-5:
  - All inputs: h-12, px-4, bg-[#16110f], border border-[#3a322d], rounded-lg, text-sm, text-[#ece0dc], placeholder-[#7a706a], focus:border-[#e8693f]
  - Labels: text-sm text-[#a89c93] mb-2
  1. First Name (text)
  2. Last Name (text)
  3. Age (number)
  4. Gender (select, custom styled with appearance-none)
  5. Phone (tel)
  6. Address (text)
  7. Social Link (text, col-span-2, full width, placeholder "@username")

ACTION BUTTONS (flex justify-end gap-3, mt-8 pt-6 border-t border-[#3a322d]):
- Cancel: h-12 px-6, border border-[#3a322d], rounded-lg, text-sm, text-[#a89c93], hover:border-[#4d433d] hover:text-[#ece0dc]
- Save Changes: h-12 px-8, bg-[#e8693f], hover:bg-[#d45a30], text-[#16110f], font-medium, rounded-lg, text-sm

ANIMATIONS (Framer Motion):
- Page: initial { opacity: 0, y: 16 }, animate { opacity: 1, y: 0 }, duration 0.4, ease [0.25, 0.1, 0.25, 1]
- Save button: whileHover { scale: 1.01 }, whileTap { scale: 0.98 }, spring stiffness 400 damping 25
- Cancel button: whileHover { scale: 1.01 }
- Avatar overlay: CSS transition opacity 0.2s

INTERACTIONS:
- First name input auto-focuses on mount
- Enter key saves form
- Escape key navigates back to profile
- Tab cycles through all form fields
- All inputs: focus ring border-[#e8693f]
- All buttons: min-h-[40px] min-w-[40px]
- Delete Account click: show confirmation modal (not implemented here, just the trigger)

ANTI-SLOP (enforce all):
- No indigo/blue/purple
- No glassmorphism, no backdrop-blur
- No shadow-lg
- No bottom nav (horizontal top nav only)
- No single-column form (must be 2-column grid)
- No stacked Save/Cancel buttons (must be inline flex justify-end)
- Avatar must be w-40 with hover overlay
- Gender select must be custom styled
- No gradients, no neon/glowing
- All interactive targets ≥ 40px
- Canvas bg #16110f
- Social link must span full width (col-span-2)
- Delete Account must be in sidebar, not in form actions

Write production-quality React + Tailwind CSS. Use TypeScript. Import motion from framer-motion.
```
