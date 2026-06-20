---
version: alpha
name: PTElanka
description: >
  Design system for PTElanka — a PTE Academic preparation app
  for Sinhala-speaking Sri Lankan students. Modern, clean,
  readability-first. High contrast, generous spacing.

# ─────────────────────────────────────────────
# COLOR PRIMITIVES
# ─────────────────────────────────────────────

colors:
  # ── Primary (Electric Cobalt) ──────────────
  primary-50:  "#EEF1FF"
  primary-100: "#DFE4FF"
  primary-200: "#C5CDFF"
  primary-300: "#A2AEFF"
  primary-400: "#7A85FB"
  primary-500: "#4361EE"
  primary-600: "#3148D5"
  primary-700: "#2838AE"
  primary-800: "#25308C"
  primary-900: "#232D72"
  primary-950: "#161B46"

  # ── Gray (Cool Gray, blue-tinted) ──────────
  gray-50:  "#F8F9FB"
  gray-100: "#F1F3F6"
  gray-200: "#E3E7ED"
  gray-300: "#CBD1DB"
  gray-400: "#9AA3B3"
  gray-500: "#697586"
  gray-600: "#4F5B6B"
  gray-700: "#3D4754"
  gray-800: "#2B3340"
  gray-900: "#1C232E"
  gray-950: "#12171F"

  # ── Success (Green) ────────────────────────
  success-50:  "#ECFDF5"
  success-100: "#D1FAE5"
  success-200: "#A7F3D0"
  success-300: "#6EE7B7"
  success-400: "#34D399"
  success-500: "#10B981"
  success-600: "#059669"
  success-700: "#047857"
  success-800: "#065F46"
  success-900: "#064E3B"
  success-950: "#022C22"

  # ── Warning (Amber) ────────────────────────
  warning-50:  "#FFFBEB"
  warning-100: "#FEF3C7"
  warning-200: "#FDE68A"
  warning-300: "#FCD34D"
  warning-400: "#FBBF24"
  warning-500: "#F59E0B"
  warning-600: "#D97706"
  warning-700: "#B45309"
  warning-800: "#92400E"
  warning-900: "#713F12"
  warning-950: "#451A03"

  # ── Danger (Red) ───────────────────────────
  danger-50:  "#FEF2F2"
  danger-100: "#FEE2E2"
  danger-200: "#FECACA"
  danger-300: "#FDA29B"
  danger-400: "#F87171"
  danger-500: "#EF4444"
  danger-600: "#DC2626"
  danger-700: "#B91C1C"
  danger-800: "#991B1B"
  danger-900: "#7F1D1D"
  danger-950: "#450A0A"

  # ── Semantic Aliases ───────────────────────
  action-primary:       "{colors.primary-500}"
  action-primary-hover: "{colors.primary-600}"
  action-primary-active: "{colors.primary-700}"

  surface-page:    "#FFFFFF"
  surface-subtle:  "{colors.gray-50}"
  surface-muted:   "{colors.gray-100}"
  surface-raised:  "#FFFFFF"
  surface-overlay: "rgba(0, 0, 0, 0.5)"

  text-primary:   "{colors.gray-900}"
  text-secondary: "{colors.gray-500}"
  text-tertiary:  "{colors.gray-400}"
  text-on-action: "#FFFFFF"
  text-link:      "{colors.primary-500}"
  text-link-hover: "{colors.primary-600}"

  border-default: "{colors.gray-200}"
  border-strong:  "{colors.gray-300}"
  border-focus:   "{colors.primary-500}"

  feedback-success-bg:   "{colors.success-50}"
  feedback-success-text: "{colors.success-700}"
  feedback-danger-bg:    "{colors.danger-50}"
  feedback-danger-text:  "{colors.danger-700}"
  feedback-warning-bg:   "{colors.warning-50}"
  feedback-warning-text: "{colors.warning-700}"


# ─────────────────────────────────────────────
# TYPOGRAPHY
# ─────────────────────────────────────────────

