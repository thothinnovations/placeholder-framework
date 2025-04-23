#!/usr/bin/env node
const path     = require("path");
const {spawn, spawnSync} = require("child_process");
const inquirer = require("inquirer");
const fs       = require("fs-extra");
const yargs    = require("yargs/yargs");
const {hideBin}= require("yargs/helpers");

const PKG_ROOT = path.dirname(__filename);          // where the CLI itself lives
const BUILD_JS = path.join(PKG_ROOT, "_build.js");  // absolute path to _build.js
const EMPTY    = path.join(PKG_ROOT, "_empty.json");
const TEMPLATE = path.join(PKG_ROOT, "starter-template");

yargs(hideBin(process.argv))
  .scriptName("placeholder-framework")
  .command("create <targetDir>", "scaffold a new build folder", y=>y, create)
  .command("build <folder>",   "single build",         y=>y.option("dirty",{type:"boolean"}), build)
  .command("watch <folder>",   "watch & rebuild",      y=>y.option("dirty",{type:"boolean"}), watch)
  .demandCommand()
  .help()
  .argv;

/* -------------------------------------------------------------------------- */

async function create({targetDir}) {
  /* 1. Ask the two initial questions */
  const {useTpl, buildName} = await inquirer.prompt([
    {type:"confirm", name:"useTpl", message:"Do you want to use the starter template?", default:true},
    {type:"input",   name:"buildName", message:"Enter a name for your build:", validate:s=>s.trim()!==""}
  ]);

  const absTarget = path.resolve(targetDir);
  await fs.ensureDir(absTarget);

  /* 2. Copy / scaffold ---------------------------------------------------- */
  if (useTpl) {
    await fs.copy(TEMPLATE, absTarget, {recursive:true});
  } else {
    await fs.ensureDir(path.join(absTarget,"public"));
    await fs.ensureDir(path.join(absTarget,"_components"));
    await fs.ensureDir(path.join(absTarget,"_data"));
    await fs.ensureDir(path.join(absTarget,"_pages"));
    await fs.writeFile(path.join(absTarget,"_pages","index.html"),"");
    await fs.writeFile(path.join(absTarget,"componentsMap.js"), COMPONENTS_MAP_TEMPLATE);
  }

  /* 3. package.json inside the new folder --------------------------------- */
  const localPkg = {
    devDependencies:{ "placeholder-framework":"^1.0.0" },
    scripts:{ [`watch:${path.basename(absTarget)}`]: "placeholder-framework watch ." },
    placeholderFramework:{ buildFolder: buildName }
  };
  await fs.writeJson(path.join(absTarget,"package.json"), localPkg, {spaces:2});

  /* 4. Optional VS Code support ------------------------------------------ */
  const {useVSCode} = await inquirer.prompt([
    {type:"confirm", name:"useVSCode", message:"Are you using VS Code?", default:true}
  ]);

  if (useVSCode) {
    const vscodeDir = path.join(
      path.resolve(absTarget, '..'), 
      ".vscode"
    ); 
    await fs.ensureDir(vscodeDir);

    /* tasks.json */
    
    const taskPath  = path.join(vscodeDir, "tasks.json");
    const newTask   = {
      label: `[placeholder-framework]: "/${buildName}" from... "${path.basename(absTarget)}"`,
      type : "shell",
      command: `npm run watch:${path.basename(absTarget)}`,
      options: { cwd: "${workspaceFolder}/" + path.basename(absTarget) },
      problemMatcher: []
    };

    /** merge — don’t overwrite */
    let tasksJson = {};
    if (await fs.pathExists(taskPath)) {
      tasksJson = await fs.readJson(taskPath);
    }
    tasksJson.version = tasksJson.version || "2.0.0";
    tasksJson.tasks   = tasksJson.tasks   || [];

    /* update-or-append by `label` */
    tasksJson.tasks = tasksJson.tasks.filter(t => t.label !== newTask.label);
    tasksJson.tasks.push(newTask);

    await fs.writeJson(taskPath, tasksJson, { spaces: 2 });

    /* settings.json – merge if it exists */
    const settingsPath = path.join(vscodeDir,"settings.json");
    let settings = {};
    if (await fs.pathExists(settingsPath)) settings = await fs.readJson(settingsPath);
    settings["liveServer.settings.port"] = 3000;
    settings["liveServer.settings.root"] = "/"+buildName;
    await fs.writeJson(settingsPath, settings, {spaces:2});
  }

  console.log(`\n✅  “${path.basename(absTarget)}” was successfully created!`);

  console.log(`
Next steps:
  cd ${targetDir}
  # Build once:
  npx placeholder-framework build .          # or add --dirty
  # Watch during development:
  npx placeholder-framework watch .          # or add --dirty
  `);
}

/* -------------------------------------------------------------------------- */

function build({folder, dirty}) {
  const cwd = path.resolve(folder);
  const args = [BUILD_JS].concat(dirty ? [] : ["clean"]);
  const {status} = spawnSync("node", args, {stdio:"inherit", cwd});
  process.exit(status);
}

function watch({folder, dirty}) {
  const cwd     = path.resolve(folder);
  
  // run the _build.js that ships with placeholder-framework
  const execCmd = dirty
      ? `node "${BUILD_JS}"`
      : `node "${BUILD_JS}" clean`;
  
  // absolute path to the nodemon CLI that ships with placeholder-framework
  const nodemonCli = require.resolve("nodemon/bin/nodemon.js");
  
  /** launch: <node> <nodemon.js> --watch . --ext * --exec "<execCmd>" --verbose */
  const child = spawn(
    process.execPath,                       // the same Node that runs your CLI
    [nodemonCli, "--watch", ".", "--ext", "*",
     "--exec", execCmd, "--verbose"],
    { stdio: "inherit", cwd }
  );
  
  child.on("error", err => {
    console.error("Unable to start nodemon:", err);
    process.exit(1);
  });
}

/* -------------------------------------------------------------------------- */

const COMPONENTS_MAP_TEMPLATE = `
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// => How to map a component:                            // MEANING:
//
//     {
//       placeholder: "<!-- anotherComponent -->",       => how you call the component from any '.html' under '/_pages'
//       dataFile: "anotherData.json",                   => the component's '.json' data under '/_data'
//       component: "anotherComponent.js"                => the component's '.js' file under '/_components'
//     },
//
//
// => If your component requires no data or have default values, set it like this: 
//
//     {
//       placeholder: "<!-- homeHead -->",       
//       dataFile: "",                                   => set 'dataFile' with an empty string
//       component: "/head/home.js"                
//     },
//
// 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = [

]
`;
