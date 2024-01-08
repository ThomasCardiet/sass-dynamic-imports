#!/usr/bin/env node

const chokidar = require("chokidar");
const sassCompiler = require("../lib/index.js");
const fs = require("fs");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { separator } = require("../utils/platforms");
const { WATCH_EVENT } = require("../utils/watch");
const { verifyDynamicImport } = require("../utils/dynamic-files");
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

    return paths.map((globPath) =>
        path.resolve(path.dirname(source), globPath)
    );
}

function getDynamicFolderRoot(globPaths) {
    return globPaths.map((path) => {
        return path
            .split(separator)
            .filter((param) => {
                return !param.includes("*");
            })
            .join(separator);
    });
}

function initializeWatcher() {
    try {
        const fileContent = fs.readFileSync(source, "utf8");
        const globPaths = getGlobPathsFromImports(fileContent);

        const rootDynamicFolders = getDynamicFolderRoot(globPaths);

        const watcher = chokidar.watch([source, ...rootDynamicFolders], {
            persistent: true,
        });

        watcher.on("all", (event, filePath) => {
            if (!/\.(scss|sass)$/.test(filePath)) return;

            // If filePath is not source && verify if filePath respect dynamic import
            const isDynamicImport = verifyDynamicImport({
                source,
                filePath,
                rootDynamicFolders,
                globPaths,
            });

            if (!isDynamicImport) return;

            console.log(`Event ${event} detected on file ${filePath}`);

            compile();

            if (Object.values(WATCH_EVENT).includes(event)) {
                watcher.unwatch(rootDynamicFolders);
                const newFileContent = fs.readFileSync(source, "utf8");
                const newGlobPaths = getGlobPathsFromImports(newFileContent);
                const newRooDynamicFolders = getDynamicFolderRoot(newGlobPaths);

                watcher.add(newRooDynamicFolders);
            }
        });

        console.log(`Monitoring ${source} and global imports.`);
        return watcher;
    } catch (error) {
        console.error(`Error initializing watcher: ${error.message}`);
    }
}

initializeWatcher();
