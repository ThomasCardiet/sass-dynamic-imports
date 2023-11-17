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
    const importRegex = /@import\s+['"]([^'"]+\*\*\/\*.scss)['"];/g;
    let matches;
    let paths = [];

    while ((matches = importRegex.exec(fileContent)) !== null) {
        paths.push(matches[1]);
    }

    return paths.map((globPath) =>
        path.resolve(path.dirname(source), globPath)
    );
}

// Fonction pour initialiser l'observateur de fichiers
function initializeWatcher() {
    const fileContent = fs.readFileSync(source, "utf8");
    let globPaths = getGlobPathsFromImports(fileContent);

    // Initialise chokidar avec le chemin de base et les motifs de globbing extraits
    const watcher = chokidar.watch([source, ...globPaths], {
        persistent: true,
    });

    // Événement pour les changements, les ajouts, les suppressions de fichiers et de dossiers
    watcher.on("all", (event, filePath) => {
        console.log(`Événement ${event} détecté pour le fichier ${filePath}`);
        compile();

        // Si un fichier/dossier est ajouté ou supprimé, réanalyser et mettre à jour l'observateur
        if (["add", "unlink", "addDir", "unlinkDir"].includes(event)) {
            const newGlobPaths = getGlobPathsFromImports(
                fs.readFileSync(source, "utf8")
            );
            const pathsToUnwatch = globPaths.filter(
                (p) => !newGlobPaths.includes(p)
            );
            const pathsToWatch = newGlobPaths.filter(
                (p) => !globPaths.includes(p)
            );

            // Mettre à jour les chemins surveillés
            if (pathsToUnwatch.length > 0) {
                watcher.unwatch(pathsToUnwatch);
            }
            if (pathsToWatch.length > 0) {
                watcher.add(pathsToWatch);
            }

            globPaths = newGlobPaths; // Mise à jour de la référence globPaths
        }
    });

    return watcher;
}

// Appeler la fonction pour initialiser l'observateur de fichiers
const watcher = initializeWatcher();

console.log(`Surveillance de ${source} et des imports globaux.`);
