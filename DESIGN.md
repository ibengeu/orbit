---
name: Orbit
description: A warm team console for small-team collaboration.
colors:
  burnt-brick: "#9e341f"
  action-ink: "#fff7f4"
  ink-plum: "#241820"
  plum-panel: "#312433"
  plum-hover: "#3d2e42"
  plum-divider: "#4a3b4e"
  plum-muted: "#d5c9d0"
  plum-faint: "#b7a8b0"
  text-ink: "#1c1416"
  soft-ink: "#534844"
  faint-ink: "#665c58"
  warm-paper: "#f6f3ee"
  raised-paper: "#fffcf8"
  warm-divider: "#e4dcd3"
  strong-divider: "#d3c9be"
  online-green: "#1f7a4d"
  away-ochre: "#8a5a12"
  danger-red: "#8e2e28"
typography:
  headline:
    fontFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif'
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: "1.75rem"
  title:
    fontFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1.5rem"
  body:
    fontFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  action:
    fontFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: "1.25rem"
  label:
    fontFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif'
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: "1rem"
    letterSpacing: "0.04em"
  code:
    fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace'
    fontSize: "0.75rem"
    lineHeight: "1rem"
rounded:
  sm: "0.375rem"
  md: "0.625rem"
  lg: "0.875rem"
  xl: "1.25rem"
spacing:
  rail: "4rem"
  sidebar-narrow: "13rem"
  sidebar-medium: "14rem"
  sidebar-wide: "16.25rem"
  thread: "22.5rem"
components:
  button-primary:
    backgroundColor: "{colors.burnt-brick}"
    textColor: "{colors.action-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.soft-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
  nav-item-active:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.text-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0.5rem"
    height: "2.75rem"
  nav-item-inactive:
    backgroundColor: "transparent"
    textColor: "{colors.plum-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0.5rem"
    height: "2.75rem"
  text-field:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.text-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
  workspace-rail-active:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.text-ink}"
    rounded: "{rounded.lg}"
    height: "2.75rem"
    width: "2.75rem"
  message-composer:
    backgroundColor: "{colors.raised-paper}"
    textColor: "{colors.text-ink}"
    rounded: "{rounded.lg}"
  reaction-chip:
    backgroundColor: "{colors.raised-paper}"
    textColor: "{colors.text-ink}"
    typography: "{typography.label}"
    rounded: "999px"
    padding: "0.125rem 0.5rem"
  overlay-panel:
    backgroundColor: "{colors.raised-paper}"
    textColor: "{colors.text-ink}"
    rounded: "{rounded.xl}"
    padding: "1.25rem"
---

# Design System: Orbit

## Overview

**Creative North Star: "The Warm Team Console"**

Orbit pairs a deep plum workspace shell with a warm paper conversation canvas. The split keeps navigation distinct from the work area. Burnt brick marks actions and important message states. The result feels warm, composed, practical, and collaborative. Restrained surfaces keep attention on messages, while active states make the work feel responsive.

The Orbit mark uses two elliptical paths around a central dot. It appears in the workspace rail and on the welcome image. The welcome image shows the mark on a paper desk scene. Keep that imagery in its existing welcome context. No visual anti-reference was specified.

**Key Characteristics:**
- Warm paper surfaces against a dark plum navigation shell.
- Burnt-brick actions and compact message-state cues.
- A dense, responsive conversation layout with a dockable thread pane.
- Soft shadows reserved for floating or temporary surfaces.

## Colors

The palette combines warm neutrals, a plum navigation shell, and one restrained brick-red action color.

### Primary

- **Burnt Brick** (`#9e341f`): Primary actions, focus accents, mention badges, and message markers.
- **Warm Action Ink** (`#fff7f4`): Text and icons on the brick action color.

**The Signal, Not Surface Rule.** Use Burnt Brick for actions and small state cues. Keep large working surfaces neutral.

### Secondary

- **Ink Plum** (`#241820`): Workspace rail and the darkest navigation surfaces.
- **Raised Plum** (`#312433`): Main sidebar surface.
- **Plum Hover** (`#3d2e42`): Hover surface in dark navigation.
- **Plum Divider** (`#4a3b4e`): Borders in the navigation shell.
- **Plum Muted** (`#d5c9d0`): Inactive navigation text.
- **Plum Faint** (`#b7a8b0`): Secondary navigation labels and icons.

### Tertiary

- **Online Green** (`#1f7a4d`): Online presence.
- **Away Ochre** (`#8a5a12`): Away presence.
- **Danger Red** (`#8e2e28`): Validation errors and destructive call controls.

### Neutral

- **Near-Black Ink** (`#1c1416`): Main text and dark overlays.
- **Soft Ink** (`#534844`): Supporting text and quiet controls.
- **Faint Ink** (`#665c58`): Timestamps, hints, and secondary metadata.
- **Warm Paper** (`#f6f3ee`): Main conversation and activity surfaces.
- **Raised Paper** (`#fffcf8`): Composer, popover, and dialog surfaces.
- **Warm Divider** (`#e4dcd3`): Default borders and separators.
- **Strong Divider** (`#d3c9be`): Emphasized borders.

## Typography

**Display Font:** Manrope (with ui-sans-serif, system-ui, sans-serif fallbacks)
**Body Font:** Manrope (with ui-sans-serif, system-ui, sans-serif fallbacks)
**Label/Mono Font:** Manrope for labels; ui-monospace, SFMono-Regular, Menlo, Consolas, monospace for inline code.

