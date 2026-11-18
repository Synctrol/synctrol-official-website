import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { minify } from 'html-minifier-terser'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, '.vuepress', 'dist')

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(full)))
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full)
    }
  }
  return files
}

const before = await stat(distDir).catch(() => null)
if (!before?.isDirectory()) {
  console.error(`Missing build output: ${distDir}`)
  process.exit(1)
}

const files = await collectHtmlFiles(distDir)
let saved = 0

for (const file of files) {
  const source = await readFile(file, 'utf8')
  const output = await minify(source, {
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    // Vue SSG hydration markers live in HTML comments — never strip them.
    removeComments: false,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyCSS: true,
    minifyJS: true,
  })
  await writeFile(file, output, 'utf8')
  saved += source.length - output.length
}

console.log(
  `minified ${files.length} HTML files, saved ${saved} bytes (comments preserved)`,
)