typography:
  # ── Latin (Inter) ──────────────────────────
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.025em

  h1:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.025em

  h2:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em

  h3:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em

  h4:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.35

  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6

  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5

  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5

  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4

  overline:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.05em

  # ── Sinhala (Noto Sans Sinhala) ────────────
  # Sinhala glyphs are taller due to diacritics (pili, kombuwa, etc.)
  # Same font sizes as Latin, but with adjusted line-heights to prevent clipping.

  sinhala-h1:
    fontFamily: Noto Sans Sinhala
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.4

  sinhala-h2:
    fontFamily: Noto Sans Sinhala
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.4

  sinhala-h3:
    fontFamily: Noto Sans Sinhala
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.45

  sinhala-body-lg:
    fontFamily: Noto Sans Sinhala
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.8

  sinhala-body:
    fontFamily: Noto Sans Sinhala
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75

  sinhala-body-sm:
    fontFamily: Noto Sans Sinhala
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.7

  sinhala-caption:
    fontFamily: Noto Sans Sinhala
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.6


# ─────────────────────────────────────────────
# SPACING
# ─────────────────────────────────────────────

spacing:
  px:  1px
  0.5: 2px
  1:   4px
  1.5: 6px
  2:   8px
  2.5: 10px
  3:   12px
  4:   16px
  5:   20px
  6:   24px
  8:   32px
  10:  40px
  12:  48px
  16:  64px
  20:  80px
  24:  96px


# ─────────────────────────────────────────────
# BORDER RADIUS
# ─────────────────────────────────────────────

rounded:
  sm:   4px
  md:   8px
  lg:   12px
  xl:   16px
  2xl:  24px
  full: 9999px

---

# PTElanka Design System

## Overview

PTElanka is a PTE Academic preparation app for Sri Lankan students whose first language is Sinhala. The design must serve two equal priorities: **English exam content** needs to look sharp, professional, and test-ready; **Sinhala explanations** need to be warm, readable, and never feel like an afterthought.

### Brand Personality

- **Trustworthy** — students are investing real time in exam preparation. The UI should feel reliable and purposeful.
- **Modern** — clean lines, generous whitespace, no visual clutter. Feels like a product from 2025, not 2015.
- **Approachable** — not corporate-stiff. An independent student studying at home should feel comfortable, not intimidated.
- **Focused** — every screen has one job. Reduce cognitive load. Don't compete with the exam content for attention.

### Visual Direction

- White backgrounds with cool-gray accents for structure
- Primary blue (Electric Cobalt) reserved for actions and key interactive moments
- Generous spacing — breathing room between elements, especially around Sinhala text
- High contrast — body text on white must be easy to read for long study sessions
- No decorative elements — every pixel earns its place

---

## Colors

### Primary — Electric Cobalt

A rich, vibrant cobalt blue (`primary-500: #4361EE`) that's distinctive from the generic SaaS blues (Stripe, Tailwind defaults, Facebook). The slight warm undertone makes it feel energetic without being cold.

**Usage:**
- Interactive elements — buttons, links, focus rings
- Active states — selected tabs, current navigation item
- Key accents — progress bars, badges
- Never as a large background fill — it's too vibrant for reading surfaces

| Shade | Token          | Use                                         |
|-------|----------------|---------------------------------------------|
| 50    | `primary-50`   | Hover tint on light backgrounds             |
| 100   | `primary-100`  | Selected item backgrounds, active badges    |
| 200   | `primary-200`  | Borders on primary-tinted surfaces          |
| 500   | `primary-500`  | Primary buttons, links, focus rings         |
| 600   | `primary-600`  | Primary button hover                        |
| 700   | `primary-700`  | Primary button active/pressed               |
| 900   | `primary-900`  | High-emphasis text on primary-tinted bg     |
| 950   | `primary-950`  | Darkest tint — use sparingly                |

### Gray — Cool Gray

Blue-tinted neutral palette. Using a cool gray (rather than warm or true gray) creates subtle harmony with the primary blue without drawing attention.

