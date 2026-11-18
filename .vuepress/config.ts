import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import {
  synctrolTheme,
  zhMessages,
} from 'vuepress-theme-synctrolling'

export default defineUserConfig({
  base: '/',
  bundler: viteBundler(),
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
    tags: {
      release: {
        title: { zh: '作品发布' },
      },
    },
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
      items: [
        {
          label: 'Forums',
          icon: './assets/forums.svg',
          url: 'https://github.com/orgs/Synctrol/discussions',
        },
        {
          label: 'Bilibili',
          icon: './assets/bilibili.svg',
          url: 'https://space.bilibili.com/3546856898431612',
        },
        {
          label: 'GitHub',
          icon: './assets/github.svg',
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
