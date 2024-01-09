jest.mock("sass");
jest.mock("fs");
jest.mock("../../utils/css-format", () => ({
    formatCss: jest.fn((css) => css),
}));

const sass = require("sass");
const fs = require("fs");
const { compileFile } = require("../../lib/index");
const { formatCss } = require("../../utils/css-format");

describe("SASS compilation integration", () => {
    const source = "path/to/source.scss";
    const destination = "path/to/destination.css";
    const mockSassContent = ".example { color: blue; }";
    const mockCssContent = ".example { color: blue; }";

    beforeAll(() => {
        sass.render.mockImplementation((options, callback) => {
            callback(null, { css: mockSassContent });
        });

        fs.writeFile.mockImplementation((dest, data, callback) => {
            callback(null);
        });
    });

    it("should invoke sass.render with the correct parameters", () => {
        compileFile(source, destination);

        expect(sass.render).toHaveBeenCalledWith(
            expect.objectContaining({ file: source }),
            expect.any(Function)
        );
    });

    it("should write the formatted CSS to the specified destination", (done) => {
        formatCss.mockImplementation((css) => css);
        compileFile(source, destination);

        process.nextTick(() => {
            expect(fs.writeFile).toHaveBeenCalledWith(
                destination,
                mockCssContent,
                expect.any(Function)
            );
            done();
        });
    });

    it("should handle and log errors in sass.render", (done) => {
        const error = new Error("SASS compilation error");
        sass.render.mockImplementationOnce((options, callback) => {
            callback(error, null);
        });

        console.error = jest.fn();

        compileFile(source, destination);

        process.nextTick(() => {
            expect(console.error).toHaveBeenCalledWith(
                `Error compiling SASS : ${error}`
            );
            done();
        });
    });

    it("should handle and log errors in fs.writeFile", (done) => {
        sass.render.mockImplementationOnce((options, callback) => {
            callback(null, { css: mockSassContent });
        });
        const error = new Error("File write error");
        fs.writeFile.mockImplementationOnce((dest, data, callback) => {
            callback(error);
        });

        console.error = jest.fn();

        compileFile(source, destination);

        process.nextTick(() => {
            expect(console.error).toHaveBeenCalledWith(
                `Error writing CSS : ${error}`
            );
            done();
        });
    });
});
