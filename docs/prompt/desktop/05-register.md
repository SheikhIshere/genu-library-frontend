# Register Page — Stitch Prompt

## Purpose
New user registration. User intent: create an account with username, email, and password.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Split Panel Layout (desktop)
- Left panel (40%): Decorative — same brand illustration as login for consistency
- Right panel (60%): Registration form on dark surface

### 2. Registration Form Card
- Brand logo at top (centered)
- Heading: "Create Account"
- Subtext: "Join Genu Library and start discovering"
- Username input with user icon prefix
- Email input with mail icon prefix
- Password input with lock icon prefix + strength meter bar below
  - Strength meter: animated bar that fills and changes color based on strength (weak=fair=good=strong)
  - Strength label text below bar
- Confirm password input with lock icon prefix
  - Match indicator: checkmark (green) or X (red) with spring animation
- Primary CTA button: "Create Account" (full-width, orange)
- Divider with "or"
- Social buttons: Google + GitHub stubs
- Bottom: "Already have an account? Sign In" (orange link)

### 3. Mobile Layout
- Full-width form, no split panel
- Same fields stacked
- Password strength meter visible between password fields

### 4. Tablet Layout
- Centered card, max-width constraint

## Key Interactions
- Password strength: animated width bar + color transition as user types
- Confirm password: real-time match check with icon animation
- Username: availability hint (optional)
- Field validation: red border + error message slide-in on blur
- Submit: loading spinner, disabled during request
- Stagger: form fields animate in sequence (each slides up with delay)
