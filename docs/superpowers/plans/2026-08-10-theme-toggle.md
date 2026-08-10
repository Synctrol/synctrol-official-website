# 亮/暗切换按钮 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Synctrol 占位页顶部条右侧添加"亮色 / 暗色"手动切换按钮，默认跟随系统，手动选择不持久化。

**Architecture:** 在 `index.html` 顶部条添加两个 `<button>`（亮色/暗色）和一个内联 `<script>`（使用 `matchMedia` + 设置 `<html data-theme>`）；在 `style.css` 中将暗色变量块从单一 `@media (prefers-color-scheme: dark)` 重构为 `[data-theme="dark"]` 属性选择器 + 仅无 `data-theme` 时生效的媒体查询，并新增按钮样式。

**Tech Stack:** HTML5 + CSS3 + 原生 JS（`matchMedia`、`dataset`）。无框架、无构建工具、无 localStorage。

---

### Task 1: 更新 `index.html`（按钮 + 脚本）

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 在顶部条添加切换按钮**

将 `.bar-top` 中的 `<span>SYNCTROL&nbsp;·&nbsp;OFFICIAL WEBSITE</span>` 之后、`</header>` 之前，加入：

```html
    <nav class="theme-toggle" aria-label="主题切换">
      <button type="button" data-theme-choice="light" class="theme-option theme-light" aria-pressed="false">亮色</button>
      <span class="theme-sep" aria-hidden="true">/</span>
      <button type="button" data-theme-choice="dark" class="theme-option theme-dark" aria-pressed="false">暗色</button>
    </nav>
```

修改后的 `.bar-top`：

```html
  <header class="bar bar-top">
    <span>SYNCTROL&nbsp;·&nbsp;OFFICIAL WEBSITE</span>
    <nav class="theme-toggle" aria-label="主题切换">
      <button type="button" data-theme-choice="light" class="theme-option theme-light" aria-pressed="false">亮色</button>
      <span class="theme-sep" aria-hidden="true">/</span>
      <button type="button" data-theme-choice="dark" class="theme-option theme-dark" aria-pressed="false">暗色</button>
    </nav>
  </header>
```

- [ ] **Step 2: 在 `</body>` 前添加内联脚本**

```html
  <script>
    (function () {
      var root = document.documentElement;
      var media = window.matchMedia('(prefers-color-scheme: dark)');
      var lightBtn = document.querySelector('.theme-light');
      var darkBtn = document.querySelector('.theme-dark');

      function highlight(theme) {
        var lightActive = theme === 'light';
        lightBtn.setAttribute('aria-pressed', lightActive);
        darkBtn.setAttribute('aria-pressed', !lightActive);
      }

      function current() {
        return root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light');
      }

      function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        highlight(theme);
      }

      lightBtn.addEventListener('click', function () { setTheme('light'); });
      darkBtn.addEventListener('click', function () { setTheme('dark'); });

      highlight(current());

      media.addEventListener('change', function () {
        if (!root.hasAttribute('data-theme')) {
          highlight(media.matches ? 'dark' : 'light');
        }
      });
    })();
  </script>
</body>
```

- [ ] **Step 3: 验证 HTML 完整**

Run: 检查 `.theme-toggle`、两个 `.theme-option` 按钮、`data-theme-choice` 属性、脚本存在且位于 `</body>` 前
Expected: 全部存在

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add light/dark theme toggle buttons to header"
```

### Task 2: 更新 `style.css`（变量重构 + 按钮样式）

**Files:**
- Modify: `style.css`

- [ ] **Step 1: 重构暗色变量块**

将现有：

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000;
    --fg: #fff;

    --bar-bg: var(--white);
    --bar-fg: var(--black);

    --border: 3px solid var(--white);

    /* gray ramp is inverted in dark mode: 300 = darkest, 700 = lightest.
       Use the role wrappers (--deco-bg, --sub-title-fg, --status-sub-fg) directly. */
    --gray-300: #1a1a1a;
    --gray-500: #999;
    --gray-700: #aaa;

    --deco-bg: var(--gray-300);
    --deco-symbol-bg: var(--white);
    --deco-label-fg: var(--white);

    --sub-title-fg: var(--gray-700);
    --status-sub-fg: var(--gray-500);

    --link-fg: var(--black);
    --link-hover-bg: var(--black);
    --link-hover-fg: var(--white);

    --grid-line: rgba(255, 255, 255, 0.12);
    --scanline-line: rgba(255, 255, 255, 0.05);
    --noise-invert: 1;
    --shape-border: var(--white);
    --shape-b-fill: rgba(255, 255, 255, 0.06);
    --shape-c-fill: rgba(255, 255, 255, 0.08);
  }
}
```

替换为（暗色变量迁移到 `[data-theme="dark"]`，媒体查询仅无 `data-theme` 时生效）：

