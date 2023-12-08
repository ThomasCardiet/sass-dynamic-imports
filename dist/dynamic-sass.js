#!/usr/bin/env node

const chokidar = require("chokidar");
const sassCompiler = require("../lib/index.js");
const fs = require("fs");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

if (!argv.watch || argv.watch.split(":").length !== 2) {
    throw new Error("Invalid watch parameter. Usage: source:destination");
}

const [source, destination] = argv.watch.split(":");

function compile() {
    sassCompiler.compileFile(source, destination);
}

function getGlobPathsFromImports(fileContent) {
    const importRegex =
        /@import\s+['"]((?:\.\.\/)*(?:[^'"]+\*{2}\/\*{2}\/)?[^'"]+\.scss)['"];/g;
    let matches;
    let paths = [];

    while ((matches = importRegex.exec(fileContent)) !== null) {
        paths.push(matches[1]);
    }

    paths = paths.map((path) => {
        return path
            .split("/")
            .filter((param) => {
                return !param.includes("*");
            })
            .join("/");
    });

    return paths.map((globPath) =>
        path.resolve(path.dirname(source), globPath)
    );
}

function initializeWatcher() {
    try {
        const fileContent = fs.readFileSync(source, "utf8");
        const globPaths = getGlobPathsFromImports(fileContent);

        const watcher = chokidar.watch([source, ...globPaths], {
            persistent: true,
        });

        watcher.on("all", (event, filePath) => {
            if (!/\.(scss|sass)$/.test(filePath)) return;
            console.log(`Event ${event} detected on file ${filePath}`);

            compile();

            if (["add", "unlink", "addDir", "unlinkDir"].includes(event)) {
                watcher.unwatch(globPaths);
                const newGlobPaths = getGlobPathsFromImports(
                    fs.readFileSync(source, "utf8")
                );
                watcher.add(newGlobPaths);
            }
        });

        console.log(`Monitoring ${source} and global imports.`);
        return watcher;
    } catch (error) {
        console.error(`Error initializing watcher: ${error.message}`);
    }
}

initializeWatcher();
