#!/usr/bin/env node

const chokidar = require("chokidar");
const sassCompiler = require("./sass-compiler");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

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
    const fileContent = fs.readFileSync(source, "utf8");
    const globPaths = getGlobPathsFromImports(fileContent);

    const watcher = chokidar.watch([source, ...globPaths], {
        persistent: true,
    });

    watcher.on("all", (event, filePath) => {
        const regex = /\.scss$/;

        if (!regex.test(filePath)) return;

        console.log(`Event ${event} detected on file ${filePath}`);
        compile();

        if (
            ["add", "unlink", "addDir", "unlinkDir"].includes(event) &&
            filePath.match(/\.(scss|sass)$/)
        ) {
            watcher.unwatch(globPaths);
            const newGlobPaths = getGlobPathsFromImports(
                fs.readFileSync(source, "utf8")
            );
            watcher.add(newGlobPaths);
        }
    });

    return watcher;
}

const watcher = initializeWatcher();

console.log(`Monitoring ${source} and global imports.`);
