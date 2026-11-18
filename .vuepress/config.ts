import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import {
  synctrolTheme,
  zhMessages,
} from 'vuepress-theme-synctrolling'
import { createCompressPlugins } from './compress'

export default defineUserConfig({
  base: '/',
  bundler: viteBundler({
    viteOptions: {
      build: {
        // Use Vite's default minifier (oxc/esbuild per Vite version).
        // Do not force `minify: 'esbuild'` — newer Vite needs a separate esbuild install.
        minify: true,
        cssMinify: true,
      },
      plugins: createCompressPlugins(),
    },
  }),
  // Theme content lives under content/; keep repo docs out of the site.
  pagePatterns: ['**/*.md', '!.vuepress', '!node_modules', '!docs'],
  locales: {
    '/zh/': { lang: 'zh-CN' },
  },
  theme: synctrolTheme({
    siteUrl: 'https://synctrol.com',
    mainLocale: 'zh',
    locales: {
      zh: { lang: 'zh-CN', label: '中文', messages: zhMessages },
    },
    // Latin → Archivo Black; CJK → Noto Sans SC Black. Loaded in client.ts.
    featureFont:
      '"Archivo Black", "Noto Sans SC Black", "Arial Black", Arial, "PingFang SC", "Microsoft YaHei", sans-serif',
    tags: {
      release: {
        title: { zh: '作品发布' },
      },
    },
    background: './backgrounds/host',
    topbarText: 'SYNCTROL © 2026',
    footbarText: '敬请期待 · STAY TUNED',
    navigation: {
      items: [
        { label: { zh: '作品' }, href: '/releases/' },
        { label: { zh: '新闻' }, href: '/news/' },
        { label: { zh: '关于' }, href: '/about/' },
      ],
    },
    socialLinks: {
      // Absolute /icons/* paths (from simple-icons → public/icons) so <img>
      // resolves in both dev and build; relative ./assets/* stays unrewritten.
      items: [
        {
          label: 'Forums',
          icon: '/icons/forums.svg',
          url: 'https://github.com/orgs/Synctrol/discussions',
        },
        {
          label: 'Bilibili',
          icon: '/icons/bilibili.svg',
          url: 'https://space.bilibili.com/3546856898431612',
        },
        {
          label: 'GitHub',
          icon: '/icons/github.svg',
          url: 'https://github.com/synctrol',
        },
      ],
    },
    linkCloud: {
      items: [{ label: { zh: '关于' }, href: '/about/' }],
    },
    seo: {
      name: { zh: 'Synctrol' },
      description: {
        zh: 'Synctrol 音乐社团官方网站。我们塑造波形，描述声音。',
      },
      defaultImage: './assets/social-default.svg',
      organization: {
        name: 'Synctrol',
        logo: './assets/logo.svg',
      },
      collections: {
        release: {
          title: { zh: '作品' },
          description: { zh: 'Synctrol 作品列表' },
        },
        news: {
          title: { zh: '新闻' },
          description: { zh: 'Synctrol 新闻列表' },
        },
      },
    },
  }),
})
