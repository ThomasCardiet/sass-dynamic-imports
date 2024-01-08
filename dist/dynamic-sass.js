#!/usr/bin/env node

const chokidar = require("chokidar");
const sassCompiler = require("../lib/index.js");
const fs = require("fs");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

const WATCH_EVENT = {
    ADD: "add",
    UNLINK: "unlink",
    ADD_DIR: "addDir",
    UNLINK_DIR: "unlinkDir",
};

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
            .split("/")
            .filter((param) => {
                return !param.includes("*");
            })
            .join("/");
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
            if (source !== filePath) {
                const fileFolderPath = filePath
                    .split("/")
                    .slice(0, -1)
                    .join("/");
                const dynamicRootFindPath = rootDynamicFolders.find((path) => {
                    return fileFolderPath.startsWith(path);
                });

                if (!dynamicRootFindPath) return;

                const dynamicFindPath = globPaths.find((path) => {
                    return path.startsWith(dynamicRootFindPath);
                });

                if (!dynamicFindPath) return;

                const nbDynamicPathFiles = dynamicFindPath
                    .split("/")
                    .filter((path) => path === "**").length;

                const lastDynamicFolder = dynamicRootFindPath.split("/").pop();

                const lastDynamicFolderIndex = filePath
                    .split("/")
                    .indexOf(lastDynamicFolder);

                const isValid =
                    filePath
                        .split("/")
                        .slice(
                            lastDynamicFolderIndex,
                            filePath.split("/").length - 1
                        )
                        .filter((path) => path !== lastDynamicFolder).length ===
                    nbDynamicPathFiles;

                if (!isValid) return;
            }

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
