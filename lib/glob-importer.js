const path = require("path");
const glob = require("glob");

module.exports = function globImporter(url, prev) {
    if (!glob.hasMagic(url)) {
        return null;
    }

    const baseDir = prev === "stdin" ? "." : path.dirname(prev);
    let files = glob.sync(path.resolve(baseDir, url));

    const nbDynamicPathFiles = url
        .split("/")
        .filter((path) => path === "**").length;

    const rootUrlFolder = url
        .split("/")
        .filter((path) => path !== "**")
        .slice(0, -1)
        .join("/");

    files = files.filter((file) => {
        const rootFolderIndex = file
            .split("/")
            .indexOf(
                rootUrlFolder.split("/")[rootUrlFolder.split("/").length - 1]
            );
        const dynamicFolders = file.split("/").slice(rootFolderIndex + 1, -1);
        return dynamicFolders.length === nbDynamicPathFiles;
    });

    const sassImports = files
        .map((file) => {
            return `@import "${file}";`;
        })
        .join("\n");

    return { contents: sassImports };
};