**Character:** Manrope gives compact controls and conversation text a clear, friendly shape. The interface relies on size and weight changes instead of display typography.

### Hierarchy

- **Headline** (600, 1.25rem, 1.75rem line height): Welcome and prominent dialog titles.
- **Title** (600, 1rem, 1.5rem line height): Pane headings and conversation titles.
- **Body** (400, 0.875rem, 1.25rem line height): Messages, descriptions, and control labels.
- **Action** (600, 0.875rem, 1.25rem line height): Primary actions and emphasized navigation.
- **Label** (600, 0.75rem, 1rem line height, 0.04em tracking): Compact metadata and uppercase sidebar section labels.
- **Code** (400, 0.75rem, 1rem line height): Inline code samples.

**The Compact Hierarchy Rule.** Keep most conversation content at 0.875rem. Use larger sizes for pane and dialog titles, not for routine message text.

## Layout

Orbit uses a rail, a conversation sidebar, a flexible content pane, and an optional thread pane. The workspace rail is 4rem wide. The sidebar grows from 13rem to 14rem and then 16.25rem at wider breakpoints. The thread pane is 22.5rem wide when docked.

Below 768px, show one main pane at a time. From 768px, retain the rail and sidebar and show an open thread as an overlay. At the configured `xl` breakpoint, 75rem (1200px), dock the thread beside the conversation and remove its overlay shadow. A nearby CSS comment describes the dock point as 1280px; the configured breakpoint token is 1200px. Use the token as the current implementation value.

The target canvas is 1440px wide. Use 8px and 16px spacing steps for compact controls and message groups. Keep 44px controls on touch layouts. Several controls reduce to 32px at large breakpoints.

**The Single Pane Rule.** On narrow screens, keep navigation, conversation, and thread views as separate panes. Do not compress the desktop columns into a narrow three-column layout.

## Elevation & Depth

Tonal surfaces and thin borders provide most depth. `shadow-pop` (`0 12px 32px rgb(28 20 22 / 0.14)`) belongs to popovers, dialogs, search, and temporary thread overlays. The docked thread pane has no shadow. Quick transitions use 150ms; the smooth entry animation uses 250ms. The ring animation runs for 1.4s and stops when reduced motion is requested.

**The Docked-Flat Rule.** Use the pop shadow for floating surfaces. Keep docked panels flat and separated by borders.

## Shapes

Use gently rounded controls and panels. The radius scale is 6px, 10px, 14px, and 20px. Text fields, toolbar buttons, and navigation rows use 10px corners. Composers and popovers use 14px corners. Dialogs and desktop search panels use 20px corners. Status indicators, reaction chips, and small badges use pill shapes. Borders are thin and warm-toned. Focus outlines are 2px and use the accent color on light surfaces or paper on dark navigation.

## Components

### Buttons

- **Character:** Compact and practical, with a clear difference between actions and quiet controls.
- **Primary:** Burnt Brick background, Warm Action Ink text, 10px corners, and semibold 14px text. Common form actions use 12px horizontal padding. Larger welcome actions use 16px.
- **Quiet:** Transparent at rest. Use Soft Ink text and a Warm Divider hover surface.
- **Hover / Focus:** The send-message control reduces opacity on hover. Form-submit controls keep their surface and use a visible 2px focus outline with a 2px offset.
- **Touch size:** Keep icon buttons 44px square on touch layouts. The desktop toolbar can reduce them to 32px.

### Chips

- **Style:** Reaction chips use a raised paper surface, thin warm border, pill corners, and compact 12px text.
- **State:** The current user's reaction uses a light accent tint and accent border. Keep counts tabular.

### Cards / Containers

- **Composer:** Raised Paper background, 14px corners, and a warm divider border. Focus within shifts the border to Burnt Brick.
- **Dialogs:** Raised Paper background, 20px corners, 20px padding, and the pop shadow.
- **Conversation content:** Keep message rows flat. Use a faint ink tint on hover and a narrow accent marker for the current user's messages.

### Inputs / Fields

- **Style:** Warm Paper background, 1px Warm Divider border, 10px corners, and 12px horizontal padding.
- **Focus:** Shift the border to Burnt Brick. Preserve the visible keyboard focus outline on controls.
- **Composer:** The message textarea stays transparent inside the raised composer shell. The send button carries the primary action color.

### Navigation

- **Workspace rail:** Use Ink Plum with 44px square workspace tiles and 14px corners. The active tile uses Warm Paper and Near-Black Ink. Inactive tiles use Raised Plum and muted plum text.
- **Sidebar:** Use Raised Plum. Active rows use Warm Paper with Near-Black Ink. Inactive rows use Plum Muted and gain a Plum Hover background.
- **Mobile:** Replace the permanent navigation columns with the app's one-pane navigation flow.
- **Signature mark:** Keep the Orbit mark as two elliptical paths around one central dot. Do not replace it with an unrelated icon.

## Do's and Don'ts

### Do:

- **Do** use Burnt Brick for primary actions and small state indicators.
- **Do** preserve the plum navigation shell and warm paper conversation surfaces.
- **Do** keep the message composer visually attached to the conversation pane.
- **Do** show keyboard focus with a visible 2px outline.
- **Do** honor reduced-motion preferences for animated surfaces.

### Don't:

- **Don't** use the pop shadow on docked or resting content panels.
- **Don't** turn the accent color into a large background surface.
- **Don't** compress the narrow-screen interface into three persistent columns.
- **Don't** use the seeded avatar colors as general status or action colors.
