# Copilot Instructions — Free JSON Formatter & Beautifier

A free, 100% client-side JSON formatter and beautifier built with React 19, Vite, and Tailwind CSS 3.4.
Live at: https://freejsonformatterbeautifier.netlify.app/
GitHub: https://github.com/Tadxss/FreeJsonFormatterBeautifier

## Project Structure

```
src/
  components/
    JsonFormatter.jsx  ← main app component (all logic + UI)
    ContactModal.jsx   ← contact form modal (Web3Forms)
    BuyMeACoffee.jsx   ← support banner
  main.jsx
  index.css
index.html             ← SEO meta, OG tags, GA4, JSON-LD
netlify.toml           ← SPA redirect rule + build config
public/
  favicon.svg
  sitemap.xml
  robots.txt
  og-image.png         ← needs to be created (1200×630)
```

## Build and Dev

```
npm install       # install dependencies
npm run dev       # start Vite dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

Node.js v20.11.0 is in use — too old for `create-vite@9`. Do not run `npm create vite@latest`.

## Design System

- Background: `bg-slate-900`, Cards: `bg-slate-800`, Header/Footer: `bg-slate-950`
- Accent: purple — `text-purple-400`, `border-purple-500`, `bg-purple-600 hover:bg-purple-700`
- Text: white headings, `text-slate-300` body, `text-slate-400` muted
- Icons: Lucide React
- Fonts: monospace (`font-mono`) for JSON input/output panes
- Page layout: `flex flex-col min-h-screen` root + `flex-1` on `<main>` to pin footer

## Core Features

- **Beautify mode**: `JSON.parse()` then `JSON.stringify(parsed, null, indent)` with 2 spaces / 4 spaces / tab options
- **Minify mode**: `JSON.parse()` then `JSON.stringify(parsed)` — no whitespace
- **Real-time**: processes on every keystroke (`onChange` on input textarea)
- **Error display**: catches `JSON.parse` errors and shows the message in the output pane
- **Copy to clipboard**: `navigator.clipboard.writeText(output)`
- **File size display**: uses `new Blob([str]).size` to show B / KB
- **Load sample**: loads a hardcoded sample JSON for quick demo

## ContactModal Conventions

- Title: "Contact the Developer" (with `<Mail>` icon in purple)
- Form labels use inline Lucide icons — `<User>`, `<Mail>`, `<MessageSquare>` (w-3.5 h-3.5 inline mr-1.5)
- Body wrapper has `text-left` class
- Web3Forms `access_key`: `9d2f6699-80d4-4345-bbe9-b78ece5a9513`
- Subject line: `Free JSON Formatter — Message from ${formData.name}`

## Shared Identity

- Footer "Daryl John Tadeo" links to `https://daryltadeo.netlify.app/`
- Buy Me a Coffee: `https://coff.ee/daryltadss8` — copy: "Found this useful? Support the work —"
- GA4 ID: `G-P1898N6HT7`

For the full cross-project design system reference, see `COPILOT.md` in the DarylJohnTadeo portfolio repo.
