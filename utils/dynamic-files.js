const { separator } = require("./platforms");
const { formatPathSlashs } = require("./paths");

const getNbDynamicPathFiles = ({ url, separator = "/" }) => {
    return url.split(separator).filter((path) => path === "**").length;
};

const verifyDynamicImport = ({
    source,
    filePath,
    rootDynamicFolders,
    globPaths,
}) => {
    if (source !== formatPathSlashs(filePath)) {
        const fileFolderPath = filePath
            .split(separator)
            .slice(0, -1)
            .join(separator);
        const dynamicRootFindPath = rootDynamicFolders.find((path) => {
            return fileFolderPath.startsWith(path);
        });

        if (!dynamicRootFindPath) return;

        const dynamicFindPath = globPaths.find((path) => {
            return path.startsWith(dynamicRootFindPath);
        });

        if (!dynamicFindPath) return;

        const nbDynamicPathFiles = getNbDynamicPathFiles({
            url: dynamicFindPath,
            separator,
        });

        const lastDynamicFolder = dynamicRootFindPath.split(separator).pop();

        const lastDynamicFolderIndex = filePath
            .split(separator)
            .indexOf(lastDynamicFolder);

        const isValid =
            filePath
                .split(separator)
                .slice(
                    lastDynamicFolderIndex,
                    filePath.split(separator).length - 1
                )
                .filter((path) => path !== lastDynamicFolder).length ===
            nbDynamicPathFiles;

        if (!isValid) return false;
    }

    return true;
};

module.exports = {
    getNbDynamicPathFiles,
    verifyDynamicImport,
};
