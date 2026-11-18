import type { PluginOption } from 'vite'
import Font from 'vite-plugin-font'

/**
 * Vite-side compression / asset pipeline for VuePress.
 *
 * - JS / CSS: rely on Vite production minify (configured in config.ts)
 * - HTML: post-build `scripts/minify-html.mjs` (VuePress SSG writes many HTML
 *   files outside Vite's single-index transform)
 * - SVG icons: SVGO inside `scripts/sync-simple-icons.mjs`
 * - Fonts: vite-plugin-font splits CJK (Noto Sans SC Black) under `.vuepress/fonts/`.
 *   Archivo Black is a small Latin woff2 loaded via @font-face in
 *   `styles/feature-fonts.ts`. Optional `?subsets` still uses scanFiles.
 */
export function createCompressPlugins(): PluginOption[] {
  return [
    Font.vite({
      scanFiles: {
        default: [
          'content/**/*.{md,yml}',
          '.vuepress/**/*.{ts,js,vue,css,md}',
        ],
      },
    }),
  ]
}
