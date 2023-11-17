#!/usr/bin/env node

const chokidar = require("chokidar");
const sassCompiler = require("./sass-compiler");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

// Parse les chemins d'entrée et de sortie
const [source, destination] = argv.watch.split(":");

// Fonction pour compiler le SASS
function compile() {
    sassCompiler.compileFile(source, destination);
}

// Fonction pour lire et extraire les chemins de globbing des déclarations @import
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

// Fonction pour initialiser l'observateur de fichiers
function initializeWatcher() {
    const fileContent = fs.readFileSync(source, "utf8");
    const globPaths = getGlobPathsFromImports(fileContent);

    // Initialise chokidar avec le chemin de base et les motifs de globbing extraits
    const watcher = chokidar.watch([source, ...globPaths], {
        persistent: true,
    });

    // Événement pour les changements, les ajouts et les suppressions de fichiers
    watcher.on("all", (event, filePath) => {
        const regex = /\.scss$/;

        if (!regex.test(filePath)) return;

        console.log(`Événement ${event} détecté pour le fichier ${filePath}`);
        compile();

        // Si un fichier est ajouté ou supprimé, réanalyser et mettre à jour l'observateur
        if (
            ["add", "unlink", "addDir", "unlinkDir"].includes(event) &&
            filePath.match(/\.(scss|sass)$/)
        ) {
            watcher.unwatch(globPaths); // Retirer les anciens chemins
            const newGlobPaths = getGlobPathsFromImports(
                fs.readFileSync(source, "utf8")
            );
            watcher.add(newGlobPaths); // Ajouter les nouveaux chemins
        }
    });

    return watcher;
}

// Appeler la fonction pour initialiser l'observateur de fichiers
const watcher = initializeWatcher();

console.log(`Surveillance de ${source} et des imports globaux.`);
