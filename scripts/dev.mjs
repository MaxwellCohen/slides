import { spawn } from 'node:child_process'
import { findTalk, listTalks } from './talks.mjs'

const talks = await listTalks()
const args = process.argv.slice(2)
const slug = args.find((arg) => !arg.startsWith('-'))
const extra = args.filter((arg) => arg !== slug)

if (talks.length === 0) {
  console.error('No talks found in talks/*.md')
  process.exit(1)
}

const talk = slug
  ? findTalk(talks, slug)
  : talks.length === 1
    ? talks[0]
    : null

if (!talk) {
  console.log('Usage: pnpm dev <talk>\n')
  console.log('Available talks:')
  for (const item of talks)
    console.log(`  ${item.slug.padEnd(24)} ${item.title}`)
  process.exit(slug ? 1 : 0)
}

console.log(`Starting ${talk.title} (${talk.entry})`)

const child = spawn('pnpm', ['exec', 'slidev', talk.entry, '--open', ...extra], {
  stdio: 'inherit',
  shell: false,
})

child.on('exit', (code) => process.exit(code ?? 0))
