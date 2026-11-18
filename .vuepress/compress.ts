import type { PluginOption } from 'vite'
import Font from 'vite-plugin-font'

/**
 * Vite-side compression / asset pipeline for VuePress.
 *
 * - JS / CSS: rely on Vite production minify (configured in config.ts)
 * - HTML: post-build `scripts/minify-html.mjs` (VuePress SSG writes many HTML
 *   files outside Vite's single-index transform)
 * - SVG icons: SVGO inside `scripts/sync-simple-icons.mjs`
 * - Fonts: vite-plugin-font is wired here; drop source fonts under
 *   `.vuepress/fonts/` and import them with `?subsets` when ready, e.g.
 *   `import { css } from './fonts/Feature.ttf?subsets'`
 */
export function createCompressPlugins(): PluginOption[] {
  return [
    Font.vite({
      // Used when a font is imported with ?subsets (极小量级 / glyph scan).
      scanFiles: {
        default: [
          'content/**/*.{md,yml}',
          '.vuepress/**/*.{ts,js,vue,css,md}',
        ],
      },
    }),
  ]
}
