---
name: Marginalia
colors:
  surface: '#fff8f4'
  surface-dim: '#e2d8cf'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf2e8'
  surface-container: '#f7ece2'
  surface-container-high: '#f1e6dd'
  surface-container-highest: '#ebe1d7'
  on-surface: '#1f1b15'
  on-surface-variant: '#5b4139'
  inverse-surface: '#353029'
  inverse-on-surface: '#faefe5'
  outline: '#8f7067'
  outline-variant: '#e3beb4'
  surface-tint: '#ae3200'
  primary: '#ae3200'
  on-primary: '#ffffff'
  primary-container: '#fe5d26'
  on-primary-container: '#561400'
  inverse-primary: '#ffb59e'
  secondary: '#7d5719'
  on-secondary: '#ffffff'
  secondary-container: '#ffcc83'
  on-secondary-container: '#795416'
  tertiary: '#4e6544'
  on-tertiary: '#ffffff'
  tertiary-container: '#819a76'
  on-tertiary-container: '#1c3116'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59e'
  on-primary-fixed: '#3a0b00'
  on-primary-fixed-variant: '#852400'
  secondary-fixed: '#ffddb1'
  secondary-fixed-dim: '#f0be76'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#624001'
  tertiary-fixed: '#d0eac1'
  tertiary-fixed-dim: '#b4cea7'
  on-tertiary-fixed: '#0c2007'
  on-tertiary-fixed-variant: '#374c2e'
  background: '#fff8f4'
  on-background: '#1f1b15'
  surface-variant: '#ebe1d7'
typography:
  display-lg:
    fontFamily: Source Serif 4
    fontSize: 44px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Source Serif 4
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Source Serif 4
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Source Serif 4
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Source Serif 4
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  annotation-note:
    fontFamily: Source Serif 4
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-mobile: 1rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system translates the intimacy, craft, and intellectual rigor of a physical writing desk into a focused digital environment. It rejects modern SaaS tropes—such as neon glow gradients, clinical cool-grays, frosted acrylic glassmorphism, and synthetic dark modes—in favor of a tactile, paper-crafted editorial aesthetic. The emotional posture balances academic authority with pedagogical warmth, speaking to educators conducting deep grading sessions and students receiving nuanced, actionable prose critique.

The core visual metaphor centers on physical manuscripts, ruled notebooks, and editorial margin notes. The interface feels structured like archival stationery: crisp ruled lines, thoughtful ink-weight contrasts, warm deckled surfaces, and vibrant markup annotations reminiscent of felt-tip editorial pens. Modernity is preserved through precise typographic hierarchy, rigorous structural alignment, and responsive micro-interactions that treat digital feedback with the weight of hand-inked margin commentary.

## Colors

The palette is rooted in classic stationery and grading tools:

- **Primary Accent (`#FE5D26`)**: Warm burnt-orange / vibrant red-pen markup. Reserved for critical callouts, edit suggestions, inline corrections, primary interactive actions, and active selection anchors.
- **Secondary Accent (`#F2C078`)**: Soft amber gold. Functions as highlighter tape, student strength indicators, context summaries, and warm badge containers.
- **Tertiary Accent (`#C1DBB3`)**: Soft sage green. Applied to approval stamps, rubric achievements, synchronized cloud statuses, and positive growth indicators.
- **Neutral Ink (`#2B2620`)**: Deep warm charcoal ink. Substituted for pure `#000000` to preserve the visual softness of pressed type on paper.
- **Muted Taupe (`#786F66` and `#8C8275`)**: Muted graphite. Used for secondary metadata, line-ruling accents, timestamps, and subtle structural frames.
- **Canvas & Surfaces**: The base canvas is parchment (`#FAEDCA`), complemented by elevated crisp paper layers (`#FFFDF5` and `#FBF3DC`).
- **Border Tint**: Linear structures use `#E2D7B8` or `rgba(43, 38, 32, 0.12)` to mimic faint binder lines and ruled paper rather than digital containment boxes.

## Typography

Typographic hierarchy enforces an editorial separation of church and state: literary prose versus functional tooling.

- **Content & Feedback (`Source Serif 4`)**: All long-form student writing, teacher evaluations, essay prompts, and inline marginalia employ this serif. Body copy uses generous line heights (`lineHeight: 30px` on `18px` text) to mirror classic double-spaced manuscripts and accommodate highlighters and bracketed anchors.
- **User Interface & Chrome (`Plus Jakarta Sans`)**: Navigation ribbons, control toggles, rubric sliders, table column headers, and action buttons rely on this geometric sans-serif to keep tooling unobtrusive, contemporary, and legible at small scales.
- **Annotations (`annotation-note`)**: Margin commentary is set in italicized or medium-weight serif at small scales (`13px`), visually anchoring feedback directly to adjacent manuscript lines.

## Layout & Spacing

The spatial model replicates a writer's desk using an asymmetrical split-pane layout:

