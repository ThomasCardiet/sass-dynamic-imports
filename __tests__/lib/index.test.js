jest.mock("fs");
jest.mock("sass");
jest.mock("../../utils/css-format", () => ({
    formatCss: jest.fn((css) => css),
}));
jest.mock("dotenv", () => ({
    config: jest.fn(),
}));

const sass = require("sass");
const fs = require("fs");
const { compileFile } = require("../../lib/index");
const { formatCss } = require("../../utils/css-format");
const dotenv = require("dotenv");

describe("compileFile function", () => {
    dotenv.config.mockImplementation(() => {});

    beforeAll(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should compile SASS to CSS successfully", (done) => {
        const source = "path/to/source.scss";
        const destination = "path/to/destination.css";
        const mockCss = "body { color: red; }";

        sass.render.mockImplementation((options, callback) => {
            expect(options.file).toBe(source);
            callback(null, { css: mockCss });
        });

        fs.writeFile.mockImplementation((dest, data, callback) => {
            expect(dest).toBe(destination);
            expect(data).toBe(mockCss);
            callback(null);
        });

        compileFile(source, destination);

        expect(formatCss).toHaveBeenCalledWith(mockCss);

        process.nextTick(() => {
            expect(fs.writeFile).toHaveBeenCalled();
            done();
        });
    });

    it("should handle SASS compilation errors", (done) => {
        const source = "path/to/source.scss";
        const destination = "path/to/destination.css";
        const mockError = new Error("SASS compilation failed");

        sass.render.mockImplementation((options, callback) => {
            expect(options.file).toBe(source);
            callback(mockError, null);
        });

        compileFile(source, destination);

        process.nextTick(() => {
            expect(console.error).toHaveBeenCalledWith(
                `Error compiling SASS : ${mockError}`
            );
            done();
        });
    });

    it("should handle errors when writing CSS to file", (done) => {
        const source = "path/to/source.scss";
        const destination = "path/to/destination.css";
        const mockCss = "body { color: red; }";
        const mockError = new Error("Writing CSS failed");

        sass.render.mockImplementation((options, callback) => {
            callback(null, { css: mockCss });
        });

        fs.writeFile.mockImplementation((dest, data, callback) => {
            callback(mockError);
        });

        compileFile(source, destination);

        process.nextTick(() => {
            expect(console.error).toHaveBeenCalledWith(
                `Error writing CSS : ${mockError}`
            );
            done();
        });
    });
    afterAll(() => {
        console.error.mockRestore();
    });
});
