# VuePress 站点骨架设计

日期：2026-11-19  
状态：已批准

## 背景

`synctrol-official-website` 当前是 GitHub Pages 上的静态占位站（`index.html` + `style.css`），自定义域名为 `synctrol.com`。团队已发布定制主题 [`vuepress-theme-synctrolling`](https://www.npmjs.com/package/vuepress-theme-synctrolling)，计划用 VuePress 2 + 该主题重建正式站点。

本阶段只完成**可构建的站点骨架**与 **`release` 分支触发的 Pages 部署流水线**，不迁移完整内容、不做英文站、不接音效/背景音乐/自定义背景。

## 目标与成功标准

- 仓库根目录成为 VuePress 站点源码；旧静态占位文件删除
- 使用 `vuepress-theme-synctrolling@^0.3.0`，仅中文（`zh`）locale
- 具备首页 + 占位作品 / 新闻 / 关于页，导航可点通
- 本地 `npm run docs:build` 成功
- 合并（push）到 `release` 时，GitHub Actions 构建并部署到 GitHub Pages
- 保留自定义域名 `synctrol.com`（`CNAME` 进入构建产物）

## 非目标

- 英文或其他语言
- 真实作品/新闻内容与专辑素材
- 主题可选能力：background 模块、交互音效、背景音乐
- 在本功能分支上直接部署到生产（仅当合入 `release` 才部署）

## 架构

采用「仓库根即站点源」：

```text
/
├── package.json
├── .vuepress/
│   ├── config.ts
│   ├── assets/                 # logo、社交默认图、社交图标
│   └── public/
│       └── CNAME               # synctrol.com
├── content/
│   ├── home/
│   ├── releases/<slug>/
│   ├── news/<slug>/
│   └── pages/about/
├── .github/workflows/
│   └── deploy-pages.yml
└── docs/superpowers/           # 既有与新增规格/计划文档
```

删除：`index.html`、`style.css`、`fonts/`、根目录 `CNAME`、`.nojekyll`。

依赖与运行时：

| 项 | 值 |
| --- | --- |
| Node | `^20.9.0 \|\| >=22.0.0`（CI 用 22） |
| Vue | `^3.5.0` |
| VuePress | `^2.0.0-rc.24` |
| Bundler | `@vuepress/bundler-vite@^2.0.0-rc.24` |
| Theme | `vuepress-theme-synctrolling@^0.3.0` |
| `base` | `'/'` |
| `siteUrl` | `https://synctrol.com`（无末尾斜杠） |

## 主题与内容配置

### `.vuepress/config.ts`

- `locales`：仅 `'/zh/'` → `zh-CN`
- 主题：`mainLocale: 'zh'`，locales 仅 `zh`（使用主题导出的 `zhMessages`）
- `topbarText`：`SYNCTROL © 2026`
- `footbarText`：`敬请期待 · STAY TUNED`
- `navigation`：
  - 作品 → `/releases/`
  - 新闻 → `/news/`
  - 关于 → `/pages/about/`
- `socialLinks`（沿用现站外链）：
  - Forums → `https://github.com/orgs/Synctrol/discussions`
  - Bilibili → `https://space.bilibili.com/3546856898431612`
  - GitHub → `https://github.com/synctrol`
- `linkCloud`：一项，指向关于页 `/pages/about/`
- `seo`：站点名 Synctrol；中文短简介；`defaultImage` 与 `organization.logo` 使用 `.vuepress/assets/` 下占位 SVG；声明 `release` / `news` collections
- `tags`：至少声明占位新闻会用到的标签（如 `release`）

站内链接一律相对语言根书写（不带 `/zh` 前缀）。

### 内容包

| 路径 | 说明 |
| --- | --- |
| `content/home/` | `type: home`；`zh.md` 含必需 `home-logo`（品牌名 + 副标题）及简短正式介绍 |
| `content/releases/placeholder-release/` | 最小可构建作品：`content.yml` + `zh.md` + 极简 `album.yml`（标题与一轨） |
| `content/news/hello/` | 占位新闻，`tags` 引用已声明标签 |
| `content/pages/about/` | 占位关于页 |

首页不做「建设中」主文案；语气为正式主题首页骨架。

### npm scripts

- `docs:dev` → `vuepress dev .`
- `docs:build` → `vuepress build .`

## 分支与部署

### 分支角色

| 分支 | 角色 |
| --- | --- |
| 功能分支 | 完成本骨架实现与本地构建验证 |
| `main` | 日常开发汇合 |
| `release` | 唯一触发生产部署的发布分支 |

创建 `release` 分支（若不存在）；本阶段骨架合入后，再合并到 `release` 才会真正部署。

### Workflow：`.github/workflows/deploy-pages.yml`

- 触发：`push` 到 `release`
- 步骤：checkout → setup Node 22 → `npm ci` → `npm run docs:build` → upload Pages artifact → `actions/deploy-pages`
- 权限：`pages: write`、`id-token: write`、`contents: read`
- 产物目录：VuePress 默认 `.vuepress/dist`（实现时以 CLI 实际输出为准）
- `CNAME` 通过 `.vuepress/public/CNAME` 打入产物

## 验收

1. 旧静态入口文件已移除，VuePress 源码在仓库根
2. `npm install` 后 `npm run docs:build` 退出码 0
3. 构建产物含中文首页；导航可进入占位作品、新闻、关于页
4. workflow 仅监听 `release`；文件路径与权限正确
5. 产物中含 `CNAME` 内容 `synctrol.com`

## 风险与注意

- 主题 peer 依赖锁定在 VuePress 2 rc；安装时需对齐 README 版本
- 仓库 Pages 设置需使用 GitHub Actions 作为源，且自定义域名已指向 Pages
- 仅配置 `zh` 时，VuePress `locales` 与主题 `locales` 必须一致，避免根路径语言重定向异常
