jest.mock("path");
jest.mock("glob");
jest.mock("../../utils/platforms", () => ({
    separator: "/",
}));
jest.mock("../../utils/dynamic-files", () => ({
    getNbDynamicPathFiles: jest.fn(),
}));
jest.mock("../../utils/paths", () => ({
    formatPathSlashs: jest.fn((path) => path),
}));

const path = require("path");
const glob = require("glob");
const globImporter = require("../../lib/glob-importer");
const { getNbDynamicPathFiles } = require("../../utils/dynamic-files");
const { formatPathSlashs } = require("../../utils/paths");

describe("globImporter function", () => {
    beforeEach(() => {
        path.resolve.mockImplementation((...args) => args.join("/"));
        path.dirname.mockImplementation((p) => p);
    });

    it("should return null if no glob pattern is found in URL", () => {
        const url = "file.scss";
        const prev = "./";
        expect(globImporter(url, prev)).toBeNull();
    });

    it("should resolve glob patterns and return SASS imports", () => {
        const url = "**/*.scss";
        const prev = "./";
        const mockFiles = ["path/to/file1.scss", "path/to/file2.scss"];

        glob.sync.mockImplementation(() => mockFiles);
        formatPathSlashs.mockImplementation((path) => path);
        getNbDynamicPathFiles.mockImplementation(() => 1);

        const result = globImporter(url, prev);

        expect(result).not.toBeNull();

        const expectedSassImports = mockFiles
            .map((file) => `@import "${file}";`)
            .join("\n");
        expect(result.contents).toBe(expectedSassImports);
    });

    it("should filter out files that do not match the number of dynamic paths", () => {
        const url = "components/**/*.scss";
        const prev = "./";
        const mockFiles = [
            "components/file1.scss",
            "components/nested/file2.scss",
        ];

        glob.sync.mockImplementation(() => mockFiles);
        formatPathSlashs.mockImplementation((path) => path);
        getNbDynamicPathFiles.mockImplementation(() => 1);

        const result = globImporter(url, prev);

        const expectedSassImports = `@import "components/nested/file2.scss";`;
        expect(result.contents).toBe(expectedSassImports);
    });
});
