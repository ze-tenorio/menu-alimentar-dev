# UI guidelines (formal / clean / cozy)

Poppins + existing CSS variables only (`:root` in `src/index.css`). Do not change HSL tokens or font family.

## Layout

- Section vertical rhythm: `space-y-6` between major blocks.
- Screen content: prefer `max-w-lg mx-auto w-full` on form-like flows.
- Generous padding: `p-4` / `p-5` on cards.

## Surfaces

- Default card: `.app-card` — border + optional subtle bg (see `index.css`).
- Avoid heavy `border-2` unless error state; prefer `border border-border`.
- No `hover:scale` or `animate-pulse` on journey step rows.

## Typography

- Screen title: `.app-screen-title` (`text-lg font-semibold tracking-tight`).
- Supporting text: `text-sm text-muted-foreground`.
- Small labels: `.app-muted-label` (uppercase tracking, muted).

## Primary actions

- Use `bg-primary text-primary-foreground` for main CTA.
- Secondary: `border border-border bg-background` or `bg-muted`.

## Icons

- Prefer Lucide monoline over decorative emoji in chrome (objective copy may stay semantic elsewhere).