| Shade | Token       | Use                                            |
|-------|-------------|------------------------------------------------|
| 50    | `gray-50`   | Page background, subtle surface fills          |
| 100   | `gray-100`  | Card backgrounds on gray pages, divider fills  |
| 200   | `gray-200`  | Default borders, dividers                      |
| 300   | `gray-300`  | Strong borders, input borders                  |
| 400   | `gray-400`  | Placeholder text, disabled icons               |
| 500   | `gray-500`  | Secondary body text, labels                    |
| 600   | `gray-600`  | Strong secondary text                          |
| 700   | `gray-700`  | Emphasis text, subheadings                     |
| 900   | `gray-900`  | Primary body text, headings                    |
| 950   | `gray-950`  | Highest-contrast text, near-black              |

### Status Colors

These palettes are reserved strictly for communicative states. Never use them decoratively.

- **Success (Green):** Correct answers, passing scores, positive reinforcement. The core shade `success-500: #10B981` is warm enough to feel encouraging without being clinical.
- **Warning (Amber):** Attention-needed states, approaching limits, partial results. Use `warning-500: #F59E0B` for icons and text, `warning-50` for background fills.
- **Danger (Red):** Incorrect answers, errors, destructive actions. `danger-500: #EF4444` is assertive but not aggressive — important for an education context where "wrong" shouldn't feel punishing.

### Semantic Tokens

Use semantic aliases instead of raw palette values in components. This ensures the design system can evolve without touching component code.

| Token                   | Maps To           | Purpose                          |
|-------------------------|-------------------|----------------------------------|
| `action-primary`        | `primary-500`     | Primary interactive color        |
| `action-primary-hover`  | `primary-600`     | Primary hover state              |
| `action-primary-active` | `primary-700`     | Primary pressed state            |
| `surface-page`          | `#FFFFFF`         | Page background                  |
| `surface-subtle`        | `gray-50`         | Subtle section backgrounds       |
| `surface-muted`         | `gray-100`        | Muted fills, card backgrounds    |
| `surface-raised`        | `#FFFFFF`         | Elevated cards (with shadow)     |
| `text-primary`          | `gray-900`        | Main body text                   |
| `text-secondary`        | `gray-500`        | Supporting text, labels          |
| `text-tertiary`         | `gray-400`        | Placeholder, hint text           |
| `text-on-action`        | `#FFFFFF`         | Text on primary buttons          |
| `text-link`             | `primary-500`     | Inline text links                |
| `border-default`        | `gray-200`        | Default borders and dividers     |
| `border-strong`         | `gray-300`        | Emphasized borders, input edges  |
| `border-focus`          | `primary-500`     | Focus ring color                 |

---

## Typography

### Dual-Script Strategy

PTElanka is a bilingual product. English is the primary UI language; Sinhala is used for explanations, feedback, and instructional copy. Both must feel first-class.

- **Latin text** uses **Inter** — a clean, highly-legible sans-serif optimized for screens
- **Sinhala text** uses **Noto Sans Sinhala** — the best Unicode Sinhala typeface available, with full glyph coverage

### Why Sinhala Needs Its Own Line-Height

Sinhala script has complex diacritics — pili (ි ී), kombuwa (ො), and other marks sit above and below the baseline. Standard Latin line-heights (1.2–1.5) will clip these marks or crowd consecutive lines. The Sinhala type scale uses the same font sizes as Latin but with increased line-heights to ensure crisp rendering.

### Latin Type Scale (Inter)

| Token       | Size   | Weight | Line Height | Letter Spacing | Use                        |
|-------------|--------|--------|-------------|----------------|----------------------------|
| `display`   | 48px   | 700    | 1.1         | -0.025em       | Hero sections, landing      |
| `h1`        | 36px   | 700    | 1.2         | -0.025em       | Page titles                 |
| `h2`        | 30px   | 600    | 1.25        | -0.015em       | Section headings            |
| `h3`        | 24px   | 600    | 1.3         | -0.01em        | Card headings, sub-sections |
| `h4`        | 20px   | 600    | 1.35        | 0              | Small headings              |
| `body-lg`   | 18px   | 400    | 1.6         | 0              | Lead paragraphs             |
| `body`      | 16px   | 400    | 1.5         | 0              | Default body text           |
| `body-sm`   | 14px   | 400    | 1.5         | 0              | Secondary body, UI labels   |
| `caption`   | 12px   | 500    | 1.4         | 0              | Timestamps, metadata        |
| `overline`  | 12px   | 600    | 1.4         | 0.05em         | Category labels (uppercase) |

