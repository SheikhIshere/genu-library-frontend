# Report Book — Stitch Prompt

## Purpose
Report a book for violating platform rules. User intent: select a reason and describe the issue.

## Platform
Web, Desktop-first, responsive.

## Page Structure

### 1. Navigation Bar (sticky)

### 2. Page Header
- Breadcrumb: Home > Books > [Title] > Report
- Heading: "Report Book"

### 3. Book Preview Card
- Small cover thumbnail
- Book title + author
- "You're reporting this book" label

### 4. Report Form
- Reason selection: radio card group (4 options)
  - Copyright Infringement (with copyright icon)
  - Adult Content (with warning icon)
  - Spam (with spam icon)
  - Other (with flag icon)
- Each radio card: icon + reason name + brief description, selectable with orange border
- Description textarea (optional): "Provide additional details..."
- Character count on textarea

### 5. Trust Note
- Small info box: "Reports are reviewed by our team. False reports may result in account restrictions."

### 6. Action Buttons
- "Submit Report" primary button (deep red/orange — slightly different from standard orange to signal caution)
- "Cancel" secondary button

## Key Interactions
- Radio cards: click selects with spring border animation
- Submit: POST request, success toast, navigate back to book detail
- Cancel: navigate back
- Validation: at least one reason required
- Mobile: full-width stacked
- Tablet: centered card
- Desktop: centered card with max-width constraint