```css
:root[data-theme="dark"] {
  --bg: #000;
  --fg: #fff;

  --bar-bg: var(--white);
  --bar-fg: var(--black);

  --border: 3px solid var(--white);

  /* gray ramp is inverted in dark mode: 300 = darkest, 700 = lightest.
     Use the role wrappers (--deco-bg, --sub-title-fg, --status-sub-fg) directly. */
  --gray-300: #1a1a1a;
  --gray-500: #999;
  --gray-700: #aaa;

  --deco-bg: var(--gray-300);
  --deco-symbol-bg: var(--white);
  --deco-label-fg: var(--white);

  --sub-title-fg: var(--gray-700);
  --status-sub-fg: var(--gray-500);

  --link-fg: var(--black);
  --link-hover-bg: var(--black);
  --link-hover-fg: var(--white);

  --grid-line: rgba(255, 255, 255, 0.12);
  --scanline-line: rgba(255, 255, 255, 0.05);
  --noise-invert: 1;
  --shape-border: var(--white);
  --shape-b-fill: rgba(255, 255, 255, 0.06);
  --shape-c-fill: rgba(255, 255, 255, 0.08);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --bg: #000;
    --fg: #fff;

    --bar-bg: var(--white);
    --bar-fg: var(--black);

    --border: 3px solid var(--white);

    /* gray ramp is inverted in dark mode: 300 = darkest, 700 = lightest.
       Use the role wrappers (--deco-bg, --sub-title-fg, --status-sub-fg) directly. */
    --gray-300: #1a1a1a;
    --gray-500: #999;
    --gray-700: #aaa;

    --deco-bg: var(--gray-300);
    --deco-symbol-bg: var(--white);
    --deco-label-fg: var(--white);

    --sub-title-fg: var(--gray-700);
    --status-sub-fg: var(--gray-500);

    --link-fg: var(--black);
    --link-hover-bg: var(--black);
    --link-hover-fg: var(--white);

    --grid-line: rgba(255, 255, 255, 0.12);
    --scanline-line: rgba(255, 255, 255, 0.05);
    --noise-invert: 1;
    --shape-border: var(--white);
    --shape-b-fill: rgba(255, 255, 255, 0.06);
    --shape-c-fill: rgba(255, 255, 255, 0.08);
  }
}
```

- [ ] **Step 2: 新增切换按钮样式**

在 `.bar-bottom` 规则之后（`.github-link` 之前）添加：

```css
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
}

.theme-option {
  font: inherit;
  font-size: 12px;
  letter-spacing: 1px;
  color: inherit;
  background: transparent;
  border: none;
  padding: 2px 4px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.theme-option:hover,
.theme-option:focus-visible {
  text-decoration: underline;
}

.theme-option[aria-pressed="true"] {
  background: var(--bar-fg);
  color: var(--bar-bg);
}

.theme-sep {
  opacity: 0.6;
  font-size: 12px;
  pointer-events: none;
}
```

注意：`.theme-option[aria-pressed="true"]` 使用 `--bar-fg`（当前条前景色）作为背景、`--bar-bg` 作为前景色——这样在浅色条上反色为白底黑字高亮，暗色条（白底黑字）上反色为黑底白字高亮，无需额外媒体查询。

- [ ] **Step 3: 验证 CSS**

Run: 检查 `[data-theme="dark"]` 与 `:root:not([data-theme])` 两处暗色变量块、`.theme-toggle`、`.theme-option[aria-pressed="true"]` 存在
Expected: 全部存在

- [ ] **Step 4: Commit**

```bash
git add style.css
git commit -m "feat: add theme toggle styles and data-theme dark override"
```

### Task 3: 本地验证

**Files:**
- 验证: `index.html` + `style.css`

- [ ] **Step 1: 本地静态服务器冒烟测试**

Run: `python3 -m http.server 8000`（若未运行）
Expected: 页面加载正常

- [ ] **Step 2: 验证默认跟随系统**

Run: 浏览器打开，不点击按钮；系统浅色 → 浅色模式，系统暗色 → 暗色模式；切换系统外观后按钮高亮跟随
Expected: 两场景均正确

- [ ] **Step 3: 验证手动切换**

Run: 点击"暗色" → 变暗色，高亮"暗色"；点击"亮色" → 变亮色，高亮"亮色"；无论系统外观如何，手动选择强制生效
Expected: 全部正确

- [ ] **Step 4: 验证刷新恢复系统**

Run: 手动选择后刷新页面，系统暗色 → 暗色模式，系统浅色 → 浅色模式
Expected: 恢复跟随系统，无持久化

- [ ] **Step 5: 验证高亮样式两态**

Run: 浅色模式下高亮按钮为黑底白字（条是黑底白字 → 高亮反色为白底黑字）；暗色模式下条为白底黑字 → 高亮反色为黑底白字
Expected: 高亮与条反色对比明显
