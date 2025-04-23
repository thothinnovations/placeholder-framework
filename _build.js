/* ---------------------------------------------------------------------------------
 *  – Reads the `componentsMap` array; e.g.
 *    [
 *       { 
 *          placeholder : '<!-- hero -->', 
 *          dataFile : '...', 
 *          component : require(...) 
 *       },
 *    ]
 * 
 *  – Builds static pages by swapping the HTML comment placeholders for the rendered
 *    components, then writes prettified output into ../buildPath 
 * 
 *  – Optionally, cleans / copies public assets when invoked with “node _build.js clean”
 * --------------------------------------------------------------------------------- */
// js:
const fs = require('fs');
const path = require('path');

// dependencies:
const { html: beautifyHtml } = require('js-beautify');
const project = _loadPlaceholderFramework();
const componentsMap = _loadComponentsMap();

/* ------------------------------------------------------------------ */
/* 1. LOAD THE COMPONENTS MAP & BUILD A QUICK LOOK‑UP */
/* ------------------------------------------------------------------ */

// Load the caller's `package.json` file:
function _loadPlaceholderFramework() {
  const pkg = require(path.join(process.cwd(), 'package.json'));
  
  if (!pkg.placeholderFramework) {
    throw new Error(`
    ERROR: the "placeholderFramework" entry is not defined in your 'package.json' file:\n
        "placeholderFramework": {
          "buildFolder": "getmypage"
        }
    `);
  }
  return pkg.placeholderFramework;
}

// Load the user's `componentsMap.js` containing `[{ placeholder, dataFile, component }, ...]`
function _loadComponentsMap() {
  const path = require('path');
  const cwd = process.cwd();
  const noData = path.join(__dirname, '_empty.json');  // .json containing just `{}`

  return (require(path.join(cwd, 'componentsMap.js'))).map(
    ({ placeholder, dataFile, component }) => {

      return ({
        placeholder: placeholder,
        dataFile: (dataFile === "") ? noData 
                                    : path.join(cwd, '_data', dataFile),
        component: require(
          path.join(cwd, '_components', component)
        )
      });

    }
  );
}


/** @type {Record<string, {placeholder:string,dataFile:string,component:Function}>} */
const componentsByName = {};

// normalise  '<!-- someName -->'  →  'someName'
componentsMap.forEach(cfg => {
  const key = cfg.placeholder.replace(/<!--\s*|\s*-->/g, '').trim();
  componentsByName[key] = cfg;
});


/* ---------------------------------------------- */
/* 2.  MAIN BUILD ROUTINE                         */
/* ---------------------------------------------- */
(function main () {
  const pagesDir = './_pages';
  const buildDir = path.join('.', '..', project.buildFolder);

  if (process.argv[2] === 'clean') {
    _cleanAndCopyPublic(buildDir);
  }

  const htmlFiles = _gatherHtmlFilesRecursively(pagesDir);
  if (htmlFiles.length === 0) {
    console.warn(`No HTML files found in ${pagesDir} to build.`);
    return;
  }

  const pagesToBuild = htmlFiles.map(file => ({
    template : file,
    output   : path.join(buildDir, path.relative(pagesDir, file)),
  }));

  Promise.all(pagesToBuild.map(_buildPage))
    .then(() => console.log('All pages built successfully!\n'))
    .catch(err => console.error('Build failed:', err));
})();



/* ------------------------------------------------------------------------------------ */
/* 3.  HELPER FUNCTIONS                                                                 */
/* ------------------------------------------------------------------------------------ */

/**
 * Removes the target build directory, recreates it, and copies the local "./public"
 * folder into it. Then fixes references in relevant assets.
 * @param {string} buildDir - The absolute path of the build directory to reset.
 */
function _cleanAndCopyPublic(buildDir) {
  try {
    if (fs.existsSync(buildDir)) {
      fs.rmSync(buildDir, { recursive: true, force: true });
    }
    fs.mkdirSync(buildDir, { recursive: true });
    const publicSource = path.join('.', 'public');
    const publicDest = path.join(buildDir, 'public');
    // Note: fs.cpSync is supported in Node 16+.
    fs.cpSync(publicSource, publicDest, { recursive: true });
    console.log(`\n"${buildDir}" was fully cleaned:\nAll public files were copied again into it.`);

    // Now fix references in all .html, .js, .json, .css files inside "publicDest"
    _fixAssetReferencesRecursively(publicDest, buildDir);

  } catch (err) {
    console.error('Error during clean/copy:', err);
    process.exit(1);
  }
}


