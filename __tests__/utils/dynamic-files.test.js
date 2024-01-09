const {
    getNbDynamicPathFiles,
    verifyDynamicImport,
} = require("../../utils/dynamic-files");
const { formatPathSlashs } = require("../../utils/paths");

jest.mock("../../utils/platforms", () => ({
    separator: "/",
}));

jest.mock("../../utils/paths", () => ({
    formatPathSlashs: jest.fn(),
}));

describe("dynamic-files utility functions", () => {
    describe("getNbDynamicPathFiles", () => {
        it("counts the number of dynamic path segments", () => {
            const url = "path/**/to/**/file.scss";
            const count = getNbDynamicPathFiles({ url });
            expect(count).toBe(2);
        });
    });

    describe("verifyDynamicImport", () => {
        it("verifies a valid dynamic import", () => {
            formatPathSlashs.mockImplementation((filePath) => filePath);
            const source = "path/to/source.scss";
            const filePath = "path/to/source.scss";
            const rootDynamicFolders = ["path/to"];
            const globPaths = ["path/to/**"];
            const isValid = verifyDynamicImport({
                source,
                filePath,
                rootDynamicFolders,
                globPaths,
            });
            expect(isValid).toBe(true);
        });

        it("rejects an invalid dynamic import", () => {
            formatPathSlashs.mockImplementation((filePath) => filePath);
            const source = "source.scss";
            const filePath = "unrelated/path/source.scss";
            const rootDynamicFolders = ["path/to"];
            const globPaths = ["path/to/**"];
            const isValid = verifyDynamicImport({
                source,
                filePath,
                rootDynamicFolders,
                globPaths,
            });
            expect(isValid).toBe(false);
        });
    });
});
