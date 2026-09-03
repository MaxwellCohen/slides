function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function formatDate(date) {
  if (!date)
    return ''
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime()))
    return date
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function renderIndex(talks, base) {
  const items = [...talks].sort((a, b) => {
    if (a.date && b.date)
      return b.date.localeCompare(a.date)
    if (a.date)
      return -1
    if (b.date)
      return 1
    return a.title.localeCompare(b.title)
  })

  const cards = items.map((talk) => {
    const href = `${base}${talk.slug}/`
    const date = formatDate(talk.date)
    return `
      <a class="talk" href="${escapeHtml(href)}">
        <div class="talk-frame" aria-hidden="true">
          <span class="talk-frame-dot"></span>
          <span class="talk-frame-dot"></span>
          <span class="talk-frame-dot"></span>
        </div>
        <div class="talk-body">
          <p class="talk-meta">
            <span class="talk-slug">${escapeHtml(talk.slug)}</span>
            ${date ? `<time datetime="${escapeHtml(talk.date)}">${escapeHtml(date)}</time>` : ''}
          </p>
          <h2>${escapeHtml(talk.title)}</h2>
          ${talk.description ? `<p class="talk-blurb">${escapeHtml(talk.description)}</p>` : ''}
        </div>
      </a>`
  }).join('\n')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Talks</title>
  <meta name="description" content="Slide decks and conference talks." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,700;1,9..144,500&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #100e0b;
      --paper: #ebe4d4;
      --muted: #9a917e;
      --gold: #d4a054;
      --gold-dim: rgba(212, 160, 84, 0.28);
      --card: #1a1712;
    }

    * { box-sizing: border-box; }

    html, body {
      margin: 0;
      min-height: 100%;
      background: var(--bg);
      color: var(--paper);
    }

    body {
      font-family: Fraunces, "Iowan Old Style", Georgia, serif;
      background-image:
        radial-gradient(1200px 500px at 10% -10%, rgba(212, 160, 84, 0.09), transparent 55%),
        radial-gradient(800px 400px at 110% 10%, rgba(90, 70, 40, 0.25), transparent 50%);
    }

    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: 0.18;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    main {
      position: relative;
      width: min(920px, calc(100% - 48px));
      margin: 0 auto;
      padding: 72px 0 96px;
    }

    header {
      display: grid;
      gap: 18px;
      padding-bottom: 40px;
      border-bottom: 1px solid var(--gold-dim);
      margin-bottom: 40px;
    }

    .eyebrow {
      margin: 0;
      font-family: "IBM Plex Mono", ui-monospace, monospace;
      font-size: 12px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--gold);
    }

    h1 {
      margin: 0;
      font-size: clamp(56px, 10vw, 92px);
      font-weight: 500;
      font-style: italic;
      line-height: 0.9;
      letter-spacing: -0.03em;
    }

    .lede {
      margin: 0;
      max-width: 36ch;
      color: var(--muted);
      font-size: 18px;
      line-height: 1.45;
    }

    .talks {
      display: grid;
      gap: 16px;
    }

    .talk {
      display: grid;
      grid-template-columns: 88px 1fr;
      gap: 22px;
      align-items: center;
      padding: 22px;
      text-decoration: none;
      color: inherit;
      background: color-mix(in srgb, var(--card) 88%, transparent);
      border: 1px solid var(--gold-dim);
      transition: border-color 160ms ease, transform 160ms ease, background 160ms ease;
    }

    .talk:hover {
      border-color: var(--gold);
      background: #221d16;
      transform: translateY(-2px);
    }

    .talk-frame {
      display: flex;
      gap: 5px;
      align-items: start;
      height: 56px;
      padding: 8px;
      border: 1px solid var(--gold-dim);
      background:
        linear-gradient(180deg, rgba(212, 160, 84, 0.08), transparent 40%),
        repeating-linear-gradient(
          -18deg,
          transparent,
          transparent 7px,
          rgba(212, 160, 84, 0.06) 7px,
          rgba(212, 160, 84, 0.06) 8px
        );
    }

    .talk-frame-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--gold);
      opacity: 0.7;
    }

    .talk-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 16px;
      margin: 0 0 8px;
      font-family: "IBM Plex Mono", ui-monospace, monospace;
      font-size: 12px;
      color: var(--muted);
    }

    .talk-slug { color: var(--gold); }

    h2 {
      margin: 0;
      font-size: clamp(26px, 4vw, 34px);
      font-weight: 500;
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    .talk-blurb {
      margin: 10px 0 0;
      color: var(--muted);
      font-size: 16px;
      line-height: 1.45;
    }

    @media (max-width: 640px) {
      main { width: min(100% - 32px, 920px); padding-top: 40px; }
      .talk { grid-template-columns: 1fr; }
      .talk-frame { width: 72px; height: 44px; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <p class="eyebrow">Presentations</p>
      <h1>Talks</h1>
      <p class="lede">Working decks from talks, workshops, and notes that got out of hand.</p>
    </header>
    <section class="talks">
      ${cards}
    </section>
  </main>
</body>
</html>
`
}
