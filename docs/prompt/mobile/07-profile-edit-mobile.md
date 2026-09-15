# 07 — Profile Edit Page (Mobile)

## 1. Page Title & Route

- **Page**: Edit Profile
- **Route**: `/profile/edit`
- **Bottom Nav**: Yes — 4-tab bar (Home, Explore, Library, Profile)
- **Mobile breakpoint**: `max-width: 640px`

---

## 2. Mobile-First Design Rationale

Profile edit is a form-heavy page. On mobile, every field is stacked vertically within the thumb zone. The avatar upload sits at the top with a large tap target and camera icon overlay. The save button is fixed at the bottom of the viewport — always within thumb reach. Cancel sits above it in the scroll area. When the keyboard opens, the save button is pushed up with the page content (no fixed bottom elements that overlap). All inputs use appropriate mobile keyboard types.

---

## 3. Mobile Layout Specification

```
<div class="min-h-dvh bg-[#16110f] pb-20">
  <!-- pb-20 for bottom nav clearance -->
  <div class="flex flex-col">
    <!-- Top bar with Cancel + Save -->
    <!-- Avatar upload -->
    <!-- Form fields -->
  </div>
  <!-- Save button at bottom of form flow (not fixed) -->
  <!-- Bottom nav -->
</div>
```

- `min-h-dvh`, `pb-20` for bottom nav
- Single column, `px-4` horizontal padding
- Save button is the last element in the form flow — scrolls with content, stays in thumb zone naturally
- No fixed bottom save button (avoids keyboard overlap)
- Keyboard avoidance: form scrolls naturally, `scrollIntoView` on focused input

---

## 4. Component Breakdown

### 4a. Top Action Bar

```html
<div class="sticky top-0 z-40 bg-[#16110f]/90 backdrop-blur-md border-b border-[#3a322d]">
  <div class="flex items-center justify-between h-14 px-4">
    <button
      class="min-h-[44px] min-w-[44px] flex items-center justify-center text-sm text-[#a89c93] hover:text-[#ece0dc]"
    >
      Cancel
    </button>
    <h2 class="text-sm font-medium text-[#ece0dc]">Edit Profile</h2>
    <button
      class="min-h-[44px] min-w-[44px] flex items-center justify-center text-sm font-medium text-[#e8693f] hover:text-[#d45a30]"
    >
      Save
    </button>
  </div>
</div>
```

- Sticky top bar, translucent canvas with blur
- Cancel (left): ghost button, `text-sm`, `text-[#a89c93]`
- Title (center): `text-sm`, `font-medium`, `text-[#ece0dc]`
- Save (right): accent text, `font-medium`
- Both buttons: `min-h-[44px] min-w-[44px]`

### 4b. Avatar Upload Section

```html
<section class="flex flex-col items-center py-8 px-4">
  <div class="relative group">
    <img
      src={avatarPreview || avatarUrl}
      alt="Profile photo"
      class="w-28 h-28 rounded-full object-cover border-2 border-[#3a322d]"
    />
    <!-- Camera overlay -->
    <button
      class="absolute inset-0 flex items-center justify-center rounded-full
             bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity
             min-h-[44px] min-w-[44px]"
      aria-label="Change profile photo"
    >
      <svg class="w-8 h-8 text-[#ece0dc]"><!-- Camera icon --></svg>
    </button>
    <!-- Upload input, hidden -->
    <input
      type="file"
      accept="image/*"
      class="hidden"
      id="avatar-upload"
    />
  </div>
  <p class="text-xs text-[#7a706a] mt-3">Tap to change photo</p>
</section>
```

- Avatar: `w-28 h-28` (112px) — larger than profile view for easier tap
- Camera overlay: black 40% opacity circle, shows on hover/tap
- Hidden file input, triggered by button click
- `group` class on wrapper, overlay uses `group-hover:opacity-100`
- On mobile: tap avatar → opens file picker → preview updates live
- Haptic: medium on successful upload

### 4c. Form Container

```html
<form class="px-4 pb-8 flex flex-col gap-5" onSubmit={handleSubmit}>
```