### Sinhala Type Scale (Noto Sans Sinhala)

| Token             | Size   | Weight | Line Height | Use                          |
|-------------------|--------|--------|-------------|------------------------------|
| `sinhala-h1`      | 36px   | 700    | 1.4         | Sinhala page titles           |
| `sinhala-h2`      | 30px   | 600    | 1.4         | Sinhala section headings      |
| `sinhala-h3`      | 24px   | 600    | 1.45        | Sinhala card headings         |
| `sinhala-body-lg` | 18px   | 400    | 1.8         | Sinhala lead text             |
| `sinhala-body`    | 16px   | 400    | 1.75        | Sinhala body, feedback, tips  |
| `sinhala-body-sm` | 14px   | 400    | 1.7         | Sinhala secondary text        |
| `sinhala-caption` | 12px   | 500    | 1.6         | Sinhala small annotations     |

### Font Weight Usage

| Weight | Name       | Use                               |
|--------|------------|-----------------------------------|
| 400    | Regular    | Body text, descriptions           |
| 500    | Medium     | Captions, labels, emphasis        |
| 600    | Semi-Bold  | Sub-headings, section titles      |
| 700    | Bold       | Page titles, hero text, buttons   |

---

## Layout & Spacing

### Spacing Scale

All spacing uses a **4px base unit**. Every spacing value is a multiple of 4px. This creates consistent rhythm and alignment across the interface.

| Token | Value | Common Use                             |
|-------|-------|----------------------------------------|
| `0.5` | 2px   | Hairline gaps, icon padding            |
| `1`   | 4px   | Tight gaps, inline spacing             |
| `1.5` | 6px   | Small padding inside compact elements  |
| `2`   | 8px   | Default inline padding, small gaps     |
| `3`   | 12px  | Input padding, small card padding      |
| `4`   | 16px  | Default card padding, section gaps     |
| `5`   | 20px  | Medium padding                         |
| `6`   | 24px  | Content section gaps                   |
| `8`   | 32px  | Large section gaps                     |
| `10`  | 40px  | Major section spacing                  |
| `12`  | 48px  | Page-level spacing                     |
| `16`  | 64px  | Large page sections                    |
| `20`  | 80px  | Hero sections                          |
| `24`  | 96px  | Maximum page padding                   |

### Layout Rules

- **Max content width:** 1200px for full layouts, 800px for reading content (practice questions, feedback)
- **Page padding:** `spacing.6` (24px) on desktop, `spacing.4` (16px) on mobile
- **Card padding:** `spacing.4` (16px) minimum, `spacing.6` (24px) for content-heavy cards
- **Stack gap:** Use `spacing.3` (12px) for tight stacks, `spacing.4` (16px) default, `spacing.6` (24px) for loose stacks
- **Sinhala text blocks** should have `spacing.2` (8px) extra padding above and below compared to equivalent Latin blocks — the taller line-height needs more breathing room

---

## Shapes

### Border Radius

| Token    | Value  | Use                                              |
|----------|--------|--------------------------------------------------|
| `sm`     | 4px    | Small elements — badges, pills, tags             |
| `md`     | 8px    | Default — buttons, inputs, small cards           |
| `lg`     | 12px   | Content cards, modals, dropdowns                 |
| `xl`     | 16px   | Feature cards, hero sections                     |
| `2xl`    | 24px   | Large promotional cards                          |
| `full`   | 9999px | Circles — avatars, round icon buttons            |

### Elevation (Box Shadows)

No formal shadow tokens yet. Use these CSS values consistently:

- **Raised:** `0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)` — cards, popovers
- **Elevated:** `0 4px 12px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.06)` — modals, dropdowns
- **Floating:** `0 12px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)` — tooltips, floating panels

---

## Components

### Buttons

#### Variants

| Variant     | Background           | Text              | Border             | Use                              |
|-------------|----------------------|--------------------|---------------------|----------------------------------|
| **Primary** | `action-primary`     | `text-on-action`   | none                | Main CTA — one per screen max    |
| **Secondary** | transparent        | `action-primary`   | `action-primary`    | Secondary actions                |
| **Ghost**   | transparent          | `text-secondary`   | none                | Tertiary actions, toolbar items  |
| **Danger**  | `danger-600`         | `#FFFFFF`          | none                | Destructive actions              |

