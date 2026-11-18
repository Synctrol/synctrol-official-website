import archivoUrl from '../fonts/ArchivoBlack-Regular.woff2?url'
import { css as notoSansSc } from '../fonts/NotoSansSC-Black.otf'

/**
 * Combined display stack:
 * - Latin / brand English → Archivo Black
 * - CJK → Noto Sans SC Black (official package has no ExtraBold; Black ≈ 900)
 */
export const featureFontStack = `"Archivo Black", "${notoSansSc.family}", "Arial Black", Arial, "PingFang SC", "Microsoft YaHei", sans-serif`

// Keep a live reference so tree-shaking does not drop the Chinese @font-face injection.
void notoSansSc.family

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.dataset.synFeatureFonts = 'true'
  style.textContent = `
@font-face {
  font-family: 'Archivo Black';
  src: url('${archivoUrl}') format('woff2');
  font-weight: 400 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
`
  document.head.appendChild(style)
}
