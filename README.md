# `<!-- placeholder-framework -->`

A zero‑config static‑site generator that swaps HTML **comment placeholders** for JavaScript components, leaving you with fully‑rendered, prettified pages and correctly‑rewired asset paths.  Think of it as *server‑side includes* on steroids — powered by plain Node.js.
<br>

[![npm](https://img.shields.io/npm/v/placeholder-framework?style=flat-square)](https://www.npmjs.com/package/placeholder-framework)
[![node](https://img.shields.io/node/v/placeholder-framework?style=flat-square)](https://nodejs.org/)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-yellow.svg)](LICENSE.md)

---

## ✨  Features

* **HTML‑first** — write your pages in raw HTML; sprinkle placeholders like `<!-- hero -->` where components should render.
* **No build config** — everything lives in conventional folders (`_pages`, `_components`, `_data`, `public`).
* **One‑file builder** — `_build.js` ships with the package; no Babel/Webpack required.
* **Starter template** included (optional).
* **VS Code integration** — automatic *Tasks* & *Live Server* settings.
* **CLI** for scaffolding, building & watching with hot‑rebuilds (via `nodemon`).
<br>

---

## 📦  Installation

```bash
# install the latest release globally
npm install -g placeholder-framework
```

```bash
# or clone the repo and install locally
cd /placeholder-framework && npm link
```

> Requires **Node 16+**.

<br>

---

## ⚡️ Quick start

### 1. Installing & creating a project:

```bash
# 1. install the latest release globally
npm install -g placeholder-framework

# 2. create a new project in ./_MyPage
placeholder-framework create ./_MyPage
```

Now, answer three interactive prompts:

| Question | Meaning |
|----------|---------|
| *Do you want to use the starter template?* | **Y** → creates the project using a starter template.<br>**N** → create an empty scaffold (see below). |
| *Enter a name for your build:* | The folder in which your static will be built, e.g. `getmypage` |
| *Are you using VS Code?* | **Y** → adds a VS Code *Task* & sets *Live Server* root folder.<br>**N** → skips editor integration. |

<br>

#### What gets generated with an empty scaffold:

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

Projects using the `starter template` comes with the same structure, but features a demo-page, styled with *Bootstrap 5.3*, including built-in working components.
<br>

### 2. Live‑rebuilding & serving your project:

```bash
cd MySite
placeholder-framework watch .
```
Then, start *Live Server* (if using VS Code) and you should see your page.
Any changes made to your project should be displayed in real-time now (if not, just refresh the page).
<br>

---

## 🧑‍💻  How to use it
### Let's build a page from scratch

Below we build a **Hello World** landing page with two components: a header that needs no external data and a hero section whose copy comes from a separate JSON file.

```
MySite/
├─ public/                #   static assets
│   └─ img/
│       └─ hero.jpg
├─ _components/
│   ├─ header.js          #   no data needed
│   └─ heroSection.js     #   expects JSON
├─ _data/
│   └─ heroSection.json   #   copy for the hero
├─ _pages/
│   └─ index.html         #   uses the placeholders
└─ componentsMap.js       #   tells the builder what is what
```
<br>

### 1.  Create the components

**`_components/header.js`** (no data)
```js
module.exports = function header() {
  return `
    <header class="mb-5 text-center">
      <h1>Hello World 🚀</h1>
    </header>`;
};
```

**`_components/heroSection.js`** (with data)
```js
module.exports = function hero({ heading, paragraph, image }) {
  return `
    <section class="hero d-flex flex-column flex-md-row align-items-center gap-4">
      <img src="${image}" class="hero__img rounded shadow" alt="hero image">
      <div>
        <h2>${heading}</h2>
        <p class="lead">${paragraph}</p>
      </div>
    </section>`;
};
```
<br>

### 2.  Provide component data (optional)

**`_data/heroSection.json`**
```json
{
  "heading": "Blazing‑fast static sites",
  "paragraph": "Write HTML, sprinkle placeholders – we’ll handle the rest.",
  "image": "/public/img/hero.jpg"
}
```
> <br> **Asset paths**: always start paths with **`/public/`** inside `.json` data files, components `.js` files and any public assets like `.js` scripts or `.css` styles.  The builder rewrites them to the correct relative URL no matter where the final page ends up.<br><br>For example, if a page using our `<!-- heroSection -->` relies under `/_pages/blog/post/index.html` the rendered `<img src=` would be `"../../public/img/hero.jpg"` <br><br>

<br>

### 3.  Map components ⇒ placeholders

**`componentsMap.js`**
```js
module.exports = [
  {
    placeholder: "<!-- header -->",   // how you’ll reference it in HTML
    dataFile:    "",                  // empty string → no dataFile
    component:   "header.js"          // relative to /_components
  },
  {
    placeholder: "<!-- heroSection -->",
    dataFile:    "heroSection.json",  // relative to /_data
    component:   "heroSection.js"
  }
];
```
<br>

### 4. Write the page using placeholders

**`_pages/index.html`**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MySite ‑ Home</title>
    <link rel="stylesheet" href="/public/css/style.css">
  </head>
  <body class="container py-4">

    <!-- header -->

    <!-- heroSection -->

    <footer class="mt-5 small text-muted text-center">Built with placeholder‑framework 🧩</footer>
  </body>
</html>
```
<br>

### 5.  Add assets

* Put **every** image/CSS/JS asset somewhere under **`/public`**.  When the site is built, the entire `public` folder is copied as‑is to `<buildFolder>/public`.
* Refer to an asset with an **absolute path** that starts with `/public/…`.
  *In our JSON above we used `/public/img/hero.jpg`; in the page we included `/public/css/style.css`.*
<br>

### 6.  Build & preview

```bash
placeholder-framework build .
# open build/<name>/index.html in your browser
```

That’s it!  The builder:
1. Replaces `<!-- header -->` + `<!-- heroSection -->` with rendered HTML.
2. Parses `heroSection.json` and passes it to `heroSection.js`.
3. Copies `/public` alongside the pages and rewrites asset URLs so they stay correct.

Feel free to add more pages under `/_pages` and more components/data/mappings as you grow.
<br>

---

## 🛠️  CLI commands

| Command | Description |
|---------|-------------|
| `placeholder-framework create <dir>` | Scaffold a new project in `<dir>`. |
| `placeholder-framework build <dir>` | One‑off build into `/build/<name>`. |
| `placeholder-framework watch <dir>` | Watch for changes & rebuild. |

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
3. Finally, it wipes the previous build and creates a new one, copying the `/public` folder to it.

Everything happens with plain Node APIs — no heavy bundlers!

---

## 📝  License

Apache 2.0 © 2025 `placeholder-framework` contributors