#### States

- **Hover:** Background shifts one shade darker (e.g. primary: 500→600). Transition: `150ms ease`.
- **Active/Pressed:** Background shifts two shades darker (e.g. primary: 500→700).
- **Disabled:** Opacity `0.5`, no pointer events, no hover effect.
- **Focus:** 2px ring using `border-focus` with 2px offset. Never remove focus rings.

#### Sizing

| Size    | Height | Padding (x) | Font Size   | Radius   |
|---------|--------|-------------|-------------|----------|
| `sm`    | 32px   | 12px        | `body-sm`   | `md`     |
| `md`    | 40px   | 16px        | `body`      | `md`     |
| `lg`    | 48px   | 24px        | `body`      | `md`     |

#### Rules

- Maximum one primary button per visible screen area
- Always use verbs for button labels: "Submit Answer", "Try Again", "Next Question"
- Icon-only buttons must have `aria-label`
- Minimum tap target: 44×44px on touch devices

---

### Cards

- Background: `surface-raised` with `raised` shadow
- Border: `1px solid border-default` (optional — use when cards are on white backgrounds)
- Radius: `rounded-lg` (12px)
- Padding: `spacing.4` (16px) minimum
- No nested cards — ever
- Cards on `surface-subtle` backgrounds don't need a border (the contrast is sufficient)

---

### Inputs

- Height: 40px (matches button `md`)
- Border: `1px solid border-strong`
- Radius: `rounded-md` (8px)
- Padding: `spacing.3` horizontal
- Focus: Replace border with `2px solid border-focus`, add `0 0 0 3px primary-100` ring
- Placeholder color: `text-tertiary`
- Error state: Border becomes `danger-500`, helper text in `danger-600`
- Disabled: Background `gray-50`, text `gray-400`, no pointer events

---

### Feedback States (WFD-specific)

These are unique to the PTE practice experience:

- **Correct word:** Background `success-50`, text `success-700`, border-bottom `success-500`
- **Incorrect word:** Background `danger-50`, text `danger-700`, border-bottom `danger-500`
- **Missing word:** Background `gray-100`, text `gray-400`, dashed border-bottom `gray-300`
- **Extra word:** Background `warning-50`, text `warning-700`, strikethrough

---

### Navigation (Navbar)

- Background: `surface-page` with bottom border `border-default`
- Active item: Text `action-primary`, no background fill — keep it subtle
- Height: 56px on desktop
- Logo + nav links left-aligned, user actions right-aligned

---

### Badges / Pills

- Radius: `rounded-full`
- Padding: `spacing.1` vertical, `spacing.2` horizontal
- Font: `caption` size, `500` weight
- Variants: Use status color pairings (e.g. success-50 bg + success-700 text)

---

## Do's and Don'ts

### Do

- ✅ Use semantic tokens (`action-primary`) instead of raw hex values
- ✅ Use the spacing scale — every margin and padding should map to a token
- ✅ Apply the Sinhala type scale for all Sinhala text blocks
- ✅ Add `font-family: var(--font-sinhala)` AND the adjusted line-height whenever displaying Sinhala
- ✅ Keep interactive elements at minimum 44×44px touch targets
- ✅ Use `transition: 150ms ease` for hover/focus state changes
- ✅ Test color contrast — body text must meet WCAG AA (4.5:1 minimum)
- ✅ Use the `overline` style for category labels (uppercase, tracked)

### Don't

- ❌ Don't use primary blue for large background fills — it overwhelms the content
- ❌ Don't mix status colors — green means correct, red means wrong, amber means attention
- ❌ Don't hard-code hex values in components — always reference tokens
- ❌ Don't set Sinhala text with Latin line-heights — it will clip diacritics
- ❌ Don't use more than 3 font weights on a single screen — keep it clean
- ❌ Don't nest cards inside cards
- ❌ Don't place two primary buttons in the same viewport
- ❌ Don't use `opacity` for text that needs to be readable — use proper gray shades instead
- ❌ Don't use shadows on elements inside cards — only the card itself gets elevation
