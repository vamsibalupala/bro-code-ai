---
name: Obsidian Stream
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c7c6c6'
  on-secondary: '#2f3131'
  secondary-container: '#484949'
  on-secondary-container: '#b8b8b8'
  tertiary: '#ffffff'
  on-tertiary: '#660029'
  tertiary-container: '#ffd9df'
  on-tertiary-container: '#c31258'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#ffd9df'
  tertiary-fixed-dim: '#ffb1c0'
  on-tertiary-fixed: '#3f0017'
  on-tertiary-fixed-variant: '#90003d'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 21px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-desktop: 1rem
  margin: 1rem
  margin-desktop: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system embodies an editorial, content-first mobile philosophy inspired by high-end social platforms like Threads and modern Instagram. The aesthetic is strictly restrained, ultra-clean, and neutral—designed to recede completely so media, typography, and personal expression take center stage.

- **Brand Personality**: Sophisticated, fluid, disciplined, transparent, and direct. The interface acts as a silent gallery frame rather than an assertive identity.
- **Target Audience**: Digital natives, visual creators, micro-bloggers, and mobile-first users seeking an uncluttered, high-velocity reading and posting canvas.
- **Emotional Response**: Immediate calm, frictionless focus, tactile precision, and instant comprehension.
- **Aesthetic Direction**: Contemporary Ultra-Minimalism infused with subtle tactile physics. Relying heavily on pitch-black canvas depth, hairline structural dividers, hairline iconography, and micro-interactions, punctuating an otherwise pure monochrome environment with surgical accents of electric rose and amber only when signaling activity, live status, or unread events.

## Colors

The palette operates under absolute chromatic restraint. True pitch black serves as the primary canvas ground, ensuring pixel efficiency on OLED displays and maximum contrast for rich imagery and crisp type.

- **Primary (`#F5F5F5`)**: High-contrast, off-white text and primary interaction glyphs. Avoids pure `#FFFFFF` glare to reduce eye strain during prolonged reading.
- **Secondary (`#A8A8A8`)**: Calibrated neutral midtone used for secondary metadata, timestamps, subtle unselected tab states, and caption handles.
- **Tertiary / Accent (`#E1306C`)**: A vivid electric rose/magenta used sparingly for active notification pips, like states, unread story rings, and live badges. When rendering active story rings, interpolate linearly between `#F58529`, `#DD2A7B`, and `#8134AF`.
- **Canvas & Surface Architecture**:
  - `surface-canvas`: `#000000` (Pure pitch base).
  - `surface-raised`: `#121212` (Cards, bottom sheets, search inputs, flyout menus).
  - `surface-elevated`: `#1C1C1C` (Floating tooltips, nested pills).
  - `border-hairline`: `#262626` (Delicate structural separators and ghost outlines).
  - `border-subtle`: `#363636` (Active input focuses and subtle highlights).

## Typography

The type system is powered entirely by **Plus Jakarta Sans**, offering a clean, contemporary geometric rhythm with subtle humanist warmth that remains legible at high scrolling speeds.

- **Headlines**: Set tightly with negative letter spacing (`-0.02em`) to command attention without overwhelming feed content.
- **Body Content**: Tuned for screen densities between 375pt and 430pt. Line heights prioritize conversational scanability and dense thread readability (`body-lg` at 21px line height for primary posts).
- **Labels & Captions**: Crisp, tracking slightly opened (`+0.01em` on `label-sm`) for user timestamps, counts, and metadata tags.
- **Hierarchy Rules**: Primary user handles are always `title-sm` (600 weight), body text is `body-md` (400 weight), and relative time indicators use `body-sm` (400 weight in `#A8A8A8`).

## Layout & Spacing

The design system prioritizes a vertical stream flow built on an 8-point base spacing cadence (with 4px half-steps for micro-alignments).

- **Grid & Safe Margins**:
  - **Mobile (< 600px)**: Single column stream layout spanning full viewport width. Edge gutters are set to `margin` (`1rem` / 16px). Posts and edge-to-edge media can bleed completely with 0px margin, while nested text adheres to the 16px structural wall.
  - **Tablet & Foldables (600px - 1024px)**: Center-aligned 600px feed column flanked by fluid structural margins or a split navigation rail.
  - **Desktop (> 1024px)**: Max 680px primary content channel with a docked 240px navigation bar on the left edge.
- **Rhythm & Flow**:
  - Avatar-to-content gap utilizes `space-md` (`12px`).
  - Vertical spacing between distinct feed items uses `space-lg` (`16px`) when divided by border lines, or `space-xl` (`24px`) in continuous white-space feeds.
  - Interactive icon groupings (e.g., Like, Reply, Repost, Share) use a uniform gap of `space-lg` (`16px`) with 44px minimum invisible bounding boxes for touch accuracy.

