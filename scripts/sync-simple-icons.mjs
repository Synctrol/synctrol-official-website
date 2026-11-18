import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { siBilibili, siGithub } from 'simple-icons'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, '.vuepress', 'public', 'icons')

/** Brand SVGs used by socialLinks; Forums is GitHub Discussions → GitHub mark. */
const icons = {
  github: siGithub,
  bilibili: siBilibili,
  forums: siGithub,
}

await mkdir(outDir, { recursive: true })

for (const [name, icon] of Object.entries(icons)) {
  const file = join(outDir, `${name}.svg`)
  await writeFile(file, `${icon.svg}\n`, 'utf8')
  console.log(`wrote ${name}.svg (${icon.title})`)
}
