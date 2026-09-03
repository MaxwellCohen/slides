import { mkdir, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { listTalks, normalizeBase } from './talks.mjs'
import { renderIndex } from './index-page.mjs'

const { values } = parseArgs({
  options: {
    base: { type: 'string', default: process.env.BASE_PATH ?? '/' },
  },
  strict: false,
})

const base = normalizeBase(values.base)
const talks = await listTalks()

if (talks.length === 0) {
  console.error('No talks found in talks/*.md')
  process.exit(1)
}

await rm('dist', { recursive: true, force: true })
await mkdir('dist', { recursive: true })

const root = process.cwd()

for (const talk of talks) {
  const talkBase = `${base}${talk.slug}/`
  const outDir = path.join(root, 'dist', talk.slug)
  console.log(`\nBuilding ${talk.slug} → ${path.relative(root, outDir)} (base ${talkBase})`)

  const result = spawnSync('pnpm', [
    'exec',
    'slidev',
    'build',
    talk.entry,
    '--out',
    outDir,
    '--base',
    talkBase,
    '--router-mode',
    'hash',
  ], {
    stdio: 'inherit',
    shell: false,
  })

  if (result.status !== 0)
    process.exit(result.status ?? 1)
}

const index = renderIndex(talks, base)
await writeFile('dist/index.html', index)
await writeFile('dist/404.html', index)
await writeFile('dist/.nojekyll', '')

console.log(`\nBuilt ${talks.length} talk${talks.length === 1 ? '' : 's'} to dist/`)
for (const talk of talks)
  console.log(`  ${talk.title}  →  ${base}${talk.slug}/`)