## Elevation & Depth

In alignment with Threads and modern mobile-first minimalism, elevation is created through tonal layering and hairline delineation rather than drop shadows.

- **Base Floor**: The app canvas rests at `#000000`.
- **Level 1 (Substratum & Feeds)**: Separated by a single 0.5px hairline divider in `#262626`. No shadow is applied.
- **Level 2 (Modals & Bottom Sheets)**: Appears at `#121212` with a 0.5px border of `#262626`. When overlaying feeds, a soft 50% opacity backdrop filter (`blur(20px)`) darkens and blurs underlying media.
- **Level 3 (Action Sheets, Floating Bars & Toasts)**: Floating action pills use `#1C1C1C` with a 1px border (`#363636`) and an ambient, diffused shadow: `0px 8px 24px rgba(0, 0, 0, 0.6)`.
- **Scroll States**: Fixed navigation headers use a dynamic alpha overlay (`rgba(0, 0, 0, 0.85)` with `backdrop-filter: blur(12px)`) that merges with the background when at scroll position zero.

## Shapes

The shape system utilizes pill-shaped geometry (`level 3`) for action targets, nested avatars, and tags, contrasted against sharp edge-to-edge media presentation.

- **Full Radius / Pill (`9999px` / `rounded-full`)**: Primary buttons, chips, tag filters, search inputs, input fields, notification badges, and floating control bars.
- **Avatars & Story Frames (`rounded-full`)**: User identities are circular. Stories feature a 2px offset border separating the avatar image from the gradient stroke ring.
- **Media Containers (`rounded-lg` / `16px`)**: Standalone feed images, carousel cards, and preview embeds use a consistent 16px corner radius. If the media spans edge-to-edge on mobile, the radius drops to 0px.
- **Bottom Sheets (`rounded-t-3xl` / `24px`)**: Top corners rounded to 24px to indicate pull-down physics.

## Components

### Buttons
- **Primary Action**: Pill shape (`h-9` or `36px`), filled `#F5F5F5` background, `#000000` text in `label-md`. Pressed state scales down to `0.97` with a subtle opacity drop (`0.9`).
- **Secondary Action**: Pill shape, transparent background with a 1px border in `#262626`, `#F5F5F5` text. Active state dims to `#121212`.
- **Ghost / Icon Tap Targets**: 24px hairline outline vector icons placed inside a minimum `44x44px` transparent tap box. No background fill. Active touch triggers an immediate 0.15s fade to `#A8A8A8`.

### Story Trays & Rings
- **Story Ring (Unseen)**: Circular avatar wrapped in a 2px padding gap (`#000000`) and a 2px outer ring rendered with a conic gradient (`#F58529` to `#DD2A7B` to `#8134AF`).
- **Story Ring (Seen)**: Outer stroke drops to a solid 1px hairline in `#262626`.
- **Tray Layout**: Horizontal fluid scroll with `0.75rem` spacing between items. Text handle clamped to 1 line in `body-sm`.

### Input Fields & Search Bars
- **Search Input**: Full-pill enclosure, `38px` height, filled with `#121212`, hairline border `#262626`. Left-aligned 18px magnifying glass in `#A8A8A8`. Placeholder set in `body-md` `#A8A8A8`.
- **Inline Composer / Reply**: Zero-border text fields floating above keyboard, auto-expanding up to 6 lines, accompanied by subtle 20px glyph triggers for gallery, camera, and voice note attachments.

### Feed Cards & List Rows
- **List Items**: Direct vertical stacking with a 0.5px border separator at the bottom (`#262626`).
- **Thread Architecture**: Avatars on the upper-left (`36px` to `40px` diameter). Multi-post threads display a connecting vertical line (`1.5px` width in `#262626`) extending downward from the avatar to the subsequent nested post.
- **Action Strip**: Horizontal bar displaying icon triplets (Heart, Comment, Repost, Direct Share) spaced `20px` apart, accompanied by dynamic numeric counters rendered in `label-sm` `#A8A8A8`.

### Chips & Filter Pills
- Compact 28px height, `rounded-full`. Inactive: `#121212` background, 1px `#262626` outline, `#A8A8A8` text. Selected: `#F5F5F5` background, `#000000` text.

### Badges & Notification Indicators
- Discrete `8px` circles in `#E1306C` floating over tab bar icons or user avatars with a 2px `#000000` outer isolation border.