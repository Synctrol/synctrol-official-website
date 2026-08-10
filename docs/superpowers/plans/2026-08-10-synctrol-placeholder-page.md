# Synctrol 占位页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建并发布 Synctrol 音乐社团的 GitHub Pages 占位页，告知外界网站建设中。

**Architecture:** 纯静态三文件站点（`index.html` + `style.css` + `.nojekyll`），无 JS、无构建工具。页面采用网格粗野主义布局（黑白灰、粗边框、巨字排版），配四层纯 CSS/内联 SVG 背景动效（扫描线、网格波动、噪点颗粒、几何漂移），带 `prefers-reduced-motion` 降级。

**Tech Stack:** HTML5 + CSS3（CSS Grid、keyframes 动画、内联 SVG filter）。无框架、无 JS、无构建工具。

---

## 文件结构

- `index.html` — 页面结构，三行内容条 + 中央网格
- `style.css` — 全部样式、布局、四层背景动效、响应式、降级
- `.nojekyll` — 空文件，跳过 Jekyll 构建
- `.gitignore` — 已存在，忽略 `.superpowers/` 与 `.DS_Store`

---

### Task 1: 创建 `.nojekyll` 空文件

**Files:**
- Create: `.nojekyll`

- [ ] **Step 1: 创建空文件**

```bash
touch .nojekyll
```

- [ ] **Step 2: 验证存在且为空**

Run: `ls -la .nojekyll`
Expected: 文件存在，大小 0 字节

- [ ] **Step 3: Commit**

```bash
git add .nojekyll
git commit -m "build: add .nojekyll to skip Jekyll processing"
```

---

### Task 2: 创建 `index.html`

**Files:**
- Create: `index.html`

- [ ] **Step 1: 写入 HTML 结构**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SYNCTROL — 网站建设中</title>
  <meta name="description" content="Synctrol 音乐社团官方网站，建设中。">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="bg-grid" aria-hidden="true"></div>
  <div class="bg-noise" aria-hidden="true"></div>
  <div class="bg-scanline" aria-hidden="true"></div>
  <div class="bg-shapes" aria-hidden="true">
    <div class="shape shape-a"></div>
    <div class="shape shape-b"></div>
    <div class="shape shape-c"></div>
  </div>

  <header class="bar bar-top">
    <span>SYNCTROL&nbsp;·&nbsp;OFFICIAL WEBSITE</span>
  </header>

  <main class="grid">
    <section class="cell cell-title">
      <h1 class="logo">SYNCTROL</h1>
      <p class="logo-sub">MUSIC CLUB</p>
    </section>
    <section class="cell cell-deco" aria-hidden="true">
      <div class="deco-symbol"></div>
      <p class="deco-label">BLACK&nbsp;SQUARE</p>
    </section>
    <section class="cell cell-status">
      <h2 class="status-title">网站建设中</h2>
      <p class="status-sub">UNDER&nbsp;CONSTRUCTION</p>
    </section>
  </main>

  <footer class="bar bar-bottom">
    <span>敬请期待 · STAY TUNED</span>
    <a class="github-link" href="https://github.com/synctrol" target="_blank" rel="noopener noreferrer">GITHUB&nbsp;↗</a>
  </footer>
