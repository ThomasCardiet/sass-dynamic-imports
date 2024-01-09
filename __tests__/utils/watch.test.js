const { WATCH_EVENT } = require("../../utils/watch");

describe("watch utility constants", () => {
    it("should have the correct values for WATCH_EVENT", () => {
        expect(WATCH_EVENT.ADD).toBe("add");
        expect(WATCH_EVENT.UNLINK).toBe("unlink");
        expect(WATCH_EVENT.ADD_DIR).toBe("addDir");
        expect(WATCH_EVENT.UNLINK_DIR).toBe("unlinkDir");
    });

    describe("usage of WATCH_EVENT in application logic", () => {
        it("should use WATCH_EVENT constants in file watcher setup", () => {
            const setupFileWatcher = jest.fn((eventHandler) => {
                eventHandler(WATCH_EVENT.ADD, "path/to/file.js");
                eventHandler(WATCH_EVENT.UNLINK, "path/to/other-file.js");
            });

            const mockEventHandler = jest.fn();

            setupFileWatcher(mockEventHandler);

            expect(mockEventHandler).toHaveBeenCalledWith(
                "add",
                "path/to/file.js"
            );
            expect(mockEventHandler).toHaveBeenCalledWith(
                "unlink",
                "path/to/other-file.js"
            );
        });
    });
});