- `pb-8` (32px) — breathing room before bottom nav
- `gap-5` (20px) between fields

### 4d. Name Input

```html
<div class="flex flex-col gap-2">
  <label for="name" class="text-sm font-medium text-[#a89c93]">
    Display name
  </label>
  <input
    id="name"
    type="text"
    inputmode="text"
    autocomplete="name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Your display name"
    class="w-full min-h-[48px] px-4 py-3 bg-[#16110f] border border-[#3a322d] rounded-lg
           text-[#ece0dc] placeholder:text-[#7a706a]
           focus:border-[#e8693f] focus:ring-3 focus:ring-[#e8693f26]
           focus:outline-none transition-colors"
  />
</div>
```

- Standard input styling
- `type="text"`, `inputmode="text"`, `autocomplete="name"`

### 4e. Age Input

```html
<div class="flex flex-col gap-2">
  <label for="age" class="text-sm font-medium text-[#a89c93]">
    Age
  </label>
  <input
    id="age"
    type="number"
    inputmode="numeric"
    autocomplete="off"
    value={age}
    onChange={(e) => setAge(e.target.value)}
    placeholder="Your age"
    min="13"
    max="120"
    class="w-full min-h-[48px] px-4 py-3 bg-[#16110f] border border-[#3a322d] rounded-lg
           text-[#ece0dc] placeholder:text-[#7a706a]
           focus:border-[#e8693f] focus:ring-3 focus:ring-[#e8693f26]
           focus:outline-none transition-colors
           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  />
</div>
```

- `type="number"`, `inputmode="numeric"` — numeric keyboard
- `min="13" max="120"` for validation
- Hide spin buttons with `[appearance:textfield]` and webkit pseudo-element overrides

### 4f. Gender Radio Buttons

```html
<div class="flex flex-col gap-2">
  <span class="text-sm font-medium text-[#a89c93]">Gender</span>
  <div class="flex gap-3">
    {['Male', 'Female', 'Non-binary', 'Prefer not to say'].map((option) => (
      <label
        key={option}
        class={`flex-1 min-h-[48px] flex items-center justify-center px-3 py-2 rounded-lg border
          text-sm cursor-pointer transition-colors
          ${gender === option
            ? 'bg-[#e8693f20] border-[#e8693f] text-[#e8693f]'
            : 'bg-[#16110f] border-[#3a322d] text-[#a89c93] hover:border-[#4d433d]'
          }`}
      >
        <input
          type="radio"
          name="gender"
          value={option}
          checked={gender === option}
          onChange={() => setGender(option)}
          class="sr-only"
        />
        {option}
      </label>
    ))}
  </div>
</div>
```

- Radio buttons styled as selectable pills/chips
- `flex` row, `gap-3`, each option `flex-1 min-h-[48px]`
- Selected: accent border + accent text + accent background at 20% opacity
- Unselected: border + secondary text
- `sr-only` input for accessibility
- Wraps to next row on very narrow screens (flex-wrap not needed since labels are short)

### 4g. Phone Input

```html
<div class="flex flex-col gap-2">
  <label for="phone" class="text-sm font-medium text-[#a89c93]">
    Phone number
  </label>
  <input
    id="phone"
    type="tel"
    inputmode="tel"
    autocomplete="tel"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    placeholder="+1 (555) 000-0000"
    class="w-full min-h-[48px] px-4 py-3 bg-[#16110f] border border-[#3a322d] rounded-lg
           text-[#ece0dc] placeholder:text-[#7a706a]
           focus:border-[#e8693f] focus:ring-3 focus:ring-[#e8693f26]
           focus:outline-none transition-colors"
  />
</div>
```

- `type="tel"`, `inputmode="tel"` — phone keyboard
- `autocomplete="tel"` for autofill

### 4h. Address Input

