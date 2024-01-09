jest.mock("chokidar");
jest.mock("fs");
jest.mock("../../lib/index.js");

const chokidar = require("chokidar");
const fs = require("fs");
const sassCompiler = require("../../lib/index.js");

describe("dynamic-sass watcher", () => {
    const mockSource = "path/to/source.scss";
    const mockDestination = "path/to/destination.css";
    const mockFileContent = '@import "path/to/**/*.scss";';

    let initializeWatcher;

    beforeEach(() => {
        jest.resetModules();
        jest.resetAllMocks();

        // Mock fs and sassCompiler methods
        fs.readFileSync.mockImplementation(() => mockFileContent);
        sassCompiler.compileFile.mockImplementation(() => {});

        // Setup chokidar mock
        const watcher = {
            on: jest.fn(),
            unwatch: jest.fn(),
            add: jest.fn(),
        };
        chokidar.watch.mockReturnValue(watcher);

        // Mock process.argv
        jest.mock("process", () => ({
            argv: [
                "node",
                "dynamic-sass.js",
                "--watch",
                `${mockSource}:${mockDestination}`,
            ],
        }));

        // Require the module after mocking
        initializeWatcher =
            require("../../dist/dynamic-sass").initializeWatcher;
    });

    it("initializes the watcher successfully", () => {
        initializeWatcher();
        expect(chokidar.watch).toHaveBeenCalled();
    });

    it("compiles on appropriate watch events", () => {
        initializeWatcher();
        // Simulate a file change event
        chokidar.watch().on.mock.calls[0][1]("change", mockSource);
        expect(sassCompiler.compileFile).toHaveBeenCalledWith(
            mockSource,
            mockDestination
        );
    });

    // More tests as needed...
});
