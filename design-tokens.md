# Oliveto — Design Tokens

## Brand

- **Name:** Oliveto
- **Tagline:** "Oils with origin."
- **Vertical:** Olive oil importer — small-batch, editorial, rooted
- **Aesthetic:** Editorial-Mediterranean. Think Apartamento magazine meets a quiet producer in Puglia.

## Palette

All colours are defined as CSS custom properties in `src/app/globals.css` and wired into shadcn's token system so installed components inherit the brand automatically.

| Token          | Hex       | Role                              |
| -------------- | --------- | --------------------------------- |
| `--cream`      | `#F5EFE0` | Background (light mode)           |
| `--ink`        | `#1F1F1A` | Foreground / text (light mode)    |
| `--olive`      | `#3D4A2A` | Primary — deep olive green        |
| `--olive-dark` | `#2C3A1E` | Primary hover                     |
| `--terracotta` | `#B8472A` | Accent — warm terracotta red      |
| `--stone`      | `#D9D2C0` | Muted background, borders         |
| `--stone-dark` | `#A8A193` | Muted foreground                  |

### Dark mode overrides

| shadcn token      | Value     | Notes                             |
| ----------------- | --------- | --------------------------------- |
| `--background`    | `#1F1F1A` | Ink becomes the background        |
| `--foreground`    | `#F5EFE0` | Cream becomes the text            |
| `--primary`       | `#8B9968` | Lighter olive for contrast on dark|
| `--accent`        | `#D4654A` | Lighter terracotta for dark       |
| `--muted`         | `#3A3A32` | Dark stone                        |

The rest of the dark mode tokens are derived sensibly from the base palette — see `globals.css` for exact values.

### Tailwind utilities

Brand colours are exposed as Tailwind v4 utilities via the `@theme` block:

- `bg-cream`, `text-cream`
- `bg-ink`, `text-ink`
- `bg-olive`, `text-olive`
- `bg-olive-dark`, `text-olive-dark`
- `bg-terracotta`, `text-terracotta`
- `bg-stone`, `text-stone` (note: also used via `--border` and `--muted`)
- `bg-stone-dark`, `text-stone-dark`

## Typography

| Role    | Font             | CSS variable       | Tailwind class   | Usage                                    |
| ------- | ---------------- | ------------------ | ---------------- | ---------------------------------------- |
| Display | Fraunces         | `--font-display`   | `font-display`   | h1, h2, h3, editorial moments, wordmark  |
| Body    | Instrument Sans  | `--font-body`      | `font-body`      | Paragraphs, nav, buttons, labels, UI     |

### Why this pair

Fraunces is a variable-weight old-style serif with optical sizing and soft-wedge serifs — it conveys warmth and editorial confidence without feeling either stuffy or trendy. Instrument Sans is a clean, contemporary grotesque that pairs well at small sizes and stays out of the way of the display type. Together they signal: serious about craft, but approachable.

Both are loaded via `next/font/google` in the root layout and attached as CSS variables on `<html>`.

## Spacing and radius

- **Spacing scale:** shadcn's default (Tailwind's default 4px grid).
- **Radius:** `--radius: 0.25rem` (4px). The editorial brand calls for nearly-square corners — buttons, cards, and inputs should feel crisp and geometric, not rounded or friendly.

## Voice and tone

Oliveto speaks with the quiet confidence of someone who knows where their food comes from. The tone is warm but unhurried — editorial rather than promotional, Mediterranean rather than metropolitan. Copy should feel like a well-written shelf card at a specialty shop: informative, specific, never breathless. Avoid exclamation marks, avoid "artisanal" and "curated." Prefer concrete origins ("Puglia," "Kalamata") over abstract adjectives ("premium," "luxury"). Let the product speak; the brand holds the door.