- **Desktop (1280px+)**: The canvas divides into an asymmetric two- or three-pane arrangement. The primary reading column holds a fixed reading width (680px to 740px) centered or offset left, flanked by a 360px to 420px fluid margin rail dedicated to inline cards and threaded critique.
- **Tablet (768px - 1024px)**: Margin notes collapse into right-aligned indicator tabs attached to line numbers, sliding open as a drawer upon touch.
- **Mobile (< 768px)**: The manuscript becomes a continuous single column. Margin critique anchors are rendered as tap-to-expand footnote sheets resting directly beneath the marked sentence.
- **Vertical Rhythm**: Spacing scales strictly across multiples of `0.25rem` (4px baseline), keeping body text lines aligned with margin card headers across split viewports.

## Elevation & Depth

Visual hierarchy is maintained without heavy blur dropshadows or glossy lighting models. Elevation is communicated through paper stacking, tonal offsets, and hairline structural borders:

- **Layer 0 (Desk Canvas)**: Parchment tone (`#FAEDCA`). The expansive table surface upon which manuscripts rest.
- **Layer 1 (The Sheet / Document Page)**: Crisp paper white (`#FFFDF5`). Delineated by a solid 1px tactile border in `rgba(43, 38, 32, 0.12)` with a slight offset shadow (`0 2px 0 rgba(43, 38, 32, 0.04)`), creating the illusion of a tangible sheet of heavy cotton cardstock resting on timber.
- **Layer 2 (Margin Notes & Floating Toolbars)**: Warmer paper stock (`#FBF3DC`) or stark white cards (`#FFFDF5`). Positioned with an offset hairline boundary (`1px solid #E2D7B8`) and an ink-tinted ground shadow (`0 4px 12px rgba(43, 38, 32, 0.08)`).
- **Layer 3 (Overlays, Modals, Menus)**: Deep-paper panels bordered by crisp 1.5px ink outlines (`rgba(43, 38, 32, 0.20)`) accompanied by a flat stepped shadow (`0 6px 0 rgba(43, 38, 32, 0.10)`), reinforcing physical card assembly rather than immaterial light cones.

## Shapes

The design system adopts a crisp, paper-cut architectural geometry. With a soft roundedness rating of `1`, components feature subtle 4px corner radii (`0.25rem`), reflecting sheared paper edges, index cards, and printed tickets rather than playful bubbles or pill containers.

- **Primary Cards & Manuscripts**: 4px radius (`rounded-sm`), framing content cleanly against background parchment.
- **Interactive Badges & Highlighters**: Crisp 2px to 4px corners; badges never use 9999px pills.
- **Input Fields & Buttons**: Precise 4px radii, keeping lines straight and utilitarian.
- **Rule Lines**: Squared endpoints without round caps, emphasizing bookbinding signatures and ruled ledger lines.

## Components

### Buttons
- **Primary Action (Burnt Orange)**: Solid `#FE5D26` fill, `#FFFDF5` text, 4px corner radius. Hairline border `1px solid rgba(43, 38, 32, 0.15)`. Hover triggers a 1px downward translate with an inset ink shadow.
- **Secondary Action (Paper & Ink)**: `#FFFDF5` surface, `1px solid #E2D7B8` border, `#2B2620` text. Hover shifts background to `#FBF3DC`.
- **Tertiary / Ghost**: Transparent fill, `#786F66` text, underline accent on focus/hover.

### Margin Cards & Sticky Annotations
- Pinned cards resting beside the essay text on Layer 2 (`#FFFDF5` or `#FBF3DC`).
- Left vertical accent bar (3px) color-coded by category: `#FE5D26` for syntax/argument critiques, `#F2C078` for rhetorical strengths, `#C1DBB3` for positive citations.
- Header contains author avatar / AI indicator badge and timestamp in `label-sm` (`#786F66`). Body in `annotation-note`.

### In-Text Highlights & Anchors
- Highlights mimic highlighter markers drawn across printed text: `rgba(242, 192, 120, 0.35)` for notes, `rgba(254, 93, 38, 0.18)` for revisions, and `rgba(193, 219, 179, 0.45)` for approvals.
- Active highlighted passages show a persistent 1.5px dotted bottom rule in the corresponding accent color.

### Form Inputs & Text Fields
- Surface `#FFFDF5`, 1px solid border `#E2D7B8`. Text in `#2B2620` (`Plus Jakarta Sans`).
- Focused state replaces default border with a crisp 1.5px solid `#2B2620` or `#FE5D26` ring without fuzzy dropshadow glows.

### Rubric Chips & Badges
- Squared-corner labels (4px radius) utilizing 1px borders.
- Backgrounds use tinted pastels (`#F2C078` at 20% opacity, `#C1DBB3` at 30% opacity) paired with high-contrast ink text (`#2B2620`).

### Checkboxes & Grading Selectors
- Checkboxes: 16px squares with 2px corner radius, 1.5px border `#786F66`. Checked state: filled `#2B2620` with an off-white `#FFFDF5` checkmark.
- Radio buttons: Classic circular target with solid dark-ink center pip on selection.