```html
<div class="flex flex-col gap-2">
  <label for="address" class="text-sm font-medium text-[#a89c93]">
    Address
  </label>
  <input
    id="address"
    type="text"
    inputmode="text"
    autocomplete="street-address"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    placeholder="City, Country"
    class="w-full min-h-[48px] px-4 py-3 bg-[#16110f] border border-[#3a322d] rounded-lg
           text-[#ece0dc] placeholder:text-[#7a706a]
           focus:border-[#e8693f] focus:ring-3 focus:ring-[#e8693f26]
           focus:outline-none transition-colors"
  />
</div>
```

- `autocomplete="street-address"`

### 4i. Social Link Input

```html
<div class="flex flex-col gap-2">
  <label for="social-link" class="text-sm font-medium text-[#a89c93]">
    Social link
  </label>
  <input
    id="social-link"
    type="url"
    inputmode="url"
    autocomplete="url"
    value={socialLink}
    onChange={(e) => setSocialLink(e.target.value)}
    placeholder="https://..."
    class="w-full min-h-[48px] px-4 py-3 bg-[#16110f] border border-[#3a322d] rounded-lg
           text-[#ece0dc] placeholder:text-[#7a706a]
           focus:border-[#e8693f] focus:ring-3 focus:ring-[#e8693f26]
           focus:outline-none transition-colors"
  />
</div>
```

- `type="url"`, `inputmode="url"` — URL keyboard on mobile
- `autocomplete="url"`

### 4j. Save Button (Bottom of Form)

```html
<div class="flex flex-col gap-3 mt-4">
  <button
    type="submit"
    class="w-full min-h-[52px] rounded-lg bg-[#e8693f] text-[#16110f] font-semibold text-base
           hover:bg-[#d45a30] active:scale-[0.97] transition-all
           disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Save Changes
  </button>
  <button
    type="button"
    onClick={handleCancel}
    class="w-full min-h-[48px] rounded-lg border border-[#3a322d] text-[#a89c93] font-medium text-sm
           hover:border-[#4d433d] hover:text-[#ece0dc] active:scale-[0.97] transition-all"
  >
    Cancel
  </button>
</div>
```

- Save: oversized primary button, `min-h-[52px]`
- Cancel: secondary button below, `min-h-[48px]`
- Both in normal document flow (not fixed) — keyboard pushes them up naturally
- Loading state on save: spinner + "Saving..."
- Haptic: medium on save tap, light on cancel

---

## 5. Mobile Interactions

| Interaction | Behavior |
|---|---|
| **Avatar tap** | Opens file picker. On selection: show preview with scale animation. Haptic: medium on successful upload |
| **Input focus** | `scrollIntoView({ behavior: 'smooth', block: 'center' })`. Border transitions to accent |
| **Gender radio tap** | Haptic: light. Pill fills with accent color, text changes to accent |
| **Save tap** | Haptic: medium. Disable button, show spinner. On success: navigate back to /profile with toast "Profile updated". On error: show inline error, re-enable button |
| **Cancel tap** | Haptic: light. If form is dirty: show confirmation "Discard changes?" bottom sheet. If clean: navigate back immediately |
| **Back swipe** | If form is dirty: show discard confirmation. If clean: navigate back |
| **Keyboard avoidance** | No fixed bottom elements. Save/cancel buttons in document flow. scrollIntoView on focused input |
| **Unsaved changes** | Track dirty state. Warn on navigation away if dirty |

---

## 6. Animation Spec (Framer Motion)

```tsx
// Page entry
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
>

// Avatar
<motion.img
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
/>

// Avatar preview swap
<motion.img
  key={avatarPreview}
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 300 }}
/>

// Form fields stagger
{fields.map((field, i) => (
  <motion.div
    key={field.id}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 + i * 0.05, duration: 0.25 }}
  />
))}

// Gender pill selection
<motion.div
  animate={{
    borderColor: isSelected ? '#e8693f' : '#3a322d',
    backgroundColor: isSelected ? 'rgba(232,105,63,0.12)' : 'transparent'
  }}
  transition={{ duration: 0.15 }}
/>

// Save button press
<motion.button
  whileTap={{ scale: 0.97 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
/>

// Discard confirmation sheet
<motion.div
  initial={{ y: '100%' }}
  animate={{ y: 0 }}
  exit={{ y: '100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
/>
```

