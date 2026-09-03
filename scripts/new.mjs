import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { TALKS_DIR } from './talks.mjs'

const title = process.argv.slice(2).join(' ').trim()

if (!title) {
  console.error('Usage: pnpm new "Talk title"')
  process.exit(1)
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

if (!slug) {
  console.error('Could not turn that title into a filename.')
  process.exit(1)
}

const entry = path.join(TALKS_DIR, `${slug}.md`)
const today = new Date().toISOString().slice(0, 10)

const source = `---
theme: default
title: ${title}
date: ${today}
layout: cover
---

# ${title}

---
`

await writeFile(entry, source, { flag: 'wx' })
console.log(`Created ${entry}`)
console.log(`Start it with: pnpm dev ${slug}`)
