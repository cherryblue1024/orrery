# Brass Orrery

Interactive **brass mechanical orrery** of all eight planets, built with **React**, **TypeScript**, **pnpm**, **Vite**, and **React Three Fiber** (+ **Drei** / **Three.js**). Use **Display**, **Limited**, or **Physical** presets: stylized tabletop spacing, a capped realistic sun, or a full Sun–Earth size ratio with widened orbits. Lighting uses a studio-style environment map (no interior room reflections) plus a warm sun `pointLight` in Limited/Physical modes.

## Scripts

```bash
pnpm install
pnpm dev      # local dev server
pnpm build    # production build to dist/
pnpm preview  # preview production build
```

## SEO setup

Set the production site URL before building:

```bash
cp .env.example .env.production
```

```bash
VITE_SITE_URL=https://your-domain.com
```

`pnpm build` uses `VITE_SITE_URL` to set canonical metadata and generate `dist/sitemap.xml` plus `dist/robots.txt`.

## Git

Recommended first-time project setup:

```bash
git init
git add .
git commit -m "Initial project setup"
```

Recommended day-to-day workflow:

```bash
git checkout -b feat/short-description
pnpm lint
pnpm build
git status
git add .
git commit -m "Add concise change summary"
```

Repository defaults in this project:

- `.gitignore` excludes dependencies, build output, caches, local env files, and editor noise.
- `.gitattributes` normalizes text files to LF so diffs stay consistent across macOS, Linux, and Windows.

## Controls

- **Drag**: orbit the view around the model
- **Scroll / pinch**: zoom in and out
- **Pause mechanism**: freeze planet and moon motion (camera still moves)
- **Drive speed**: animation time scale
- **Reset view**: restore the default camera framing
- **Display / Limited / Physical**: switch stylized vs science-oriented layout and sun scale

**Display** keeps stylized motion and proportions. **Limited** and **Physical** use real orbital period ratios and relative planet sizes; **Physical** uses the full solar radius in scene units and pushes heliocentric orbits outward so planets clear the sun disc.
