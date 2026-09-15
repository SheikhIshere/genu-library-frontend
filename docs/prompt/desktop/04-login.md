# Login Page — Stitch Prompt

## Purpose
User authentication — email and password login. User intent: access their account.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Split Panel Layout (desktop)
- Left panel (40%): Decorative — brand illustration, tagline text, subtle animated book elements
- Right panel (60%): Login form on dark surface

### 2. Login Form Card
- Brand logo at top (centered)
- Heading: "Welcome Back"
- Subtext: "Sign in to continue to Genu Library"
- Email input with mail icon prefix
- Password input with lock icon prefix + show/hide toggle eye icon
- "Remember me" checkbox (left) + "Forgot password?" link (right, orange text)
- Primary CTA button: "Sign In" (full-width, orange)
- Divider line with "or" text
- Social login buttons row: Google (with G icon) and GitHub (with icon) — disabled/stub state
- Bottom text: "Don't have an account? Sign Up" (Sign Up is orange link)

### 3. Mobile Layout
- Single column, no split panel
- Form card takes full width with padding
- Same form fields stacked vertically
- Brand logo above form

### 4. Tablet Layout
- Centered card with max-width constraint
- No split panel, just form on canvas background
- Decorative elements minimal

## Key Interactions
- Input focus: orange border glow, label animates up (floating label pattern)
- Password toggle: eye icon switches between show/hide
- Submit: button shows loading spinner, disabled during request
- Error state: input border turns red, error message slides in below
- Success: page transitions to home/dashboard
- Keyboard: Enter submits form
