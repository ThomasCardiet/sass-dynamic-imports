const { formatPathSlashs } = require("../../utils/paths");

describe("paths utility functions", () => {
    describe("formatPathSlashs", () => {
        it("replaces backslashes with forward slashes", () => {
            const windowsPath = "path\\to\\file.scss";
            const formattedPath = formatPathSlashs(windowsPath);
            expect(formattedPath).toBe("path/to/file.scss");
        });

        it("does not alter path with forward slashes", () => {
            const unixPath = "path/to/file.scss";
            const formattedPath = formatPathSlashs(unixPath);
            expect(formattedPath).toBe(unixPath);
        });

        it("does not alter path without slashes", () => {
            const simplePath = "file.scss";
            const formattedPath = formatPathSlashs(simplePath);
            expect(formattedPath).toBe(simplePath);
        });
    });
});
