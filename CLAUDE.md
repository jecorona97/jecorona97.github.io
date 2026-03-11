# CLAUDE.md — AI Agent Context

## Project overview

Personal website for Eduardo Corona (jecorona97). Systems Engineer in San Francisco, works on data systems and AI infrastructure at LinkedIn. Hosted at jecorona97.github.io.

## Architecture

Pure static site. No build step, no bundler, no framework, no Jekyll. Three source files served directly by GitHub Pages:

- `index.html` — single-page layout: header, bio, anonymous message terminal, command palette, footer with reveal tooltip
- `styles.css` — all styles, mobile-first responsive, dark theme
- `script.js` — anonymous messaging + command palette logic
- `favicons/` — favicon assets and manifest
- `assets/main.css` — legacy GitHub Pages CSS (unused by current site)
- `me.jpg` — profile photo (not currently referenced in HTML)

## Design system

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| bg | `#2b2b2b` | body background |
| surface | `#222` | terminal, palette, send button hover bg |
| surface-dark | `#1e1e1e` | footer reveal tooltip bg |
| border | `#3a3a3a` | all borders |
| border-subtle | `#2e2e2e` | reveal divider, palette hover bg |
| text-primary | `#e5e5e5` | headings, body text |
| text-secondary | `#a0a0a0` | subtitle, bio, muted text |
| text-muted | `#888` | reveal body text |
| text-dim | `#666` | placeholders, palette descriptions |
| text-footer | `#555` | footer signature |
| accent | `#6aa0ff` | links, focus rings, button border, send button, prompt `$`, success state |
| error | `#C04848` | validation/error status text |

### Fonts
- **Inter** (400, 600): headings, body, reveal body text
- **JetBrains Mono** (400): social links, terminal textarea, buttons, command palette, footer signature, status text

### Spacing
- Main container: `max-width: 720px`, padding `80px 24px 120px` (desktop), `48px 16px 80px` (mobile breakpoint: 600px)
- Section gaps: `margin-bottom: 40px` between header/bio/terminal
- Footer: `margin: 64px auto 0`, `padding: 0 24px 48px`

## Anonymous messaging

### Endpoint
`POST https://anon-mailer.vercel.app/api/contact`

### Payload
```json
{ "message": "string (1–5000 chars)" }
```

### UI states
1. **Empty submit** — status text "Please write a message first." in error color
2. **Over limit** — status text "Message too long (max 5,000 characters)." in error color
3. **Sending** — button disabled, status "> sending message..."
4. **Success** — form hidden (`#anon-form` gets `.hidden`), success state shown (`#success-state` loses `.hidden`). Displays "> sending message..." then "✓ message transmitted"
5. **Server error** — shows server error message or fallback "Something went wrong. Try again."
6. **Network error** — "Network error. Try again."

Button re-enables on error. On success, form is permanently replaced (no reset).

## Command palette

Triggered by `Cmd+K` / `Ctrl+K`. Closed by `Escape` or clicking overlay.

### Commands
| Action | Behavior |
|--------|----------|
| `/github` | Opens https://github.com/jecorona97 in new tab |
| `/linkedin` | Opens https://www.linkedin.com/in/coronaje/ in new tab |
| `/message` | Focuses the message textarea |
| `/contact` | Same as `/message` |

Navigation: Arrow keys move active highlight, Enter executes. Input filters commands by substring match on action name (leading `/` stripped).

### Adding a command
1. Add `<li role="option" data-action="name">/name <span class="palette-desc">— description</span></li>` to `#palette-list` in `index.html`
2. Add entry to `commands` array in `script.js` with either `url` (opens new tab) or `fn` (runs function)

## Footer reveal

The `"ed + edbot — 2026"` signature in the footer. Hovering or clicking `.footer-sig` reveals a tooltip (`.footer-reveal`) positioned above it via CSS `opacity`/`transform` transition.

- **Desktop**: hover on `.footer-sig` triggers reveal via CSS `:hover`/`:focus`
- **Mobile**: tap toggles `.open` class via inline `onclick` handler, which CSS also targets (`.footer-sig.open .footer-reveal`)
- Keyboard accessible: `tabindex="0"`, Enter/Space toggle `.open`
- The reveal div is nested inside `.footer-sig` so CSS child selectors work

## Deployment

- **Host**: GitHub Pages
- **URL**: jecorona97.github.io
- **Branch**: `master`
- **No build step**: GitHub Pages serves files directly from repo root
- Push to `master` = deploy

## Hard constraints

- **No Jekyll**: site must not use Jekyll processing (no `_config.yml`, no Liquid templates)
- **No backend**: the only external call is the Vercel mailer endpoint
- **No auth**: anonymous messaging by design
- **No build tools**: no npm, no bundler, no transpilation — edit source files directly
- **Must stay static**: all three source files are plain HTML/CSS/JS
- **No frameworks/libraries**: vanilla JS only, no jQuery, no React

## Common tasks

### Add a social link
In `index.html`, add inside `.social-links` nav:
```html
<a href="URL" target="_blank" rel="noopener noreferrer" aria-label="Name">[Name]</a>
```
No CSS or JS changes needed.

### Change bio text
Edit the `<p>` inside `<section class="bio">` in `index.html`.

### Modify theme colors
All colors are hardcoded in `styles.css` (no CSS variables). Search-and-replace the hex value. Key accent color `#6aa0ff` appears in ~15 places across the file.

### Change the mailer endpoint
Update the URL in `script.js` line 24: `fetch('https://anon-mailer.vercel.app/api/contact', ...)`.

### Add a command palette command
See "Adding a command" under Command palette section above.

### Update footer year
Edit the year in `.footer-text` span in `index.html` line 77.
