# Placeholder Framework

A zero‑config static‑site generator that swaps HTML **comment placeholders** for JavaScript components, leaving you with fully‑rendered, prettified pages and correctly‑rewired asset paths.  Think of it as *server‑side includes* on steroids — powered by plain Node.js.
<br>

[![npm](https://img.shields.io/npm/v/placeholder-framework?style=flat-square)](https://www.npmjs.com/package/placeholder-framework)
[![node](https://img.shields.io/node/v/placeholder-framework?style=flat-square)](https://nodejs.org/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-yellow.svg)](LICENSE.md)

---

## ✨  Highlights

* **HTML‑first** — author pages in raw HTML; sprinkle placeholders like `<!-- hero -->` where components should render.
* **No build config** — everything lives in conventional folders (`_pages`, `_components`, `_data`, `public`).
* **One‑file builder** — `_build.js` ships with the package; no Babel/Webpack required.
* **Starter template** included (optional).
* **VS Code integration** — automatic *Tasks* & *Live Server* settings.
* **CLI** for scaffolding, building & watching with hot‑rebuilds (via `nodemon`).

---

## 📦  Installation

```bash
# install the latest release globally
npm install -g placeholder-framework

# — or test the repo locally without publishing —
# A) npm link (development workflow)
cd /path/to/placeholder-framework && npm link
# B) packed tarball
npm pack && npm install -g ./placeholder-framework-*.tgz
```

> Requires **Node 16+** (works fine on Node 22) and npm/yarn/pnpm of your choice.

---

## ⚡  Quick start

```bash
placeholder-framework create ./_MyPage
```

Interactive prompts:

| Question | Meaning |
|----------|---------|
| *Do you want to use the starter template?* | **Y** → copy the built‑in `starter-template/` folder.<br>**N** → create an empty scaffold (see below). |
| *Enter a name for your build:* | Folder name inside `/build` that will receive compiled files, e.g. `getmypage`. |
| *Are you using VS Code?* | **Y** → adds a Task & Live Server root.<br>**N** → skips editor integration. |

### What gets generated (empty scaffold)

```
_MyPage/
├─ public/          # your static assets (copied verbatim)
├─ _components/     # `*.js` component functions
├─ _data/           # `*.json` data for components
├─ _pages/          # source `.html` files (placeholders allowed)
│  └─ index.html
├─ componentsMap.js # placeholder ↔ component ↔ data mapping
└─ package.json     # local dev scripts + buildFolder name
```

Starter projects get the same structure pre‑filled with a Bootstrap demo and working components.

---

## 🛠️  CLI commands

| Command | Description |
|---------|-------------|
| `placeholder-framework create <dir>` | Scaffold a new project inside `<dir>`. |
| `placeholder-framework build <dir> [--ignore-assets]` | Run **one** build. Cleans `/build/<name>` and copies `/public` unless `--ignore-assets` is set. |
| `placeholder-framework watch <dir> [--ignore-assets]` | Rebuild on every file change (powered by `nodemon`). |

### Examples

```bash
# single build, cleaning /public
placeholder-framework build .

# build without recopying assets
placeholder-framework build . --ignore-assets

# live‑watch
placeholder-framework watch .
```

---

## 🧩  Mapping components (`componentsMap.js`)

```js
module.exports = [
  {
    placeholder: "<!-- hero -->",       // how it appears in HTML
    dataFile:    "hero.json",           // relative to /_data ("" if none)
    component:   "hero.js"              // relative to /_components
  },
  // more mappings…
];
```

Inside an HTML page:

```html
<body>
  <!-- hero -->
  <!-- footerSection -->
</body>
```

Each component is just a function that receives parsed JSON and returns a string of HTML:

```js
// _components/hero.js
module.exports = ({ title, tagline }) => `
  <section class="hero">
    <h1>${title}</h1>
    <p>${tagline}</p>
  </section>
`;
```

---

## ⚙️  VS Code integration

If you answered **Y** to *Are you using VS Code?* the CLI will:

1. Append a task to `.vscode/tasks.json`:
   ```jsonc
   {
     "label": "[placeholder-framework]: \"/getmypage\" from... \"_MyPage\"",
     "type": "shell",
     "command": "npm run watch:_MyPage",
     "options": { "cwd": "${workspaceFolder}/_MyPage" },
     "problemMatcher": []
   }
   ```
2. Set `liveServer.settings.port = 3000` and `liveServer.settings.root = "/getmypage"` in `.vscode/settings.json` so hitting **Go Live** serves your freshly built pages.

---

## 🏗️  How the build works

1. `_build.js` reads `componentsMap.js` and builds a lookup table.
2. For every `*.html` under `/_pages`, it:
   * loads the referenced component & data,
   * replaces the placeholder comment with rendered HTML,
   * rewrites `/public/...` URLs so they remain correct at any folder depth,
   * prettifies the final markup (`js-beautify`).
3. `--clean` mode wipes the previous build and copies `/public` first.

Everything happens with plain Node APIs — no heavy bundlers!

---

## 🚑  Troubleshooting

| Symptom | Fix |
|---------|-----|
| `TypeError: inquirer.prompt is not a function` | You are on Inquirer ≥9 but using CommonJS `require`.  Either pin `inquirer@8` *(the starter kit already does)* or import it via `const inquirer = (await import('inquirer')).default;`. |
| `ENOENT spawn npx` on `watch` | npm 10 no longer installs `npx`.  The CLI now calls `nodemon` directly — update to ≥ *commit abc123* or reinstall the latest package. |
| Pages build but images are broken | Ensure your `<img src="/public/...">` paths really start with `/public/`.  The builder rewrites only those. |

---

## 🤝  Contributing

PRs and issues are welcome! By contributing you agree to license your work under the Apache 2.0 license.

---

## 📝  License

Apache 2.0 © 2025 Placeholder Framework contributors
