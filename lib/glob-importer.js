const path = require("path");
const glob = require("glob");

module.exports = function globImporter(url, prev) {
    if (!glob.hasMagic(url)) {
        return null;
    }

    const baseDir = prev === "stdin" ? "." : path.dirname(prev);
    const files = glob.sync(path.resolve(baseDir, url));

    const sassImports = files
        .map((file) => {
            return `@import "${file}";`;
        })
        .join("\n");

    return { contents: sassImports };
};
