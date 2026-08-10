# Synctrol 占位页设计文档

日期：2026-08-10
状态：已批准

## 背景

Synctrol 是一个还在筹建中的音乐社团。本仓库 `synctrol-official-website` 用于搭建社团官方 GitHub Pages 网站。在正式网站完成前，需要先发布一个占位页，告知外界网站正在建设中。

## 需求

- 只放置"网站建设中"提示文案，不包含社团介绍、联系方式、社交链接、倒计时
- 页面语言为中文
- 视觉风格：粗野主义排版（黑白灰、粗体大字、网格结构）
- 动效：轻量纯 CSS 背景动效，无 JS
- 纯静态 HTML，无构建工具
- 支持暗色模式：跟随系统 `prefers-color-scheme` 自动切换，纯黑背景全反转，无 JS
- 右上角提供"亮色 / 暗色"手动切换按钮；默认跟随系统，手动选择不持久化，刷新后恢复系统模式

## 站点类型与地址

- 项目站（project site），仓库名 `synctrol-official-website`
- 访问地址：`https://<用户名>.github.io/synctrol-official-website/`
- 暂不使用根域名或自定义域名

## 布局结构（CSS Grid）

```
┌───────────────────────────────────────────────┐
│ 顶部静态粗黑条（白字：SYNCTROL · OFFICIAL WEBSITE）│
├───────────────┬───────────────────────────────┤
│               │ 装饰格：几何图形（方块/圆/斜线）    │
│   SYNCTROL    ├───────────────────────────────┤
│  （巨型粗体）   │ 网站建设中 / UNDER CONSTRUCTION    │
├───────────────┴───────────────────────────────┤
│ 底部静态粗条（敬请期待 · STAY TUNED）              │
└───────────────────────────────────────────────┘
```

- 桌面端：2 列网格 + 跨行主格
- 移动端：降级为单列
- 全页用 3px 黑色粗边框分割（装饰性几何图形用 2px 描边）；暗色模式下 3px 白色粗边框

## 视觉规范

- 配色：纯黑 `#000`、纯白 `#fff`、灰阶（用于次级文字、边框、背景纹理）
- 字体：
  - 中文：系统黑体栈（PingFang SC / Microsoft YaHei / Noto Sans CJK）
  - 西文：粗黑体（Arial Black / Impact 系），字重 900
- 装饰：黑色几何方块、斜线分割等粗野主义元素

## 暗色模式（prefers-color-scheme: dark）

跟随系统自动切换，实现方式为交换 `--black`/`--white` 变量实现整体反转，并覆盖灰阶与背景层：

| 元素 | 浅色 | 暗色 |
|------|------|------|
| body 背景 / 文字 | 白底 / 黑字 | 黑底 / 白字 |
| `.bar` 内容条 | 黑底白字 | 白底黑字（反转） |
| `.github-link` | 白字，hover 白底黑字 | 黑字，hover 黑底白字 |
| `.cell-deco` 装饰格 | 浅灰 `#ddd` | 深灰 `#1a1a1a` |
| `.logo-sub` / `.status-sub` | `#555` / `#888` | `#aaa` / `#999` |
| 背景网格线 / 扫描线 | 黑低透明 | 白低透明 |
| 噪点颗粒 | 黑噪点 | 白噪点（`filter: invert(1)`） |
| 几何图形（方块/三角） | 黑描边黑块 | 白描边白块 |
| 边框 | 3px 黑色 | 3px 白色 |

`color-scheme` 声明为 `light dark`，原生控件（滚动条等）跟随系统。动画、响应式、`prefers-reduced-motion` 逻辑不变。

## 亮/暗切换按钮

- 位置：顶部内容条右侧，固定"亮色 / 暗色"双词，当前生效模式高亮
- 默认行为：页面加载时跟随系统（`prefers-color-scheme`），JS 用 `matchMedia` 检测并高亮当前系统模式，系统变化时高亮跟随
- 手动切换：点击词设置 `<html data-theme="light|dark">` 强制覆盖，CSS 中 `[data-theme]` 属性选择器优先于媒体查询
- 不持久化：无 localStorage，刷新页面后恢复跟随系统
- 实现：顶部条内两个 `<button>` 按钮组 + 文件底部内联 `<script>`（约 20 行，无依赖）
- 按钮样式沿用粗野主义：3px 边框、等宽粗体，当前模式反色高亮，浅色/暗色两态适配

## 背景动效（纯 CSS + 内联 SVG，无 JS）

四层叠加：

- **A 扫描线**：半透明水平扫描线缓慢向下移动
- **B 网格波动**：细网格背景缓慢位移/呼吸
- **C 噪点颗粒**：SVG feTurbulence 噪点 + 位移动画
- **D 几何漂移**：三个大尺寸几何图形（55-60vmin 方块、60vmin 高三角形）从视口外侧单向线性横穿视口（14-18s 循环，负 delay 错开），画面中只露部分边缘

降级策略：

- `prefers-reduced-motion` 时全部关闭动画
- 移动端适当精简层数，保证性能

## 内容条

- 顶部和底部内容条均为静态条，无滚动
- 文本内容：`SYNCTROL · OFFICIAL WEBSITE` / `网站建设中 · UNDER CONSTRUCTION` / `敬请期待 · STAY TUNED`
- 底部条右侧含 GitHub 链接：`https://github.com/synctrol`，显示为 `GITHUB ↗`，白字下划线，悬停反色（白底黑字）

## 文件结构

```
synctrol-official-website/
├── index.html
├── style.css
└── .nojekyll
```

## 发布流程

1. 本地分支 `master` 改名为 `main`
2. 写入文件并 commit
3. 在 GitHub 创建公开仓库 `synctrol-official-website`
4. 关联 remote 并 push
5. GitHub 网页端 Settings → Pages → Deploy from a branch → `main` / `/ (root)` → Save
6. 站点地址：`https://<用户名>.github.io/synctrol-official-website/`

## 非目标（YAGNI）

- 无 JS、无构建工具、无框架
- 无联系方式、社交链接、倒计时、社团介绍
- 无 Jekyll（用 `.nojekyll` 跳过）