</body>
</html>
```

- [ ] **Step 2: 验证 HTML 结构完整**

Run: 检查文件包含 `<!DOCTYPE html>`、`.bar-top`、`.grid`、`.bar-bottom` 及 GitHub 链接 `https://github.com/synctrol`
Expected: 全部存在

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add placeholder page HTML structure"
```

---

### Task 3: 创建 `style.css`（基础布局 + 配色）

**Files:**
- Create: `style.css`

- [ ] **Step 1: 写入基础样式**

```css
:root {
  --black: #000;
  --white: #fff;
  --gray-300: #ddd;
  --gray-500: #888;
  --gray-700: #555;
  --border: 3px solid var(--black);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html, body { height: 100%; }

body {
  font-family: "Arial Black", Arial, "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
  background: var(--white);
  color: var(--black);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.bar {
  background: var(--black);
  color: var(--white);
  padding: 10px 16px;
  font-size: 13px;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bar-top { border-bottom: var(--border); }

.bar-bottom { border-top: var(--border); }

.github-link {
  color: var(--white);
  text-decoration: underline;
  letter-spacing: 2px;
  margin-left: auto;
  padding-left: 24px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.github-link:hover,
.github-link:focus-visible {
  background: var(--white);
  color: var(--black);
}

.grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  grid-template-rows: 1fr 1fr;
  border-left: var(--border);
  border-right: var(--border);
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
}

.cell-title { border-right: var(--border); grid-row: 1 / 3; }

.cell-deco { border-bottom: var(--border); background: var(--gray-300); }

.cell-status { display: flex; flex-direction: column; gap: 8px; }

.logo {
  font-size: clamp(48px, 9vw, 96px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -2px;
}

.logo-sub {
  font-size: 11px;
  letter-spacing: 8px;
  color: var(--gray-700);
  margin-top: 12px;
}

.deco-symbol {
  width: 44px;
  height: 44px;
  background: var(--black);
  margin: 0 auto 10px;
  animation: pulse 1.2s ease-in-out infinite;
}

.deco-label { font-size: 13px; letter-spacing: 2px; color: var(--black); }

.status-title { font-size: 24px; font-weight: 900; }

.status-sub { font-size: 11px; letter-spacing: 3px; color: var(--gray-500); }

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.8); }
}
```

- [ ] **Step 2: 验证基础布局样式存在**

Run: 检查 `.grid` 使用 `grid-template-columns`、`.logo` 使用 `clamp()`、`.github-link` 有 `:hover` 反色
Expected: 全部存在

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add base layout and brutalism styles"
```

---

### Task 4: 四层背景动效 + 响应式 + 降级

**Files:**
- Modify: `style.css`（在文件末尾追加）

- [ ] **Step 1: 追加背景层与动效样式**

```css
.bg-grid,
.bg-noise,
.bg-scanline,
.bg-shapes {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.bg-grid {
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.12) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.12) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: grid-drift 12s linear infinite;
}

@keyframes grid-drift {
  0% { background-position: 0 0; }
  100% { background-position: 48px 48px; }
}

.bg-scanline {
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.05) 0px,
    rgba(0, 0, 0, 0.05) 1px,
    transparent 1px,
    transparent 4px
  );
  animation: scan-move 8s linear infinite;
}

@keyframes scan-move {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
  opacity: 0.06;
  animation: noise-jump 0.4s steps(2) infinite;
}

@keyframes noise-jump {
  0% { transform: translate(0, 0); }
  50% { transform: translate(-2px, 2px); }
  100% { transform: translate(2px, -2px); }
}

.bg-shapes .shape {
  position: absolute;
  border: 2px solid var(--black);
}

.shape-a {
  width: 120px;
  height: 120px;
  top: 20%;
  left: 8%;
  animation: drift-a 20s ease-in-out infinite;
}

.shape-b {
  width: 200px;
  height: 200px;
  bottom: 15%;
  right: 10%;
  background: rgba(0, 0, 0, 0.06);
  animation: drift-b 26s ease-in-out infinite;
}

.shape-c {
  width: 0;
  height: 0;
  border: none;
  border-left: 60px solid transparent;
  border-right: 60px solid transparent;
  border-bottom: 100px solid rgba(0, 0, 0, 0.08);
  top: 55%;
  left: 55%;
  animation: drift-c 32s ease-in-out infinite;
}

@keyframes drift-a {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(30px, -20px) rotate(15deg); }
}

@keyframes drift-b {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-40px, 25px) scale(1.1); }
}

@keyframes drift-c {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(20px, 30px) rotate(10deg); }
}

.bar,
.grid,
.github-link {
  position: relative;
  z-index: 1;
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .cell-title {
    border-right: none;
    border-bottom: var(--border);
    grid-row: auto;
  }

  .logo { font-size: 52px; }

  .bar { font-size: 11px; padding: 8px 10px; }

  .bg-shapes .shape { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .bg-grid,
  .bg-scanline,
  .bg-noise,
  .bg-shapes,
  .deco-symbol {
    animation: none;
  }

  .bg-grid { background: none; }
  .bg-scanline { background: none; }
  .bg-noise { background-image: none; }
  .bg-shapes .shape { display: none; }
}
```

- [ ] **Step 2: 验证四层动效存在**

Run: 检查 `.bg-scanline`、`.bg-noise`、`.bg-grid`、`.bg-shapes` 均有对应 `@keyframes`；`@media (prefers-reduced-motion: reduce)` 存在
Expected: 全部存在

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add four-layer background animations, responsive and reduced-motion fallbacks"
```

---

### Task 5: 本地验证页面渲染

**Files:**
- 验证: `index.html` + `style.css`

- [ ] **Step 1: 启动本地静态服务器**

```bash
python3 -m http.server 8000 &
```

- [ ] **Step 2: 打开页面验证**

Run: 浏览器打开 `http://localhost:8000`
Expected: 显示 Synctrol 占位页——顶部黑条、中央网格（SYNCTROL 巨字 + 黑方块装饰 + 网站建设中）、底部黑条含 GITHUB 链接，背景有扫描线/网格/噪点/几何动效

- [ ] **Step 3: 验证响应式与降级**

Run: 浏览器窗口缩至 640px 以下 + 开启系统"减少动态效果"
Expected: 移动端单列布局；开启降级后所有动画停止

- [ ] **Step 4: 停止本地服务器**

```bash
kill %1
```

---

### Task 6: 分支改名并提交全部文件

**Files:**
- Git 操作

- [ ] **Step 1: 分支改名 master → main**

```bash
git branch -M main
```

- [ ] **Step 2: 确认工作区干净**

Run: `git status`
Expected: `On branch main`，无未提交更改

---

### Task 7: 发布到 GitHub Pages（需要用户手动操作）

**Files:**
- 无代码更改

- [ ] **Step 1: 用户在 GitHub 创建公开仓库 `synctrol-official-website`**

浏览器打开 https://github.com/new，仓库名输入 `synctrol-official-website`，选择 Public，不勾选 README，点击 Create repository。

- [ ] **Step 2: 关联并推送**

```bash
git remote add origin https://github.com/synctrol/synctrol-official-website.git
git push -u origin main
```

- [ ] **Step 3: 用户配置 Pages 发布源**

GitHub 仓库页面 → Settings → 侧栏 Pages → Build and deployment → Source 选 `Deploy from a branch` → Branch 选 `main` + `/ (root)` → Save

- [ ] **Step 4: 验证站点上线**

Run: 浏览器打开 `https://synctrol.github.io/synctrol-official-website/`
Expected: 显示占位页（部署最长需 10 分钟）
