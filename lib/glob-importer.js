const path = require("path");
const glob = require("glob");
const { separator } = require("../utils/platforms");
const { getNbDynamicPathFiles } = require("../utils/dynamic-files");
const { formatPathSlashs } = require("../utils/paths");

module.exports = function globImporter(url, prev) {
    if (!glob.hasMagic(url)) {
        return null;
    }

    const baseDir = prev === "stdin" ? "." : path.dirname(prev);
    let files = glob.sync(formatPathSlashs(path.resolve(baseDir, url)));

    const nbDynamicPathFiles = getNbDynamicPathFiles({
        url,
    });

    const rootUrlFolder = url
        .split("/")
        .filter((path) => path !== "**")
        .slice(0, -1)
        .join("/");

    files = files.filter((file) => {
        const rootFolderIndex = file
            .split(separator)
            .indexOf(
                rootUrlFolder.split("/")[rootUrlFolder.split("/").length - 1]
            );

        const dynamicFolders = file
            .split(separator)
            .slice(rootFolderIndex + 1, -1);
        return dynamicFolders.length === nbDynamicPathFiles;
    });

    if (files.length === 0) {
        return null;
    }
    const sassImports = files
        .map((file) => {
            return `@import "${formatPathSlashs(file)}";`;
        })
        .join("\n");

    return { contents: sassImports };
};
