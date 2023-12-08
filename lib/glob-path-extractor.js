const fs = require("fs");
const path = require("path");
const glob = require("glob");

exports.extractGlobPaths = function (entryFile) {
    const fileContent = fs.readFileSync(entryFile, "utf8");
    const importRegex = /@import\s+['"]([^'"]+)['"];/g;
    let pathsToWatch = [];
    let match;

    while ((match = importRegex.exec(fileContent)) !== null) {
        if (glob.hasMagic(match[1])) {
            const resolvedPath = path.resolve(
                path.dirname(entryFile),
                match[1]
            );
            pathsToWatch = pathsToWatch.concat(glob.sync(resolvedPath));
        }
    }

    return pathsToWatch;
};
