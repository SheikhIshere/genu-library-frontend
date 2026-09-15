# Edit Profile — Stitch Prompt

## Purpose
Edit own profile information. User intent: update avatar, personal details, and contact info.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Page Header
- Breadcrumb: Home > Profile > Edit
- Heading: "Edit Profile"
- Save + Cancel buttons (top-right on desktop, bottom on mobile)

### 3. Avatar Section
- Large circular avatar preview (current image or default)
- Hover overlay (desktop): semi-transparent dark overlay with camera icon slides up
- Click/tap: opens file picker for image upload
- File validation: image types only, max 1MB
- After selection: live preview with FileReader before save

### 4. Form Fields (2-column grid on desktop, stacked on mobile)
- Full Name: text input
- Age: number input
- Gender: radio button group (Male / Female / Other) — styled as selectable cards, not dropdown
- Phone: text input with phone icon
- Address: textarea
- Social Link: URL input with link icon

### 5. Action Buttons
- "Save Changes" primary button (orange)
- "Cancel" secondary button (outlined)
- Save: sends FormData via PATCH, shows loading spinner, redirects to profile on success
- Cancel: navigates back to profile view

## Key Interactions
- Avatar hover: overlay slides up with camera icon (desktop only)
- Avatar tap: file picker opens
- Radio cards: spring animation on selection, orange border highlight
- Save button: loading spinner during request, success checkmark morph
- Form validation: red border + error message on invalid fields
- Mobile: stacked layout, avatar centered, full-width fields
- Tablet: 2-column form grid
- Desktop: sidebar avatar (280px) + 2-column form area