/**
 * Recursively scans a directory to find all .html files.
 * @param {string} dir - The directory to scan.
 * @param {string[]} [fileList=[]] - An internal accumulator for file paths.
 * @returns {string[]} An array of absolute paths to each .html file found.
 */
function _gatherHtmlFilesRecursively(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      _gatherHtmlFilesRecursively(fullPath, fileList);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}


/**
 * Recursively fixes `/public/...` references in all .html, .js, .json, and .css files
 * under the given directory. For each file, we compute how "deep" the file is
 * from the root of the buildDir (so we know how many `../` to prepend).
 *
 * @param {string} dir - The directory to process (typically the newly copied "public" folder).
 * @param {string} buildDir - The root of the build directory (used to compute relative depth).
 */
function _fixAssetReferencesRecursively(dir, buildDir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Recurse into subfolders
      _fixAssetReferencesRecursively(fullPath, buildDir);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.html', '.js', '.json', '.css'].includes(ext)) {
        let fileContents = fs.readFileSync(fullPath, 'utf8');

        // e.g. path.relative(buildDir, /some/path/to/build/public/subdir) = 'public/subdir'
        const relativePath = path.relative(buildDir, path.dirname(fullPath));
        // Count segments
        const numSegments = relativePath ? relativePath.split(path.sep).length : 0;
        // e.g. 2 => ../../public
        const upToPublic = '../'.repeat(numSegments) + 'public';

        // Replace /public/... with relative path
        fileContents = fileContents.replace(/(["'\(])\/public\//g, `$1${upToPublic}/`);

        fs.writeFileSync(fullPath, fileContents, 'utf8');
      }
    }
  });
}


/**
 * Builds a single page by replacing each <!-- placeholder --> with its rendered
 * component, then prettifies & writes the resulting HTML.
 */
function _buildPage ({ template, output }) {
  return new Promise((resolve, reject) => {
    fs.readFile(template, 'utf8', (err, htmlTemplate) => {
      if (err) return reject(`Error reading template: ${template}\n${err}`);

      let finalHTML = htmlTemplate;
      const commentRegex = /<!--\s*([A-Za-z0-9_]+)\s*-->/g;
      /** @type {{fullComment:string, placeholderName:string}[]} */
      const matches = [];

      let m;
      while ((m = commentRegex.exec(htmlTemplate)) !== null) {
        matches.push({ fullComment: m[0], placeholderName: m[1] });
      }

      const tasks = matches.map(({ fullComment, placeholderName }) => {
        const cfg = componentsByName[placeholderName];
        if (!cfg) return Promise.resolve();            // unknown placeholder → ignore

        return new Promise((res, rej) => {
          fs.readFile(cfg.dataFile, 'utf8', (e2, data) => {
            if (e2)  return rej(`Error reading dataFile for "${placeholderName}":\n${e2}`);

            let json;
            try   { json = JSON.parse(data); }
            catch (pe) { return rej(`Invalid JSON for "${placeholderName}":\n${pe}`); }

            const html = cfg.component(json);
            finalHTML  = finalHTML.replace(fullComment, html);
            res();
          });
        });
      });
      /* ============================================================= */

      Promise.all(tasks)
        .then(() => {
          finalHTML = beautifyHtml(finalHTML, { indent_size: 2, preserve_newlines: true });

          // adjust /public/ paths relative to output location
          const buildDir = path.join('.', '..', project.buildFolder);
          const depth    = path.relative(buildDir, path.dirname(output))
                             .split(path.sep)
                             .filter(Boolean).length;
          const relPublic = '../'.repeat(depth) + 'public';
          finalHTML = finalHTML.replace(/(["'\(])\/public\//g, `$1${relPublic}/`);

          fs.mkdir(path.dirname(output), { recursive: true }, dirErr => {
            if (dirErr) return reject(`Error creating output dir: ${dirErr}`);
            fs.writeFile(output, finalHTML, 'utf8', writeErr => {
              if (writeErr) return reject(`Error writing "${output}":\n${writeErr}`);
              resolve();
            });
          });
        })
        .catch(reject);
    });
  });
}