---

## 7. Mobile-Specific Anti-Slop Checklist

- [ ] Bottom nav present and fixed
- [ ] `pb-20` on main content to clear bottom nav
- [ ] `env(safe-area-inset-bottom)` on bottom nav
- [ ] `min-h-[48px]` on all inputs, buttons, labels
- [ ] `min-h-[44px] min-w-[44px]` on avatar tap target
- [ ] Avatar upload uses hidden file input, tap triggers picker
- [ ] `type="number" inputmode="numeric"` for age
- [ ] `type="tel" inputmode="tel"` for phone
- [ ] `type="url" inputmode="url"` for social link
- [ ] `autocomplete` attributes on all inputs
- [ ] Gender radios styled as pills with min-h-[48px]
- [ ] No fixed bottom save button (avoids keyboard overlap)
- [ ] Save/cancel in document flow, keyboard pushes them up
- [ ] Unsaved changes detection and discard confirmation
- [ ] Skeleton loading if loading existing profile data
- [ ] Single column layout
- [ ] No glassmorphism, no indigo/blue/purple
- [ ] No shadow-lg, no gradient backgrounds
- [ ] Loading state on save button
- [ ] Haptic feedback on avatar upload, save, cancel, gender select

---

## 8. Complete Stitch Prompt

```
Build a mobile-only Profile Edit page (max-width: 640px) for the Forge & Flux library app.

## Tech
React, Tailwind CSS, Framer Motion, React Router v6.

## Route & Nav
- Route: /profile/edit
- Bottom navigation bar: YES, fixed at bottom
- Bottom nav: 4 tabs (Home, Explore, Library, Profile), Profile tab active
- Same bottom nav component as profile page

## Layout
- Outer: min-h-dvh bg-[#16110f] pb-20
- Single column, px-4 horizontal padding
- Form in normal document flow (no fixed save button)

## Top Action Bar
- Sticky top-0 z-40, bg-[#16110f]/90 backdrop-blur-md border-b border-[#3a322d]
- h-14, flex items-center justify-between px-4
- Left: "Cancel" button, min-h-[44px] min-w-[44px], text-sm text-[#a89c93] hover:text-[#ece0dc]
- Center: "Edit Profile" text-sm font-medium text-[#ece0dc]
- Right: "Save" button, min-h-[44px] min-w-[44px], text-sm font-medium text-[#e8693f] hover:text-[#d45a30]
- Both actions in header are alternatives to the bottom save/cancel

## Avatar Upload Section
- flex flex-col items-center py-8 px-4
- Avatar wrapper: relative group
- Image: w-28 h-28 rounded-full object-cover border-2 border-[#3a322d]
- Camera overlay: absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center min-h-[44px] min-w-[44px]
  - Camera SVG icon: w-8 h-8 text-[#ece0dc]
- Hidden file input: type="file" accept="image/*" class="hidden"
- Button click triggers file input click
- On file select: show live preview with motion.img key={previewUrl} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} spring stiffness 300
- "Tap to change photo" hint: text-xs text-[#7a706a] mt-3
- Haptic: medium on successful upload

## Form
- px-4 pb-8 flex flex-col gap-5
- onSubmit: validate, call API, navigate back on success

### Display Name
- Label: "Display name", text-sm font-medium text-[#a89c93], gap-2
- Input: type="text", inputmode="text", autocomplete="name", value={name}, onChange, placeholder="Your display name"
- Input classes: w-full min-h-[48px] px-4 py-3 bg-[#16110f] border border-[#3a322d] rounded-lg text-[#ece0dc] placeholder:text-[#7a706a] focus:border-[#e8693f] focus:ring-3 focus:ring-[#e8693f26] focus:outline-none transition-colors

### Age
- Label: "Age"
- Input: type="number", inputmode="numeric", autocomplete="off", value={age}, min="13" max="120"
- Same input classes + [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none (hides spinner arrows)

### Gender
- Label: "Gender" (as span, not label, since it's a group)
- Container: flex gap-3 (4 options in a row, wrapping if needed)
- Options: Male, Female, Non-binary, Prefer not to say
- Each option: flex-1 min-h-[48px] flex items-center justify-center px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors
  - Selected: bg-[#e8693f20] border-[#e8693f] text-[#e8693f]
  - Unselected: bg-[#16110f] border-[#3a322d] text-[#a89c93] hover:border-[#4d433d]
- Hidden radio input: type="radio" name="gender" value={option} checked={gender === option} onChange={() => setGender(option)} class="sr-only"
- On select: haptic light

### Phone
- Label: "Phone number"
- Input: type="tel", inputmode="tel", autocomplete="tel", value={phone}, placeholder="+1 (555) 000-0000"
- Same input classes

### Address
- Label: "Address"
- Input: type="text", inputmode="text", autocomplete="street-address", value={address}, placeholder="City, Country"
- Same input classes

### Social Link
- Label: "Social link"
- Input: type="url", inputmode="url", autocomplete="url", value={socialLink}, placeholder="https://..."
- Same input classes

## Save / Cancel (Bottom of Form)
- flex flex-col gap-3 mt-4
- Save button: w-full min-h-[52px] rounded-lg bg-[#e8693f] text-[#16110f] font-semibold text-base hover:bg-[#d45a30] active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed
  - Text: "Save Changes"
  - Loading: disable + spinner (animate-spin h-5 w-5) + "Saving..."
  - Haptic: medium on tap
- Cancel button: w-full min-h-[48px] rounded-lg border border-[#3a322d] text-[#a89c93] font-medium text-sm hover:border-[#4d433d] hover:text-[#ece0dc] active:scale-[0.97] transition-all
  - Text: "Cancel"
  - Haptic: light on tap

## Unsaved Changes
- Track dirty state: compare current form values to initial values
- On cancel tap or back swipe: if dirty, show discard confirmation bottom sheet
  - Sheet: "Discard changes?" title, "You have unsaved changes." description
  - Two buttons: "Keep editing" (closes sheet) and "Discard" (navigates back, haptic medium)
  - Sheet animation: motion.div spring slide from bottom
- On save success: navigate to /profile with toast "Profile updated"

## Interactions
1. Avatar tap: opens file picker, preview updates live, haptic medium
2. Input focus: scrollIntoView({ behavior: 'smooth', block: 'center' })
3. Gender select: haptic light, pill animates to accent color
4. Save: haptic medium, disable button, show spinner, API call, navigate back on success
5. Cancel: if dirty show discard sheet, if clean navigate back. Haptic light
6. Back swipe: same as cancel logic
7. No fixed bottom elements — all in document flow for keyboard compatibility

## Framer Motion
- Page: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} duration 0.35
- Avatar: whileTap={{ scale: 0.95 }}, spring stiffness 400
- Avatar preview swap: key={previewUrl}, initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
- Fields: stagger, initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} delay 0.1 + i * 0.05
- Gender pills: animate border and background color transition 150ms
- Save button: whileTap={{ scale: 0.97 }}, spring
- Discard sheet: spring slide from bottom

## Design Tokens (Forge & Flux)
- Canvas: #16110f, Surface: #211a17
- Primary: #e8693f, Hover: #d45a30
- Border: #3a322d, Hover: #4d433d
- Text: #ece0dc, #a89c93, #7a706a
- Fonts: Playfair Display (display), Inter (body), JetBrains Mono (mono)
- Radius: 8px (inputs/buttons), 12px (cards), 9999px (pills/avatars)

## Anti-Slop Rules
- Bottom nav present with env(safe-area-inset-bottom)
- pb-20 on content to clear nav
- Every button min-h-[48px] or min-h-[44px] min-w-[44px]
- No fixed save button — keyboard overlap
- All inputs have correct type and inputmode attributes
- All inputs have autocomplete attributes
- Gender radios styled as touch-friendly pills
- Single column layout
- Unsaved changes detection and confirmation
- No glassmorphism, no indigo/blue/purple, no shadow-lg, no gradient backgrounds
- All colors from Forge & Flux palette only
```