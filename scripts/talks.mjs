import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

export const TALKS_DIR = 'talks'

export async function listTalks() {
  const files = (await readdir(TALKS_DIR))
    .filter((file) => file.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b))

  return Promise.all(files.map(async (file) => {
    const entry = path.join(TALKS_DIR, file)
    const source = await readFile(entry, 'utf8')
    return {
      slug: file.replace(/\.md$/, ''),
      file,
      entry,
      ...parseMeta(source),
    }
  }))
}

export function parseMeta(source) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const body = frontmatter ? source.slice(frontmatter[0].length) : source
  const fields = {}

  if (frontmatter) {
    for (const line of frontmatter[1].split('\n')) {
      const match = line.match(/^(\w+):\s*(.+)$/)
      if (match)
        fields[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '')
    }
  }

  const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim()
  const description = fields.description || firstPlainLine(body) || ''

  return {
    title: fields.title || heading || 'Untitled',
    description,
    date: fields.date || '',
  }
}

export function normalizeBase(base) {
  if (!base || base === '/')
    return '/'
  return `/${base.replace(/^\/|\/$/g, '')}/`
}

export function findTalk(talks, slug) {
  return talks.find((talk) => talk.slug === slug)
}

function firstPlainLine(body) {
  return body
    .split('\n')
    .map((line) => line.trim())
    .find((line) =>
      line
      && !line.startsWith('#')
      && !line.startsWith('<')
      && !line.startsWith('---')
      && !line.startsWith('::')
      && !line.startsWith('```'),
    )
}
