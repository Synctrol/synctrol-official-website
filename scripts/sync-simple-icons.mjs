import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { siBilibili, siGithub } from 'simple-icons'
import { optimize } from 'svgo'

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
  const optimized = optimize(icon.svg, {
    multipass: true,
    plugins: [
      'preset-default',
      // Keep viewBox so <img width/height> scales correctly (SVGO 4).
      { name: 'removeViewBox', active: false },
      'removeDimensions',
    ],
  })

  if (optimized.error) {
    throw new Error(`SVGO failed for ${name}: ${optimized.error}`)
  }

  const file = join(outDir, `${name}.svg`)
  await writeFile(file, `${optimized.data}\n`, 'utf8')
  console.log(
    `wrote ${name}.svg (${icon.title}) ${icon.svg.length} → ${optimized.data.length} bytes`,
  )
}
