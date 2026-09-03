# Talks

Slidev decks in one repo, published to GitHub Pages.

## Commands

```bash
pnpm install
pnpm dev colorless-react   # present one deck
pnpm new "My next talk"    # scaffold talks/my-next-talk.md
pnpm build                 # build every deck + the index
```

With more than one deck, `pnpm dev` lists them. Pass extra Slidev flags after the slug:

```bash
pnpm dev colorless-react -- --remote --port 3031
```

## Adding a talk

Drop a new `.md` file in `talks/`, or run `pnpm new "Title"`. Frontmatter fields used by the index:

```yaml
---
theme: default
title: Colorless React
description: How promise hacking made React a colorless framework
date: 2026-09-03
layout: cover
---
```

`title` and `description` fall back to the first heading and first paragraph if omitted. Shared Vue components, snippets, and extra pages stay in the repo root (`components/`, `snippets/`, `pages/`).

## Publishing

Pushes to `main` build every talk and deploy to GitHub Pages:

`https://<user>.github.io/slides/<talk-slug>/`

The root URL is an index of every deck. After the first push, confirm **Settings → Pages → Source** is **GitHub Actions** (the workflow also tries to enable this).

Local preview of the published site:

```bash
pnpm build
pnpm exec vite preview --outDir dist
```
